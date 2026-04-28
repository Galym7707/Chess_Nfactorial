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

const classificationColors = {
  best: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  excellent: "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
  good: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
  inaccuracy: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
  mistake: "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30",
  blunder: "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30",
};

const classificationBorderColors = {
  best: "border-emerald-500/40",
  excellent: "border-green-500/40",
  good: "border-blue-500/40",
  inaccuracy: "border-yellow-500/40",
  mistake: "border-orange-500/40",
  blunder: "border-red-500/40",
};

export function CoachReportView({ report }: { report: CoachReport }) {
  return (
    <Surface>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/50">
            <img
              src="/tokayev.jpg"
              alt="Coach Tokayev"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Разбор партии</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Проверка ключевых решений</h2>
          </div>
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
          report.issues.map((issue, index) => (
            <div
              key={`${issue.ply}-${issue.move}`}
              className={`rounded-3xl border bg-card/70 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${classificationBorderColors[issue.classification]}`}
              style={{
                animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={classificationColors[issue.classification]}>{labels[issue.classification]}</Badge>
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
