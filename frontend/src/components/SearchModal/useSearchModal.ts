import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { STORAGE_KEYS } from "@/constants";
import { readJson, writeJson } from "@/utils/storage";
import { normalizeText } from "@/utils/text";
import type { SearchItem } from "./types";

const MAX_RESULTS = 8;
const MAX_RECENTS = 6;
const FOCUS_DELAY_MS = 80;

function matches(item: SearchItem, needle: string): boolean {
  const haystack = [item.title, item.description ?? "", ...(item.keywords ?? []), item.category]
    .map(normalizeText)
    .join(" ");
  return haystack.includes(needle);
}

export function useSearchModal(data: SearchItem[], open: boolean, onClose: () => void) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [recents, setRecents] = useState<string[]>(
    () => readJson<string[]>(STORAGE_KEYS.recentSearches) ?? [],
  );

  const results = useMemo(() => {
    const needle = normalizeText(query);
    if (!needle) return [];
    return data.filter((item) => matches(item, needle)).slice(0, MAX_RESULTS);
  }, [query, data]);

  const go = useCallback(
    (item: SearchItem) => {
      const term = query || item.title;
      const next = [term, ...recents.filter((r) => r !== term)].slice(0, MAX_RECENTS);
      setRecents(next);
      writeJson(STORAGE_KEYS.recentSearches, next);

      onClose();
      navigate(item.url);
    },
    [navigate, onClose, query, recents],
  );

  // Focus the field once the palette has opened (Modal handles scroll lock and Escape).
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), FOCUS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelected((current) => Math.min(current + 1, results.length - 1));
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelected((current) => Math.max(current - 1, 0));
          break;
        case "Enter": {
          const item = results[selected];
          if (item) go(item);
          break;
        }
        default:
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, results, selected, go]);

  return {
    inputRef,
    query,
    setQuery: useCallback((value: string) => {
      setQuery(value);
      setSelected(0);
    }, []),
    selected,
    setSelected,
    results,
    recents,
    go,
  };
}
