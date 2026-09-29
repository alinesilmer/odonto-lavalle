import { useState } from "react";
import { Ban, Eye, Pencil, X } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import DataTable from "@/components/DataTable/DataTable";
import AsyncBoundary from "@/components/UI/AsyncBoundary/AsyncBoundary";
import { useAuth } from "@/auth/useAuth";
import type { AppointmentRow } from "@/services/adapters";
import AppointmentStats from "./AppointmentStats";
import { usePatientAppointments } from "./hooks/usePatientAppointments";
import CancelModal from "./modals/CancelModal";
import EditModal from "./modals/EditModal";
import ViewModal from "./modals/ViewModal";
import styles from "./PatientAppointmentSection.module.scss";

const COLUMNS = [
  { key: "date", label: "Fecha" },
  { key: "time", label: "Hora" },
  { key: "reason", label: "Motivo" },
  { key: "payment", label: "Pago" },
  { key: "status", label: "Estado" },
] as const;

const PatientAppointments = () => {
  const { user } = useAuth();
  const appointments = usePatientAppointments();

  const [selected, setSelected] = useState<AppointmentRow[]>([]);
  const [cancelIds, setCancelIds] = useState<string[]>([]);
  const [viewRow, setViewRow] = useState<AppointmentRow | null>(null);
  const [editRow, setEditRow] = useState<AppointmentRow | null>(null);

  const confirmCancel = async () => {
    if (await appointments.cancel(cancelIds)) {
      setCancelIds([]);
      setSelected([]);
    }
  };

  return (
    <DashboardLayout userType="patient" userRole="patient" userName={user?.fullName ?? "Usuario"}>
      <AsyncBoundary
        loading={appointments.loading}
        error={appointments.error}
        onRetry={appointments.reload}
      >
        <div className={styles.page}>
          {appointments.actionError ? (
            <p className={styles.actionError} role="alert">
              {appointments.actionError}
            </p>
          ) : null}

          <div className={styles.headerRow}>
            <button
              type="button"
              className={`${styles.cancelBulkBtn} ${selected.length === 0 ? styles.disabled : ""}`}
              onClick={() => setCancelIds(selected.map((row) => row.id))}
              disabled={selected.length === 0}
              title={selected.length === 0 ? "Selecciona uno o más turnos" : "Cancelar turno(s)"}
            >
              <Ban size={20} aria-hidden="true" />
              <span>Cancelar Turno</span>
            </button>
          </div>

          <AppointmentStats {...appointments.stats} />

          <div className={styles.tableCard}>
            <DataTable
              columns={COLUMNS}
              data={appointments.rows}
              selectable
              onSelectionChange={setSelected}
              actions={[
                { icon: <Eye />, label: "Ver", onClick: setViewRow },
                { icon: <Pencil />, label: "Editar", onClick: setEditRow },
                { icon: <X />, label: "Cancelar", onClick: (row) => setCancelIds([row.id]) },
              ]}
            />
          </div>

          <ViewModal row={viewRow} onClose={() => setViewRow(null)} />
          <EditModal
            row={editRow}
            saving={appointments.saving}
            onClose={() => setEditRow(null)}
            onSave={appointments.update}
          />
          <CancelModal
            ids={cancelIds}
            saving={appointments.saving}
            onClose={() => setCancelIds([])}
            onConfirm={() => void confirmCancel()}
          />
        </div>
      </AsyncBoundary>
    </DashboardLayout>
  );
};

export default PatientAppointments;
