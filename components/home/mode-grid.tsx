"use client";

import { Bot, Edit3, Swords, Users } from "lucide-react";
import { ModeCard } from "./mode-card";

const tools = [
  {
    eyebrow: "Позиции",
    title: "Редактор позиции",
    href: "/play/sandbox",
    icon: Edit3,
    description: "Расставляйте фигуры, меняйте сторону хода, копируйте FEN и запускайте быстрый анализ Stockfish.",
  },
  {
    eyebrow: "За доской",
    title: "Партия вдвоем",
    href: "/play/local",
    icon: Swords,
    description: "Полная шахматная партия на одном экране: правила, рокировка, взятие на проходе, превращение, мат и ничьи.",
  },
  {
    eyebrow: "Тренировка",
    title: "Игра против движка",
    href: "/play/ai",
    icon: Bot,
    description: "Партия против Stockfish с настройкой силы, сохранением результата и разбором после завершения.",
  },
  {
    eyebrow: "Онлайн",
    title: "Игра с другом",
    href: "/play/friend",
    icon: Users,
    description: "Создайте комнату, отправьте ссылку и играйте на одной позиции с восстановлением партии после переподключения.",
  },
];

export function ModeGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.32em] text-primary">Инструменты</p>
        <h2 className="mt-4 font-display text-4xl font-semibold md:text-6xl">Все для партии и анализа</h2>
        <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
          На одной площадке есть редактор позиций, анализ движком, игра за одной доской, тренировка против Stockfish и онлайн-партия по ссылке.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tools.map((tool) => <ModeCard key={tool.href} {...tool} />)}
      </div>
    </section>
  );
}
