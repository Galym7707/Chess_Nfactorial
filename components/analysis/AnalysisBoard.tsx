"use client";

import { useState, useMemo } from "react";
import { Chess } from "chess.js";
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from "lucide-react";
import { ChessboardView } from "@/components/chess/chessboard-view";
import { EvaluationBar } from "@/components/chess/evaluation-bar";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
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

  const canGoPrevious = selectedMoveIndex !== null && selectedMoveIndex > 0;
  const canGoNext = selectedMoveIndex !== null && selectedMoveIndex < moves.length - 1;

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
      <div className="flex gap-2">
        {/* Evaluation Bar */}
        {currentMove && (
          <EvaluationBar
            evaluation={currentMove.scoreAfter / 100}
            className="flex-shrink-0"
          />
        )}

        {/* Board */}
        <div className="flex-1">
          <ChessboardView fen={fen} theme={theme} allowDragging={false} />
        </div>
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
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Оценка:</span>
            <span className="font-mono font-semibold">
              {currentMove.scoreAfter > 0 ? "+" : ""}
              {(currentMove.scoreAfter / 100).toFixed(2)}
            </span>
          </div>
          {currentMove.bestMove && currentMove.bestMove !== currentMove.uci && (
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
