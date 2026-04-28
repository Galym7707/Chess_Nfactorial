export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_win",
    title: "Первая победа",
    description: "Выиграйте свою первую партию",
    icon: "🏆",
    unlocked: false,
  },
  {
    id: "win_streak_3",
    title: "Серия побед",
    description: "Выиграйте 3 партии подряд",
    icon: "🔥",
    unlocked: false,
  },
  {
    id: "win_streak_5",
    title: "Непобедимый",
    description: "Выиграйте 5 партий подряд",
    icon: "⚡",
    unlocked: false,
  },
  {
    id: "games_10",
    title: "Новичок",
    description: "Сыграйте 10 партий",
    icon: "🎮",
    unlocked: false,
  },
  {
    id: "games_50",
    title: "Опытный игрок",
    description: "Сыграйте 50 партий",
    icon: "🎯",
    unlocked: false,
  },
  {
    id: "games_100",
    title: "Ветеран",
    description: "Сыграйте 100 партий",
    icon: "👑",
    unlocked: false,
  },
  {
    id: "perfect_game",
    title: "Идеальная игра",
    description: "Сыграйте партию с качеством 95+",
    icon: "💎",
    unlocked: false,
  },
  {
    id: "rating_1500",
    title: "Любитель",
    description: "Достигните рейтинга 1500",
    icon: "📈",
    unlocked: false,
  },
  {
    id: "rating_1800",
    title: "Эксперт",
    description: "Достигните рейтинга 1800",
    icon: "🌟",
    unlocked: false,
  },
  {
    id: "rating_2000",
    title: "Мастер",
    description: "Достигните рейтинга 2000",
    icon: "👨‍🎓",
    unlocked: false,
  },
];

export function checkAchievements(stats: {
  total: number;
  wins: number;
  rating: number;
  currentStreak: number;
  bestQuality: number;
}): Achievement[] {
  return ACHIEVEMENTS.map((achievement) => {
    let unlocked = false;

    switch (achievement.id) {
      case "first_win":
        unlocked = stats.wins >= 1;
        break;
      case "win_streak_3":
        unlocked = stats.currentStreak >= 3;
        break;
      case "win_streak_5":
        unlocked = stats.currentStreak >= 5;
        break;
      case "games_10":
        unlocked = stats.total >= 10;
        break;
      case "games_50":
        unlocked = stats.total >= 50;
        break;
      case "games_100":
        unlocked = stats.total >= 100;
        break;
      case "perfect_game":
        unlocked = stats.bestQuality >= 95;
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
    }

    return { ...achievement, unlocked };
  });
}
