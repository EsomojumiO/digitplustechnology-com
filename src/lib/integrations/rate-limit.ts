/**
 * rate-limit.ts — Lightweight in-memory fixed-window rate limiter.
 *
 * Keyed by `${endpoint}:${ip}`. Default: 5 requests / 60s per endpoint per IP.
 *
 *   BLOCKER: this is PER-INSTANCE in-memory state. On serverless/multi-instance
 *   hosting (Vercel) each instance has its own window, and cold starts reset it,
 *   so it is best-effort abuse mitigation only. Production should use a shared
 *   store (Upstash Redis / @upstash/ratelimit). Logged in docs/BLOCKERS.md.
 */

export interface RateLimitOptions {
  /** Max requests allowed within the window. Default 5. */
  limit?: number;
  /** Window size in milliseconds. Default 60_000 (60s). */
  windowMs?: number;
}

export interface RateLimitResult {
  /** True if the request is within budget and may proceed. */
  allowed: boolean;
  /** Remaining requests in the current window. */
  remaining: number;
  /** Configured limit. */
  limit: number;
  /** Seconds until the current window resets (for Retry-After). */
  retryAfter: number;
}

interface Bucket {
  count: number;
  /** Epoch ms when the window resets. */
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Occasionally sweep expired buckets so the map can't grow unbounded. */
function sweep(now: number): void {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Check (and consume) one unit of budget for `key` under `endpoint`.
 * Call once per request, before doing work.
 */
export function rateLimit(
  key: string,
  endpoint: string,
  options: RateLimitOptions = {},
): RateLimitResult {
  const limit = options.limit ?? 5;
  const windowMs = options.windowMs ?? 60_000;
  const now = Date.now();
  const id = `${endpoint}:${key}`;

  sweep(now);

  let bucket = buckets.get(id);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(id, bucket);
  }

  bucket.count += 1;
  const retryAfter = Math.max(0, Math.ceil((bucket.resetAt - now) / 1000));

  if (bucket.count > limit) {
    return { allowed: false, remaining: 0, limit, retryAfter };
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - bucket.count),
    limit,
    retryAfter,
  };
}

/**
 * Extract a best-effort client IP from request headers.
 * Reads `x-forwarded-for` (first hop) then `x-real-ip`; falls back to "unknown".
 */
export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}
