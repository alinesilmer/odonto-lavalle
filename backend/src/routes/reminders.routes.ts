import { Router } from "express";
import { asyncHandler } from "../lib/async.js";
import { param } from "../lib/errors.js";
import { validate } from "../middleware/validate.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { upsertReminderSchema, type UpsertReminderBody } from "../schemas/resources.schema.js";
import { listReminders, remindersRepo } from "../services/reminders.service.js";

export const remindersRouter = Router();
remindersRouter.use(requireAuth, requireAdmin);

remindersRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json({ items: await listReminders() });
  }),
);

remindersRouter.post(
  "/",
  validate(upsertReminderSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as UpsertReminderBody;
    res.status(201).json(
      await remindersRepo.create({ ...body, dueAt: new Date(body.dueAt), createdAt: new Date() }),
    );
  }),
);

remindersRouter.patch(
  "/:id",
  validate(upsertReminderSchema.partial()),
  asyncHandler(async (req, res) => {
    const body = req.body as Partial<UpsertReminderBody>;
    res.json(
      await remindersRepo.update(param(req.params, "id"), {
        ...body,
        ...(body.dueAt ? { dueAt: new Date(body.dueAt) } : {}),
      }),
    );
  }),
);

remindersRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await remindersRepo.remove(param(req.params, "id"));
    res.status(204).end();
  }),
);
