"use client"

import type { ReactNode } from "react"
import styles from "./DataTable.module.scss"

interface Column {
  key: string
  label: string
}

interface Action {
  icon: ReactNode
  label: string
  onClick: (row: any) => void
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  actions?: Action[]
}

const DataTable = ({ columns, data, actions }: DataTableProps) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions && actions.length > 0 && <th className={styles.actionsHeader}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col.key}>{row[col.key]}</td>
              ))}
              {actions && actions.length > 0 && (
                <td className={styles.actionsCell}>
                  <div className={styles.actions}>
                    {actions.map((action, actionIdx) => (
                      <button
                        key={actionIdx}
                        className={styles.actionButton}
                        onClick={() => action.onClick(row)}
                        title={action.label}
                      >
                        {action.icon}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
