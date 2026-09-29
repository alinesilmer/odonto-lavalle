import { contactInfo } from "@/data/contactInfo";
import { buildWhatsappUrl } from "./whatsapp";

/**
 * Every link and label derived from the clinic's contact details, built once
 * so the footer, the contact page and the call-to-action blocks always agree.
 */

/** "3794001708" → "379 400-1708". */
export const formattedPhone = contactInfo.phone.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1 $2-$3");

export const displayAddress = "Lavalle 2690, Corrientes Capital";

export const instagramHandle = "@lavalle.odontologia";

export const phoneUrl = `tel:${contactInfo.phone}`;

export const emailUrl = `mailto:${contactInfo.email}`;

/** Always the WhatsApp number with the country code, which wa.me requires. */
export const clinicWhatsappUrl = (message?: string) => buildWhatsappUrl(contactInfo.whatsapp, message);

const mapQuery = encodeURIComponent(`${contactInfo.address}, Argentina`);

export const mapsUrl = `https://maps.google.com/?q=${mapQuery}`;

export const mapsEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`;
