/**
 * Расчёт рейтинга по системе Elo (FIDE-подобная)
 */

export type GameOutcome = "win" | "loss" | "draw";

/**
 * K-фактор для расчёта изменения рейтинга
 * FIDE использует разные K в зависимости от рейтинга и количества игр
 */
export function getKFactor(rating: number, gamesPlayed: number): number {
  // Новички (менее 30 игр) - K=40
  if (gamesPlayed < 30) return 40;

  // Игроки с рейтингом ниже 2400 - K=20
  if (rating < 2400) return 20;

  // Сильные игроки (2400+) - K=10
  return 10;
}

/**
 * Ожидаемый результат (вероятность победы)
 */
export function getExpectedScore(playerRating: number, opponentRating: number): number {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

/**
 * Расчёт изменения рейтинга
 */
export function calculateRatingChange(
  playerRating: number,
  opponentRating: number,
  outcome: GameOutcome,
  gamesPlayed: number = 0
): number {
  const K = getKFactor(playerRating, gamesPlayed);
  const expectedScore = getExpectedScore(playerRating, opponentRating);

  // Фактический результат: 1 = победа, 0.5 = ничья, 0 = поражение
  const actualScore = outcome === "win" ? 1 : outcome === "draw" ? 0.5 : 0;

  // Изменение рейтинга
  const change = Math.round(K * (actualScore - expectedScore));

  return change;
}

/**
 * Получить новый рейтинг после игры
 */
export function getNewRating(
  currentRating: number,
  opponentRating: number,
  outcome: GameOutcome,
  gamesPlayed: number = 0
): { newRating: number; change: number } {
  const change = calculateRatingChange(currentRating, opponentRating, outcome, gamesPlayed);
  const newRating = Math.max(100, currentRating + change); // Минимальный рейтинг 100

  return { newRating, change };
}

/**
 * Получить категорию игрока по рейтингу (как в FIDE)
 */
export function getRatingCategory(rating: number): string {
  if (rating >= 2700) return "Супер-гроссмейстер";
  if (rating >= 2500) return "Гроссмейстер";
  if (rating >= 2400) return "Международный мастер";
  if (rating >= 2300) return "FIDE мастер";
  if (rating >= 2200) return "Кандидат в мастера";
  if (rating >= 2000) return "Эксперт";
  if (rating >= 1800) return "Класс A";
  if (rating >= 1600) return "Класс B";
  if (rating >= 1400) return "Класс C";
  if (rating >= 1200) return "Класс D";
  return "Новичок";
}

/**
 * Получить цвет для отображения рейтинга
 */
export function getRatingColor(rating: number): string {
  if (rating >= 2400) return "text-yellow-500";
  if (rating >= 2200) return "text-purple-500";
  if (rating >= 2000) return "text-blue-500";
  if (rating >= 1800) return "text-green-500";
  if (rating >= 1600) return "text-cyan-500";
  return "text-muted-foreground";
}
