import { useMemo } from "react";
import type { ContentKind, ContentMap } from "@odonto/shared";
import { DEFAULT_CONTENT_ITEMS } from "@/data/defaultContent";
import { contentApi } from "@/services";
import { useApi } from "./useApi";

/**
 * Website content for the public pages. Uses what the clinic saved from the
 * dashboard; until there is any (or if the server is down) it falls back to
 * the original content, so the site is never empty.
 */
export function useContent<K extends ContentKind>(kind: K): ContentMap[K][] {
  const { data } = useApi(() => contentApi.list(kind), [kind]);

  return useMemo(() => {
    const saved = data?.items ?? [];
    const items = saved.length > 0 ? saved : DEFAULT_CONTENT_ITEMS[kind];
    return [...items].sort((a, b) => a.order - b.order);
  }, [data, kind]);
}
