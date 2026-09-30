import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPatientSchema, type CreatePatientRequest, type PatientDto } from "@odonto/shared";
import DatePicker from "@/components/UI/DatePicker/DatePicker";
import FormGrid from "@/components/UI/FormGrid/FormGrid";
import Input from "@/components/UI/Input/Input";
import FormModal from "@/components/UI/Modal/FormModal";
import Select from "@/components/UI/Select/Select";
import { GENDER_OPTIONS } from "@/data/formOptions";
import { useInsuranceOptions } from "@/hooks/useInsuranceOptions";
import { toIsoDate } from "@/utils/date";

type Values = CreatePatientRequest;

interface PatientFormModalProps {
  open: boolean;
  /** The patient being edited; absent when adding one. */
  patient?: PatientDto | null;
  busy: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (values: Values) => Promise<boolean>;
}

const EMPTY: Values = { fullName: "", dni: "", gender: "" as Values["gender"], email: "", phone: "", birthDate: "", insurance: "" };

/** DNI and email identify the record, so they are fixed once it exists. */
const editSchema = createPatientSchema.omit({ dni: true, email: true });

const fromPatient = (p: PatientDto): Values => ({
  fullName: p.fullName,
  dni: p.dni,
  gender: p.gender,
  email: p.email,
  phone: p.phone,
  birthDate: p.birthDate,
  insurance: p.insurance,
});

/** Add a patient from the dashboard, or edit one; the same fields and rules either way. */
const PatientFormModal = ({ open, patient, busy, error, onClose, onSubmit }: PatientFormModalProps) => {
  const editing = Boolean(patient);
  // The clinic's obras sociales from Contenido del sitio, keeping the patient's current one.
  const insuranceOptions = useInsuranceOptions(patient?.insurance);
  const { control, handleSubmit, reset } = useForm<Values>({
    // The edit schema checks a subset; DNI and email pass through untouched.
    resolver: zodResolver(editing ? editSchema.passthrough() : createPatientSchema) as never,
    mode: "onBlur",
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) reset(patient ? fromPatient(patient) : EMPTY);
  }, [open, patient, reset]);

  const submit = handleSubmit(async (values) => {
    if (await onSubmit(values)) onClose();
  });

  const text = (name: keyof Values, label: string, extra: Record<string, unknown> = {}) => (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => <Input {...field} label={label} error={fieldState.error?.message} {...extra} />}
    />
  );

  const select = (name: "gender" | "insurance", label: string, options: typeof GENDER_OPTIONS) => (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Select name={name} label={label} value={field.value} onChange={field.onChange} onBlur={field.onBlur} options={options} placeholder="Elegí una opción" error={fieldState.error?.message} />
      )}
    />
  );

  return (
    <FormModal
      open={open}
      onClose={onClose}
      eyebrow="Pacientes"
      title={editing ? "Editar paciente" : "Agregar paciente"}
      size="lg"
      align="top"
      busy={busy}
      error={error}
      confirmLabel={editing ? "Guardar cambios" : "Agregar paciente"}
      onConfirm={() => void submit()}
    >
      <FormGrid>
        <FormGrid.Full>{text("fullName", "Nombre y apellido", { placeholder: "Ej.: María González" })}</FormGrid.Full>
        {text("dni", "DNI", { inputMode: "numeric", placeholder: "Sin puntos", disabled: editing, hint: editing ? "El DNI no se puede cambiar." : undefined })}
        <Controller
          name="birthDate"
          control={control}
          render={({ field, fieldState }) => (
            <DatePicker
              name="birthDate"
              label="Fecha de nacimiento"
              value={field.value}
              onChange={field.onChange}
              max={toIsoDate(new Date())}
              initialView={field.value ? "days" : "years"}
              presets={false}
              error={fieldState.error?.message}
            />
          )}
        />
        {text("phone", "Teléfono", { type: "tel", inputMode: "tel", placeholder: "3794 123456" })}
        {text("email", "Email", {
          type: "email",
          placeholder: "Opcional",
          disabled: editing,
          hint: editing ? undefined : "Opcional. Si más adelante se registra con este DNI, su cuenta toma esta ficha.",
        })}
        {select("gender", "Género", GENDER_OPTIONS)}
        {select("insurance", "Obra social", insuranceOptions)}
      </FormGrid>
    </FormModal>
  );
};

export default PatientFormModal;
