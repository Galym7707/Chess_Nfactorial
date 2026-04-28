"use client";

import { Flag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ResignButtonProps {
  onResign: () => void;
  disabled?: boolean;
}

export function ResignButton({ onResign, disabled }: ResignButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
        <p className="text-sm font-semibold text-red-700 dark:text-red-300">
          Вы уверены что хотите сдаться?
        </p>
        <div className="mt-3 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowConfirm(false)}
            className="flex-1"
          >
            <X className="size-4" /> Отмена
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onResign();
              setShowConfirm(false);
            }}
            className="flex-1"
          >
            <Flag className="size-4" /> Сдаться
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setShowConfirm(true)}
      disabled={disabled}
      className="w-full text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400"
    >
      <Flag className="size-4" /> Сдаться
    </Button>
  );
}
