import { useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TOOTH_PATH } from "@/components/UI/icons/ToothShape";
import { plaqueOpacity, type GameTooth } from "./gameLogic";
import styles from "./Tooth.module.scss";

/** Plaque spots, clipped to the tooth so they never spill over its edge. */
const SPOTS = [
  { cx: 12, cy: 12, r: 4 },
  { cx: 26, cy: 9, r: 3 },
  { cx: 20, cy: 19, r: 5 },
  { cx: 30, cy: 22, r: 3.5 },
  { cx: 10, cy: 26, r: 3 },
];

interface ToothProps {
  tooth: GameTooth;
  /** Half-brushed and left alone: its plaque is coming back. */
  decaying: boolean;
}

const Tooth = ({ tooth, decaying }: ToothProps) => {
  const clipId = useId();
  const clean = tooth.cleanliness === 100;

  return (
    <div
      className={`${styles.tooth} ${styles[tooth.type]} ${clean ? styles.clean : ""} ${
        decaying ? styles.decaying : ""
      }`}
      style={{
        left: `${tooth.x}%`,
        top: `${tooth.y}%`,
        transform: `translate(-50%, -50%) rotate(${tooth.rotate}deg)`,
      }}
    >
      <svg viewBox="0 0 40 48" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <path d={TOOTH_PATH} />
          </clipPath>
        </defs>
        <path d={TOOTH_PATH} className={styles.enamel} />
        <g clipPath={`url(#${clipId})`} style={{ opacity: plaqueOpacity(tooth.cleanliness) }}>
          <rect width="40" height="48" className={styles.plaque} />
          {SPOTS.map((spot) => (
            <circle key={`${spot.cx}-${spot.cy}`} {...spot} className={styles.spot} />
          ))}
        </g>
        <path d="M9 7c2-1.5 4-1.5 6 0" className={styles.shine} />
      </svg>

      <AnimatePresence>
        {clean && (
          <motion.svg
            className={styles.sparkle}
            viewBox="0 0 24 24"
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 14 }}
            aria-hidden="true"
          >
            <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooth;
