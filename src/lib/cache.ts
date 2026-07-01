// Tiny in-memory TTL cache (per Worker isolate). Cloudflare keeps isolates warm
// for minutes, so most requests hit the cache — this turns the slow external-API
// calls (BeatStars pagination, Google Drive) into near-instant repeat responses.
type Entry = { value: unknown; expires: number };

const store = new Map<string, Entry>();

export function cacheGet<T>(key: string): T | undefined {
  const hit = store.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as T;
  if (hit) store.delete(key); // expired
  return undefined;
}

export function cacheSet(key: string, value: unknown, ttlMs: number): void {
  store.set(key, { value, expires: Date.now() + ttlMs });
}
