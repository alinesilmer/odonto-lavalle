import { Sparkles } from "lucide-react";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import styles from "./ComingSoonModal.module.scss";

interface ComingSoonModalProps {
  open: boolean;
  onClose: () => void;
  /** What isn't available yet, e.g. "Adjuntar archivos". */
  feature: string;
  message?: string;
}

/** Shown instead of a feature that's built but not switched on yet (see constants/features). */
const ComingSoonModal = ({
  open,
  onClose,
  feature,
  message = "Estamos terminando de prepararla. Muy pronto vas a poder usarla desde acá.",
}: ComingSoonModalProps) => (
  <Modal
    open={open}
    onClose={onClose}
    size="sm"
    eyebrow="Próximamente"
    title={feature}
    footer={
      <Button variant="primary" onClick={onClose}>
        Entendido
      </Button>
    }
  >
    <div className={styles.body}>
      <span className={styles.icon} aria-hidden="true">
        <Sparkles size={22} strokeWidth={1.6} />
      </span>
      <p>{message}</p>
    </div>
  </Modal>
);

export default ComingSoonModal;
