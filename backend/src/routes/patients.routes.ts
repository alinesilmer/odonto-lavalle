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
  createPatientSchema,
  listPatientsQuerySchema,
  updatePatientSchema,
  type CreatePatientBody,
  type ListPatientsQuery,
  type UpdatePatientBody,
} from "../schemas/patients.schema.js";
import { createPatient, listPatients, updatePatient } from "../services/patients.service.js";
import { getPatientOrThrow } from "../services/patients.service.js";

export const patientsRouter = Router();
patientsRouter.use(requireAuth);

patientsRouter.get(
  "/",
  requireAdmin,
  validate(listPatientsQuerySchema, "query"),
  asyncHandler(async (req, res) => {
    res.json(await listPatients(req.query as unknown as ListPatientsQuery));
  }),
);

patientsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = param(req.params, "id");
    assertCanAccessPatient(req, id);
    res.json(await getPatientOrThrow(id));
  }),
);

patientsRouter.patch(
  "/:id",
  validate(updatePatientSchema),
  asyncHandler(async (req, res) => {
    const id = param(req.params, "id");
    assertCanAccessPatient(req, id);

    const { role } = (req as AuthedRequest).user;
    res.json(await updatePatient(id, req.body as UpdatePatientBody, role));
  }),
);

/** The clinic adds a patient who has no account (yet). */
patientsRouter.post(
  "/",
  requireAdmin,
  validate(createPatientSchema),
  asyncHandler(async (req, res) => {
    res.status(201).json(await createPatient(req.body as CreatePatientBody));
  }),
);
