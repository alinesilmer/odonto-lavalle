import { useState } from "react";
import DatePicker from "@/components/UI/DatePicker/DatePicker";
import FormGrid from "@/components/UI/FormGrid/FormGrid";
import Input from "@/components/UI/Input/Input";
import FormModal from "@/components/UI/Modal/FormModal";
import Textarea from "@/components/UI/Textarea/Textarea";
import { toIsoDate } from "@/utils/date";
import { EMPTY_ENTRY, type NewHistoryEntry } from "../types";

interface AddEntryModalProps {
  open: boolean;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (entry: NewHistoryEntry) => Promise<boolean>;
}

const AddEntryModal = ({ open, saving, error, onClose, onSubmit }: AddEntryModalProps) => {
  const [entry, setEntry] = useState<NewHistoryEntry>(EMPTY_ENTRY);
  const [missing, setMissing] = useState(false);

  const patch = (values: Partial<NewHistoryEntry>) => setEntry((current) => ({ ...current, ...values }));

  const confirm = async () => {
    if (!entry.title || !entry.date) {
      setMissing(true);
      return;
    }
    if (await onSubmit(entry)) {
      setEntry(EMPTY_ENTRY);
      setMissing(false);
      onClose();
    }
  };

  return (
    <FormModal
      open={open}
      eyebrow="Historia clínica"
      title="Nueva consulta"
      size="lg"
      onClose={onClose}
      onConfirm={() => void confirm()}
      confirmLabel="Agregar consulta"
      busy={saving}
      error={error}
    >
      <FormGrid>
        <Input
          name="entry-title"
          label="Título"
          required
          placeholder="Ej: Limpieza dental"
          value={entry.title}
          error={missing && !entry.title ? "Escribí un título" : undefined}
          onChange={(e) => patch({ title: e.target.value })}
        />
        <DatePicker
          name="entry-date"
          label="Fecha"
          required
          max={toIsoDate(new Date())}
          value={entry.date}
          error={missing && !entry.date ? "Elegí la fecha" : undefined}
          onChange={(date) => patch({ date })}
        />
        <FormGrid.Full>
          <Textarea
            name="entry-diagnosis"
            label="Diagnóstico"
            rows={3}
            placeholder="Qué se encontró y qué se hizo"
            value={entry.diagnosis}
            onChange={(e) => patch({ diagnosis: e.target.value })}
          />
        </FormGrid.Full>
        <FormGrid.Full>
          <Input
            name="entry-medication"
            label="Medicación indicada"
            placeholder="Ej: Amoxicilina 500 mg cada 8 h"
            value={entry.medication}
            onChange={(e) => patch({ medication: e.target.value })}
          />
        </FormGrid.Full>
        <FormGrid.Full>
          <Textarea
            name="entry-notes"
            label="Notas del profesional"
            rows={3}
            value={entry.notes}
            onChange={(e) => patch({ notes: e.target.value })}
          />
        </FormGrid.Full>
      </FormGrid>
    </FormModal>
  );
};

export default AddEntryModal;
