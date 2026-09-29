import { Router } from "express";
import { asyncHandler } from "../lib/async.js";
import { param } from "../lib/errors.js";
import { validate } from "../middleware/validate.js";
import { requireAdmin, requireAuth, type AuthedRequest } from "../middleware/auth.js";
import {
  createTicketSchema,
  ticketStatusSchema,
  type CreateTicketBody,
} from "../schemas/resources.schema.js";
import { listTicketsFor, supportRepo } from "../services/support.service.js";

export const supportRouter = Router();
supportRouter.use(requireAuth);

supportRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json({ items: await listTicketsFor((req as AuthedRequest).user) });
  }),
);

supportRouter.post(
  "/",
  validate(createTicketSchema),
  asyncHandler(async (req, res) => {
    const user = (req as AuthedRequest).user;
    const body = req.body as CreateTicketBody;

    res.status(201).json(
      await supportRepo.create({
        ...body,
        status: "open",
        authorId: user.uid,
        authorName: user.email,
        createdAt: new Date(),
      }),
    );
  }),
);

supportRouter.patch(
  "/:id",
  requireAdmin,
  validate(ticketStatusSchema),
  asyncHandler(async (req, res) => {
    res.json(await supportRepo.update(param(req.params, "id"), req.body as object));
  }),
);
