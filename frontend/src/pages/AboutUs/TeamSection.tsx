import Chip from "@/components/UI/Chip/Chip";
import PhotoCard from "@/components/UI/PhotoCard/PhotoCard";
import SectionHeading from "@/components/UI/SectionHeading/SectionHeading";
import { TEAM } from "@/data/aboutUs";
import styles from "./TeamSection.module.scss";

/** The dentists, as large portraits with their role and specialties. */
const TeamSection = () => (
  <section id="equipo" className={styles.team}>
    <SectionHeading
      size="md"
      index="03"
      eyebrow="Nuestro equipo"
      title={
        <>
          Las manos que <em>cuidan tu sonrisa.</em>
        </>
      }
    />

    <ul className={styles.teamGrid}>
      {TEAM.map((member, index) => (
        <PhotoCard
          key={member.name}
          index={index}
          image={member.image}
          alt={member.name}
          ratio="wide"
          titleSize="lg"
          meta={member.role}
          title={member.name}
        >
          <span className={styles.specialties}>
            {member.specialties.map((specialty) => (
              <Chip key={specialty} size="small">
                {specialty}
              </Chip>
            ))}
          </span>
        </PhotoCard>
      ))}
    </ul>
  </section>
);

export default TeamSection;
