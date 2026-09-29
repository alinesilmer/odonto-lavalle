import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import DetailList from "@/components/UI/DetailList/DetailList";
import { formatDateAR, formatLongDate } from "@/utils/date";
import { inView, reveal } from "@/utils/editorialMotion";
import { clinicWhatsappUrl } from "@/utils/clinicContact";
import { openInNewTab } from "@/utils/whatsapp";
import type { useBooking } from "./useBooking";
import styles from "./BookingSummary.module.scss";

interface BookingSummaryProps {
  booking: ReturnType<typeof useBooking>;
  patientName: string;
  price: string;
}

/** Sticky card that mirrors the choices so far and holds the booking actions. */
const BookingSummary = ({ booking, patientName, price }: BookingSummaryProps) => {
  const name = patientName.trim();

  // Turnos are always arranged over WhatsApp: the message carries everything chosen here.
  const requestOnWhatsapp = () => {
    const text = [
      "🗓️ *Solicitud de turno (consulta)*",
      `*Nombre:* ${name}`,
      `*Día elegido:* ${formatDateAR(booking.selectedDay)}`,
      booking.timePreference ? `*Horario preferido:* ${booking.timePreference}` : null,
      `*Motivo:* ${booking.reason.trim() || "Consulta"}`,
      "",
      "¿Está disponible para agendar la consulta?",
    ]
      .filter((line) => line !== null)
      .join("\n");

    openInNewTab(clinicWhatsappUrl(text));
  };

  const rows = [
    { label: "Paciente", value: name || "—" },
    { label: "Día", value: formatLongDate(booking.selectedDay) },
    { label: "Horario", value: booking.timePreference || "A coordinar" },
    { label: "Motivo", value: booking.reason || "Consulta" },
  ];

  return (
    <motion.aside
      className={styles.summary}
      variants={reveal}
      custom={1}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      aria-label="Resumen del turno"
    >
      <p className={styles.eyebrow}>Tu turno</p>

      <DetailList items={rows} />

      <div className={styles.price}>
        <span>Valor de la consulta</span>
        <strong>{price}</strong>
      </div>

      <p className={styles.note}>
        Los presupuestos se realizan <strong>únicamente luego de la consulta clínica.</strong>
      </p>

      <div className={styles.actions}>
        <Button
          fullWidth
          onClick={requestOnWhatsapp}
          disabled={!name}
          aria-describedby="whatsapp-help"
          icon={<MessageCircle size={18} strokeWidth={1.7} aria-hidden="true" />}
        >
          Pedir turno por WhatsApp
        </Button>
        <p id="whatsapp-help" className={styles.help}>
          {name
            ? "Se abre WhatsApp con tu pedido listo: solo tenés que enviarlo y te confirmamos el turno."
            : "Completá tu nombre para pedir el turno."}
        </p>
      </div>
    </motion.aside>
  );
};

export default BookingSummary;
