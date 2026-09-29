import { useCallback, useMemo, useState } from "react";
import type { UpdateAppointmentRequest } from "@odonto/shared";
import { useApi } from "@/hooks/useApi";
import { appointmentsApi } from "@/services";
import { toAppointmentRow, type AppointmentRow } from "@/services/adapters";
import { ApiRequestError } from "@/services/http";

export function usePatientAppointments() {
  const { data, loading, error, reload } = useApi(
    () => appointmentsApi.list({ pageSize: 100 }),
    [],
  );

  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const rows = useMemo(() => (data?.items ?? []).map(toAppointmentRow), [data]);

  // Counted from the wire status, not the translated label, so relabelling the
  // UI can never silently break the totals.
  const stats = useMemo(
    () => ({
      completed: rows.filter((row) => row.rawStatus === "completed").length,
      pending: rows.filter((row) => row.rawStatus === "pending").length,
      cancelled: rows.filter((row) => row.rawStatus === "cancelled").length,
    }),
    [rows],
  );

  const run = useCallback(
    async (write: () => Promise<unknown>, fallback: string) => {
      setSaving(true);
      setActionError(null);
      try {
        await write();
        reload();
        return true;
      } catch (err) {
        setActionError(err instanceof ApiRequestError ? err.message : fallback);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [reload],
  );

  return {
    rows,
    stats,
    loading,
    error,
    reload,
    saving,
    actionError,
    /** The API only lets a patient move their own turno to "cancelled". */
    cancel: useCallback(
      (ids: string[]) =>
        run(
          () => Promise.all(ids.map((id) => appointmentsApi.cancel(id))),
          "No pudimos cancelar el turno",
        ),
      [run],
    ),
    update: useCallback(
      (id: string, patch: UpdateAppointmentRequest) =>
        run(() => appointmentsApi.update(id, patch), "No pudimos guardar los cambios"),
      [run],
    ),
  };
}

export type { AppointmentRow };
