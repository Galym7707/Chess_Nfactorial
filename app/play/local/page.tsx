"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, RotateCcw, StepBack, Brain } from "lucide-react";
import { BoardThemePicker } from "@/components/chess/board-theme-picker";
import { ChessboardView } from "@/components/chess/chessboard-view";
import { EvaluationBar } from "@/components/chess/evaluation-bar";
import { GameShell } from "@/components/chess/game-shell";
import { GameStatus } from "@/components/chess/game-status";
import { MoveList } from "@/components/chess/move-list";
import { PromotionDialog } from "@/components/chess/promotion-dialog";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { buildFastSummary } from "@/lib/coach/analysis";
import { createChessFromPgn, getStatus, moveFromPgn, needsPromotion, undoFromPgn } from "@/lib/chess/core";
import { saveGame } from "@/lib/db/games";
import { safeJsonParse } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import { useStockfish } from "@/hooks/use-stockfish";
import type { BoardTheme } from "@/types/app";

const STORAGE_KEY = "slay-gambit:local-duel";

type StoredLocal = { pgn: string; theme: BoardTheme; startedAt: number };

type PendingMove = { from: string; to: string } | null;

export default function LocalDuelPage() {
  const { user, profile } = useAuth();
  const { ready, analyzeFen } = useStockfish();
  const [pgn, setPgn] = useState("");
  const [theme, setTheme] = useState<BoardTheme>(profile?.board_theme ?? "classic");
  const [startedAt, setStartedAt] = useState(Date.now());
  const [pending, setPending] = useState<PendingMove>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const savedPgn = useRef<string | null>(null);

  const [stockfishEnabled, setStockfishEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('slay-gambit:stockfish-enabled');
    return saved === 'true';
  });
  const [liveEval, setLiveEval] = useState<number | null>(null);
  const [bestMove, setBestMove] = useState<string | null>(null);

  useEffect(() => {
    const stored = safeJsonParse<StoredLocal | null>(localStorage.getItem(STORAGE_KEY), null);
    if (stored) {
      setPgn(stored.pgn);
      setTheme(stored.theme);
      setStartedAt(stored.startedAt);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ pgn, theme, startedAt }));
  }, [pgn, startedAt, theme]);

  const chess = useMemo(() => createChessFromPgn(pgn), [pgn]);
  const status = useMemo(() => getStatus(chess), [chess]);
  const moves = useMemo(() => chess.history(), [chess]);

  useEffect(() => {
    localStorage.setItem('slay-gambit:stockfish-enabled', String(stockfishEnabled));
  }, [stockfishEnabled]);

  useEffect(() => {
    if (!stockfishEnabled || !ready || status.gameOver) {
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
  }, [chess, stockfishEnabled, ready, analyzeFen, status.gameOver]);

  useEffect(() => {
    if (!status.gameOver || savedPgn.current === pgn || !user) return;
    savedPgn.current = pgn;
    void saveGame({
      userId: user.id,
      mode: "local",
      result: status.result,
      pgn,
      fen: chess.fen(),
      moves,
      opponent: "Партия за доской",
      summary: buildFastSummary(status.result, "Партия за доской"),
      durationSeconds: Math.round((Date.now() - startedAt) / 1000),
    });
  }, [chess, moves, pgn, startedAt, status.gameOver, status.result, user]);

  function applyMove(from: string, to: string, promotion: "q" | "r" | "b" | "n" = "q") {
    const result = moveFromPgn(pgn, from, to, promotion);
    if (!result.ok) return false;
    setPgn(result.pgn);
    return true;
  }

  function onMove(from: string, to: string) {
    if (needsPromotion(pgn, from, to)) {
      setPending({ from, to });
      return false;
    }
    return applyMove(from, to);
  }

  function reset() {
    setPgn("");
    setStartedAt(Date.now());
    savedPgn.current = null;
  }

  async function copy(value: string, label: string) {
    await navigator.clipboard.writeText(value || "");
    setCopied(label);
    setTimeout(() => setCopied(null), 1600);
  }

  const bestMoveArrow = bestMove ? {
    from: bestMove.slice(0, 2),
    to: bestMove.slice(2, 4)
  } : null;

  return (
    <>
      <GameShell
        title="Партия за доской"
        description="Полная шахматная партия на одном экране: проверка правил, рокировка, взятие на проходе, превращение пешки, мат, пат, ничьи, отмена хода, экспорт FEN/PGN и восстановление после перезагрузки."
        board={
          <div className="flex flex-col sm:flex-row gap-2">
            {stockfishEnabled && liveEval !== null && (
              <EvaluationBar
                evaluation={liveEval}
                className="flex-shrink-0 sm:w-8 w-full h-8 sm:h-auto"
              />
            )}
            <div className="flex-1">
              <ChessboardView fen={chess.fen()} theme={theme} onMove={onMove} bestMoveArrow={stockfishEnabled ? bestMoveArrow : null} />
            </div>
          </div>
        }
        side={
          <>
            <GameStatus status={status} />
            <Surface>
              <div className="mb-4">
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
                    {bestMove && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-muted-foreground">Лучший ход:</span>
                        <span className="font-mono text-green-400">{bestMove}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <BoardThemePicker value={theme} onChange={setTheme} isPro={profile?.is_pro} />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => setPgn(undoFromPgn(pgn).pgn)} disabled={!moves.length} type="button"><StepBack className="size-4" /> Отменить</Button>
                <Button variant="secondary" onClick={reset} type="button"><RotateCcw className="size-4" /> Заново</Button>
                <Button variant="secondary" onClick={() => copy(chess.fen(), "FEN")} type="button"><Copy className="size-4" /> FEN</Button>
                <Button variant="secondary" onClick={() => copy(pgn, "PGN")} type="button"><Copy className="size-4" /> PGN</Button>
              </div>
              {copied ? <p className="mt-3 text-sm text-primary">{copied} скопирован.</p> : null}
            </Surface>
            <MoveList moves={moves} />
          </>
        }
      />
      <PromotionDialog
        open={Boolean(pending)}
        onCancel={() => setPending(null)}
        onSelect={(piece) => {
          if (pending) applyMove(pending.from, pending.to, piece);
          setPending(null);
        }}
      />
    </>
  );
}
