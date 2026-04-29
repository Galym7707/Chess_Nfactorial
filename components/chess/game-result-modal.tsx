"use client";

import { useEffect, useState } from "react";
import { Trophy, X, RotateCcw, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playVictorySound, playDefeatSound, playDrawSound } from "@/lib/chess/sounds";

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
  accuracy?: number;
  onClose: () => void;
  onRematch?: () => void;
  onAnalyze?: () => void;
}

export function GameResultModal({ open, result, stats, accuracy, onClose, onRematch, onAnalyze }: GameResultModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (open) {
      // Play appropriate sound based on result
      if (result === "win") {
        playVictorySound();
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
      } else if (result === "loss") {
        playDefeatSound();
      } else {
        playDrawSound();
      }
    }
  }, [open, result]);

  if (!open) return null;

  const resultText = {
    win: "Победа!",
    loss: "Поражение",
    draw: "Ничья!",
  };

  const resultEmoji = {
    win: "🏆",
    loss: "😔",
    draw: "🤝",
  };

  const resultColor = {
    win: "text-green-600 dark:text-green-400",
    loss: "text-red-600 dark:text-red-400",
    draw: "text-blue-600 dark:text-blue-400",
  };

  const resultBg = {
    win: "bg-green-500/10",
    loss: "bg-red-500/10",
    draw: "bg-blue-500/10",
  };

  const totalMoves = Object.values(stats).reduce((sum, count) => sum + count, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      {/* Confetti effect for wins */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className={`relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl ${resultBg[result]} animate-in zoom-in-95 duration-300`}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 transition hover:bg-accent"
          type="button"
        >
          <X className="size-5" />
        </button>

        <div className="text-center">
          <div className="text-6xl mb-2">{resultEmoji[result]}</div>
          <h2 className={`font-display text-5xl font-bold ${resultColor[result]}`}>
            {resultText[result]}
          </h2>

          {accuracy !== undefined && (
            <div className="mt-6 rounded-2xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Точность игры</p>
              <p className="mt-1 font-display text-4xl font-bold text-primary">{accuracy}%</p>
            </div>
          )}

          <div className="mt-6 space-y-2 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="size-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Статистика ходов ({totalMoves} ходов)</p>
            </div>

            <div className="space-y-1.5">
              {stats.best > 0 && (
                <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-3 py-2.5 border border-emerald-500/20">
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">✨ Лучшие</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">{stats.best}</span>
                </div>
              )}

              {stats.excellent > 0 && (
                <div className="flex items-center justify-between rounded-xl bg-green-500/10 px-3 py-2.5 border border-green-500/20">
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">👍 Отличные</span>
                  <span className="font-bold text-green-700 dark:text-green-300">{stats.excellent}</span>
                </div>
              )}

              {stats.good > 0 && (
                <div className="flex items-center justify-between rounded-xl bg-blue-500/10 px-3 py-2.5 border border-blue-500/20">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">👌 Хорошие</span>
                  <span className="font-bold text-blue-700 dark:text-blue-300">{stats.good}</span>
                </div>
              )}

              {stats.inaccuracy > 0 && (
                <div className="flex items-center justify-between rounded-xl bg-yellow-500/10 px-3 py-2.5 border border-yellow-500/20">
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">⚠️ Неточности</span>
                  <span className="font-bold text-yellow-700 dark:text-yellow-300">{stats.inaccuracy}</span>
                </div>
              )}

              {stats.mistake > 0 && (
                <div className="flex items-center justify-between rounded-xl bg-orange-500/10 px-3 py-2.5 border border-orange-500/20">
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">❌ Ошибки</span>
                  <span className="font-bold text-orange-700 dark:text-orange-300">{stats.mistake}</span>
                </div>
              )}

              {stats.blunder > 0 && (
                <div className="flex items-center justify-between rounded-xl bg-red-500/10 px-3 py-2.5 border border-red-500/20">
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">💥 Зевки</span>
                  <span className="font-bold text-red-700 dark:text-red-300">{stats.blunder}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-2">
            {onAnalyze && (
              <Button onClick={onAnalyze} className="w-full" type="button">
                <BarChart3 className="size-4" />
                Посмотреть анализ
              </Button>
            )}
            {onRematch && (
              <Button onClick={onRematch} variant="secondary" className="w-full" type="button">
                <RotateCcw className="size-4" />
                Реванш
              </Button>
            )}
            {!onAnalyze && !onRematch && (
              <Button onClick={onClose} className="w-full" type="button">
                Закрыть
              </Button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
}
