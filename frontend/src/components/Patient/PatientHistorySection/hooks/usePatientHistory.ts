import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { useApi } from "@/hooks/useApi";
import { historyApi } from "@/services";
import { useWriteAction } from "@/hooks/useWriteAction";
import { toHistoryEntries } from "../mapRecords";
import type { NewHistoryEntry } from "../types";

export function usePatientHistory(isAdmin: boolean, patientName?: string) {
  const { user } = useAuth();
  const params = useParams<{ id?: string }>();

  // An admin reads the patient from the route; a patient always reads their own.
  const patientId = isAdmin ? (params.id ?? "") : (user?.uid ?? "");
  const displayName = patientName ?? (isAdmin ? "Paciente" : (user?.fullName ?? "Paciente"));

  const { data, loading, error, reload } = useApi(
    () => (patientId ? historyApi.list(patientId) : Promise.resolve({ items: [] })),
    [patientId],
  );

  const { saving, actionError: saveError, runWrite } = useWriteAction(reload);

  const entries = useMemo(() => toHistoryEntries(data?.items ?? []), [data]);

  const addEntry = useCallback(
    async (entry: NewHistoryEntry) => {
      if (!patientId) return false;

      return runWrite(
        () =>
          historyApi.create(patientId, {
          date: entry.date,
          title: entry.title,
          diagnosis: entry.diagnosis || undefined,
          medication: entry.medication || undefined,
          notes: entry.notes || undefined,
        }),
        "No pudimos guardar el registro",
      );
    },
    [patientId, runWrite],
  );

  return { displayName, entries, loading, error, reload, saving, saveError, addEntry };
}
