"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, Clock, Gamepad2, Link2, Users, Zap, Settings } from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { useAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { CustomTimeControl } from "@/components/chess/custom-time-control";
import { createFriendRoom } from "@/lib/multiplayer/rooms";
import { TIME_CONTROLS } from "@/lib/chess/time-control";
import { cn } from "@/lib/utils";
import type { TimeControl } from "@/types/app";

const gameModes = [
  {
    id: "friend",
    title: "Играть с другом",
    description: "Создайте комнату и отправьте ссылку другу для игры на разных устройствах",
    icon: Link2,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    action: "create-room",
  },
  {
    id: "ai",
    title: "Против компьютера",
    description: "Играйте против Stockfish с настраиваемым уровнем сложности",
    icon: Bot,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    href: "/play/ai",
  },
  {
    id: "local",
    title: "За одной доской",
    description: "Играйте вдвоём на одном устройстве, передавая ходы по очереди",
    icon: Users,
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    href: "/play/local",
  },
  {
    id: "sandbox",
    title: "Анализ позиции",
    description: "Редактор доски с анализом Stockfish для изучения позиций",
    icon: Gamepad2,
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    href: "/play/sandbox",
  },
];

function PlayModeSelector() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedTime, setSelectedTime] = useState<TimeControl>("blitz");
  const [customTime, setCustomTime] = useState<{ minutes: number; increment: number } | null>(null);
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [isRated, setIsRated] = useState(true);
  const [creatingRoom, setCreatingRoom] = useState(false);

  const effectiveTime = customTime
    ? { id: "custom" as TimeControl, label: "Своё", time: `${customTime.minutes}+${customTime.increment}`, initialSeconds: customTime.minutes * 60, incrementSeconds: customTime.increment, description: `${customTime.minutes} мин + ${customTime.increment} сек` }
    : TIME_CONTROLS.find((tc) => tc.id === selectedTime) || TIME_CONTROLS[1];

  async function handleCreateRoom() {
    if (!user) return;
    setCreatingRoom(true);
    try {
      const timeControl = effectiveTime;
      const room = await createFriendRoom(user.id, timeControl, isRated);
      router.push(`/play/friend/${room.id}`);
    } catch (err) {
      console.error(err);
      setCreatingRoom(false);
    }
  }

  async function handleModeClick(mode: typeof gameModes[0]) {
    if (mode.action === "create-room") {
      await handleCreateRoom();
    } else if (mode.href) {
      const timeControl = effectiveTime;
      const params = new URLSearchParams({
        timeControl: timeControl?.id ?? "blitz",
        isRated: isRated.toString(),
      });
      router.push(`${mode.href}?${params.toString()}`);
    }
  }

  function handleCustomTimeSelect(minutes: number, increment: number) {
    setCustomTime({ minutes, increment });
    setSelectedTime("custom" as TimeControl);
    setShowCustomTime(false);
  }

  if (showCustomTime) {
    return (
      <section className="mx-auto min-h-[80svh] max-w-2xl px-4 py-10 md:px-6">
        <CustomTimeControl
          onSelect={handleCustomTimeSelect}
          onClose={() => setShowCustomTime(false)}
        />
      </section>
    );
  }

  return (
    <section className="mx-auto min-h-[80svh] max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8 text-center">
        <Badge className="mb-4">
          <Gamepad2 className="size-3" /> Выбор режима
        </Badge>
        <h1 className="font-display text-5xl font-semibold md:text-6xl">Играть в шахматы</h1>
        <p className="mt-4 text-muted-foreground">
          Выберите режим игры и контроль времени
        </p>
      </div>

      {/* Rated / Casual toggle */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-full border-2 border-border bg-muted/30 p-1">
          <button
            onClick={() => setIsRated(true)}
            className={cn(
              "rounded-full px-6 py-2 text-sm font-semibold transition-all",
              isRated ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
            type="button"
          >
            ⚔️ Рейтинговая
          </button>
          <button
            onClick={() => setIsRated(false)}
            className={cn(
              "rounded-full px-6 py-2 text-sm font-semibold transition-all",
              !isRated ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
            type="button"
          >
            🤝 Дружеская
          </button>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Контроль времени
        </h2>
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-6">
          {TIME_CONTROLS.map((control) => {
            const Icon = control.id === "unlimited" ? Clock : Zap;
            return (
              <button
                key={control.id}
                onClick={() => {
                  setSelectedTime(control.id);
                  setCustomTime(null);
                }}
                className={cn(
                  "rounded-2xl border-2 p-4 text-left transition-all hover:scale-105",
                  selectedTime === control.id && !customTime
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                )}
                type="button"
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-4" />
                  <span className="font-semibold">{control.label}</span>
                </div>
                <div className="mt-2 font-mono text-2xl font-bold">{control.time}</div>
                <div className="mt-1 text-xs text-muted-foreground">{control.description}</div>
              </button>
            );
          })}

          {/* Custom time button */}
          <button
            onClick={() => setShowCustomTime(true)}
            className={cn(
              "rounded-2xl border-2 p-4 text-left transition-all hover:scale-105",
              customTime
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/50"
            )}
            type="button"
          >
            <div className="flex items-center gap-2">
              <Settings className="size-4" />
              <span className="font-semibold">Своё</span>
            </div>
            <div className="mt-2 font-mono text-2xl font-bold">
              {customTime ? `${customTime.minutes}+${customTime.increment}` : "?+?"}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {customTime ? `${customTime.minutes} мин` : "Настроить"}
            </div>
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {gameModes.map((mode) => {
          const Icon = mode.icon;
          const isCreatingThisMode = mode.action === "create-room" && creatingRoom;

          return (
            <Surface
              key={mode.id}
              className="group cursor-pointer transition-all hover:scale-[1.02]"
              onClick={() => !isCreatingThisMode && handleModeClick(mode)}
            >
              <div className="flex items-start gap-4">
                <div className={cn("rounded-2xl border-2 p-4", mode.color)}>
                  <Icon className="size-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-semibold">{mode.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {mode.description}
                  </p>
                  <Button
                    className="mt-4"
                    variant="secondary"
                    size="sm"
                    disabled={isCreatingThisMode}
                    type="button"
                  >
                    {isCreatingThisMode ? "Создаю комнату..." : "Начать игру"}
                  </Button>
                </div>
              </div>
            </Surface>
          );
        })}
      </div>
    </section>
  );
}

export default function PlayPage() {
  return (
    <AuthGate>
      <PlayModeSelector />
    </AuthGate>
  );
}
