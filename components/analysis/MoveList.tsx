"use client";

import { Badge } from "@/components/ui/badge";
import { Surface } from "@/components/ui/surface";
import type { AnalyzedMove } from "@/lib/coach/types";
import { getClassificationColor, getClassificationIcon, getClassificationLabel } from "@/lib/coach/classifier";
import { cn } from "@/lib/utils";

type MoveListProps = {
  moves: AnalyzedMove[];
  selectedMoveIndex: number | null;
  onMoveSelect: (index: number) => void;
};

export function MoveList({ moves, selectedMoveIndex, onMoveSelect }: MoveListProps) {
  // Группируем ходы по парам (белые + чёрные)
  const movePairs: Array<{ white: AnalyzedMove | null; black: AnalyzedMove | null; moveNumber: number }> = [];

  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      white: moves[i] || null,
      black: moves[i + 1] || null,
      moveNumber: moves[i]?.moveNumber || Math.floor(i / 2) + 1,
    });
  }

  return (
    <Surface className="max-h-[600px] overflow-y-auto">
      <h3 className="mb-4 font-display text-xl font-semibold">Ходы партии</h3>

      <div className="space-y-1">
        {movePairs.map((pair, pairIndex) => (
          <div key={pairIndex} className="grid grid-cols-[auto_1fr_1fr] gap-2 text-sm">
            {/* Номер хода */}
            <div className="flex items-center justify-end pr-2 font-semibold text-muted-foreground">
              {pair.moveNumber}.
            </div>

            {/* Ход белых */}
            {pair.white && (
              <button
                onClick={() => onMoveSelect(pairIndex * 2)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-muted/50",
                  selectedMoveIndex === pairIndex * 2 && "bg-primary/10 ring-2 ring-primary"
                )}
                type="button"
              >
                <span className="font-mono">{pair.white.san}</span>
                <span className={cn("text-xs", getClassificationColor(pair.white.classification))}>
                  {getClassificationIcon(pair.white.classification)}
                </span>
              </button>
            )}
            {!pair.white && <div />}

            {/* Ход чёрных */}
            {pair.black && (
              <button
                onClick={() => onMoveSelect(pairIndex * 2 + 1)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-muted/50",
                  selectedMoveIndex === pairIndex * 2 + 1 && "bg-primary/10 ring-2 ring-primary"
                )}
                type="button"
              >
                <span className="font-mono">{pair.black.san}</span>
                <span className={cn("text-xs", getClassificationColor(pair.black.classification))}>
                  {getClassificationIcon(pair.black.classification)}
                </span>
              </button>
            )}
            {!pair.black && <div />}
          </div>
        ))}
      </div>
    </Surface>
  );
}
