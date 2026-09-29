import type { DocumentSnapshot } from "firebase-admin/firestore";
import { CONTENT_KINDS, type ContentKind, type ContentMap } from "@odonto/shared";
import { collections } from "../config/firebase.js";
import { notFound } from "../lib/errors.js";
import { fieldsOf, num, str } from "../lib/firestore.js";
import { cached, invalidate } from "../lib/cache.js";
import { createRepository, type Repository } from "../lib/repository.js";

/** Snapshot → DTO for each kind; the repository does the rest. */
const mappers: { [K in ContentKind]: (snap: DocumentSnapshot) => ContentMap[K] } = {
  faqs: (snap) => {
    const d = fieldsOf(snap);
    return { id: snap.id, question: str(d.question), answer: str(d.answer), order: num(d.order) };
  },
  services: (snap) => {
    const d = fieldsOf(snap);
    return {
      id: snap.id,
      title: str(d.title),
      description: str(d.description),
      image: str(d.image),
      category: str(d.category, "otros") as ContentMap["services"]["category"],
      order: num(d.order),
    };
  },
  insurances: (snap) => {
    const d = fieldsOf(snap);
    return { id: snap.id, name: str(d.name), logo: str(d.logo), order: num(d.order) };
  },
};

const MISSING: Record<ContentKind, string> = {
  faqs: "Pregunta no encontrada",
  services: "Servicio no encontrado",
  insurances: "Obra social no encontrada",
};

const repos: { [K in ContentKind]: Repository<ContentMap[K]> } = {
  faqs: createRepository(collections.faqs, mappers.faqs, MISSING.faqs),
  services: createRepository(collections.services, mappers.services, MISSING.services),
  insurances: createRepository(collections.insurances, mappers.insurances, MISSING.insurances),
};

export const isContentKind = (value: string): value is ContentKind =>
  (CONTENT_KINDS as readonly string[]).includes(value);

/** The repository for a kind named in a URL; 404 for anything else. */
export function contentRepo(kind: string) {
  if (!isContentKind(kind)) throw notFound("Sección de contenido desconocida");
  return repos[kind] as Repository<ContentMap[ContentKind]>;
}

/** Every public page asks for these, so they're cached; content writes call clearContentCache. */
export const listContent = (kind: string) =>
  cached(`content:${kind}`, 5 * 60_000, () => contentRepo(kind).list((q) => q.orderBy("order", "asc")));

export const clearContentCache = (kind: string) => invalidate(`content:${kind}`);
