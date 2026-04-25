"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthGate } from "@/components/auth/auth-gate";
import { useAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Surface } from "@/components/ui/surface";
import { listGames } from "@/lib/db/games";
import { formatDate } from "@/lib/utils";
import type { AppGame, GameMode } from "@/types/app";

function HistoryInner() {
  const { user } = useAuth();
  const [games, setGames] = useState<AppGame[]>([]);
  const [filter, setFilter] = useState<GameMode | "all">("all");

  useEffect(() => {
    if (!user) return;
    void listGames(user.id, filter).then(setGames);
  }, [filter, user]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <Surface>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge>History</Badge>
            <h1 className="mt-5 font-display text-4xl font-semibold md:text-6xl">История партий</h1>
            <p className="mt-3 text-sm text-muted-foreground">AI, Local и Friend партии сохраняются в аккаунте или в локальной демо-сессии.</p>
          </div>
          <Select className="md:max-w-xs" value={filter} onChange={(event) => setFilter(event.target.value as GameMode | "all")}>
            <option value="all">Все режимы</option>
            <option value="ai">AI</option>
            <option value="local">Local</option>
            <option value="friend">Friend</option>
          </Select>
        </div>
        <div className="mt-8 grid gap-3">
          {games.length === 0 ? (
            <div className="rounded-3xl border border-border bg-muted/50 p-6 text-sm text-muted-foreground">Пока нет сохраненных партий.</div>
          ) : games.map((game) => (
            <Link key={game.id} href={`/review/${game.id}`} className="grid gap-3 rounded-3xl border border-border bg-card/70 p-4 transition hover:border-primary/50 md:grid-cols-[1fr_140px_140px] md:items-center">
              <div>
                <p className="font-display text-xl font-semibold">{game.opponent}</p>
                <p className="mt-1 text-sm text-muted-foreground">{game.summary}</p>
              </div>
              <Badge>{game.mode}</Badge>
              <p className="text-sm text-muted-foreground md:text-right">{game.result} · {formatDate(game.completed_at)}</p>
            </Link>
          ))}
        </div>
      </Surface>
    </section>
  );
}

export default function HistoryPage() {
  return <AuthGate><HistoryInner /></AuthGate>;
}