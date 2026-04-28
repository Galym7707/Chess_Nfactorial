"use client";

import { cn } from "@/lib/utils";

interface AdvantageBarProps {
  evaluation: number; // В пешках, положительное = преимущество белых
  className?: string;
}

export function AdvantageBar({ evaluation, className }: AdvantageBarProps) {
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
    <div className={cn("w-full", className)}>
      {/* Горизонтальная шкала преимущества */}
      <div className="relative h-8 w-full overflow-hidden rounded-lg bg-slate-900">
        {/* Белая часть (преимущество белых) */}
        <div
          className="absolute left-0 top-0 h-full bg-slate-50 transition-all duration-300"
          style={{ width: `${whitePercentage}%` }}
        />

        {/* Центральная линия */}
        <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-slate-400/50" />

        {/* Текст оценки */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className={cn(
            "rounded px-2 py-0.5 text-xs font-bold tabular-nums shadow-sm",
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

      {/* Подписи */}
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>Черные</span>
        <span>Белые</span>
      </div>
    </div>
  );
}
