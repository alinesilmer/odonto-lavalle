import { useEffect, useState } from "react";
import styles from "./ToothLoader.module.scss";

const MESSAGES = ["Cepillando los detalles…", "Preparando todo para vos…", "Ya casi está…"];

interface ToothLoaderProps {
  /** Fixed text instead of the rotating messages. */
  label?: string;
  /**
   * "page": the one big, centred animation with messages, for whole-page and
   * session loads. "compact": a small quiet tooth for a panel loading inside a
   * page that's already showing, so several panels don't stack messages.
   */
  variant?: "page" | "compact";
}

/**
 * The loading state: a toothbrush scrubbing a tooth. Pure SVG + CSS (only
 * transform/opacity animate, so it stays on the GPU), no images or libraries.
 * It fades in after a short delay so quick loads don't flash, and holds still
 * for people who prefer reduced motion.
 */
const ToothLoader = ({ label, variant = "page" }: ToothLoaderProps) => {
  const [index, setIndex] = useState(0);
  const compact = variant === "compact";

  useEffect(() => {
    if (label || compact) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 2200);
    return () => clearInterval(id);
  }, [label, compact]);

  const text = label ?? (compact ? "Cargando…" : MESSAGES[index]);

  return (
    <div className={`${styles.loader} ${styles[variant]}`} role="status" aria-live="polite">
      <svg className={styles.art} viewBox="0 0 96 96" aria-hidden="true">
        <path
          className={styles.tooth}
          d="M30 22c-8 0-14 7-14 17 0 10 4 17 6 27 2 10 4 20 10 20s6-14 10-20c2-3 10-3 12 0 4 6 4 20 10 20s8-10 10-20c2-10 6-17 6-27 0-10-6-17-14-17-8 0-12 4-18 4s-10-4-18-4z"
        />
        <path className={styles.shine} d="M26 36c0-5 3-8 7-8" />

        <g className={styles.foam}>
          <circle cx="34" cy="20" r="3" />
          <circle cx="50" cy="16" r="2.2" />
          <circle cx="62" cy="21" r="2.6" />
        </g>

        <g className={styles.brush}>
          <rect className={styles.handle} x="54" y="6" width="36" height="6" rx="3" />
          <rect className={styles.head} x="30" y="5" width="26" height="8" rx="2.5" />
          <path className={styles.bristles} d="M33 13v8M37 13v8M41 13v8M45 13v8M49 13v8M53 13v8" />
        </g>

        <path className={styles.sparkle} d="M78 40l1.6 4.4L84 46l-4.4 1.6L78 52l-1.6-4.4L72 46l4.4-1.6z" />
      </svg>
      {/* Compact keeps the text for screen readers only. */}
      <p className={compact ? styles.srOnly : styles.label}>{text}</p>
    </div>
  );
};

export default ToothLoader;
