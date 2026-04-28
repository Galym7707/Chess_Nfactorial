"use client";

import { Surface } from "@/components/ui/surface";
import type { Achievement } from "@/lib/achievements";

export function AchievementsList({ achievements }: { achievements: Achievement[] }) {
  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <Surface>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl font-semibold">Достижения</h2>
        <span className="text-sm text-muted-foreground">
          {unlocked.length} / {achievements.length}
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {unlocked.length > 0 && (
          <>
            <p className="text-sm font-semibold text-primary">Открыто</p>
            {unlocked.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </>
        )}

        {locked.length > 0 && (
          <>
            <p className="mt-3 text-sm font-semibold text-muted-foreground">Заблокировано</p>
            {locked.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </>
        )}
      </div>
    </Surface>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        achievement.unlocked
          ? "border-primary/30 bg-primary/10"
          : "border-border bg-muted/40 opacity-60"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{achievement.icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold">{achievement.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{achievement.description}</p>
          {achievement.progress !== undefined && achievement.maxProgress && (
            <div className="mt-2">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
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
