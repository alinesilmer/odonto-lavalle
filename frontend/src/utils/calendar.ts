import { isoWeek, toIsoDate } from "./date";

/**
 * Pure calendar maths for the shared Calendar/DatePicker. Dates are local
 * calendar days; values travel as ISO strings ("2026-09-29"), like <input type="date">.
 */

/** "2026-09-29" → a local Date at midnight; null for empty or malformed input. */
export function fromIsoDate(iso: string | null | undefined): Date | null {
  const match = iso?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Same day of month in another month, clamped (31 Jan + 1 month → 28/29 Feb). */
export function addMonthsClamped(date: Date, months: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
}

export const isSameDay = (a: Date | null, b: Date | null): boolean =>
  Boolean(a && b) && toIsoDate(a!) === toIsoDate(b!);

/** Monday of the week containing `date`. */
export function startOfWeek(date: Date): Date {
  return addDays(date, -((date.getDay() + 6) % 7));
}

/** The 42 days (6 Monday-first weeks) shown for a month, spilling into its neighbours. */
export function monthMatrix(year: number, month: number): Date[] {
  const first = startOfWeek(new Date(year, month, 1));
  return Array.from({ length: 42 }, (_, i) => addDays(first, i));
}

/** Is `date` inside [min, max] (either bound optional, ISO strings)? */
export function isWithin(date: Date, min?: string, max?: string): boolean {
  const iso = toIsoDate(date);
  return (!min || iso >= min) && (!max || iso <= max);
}

/** A date → its ISO-8601 week, "2026-W40" (the value <input type="week"> uses). */
export function toIsoWeek(date: Date): string {
  // The ISO year is the year of that week's Thursday.
  const thursday = addDays(startOfWeek(date), 3);
  return `${thursday.getFullYear()}-W${String(isoWeek(date)).padStart(2, "0")}`;
}

/** "2026-W40" → the Monday of that week. */
export function fromIsoWeek(week: string): Date | null {
  const match = week.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  // 4 January is always in week 1.
  const weekOne = startOfWeek(new Date(year, 0, 4));
  return addDays(weekOne, (Number(match[2]) - 1) * 7);
}

/** Any stored date ("2024-01-15" or a full ISO timestamp) → its calendar day, or null. */
export const toCalendarDay = (value: string | null | undefined): Date | null =>
  fromIsoDate(value?.slice(0, 10));
