import { useEffect, useState, type FormEvent } from "react";
import PasswordSection from "@/components/Settings/PasswordSection";
import SettingsHeader from "@/components/Settings/SettingsHeader";
import { usePasswordChange } from "@/components/Settings/usePasswordChange";
import Alert from "@/components/UI/Alert/Alert";
import Input from "@/components/UI/Input/Input";
import Panel from "@/components/UI/Panel/Panel";
import { useAuth } from "@/auth/useAuth";
import { authApi } from "@/services";
import { ApiRequestError } from "@/services/http";
import styles from "@/components/Settings/Settings.module.scss";

const FORM_ID = "admin-config-form";
const MIN_NAME_LENGTH = 3;

const AdminConfig = () => {
  const { user, refreshProfile } = useAuth();
  const password = usePasswordChange();

  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) setFullName(user.fullName);
  }, [user]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      if (fullName.trim().length >= MIN_NAME_LENGTH) {
        await authApi.updateProfile({ fullName: fullName.trim() });
      }

      const passwordError = await password.submit();
      if (passwordError) {
        setError(passwordError);
        return;
      }

      await refreshProfile();
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "No pudimos guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <SettingsHeader
        name={user?.fullName ?? "Administración"}
        email={user?.email}
        role="Administrador"
        avatarUrl={user?.avatarUrl}
        formId={FORM_ID}
        saving={saving}
      />

      {error ? <Alert>{error}</Alert> : null}
      {saved ? <Alert tone="success">Tus datos se guardaron correctamente.</Alert> : null}

      <form id={FORM_ID} className={styles.form} onSubmit={onSubmit}>
        <Panel eyebrow="Cuenta" title="Datos personales">
          <div className={styles.grid2}>
            <Input
              name="fullName"
              label="Nombre completo"
              placeholder="Nombre y apellido"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <div>
              <Input name="email" label="Email" value={user?.email ?? ""} readOnly />
              <p className={styles.readonly}>El email identifica la cuenta y no puede cambiarse.</p>
            </div>
          </div>
        </Panel>

        <PasswordSection password={password} />
      </form>
    </div>
  );
};

export default AdminConfig;
