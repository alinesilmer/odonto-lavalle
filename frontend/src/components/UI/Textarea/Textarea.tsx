import type { Ref, TextareaHTMLAttributes } from "react";
import Field from "../Field/Field";
import { errorId } from "../Field/ids";
import styles from "./Textarea.module.scss";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  error?: string;
  touched?: boolean;
  /** Helper text shown under the control while there is no error. */
  hint?: string;
  ref?: Ref<HTMLTextAreaElement>;
}

const Textarea = ({
  name,
  id,
  label,
  error,
  touched = true,
  hint,
  rows = 4,
  required,
  className,
  ...rest
}: TextareaProps) => {
  const textareaId = id ?? name;
  const message = error && touched ? error : undefined;

  return (
    <Field id={textareaId} label={label} required={required} error={message} hint={hint}>
      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={Boolean(message)}
        aria-describedby={message ? errorId(textareaId) : undefined}
        className={[styles.textarea, message ? styles.error : "", className ?? ""].join(" ").trim()}
        {...rest}
      />
    </Field>
  );
};

export default Textarea;
