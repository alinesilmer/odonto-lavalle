import { useState } from "react";
import { Download, Printer } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import { downloadPdf, pdfFilename } from "@/utils/pdf";
import { TREATMENT_SHEET_ID } from "./TreatmentPrintSheet";
import styles from "./TreatmentPrintSheet.module.scss";

interface FichaActionsProps {
  patientName: string;
  /** Until the record has loaded there's nothing to print. */
  disabled: boolean;
}

/** "Imprimir ficha" (browser print) and "Descargar PDF" (a file, no dialog) for the printable ficha. */
const FichaActions = ({ patientName, disabled }: FichaActionsProps) => {
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const download = async () => {
    const sheet = document.getElementById(TREATMENT_SHEET_ID);
    if (!sheet) return;
    setSaving(true);
    setFailed(false);
    try {
      await downloadPdf(sheet, pdfFilename("Ficha", patientName));
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.actions}>
      {failed ? (
        <span className={styles.actionError} role="alert">
          No pudimos generar el PDF. Probá de nuevo o usá “Imprimir” → Guardar como PDF.
        </span>
      ) : null}
      <Button variant="secondary" size="small" icon={<Printer size={16} aria-hidden="true" />} onClick={() => window.print()} disabled={disabled}>
        Imprimir ficha
      </Button>
      <Button
        variant="secondary"
        size="small"
        icon={<Download size={16} aria-hidden="true" />}
        onClick={() => void download()}
        loading={saving}
        disabled={disabled}
      >
        {saving ? "Generando PDF…" : "Descargar PDF"}
      </Button>
    </div>
  );
};

export default FichaActions;
