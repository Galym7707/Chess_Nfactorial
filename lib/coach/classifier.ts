import type { MoveClassification, AnalyzedMove } from "./types";

/**
 * Классифицирует ход на основе потери centipawn и контекста
 */
export function classifyMove(
  centipawnLoss: number,
  scoreBefore: number,
  scoreAfter: number,
  bestMove: string | null,
  playedMove: string,
  moveNumber: number,
  isSacrifice: boolean
): MoveClassification {
  // Book move - первые 8-12 ходов без большой потери
  if (moveNumber <= 12 && centipawnLoss < 50) {
    return "book";
  }

  // Missed Win - была выигрышная позиция, но сыграли намного хуже
  if (scoreBefore > 300 && scoreAfter < 100 && centipawnLoss > 400) {
    return "missed-win";
  }

  // Blunder - потеря 300+ или превращение выигрыша в проигрыш
  if (centipawnLoss >= 300) {
    return "blunder";
  }

  // Blunder - превращение выигрыша в ничью/проигрыш
  if (scoreBefore > 200 && scoreAfter < -100) {
    return "blunder";
  }

  // Mistake - потеря 151-300
  if (centipawnLoss >= 151) {
    return "mistake";
  }

  // Inaccuracy - потеря 81-150
  if (centipawnLoss >= 81) {
    return "inaccuracy";
  }

  // Good - потеря 36-80
  if (centipawnLoss >= 36) {
    return "good";
  }

  // Excellent - потеря 16-35
  if (centipawnLoss >= 16) {
    return "excellent";
  }

  // Best - потеря 0-15
  if (centipawnLoss <= 15) {
    // Brilliant - лучший ход + жертва/тактика + сильная позиция
    if (isSacrifice && (scoreAfter > 100 || scoreAfter > scoreBefore - 50)) {
      return "brilliant";
    }

    // Brilliant - топ-ход движка с резким улучшением позиции
    if (bestMove === playedMove && scoreAfter - scoreBefore > 150) {
      return "brilliant";
    }

    return "best";
  }

  return "good";
}

/**
 * Определяет, является ли ход жертвой
 * Эвристика: материал временно уменьшается, но оценка улучшается или остаётся сильной
 */
export function detectSacrifice(
  fenBefore: string,
  fenAfter: string,
  scoreBefore: number,
  scoreAfter: number
): boolean {
  const materialBefore = calculateMaterial(fenBefore);
  const materialAfter = calculateMaterial(fenAfter);

  // Потеря материала
  const materialLoss = materialBefore - materialAfter;

  // Жертва: потеря материала >= 3 (пешка или больше), но оценка не сильно ухудшилась
  if (materialLoss >= 3) {
    const scoreDiff = scoreAfter - scoreBefore;
    // Оценка улучшилась или ухудшилась не более чем на 100 centipawn
    if (scoreDiff > -100) {
      return true;
    }
  }

  return false;
}

/**
 * Подсчитывает материал из FEN
 */
function calculateMaterial(fen: string): number {
  const position = fen.split(" ")[0];
  const pieceValues: Record<string, number> = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0,
  };

  let material = 0;
  for (const char of position) {
    const piece = char.toLowerCase();
    if (pieceValues[piece]) {
      material += pieceValues[piece];
    }
  }

  return material;
}

/**
 * Вычисляет точность игрока на основе centipawn loss
 */
export function calculateAccuracy(moves: AnalyzedMove[], color: "white" | "black"): number {
  const playerMoves = moves.filter((m) => m.color === color);
  if (playerMoves.length === 0) return 100;

  let totalLoss = 0;
  let moveCount = 0;

  for (const move of playerMoves) {
    // Пропускаем book moves
    if (move.classification === "book") continue;

    totalLoss += move.centipawnLoss;
    moveCount++;
  }

  if (moveCount === 0) return 100;

  const avgLoss = totalLoss / moveCount;

  // Формула точности: 100 - (avgLoss / 10)
  // Ограничиваем от 0 до 100
  const accuracy = Math.max(0, Math.min(100, 100 - avgLoss / 10));

  return Math.round(accuracy * 10) / 10;
}

/**
 * Получает цвет значка для классификации
 */
export function getClassificationColor(classification: MoveClassification): string {
  switch (classification) {
    case "brilliant":
      return "text-cyan-400";
    case "great":
      return "text-green-400";
    case "best":
      return "text-green-500";
    case "excellent":
      return "text-lime-500";
    case "good":
      return "text-yellow-500";
    case "book":
      return "text-gray-400";
    case "inaccuracy":
      return "text-orange-400";
    case "mistake":
      return "text-orange-600";
    case "blunder":
      return "text-red-600";
    case "missed-win":
      return "text-red-700";
    default:
      return "text-gray-400";
  }
}

/**
 * Получает иконку для классификации
 */
export function getClassificationIcon(classification: MoveClassification): string {
  switch (classification) {
    case "brilliant":
      return "✨";
    case "great":
      return "⭐";
    case "best":
      return "✓";
    case "excellent":
      return "!";
    case "good":
      return "○";
    case "book":
      return "📖";
    case "inaccuracy":
      return "?!";
    case "mistake":
      return "?";
    case "blunder":
      return "??";
    case "missed-win":
      return "⚠";
    default:
      return "○";
  }
}

/**
 * Получает название классификации на русском
 */
export function getClassificationLabel(classification: MoveClassification): string {
  switch (classification) {
    case "brilliant":
      return "Brilliant";
    case "great":
      return "Great";
    case "best":
      return "Best";
    case "excellent":
      return "Excellent";
    case "good":
      return "Good";
    case "book":
      return "Book";
    case "inaccuracy":
      return "Inaccuracy";
    case "mistake":
      return "Mistake";
    case "blunder":
      return "Blunder";
    case "missed-win":
      return "Missed Win";
    default:
      return "Unknown";
  }
}
