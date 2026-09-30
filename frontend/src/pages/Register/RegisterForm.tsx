import { Controller, type Control } from "react-hook-form";
import { Calendar, Mail, Phone, Shield, User, type LucideIcon } from "lucide-react";
import Input from "@/components/UI/Input/Input";
import PasswordInput from "@/components/UI/PasswordInput/PasswordInput";
import PasswordStrengthMeter from "@/components/UI/PasswordStrengthMeter/PasswordStrengthMeter";
import Select from "@/components/UI/Select/Select";
import { GENDER_OPTIONS } from "@/data/formOptions";
import { useInsuranceOptions } from "@/hooks/useInsuranceOptions";
import type { RegisterFormInput } from "@/schemas";
import styles from "./Register.module.scss";

interface RegisterFormFieldsProps {
  control: Control<RegisterFormInput>;
  password: string;
}

interface TextField {
  name: "fullName" | "dni" | "email" | "phone" | "birthDate";
  label: string;
  icon: LucideIcon;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "date";
}

const TEXT_FIELDS: TextField[] = [
  { name: "fullName", label: "Nombre Completo", placeholder: "Juan Pérez", icon: User },
  { name: "dni", label: "DNI", placeholder: "43747511", icon: Shield },
  { name: "email", label: "Correo Electrónico", placeholder: "tucorreo@ejemplo.com", icon: Mail, type: "email" },
  { name: "phone", label: "Teléfono", placeholder: "3794532535", icon: Phone, type: "tel" },
  { name: "birthDate", label: "Fecha de Nacimiento", icon: Calendar, type: "date" },
];

const RegisterFormFields = ({ control, password }: RegisterFormFieldsProps) => {
  const insuranceOptions = useInsuranceOptions();

  return (
  <>
    {TEXT_FIELDS.map(({ name, label, placeholder, icon: Icon, type }) => (
      <div key={name} className={styles.field}>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <Input
              label={label}
              placeholder={placeholder}
              leftIcon={<Icon size={20} />}
              error={fieldState.error?.message}
              type={type}
              required
              {...field}
            />
          )}
        />
      </div>
    ))}

    <div className={styles.field}>
      <Controller
        name="gender"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            label="Género"
            name={field.name}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            options={GENDER_OPTIONS}
            error={fieldState.error?.message}
            required
          />
        )}
      />
    </div>

    <div className={styles.field}>
      <Controller
        name="insurance"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            label="Obra Social"
            name={field.name}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            options={insuranceOptions}
            error={fieldState.error?.message}
            required
          />
        )}
      />
    </div>

    <div className={styles.field}>
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <PasswordInput
            label="Contraseña"
            placeholder="••••••••"
            error={fieldState.error?.message}
            required
            {...field}
          />
        )}
      />
      <PasswordStrengthMeter password={password} />
    </div>

    <div className={styles.field}>
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <PasswordInput
            label="Confirmar Contraseña"
            placeholder="••••••••"
            error={fieldState.error?.message}
            required
            {...field}
          />
        )}
      />
    </div>
  </>
  );
};

export default RegisterFormFields;
