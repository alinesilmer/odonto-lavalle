import PhotoCard from "@/components/UI/PhotoCard/PhotoCard";
import SectionHeading from "@/components/UI/SectionHeading/SectionHeading";
import { CLINIC_REASONS } from "@/data/whyChoose";
import styles from "./WhyChoose.module.scss";

const WhyChoose = () => (
  <section className={styles.section}>
    <SectionHeading
      index="01"
      eyebrow="Por qué elegirnos"
      title={
        <>
          Calidad en cada detalle, <em>trato de siempre.</em>
        </>
      }
    />

    <ul className={styles.grid}>
      {CLINIC_REASONS.map((reason, index) => (
        <PhotoCard
          key={reason.title}
          index={index}
          image={reason.image}
          alt={reason.title}
          ratio="portrait"
          meta={String(index + 1).padStart(2, "0")}
          title={reason.title}
          text={reason.summary}
        />
      ))}
    </ul>
  </section>
);

export default WhyChoose;
