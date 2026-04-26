"use client";

import { Chessboard } from "react-chessboard";
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
          onPieceDrop: ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
            if (!targetSquare || !onMove) return false;
            return onMove(sourceSquare, targetSquare);
          },
        }}
      />
    </div>
  );
}
