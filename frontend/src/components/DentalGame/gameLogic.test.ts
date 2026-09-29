import { describe, expect, it } from "vitest";
import { GAME, INITIAL_TEETH, brushStroke, decayTeeth, isDecaying, verdictFor } from "./gameLogic";

const first = INITIAL_TEETH[0];

describe("brushStroke", () => {
  it("cleans a tooth under the brush and stamps when it was brushed", () => {
    const { teeth } = brushStroke(INITIAL_TEETH, first.x, first.y, 1_000);
    expect(teeth[0].cleanliness).toBe(3);
    expect(teeth[0].brushedAt).toBe(1_000);
  });

  it("leaves teeth outside the brush radius alone", () => {
    const { teeth } = brushStroke(INITIAL_TEETH, first.x, first.y, 1_000);
    expect(teeth.slice(1).every((tooth) => tooth.cleanliness === 0)).toBe(true);
  });

  it("reports a tooth as completed exactly once", () => {
    const almost = INITIAL_TEETH.map((t, i) => (i === 0 ? { ...t, cleanliness: 99 } : t));
    const once = brushStroke(almost, first.x, first.y, 1_000);
    expect(once.completed.map((t) => t.id)).toEqual([first.id]);

    const again = brushStroke(once.teeth, first.x, first.y, 1_100);
    expect(again.completed).toEqual([]);
  });
});

describe("decayTeeth", () => {
  const half = INITIAL_TEETH.map((t, i) => (i === 0 ? { ...t, cleanliness: 50, brushedAt: 0 } : t));

  it("returns the same array while every tooth is still within the grace period", () => {
    expect(decayTeeth(half, GAME.decayGraceMs - 1)).toBe(half);
  });

  it("brings plaque back on a half-brushed tooth left alone", () => {
    const next = decayTeeth(half, GAME.decayGraceMs + 1);
    expect(next[0].cleanliness).toBe(50 - GAME.decayStep);
    expect(isDecaying(half[0], GAME.decayGraceMs + 1)).toBe(true);
  });

  it("never touches finished or untouched teeth", () => {
    const done = INITIAL_TEETH.map((t, i) => (i === 0 ? { ...t, cleanliness: 100 } : t));
    expect(decayTeeth(done, 60_000)).toBe(done);
  });
});

describe("verdictFor", () => {
  it("picks the best band the cleanliness reaches", () => {
    expect(verdictFor(100).min).toBe(100);
    expect(verdictFor(85).min).toBe(80);
    expect(verdictFor(10).min).toBe(0);
  });
});
