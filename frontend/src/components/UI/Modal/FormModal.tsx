import type { ReactNode } from "react";
import Alert from "../Alert/Alert";
import Button from "../Button/Button";
import Modal, { type ModalProps } from "./Modal";

export interface FormModalProps extends Omit<ModalProps, "footer"> {
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Disables confirm and swaps its label while a request is in flight. */
  busy?: boolean;
  busyLabel?: string;
  error?: string | null;
  children: ReactNode;
}

/**
 * A dialog whose footer is always the same Cancel/Confirm pair, which is what
 * every edit dialog in the dashboards actually needs.
 */
const FormModal = ({
  onConfirm,
  confirmLabel = "Guardar",
  cancelLabel = "Cancelar",
  busy = false,
  busyLabel = "Guardando...",
  error,
  children,
  ...modalProps
}: FormModalProps) => (
  <Modal
    {...modalProps}
    footer={
      <>
        <Button type="button" variant="secondary" onClick={modalProps.onClose} disabled={busy}>
          {cancelLabel}
        </Button>
        <Button type="button" variant="primary" onClick={onConfirm} loading={busy}>
          {busy ? busyLabel : confirmLabel}
        </Button>
      </>
    }
  >
    {error ? <Alert>{error}</Alert> : null}
    {children}
  </Modal>
);

export default FormModal;
