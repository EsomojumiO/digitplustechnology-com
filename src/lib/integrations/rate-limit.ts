/**
 * rate-limit.ts — Fixed-window rate limiter with a shared-store backend.
 *
 * Keyed by `${endpoint}:${ip}`. Default: 5 requests / 60s per endpoint per IP.
 *
 * Two backends, selected by env (no SDK dependency, mirrors the other REST
 * adapters):
 *   1. Upstash Redis (PRODUCTION) — when UPSTASH_REDIS_REST_URL +
 *      UPSTASH_REDIS_REST_TOKEN are set. A single atomic EVAL (INCR + EXPIRE +
 *      PTTL) gives a correct shared window across all serverless instances.
 *   2. In-memory fallback (DEV / no env) — per-instance fixed window. Fine for
 *      local dev; on multi-instance serverless each instance keeps its own
 *      window, so set Upstash for production.
 *
 * Fails OPEN: if Upstash is unreachable, the request is allowed (availability
 * over strictness) and a warning is logged.
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

function hasUpstash(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

/** Atomic INCR + first-hit EXPIRE; returns [count, pttlMs]. */
const WINDOW_SCRIPT =
  "local c = redis.call('INCR', KEYS[1]) " +
  "if c == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end " +
  "return {c, redis.call('PTTL', KEYS[1])}";

/** Occasionally sweep expired buckets so the in-memory map can't grow unbounded. */
function sweep(now: number): void {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function inMemory(
  id: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
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

async function upstash(
  id: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL!.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(["EVAL", WINDOW_SCRIPT, "1", id, String(windowMs)]),
    // Don't let a slow Redis stall a form submission.
    signal: AbortSignal.timeout(2000),
  });

  if (!res.ok) {
    throw new Error(`Upstash ${res.status}`);
  }

  const data = (await res.json()) as { result?: [number, number] };
  const [count, pttl] = data.result ?? [1, windowMs];
  const retryAfter = Math.max(0, Math.ceil(pttl / 1000));

  if (count > limit) {
    return { allowed: false, remaining: 0, limit, retryAfter };
  }
  return {
    allowed: true,
    remaining: Math.max(0, limit - count),
    limit,
    retryAfter,
  };
}

/**
 * Check (and consume) one unit of budget for `key` under `endpoint`.
 * Call once per request, before doing work.
 */
export async function rateLimit(
  key: string,
  endpoint: string,
  options: RateLimitOptions = {},
): Promise<RateLimitResult> {
  const limit = options.limit ?? 5;
  const windowMs = options.windowMs ?? 60_000;
  const id = `rl:${endpoint}:${key}`;

  if (hasUpstash()) {
    try {
      return await upstash(id, limit, windowMs);
    } catch (e) {
      // Fail open — availability over strictness — but make it visible.
      console.warn(
        `[rate-limit] Upstash unreachable, allowing request:`,
        e instanceof Error ? e.message : e,
      );
      return { allowed: true, remaining: limit, limit, retryAfter: 0 };
    }
  }

  return inMemory(id, limit, windowMs);
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
