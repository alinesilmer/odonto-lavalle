import { Router } from "express";
import { asyncHandler } from "../lib/async.js";
import { param } from "../lib/errors.js";
import { validate } from "../middleware/validate.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { upsertStockSchema, type UpsertStockBody } from "../schemas/resources.schema.js";
import { listStock, stockRepo } from "../services/stock.service.js";

export const stockRouter = Router();
stockRouter.use(requireAuth, requireAdmin);

stockRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json({ items: await listStock() });
  }),
);

stockRouter.post(
  "/",
  validate(upsertStockSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as UpsertStockBody;
    res.status(201).json(await stockRepo.create({ ...body, updatedAt: new Date() }));
  }),
);

stockRouter.put(
  "/:id",
  validate(upsertStockSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as UpsertStockBody;
    res.json(await stockRepo.update(param(req.params, "id"), { ...body, updatedAt: new Date() }));
  }),
);

stockRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await stockRepo.remove(param(req.params, "id"));
    res.status(204).end();
  }),
);
