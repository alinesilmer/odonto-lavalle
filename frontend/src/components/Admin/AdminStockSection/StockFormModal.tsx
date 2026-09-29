import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, LayoutGrid } from "lucide-react";
import FormGrid from "@/components/UI/FormGrid/FormGrid";
import FormModal from "@/components/UI/Modal/FormModal";
import Input from "@/components/UI/Input/Input";
import Select from "@/components/UI/Select/Select";
import { STOCK_TEMPLATE_CATEGORIES } from "@/data/stockTemplates";
import { formatPrice } from "@/utils/money";
import StockTemplatePicker from "./StockTemplatePicker";
import { EMPTY_STOCK_FORM, applyTemplate, coerceField, isLowStock, stockFormErrors, unitOptions, type StockForm } from "./stockForm";
import styles from "./StockFormModal.module.scss";

interface StockFormModalProps {
  open: boolean;
  /** Prefilled when editing, absent when adding. */
  initial?: StockForm;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (form: StockForm) => Promise<boolean>;
}

const Group = ({ title, children }: { title: string; children: ReactNode }) => (
  <fieldset className={styles.group}>
    <legend className={styles.groupTitle}>{title}</legend>
    <FormGrid>{children}</FormGrid>
  </fieldset>
);

const StockFormModal = ({ open, initial, saving, error, onClose, onSubmit }: StockFormModalProps) => {
  const [form, setForm] = useState<StockForm>(initial ?? EMPTY_STOCK_FORM);
  const [touched, setTouched] = useState(false);
  /** Adding starts on the template list; picking one (or "a mano") shows the form. */
  const [browsing, setBrowsing] = useState(!initial);
  const [template, setTemplate] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm(initial ?? EMPTY_STOCK_FORM);
    setTouched(false);
    setBrowsing(!initial);
    setTemplate(null);
  }, [open, initial]);

  const patch = (name: keyof StockForm, value: string) =>
    setForm((current) => ({ ...current, [name]: coerceField(name, value) }));

  const errors = stockFormErrors(form);
  const confirm = async () => {
    setTouched(true);
    if (Object.keys(errors).length > 0) return;
    if (await onSubmit(form)) onClose();
  };

  const low = isLowStock(form);
  const field = (name: keyof StockForm) => ({ name, touched, error: errors[name] });

  return (
    <FormModal
      open={open}
      eyebrow={initial ? "Stock" : `Stock · Paso ${browsing ? 1 : 2} de 2`}
      title={initial ? "Editar producto" : browsing ? "Elegí un insumo" : "Cantidad y precio"}
      size={browsing ? "xl" : "lg"}
      align="top"
      onClose={onClose}
      // While browsing there is nothing to save yet: the main button skips the templates.
      onConfirm={() => (browsing ? setBrowsing(false) : void confirm())}
      confirmLabel={initial ? "Guardar cambios" : browsing ? "Continuar sin plantilla" : "Agregar al stock"}
      busy={saving}
      error={error}
    >
      {browsing ? (
        <StockTemplatePicker
          onPick={(picked) => {
            setForm((current) => applyTemplate(current, picked));
            setTemplate(picked.product);
            setBrowsing(false);
          }}
          onManual={() => setBrowsing(false)}
        />
      ) : (
        <>
          {!initial ? (
            <div className={styles.templateBar}>
              <LayoutGrid size={16} strokeWidth={1.8} aria-hidden="true" />
              <span>{template ? <>Plantilla: <strong>{template}</strong></> : "Carga manual"}</span>
              <button type="button" className={styles.linkButton} onClick={() => setBrowsing(true)}>
                {template ? "Cambiar plantilla" : "Ver plantillas"}
              </button>
            </div>
          ) : null}

          <Group title="Producto">
            <FormGrid.Full>
              <Input {...field("product")} label="Nombre" value={form.product} onChange={(e) => patch("product", e.target.value)} />
            </FormGrid.Full>
            <Input
              {...field("category")}
              label="Categoría"
              list="stock-categories"
              placeholder="Ej.: Descartables"
              value={form.category}
              onChange={(e) => patch("category", e.target.value)}
            />
            <datalist id="stock-categories">
              {STOCK_TEMPLATE_CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <Select name="unit" label="Unidad" value={form.unit} onChange={(unit) => patch("unit", unit)} options={unitOptions(form.unit)} />
          </Group>

          <Group title="Existencias">
            <Input {...field("quantity")} label="Cantidad actual" type="number" min={0} inputMode="numeric" value={form.quantity} onChange={(e) => patch("quantity", e.target.value)} />
            <Input
              {...field("minQuantity")}
              label="Avisarme cuando queden"
              type="number"
              min={0}
              inputMode="numeric"
              value={form.minQuantity}
              onChange={(e) => patch("minQuantity", e.target.value)}
            />
            <FormGrid.Full>
              <p className={`${styles.status} ${low ? styles.statusLow : styles.statusOk}`}>
                {low ? <AlertTriangle size={16} aria-hidden="true" /> : <CheckCircle2 size={16} aria-hidden="true" />}
                {low
                  ? `Con ${form.quantity} ${form.unit.toLowerCase()} va a figurar como stock bajo.`
                  : `Stock suficiente: te avisamos al llegar a ${form.minQuantity}.`}
              </p>
            </FormGrid.Full>
          </Group>

          <Group title="Costo">
            <Input
              {...field("price")}
              label={`Precio por ${form.unit.toLowerCase()}`}
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              hint={form.price > 0 ? `${formatPrice(form.price)} · total en stock ${formatPrice(form.price * form.quantity)}` : "Opcional"}
              onChange={(e) => patch("price", e.target.value)}
            />
          </Group>
        </>
      )}
    </FormModal>
  );
};

export default StockFormModal;
