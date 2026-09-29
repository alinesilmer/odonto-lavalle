import { z } from "zod";
import { SERVICE_CATEGORIES_CONTENT, type ContentKind } from "@odonto/shared";

const order = z.coerce.number().int().min(0).default(0);
const url = z.string().trim().max(1000).default("");

/** One validation schema per content kind; the route picks it from the URL. */
export const contentSchemas = {
  faqs: z.object({
    question: z.string().trim().min(3).max(300),
    answer: z.string().trim().min(3).max(4000),
    order,
  }),
  services: z.object({
    title: z.string().trim().min(2).max(120),
    description: z.string().trim().min(3).max(1000),
    image: url,
    category: z.enum(SERVICE_CATEGORIES_CONTENT),
    order,
  }),
  insurances: z.object({
    name: z.string().trim().min(2).max(120),
    logo: url,
    order,
  }),
} satisfies Record<ContentKind, z.ZodObject>;

export const siteSettingsSchema = z.object({
  consultationPrice: z.coerce.number().int().min(0).max(100_000_000),
});
