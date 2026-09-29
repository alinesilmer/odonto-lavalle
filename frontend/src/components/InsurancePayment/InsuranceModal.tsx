import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/UI/Button/Button";
import Modal from "@/components/UI/Modal/Modal";
import type { InsuranceDto } from "@odonto/shared";
import { clinicWhatsappUrl } from "@/utils/clinicContact";
import { EASE_OUT } from "@/utils/editorialMotion";
import PaymentMethods from "./PaymentMethods";
import styles from "./InsuranceModal.module.scss";

interface InsuranceModalProps {
  open: boolean;
  onClose: () => void;
  providers: InsuranceDto[];
}

const COVERAGE_QUESTION = "Hola, quería consultar si trabajan con mi obra social: ";

/** Every obra social the clinic works with, plus the accepted payment methods. */
const InsuranceModal = ({ open, onClose, providers }: InsuranceModalProps) => (
  <Modal
    open={open}
    onClose={onClose}
    size="lg"
    eyebrow="Cobertura"
    label="Obras sociales con las que trabajamos"
    title={
      <>
        Obras sociales <em>con las que trabajamos.</em>
      </>
    }
    footer={
      <>
        <p className={styles.note}>Confirmá tu cobertura al reservar. ¿Tu obra social no figura? Consultanos.</p>
        <Button
          variant="ink"
          size="small"
          href={clinicWhatsappUrl(COVERAGE_QUESTION)}
          icon={<MessageCircle size={18} strokeWidth={1.6} aria-hidden="true" />}
        >
          Consultar mi cobertura
        </Button>
      </>
    }
  >
    <ul className={styles.grid}>
      {providers.map((provider, index) => (
        <motion.li
          key={provider.name}
          className={styles.provider}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.04, duration: 0.5, ease: EASE_OUT }}
        >
          <span className={styles.logo}>
            {provider.logo && <img src={provider.logo} alt="" loading="lazy" />}
          </span>
          <span className={styles.name}>{provider.name}</span>
        </motion.li>
      ))}
    </ul>

    <PaymentMethods />
  </Modal>
);

export default InsuranceModal;
