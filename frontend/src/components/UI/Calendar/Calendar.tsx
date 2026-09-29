import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DAY_NAMES, MONTH_NAMES } from "@/data/calendarOptions";
import { isSameDay, isWithin, monthMatrix, startOfWeek } from "@/utils/calendar";
import { toIsoDate } from "@/utils/date";
import CalendarPeriods from "./CalendarPeriods";
import { useCalendarState, type CalendarView } from "./useCalendarState";
import styles from "./Calendar.module.scss";

export interface CalendarProps {
  /** Selected day as "YYYY-MM-DD", or null. */
  value: string | null;
  onChange: (iso: string) => void;
  min?: string;
  max?: string;
  /** "week" highlights and picks whole Monday–Sunday rows. */
  mode?: "day" | "week";
  /** Days to mark with a dot, e.g. days that already have turnos. */
  marked?: ReadonlySet<string>;
  /** Start on the months or years view — handy for birth dates. */
  initialView?: CalendarView;
  /** Larger cells, for a calendar that is the page's main control. */
  size?: "md" | "lg";
  /** Moves keyboard focus into the grid when it mounts (e.g. inside a popover). */
  autoFocus?: boolean;
}

/** The one calendar of the app: fast month paging, keyboard control, quick month/year jumps. */
const Calendar = ({
  value,
  onChange,
  min,
  max,
  mode = "day",
  marked,
  initialView,
  size = "md",
  autoFocus = false,
}: CalendarProps) => {
  const cal = useCalendarState({ value, min, max, initialView, onSelect: (d) => onChange(toIsoDate(d)) });
  const gridRef = useRef<HTMLDivElement>(null);
  /** Set while the user drives the grid with the keyboard, so focus follows across month flips. */
  const usingKeys = useRef(autoFocus);
  const days = monthMatrix(cal.cursor.getFullYear(), cal.cursor.getMonth());
  const selectedWeek = mode === "week" && cal.selected ? toIsoDate(startOfWeek(cal.selected)) : null;

  // Keep the focused day's button focused while the user moves with the keyboard.
  useEffect(() => {
    if (!usingKeys.current) return;
    gridRef.current?.querySelector<HTMLButtonElement>("[data-focused='true']")?.focus({ preventScroll: true });
  }, [cal.focused, cal.cursor]);

  const title =
    cal.view === "years"
      ? `${Math.floor(cal.cursor.getFullYear() / 12) * 12} – ${Math.floor(cal.cursor.getFullYear() / 12) * 12 + 11}`
      : cal.view === "months"
        ? String(cal.cursor.getFullYear())
        : `${MONTH_NAMES[cal.cursor.getMonth()]} ${cal.cursor.getFullYear()}`;

  const step = (delta: number) =>
    cal.view === "days" ? cal.stepMonth(delta) : cal.showMonth(new Date(cal.cursor.getFullYear() + delta * (cal.view === "years" ? 12 : 1), cal.cursor.getMonth(), 1));

  return (
    <div className={`${styles.calendar} ${styles[size]}`}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.title}
          onClick={() => cal.setView(cal.view === "days" ? "months" : cal.view === "months" ? "years" : "days")}
          aria-label={`${title}. Cambiar vista`}
        >
          {title}
        </button>
        <div className={styles.nav}>
          <button type="button" className={styles.today} onClick={cal.goToday}>
            Hoy
          </button>
          <button type="button" className={styles.arrow} onClick={() => step(-1)} aria-label="Anterior">
            <ChevronLeft size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <button type="button" className={styles.arrow} onClick={() => step(1)} aria-label="Siguiente">
            <ChevronRight size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
      </div>

      {cal.view === "days" ? (
        <>
          <div className={styles.weekdays} aria-hidden="true">
            {DAY_NAMES.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className={styles.viewport}>
            <AnimatePresence initial={false} custom={cal.direction} mode="popLayout">
              <motion.div
                key={toIsoDate(cal.cursor)}
                ref={gridRef}
                className={`${styles.grid} ${mode === "week" ? styles.weekMode : ""}`}
                role="grid"
                aria-label={title}
                onKeyDown={(event) => {
                  usingKeys.current = true;
                  cal.onGridKeyDown(event);
                }}
                onPointerDown={() => (usingKeys.current = false)}
                custom={cal.direction}
                initial={{ opacity: 0, x: cal.direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: cal.direction * -24 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {days.map((day) => {
                  const iso = toIsoDate(day);
                  const outside = day.getMonth() !== cal.cursor.getMonth();
                  const disabled = !isWithin(day, min, max);
                  const selected =
                    mode === "week" ? selectedWeek === toIsoDate(startOfWeek(day)) : isSameDay(day, cal.selected);
                  const focused = isSameDay(day, cal.focused);

                  return (
                    <button
                      key={iso}
                      type="button"
                      role="gridcell"
                      className={[
                        styles.day,
                        outside ? styles.outside : "",
                        selected ? styles.selected : "",
                        isSameDay(day, cal.today) ? styles.isToday : "",
                        day.getDay() === 1 ? styles.weekStart : "",
                        day.getDay() === 0 ? styles.weekEnd : "",
                      ].join(" ")}
                      disabled={disabled}
                      tabIndex={focused ? 0 : -1}
                      data-focused={focused}
                      aria-selected={selected}
                      aria-label={day.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      onClick={() => cal.choose(day)}
                    >
                      {day.getDate()}
                      {marked?.has(iso) ? <span className={styles.dot} aria-hidden="true" /> : null}
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      ) : (
        <CalendarPeriods
          view={cal.view}
          cursor={cal.cursor}
          selected={cal.selected}
          onPickMonth={cal.pickMonth}
          onPickYear={cal.pickYear}
        />
      )}
    </div>
  );
};

export default Calendar;
