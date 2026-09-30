import { GENDERS, NO_INSURANCE, type Gender, type PatientDto, type Role } from "@odonto/shared";
import { collections, db } from "../config/firebase.js";
import { conflict, notFound } from "../lib/errors.js";
import { fieldsOf, iso, optionalStr, str, toDate } from "../lib/firestore.js";
import { cached, invalidate } from "../lib/cache.js";
import type { CreatePatientBody, UpdatePatientBody } from "../schemas/patients.schema.js";

export const patientsCol = () => db.collection(collections.patients);

/** Cache key for the full patient list; any write to a patient clears it. */
export const PATIENTS_CACHE = "patients:all";

const isGender = (v: unknown): v is Gender => (GENDERS as readonly unknown[]).includes(v);

/**
 * Snapshot → DTO, tolerant of records saved by the first version of the site
 * (`name` instead of `fullName`, "Activo"/"Inactivo", insurance as free text,
 * no uid): those still show up and can be edited instead of silently
 * vanishing from the list while blocking their DNI.
 */
export function toPatientDto(snap: FirebaseFirestore.DocumentSnapshot): PatientDto {
  const d = fieldsOf(snap);
  const status = str(d.status).toLowerCase();
  return {
    id: snap.id,
    uid: str(d.uid),
    fullName: str(d.fullName) || str(d.name) || "(sin nombre)",
    dni: str(d.dni),
    gender: isGender(d.gender) ? d.gender : "otro",
    email: str(d.email),
    phone: str(d.phone),
    birthDate: str(d.birthDate),
    insurance: str(d.insurance) || NO_INSURANCE,
    status: status === "inactive" || status === "inactivo" ? "inactive" : "active",
    avatarUrl: optionalStr(d.avatarUrl),
    createdAt: iso(d.createdAt),
    updatedAt: iso(d.updatedAt),
    lastVisitAt: toDate(d.lastVisitAt)?.toISOString(),
  };
}

export async function getPatientOrThrow(id: string): Promise<PatientDto> {
  const snap = await patientsCol().doc(id).get();
  if (!snap.exists) throw notFound("Paciente no encontrado");
  return toPatientDto(snap);
}

export async function listPatients(opts: { search?: string; page: number; pageSize: number }) {
  // Firestore has no substring search, so name/dni/email filtering happens in
  // memory. Fine at clinic scale; swap for Algolia/Typesense if it outgrows it.
  // Cached briefly: the search-as-you-type box asks on every few keystrokes,
  // and each uncached call reads the whole collection.
  // Sorted here, not with orderBy("fullName"): Firestore's orderBy leaves out
  // every document that lacks the field, which is how old records went missing.
  let items = await cached(PATIENTS_CACHE, 30_000, async () =>
    (await patientsCol().get()).docs
      .map(toPatientDto)
      .sort((a, b) => a.fullName.localeCompare(b.fullName, "es", { sensitivity: "base" })),
  );

  if (opts.search) {
    // Accent- and case-insensitive, so "maria" finds "María".
    const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const q = fold(opts.search);
    items = items.filter(
      (p) => fold(p.fullName).includes(q) || p.dni.includes(q) || fold(p.email ?? "").includes(q),
    );
  }

  const total = items.length;
  const start = (opts.page - 1) * opts.pageSize;
  return { items: items.slice(start, start + opts.pageSize), total, page: opts.page, pageSize: opts.pageSize };
}

export async function findByDni(dni: string) {
  const snap = await patientsCol().where("dni", "==", dni).limit(1).get();
  return snap.empty ? null : toPatientDto(snap.docs[0]!);
}

/**
 * Applies a profile update. Only an admin may activate or deactivate an
 * account, so that field is dropped rather than trusted from the body.
 */
export async function updatePatient(
  id: string,
  body: UpdatePatientBody,
  role: Role,
): Promise<PatientDto> {
  await getPatientOrThrow(id);

  const { status, ...rest } = body;
  const patch: Record<string, unknown> = { ...rest, updatedAt: new Date() };
  if (role === "admin" && status !== undefined) patch.status = status;

  const ref = patientsCol().doc(id);
  await ref.update(patch);
  invalidate(PATIENTS_CACHE);
  return toPatientDto(await ref.get());
}

/** A patient added by the clinic: no Auth user yet, so `uid` is empty. */
export async function createPatient(body: CreatePatientBody): Promise<PatientDto> {
  const existing = await findByDni(body.dni);
  if (existing) {
    throw conflict(`Ya hay un paciente con ese DNI: ${existing.fullName}. Buscalo en la tabla para editarlo.`, {
      dni: "Este DNI ya está registrado",
    });
  }
  const now = new Date();
  const ref = patientsCol().doc();
  await ref.set({ ...body, uid: "", status: "active", createdAt: now, updatedAt: now });
  invalidate(PATIENTS_CACHE);
  return toPatientDto(await ref.get());
}

/**
 * Hands a clinic-added record over to the account its patient just created:
 * the profile moves to patients/{uid} (patient ids are Auth uids) and their
 * appointments, history and treatment follow it.
 */
export async function adoptClinicPatient(oldId: string, uid: string, profile: Record<string, unknown>) {
  const batch = db.batch();
  const oldRef = patientsCol().doc(oldId);
  const current = (await oldRef.get()).data() ?? {};
  batch.set(patientsCol().doc(uid), { ...current, ...profile, uid, updatedAt: new Date() });

  for (const name of [collections.appointments, collections.historyRecords, collections.patientFiles] as const) {
    const linked = await db.collection(name).where("patientId", "==", oldId).get();
    linked.docs.forEach((doc) => batch.update(doc.ref, { patientId: uid }));
  }

  const treatmentRef = db.collection(collections.treatments).doc(oldId);
  const treatment = await treatmentRef.get();
  if (treatment.exists) {
    batch.set(db.collection(collections.treatments).doc(uid), { ...treatment.data(), patientId: uid });
    batch.delete(treatmentRef);
  }

  batch.delete(oldRef);
  await batch.commit();
  invalidate(PATIENTS_CACHE);
}
