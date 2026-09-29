import { motion } from "framer-motion";
import RisingWords from "@/components/UI/RisingWords/RisingWords";
import styles from "./Hero.module.scss";

const HEADLINE = ["Cada", "sonrisa", "que", "cuidamos", "cuenta", "una", "historia."];

const Hero = () => (
  <motion.section className={styles.hero} initial="hidden" animate="visible">
    <div className={styles.topRow}>
      <svg className={styles.star} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
      </svg>
    </div>

    <h1 className={styles.title}>
      <RisingWords words={HEADLINE} accentCount={3} />
    </h1>
  </motion.section>
);

export default Hero;
