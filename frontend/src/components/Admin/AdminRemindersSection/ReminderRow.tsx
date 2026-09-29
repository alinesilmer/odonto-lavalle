import { motion } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import IconButton from "@/components/UI/IconButton/IconButton";
import DateBadge from "@/components/UI/DateBadge/DateBadge";
import { relativeDayLabel } from "@/utils/date";
import { EASE_OUT } from "@/utils/editorialMotion";
import type { ReminderItem } from "./useReminders";
import styles from "./AdminRemindersSection.module.scss";

interface ReminderRowProps {
  item: ReminderItem;
  index: number;
  onToggle: () => void;
  onRemove: () => void;
}

/** One reminder: date badge, text, how soon it is due, and its actions. */
const ReminderRow = ({ item, index, onToggle, onRemove }: ReminderRowProps) => {
  const overdue = !item.done && item.days < 0;

  return (
    <motion.li
      layout
      className={`${styles.row} ${item.done ? styles.done : ""}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: EASE_OUT, delay: index * 0.04 }}
    >
      <button
        type="button"
        className={styles.check}
        onClick={onToggle}
        aria-pressed={item.done}
        aria-label={item.done ? `Marcar "${item.title}" como pendiente` : `Marcar "${item.title}" como hecho`}
      >
        <Check size={16} strokeWidth={2.2} aria-hidden="true" />
      </button>

      <span className={styles.dateBadge}>
        <DateBadge date={item.due} />
      </span>

      <span className={styles.body}>
        <strong className={styles.title}>{item.title}</strong>
        {item.description ? <span className={styles.description}>{item.description}</span> : null}
      </span>

      <span className={`${styles.when} ${overdue ? styles.overdue : ""}`}>
        {item.done ? "Hecho" : relativeDayLabel(item.days)}
      </span>

      <IconButton label={`Eliminar "${item.title}"`} tone="danger" onClick={onRemove} className={styles.remove}>
        <Trash2 aria-hidden="true" />
      </IconButton>
    </motion.li>
  );
};

export default ReminderRow;
