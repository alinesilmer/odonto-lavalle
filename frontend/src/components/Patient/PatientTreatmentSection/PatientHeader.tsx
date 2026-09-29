import type { LucideIcon } from "lucide-react";
import type { TreatmentDto } from "@odonto/shared";
import StatsCard from "@/components/StatsCard/StatsCard";
import Chip from "@/components/UI/Chip/Chip";
import { initials } from "@/utils/text";
import styles from "./PatientTreatmentSection.module.scss";

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
}

interface PatientHeaderProps {
  treatment: TreatmentDto | null;
  stats: Stat[];
}

/** Who the treatment belongs to, and its headline numbers. */
const PatientHeader = ({ treatment, stats }: PatientHeaderProps) => {
  const name = treatment?.patientName ?? "Paciente";
  const meta = [
    treatment?.dni ? `DNI ${treatment.dni}` : null,
    treatment?.gender ?? null,
    treatment?.age != null ? `${treatment.age} años` : null,
  ].filter(Boolean);

  return (
    <section className={styles.summary}>
      <div className={styles.identity}>
        <span className={styles.avatar} aria-hidden="true">
          {initials(name)}
        </span>
        <div className={styles.identityText}>
          <div className={styles.nameRow}>
            <h2 className={styles.name}>{name}</h2>
            <Chip size="small">
              <span className={styles.activeDot} aria-hidden="true" />
              Tratamiento activo
            </Chip>
          </div>
          {meta.length > 0 ? <p className={styles.meta}>{meta.join(" · ")}</p> : null}
        </div>
      </div>

      <div className={styles.stats}>
        {stats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
};

export default PatientHeader;
