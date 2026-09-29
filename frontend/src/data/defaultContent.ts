import { DEFAULT_CONTENT, type ContentKind, type ContentMap } from "@odonto/shared";

/**
 * The original content with ids, shaped like an API response. The public site
 * shows it while the dashboard has not saved any (or the server is down).
 */
export const DEFAULT_CONTENT_ITEMS = Object.fromEntries(
  (Object.keys(DEFAULT_CONTENT) as ContentKind[]).map((kind) => [
    kind,
    DEFAULT_CONTENT[kind].map((item, i) => ({ ...item, id: `default-${kind}-${i}` })),
  ]),
) as { [K in ContentKind]: ContentMap[K][] };
