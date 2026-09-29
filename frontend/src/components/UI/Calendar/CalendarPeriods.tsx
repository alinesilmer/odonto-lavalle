import { motion } from "framer-motion";
import { MONTH_NAMES } from "@/data/calendarOptions";
import styles from "./Calendar.module.scss";

interface CalendarPeriodsProps {
  view: "months" | "years";
  cursor: Date;
  selected: Date | null;
  onPickMonth: (month: number) => void;
  onPickYear: (year: number) => void;
}

/** The month and year grids the calendar title opens, for jumping far quickly. */
const CalendarPeriods = ({ view, cursor, selected, onPickMonth, onPickYear }: CalendarPeriodsProps) => {
  const now = new Date();
  const firstYear = Math.floor(cursor.getFullYear() / 12) * 12;

  const cells =
    view === "months"
      ? MONTH_NAMES.map((name, month) => ({
          key: name,
          label: name.slice(0, 3),
          current: month === now.getMonth() && cursor.getFullYear() === now.getFullYear(),
          chosen: selected?.getMonth() === month && selected.getFullYear() === cursor.getFullYear(),
          pick: () => onPickMonth(month),
        }))
      : Array.from({ length: 12 }, (_, i) => {
          const year = firstYear + i;
          return {
            key: String(year),
            label: String(year),
            current: year === now.getFullYear(),
            chosen: selected?.getFullYear() === year,
            pick: () => onPickYear(year),
          };
        });

  return (
    <motion.div
      key={view}
      className={styles.periods}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.16 }}
    >
      {cells.map((cell) => (
        <button
          key={cell.key}
          type="button"
          className={`${styles.period} ${cell.chosen ? styles.selected : ""} ${cell.current ? styles.isToday : ""}`}
          onClick={cell.pick}
        >
          {cell.label}
        </button>
      ))}
    </motion.div>
  );
};

export default CalendarPeriods;
