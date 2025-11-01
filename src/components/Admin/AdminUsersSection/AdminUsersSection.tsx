import { Eye, Edit, Trash2 } from "lucide-react"
import DataTable from "../../DataTable/DataTable"
import { adminPatients } from "../../../data/dashboardData"
import styles from "./AdminUsersSection.module.scss"

const AdminUsersSection = () => {
  const patientColumns = [
    { key: "name", label: "Nombre" },
    { key: "dni", label: "DNI" },
    { key: "phone", label: "Teléfono" },
    { key: "insurance", label: "Obra Social" },
    { key: "lastVisit", label: "Última Visita" },
  ]

  return (
    <section id="users" className={styles.section}>
      <h2>LISTA DE USUARIOS</h2>
      <DataTable
        columns={patientColumns}
        data={adminPatients}
        actions={[
          { icon: <Eye />, label: "Ver", onClick: (row) => console.log("[v0] View:", row) },
          { icon: <Edit />, label: "Editar", onClick: (row) => console.log("[v0] Edit:", row) },
          { icon: <Trash2 />, label: "Eliminar", onClick: (row) => console.log("[v0] Delete:", row) },
        ]}
      />
    </section>
  )
}

export default AdminUsersSection
