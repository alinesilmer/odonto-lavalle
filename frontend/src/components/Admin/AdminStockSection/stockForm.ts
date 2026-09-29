import type { UpsertStockItemRequest } from "@odonto/shared";
import { STOCK_UNITS, type StockTemplate } from "@/data/stockTemplates";

export type StockForm = UpsertStockItemRequest;

export const EMPTY_STOCK_FORM: StockForm = {
  product: "",
  category: "",
  quantity: 0,
  unit: "Unidad",
  price: 0,
  minQuantity: 0,
};

/** The unit list, plus the item's own unit when it's a custom one. */
export const unitOptions = (current: string) =>
  (STOCK_UNITS.includes(current) || !current ? STOCK_UNITS : [...STOCK_UNITS, current]).map((unit) => ({
    value: unit,
    label: unit,
  }));

/** A template's fields over the current form; quantity and price stay as typed. */
export const applyTemplate = (form: StockForm, template: StockTemplate): StockForm => ({
  ...form,
  product: template.product,
  category: template.category,
  unit: template.unit,
  minQuantity: template.minQuantity,
});

/** The numeric fields, so a change handler knows what to coerce. */
const NUMERIC_FIELDS = new Set<keyof StockForm>(["quantity", "price", "minQuantity"]);

export const coerceField = (name: keyof StockForm, value: string): string | number =>
  NUMERIC_FIELDS.has(name) ? Number(value) : value;

/** Field → message for whatever blocks saving. */
export function stockFormErrors(form: StockForm): Partial<Record<keyof StockForm, string>> {
  const errors: Partial<Record<keyof StockForm, string>> = {};
  if (!form.product.trim()) errors.product = "Ingresá el nombre del producto";
  if (!form.category.trim()) errors.category = "Elegí o escribí una categoría";
  if (!Number.isInteger(form.quantity) || form.quantity < 0) errors.quantity = "Cantidad entera, 0 o más";
  if (!Number.isInteger(form.minQuantity) || form.minQuantity < 0) errors.minQuantity = "Número entero, 0 o más";
  if (!(form.price >= 0)) errors.price = "Precio inválido";
  return errors;
}

/** At or under its minimum — the same rule as the dashboard's "stock bajo" count. */
export const isLowStock = (item: Pick<StockForm, "quantity" | "minQuantity">) => item.quantity <= item.minQuantity;
