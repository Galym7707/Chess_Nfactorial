"use client";

import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";

export function GameShell({
  title,
  description,
  board,
  side,
}: {
  title: string;
  description: string;
  board: React.ReactNode;
  side: React.ReactNode;
}) {
  const [focus, setFocus] = useState(false);

  return (
    <section className={cn("mx-auto max-w-7xl px-4 py-6 md:px-6 lg:py-10", focus && "focus-mode")}>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-primary">Slay Gambit</p>
          <h1 className="mt-2 font-display text-4xl font-semibold md:text-6xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">{description}</p>
        </div>
        <Button variant="secondary" onClick={() => setFocus((value) => !value)} type="button">
          {focus ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          {focus ? "Обычный режим" : "Режим концентрации"}
        </Button>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <Surface className="p-3 md:p-5">{board}</Surface>
        <div className="focus-hide grid gap-4">{side}</div>
      </div>
    </section>
  );
}