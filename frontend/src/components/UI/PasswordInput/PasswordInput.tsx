import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input, { type InputProps } from "../Input/Input";
import styles from "./PasswordInput.module.scss";

export type PasswordInputProps = Omit<InputProps, "type">;

/** A password field with its own show/hide toggle. */
const PasswordInput = (props: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.wrapper}>
      <Input type={visible ? "text" : "password"} {...props} />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {visible ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
