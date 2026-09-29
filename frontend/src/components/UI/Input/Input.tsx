import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import Field from "../Field/Field";
import { errorId } from "../Field/ids";
import styles from "./Input.module.scss";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  name: string;
  label?: string;
  /** Shown only when `touched` (default true), so blur-validation reads well. */
  error?: string;
  touched?: boolean;
  /** Helper text shown under the control while there is no error. */
  hint?: string;
  leftIcon?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

/**
 * Text control. Works both controlled (pass `value`) and uncontrolled, so
 * `{...register("field")}` from react-hook-form can be spread straight on.
 */
const Input = ({
  name,
  id,
  label,
  error,
  touched = true,
  hint,
  leftIcon,
  required,
  className,
  ...rest
}: InputProps) => {
  const inputId = id ?? name;
  const message = error && touched ? error : undefined;

  return (
    <Field id={inputId} label={label} required={required} error={message} hint={hint}>
      <div className={styles.control}>
        {leftIcon ? <span className={styles.leftIcon}>{leftIcon}</span> : null}
        <input
          id={inputId}
          name={name}
          required={required}
          aria-invalid={Boolean(message)}
          aria-describedby={message ? errorId(inputId) : undefined}
          className={[
            styles.input,
            leftIcon ? styles.withIcon : "",
            message ? styles.error : "",
            className ?? "",
          ]
            .join(" ")
            .trim()}
          {...rest}
        />
      </div>
    </Field>
  );
};

export default Input;
