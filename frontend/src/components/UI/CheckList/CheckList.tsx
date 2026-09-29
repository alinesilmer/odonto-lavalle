import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { EASE_OUT } from "@/utils/editorialMotion";
import styles from "./CheckList.module.scss";

interface CheckListProps {
  items: readonly string[];
  /** "check" for benefits (light tiles), "dot" for plain notes such as care tips. */
  marker?: "check" | "dot";
  columns?: 1 | 2;
  /** Seconds before the rows start sliding in. */
  delay?: number;
}

/** Items that slide in one by one, each with a check tile or a small dot. */
const CheckList = ({ items, marker = "check", columns = 1, delay = 0 }: CheckListProps) => (
  <ul className={`${styles.list} ${styles[marker]} ${columns === 2 ? styles.two : ""}`}>
    {items.map((item, index) => (
      <motion.li
        key={item}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + index * 0.06, duration: 0.5, ease: EASE_OUT }}
      >
        {marker === "check" ? (
          <span className={styles.check}>
            <Check size={14} strokeWidth={2.2} aria-hidden="true" />
          </span>
        ) : (
          <span className={styles.dot} aria-hidden="true" />
        )}
        <span>{item}</span>
      </motion.li>
    ))}
  </ul>
);

export default CheckList;
