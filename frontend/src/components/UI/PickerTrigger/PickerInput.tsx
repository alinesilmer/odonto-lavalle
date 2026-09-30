import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode, type Ref } from "react";
import { X } from "lucide-react";
import styles from "./PickerTrigger.module.scss";

/** What checking typed text gives back: the value to store, or why it can't be used. */
export type TypedResult = { value: string } | { error: string };

interface PickerInputProps {
  id: string;
  /** The stored value ("YYYY-MM-DD", "HH:mm"…), or "" when empty. */
  value: string;
  /** Stored value → what the field shows. */
  format: (value: string) => string;
  /** Typed text → the value, or an error message. */
  check: (text: string) => TypedResult;
  onCommit: (value: string) => void;
  /** Reports a typing error (or null once fixed), shown by the surrounding Field. */
  onTypedError: (message: string | null) => void;
  /** Rewrites text as it's typed (e.g. adds the date slashes). */
  mask?: (previous: string, next: string) => string;
  placeholder: string;
  icon: ReactNode;
  /** Accessible name of the button that opens the calendar/clock. */
  openLabel: string;
  open: boolean;
  onToggle: () => void;
  onOpen: () => void;
  /** Escape etc. while the panel is open (usePopover's handler). */
  onPanelKeyDown: (event: KeyboardEvent) => void;
  anchorRef: Ref<HTMLDivElement>;
  invalid?: boolean;
  clearable?: boolean;
  inputMode?: "numeric" | "text";
}

/**
 * The picker field people can type into: writing a date or time directly is
 * faster than the calendar when you already know it. The icon still opens the
 * calendar/clock. Enter or leaving the field saves; bad text is flagged, never
 * silently accepted.
 */
const PickerInput = ({
  id,
  value,
  format,
  check,
  onCommit,
  onTypedError,
  mask,
  placeholder,
  icon,
  openLabel,
  open,
  onToggle,
  onOpen,
  onPanelKeyDown,
  anchorRef,
  invalid,
  clearable,
  inputMode = "numeric",
}: PickerInputProps) => {
  const [text, setText] = useState(() => format(value));
  const editing = useRef(false);

  // A value picked in the panel (or set by the form) replaces whatever was typed.
  useEffect(() => {
    if (!editing.current) setText(format(value));
  }, [value, format]);

  const commit = () => {
    editing.current = false;
    const typed = text.trim();
    if (!typed) {
      onTypedError(null);
      if (value) onCommit("");
      return;
    }
    const result = check(typed);
    if ("error" in result) {
      onTypedError(result.error);
      return;
    }
    onTypedError(null);
    setText(format(result.value));
    if (result.value !== value) onCommit(result.value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
    } else if (event.key === "ArrowDown" && !open) {
      event.preventDefault();
      onOpen();
    } else if (open) {
      onPanelKeyDown(event);
    }
  };

  return (
    <div ref={anchorRef} className={`${styles.field} ${invalid ? styles.error : ""} ${open ? styles.fieldOpen : ""}`}>
      <input
        id={id}
        className={styles.input}
        value={text}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete="off"
        aria-invalid={invalid}
        onFocus={() => (editing.current = true)}
        onChange={(e) => {
          editing.current = true;
          setText(mask ? mask(text, e.target.value) : e.target.value);
        }}
        onBlur={commit}
        onKeyDown={onKeyDown}
      />
      {clearable && text ? (
        <button
          type="button"
          className={styles.inlineButton}
          onClick={() => {
            setText("");
            onTypedError(null);
            onCommit("");
          }}
          aria-label="Borrar"
        >
          <X size={16} strokeWidth={1.8} aria-hidden="true" />
        </button>
      ) : null}
      <button type="button" className={styles.inlineButton} onClick={onToggle} aria-label={openLabel} aria-haspopup="dialog" aria-expanded={open}>
        {icon}
      </button>
    </div>
  );
};

export default PickerInput;
