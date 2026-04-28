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

  return (
    <div className="grid gap-3">
      <div
        className={cn(
          "rounded-2xl border-2 p-4 transition-all",
          activeColor === "black" ? "border-primary bg-primary/5" : "border-border bg-card",
          blackIsLow && "border-destructive bg-destructive/5"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">Чёрные</span>
          </div>
          <div
            className={cn(
              "font-mono text-2xl font-bold tabular-nums",
              blackIsLow && "text-destructive"
            )}
          >
            {formatTime(blackTime)}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "rounded-2xl border-2 p-4 transition-all",
          activeColor === "white" ? "border-primary bg-primary/5" : "border-border bg-card",
          whiteIsLow && "border-destructive bg-destructive/5"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">Белые</span>
          </div>
          <div
            className={cn(
              "font-mono text-2xl font-bold tabular-nums",
              whiteIsLow && "text-destructive"
            )}
          >
            {formatTime(whiteTime)}
          </div>
        </div>
      </div>
    </div>
  );
}
