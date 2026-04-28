import type { TimeControl, TimeControlConfig } from "@/types/app";

export const TIME_CONTROLS: TimeControlConfig[] = [
  { id: "bullet", label: "Пуля", time: "1+0", initialSeconds: 60, incrementSeconds: 0, description: "1 минута" },
  { id: "blitz", label: "Блиц", time: "3+0", initialSeconds: 180, incrementSeconds: 0, description: "3 минуты" },
  { id: "rapid", label: "Рапид", time: "10+0", initialSeconds: 600, incrementSeconds: 0, description: "10 минут" },
  { id: "classical", label: "Классика", time: "30+0", initialSeconds: 1800, incrementSeconds: 0, description: "30 минут" },
  { id: "unlimited", label: "Без времени", time: "∞", initialSeconds: 0, incrementSeconds: 0, description: "Без ограничений" },
];

export function getTimeControl(id: TimeControl): TimeControlConfig {
  return TIME_CONTROLS.find((tc) => tc.id === id) ?? TIME_CONTROLS[1];
}

export function formatTime(milliseconds: number): string {
  if (milliseconds <= 0) return "0:00";
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function parseTimeControl(timeString: string): { initialSeconds: number; incrementSeconds: number } {
  const match = timeString.match(/^(\d+)\+(\d+)$/);
  if (!match) return { initialSeconds: 180, incrementSeconds: 0 };
  return {
    initialSeconds: parseInt(match[1]) * 60,
    incrementSeconds: parseInt(match[2]),
  };
}
