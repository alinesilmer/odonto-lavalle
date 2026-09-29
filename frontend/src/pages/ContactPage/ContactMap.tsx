import { motion } from "framer-motion";
import { contactInfo } from "@/data/contactInfo";
import { inView, reveal } from "@/utils/editorialMotion";
import styles from "./ContactMap.module.scss";

const MAP_QUERY = encodeURIComponent(`${contactInfo.address}, Argentina`);

/** Where the clinic is: an embedded map plus a directions link. */
const ContactMap = () => (
  <motion.section
    className={styles.mapSection}
    variants={reveal}
    initial="hidden"
    whileInView="visible"
    viewport={inView}
  >
    <div className={styles.map}>
      <iframe
        title="Ubicación de Lavalle Odontología en el mapa"
        src={`https://maps.google.com/maps?q=${MAP_QUERY}&z=16&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        className={styles.mapChip}
        href={`https://maps.google.com/?q=${MAP_QUERY}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Cómo llegar</span>
        Lavalle 2690, Corrientes
      </a>
    </div>
  </motion.section>
);

export default ContactMap;
