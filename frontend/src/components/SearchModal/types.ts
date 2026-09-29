export const SEARCH_CATEGORIES = [
  "Servicio",
  "Turnos",
  "Contacto",
  "Nosotros",
  "Paciente",
] as const;
export type SearchCategory = (typeof SEARCH_CATEGORIES)[number];

export const SEARCH_ICONS = ["tooth", "stethoscope", "calendar", "phone", "info"] as const;
export type SearchIconName = (typeof SEARCH_ICONS)[number];

export interface SearchItem {
  title: string;
  description?: string;
  url: string;
  category: SearchCategory;
  icon?: SearchIconName;
  /** Extra terms that should match this entry but are not shown. */
  keywords?: string[];
}
