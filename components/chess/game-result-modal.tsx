"use client";

import { Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameResultModalProps {
  open: boolean;
  result: "win" | "loss" | "draw";
  stats: {
    best: number;
    excellent: number;
    good: number;
    inaccuracy: number;
    mistake: number;
    blunder: number;
  };
  onClose: () => void;
}

export function GameResultModal({ open, result, stats, onClose }: GameResultModalProps) {
  if (!open) return null;

  const resultText = {
    win: "Вы выиграли!",
    loss: "Вы проиграли.",
    draw: "Ничья!",
  };

  const resultColor = {
    win: "text-green-600 dark:text-green-400",
    loss: "text-red-600 dark:text-red-400",
    draw: "text-blue-600 dark:text-blue-400",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-accent"
        >
          <X className="size-5" />
        </button>

        <div className="text-center">
          <Trophy className={`mx-auto size-16 ${resultColor[result]}`} />
          <h2 className={`mt-4 font-display text-4xl font-semibold ${resultColor[result]}`}>
            {resultText[result]}
          </h2>

          <div className="mt-6 space-y-2 text-left">
            <p className="text-sm font-semibold text-foreground">Статистика ходов:</p>

            {stats.best > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 px-3 py-2">
                <span className="text-sm text-emerald-700 dark:text-emerald-300">Лучшие ходы</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">{stats.best}</span>
              </div>
            )}

            {stats.excellent > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-green-500/10 px-3 py-2">
                <span className="text-sm text-green-700 dark:text-green-300">Отличные ходы</span>
                <span className="font-semibold text-green-700 dark:text-green-300">{stats.excellent}</span>
              </div>
            )}

            {stats.good > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-blue-500/10 px-3 py-2">
                <span className="text-sm text-blue-700 dark:text-blue-300">Хорошие ходы</span>
                <span className="font-semibold text-blue-700 dark:text-blue-300">{stats.good}</span>
              </div>
            )}

            {stats.inaccuracy > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-yellow-500/10 px-3 py-2">
                <span className="text-sm text-yellow-700 dark:text-yellow-300">Неточности</span>
                <span className="font-semibold text-yellow-700 dark:text-yellow-300">{stats.inaccuracy}</span>
              </div>
            )}

            {stats.mistake > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-orange-500/10 px-3 py-2">
                <span className="text-sm text-orange-700 dark:text-orange-300">Ошибки</span>
                <span className="font-semibold text-orange-700 dark:text-orange-300">{stats.mistake}</span>
              </div>
            )}

            {stats.blunder > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-red-500/10 px-3 py-2">
                <span className="text-sm text-red-700 dark:text-red-300">Зевки</span>
                <span className="font-semibold text-red-700 dark:text-red-300">{stats.blunder}</span>
              </div>
            )}
          </div>

          <Button onClick={onClose} className="mt-6 w-full">
            Посмотреть анализ
          </Button>
        </div>
      </div>
    </div>
  );
}
