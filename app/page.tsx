import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { LeaderboardPreview } from "@/components/home/leaderboard-preview";
import { ModeGrid } from "@/components/home/mode-grid";
import { ProductLayer } from "@/components/home/product-layer";
import { AICoachPreview } from "@/components/home/AICoachPreview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ModeGrid />
      <AICoachPreview />
      <ProductLayer />
      <LeaderboardPreview />
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="rounded-[2.5rem] bg-paper-radial p-8 text-stone-950 md:p-12">
          <p className="text-sm uppercase tracking-[0.32em] text-teal-700">Pro</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold md:text-6xl">Больше тем доски и глубже разбор партий</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-700 md:text-base">
            Pro открывает премиальные оформления доски, расширенный анализ партии и выделение профиля. Если платежные ключи не добавлены, сайт показывает аккуратный демо-режим без ошибок запуска.
          </p>
          <Link href="/pricing" className="mt-8 inline-flex h-13 items-center justify-center rounded-full bg-stone-950 px-7 text-base font-semibold text-white transition hover:brightness-110">Перейти на Pro</Link>
        </div>
      </section>
    </>
  );
}
