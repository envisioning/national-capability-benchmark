/**
 * Cloudflare Turnstile, checked server-side.
 *
 * The widget is optional. Without TURNSTILE_SECRET_KEY this returns null,
 * which the caller reads as "not enforced", so the form works in development
 * and on a deployment that has not been given keys yet.
 */
export async function verifyTurnstile(
  token: string | null,
  ip: string | null,
): Promise<boolean | null> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim()
  if (!secret) return null
  if (!token) return false
  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip) body.set('remoteip', ip)
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body,
      },
    )
    const parsed = (await response.json()) as { success: boolean }
    return parsed.success === true
  } catch {
    return false
  }
}
