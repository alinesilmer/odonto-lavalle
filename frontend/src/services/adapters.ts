/**
 * Maps wire DTOs onto the Spanish display shapes the dashboard components
 * already render, so the API swap does not ripple into every JSX tree.
 */
import type {
  AppointmentDto,
  AppointmentStatus,
  PatientDto,
  PaymentStatus,
  ReminderDto,
  StockItemDto,
} from "@odonto/shared";
import { utcToClinicTime } from "@odonto/shared";
import {
  APPOINTMENT_STATUS_LABEL,
  PATIENT_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  insuranceLabel,
} from "@odonto/shared";

// Re-exported so dashboard code has one import for both the maps and the rows.
export { APPOINTMENT_STATUS_LABEL, PAYMENT_STATUS_LABEL };

/**
 * "2026-03-14T12:30:00.000Z" -> { date: "14/03/2026", time: "09:30" }
 *
 * Rendered in the clinic’s timezone, not the visitor’s, so a patient abroad
 * still sees the hour they are expected to turn up.
 */
export function splitDateTime(iso: string): { date: string; time: string } {
  const { date, time } = utcToClinicTime(iso);
  if (!date) return { date: "-", time: "-" };

  const [y, m, d] = date.split("-");
  return { date: `${d}/${m}/${y}`, time };
}

export interface AppointmentRow {
  id: string;
  date: string;
  time: string;
  reason: string;
  insurance: string;
  payment: string;
  status: string;
  patientName: string;
  receipt?: string;
  /** Kept so handlers can send updates back without re-parsing the display fields. */
  startsAt: string;
  rawStatus: AppointmentStatus;
  rawPaymentStatus: PaymentStatus;
}

export function toAppointmentRow(dto: AppointmentDto): AppointmentRow {
  const { date, time } = splitDateTime(dto.startsAt);
  return {
    id: dto.id,
    date,
    time,
    reason: dto.reason,
    insurance: insuranceLabel(dto.insurance),
    payment: PAYMENT_STATUS_LABEL[dto.paymentStatus],
    status: APPOINTMENT_STATUS_LABEL[dto.status],
    patientName: dto.patientName,
    receipt: dto.receiptUrl,
    startsAt: dto.startsAt,
    rawStatus: dto.status,
    rawPaymentStatus: dto.paymentStatus,
  };
}

export interface PatientRow {
  id: string;
  name: string;
  dni: string;
  phone: string;
  email: string;
  insurance: string;
  lastVisit: string;
  status: string;
}

export function toPatientRow(dto: PatientDto): PatientRow {
  return {
    id: dto.id,
    name: dto.fullName,
    dni: dto.dni,
    phone: dto.phone,
    email: dto.email,
    insurance: insuranceLabel(dto.insurance),
    lastVisit: dto.lastVisitAt ? splitDateTime(dto.lastVisitAt).date : "-",
    status: PATIENT_STATUS_LABEL[dto.status],
  };
}

export interface StockRow {
  id: string;
  product: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  minQuantity: number;
  lastUpdate: string;
}

export function toStockRow(dto: StockItemDto): StockRow {
  return { ...dto, lastUpdate: splitDateTime(dto.updatedAt).date };
}

export interface ReminderRow {
  id: string;
  title: string;
  description: string;
  time: string;
  done: boolean;
  dueAt: string;
}

export function toReminderRow(dto: ReminderDto): ReminderRow {
  const { date, time } = splitDateTime(dto.dueAt);
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    time: `${date} ${time}`,
    done: dto.done,
    dueAt: dto.dueAt,
  };
}
