import { Router } from "express";
import type { ContactRequest, PublicMessageRequest } from "@odonto/shared";
import { contactSchema, newsletterSchema } from "@odonto/shared";
import { z } from "zod";
import { collections, db } from "../config/firebase.js";
import { asyncHandler } from "../lib/async.js";
import { validate } from "../middleware/validate.js";

export const publicRouter = Router();

const publicMessageSchema = z.object({ message: z.string().trim().min(1).max(2000) });

publicRouter.post(
  "/contact",
  validate(contactSchema),
  asyncHandler(async (req, res) => {
    await db.collection(collections.contactRequests).add({
      ...(req.body as ContactRequest),
      handled: false,
      createdAt: new Date(),
    });
    res.status(201).json({ ok: true });
  }),
);

publicRouter.post(
  "/newsletter",
  validate(newsletterSchema),
  asyncHandler(async (req, res) => {
    const { email } = req.body as { email: string };
    // Keyed by email so re-subscribing is idempotent instead of creating dupes.
    await db
      .collection(collections.newsletter)
      .doc(email)
      .set({ email, subscribedAt: new Date() }, { merge: true });
    res.status(201).json({ ok: true });
  }),
);

publicRouter.post(
  "/message",
  validate(publicMessageSchema),
  asyncHandler(async (req, res) => {
    await db.collection(collections.publicMessages).add({
      ...(req.body as PublicMessageRequest),
      handled: false,
      createdAt: new Date(),
    });
    res.status(201).json({ ok: true });
  }),
);
