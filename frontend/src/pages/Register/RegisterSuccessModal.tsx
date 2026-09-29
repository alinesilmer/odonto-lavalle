import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import Modal from "@/components/UI/Modal/Modal";
import { ROUTES } from "@/constants";
import styles from "./Register.module.scss";

interface RegisterSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const RegisterSuccessModal = ({ open, onClose }: RegisterSuccessModalProps) => (
  <Modal
    open={open}
    onClose={onClose}
    title="¡Registro Exitoso!"
    size="sm"
    footer={
      <Link to={ROUTES.login}>
        <Button variant="primary">Ir a Iniciar Sesión</Button>
      </Link>
    }
  >
    <div className={styles.modalIcon}>
      <CheckCircle size={32} />
    </div>
    <p>
      Tu cuenta ha sido creada correctamente. Ya podés iniciar sesión y comenzar a gestionar tus
      turnos.
    </p>
  </Modal>
);

export default RegisterSuccessModal;
