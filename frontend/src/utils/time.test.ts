import { describe, expect, it } from "vitest";
import { addMinutes, parseTime, timeSlots, toTime } from "./time";

describe("parseTime / toTime", () => {
  it("round-trips a clock time", () => {
    expect(parseTime("09:30")).toBe(570);
    expect(toTime(570)).toBe("09:30");
  });

  it("rejects malformed input", () => {
    expect(parseTime("9.30")).toBeNaN();
  });
});

describe("addMinutes", () => {
  it("wraps around midnight both ways", () => {
    expect(addMinutes("23:30", 60)).toBe("00:30");
    expect(addMinutes("00:10", -20)).toBe("23:50");
  });
});

describe("timeSlots", () => {
  it("includes both ends", () => {
    expect(timeSlots("08:00", "09:00", 30)).toEqual(["08:00", "08:30", "09:00"]);
  });

  it("returns nothing for a bad range or step", () => {
    expect(timeSlots("bad", "09:00", 30)).toEqual([]);
    expect(timeSlots("08:00", "09:00", 0)).toEqual([]);
  });
});
