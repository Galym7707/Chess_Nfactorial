import type { SupabaseClient } from "@supabase/supabase-js";
import { INITIAL_FEN, moveFromPgn } from "@/lib/chess/core";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { safeJsonParse } from "@/lib/utils";
import type { GameResult, RoomState, TimeControlConfig } from "@/types/app";
import type { Database } from "@/types/database";

const ROOMS_KEY = "slay-gambit:rooms";

type RoomRow = Database["public"]["Tables"]["rooms"]["Row"];
type Db = SupabaseClient<Database>;

const ADJECTIVES = ["Быстрая", "Тихая", "Яркая", "Смелая", "Мудрая", "Дерзкая", "Хитрая", "Сильная", "Ловкая", "Грозная"];
const NOUNS = ["Пешка", "Ладья", "Слон", "Конь", "Ферзь", "Король", "Партия", "Атака", "Защита", "Гамбит"];

function generateRoomName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${noun}`;
}

function mapRoom(row: RoomRow): RoomState {
  return {
    id: row.id,
    name: row.name || generateRoomName(),
    host_id: row.host_id,
    status: row.status,
    current_fen: row.current_fen,
    pgn: row.pgn,
    moves: Array.isArray(row.moves) ? row.moves.map(String) : [],
    version: row.version,
    white_player_id: row.white_player_id,
    black_player_id: row.black_player_id,
    result: row.result,
    created_at: row.created_at,
    updated_at: row.updated_at,
    time_control: row.time_control ?? undefined,
    initial_time_seconds: row.initial_time_seconds ?? undefined,
    increment_seconds: row.increment_seconds ?? undefined,
    white_time_remaining_ms: row.white_time_remaining_ms ?? undefined,
    black_time_remaining_ms: row.black_time_remaining_ms ?? undefined,
    last_move_at: row.last_move_at ?? undefined,
    is_rated: row.is_rated ?? undefined,
    white_rating: row.white_rating ?? undefined,
    black_rating: row.black_rating ?? undefined,
  };
}

function readLocalRooms() {
  return safeJsonParse<RoomState[]>(typeof localStorage === "undefined" ? null : localStorage.getItem(ROOMS_KEY), []);
}

function writeLocalRooms(rooms: RoomState[]) {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
}

function upsertLocalRoom(room: RoomState) {
  const rooms = readLocalRooms().filter((item) => item.id !== room.id);
  writeLocalRooms([room, ...rooms].slice(0, 20));
}

export async function createFriendRoom(userId: string, timeControl?: TimeControlConfig, isRated: boolean = false) {
  const client = getSupabaseBrowserClient();
  const initialTimeMs = timeControl && timeControl.initialSeconds > 0 ? timeControl.initialSeconds * 1000 : undefined;
  const roomName = generateRoomName();

  // Only use localStorage for demo users, not anonymous users
  if (!client || userId.startsWith("demo")) {
    const room: RoomState = {
      id: crypto.randomUUID().slice(0, 8),
      name: roomName,
      host_id: userId,
      status: "waiting",
      current_fen: INITIAL_FEN,
      pgn: "",
      moves: [],
      version: 0,
      white_player_id: userId,
      black_player_id: null,
      result: "*",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      time_control: timeControl?.time,
      initial_time_seconds: timeControl?.initialSeconds,
      increment_seconds: timeControl?.incrementSeconds,
      white_time_remaining_ms: initialTimeMs,
      black_time_remaining_ms: initialTimeMs,
      is_rated: isRated,
    };
    upsertLocalRoom(room);
    return room;
  }

  // Anonymous users also use Supabase, just don't save game history
  const { data, error } = await client
    .from("rooms")
    .insert({
      name: roomName,
      host_id: userId,
      current_fen: INITIAL_FEN,
      pgn: "",
      moves: [],
      white_player_id: userId,
      status: "waiting",
      time_control: timeControl?.time,
      initial_time_seconds: timeControl?.initialSeconds,
      increment_seconds: timeControl?.incrementSeconds,
      white_time_remaining_ms: initialTimeMs,
      black_time_remaining_ms: initialTimeMs,
      is_rated: isRated,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  await client.from("room_players").upsert({ room_id: data.id, user_id: userId, color: "white", online_at: new Date().toISOString() });
  return mapRoom(data);
}

export async function fetchRoom(roomId: string) {
  const client = getSupabaseBrowserClient();
  if (!client) return readLocalRooms().find((room) => room.id === roomId) ?? null;
  console.log('[fetchRoom] Fetching room:', roomId);
  const { data, error } = await client.from("rooms").select("*").eq("id", roomId).maybeSingle();
  if (error) {
    console.error('[fetchRoom] Error:', error);
    throw new Error(error.message);
  }
  console.log('[fetchRoom] Data:', data);
  return data ? mapRoom(data) : null;
}

export async function joinRoom(roomId: string, userId: string) {
  console.log('[joinRoom] Attempting to join room:', roomId, 'userId:', userId);
  const client = getSupabaseBrowserClient();
  console.log('[joinRoom] Client exists:', !!client);
  const current = await fetchRoom(roomId);
  console.log('[joinRoom] Current room:', current);
  if (!current) throw new Error("Комната не найдена");

  // Only use localStorage for demo users
  if (!client || userId.startsWith("demo")) {
    let next = current;
    if (!current.black_player_id && current.white_player_id !== userId) {
      next = { ...current, black_player_id: userId, status: "active", updated_at: new Date().toISOString() };
      upsertLocalRoom(next);
    }
    return { room: next, color: next.white_player_id === userId ? "white" : next.black_player_id === userId ? "black" : "spectator" as const };
  }

  // Anonymous users also use Supabase
  let color: "white" | "black" | "spectator" = "spectator";
  let patch: Partial<RoomRow> = {};
  if (current.white_player_id === userId) color = "white";
  else if (current.black_player_id === userId) color = "black";
  else if (!current.black_player_id) {
    color = "black";
    patch = { black_player_id: userId, status: "active" };
  }

  if (Object.keys(patch).length) {
    const { data, error } = await client.from("rooms").update(patch).eq("id", roomId).select("*").single();
    if (error) throw new Error(error.message);
    await client.from("room_players").upsert({ room_id: roomId, user_id: userId, color, online_at: new Date().toISOString() });
    return { room: mapRoom(data), color };
  }

  await client.from("room_players").upsert({ room_id: roomId, user_id: userId, color, online_at: new Date().toISOString() });
  return { room: current, color };
}

export async function applyRoomMove({
  room,
  userId,
  color,
  from,
  to,
  promotion = "q",
}: {
  room: RoomState;
  userId: string;
  color: "white" | "black" | "spectator";
  from: string;
  to: string;
  promotion?: "q" | "r" | "b" | "n";
}) {
  if (color === "spectator") throw new Error("Наблюдатель не может ходить");
  const expectedTurn = room.current_fen.split(" ")[1] === "w" ? "white" : "black";
  if (expectedTurn !== color) throw new Error("Сейчас ход соперника");
  const result = moveFromPgn(room.pgn, from, to, promotion);
  if (!result.ok) throw new Error("Нелегальный ход или устаревшая позиция");
  const status = result.status.gameOver ? "finished" : "active";

  // Calculate time with increment
  const now = Date.now();
  const lastMoveTime = room.last_move_at ? new Date(room.last_move_at).getTime() : now;
  const elapsed = now - lastMoveTime;
  const incrementMs = (room.increment_seconds ?? 0) * 1000;

  let whiteTimeMs = room.white_time_remaining_ms ?? 0;
  let blackTimeMs = room.black_time_remaining_ms ?? 0;

  // Subtract elapsed time from active player and add increment
  if (color === "white" && room.white_time_remaining_ms !== undefined) {
    whiteTimeMs = Math.max(0, room.white_time_remaining_ms - elapsed) + incrementMs;
  } else if (color === "black" && room.black_time_remaining_ms !== undefined) {
    blackTimeMs = Math.max(0, room.black_time_remaining_ms - elapsed) + incrementMs;
  }

  const next: RoomState = {
    ...room,
    status,
    current_fen: result.fen,
    pgn: result.pgn,
    moves: result.moves,
    result: result.status.result as GameResult,
    version: room.version + 1,
    updated_at: new Date().toISOString(),
    white_time_remaining_ms: whiteTimeMs,
    black_time_remaining_ms: blackTimeMs,
    last_move_at: new Date().toISOString(),
  };

  const client = getSupabaseBrowserClient();
  // Only use localStorage for demo users
  if (!client || userId.startsWith("demo")) {
    upsertLocalRoom(next);
    return next;
  }

  // Anonymous users also use Supabase
  const { data, error } = await client
    .from("rooms")
    .update({
      status: next.status,
      current_fen: next.current_fen,
      pgn: next.pgn,
      moves: next.moves,
      result: next.result,
      version: next.version,
      white_time_remaining_ms: next.white_time_remaining_ms,
      black_time_remaining_ms: next.black_time_remaining_ms,
      last_move_at: next.last_move_at,
    })
    .eq("id", room.id)
    .eq("version", room.version)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Позиция изменилась. Подтягиваю последнее состояние комнаты.");
  return mapRoom(data);
}

export function roomClient(): Db | null {
  return getSupabaseBrowserClient();
}