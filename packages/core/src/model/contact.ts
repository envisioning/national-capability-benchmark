import { z } from 'zod'

/**
 * The one contact contract.
 *
 * The viewer has a single communication page. Every other surface that invites
 * a reader to write, the support pages included, links to it and carries a
 * topic rather than growing a form of its own. One form means one payload, one
 * endpoint and one inbox, so a message never lands somewhere nobody reads.
 *
 * The shape mirrors the lead payload the Envisioning contact form already
 * sends, because both reach the same CRM. See D71.
 */

/** Why somebody is writing. The topic routes the message, it does not gate it. */
export const CONTACT_TOPICS = [
  'support',
  'data',
  'layer',
  'research',
  'general',
] as const

export type ContactTopic = (typeof CONTACT_TOPICS)[number]

/** What each topic says on the form. */
export const CONTACT_TOPIC_LABELS: Record<ContactTopic, string> = {
  support: 'Fund or host this work',
  data: 'Contribute a source, a series or an evidence record',
  layer: 'Build a country layer',
  research: 'Use the benchmark in research or policy',
  general: 'Something else',
}

/** Shortest message the form accepts. A one-line enquiry cannot be answered. */
export const MIN_CONTACT_MESSAGE = 20

/** Input accepted by the public contact endpoint. */
export const ContactSubmission = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  organization: z.string().trim().min(1).max(200),
  /** ISO 3166-1 alpha-2 where the form sends one, a written name where a caller does not. */
  country: z.string().trim().max(100).optional(),
  role: z.string().trim().max(200).optional(),
  topic: z.enum(CONTACT_TOPICS).default('general'),
  message: z.string().trim().min(MIN_CONTACT_MESSAGE).max(4000),
  newsletterOptIn: z.boolean().optional(),
  /** Cloudflare Turnstile. Absent while the keys are unset, checked once they are. */
  token: z.string().max(4000).optional(),
})
export type ContactSubmission = z.infer<typeof ContactSubmission>
