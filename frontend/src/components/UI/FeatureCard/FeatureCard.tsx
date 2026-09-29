import { motion } from "framer-motion";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { inView, reveal } from "@/utils/editorialMotion";
import styles from "./FeatureCard.module.scss";

interface FeatureCardProps {
  /** Position in its group; drives the roman numeral and the entrance stagger. */
  index: number;
  title: string;
  text: string;
  /** Makes the whole card a button with an arrow and a "more" hint. */
  onOpen?: () => void;
  openLabel?: string;
  /** Shown in place of the roman numeral. */
  icon?: LucideIcon;
}

const NUMERALS = ["i.", "ii.", "iii.", "iv.", "v.", "vi."];

/** White card with a roman numeral (or an icon), title and text; lifts and grows its accent line on hover. */
const FeatureCard = ({ index, title, text, onOpen, openLabel = "Más información", icon: Icon }: FeatureCardProps) => {
  const body = (
    <>
      <span className={styles.top}>
        {Icon ? (
          <span className={styles.icon}>
            <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
          </span>
        ) : (
          <span className={styles.numeral}>{NUMERALS[index] ?? `${index + 1}.`}</span>
        )}
        {onOpen ? <ArrowUpRight size={22} strokeWidth={1.6} aria-hidden="true" /> : null}
      </span>
      <span className={styles.title}>{title}</span>
      <span className={styles.text}>{text}</span>
      {onOpen ? <span className={styles.more}>{openLabel}</span> : null}
      <span className={styles.bar} aria-hidden="true" />
    </>
  );

  const motionProps = {
    variants: reveal,
    custom: index,
    initial: "hidden",
    whileInView: "visible",
    viewport: inView,
    whileHover: { y: -6, transition: { duration: 0.4 } },
  } as const;

  return onOpen ? (
    <motion.button type="button" className={styles.card} onClick={onOpen} {...motionProps}>
      {body}
    </motion.button>
  ) : (
    <motion.article className={styles.card} {...motionProps}>
      {body}
    </motion.article>
  );
};

export default FeatureCard;
