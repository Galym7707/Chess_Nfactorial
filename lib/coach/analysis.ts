import { Chess } from "chess.js";
import { normalizeScoreForMover, type EngineAnalysis, type EngineLimit } from "@/lib/engine/stockfish";
import type { CoachIssue, CoachMoveClass, CoachReport } from "@/types/app";

type AnalyzeFen = (fen: string, limit?: EngineLimit) => Promise<EngineAnalysis>;

function classifyLoss(lossCp: number, bestMove: string | null, actualUci: string): CoachMoveClass {
  if (bestMove && actualUci.startsWith(bestMove.slice(0, 4)) && lossCp <= 25) return "best";
  if (lossCp <= 20) return "excellent";
  if (lossCp <= 55) return "good";
  if (lossCp <= 120) return "inaccuracy";
  if (lossCp <= 240) return "mistake";
  return "blunder";
}

function uciFromMove(move: { from: string; to: string; promotion?: string }) {
  return `${move.from}${move.to}${move.promotion ?? ""}`;
}

function explainMove(classification: CoachMoveClass, lossCp: number, san: string, bestMove: string, pv: string[]) {
  const severity = Math.round(lossCp);
  const pvText = pv.length ? ` Линия движка: ${pv.join(" ")}.` : "";
  if (classification === "blunder") {
    return `На ходе ${san} позиция просела примерно на ${severity} cp. Это похоже на рискованный refactor без тестов: идея может выглядеть активной, но позиция не выдерживает. Лучше было искать ${bestMove}.${pvText}`;
  }
  if (classification === "mistake") {
    return `Ход ${san} отдал инициативу и потерял темп. Лучшее продолжение — ${bestMove}, потому что оно сохраняет давление и не упрощает задачу сопернику.${pvText}`;
  }
  if (classification === "inaccuracy") {
    return `Ход ${san} неточен: потери небольшие, но структура решения хуже. Здесь стоило сыграть ${bestMove} и закончить развитие без лишних обязательств.${pvText}`;
  }
  if (classification === "best") return `Ход ${san} совпал с первой рекомендацией движка. Решение чистое.`;
  if (classification === "excellent") return `Ход ${san} почти не уступает лучшей линии и сохраняет план.`;
  return `Ход ${san} играбелен, но можно было точнее: ${bestMove}.${pvText}`;
}

export async function runCoachReview({
  pgn,
  userId,
  gameId,
  analyzeFen,
  maxPlies = 28,
}: {
  pgn: string;
  userId: string;
  gameId: string;
  analyzeFen: AnalyzeFen;
  maxPlies?: number;
}): Promise<CoachReport> {
  const replay = new Chess();
  if (pgn.trim()) replay.loadPgn(pgn);
  const moves = replay.history({ verbose: true });
  const cursor = new Chess();
  const issues: CoachIssue[] = [];
  const losses: number[] = [];
  const moveStats = {
    best: 0,
    excellent: 0,
    good: 0,
    inaccuracy: 0,
    mistake: 0,
    blunder: 0,
  };

  for (const [index, move] of moves.slice(0, maxPlies).entries()) {
    const beforeFen = cursor.fen();
    const actualUci = uciFromMove(move);
    const before = await analyzeFen(beforeFen, { depth: 8, movetime: 450, skill: 14 });
    cursor.move({ from: move.from, to: move.to, promotion: move.promotion });
    const after = await analyzeFen(cursor.fen(), { depth: 7, movetime: 350, skill: 14 });
    const lossCp = Math.max(0, normalizeScoreForMover(before, after));
    losses.push(lossCp);
    const classification = classifyLoss(lossCp, before.bestMove, actualUci);

    // Count move classifications
    moveStats[classification]++;

    if (["inaccuracy", "mistake", "blunder"].includes(classification)) {
      const best = before.bestMove ?? "улучшить развитие";
      issues.push({
        ply: index + 1,
        move: move.san,
        classification,
        lossCp: Math.round(lossCp),
        beforeEval: before.scoreCp,
        afterEval: -after.scoreCp,
        betterMove: best,
        pv: before.pv,
        explanation: explainMove(classification, lossCp, move.san, best, before.pv),
      });
    }
  }

  const averageLoss = losses.length ? losses.reduce((sum, loss) => sum + Math.min(loss, 320), 0) / losses.length : 0;
  const qualityScore = Math.max(1, Math.min(100, Math.round(100 - averageLoss / 3.2)));

  // Estimate FIDE rating based on quality
  const estimatedRating = Math.round(800 + (qualityScore * 20));

  // Analyze weaknesses
  const weaknesses: string[] = [];
  const blunderCount = moveStats.blunder;
  const mistakeCount = moveStats.mistake;
  const inaccuracyCount = moveStats.inaccuracy;

  if (blunderCount >= 2) {
    weaknesses.push("Тактическая внимательность: проверяйте угрозы соперника перед каждым ходом");
  }
  if (mistakeCount >= 3) {
    weaknesses.push("Позиционное понимание: работайте над оценкой долгосрочных планов");
  }
  if (inaccuracyCount >= 4) {
    weaknesses.push("Точность расчета: уделяйте больше времени на критических позициях");
  }
  if (moveStats.best + moveStats.excellent < moves.length * 0.3) {
    weaknesses.push("Поиск лучших ходов: решайте тактические задачи для улучшения расчета");
  }

  if (weaknesses.length === 0) {
    weaknesses.push("Продолжайте в том же духе! Работайте над углублением расчета вариантов");
  }

  const keyIssues = issues.sort((a, b) => b.lossCp - a.lossCp).slice(0, 5);
  const summary = keyIssues.length
    ? `Качество партии: ${qualityScore}/100. Примерный уровень игры: ${estimatedRating} FIDE. Главная зона роста — ${keyIssues[0]?.classification === "blunder" ? "тактическая безопасность" : "точность плана"}. Перед резкими ходами проверяйте короля, темп и лучший ответ соперника.`
    : `Качество партии: ${qualityScore}/100. Примерный уровень игры: ${estimatedRating} FIDE. Критических просадок в первых ${Math.min(maxPlies, moves.length)} полуходах не найдено.`;

  return {
    id: crypto.randomUUID(),
    game_id: gameId,
    user_id: userId,
    quality_score: qualityScore,
    summary,
    issues: keyIssues,
    created_at: new Date().toISOString(),
    estimated_rating: estimatedRating,
    weaknesses,
    move_stats: moveStats,
  };
}

export function buildFastSummary(result: string, opponent: string) {
  if (result === "1-0") return `Победа над ${opponent}: белые реализовали преимущество.`;
  if (result === "0-1") return `Партия против ${opponent}: черные забрали инициативу.`;
  if (result === "1/2-1/2") return `Ничья против ${opponent}: ресурс защиты найден.`;
  return `Партия против ${opponent} сохранена для review.`;
}