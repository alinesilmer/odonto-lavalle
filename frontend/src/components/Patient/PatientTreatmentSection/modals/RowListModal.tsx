import { Plus, Trash2 } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import DatePicker from "@/components/UI/DatePicker/DatePicker";
import FormGrid from "@/components/UI/FormGrid/FormGrid";
import IconButton from "@/components/UI/IconButton/IconButton";
import Input from "@/components/UI/Input/Input";
import FormModal from "@/components/UI/Modal/FormModal";
import Textarea from "@/components/UI/Textarea/Textarea";
import type { EditableList } from "../hooks/useEditableList";
import styles from "../PatientTreatmentSection.module.scss";

export interface RowField<T> {
  key: keyof T & string;
  label: string;
  type?: "text" | "date" | "multiline";
  placeholder?: string;
  /** Spans the full width of the card (long text). */
  full?: boolean;
}

interface RowListModalProps<T extends object> {
  title: string;
  /** Singular name of one row, e.g. "Condición", shown on each card. */
  itemLabel: string;
  addLabel: string;
  fields: RowField<T>[];
  list: EditableList<T>;
  busy: boolean;
  error: string | null;
  onSave: () => void;
}

/**
 * A dialog over a list of identically-shaped rows, each on its own card.
 * Conditions and medications differ only in their fields.
 */
function RowListModal<T extends object>({
  title,
  itemLabel,
  addLabel,
  fields,
  list,
  busy,
  error,
  onSave,
}: RowListModalProps<T>) {
  const renderField = (field: RowField<T>, row: T, index: number) => {
    const name = `${field.key}-${index}`;
    const value = String(row[field.key] ?? "");
    const set = (next: string) => list.updateRow(index, { [field.key]: next } as Partial<T>);

    if (field.type === "date") return <DatePicker name={name} label={field.label} value={value} onChange={set} />;
    if (field.type === "multiline") {
      return (
        <Textarea
          name={name}
          label={field.label}
          rows={3}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => set(e.target.value)}
        />
      );
    }
    return <Input name={name} label={field.label} placeholder={field.placeholder} value={value} onChange={(e) => set(e.target.value)} />;
  };

  return (
    <FormModal
      open={list.open}
      eyebrow="Tratamiento"
      title={title}
      size="lg"
      onClose={list.close}
      onConfirm={onSave}
      confirmLabel="Guardar cambios"
      busy={busy}
      error={error}
    >
      {list.draft.length === 0 ? <p>Todavía no hay registros. Agregá el primero.</p> : null}

      {list.draft.map((row, index) => (
        <section key={index} className={styles.rowCard} aria-label={`${itemLabel} ${index + 1}`}>
          <header className={styles.rowCardHead}>
            <span>
              {itemLabel} {index + 1}
            </span>
            <IconButton label={`Quitar ${itemLabel.toLowerCase()} ${index + 1}`} tone="danger" onClick={() => list.removeRow(index)}>
              <Trash2 aria-hidden="true" />
            </IconButton>
          </header>
          <FormGrid>
            {fields.map((field) =>
              field.full ? (
                <FormGrid.Full key={field.key}>{renderField(field, row, index)}</FormGrid.Full>
              ) : (
                <div key={field.key}>{renderField(field, row, index)}</div>
              ),
            )}
          </FormGrid>
        </section>
      ))}

      <Button variant="secondary" size="small" onClick={list.addRow} icon={<Plus size={16} strokeWidth={1.8} aria-hidden="true" />}>
        {addLabel}
      </Button>
    </FormModal>
  );
}

export default RowListModal;
