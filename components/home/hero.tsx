"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Code2, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative -mt-16 min-h-[calc(100svh)] overflow-hidden bg-brand-radial px-4 pt-28 text-white md:px-6">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute left-[55%] top-[18%] hidden size-[520px] rounded-full border border-emerald-300/20 bg-emerald-300/10 blur-3xl lg:block" />
      <div className="relative mx-auto grid min-h-[calc(100svh-7rem)] max-w-7xl items-center gap-10 lg:grid-cols-[0.98fr_1.02fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <p className="font-display text-2xl font-semibold tracking-tight text-emerald-200">Code Gambit</p>
          <h1 className="mt-5 max-w-4xl font-display text-6xl font-semibold leading-[0.95] text-balance md:text-8xl">
            Шахматы как умный product review.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/72 md:text-lg">
            Для разработчиков, студентов и амбициозных игроков: AI Coach объясняет ошибки как code review, а режимы растут от sandbox до realtime multiplayer.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/play/ai" className="inline-flex h-13 items-center justify-center rounded-full bg-emerald-300 px-7 text-base font-semibold text-emerald-950 shadow-glow transition hover:brightness-110">
              Играть с AI <ArrowRight className="ml-2 size-5" />
            </Link>
            <Link href="/play/friend" className="inline-flex h-13 items-center justify-center rounded-full border border-white/18 bg-white/10 px-7 text-base font-semibold backdrop-blur transition hover:bg-white/16">
              Создать комнату
            </Link>
          </div>
        </motion.div>
        <motion.div className="relative pb-10 lg:pb-0" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}>
          <div className="relative mx-auto aspect-square max-w-[620px] rounded-[3rem] border border-white/14 bg-white/8 p-4 shadow-2xl backdrop-blur-xl">
            <div className="grid h-full grid-cols-8 overflow-hidden rounded-[2.2rem]">
              {Array.from({ length: 64 }).map((_, index) => {
                const active = [18, 27, 36, 45].includes(index);
                return <div key={index} className={`${(Math.floor(index / 8) + index) % 2 === 0 ? "bg-emerald-100/90" : "bg-slate-950/84"} ${active ? "relative after:absolute after:inset-3 after:rounded-full after:bg-amber-300/70" : ""}`} />;
              })}
            </div>
            <div className="absolute -bottom-5 left-6 right-6 rounded-[2rem] border border-white/12 bg-slate-950/80 p-4 text-white shadow-soft backdrop-blur">
              <div className="flex items-center gap-3">
                <BrainCircuit className="size-6 text-emerald-300" />
                <p className="text-sm text-white/78">“Это похоже на risky refactor без тестов: король открыт, компенсации нет.”</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-4 top-8 hidden rounded-3xl border border-white/12 bg-white/10 p-4 text-sm backdrop-blur md:block">
            <Sparkles className="mb-2 size-5 text-amber-300" />
            4 уровня в одном продукте
          </div>
          <div className="absolute -left-4 bottom-28 hidden rounded-3xl border border-white/12 bg-white/10 p-4 text-sm backdrop-blur md:block">
            <Code2 className="mb-2 size-5 text-emerald-300" />
            Coach = code review
          </div>
        </motion.div>
      </div>
    </section>
  );
}