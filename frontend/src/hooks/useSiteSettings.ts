import { useMemo } from "react";
import type { SiteSettingsDto } from "@odonto/shared";
import { DEFAULT_SITE_SETTINGS } from "@/data/siteSettings";
import { settingsApi } from "@/services";
import { useApi } from "./useApi";

/**
 * Site settings with defaults filled in: a value the clinic hasn't set yet
 * (0) or an unreachable server falls back to DEFAULT_SITE_SETTINGS.
 */
export function useSiteSettings() {
  const state = useApi(() => settingsApi.get(), []);
  const settings = useMemo<SiteSettingsDto>(
    () => ({
      consultationPrice: state.data?.consultationPrice || DEFAULT_SITE_SETTINGS.consultationPrice,
    }),
    [state.data],
  );
  return { settings, reload: state.reload, loading: state.loading };
}
