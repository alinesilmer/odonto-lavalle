import type { SiteSettingsDto } from "@odonto/shared";

/** Used until the clinic saves its own values from the dashboard. */
export const DEFAULT_SITE_SETTINGS: SiteSettingsDto = {
  consultationPrice: 30000,
};
