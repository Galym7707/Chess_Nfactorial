"use client";

import { Bot, FlaskConical, Swords, Users } from "lucide-react";
import { ModeCard } from "./mode-card";

const modes = [
  {
    level: "Слабый",
    title: "Sandbox",
    href: "/play/sandbox",
    icon: FlaskConical,
    description: "Свободная доска без проверки ходов. Подходит для быстрых набросков позиции и объяснений.",
  },
  {
    level: "Средний",
    title: "Local Duel",
    href: "/play/local",
    icon: Swords,
    description: "Партия для двух игроков на одном экране: правила, рокировка, взятие на проходе, превращение пешки и история ходов.",
  },
  {
    level: "Сильный",
    title: "AI Arena",
    href: "/play/ai",
    icon: Bot,
    description: "Игра против компьютера с уровнями сложности, сохранением партий и разбором после завершения.",
  },
  {
    level: "Великий",
    title: "Play with Friend",
    href: "/play/friend",
    icon: Users,
    description: "Комната по ссылке для игры с другом: ходы синхронизируются, статус игроков виден сразу.",
  },
];

export function ModeGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.32em] text-primary">Режимы</p>
        <h2 className="mt-4 font-display text-4xl font-semibold md:text-6xl">Выберите формат игры</h2>
        <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
          В одном сайте есть свободная доска, партия вдвоем, игра против компьютера и комната для друга по ссылке.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modes.map((mode) => <ModeCard key={mode.href} {...mode} />)}
      </div>
    </section>
  );
}
