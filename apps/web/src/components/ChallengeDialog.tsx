'use client'

import { useEffect, useId, useRef, useState } from 'react'
import {
  CHALLENGE_STATUS_LABELS,
  COUNTRIES,
  DIMENSIONS,
  DIMENSION_LABELS,
  MIN_DISPUTES_FOR_CONTESTED,
} from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { useRouter } from 'next/navigation'
import { objectionDetailHref, challengeApiHref } from '@/lib/links'
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

/** The single entry point for filing a score objection, kept in the header. */
export function ChallengeDialog() {
  const router = useRouter()
  const dialog = useRef<HTMLDialogElement>(null)
  const dialogId = useId()
  const [open, setOpen] = useState(false)
  const [iso3, setIso3] = useState<string>(COUNTRIES[0]!.iso3)
  const [dimension, setDimension] = useState<Dimension>(DIMENSIONS[0]!)
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

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
      >
        Challenge
      </Button>

      <dialog
        ref={dialog}
        id={dialogId}
        onClose={close}
        onClick={(event) => {
          if (event.target === dialog.current) close()
        }}
        className="m-auto max-h-[90dvh] w-[min(38rem,92vw)] rounded-xl border border-[var(--rule)] bg-[var(--surface)] p-0 text-left text-[var(--foreground)] backdrop:bg-black/50"
      >
        <form onSubmit={submit} className="max-h-[90dvh] space-y-5 overflow-y-auto p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="text-2xl font-light leading-tight">Challenge the benchmark</h2>
              <p className="mt-2 text-lg leading-relaxed text-[var(--muted)]">
                Choose a score and give the benchmark a specific reason to reconsider it.
              </p>
            </div>
            <Button type="button" size="sm" onClick={close}>
              Close
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-xs font-medium">
              Country
              <select
                value={iso3}
                onChange={(event) => setIso3(event.target.value)}
                className={fieldClass('mt-2 h-10 py-0')}
              >
                {COUNTRIES.map((country) => (
                  <option key={country.iso3} value={country.iso3}>
                    {country.name} ({country.iso3})
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-medium">
              Capability
              <select
                value={dimension}
                onChange={(event) => setDimension(event.target.value as Dimension)}
                className={fieldClass('mt-2 h-10 py-0')}
              >
                {DIMENSIONS.map((candidate) => (
                  <option key={candidate} value={candidate}>
                    {DIMENSION_LABELS[candidate]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="text-xs leading-relaxed text-[var(--muted)]">
            The selected score and confidence are read from the current country file when you
            submit.
          </p>

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
