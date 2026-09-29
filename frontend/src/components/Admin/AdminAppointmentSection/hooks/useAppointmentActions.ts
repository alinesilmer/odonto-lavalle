import { useCallback } from "react";
import { useWriteAction } from "@/hooks/useWriteAction";
import { appointmentsApi, patientsApi } from "@/services";
import { toApiTimestamp } from "@/utils/clinicTime";
import { ApiRequestError } from "@/services/http";

export interface NewAppointment {
  date: string;
  time: string;
  patient: string;
  /** Set when a patient was picked from the suggestions. */
  patientId?: string;
  reason: string;
}

export const EMPTY_APPOINTMENT: NewAppointment = { date: "", time: "", patient: "", reason: "" };

export function useAppointmentActions(reload: () => void) {
  const { saving, actionError, setActionError, runWrite } = useWriteAction(reload);

  /** The add form takes a patient by name or DNI, so it is resolved before booking. */
  const create = useCallback(
    async (form: NewAppointment) => {
      const term = form.patient.trim();
      if (!term || !form.date || !form.time || !form.reason.trim()) {
        setActionError("Completá paciente, fecha, hora y motivo");
        return false;
      }

      return runWrite(async () => {
        // A patient picked from the suggestions is used as is; typed text is looked up.
        let patientId = form.patientId;
        if (!patientId) {
          const matches = await patientsApi.list({ search: term, pageSize: 2 });
          if (matches.items.length === 0) throw new ApiRequestError(404, "not_found", `No encontramos un paciente que coincida con "${term}"`);
          if (matches.items.length > 1) throw new ApiRequestError(400, "ambiguous", `Hay varios pacientes que coinciden con "${term}". Elegí uno de la lista.`);
          patientId = matches.items[0]!.id;
        }

        await appointmentsApi.create({
          patientId,
          startsAt: toApiTimestamp(form.date, form.time),
          reason: form.reason.trim(),
        });
      }, "No pudimos crear el turno");
    },
    [runWrite, setActionError],
  );

  return { saving, actionError, runWrite, create };
}
