import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE_OUT, inView, reveal } from "@/utils/editorialMotion";
import styles from "./PhotoCard.module.scss";

interface PhotoCardProps {
  image: string;
  alt?: string;
  /** Small line above the title: a number ("01") or a role. */
  meta: string;
  title: string;
  text?: string;
  /** Extra content under the text, e.g. chips. */
  children?: ReactNode;
  /** Photo proportions. */
  ratio?: "landscape" | "portrait" | "wide";
  titleSize?: "md" | "lg";
  /** Makes the whole card a button with an arrow and "Ver detalle". */
  onOpen?: () => void;
  /** Stagger position; also used for the entrance delay. */
  index?: number;
  /** For lists that re-filter: animates in and out instead of on scroll. */
  layout?: boolean;
}

/** Photo on top, then a thin rule, a small meta line, a serif title and text. */
const PhotoCard = ({
  image,
  alt = "",
  meta,
  title,
  text,
  children,
  ratio = "landscape",
  titleSize = "md",
  onOpen,
  index = 0,
  layout = false,
}: PhotoCardProps) => {
  const content = (
    <>
      <span className={`${styles.media} ${styles[ratio]}`}>
        <img src={image} alt={alt} loading="lazy" />
      </span>
      <span className={styles.body}>
        <span className={styles.top}>
          <span className={styles.meta}>{meta}</span>
          {onOpen ? <ArrowUpRight size={20} strokeWidth={1.6} aria-hidden="true" /> : null}
        </span>
        <span className={`${styles.title} ${styles[titleSize]}`}>{title}</span>
        {text ? <span className={styles.text}>{text}</span> : null}
        {children}
        {onOpen ? <span className={styles.more}>Ver detalle</span> : null}
      </span>
    </>
  );

  const motionProps = layout
    ? {
        layout: true,
        initial: { opacity: 0, y: 32 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96 },
        transition: { duration: 0.5, ease: EASE_OUT, delay: index * 0.05 },
      }
    : { variants: reveal, custom: index, initial: "hidden", whileInView: "visible", viewport: inView };

  return (
    <motion.li className={styles.item} {...motionProps}>
      {onOpen ? (
        <button type="button" className={`${styles.card} ${styles.interactive}`} onClick={onOpen}>
          {content}
        </button>
      ) : (
        <article className={styles.card}>{content}</article>
      )}
    </motion.li>
  );
};

export default PhotoCard;
