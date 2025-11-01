"use client"

import { motion } from "framer-motion"
import { BarChart3, DollarSign } from "lucide-react"
import { adminStats } from "../../../data/dashboardData"
import styles from "./AdminChartsSection.module.scss"

const AdminChartsSection = () => {
  const revenueStat = adminStats.find((s) => s.icon === "dollar")
  const revenueText =
    typeof revenueStat?.value === "number"
      ? `$${revenueStat.value.toLocaleString()}`
      : String(revenueStat?.value ?? "-")

  return (
    <section id="charts" className={styles.section}>
      <h2>ESTADÍSTICAS</h2>
      <div className={styles.grid}>
        <motion.div className={styles.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.cardHeader}>
            <BarChart3 />
            <h3>Turnos por Mes</h3>
          </div>
          <div className={styles.chartPlaceholder}>
            <div className={styles.bars}>
              {[120, 150, 130, 180, 160, 140].map((height, idx) => (
                <div key={idx} className={styles.bar}>
                  <div className={styles.barFill} style={{ height: `${height}px` }} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles.cardHeader}>
            <DollarSign />
            <h3>Ingresos Mensuales</h3>
          </div>
          <div className={styles.revenueDisplay}>
            <h2>{revenueText}</h2>
            <p className={styles.growth}>+12% vs mes anterior</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AdminChartsSection
