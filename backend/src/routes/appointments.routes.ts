import { Router } from "express";
import type { AvailabilityResponse } from "@odonto/shared";
import { asyncHandler } from "../lib/async.js";
import { param } from "../lib/errors.js";
import { validate } from "../middleware/validate.js";
import { requireAdmin, requireAuth, type AuthedRequest } from "../middleware/auth.js";
import {
  availabilityQuerySchema,
  createAppointmentSchema,
  listAppointmentsQuerySchema,
  updateAppointmentSchema,
  type CreateAppointmentBody,
  type ListAppointmentsQuery,
  type UpdateAppointmentBody,
} from "../schemas/appointments.schema.js";
import {
  availableSlots,
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from "../services/appointments.service.js";
import { listAppointments } from "../services/appointmentsList.service.js";

export const appointmentsRouter = Router();

appointmentsRouter.get(
  "/availability",
  validate(availabilityQuerySchema, "query"),
  asyncHandler(async (req, res) => {
    const { date } = req.query as unknown as { date: string };
    const body: AvailabilityResponse = { date, slots: await availableSlots(date) };
    res.json(body);
  }),
);

appointmentsRouter.use(requireAuth);

appointmentsRouter.get(
  "/",
  validate(listAppointmentsQuerySchema, "query"),
  asyncHandler(async (req, res) => {
    const query = req.query as unknown as ListAppointmentsQuery;
    res.json(await listAppointments((req as AuthedRequest).user, query));
  }),
);

appointmentsRouter.post(
  "/",
  validate(createAppointmentSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as CreateAppointmentBody;
    res.status(201).json(await createAppointment((req as AuthedRequest).user, body));
  }),
);

appointmentsRouter.patch(
  "/:id",
  validate(updateAppointmentSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as UpdateAppointmentBody;
    const id = param(req.params, "id");
    res.json(await updateAppointment((req as AuthedRequest).user, id, body));
  }),
);

appointmentsRouter.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    await deleteAppointment(param(req.params, "id"));
    res.status(204).end();
  }),
);
