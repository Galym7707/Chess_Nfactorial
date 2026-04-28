"use client";

import { useEffect, useRef } from "react";
import { Surface } from "@/components/ui/surface";

export function MoveList({ moves, onMoveClick }: { moves: string[]; onMoveClick?: (index: number) => void }) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [moves.length]);

  return (
    <Surface className="max-h-[340px] overflow-hidden p-0">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-display text-lg font-semibold">История ходов</h3>
      </div>
      {moves.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">Партия еще не началась.</p>
      ) : (
        <ol ref={listRef} className="max-h-[276px] space-y-1 overflow-auto p-3 text-sm">
          {moves.map((move, index) => (
            <li
              key={`${move}-${index}`}
              className={`grid grid-cols-[48px_1fr] rounded-2xl px-3 py-2 transition ${
                onMoveClick ? "cursor-pointer hover:bg-accent" : "hover:bg-muted/60"
              }`}
              onClick={() => onMoveClick?.(index)}
            >
              <span className="text-muted-foreground">{Math.floor(index / 2) + 1}{index % 2 === 0 ? "." : "..."}</span>
              <span className="font-medium">{move}</span>
            </li>
          ))}
        </ol>
      )}
    </Surface>
  );
}