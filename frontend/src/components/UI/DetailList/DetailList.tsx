import type { ReactNode } from "react";
import styles from "./DetailList.module.scss";

export interface DetailItem {
  label: string;
  value: ReactNode;
}

interface DetailListProps {
  items: readonly DetailItem[];
  /** "rows": label left, value right, ruled. "grid": label above value, two columns. */
  layout?: "rows" | "grid";
}

/** Label/value pairs, e.g. an appointment's details or a booking summary. */
const DetailList = ({ items, layout = "rows" }: DetailListProps) => (
  <dl className={`${styles.list} ${styles[layout]}`}>
    {items.map((item) => (
      <div key={item.label} className={styles.item}>
        <dt>{item.label}</dt>
        <dd>{item.value ?? "—"}</dd>
      </div>
    ))}
  </dl>
);

export default DetailList;
