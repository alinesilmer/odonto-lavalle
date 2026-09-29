import type { DocumentReference, DocumentSnapshot, Query } from "firebase-admin/firestore";
import { db } from "../config/firebase.js";
import { notFound } from "./errors.js";

export interface Repository<T> {
  col(): FirebaseFirestore.CollectionReference;
  doc(id: string): DocumentReference;
  toDto(snap: DocumentSnapshot): T;
  /** The document, or a 404 carrying this collection's own wording. */
  requireDoc(id: string): Promise<DocumentSnapshot>;
  list(build?: (q: Query) => Query): Promise<T[]>;
  create(data: FirebaseFirestore.DocumentData): Promise<T>;
  update(id: string, data: FirebaseFirestore.DocumentData): Promise<T>;
  remove(id: string): Promise<void>;
}

/**
 * The CRUD half of a Firestore-backed resource.
 *
 * Every collection was repeating the same six operations — read, map, 404 if
 * missing, write back, re-read — so they live here once and each service is
 * left with only the rules that are actually its own.
 */
export function createRepository<T>(
  collectionName: string,
  toDto: (snap: DocumentSnapshot) => T,
  missingMessage: string,
): Repository<T> {
  const col = () => db.collection(collectionName);
  const doc = (id: string) => col().doc(id);

  const requireDoc = async (id: string) => {
    const snap = await doc(id).get();
    if (!snap.exists) throw notFound(missingMessage);
    return snap;
  };

  return {
    col,
    doc,
    toDto,
    requireDoc,

    async list(build) {
      const query = build ? build(col()) : col();
      const snap = await query.get();
      return snap.docs.map(toDto);
    },

    async create(data) {
      const ref = await col().add(data);
      return toDto(await ref.get());
    },

    async update(id, data) {
      const snap = await requireDoc(id);
      await snap.ref.update(data);
      return toDto(await snap.ref.get());
    },

    async remove(id) {
      const snap = await requireDoc(id);
      await snap.ref.delete();
    },
  };
}
