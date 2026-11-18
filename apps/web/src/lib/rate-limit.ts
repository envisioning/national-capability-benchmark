/**
 * In-memory fixed-window rate limit, keyed by (bucket, identifier).
 *
 * Per server instance only: it stops one busy client, not a distributed one.
 * Copied from envisioning/www lib/rate-limit.ts for the MCP server.
 */

type Entry = { count: number; windowStart: number }

const buckets = new Map<string, Map<string, Entry>>()

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number }

export function checkRateLimit({
  bucket,
  identifier,
  windowMs,
  max,
}: {
  bucket: string
  identifier: string
  windowMs: number
  max: number
}): RateLimitResult {
  const now = Date.now()
  let store = buckets.get(bucket)
  if (!store) {
    store = new Map()
    buckets.set(bucket, store)
  }
  const entry = store.get(identifier)
  if (!entry || now - entry.windowStart >= windowMs) {
    /* Drop expired entries now and then, so one instance's map cannot grow without end. */
    if (store.size > 10_000) {
      for (const [key, e] of store) if (now - e.windowStart >= windowMs) store.delete(key)
    }
    store.set(identifier, { count: 1, windowStart: now })
    return { allowed: true }
  }
  entry.count += 1
  if (entry.count <= max) return { allowed: true }
  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - entry.windowStart)) / 1000)),
  }
}

/** Best-effort client IP. Vercel sets x-forwarded-for. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'anonymous'
  return request.headers.get('x-real-ip')?.trim() || 'anonymous'
}
