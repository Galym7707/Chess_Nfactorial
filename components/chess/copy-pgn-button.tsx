"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyPgnButton({ pgn }: { pgn: string }) {
  const [copied, setCopied] = useState(false);

  async function copyPgn() {
    if (!pgn) return;
    await navigator.clipboard.writeText(pgn);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={copyPgn}
      disabled={!pgn}
      className="w-full"
    >
      {copied ? (
        <>
          <Check className="size-4" /> Скопировано
        </>
      ) : (
        <>
          <Copy className="size-4" /> Копировать PGN
        </>
      )}
    </Button>
  );
}
