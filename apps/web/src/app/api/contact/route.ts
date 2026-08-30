import { NextResponse, type NextRequest } from 'next/server'
import { CONTACT_TOPIC_LABELS, ContactSubmission } from '@ncb/core'
import { LEADS_PATH, SUBSCRIBE_PATH, coreConfigured, postToCore } from '@/lib/core-api'
import { verifyTurnstile } from '@/lib/turnstile'

export const runtime = 'nodejs'

/**
 * The contact endpoint.
 *
 * Nothing is stored here. The enquiry goes straight to Core, which owns the
 * CRM and already fans a new lead out to the sender's confirmation mail, the
 * team notification and Slack. A second copy in this repository would be a
 * copy to keep in sync and a copy to leak. A dispute is different: it is
 * published beside the number it argues with, which is why /api/challenge
 * writes to disk and this route does not. See D71.
 */

/** Where the enquiry came from. Written into the message, not sent as a field. */
const SOURCE = 'ncb.envisioning.com/contact'

/** Core insists on a country. Vercel's edge geo fills it when the sender does not. */
const DEFAULT_COUNTRY = 'US'

function clientIp(request: NextRequest): string | null {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    null
  )
}

export async function POST(request: NextRequest): Promise<Response> {
  let body: ContactSubmission
  try {
    body = ContactSubmission.parse(await request.json())
  } catch {
    return NextResponse.json(
      { error: 'name, email, organization and a message of at least 20 characters are required' },
      { status: 400 },
    )
  }

  /* Turnstile is redeemed here. Core cannot re-check it, because the token is
     single use, which is why the onward call is HMAC-signed instead. */
  const verified = await verifyTurnstile(body.token ?? null, clientIp(request))
  if (verified === false) {
    return NextResponse.json({ error: 'verification failed' }, { status: 403 })
  }

  if (!coreConfigured()) {
    return NextResponse.json({ error: 'the contact endpoint is not configured' }, { status: 503 })
  }

  const geo = request.headers.get('x-vercel-ip-country')?.trim()

  /* `sourcePage` is deliberately absent: Core answers 500 "Failed to create
     lead" when that field is present, the trap envisioning.com and event-bff
     both document. The origin and the topic go into the message instead, so
     nothing is lost. */
  const sent = await postToCore(
    LEADS_PATH,
    {
      name: body.name,
      email: body.email,
      /* Core rejects an empty title; mirror the placeholder the other sites send. */
      title: body.role?.trim() || 'Not provided',
      organization: body.organization,
      country: body.country?.trim() || geo || DEFAULT_COUNTRY,
      message: `${body.message}\n\nTopic: ${CONTACT_TOPIC_LABELS[body.topic]}\nVia ${SOURCE}`,
      /* "Information only" in Core. A benchmark enquiry is not a request for
         an offer, and this keeps it out of the pipeline's offer flow. */
      requestOffer: false,
    },
    { fallbackError: 'Could not send the message' },
  )

  if (!sent.ok) {
    console.error('[contact] upstream rejected the message:', sent.status, sent.error)
    return NextResponse.json({ error: 'the message could not be delivered' }, { status: 502 })
  }

  /* The opt-in is a separate subscription so it enters the same double opt-in
     flow the newsletter uses. A failure here must not lose an enquiry that has
     already reached the CRM. */
  if (body.newsletterOptIn) {
    const subscribed = await postToCore(SUBSCRIBE_PATH, { email: body.email })
    if (!subscribed.ok) {
      console.warn('[contact] newsletter opt-in failed:', subscribed.status, subscribed.error)
    }
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
