import { useEffect, useState } from "react";
import type { UpdateAppointmentRequest } from "@odonto/shared";
import DatePicker from "@/components/UI/DatePicker/DatePicker";
import FormGrid from "@/components/UI/FormGrid/FormGrid";
import Input from "@/components/UI/Input/Input";
import FormModal from "@/components/UI/Modal/FormModal";
import TimePicker from "@/components/UI/TimePicker/TimePicker";
import type { AppointmentRow } from "@/services/adapters";
import { toApiTimestamp, toFormFields } from "@/utils/clinicTime";
import { toIsoDate } from "@/utils/date";

interface EditModalProps {
  row: AppointmentRow | null;
  saving: boolean;
  onClose: () => void;
  onSave: (id: string, patch: UpdateAppointmentRequest) => Promise<boolean>;
}

interface Draft {
  date: string;
  time: string;
  reason: string;
}

const EditModal = ({ row, saving, onClose, onSave }: EditModalProps) => {
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    if (!row) {
      setDraft(null);
      return;
    }
    // The row's display date is dd/mm/yyyy, so the editable value comes from the raw timestamp.
    setDraft({ ...toFormFields(row.startsAt), reason: row.reason });
  }, [row]);

  if (!row || !draft) return null;

  const confirm = async () => {
    const saved = await onSave(row.id, {
      startsAt: toApiTimestamp(draft.date, draft.time),
      reason: draft.reason,
    });
    if (saved) onClose();
  };

  return (
    <FormModal
      open
      eyebrow="Mis turnos"
      title="Cambiar turno"
      onClose={onClose}
      onConfirm={() => void confirm()}
      busy={saving}
      confirmLabel="Guardar cambios"
    >
      <FormGrid>
        <DatePicker
          name="date"
          label="Fecha"
          min={toIsoDate(new Date())}
          value={draft.date}
          onChange={(date) => setDraft({ ...draft, date })}
        />
        <TimePicker name="time" label="Hora" value={draft.time} onChange={(time) => setDraft({ ...draft, time })} />
        <FormGrid.Full>
          <Input name="reason" label="Motivo" value={draft.reason} onChange={(e) => setDraft({ ...draft, reason: e.target.value })} />
        </FormGrid.Full>
      </FormGrid>
    </FormModal>
  );
};

export default EditModal;
