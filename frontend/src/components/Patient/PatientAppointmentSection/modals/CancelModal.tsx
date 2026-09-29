import FormModal from "@/components/UI/Modal/FormModal";

interface CancelModalProps {
  ids: string[];
  saving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelModal = ({ ids, saving, onClose, onConfirm }: CancelModalProps) => {
  const many = ids.length > 1;

  return (
    <FormModal
      open={ids.length > 0}
      eyebrow="Mis turnos"
      title={many ? `Cancelar ${ids.length} turnos` : "Cancelar turno"}
      size="sm"
      onClose={onClose}
      onConfirm={onConfirm}
      busy={saving}
      busyLabel="Cancelando..."
      cancelLabel="Volver"
      confirmLabel={many ? "Sí, cancelar turnos" : "Sí, cancelar turno"}
    >
      <p>
        {many ? "Los turnos elegidos pasarán" : "El turno pasará"} a <strong>Cancelado</strong>. Esta acción no se puede deshacer.
      </p>
    </FormModal>
  );
};

export default CancelModal;
