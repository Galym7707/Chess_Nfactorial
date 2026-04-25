import type { BoardTheme } from "@/types/app";

export const boardThemes: Record<BoardTheme, { label: string; light: string; dark: string; border: string; premium?: boolean }> = {
  classic: { label: "Classic", light: "#f0d9b5", dark: "#b58863", border: "#6d4c31" },
  midnight: { label: "Midnight", light: "#d8e4e8", dark: "#253445", border: "#09111d" },
  neon: { label: "Neon", light: "#d9fff5", dark: "#0f766e", border: "#34d399", premium: true },
  paper: { label: "Paper", light: "#f7f0db", dark: "#b8a27a", border: "#725f42", premium: true },
};