import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { blurIn, inView } from "@/utils/editorialMotion";
import Eyebrow from "../Eyebrow/Eyebrow";
import styles from "./SectionHeading.module.scss";

interface SectionHeadingProps {
  /** The small mono label, e.g. "Por qué elegirnos". */
  eyebrow: string;
  /** Section number shown in the label, e.g. "01". */
  index?: string;
  /** The headline; wrap the accent phrase in <em>. */
  title: ReactNode;
  lead?: ReactNode;
  /** lg for page sections, md for split layouts, sm for compact blocks. */
  size?: "lg" | "md" | "sm";
  /** Keep the italic phrase in ink instead of the accent blue. */
  plainAccent?: boolean;
  className?: string;
}

/** Label + serif headline (+ lead) that opens every editorial section; comes into focus on scroll. */
const SectionHeading = ({
  eyebrow,
  index,
  title,
  lead,
  size = "lg",
  plainAccent = false,
  className,
}: SectionHeadingProps) => (
  <motion.div
    className={`${styles.heading} ${className ?? ""}`}
    variants={blurIn}
    initial="hidden"
    whileInView="visible"
    viewport={inView}
  >
    <Eyebrow index={index}>{eyebrow}</Eyebrow>
    <h2 className={`${styles.title} ${styles[size]} ${plainAccent ? styles.plainAccent : ""}`}>{title}</h2>
    {lead ? <p className={styles.lead}>{lead}</p> : null}
  </motion.div>
);

export default SectionHeading;
