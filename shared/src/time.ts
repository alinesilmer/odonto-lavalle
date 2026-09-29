/**
 * Clinic-local time handling.
 *
 * Appointments are stored as UTC instants, but everyone books and reads them in
 * the clinic's wall-clock time. Both sides import these so a "09:00" slot means
 * the same moment on the server, in the browser and in the database.
 */

/** Where the clinic physically is. Wall-clock times are in this zone. */
export const CLINIC_TIME_ZONE = "America/Argentina/Buenos_Aires";

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_OF_DAY = /^(\d{2}):(\d{2})$/;

/** True only for a real calendar date; rejects "2026-02-31". */
export function isValidIsoDate(value: string): boolean {
  const match = ISO_DATE.exec(value);
  if (!match) return false;

  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d
  );
}

/** Minutes `timeZone` is ahead of UTC at `instant` (negative when behind). */
function zoneOffsetMinutes(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);

  const at = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  // `hour` can come back as 24 for midnight in some engines.
  const hour = at("hour") % 24;

  const asIfUtc = Date.UTC(at("year"), at("month") - 1, at("day"), hour, at("minute"), at("second"));
  return (asIfUtc - instant.getTime()) / 60_000;
}

/**
 * A clinic-local date and time of day -> the UTC instant it refers to.
 *
 * The offset depends on the instant we are resolving, so it is applied once and
 * then re-checked: if the first guess landed on the far side of a DST change,
 * the second offset is the correct one.
 */
export function clinicTimeToUtc(
  isoDate: string,
  timeOfDay: string,
  timeZone: string = CLINIC_TIME_ZONE,
): Date {
  const date = ISO_DATE.exec(isoDate);
  const time = TIME_OF_DAY.exec(timeOfDay);
  if (!date || !time) throw new RangeError(`Invalid clinic time: ${isoDate} ${timeOfDay}`);

  const [, y, mo, d] = date.map(Number);
  const [, h, mi] = time.map(Number);

  const wallAsUtc = Date.UTC(y, mo - 1, d, h, mi);
  const firstGuess = new Date(wallAsUtc - zoneOffsetMinutes(new Date(wallAsUtc), timeZone) * 60_000);
  const settled = zoneOffsetMinutes(firstGuess, timeZone);

  return new Date(wallAsUtc - settled * 60_000);
}

export interface ClinicDateTime {
  /** "2026-03-14" */
  date: string;
  /** "13:30" */
  time: string;
}

/** A UTC instant -> the clinic's wall-clock date and time. */
export function utcToClinicTime(
  instant: Date | string,
  timeZone: string = CLINIC_TIME_ZONE,
): ClinicDateTime {
  const value = instant instanceof Date ? instant : new Date(instant);
  if (Number.isNaN(value.getTime())) return { date: "", time: "" };

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(value);

  const at = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const hour = String(Number(at("hour")) % 24).padStart(2, "0");

  return {
    date: `${at("year")}-${at("month")}-${at("day")}`,
    time: `${hour}:${at("minute")}`,
  };
}

/** The UTC instants bounding a clinic-local calendar day, end exclusive. */
export function clinicDayBounds(
  isoDate: string,
  timeZone: string = CLINIC_TIME_ZONE,
): { start: Date; end: Date } {
  const [y, m, d] = isoDate.split("-").map(Number);
  // Date.UTC normalises the roll-over, so the 31st of a 31-day month works.
  const nextDay = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);

  return {
    start: clinicTimeToUtc(isoDate, "00:00", timeZone),
    end: clinicTimeToUtc(nextDay, "00:00", timeZone),
  };
}

/** Today's date in the clinic's zone, as "2026-03-14". */
export const clinicToday = (timeZone: string = CLINIC_TIME_ZONE): string =>
  utcToClinicTime(new Date(), timeZone).date;
