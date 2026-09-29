export const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/** Monday-first, matching how the calendar grid is laid out. */
export const DAY_NAMES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

export const ALL_MONTHS = "";

/** Month picker options. Value is the 1-based month number, not its name. */
export const MONTH_OPTIONS = [
  { value: ALL_MONTHS, label: "Todos" },
  ...MONTH_NAMES.map((label, index) => ({ value: String(index + 1), label })),
];
