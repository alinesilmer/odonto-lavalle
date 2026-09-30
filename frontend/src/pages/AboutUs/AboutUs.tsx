import { motion } from "framer-motion";
import EditorialHero from "@/components/UI/EditorialHero/EditorialHero";
import FeatureCard from "@/components/UI/FeatureCard/FeatureCard";
import NumberedList from "@/components/UI/NumberedList/NumberedList";
import Photo from "@/components/UI/Photo/Photo";
import SectionHeading from "@/components/UI/SectionHeading/SectionHeading";
import HomeCta from "@/components/HomeCta/HomeCta";
import { CLINIC_PHOTOS } from "@/data/clinicPhotos";
import { MISSION_POINTS, VALUES } from "@/data/aboutUs";
import { inView, reveal } from "@/utils/editorialMotion";
import TeamSection from "./TeamSection";
import PublicPage from "@/components/UI/PublicPage/PublicPage";
import styles from "./AboutUs.module.scss";

const AboutUs = () => (
  <PublicPage>
    <EditorialHero
      eyebrow="Nosotros"
      title={
        <>
          Transformando sonrisas, <em>cambiando vidas.</em>
        </>
      }
      image={CLINIC_PHOTOS.teamWindow}
      imageAlt="Las odontólogas de Lavalle junto a la ventana del consultorio"
      imagePosition="center 15%"
    />

    <section className={styles.mission}>
      <Photo
        className={styles.missionMedia}
        src={CLINIC_PHOTOS.treatment}
        alt="Odontóloga atendiendo a un paciente"
      />

      <motion.div
        className={styles.missionCopy}
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
      >
        <SectionHeading
          size="md"
          index="01"
          eyebrow="Nuestra misión"
          title={
            <>
              Odontología de calidad, <em>en un lugar cómodo.</em>
            </>
          }
          lead="Brindar servicios odontológicos integrales de la más alta calidad, con materiales de primera línea y un trabajo minucioso, en un ambiente cálido y acogedor para cada paciente."
        />
        <NumberedList items={MISSION_POINTS} tone="strong" />
      </motion.div>
    </section>

    <section className={styles.values}>
      <div className={styles.valuesInner}>
        <SectionHeading
          index="02"
          eyebrow="Nuestros valores"
          title={
            <>
              Lo que nos guía <em>todos los días.</em>
            </>
          }
        />
        <div className={styles.valuesGrid}>
          {VALUES.map((value, index) => (
            <FeatureCard key={value.title} index={index} title={value.title} text={value.description} />
          ))}
        </div>
      </div>
    </section>

    <TeamSection />

    <HomeCta
      title={
        <>
          ¿Listo para transformar <em>tu sonrisa?</em>
        </>
      }
      text="Agendá tu consulta hoy y descubrí la diferencia Lavalle."
    />
  </PublicPage>
);

export default AboutUs;
