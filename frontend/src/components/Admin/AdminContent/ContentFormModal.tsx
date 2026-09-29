import { useState } from "react";
import FormGrid from "@/components/UI/FormGrid/FormGrid";
import Input from "@/components/UI/Input/Input";
import FormModal from "@/components/UI/Modal/FormModal";
import Select from "@/components/UI/Select/Select";
import Textarea from "@/components/UI/Textarea/Textarea";
import type { ContentField } from "./contentConfig";

type Values = Record<string, string | number>;

interface ContentFormModalProps {
  open: boolean;
  onClose: () => void;
  /** "Nueva pregunta", "Editar servicio"… */
  title: string;
  fields: ContentField[];
  initial: Values;
  busy: boolean;
  error?: string | null;
  onSubmit: (values: Values) => void;
}

/** Create/edit dialog for any kind of site content, built from its field list. */
const ContentFormModal = ({ open, onClose, title, fields, initial, busy, error, onSubmit }: ContentFormModalProps) => {
  const [values, setValues] = useState<Values>(initial);
  const [touched, setTouched] = useState(false);
  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const missing = (field: ContentField) => field.required && String(values[field.name] ?? "").trim() === "";
  const submit = () => {
    setTouched(true);
    if (!fields.some(missing)) onSubmit(values);
  };

  const control = (field: ContentField) => {
    const common = {
      name: field.name,
      label: field.label,
      touched,
      error: missing(field) ? "Completá este campo" : undefined,
    };
    const value = String(values[field.name] ?? "");
    if (field.type === "select") {
      return <Select {...common} value={value} options={field.options ?? []} onChange={(v) => set(field.name, v)} />;
    }
    if (field.type === "multiline") {
      return <Textarea {...common} rows={5} value={value} hint={field.hint} placeholder={field.placeholder} onChange={(e) => set(field.name, e.target.value)} />;
    }
    return (
      <Input
        {...common}
        type={field.type === "url" ? "url" : "text"}
        value={value}
        hint={field.hint}
        placeholder={field.placeholder ?? (field.type === "url" ? "https://…" : undefined)}
        onChange={(e) => set(field.name, e.target.value)}
      />
    );
  };

  return (
    <FormModal open={open} onClose={onClose} title={title} eyebrow="Contenido del sitio" size="lg" busy={busy} error={error} onConfirm={submit}>
      <FormGrid>
        {fields.map((field) =>
          field.full ? <FormGrid.Full key={field.name}>{control(field)}</FormGrid.Full> : <div key={field.name}>{control(field)}</div>,
        )}
      </FormGrid>
    </FormModal>
  );
};

export default ContentFormModal;
