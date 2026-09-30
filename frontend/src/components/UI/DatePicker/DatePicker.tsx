import { useState, type Ref } from "react";
import { CalendarDays } from "lucide-react";
import { usePopover } from "@/hooks/usePopover";
import { addDays, fromIsoDate, isWithin, startOfWeek } from "@/utils/calendar";
import { toIsoDate } from "@/utils/date";
import { formatDateInput, maskDateInput, parseDateInput } from "@/utils/typedInput";
import PickerInput, { type TypedResult } from "../PickerTrigger/PickerInput";
import Calendar, { type CalendarProps } from "../Calendar/Calendar";
import Field from "../Field/Field";
import PickerPanel from "../PickerPanel/PickerPanel";
import PickerTrigger from "../PickerTrigger/PickerTrigger";
import styles from "./DatePicker.module.scss";

interface DatePickerProps extends Pick<CalendarProps, "min" | "max" | "mode" | "marked" | "initialView"> {
  name: string;
  label?: string;
  /** "YYYY-MM-DD", or "" when empty. */
  value: string;
  onChange: (iso: string) => void;
  required?: boolean;
  error?: string;
  hint?: string;
  placeholder?: string;
  /** Shows Hoy / Mañana / En 1 semana shortcuts (skipped when out of range). */
  presets?: boolean;
  /** Shows a clear button once a date is set. */
  clearable?: boolean;
}

const long = (date: Date) =>
  date.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

const weekLabel = (date: Date) => {
  const monday = startOfWeek(date);
  const short = (d: Date) => d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
  return `Semana del ${short(monday)} al ${short(addDays(monday, 6))}`;
};

/**
 * A date field: type it (dd/mm/aaaa, 29/9/26, 290926…) or open the shared
 * Calendar in a floating panel with the icon. Week mode is picked only.
 */
const DatePicker = ({
  name,
  label,
  value,
  onChange,
  required,
  error,
  hint,
  placeholder = "Elegí una fecha",
  presets = true,
  clearable = false,
  mode = "day",
  ...calendarProps
}: DatePickerProps) => {
  const popover = usePopover<HTMLElement>();
  const [typedError, setTypedError] = useState<string | null>(null);
  const date = fromIsoDate(value);
  const today = new Date();

  const check = (text: string): TypedResult => {
    const iso = parseDateInput(text);
    if (!iso) return { error: "Fecha no válida. Escribila como dd/mm/aaaa." };
    if (!isWithin(fromIsoDate(iso)!, calendarProps.min, calendarProps.max)) return { error: "Esa fecha está fuera del rango permitido." };
    return { value: iso };
  };

  const shortcuts = [
    { label: "Hoy", date: today },
    { label: "Mañana", date: addDays(today, 1) },
    { label: "En 1 semana", date: addDays(today, 7) },
  ].filter((s) => isWithin(s.date, calendarProps.min, calendarProps.max));

  const pick = (iso: string) => {
    setTypedError(null);
    onChange(iso);
    popover.close();
  };

  const icon = <CalendarDays size={18} strokeWidth={1.7} aria-hidden="true" />;
  const shownError = error ?? typedError ?? undefined;

  return (
    <Field
      id={name}
      label={label}
      required={required}
      error={shownError}
      // Empty: how to type it. Filled: its weekday, as a quick confirmation.
      hint={mode === "day" ? (date ? long(date) : (hint ?? "Escribila así: 06/07/2001, o elegila en el calendario")) : hint}
    >
      {mode === "day" ? (
        <PickerInput
          id={name}
          value={value}
          format={formatDateInput}
          check={check}
          mask={maskDateInput}
          onCommit={onChange}
          onTypedError={setTypedError}
          placeholder="dd/mm/aaaa"
          icon={icon}
          openLabel={placeholder}
          open={popover.open}
          onToggle={popover.toggle}
          onOpen={popover.show}
          onPanelKeyDown={popover.onPanelKeyDown}
          anchorRef={popover.anchorRef as Ref<HTMLDivElement>}
          invalid={Boolean(shownError)}
          clearable={clearable}
        />
      ) : (
        <PickerTrigger
          id={name}
          buttonRef={popover.anchorRef as Ref<HTMLButtonElement>}
          display={date ? weekLabel(date) : null}
          placeholder={placeholder}
          icon={icon}
          open={popover.open}
          onToggle={popover.toggle}
          onClear={clearable ? () => onChange("") : undefined}
          invalid={Boolean(error)}
        />
      )}

      <PickerPanel popover={popover} label={label ?? "Elegir fecha"}>
        <Calendar value={value || null} onChange={pick} mode={mode} autoFocus {...calendarProps} />
        {presets && mode === "day" && shortcuts.length > 0 ? (
          <div className={styles.shortcuts}>
            {shortcuts.map((s) => (
              <button key={s.label} type="button" onClick={() => pick(toIsoDate(s.date))}>
                {s.label}
              </button>
            ))}
          </div>
        ) : null}
      </PickerPanel>
    </Field>
  );
};

export default DatePicker;
