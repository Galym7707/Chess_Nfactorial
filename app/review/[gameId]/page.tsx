"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AuthGate } from "@/components/auth/auth-gate";
import { useAuth } from "@/components/auth/auth-provider";
import { CoachReportView } from "@/components/chess/coach-report-view";
import { MoveList } from "@/components/chess/move-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { runCoachReview } from "@/lib/coach/analysis";
import { getCoachReport, getGame, saveCoachReport } from "@/lib/db/games";
import { formatDate } from "@/lib/utils";
import { useStockfish } from "@/hooks/use-stockfish";
import type { AppGame, CoachReport } from "@/types/app";

function ReviewInner() {
  const params = useParams<{ gameId: string }>();
  const { user, profile } = useAuth();
  const { ready, analyzeFen } = useStockfish();
  const [game, setGame] = useState<AppGame | null>(null);
  const [report, setReport] = useState<CoachReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    void Promise.all([getGame(user.id, params.gameId), getCoachReport(user.id, params.gameId)]).then(([nextGame, nextReport]) => {
      setGame(nextGame);
      setReport(nextReport);
    }).finally(() => setLoading(false));
  }, [params.gameId, user]);

  async function startReview() {
    if (!game || !user) return;
    setReviewing(true);
    try {
      const next = await runCoachReview({ pgn: game.pgn, userId: user.id, gameId: game.id, analyzeFen, maxPlies: profile?.is_pro ? 40 : 24 });
      await saveCoachReport(next);
      setReport(next);
    } finally {
      setReviewing(false);
    }
  }

  if (loading) return <section className="mx-auto max-w-5xl px-4 py-16 text-center text-muted-foreground">Загрузка разбора...</section>;

  if (!game) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <Surface className="text-center"><h1 className="font-display text-4xl font-semibold">Партия не найдена</h1><p className="mt-3 text-sm text-muted-foreground">Она не принадлежит текущему аккаунту или не была сохранена.</p></Surface>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-5 px-4 py-10 md:px-6 lg:grid-cols-[0.82fr_1.18fr]">
      <div className="grid content-start gap-5">
        <Surface>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/50">
              <img
                src="/tokayev.jpg"
                alt="Coach Tokayev"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-primary">Обзор партии</p>
              <p className="text-sm font-semibold">Coach Tokayev</p>
            </div>
          </div>
          <Badge>{game.mode}</Badge>
          <h1 className="mt-5 font-display text-4xl font-semibold">{game.opponent}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{game.result} · {formatDate(game.completed_at)}</p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{game.summary}</p>
          <div className="mt-5 rounded-2xl bg-muted/50 p-3 text-xs text-muted-foreground break-all">FEN: {game.fen}</div>
          {!report ? <Button className="mt-5 w-full" onClick={startReview} disabled={!ready || reviewing} type="button">{reviewing ? "Анализ..." : ready ? "Запустить разбор" : "Движок запускается"}</Button> : null}
        </Surface>
        <MoveList moves={game.moves} />
      </div>
      {report ? <CoachReportView report={report} /> : <Surface><h2 className="font-display text-3xl font-semibold">Разбор еще не создан</h2><p className="mt-3 text-sm text-muted-foreground">Нажмите кнопку слева. Бесплатный режим анализирует меньше полуходов; Pro включает расширенный разбор.</p></Surface>}
    </section>
  );
}

export default function ReviewPage() {
  return <AuthGate><ReviewInner /></AuthGate>;
}
