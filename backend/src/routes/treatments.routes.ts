import { Router } from "express";
import { asyncHandler } from "../lib/async.js";
import { param } from "../lib/errors.js";
import { validate } from "../middleware/validate.js";
import { assertCanAccessPatient, requireAdmin, requireAuth } from "../middleware/auth.js";
import { upsertTreatmentSchema, type UpsertTreatmentBody } from "../schemas/patients.schema.js";
import { getTreatment, saveTreatment } from "../services/treatments.service.js";

export const treatmentsRouter = Router({ mergeParams: true });
treatmentsRouter.use(requireAuth);

treatmentsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const patientId = param(req.params, "patientId");
    assertCanAccessPatient(req, patientId);
    res.json(await getTreatment(patientId));
  }),
);

treatmentsRouter.put(
  "/",
  requireAdmin,
  validate(upsertTreatmentSchema),
  asyncHandler(async (req, res) => {
    await saveTreatment(param(req.params, "patientId"), req.body as UpsertTreatmentBody);
    res.status(204).end();
  }),
);
