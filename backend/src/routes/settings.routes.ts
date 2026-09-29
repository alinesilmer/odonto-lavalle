import { Router } from "express";
import { asyncHandler } from "../lib/async.js";
import { validate } from "../middleware/validate.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { siteSettingsSchema } from "../schemas/content.schema.js";
import { getSiteSettings, updateSiteSettings } from "../services/settings.service.js";

/** Site-wide settings (e.g. the consultation price): public to read, admin to change. */
export const settingsRouter = Router();

settingsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await getSiteSettings());
  }),
);

settingsRouter.put(
  "/",
  requireAuth,
  requireAdmin,
  validate(siteSettingsSchema.partial()),
  asyncHandler(async (req, res) => {
    res.json(await updateSiteSettings(req.body));
  }),
);
