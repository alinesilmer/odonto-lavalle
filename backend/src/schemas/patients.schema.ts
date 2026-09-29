import { z } from "zod";
import {
  FDI_NUMBERS,
  MAX_PAGE_SIZE,
  PATIENT_STATUSES,
  TIMELINE_STATUSES,
  TOOTH_STATUSES,
  createPatientSchema,
  zFullName,
  zGender,
  zInsurance,
  zIsoDate,
  zPhone,
} from "@odonto/shared";

export const createHistoryRecordSchema = z.object({
  date: zIsoDate,
  title: z.string().trim().min(2).max(200),
  condition: z.string().trim().max(200).optional(),
  diagnosis: z.string().trim().max(2000).optional(),
  medication: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(5000).optional(),
});

const text = (max: number) => z.string().trim().max(max).default("");
/** Dates in the plan may be left blank while it's being drafted. */
const optionalDate = z.union([zIsoDate, z.literal("")]).default("");

/** Every part optional: a save sends what changed and the stored rest is kept (merge). */
export const upsertTreatmentSchema = z.object({
  weightKg: z.coerce.number().min(0).max(400).optional(),
  heightCm: z.coerce.number().min(0).max(260).optional(),
  conditions: z
    .array(z.object({ name: z.string().trim().min(1).max(200), diagnosis: text(2000), date: optionalDate }))
    .max(100)
    .optional(),
  medications: z
    .array(z.object({ name: z.string().trim().min(1).max(200), dosage: text(200) }))
    .max(100)
    .optional(),
  teeth: z
    .array(
      z.object({
        number: z.number().int().refine((n) => (FDI_NUMBERS as readonly number[]).includes(n), "Pieza inválida"),
        status: z.enum(TOOTH_STATUSES),
        notes: text(1000),
      }),
    )
    .max(32)
    .optional(),
  timeline: z
    .array(
      z.object({
        date: optionalDate,
        title: z.string().trim().min(1).max(200),
        status: z.enum(TIMELINE_STATUSES),
        description: text(2000),
      }),
    )
    .max(200)
    .optional(),
  plannedVisits: z
    .array(
      z.object({
        date: optionalDate,
        time: z.union([z.string().regex(/^\d{2}:\d{2}$/), z.literal("")]).default(""),
        type: z.string().trim().min(1).max(200),
        doctor: text(120),
      }),
    )
    .max(100)
    .optional(),
  progress: z
    .object({
      completed: z.coerce.number().int().min(0).max(1000),
      total: z.coerce.number().int().min(0).max(1000),
      phaseLabel: text(200),
      phasePercentage: z.coerce.number().min(0).max(100),
    })
    .optional(),
});

export type CreateHistoryRecordBody = z.infer<typeof createHistoryRecordSchema>;
export type UpsertTreatmentBody = z.infer<typeof upsertTreatmentSchema>;

export const listPatientsQuerySchema = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(20),
});

/** Profile fields an update may change. `status` is admin-only. */
export const updatePatientSchema = z.object({
  fullName: zFullName.optional(),
  phone: zPhone.optional(),
  insurance: zInsurance.optional(),
  gender: zGender.optional(),
  birthDate: zIsoDate.optional(),
  status: z.enum(PATIENT_STATUSES).optional(),
});

export type ListPatientsQuery = z.infer<typeof listPatientsQuerySchema>;
export type UpdatePatientBody = z.infer<typeof updatePatientSchema>;

export { createPatientSchema };
export type CreatePatientBody = z.infer<typeof createPatientSchema>;
