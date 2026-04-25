import { Chess, type Move, type Square } from "chess.js";
import type { GameResult } from "@/types/app";

export const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export type ChessStatus = {
  label: string;
  result: GameResult;
  gameOver: boolean;
  turn: "w" | "b";
  inCheck: boolean;
  reason: "playing" | "check" | "checkmate" | "stalemate" | "draw" | "insufficient" | "threefold" | "fifty";
};

export type LegalMoveResult = {
  ok: boolean;
  move?: Move;
  fen: string;
  pgn: string;
  moves: string[];
  status: ChessStatus;
  error?: string;
};

export function createChessFromPgn(pgn?: string) {
  const chess = new Chess();
  if (pgn?.trim()) chess.loadPgn(pgn);
  return chess;
}

export function getStatus(chess: Chess): ChessStatus {
  const turn = chess.turn();
  const inCheck = chess.isCheck();

  if (chess.isCheckmate()) {
    const whiteWon = turn === "b";
    return {
      label: whiteWon ? "Мат. Белые выиграли." : "Мат. Черные выиграли.",
      result: whiteWon ? "1-0" : "0-1",
      gameOver: true,
      turn,
      inCheck,
      reason: "checkmate",
    };
  }

  if (chess.isStalemate()) {
    return { label: "Пат. Ничья.", result: "1/2-1/2", gameOver: true, turn, inCheck, reason: "stalemate" };
  }

  if (chess.isInsufficientMaterial()) {
    return { label: "Недостаточно материала. Ничья.", result: "1/2-1/2", gameOver: true, turn, inCheck, reason: "insufficient" };
  }

  if (chess.isThreefoldRepetition()) {
    return { label: "Троекратное повторение. Ничья.", result: "1/2-1/2", gameOver: true, turn, inCheck, reason: "threefold" };
  }

  if (chess.isDrawByFiftyMoves()) {
    return { label: "Правило 50 ходов. Ничья.", result: "1/2-1/2", gameOver: true, turn, inCheck, reason: "fifty" };
  }

  if (chess.isDraw()) {
    return { label: "Ничья по состоянию позиции.", result: "1/2-1/2", gameOver: true, turn, inCheck, reason: "draw" };
  }

  if (inCheck) {
    return { label: `Шах. Ход ${turn === "w" ? "белых" : "черных"}.`, result: "*", gameOver: false, turn, inCheck, reason: "check" };
  }

  return { label: `Ход ${turn === "w" ? "белых" : "черных"}.`, result: "*", gameOver: false, turn, inCheck, reason: "playing" };
}

export function moveFromPgn(pgn: string, from: string, to: string, promotion: "q" | "r" | "b" | "n" = "q"): LegalMoveResult {
  const chess = createChessFromPgn(pgn);
  try {
    const move = chess.move({ from, to, promotion });
    const status = getStatus(chess);
    return { ok: true, move, fen: chess.fen(), pgn: chess.pgn(), moves: chess.history(), status };
  } catch (error) {
    return {
      ok: false,
      fen: chess.fen(),
      pgn: chess.pgn(),
      moves: chess.history(),
      status: getStatus(chess),
      error: error instanceof Error ? error.message : "Illegal move",
    };
  }
}

export function moveUciFromPgn(pgn: string, uci: string): LegalMoveResult {
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = (uci[4] as "q" | "r" | "b" | "n" | undefined) ?? "q";
  return moveFromPgn(pgn, from, to, promotion);
}

export function undoFromPgn(pgn: string) {
  const chess = createChessFromPgn(pgn);
  chess.undo();
  return { pgn: chess.pgn(), fen: chess.fen(), moves: chess.history(), status: getStatus(chess) };
}

export function needsPromotion(pgn: string, from: string, to: string) {
  const chess = createChessFromPgn(pgn);
  const piece = chess.get(from as Square);
  if (!piece || piece.type !== "p") return false;
  return (piece.color === "w" && to.endsWith("8")) || (piece.color === "b" && to.endsWith("1"));
}

export function verboseMovesFromPgn(pgn: string) {
  const chess = createChessFromPgn(pgn);
  return chess.history({ verbose: true });
}

export function pgnToSans(pgn: string) {
  return createChessFromPgn(pgn).history();
}

export function resultSummary(result: GameResult) {
  if (result === "1-0") return "Победа белых";
  if (result === "0-1") return "Победа черных";
  if (result === "1/2-1/2") return "Ничья";
  return "Игра не завершена";
}