import type { AppointmentStatus } from "@odonto/shared";
import { APPOINTMENT_STATUS_LABEL } from "@odonto/shared";
import styles from "./StatusChip.module.scss";

/** An appointment's state: a coloured dot plus its label, never colour alone. */
const StatusChip = ({ status }: { status: AppointmentStatus }) => (
  <span className={`${styles.chip} ${styles[status]}`}>
    <span className={styles.dot} aria-hidden="true" />
    {APPOINTMENT_STATUS_LABEL[status]}
  </span>
);

export default StatusChip;
