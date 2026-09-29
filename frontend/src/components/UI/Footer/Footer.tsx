import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowUpRight, Instagram } from "lucide-react";
import Logo from "@/assets/images/Logo.webp";
import RisingWords from "@/components/UI/RisingWords/RisingWords";
import { contactInfo } from "@/data/contactInfo";
import {
  clinicWhatsappUrl,
  displayAddress,
  emailUrl,
  formattedPhone,
  instagramHandle,
  mapsUrl,
  phoneUrl,
} from "@/utils/clinicContact";
import { inView } from "@/utils/editorialMotion";
import styles from "./Footer.module.scss";

const COLUMNS = [
  {
    title: "Navegación",
    links: [
      { to: "/", label: "Inicio" },
      { to: "/nosotros", label: "Nosotros" },
      { to: "/servicios", label: "Servicios" },
      { to: "/contacto", label: "Contacto" },
    ],
  },
  {
    title: "Pacientes",
    links: [
      { to: "/turno", label: "Reservar turno" },
      { to: "/servicios", label: "Ver servicios" },
      { to: "/#obras-sociales", label: "Obras sociales" },
      { to: "/login", label: "Mi panel" },
    ],
  },
];

const WORDMARK = ["Lavalle", "odontología"];

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo} aria-label="Lavalle Odontología — inicio">
            <img src={Logo} alt="" />
          </Link>
          <p className={styles.tagline}>
            Servicio dental integral, profesional y seguro, pensado para tu tranquilidad.
          </p>
          <a
            href={contactInfo.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.social}
          >
            <Instagram size={18} strokeWidth={1.6} aria-hidden="true" />
            {instagramHandle}
          </a>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} className={styles.column} aria-label={column.title}>
            <h3 className={styles.columnTitle}>{column.title}</h3>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Contacto</h3>
          <ul>
            <li>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {displayAddress}
              </a>
            </li>
            <li>
              <a href={phoneUrl} className={styles.link}>
                {formattedPhone}
              </a>
            </li>
            <li>
              <a href={emailUrl} className={styles.link}>
                {contactInfo.email}
              </a>
            </li>
            <li>
              <a
                href={clinicWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsapp}
              >
                Escribinos por WhatsApp
                <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <motion.p
        className={styles.wordmark}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
        aria-hidden="true"
      >
        <RisingWords words={WORDMARK} accentCount={1} />
      </motion.p>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Lavalle Odontología Integral. Todos los derechos reservados.</p>
        <button
          type="button"
          className={styles.toTop}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Volver arriba
          <ArrowUp size={16} strokeWidth={1.7} aria-hidden="true" />
        </button>
      </div>
    </div>
  </footer>
);

export default Footer;
