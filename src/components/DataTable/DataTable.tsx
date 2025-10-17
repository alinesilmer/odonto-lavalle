"use client";

import type { ReactNode } from "react";
import styles from "./DataTable.module.scss";

interface Column<Row = unknown> {
  key: string;
  label: string;
  width?: string;
  render?: (value: unknown, row: Row) => ReactNode;
}

interface Action<Row = unknown> {
  icon: ReactNode;
  label: string;
  onClick: (row: Row) => void;
}

interface DataTableProps<Row = unknown> {
  columns: Column<Row>[];
  data: Row[];
  actions?: Action<Row>[];
}

const DataTable = <
  Row extends { id?: string | number } = { id?: string | number }
>({
  columns,
  data,
  actions = [],
}: DataTableProps<Row>) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={{ width: column.width }}>
                {column.label}
              </th>
            ))}
            {actions.length > 0 && <th style={{ width: "120px" }}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const key = (row as unknown as { id?: string | number }).id ?? idx;
            return (
              <tr key={key}>
                {columns.map((column) => {
                  const value = (row as unknown as Record<string, unknown>)[
                    column.key
                  ];
                  return (
                    <td key={column.key}>
                      {column.render
                        ? column.render(value, row)
                        : (value as ReactNode)}
                    </td>
                  );
                })}
                {actions.length > 0 && (
                  <td>
                    <div className={styles.actions}>
                      {actions.map((action) => (
                        <button
                          key={action.label}
                          className={styles.actionBtn}
                          onClick={() => action.onClick(row)}
                          aria-label={action.label}
                          title={action.label}
                          type="button"
                        >
                          {action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
