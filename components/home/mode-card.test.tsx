import { render, screen } from "@testing-library/react";
import { Bot } from "lucide-react";
import { describe, expect, it } from "vitest";
import { ModeCard } from "./mode-card";

describe("ModeCard", () => {
  it("renders a playable mode link", () => {
    render(<ModeCard title="Игра против движка" eyebrow="Тренировка" description="Партия против Stockfish" href="/play/ai" icon={Bot} />);
    expect(screen.getByRole("link", { name: /Игра против движка/i })).toHaveAttribute("href", "/play/ai");
  });
});
