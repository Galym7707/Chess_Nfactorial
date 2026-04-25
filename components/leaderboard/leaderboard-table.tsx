"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Surface } from "@/components/ui/surface";
import { getLeaderboard } from "@/lib/db/games";
import { formatPercent } from "@/lib/utils";
import type { LeaderboardCity, LeaderboardPlayer } from "@/types/app";

export function LeaderboardTable() {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [cities, setCities] = useState<LeaderboardCity[]>([]);
  const [tab, setTab] = useState<"players" | "cities">("players");

  useEffect(() => {
    void getLeaderboard().then((data) => {
      setPlayers(data.players);
      setCities(data.cities);
    });
  }, []);

  return (
    <Surface>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge><Trophy className="size-3" /> Leaderboard</Badge>
          <h1 className="mt-5 font-display text-4xl font-semibold md:text-6xl">Игроки и города</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Глобальный рейтинг использует профильный город пользователя, wins, losses, draws, win rate и rating.</p>
        </div>
        <div className="grid grid-cols-2 rounded-full bg-muted p-1 text-sm font-semibold">
          <button className={`rounded-full px-4 py-2 ${tab === "players" ? "bg-card shadow-soft" : "text-muted-foreground"}`} onClick={() => setTab("players")} type="button">Игроки</button>
          <button className={`rounded-full px-4 py-2 ${tab === "cities" ? "bg-card shadow-soft" : "text-muted-foreground"}`} onClick={() => setTab("cities")} type="button">Города</button>
        </div>
      </div>
      <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-border">
        <div className="grid grid-cols-5 bg-muted/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <span>#</span><span>{tab === "players" ? "Игрок" : "Город"}</span><span>Рейтинг</span><span>W/L</span><span>Win rate</span>
        </div>
        {(tab === "players" ? players : cities).map((item, index) => {
          const isPlayer = "display_name" in item;
          return (
            <div key={isPlayer ? item.id : item.city} className="grid grid-cols-5 border-t border-border px-4 py-4 text-sm">
              <span className="text-muted-foreground">{index + 1}</span>
              <span className="font-semibold">{isPlayer ? item.display_name : item.city}<span className="block text-xs font-normal text-muted-foreground">{isPlayer ? item.city : `${item.players} игроков`}</span></span>
              <span>{item.rating}</span>
              <span>{item.wins}/{item.losses}</span>
              <span>{formatPercent(item.win_rate)}</span>
            </div>
          );
        })}
      </div>
    </Surface>
  );
}