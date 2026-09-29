import DatePicker from "@/components/UI/DatePicker/DatePicker";
import FormGrid from "@/components/UI/FormGrid/FormGrid";
import Input from "@/components/UI/Input/Input";
import FormModal from "@/components/UI/Modal/FormModal";
import Select from "@/components/UI/Select/Select";
import Textarea from "@/components/UI/Textarea/Textarea";
import type { IndexedForm } from "../hooks/useIndexedForm";
import { TIMELINE_STATUS_LABEL } from "../labels";
import { TIMELINE_STATUSES, type TimelineEntry, type TimelineStatus } from "../types";

const TimelineModal = ({ form }: { form: IndexedForm<TimelineEntry> }) => {
  const adding = form.editingIndex === null;

  return (
    <FormModal
      open={form.open}
      eyebrow="Evolución"
      title={adding ? "Nueva etapa" : "Editar etapa"}
      onClose={form.close}
      onConfirm={() => void form.submit()}
      confirmLabel={adding ? "Agregar etapa" : "Guardar cambios"}
    >
      <FormGrid>
        <FormGrid.Full>
          <Input
            name="timeline-title"
            label="Título"
            placeholder="Ej: Empaste pieza 16"
            value={form.form.title}
            onChange={(e) => form.patch({ title: e.target.value })}
          />
        </FormGrid.Full>
        <DatePicker name="timeline-date" label="Fecha" value={form.form.date} onChange={(date) => form.patch({ date })} />
        <Select
          name="timeline-status"
          label="Estado"
          value={form.form.status}
          onChange={(value) => form.patch({ status: value as TimelineStatus })}
          options={TIMELINE_STATUSES.map((status) => ({ value: status, label: TIMELINE_STATUS_LABEL[status] }))}
        />
        <FormGrid.Full>
          <Textarea
            name="timeline-description"
            label="Descripción"
            rows={3}
            value={form.form.description}
            onChange={(e) => form.patch({ description: e.target.value })}
          />
        </FormGrid.Full>
      </FormGrid>
    </FormModal>
  );
};

export default TimelineModal;
