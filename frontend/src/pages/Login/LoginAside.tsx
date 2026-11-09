import { Link } from "react-router-dom";
import Logo from "@/assets/images/Logo.webp";
import ZoomImage from "@/components/UI/ZoomImage/ZoomImage";
import { CLINIC_PHOTOS } from "@/data/clinicPhotos";
import styles from "./LoginAside.module.scss";

/** The photo half of the login card, with the clinic logo over it. */
const LoginAside = () => (
  <aside className={styles.aside}>
    <div className={styles.photo}>
      <ZoomImage src={CLINIC_PHOTOS.teamWindow} />
    </div>

    <Link to="/" className={styles.brand} aria-label="Lavalle Odontología — inicio">
      <img src={Logo} alt="" />
    </Link>
  </aside>
);

export default LoginAside;
