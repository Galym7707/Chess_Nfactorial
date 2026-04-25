"use client";

import { Select } from "@/components/ui/select";
import { boardThemes } from "@/lib/chess/themes";
import type { BoardTheme } from "@/types/app";

export function BoardThemePicker({ value, onChange, isPro = false }: { value: BoardTheme; onChange: (theme: BoardTheme) => void; isPro?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      Тема доски
      <Select value={value} onChange={(event) => onChange(event.target.value as BoardTheme)}>
        {Object.entries(boardThemes).map(([key, theme]) => (
          <option key={key} value={key} disabled={theme.premium && !isPro}>
            {theme.label}{theme.premium && !isPro ? " · Pro" : ""}
          </option>
        ))}
      </Select>
    </label>
  );
}