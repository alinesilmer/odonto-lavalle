import { describe, expect, it } from "vitest";
import {
  addMonthsClamped,
  fromIsoDate,
  fromIsoWeek,
  isWithin,
  monthMatrix,
  startOfWeek,
  toIsoWeek,
} from "./calendar";
import { toIsoDate } from "./date";

describe("fromIsoDate", () => {
  it("reads a calendar day as local midnight", () => {
    const d = fromIsoDate("2026-09-29")!;
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([2026, 8, 29, 0]);
  });

  it("rejects empty and malformed values", () => {
    expect(fromIsoDate("")).toBeNull();
    expect(fromIsoDate("29/09/2026")).toBeNull();
  });
});

describe("monthMatrix", () => {
  it("is 42 days starting on the Monday on or before the 1st", () => {
    const days = monthMatrix(2026, 8); // September 2026 starts on a Tuesday
    expect(days).toHaveLength(42);
    expect(toIsoDate(days[0])).toBe("2026-08-31");
    expect(days[0].getDay()).toBe(1);
  });
});

describe("addMonthsClamped", () => {
  it("clamps to the last day of shorter months", () => {
    expect(toIsoDate(addMonthsClamped(new Date(2026, 0, 31), 1))).toBe("2026-02-28");
  });
});

describe("startOfWeek", () => {
  it("treats Sunday as the end of the week", () => {
    expect(toIsoDate(startOfWeek(new Date(2026, 9, 4)))).toBe("2026-09-28");
  });
});

describe("ISO weeks", () => {
  it("round-trips a week through its Monday", () => {
    const week = toIsoWeek(new Date(2026, 8, 30));
    expect(week).toBe("2026-W40");
    expect(toIsoDate(fromIsoWeek(week)!)).toBe("2026-09-28");
  });

  it("uses the ISO year at the turn of the year", () => {
    expect(toIsoWeek(new Date(2027, 0, 1))).toBe("2026-W53");
  });
});

describe("isWithin", () => {
  it("honours optional bounds", () => {
    const d = new Date(2026, 8, 29);
    expect(isWithin(d, "2026-09-29")).toBe(true);
    expect(isWithin(d, "2026-09-30")).toBe(false);
    expect(isWithin(d, undefined, "2026-09-28")).toBe(false);
  });
});
