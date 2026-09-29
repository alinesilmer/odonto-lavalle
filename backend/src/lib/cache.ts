/**
 * A tiny in-memory read cache for lists every visitor asks for (site content,
 * settings, the patient list the search box filters). Writes call
 * `invalidate`, so a change shows up at once; the TTL only bounds staleness
 * from changes made outside the API (scripts, the Firebase console).
 */
const entries = new Map<string, { value: Promise<unknown>; expiresAt: number }>();

export function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const hit = entries.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.value as Promise<T>;

  const value = load();
  entries.set(key, { value, expiresAt: Date.now() + ttlMs });
  // A failed load must not be served from the cache.
  value.catch(() => entries.delete(key));
  return value;
}

/** Forgets every entry whose key starts with `prefix`. */
export function invalidate(prefix: string): void {
  for (const key of entries.keys()) if (key.startsWith(prefix)) entries.delete(key);
}
