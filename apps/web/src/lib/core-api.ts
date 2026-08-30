import { createHmac } from 'node:crypto'

/**
 * The single path from this viewer to core.envisioning.com.
 *
 * Every request is signed with INTERNAL_REQUEST_SECRET. Core verifies the HMAC
 * rather than a Turnstile token, because a Turnstile token is single use and
 * the caller has already redeemed one, so Core cannot re-verify it. Signing is
 * the only way a server-to-server call gets through.
 *
 * Do not call Core with a bare fetch from anywhere else. Routing every POST
 * through here is what stops a new call site from silently missing the
 * signature. The same contract runs in envisioning.com and event-bff; on the
 * main site that exact mistake went unnoticed for ten weeks. See D71.
 *
 * This module imports `node:crypto`, so it may only be imported from a route
 * handler or a server component. A `node:` import reaching the browser graph
 * fails the production build at bundle time, not at typecheck.
 */

export const CORE_API_URL = process.env.CORE_API_URL ?? 'https://core.envisioning.com'

/** Where a lead is filed, and where an opt-in enters the double opt-in flow. */
export const LEADS_PATH = '/api/public/leads'
export const SUBSCRIBE_PATH = '/api/public/newsletter-subscribe'

export type CoreResult = { ok: true } | { ok: false; status: number; error: string }

function signInternalRequest(rawBody: string): Record<string, string> {
  const secret = process.env.INTERNAL_REQUEST_SECRET?.trim()
  if (!secret) return {}
  const timestamp = String(Date.now())
  const signature = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex')
  return { 'x-internal-timestamp': timestamp, 'x-internal-signature': signature }
}

/**
 * True once the signing secret is present. Without it Core rejects the call,
 * so the route says so and the page offers the mail address instead of showing
 * a reader an error they cannot act on.
 */
export const coreConfigured = (): boolean =>
  Boolean(process.env.INTERNAL_REQUEST_SECRET?.trim())

/** `status` is 0 when the request never reached Core. */
export async function postToCore(
  path: string,
  payload: unknown,
  options: { fallbackError?: string; timeoutMs?: number } = {},
): Promise<CoreResult> {
  const { fallbackError = 'Request failed', timeoutMs = 10_000 } = options
  const rawBody = JSON.stringify(payload)

  let response: Response
  try {
    response = await fetch(`${CORE_API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...signInternalRequest(rawBody) },
      body: rawBody,
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (caught) {
    return {
      ok: false,
      status: 0,
      error:
        caught instanceof Error
          ? `Upstream unreachable: ${caught.message}`
          : 'Upstream unreachable',
    }
  }

  if (response.ok) return { ok: true }

  const text = await response.text().catch(() => '')
  let body: { message?: string; error?: string; reason?: string } | null = null
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    /* Core returned a non-JSON body; fall back to the raw text below. */
  }

  return {
    ok: false,
    status: response.status,
    error:
      body?.message ||
      body?.error ||
      body?.reason ||
      text.slice(0, 300) ||
      `${response.status} ${response.statusText}` ||
      fallbackError,
  }
}
