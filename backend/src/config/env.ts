import "dotenv/config";
import { z } from "zod";
import { CLINIC_TIME_ZONE } from "@odonto/shared";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),

  /** Comma-separated list of allowed browser origins. */
  CORS_ORIGINS: z.string().default("http://localhost:5173"),

  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  /** PEM key. Newlines may be escaped as \n in the .env file. */
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  FIREBASE_STORAGE_BUCKET: z.string().optional(),
  /** Web API key, used for the password sign-in REST call. */
  FIREBASE_WEB_API_KEY: z.string().min(1),

  /**
   * Clinic scheduling rules. Hours are wall-clock times in CLINIC_TIMEZONE,
   * which defaults to the zone the browser also formats in — override it only
   * alongside a frontend rebuild.
   */
  CLINIC_TIMEZONE: z.string().default(CLINIC_TIME_ZONE),
  CLINIC_OPEN_HOUR: z.coerce.number().int().min(0).max(23).default(9),
  CLINIC_CLOSE_HOUR: z.coerce.number().int().min(1).max(24).default(18),
  APPOINTMENT_MINUTES: z.coerce.number().int().positive().default(30),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
  throw new Error(`Invalid backend environment.\n${issues}\n\nCopy backend/.env.example to backend/.env and fill it in.`);
}

export const env = {
  ...parsed.data,
  // A service-account key is normally stored with its newlines escaped as \n.
  FIREBASE_PRIVATE_KEY: parsed.data.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  corsOrigins: parsed.data.CORS_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean),
};

export const isProd = env.NODE_ENV === "production";
