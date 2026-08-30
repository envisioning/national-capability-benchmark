'use client'

import { useState } from 'react'
import { CONTACT_TOPICS, CONTACT_TOPIC_LABELS, MIN_CONTACT_MESSAGE } from '@ncb/core'
import type { ContactTopic } from '@ncb/core'
import { contactApiHref } from '@/lib/links'
import { Button, fieldClass } from '@/components/ui'

/**
 * The one form in the viewer that writes to a person.
 *
 * It posts to /api/contact, which forwards to the Envisioning CRM. Nothing is
 * stored in this repository, so nothing here needs a review queue. The topic
 * arrives preset from whichever page sent the reader, which is the only thing
 * a support page has to hand over. See D71.
 */

/* One control geometry for the whole site. A single-line field is the 40px
   button height, so the submit button lines up with the fields above it. */
const FIELD = fieldClass('mt-2 h-10')
const AREA = fieldClass('mt-2 min-h-36 py-2 leading-relaxed')

export function ContactForm({
  topic = 'general',
  draft = '',
}: {
  topic?: ContactTopic
  /** Opening text, where the page that sent the reader knows what this is about. */
  draft?: string
}) {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  /* The form's height at the moment it sent. The confirmation reserves it, so
     the page keeps its length and whatever follows the form stays put. */
  const [reserved, setReserved] = useState<number>()

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSending(true)
    setError(null)
    const element = event.currentTarget
    const height = element.offsetHeight
    const form = new FormData(element)
    const read = (key: string): string => String(form.get(key) ?? '').trim()
    try {
      const response = await fetch(contactApiHref, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: read('name'),
          email: read('email'),
          organization: read('organization'),
          country: read('country') || undefined,
          role: read('role') || undefined,
          topic: read('topic'),
          message: read('message'),
          newsletterOptIn: form.get('newsletterOptIn') === 'on',
        }),
      })
      const data = (await response.json()) as { error?: string; ok?: boolean }
      if (!response.ok || !data.ok) throw new Error(data.error ?? 'The message could not be sent.')
      setReserved(height)
      setSent(true)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The message could not be sent.')
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="max-w-3xl" style={{ minHeight: reserved }}>
        <p className="rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] px-4 py-3 text-lg leading-relaxed">
          Message sent. We will reply by email.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-xs font-medium">
          Your name
          <input name="name" required maxLength={200} className={FIELD} />
        </label>
        <label className="block text-xs font-medium">
          Email
          <input name="email" type="email" required maxLength={200} className={FIELD} />
        </label>
        <label className="block text-xs font-medium">
          Organization
          <input name="organization" required maxLength={200} className={FIELD} />
        </label>
        <label className="block text-xs font-medium">
          Role <span className="font-normal text-[var(--muted)]">(optional)</span>
          <input name="role" maxLength={200} className={FIELD} />
        </label>
      </div>

      <label className="block text-xs font-medium">
        Country <span className="font-normal text-[var(--muted)]">(optional)</span>
        <input name="country" maxLength={100} className={FIELD} placeholder="Brazil" />
      </label>

      <label className="block text-xs font-medium">
        What is this about
        <select name="topic" defaultValue={topic} className={FIELD}>
          {CONTACT_TOPICS.map((id) => (
            <option key={id} value={id}>
              {CONTACT_TOPIC_LABELS[id]}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-xs font-medium">
        Your message
        <textarea
          name="message"
          required
          minLength={MIN_CONTACT_MESSAGE}
          maxLength={4000}
          defaultValue={draft}
          className={AREA}
          placeholder="What are you working on, and what would you want from the benchmark?"
        />
      </label>

      <label className="flex items-start gap-3 text-xs leading-relaxed">
        <input name="newsletterOptIn" type="checkbox" className="mt-0.5" />
        <span>Send me the Envisioning newsletter as well.</span>
      </label>

      {error ? <p className="text-xs text-[#ef4444]">{error}</p> : null}

      <Button type="submit" variant="accent" disabled={sending}>
        {sending ? 'Sending' : 'Send message'}
      </Button>
    </form>
  )
}
