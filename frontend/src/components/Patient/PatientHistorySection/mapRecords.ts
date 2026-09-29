import type { HistoryRecordDto } from "@odonto/shared";
import type { HistoryEntry } from "./types";

/** The one-line summary shown under a record's title. */
function describe(record: HistoryRecordDto): string {
  if (record.diagnosis) return `Diagnóstico: ${record.diagnosis}`;
  if (record.medication) return `Medicación: ${record.medication}`;
  return "Consulta";
}

export function toHistoryEntries(records: HistoryRecordDto[]): HistoryEntry[] {
  return records.map((record) => ({
    id: record.id,
    date: record.date,
    title: record.title || record.condition || "Consulta",
    description: describe(record),
    notes: record.notes,
    attachments: record.documents.map((document) => document.name),
  }));
}
