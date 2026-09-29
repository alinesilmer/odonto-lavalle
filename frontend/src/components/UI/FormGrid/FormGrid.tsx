import type { ReactNode } from "react";
import styles from "./FormGrid.module.scss";

/** Two columns of fields that collapse to one on small screens. */
const FormGrid = ({ children }: { children: ReactNode }) => <div className={styles.grid}>{children}</div>;

/** A field that spans both columns (long text, descriptions). */
const Full = ({ children }: { children: ReactNode }) => <div className={styles.full}>{children}</div>;

FormGrid.Full = Full;

export default FormGrid;
