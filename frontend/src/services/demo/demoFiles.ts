import type { PatientFileDto } from "@odonto/shared";
import { NOT_MINE } from "./demoContent";

/**
 * Demo answers for /patients/:id/files. Uploads stay in this tab as object
 * URLs (so previews and downloads work) and vanish on reload.
 */
const files: PatientFileDto[] = [];

export function handleDemoFiles(method: string, route: string, body: unknown): unknown {
  const match = route.match(/^\/patients\/([^/]+)\/files(?:\/([^/]+))?$/);
  if (!match) return NOT_MINE;
  const [, patientId, fileId] = match;

  if (method === "POST" && body instanceof File) {
    const created: PatientFileDto = {
      id: `demo-f${Date.now()}`,
      patientId,
      name: body.name,
      note: "",
      contentType: body.type,
      sizeBytes: body.size,
      url: URL.createObjectURL(body),
      uploadedAt: new Date().toISOString(),
    };
    files.unshift(created);
    return created;
  }
  if (method === "DELETE" && fileId) {
    const index = files.findIndex((f) => f.id === fileId);
    if (index >= 0) URL.revokeObjectURL(files.splice(index, 1)[0]!.url);
    return undefined;
  }
  return { items: files.filter((f) => f.patientId === patientId) };
}
