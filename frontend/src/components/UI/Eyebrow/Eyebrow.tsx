import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { drawLine } from "@/utils/editorialMotion";
import styles from "./Eyebrow.module.scss";

interface EyebrowProps {
  children: ReactNode;
  /** Section number shown before the label, e.g. "01". */
  index?: string;
}

/**
 * The mono label that opens a section. Its accent line draws itself when the
 * parent motion element enters the viewport.
 */
const Eyebrow = ({ children, index }: EyebrowProps) => (
  <p className={styles.eyebrow}>
    {index && <span>({index})</span>}
    <span>{children}</span>
    <motion.span className={styles.line} variants={drawLine} aria-hidden="true" />
  </p>
);

export default Eyebrow;
