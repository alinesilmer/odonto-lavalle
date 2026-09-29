import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "@/utils/editorialMotion";
import styles from "./Timeline.module.scss";

export interface TimelineItem {
  key: string;
  /** Shown above the title, e.g. "15 ene 2024". */
  date: string;
  title: string;
  /** "done" fills the dot, "current" rings it, "upcoming" leaves it hollow. */
  state?: "done" | "current" | "upcoming";
  /** Top-right: a status chip, an edit button… */
  aside?: ReactNode;
  children?: ReactNode;
}

interface TimelineProps {
  items: readonly TimelineItem[];
  emptyMessage?: string;
}

/** A vertical line of dated events: treatment steps, consultations, anything in order. */
const Timeline = ({ items, emptyMessage = "Todavía no hay registros." }: TimelineProps) =>
  items.length === 0 ? (
    <p className={styles.empty}>{emptyMessage}</p>
  ) : (
    <ol className={styles.timeline}>
      {items.map((item, i) => (
        <motion.li
          key={item.key}
          className={`${styles.item} ${styles[item.state ?? "done"]}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT, delay: Math.min(i, 8) * 0.05 }}
        >
          <span className={styles.dot} aria-hidden="true" />
          <div className={styles.card}>
            <div className={styles.head}>
              <div>
                <p className={styles.date}>{item.date}</p>
                <h3 className={styles.title}>{item.title}</h3>
              </div>
              {item.aside ? <div className={styles.aside}>{item.aside}</div> : null}
            </div>
            {item.children ? <div className={styles.body}>{item.children}</div> : null}
          </div>
        </motion.li>
      ))}
    </ol>
  );

export default Timeline;
