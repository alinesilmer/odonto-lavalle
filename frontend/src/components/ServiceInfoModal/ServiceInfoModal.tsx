import Button from "@/components/UI/Button/Button";
import CheckList from "@/components/UI/CheckList/CheckList";
import Eyebrow from "@/components/UI/Eyebrow/Eyebrow";
import NumberedList from "@/components/UI/NumberedList/NumberedList";
import Modal from "@/components/UI/Modal/Modal";
import ZoomImage from "@/components/UI/ZoomImage/ZoomImage";
import { ROUTES } from "@/constants";
import { contentForCategory } from "@/data/serviceCategoryContent";
import { categoryLabel } from "@/data/serviceCategories";
import { toSentenceCase } from "@/utils/text";
import styles from "./ServiceInfoModal.module.scss";

export interface ServiceInfo {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
}

interface ServiceInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceInfo | null;
}

/** Treatment detail: photo on one side, what it is and why it helps on the other. */
const ServiceInfoModal = ({ isOpen, onClose, service }: ServiceInfoModalProps) => {
  if (!service) return null;

  const { benefits, features } = contentForCategory(service.category);
  // Every treatment starts with an evaluation, so the booking always leads to a consultation.
  const isConsultation = service.title.toLowerCase().includes("consulta");

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="xl"
      media={service.image ? <ZoomImage src={service.image} /> : undefined}
      eyebrow={categoryLabel(service.category)}
      title={toSentenceCase(service.title)}
      footer={
        <>
          <p className={styles.bookingNote}>
            {isConsultation
              ? "Agendá tu consulta y recibí atención personalizada."
              : "Todo tratamiento comienza con una consulta de evaluación y un presupuesto claro."}
          </p>
          <Button to={ROUTES.booking} onClick={onClose} arrow>
            Reservar consulta
          </Button>
        </>
      }
    >
      <p className={styles.description}>{service.description}</p>
      <section className={styles.block}>
        <Eyebrow>Beneficios</Eyebrow>
        <CheckList items={benefits} columns={2} delay={0.25} />
      </section>
      <section className={styles.block}>
        <Eyebrow>Características</Eyebrow>
        <NumberedList items={features} />
      </section>
    </Modal>
  );
};

export default ServiceInfoModal;
