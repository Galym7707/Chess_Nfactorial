"use client";

import { useState, useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { boardThemes } from "@/lib/chess/themes";
import type { BoardTheme } from "@/types/app";

export function ChessboardView({
  fen,
  theme,
  orientation = "white",
  onMove,
  allowDragging = true,
}: {
  fen: string;
  theme: BoardTheme;
  orientation?: "white" | "black";
  onMove?: (source: string, target: string) => boolean;
  allowDragging?: boolean;
}) {
  const colors = boardThemes[theme];
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  const chess = useMemo(() => {
    const c = new Chess();
    try {
      c.load(fen);
    } catch {
      // Invalid FEN, use default
    }
    return c;
  }, [fen]);

  const legalMoves = useMemo(() => {
    if (!selectedSquare) return [];
    return chess.moves({ square: selectedSquare as any, verbose: true });
  }, [chess, selectedSquare]);

  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Highlight king in check
    if (chess.inCheck()) {
      const board = chess.board();
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const piece = board[i][j];
          if (piece && piece.type === "k" && piece.color === chess.turn()) {
            const file = String.fromCharCode(97 + j);
            const rank = String(8 - i);
            const square = file + rank;
            styles[square] = {
              backgroundColor: "rgba(255, 0, 0, 0.5)",
              boxShadow: "inset 0 0 0 3px rgba(255, 0, 0, 0.9)",
              animation: "pulse 1.5s ease-in-out infinite",
            };
          }
        }
      }
    }

    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: "rgba(255, 255, 0, 0.4)",
        boxShadow: "inset 0 0 0 2px rgba(255, 255, 0, 0.8)",
      };

      legalMoves.forEach((move) => {
        const targetSquare = move.to;
        const isCapture = move.captured;

        if (isCapture) {
          styles[targetSquare] = {
            background: "radial-gradient(circle, rgba(255, 0, 0, 0.3) 50%, transparent 50%)",
            backgroundSize: "100% 100%",
          };
        } else {
          styles[targetSquare] = {
            background: "radial-gradient(circle, rgba(0, 0, 0, 0.15) 25%, transparent 25%)",
            backgroundSize: "100% 100%",
          };
        }
      });
    }

    return styles;
  }, [selectedSquare, legalMoves, chess]);

  function onSquareClick({ square }: { square: string }) {
    if (!allowDragging || !onMove) return;

    const piece = chess.get(square as any);

    if (selectedSquare) {
      const isLegalMove = legalMoves.some((m) => m.to === square);

      if (isLegalMove) {
        const success = onMove(selectedSquare, square);
        setSelectedSquare(null);
        return;
      }

      if (piece && piece.color === chess.turn()) {
        setSelectedSquare(square);
      } else {
        setSelectedSquare(null);
      }
    } else {
      if (piece && piece.color === chess.turn()) {
        setSelectedSquare(square);
      }
    }
  }

  return (
    <div className="board-wrap rounded-[1.75rem] border bg-card p-2 shadow-soft" style={{ borderColor: colors.border }}>
      <Chessboard
        options={{
          position: fen,
          boardOrientation: orientation,
          allowDragging,
          animationDurationInMs: 180,
          showAnimations: true,
          showNotation: true,
          allowDrawingArrows: true,
          boardStyle: {
            borderRadius: "1.25rem",
            overflow: "hidden",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)",
          },
          draggingPieceStyle: {
            transform: "scale(1.08)",
            maxWidth: "min(80px, 10.75vmin)",
            maxHeight: "min(80px, 10.75vmin)",
          },
          lightSquareStyle: { backgroundColor: colors.light },
          darkSquareStyle: { backgroundColor: colors.dark },
          customSquareStyles,
          onSquareClick,
          onPieceDrop: ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
            if (!targetSquare || !onMove) return false;
            setSelectedSquare(null);
            return onMove(sourceSquare, targetSquare);
          },
        }}
      />
    </div>
  );
}
