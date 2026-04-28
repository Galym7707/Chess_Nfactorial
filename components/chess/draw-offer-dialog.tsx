"use client";

import { Handshake, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DrawOfferDialogProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function DrawOfferDialog({ open, onAccept, onDecline }: DrawOfferDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <div className="text-center">
          <Handshake className="mx-auto size-16 text-blue-600 dark:text-blue-400" />
          <h2 className="mt-4 font-display text-2xl font-semibold">
            Предложение ничьей
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ваш соперник предлагает завершить партию ничьей
          </p>

          <div className="mt-6 flex gap-3">
            <Button
              variant="secondary"
              onClick={onDecline}
              className="flex-1"
            >
              <X className="size-4" /> Отклонить
            </Button>
            <Button
              onClick={onAccept}
              className="flex-1"
            >
              <Check className="size-4" /> Принять
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
