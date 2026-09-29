/**
 * Display-only shapes for the marketing site's static content.
 *
 * Everything that crosses the wire is typed by `@odonto/shared`, and the
 * dashboard's row shapes live in `src/services/adapters.ts`.
 */

export interface ContactInfo {
  phone: string;
  /** Includes the country code, for wa.me links. */
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
}

export interface Testimonial {
  id: string;
  name: string;
  date: string;
  text: string;
  avatar: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: "card" | "cash" | "transfer";
}
