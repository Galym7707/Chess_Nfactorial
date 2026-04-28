"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { formatTime } from "@/lib/chess/time-control";
import { cn } from "@/lib/utils";

interface ChessTimerProps {
  whiteTimeMs: number;
  blackTimeMs: number;
  activeColor: "white" | "black" | null;
  onTimeExpired?: (color: "white" | "black") => void;
}

export function ChessTimer({ whiteTimeMs, blackTimeMs, activeColor, onTimeExpired }: ChessTimerProps) {
  const [whiteTime, setWhiteTime] = useState(whiteTimeMs);
  const [blackTime, setBlackTime] = useState(blackTimeMs);

  useEffect(() => {
    setWhiteTime(whiteTimeMs);
    setBlackTime(blackTimeMs);
  }, [whiteTimeMs, blackTimeMs]);

  useEffect(() => {
    if (!activeColor) return;

    const interval = setInterval(() => {
      if (activeColor === "white") {
        setWhiteTime((prev) => {
          const next = Math.max(0, prev - 100);
          if (next === 0 && onTimeExpired) {
            onTimeExpired("white");
          }
          return next;
        });
      } else {
        setBlackTime((prev) => {
          const next = Math.max(0, prev - 100);
          if (next === 0 && onTimeExpired) {
            onTimeExpired("black");
          }
          return next;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeColor, onTimeExpired]);

  const whiteIsLow = whiteTime < 30000;
  const blackIsLow = blackTime < 30000;
  const whiteIsVeryLow = whiteTime < 10000;
  const blackIsVeryLow = blackTime < 10000;

  return (
    <div className="grid gap-3">
      <div
        className={cn(
          "rounded-2xl border-2 p-4 transition-all",
          activeColor === "black"
            ? "border-green-500 bg-green-500/10 shadow-lg"
            : "border-border bg-card",
          blackIsVeryLow && "animate-pulse border-red-600 bg-red-600/20",
          blackIsLow && !blackIsVeryLow && "border-orange-500 bg-orange-500/10"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className={cn(
              "size-4",
              activeColor === "black" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-sm font-semibold",
              activeColor === "black" ? "text-green-700 dark:text-green-300" : "text-muted-foreground"
            )}>Чёрные</span>
          </div>
          <div
            className={cn(
              "font-mono text-2xl font-bold tabular-nums",
              blackIsVeryLow && "text-red-600 dark:text-red-400",
              blackIsLow && !blackIsVeryLow && "text-orange-600 dark:text-orange-400",
              !blackIsLow && activeColor === "black" && "text-green-600 dark:text-green-400"
            )}
          >
            {formatTime(blackTime)}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "rounded-2xl border-2 p-4 transition-all",
          activeColor === "white"
            ? "border-green-500 bg-green-500/10 shadow-lg"
            : "border-border bg-card",
          whiteIsVeryLow && "animate-pulse border-red-600 bg-red-600/20",
          whiteIsLow && !whiteIsVeryLow && "border-orange-500 bg-orange-500/10"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className={cn(
              "size-4",
              activeColor === "white" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-sm font-semibold",
              activeColor === "white" ? "text-green-700 dark:text-green-300" : "text-muted-foreground"
            )}>Белые</span>
          </div>
          <div
            className={cn(
              "font-mono text-2xl font-bold tabular-nums",
              whiteIsVeryLow && "text-red-600 dark:text-red-400",
              whiteIsLow && !whiteIsVeryLow && "text-orange-600 dark:text-orange-400",
              !whiteIsLow && activeColor === "white" && "text-green-600 dark:text-green-400"
            )}
          >
            {formatTime(whiteTime)}
          </div>
        </div>
      </div>
    </div>
  );
}
