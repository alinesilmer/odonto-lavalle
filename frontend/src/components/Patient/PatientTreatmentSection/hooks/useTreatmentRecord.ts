import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { MedicalCondition, Medication, TreatmentDto, UpdateTreatmentRequest } from "@odonto/shared";
import { useAuth } from "@/auth/useAuth";
import { useApi } from "@/hooks/useApi";
import { treatmentApi } from "@/services";
import { ApiRequestError } from "@/services/http";

/**
 * The patient's treatment document: conditions, medication, odontogram, plan,
 * visits and progress. Each save sends only the part that changed, shows it
 * right away, and rolls back if the server refuses it.
 */
export function useTreatmentRecord(isAdmin: boolean) {
  const { user } = useAuth();
  const params = useParams<{ id?: string }>();

  // Admins open a specific patient from the route; patients read their own record.
  const patientId = isAdmin ? (params.id ?? "") : (user?.uid ?? "");

  const { data, loading, error, reload } = useApi(
    () => (patientId ? treatmentApi.get(patientId) : Promise.reject(new Error("missing patient"))),
    [patientId],
  );

  const [record, setRecord] = useState<TreatmentDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (data) setRecord(data);
  }, [data]);

  const persist = useCallback(
    async (patch: UpdateTreatmentRequest) => {
      if (!patientId || !record) return false;
      const previous = record;
      setRecord({ ...record, ...patch } as TreatmentDto);
      setSaving(true);
      setSaveError(null);
      try {
        await treatmentApi.update(patientId, patch);
        return true;
      } catch (err) {
        setRecord(previous);
        setSaveError(err instanceof ApiRequestError ? err.message : "No pudimos guardar el tratamiento");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [patientId, record],
  );

  const saveConditions = useCallback(
    (draft: MedicalCondition[]) => persist({ conditions: draft.filter((row) => row.name.trim() !== "") }),
    [persist],
  );

  const saveMedications = useCallback(
    (draft: Medication[]) => persist({ medications: draft.filter((row) => row.name.trim() !== "") }),
    [persist],
  );

  return {
    patientId,
    treatment: record,
    loading: loading || (!record && !error),
    error,
    reload,
    conditions: record?.conditions ?? [],
    medications: record?.medications ?? [],
    saving,
    saveError,
    persist,
    saveConditions,
    saveMedications,
  };
}
