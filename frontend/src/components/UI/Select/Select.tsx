import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { usePopover } from "@/hooks/usePopover";
import Field from "../Field/Field";
import { errorId } from "../Field/ids";
import PickerPanel from "../PickerPanel/PickerPanel";
import styles from "./Select.module.scss";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Listbox-style select, keyboard driven because the native one cannot be
 * styled. The list floats above everything (like the date and time pickers),
 * so a dialog never cuts it off and it always fits on screen.
 */
const Select = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Seleccionar",
  error,
  touched = true,
  required,
  disabled,
}: SelectProps) => {
  const popover = usePopover<HTMLButtonElement>();
  const [activeIndex, setActiveIndex] = useState(() => options.findIndex((o) => o.value === value));
  const [width, setWidth] = useState(280);

  const message = error && touched ? error : undefined;
  const selected = options.find((option) => option.value === value);

  // Closing by any route (outside click, Escape, a pick) counts as leaving the field.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !popover.open) onBlur?.();
    wasOpen.current = popover.open;
  }, [popover.open, onBlur]);

  const open = () => {
    setWidth(popover.anchorRef.current?.offsetWidth ?? 280);
    setActiveIndex(Math.max(0, options.findIndex((o) => o.value === value)));
    popover.show();
  };

  const commit = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    popover.close();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        if (popover.open) popover.onPanelKeyDown(event);
        break;
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!popover.open) return open();
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((current) => (current + step + options.length) % options.length);
        break;
      }
      case "Enter":
      case " ":
        event.preventDefault();
        if (popover.open) commit(activeIndex);
        else open();
        break;
      default:
    }
  };

  return (
    <Field id={name} label={label} required={required} error={message}>
      <button
        ref={popover.anchorRef}
        type="button"
        id={name}
        disabled={disabled}
        className={[styles.select, message ? styles.error : "", popover.open ? styles.open : ""].join(" ").trim()}
        onClick={() => (popover.open ? popover.close() : open())}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={popover.open}
        aria-invalid={Boolean(message)}
        aria-describedby={message ? errorId(name) : undefined}
      >
        <span className={selected ? styles.selected : styles.placeholder}>{selected?.label ?? placeholder}</span>
        <ChevronDown className={styles.icon} aria-hidden="true" />
      </button>

      <PickerPanel popover={popover} label={label ?? name} width={width} className={styles.panel}>
        <ul className={styles.list} role="listbox" aria-label={label ?? name}>
          {options.map((option, index) => (
            <li
              key={option.value}
              className={[styles.option, value === option.value ? styles.active : "", index === activeIndex ? styles.highlighted : ""]
                .join(" ")
                .trim()}
              onClick={() => commit(index)}
              onMouseEnter={() => setActiveIndex(index)}
              role="option"
              aria-selected={value === option.value}
            >
              <span>{option.label}</span>
              {value === option.value ? <Check size={16} aria-hidden="true" /> : null}
            </li>
          ))}
        </ul>
      </PickerPanel>
    </Field>
  );
};

export default Select;
