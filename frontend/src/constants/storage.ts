/** Every localStorage key the app owns, namespaced so nothing collides. */
export const STORAGE_KEYS = {
  session: "odonto.auth",
  publicMessageRate: "odonto.public-message-rate",
  recentSearches: "odonto.recent-searches",
} as const;
