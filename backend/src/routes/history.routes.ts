import { Router } from "express";
import { asyncHandler } from "../lib/async.js";
import { param } from "../lib/errors.js";
import { validate } from "../middleware/validate.js";
import {
  assertCanAccessPatient,
  requireAdmin,
  requireAuth,
  type AuthedRequest,
} from "../middleware/auth.js";
import {
  createHistoryRecordSchema,
  type CreateHistoryRecordBody,
} from "../schemas/patients.schema.js";
import { historyRepo, listHistoryFor } from "../services/history.service.js";

export const historyRouter = Router({ mergeParams: true });
historyRouter.use(requireAuth);

historyRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const patientId = param(req.params, "patientId");
    assertCanAccessPatient(req, patientId);
    res.json({ items: await listHistoryFor(patientId) });
  }),
);

historyRouter.post(
  "/",
  requireAdmin,
  validate(createHistoryRecordSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as CreateHistoryRecordBody;

    res.status(201).json(
      await historyRepo.create({
        ...body,
        patientId: param(req.params, "patientId"),
        documents: [],
        createdBy: (req as AuthedRequest).user.uid,
        createdAt: new Date(),
      }),
    );
  }),
);

historyRouter.delete(
  "/:recordId",
  requireAdmin,
  asyncHandler(async (req, res) => {
    await historyRepo.remove(param(req.params, "recordId"));
    res.status(204).end();
  }),
);
