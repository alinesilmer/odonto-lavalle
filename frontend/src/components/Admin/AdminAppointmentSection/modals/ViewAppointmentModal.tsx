import Button from "@/components/UI/Button/Button";
import DetailList from "@/components/UI/DetailList/DetailList";
import Modal from "@/components/UI/Modal/Modal";
import StatusChip from "@/components/UI/StatusChip/StatusChip";
import type { AppointmentRow } from "@/services/adapters";

interface ViewAppointmentModalProps {
  row: AppointmentRow | null;
  onClose: () => void;
}

const ViewAppointmentModal = ({ row, onClose }: ViewAppointmentModalProps) => (
  <Modal
    open={Boolean(row)}
    onClose={onClose}
    eyebrow="Turno"
    title={row?.patientName ?? "Detalle del turno"}
    footer={
      <Button variant="secondary" onClick={onClose}>
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
          { label: "Motivo", value: row.reason },
          { label: "Obra social", value: row.insurance },
          { label: "Estado", value: <StatusChip status={row.rawStatus} /> },
          { label: "Pago", value: row.payment },
        ]}
      />
    ) : null}
  </Modal>
);

export default ViewAppointmentModal;
