import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "@/assets/images/Logo.webp";
import ZoomImage from "@/components/UI/ZoomImage/ZoomImage";
import { CLINIC_PHOTOS } from "@/data/clinicPhotos";
import { EASE_OUT } from "@/utils/editorialMotion";
import styles from "./LoginAside.module.scss";

/** The photo half of the login card, with a short welcome over it. */
const LoginAside = () => (
  <aside className={styles.aside}>
    <div className={styles.photo}>
      <ZoomImage src={CLINIC_PHOTOS.teamWindow} />
    </div>

    <Link to="/" className={styles.brand} aria-label="Lavalle Odontología — inicio">
      <img src={Logo} alt="" />
    </Link>

    <motion.div
      className={styles.caption}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8, ease: EASE_OUT }}
    >
      <p className={styles.quote}>
        Tu sonrisa, <em>en buenas manos.</em>
      </p>
      <p className={styles.text}>Tus turnos, tu historia clínica y tus tratamientos, en un solo lugar.</p>
    </motion.div>
  </aside>
);

export default LoginAside;
