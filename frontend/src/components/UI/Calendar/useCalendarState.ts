import { useCallback, useState, type KeyboardEvent } from "react";
import { addDays, addMonthsClamped, fromIsoDate, isWithin, startOfWeek } from "@/utils/calendar";
import { toIsoDate } from "@/utils/date";

export type CalendarView = "days" | "months" | "years";

interface Options {
  value: string | null;
  min?: string;
  max?: string;
  initialView?: CalendarView;
  onSelect: (date: Date) => void;
}

/**
 * The calendar's moving parts: which month is showing, which day has keyboard
 * focus, which view (days / months / years) is open, and the slide direction.
 */
export function useCalendarState({ value, min, max, initialView = "days", onSelect }: Options) {
  const selected = fromIsoDate(value);
  const today = new Date();
  const start = selected ?? (min && toIsoDate(today) < min ? fromIsoDate(min)! : today);

  const [cursor, setCursor] = useState(() => new Date(start.getFullYear(), start.getMonth(), 1));
  const [focused, setFocused] = useState<Date>(start);
  const [view, setView] = useState<CalendarView>(initialView);
  const [direction, setDirection] = useState<1 | -1>(1);

  const showMonth = useCallback(
    (date: Date) => {
      const next = new Date(date.getFullYear(), date.getMonth(), 1);
      if (next.getTime() === cursor.getTime()) return;
      setDirection(next > cursor ? 1 : -1);
      setCursor(next);
    },
    [cursor],
  );

  /** Moves keyboard focus, flipping the page when the day is in another month. */
  const focusDay = useCallback(
    (date: Date) => {
      setFocused(date);
      showMonth(date);
    },
    [showMonth],
  );

  const stepMonth = (delta: number) => focusDay(addMonthsClamped(focused, delta));

  const goToday = () => {
    focusDay(today);
    setView("days");
  };

  const choose = (date: Date) => {
    if (!isWithin(date, min, max)) return;
    focusDay(date);
    onSelect(date);
  };

  const onGridKeyDown = (event: KeyboardEvent) => {
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => startOfWeek(focused),
      End: () => addDays(startOfWeek(focused), 6),
      PageUp: () => addMonthsClamped(focused, event.shiftKey ? -12 : -1),
      PageDown: () => addMonthsClamped(focused, event.shiftKey ? 12 : 1),
    };

    if (moves[event.key]) {
      event.preventDefault();
      focusDay(moves[event.key]());
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(focused);
    }
  };

  /** Month/year views pick a period, then drop back to the level below. */
  const pickMonth = (month: number) => {
    focusDay(new Date(cursor.getFullYear(), month, Math.min(focused.getDate(), 28)));
    setView("days");
  };

  const pickYear = (year: number) => {
    focusDay(new Date(year, cursor.getMonth(), Math.min(focused.getDate(), 28)));
    setView("months");
  };

  return {
    selected,
    today,
    cursor,
    focused,
    view,
    setView,
    direction,
    stepMonth,
    goToday,
    choose,
    onGridKeyDown,
    pickMonth,
    pickYear,
    showMonth,
  };
}
