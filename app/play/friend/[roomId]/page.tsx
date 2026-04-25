"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Copy, Radio, RotateCcw, Users } from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { useAuth } from "@/components/auth/auth-provider";
import { BoardThemePicker } from "@/components/chess/board-theme-picker";
import { ChessboardView } from "@/components/chess/chessboard-view";
import { CoachReportView } from "@/components/chess/coach-report-view";
import { GameShell } from "@/components/chess/game-shell";
import { GameStatus } from "@/components/chess/game-status";
import { MoveList } from "@/components/chess/move-list";
import { PromotionDialog } from "@/components/chess/promotion-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { INITIAL_FEN, createChessFromPgn, getStatus, needsPromotion } from "@/lib/chess/core";
import { buildFastSummary, runCoachReview } from "@/lib/coach/analysis";
import { saveCoachReport, saveGame } from "@/lib/db/games";
import { useRoom } from "@/hooks/use-room";
import { useStockfish } from "@/hooks/use-stockfish";
import type { BoardTheme, CoachReport } from "@/types/app";

type PendingMove = { from: string; to: string } | null;

function RoomInner() {
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;
  const { user, profile } = useAuth();
  const { analyzeFen } = useStockfish();
  const { room, color, online, loading, error, reload, makeMove } = useRoom(roomId, user?.id ?? null);
  const [theme, setTheme] = useState<BoardTheme>(profile?.board_theme ?? "midnight");
  const [pending, setPending] = useState<PendingMove>(null);
  const [copied, setCopied] = useState(false);
  const [report, setReport] = useState<CoachReport | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const savedVersion = useRef<number | null>(null);
  const startedAt = useRef(Date.now());

  const pgn = room?.pgn ?? "";
  const fen = room?.current_fen ?? INITIAL_FEN;
  const chess = useMemo(() => createChessFromPgn(pgn), [pgn]);
  const status = useMemo(() => getStatus(chess), [chess]);
  const moves = room?.moves ?? [];
  const orientation = color === "black" ? "black" : "white";
  const turnColor = fen.split(" ")[1] === "w" ? "white" : "black";
  const canMove = room?.status === "active" && color === turnColor && !status.gameOver;

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  function onMove(from: string, to: string) {
    if (!canMove) return false;
    if (needsPromotion(pgn, from, to)) {
      setPending({ from, to });
      return false;
    }
    void makeMove(from, to);
    return true;
  }

  useEffect(() => {
    if (!room || !user || room.status !== "finished" || savedVersion.current === room.version) return;
    savedVersion.current = room.version;
    setReviewing(true);
    void saveGame({
      userId: user.id,
      mode: "friend",
      result: room.result,
      pgn: room.pgn,
      fen: room.current_fen,
      moves: room.moves,
      opponent: "Friend Room",
      summary: buildFastSummary(room.result, "Friend Room"),
      durationSeconds: Math.round((Date.now() - startedAt.current) / 1000),
    }).then(async (game) => {
      const coach = await runCoachReview({ pgn: room.pgn, userId: user.id, gameId: game.id, analyzeFen, maxPlies: profile?.is_pro ? 40 : 24 });
      await saveCoachReport(coach);
      setReport(coach);
    }).finally(() => setReviewing(false));
  }, [analyzeFen, profile?.is_pro, room, user]);

  if (loading) {
    return <section className="mx-auto max-w-5xl px-4 py-16 text-center text-muted-foreground">Загрузка комнаты...</section>;
  }

  if (!room) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <Surface className="text-center">
          <h1 className="font-display text-4xl font-semibold">Комната не найдена</h1>
          <p className="mt-3 text-sm text-muted-foreground">Ссылка неверна или комната была удалена.</p>
          <Link className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground" href="/play/friend">Создать новую</Link>
        </Surface>
      </section>
    );
  }

  const lobby = room.status === "waiting" ? (
    <Surface>
      <div className="flex flex-wrap items-center gap-2"><Badge><Users className="size-3" /> Лобби</Badge><Badge>{online > 1 ? "друг онлайн" : "ожидание"}</Badge></div>
      <h2 className="mt-5 font-display text-3xl font-semibold">Пригласите второго игрока</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Белые уже в комнате. Черные подключатся по ссылке, после чего партия станет активной.</p>
      <Button className="mt-5 w-full" variant="secondary" onClick={copyLink} type="button"><Copy className="size-4" /> {copied ? "Ссылка скопирована" : "Копировать ссылку"}</Button>
      <Button className="mt-3 w-full" variant="ghost" onClick={() => void reload()} type="button"><RotateCcw className="size-4" /> Обновить состояние</Button>
    </Surface>
  ) : null;

  return (
    <>
      <GameShell
        title={`Комната ${room.id}`}
        description="Партия по ссылке с сохранением последней позиции. Если связь оборвется, игроки вернутся в актуальное состояние комнаты."
        board={<ChessboardView fen={fen} theme={theme} orientation={orientation} onMove={onMove} allowDragging={canMove} />}
        side={
          <>
            {lobby}
            <GameStatus status={status} />
            <Surface>
              <div className="flex flex-wrap items-center gap-2">
                <Badge><Radio className="size-3" /> онлайн: {online}</Badge>
                <Badge>Вы: {color}</Badge>
                <Badge>ходов: {room.moves.length}</Badge>
              </div>
              {error ? <p className="mt-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
              <div className="mt-5"><BoardThemePicker value={theme} onChange={setTheme} isPro={profile?.is_pro} /></div>
              <Button className="mt-5 w-full" variant="secondary" onClick={copyLink} type="button"><Copy className="size-4" /> {copied ? "Ссылка скопирована" : "Копировать ссылку"}</Button>
              {reviewing ? <p className="mt-3 text-sm text-primary">Разбор анализирует финальную позицию...</p> : null}
            </Surface>
            <MoveList moves={moves} />
          </>
        }
      />
      {report ? <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6"><CoachReportView report={report} /></section> : null}
      <PromotionDialog
        open={Boolean(pending)}
        onCancel={() => setPending(null)}
        onSelect={(piece) => {
          if (pending) void makeMove(pending.from, pending.to, piece);
          setPending(null);
        }}
      />
    </>
  );
}

export default function RoomPage() {
  return (
    <AuthGate>
      <RoomInner />
    </AuthGate>
  );
}
