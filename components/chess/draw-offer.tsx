"use client";

import { Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DrawOfferProps {
  canOffer: boolean;
  onOffer: () => void;
  pendingOffer?: boolean;
}

export function DrawOffer({ canOffer, onOffer, pendingOffer }: DrawOfferProps) {
  if (pendingOffer) {
    return (
      <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4">
        <div className="flex items-center gap-3">
          <Handshake className="size-5 text-blue-600 dark:text-blue-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Предложение ничьей отправлено
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Ожидание ответа соперника
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onOffer}
      disabled={!canOffer}
      className="w-full"
    >
      <Handshake className="size-4" /> Предложить ничью
    </Button>
  );
}
