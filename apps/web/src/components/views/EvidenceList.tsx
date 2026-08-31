import Link from 'next/link'
import { COUNTRY_NAMES, EVIDENCE_STATUS_LABELS, INDICATORS_BY_ID } from '@ncb/core'
import { Icon } from '@/components/Icon'
import { CountryLabel, Meta } from '@/components/ui'
import { formatEvidenceMetricValue } from '@/lib/evidence'
import { countryProfileHref, evidenceHref } from '@/lib/links'
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
    <div className="evidence-list mt-6">
      <p className="mb-1 inline-flex items-center gap-2 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
        <Icon name="file-clock" size={14} />
        Evidence for missing indicators
      </p>
      <p className="evidence-list-intro mb-4 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        Each record describes a case the indicators above cannot see. It does not affect the score
        or confidence because one case is not comparable across countries. A gap can become an
        indicator when a comparable series covers at least two countries.
      </p>
      <ul className="evidence-list-items mt-5 grid list-none gap-4 p-0">
        {records.map((r) => {
          const def = INDICATORS_BY_ID[r.indicatorId]
          return (
            <li
              key={r.id}
              className="evidence-record-card rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-5 focus-within:border-[var(--muted)] sm:p-6"
            >
              <div className="evidence-record-meta mb-2 flex flex-wrap items-center gap-2">
                <Meta className="bg-[var(--surface)]">
                  <Link
                    href={countryProfileHref(r.iso3)}
                    className="font-medium underline underline-offset-4"
                  >
                    <CountryLabel iso3={r.iso3} name={COUNTRY_NAMES[r.iso3] ?? r.iso3} />
                  </Link>
                </Meta>
                <Meta className="bg-[var(--surface)]">linked to {def?.name ?? r.indicatorId}</Meta>
                <Meta className="bg-[var(--surface)]">started {r.started}</Meta>
                <Meta className="bg-[var(--surface)]">
                  {EVIDENCE_STATUS_LABELS[r.status]}
                </Meta>
              </div>
              <p className="evidence-record-title text-base font-medium tracking-tight">
                <Link href={evidenceHref(r.id)} className="underline underline-offset-4">
                  {r.title}
                </Link>
              </p>
              <p className="evidence-record-claim mt-2 text-lg leading-relaxed">{r.claim}</p>
              <p className="evidence-record-metrics mt-2 text-xs leading-relaxed text-[var(--muted)]">
                <span className="tabular-nums text-[var(--foreground)]">
                  {formatEvidenceMetricValue(r.metric.value, r.metric.unit)}
                </span>{' '}
                {r.metric.unit}, {r.metric.name.toLowerCase()}, {r.metric.asOf}.{' '}
                {r.secondMetric ? (
                  <>
                    <span className="tabular-nums text-[var(--foreground)]">
                      {formatEvidenceMetricValue(r.secondMetric.value, r.secondMetric.unit)}
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
                <p className="evidence-record-mechanism mt-4 max-w-3xl border-t border-[var(--rule-soft)] pt-4 text-sm leading-relaxed">
                  <span className="text-[var(--muted)]">How it worked: </span>
                  {r.pattern.mechanism}
                </p>
              ) : null}
              <p className="evidence-record-limits mt-4 flex max-w-3xl gap-2 rounded-md border border-[var(--rule-soft)] bg-[var(--surface-sunken)] p-3 text-xs leading-relaxed text-[var(--muted)]">
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
