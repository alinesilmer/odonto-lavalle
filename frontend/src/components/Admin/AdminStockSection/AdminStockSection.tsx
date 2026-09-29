import { useMemo, useState } from "react";
import { AlertTriangle, Boxes, Edit, Plus, Trash2, Wallet } from "lucide-react";
import DataTable, { type Column } from "@/components/DataTable/DataTable";
import StatsCard from "@/components/StatsCard/StatsCard";
import Alert from "@/components/UI/Alert/Alert";
import AsyncBoundary from "@/components/UI/AsyncBoundary/AsyncBoundary";
import Button from "@/components/UI/Button/Button";
import { useConfirm } from "@/components/UI/Confirm/confirmContext";
import SearchInput from "@/components/UI/SearchInput/SearchInput";
import Tabs from "@/components/UI/Tabs/Tabs";
import type { StockRow } from "@/services/adapters";
import { formatPrice } from "@/utils/money";
import { normalizeText } from "@/utils/text";
import StockFormModal from "./StockFormModal";
import { isLowStock, type StockForm } from "./stockForm";
import { useStockActions } from "./useStockActions";
import styles from "./AdminStockSection.module.scss";

type View = "all" | "low";

const COLUMNS: readonly Column<StockRow>[] = [
  { key: "product", label: "Producto", render: (row) => <span className={styles.product}>{row.product}</span> },
  { key: "category", label: "Categoría" },
  {
    key: "quantity",
    label: "Cantidad",
    render: (row) => (
      <span className={`${styles.quantity} ${isLowStock(row) ? styles.low : ""}`}>
        {isLowStock(row) ? <AlertTriangle size={14} aria-hidden="true" /> : null}
        {row.quantity} {row.unit.toLowerCase()}
        <span className={styles.min}>mín. {row.minQuantity}</span>
      </span>
    ),
  },
  { key: "price", label: "Precio", render: (row) => (row.price > 0 ? formatPrice(row.price) : "—") },
  { key: "lastUpdate", label: "Actualizado" },
];

/** Consumables: summary, search, low-stock filter and the add/edit form with templates. */
const AdminStockSection = () => {
  const stock = useStockActions();
  const confirm = useConfirm();

  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<StockRow | null>(null);

  const lowCount = stock.rows.filter(isLowStock).length;
  const totalValue = stock.rows.reduce((sum, row) => sum + row.price * row.quantity, 0);

  const visible = useMemo(() => {
    const needle = normalizeText(query);
    return stock.rows.filter(
      (row) =>
        (view === "all" || isLowStock(row)) &&
        (!needle || normalizeText(`${row.product} ${row.category} ${row.unit}`).includes(needle)),
    );
  }, [stock.rows, query, view]);

  const open = (row: StockRow | null) => {
    stock.clearError();
    if (row) setEditing(row);
    else setAddOpen(true);
  };

  const remove = async (row: StockRow) => {
    const accepted = await confirm({
      title: "¿Eliminar este producto?",
      message: `"${row.product}" se va a quitar del stock.`,
      confirmLabel: "Eliminar",
      tone: "danger",
    });
    if (accepted) void stock.remove(row);
  };

  return (
    <section id="stock" className={styles.section}>
      <div className={styles.stats}>
        <StatsCard label="Productos" value={stock.rows.length} icon={Boxes} />
        <StatsCard label="Stock bajo" value={lowCount} icon={AlertTriangle} warn={lowCount > 0} />
        <StatsCard label="Valor en stock" value={formatPrice(totalValue)} icon={Wallet} />
      </div>

      {stock.actionError && !addOpen && !editing ? <Alert>{stock.actionError}</Alert> : null}

      <div className={styles.panel}>
        <div className={styles.toolbar}>
          <SearchInput label="Buscar producto o categoría" value={query} onChange={setQuery} />
          <Tabs
            items={[
              { id: "all" as const, label: "Todos", count: stock.rows.length },
              { id: "low" as const, label: "Stock bajo", count: lowCount },
            ]}
            active={view}
            onChange={setView}
            label="Filtrar stock"
          />
          <Button onClick={() => open(null)} icon={<Plus size={18} strokeWidth={1.8} aria-hidden="true" />}>
            Agregar producto
          </Button>
        </div>

        <AsyncBoundary
          loading={stock.loading}
          error={stock.error}
          onRetry={stock.reload}
          empty={visible.length === 0}
          emptyMessage={
            stock.rows.length === 0
              ? "Todavía no hay productos. Agregá el primero; podés partir de una plantilla."
              : view === "low"
                ? "Nada por reponer: todo está por encima del mínimo."
                : "No hay productos que coincidan con la búsqueda."
          }
        >
          <DataTable
            columns={COLUMNS}
            data={visible}
            actions={[
              { icon: <Edit />, label: "Editar", onClick: (row) => open(row) },
              { icon: <Trash2 />, label: "Eliminar", onClick: (row) => void remove(row) },
            ]}
          />
        </AsyncBoundary>
      </div>

      <StockFormModal open={addOpen} saving={stock.saving} error={stock.actionError} onClose={() => setAddOpen(false)} onSubmit={stock.create} />
      <StockFormModal
        open={Boolean(editing)}
        initial={editing ?? undefined}
        saving={stock.saving}
        error={stock.actionError}
        onClose={() => setEditing(null)}
        onSubmit={(form: StockForm) => (editing ? stock.update(editing.id, form) : Promise.resolve(false))}
      />
    </section>
  );
};

export default AdminStockSection;
