"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, BarChart3, Bell, Eye, Edit, Trash2 } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import StatsCard from "../../components/StatsCard/StatsCard";
import DataTable from "../../components/DataTable/DataTable";
import Button from "../../components/Button/Button";
import {
  adminStats,
  adminAppointments,
  adminPatients,
  adminStock,
  adminReminders,
} from "../../data/dashboardData";
import styles from "./AdminDashboard.module.scss";

const colorByIcon: Record<string, "primary" | "info" | "success" | "danger"> = {
  users: "primary",
  calendar: "info",
  dollar: "success",
  x: "danger",
};

const AdminDashboard = () => {
  const [filterMonth, setFilterMonth] = useState("Todos");

  // Columns must match your data shape
  const appointmentColumns = [
    { key: "date", label: "Fecha" },
    { key: "time", label: "Hora" },
    { key: "reason", label: "Motivo" },
    { key: "insurance", label: "Obra Social" },
    { key: "status", label: "Estado" },
  ];

  const patientColumns = [
    { key: "name", label: "Nombre" },
    { key: "dni", label: "DNI" },
    { key: "phone", label: "Teléfono" },
    { key: "insurance", label: "Obra Social" },
    { key: "lastVisit", label: "Última Visita" },
  ];

  const stockColumns = [
    { key: "product", label: "Producto" },
    { key: "category", label: "Categoría" },
    { key: "quantity", label: "Cantidad" },
    { key: "unit", label: "Unidad" },
    { key: "price", label: "Precio" },
  ];

  const revenueStat = adminStats.find((s) => s.icon === "dollar");
  const revenueText =
    typeof revenueStat?.value === "number"
      ? `$${revenueStat.value.toLocaleString()}`
      : String(revenueStat?.value ?? "-");

  return (
    <DashboardLayout userRole="admin" userType="admin" userName="Administrador">
      <div className={styles.dashboard}>
        <section className={styles.statsSection}>
          <h2>TABLERO GENERAL</h2>
          <div className={styles.statsGrid}>
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

        <section className={styles.appointmentsSection}>
          <h2>TURNERO</h2>
          <div className={styles.appointmentFilters}>
            <div className={styles.filterGroup}>
              <label>Filtrar Turnos</label>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              >
                <option>Todos</option>
                <option>Enero</option>
                <option>Febrero</option>
                <option>Marzo</option>
              </select>
            </div>
            <Button variant="primary">Solicitar Turno</Button>
          </div>

          <DataTable
            columns={appointmentColumns}
            data={adminAppointments}
            actions={[
              {
                icon: <Eye />,
                label: "Ver",
                onClick: (row) => console.log("[v0] View:", row),
              },
              {
                icon: <Edit />,
                label: "Editar",
                onClick: (row) => console.log("[v0] Edit:", row),
              },
              {
                icon: <Trash2 />,
                label: "Eliminar",
                onClick: (row) => console.log("[v0] Delete:", row),
              },
            ]}
          />
        </section>

        <section className={styles.patientsSection}>
          <h2>LISTA DE USUARIOS</h2>
          <DataTable
            columns={patientColumns}
            data={adminPatients}
            actions={[
              {
                icon: <Eye />,
                label: "Ver",
                onClick: (row) => console.log("[v0] View:", row),
              },
              {
                icon: <Edit />,
                label: "Editar",
                onClick: (row) => console.log("[v0] Edit:", row),
              },
              {
                icon: <Trash2 />,
                label: "Eliminar",
                onClick: (row) => console.log("[v0] Delete:", row),
              },
            ]}
          />
        </section>

        <section className={styles.stockSection}>
          <h2>GESTIÓN DE STOCK</h2>
          <DataTable
            columns={stockColumns}
            data={adminStock}
            actions={[
              {
                icon: <Edit />,
                label: "Editar",
                onClick: (row) => console.log("[v0] Edit:", row),
              },
              {
                icon: <Trash2 />,
                label: "Eliminar",
                onClick: (row) => console.log("[v0] Delete:", row),
              },
            ]}
          />
        </section>

        <section className={styles.statsChartsSection}>
          <h2>ESTADÍSTICAS</h2>
          <div className={styles.chartsGrid}>
            <motion.div
              className={styles.chartCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.chartHeader}>
                <BarChart3 />
                <h3>Turnos por Mes</h3>
              </div>
              <div className={styles.chartPlaceholder}>
                <div className={styles.bars}>
                  {[120, 150, 130, 180, 160, 140].map((height, idx) => (
                    <div key={idx} className={styles.bar}>
                      <div
                        className={styles.barFill}
                        style={{ height: `${height}px` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className={styles.chartCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className={styles.chartHeader}>
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

        <section className={styles.remindersSection}>
          <h2>RECORDATORIOS</h2>
          <div className={styles.remindersList}>
            {adminReminders.map((reminder) => (
              <motion.div
                key={reminder.id}
                className={styles.reminderCard}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className={styles.reminderIcon}>
                  <Bell />
                </div>
                <div className={styles.reminderContent}>
                  <h4>{reminder.title}</h4>
                  <p>{reminder.description}</p>
                  {/* your data has "time", not "date" */}
                  <span className={styles.reminderDate}>{reminder.time}</span>
                </div>
                <div className={styles.reminderActions}>
                  <Button variant="secondary" size="small">
                    Filtrar
                  </Button>
                  <Button variant="primary" size="small">
                    Editar
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
