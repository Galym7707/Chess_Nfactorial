import { BrainCircuit, Crosshair, LineChart, ShieldCheck } from "lucide-react";

const features = [
  [BrainCircuit, "AI Coach как code review", "Ошибки классифицируются как best, good, mistake или blunder, с объяснением и альтернативной линией."],
  [Crosshair, "Режим концентрации", "В игровых режимах можно убрать боковую панель и оставить только доску и критичный статус."],
  [LineChart, "Growth-oriented профиль", "Профиль показывает город, рейтинг, win rate, историю и прогресс без лишнего шума."],
  [ShieldCheck, "Realtime без хаоса", "Комнаты держат version в базе, чтобы не принимать устаревшие ходы при reconnect."],
] as const;

export function ProductLayer() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="sticky top-24">
          <p className="text-sm uppercase tracking-[0.32em] text-primary">Why different</p>
          <h2 className="mt-4 font-display text-4xl font-semibold md:text-6xl">Не клон обычного шахматного сайта</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
            Code Gambit соединяет шахматы, инженерное мышление и SaaS UX: не просто “ходи фигурами”, а понимай качество решений.
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