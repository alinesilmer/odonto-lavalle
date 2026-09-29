import Panel from "@/components/UI/Panel/Panel";
import PasswordInput from "@/components/UI/PasswordInput/PasswordInput";
import PasswordStrengthMeter from "@/components/UI/PasswordStrengthMeter/PasswordStrengthMeter";
import type { usePasswordChange } from "./usePasswordChange";
import styles from "./Settings.module.scss";

interface PasswordSectionProps {
  password: ReturnType<typeof usePasswordChange>;
}

/** Leave it blank to keep the current password. */
const PasswordSection = ({ password }: PasswordSectionProps) => (
  <Panel eyebrow="Seguridad" title="Contraseña">
    <p className={styles.hint}>Dejá estos campos vacíos si no querés cambiar tu contraseña.</p>

    <div className={styles.grid2}>
      <PasswordInput
        name="currentPassword"
        label="Contraseña actual"
        autoComplete="current-password"
        placeholder="••••••••"
        value={password.fields.current}
        onChange={(e) => password.set({ current: e.target.value })}
      />
      <span className={styles.spacer} aria-hidden="true" />
      <div>
        <PasswordInput
          name="newPassword"
          label="Nueva contraseña"
          autoComplete="new-password"
          placeholder="••••••••"
          value={password.fields.next}
          onChange={(e) => password.set({ next: e.target.value })}
        />
        <PasswordStrengthMeter password={password.fields.next} />
      </div>
      <PasswordInput
        name="confirmPassword"
        label="Repetir nueva contraseña"
        autoComplete="new-password"
        placeholder="••••••••"
        value={password.fields.confirm}
        onChange={(e) => password.set({ confirm: e.target.value })}
      />
    </div>
  </Panel>
);

export default PasswordSection;
