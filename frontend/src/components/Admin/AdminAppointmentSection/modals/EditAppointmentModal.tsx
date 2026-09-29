import { useEffect, useState } from "react";
import type { AppointmentStatus, UpdateAppointmentRequest } from "@odonto/shared";
import FormModal from "@/components/UI/Modal/FormModal";
import Input from "@/components/UI/Input/Input";
import DatePicker from "@/components/UI/DatePicker/DatePicker";
import FormGrid from "@/components/UI/FormGrid/FormGrid";
import Select from "@/components/UI/Select/Select";
import TimePicker from "@/components/UI/TimePicker/TimePicker";
import { APPOINTMENT_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "@/data/formOptions";
import type { AppointmentRow } from "@/services/adapters";
import { toApiTimestamp, toFormFields } from "@/utils/clinicTime";

interface EditAppointmentModalProps {
  row: AppointmentRow | null;
  saving: boolean;
  onClose: () => void;
  onSave: (id: string, patch: UpdateAppointmentRequest) => Promise<boolean>;
}

interface EditForm {
  /** "2026-03-14" and "13:30", split out of the row's UTC timestamp. */
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  paymentStatus: string;
}

const EditAppointmentModal = ({ row, saving, onClose, onSave }: EditAppointmentModalProps) => {
  const [form, setForm] = useState<EditForm | null>(null);

  useEffect(() => {
    if (!row) {
      setForm(null);
      return;
    }
    setForm({
      ...toFormFields(row.startsAt),
      reason: row.reason,
      status: row.rawStatus,
      paymentStatus: row.rawPaymentStatus,
    });
  }, [row]);

  if (!row || !form) return null;

  const patch = (values: Partial<EditForm>) =>
    setForm((current) => (current ? { ...current, ...values } : current));

  const confirm = async () => {
    const saved = await onSave(row.id, {
      startsAt: toApiTimestamp(form.date, form.time),
      reason: form.reason,
      status: form.status,
      paymentStatus: form.paymentStatus as UpdateAppointmentRequest["paymentStatus"],
    });
    if (saved) onClose();
  };

  return (
    <FormModal
      open
      eyebrow={row.patientName}
      title="Editar turno"
      onClose={onClose}
      onConfirm={() => void confirm()}
      confirmLabel="Guardar cambios"
      busy={saving}
    >
      <FormGrid>
        <DatePicker name="editDate" label="Fecha" value={form.date} onChange={(date) => patch({ date })} />
        <TimePicker name="editTime" label="Hora" value={form.time} onChange={(time) => patch({ time })} />
        <FormGrid.Full>
          <Input name="editReason" label="Motivo" value={form.reason} onChange={(e) => patch({ reason: e.target.value })} />
        </FormGrid.Full>
        <Select
          name="editStatus"
          label="Estado"
          value={form.status}
          onChange={(status) => patch({ status: status as AppointmentStatus })}
          options={APPOINTMENT_STATUS_OPTIONS}
        />
        <Select
          name="editPayment"
          label="Pago"
          value={form.paymentStatus}
          onChange={(paymentStatus) => patch({ paymentStatus })}
          options={PAYMENT_STATUS_OPTIONS}
        />
      </FormGrid>
    </FormModal>
  );
};

export default EditAppointmentModal;
