import { motion } from "framer-motion";
import RisingWords from "@/components/UI/RisingWords/RisingWords";
import { MessageCircle } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import { ROUTES } from "@/constants";
import { fadeUp } from "@/utils/editorialMotion";
import styles from "./Hero.module.scss";

const HEADLINE = ["Cada", "sonrisa", "que", "cuidamos", "cuenta", "una", "historia."];

const Hero = () => {
  return (
    <motion.section className={styles.hero} initial="hidden" animate="visible">
      <div className={styles.topRow}>
        <svg className={styles.star} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
        </svg>
      </div>

      <h1 className={styles.title}>
        <RisingWords words={HEADLINE} accentCount={3} />
      </h1>

      <motion.div className={styles.cta} variants={fadeUp} custom={0.6}>
        <div className={styles.ctaCopy}>
          <span className={styles.ctaEyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            La forma más rápida de agendar
          </span>
          <p className={styles.ctaText}>
            Escribinos por WhatsApp y coordinamos tu turno <em>al instante.</em>
          </p>
        </div>
        <Button
          size="large"
          arrow
          className={styles.bookButton}
          to={ROUTES.booking}
          icon={<MessageCircle size={22} strokeWidth={1.6} aria-hidden="true" />}
        >
          Reservar Turno
        </Button>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
