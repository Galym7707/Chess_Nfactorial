"use client";

import { useState } from "react";
import { Clock, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";

interface CustomTimeControlProps {
  onSelect: (minutes: number, increment: number) => void;
  onClose: () => void;
}

export function CustomTimeControl({ onSelect, onClose }: CustomTimeControlProps) {
  const [minutes, setMinutes] = useState(10);
  const [increment, setIncrement] = useState(0);

  const adjustMinutes = (delta: number) => {
    setMinutes((prev) => Math.max(0.5, Math.min(180, prev + delta)));
  };

  const adjustIncrement = (delta: number) => {
    setIncrement((prev) => Math.max(0, Math.min(60, prev + delta)));
  };

  return (
    <Surface className="p-6">
      <h3 className="mb-6 font-display text-2xl font-semibold">Настроить время</h3>

      {/* Minutes */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-muted-foreground">
          Минуты на игру
        </label>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => adjustMinutes(-1)}
            type="button"
          >
            <Minus className="size-4" />
          </Button>
          <div className="flex-1 text-center">
            <div className="text-4xl font-bold tabular-nums">{minutes}</div>
            <div className="text-xs text-muted-foreground">минут</div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => adjustMinutes(1)}
            type="button"
          >
            <Plus className="size-4" />
          </Button>
        </div>
        <div className="mt-3 flex gap-2">
          {[0.5, 1, 3, 5, 10, 15, 30].map((min) => (
            <button
              key={min}
              onClick={() => setMinutes(min)}
              className={cn(
                "rounded-lg border px-3 py-1 text-sm transition-all",
                minutes === min
                  ? "border-primary bg-primary/10 font-semibold"
                  : "border-border hover:border-primary/50"
              )}
              type="button"
            >
              {min}
            </button>
          ))}
        </div>
      </div>

      {/* Increment */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-muted-foreground">
          Добавка за ход (секунды)
        </label>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => adjustIncrement(-1)}
            type="button"
          >
            <Minus className="size-4" />
          </Button>
          <div className="flex-1 text-center">
            <div className="text-4xl font-bold tabular-nums">{increment}</div>
            <div className="text-xs text-muted-foreground">секунд</div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => adjustIncrement(1)}
            type="button"
          >
            <Plus className="size-4" />
          </Button>
        </div>
        <div className="mt-3 flex gap-2">
          {[0, 1, 2, 3, 5, 10, 15].map((inc) => (
            <button
              key={inc}
              onClick={() => setIncrement(inc)}
              className={cn(
                "rounded-lg border px-3 py-1 text-sm transition-all",
                increment === inc
                  ? "border-primary bg-primary/10 font-semibold"
                  : "border-border hover:border-primary/50"
              )}
              type="button"
            >
              {inc}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="mb-6 rounded-xl bg-muted/30 p-4 text-center">
        <Clock className="mx-auto mb-2 size-6 text-primary" />
        <div className="font-mono text-2xl font-bold">
          {minutes}+{increment}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          {minutes} минут с добавкой {increment} секунд за ход
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onClose} className="flex-1" type="button">
          Отмена
        </Button>
        <Button
          onClick={() => onSelect(minutes, increment)}
          className="flex-1"
          type="button"
        >
          Применить
        </Button>
      </div>
    </Surface>
  );
}
