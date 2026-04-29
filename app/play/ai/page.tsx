"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bot, RotateCcw, Brain } from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { useAuth } from "@/components/auth/auth-provider";
import { BoardThemePicker } from "@/components/chess/board-theme-picker";
import { ChessboardView } from "@/components/chess/chessboard-view";
import { EnhancedAnalysisView } from "@/components/analysis/EnhancedAnalysisView";
import { EvaluationBar } from "@/components/chess/evaluation-bar";
import { GameResultModal } from "@/components/chess/game-result-modal";
import { GameShell } from "@/components/chess/game-shell";
import { GameStatus } from "@/components/chess/game-status";
import { MoveList } from "@/components/chess/move-list";
import { PromotionDialog } from "@/components/chess/promotion-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Surface } from "@/components/ui/surface";
import { createChessFromPgn, getStatus, moveFromPgn, moveUciFromPgn, needsPromotion } from "@/lib/chess/core";
import { buildFastSummary, runCoachReview } from "@/lib/coach/analysis";
import { saveCoachReport, saveGame } from "@/lib/db/games";
import { useStockfish } from "@/hooks/use-stockfish";
import type { BoardTheme, CoachReport } from "@/types/app";

const difficulties = {
  novice: { label: "Новичок", depth: 2, movetime: 250, skill: 2 },
  amateur: { label: "Любитель", depth: 5, movetime: 500, skill: 7 },
  strong: { label: "Сильный", depth: 8, movetime: 900, skill: 13 },
  expert: { label: "Эксперт", depth: 11, movetime: 1400, skill: 18 },
} as const;

type Difficulty = keyof typeof difficulties;
type PendingMove = { from: string; to: string } | null;

function fallbackMove(pgn: string) {
  const chess = createChessFromPgn(pgn);
  const moves = chess.moves({ verbose: true });
  const capture = moves.find((move) => move.isCapture());
  const selected = capture ?? moves[Math.floor(Math.random() * moves.length)];
  if (!selected) return null;
  return `${selected.from}${selected.to}${selected.promotion ?? ""}`;
}

function AiArenaInner() {
  const { user, profile } = useAuth();
  const { ready, error: engineError, analyzeFen } = useStockfish();
  const [pgn, setPgn] = useState("");
  const [theme, setTheme] = useState<BoardTheme>(profile?.board_theme ?? "midnight");
  const [difficulty, setDifficulty] = useState<Difficulty>("amateur");
  const [pending, setPending] = useState<PendingMove>(null);
  const [thinking, setThinking] = useState(false);
  const [report, setReport] = useState<CoachReport | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [savedGameId, setSavedGameId] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const startedAt = useRef(Date.now());
  const savedPgn = useRef<string | null>(null);

  const [stockfishEnabled, setStockfishEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('slay-gambit:stockfish-enabled');
    return saved === 'true';
  });
  const [liveEval, setLiveEval] = useState<number | null>(null);
  const [bestMove, setBestMove] = useState<string | null>(null);

  const chess = useMemo(() => createChessFromPgn(pgn), [pgn]);
  const status = useMemo(() => getStatus(chess), [chess]);
  const moves = useMemo(() => chess.history(), [chess]);

  useEffect(() => {
    localStorage.setItem('slay-gambit:stockfish-enabled', String(stockfishEnabled));
  }, [stockfishEnabled]);

  useEffect(() => {
    if (!stockfishEnabled || !ready || status.gameOver || thinking) {
      setLiveEval(null);
      setBestMove(null);
      return;
    }

    let cancelled = false;

    analyzeFen(chess.fen(), { depth: 15, movetime: 1000 })
      .then((analysis) => {
        if (!cancelled) {
          setLiveEval(analysis.scoreCp / 100);
          setBestMove(analysis.bestMove);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLiveEval(null);
          setBestMove(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chess, stockfishEnabled, ready, analyzeFen, status.gameOver, thinking]);

  async function requestAiMove(nextPgn: string) {
    const afterHuman = createChessFromPgn(nextPgn);
    if (afterHuman.isGameOver()) return;
    setThinking(true);
    try {
      const cfg = difficulties[difficulty];
      const analysis = ready ? await analyzeFen(afterHuman.fen(), cfg) : null;
      const bestMove = analysis?.bestMove ?? fallbackMove(nextPgn);
      if (!bestMove) return;
      const result = moveUciFromPgn(nextPgn, bestMove);
      if (result.ok) setPgn(result.pgn);
    } finally {
      setThinking(false);
    }
  }

  function applyHumanMove(from: string, to: string, promotion: "q" | "r" | "b" | "n" = "q") {
    if (thinking || status.gameOver || chess.turn() !== "w") return false;
    const result = moveFromPgn(pgn, from, to, promotion);
    if (!result.ok) return false;
    setPgn(result.pgn);
    void requestAiMove(result.pgn);
    return true;
  }

  function onMove(from: string, to: string) {
    if (needsPromotion(pgn, from, to)) {
      setPending({ from, to });
      return false;
    }
    return applyHumanMove(from, to);
  }

  useEffect(() => {
    if (!status.gameOver || !user || savedPgn.current === pgn) return;
    savedPgn.current = pgn;
    setReviewing(true);
    void saveGame({
      userId: user.id,
      mode: "ai",
      result: status.result,
      pgn,
      fen: chess.fen(),
      moves,
      opponent: `Stockfish · ${difficulties[difficulty].label}`,
      summary: buildFastSummary(status.result, `Stockfish ${difficulties[difficulty].label}`),
      durationSeconds: Math.round((Date.now() - startedAt.current) / 1000),
    }).then(async (game) => {
      setSavedGameId(game.id);
      const coach = await runCoachReview({ pgn, userId: user.id, gameId: game.id, analyzeFen, maxPlies: profile?.is_pro ? 40 : 24 });
      await saveCoachReport(coach);
      setReport(coach);
      setShowResultModal(true);
    }).finally(() => setReviewing(false));
  }, [analyzeFen, chess, difficulty, moves, pgn, profile?.is_pro, status.gameOver, status.result, user]);

  function reset() {
    setPgn("");
    setReport(null);
    setSavedGameId(null);
    savedPgn.current = null;
    startedAt.current = Date.now();
  }

  const bestMoveArrow = bestMove && chess.turn() === "w" ? {
    from: bestMove.slice(0, 2),
    to: bestMove.slice(2, 4)
  } : null;

  return (
    <>
      <GameShell
        title="Игра против движка"
        description="Игра против Stockfish с настройкой силы. После партии сервис покажет ключевые ошибки, оценит решения и предложит более надежные продолжения."
        board={
          <div className="flex flex-col sm:flex-row gap-2">
            {stockfishEnabled && liveEval !== null && (
              <EvaluationBar
                evaluation={liveEval}
                className="flex-shrink-0 sm:w-8 w-full h-8 sm:h-auto"
              />
            )}
            <div className="flex-1">
              <ChessboardView fen={chess.fen()} theme={theme} onMove={onMove} allowDragging={!thinking && chess.turn() === "w" && !status.gameOver} bestMoveArrow={stockfishEnabled ? bestMoveArrow : null} />
            </div>
          </div>
        }
        side={
          <>
            <GameStatus status={status} />
            <Surface>
              <div className="flex flex-wrap items-center gap-2">
                <Badge><Bot className="size-3" /> Stockfish</Badge>
                <Badge className={ready ? "border-primary/40 text-primary" : ""}>{ready ? "готов" : "запуск"}</Badge>
              </div>
              {engineError ? <p className="mt-3 text-sm text-destructive">{engineError}. Включен запасной ход без внешнего сервера.</p> : null}
              <div className="mt-4">
                <Button
                  variant={stockfishEnabled ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setStockfishEnabled(!stockfishEnabled)}
                  disabled={!ready}
                  type="button"
                  className="gap-2 w-full"
                >
                  <Brain className="size-4" />
                  {stockfishEnabled ? "Stockfish ON" : "Stockfish OFF"}
                </Button>
                {stockfishEnabled && liveEval !== null && (
                  <div className="mt-3 rounded-xl bg-muted/30 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Оценка:</span>
                      <span className="font-mono font-semibold">
                        {liveEval > 0 ? "+" : ""}
                        {liveEval.toFixed(2)}
                      </span>
                    </div>
                    {bestMove && chess.turn() === "w" && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-muted-foreground">Лучший ход:</span>
                        <span className="font-mono text-green-400">{bestMove}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <label className="mt-5 grid gap-2 text-sm font-semibold">
                Сложность
                <Select value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty)} disabled={moves.length > 0}>
                  {Object.entries(difficulties).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
                </Select>
              </label>
              <div className="mt-4">
                <BoardThemePicker value={theme} onChange={setTheme} isPro={profile?.is_pro} />
              </div>
              <Button className="mt-5 w-full" variant="secondary" onClick={reset} type="button"><RotateCcw className="size-4" /> Новая партия</Button>
              {thinking ? <p className="mt-3 text-sm text-primary">Stockfish выбирает ход...</p> : null}
              {reviewing ? <p className="mt-3 text-sm text-primary">Разбор анализирует партию...</p> : null}
              {savedGameId ? <Link className="mt-4 inline-flex text-sm font-semibold text-primary" href={`/review/${savedGameId}`}>Открыть детальный разбор</Link> : null}
            </Surface>
            <MoveList moves={moves} />
          </>
        }
      />
      {report ? <section data-analysis-section className="mx-auto max-w-7xl px-4 pb-10 md:px-6"><EnhancedAnalysisView report={report} theme={theme} /></section> : null}
      <PromotionDialog
        open={Boolean(pending)}
        onCancel={() => setPending(null)}
        onSelect={(piece) => {
          if (pending) applyHumanMove(pending.from, pending.to, piece);
          setPending(null);
        }}
      />
      {report?.move_stats && (
        <GameResultModal
          open={showResultModal}
          result={status.result === "1-0" ? "win" : status.result === "0-1" ? "loss" : "draw"}
          stats={report.move_stats}
          accuracy={report.accuracy?.white}
          onClose={() => setShowResultModal(false)}
          onRematch={reset}
          onAnalyze={() => {
            setShowResultModal(false);
            const element = document.querySelector('[data-analysis-section]');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}
    </>
  );
}

export default function AiArenaPage() {
  return (
    <AuthGate>
      <AiArenaInner />
    </AuthGate>
  );
}
