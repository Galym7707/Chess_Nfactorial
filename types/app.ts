export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type GameMode = "local" | "ai" | "friend";
export type GameResult = "1-0" | "0-1" | "1/2-1/2" | "*";
export type BoardTheme = "classic" | "midnight" | "neon" | "paper";
export type CoachMoveClass = "best" | "excellent" | "good" | "inaccuracy" | "mistake" | "blunder";
export type TimeControl = "bullet" | "blitz" | "blitz5" | "rapid" | "classical" | "unlimited";

export interface TimeControlConfig {
  id: TimeControl;
  label: string;
  time: string;
  initialSeconds: number;
  incrementSeconds: number;
  description: string;
}

export interface Profile {
  id: string;
  display_name: string;
  city: string;
  preferred_theme: "system" | "light" | "dark";
  board_theme: BoardTheme;
  is_pro: boolean;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  created_at?: string;
  updated_at?: string;
}

export interface AppGame {
  id: string;
  user_id: string;
  mode: GameMode;
  result: GameResult;
  pgn: string;
  fen: string;
  moves: string[];
  opponent: string;
  summary: string;
  duration_seconds: number;
  completed_at: string;
  time_control?: string;
  initial_time_seconds?: number;
  increment_seconds?: number;
  is_rated?: boolean;
  rating_change?: number;
  opponent_rating?: number;
}

export interface CoachIssue {
  ply: number;
  move: string;
  classification: CoachMoveClass;
  lossCp: number;
  beforeEval: number;
  afterEval: number;
  betterMove: string;
  pv: string[];
  explanation: string;
  fenBefore?: string;
  fenAfter?: string;
}

export interface CoachReport {
  id: string;
  game_id: string;
  user_id: string;
  quality_score: number;
  summary: string;
  issues: CoachIssue[];
  created_at: string;
  estimated_rating?: number;
  weaknesses?: string[];
  move_stats?: {
    best: number;
    excellent: number;
    good: number;
    inaccuracy: number;
    mistake: number;
    blunder: number;
  };
  accuracy?: {
    white: number;
    black: number;
  };
  all_moves?: Array<{
    ply: number;
    move: string;
    classification: CoachMoveClass;
    evalBefore: number;
    evalAfter: number;
    lossCp: number;
    fenBefore: string;
    fenAfter: string;
  }>;
}

export interface RoomState {
  id: string;
  name: string;
  host_id: string;
  status: "waiting" | "active" | "finished" | "abandoned";
  current_fen: string;
  pgn: string;
  moves: string[];
  version: number;
  white_player_id: string | null;
  black_player_id: string | null;
  result: GameResult;
  created_at?: string;
  updated_at?: string;
  time_control?: string;
  initial_time_seconds?: number;
  increment_seconds?: number;
  white_time_remaining_ms?: number;
  black_time_remaining_ms?: number;
  last_move_at?: string;
  is_rated?: boolean;
  white_rating?: number;
  black_rating?: number;
}

export interface LeaderboardPlayer {
  id: string;
  display_name: string;
  city: string;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  win_rate: number;
}

export interface LeaderboardCity {
  city: string;
  players: number;
  wins: number;
  losses: number;
  rating: number;
  win_rate: number;
}