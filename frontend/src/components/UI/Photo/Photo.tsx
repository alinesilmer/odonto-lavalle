import { motion } from "framer-motion";
import { inView, reveal } from "@/utils/editorialMotion";
import styles from "./Photo.module.scss";

interface PhotoProps {
  src: string;
  alt: string;
  /** Sets the size (height or aspect ratio) from the page's own stylesheet. */
  className?: string;
  /** Small frosted label over the bottom-left corner. */
  caption?: string;
  /** Crop anchor, e.g. "center top" to keep text printed on a photo. */
  position?: string;
  /** Stagger index when several photos rise together. */
  index?: number;
}

/** A rounded photo that rises in on scroll and zooms gently on hover. */
const Photo = ({ src, alt, className, caption, position, index = 0 }: PhotoProps) => (
  <motion.figure
    className={`${styles.photo} ${className ?? ""}`}
    variants={reveal}
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={inView}
  >
    <img src={src} alt={alt} loading="lazy" style={position ? { objectPosition: position } : undefined} />
    {caption ? <figcaption>{caption}</figcaption> : null}
  </motion.figure>
);

export default Photo;
