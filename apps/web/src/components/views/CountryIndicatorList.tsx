import { INDICATORS_BY_ID } from '@ncb/core'
import type { DimensionResult, EvidenceRecord } from '@ncb/core'
import { IndicatorPeek } from '@/components/views/IndicatorPeek'
import { ClassBadge, Score, Sparkline } from '@/components/ui'
import { Icon, STATUS_ICON } from '@/components/Icon'

type IndicatorRow = DimensionResult['indicators'][number]

/**
 * Indicator records on a country page.
 *
 * The previous layout put every field in one wide table row. Long registry
 * notes then made the first cell narrow and stretched the row vertically,
 * leaving the actual values hard to scan. These records use the same card and
 * labelled-facts pattern as the delivery register: identity and status first,
 * then the values in a small responsive grid, with notes given the full width.
 */
export function CountryIndicatorList({
  indicators,
  countryIso3,
  evidence,
}: {
  indicators: IndicatorRow[]
  countryIso3: string
  evidence: EvidenceRecord[]
}) {
  const evidenceCount = new Map<string, number>()
  for (const record of evidence) {
    evidenceCount.set(record.indicatorId, (evidenceCount.get(record.indicatorId) ?? 0) + 1)
  }

  return (
    <div className="space-y-4" role="list" aria-label="Country indicators">
      {indicators.map((row) => (
        <IndicatorCard
          key={row.indicatorId}
          row={row}
          countryIso3={countryIso3}
          evidenceCount={evidenceCount.get(row.indicatorId) ?? 0}
        />
      ))}
    </div>
  )
}

function IndicatorCard({
  row,
  countryIso3,
  evidenceCount,
}: {
  row: IndicatorRow
  countryIso3: string
  evidenceCount: number
}) {
  const def = INDICATORS_BY_ID[row.indicatorId]
  const status =
    row.status === 'gap'
      ? gapLabel(evidenceCount)
      : row.status === 'retired'
        ? 'retired, see notes'
        : row.status

  return (
    <article
      role="listitem"
      className="rounded-lg border border-[var(--rule)] bg-[var(--surface)]"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-[var(--rule-soft)] px-4 py-3 sm:px-5">
        <h3 className="min-w-0 text-base font-medium tracking-tight">
          {row.status === 'observed' ? (
            <IndicatorPeek indicatorId={row.indicatorId} iso3={countryIso3}>
              {row.name}
            </IndicatorPeek>
          ) : (
            row.name
          )}
        </h3>
        <ClassBadge value={row.measurementClass} />
        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)]">
          <Icon name={STATUS_ICON[row.status]} size={13} />
          {status}
        </span>
      </div>

      <dl className="grid gap-x-6 gap-y-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-5">
        <Fact label="Raw value">
          <span className="tabular-nums">{row.raw ?? 'no data'}</span>
          <span className="mt-1 block text-xs text-[var(--muted)]">{def?.unit ?? '—'}</span>
        </Fact>
        <Fact label="Year">
          <span className="tabular-nums">{row.year ?? '—'}</span>
        </Fact>
        <Fact label="Normalized">
          <span className="inline-flex items-center gap-2">
            {row.status === 'observed' ? (
              <IndicatorPeek indicatorId={row.indicatorId} iso3={countryIso3}>
                <Score value={row.normalized} size="sm" />
              </IndicatorPeek>
            ) : (
              <Score value={row.normalized} size="sm" />
            )}
            {row.outOfFrame ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-[var(--muted)]">
                <Icon name="triangle-alert" size={11} />
                clamped
              </span>
            ) : null}
          </span>
        </Fact>
        <Fact label="Source">
          <span className="break-words text-[var(--muted)]">{row.source}</span>
        </Fact>
        <Fact label="History">
          {row.series.length > 1 ? (
            <Sparkline series={seriesForSparkline(row.series)} width={110} height={24} />
          ) : (
            <span className="text-[var(--muted)]">—</span>
          )}
        </Fact>
      </dl>

      {row.status !== 'observed' && def?.notes ? (
        <p className="mx-4 mb-4 flex gap-2 rounded-md border border-[var(--rule-soft)] bg-[var(--surface-sunken)] p-3 text-xs leading-relaxed text-[var(--muted)] sm:mx-5 sm:mb-5">
          <Icon name="triangle-alert" size={13} className="mt-0.5 shrink-0" />
          <span>
            <span className="font-medium text-[var(--foreground)]">Note: </span>
            {def.notes}
          </span>
        </p>
      ) : null}
    </article>
  )
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs uppercase tracking-[0.05em] text-[var(--muted)]">{label}</dt>
      <dd className="mt-1 min-h-6 text-xs leading-relaxed">{children}</dd>
    </div>
  )
}

function gapLabel(records: number): string {
  if (records === 0) return 'no dataset exists'
  return records === 1 ? 'no dataset exists, 1 record' : `no dataset exists, ${records} records`
}

function seriesForSparkline(
  series: Array<{ year: number; normalized: number }>,
): Array<{ year: number; score: number }> {
  return series.map((point) => ({ year: point.year, score: point.normalized }))
}
