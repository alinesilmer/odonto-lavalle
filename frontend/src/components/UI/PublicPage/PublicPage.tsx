import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import styles from "./PublicPage.module.scss";

/**
 * Wraps every public page: the editorial background and type, and — for
 * visitors who ask their system for less motion — no moving animations.
 */
const PublicPage = ({ children }: { children: ReactNode }) => (
  <MotionConfig reducedMotion="user">
    <div className={styles.page}>{children}</div>
  </MotionConfig>
);

export default PublicPage;
