import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useResponsiveValue } from "@/hooks/useResponsiveValue";
import Pagination from "./Pagination";
import styles from "./DataTable.module.scss";

export interface Column<T> {
  key: keyof T & string;
  label: string;
  /** Custom cell content (e.g. a status chip); defaults to the raw value. */
  render?: (row: T) => ReactNode;
}

export interface RowAction<T> {
  icon: ReactNode;
  label: string;
  onClick: (row: T) => void;
}

export interface DataTableProps<T extends object> {
  columns: readonly Column<T>[];
  data: T[];
  actions?: readonly RowAction<T>[];
  selectable?: boolean;
  onSelectionChange?: (rows: T[]) => void;
}

/** Fewer rows per page on smaller screens, so the table never needs scrolling. */
const PAGE_SIZES = [
  { upTo: 640, value: 4 },
  { upTo: 768, value: 5 },
];
const DEFAULT_PAGE_SIZE = 8;

function DataTable<T extends object>({
  columns,
  data,
  actions,
  selectable = false,
  onSelectionChange,
}: DataTableProps<T>) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const pageSize = useResponsiveValue(PAGE_SIZES, DEFAULT_PAGE_SIZE);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const startIndex = (page - 1) * pageSize;

  const pageData = useMemo(
    () => data.slice(startIndex, startIndex + pageSize),
    [data, startIndex, pageSize],
  );
  const pageIndices = useMemo(
    () => pageData.map((_, i) => startIndex + i),
    [pageData, startIndex],
  );

  const allSelected = pageIndices.length > 0 && pageIndices.every((i) => selected.has(i));
  const someSelected = !allSelected && pageIndices.some((i) => selected.has(i));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const commitSelection = (next: Set<number>) => {
    setSelected(next);
    onSelectionChange?.(Array.from(next).map((i) => data[i]).filter(Boolean));
  };

  const toggleAll = () => {
    const next = new Set(selected);
    pageIndices.forEach((i) => (allSelected ? next.delete(i) : next.add(i)));
    commitSelection(next);
  };

  const toggleOne = (index: number) => {
    const next = new Set(selected);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    commitSelection(next);
  };

  const hasActions = Boolean(actions?.length);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {selectable ? (
              <th className={styles.selectHeader}>
                <label className={styles.checkboxWrap}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleAll}
                    aria-label="Seleccionar página"
                  />
                  <span />
                </label>
              </th>
            ) : null}

            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}

            {hasActions ? <th className={styles.actionsHeader}>Acciones</th> : null}
          </tr>
        </thead>

        <tbody>
          {pageData.map((row, i) => {
            const index = startIndex + i;

            return (
              <tr key={index}>
                {selectable ? (
                  <td className={styles.selectCell}>
                    <label className={styles.checkboxWrap}>
                      <input
                        type="checkbox"
                        checked={selected.has(index)}
                        onChange={() => toggleOne(index)}
                        aria-label="Seleccionar fila"
                      />
                      <span />
                    </label>
                  </td>
                ) : null}

                {columns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(row) : (row[column.key] as ReactNode)}</td>
                ))}

                {hasActions ? (
                  <td className={styles.actionsCell}>
                    <div className={styles.actions}>
                      {actions?.map((action) => (
                        <button
                          key={action.label}
                          type="button"
                          className={styles.actionButton}
                          onClick={() => action.onClick(row)}
                          title={action.label}
                          aria-label={action.label}
                        >
                          {action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

export default DataTable;
