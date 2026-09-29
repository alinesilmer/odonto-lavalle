/**
 * Contract shared by frontend and backend.
 *
 * Rules for everything re-exported here:
 *  - dates are ISO-8601 strings in UTC ("2026-03-14T13:30:00.000Z")
 *  - times of day are "HH:mm" in the clinic's local timezone
 *  - ids are Firestore document ids
 * The frontend keeps its own display shapes in src/services/adapters.ts; these
 * are the wire types.
 */
export * from "./enums";
export * from "./api";
export * from "./validation";
export * from "./time";

export * from "./dto/auth";
export * from "./dto/patients";
export * from "./dto/appointments";
export * from "./dto/history";
export * from "./dto/treatment";
export * from "./dto/stock";
export * from "./dto/reminders";
export * from "./dto/stats";
export * from "./dto/public";
export * from "./dto/content";
export * from "./defaultContent";
