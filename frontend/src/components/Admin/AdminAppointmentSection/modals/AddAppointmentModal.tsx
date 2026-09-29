import { useState } from "react";
import PatientPicker from "@/components/Admin/PatientPicker/PatientPicker";
import DatePicker from "@/components/UI/DatePicker/DatePicker";
import FormGrid from "@/components/UI/FormGrid/FormGrid";
import Input from "@/components/UI/Input/Input";
import FormModal from "@/components/UI/Modal/FormModal";
import TimePicker from "@/components/UI/TimePicker/TimePicker";
import { EMPTY_APPOINTMENT, type NewAppointment } from "../hooks/useAppointmentActions";

interface AddAppointmentModalProps {
  open: boolean;
  saving: boolean;
  error?: string | null;
  onClose: () => void;
  onCreate: (form: NewAppointment) => Promise<boolean>;
}

const AddAppointmentModal = ({ open, saving, error, onClose, onCreate }: AddAppointmentModalProps) => {
  const [form, setForm] = useState<NewAppointment>(EMPTY_APPOINTMENT);

  const patch = (values: Partial<NewAppointment>) => setForm((current) => ({ ...current, ...values }));

  const confirm = async () => {
    if (await onCreate(form)) {
      setForm(EMPTY_APPOINTMENT);
      onClose();
    }
  };

  return (
    <FormModal
      open={open}
      eyebrow="Turnos"
      title="Nuevo turno"
      onClose={onClose}
      onConfirm={() => void confirm()}
      confirmLabel="Crear turno"
      busy={saving}
      error={error}
    >
      <FormGrid>
        <FormGrid.Full>
          <PatientPicker
            name="patient"
            query={form.patient}
            onQueryChange={(patient) => patch({ patient })}
            onSelect={(patient) => patch({ patientId: patient?.id })}
            selectedId={form.patientId}
          />
        </FormGrid.Full>
        <DatePicker name="date" label="Fecha" value={form.date} onChange={(date) => patch({ date })} />
        <TimePicker name="time" label="Hora" value={form.time} onChange={(time) => patch({ time })} />
        <FormGrid.Full>
          <Input
            name="reason"
            label="Motivo"
            placeholder="Control, limpieza, urgencia..."
            value={form.reason}
            onChange={(e) => patch({ reason: e.target.value })}
          />
        </FormGrid.Full>
      </FormGrid>
    </FormModal>
  );
};

export default AddAppointmentModal;
