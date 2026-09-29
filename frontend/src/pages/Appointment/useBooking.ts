import { useCallback, useState } from "react";
import { clinicTodayDate } from "@/utils/clinicTime";

/** Turnos are arranged over WhatsApp, so the visitor states a preference, not an exact slot. */
export const TIME_PREFERENCES = ["Por la mañana", "Por la tarde", "Indistinto"] as const;
export type TimePreference = (typeof TIME_PREFERENCES)[number];

const DEFAULT_REASON = "Consulta";

/** What the visitor wants to ask for; the clinic confirms the actual time on WhatsApp. */
export function useBooking() {
  const [today] = useState(clinicTodayDate);
  const [selectedDay, setSelectedDay] = useState<Date>(today);
  const [timePreference, setTimePreference] = useState<TimePreference | "">("");
  const [reason, setReason] = useState(DEFAULT_REASON);

  const pickDay = useCallback(
    (day: Date) => {
      if (day >= today) setSelectedDay(day);
    },
    [today],
  );

  return {
    today,
    selectedDay,
    pickDay,
    timePreference,
    setTimePreference,
    reason,
    setReason,
  };
}
