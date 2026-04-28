"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, BrainCircuit, Link2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative -mt-16 min-h-[calc(100svh)] overflow-hidden px-4 pt-28 md:px-6">
      <div className="relative mx-auto grid min-h-[calc(100svh-7rem)] max-w-7xl items-center gap-10 lg:grid-cols-[0.98fr_1.02fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <p className="font-display text-2xl font-semibold tracking-tight text-primary">Code Gambit</p>
          <h1 className="mt-5 max-w-4xl font-display text-6xl font-semibold leading-[0.95] text-balance md:text-8xl">
            Шахматы для игры, анализа и роста.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
            Редактор позиций, анализ Stockfish, партии за одной доской и онлайн-игра по ссылке в одном аккуратном сервисе.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/play" className="inline-flex h-13 items-center justify-center rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground transition hover:opacity-90">
              Играть <ArrowRight className="ml-2 size-5" />
            </Link>
            <Link href="/play/friend" className="inline-flex h-13 items-center justify-center rounded-full border border-border bg-card px-7 text-base font-semibold transition hover:bg-accent">
              <Link2 className="mr-2 size-5" /> Играть с другом
            </Link>
          </div>
        </motion.div>
        <motion.div className="relative pb-10 lg:pb-0" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}>
          <div className="relative mx-auto aspect-square max-w-[620px] rounded-3xl border border-border bg-card p-4 shadow-lg">
            <div className="grid h-full grid-cols-8 overflow-hidden rounded-2xl">
              {Array.from({ length: 64 }).map((_, index) => {
                const active = [18, 27, 36, 45].includes(index);
                return <div key={index} className={`${(Math.floor(index / 8) + index) % 2 === 0 ? "bg-emerald-100" : "bg-slate-700"} ${active ? "relative after:absolute after:inset-3 after:rounded-full after:bg-amber-400" : ""}`} />;
              })}
            </div>
            <div className="absolute -bottom-5 left-6 right-6 rounded-2xl border border-border bg-card p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <BrainCircuit className="size-6 text-primary" />
                <p className="text-sm text-muted-foreground">"Король раскрыт, компенсации нет. Надежнее было сначала укрепить позицию."</p>
              </div>
            </div>
          </div>
          <div className="absolute -left-4 bottom-28 hidden rounded-2xl border border-border bg-card p-4 text-sm shadow-md md:block">
            <BarChart3 className="mb-2 size-5 text-primary" />
            Оценка Stockfish: +0.72
          </div>
        </motion.div>
      </div>
    </section>
  );
}
