import type { MoveClassification, AnalyzedMove } from "./types";

/**
 * Генерирует объяснение от Coach Tokayev для хода
 */
export function generateCoachExplanation(move: AnalyzedMove): string {
  const { classification, san, bestMove, centipawnLoss, scoreBefore, scoreAfter, isSacrifice } = move;

  switch (classification) {
    case "brilliant":
      return generateBrilliantExplanation(move);

    case "best":
      return `Очень точный ход. Ты сыграл по первой линии движка: ${san}. Это поддерживает твоё преимущество и не даёт сопернику контригры.`;

    case "excellent":
      return `Сильный практический ход ${san}. Небольшая потеря точности (${centipawnLoss} centipawn), но позиция остаётся комфортной.`;

    case "good":
      return `Нормальный практический ход, но был вариант сильнее: ${bestMove || "неизвестно"}. Потеря ${centipawnLoss} centipawn не критична, но в будущем старайся искать более точные продолжения.`;

    case "book":
      return `Дебютный ход ${san}. Следуешь теории — это правильный подход на начальной стадии партии.`;

    case "inaccuracy":
      return `Неточность. Ход ${san} ухудшает позицию на ${centipawnLoss} centipawn. Лучше было ${bestMove || "найти другое продолжение"}. Будь внимательнее к тактическим угрозам соперника.`;

    case "mistake":
      return `Здесь надо было аккуратнее. Ход ${san} резко ухудшил позицию (потеря ${centipawnLoss} centipawn). Правильно было ${bestMove || "защититься"}. Анализируй угрозы соперника перед каждым ходом.`;

    case "blunder":
      return generateBlunderExplanation(move);

    case "missed-win":
      return `Упущенная победа! В позиции был выигрывающий ход ${bestMove || "неизвестно"}, но ты выбрал ${san}. Оценка упала с +${Math.abs(scoreBefore / 100).toFixed(1)} до ${(scoreAfter / 100).toFixed(1)}. В выигрышных позициях ищи форсированные продолжения.`;

    default:
      return `Ход ${san} сыгран. Продолжай партию внимательно.`;
  }
}

function generateBrilliantExplanation(move: AnalyzedMove): string {
  const { san, bestMove, scoreAfter, scoreBefore, isSacrifice } = move;

  let reason = "";

  if (isSacrifice) {
    reason = "ты временно жертвуешь материал, но создаёшь форсированную атаку на короля";
  } else if (scoreAfter - scoreBefore > 200) {
    reason = "ты нашёл сильную тактическую идею и получил решающее преимущество";
  } else if (scoreAfter > 300) {
    reason = "ты создал выигрышную позицию с чёткой атакой";
  } else {
    reason = "ты нашёл единственный путь к преимуществу в сложной позиции";
  }

  return `Базар Джексон, ты молодец! Это brilliant ход, потому что ${reason}. Лучшее продолжение: ${bestMove || san}. Сопернику будет очень сложно защищаться.`;
}

function generateBlunderExplanation(move: AnalyzedMove): string {
  const { san, bestMove, centipawnLoss, scoreBefore, scoreAfter } = move;

  let severity = "";
  if (centipawnLoss > 500) {
    severity = "критически";
  } else if (centipawnLoss > 400) {
    severity = "очень сильно";
  } else {
    severity = "резко";
  }

  let consequence = "";
  if (scoreBefore > 200 && scoreAfter < -100) {
    consequence = "Выигрышная позиция превратилась в проигрышную.";
  } else if (scoreBefore > 0 && scoreAfter < -200) {
    consequence = "Ты отдал сопернику решающее преимущество.";
  } else {
    consequence = `Потеря ${centipawnLoss} centipawn — это очень много.`;
  }

  return `Здесь надо было аккуратнее. Ход ${san} ${severity} ухудшил позицию. ${consequence} Правильно было ${bestMove || "найти защиту"}. В критических моментах трать больше времени на расчёт.`;
}

/**
 * Генерирует краткое объяснение для preview
 */
export function generatePreviewExplanation(): string {
  return "Базар Джексон, ты молодец! Это brilliant ход, потому что ты нашёл сильную тактическую идею и получил решающее преимущество.";
}
