import { motion } from "framer-motion";
import { ArrowUpRight, CalendarClock, CreditCard, Info, MessageCircle } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import SectionHeading from "@/components/UI/SectionHeading/SectionHeading";
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
import { inView, reveal } from "@/utils/editorialMotion";
import styles from "./ContactPage.module.scss";

const CHANNELS = [
  { label: "Teléfono", value: formattedPhone, href: phoneUrl },
  { label: "Email", value: contactInfo.email, href: emailUrl },
  { label: "Dirección", value: displayAddress, href: mapsUrl, external: true },
  { label: "Instagram", value: instagramHandle, href: contactInfo.instagram, external: true },
];

const ContactDetails = () => (
  <div className={styles.details}>
    <SectionHeading
      size="sm"
      index="01"
      eyebrow="Vení a conocernos"
      title={
        <>
          Hablemos de <em>tu sonrisa.</em>
        </>
      }
      lead="¿Tenés una consulta que quieras resolver en persona? Avisanos de tu visita por cualquiera de estos medios y te recibimos con gusto."
    />

    <motion.div className={styles.detailsBody} variants={reveal} initial="hidden" whileInView="visible" viewport={inView}>
      <ul className={styles.channels}>
        {CHANNELS.map((channel) => (
          <li key={channel.label}>
            <span className={styles.channelLabel}>{channel.label}</span>
            <a
              href={channel.href}
              className={styles.channelValue}
              {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {channel.value}
              <ArrowUpRight size={18} strokeWidth={1.6} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>

      <Button
        variant="ink"
        href={clinicWhatsappUrl()}
        icon={<MessageCircle size={18} strokeWidth={1.6} aria-hidden="true" />}
      >
        Escribinos por WhatsApp
      </Button>

      <aside className={styles.notes} aria-labelledby="notes-title">
        <p id="notes-title" className={styles.notesTitle}>
          <Info size={18} strokeWidth={1.8} aria-hidden="true" />
          Importante antes de venir
        </p>
        <ul>
          <li>
            <span className={styles.noteIcon}>
              <CalendarClock size={20} strokeWidth={1.7} aria-hidden="true" />
            </span>
            <span>
              <strong>Solo con turno previo.</strong> No se reciben visitas sin horario previamente
              acordado.
            </span>
          </li>
          <li>
            <span className={styles.noteIcon}>
              <CreditCard size={20} strokeWidth={1.7} aria-hidden="true" />
            </span>
            <span>
              <strong>La consulta se abona.</strong> Las consultas con ingreso al consultorio son un
              servicio y deben ser abonadas.
            </span>
          </li>
        </ul>
      </aside>
    </motion.div>
  </div>
);

export default ContactDetails;
