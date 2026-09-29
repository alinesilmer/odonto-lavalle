/** Clock-time maths for the TimePicker. Times travel as "HH:mm", like <input type="time">. */

const DAY = 24 * 60;

/** "09:30" → 570 minutes after midnight (NaN for malformed input). */
export function parseTime(time: string): number {
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : Number.NaN;
}

/** 570 → "09:30", wrapping around midnight. */
export function toTime(minutes: number): string {
  const m = ((Math.round(minutes) % DAY) + DAY) % DAY;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

export const addMinutes = (time: string, delta: number): string => toTime(parseTime(time) + delta);

/** Every `step` minutes from `from` to `to`, both included: ("08:00", "09:00", 30) → 08:00, 08:30, 09:00. */
export function timeSlots(from: string, to: string, step: number): string[] {
  const start = parseTime(from);
  const end = parseTime(to);
  if (Number.isNaN(start) || Number.isNaN(end) || step <= 0) return [];
  const slots: string[] = [];
  for (let m = start; m <= end; m += step) slots.push(toTime(m));
  return slots;
}
