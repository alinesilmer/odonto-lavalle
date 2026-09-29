/**
 * Every appointment timestamp the UI builds or reads goes through here.
 *
 * The conversion itself lives in @odonto/shared, so the browser produces the
 * exact instants the API expects regardless of the visitor's own timezone.
 */
import { clinicTimeToUtc, clinicToday, utcToClinicTime } from "@odonto/shared";

export { clinicToday, utcToClinicTime };

/** Clinic-local date + "HH:mm" -> the ISO instant to send to the API. */
export const toApiTimestamp = (isoDate: string, time: string): string =>
  clinicTimeToUtc(isoDate, time).toISOString();

/** A stored instant -> the date and time inputs an edit form should show. */
export const toFormFields = (isoInstant: string): { date: string; time: string } =>
  utcToClinicTime(isoInstant);

/** A stored instant -> "14/03/2026" for display. */
export function formatClinicDate(isoInstant: string): string {
  const { date } = utcToClinicTime(isoInstant);
  if (!date) return "-";
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}

/** 1-based clinic-local month of an instant, or null when unparseable. */
export function clinicMonthOf(isoInstant: string): number | null {
  const { date } = utcToClinicTime(isoInstant);
  return date ? Number(date.slice(5, 7)) : null;
}

/** Clinic-local year of an instant, or null when unparseable. */
export function clinicYearOf(isoInstant: string): number | null {
  const { date } = utcToClinicTime(isoInstant);
  return date ? Number(date.slice(0, 4)) : null;
}

/** The clinic's today as a local Date at midnight (it may differ from the visitor's). */
export function clinicTodayDate(): Date {
  const [y, m, d] = clinicToday().split("-").map(Number);
  return new Date(y, m - 1, d);
}
