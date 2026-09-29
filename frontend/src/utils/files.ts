import { MAX_PATIENT_FILE_BYTES, PATIENT_FILE_TYPES } from "@odonto/shared";

export type FileKind = "image" | "pdf" | "sheet" | "doc" | "other";

/** 1536 → "1,5 KB". */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toLocaleString("es-AR", { maximumFractionDigits: 1 })} ${units[unit]}`;
}

/** Groups a MIME type into what the file list shows an icon/preview for. */
export function fileKind(contentType: string): FileKind {
  if (contentType.startsWith("image/")) return "image";
  if (contentType === "application/pdf") return "pdf";
  if (contentType.includes("spreadsheet") || contentType.includes("excel") || contentType === "text/csv") return "sheet";
  if (contentType.includes("word") || contentType === "text/plain") return "doc";
  return "other";
}

/** Browsers leave some types blank; infer those from the extension. */
const BY_EXTENSION: Record<string, string> = {
  dcm: "application/dicom",
  heic: "image/heic",
  csv: "text/csv",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export function fileType(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return file.type || BY_EXTENSION[ext] || "";
}

/** Why a file can't be attached, or null if it can. Mirrors the API's checks. */
export function fileProblem(file: File): string | null {
  if (!PATIENT_FILE_TYPES[fileType(file)]) return "Tipo de archivo no admitido";
  if (file.size === 0) return "El archivo está vacío";
  if (file.size > MAX_PATIENT_FILE_BYTES) return `Supera los ${formatBytes(MAX_PATIENT_FILE_BYTES)}`;
  return null;
}

/** The file with the inferred type, so the upload's Content-Type is right. */
export const withType = (file: File): File =>
  file.type ? file : new File([file], file.name, { type: fileType(file), lastModified: file.lastModified });
