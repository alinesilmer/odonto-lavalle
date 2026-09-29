import { motion } from "framer-motion";
import { EASE_OUT } from "@/utils/editorialMotion";
import styles from "./ZoomImage.module.scss";

interface ZoomImageProps {
  src: string;
  alt?: string;
  /** Seconds before the zoom starts, to sync with an entrance animation. */
  delay?: number;
  /** Crop anchor, e.g. "center 15%" to keep faces near the top in view. */
  position?: string;
}

/** A cover photo that settles from a slight zoom as it appears. */
const ZoomImage = ({ src, alt = "", delay = 0, position }: ZoomImageProps) => (
  <motion.img
    className={styles.image}
    src={src}
    alt={alt}
    style={position ? { objectPosition: position, transformOrigin: position } : undefined}
    initial={{ scale: 1.12 }}
    animate={{ scale: 1 }}
    transition={{ duration: 1.6, ease: EASE_OUT, delay }}
  />
);

export default ZoomImage;
