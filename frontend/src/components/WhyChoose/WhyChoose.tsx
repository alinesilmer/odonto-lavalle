import PhotoCard from "@/components/UI/PhotoCard/PhotoCard";
import SectionHeading from "@/components/UI/SectionHeading/SectionHeading";
import { CLINIC_REASONS } from "@/data/whyChoose";
import styles from "./WhyChoose.module.scss";

const WhyChoose = () => (
  <section className={styles.section}>
    <SectionHeading
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
          title={reason.title}
        />
      ))}
    </ul>
  </section>
);

export default WhyChoose;
