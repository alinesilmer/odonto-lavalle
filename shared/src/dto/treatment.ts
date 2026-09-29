import type { Gender } from "../enums";

export interface MedicalCondition {
  name: string;
  diagnosis: string;
  date: string;
}

export interface Medication {
  name: string;
  dosage: string;
}

export const TOOTH_STATUSES = [
  "sano",
  "caries",
  "fractura",
  "extraccion",
  "obturacion",
  "sellante",
  "endodoncia",
  "tratamiento",
  "corona",
  "carilla",
  "puente",
  "implante",
  "ausente",
] as const;
export type ToothStatus = (typeof TOOTH_STATUSES)[number];

export interface Tooth {
  /** FDI number, 11–48. */
  number: number;
  status: ToothStatus;
  /** Free-text description from the dentist, e.g. what was done or what is pending. */
  notes: string;
}

/**
 * FDI notation as read facing the patient: the patient's right is on our left
 * in both arches — upper 18→11 then 21→28, lower 48→41 then 31→38.
 */
export const FDI_NUMBERS = [
  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
  48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
] as const;

/** A full healthy chart, for a patient whose odontogram was never filled in. */
export const emptyToothChart = (): Tooth[] => FDI_NUMBERS.map((number) => ({ number, status: "sano", notes: "" }));

export const TIMELINE_STATUSES = ["scheduled", "in-progress", "completed"] as const;
export type TimelineStatus = (typeof TIMELINE_STATUSES)[number];

/** One step of the treatment plan ("Evolución"). */
export interface TimelineEntry {
  date: string;
  title: string;
  status: TimelineStatus;
  description: string;
}

/** A visit planned as part of the treatment. */
export interface PlannedAppointment {
  date: string;
  time: string;
  type: string;
  doctor: string;
}

export interface TreatmentProgressDto {
  completed: number;
  total: number;
  phaseLabel: string;
  phasePercentage: number;
}

export const EMPTY_TREATMENT_PROGRESS: TreatmentProgressDto = { completed: 0, total: 0, phaseLabel: "", phasePercentage: 0 };

/** Every part is optional: a save sends only what changed and the rest is kept. */
export interface UpdateTreatmentRequest {
  weightKg?: number;
  heightCm?: number;
  conditions?: MedicalCondition[];
  medications?: Medication[];
  teeth?: Tooth[];
  timeline?: TimelineEntry[];
  plannedVisits?: PlannedAppointment[];
  progress?: TreatmentProgressDto;
}

export interface TreatmentDto {
  patientId: string;
  patientName: string;
  dni: string;
  gender: Gender;
  weightKg?: number;
  heightCm?: number;
  age?: number;
  bmi?: number;
  conditions: MedicalCondition[];
  medications: Medication[];
  /** Always all 32 teeth, in FDI_NUMBERS order. */
  teeth: Tooth[];
  timeline: TimelineEntry[];
  plannedVisits: PlannedAppointment[];
  progress: TreatmentProgressDto;
  updatedAt: string;
}
