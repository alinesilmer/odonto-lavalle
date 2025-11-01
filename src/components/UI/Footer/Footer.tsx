import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import styles from "./Footer.module.scss";
import Logo from "../../../assets/images/Logo.png";
// import { goToBooking } from "../../utils/session";

const Footer = () => {

  // const path = bookingPath();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <img src={Logo} alt="Lavalle Odontología Integral" />
              </div>
              <div className={styles.logoText}>
                <span className={styles.logoName}>LAVALLE</span>
                <span className={styles.logoSubtitle}>ODONTOLOGÍA</span>
              </div>
            </div>
            <p className={styles.tagline}>
              Servicio dental integral, profesional y seguro, pensado para tu
              tranquilidad.
            </p>
            <div className={styles.social}>
              <a
                href="https://www.instagram.com/lavalle.odontologia/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.links}>
            <h3 className={styles.linksTitle}>ENLACES</h3>
            <ul>
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/not-found">Nosotros</Link>
              </li>
              <li>
                <Link to="/servicios">Servicios</Link>
              </li>
              <li>
                <Link to="/contacto">Contacto</Link>
              </li>
            </ul>
          </div>

          <div className={styles.links}>
            <h3 className={styles.linksTitle}>SERVICIOS</h3>
            <ul>
              <li>
                <Link to="/servicios">Ver Servicios</Link>
              </li>

              {/*<li><Link to={path}>Reservar Turno</Link></li> */}
              <li>
                <Link to="/tuno">Reservar Turno</Link>
              </li>
              <li>
                <Link to="/#obras-sociales">Obras Sociales</Link>
              </li>
            </ul>
          </div>

          <div className={styles.links}>
            <h3 className={styles.linksTitle}>CONTACTO</h3>
            <ul>
              <li>
                <Link to="/contacto">Formulario de Contacto</Link>
              </li>
              
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>Todos los derechos reservados © 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
