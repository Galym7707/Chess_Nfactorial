"use client";

import { Button } from "@/components/ui/button";

const pieces = [
  { code: "q", label: "Ферзь" },
  { code: "r", label: "Ладья" },
  { code: "b", label: "Слон" },
  { code: "n", label: "Конь" },
] as const;

export function PromotionDialog({
  open,
  onSelect,
  onCancel,
}: {
  open: boolean;
  onSelect: (piece: "q" | "r" | "b" | "n") => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-card p-5 shadow-soft">
        <h2 className="font-display text-2xl font-semibold">Выберите promotion</h2>
        <p className="mt-2 text-sm text-muted-foreground">Фигура появится сразу после подтверждения хода.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {pieces.map((piece) => (
            <Button key={piece.code} variant="secondary" onClick={() => onSelect(piece.code)} type="button">
              {piece.label}
            </Button>
          ))}
        </div>
        <Button className="mt-3 w-full" variant="ghost" onClick={onCancel} type="button">
          Отмена
        </Button>
      </div>
    </div>
  );
}