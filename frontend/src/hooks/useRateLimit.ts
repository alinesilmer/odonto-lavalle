import { useCallback, useEffect, useState } from "react";
import { readJson, remove, writeJson } from "@/utils/storage";

interface Window {
  count: number;
  firstAt: number;
}

export interface RateLimit {
  /** True once the allowance for the current window is spent. */
  blocked: boolean;
  /** Records one use. Returns false when the caller should not have proceeded. */
  consume: () => boolean;
}

/**
 * A best-effort "N actions per window" guard kept in localStorage.
 *
 * It only stops honest mistakes and double-clicks — anyone can clear storage —
 * so the server still enforces the real limit.
 */
export function useRateLimit(key: string, limit: number, windowMs: number): RateLimit {
  const [blocked, setBlocked] = useState(false);

  const load = useCallback((): Window => {
    const stored = readJson<Window>(key);
    if (!stored || Date.now() - stored.firstAt > windowMs) {
      if (stored) remove(key);
      return { count: 0, firstAt: Date.now() };
    }
    return stored;
  }, [key, windowMs]);

  useEffect(() => {
    setBlocked(load().count >= limit);
  }, [load, limit]);

  const consume = useCallback(() => {
    const current = load();
    if (current.count >= limit) {
      setBlocked(true);
      return false;
    }

    const next = { ...current, count: current.count + 1 };
    writeJson(key, next);
    setBlocked(next.count >= limit);
    return true;
  }, [key, limit, load]);

  return { blocked, consume };
}
