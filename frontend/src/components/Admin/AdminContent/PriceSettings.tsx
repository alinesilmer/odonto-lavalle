import { useState } from "react";
import Alert from "@/components/UI/Alert/Alert";
import Button from "@/components/UI/Button/Button";
import Input from "@/components/UI/Input/Input";
import Panel from "@/components/UI/Panel/Panel";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useWriteAction } from "@/hooks/useWriteAction";
import { settingsApi } from "@/services";
import { formatPrice } from "@/utils/money";
import styles from "./AdminContent.module.scss";

/** The consultation price shown when booking at /turno. */
const PriceSettings = () => {
  const { settings, reload } = useSiteSettings();
  const { saving, actionError, runWrite } = useWriteAction(reload);
  const [draft, setDraft] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const value = draft ?? String(settings.consultationPrice);
  const amount = Number(value);
  const valid = value.trim() !== "" && Number.isInteger(amount) && amount >= 0;
  const dirty = draft !== null && amount !== settings.consultationPrice;

  const save = async () => {
    if (!valid) return;
    const ok = await runWrite(() => settingsApi.update({ consultationPrice: amount }), "No pudimos guardar el precio");
    if (ok) {
      setDraft(null);
      setSaved(true);
    }
  };

  return (
    <Panel eyebrow="Turnos" title="Precio de la consulta">
      {actionError ? <Alert>{actionError}</Alert> : null}
      <div className={styles.price}>
        <Input
          name="consultationPrice"
          label="Precio en pesos"
          type="number"
          inputMode="numeric"
          min={0}
          step={500}
          value={value}
          error={valid ? undefined : "Ingresá un monto válido, sin centavos"}
          hint={valid ? `Se muestra como ${formatPrice(amount)} al reservar en /turno.` : undefined}
          onChange={(e) => {
            setDraft(e.target.value);
            setSaved(false);
          }}
        />
        <Button onClick={() => void save()} loading={saving} disabled={!dirty || !valid}>
          {saved && !dirty ? "Guardado" : "Guardar precio"}
        </Button>
      </div>
    </Panel>
  );
};

export default PriceSettings;
