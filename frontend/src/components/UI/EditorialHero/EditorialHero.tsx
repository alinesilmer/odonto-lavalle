import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { blurIn, fadeUp } from "@/utils/editorialMotion";
import ZoomImage from "../ZoomImage/ZoomImage";
import Eyebrow from "../Eyebrow/Eyebrow";
import styles from "./EditorialHero.module.scss";

interface EditorialHeroProps {
  eyebrow: string;
  /** The headline; wrap the accent phrase in <em>. */
  title: ReactNode;
  lead?: string;
  image?: string;
  imageAlt?: string;
  /** Where to anchor the photo's crop, e.g. "center 15%" to keep faces in view. */
  imagePosition?: string;
  /** Buttons or links shown under the lead. */
  children?: ReactNode;
}

/** Opening block of the inner public pages, in the same style as the home hero. */
const EditorialHero = ({ eyebrow, title, lead, image, imageAlt = "", imagePosition, children }: EditorialHeroProps) => (
  <motion.section
    className={`${styles.hero} ${image ? styles.withImage : ""}`}
    initial="hidden"
    animate="visible"
  >
    <motion.div className={styles.copy} variants={blurIn}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className={styles.title}>{title}</h1>
    </motion.div>

    <div className={`${styles.row} ${lead || children ? "" : styles.mediaOnly}`}>
      {lead || children ? (
        <motion.div className={styles.intro} variants={fadeUp} custom={0.4}>
          {lead ? <p className={styles.lead}>{lead}</p> : null}
          {children ? <div className={styles.actions}>{children}</div> : null}
        </motion.div>
      ) : null}

      {image ? (
        <motion.div
          className={styles.media}
          variants={{
            hidden: { clipPath: "inset(100% 0% 0% 0%)" },
            visible: {
              clipPath: "inset(0% 0% 0% 0%)",
              transition: { duration: 1.3, ease: [0.7, 0, 0.2, 1], delay: 0.3 },
            },
          }}
        >
          <ZoomImage src={image} alt={imageAlt} delay={0.3} position={imagePosition} />
        </motion.div>
      ) : null}
    </div>
  </motion.section>
);

export default EditorialHero;
