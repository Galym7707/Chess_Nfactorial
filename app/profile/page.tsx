"use client";

import { useEffect, useState } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { useAuth } from "@/components/auth/auth-provider";
import { BoardThemePicker } from "@/components/chess/board-theme-picker";
import { ProgressStats } from "@/components/profile/progress-stats";
import { RatingChart } from "@/components/profile/rating-chart";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { getProfileStats, listGames } from "@/lib/db/games";
import type { AppGame, BoardTheme, Profile } from "@/types/app";

function ProfileInner() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [form, setForm] = useState<Profile | null>(profile);
  const [games, setGames] = useState<AppGame[]>([]);
  const [stats, setStats] = useState({ total: 0, wins: 0, losses: 0, draws: 0, winRate: 0 });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => setForm(profile), [profile]);
  useEffect(() => {
    if (!user) return;
    void getProfileStats(profile, user.id).then((data) => {
      setStats({ total: data.total, wins: data.wins, losses: data.losses, draws: data.draws, winRate: data.winRate });
      setGames(data.games.slice(0, 5));
    });
    void listGames(user.id, "all").then((items) => setGames(items.slice(0, 5)));
  }, [profile, user]);

  if (!user || !form) return null;

  async function save() {
    if (!form) return;
    const error = await updateProfile(form);
    setMessage(error ?? "Профиль сохранен");
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-5 px-4 py-10 md:px-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Surface>
        <p className="text-sm uppercase tracking-[0.32em] text-primary">Profile</p>
        <h1 className="mt-4 font-display text-4xl font-semibold">{form.display_name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{user.email}{user.isDemo ? " · demo" : ""}</p>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold">Display name<Input value={form.display_name} onChange={(event) => setForm({ ...form, display_name: event.target.value })} /></label>
          <label className="grid gap-2 text-sm font-semibold">Город<Input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} /></label>
          <label className="grid gap-2 text-sm font-semibold">Тема интерфейса<Select value={form.preferred_theme} onChange={(event) => setForm({ ...form, preferred_theme: event.target.value as Profile["preferred_theme"] })}><option value="system">System</option><option value="dark">Dark</option><option value="light">Light</option></Select></label>
          <BoardThemePicker value={form.board_theme} onChange={(theme: BoardTheme) => setForm({ ...form, board_theme: theme })} isPro={form.is_pro} />
          <Button onClick={save} type="button">Сохранить профиль</Button>
          <Button variant="secondary" onClick={() => void signOut()} type="button">Выйти</Button>
          {message ? <p className="text-sm text-primary">{message}</p> : null}
        </div>
      </Surface>
      <div className="grid gap-5">
        <ProgressStats stats={stats} rating={profile?.rating ?? 1200} games={games} />
        <RatingChart games={games} currentRating={profile?.rating ?? 1200} />
      </div>
    </section>
  );
}

export default function ProfilePage() {
  return <AuthGate><ProfileInner /></AuthGate>;
}