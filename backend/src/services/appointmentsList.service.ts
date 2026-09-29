import type { AppointmentDto, Page } from "@odonto/shared";
import type { ListAppointmentsQuery } from "../schemas/appointments.schema.js";
import { appointmentsCol, toAppointmentDto, type Actor } from "./appointments.service.js";

/**
 * The agenda list. Patients only ever see their own turnos; admins see all.
 *
 * Equality filters (patient, status) combined with a date range or ordering
 * would each need a composite index. So: with equality filters, Firestore
 * filters by those and the date range + ordering happen here; without them,
 * Firestore does the range and ordering on the single startsAt field.
 */
export async function listAppointments(actor: Actor, q: ListAppointmentsQuery): Promise<Page<AppointmentDto>> {
  let query: FirebaseFirestore.Query = appointmentsCol();
  const byPatient = actor.role !== "admin";
  if (byPatient) query = query.where("patientId", "==", actor.uid);
  if (q.status) query = query.where("status", "==", q.status);

  const from = q.from ? new Date(q.from) : null;
  const to = q.to ? new Date(q.to) : null;
  let all: AppointmentDto[];
  if (byPatient || q.status) {
    const snap = await query.get();
    all = snap.docs
      .map(toAppointmentDto)
      .filter((a) => (!from || new Date(a.startsAt) >= from) && (!to || new Date(a.startsAt) <= to))
      .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
  } else {
    if (from) query = query.where("startsAt", ">=", from);
    if (to) query = query.where("startsAt", "<=", to);
    all = (await query.orderBy("startsAt", "desc").get()).docs.map(toAppointmentDto);
  }

  const start = (q.page - 1) * q.pageSize;
  return { items: all.slice(start, start + q.pageSize), total: all.length, page: q.page, pageSize: q.pageSize };
}
