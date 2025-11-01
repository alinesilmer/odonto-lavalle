"use client"

import { useState } from "react"
import { Eye, Edit, Trash2 } from "lucide-react"
import DataTable from "@/components/DataTable/DataTable"
import Button from "@/components/UI/Button/Button"
import { adminAppointments } from "../../../data/dashboardData"
import styles from "./AdminAppointmentsSection.module.scss"

const AdminAppointmentsSection = () => {
  const [filterMonth, setFilterMonth] = useState("Todos")

  const appointmentColumns = [
    { key: "date", label: "Fecha" },
    { key: "time", label: "Hora" },
    { key: "reason", label: "Motivo" },
    { key: "insurance", label: "Obra Social" },
    { key: "status", label: "Estado" },
  ]

  return (
    <section id="appointments" className={styles.section}>
      <h2>TURNERO</h2>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Filtrar Turnos</label>
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            <option>Todos</option>
            <option>Enero</option>
            <option>Febrero</option>
            <option>Marzo</option>
          </select>
        </div>
        <Button variant="primary">Agregar Turno</Button>
      </div>

      <DataTable
        columns={appointmentColumns}
        data={adminAppointments}
        actions={[
          { icon: <Eye />, label: "Ver", onClick: (row) => console.log("View:", row) },
          { icon: <Edit />, label: "Editar", onClick: (row) => console.log("Edit:", row) },
          { icon: <Trash2 />, label: "Eliminar", onClick: (row) => console.log("Delete:", row) },
        ]}
      />
    </section>
  )
}

export default AdminAppointmentsSection
