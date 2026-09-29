import { Link } from "react-router-dom";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import styles from "./StatsCard.module.scss";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  /** Where "Ver detalle" leads. */
  to?: string;
  /** Tints the icon amber to flag something that needs attention. */
  warn?: boolean;
}

/** One headline number on a dashboard: label, big serif value, optional link. */
const StatsCard = ({ label, value, icon: Icon, to, warn = false }: StatsCardProps) => {
  const content = (
    <>
      <span className={styles.top}>
        <span className={styles.label}>{label}</span>
        <Icon className={warn ? styles.warn : undefined} size={18} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <span className={styles.value}>{value}</span>
      {to ? (
        <span className={styles.more}>
          Ver detalle <ArrowUpRight size={14} strokeWidth={1.7} aria-hidden="true" />
        </span>
      ) : null}
    </>
  );

  return to ? (
    <Link to={to} className={`${styles.card} ${styles.link}`}>
      {content}
    </Link>
  ) : (
    <div className={styles.card}>{content}</div>
  );
};

export default StatsCard;
