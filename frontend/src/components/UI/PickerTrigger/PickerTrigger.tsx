import type { ReactNode, Ref } from "react";
import { X } from "lucide-react";
import styles from "./PickerTrigger.module.scss";

interface PickerTriggerProps {
  id: string;
  /** The formatted value, or null to show the placeholder. */
  display: string | null;
  placeholder: string;
  icon: ReactNode;
  open: boolean;
  onToggle: () => void;
  /** Shows a clear button while there is a value. */
  onClear?: () => void;
  invalid?: boolean;
  buttonRef: Ref<HTMLButtonElement>;
}

/** The field-shaped button that opens a picker (date, time); looks like every other input. */
const PickerTrigger = ({ id, display, placeholder, icon, open, onToggle, onClear, invalid, buttonRef }: PickerTriggerProps) => (
  <div className={styles.control}>
    <button
      ref={buttonRef}
      id={id}
      type="button"
      className={`${styles.trigger} ${invalid ? styles.error : ""} ${onClear && display ? styles.withClear : ""}`}
      onClick={onToggle}
      aria-haspopup="dialog"
      aria-expanded={open}
    >
      <span className={display ? styles.value : styles.placeholder}>{display ?? placeholder}</span>
      {icon}
    </button>
    {onClear && display ? (
      <button type="button" className={styles.clear} onClick={onClear} aria-label="Borrar">
        <X size={16} strokeWidth={1.8} aria-hidden="true" />
      </button>
    ) : null}
  </div>
);

export default PickerTrigger;
