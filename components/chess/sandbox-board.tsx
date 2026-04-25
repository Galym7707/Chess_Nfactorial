"use client";

import { useMemo, useState } from "react";
import { RotateCcw, ShieldOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";

type PieceCode = "wK" | "wQ" | "wR" | "wB" | "wN" | "wP" | "bK" | "bQ" | "bR" | "bB" | "bN" | "bP";
type SandboxPosition = Record<string, PieceCode | null>;

const unicodePieces: Record<PieceCode, string> = {
  wK: "♔",
  wQ: "♕",
  wR: "♖",
  wB: "♗",
  wN: "♘",
  wP: "♙",
  bK: "♚",
  bQ: "♛",
  bR: "♜",
  bB: "♝",
  bN: "♞",
  bP: "♟",
};

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

function initialPosition(): SandboxPosition {
  const position: SandboxPosition = {};
  files.forEach((file) => {
    position[`${file}2`] = "wP";
    position[`${file}7`] = "bP";
  });
  const back: PieceCode[] = ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"];
  const black: PieceCode[] = ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"];
  files.forEach((file, index) => {
    position[`${file}1`] = back[index] ?? null;
    position[`${file}8`] = black[index] ?? null;
  });
  return position;
}

export function SandboxBoard() {
  const [position, setPosition] = useState<SandboxPosition>(() => initialPosition());
  const [selected, setSelected] = useState<string | null>(null);
  const squares = useMemo(() => ranks.flatMap((rank) => files.map((file) => `${file}${rank}`)), []);

  function movePiece(from: string, to: string) {
    if (from === to) return;
    setPosition((current) => ({ ...current, [to]: current[from] ?? null, [from]: null }));
    setSelected(null);
  }

  function clickSquare(square: string) {
    if (selected) {
      movePiece(selected, square);
      return;
    }
    if (position[square]) setSelected(square);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Surface className="p-3 md:p-5">
        <div className="mx-auto grid aspect-square w-full max-w-[680px] grid-cols-8 overflow-hidden rounded-[1.6rem] border border-border shadow-soft">
          {squares.map((square, index) => {
            const piece = position[square];
            const light = (Math.floor(index / 8) + index) % 2 === 0;
            return (
              <button
                key={square}
                className={cn(
                  "relative flex items-center justify-center text-4xl transition md:text-6xl",
                  light ? "bg-[#f4dec0]" : "bg-[#7a4d34]",
                  selected === square && "ring-4 ring-inset ring-primary",
                )}
                draggable={Boolean(piece)}
                onClick={() => clickSquare(square)}
                onDragStart={(event) => event.dataTransfer.setData("text/plain", square)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const from = event.dataTransfer.getData("text/plain");
                  if (from) movePiece(from, square);
                }}
                type="button"
                aria-label={`Sandbox square ${square}`}
              >
                <span className={cn("select-none", piece?.startsWith("w") ? "text-stone-50 drop-shadow" : "text-stone-950")}>{piece ? unicodePieces[piece] : ""}</span>
                <span className="absolute bottom-1 right-1 text-[10px] font-semibold text-black/45">{square}</span>
              </button>
            );
          })}
        </div>
      </Surface>
      <div className="grid content-start gap-4">
        <Surface>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-destructive/40 text-destructive"><ShieldOff className="size-3" /> Rules Off</Badge>
            <Badge>Sandbox</Badge>
          </div>
          <h1 className="mt-5 font-display text-4xl font-semibold">Sandbox без правил</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Здесь нет chess.js validation: фигуры можно перетаскивать куда угодно. Режим нужен для быстрых объяснений, сетапа позиций и демонстрации слабого уровня задания.
          </p>
          <Button className="mt-6 w-full" variant="secondary" onClick={() => { setPosition(initialPosition()); setSelected(null); }} type="button">
            <RotateCcw className="size-4" /> Сбросить позицию
          </Button>
        </Surface>
        <Surface>
          <p className="text-sm font-semibold">Переключатель режима</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <span className="rounded-2xl bg-destructive/10 px-3 py-3 font-semibold text-destructive">Rules Off</span>
            <span className="rounded-2xl bg-muted px-3 py-3 text-muted-foreground">Rules On в Local Duel</span>
          </div>
        </Surface>
      </div>
    </div>
  );
}