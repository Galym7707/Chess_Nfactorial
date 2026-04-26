import { Badge } from "@/components/ui/badge";
import type { ChessStatus } from "@/lib/chess/core";

export function GameStatus({ status }: { status: ChessStatus }) {
  return (
    <div className="rounded-3xl border border-border bg-card/70 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={status.gameOver ? "border-accent/40 text-accent" : status.inCheck ? "border-destructive/40 text-destructive" : ""}>
          {status.gameOver ? "Конец партии" : status.inCheck ? "Шах" : "Игра"}
        </Badge>
        <span className="text-sm font-semibold">{status.label}</span>
      </div>
    </div>
  );
}
