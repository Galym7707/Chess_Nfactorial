"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function GameDuration({ startTime }: { startTime: number }) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="size-4" />
      <span>{minutes}:{seconds.toString().padStart(2, "0")}</span>
    </div>
  );
}
