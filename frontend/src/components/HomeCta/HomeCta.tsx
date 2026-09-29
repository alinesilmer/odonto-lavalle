import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import { ROUTES } from "@/constants";
import { clinicWhatsappUrl } from "@/utils/clinicContact";
import { CLINIC_PHOTOS } from "@/data/clinicPhotos";
import { blurIn, inView, reveal } from "@/utils/editorialMotion";
import styles from "./HomeCta.module.scss";

interface HomeCtaProps {
  /** Wrap the accent phrase in <em>. */
  title?: ReactNode;
  text?: string;
  image?: string;
  imageAlt?: string;
  /** Small label over the photo; leave it out for photos that carry their own text. */
  caption?: string;
}

/** Closing call to book: a dark rounded block with the team's photo. */
const HomeCta = ({
  title = (
    <>
      Agendá tu <em>consulta.</em>
    </>
  ),
  text = "Para cuidarte bien, primero te vemos: revisamos tu boca, despejamos dudas y definimos juntos el tratamiento ideal para vos.",
  image = CLINIC_PHOTOS.firstStep,
  imageAlt = "Las odontólogas de Lavalle en el consultorio, con el mensaje: no se trata de juzgar por no haber venido antes, se trata de acompañarte a dar el primer paso",
  caption,
}: HomeCtaProps) => (
  <section className={styles.wrap}>
    <div className={styles.block}>
      <div className={styles.content}>
        <motion.div
          className={styles.copy}
          variants={blurIn}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
        >
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.text}>{text}</p>
        </motion.div>

        <motion.div
          className={styles.actions}
          variants={reveal}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
        >
          <Button to={ROUTES.booking} variant="light" arrow>
            Reservar turno
          </Button>
          <Button
            variant="outlineDark"
            href={clinicWhatsappUrl()}
            icon={<MessageCircle size={18} strokeWidth={1.6} aria-hidden="true" />}
          >
            WhatsApp
          </Button>
        </motion.div>
      </div>

      <motion.figure
        className={styles.photo}
        variants={reveal}
        custom={2}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
      >
        <img src={image} alt={imageAlt} loading="lazy" />
        {caption ? <figcaption>{caption}</figcaption> : null}
      </motion.figure>
    </div>
  </section>
);

export default HomeCta;
