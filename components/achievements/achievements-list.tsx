"use client";

import { useState } from "react";
import { Surface } from "@/components/ui/surface";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Star, Sparkles, Award } from "lucide-react";
import type { Achievement } from "@/lib/achievements";

const categoryIcons = {
  wins: Trophy,
  games: Target,
  rating: Star,
  quality: Sparkles,
  special: Award,
};

const categoryLabels = {
  wins: "Победы",
  games: "Игры",
  rating: "Рейтинг",
  quality: "Качество",
  special: "Особые",
};

const rarityColors = {
  common: "border-gray-500/30 bg-gray-500/10",
  rare: "border-blue-500/30 bg-blue-500/10",
  epic: "border-purple-500/30 bg-purple-500/10",
  legendary: "border-amber-500/30 bg-amber-500/10",
};

const rarityLabels = {
  common: "Обычное",
  rare: "Редкое",
  epic: "Эпическое",
  legendary: "Легендарное",
};

export function AchievementsList({ achievements }: { achievements: Achievement[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  const filteredAchievements = selectedCategory
    ? achievements.filter((a) => a.category === selectedCategory)
    : achievements;

  const categories = Array.from(new Set(achievements.map((a) => a.category)));

  return (
    <Surface>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold">Достижения</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Открыто {unlocked.length} из {achievements.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-primary">
            {Math.round((unlocked.length / achievements.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Category filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            selectedCategory === null
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
          type="button"
        >
          Все
        </button>
        {categories.map((category) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons];
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
              type="button"
            >
              <Icon className="size-4" />
              {categoryLabels[category as keyof typeof categoryLabels]}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {filteredAchievements
          .filter((a) => a.unlocked)
          .map((achievement, index) => (
            <div
              key={achievement.id}
              className="stagger-item"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <AchievementCard achievement={achievement} />
            </div>
          ))}
        {filteredAchievements
          .filter((a) => !a.unlocked)
          .map((achievement, index) => (
            <div
              key={achievement.id}
              className="stagger-item"
              style={{ animationDelay: `${(unlocked.length + index) * 0.05}s` }}
            >
              <AchievementCard achievement={achievement} />
            </div>
          ))}
      </div>
    </Surface>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div
      className={`group rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.02] ${
        achievement.unlocked
          ? `${rarityColors[achievement.rarity]} shadow-md hover:shadow-lg`
          : "border-border bg-muted/40 opacity-60 grayscale"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`text-4xl transition-transform group-hover:scale-110 ${achievement.unlocked ? "" : "opacity-50"}`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold">{achievement.title}</h3>
            {achievement.unlocked && (
              <Badge className="text-xs">
                {rarityLabels[achievement.rarity]}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{achievement.description}</p>
          {achievement.progress !== undefined && achievement.maxProgress && (
            <div className="mt-3">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {achievement.progress} / {achievement.maxProgress}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
