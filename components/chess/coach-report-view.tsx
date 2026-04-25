import { Badge } from "@/components/ui/badge";
import { Surface } from "@/components/ui/surface";
import type { CoachReport } from "@/types/app";

const labels = {
  best: "лучший",
  excellent: "отлично",
  good: "хорошо",
  inaccuracy: "неточность",
  mistake: "ошибка",
  blunder: "зевок",
};

export function CoachReportView({ report }: { report: CoachReport }) {
  return (
    <Surface>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Разбор партии</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">Проверка ключевых решений</h2>
        </div>
        <div className="rounded-3xl bg-primary/15 px-5 py-3 text-center">
          <p className="text-xs text-muted-foreground">качество</p>
          <p className="font-display text-3xl font-semibold text-primary">{report.quality_score}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-muted-foreground">{report.summary}</p>
      <div className="mt-6 grid gap-3">
        {report.issues.length === 0 ? (
          <div className="rounded-3xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">Ключевых ошибок не найдено.</div>
        ) : (
          report.issues.map((issue) => (
            <div key={`${issue.ply}-${issue.move}`} className="rounded-3xl border border-border bg-card/70 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{labels[issue.classification]}</Badge>
                <span className="text-sm font-semibold">Ход {issue.ply}: {issue.move}</span>
                <span className="text-sm text-muted-foreground">потеря: {issue.lossCp}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{issue.explanation}</p>
              <p className="mt-2 text-sm"><span className="text-muted-foreground">Лучше:</span> <span className="font-semibold">{issue.betterMove}</span></p>
            </div>
          ))
        )}
      </div>
    </Surface>
  );
}
