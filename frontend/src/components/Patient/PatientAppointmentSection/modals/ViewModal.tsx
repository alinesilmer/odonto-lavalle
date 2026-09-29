import Button from "@/components/UI/Button/Button";
import DetailList from "@/components/UI/DetailList/DetailList";
import Modal from "@/components/UI/Modal/Modal";
import StatusChip from "@/components/UI/StatusChip/StatusChip";
import type { AppointmentRow } from "@/services/adapters";

interface ViewModalProps {
  row: AppointmentRow | null;
  onClose: () => void;
}

const ViewModal = ({ row, onClose }: ViewModalProps) => (
  <Modal
    open={Boolean(row)}
    onClose={onClose}
    eyebrow="Mis turnos"
    title={row?.reason || "Detalle del turno"}
    footer={
      <Button variant="secondary" size="small" onClick={onClose}>
        Cerrar
      </Button>
    }
  >
    {row ? (
      <DetailList
        layout="grid"
        items={[
          { label: "Fecha", value: row.date },
          { label: "Hora", value: row.time },
          { label: "Estado", value: <StatusChip status={row.rawStatus} /> },
          { label: "Pago", value: row.payment },
        ]}
      />
    ) : null}
  </Modal>
);

export default ViewModal;
