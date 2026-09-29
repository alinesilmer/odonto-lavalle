import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import styles from "./PatientAppointmentSection.module.scss";

interface AppointmentStatsProps {
  completed: number;
  pending: number;
  cancelled: number;
}

const AppointmentStats = ({ completed, pending, cancelled }: AppointmentStatsProps) => {
  const cards = [
    { icon: CheckCircle2, value: completed, label: "Completos" },
    { icon: Clock3, value: pending, label: "Pendientes" },
    { icon: XCircle, value: cancelled, label: "Cancelados" },
  ];

  return (
    <div className={styles.summaryRow}>
      {cards.map(({ icon: Icon, value, label }) => (
        <div key={label} className={styles.summaryCard}>
          <Icon size={26} aria-hidden="true" />
          <div className={styles.summaryNumber}>{value}</div>
          <div className={styles.summaryLabel}>{label}</div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentStats;
