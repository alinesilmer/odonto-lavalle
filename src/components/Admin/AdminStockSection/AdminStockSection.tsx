import { Edit, Trash2 } from "lucide-react"
import DataTable from "@/components/DataTable/DataTable"
import { adminStock } from "../../../data/dashboardData"
import styles from "./AdminStockSection.module.scss"

const AdminStockSection = () => {
  const stockColumns = [
    { key: "product", label: "Producto" },
    { key: "category", label: "Categoría" },
    { key: "quantity", label: "Cantidad" },
    { key: "unit", label: "Unidad" },
    { key: "price", label: "Precio" },
  ]

  return (
    <section id="stock" className={styles.section}>
      <h2>GESTIÓN DE STOCK</h2>
      <DataTable
        columns={stockColumns}
        data={adminStock}
        actions={[
          { icon: <Edit />, label: "Editar", onClick: (row) => console.log("[v0] Edit:", row) },
          { icon: <Trash2 />, label: "Eliminar", onClick: (row) => console.log("[v0] Delete:", row) },
        ]}
      />
    </section>
  )
}

export default AdminStockSection
