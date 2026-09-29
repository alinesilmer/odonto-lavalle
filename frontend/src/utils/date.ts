const pad = (n: number) => String(n).padStart(2, "0");

/** Date -> "2026-03-14" in local time, the value an <input type="date"> wants. */
export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Date -> "14/03/2026". */
export function formatDateAR(date: Date): string {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

/** ISO-8601 week number, as used by the "this week" appointment filter. */
export function isoWeek(date: Date): number {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Thursday decides the week's year, per ISO-8601.
  target.setUTCDate(target.getUTCDate() + 4 - (target.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

/** Date -> "martes, 30 de septiembre" (lower-case; capitalise in CSS if needed). */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
}

/** Whole calendar days from today to `date`: 0 today, 1 tomorrow, -1 yesterday. */
export function daysUntil(date: Date, today: Date = new Date()): number {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

/** 0 → "Hoy", 1 → "Mañana", 5 → "En 5 días", -1 → "Ayer", -3 → "Hace 3 días". */
export function relativeDayLabel(days: number): string {
  if (days === 0) return "Hoy";
  if (days === 1) return "Mañana";
  if (days === -1) return "Ayer";
  return days > 0 ? `En ${days} días` : `Hace ${-days} días`;
}

/** Date -> "15 ene 2024". */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" }).replace(".", "");
}
