import Link from 'next/link'
import { INDICATORS_BY_ID, MAX_SCORED_VALUE_AGE, rawUnit, valueInUnit } from '@ncb/core'
import type { DimensionResult, EvidenceRecord } from '@ncb/core'
import { Icon, STATUS_ICON } from '@/components/Icon'
import { RecencyTick } from '@/components/RecencyTick'
import { IndicatorPeek } from '@/components/views/IndicatorPeek'
import { conditionValue } from '@/components/views/ConditionList'
import { ClassBadge, DefineLink, Score, Sparkline } from '@/components/ui'
import { indicatorHref } from '@/lib/links'

type IndicatorRow = DimensionResult['indicators'][number]

const HEAD = 'border-b border-[var(--rule)] py-2 pr-4 text-left text-[10px] font-medium uppercase tracking-[0.05em] text-[var(--muted)]'
const CELL = 'border-b border-[var(--rule-soft)] py-3 pr-4 align-top'

/**
 * Indicator rows on a country page: one table of the rows the country has a
 * record for, then one line naming the rows nobody can fill.
 *
 * A gap or a retired row is a fact about the registry and reads the same in
 * every country, so its name and its link stay here and its note lives on the
 * indicator page. Dropping the notes is what lets the rest be a table: a long
 * note in a cell made the first column narrow and stretched the row. Source and
 * history give way on narrow screens, and the source moves under the name so it
 * is never lost. See D189.
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
  const records = indicators.filter((r) => r.status === 'observed' || r.status === 'missing')
  const gaps = indicators.filter((r) => r.status === 'gap')
  const retired = indicators.filter((r) => r.status === 'retired')

  return (
    <div>
      {records.length > 0 ? (
        <table className="w-full border-collapse text-xs">
          <caption className="sr-only">Indicators behind this capability</caption>
          <thead>
            <tr>
              <th scope="col" className={HEAD}>Indicator</th>
              <th scope="col" className={HEAD}>Value</th>
              <th scope="col" className={HEAD}>Year</th>
              <th scope="col" className={HEAD}>Normalized</th>
              <th scope="col" className={`${HEAD} hidden md:table-cell`}>Source</th>
              <th scope="col" className={`${HEAD} hidden pr-0 sm:table-cell`}>History</th>
            </tr>
          </thead>
          <tbody>
            {records.map((row) => (
              <Row key={row.indicatorId} row={row} iso3={countryIso3} />
            ))}
          </tbody>
        </table>
      ) : null}

      {gaps.length > 0 ? (
        <RowNames
          icon={STATUS_ICON.gap}
          lead={
            <>
              No dataset exists for {gaps.length === 1 ? 'one row' : `${gaps.length} rows`}, each a{' '}
              <DefineLink term="Gap">gap</DefineLink>:
            </>
          }
          rows={gaps}
          evidence={evidence}
        />
      ) : null}
      {retired.length > 0 ? (
        <RowNames
          icon={STATUS_ICON.retired}
          lead={<>This project retired {retired.length === 1 ? 'one row' : `${retired.length} rows`}:</>}
          rows={retired}
          evidence={evidence}
        />
      ) : null}
    </div>
  )
}

function Row({ row, iso3 }: { row: IndicatorRow; iso3: string }) {
  const def = INDICATORS_BY_ID[row.indicatorId]
  const stale = row.staleExcluded
  const value = valueInUnit(def, row)
  const observed = row.status === 'observed'
  return (
    <tr>
      <th scope="row" className={`${CELL} text-left font-medium`}>
        <span className="flex flex-wrap items-center gap-2">
          {observed ? (
            <IndicatorPeek indicatorId={row.indicatorId} iso3={iso3}>
              {row.name}
            </IndicatorPeek>
          ) : (
            row.name
          )}
          <ClassBadge value={row.measurementClass} />
        </span>
        <span className="mt-1 block font-normal text-[var(--muted)] md:hidden">{row.source}</span>
        {stale ? (
          <span className="mt-1 flex gap-1.5 font-normal leading-relaxed text-[var(--muted)]">
            <Icon name={STATUS_ICON.stale} size={13} className="mt-0.5 shrink-0" />
            <span>
              Set aside. The latest value,{' '}
              <span className="tabular-nums">{stale.raw.toLocaleString('en-US')}</span>{' '}
              {def ? rawUnit(def) : ''} in {stale.year}, is more than {MAX_SCORED_VALUE_AGE} years
              old. It does not count toward the score, the scale or the coverage, and it stays in
              the history.
            </span>
          </span>
        ) : null}
      </th>
      <td className={CELL}>
        <span className="tabular-nums">{value === null ? 'no data' : conditionValue(value)}</span>
        <span className="mt-0.5 block text-[var(--muted)]">{def?.unit ?? 'no unit'}</span>
        {def?.transform === 'per_million_population' && row.raw !== null ? (
          <span className="mt-0.5 block text-[var(--muted)]">
            from {row.raw.toLocaleString('en-US')} {rawUnit(def)}
          </span>
        ) : null}
      </td>
      <td className={CELL}>
        <RecencyTick year={row.year} width={56} />
      </td>
      <td className={CELL}>
        <span className="inline-flex flex-wrap items-center gap-2">
          {observed ? (
            <IndicatorPeek indicatorId={row.indicatorId} iso3={iso3}>
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
      </td>
      <td className={`${CELL} hidden break-words text-[var(--muted)] md:table-cell`}>{row.source}</td>
      <td className={`${CELL} hidden pr-0 sm:table-cell`}>
        {row.series.length > 1 ? (
          <Sparkline
            series={row.series.map((p) => ({ year: p.year, score: p.normalized }))}
            width={90}
            height={24}
          />
        ) : (
          <span className="text-[var(--muted)]">{row.series.length === 1 ? 'one year' : 'no data'}</span>
        )}
      </td>
    </tr>
  )
}

function RowNames({
  icon,
  lead,
  rows,
  evidence,
}: {
  icon: (typeof STATUS_ICON)[keyof typeof STATUS_ICON]
  lead: React.ReactNode
  rows: IndicatorRow[]
  evidence: EvidenceRecord[]
}) {
  return (
    <p className="mt-4 flex gap-2 text-xs leading-relaxed text-[var(--muted)]">
      <Icon name={icon} size={13} className="mt-0.5 shrink-0" />
      <span>
        {lead}{' '}
        {rows.map((row, i) => {
          const records = evidence.filter((e) => e.indicatorId === row.indicatorId).length
          return (
            <span key={row.indicatorId}>
              {i > 0 ? ', ' : ''}
              <Link href={indicatorHref(row.indicatorId)} className="underline underline-offset-4">
                {row.name}
              </Link>
              {records > 0 ? ` (${records === 1 ? '1 case below' : `${records} cases below`})` : ''}
            </span>
          )
        })}
        .
      </span>
    </p>
  )
}
