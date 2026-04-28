"use client";

import { cn } from "@/lib/utils";

interface EvaluationBarProps {
  evaluation: number; // В пешках, положительное = преимущество белых
  className?: string;
}

export function EvaluationBar({ evaluation, className }: EvaluationBarProps) {
  // Ограничиваем оценку от -10 до +10 для визуализации
  const clampedEval = Math.max(-10, Math.min(10, evaluation));

  // Преобразуем оценку в процент (0-100%)
  // -10 = 0%, 0 = 50%, +10 = 100%
  const whitePercentage = ((clampedEval + 10) / 20) * 100;

  // Форматируем текст оценки
  const evalText = evaluation > 0
    ? `+${evaluation.toFixed(1)}`
    : evaluation < 0
    ? evaluation.toFixed(1)
    : "0.0";

  // Определяем, показывать ли мат
  const isMate = Math.abs(evaluation) > 100;
  const mateIn = isMate ? Math.abs(Math.round(evaluation - (evaluation > 0 ? 100 : -100))) : 0;

  return (
    <div className={cn("relative flex h-full w-8 flex-col overflow-hidden rounded-lg", className)}>
      {/* Чёрная часть (преимущество чёрных) */}
      <div
        className="bg-slate-900 transition-all duration-300"
        style={{ height: `${100 - whitePercentage}%` }}
      />

      {/* Белая часть (преимущество белых) */}
      <div
        className="bg-slate-50 transition-all duration-300"
        style={{ height: `${whitePercentage}%` }}
      />

      {/* Текст оценки */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className={cn(
          "rounded px-1.5 py-0.5 text-xs font-bold tabular-nums shadow-sm",
          whitePercentage > 50 ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"
        )}>
          {isMate ? (
            <span>M{mateIn}</span>
          ) : (
            <span>{evalText}</span>
          )}
        </div>
      </div>
    </div>
  );
}
