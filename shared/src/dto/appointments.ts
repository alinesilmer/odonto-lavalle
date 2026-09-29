import type { AppointmentStatus, Insurance, PaymentStatus } from "../enums";

export interface AppointmentDto {
  id: string;
  patientId: string;
  patientName: string;
  /** Start of the appointment, UTC. */
  startsAt: string;
  durationMinutes: number;
  reason: string;
  insurance: Insurance;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  /** Admin only; patients always book for themselves. */
  patientId?: string;
  startsAt: string;
  reason: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  startsAt?: string;
  reason?: string;
  status?: AppointmentStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
}

export interface AvailabilityQuery {
  /** "2026-03-14" */
  date: string;
}

export interface AvailabilityResponse {
  date: string;
  /** Bookable "HH:mm" slots left for that date. */
  slots: string[];
}
