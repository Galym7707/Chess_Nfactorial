"use client";

import { useState, useMemo, useEffect } from "react";
import { Chess } from "chess.js";
import { ChevronLeft, ChevronRight, SkipBack, SkipForward, Brain } from "lucide-react";
import { ChessboardView } from "@/components/chess/chessboard-view";
import { AdvantageBar } from "@/components/chess/advantage-bar";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { useStockfish } from "@/hooks/use-stockfish";
import type { AnalyzedMove } from "@/lib/coach/types";
import type { BoardTheme } from "@/types/app";

type AnalysisBoardProps = {
  moves: AnalyzedMove[];
  selectedMoveIndex: number | null;
  onMoveSelect: (index: number) => void;
  theme?: BoardTheme;
};

export function AnalysisBoard({ moves, selectedMoveIndex, onMoveSelect, theme = "classic" }: AnalysisBoardProps) {
  const currentMove = selectedMoveIndex !== null ? moves[selectedMoveIndex] : null;
  const fen = currentMove?.fenAfter || moves[0]?.fenBefore || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const { ready, analyzeFen } = useStockfish();

  // Загружаем сохраненное состояние toggle из localStorage
  const [stockfishEnabled, setStockfishEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('slay-gambit:stockfish-enabled');
    return saved === 'true';
  });

  const [liveEval, setLiveEval] = useState<number | null>(null);
  const [bestMove, setBestMove] = useState<string | null>(null);

  const canGoPrevious = selectedMoveIndex !== null && selectedMoveIndex > 0;
  const canGoNext = selectedMoveIndex !== null && selectedMoveIndex < moves.length - 1;

  // Сохраняем состояние toggle в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('slay-gambit:stockfish-enabled', String(stockfishEnabled));
  }, [stockfishEnabled]);

  // Анализ текущей позиции при включенном Stockfish
  useEffect(() => {
    if (!stockfishEnabled || !ready) {
      setLiveEval(null);
      setBestMove(null);
      return;
    }

    let cancelled = false;

    analyzeFen(fen, { depth: 15, movetime: 1000 })
      .then((analysis) => {
        if (!cancelled) {
          setLiveEval(analysis.scoreCp / 100);
          setBestMove(analysis.bestMove);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLiveEval(null);
          setBestMove(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fen, stockfishEnabled, ready, analyzeFen]);

  // Определяем оценку для отображения
  const displayEval = stockfishEnabled && liveEval !== null ? liveEval : (currentMove ? currentMove.scoreAfter / 100 : 0);

  // Преобразуем bestMove в стрелку для доски
  const bestMoveArrow = bestMove ? {
    from: bestMove.slice(0, 2),
    to: bestMove.slice(2, 4)
  } : null;

  function goToStart() {
    onMoveSelect(0);
  }

  function goPrevious() {
    if (canGoPrevious && selectedMoveIndex !== null) {
      onMoveSelect(selectedMoveIndex - 1);
    }
  }

  function goNext() {
    if (canGoNext && selectedMoveIndex !== null) {
      onMoveSelect(selectedMoveIndex + 1);
    }
  }

  function goToEnd() {
    onMoveSelect(moves.length - 1);
  }

  return (
    <Surface className="p-3 md:p-5">
      {/* Coach Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/50">
            <img
              src="/tokayev.jpg"
              alt="Coach Tokayev"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider text-primary">Анализ позиции</p>
            <p className="text-sm text-muted-foreground truncate">Coach Tokayev</p>
          </div>
        </div>
        <Button
          variant={stockfishEnabled ? "primary" : "secondary"}
          size="sm"
          onClick={() => setStockfishEnabled(!stockfishEnabled)}
          disabled={!ready}
          type="button"
          className="gap-2 w-full sm:w-auto"
        >
          <Brain className="size-4" />
          {stockfishEnabled ? "Stockfish ON" : "Stockfish OFF"}
        </Button>
      </div>

      {/* Advantage Bar */}
      <AdvantageBar evaluation={displayEval} className="mb-4" />

      {/* Board */}
      <div className="flex-1">
        <ChessboardView
          fen={fen}
          theme={theme}
          allowDragging={false}
          bestMoveArrow={stockfishEnabled ? bestMoveArrow : null}
        />
      </div>

      {/* Навигация */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" onClick={goToStart} disabled={!canGoPrevious} type="button">
          <SkipBack className="size-4" />
        </Button>
        <Button variant="secondary" size="sm" onClick={goPrevious} disabled={!canGoPrevious} type="button">
          <ChevronLeft className="size-4" />
        </Button>
        <div className="min-w-[100px] text-center text-sm font-semibold">
          {currentMove ? `${currentMove.moveNumber}. ${currentMove.san}` : "Начало"}
        </div>
        <Button variant="secondary" size="sm" onClick={goNext} disabled={!canGoNext} type="button">
          <ChevronRight className="size-4" />
        </Button>
        <Button variant="secondary" size="sm" onClick={goToEnd} disabled={!canGoNext} type="button">
          <SkipForward className="size-4" />
        </Button>
      </div>

      {/* Информация о текущем ходе */}
      {currentMove && (
        <div className="mt-4 rounded-xl bg-muted/30 p-3 text-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-primary/30">
              <img
                src="/tokayev.jpg"
                alt="Coach Tokayev"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Оценка:</span>
                <span className="font-mono font-semibold">
                  {displayEval > 0 ? "+" : ""}
                  {displayEval.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          {stockfishEnabled && bestMove && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground">Лучший ход:</span>
              <span className="font-mono text-green-400">{bestMove}</span>
            </div>
          )}
          {!stockfishEnabled && currentMove.bestMove && currentMove.bestMove !== currentMove.uci && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground">Лучший ход:</span>
              <span className="font-mono text-green-400">{currentMove.bestMove}</span>
            </div>
          )}
          {currentMove.centipawnLoss > 0 && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground">Потеря:</span>
              <span className="font-mono text-orange-400">-{currentMove.centipawnLoss} cp</span>
            </div>
          )}
        </div>
      )}
    </Surface>
  );
}
