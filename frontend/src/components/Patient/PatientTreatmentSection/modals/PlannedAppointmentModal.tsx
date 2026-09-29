import DatePicker from "@/components/UI/DatePicker/DatePicker";
import FormGrid from "@/components/UI/FormGrid/FormGrid";
import Input from "@/components/UI/Input/Input";
import FormModal from "@/components/UI/Modal/FormModal";
import TimePicker from "@/components/UI/TimePicker/TimePicker";
import type { IndexedForm } from "../hooks/useIndexedForm";
import type { PlannedAppointment } from "../types";

const PlannedAppointmentModal = ({ form }: { form: IndexedForm<PlannedAppointment> }) => {
  const adding = form.editingIndex === null;

  return (
    <FormModal
      open={form.open}
      eyebrow="Visitas del tratamiento"
      title={adding ? "Nueva visita" : "Editar visita"}
      onClose={form.close}
      onConfirm={() => void form.submit()}
      confirmLabel={adding ? "Agregar visita" : "Guardar cambios"}
    >
      <FormGrid>
        <FormGrid.Full>
          <Input
            name="appointment-type"
            label="Procedimiento"
            placeholder="Ej: Control post-endodoncia"
            value={form.form.type}
            onChange={(e) => form.patch({ type: e.target.value })}
          />
        </FormGrid.Full>
        <DatePicker name="appointment-date" label="Fecha" value={form.form.date} onChange={(date) => form.patch({ date })} />
        <TimePicker name="appointment-time" label="Hora" value={form.form.time} onChange={(time) => form.patch({ time })} />
        <FormGrid.Full>
          <Input
            name="appointment-doctor"
            label="Profesional"
            value={form.form.doctor}
            onChange={(e) => form.patch({ doctor: e.target.value })}
          />
        </FormGrid.Full>
      </FormGrid>
    </FormModal>
  );
};

export default PlannedAppointmentModal;
