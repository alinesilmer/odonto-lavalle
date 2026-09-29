import type { ContentInput, ContentKind, ContentMap } from "@odonto/shared";
import { SERVICE_FILTERS, categoryLabel } from "@/data/serviceCategories";
import { toSentenceCase } from "@/utils/text";

/** One field of the content form. */
export interface ContentField {
  name: string;
  label: string;
  type?: "text" | "multiline" | "url" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
  /** Spans both columns. */
  full?: boolean;
  required?: boolean;
}

interface KindConfig<K extends ContentKind> {
  /** Tab label (plural). */
  label: string;
  /** "pregunta", "servicio"… used in buttons and dialogs. */
  noun: string;
  /** Title of the create dialog. */
  newTitle: string;
  fields: ContentField[];
  empty: ContentInput<K>;
  title: (item: ContentMap[K]) => string;
  meta: (item: ContentMap[K]) => string;
}

const SERVICE_CATEGORY_OPTIONS = SERVICE_FILTERS.filter((f) => f.id !== "todos").map((f) => ({
  value: f.id,
  label: f.label,
}));

const excerpt = (text: string, max = 110) => (text.length > max ? `${text.slice(0, max).trimEnd()}…` : text);

/** Everything the admin screen needs to know about each kind of content. */
export const CONTENT_CONFIG: { [K in ContentKind]: KindConfig<K> } = {
  faqs: {
    label: "Preguntas frecuentes",
    noun: "pregunta",
    newTitle: "Nueva pregunta",
    fields: [
      { name: "question", label: "Pregunta", full: true, required: true },
      { name: "answer", label: "Respuesta", type: "multiline", full: true, required: true },
    ],
    empty: { question: "", answer: "", order: 0 },
    title: (f) => f.question,
    meta: (f) => excerpt(f.answer),
  },
  services: {
    label: "Servicios",
    noun: "servicio",
    newTitle: "Nuevo servicio",
    fields: [
      { name: "title", label: "Nombre", required: true, placeholder: "Ej.: Blanqueamiento" },
      { name: "category", label: "Categoría", type: "select", options: SERVICE_CATEGORY_OPTIONS },
      { name: "description", label: "Descripción", type: "multiline", full: true, required: true },
      { name: "image", label: "Foto (URL)", type: "url", full: true, hint: "Enlace a la imagen que se muestra en la tarjeta." },
    ],
    empty: { title: "", description: "", image: "", category: "otros", order: 0 },
    title: (s) => toSentenceCase(s.title),
    meta: (s) => `${categoryLabel(s.category)} · ${excerpt(s.description, 80)}`,
  },
  insurances: {
    label: "Obras sociales",
    noun: "obra social",
    newTitle: "Nueva obra social",
    fields: [
      { name: "name", label: "Nombre", full: true, required: true, placeholder: "Ej.: OSDE" },
      { name: "logo", label: "Logo (URL)", type: "url", full: true, hint: "Opcional. Si no hay logo, se muestra solo el nombre." },
    ],
    empty: { name: "", logo: "", order: 0 },
    title: (i) => i.name,
    meta: (i) => (i.logo ? "Con logo" : "Sin logo"),
  },
};

export const CONTENT_TABS = (Object.keys(CONTENT_CONFIG) as ContentKind[]).map((id) => ({
  id,
  label: CONTENT_CONFIG[id].label,
}));
