import { useState, type FormEvent } from "react";
import PatientPage from "@/components/DashboardLayout/PatientPage";
import PasswordSection from "@/components/Settings/PasswordSection";
import SettingsHeader from "@/components/Settings/SettingsHeader";
import { usePasswordChange } from "@/components/Settings/usePasswordChange";
import Alert from "@/components/UI/Alert/Alert";
import DatePicker from "@/components/UI/DatePicker/DatePicker";
import Input from "@/components/UI/Input/Input";
import Panel from "@/components/UI/Panel/Panel";
import Select from "@/components/UI/Select/Select";
import { GENDER_OPTIONS, INSURANCE_OPTIONS } from "@/data/formOptions";
import { toIsoDate } from "@/utils/date";
import { usePatientProfile } from "./usePatientProfile";
import styles from "@/components/Settings/Settings.module.scss";

const FORM_ID = "patient-config-form";

const PatientConfig = () => {
  const profile = usePatientProfile();
  const password = usePasswordChange();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const failure = (await profile.save()) ?? (await password.submit());
    if (failure) setError(failure);
    else setSaved(true);

    setSaving(false);
  };

  return (
    <PatientPage>
      <div className={styles.wrap}>
        <SettingsHeader
          name={profile.user?.fullName ?? "Usuario"}
          email={profile.patient?.email}
          role="Paciente"
          avatarUrl={profile.user?.avatarUrl}
          formId={FORM_ID}
          saving={saving}
        />

        {error ? <Alert>{error}</Alert> : null}
        {saved ? <Alert tone="success">Tus datos se guardaron correctamente.</Alert> : null}

        <form id={FORM_ID} className={styles.form} onSubmit={onSubmit}>
          <Panel eyebrow="Perfil" title="Datos personales">
            <div className={styles.grid2}>
              <Input
                name="fullName"
                label="Nombre completo"
                placeholder="Nombre y apellido"
                value={profile.form.fullName}
                onChange={(e) => profile.set({ fullName: e.target.value })}
              />
              <DatePicker
                name="birthDate"
                label="Fecha de nacimiento"
                value={profile.form.birthDate}
                onChange={(birthDate) => profile.set({ birthDate })}
                max={toIsoDate(new Date())}
                initialView={profile.form.birthDate ? "days" : "years"}
                presets={false}
              />
              <Select
                name="gender"
                label="Género"
                value={profile.form.gender}
                onChange={(gender) => profile.set({ gender })}
                options={GENDER_OPTIONS}
              />
              <Select
                name="insurance"
                label="Obra social"
                value={profile.form.insurance}
                onChange={(insurance) => profile.set({ insurance })}
                options={INSURANCE_OPTIONS}
              />
            </div>
          </Panel>

          <Panel eyebrow="Contacto" title="Cómo te contactamos">
            <div className={styles.grid2}>
              <Input
                name="phone"
                label="Teléfono"
                type="tel"
                placeholder="3794532535"
                value={profile.form.phone}
                onChange={(e) => profile.set({ phone: e.target.value })}
              />
              <div>
                <Input name="email" label="Email" value={profile.patient?.email ?? ""} readOnly />
                <p className={styles.readonly}>El email y el DNI identifican tu cuenta. Escribinos para cambiarlos.</p>
              </div>
            </div>
          </Panel>

          <PasswordSection password={password} />
        </form>
      </div>
    </PatientPage>
  );
};

export default PatientConfig;
