"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AnalysisBoard } from "@/components/analysis/AnalysisBoard";
import { MoveList } from "@/components/analysis/MoveList";
import { EvaluationGraph } from "@/components/analysis/EvaluationGraph";
import { CoachTokayev } from "@/components/analysis/CoachTokayev";
import { AccuracySummary } from "@/components/analysis/AccuracySummary";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { analyzeGame } from "@/lib/coach/analyzer";
import type { GameAnalysis, AnalysisDepth } from "@/lib/coach/types";
import type { AnalysisProgress } from "@/lib/coach/analyzer";

// Демо-партия с brilliant move
const DEMO_PGN = `[Event "Demo Game"]
[Site "Slay Gambit"]
[Date "2026.04.27"]
[White "Player"]
[Black "Opponent"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Bd2 Bxd2+
8. Nbxd2 d5 9. exd5 Nxd5 10. Qb3 Nce7 11. O-O O-O 12. Rfe1 c6 13. a4 Qd6
14. a5 Nf6 15. Ne5 Nfd5 16. Qh3 f6 17. Ndf3 fxe5 18. Nxe5 Nf5 19. Qg4 Qf6
20. Rad1 Nde7 21. Ng6 Nxg6 22. Qxg6 Qxg6 23. Bxf7+ 1-0`;

export default function AnalysisDemoPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null);
  const [selectedMoveIndex, setSelectedMoveIndex] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function runAnalysis() {
      try {
        setIsAnalyzing(true);
        setError(null);

        const result = await analyzeGame(DEMO_PGN, "quick", (prog) => {
          setProgress(prog);
        });

        setAnalysis(result);
        setSelectedMoveIndex(0);
      } catch (err) {
        console.error("Analysis error:", err);
        setError(err instanceof Error ? err.message : "Не удалось проанализировать партию");
      } finally {
        setIsAnalyzing(false);
        setProgress(null);
      }
    }

    runAnalysis();
  }, []);

  if (isAnalyzing) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <Surface className="flex flex-col items-center justify-center py-20">
          <Loader2 className="mb-4 size-12 animate-spin text-primary" />
          <h2 className="mb-2 font-display text-2xl font-semibold">Анализируем партию...</h2>
          {progress && (
            <>
              <p className="text-muted-foreground">{progress.message}</p>
              <div className="mt-4 h-2 w-64 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </>
          )}
        </Surface>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <Surface className="py-20 text-center">
          <h2 className="mb-4 font-display text-2xl font-semibold text-destructive">Ошибка анализа</h2>
          <p className="mb-6 text-muted-foreground">{error}</p>
          <Button onClick={() => router.push("/")}>Вернуться на главную</Button>
        </Surface>
      </section>
    );
  }

  if (!analysis) {
    return null;
  }

  const currentMove = selectedMoveIndex !== null ? analysis.moves[selectedMoveIndex] : null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-6">
        <h1 className="font-display text-4xl font-semibold">AI Coach Analysis</h1>
        <p className="mt-2 text-muted-foreground">Демо-анализ партии с Coach Tokayev</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* Левая колонка */}
        <div className="space-y-5">
          <AnalysisBoard
            moves={analysis.moves}
            selectedMoveIndex={selectedMoveIndex}
            onMoveSelect={setSelectedMoveIndex}
          />

          <EvaluationGraph
            moves={analysis.moves}
            selectedMoveIndex={selectedMoveIndex}
            onMoveSelect={setSelectedMoveIndex}
          />

          <MoveList
            moves={analysis.moves}
            selectedMoveIndex={selectedMoveIndex}
            onMoveSelect={setSelectedMoveIndex}
          />
        </div>

        {/* Правая колонка */}
        <div className="space-y-5">
          <CoachTokayev move={currentMove} />
          <AccuracySummary analysis={analysis} />
        </div>
      </div>
    </section>
  );
}
