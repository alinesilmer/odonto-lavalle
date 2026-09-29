import { motion } from "framer-motion";
import { AlertTriangle, CalendarDays, CalendarRange, Users } from "lucide-react";
import StatsCard from "@/components/StatsCard/StatsCard";
import AsyncBoundary from "@/components/UI/AsyncBoundary/AsyncBoundary";
import Button from "@/components/UI/Button/Button";
import { useAuth } from "@/auth/useAuth";
import { ROUTES } from "@/constants";
import { ADMIN_QUICK_ACTIONS } from "@/data/dashboardHome";
import { useApi } from "@/hooks/useApi";
import { statsApi } from "@/services";
import { riseOnLoad as rise } from "@/utils/editorialMotion";
import MonthChart from "@/components/Admin/charts/MonthChart";
import TodayAgenda from "./TodayAgenda";
import styles from "./AdminHome.module.scss";

const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? "Buen día" : hour < 20 ? "Buenas tardes" : "Buenas noches";
};

const AdminHome = () => {
  const { user } = useAuth();
  const { data: stats, loading, error, reload } = useApi(() => statsApi.summary(), []);
  const charts = useApi(() => statsApi.charts(), []);
  const firstName = user?.fullName.split(" ")[0] || "equipo";

  const kpis = stats
    ? [
        { label: "Turnos hoy", value: stats.appointmentsToday, icon: CalendarDays, to: ROUTES.admin.appointments },
        { label: "Turnos este mes", value: stats.appointmentsThisMonth, icon: CalendarRange, to: ROUTES.admin.appointments },
        { label: "Pacientes activos", value: stats.activePatients, icon: Users, to: ROUTES.admin.patients },
        { label: "Stock bajo", value: stats.lowStockItems, icon: AlertTriangle, to: ROUTES.admin.stock, warn: stats.lowStockItems > 0 },
      ]
    : [];

  return (
    <div className={styles.page}>
      <motion.section className={styles.welcome} {...rise(0)}>
        <div>
          <h2 className={styles.greeting}>
            {greeting()}, <em>{firstName}.</em>
          </h2>
          <p className={styles.lead}>Esto es lo que está pasando hoy en el consultorio.</p>
        </div>
        <nav className={styles.quick} aria-label="Accesos rápidos">
          {ADMIN_QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
            <Button key={to} to={to} variant="secondary" size="small" icon={<Icon size={16} strokeWidth={1.7} aria-hidden="true" />}>
              {label}
            </Button>
          ))}
        </nav>
      </motion.section>

      <AsyncBoundary loading={loading} error={error} onRetry={reload}>
        <div className={styles.kpis}>
          {kpis.map((kpi, i) => (
            <motion.div key={kpi.label} {...rise(i + 1)}>
              <StatsCard {...kpi} />
            </motion.div>
          ))}
        </div>
      </AsyncBoundary>

      <div className={styles.columns}>
        <motion.div {...rise(5)}>
          <TodayAgenda />
        </motion.div>
        <motion.div {...rise(6)}>
          <AsyncBoundary loading={charts.loading} error={charts.error} onRetry={charts.reload}>
            <MonthChart points={charts.data?.appointmentsByMonth ?? []} />
          </AsyncBoundary>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminHome;
