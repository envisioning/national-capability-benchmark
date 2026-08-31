'use client'

import { useEffect, useRef, useState } from 'react'
import { CHALLENGE_STATUS_LABELS, DIMENSION_LABELS, MIN_DISPUTES_FOR_CONTESTED } from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { useRouter } from 'next/navigation'
import { challengeApiHref, objectionDetailHref } from '@/lib/links'
import { Button, fieldClass } from '@/components/ui'

export function ContestedBadge({ count }: { count: number }) {
  if (count < MIN_DISPUTES_FOR_CONTESTED) return null
  return (
    <span
      className="inline-flex items-center rounded-md border border-[#ef4444]/40 px-1.5 py-0.5 text-[10px] font-medium text-[#ef4444]"
    >
      Contested ({count})
      <span className="sr-only">
        {count} non-rejected disputes from distinct countries target this dimension.
      </span>
    </span>
  )
}

export function ChallengeLink({
  iso3,
  country,
  dimension,
  value,
  confidence,
}: {
  iso3: string
  country?: string
  dimension: Dimension
  value: number | null
  confidence: number | null
}) {
  const router = useRouter()
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const [argument, setArgument] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])

  if (value === null) return null

  function close() {
    setOpen(false)
    setError(null)
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const response = await fetch(challengeApiHref(iso3, dimension), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          argument,
          ...(sourceUrl.trim() ? { sourceUrl: sourceUrl.trim() } : {}),
        }),
      })
      const data = (await response.json()) as { error?: string; id?: string }
      if (!response.ok || !data.id) throw new Error(data.error ?? 'Could not submit the dispute.')
      router.push(objectionDetailHref(data.id))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not submit the dispute.')
      setSubmitting(false)
    }
  }

  const countryLabel = country ? `${country} (${iso3})` : iso3

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-[var(--rule)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
      >
        Challenge
      </button>

      <dialog
        ref={dialog}
        onClose={close}
        onClick={(event) => {
          if (event.target === dialog.current) close()
        }}
        className="m-auto w-[min(38rem,92vw)] rounded-xl border border-[var(--rule)] bg-[var(--surface)] p-0 text-left text-[var(--foreground)] backdrop:bg-black/50"
      >
        <form onSubmit={submit} className="space-y-5 p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="text-2xl font-light leading-tight">This score can be challenged</h2>
              <p className="mt-2 text-lg leading-relaxed text-[var(--muted)]">
                Give the benchmark a specific reason to reconsider this number.
              </p>
            </div>
            <Button type="button" size="sm" onClick={close}>
              Close
            </Button>
          </div>

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs">
            <dt className="text-[var(--muted)]">Country</dt>
            <dd className="font-medium">{countryLabel}</dd>
            <dt className="text-[var(--muted)]">Dimension</dt>
            <dd className="font-medium">{DIMENSION_LABELS[dimension]}</dd>
            <dt className="text-[var(--muted)]">Score</dt>
            <dd className="tabular-nums">{value.toFixed(1)}</dd>
            <dt className="text-[var(--muted)]">Confidence</dt>
            <dd className="tabular-nums">{confidence === null ? 'no data' : confidence.toFixed(2)}</dd>
          </dl>

          <label className="block text-xs font-medium">
            Your argument
            <textarea
              required
              minLength={20}
              maxLength={4000}
              value={argument}
              onChange={(event) => setArgument(event.target.value)}
              className={fieldClass('mt-2 min-h-36 py-2 leading-relaxed')}
              placeholder="What evidence or reasoning shows that this score misreads the country?"
            />
          </label>

          <label className="block text-xs font-medium">
            Source URL <span className="font-normal text-[var(--muted)]">(optional)</span>
            <input
              type="url"
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
              className={fieldClass('mt-2 h-10')}
              placeholder="https://"
            />
          </label>

          {error ? <p className="text-xs text-[#ef4444]">{error}</p> : null}
          <p className="text-xs leading-relaxed text-[var(--muted)]">
            Submissions are public and start as {CHALLENGE_STATUS_LABELS.submitted}. A maintainer
            can add a response and signature after review.
          </p>
          <div className="flex justify-end gap-3">
            <Button type="button" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit dispute'}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  )
}
