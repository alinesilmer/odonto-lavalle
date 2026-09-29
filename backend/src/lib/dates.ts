/**
 * Scheduling dates, always in the clinic's wall-clock time.
 *
 * The conversion itself lives in @odonto/shared so the browser builds exactly
 * the same instants this module does.
 */
import { clinicDayBounds, clinicTimeToUtc, clinicToday, utcToClinicTime } from "@odonto/shared";
import { env } from "../config/env.js";

export { isValidIsoDate } from "@odonto/shared";

/** All bookable slot start times for a day, as clinic-local "HH:mm". */
export function slotsForDay(): string[] {
  const slots: string[] = [];
  const open = env.CLINIC_OPEN_HOUR * 60;
  const close = env.CLINIC_CLOSE_HOUR * 60;

  for (let minutes = open; minutes < close; minutes += env.APPOINTMENT_MINUTES) {
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
  }
  return slots;
}

/** The UTC instant a clinic-local slot on `isoDate` starts at. */
export const slotInstant = (isoDate: string, slot: string): Date =>
  clinicTimeToUtc(isoDate, slot, env.CLINIC_TIMEZONE);

/** Start and end of a clinic-local calendar day, as UTC Dates for range queries. */
export const dayBounds = (isoDate: string) => clinicDayBounds(isoDate, env.CLINIC_TIMEZONE);

/** A stored instant -> the clinic-local "HH:mm" it falls on. */
export const slotOf = (instant: Date): string =>
  utcToClinicTime(instant, env.CLINIC_TIMEZONE).time;

/** Today's date in the clinic's zone. */
export const todayIsoDate = (): string => clinicToday(env.CLINIC_TIMEZONE);

/** First instant of the current clinic-local month, and of the next one. */
export function monthBounds(now: Date = new Date()): { start: Date; end: Date } {
  const { date } = utcToClinicTime(now, env.CLINIC_TIMEZONE);
  const [year, month] = date.split("-").map(Number);

  const first = `${year}-${String(month).padStart(2, "0")}-01`;
  const nextMonth = month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, "0")}-01`;

  return {
    start: clinicTimeToUtc(first, "00:00", env.CLINIC_TIMEZONE),
    end: clinicTimeToUtc(nextMonth, "00:00", env.CLINIC_TIMEZONE),
  };
}

/** First instant of the current clinic-local year. */
export function yearStart(now: Date = new Date()): Date {
  const { date } = utcToClinicTime(now, env.CLINIC_TIMEZONE);
  return clinicTimeToUtc(`${date.slice(0, 4)}-01-01`, "00:00", env.CLINIC_TIMEZONE);
}

export const toIso = (value: Date | FirebaseFirestore.Timestamp | undefined): string | undefined => {
  if (!value) return undefined;
  return value instanceof Date ? value.toISOString() : value.toDate().toISOString();
};
