import type { ReactNode } from "react";
import styles from "./Alert.module.scss";

interface AlertProps {
  children: ReactNode;
  tone?: "error" | "success";
}

/** A short message box; errors are announced to screen readers straight away. */
const Alert = ({ children, tone = "error" }: AlertProps) => (
  <p className={`${styles.alert} ${styles[tone]}`} role={tone === "error" ? "alert" : "status"}>
    {children}
  </p>
);

export default Alert;
