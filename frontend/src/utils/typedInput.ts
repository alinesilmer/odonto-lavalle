/**
 * Parsing what people type into date and time fields, so they can skip the
 * calendar or clock when they already know the value. Forgiving on purpose:
 * "29/9/26", "290926" and "29-09-2026" are all the same day.
 */
import { toIsoDate } from "./date";

const pad = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD" → "dd/mm/aaaa" for the field; "" stays "". */
export function formatDateInput(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}

/** Two-digit years: up to next year means 20xx, beyond that 19xx (birth dates). */
function fullYear(y: number, today: Date): number {
  if (y >= 100) return y;
  const cutoff = (today.getFullYear() % 100) + 1;
  return y <= cutoff ? 2000 + y : 1900 + y;
}

/**
 * Typed text → "YYYY-MM-DD", or null if it isn't a real date.
 * Accepts dd/mm/aaaa, dd/mm/aa, dd/mm (this year) with / - . or space, and
 * the same as plain digits (ddmm, ddmmaa, ddmmaaaa).
 */
export function parseDateInput(text: string, today = new Date()): string | null {
  const t = text.trim();
  if (!t) return null;

  let parts: string[];
  if (/^\d+$/.test(t)) {
    if (![4, 6, 8].includes(t.length)) return null;
    parts = [t.slice(0, 2), t.slice(2, 4), t.slice(4)].filter(Boolean);
  } else {
    parts = t.split(/[/\-.\s]+/).filter(Boolean);
    if (parts.length < 2 || parts.length > 3 || parts.some((p) => !/^\d+$/.test(p))) return null;
  }

  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = parts[2] ? fullYear(Number(parts[2]), today) : today.getFullYear();
  if (parts[2] && ![2, 4].includes(parts[2].length)) return null;

  const date = new Date(year, month - 1, day);
  const real = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return real ? toIsoDate(date) : null;
}

/**
 * Adds the slashes while someone types digits ("29" → "29/", "29/09" → "29/09/"),
 * but never when they're deleting, and leaves their own separators alone.
 */
export function maskDateInput(previous: string, next: string): string {
  if (next.length <= previous.length) return next;
  // A separator typed right after the automatic slash is absorbed ("06/" + "/" stays "06/"),
  // so typing the slashes yourself works too and the date never overflows the field.
  const cleaned = next.replace(/[/\-.]{2,}/g, "/").slice(0, 10);
  if (/^\d{2}$/.test(cleaned) || /^\d{1,2}\/\d{2}$/.test(cleaned)) return `${cleaned}/`;
  return cleaned;
}

/**
 * Typed text → "HH:mm", or null. Accepts 9, 09, 930, 0930, 9:30, 9.30,
 * 9h, 9 hs, 14:05.
 */
export function parseTimeInput(text: string): string | null {
  const t = text.trim().toLowerCase().replace(/\s*(hs|h)\.?$/, "");
  if (!t) return null;

  let hours: number;
  let minutes: number;
  const split = t.match(/^(\d{1,2})[:.](\d{1,2})$/);
  if (split) {
    hours = Number(split[1]);
    minutes = Number(split[2].padEnd(2, "0"));
  } else if (/^\d{1,4}$/.test(t)) {
    if (t.length <= 2) {
      hours = Number(t);
      minutes = 0;
    } else {
      hours = Number(t.slice(0, t.length - 2));
      minutes = Number(t.slice(-2));
    }
  } else {
    return null;
  }

  return hours < 24 && minutes < 60 ? `${pad(hours)}:${pad(minutes)}` : null;
}
