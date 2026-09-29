import styles from "./Toothbrush.module.scss";

interface ToothbrushProps {
  x: number;
  y: number;
  /** Scrubs back and forth while the pointer is pressed. */
  brushing: boolean;
}

/** The brush that replaces the cursor over the board; its head sits on the pointer. */
const Toothbrush = ({ x, y, brushing }: ToothbrushProps) => (
  <div className={styles.brushAnchor} style={{ left: x, top: y }} aria-hidden="true">
    <svg
      className={`${styles.brush} ${brushing ? styles.scrubbing : ""}`}
      viewBox="0 0 120 32"
    >
      <rect x="34" y="11" width="84" height="10" rx="5" className={styles.brushHandle} />
      <rect x="4" y="12" width="36" height="8" rx="4" className={styles.brushHead} />
      {[8, 14, 20, 26, 32].map((bx) => (
        <rect key={bx} x={bx} y="2" width="3.5" height="11" rx="1.5" className={styles.bristle} />
      ))}
      {brushing && (
        <g className={styles.foam}>
          <circle cx="10" cy="3" r="3" />
          <circle cx="20" cy="1.5" r="2.4" />
          <circle cx="29" cy="3.5" r="2.8" />
        </g>
      )}
    </svg>
  </div>
);

export default Toothbrush;
