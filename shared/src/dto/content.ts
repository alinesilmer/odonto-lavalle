/** Website content the clinic edits from the dashboard: FAQ, services and accepted obras sociales. */

export const CONTENT_KINDS = ["faqs", "services", "insurances"] as const;
export type ContentKind = (typeof CONTENT_KINDS)[number];

export const SERVICE_CATEGORIES_CONTENT = ["estetica", "cirugia", "tratamiento de conducto", "otros"] as const;
export type ServiceCategoryContent = (typeof SERVICE_CATEGORIES_CONTENT)[number];

export interface FaqDto {
  id: string;
  question: string;
  answer: string;
  /** Position on the site; lower first. */
  order: number;
}

export interface ServiceDto {
  id: string;
  title: string;
  description: string;
  /** Photo URL. */
  image: string;
  category: ServiceCategoryContent;
  order: number;
}

export interface InsuranceDto {
  id: string;
  name: string;
  /** Logo URL (optional; the name is always shown). */
  logo: string;
  order: number;
}

export interface ContentMap {
  faqs: FaqDto;
  services: ServiceDto;
  insurances: InsuranceDto;
}

/** What a create/update request carries: every field but the id. */
export type ContentInput<K extends ContentKind> = Omit<ContentMap[K], "id">;

/** Single values the clinic edits from the dashboard (one document, not a list). */
export interface SiteSettingsDto {
  /** Price of the first consultation, in ARS; shown when booking at /turno. */
  consultationPrice: number;
}
