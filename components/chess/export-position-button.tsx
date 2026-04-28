"use client";

import { useState } from "react";
import { Image, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportPositionButton({ fen }: { fen: string }) {
  const [exporting, setExporting] = useState(false);

  async function exportPosition() {
    setExporting(true);
    try {
      // Create a simple board visualization
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Draw board
      const squareSize = 100;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          ctx.fillStyle = (row + col) % 2 === 0 ? "#f0d9b5" : "#b58863";
          ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
        }
      }

      // Add border
      ctx.strokeStyle = "#8b7355";
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, 800, 800);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `chess-position-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } finally {
      setExporting(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={exportPosition}
      disabled={exporting || !fen}
      className="w-full"
    >
      {exporting ? (
        <>
          <Download className="size-4 animate-pulse" /> Экспорт...
        </>
      ) : (
        <>
          <Image className="size-4" /> Экспорт позиции
        </>
      )}
    </Button>
  );
}
