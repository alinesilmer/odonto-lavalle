export interface DocumentDto {
  id: string;
  name: string;
  url: string;
  contentType: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface HistoryRecordDto {
  id: string;
  patientId: string;
  date: string;
  title: string;
  condition?: string;
  diagnosis?: string;
  medication?: string;
  notes?: string;
  documents: DocumentDto[];
  createdBy: string;
  createdAt: string;
}

export type CreateHistoryRecordRequest = Omit<
  HistoryRecordDto,
  "id" | "patientId" | "documents" | "createdBy" | "createdAt"
>;

/** A file attached to a patient's record: X-rays, photos, PDFs, spreadsheets… */
export interface PatientFileDto extends DocumentDto {
  patientId: string;
  /** Optional description, e.g. "Panorámica inicial". */
  note: string;
}

/** Largest attachment the API accepts. */
export const MAX_PATIENT_FILE_BYTES = 20 * 1024 * 1024;

/** What can be attached, by MIME type → a short label for the file list. */
export const PATIENT_FILE_TYPES: Record<string, string> = {
  "image/jpeg": "Imagen",
  "image/png": "Imagen",
  "image/webp": "Imagen",
  "image/heic": "Imagen",
  "application/pdf": "PDF",
  "application/vnd.ms-excel": "Excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
  "text/csv": "CSV",
  "application/msword": "Word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word",
  "text/plain": "Texto",
  "application/dicom": "DICOM",
  "application/zip": "ZIP",
};

/** The `accept` list for a file input, from PATIENT_FILE_TYPES plus common extensions. */
export const PATIENT_FILE_ACCEPT = [...Object.keys(PATIENT_FILE_TYPES), ".dcm", ".heic", ".xls", ".xlsx", ".csv", ".doc", ".docx"].join(",");
