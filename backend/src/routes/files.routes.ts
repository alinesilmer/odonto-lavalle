import express, { Router } from "express";
import { MAX_PATIENT_FILE_BYTES } from "@odonto/shared";
import { asyncHandler } from "../lib/async.js";
import { param } from "../lib/errors.js";
import { assertCanAccessPatient, requireAdmin, requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { deletePatientFile, listPatientFiles, uploadPatientFile } from "../services/files.service.js";

/**
 * /api/patients/:patientId/files — the patient's attachments. The patient can
 * see their own; only the clinic uploads or deletes.
 *
 * Uploads are the raw file as the request body (Content-Type = the file's
 * type), with the name and an optional note in headers, so no multipart
 * parser is needed.
 */
export const filesRouter = Router({ mergeParams: true });
filesRouter.use(requireAuth);

filesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const patientId = param(req.params, "patientId");
    assertCanAccessPatient(req, patientId);
    res.json({ items: await listPatientFiles(patientId) });
  }),
);

filesRouter.post(
  "/",
  requireAdmin,
  // A little over the limit, so an oversized file gets our own message.
  express.raw({ type: () => true, limit: MAX_PATIENT_FILE_BYTES + 1024 }),
  asyncHandler(async (req, res) => {
    // A malformed %-sequence would make decodeURIComponent throw; keep the raw text instead.
    const header = (name: string) => {
      const raw = String(req.headers[name] ?? "");
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    };
    const created = await uploadPatientFile({
      patientId: param(req.params, "patientId"),
      name: header("x-file-name") || "archivo",
      note: header("x-file-note"),
      contentType: String(req.headers["content-type"] ?? "").split(";")[0]!.trim(),
      data: Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0),
      uploadedBy: (req as AuthedRequest).user.uid,
    });
    res.status(201).json(created);
  }),
);

filesRouter.delete(
  "/:fileId",
  requireAdmin,
  asyncHandler(async (req, res) => {
    await deletePatientFile(param(req.params, "patientId"), param(req.params, "fileId"));
    res.status(204).end();
  }),
);
