import type { ReactNode } from "react";
import styles from "./Chip.module.scss";

interface ChipProps {
  children: ReactNode;
  icon?: ReactNode;
  /** Makes the chip a button (e.g. a search suggestion). */
  onClick?: () => void;
  size?: "small" | "medium";
}

/** A small outlined pill for tags, payment methods or suggestions. */
const Chip = ({ children, icon, onClick, size = "medium" }: ChipProps) => {
  const className = `${styles.chip} ${styles[size]} ${onClick ? styles.interactive : ""}`;
  return onClick ? (
    <button type="button" className={className} onClick={onClick}>
      {icon}
      {children}
    </button>
  ) : (
    <span className={className}>
      {icon}
      {children}
    </span>
  );
};

export default Chip;
