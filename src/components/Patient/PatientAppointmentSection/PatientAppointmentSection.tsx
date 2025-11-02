"use client";

import { useMemo } from "react";
import { Eye, Download, X } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import StatsCard from "@/components/StatsCard/StatsCard";
import DataTable from "@/components/DataTable/DataTable";
import { patientAppointments, patientTreatment } from "../../../data/dashboardData";
import styles from "./PatientAppointmentSection.module.scss";

const cols = [
  { key: "date", label: "Fecha" },
  { key: "time", label: "Hora" },
  { key: "reason", label: "Motivo" },
  { key: "insurance", label: "Obra Social" },
  { key: "payment", label: "Pago" },
  { key: "status", label: "Estado" },
];

const PatientAppointments = () => {
  const stats = useMemo(() => {
    const completed = patientAppointments.filter(a => a.status === "Completado").length;
    const pending = patientAppointments.filter(a => a.status === "Pendiente").length;
    const cancelled = patientAppointments.filter(a => a.status === "Cancelado").length;
    return { completed, pending, cancelled };
  }, []);

  return (
    <DashboardLayout userType="patient" userRole="patient" userName={patientTreatment.patientName ?? "Usuario"}>
      <div className={styles.wrap}>
        <section className={styles.section}>
          <h2>MIS TURNOS</h2>
          <div className={styles.stats}>
            <StatsCard icon="calendar" value={stats.completed} label="Completados" color="success" />
            <StatsCard icon="calendar" value={stats.pending} label="Pendientes" color="info" />
            <StatsCard icon="calendar" value={stats.cancelled} label="Cancelados" color="danger" />
          </div>
          <DataTable
            columns={cols}
            data={patientAppointments}
            actions={[
              { icon: <Eye />, label: "Ver", onClick: (row) => console.log("View", row) },
              { icon: <Download />, label: "Descargar", onClick: (row) => console.log("Download", row) },
              { icon: <X />, label: "Cancelar", onClick: (row) => console.log("Cancel", row) },
            ]}
            selectable={false}
          />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default PatientAppointments;
