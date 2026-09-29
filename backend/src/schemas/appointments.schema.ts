import { z } from "zod";
import { APPOINTMENT_STATUSES, MAX_PAGE_SIZE, PAYMENT_STATUSES } from "@odonto/shared";
import { isValidIsoDate } from "../lib/dates.js";

export const availabilityQuerySchema = z.object({
  date: z.string().refine(isValidIsoDate, "Fecha inválida"),
});

export const listAppointmentsQuerySchema = z.object({
  status: z.enum(APPOINTMENT_STATUSES).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(20),
});

export const createAppointmentSchema = z.object({
  patientId: z.string().optional(),
  startsAt: z.string().datetime(),
  reason: z.string().trim().min(2).max(200),
  notes: z.string().trim().max(1000).optional(),
});

export const updateAppointmentSchema = z.object({
  startsAt: z.string().datetime().optional(),
  reason: z.string().trim().min(2).max(200).optional(),
  status: z.enum(APPOINTMENT_STATUSES).optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export type ListAppointmentsQuery = z.infer<typeof listAppointmentsQuerySchema>;
export type CreateAppointmentBody = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentBody = z.infer<typeof updateAppointmentSchema>;
