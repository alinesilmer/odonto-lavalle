import { useEffect, useState } from "react";
import { Clock, Minus, Plus } from "lucide-react";
import { usePopover } from "@/hooks/usePopover";
import { addMinutes, parseTime, timeSlots, toTime } from "@/utils/time";
import Field from "../Field/Field";
import PickerPanel from "../PickerPanel/PickerPanel";
import PickerTrigger from "../PickerTrigger/PickerTrigger";
import styles from "./TimePicker.module.scss";

interface TimePickerProps {
  name: string;
  label?: string;
  /** "HH:mm", or "" when empty. */
  value: string;
  onChange: (time: string) => void;
  required?: boolean;
  error?: string;
  hint?: string;
  placeholder?: string;
  /** First and last quick slot, "HH:mm". */
  from?: string;
  to?: string;
  /** Minutes between quick slots. */
  step?: number;
  clearable?: boolean;
}

const NOON = 13 * 60;

/** A time field: one tap on a quick slot, or an exact time with the steppers. */
const TimePicker = ({
  name,
  label,
  value,
  onChange,
  required,
  error,
  hint,
  placeholder = "Elegí una hora",
  from = "08:00",
  to = "20:30",
  step = 30,
  clearable = false,
}: TimePickerProps) => {
  const popover = usePopover<HTMLButtonElement>();
  const [exact, setExact] = useState(value || "09:00");

  // Each time the panel opens, the steppers start from the current value.
  useEffect(() => {
    if (popover.open) setExact(value || "09:00");
  }, [popover.open, value]);

  const slots = timeSlots(from, to, step);
  const groups = [
    { label: "Mañana", slots: slots.filter((s) => parseTime(s) < NOON) },
    { label: "Tarde", slots: slots.filter((s) => parseTime(s) >= NOON) },
  ].filter((g) => g.slots.length > 0);

  const pick = (time: string) => {
    onChange(time);
    popover.close();
  };

  const [hh, mm] = exact.split(":");

  return (
    <Field id={name} label={label} required={required} error={error} hint={hint}>
      <PickerTrigger
        id={name}
        buttonRef={popover.anchorRef}
        display={value ? `${value} hs` : null}
        placeholder={placeholder}
        icon={<Clock size={18} strokeWidth={1.7} aria-hidden="true" />}
        open={popover.open}
        onToggle={popover.toggle}
        onClear={clearable ? () => onChange("") : undefined}
        invalid={Boolean(error)}
      />

      <PickerPanel popover={popover} label={label ?? "Elegir hora"} width={320}>
        {groups.map((group) => (
          <section key={group.label} className={styles.group}>
            <h4 className={styles.groupLabel}>{group.label}</h4>
            <div className={styles.slots}>
              {group.slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`${styles.slot} ${slot === value ? styles.chosen : ""}`}
                  aria-pressed={slot === value}
                  onClick={() => pick(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </section>
        ))}

        <section className={styles.exact}>
          <h4 className={styles.groupLabel}>Otra hora</h4>
          <div className={styles.exactRow}>
            <div className={styles.stepper} role="group" aria-label="Hora">
              <button type="button" onClick={() => setExact(addMinutes(exact, -60))} aria-label="Una hora menos">
                <Minus size={14} strokeWidth={2} aria-hidden="true" />
              </button>
              <span>{hh}</span>
              <button type="button" onClick={() => setExact(addMinutes(exact, 60))} aria-label="Una hora más">
                <Plus size={14} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
            <span className={styles.colon} aria-hidden="true">
              :
            </span>
            <div className={styles.stepper} role="group" aria-label="Minutos">
              <button type="button" onClick={() => setExact(addMinutes(exact, -5))} aria-label="Cinco minutos menos">
                <Minus size={14} strokeWidth={2} aria-hidden="true" />
              </button>
              <span>{mm}</span>
              <button type="button" onClick={() => setExact(addMinutes(exact, 5))} aria-label="Cinco minutos más">
                <Plus size={14} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
            <button type="button" className={styles.use} onClick={() => pick(toTime(parseTime(exact)))}>
              Usar
            </button>
          </div>
        </section>
      </PickerPanel>
    </Field>
  );
};

export default TimePicker;
