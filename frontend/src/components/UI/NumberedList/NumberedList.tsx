import type { ReactNode } from "react";
import styles from "./NumberedList.module.scss";

interface NumberedListProps {
  items: readonly ReactNode[];
  /** "strong" sets the text in ink, for short key points; "soft" for longer notes. */
  tone?: "strong" | "soft";
  className?: string;
}

/** Rows numbered 01, 02, 03… in mono, divided by thin rules. */
const NumberedList = ({ items, tone = "soft", className }: NumberedListProps) => (
  <ol className={`${styles.list} ${styles[tone]} ${className ?? ""}`}>
    {items.map((item, i) => (
      <li key={i}>
        <span className={styles.number} aria-hidden="true">
          {String(i + 1).padStart(2, "0")}
        </span>
        <span>{item}</span>
      </li>
    ))}
  </ol>
);

export default NumberedList;
