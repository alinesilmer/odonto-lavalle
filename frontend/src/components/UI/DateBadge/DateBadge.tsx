import styles from "./DateBadge.module.scss";

/** A small tile with the day number over the short month, e.g. "29 / SEP". */
const DateBadge = ({ date }: { date: Date | null }) => (
  <span className={styles.badge} aria-hidden="true">
    <strong>{date ? date.getDate() : "–"}</strong>
    <span>{date ? date.toLocaleDateString("es-AR", { month: "short" }).replace(".", "") : ""}</span>
  </span>
);

export default DateBadge;
