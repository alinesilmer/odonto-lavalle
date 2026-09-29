import { motion } from "framer-motion";
import { EASE_OUT } from "@/utils/editorialMotion";
import styles from "./ProgressMeter.module.scss";

interface ProgressMeterProps {
  label: string;
  /** 0–100. */
  percent: number;
  caption?: string;
}

/** A labelled progress bar with its percentage in large serif figures. */
const ProgressMeter = ({ label, percent, caption }: ProgressMeterProps) => {
  const value = Math.max(0, Math.min(100, Math.round(percent)));

  return (
    <div className={styles.meter}>
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}%</span>
      </div>
      <div className={styles.track} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
        <motion.div
          className={styles.fill}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: EASE_OUT }}
        />
      </div>
      {caption ? <p className={styles.caption}>{caption}</p> : null}
    </div>
  );
};

export default ProgressMeter;
