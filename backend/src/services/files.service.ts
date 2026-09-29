import { randomUUID } from "node:crypto";
import type { DocumentSnapshot } from "firebase-admin/firestore";
import { MAX_PATIENT_FILE_BYTES, PATIENT_FILE_TYPES, type PatientFileDto } from "@odonto/shared";
import { collections, db, storage } from "../config/firebase.js";
import { HttpError, badRequest, notFound } from "../lib/errors.js";
import { fieldsOf, iso, num, str } from "../lib/firestore.js";
import { getPatientOrThrow } from "./patients.service.js";

/**
 * Patient attachments: the bytes live in Cloud Storage under
 * patients/{patientId}/, the metadata in the patientFiles collection. Files
 * are private; each listing hands out short-lived signed links.
 */

const filesCol = () => db.collection(collections.patientFiles);
const LINK_TTL_MS = 60 * 60 * 1000;

function bucket() {
  if (!storage) throw new HttpError(503, "storage_unavailable", "El almacenamiento de archivos no está configurado");
  return storage.bucket();
}

/** Keeps names readable in the bucket and safe in a URL. */
const safeName = (name: string) =>
  name.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w.-]+/g, "_").slice(-120) || "archivo";

async function toDto(snap: DocumentSnapshot): Promise<PatientFileDto> {
  const d = fieldsOf(snap);
  const [url] = await bucket()
    .file(str(d.path))
    .getSignedUrl({ action: "read", expires: Date.now() + LINK_TTL_MS });
  return {
    id: snap.id,
    patientId: str(d.patientId),
    name: str(d.name),
    note: str(d.note),
    contentType: str(d.contentType),
    sizeBytes: num(d.sizeBytes),
    uploadedAt: iso(d.uploadedAt),
    url,
  };
}

export async function listPatientFiles(patientId: string): Promise<PatientFileDto[]> {
  const snap = await filesCol().where("patientId", "==", patientId).get();
  const files = await Promise.all(snap.docs.map(toDto));
  return files.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

interface Upload {
  patientId: string;
  name: string;
  note: string;
  contentType: string;
  data: Buffer;
  uploadedBy: string;
}

export async function uploadPatientFile(upload: Upload): Promise<PatientFileDto> {
  await getPatientOrThrow(upload.patientId);
  if (!PATIENT_FILE_TYPES[upload.contentType]) throw badRequest("Ese tipo de archivo no se puede adjuntar");
  if (upload.data.length === 0) throw badRequest("El archivo está vacío");
  if (upload.data.length > MAX_PATIENT_FILE_BYTES) throw new HttpError(413, "too_large", "El archivo supera los 20 MB");

  const ref = filesCol().doc();
  const path = `patients/${upload.patientId}/${ref.id}-${randomUUID().slice(0, 8)}-${safeName(upload.name)}`;
  try {
    await bucket().file(path).save(upload.data, { contentType: upload.contentType, resumable: false });
  } catch (err) {
    // A 404 here means the bucket itself is missing: Storage isn't enabled in Firebase yet.
    if ((err as { code?: number }).code === 404) {
      throw new HttpError(503, "storage_unavailable", "El almacenamiento de archivos todavía no está activado en Firebase");
    }
    throw err;
  }
  await ref.set({
    patientId: upload.patientId,
    name: upload.name.slice(0, 200),
    note: upload.note.slice(0, 300),
    contentType: upload.contentType,
    sizeBytes: upload.data.length,
    path,
    uploadedBy: upload.uploadedBy,
    uploadedAt: new Date(),
  });
  return toDto(await ref.get());
}

export async function deletePatientFile(patientId: string, fileId: string): Promise<void> {
  const ref = filesCol().doc(fileId);
  const snap = await ref.get();
  if (!snap.exists || str(fieldsOf(snap).patientId) !== patientId) throw notFound("Archivo no encontrado");
  await bucket().file(str(fieldsOf(snap).path)).delete({ ignoreNotFound: true });
  await ref.delete();
}
