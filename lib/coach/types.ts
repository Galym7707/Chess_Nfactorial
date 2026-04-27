export type MoveClassification =
  | "brilliant"
  | "great"
  | "best"
  | "excellent"
  | "good"
  | "book"
  | "inaccuracy"
  | "mistake"
  | "blunder"
  | "missed-win";

export type AnalyzedMove = {
  moveNumber: number;
  color: "white" | "black";
  san: string;
  uci: string;
  fenBefore: string;
  fenAfter: string;
  bestMove: string | null;
  scoreBefore: number;
  scoreAfter: number;
  centipawnLoss: number;
  classification: MoveClassification;
  explanation: string;
  alternativeMoves?: Array<{
    move: string;
    score: number;
  }>;
  isSacrifice?: boolean;
};

export type GameAnalysis = {
  moves: AnalyzedMove[];
  whiteAccuracy: number;
  blackAccuracy: number;
  topMistakes: Array<{
    moveNumber: number;
    color: "white" | "black";
    san: string;
    bestMove: string;
    explanation: string;
  }>;
  brilliantMoves: number;
  blunders: number;
  mistakes: number;
  inaccuracies: number;
};

export type AnalysisDepth = "quick" | "balanced" | "deep";

export const DEPTH_SETTINGS: Record<AnalysisDepth, number> = {
  quick: 8,
  balanced: 12,
  deep: 16,
};
