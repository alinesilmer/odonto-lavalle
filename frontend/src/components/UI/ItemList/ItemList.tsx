import type { ReactNode } from "react";
import styles from "./ItemList.module.scss";

export interface ListItem {
  key: string;
  /** Left: an icon, a time, a date badge… */
  leading?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  /** Right: a status chip, a date, an action button… */
  trailing?: ReactNode;
}

interface ItemListProps {
  items: readonly ListItem[];
  emptyMessage?: string;
}

/** Ruled rows of leading · title/meta · trailing — agendas, conditions, medication, planned visits. */
const ItemList = ({ items, emptyMessage = "Todavía no hay nada acá." }: ItemListProps) =>
  items.length === 0 ? (
    <p className={styles.empty}>{emptyMessage}</p>
  ) : (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.key} className={styles.row}>
          {item.leading ? <span className={styles.leading}>{item.leading}</span> : null}
          <span className={styles.body}>
            <strong className={styles.title}>{item.title}</strong>
            {item.meta ? <span className={styles.meta}>{item.meta}</span> : null}
          </span>
          {item.trailing ? <span className={styles.trailing}>{item.trailing}</span> : null}
        </li>
      ))}
    </ul>
  );

export default ItemList;
