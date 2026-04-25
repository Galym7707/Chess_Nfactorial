import { describe, expect, it } from "vitest";
import { moveFromPgn, needsPromotion } from "./core";

describe("chess core", () => {
  it("accepts legal opening moves and rejects illegal jumps", () => {
    const legal = moveFromPgn("", "e2", "e4");
    expect(legal.ok).toBe(true);
    expect(legal.moves).toEqual(["e4"]);

    const illegal = moveFromPgn("", "e2", "e5");
    expect(illegal.ok).toBe(false);
  });

  it("detects pawn promotion intent", () => {
    const pgn = "1. e4 a5 2. e5 a4 3. e6 a3 4. exf7+";
    expect(needsPromotion(pgn, "f7", "g8")).toBe(true);
  });
});