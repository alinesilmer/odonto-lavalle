import { Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { ToothIcon } from "@/components/UI/icons";
import { contactInfo } from "@/data/contactInfo";
import styles from "./RegisterHero.module.scss";

const RegisterHero = () => (
  <motion.div
    className={styles.leftPanel}
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    <div className={styles.logoContainer}>
      <div className={styles.logo}>
        <ToothIcon size={40} />
      </div>
    </div>

    <h1 className={styles.welcome}>¡Unite a nosotros!</h1>
    <p className={styles.description}>
      Creá tu cuenta y comenzá a disfrutar de una experiencia odontológica moderna y personalizada
    </p>

    <div className={styles.socialIcons}>
      <a
        href={contactInfo.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.socialIcon}
        aria-label="Instagram"
      >
        <Instagram />
      </a>
    </div>
  </motion.div>
);

export default RegisterHero;
