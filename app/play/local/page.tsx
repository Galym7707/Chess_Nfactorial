"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, RotateCcw, StepBack } from "lucide-react";
import { BoardThemePicker } from "@/components/chess/board-theme-picker";
import { ChessboardView } from "@/components/chess/chessboard-view";
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
import type { BoardTheme } from "@/types/app";

const STORAGE_KEY = "code-gambit:local-duel";

type StoredLocal = { pgn: string; theme: BoardTheme; startedAt: number };

type PendingMove = { from: string; to: string } | null;

export default function LocalDuelPage() {
  const { user, profile } = useAuth();
  const [pgn, setPgn] = useState("");
  const [theme, setTheme] = useState<BoardTheme>(profile?.board_theme ?? "classic");
  const [startedAt, setStartedAt] = useState(Date.now());
  const [pending, setPending] = useState<PendingMove>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const savedPgn = useRef<string | null>(null);

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
    if (!status.gameOver || savedPgn.current === pgn || !user) return;
    savedPgn.current = pgn;
    void saveGame({
      userId: user.id,
      mode: "local",
      result: status.result,
      pgn,
      fen: chess.fen(),
      moves,
      opponent: "Local Duel",
      summary: buildFastSummary(status.result, "Local Duel"),
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

  return (
    <>
      <GameShell
        title="Local Duel"
        description="Полная шахматная партия на одном экране: legal moves, рокировка, en passant, promotion, мат, пат, ничьи, undo, FEN/PGN и восстановление из localStorage."
        board={<ChessboardView fen={chess.fen()} theme={theme} onMove={onMove} />}
        side={
          <>
            <GameStatus status={status} />
            <Surface>
              <BoardThemePicker value={theme} onChange={setTheme} isPro={profile?.is_pro} />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => setPgn(undoFromPgn(pgn).pgn)} disabled={!moves.length} type="button"><StepBack className="size-4" /> Undo</Button>
                <Button variant="secondary" onClick={reset} type="button"><RotateCcw className="size-4" /> Restart</Button>
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