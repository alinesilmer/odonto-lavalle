import type { DocumentSnapshot, QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";

/**
 * A Firestore document's fields, before we know their shape.
 *
 * Firestore has no schema, so a read can hand back anything. `unknown` forces
 * each mapper to say what it expects via the readers below, instead of the
 * `Record<string, any>` casts that used to let typos through silently.
 */
export type DocFields = Record<string, unknown>;

export const fieldsOf = (snap: DocumentSnapshot): DocFields => (snap.data() ?? {}) as DocFields;

export const str = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

export const num = (value: unknown, fallback = 0): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

export const bool = (value: unknown, fallback = false): boolean =>
  typeof value === "boolean" ? value : fallback;

export const optionalStr = (value: unknown): string | undefined =>
  typeof value === "string" && value !== "" ? value : undefined;

export const list = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const isTimestamp = (value: unknown): value is Timestamp =>
  typeof value === "object" && value !== null && "toDate" in value;

/** Firestore Timestamp | Date | ISO string -> Date, or null when unparseable. */
export function toDate(value: unknown): Date | null {
  if (isTimestamp(value)) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

/** The ISO-8601 string every DTO uses for a timestamp field. */
export const iso = (value: unknown): string => toDate(value)?.toISOString() ?? "";

/** Maps a query's documents through `mapper`, keeping the call sites to one line. */
export const mapDocs = <T>(
  snap: FirebaseFirestore.QuerySnapshot,
  mapper: (doc: QueryDocumentSnapshot) => T,
): T[] => snap.docs.map(mapper);
