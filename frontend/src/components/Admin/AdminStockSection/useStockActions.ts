import { useCallback, useMemo } from "react";
import { useApi } from "@/hooks/useApi";
import { useWriteAction } from "@/hooks/useWriteAction";
import { stockApi } from "@/services";
import { toStockRow, type StockRow } from "@/services/adapters";
import type { StockForm } from "./stockForm";

/** Strips the display-only fields; the API owns id and updatedAt. */
const payload = (form: StockForm): StockForm => ({
  product: form.product.trim(),
  category: form.category.trim(),
  quantity: form.quantity,
  unit: form.unit,
  price: form.price,
  minQuantity: form.minQuantity,
});

/** The stock list plus create/update/delete, reloading after each write. */
export function useStockActions() {
  const { data, loading, error, reload } = useApi(() => stockApi.list(), []);
  const { saving, actionError, setActionError, runWrite } = useWriteAction(reload);

  const rows = useMemo(() => (data?.items ?? []).map(toStockRow), [data]);

  return {
    rows,
    loading,
    error,
    reload,
    saving,
    actionError,
    clearError: useCallback(() => setActionError(null), [setActionError]),
    create: useCallback(
      (form: StockForm) => runWrite(() => stockApi.create(payload(form)), "No pudimos agregar el producto"),
      [runWrite],
    ),
    update: useCallback(
      (id: string, form: StockForm) => runWrite(() => stockApi.update(id, payload(form)), "No pudimos guardar el producto"),
      [runWrite],
    ),
    remove: useCallback(
      (row: StockRow) => runWrite(() => stockApi.remove(row.id), "No pudimos eliminar el producto"),
      [runWrite],
    ),
  };
}
