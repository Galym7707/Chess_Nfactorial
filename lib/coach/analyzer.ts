import { Chess } from "chess.js";
import { StockfishClient } from "@/lib/engine/stockfish";
import type { EngineAnalysis } from "@/lib/engine/stockfish";
import type { AnalyzedMove, GameAnalysis, AnalysisDepth } from "./types";
import { classifyMove, detectSacrifice, calculateAccuracy } from "./classifier";
import { generateCoachExplanation } from "./explanations";
import { DEPTH_SETTINGS } from "./types";

export type AnalysisProgress = {
  current: number;
  total: number;
  message: string;
};

/**
 * Анализирует всю партию с помощью Stockfish
 */
export async function analyzeGame(
  pgn: string,
  depth: AnalysisDepth = "balanced",
  onProgress?: (progress: AnalysisProgress) => void
): Promise<GameAnalysis> {
  const chess = new Chess();
  chess.loadPgn(pgn);

  const history = chess.history({ verbose: true });
  const engine = new StockfishClient();

  try {
    await engine.init();

    const analyzedMoves: AnalyzedMove[] = [];
    const depthValue = DEPTH_SETTINGS[depth];

    // Анализируем каждый ход
    for (let i = 0; i < history.length; i++) {
      const move = history[i];

      if (onProgress) {
        onProgress({
          current: i + 1,
          total: history.length,
          message: `Анализируем ход ${i + 1}/${history.length}...`,
        });
      }

      // Создаём позицию до хода
      const chessBefore = new Chess();
      for (let j = 0; j < i; j++) {
        chessBefore.move(history[j].san);
      }
      const fenBefore = chessBefore.fen();

      // Анализируем позицию до хода
      const analysisBefore = await engine.analyzeFen(fenBefore, { depth: depthValue });

      // Делаем ход
      chessBefore.move(move.san);
      const fenAfter = chessBefore.fen();

      // Анализируем позицию после хода
      const analysisAfter = await engine.analyzeFen(fenAfter, { depth: depthValue });

      // Нормализуем оценки (с точки зрения игрока, который сделал ход)
      const scoreBefore = move.color === "w" ? analysisBefore.scoreCp : -analysisBefore.scoreCp;
      const scoreAfter = move.color === "w" ? -analysisAfter.scoreCp : analysisAfter.scoreCp;

      // Вычисляем потерю centipawn
      const centipawnLoss = Math.max(0, scoreBefore - scoreAfter);

      // Определяем жертву
      const isSacrifice = detectSacrifice(fenBefore, fenAfter, scoreBefore, scoreAfter);

      // Классифицируем ход
      const classification = classifyMove(
        centipawnLoss,
        scoreBefore,
        scoreAfter,
        analysisBefore.bestMove,
        move.from + move.to + (move.promotion || ""),
        Math.floor(i / 2) + 1,
        isSacrifice
      );

      const analyzedMove: AnalyzedMove = {
        moveNumber: Math.floor(i / 2) + 1,
        color: move.color === "w" ? "white" : "black",
        san: move.san,
        uci: move.from + move.to + (move.promotion || ""),
        fenBefore,
        fenAfter,
        bestMove: analysisBefore.bestMove,
        scoreBefore,
        scoreAfter,
        centipawnLoss,
        classification,
        explanation: "",
        isSacrifice,
      };

      // Генерируем объяснение
      analyzedMove.explanation = generateCoachExplanation(analyzedMove);

      analyzedMoves.push(analyzedMove);
    }

    // Вычисляем точность
    const whiteAccuracy = calculateAccuracy(analyzedMoves, "white");
    const blackAccuracy = calculateAccuracy(analyzedMoves, "black");

    // Находим топ-3 критических момента
    const mistakes = analyzedMoves
      .filter((m) => m.classification === "blunder" || m.classification === "mistake" || m.classification === "missed-win")
      .sort((a, b) => b.centipawnLoss - a.centipawnLoss)
      .slice(0, 3)
      .map((m) => ({
        moveNumber: m.moveNumber,
        color: m.color,
        san: m.san,
        bestMove: m.bestMove || "неизвестно",
        explanation: m.explanation,
      }));

    // Подсчитываем статистику
    const brilliantMoves = analyzedMoves.filter((m) => m.classification === "brilliant").length;
    const blunders = analyzedMoves.filter((m) => m.classification === "blunder").length;
    const mistakesCount = analyzedMoves.filter((m) => m.classification === "mistake").length;
    const inaccuracies = analyzedMoves.filter((m) => m.classification === "inaccuracy").length;

    return {
      moves: analyzedMoves,
      whiteAccuracy,
      blackAccuracy,
      topMistakes: mistakes,
      brilliantMoves,
      blunders,
      mistakes: mistakesCount,
      inaccuracies,
    };
  } finally {
    engine.dispose();
  }
}

/**
 * Конвертирует UCI ход в SAN
 */
export function uciToSan(fen: string, uci: string): string {
  try {
    const chess = new Chess(fen);
    const from = uci.slice(0, 2);
    const to = uci.slice(2, 4);
    const promotion = uci[4];

    const move = chess.move({
      from,
      to,
      promotion,
    });

    return move ? move.san : uci;
  } catch {
    return uci;
  }
}
