import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./PrintSheet.module.scss";

/**
 * A document that exists only on paper: hidden on screen, and when the page
 * is printed it replaces the app (A4, black on white). Render it next to the
 * screen UI and call `window.print()`.
 */
const PrintSheet = ({ children }: { children: ReactNode }) =>
  createPortal(<div className={styles.sheet}>{children}</div>, document.body);

/** A titled block of the printed document that avoids splitting across pages when it can. */
export const PrintSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className={styles.section}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    {children}
  </section>
);

interface PrintTableProps {
  columns: string[];
  rows: ReactNode[][];
  empty?: string;
}

/** A ruled table for the printed document. */
export const PrintTable = ({ columns, rows, empty = "Sin datos cargados." }: PrintTableProps) =>
  rows.length === 0 ? (
    <p className={styles.empty}>{empty}</p>
  ) : (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((cells, i) => (
          <tr key={i}>
            {cells.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

export default PrintSheet;
