import { BarChart3, BrainCircuit, Edit3, ShieldCheck } from "lucide-react";

const features = [
  [BarChart3, "Анализ позиции", "Stockfish показывает оценку, лучший ход и короткую линию продолжения прямо в браузере."],
  [Edit3, "Редактор доски", "Можно быстро собрать учебную позицию, сменить сторону хода, очистить доску или скопировать FEN."],
  [BrainCircuit, "Разбор партии", "После игры сервис выделяет ключевые ошибки, объясняет, где позиция ухудшилась, и предлагает более сильный план."],
  [ShieldCheck, "Онлайн-партия", "Комната сохраняет последнюю позицию и восстанавливает игру, если один из игроков переподключился."],
] as const;

export function ProductLayer() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="sticky top-24">
          <p className="text-sm uppercase tracking-[0.32em] text-primary">Возможности</p>
          <h2 className="mt-4 font-display text-4xl font-semibold md:text-6xl">Рабочее место шахматиста</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
            Slay Gambit помогает не только сыграть партию, но и разобрать позицию, проверить варианты и сохранить прогресс.
          </p>
        </div>
        <div className="grid gap-3">
          {features.map(([Icon, title, description]) => (
            <div key={title} className="rounded-[2rem] border border-border bg-card/60 p-5 transition hover:border-primary/40">
              <Icon className="size-6 text-primary" />
              <h3 className="mt-5 font-display text-2xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
