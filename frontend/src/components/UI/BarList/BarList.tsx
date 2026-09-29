import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "@/utils/editorialMotion";
import styles from "./BarList.module.scss";

export interface BarListItem {
  key: string;
  /** What the row is — text or a chip; identity never rests on colour alone. */
  label: ReactNode;
  value: number;
}

interface BarListProps {
  items: readonly BarListItem[];
  /** Also show each row's share of the total. */
  showShare?: boolean;
  emptyMessage?: string;
}

/**
 * Ranked horizontal bars in a single hue, one per row, value in text ink beside
 * each bar. Bars are scaled to the largest row so small differences stay visible.
 */
const BarList = ({ items, showShare = false, emptyMessage = "Sin datos todavía" }: BarListProps) => {
  if (items.length === 0) return <p className={styles.empty}>{emptyMessage}</p>;

  const max = Math.max(1, ...items.map((item) => item.value));
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <ul className={styles.list}>
      {items.map((item, i) => (
        <li key={item.key} className={styles.row}>
          <span className={styles.label}>{item.label}</span>
          <span className={styles.value}>
            {item.value}
            {showShare && total > 0 ? <span className={styles.share}> · {Math.round((item.value / total) * 100)}%</span> : null}
          </span>
          <span className={styles.track} aria-hidden="true">
            <motion.span
              className={styles.bar}
              initial={{ width: 0 }}
              whileInView={{ width: `${(item.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: i * 0.06 }}
            />
          </span>
        </li>
      ))}
    </ul>
  );
};

export default BarList;
