import { motion } from "framer-motion";
import { CalendarDays, CalendarRange, TrendingUp, Users } from "lucide-react";
import type { AppointmentStatus } from "@odonto/shared";
import { APPOINTMENT_STATUSES } from "@odonto/shared";
import MonthChart from "@/components/Admin/charts/MonthChart";
import StatsCard from "@/components/StatsCard/StatsCard";
import AsyncBoundary from "@/components/UI/AsyncBoundary/AsyncBoundary";
import BarList from "@/components/UI/BarList/BarList";
import Panel from "@/components/UI/Panel/Panel";
import StatusChip from "@/components/UI/StatusChip/StatusChip";
import { useApi } from "@/hooks/useApi";
import { statsApi } from "@/services";
import { riseOnLoad as rise } from "@/utils/editorialMotion";
import styles from "./AdminChartsSection.module.scss";

const isStatus = (value: string): value is AppointmentStatus =>
  (APPOINTMENT_STATUSES as readonly string[]).includes(value);

const AdminChartsSection = () => {
  const summary = useApi(() => statsApi.summary(), []);
  const charts = useApi(() => statsApi.charts(), []);

  const yearTotal = (charts.data?.appointmentsByMonth ?? []).reduce((sum, point) => sum + point.value, 0);

  const kpis = summary.data
    ? [
        { label: "Turnos hoy", value: summary.data.appointmentsToday, icon: CalendarDays },
        { label: "Turnos este mes", value: summary.data.appointmentsThisMonth, icon: CalendarRange },
        { label: "Turnos en el año", value: yearTotal, icon: TrendingUp },
        { label: "Pacientes activos", value: summary.data.activePatients, icon: Users },
      ]
    : [];

  const byStatus = (charts.data?.appointmentsByStatus ?? []).map((point) => ({
    key: point.label,
    label: isStatus(point.label) ? <StatusChip status={point.label} /> : point.label,
    value: point.value,
  }));

  const reasons = (charts.data?.topReasons ?? []).map((point) => ({
    key: point.label,
    label: point.label,
    value: point.value,
  }));

  return (
    <section className={styles.section}>
      <AsyncBoundary loading={summary.loading} error={summary.error} onRetry={summary.reload}>
        <div className={styles.kpis}>
          {kpis.map((kpi, i) => (
            <motion.div key={kpi.label} {...rise(i)}>
              <StatsCard {...kpi} />
            </motion.div>
          ))}
        </div>
      </AsyncBoundary>

      <AsyncBoundary loading={charts.loading} error={charts.error} onRetry={charts.reload}>
        <div className={styles.grid}>
          <motion.div className={styles.wide} {...rise(4)}>
            <MonthChart
              points={charts.data?.appointmentsByMonth ?? []}
              months={12}
              eyebrow={`Este año · ${yearTotal} turnos`}
              tall
            />
          </motion.div>

          <motion.div {...rise(5)}>
            <Panel eyebrow="Distribución" title="Turnos por estado">
              <BarList items={byStatus} showShare />
            </Panel>
          </motion.div>

          <motion.div {...rise(6)}>
            <Panel eyebrow="Top 5" title="Motivos más frecuentes">
              <BarList items={reasons} />
            </Panel>
          </motion.div>
        </div>
      </AsyncBoundary>
    </section>
  );
};

export default AdminChartsSection;
