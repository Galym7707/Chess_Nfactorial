import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { safeJsonParse } from "@/lib/utils";
import type { AppGame, CoachReport, GameMode, GameResult, Json, LeaderboardCity, LeaderboardPlayer, Profile } from "@/types/app";
import type { Database } from "@/types/database";

const GAMES_KEY = "code-gambit:games";
const REPORTS_KEY = "code-gambit:coach-reports";

type Db = SupabaseClient<Database>;

export type SaveGameInput = {
  userId: string;
  mode: GameMode;
  result: GameResult;
  pgn: string;
  fen: string;
  moves: string[];
  opponent: string;
  summary: string;
  durationSeconds: number;
};

const demoPlayers: LeaderboardPlayer[] = [
  { id: "seed-1", display_name: "Aru.dev", city: "Алматы", rating: 1840, wins: 42, losses: 15, draws: 8, win_rate: 64.6 },
  { id: "seed-2", display_name: "ByteKnight", city: "Астана", rating: 1765, wins: 35, losses: 17, draws: 6, win_rate: 60.3 },
  { id: "seed-3", display_name: "QazaqCoder", city: "Шымкент", rating: 1690, wins: 31, losses: 19, draws: 7, win_rate: 54.4 },
];

function readLocalGames() {
  return safeJsonParse<AppGame[]>(typeof localStorage === "undefined" ? null : localStorage.getItem(GAMES_KEY), []);
}

function writeLocalGames(games: AppGame[]) {
  localStorage.setItem(GAMES_KEY, JSON.stringify(games));
}

function readLocalReports() {
  return safeJsonParse<CoachReport[]>(typeof localStorage === "undefined" ? null : localStorage.getItem(REPORTS_KEY), []);
}

function writeLocalReports(reports: CoachReport[]) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

function mapGame(row: Database["public"]["Tables"]["games"]["Row"]): AppGame {
  return {
    id: row.id,
    user_id: row.user_id,
    mode: row.mode,
    result: row.result,
    pgn: row.pgn,
    fen: row.fen,
    moves: Array.isArray(row.moves) ? row.moves.map(String) : [],
    opponent: row.opponent,
    summary: row.summary,
    duration_seconds: row.duration_seconds,
    completed_at: row.completed_at,
  };
}

async function updateStats(client: Db, userId: string, result: GameResult) {
  const { data } = await client.from("profiles").select("wins,losses,draws,rating").eq("id", userId).maybeSingle();
  const wins = data?.wins ?? 0;
  const losses = data?.losses ?? 0;
  const draws = data?.draws ?? 0;
  const rating = data?.rating ?? 1200;
  const patch = result === "1-0"
    ? { wins: wins + 1, rating: rating + 12 }
    : result === "0-1"
      ? { losses: losses + 1, rating: Math.max(100, rating - 10) }
      : result === "1/2-1/2"
        ? { draws: draws + 1, rating: rating + 1 }
        : {};
  if (Object.keys(patch).length) await client.from("profiles").update(patch).eq("id", userId);
}

export async function saveGame(input: SaveGameInput) {
  const now = new Date().toISOString();
  const client = getSupabaseBrowserClient();
  if (!client || input.userId.startsWith("demo")) {
    const game: AppGame = {
      id: crypto.randomUUID(),
      user_id: input.userId,
      mode: input.mode,
      result: input.result,
      pgn: input.pgn,
      fen: input.fen,
      moves: input.moves,
      opponent: input.opponent,
      summary: input.summary,
      duration_seconds: input.durationSeconds,
      completed_at: now,
    };
    writeLocalGames([game, ...readLocalGames()].slice(0, 80));
    return game;
  }

  const { data, error } = await client
    .from("games")
    .insert({
      user_id: input.userId,
      mode: input.mode,
      result: input.result,
      pgn: input.pgn,
      fen: input.fen,
      moves: input.moves,
      opponent: input.opponent,
      summary: input.summary,
      duration_seconds: input.durationSeconds,
      completed_at: now,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  const game = mapGame(data);
  await Promise.all([
    updateStats(client, input.userId, input.result),
    ...input.moves.map((san, index) => client.from("game_moves").insert({ game_id: game.id, ply: index + 1, san, fen_after: input.fen })),
  ]);
  return game;
}

export async function listGames(userId: string, mode?: GameMode | "all") {
  const client = getSupabaseBrowserClient();
  if (!client || userId.startsWith("demo")) {
    return readLocalGames().filter((game) => game.user_id === userId && (!mode || mode === "all" || game.mode === mode));
  }
  let query = client.from("games").select("*").eq("user_id", userId).order("completed_at", { ascending: false }).limit(80);
  if (mode && mode !== "all") query = query.eq("mode", mode);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapGame);
}

export async function getGame(userId: string, gameId: string) {
  const client = getSupabaseBrowserClient();
  if (!client || userId.startsWith("demo")) return readLocalGames().find((game) => game.id === gameId && game.user_id === userId) ?? null;
  const { data, error } = await client.from("games").select("*").eq("id", gameId).eq("user_id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapGame(data) : null;
}

export async function saveCoachReport(report: CoachReport) {
  const client = getSupabaseBrowserClient();
  if (!client || report.user_id.startsWith("demo")) {
    const reports = readLocalReports().filter((item) => item.game_id !== report.game_id);
    writeLocalReports([report, ...reports].slice(0, 80));
    return report;
  }
  const { data, error } = await client
    .from("coach_reports")
    .upsert({ game_id: report.game_id, user_id: report.user_id, quality_score: report.quality_score, summary: report.summary, issues: report.issues as unknown as Json })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return { ...report, id: data.id, created_at: data.created_at };
}

export async function getCoachReport(userId: string, gameId: string) {
  const client = getSupabaseBrowserClient();
  if (!client || userId.startsWith("demo")) return readLocalReports().find((report) => report.game_id === gameId && report.user_id === userId) ?? null;
  const { data, error } = await client.from("coach_reports").select("*").eq("game_id", gameId).eq("user_id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? ({ ...data, issues: Array.isArray(data.issues) ? data.issues : [] } as unknown as CoachReport) : null;
}

export async function getLeaderboard() {
  const client = getSupabaseBrowserClient();
  let players = demoPlayers;
  if (client) {
    const { data } = await client.from("profiles").select("id,display_name,city,rating,wins,losses,draws").order("rating", { ascending: false }).limit(50);
    if (data?.length) {
      players = data.map((profile) => {
        const total = profile.wins + profile.losses + profile.draws;
        return { ...profile, win_rate: total ? Math.round((profile.wins / total) * 1000) / 10 : 0 };
      });
    }
  }
  const cities = Object.values(players.reduce<Record<string, LeaderboardCity>>((acc, player) => {
    const key = player.city || "Не указан";
    const current = acc[key] ?? { city: key, players: 0, wins: 0, losses: 0, rating: 0, win_rate: 0 };
    current.players += 1;
    current.wins += player.wins;
    current.losses += player.losses;
    current.rating += player.rating;
    acc[key] = current;
    return acc;
  }, {})).map((city) => ({
    ...city,
    rating: Math.round(city.rating / Math.max(1, city.players)),
    win_rate: city.wins + city.losses ? Math.round((city.wins / (city.wins + city.losses)) * 1000) / 10 : 0,
  })).sort((a, b) => b.rating - a.rating);

  return { players, cities };
}

export async function getProfileStats(profile: Profile | null, userId: string) {
  const games = await listGames(userId, "all");
  const wins = profile?.wins ?? games.filter((game) => game.result === "1-0").length;
  const losses = profile?.losses ?? games.filter((game) => game.result === "0-1").length;
  const draws = profile?.draws ?? games.filter((game) => game.result === "1/2-1/2").length;
  const total = wins + losses + draws;
  return { games, wins, losses, draws, total, winRate: total ? (wins / total) * 100 : 0 };
}