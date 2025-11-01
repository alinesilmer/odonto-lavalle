import StatsCard from "@/components/StatsCard/StatsCard"
import { adminStats } from "../../../data/dashboardData"
import styles from "./AdminStatsSection.module.scss"

const colorByIcon: Record<string, "primary" | "info" | "success" | "danger"> = {
  users: "primary",
  calendar: "info",
  dollar: "success",
  x: "danger",
}

const AdminStatsSection = () => {
  return (
    <section id="stats" className={styles.section}>
      <div className={styles.grid}>
        {adminStats.map((s, i) => (
          <StatsCard
            key={`${s.label}-${i}`}
            icon={s.icon as "users" | "calendar" | "dollar" | "x"}
            value={s.value}
            label={s.label}
            color={colorByIcon[s.icon] || "primary"}
          />
        ))}
      </div>
    </section>
  )
}

export default AdminStatsSection
