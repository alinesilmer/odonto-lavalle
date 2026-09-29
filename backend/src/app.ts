import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env, isProd } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { apiLimiter, authLimiter, publicFormLimiter } from "./middleware/rateLimit.js";
import { authRouter } from "./routes/auth.routes.js";
import { appointmentsRouter } from "./routes/appointments.routes.js";
import { patientsRouter } from "./routes/patients.routes.js";
import { historyRouter } from "./routes/history.routes.js";
import { stockRouter } from "./routes/stock.routes.js";
import { remindersRouter } from "./routes/reminders.routes.js";
import { statsRouter } from "./routes/stats.routes.js";
import { publicRouter } from "./routes/public.routes.js";
import { treatmentsRouter } from "./routes/treatments.routes.js";
import { supportRouter } from "./routes/support.routes.js";
import { contentRouter } from "./routes/content.routes.js";
import { filesRouter } from "./routes/files.routes.js";
import { settingsRouter } from "./routes/settings.routes.js";

export function createApp() {
  const app = express();

  // Behind the host's proxy (Render etc.), trust its X-Forwarded-For so
  // `req.ip` is the visitor's address and the rate limits apply per person.
  if (isProd) app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(isProd ? "combined" : "dev"));

  app.get("/health", (_req, res) => res.json({ ok: true, env: env.NODE_ENV }));

  app.use("/api", apiLimiter);
  for (const path of ["/login", "/register", "/forgot-password", "/change-password"]) {
    app.use(`/api/auth${path}`, authLimiter);
  }
  app.use("/api/public", publicFormLimiter);

  app.use("/api/auth", authRouter);
  app.use("/api/appointments", appointmentsRouter);
  app.use("/api/patients", patientsRouter);
  // Clinical history is always nested under a patient, so ownership is checked once.
  app.use("/api/patients/:patientId/history", historyRouter);
  app.use("/api/patients/:patientId/treatment", treatmentsRouter);
  app.use("/api/patients/:patientId/files", filesRouter);
  app.use("/api/support", supportRouter);
  app.use("/api/stock", stockRouter);
  app.use("/api/reminders", remindersRouter);
  app.use("/api/stats", statsRouter);
  app.use("/api/public", publicRouter);
  app.use("/api/content", contentRouter);
  app.use("/api/settings", settingsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
