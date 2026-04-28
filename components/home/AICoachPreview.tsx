"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { Badge } from "@/components/ui/badge";
import { generatePreviewExplanation } from "@/lib/coach/explanations";

export function AICoachPreview() {
  const explanation = generatePreviewExplanation();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="text-center">
        <Badge className="mb-4 bg-cyan-500/20 text-cyan-400">
          <Sparkles className="mr-1 size-3" />
          Премиум функция
        </Badge>
        <h2 className="font-display text-4xl font-bold md:text-5xl">AI Coach Analysis</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Получи детальный анализ своих партий от Coach Tokayev
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* Brilliant move board image */}
        <Surface className="relative overflow-hidden p-6">
          <div className="aspect-square w-full overflow-hidden rounded-2xl">
            <img
              src="/brilliant-move.webp"
              alt="Brilliant Move Example"
              className="h-full w-full object-cover"
            />
          </div>
        </Surface>

        {/* Coach Tokayev preview */}
        <div className="flex flex-col justify-center">
          <Surface className="relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/50">
                <img
                  src="/tokayev.jpg"
                  alt="Coach Tokayev"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-display text-2xl font-semibold">Coach Tokayev</h3>
                <Badge className="mt-2 bg-cyan-500/20 text-cyan-400">Brilliant</Badge>

                {/* Speech bubble */}
                <div className="mt-4 rounded-2xl bg-muted/50 p-4 leading-relaxed">
                  <p>{explanation}</p>
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                  Вымышленный пародийный тренер. Не связан с реальным человеком или государственными органами.
                </p>
              </div>
            </div>

            {/* Декоративный элемент */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 animate-pulse rounded-full bg-cyan-500/10 blur-3xl" />
          </Surface>

          {/* Фичи */}
          <div className="mt-6 grid gap-3">
            <div className="flex items-start gap-3 rounded-xl bg-muted/30 p-3">
              <div className="text-2xl">✨</div>
              <div>
                <p className="font-semibold">Brilliant moves</p>
                <p className="text-sm text-muted-foreground">Находи тактические жертвы и комбинации</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-muted/30 p-3">
              <div className="text-2xl">📊</div>
              <div>
                <p className="font-semibold">Точность игры</p>
                <p className="text-sm text-muted-foreground">Оценка каждого хода и общая точность</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-muted/30 p-3">
              <div className="text-2xl">💡</div>
              <div>
                <p className="font-semibold">Объяснения тренера</p>
                <p className="text-sm text-muted-foreground">Понятные комментарии к каждому ходу</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link href="/analysis/demo" className="mt-6">
            <Button size="lg" className="w-full">
              <Sparkles className="mr-2 size-4" />
              Try AI Analysis
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
