import type { DocumentDto, HistoryRecordDto } from "@odonto/shared";
import { collections } from "../config/firebase.js";
import { createRepository } from "../lib/repository.js";
import { fieldsOf, iso, list, optionalStr, str } from "../lib/firestore.js";

export const historyRepo = createRepository<HistoryRecordDto>(
  collections.historyRecords,
  (snap) => {
    const d = fieldsOf(snap);
    return {
      id: snap.id,
      patientId: str(d.patientId),
      date: str(d.date),
      title: str(d.title),
      condition: optionalStr(d.condition),
      diagnosis: optionalStr(d.diagnosis),
      medication: optionalStr(d.medication),
      notes: optionalStr(d.notes),
      documents: list<DocumentDto>(d.documents),
      createdBy: str(d.createdBy),
      createdAt: iso(d.createdAt),
    };
  },
  "Registro no encontrado",
);

export const listHistoryFor = (patientId: string) =>
  // Sorted here: patientId + date ordering in Firestore would need a composite index.
  historyRepo
    .list((q) => q.where("patientId", "==", patientId))
    .then((records) => records.sort((a, b) => b.date.localeCompare(a.date)));
