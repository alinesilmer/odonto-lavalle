import { motion } from "framer-motion";
import { EASE_OUT } from "@/utils/editorialMotion";
import styles from "./SuccessModal.module.scss";

/**
 * The success check: a circle, then a tick, drawn in SVG. Replaces a Lottie
 * player that weighed ~300 KB and relied on `eval`.
 */
const SuccessAnimation = () => (
  <svg viewBox="0 0 52 52" className={styles.check} aria-hidden="true">
    <motion.circle
      cx="26"
      cy="26"
      r="24"
      fill="none"
      strokeWidth="2.5"
      className={styles.checkCircle}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    />
    <motion.path
      d="M15 27 l7 7 l15 -15"
      fill="none"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.checkTick}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.45, delay: 0.45, ease: EASE_OUT }}
    />
  </svg>
);

export default SuccessAnimation;
