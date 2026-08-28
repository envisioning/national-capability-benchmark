import Link from 'next/link'
import { EVIDENCE_STATUS_LABELS, INDICATORS_BY_ID } from '@ncb/core'
import { Icon } from '@/components/Icon'
import { evidenceHref } from '@/lib/links'
import type { EvidenceRecord } from '@ncb/core'

/**
 * Documented deliveries filed against an indicator that has no dataset.
 *
 * These records are the data-collection agenda made concrete. They carry a
 * source, a reference period and their own limits, and they stay outside the
 * score and the confidence. See docs/DECISIONS.md D20.
 */
export function EvidenceList({ records }: { records: EvidenceRecord[] }) {
  if (records.length === 0) return null

  return (
    <div className="mt-6 rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] p-4">
      <p className="mb-1 inline-flex items-center gap-2 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
        <Icon name="file-clock" size={14} />
        Evidence for indicators with no dataset
      </p>
      <p className="mb-4 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        Each record documents something the indicators above cannot see. Records stay outside the
        score and outside the confidence, because one country with a case study is still one
        country. They become a score when a comparable series covers at least two
        countries.
      </p>
      <ul className="space-y-5">
        {records.map((r) => {
          const def = INDICATORS_BY_ID[r.indicatorId]
          return (
            <li key={r.id}>
              <p className="text-xs font-medium tracking-tight">
                <Link href={evidenceHref(r.id)} className="underline underline-offset-4">
                  {r.title}
                </Link>
                <span className="ml-2 font-normal text-[var(--muted)]">
                  bears on {def?.name ?? r.indicatorId}, since {r.started},{' '}
                  {EVIDENCE_STATUS_LABELS[r.status]}
                </span>
              </p>
              <p className="mt-1 text-lg leading-relaxed">{r.claim}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                <span className="tabular-nums text-[var(--foreground)]">
                  {r.metric.value.toLocaleString('en-US')}
                </span>{' '}
                {r.metric.unit}, {r.metric.name.toLowerCase()}, {r.metric.asOf}.{' '}
                {r.secondMetric ? (
                  <>
                    <span className="tabular-nums text-[var(--foreground)]">
                      {r.secondMetric.value.toLocaleString('en-US')}
                    </span>{' '}
                    {r.secondMetric.unit}, {r.secondMetric.name.toLowerCase()},{' '}
                    {r.secondMetric.asOf}.{' '}
                  </>
                ) : null}
                <a
                  href={r.source.url}
                  className="underline underline-offset-2"
                  rel="noreferrer"
                  target="_blank"
                >
                  {r.source.publisher}
                </a>
                , retrieved {r.source.retrievedAt}.
              </p>
              {r.pattern ? (
                <p className="mt-1 max-w-3xl text-xs leading-relaxed">
                  <span className="text-[var(--muted)]">The move: </span>
                  {r.pattern.mechanism}
                </p>
              ) : null}
              <p className="mt-1 flex max-w-3xl gap-2 text-xs leading-relaxed text-[var(--muted)]">
                <Icon name="triangle-alert" size={13} className="mt-0.5 shrink-0" />
                <span>Limits: {r.limits}</span>
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
