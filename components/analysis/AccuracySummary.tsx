"use client";

import { Surface } from "@/components/ui/surface";
import { Badge } from "@/components/ui/badge";
import type { GameAnalysis } from "@/lib/coach/types";

type AccuracySummaryProps = {
  analysis: GameAnalysis;
};

export function AccuracySummary({ analysis }: AccuracySummaryProps) {
  const { whiteAccuracy, blackAccuracy, brilliantMoves, blunders, mistakes, inaccuracies } = analysis;

  return (
    <Surface>
      <h3 className="mb-4 font-display text-xl font-semibold">Точность игры</h3>

      {/* Точность игроков */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">Белые</p>
          <p className="mt-2 font-display text-4xl font-bold">{whiteAccuracy}%</p>
        </div>
        <div className="rounded-2xl bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">Чёрные</p>
          <p className="mt-2 font-display text-4xl font-bold">{blackAccuracy}%</p>
        </div>
      </div>

      {/* Статистика ходов */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Статистика</h4>
        <div className="flex flex-wrap gap-2">
          {brilliantMoves > 0 && (
            <Badge className="bg-cyan-500/20 text-cyan-400">
              ✨ Brilliant: {brilliantMoves}
            </Badge>
          )}
          {inaccuracies > 0 && (
            <Badge className="bg-orange-500/20 text-orange-400">
              ?! Неточности: {inaccuracies}
            </Badge>
          )}
          {mistakes > 0 && (
            <Badge className="bg-orange-600/20 text-orange-600">
              ? Ошибки: {mistakes}
            </Badge>
          )}
          {blunders > 0 && (
            <Badge className="bg-red-600/20 text-red-600">
              ?? Грубые ошибки: {blunders}
            </Badge>
          )}
        </div>
      </div>

      {/* Топ-3 критических момента */}
      {analysis.topMistakes.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 text-sm font-semibold">Топ-3 критических момента</h4>
          <div className="space-y-3">
            {analysis.topMistakes.map((mistake, index) => (
              <div key={index} className="rounded-xl bg-muted/30 p-3 text-sm">
                <div className="mb-1 flex items-center gap-2">
                  <Badge>
                    Ход {mistake.moveNumber}. {mistake.color === "white" ? "Белые" : "Чёрные"}
                  </Badge>
                </div>
                <p className="mb-1">
                  <span className="font-mono text-red-400">{mistake.san}</span>
                  {" → "}
                  <span className="font-mono text-green-400">{mistake.bestMove}</span>
                </p>
                <p className="text-xs text-muted-foreground">{mistake.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Surface>
  );
}
