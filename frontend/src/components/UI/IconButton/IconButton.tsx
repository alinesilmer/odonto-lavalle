import type { ReactNode } from "react";
import styles from "./IconButton.module.scss";

interface IconButtonProps {
  /** Accessible name — the button has no visible text. */
  label: string;
  children: ReactNode;
  onClick: () => void;
  /** "danger" turns red on hover, for delete. */
  tone?: "default" | "danger";
  className?: string;
}

/** A small round button with just an icon (edit, delete, close…). */
const IconButton = ({ label, children, onClick, tone = "default", className }: IconButtonProps) => (
  <button
    type="button"
    className={`${styles.button} ${styles[tone]} ${className ?? ""}`}
    onClick={onClick}
    aria-label={label}
    title={label}
  >
    {children}
  </button>
);

export default IconButton;
