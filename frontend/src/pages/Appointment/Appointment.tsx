import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import EditorialHero from "@/components/UI/EditorialHero/EditorialHero";
import Input from "@/components/UI/Input/Input";
import { inView, reveal } from "@/utils/editorialMotion";
import Calendar from "@/components/UI/Calendar/Calendar";
import { fromIsoDate } from "@/utils/calendar";
import { toIsoDate } from "@/utils/date";
import BookingSummary from "./BookingSummary";
import SlotPicker from "./SlotPicker";
import { useBooking } from "./useBooking";
import PublicPage from "@/components/UI/PublicPage/PublicPage";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { formatPrice } from "@/utils/money";
import styles from "./Appointment.module.scss";

/** One numbered step of the booking flow. */
const Step = ({ index, title, children }: { index: number; title: string; children: ReactNode }) => (
  <motion.li
    className={styles.step}
    variants={reveal}
    initial="hidden"
    whileInView="visible"
    viewport={inView}
  >
    <div className={styles.stepHead}>
      <span className={styles.stepNumber}>{String(index).padStart(2, "0")}</span>
      <h2 className={styles.stepTitle}>{title}</h2>
    </div>
    <div className={styles.stepBody}>{children}</div>
  </motion.li>
);

const Appointment = () => {
  const booking = useBooking();
  const { settings } = useSiteSettings();
  const [patientName, setPatientName] = useState("");

  return (
    <PublicPage>
      <EditorialHero
        eyebrow="Turnos"
        title={
          <>
            Reservá tu <em>consulta.</em>
          </>
        }
        lead="Elegí el día y el horario que prefieras y envianos el pedido por WhatsApp: te respondemos para confirmar tu turno. En la primera consulta evaluamos tu caso y armamos un presupuesto claro."
      />

      <section className={styles.booking}>
        <ol className={styles.steps}>
          <Step index={1} title="¿A nombre de quién es la consulta?">
            <div className={styles.field}>
              <Input
                name="patientName"
                label="Nombre y apellido"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Ej: María González"
                required
              />
            </div>
          </Step>

          <Step index={2} title="Elegí el día">
            <div className={styles.calendarCard}>
              <Calendar
                size="lg"
                value={toIsoDate(booking.selectedDay)}
                min={toIsoDate(booking.today)}
                onChange={(iso) => booking.pickDay(fromIsoDate(iso)!)}
              />
            </div>
          </Step>

          <Step index={3} title="¿En qué horario preferís?">
            <SlotPicker selected={booking.timePreference} onSelect={booking.setTimePreference} />
          </Step>

          <Step index={4} title="Motivo de la consulta">
            <div className={styles.field}>
              <Input
                name="reason"
                label="Motivo (opcional)"
                value={booking.reason}
                onChange={(e) => booking.setReason(e.target.value)}
                placeholder="Ej: Consulta, limpieza, control"
              />
            </div>
          </Step>
        </ol>

        <BookingSummary booking={booking} patientName={patientName} price={formatPrice(settings.consultationPrice)} />
      </section>
    </PublicPage>
  );
};

export default Appointment;
