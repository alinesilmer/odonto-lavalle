import type { SiteSettingsDto } from "@odonto/shared";
import { collections, db } from "../config/firebase.js";
import { cached, invalidate } from "../lib/cache.js";
import { fieldsOf, num } from "../lib/firestore.js";

const SETTINGS_CACHE = "settings:site";

/** All site settings live in one document. */
const settingsDoc = () => db.collection(collections.settings).doc("site");

/** 0 means "not set yet"; the site then keeps its own default. */
export function getSiteSettings(): Promise<SiteSettingsDto> {
  // Read on every /turno visit; cached, and cleared when an admin saves.
  return cached(SETTINGS_CACHE, 5 * 60_000, async () => {
    const d = fieldsOf(await settingsDoc().get());
    return { consultationPrice: num(d.consultationPrice) };
  });
}

export async function updateSiteSettings(patch: Partial<SiteSettingsDto>): Promise<SiteSettingsDto> {
  await settingsDoc().set(patch, { merge: true });
  invalidate(SETTINGS_CACHE);
  return getSiteSettings();
}
