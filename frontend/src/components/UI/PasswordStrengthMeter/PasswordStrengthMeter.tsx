import { getPasswordStrength } from "@/schemas";
import styles from "./PasswordStrengthMeter.module.scss";

/** Renders nothing until something has been typed. */
const PasswordStrengthMeter = ({ password }: { password: string }) => {
  if (!password) return null;

  const { level, label, color } = getPasswordStrength(password);

  return (
    <div className={styles.meter}>
      <div className={styles.bar}>
        <div
          className={styles.fill}
          style={{ width: `${(level / 3) * 100}%`, backgroundColor: color }}
        />
      </div>
      <span className={styles.label} style={{ color }}>
        {label}
      </span>
    </div>
  );
};

export default PasswordStrengthMeter;
