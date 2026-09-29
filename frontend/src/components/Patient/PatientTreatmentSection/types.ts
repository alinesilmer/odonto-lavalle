import type {
  MedicalCondition,
  Medication,
  PlannedAppointment,
  TimelineEntry,
  TimelineStatus,
  Tooth,
  ToothStatus,
} from "@odonto/shared";

export { TIMELINE_STATUSES, TOOTH_STATUSES } from "@odonto/shared";
export type { MedicalCondition, Medication, PlannedAppointment, TimelineEntry, TimelineStatus, Tooth, ToothStatus };

/**
 * States are coloured by group (as clinical odontograms do: red for what is
 * pending, blue for what was done) and told apart within a group by a code.
 */
export const TOOTH_GROUPS = ["healthy", "pending", "done", "treatment", "prosthetic", "absent"] as const;
export type ToothGroup = (typeof TOOTH_GROUPS)[number];

export interface TreatmentProgress {
  completed: number;
  total: number;
}

export interface PhaseProgress {
  percentage: number;
  label: string;
}

export interface PatientTreatmentProps {
  isAdmin?: boolean;
}

export const TAB_IDS = ["overview", "timeline", "appointments", "files"] as const;
export type TabId = (typeof TAB_IDS)[number];
