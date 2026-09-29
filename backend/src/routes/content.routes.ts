import { Router, type NextFunction, type Request, type Response } from "express";
import type { z } from "zod";
import { asyncHandler } from "../lib/async.js";
import { notFound, param } from "../lib/errors.js";
import { validate } from "../middleware/validate.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { contentSchemas } from "../schemas/content.schema.js";
import { clearContentCache, contentRepo, isContentKind, listContent } from "../services/content.service.js";

/**
 * Website content (FAQ, services, obras sociales) under /api/content/:kind.
 * Anyone can read it — the public site shows it; only admins change it.
 */
export const contentRouter = Router();

/** Validates the body against the schema of the kind in the URL. */
const validateKind = (partial: boolean) => (req: Request, res: Response, next: NextFunction) => {
  const kind = param(req.params, "kind");
  if (!isContentKind(kind)) return next(notFound("Sección de contenido desconocida"));
  const schema: z.ZodObject = contentSchemas[kind];
  return validate(partial ? schema.partial() : schema)(req, res, next);
};

contentRouter.get(
  "/:kind",
  asyncHandler(async (req, res) => {
    res.json({ items: await listContent(param(req.params, "kind")) });
  }),
);

contentRouter.post(
  "/:kind",
  requireAuth,
  requireAdmin,
  validateKind(false),
  asyncHandler(async (req, res) => {
    const kind = param(req.params, "kind");
    const created = await contentRepo(kind).create(req.body);
    clearContentCache(kind);
    res.status(201).json(created);
  }),
);

contentRouter.patch(
  "/:kind/:id",
  requireAuth,
  requireAdmin,
  validateKind(true),
  asyncHandler(async (req, res) => {
    const kind = param(req.params, "kind");
    const updated = await contentRepo(kind).update(param(req.params, "id"), req.body);
    clearContentCache(kind);
    res.json(updated);
  }),
);

contentRouter.delete(
  "/:kind/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const kind = param(req.params, "kind");
    await contentRepo(kind).remove(param(req.params, "id"));
    clearContentCache(kind);
    res.status(204).end();
  }),
);
