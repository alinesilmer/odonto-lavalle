import type { ReactNode } from "react";
import { errorId, hintId } from "./ids";
import styles from "./Field.module.scss";

export interface FieldProps {
  /** Id of the control this field labels; also seeds the error element's id. */
  id: string;
  label?: string;
  required?: boolean;
  /** Rendered only once the field has been touched. */
  error?: string;
  hint?: string;
  children: ReactNode;
}

/**
 * Label, control and message for one form field. Every UI control renders
 * through this so labels, spacing and error wiring stay identical everywhere.
 */
const Field = ({ id, label, required, error, hint, children }: FieldProps) => (
  <div className={[styles.field, error ? styles.hasError : ""].join(" ").trim()}>
    {label ? (
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? <span className={styles.required}>*</span> : null}
      </label>
    ) : null}

    {children}

    {hint && !error ? (
      <span id={hintId(id)} className={styles.hint}>
        {hint}
      </span>
    ) : null}

    {error ? (
      <span id={errorId(id)} className={styles.errorText} role="alert">
        {error}
      </span>
    ) : null}
  </div>
);

export default Field;
