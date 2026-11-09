import type { LucideIcon } from "lucide-react";
import styles from "./IconList.module.scss";

export interface IconListItem {
  icon: LucideIcon;
  text: string;
}

interface IconListProps {
  items: readonly IconListItem[];
  className?: string;
}

/** Key points as rows with a small accent icon, divided by thin rules. */
const IconList = ({ items, className }: IconListProps) => (
  <ul className={`${styles.list} ${className ?? ""}`}>
    {items.map(({ icon: Icon, text }) => (
      <li key={text}>
        <span className={styles.icon}>
          <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
        </span>
        <span>{text}</span>
      </li>
    ))}
  </ul>
);

export default IconList;
