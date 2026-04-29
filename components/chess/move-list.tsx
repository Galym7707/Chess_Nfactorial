"use client";

import { useEffect, useRef } from "react";
import { Surface } from "@/components/ui/surface";

export function MoveList({ moves, onMoveClick }: { moves: string[]; onMoveClick?: (index: number) => void }) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [moves.length]);

  // Group moves into pairs (white, black)
  const movePairs: Array<{ moveNumber: number; white: string | null; black: string | null; whiteIndex: number; blackIndex: number | null }> = [];

  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i] || null,
      black: moves[i + 1] || null,
      whiteIndex: i,
      blackIndex: i + 1 < moves.length ? i + 1 : null,
    });
  }

  return (
    <Surface className="max-h-[340px] overflow-hidden p-0">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-display text-lg font-semibold">История ходов</h3>
      </div>
      {moves.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">Партия еще не началась.</p>
      ) : (
        <div ref={listRef} className="max-h-[276px] overflow-auto p-3">
          <div className="space-y-1">
            {movePairs.map((pair) => (
              <div
                key={pair.moveNumber}
                className="grid grid-cols-[48px_1fr_1fr] gap-2 rounded-2xl px-3 py-2 transition hover:bg-muted/60"
              >
                <span className="text-muted-foreground font-medium">{pair.moveNumber}.</span>
                <button
                  className={`text-left font-medium transition ${
                    onMoveClick ? "cursor-pointer hover:text-primary" : ""
                  }`}
                  onClick={() => onMoveClick?.(pair.whiteIndex)}
                  type="button"
                >
                  {pair.white}
                </button>
                {pair.black ? (
                  <button
                    className={`text-left font-medium transition ${
                      onMoveClick ? "cursor-pointer hover:text-primary" : ""
                    }`}
                    onClick={() => pair.blackIndex !== null && onMoveClick?.(pair.blackIndex)}
                    type="button"
                  >
                    {pair.black}
                  </button>
                ) : (
                  <span></span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Surface>
  );
}