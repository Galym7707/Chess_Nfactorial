"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Surface } from "@/components/ui/surface";
import type { AppGame } from "@/types/app";

interface RatingChartProps {
  games: AppGame[];
  currentRating: number;
}

export function RatingChart({ games, currentRating }: RatingChartProps) {
  const chartData = useMemo(() => {
    // Берем последние 30 игр с изменением рейтинга
    const ratedGames = games
      .filter(g => g.rating_change !== undefined && g.rating_change !== null)
      .slice(0, 30)
      .reverse();

    if (ratedGames.length === 0) {
      return [{ game: 0, rating: currentRating }];
    }

    let rating = currentRating;
    const data = [{ game: ratedGames.length, rating: currentRating }];

    // Идем в обратном порядке, вычитая изменения рейтинга
    for (let i = ratedGames.length - 1; i >= 0; i--) {
      rating -= ratedGames[i].rating_change || 0;
      data.unshift({ game: i, rating: Math.round(rating) });
    }

    return data;
  }, [games, currentRating]);

  const minRating = Math.min(...chartData.map(d => d.rating)) - 50;
  const maxRating = Math.max(...chartData.map(d => d.rating)) + 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Surface>
        <h3 className="font-semibold mb-4">График рейтинга</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="game"
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                label={{ value: "Игры", position: "insideBottom", offset: -5, fill: "rgba(255,255,255,0.7)" }}
              />
              <YAxis
                domain={[minRating, maxRating]}
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                label={{ value: "Рейтинг", angle: -90, position: "insideLeft", fill: "rgba(255,255,255,0.7)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#fff"
                }}
                labelFormatter={(value) => `Игра ${value}`}
                formatter={(value) => [`${value}`, "Рейтинг"]}
              />
              <Area
                type="monotone"
                dataKey="rating"
                stroke="rgb(var(--primary))"
                strokeWidth={3}
                fill="url(#ratingGradient)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Текущий: </span>
            <span className="font-semibold text-primary">{currentRating}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Мин: </span>
            <span className="font-semibold">{Math.min(...chartData.map(d => d.rating))}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Макс: </span>
            <span className="font-semibold">{Math.max(...chartData.map(d => d.rating))}</span>
          </div>
        </div>
      </Surface>
    </motion.div>
  );
}
