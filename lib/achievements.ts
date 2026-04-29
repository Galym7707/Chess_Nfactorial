export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  category: "wins" | "games" | "rating" | "quality" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const ACHIEVEMENTS: Achievement[] = [
  // Wins category
  {
    id: "first_win",
    title: "Первая победа",
    description: "Выиграйте свою первую партию",
    icon: "🏆",
    unlocked: false,
    category: "wins",
    rarity: "common",
  },
  {
    id: "wins_10",
    title: "Победитель",
    description: "Выиграйте 10 партий",
    icon: "🥇",
    unlocked: false,
    category: "wins",
    rarity: "common",
  },
  {
    id: "wins_25",
    title: "Чемпион",
    description: "Выиграйте 25 партий",
    icon: "🏅",
    unlocked: false,
    category: "wins",
    rarity: "rare",
  },
  {
    id: "wins_50",
    title: "Легенда",
    description: "Выиграйте 50 партий",
    icon: "👑",
    unlocked: false,
    category: "wins",
    rarity: "epic",
  },
  {
    id: "win_streak_3",
    title: "Серия побед",
    description: "Выиграйте 3 партии подряд",
    icon: "🔥",
    unlocked: false,
    category: "wins",
    rarity: "common",
  },
  {
    id: "win_streak_5",
    title: "Непобедимый",
    description: "Выиграйте 5 партий подряд",
    icon: "⚡",
    unlocked: false,
    category: "wins",
    rarity: "rare",
  },
  {
    id: "win_streak_10",
    title: "Доминатор",
    description: "Выиграйте 10 партий подряд",
    icon: "💫",
    unlocked: false,
    category: "wins",
    rarity: "legendary",
  },

  // Games category
  {
    id: "games_10",
    title: "Новичок",
    description: "Сыграйте 10 партий",
    icon: "🎮",
    unlocked: false,
    category: "games",
    rarity: "common",
  },
  {
    id: "games_50",
    title: "Опытный игрок",
    description: "Сыграйте 50 партий",
    icon: "🎯",
    unlocked: false,
    category: "games",
    rarity: "rare",
  },
  {
    id: "games_100",
    title: "Ветеран",
    description: "Сыграйте 100 партий",
    icon: "🎖️",
    unlocked: false,
    category: "games",
    rarity: "epic",
  },
  {
    id: "games_250",
    title: "Мастер игры",
    description: "Сыграйте 250 партий",
    icon: "🏰",
    unlocked: false,
    category: "games",
    rarity: "legendary",
  },

  // Quality category
  {
    id: "perfect_game",
    title: "Идеальная игра",
    description: "Сыграйте партию с качеством 95+",
    icon: "💎",
    unlocked: false,
    category: "quality",
    rarity: "epic",
  },
  {
    id: "flawless_game",
    title: "Безупречная игра",
    description: "Сыграйте партию без ошибок (качество 100)",
    icon: "✨",
    unlocked: false,
    category: "quality",
    rarity: "legendary",
  },
  {
    id: "no_blunders",
    title: "Без зевков",
    description: "Сыграйте 10 партий подряд без зевков",
    icon: "🛡️",
    unlocked: false,
    category: "quality",
    rarity: "rare",
  },
  {
    id: "tactical_genius",
    title: "Тактический гений",
    description: "Сделайте 5 лучших ходов подряд",
    icon: "🧠",
    unlocked: false,
    category: "quality",
    rarity: "epic",
  },

  // Rating category
  {
    id: "rating_1200",
    title: "Начинающий",
    description: "Достигните рейтинга 1200",
    icon: "📊",
    unlocked: false,
    category: "rating",
    rarity: "common",
  },
  {
    id: "rating_1500",
    title: "Любитель",
    description: "Достигните рейтинга 1500",
    icon: "📈",
    unlocked: false,
    category: "rating",
    rarity: "rare",
  },
  {
    id: "rating_1800",
    title: "Эксперт",
    description: "Достигните рейтинга 1800",
    icon: "🌟",
    unlocked: false,
    category: "rating",
    rarity: "epic",
  },
  {
    id: "rating_2000",
    title: "Мастер",
    description: "Достигните рейтинга 2000",
    icon: "👨‍🎓",
    unlocked: false,
    category: "rating",
    rarity: "legendary",
  },
  {
    id: "rating_2200",
    title: "Гроссмейстер",
    description: "Достигните рейтинга 2200",
    icon: "🎓",
    unlocked: false,
    category: "rating",
    rarity: "legendary",
  },

  // Special category
  {
    id: "first_analysis",
    title: "Аналитик",
    description: "Проанализируйте свою первую партию",
    icon: "🔍",
    unlocked: false,
    category: "special",
    rarity: "common",
  },
  {
    id: "online_warrior",
    title: "Онлайн воин",
    description: "Сыграйте 10 онлайн партий с другом",
    icon: "🌐",
    unlocked: false,
    category: "special",
    rarity: "rare",
  },
  {
    id: "ai_challenger",
    title: "Покоритель AI",
    description: "Победите Stockfish на уровне Эксперт",
    icon: "🤖",
    unlocked: false,
    category: "special",
    rarity: "epic",
  },
  {
    id: "speed_demon",
    title: "Скоростной демон",
    description: "Выиграйте партию в bullet (менее 3 минут)",
    icon: "⚡",
    unlocked: false,
    category: "special",
    rarity: "rare",
  },
  {
    id: "marathon_player",
    title: "Марафонец",
    description: "Сыграйте партию длиннее 50 ходов",
    icon: "🏃",
    unlocked: false,
    category: "special",
    rarity: "common",
  },
];

export function checkAchievements(stats: {
  total: number;
  wins: number;
  rating: number;
  currentStreak: number;
  bestQuality: number;
  noBlunderStreak?: number;
  analysisCount?: number;
  onlineGames?: number;
  aiExpertWins?: number;
  bulletWins?: number;
  longestGame?: number;
}): Achievement[] {
  return ACHIEVEMENTS.map((achievement) => {
    let unlocked = false;

    switch (achievement.id) {
      // Wins
      case "first_win":
        unlocked = stats.wins >= 1;
        break;
      case "wins_10":
        unlocked = stats.wins >= 10;
        break;
      case "wins_25":
        unlocked = stats.wins >= 25;
        break;
      case "wins_50":
        unlocked = stats.wins >= 50;
        break;
      case "win_streak_3":
        unlocked = stats.currentStreak >= 3;
        break;
      case "win_streak_5":
        unlocked = stats.currentStreak >= 5;
        break;
      case "win_streak_10":
        unlocked = stats.currentStreak >= 10;
        break;

      // Games
      case "games_10":
        unlocked = stats.total >= 10;
        break;
      case "games_50":
        unlocked = stats.total >= 50;
        break;
      case "games_100":
        unlocked = stats.total >= 100;
        break;
      case "games_250":
        unlocked = stats.total >= 250;
        break;

      // Quality
      case "perfect_game":
        unlocked = stats.bestQuality >= 95;
        break;
      case "flawless_game":
        unlocked = stats.bestQuality >= 100;
        break;
      case "no_blunders":
        unlocked = (stats.noBlunderStreak ?? 0) >= 10;
        break;
      case "tactical_genius":
        unlocked = stats.bestQuality >= 98;
        break;

      // Rating
      case "rating_1200":
        unlocked = stats.rating >= 1200;
        break;
      case "rating_1500":
        unlocked = stats.rating >= 1500;
        break;
      case "rating_1800":
        unlocked = stats.rating >= 1800;
        break;
      case "rating_2000":
        unlocked = stats.rating >= 2000;
        break;
      case "rating_2200":
        unlocked = stats.rating >= 2200;
        break;

      // Special
      case "first_analysis":
        unlocked = (stats.analysisCount ?? 0) >= 1;
        break;
      case "online_warrior":
        unlocked = (stats.onlineGames ?? 0) >= 10;
        break;
      case "ai_challenger":
        unlocked = (stats.aiExpertWins ?? 0) >= 1;
        break;
      case "speed_demon":
        unlocked = (stats.bulletWins ?? 0) >= 1;
        break;
      case "marathon_player":
        unlocked = (stats.longestGame ?? 0) >= 50;
        break;
    }

    return { ...achievement, unlocked };
  });
}
