import type { AppointmentStatus } from "@odonto/shared";
import type { AppointmentRow } from "@/services/adapters";
import { normalizeText } from "@/utils/text";
import { isoWeek } from "@/utils/date";
import { clinicMonthOf, clinicYearOf } from "@/utils/clinicTime";
import { ALL_MONTHS } from "@/data/calendarOptions";

export interface AppointmentFilters {
  /** "" for every month, otherwise the 1-based month number. */
  month: string;
  /** An <input type="week"> value, "2026-W12". */
  week: string;
  /** "HH:mm"; matches appointments starting in that hour. */
  hour: string;
  status: AppointmentStatus | "all";
  /** Free text matched against the patient name and the reason, accent-insensitive. */
  search: string;
}

export const EMPTY_FILTERS: AppointmentFilters = { month: ALL_MONTHS, week: "", hour: "", status: "all", search: "" };

function matchesWeek(row: AppointmentRow, week: string): boolean {
  const [year, weekNumber] = week.split("-W").map(Number);
  if (!year || !weekNumber) return true;

  const date = new Date(row.startsAt);
  return clinicYearOf(row.startsAt) === year && isoWeek(date) === weekNumber;
}

export function filterAppointments(
  rows: AppointmentRow[],
  filters: AppointmentFilters,
): AppointmentRow[] {
  return rows.filter((row) => {
    if (filters.month !== ALL_MONTHS && clinicMonthOf(row.startsAt) !== Number(filters.month)) {
      return false;
    }
    if (filters.week && !matchesWeek(row, filters.week)) return false;
    if (filters.hour && !row.time.startsWith(filters.hour)) return false;
    if (filters.status !== "all" && row.rawStatus !== filters.status) return false;
    if (filters.search && !normalizeText(`${row.patientName} ${row.reason}`).includes(normalizeText(filters.search))) {
      return false;
    }
    return true;
  });
}
