import type { Json } from "./app";

type EmptyRelationships = [];

type ProfileRow = {
  id: string;
  display_name: string;
  city: string;
  preferred_theme: "system" | "light" | "dark";
  board_theme: "classic" | "midnight" | "neon" | "paper";
  is_pro: boolean;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  created_at: string;
  updated_at: string;
};

type GameRow = {
  id: string;
  user_id: string;
  mode: "local" | "ai" | "friend";
  result: "1-0" | "0-1" | "1/2-1/2" | "*";
  pgn: string;
  fen: string;
  moves: Json;
  opponent: string;
  summary: string;
  duration_seconds: number;
  completed_at: string;
  created_at: string;
  time_control: string | null;
  initial_time_seconds: number | null;
  increment_seconds: number | null;
  is_rated: boolean | null;
  rating_change: number | null;
  opponent_rating: number | null;
};

type GameMoveRow = { id: string; game_id: string; ply: number; san: string; fen_after: string; created_at: string };

type RoomRow = {
  id: string;
  name: string;
  host_id: string;
  status: "waiting" | "active" | "finished" | "abandoned";
  current_fen: string;
  pgn: string;
  moves: Json;
  version: number;
  white_player_id: string | null;
  black_player_id: string | null;
  result: "1-0" | "0-1" | "1/2-1/2" | "*";
  created_at: string;
  updated_at: string;
  time_control: string | null;
  initial_time_seconds: number | null;
  increment_seconds: number | null;
  white_time_remaining_ms: number | null;
  black_time_remaining_ms: number | null;
  last_move_at: string | null;
  is_rated: boolean | null;
  white_rating: number | null;
  black_rating: number | null;
};

type RoomPlayerRow = { room_id: string; user_id: string; color: "white" | "black" | "spectator"; online_at: string; joined_at: string };
type CoachReportRow = { id: string; game_id: string; user_id: string; quality_score: number; summary: string; issues: Json; created_at: string };
type PurchaseRow = { id: string; user_id: string; stripe_customer_id: string | null; stripe_subscription_id: string | null; status: string; product: string; created_at: string };
type InventoryRow = { id: string; user_id: string; item_key: string; item_type: string; granted_at: string };

export interface Database {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: Partial<ProfileRow> & { id: string }; Update: Partial<ProfileRow>; Relationships: EmptyRelationships };
      games: { Row: GameRow; Insert: Partial<GameRow> & Pick<GameRow, "user_id" | "mode" | "result" | "pgn" | "fen">; Update: Partial<GameRow>; Relationships: EmptyRelationships };
      game_moves: { Row: GameMoveRow; Insert: Partial<GameMoveRow> & Pick<GameMoveRow, "game_id" | "ply" | "san" | "fen_after">; Update: Partial<GameMoveRow>; Relationships: EmptyRelationships };
      rooms: { Row: RoomRow; Insert: Partial<RoomRow> & Pick<RoomRow, "host_id" | "current_fen" | "name">; Update: Partial<RoomRow>; Relationships: EmptyRelationships };
      room_players: { Row: RoomPlayerRow; Insert: Partial<RoomPlayerRow> & Pick<RoomPlayerRow, "room_id" | "user_id" | "color">; Update: Partial<RoomPlayerRow>; Relationships: EmptyRelationships };
      coach_reports: { Row: CoachReportRow; Insert: Partial<CoachReportRow> & Pick<CoachReportRow, "game_id" | "user_id" | "quality_score" | "summary" | "issues">; Update: Partial<CoachReportRow>; Relationships: EmptyRelationships };
      purchases: { Row: PurchaseRow; Insert: Partial<PurchaseRow> & Pick<PurchaseRow, "user_id" | "status" | "product">; Update: Partial<PurchaseRow>; Relationships: EmptyRelationships };
      user_inventory: { Row: InventoryRow; Insert: Partial<InventoryRow> & Pick<InventoryRow, "user_id" | "item_key" | "item_type">; Update: Partial<InventoryRow>; Relationships: EmptyRelationships };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}