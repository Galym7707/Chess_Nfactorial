import { render, screen } from "@testing-library/react";
import { Bot } from "lucide-react";
import { describe, expect, it } from "vitest";
import { ModeCard } from "./mode-card";

describe("ModeCard", () => {
  it("renders a playable mode link", () => {
    render(<ModeCard title="AI Arena" level="Сильный" description="Stockfish mode" href="/play/ai" icon={Bot} />);
    expect(screen.getByRole("link", { name: /AI Arena/i })).toHaveAttribute("href", "/play/ai");
  });
});