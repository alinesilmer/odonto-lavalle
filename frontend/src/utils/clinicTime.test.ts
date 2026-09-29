import { describe, expect, it } from "vitest";
import { clinicDayBounds, clinicTimeToUtc, isValidIsoDate, utcToClinicTime } from "@odonto/shared";
import { clinicMonthOf, clinicYearOf, formatClinicDate, toApiTimestamp } from "./clinicTime";

/**
 * The clinic runs on America/Argentina/Buenos_Aires (UTC-3, no DST). These
 * pin the conversion both the API and the browser depend on.
 */
describe("clinicTimeToUtc", () => {
  it("shifts a clinic wall time to the right UTC instant", () => {
    expect(clinicTimeToUtc("2026-03-14", "09:00").toISOString()).toBe("2026-03-14T12:00:00.000Z");
  });

  it("carries midnight into the following UTC day", () => {
    expect(clinicTimeToUtc("2026-03-14", "00:00").toISOString()).toBe("2026-03-14T03:00:00.000Z");
  });

  it("rejects malformed input rather than inventing a date", () => {
    expect(() => clinicTimeToUtc("14/03/2026", "09:00")).toThrow(RangeError);
    expect(() => clinicTimeToUtc("2026-03-14", "9am")).toThrow(RangeError);
  });
});

describe("utcToClinicTime", () => {
  it("round-trips every slot of a day", () => {
    for (const time of ["00:00", "08:30", "13:30", "23:30"]) {
      const instant = clinicTimeToUtc("2026-07-09", time);
      expect(utcToClinicTime(instant)).toEqual({ date: "2026-07-09", time });
    }
  });

  it("reports the previous clinic day for an early-morning UTC instant", () => {
    expect(utcToClinicTime("2026-03-15T02:00:00.000Z")).toEqual({
      date: "2026-03-14",
      time: "23:00",
    });
  });

  it("degrades instead of throwing on bad input", () => {
    expect(utcToClinicTime("not-a-date")).toEqual({ date: "", time: "" });
  });
});

describe("clinicDayBounds", () => {
  it("spans exactly 24 hours of clinic time", () => {
    const { start, end } = clinicDayBounds("2026-03-14");
    expect(start.toISOString()).toBe("2026-03-14T03:00:00.000Z");
    expect(end.getTime() - start.getTime()).toBe(24 * 60 * 60 * 1000);
  });

  it("rolls over month and year ends", () => {
    expect(utcToClinicTime(clinicDayBounds("2026-01-31").end).date).toBe("2026-02-01");
    expect(utcToClinicTime(clinicDayBounds("2026-12-31").end).date).toBe("2027-01-01");
  });
});

describe("isValidIsoDate", () => {
  it("accepts real dates including leap days", () => {
    expect(isValidIsoDate("2026-03-14")).toBe(true);
    expect(isValidIsoDate("2028-02-29")).toBe(true);
  });

  it("rejects days that do not exist", () => {
    expect(isValidIsoDate("2026-02-31")).toBe(false);
    expect(isValidIsoDate("2026-02-29")).toBe(false);
    expect(isValidIsoDate("2026-13-01")).toBe(false);
    expect(isValidIsoDate("nope")).toBe(false);
  });
});

describe("browser-facing helpers", () => {
  it("builds the timestamp the API expects", () => {
    expect(toApiTimestamp("2026-03-14", "09:00")).toBe("2026-03-14T12:00:00.000Z");
  });

  it("formats and buckets by the clinic's calendar, not UTC", () => {
    // 02:00 UTC on the 15th is still the 14th at the clinic.
    const lateNight = "2026-03-15T02:00:00.000Z";
    expect(formatClinicDate(lateNight)).toBe("14/03/2026");
    expect(clinicMonthOf(lateNight)).toBe(3);
    expect(clinicYearOf(lateNight)).toBe(2026);
  });

  it("returns a placeholder for an unparseable instant", () => {
    expect(formatClinicDate("nope")).toBe("-");
    expect(clinicMonthOf("nope")).toBeNull();
  });
});
