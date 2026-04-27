"use client";

import { Badge } from "@/components/ui/badge";
import { Surface } from "@/components/ui/surface";
import type { AnalyzedMove } from "@/lib/coach/types";
import { getClassificationColor, getClassificationLabel } from "@/lib/coach/classifier";

type CoachTokayevProps = {
  move: AnalyzedMove | null;
  isDemo?: boolean;
};

export function CoachTokayev({ move, isDemo = false }: CoachTokayevProps) {
  const explanation = isDemo
    ? "Базар Джексон, ты молодец! Это brilliant ход, потому что ты нашёл сильную тактическую идею и получил решающее преимущество."
    : move?.explanation || "Выбери ход, чтобы увидеть анализ.";

  const classification = isDemo ? "brilliant" : move?.classification;

  return (
    <Surface className="relative overflow-hidden">
      {/* Аватар Coach Tokayev */}
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/50 bg-gradient-to-br from-primary/20 to-primary/5">
          <div className="flex h-full w-full items-center justify-center text-3xl">
            🎓
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl font-semibold">Coach Tokayev</h3>
            {classification && (
              <Badge className={getClassificationColor(classification)}>
                {getClassificationLabel(classification)}
              </Badge>
            )}
          </div>

          {/* Speech bubble */}
          <div className="mt-3 rounded-2xl bg-muted/50 p-4 text-sm leading-relaxed">
            <p>{explanation}</p>
          </div>

          {/* Disclaimer */}
          <p className="mt-3 text-xs text-muted-foreground">
            Вымышленный пародийный тренер. Не связан с реальным человеком или государственными органами.
          </p>
        </div>
      </div>

      {/* Декоративный элемент для brilliant moves */}
      {classification === "brilliant" && (
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 animate-pulse rounded-full bg-cyan-500/10 blur-3xl" />
      )}
    </Surface>
  );
}
