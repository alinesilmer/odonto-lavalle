import { useEffect, useState } from "react";
import DatePicker from "@/components/UI/DatePicker/DatePicker";
import FormGrid from "@/components/UI/FormGrid/FormGrid";
import Input from "@/components/UI/Input/Input";
import FormModal from "@/components/UI/Modal/FormModal";
import Textarea from "@/components/UI/Textarea/Textarea";
import TimePicker from "@/components/UI/TimePicker/TimePicker";
import { clinicToday } from "@/utils/clinicTime";
import type { NewReminder } from "./useReminders";

interface AddReminderModalProps {
  open: boolean;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onCreate: (form: NewReminder) => Promise<boolean>;
}

const empty = (): NewReminder => ({ title: "", description: "", date: clinicToday(), time: "09:00" });

const AddReminderModal = ({ open, saving, error, onClose, onCreate }: AddReminderModalProps) => {
  const [form, setForm] = useState<NewReminder>(empty);
  const [missing, setMissing] = useState(false);

  // A fresh form every time it opens.
  useEffect(() => {
    if (open) {
      setForm(empty());
      setMissing(false);
    }
  }, [open]);

  const set = (field: keyof NewReminder) => (value: string) => setForm((f) => ({ ...f, [field]: value }));

  const submit = async () => {
    if (!form.title.trim() || !form.date) {
      setMissing(true);
      return;
    }
    if (await onCreate(form)) onClose();
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      onConfirm={() => void submit()}
      busy={saving}
      error={error}
      eyebrow="Recordatorios"
      title="Nuevo recordatorio"
      confirmLabel="Guardar recordatorio"
    >
      <FormGrid>
        <FormGrid.Full>
          <Input
            name="title"
            label="Título"
            required
            value={form.title}
            onChange={(e) => set("title")(e.target.value)}
            error={missing && !form.title.trim() ? "Escribí un título" : undefined}
            placeholder="Ej: Llamar a un paciente"
          />
        </FormGrid.Full>
        <FormGrid.Full>
          <Textarea
            name="description"
            label="Detalle (opcional)"
            rows={3}
            value={form.description}
            onChange={(e) => set("description")(e.target.value)}
          />
        </FormGrid.Full>
        <DatePicker name="date" label="Fecha" required value={form.date} onChange={set("date")} />
        <TimePicker name="time" label="Hora" value={form.time} onChange={set("time")} />
      </FormGrid>
    </FormModal>
  );
};

export default AddReminderModal;
