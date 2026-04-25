"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Surface } from "@/components/ui/surface";
import { getLeaderboard } from "@/lib/db/games";
import type { LeaderboardPlayer } from "@/types/app";

export function LeaderboardPreview() {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);

  useEffect(() => {
    void getLeaderboard().then((data) => setPlayers(data.players.slice(0, 3)));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Surface>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-primary">Cities</p>
            <h2 className="mt-4 font-display text-4xl font-semibold">Лидерборд по городам</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Пользователь сам указывает город в профиле. Топ игроков и городов считается по победам, поражениям, win rate и рейтингу.</p>
          </div>
          <Link className="inline-flex items-center text-sm font-semibold text-primary" href="/leaderboard">Открыть лидерборд <ArrowRight className="ml-2 size-4" /></Link>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {players.map((player, index) => (
            <div key={player.id} className="rounded-3xl border border-border bg-muted/45 p-4">
              <p className="text-sm text-muted-foreground">#{index + 1} · {player.city}</p>
              <p className="mt-2 font-display text-2xl font-semibold">{player.display_name}</p>
              <p className="mt-1 text-sm text-primary">{player.rating} rating · {player.win_rate}% win rate</p>
            </div>
          ))}
        </div>
      </Surface>
    </section>
  );
}