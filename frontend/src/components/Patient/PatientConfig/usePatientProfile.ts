import { useCallback, useEffect, useState } from "react";
import type { Gender, Insurance } from "@odonto/shared";
import { useAuth } from "@/auth/useAuth";
import { patientsApi } from "@/services";
import { ApiRequestError } from "@/services/http";

export interface PatientProfileForm {
  fullName: string;
  phone: string;
  birthDate: string;
  gender: string;
  insurance: string;
}

const EMPTY: PatientProfileForm = {
  fullName: "",
  phone: "",
  birthDate: "",
  gender: "",
  insurance: "",
};

/** Only the fields the API actually accepts; DNI and email are identity fields. */
export function usePatientProfile() {
  const { user, patient, refreshProfile } = useAuth();
  const [form, setForm] = useState<PatientProfileForm>(EMPTY);

  useEffect(() => {
    if (!patient) return;
    setForm({
      fullName: patient.fullName,
      phone: patient.phone,
      birthDate: patient.birthDate,
      gender: patient.gender,
      insurance: patient.insurance,
    });
  }, [patient]);

  const save = useCallback(async (): Promise<string | null> => {
    if (!patient) return "Todavía estamos cargando tu ficha";

    try {
      await patientsApi.update(patient.id, {
        fullName: form.fullName,
        phone: form.phone,
        birthDate: form.birthDate,
        gender: form.gender as Gender,
        insurance: form.insurance as Insurance,
      });
      await refreshProfile();
      return null;
    } catch (err) {
      return err instanceof ApiRequestError ? err.message : "No pudimos guardar los cambios";
    }
  }, [form, patient, refreshProfile]);

  return {
    user,
    patient,
    form,
    set: useCallback(
      (patch: Partial<PatientProfileForm>) => setForm((current) => ({ ...current, ...patch })),
      [],
    ),
    save,
  };
}
