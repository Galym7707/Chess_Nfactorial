"use client";

import { useMemo, useState } from "react";
import { BarChart3, Copy, Eraser, RefreshCw, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { BoardThemePicker } from "@/components/chess/board-theme-picker";
import { useStockfish } from "@/hooks/use-stockfish";
import { boardThemes } from "@/lib/chess/themes";
import type { BoardTheme } from "@/types/app";
import type { EngineAnalysis } from "@/lib/engine/stockfish";
import { cn } from "@/lib/utils";

type PieceCode = "wK" | "wQ" | "wR" | "wB" | "wN" | "wP" | "bK" | "bQ" | "bR" | "bB" | "bN" | "bP";
type BoardPosition = Record<string, PieceCode | null>;
type SideToMove = "w" | "b";
type EditorTool = PieceCode | "erase" | null;

const unicodePieces: Record<PieceCode, string> = {
  wK: "♔",
  wQ: "♕",
  wR: "♖",
  wB: "♗",
  wN: "♘",
  wP: "♙",
  bK: "♚",
  bQ: "♛",
  bR: "♜",
  bB: "♝",
  bN: "♞",
  bP: "♟",
};

const pieceToFen: Record<PieceCode, string> = {
  wK: "K",
  wQ: "Q",
  wR: "R",
  wB: "B",
  wN: "N",
  wP: "P",
  bK: "k",
  bQ: "q",
  bR: "r",
  bB: "b",
  bN: "n",
  bP: "p",
};

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
const whitePieces: PieceCode[] = ["wK", "wQ", "wR", "wB", "wN", "wP"];
const blackPieces: PieceCode[] = ["bK", "bQ", "bR", "bB", "bN", "bP"];

function createEmptyPosition(): BoardPosition {
  const position: BoardPosition = {};
  for (const rank of ranks) {
    for (const file of files) position[`${file}${rank}`] = null;
  }
  return position;
}

function initialPosition(): BoardPosition {
  const position = createEmptyPosition();
  files.forEach((file) => {
    position[`${file}2`] = "wP";
    position[`${file}7`] = "bP";
  });
  const whiteBack: PieceCode[] = ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"];
  const blackBack: PieceCode[] = ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"];
  files.forEach((file, index) => {
    position[`${file}1`] = whiteBack[index] ?? null;
    position[`${file}8`] = blackBack[index] ?? null;
  });
  return position;
}

function positionToFen(position: BoardPosition, turn: SideToMove) {
  const placement = ranks.map((rank) => {
    let empty = 0;
    let row = "";
    for (const file of files) {
      const piece = position[`${file}${rank}`];
      if (!piece) {
        empty += 1;
        continue;
      }
      if (empty > 0) {
        row += String(empty);
        empty = 0;
      }
      row += pieceToFen[piece];
    }
    return row + (empty > 0 ? String(empty) : "");
  }).join("/");

  return `${placement} ${turn} - - 0 1`;
}

function validateForAnalysis(position: BoardPosition) {
  const pieces = Object.values(position);
  const whiteKings = pieces.filter((piece) => piece === "wK").length;
  const blackKings = pieces.filter((piece) => piece === "bK").length;
  if (whiteKings !== 1 || blackKings !== 1) return "Для анализа нужна корректная позиция: один белый король и один черный король.";
  return null;
}

function formatMove(move: string | null) {
  if (!move) return "нет хода";
  const promotion = move[4] ? `=${move[4].toUpperCase()}` : "";
  return `${move.slice(0, 2)}-${move.slice(2, 4)}${promotion}`;
}

function formatScore(analysis: EngineAnalysis) {
  if (typeof analysis.mate === "number") return `мат за ${Math.abs(analysis.mate)}`;
  const pawns = analysis.scoreCp / 100;
  return `${pawns >= 0 ? "+" : ""}${pawns.toFixed(2)}`;
}

function analysisText(analysis: EngineAnalysis) {
  if (typeof analysis.mate === "number") {
    return analysis.mate > 0 ? "У белых есть форсированный мат." : "У черных есть форсированный мат.";
  }
  if (analysis.scoreCp > 120) return "Белые заметно лучше.";
  if (analysis.scoreCp > 35) return "У белых небольшой перевес.";
  if (analysis.scoreCp < -120) return "Черные заметно лучше.";
  if (analysis.scoreCp < -35) return "У черных небольшой перевес.";
  return "Позиция близка к равной.";
}

export function BoardEditor() {
  const [position, setPosition] = useState<BoardPosition>(() => initialPosition());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [tool, setTool] = useState<EditorTool>(null);
  const [turn, setTurn] = useState<SideToMove>("w");
  const [theme, setTheme] = useState<BoardTheme>("classic");
  const [analysis, setAnalysis] = useState<EngineAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { ready, error: engineError, analyzeFen } = useStockfish();
  const squares = useMemo(() => ranks.flatMap((rank) => files.map((file) => `${file}${rank}`)), []);
  const fen = useMemo(() => positionToFen(position, turn), [position, turn]);
  const colors = boardThemes[theme];

  function placePiece(square: string, piece: PieceCode | null) {
    setPosition((current) => ({ ...current, [square]: piece }));
    setSelectedSquare(null);
    setAnalysis(null);
  }

  function movePiece(from: string, to: string) {
    if (from === to) {
      setSelectedSquare(null);
      return;
    }
    setPosition((current) => ({ ...current, [to]: current[from] ?? null, [from]: null }));
    setSelectedSquare(null);
    setAnalysis(null);
  }

  function clickSquare(square: string) {
    if (tool === "erase") {
      placePiece(square, null);
      return;
    }
    if (tool) {
      placePiece(square, tool);
      return;
    }
    if (selectedSquare) {
      movePiece(selectedSquare, square);
      return;
    }
    if (position[square]) setSelectedSquare(square);
  }

  function resetPosition() {
    setPosition(initialPosition());
    setTurn("w");
    setSelectedSquare(null);
    setTool(null);
    setAnalysis(null);
    setAnalysisError(null);
  }

  function clearBoard() {
    setPosition(createEmptyPosition());
    setSelectedSquare(null);
    setTool(null);
    setAnalysis(null);
    setAnalysisError(null);
  }

  async function copyFen() {
    await navigator.clipboard.writeText(fen);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function runAnalysis() {
    const validationError = validateForAnalysis(position);
    if (validationError) {
      setAnalysisError(validationError);
      setAnalysis(null);
      return;
    }
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const result = await analyzeFen(fen, { movetime: 1200, skill: 16 });
      setAnalysis(result);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : "Не удалось проанализировать позицию.");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
      <Surface className="p-3 md:p-5">
        <div className="board-wrap rounded-[1.75rem] border bg-card p-2 shadow-soft" style={{ borderColor: colors.border }}>
          <div className="grid h-full grid-cols-8 overflow-hidden rounded-[1.25rem]">
            {squares.map((square, index) => {
              const piece = position[square];
              const light = (Math.floor(index / 8) + index) % 2 === 0;
              return (
                <button
                  key={square}
                  className={cn(
                    "relative flex touch-none items-center justify-center font-display text-4xl transition md:text-6xl",
                    selectedSquare === square && "ring-4 ring-inset ring-primary",
                    tool && "cursor-crosshair",
                  )}
                  style={{ backgroundColor: light ? colors.light : colors.dark }}
                  draggable={Boolean(piece)}
                  onClick={() => clickSquare(square)}
                  onDragStart={(event) => event.dataTransfer.setData("text/plain", square)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const from = event.dataTransfer.getData("text/plain");
                    if (from) movePiece(from, square);
                  }}
                  type="button"
                  aria-label={`Поле ${square}`}
                >
                  <span className={cn("select-none leading-none", piece?.startsWith("w") ? "text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.7)]" : "text-black drop-shadow-[0_1px_0_rgba(255,255,255,0.28)]")}>{piece ? unicodePieces[piece] : ""}</span>
                  <span className={cn("absolute bottom-1 right-1 text-[10px] font-semibold", light ? "text-slate-900/45" : "text-white/50")}>{square}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Surface>

      <div className="grid content-start gap-4">
        <Surface>
          <div className="flex flex-wrap items-center gap-2">
            <Badge><Sparkles className="size-3" /> Редактор позиции</Badge>
            <Badge className={ready ? "border-primary/40 text-primary" : ""}>{ready ? "Stockfish готов" : "Движок запускается"}</Badge>
          </div>
          <h1 className="mt-5 font-display text-4xl font-semibold">Позиция и анализ</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Расставьте фигуры, выберите сторону хода и запустите анализ. Редактор не ограничивает расстановку, чтобы было удобно собирать учебные и нестандартные позиции.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button variant={turn === "w" ? "primary" : "secondary"} onClick={() => setTurn("w")} type="button">Ход белых</Button>
            <Button variant={turn === "b" ? "primary" : "secondary"} onClick={() => setTurn("b")} type="button">Ход черных</Button>
          </div>

          <div className="mt-5 grid gap-3">
            <p className="text-sm font-semibold">Поставить фигуру</p>
            {[{ label: "Белые", pieces: whitePieces }, { label: "Черные", pieces: blackPieces }].map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{group.label}</p>
                <div className="grid grid-cols-6 gap-2">
                  {group.pieces.map((piece) => (
                    <button
                      key={piece}
                      className={cn(
                        "h-11 rounded-2xl border border-border bg-card/70 text-2xl transition hover:border-primary",
                        tool === piece && "border-primary bg-primary/10",
                      )}
                      onClick={() => setTool((current) => current === piece ? null : piece)}
                      type="button"
                      aria-label={`Выбрать ${piece}`}
                    >
                      {unicodePieces[piece]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <Button variant={tool === "erase" ? "danger" : "secondary"} onClick={() => setTool((current) => current === "erase" ? null : "erase")} type="button">
              <Eraser className="size-4" /> Ластик
            </Button>
          </div>
        </Surface>

        <Surface>
          <BoardThemePicker value={theme} onChange={setTheme} isPro={true} />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={resetPosition} type="button"><RotateCcw className="size-4" /> Начальная</Button>
            <Button variant="secondary" onClick={clearBoard} type="button"><Trash2 className="size-4" /> Очистить</Button>
            <Button variant="secondary" onClick={copyFen} type="button"><Copy className="size-4" /> FEN</Button>
            <Button onClick={runAnalysis} disabled={!ready || analyzing} type="button"><BarChart3 className="size-4" /> {analyzing ? "Анализ..." : "Анализ"}</Button>
          </div>
          {copied ? <p className="mt-3 text-sm text-primary">FEN скопирован.</p> : null}
          {engineError ? <p className="mt-3 text-sm text-destructive">Stockfish не запустился: {engineError}</p> : null}
          {!ready && !engineError ? <p className="mt-3 text-sm text-muted-foreground">Движок загружается в браузере. Обычно это занимает несколько секунд.</p> : null}
          {analysisError ? <p className="mt-3 text-sm text-destructive">{analysisError}</p> : null}
        </Surface>

        <Surface>
          <div className="flex items-center gap-2">
            <RefreshCw className="size-5 text-primary" />
            <h2 className="font-display text-2xl font-semibold">Анализ движком</h2>
          </div>
          {analysis ? (
            <div className="mt-5 grid gap-3 text-sm">
              <div className="rounded-2xl bg-muted/50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Оценка</p>
                <p className="mt-1 font-display text-4xl font-semibold">{formatScore(analysis)}</p>
                <p className="mt-2 text-muted-foreground">{analysisText(analysis)}</p>
              </div>
              <div className="grid gap-2">
                <p><span className="text-muted-foreground">Лучший ход:</span> <strong>{formatMove(analysis.bestMove)}</strong></p>
                <p><span className="text-muted-foreground">Глубина:</span> {analysis.depth || "быстрый поиск"}</p>
                {analysis.pv.length ? <p className="leading-6"><span className="text-muted-foreground">Линия:</span> {analysis.pv.map(formatMove).join(" ")}</p> : null}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Нажмите “Анализ”, чтобы получить оценку, лучший ход и короткую линию продолжения для текущей позиции.
            </p>
          )}
        </Surface>
      </div>
    </div>
  );
}
