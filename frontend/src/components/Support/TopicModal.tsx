import { MessageCircle } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import Modal from "@/components/UI/Modal/Modal";
import NumberedList from "@/components/UI/NumberedList/NumberedList";
import { clinicWhatsappUrl } from "@/utils/clinicContact";
import type { SupportTopic } from "./types";

interface TopicModalProps {
  topic: SupportTopic | null;
  onClose: () => void;
}

/** The step-by-step guide for one section of the dashboard. */
const TopicModal = ({ topic, onClose }: TopicModalProps) => (
  <Modal
    open={Boolean(topic)}
    onClose={onClose}
    eyebrow="Guía paso a paso"
    title={topic?.title}
    footer={
      <Button
        variant="secondary"
        size="small"
        href={clinicWhatsappUrl(`Hola, necesito ayuda con: ${topic?.title}`)}
        icon={<MessageCircle size={16} strokeWidth={1.7} aria-hidden="true" />}
      >
        ¿Seguís con dudas? Escribinos
      </Button>
    }
  >
    {topic ? (
      <>
        <p>{topic.summary}</p>
        <NumberedList items={topic.details} />
      </>
    ) : null}
  </Modal>
);

export default TopicModal;
