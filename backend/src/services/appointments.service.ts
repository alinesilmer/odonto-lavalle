import type {
  AppointmentDto,
  AppointmentStatus,
  Insurance,
  PaymentStatus,
  Role,
} from "@odonto/shared";
import { collections, db } from "../config/firebase.js";
import { badRequest, conflict, forbidden, notFound } from "../lib/errors.js";
import { dayBounds, slotInstant, slotOf, slotsForDay } from "../lib/dates.js";
import { fieldsOf, iso, num, optionalStr, str } from "../lib/firestore.js";
import { env } from "../config/env.js";
import type {
  CreateAppointmentBody,
  UpdateAppointmentBody,
} from "../schemas/appointments.schema.js";
import { getPatientOrThrow } from "./patients.service.js";

export const appointmentsCol = () => db.collection(collections.appointments);

const OCCUPYING: AppointmentStatus[] = ["pending", "confirmed", "completed"];

export function toAppointmentDto(snap: FirebaseFirestore.DocumentSnapshot): AppointmentDto {
  const data = fieldsOf(snap);
  return {
    id: snap.id,
    patientId: str(data.patientId),
    patientName: str(data.patientName),
    startsAt: iso(data.startsAt),
    durationMinutes: num(data.durationMinutes, env.APPOINTMENT_MINUTES),
    reason: str(data.reason),
    insurance: str(data.insurance) as Insurance,
    status: str(data.status) as AppointmentStatus,
    paymentStatus: str(data.paymentStatus) as PaymentStatus,
    notes: optionalStr(data.notes),
    receiptUrl: optionalStr(data.receiptUrl),
    createdAt: iso(data.createdAt),
    updatedAt: iso(data.updatedAt),
  };
}

export async function getAppointmentOrThrow(id: string) {
  const snap = await appointmentsCol().doc(id).get();
  if (!snap.exists) throw notFound("Turno no encontrado");
  return snap;
}

/** Slot times still free on a given day. */
export async function availableSlots(isoDate: string): Promise<string[]> {
  const { start, end } = dayBounds(isoDate);
  // Range on one field only; the status check happens here, since combining the
  // two in Firestore needs a composite index that isn't deployed.
  const snap = await appointmentsCol().where("startsAt", ">=", start).where("startsAt", "<", end).get();

  const taken = new Set(
    snap.docs
      .filter((d) => (OCCUPYING as readonly string[]).includes(String(d.data().status)))
      .map((d) => slotOf((d.data().startsAt as FirebaseFirestore.Timestamp).toDate())),
  );

  const now = new Date();
  return slotsForDay().filter((slot) => {
    if (taken.has(slot)) return false;
    // Never offer a slot that has already passed in the clinic's own day.
    return slotInstant(isoDate, slot) > now;
  });
}

/**
 * Books a slot inside a transaction so two patients racing for the same time
 * cannot both win — the read and the write are atomic.
 */
export async function bookAppointment(input: {
  patientId: string;
  patientName: string;
  insurance: string;
  startsAt: Date;
  reason: string;
  notes?: string;
}): Promise<AppointmentDto> {
  const ref = appointmentsCol().doc();

  await db.runTransaction(async (tx) => {
    const clash = await tx.get(
      appointmentsCol()
        .where("startsAt", "==", input.startsAt)
        .where("status", "in", OCCUPYING)
        .limit(1),
    );
    if (!clash.empty) throw conflict("Ese horario ya fue reservado. Elegí otro.");

    tx.set(ref, {
      patientId: input.patientId,
      patientName: input.patientName,
      startsAt: input.startsAt,
      durationMinutes: env.APPOINTMENT_MINUTES,
      reason: input.reason,
      insurance: input.insurance,
      status: "pending" satisfies AppointmentStatus,
      paymentStatus: "pending",
      notes: input.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  return toAppointmentDto(await ref.get());
}

/* --------------------------- request-level rules -------------------------- */

export interface Actor {
  uid: string;
  role: Role;
}

/**
 * Bookings must land on one of the clinic's own slot times. Without this, a
 * hand-crafted request could reserve 03:17 and never collide with anything.
 */
function assertOnSlotGrid(startsAt: Date): void {
  if (!slotsForDay().includes(slotOf(startsAt))) {
    throw badRequest("Ese horario no es un turno válido de la agenda");
  }
}

export async function createAppointment(
  actor: Actor,
  body: CreateAppointmentBody,
): Promise<AppointmentDto> {
  if (body.patientId && actor.role !== "admin") {
    throw forbidden("Solo podés reservar turnos para vos");
  }

  const patientId = body.patientId ?? actor.uid;
  const patient = await getPatientOrThrow(patientId);

  const startsAt = new Date(body.startsAt);
  if (startsAt <= new Date()) throw badRequest("No se puede reservar un turno en el pasado");
  assertOnSlotGrid(startsAt);

  return bookAppointment({
    patientId,
    patientName: patient.fullName,
    insurance: patient.insurance,
    startsAt,
    reason: body.reason,
    notes: body.notes,
  });
}

/** What a patient is allowed to change on their own turno. */
const PATIENT_EDITABLE = new Set(["startsAt", "reason", "status"]);

function assertPatientMayEdit(body: UpdateAppointmentBody, current: AppointmentStatus) {
  const touches = Object.keys(body).filter((key) => !PATIENT_EDITABLE.has(key));
  if (touches.length > 0) throw forbidden("No podés cambiar ese dato de tu turno");

  // The only status a patient can set is "cancelled".
  if (body.status !== undefined && body.status !== "cancelled") {
    throw forbidden("Solo podés cancelar tu turno");
  }

  // A finished or already-cancelled turno is history, not something to move.
  if (current === "completed" || current === "cancelled") {
    throw forbidden("Este turno ya no se puede modificar");
  }
}

export async function updateAppointment(
  actor: Actor,
  id: string,
  body: UpdateAppointmentBody,
): Promise<AppointmentDto> {
  const snap = await getAppointmentOrThrow(id);
  const current = fieldsOf(snap);

  if (actor.role !== "admin") {
    if (str(current.patientId) !== actor.uid) throw forbidden();
    assertPatientMayEdit(body, str(current.status) as AppointmentStatus);
  }

  const startsAt = body.startsAt ? new Date(body.startsAt) : undefined;
  if (startsAt) {
    if (startsAt <= new Date()) throw badRequest("No se puede mover un turno al pasado");
    assertOnSlotGrid(startsAt);
    await assertSlotFree(startsAt, id);
  }

  await snap.ref.update({
    ...body,
    ...(startsAt ? { startsAt } : {}),
    updatedAt: new Date(),
  });

  return toAppointmentDto(await snap.ref.get());
}

/** Rejects a reschedule onto a time another turno already occupies. */
async function assertSlotFree(startsAt: Date, exceptId: string): Promise<void> {
  const clash = await appointmentsCol()
    .where("startsAt", "==", startsAt)
    .where("status", "in", OCCUPYING)
    .get();

  if (clash.docs.some((doc) => doc.id !== exceptId)) {
    throw conflict("Ese horario ya fue reservado. Elegí otro.");
  }
}

export async function deleteAppointment(id: string): Promise<void> {
  const snap = await appointmentsCol().doc(id).get();
  if (!snap.exists) throw notFound("Turno no encontrado");
  await snap.ref.delete();
}
