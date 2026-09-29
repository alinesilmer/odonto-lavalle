import { useMemo, useState } from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import { APPOINTMENT_STATUSES, MAX_PAGE_SIZE } from "@odonto/shared";
import DataTable, { type Column } from "@/components/DataTable/DataTable";
import Alert from "@/components/UI/Alert/Alert";
import AsyncBoundary from "@/components/UI/AsyncBoundary/AsyncBoundary";
import { useConfirm } from "@/components/UI/Confirm/confirmContext";
import StatusChip from "@/components/UI/StatusChip/StatusChip";
import { useApi } from "@/hooks/useApi";
import { appointmentsApi } from "@/services";
import { toAppointmentRow, type AppointmentRow } from "@/services/adapters";
import FilterToolbar from "./FilterToolbar";
import { EMPTY_FILTERS, filterAppointments, type AppointmentFilters } from "./filters";
import { useAppointmentActions } from "./hooks/useAppointmentActions";
import AddAppointmentModal from "./modals/AddAppointmentModal";
import EditAppointmentModal from "./modals/EditAppointmentModal";
import FiltersModal from "./modals/FiltersModal";
import ViewAppointmentModal from "./modals/ViewAppointmentModal";
import styles from "./AdminAppointmentsSection.module.scss";

const COLUMNS: readonly Column<AppointmentRow>[] = [
  { key: "date", label: "Fecha" },
  { key: "time", label: "Hora" },
  { key: "patientName", label: "Paciente", render: (row) => <strong className={styles.patient}>{row.patientName}</strong> },
  { key: "reason", label: "Motivo" },
  { key: "insurance", label: "Obra social" },
  { key: "status", label: "Estado", render: (row) => <StatusChip status={row.rawStatus} /> },
];

const AdminAppointmentsSection = () => {
  const { data, loading, error, reload } = useApi(() => appointmentsApi.list({ pageSize: MAX_PAGE_SIZE }), []);
  const rows = useMemo(
    () =>
      (data?.items ?? [])
        .map(toAppointmentRow)
        .sort((a, b) => b.startsAt.localeCompare(a.startsAt)),
    [data],
  );

  const [filters, setFilters] = useState<AppointmentFilters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [viewRow, setViewRow] = useState<AppointmentRow | null>(null);
  const [editRow, setEditRow] = useState<AppointmentRow | null>(null);

  const { saving, actionError, runWrite, create } = useAppointmentActions(reload);
  const confirm = useConfirm();

  const visible = useMemo(() => filterAppointments(rows, filters), [rows, filters]);

  /** Each status tab's count, with every other filter applied. */
  const counts = useMemo(() => {
    const base = filterAppointments(rows, { ...filters, status: "all" });
    return {
      all: base.length,
      ...Object.fromEntries(APPOINTMENT_STATUSES.map((s) => [s, base.filter((r) => r.rawStatus === s).length])),
    } as Record<AppointmentFilters["status"], number>;
  }, [rows, filters]);

  return (
    <section id="appointments" className={styles.section}>
      {actionError && !addOpen ? <Alert>{actionError}</Alert> : null}

      <AsyncBoundary loading={loading} error={error} onRetry={reload}>
        <FilterToolbar
          filters={filters}
          onChange={setFilters}
          counts={counts}
          onOpenFilters={() => setFiltersOpen(true)}
          onAdd={() => setAddOpen(true)}
        />

        <p className={styles.resultCount}>
          {visible.length} {visible.length === 1 ? "turno" : "turnos"}
        </p>

        <DataTable
          columns={COLUMNS}
          data={visible}
          actions={[
            { icon: <Eye />, label: "Ver", onClick: setViewRow },
            { icon: <Edit />, label: "Editar", onClick: setEditRow },
            {
              icon: <Trash2 />,
              label: "Eliminar",
              onClick: async (row) => {
                const accepted = await confirm({
                  title: "¿Eliminar este turno?",
                  message: `El turno de ${row.patientName} del ${row.date} a las ${row.time} se va a borrar.`,
                  confirmLabel: "Eliminar turno",
                  tone: "danger",
                });
                if (accepted) void runWrite(() => appointmentsApi.remove(row.id), "No pudimos eliminar el turno");
              },
            },
          ]}
        />

        <FiltersModal
          open={filtersOpen}
          filters={filters}
          onChange={setFilters}
          onClose={() => setFiltersOpen(false)}
        />
        <AddAppointmentModal
          open={addOpen}
          saving={saving}
          onClose={() => setAddOpen(false)}
          error={actionError}
          onCreate={create}
        />
        <ViewAppointmentModal row={viewRow} onClose={() => setViewRow(null)} />
        <EditAppointmentModal
          row={editRow}
          saving={saving}
          onClose={() => setEditRow(null)}
          onSave={(id, patch) =>
            runWrite(() => appointmentsApi.update(id, patch), "No pudimos guardar el turno")
          }
        />
      </AsyncBoundary>
    </section>
  );
};

export default AdminAppointmentsSection;
