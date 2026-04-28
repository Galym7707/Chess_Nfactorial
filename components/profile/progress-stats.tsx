"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Target, Award, Clock, Zap } from "lucide-react";
import { Surface } from "@/components/ui/surface";
import { Badge } from "@/components/ui/badge";

interface ProgressStatsProps {
  stats: {
    total: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
  };
  rating: number;
  games: any[];
}

export function ProgressStats({ stats, rating, games }: ProgressStatsProps) {
  const [animatedRating, setAnimatedRating] = useState(0);
  const [animatedWins, setAnimatedWins] = useState(0);
  const [animatedLosses, setAnimatedLosses] = useState(0);

  // Анимация счетчиков
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const ratingStep = rating / steps;
    const winsStep = stats.wins / steps;
    const lossesStep = stats.losses / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setAnimatedRating(Math.min(Math.round(ratingStep * currentStep), rating));
      setAnimatedWins(Math.min(Math.round(winsStep * currentStep), stats.wins));
      setAnimatedLosses(Math.min(Math.round(lossesStep * currentStep), stats.losses));

      if (currentStep >= steps) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [rating, stats.wins, stats.losses]);

  // Расчет статистики по последним играм
  const recentGames = games.slice(0, 10);
  const recentWins = recentGames.filter(g => g.result === "1-0").length;
  const recentForm = recentGames.length > 0 ? (recentWins / recentGames.length) * 100 : 0;

  // Тренд рейтинга
  const ratingChanges = games.slice(0, 20).map(g => g.rating_change || 0);
  const avgRatingChange = ratingChanges.length > 0
    ? ratingChanges.reduce((a, b) => a + b, 0) / ratingChanges.length
    : 0;

  return (
    <div className="grid gap-5">
      {/* Основные метрики */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Surface className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="size-4" />
                <span>Рейтинг</span>
              </div>
              <p className="mt-2 font-display text-4xl font-bold text-primary">
                {animatedRating}
              </p>
              {avgRatingChange !== 0 && (
                <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${
                  avgRatingChange > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}>
                  {avgRatingChange > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  <span>{avgRatingChange > 0 ? "+" : ""}{avgRatingChange.toFixed(1)} за 20 игр</span>
                </div>
              )}
            </div>
          </Surface>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Surface className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-green-500/10 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="size-4" />
                <span>Побед</span>
              </div>
              <p className="mt-2 font-display text-4xl font-bold text-green-600 dark:text-green-400">
                {animatedWins}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {stats.total > 0 ? ((stats.wins / stats.total) * 100).toFixed(1) : 0}% винрейт
              </p>
            </div>
          </Surface>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Surface className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-red-500/10 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingDown className="size-4" />
                <span>Поражений</span>
              </div>
              <p className="mt-2 font-display text-4xl font-bold text-red-600 dark:text-red-400">
                {animatedLosses}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {stats.draws} ничьих
              </p>
            </div>
          </Surface>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Surface className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="size-4" />
                <span>Форма</span>
              </div>
              <p className="mt-2 font-display text-4xl font-bold text-blue-600 dark:text-blue-400">
                {recentForm.toFixed(0)}%
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Последние 10 игр
              </p>
            </div>
          </Surface>
        </motion.div>
      </div>

      {/* Прогресс-бар винрейта */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Surface>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Распределение результатов</h3>
            <span className="text-sm text-muted-foreground">{stats.total} игр</span>
          </div>
          <div className="relative h-8 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="absolute left-0 top-0 h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.wins / stats.total) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.div
              className="absolute top-0 h-full bg-blue-500"
              initial={{ width: 0, left: `${(stats.wins / stats.total) * 100}%` }}
              animate={{
                width: `${(stats.draws / stats.total) * 100}%`,
                left: `${(stats.wins / stats.total) * 100}%`
              }}
              transition={{ duration: 1, delay: 0.7 }}
            />
            <motion.div
              className="absolute top-0 h-full bg-red-500"
              initial={{ width: 0, left: `${((stats.wins + stats.draws) / stats.total) * 100}%` }}
              animate={{
                width: `${(stats.losses / stats.total) * 100}%`,
                left: `${((stats.wins + stats.draws) / stats.total) * 100}%`
              }}
              transition={{ duration: 1, delay: 0.9 }}
            />
          </div>
          <div className="mt-3 flex justify-between text-xs">
            <span className="text-green-600 dark:text-green-400">Побед: {stats.wins}</span>
            <span className="text-blue-600 dark:text-blue-400">Ничьих: {stats.draws}</span>
            <span className="text-red-600 dark:text-red-400">Поражений: {stats.losses}</span>
          </div>
        </Surface>
      </motion.div>

      {/* Последние результаты */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Surface>
          <h3 className="font-semibold mb-3">Последние 10 игр</h3>
          <div className="flex gap-1">
            {recentGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                className={`h-8 flex-1 rounded ${
                  game.result === "1-0"
                    ? "bg-green-500"
                    : game.result === "0-1"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
                title={`${game.opponent} - ${game.result}`}
              />
            ))}
          </div>
        </Surface>
      </motion.div>
    </div>
  );
}
