import type { HistoryCohort, HistoryDelta, HistoryDimension, Dimension } from '@ncb/core'
import { CHART_INK, CHART_STROKE } from '@/components/chartTokens'
import { DefineLink } from '@/components/ui'
import { countriesHistoryHref, decisionHref } from '@/lib/links'
import { historyYearTicks as yearTicks, signedPoints as signed } from '@/lib/history'
import Link from 'next/link'

const WIDTH = 760
const HEIGHT = 220
const PLOT = { left: 40, right: 12, top: 12, bottom: 48 }
/** The strip under the axis that shows how many basket cells the model filled. */
const STRIP = { top: HEIGHT - 30, height: 8 }
const Y_TICKS = [0, 50, 100]

/**
 * One dimension year by year: the reconstruction on today's basket with its
 * draw band, the replay on the values that existed, and the cells the model
 * filled. The four are drawn together on purpose. A reconstruction without its
 * replay, its band or its modelled count reads as data the world published,
 * and it is not. See D174.
 */
export function CountryHistoryChart({
  history,
  dimension,
  label,
  country,
  cohorts,
}: {
  history: HistoryDimension
  dimension: Dimension
  label: string
  country: string
  /** The cohorts this country belongs to, `all` first. */
  cohorts: HistoryCohort[]
}) {
  const series = history.series
  if (series.length < 2) return null
  const first = series[0]!
  const last = series[series.length - 1]!
  const basket = history.basket.length
  const x = (year: number) =>
    PLOT.left + ((year - first.year) / (last.year - first.year || 1)) * (WIDTH - PLOT.left - PLOT.right)
  const y = (score: number) =>
    HEIGHT - PLOT.bottom - (score / 100) * (HEIGHT - PLOT.top - PLOT.bottom)
  const step = (WIDTH - PLOT.left - PLOT.right) / (last.year - first.year || 1)

  const band = [
    ...series.map((p) => `${x(p.year).toFixed(1)},${y(p.hi).toFixed(1)}`),
    ...[...series].reverse().map((p) => `${x(p.year).toFixed(1)},${y(p.lo).toFixed(1)}`),
  ].join(' ')
  const estimate = series.map((p) => `${x(p.year).toFixed(1)},${y(p.estimate).toFixed(1)}`).join(' ')
  const replaySegments = segments(series.filter((p) => p.replay !== null))

  const modelledYears = series.filter((p) => p.modelled > 0)
  const lastModelled = modelledYears[modelledYears.length - 1]
  const peakModelled = Math.max(0, ...series.map((p) => p.modelled))
  const firstReplay = series.find((p) => p.replay !== null)

  return (
    <div className="mb-6">
      <p className="mb-2 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
        <DefineLink term="Reconstructed history" />, {first.year} to {last.year}, provisional
      </p>
      <div className="rounded-xl border border-[var(--rule)] bg-[var(--surface-sunken)] p-3 sm:p-4">
        <svg
          width="100%"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMinYMin meet"
          role="img"
          aria-label={`${country}, ${label}: reconstruction ${first.estimate.toFixed(1)} in ${first.year} and ${last.estimate.toFixed(1)} in ${last.year}`}
          className="block h-auto w-full"
          style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
        >
          {Y_TICKS.map((tick) => (
            <g key={tick}>
              <line
                x1={PLOT.left}
                y1={y(tick)}
                x2={WIDTH - PLOT.right}
                y2={y(tick)}
                stroke="currentColor"
                strokeOpacity={tick === 0 ? CHART_INK.frame : CHART_INK.grid}
                strokeWidth={tick === 0 ? CHART_STROKE.rule : CHART_STROKE.hair}
              />
              <text x={PLOT.left - 8} y={y(tick) + 4} textAnchor="end" fill="var(--muted)" fontSize="11">
                {tick}
              </text>
            </g>
          ))}
          {yearTicks(first.year, last.year).map((year) => (
            <text
              key={year}
              x={x(year)}
              y={STRIP.top - 6}
              textAnchor="middle"
              fill="var(--muted)"
              fontSize="11"
            >
              {year}
            </text>
          ))}

          <polygon points={band} fill="var(--primary)" fillOpacity={0.18} stroke="none" />
          <polyline
            points={estimate}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={CHART_STROKE.data}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {replaySegments.map((segment, i) =>
            segment.length === 1 ? (
              <circle
                key={i}
                cx={x(segment[0]!.year)}
                cy={y(segment[0]!.replay!)}
                r={2.5}
                fill="var(--foreground)"
                fillOpacity={0.7}
              />
            ) : (
              <polyline
                key={i}
                points={segment
                  .map((p) => `${x(p.year).toFixed(1)},${y(p.replay!).toFixed(1)}`)
                  .join(' ')}
                fill="none"
                stroke="var(--foreground)"
                strokeOpacity={0.7}
                strokeWidth={CHART_STROKE.line}
                strokeDasharray="4 3"
              />
            ),
          )}

          {basket > 0
            ? series.map((p) => (
                <rect
                  key={p.year}
                  x={x(p.year) - step / 2 + 0.5}
                  y={STRIP.top}
                  width={Math.max(step - 1, 1)}
                  height={STRIP.height}
                  fill="var(--foreground)"
                  fillOpacity={p.modelled === 0 ? CHART_INK.band : 0.12 + 0.6 * (p.modelled / basket)}
                >
                  <title>{`${p.year}: ${p.modelled} of ${basket} indicators modelled`}</title>
                </rect>
              ))
            : null}
          <text x={PLOT.left - 8} y={STRIP.top + STRIP.height} textAnchor="end" fill="var(--muted)" fontSize="10">
            model
          </text>
        </svg>
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--muted)]">
        <li className="inline-flex items-center gap-2">
          <svg width="22" height="10" aria-hidden="true">
            <rect x="0" y="0" width="22" height="10" fill="var(--primary)" fillOpacity={0.18} />
            <line x1="0" y1="5" x2="22" y2="5" stroke="var(--primary)" strokeWidth={CHART_STROKE.data} />
          </svg>
          Reconstruction on today&apos;s {basket} indicators, band 10th to 90th percentile
        </li>
        <li className="inline-flex items-center gap-2">
          <svg width="22" height="10" aria-hidden="true">
            <line
              x1="0"
              y1="5"
              x2="22"
              y2="5"
              stroke="var(--foreground)"
              strokeOpacity={0.7}
              strokeWidth={CHART_STROKE.line}
              strokeDasharray="4 3"
            />
          </svg>
          Replay on the values that existed each year
        </li>
        <li className="inline-flex items-center gap-2">
          <svg width="22" height="10" aria-hidden="true">
            <rect x="0" y="1" width="22" height="8" fill="var(--foreground)" fillOpacity={0.5} />
          </svg>
          Darker means more indicators modelled
        </li>
      </ul>

      <div className="mt-3 space-y-1 text-xs leading-relaxed">
        {history.deltas.map((d) => (
          <p key={d.span}>
            <span className="font-medium">
              {signed(d.estimate)} over {d.span} years
            </span>{' '}
            ({d.baseYear} to {d.endYear}), band {signed(d.lo)} to {signed(d.hi)}
            {crossesZero(d) ? ', which includes no change' : ''}.{' '}
            <span className="text-[var(--muted)]">
              Median change:{' '}
              {cohorts
                .map((c) => {
                  const cd = c.dimensions[dimension]?.deltas.find((e) => e.span === d.span)
                  return cd ? `${c.id === 'all' ? 'all countries' : c.label} ${signed(cd.estimate)}` : null
                })
                .filter(Boolean)
                .join(', ')}
              .
            </span>
          </p>
        ))}
        <p className="text-[var(--muted)]">
          {modelledYears.length === 0
            ? `No indicator is modelled in any year.`
            : `The model fills at least one of the ${basket} indicators in ${modelledYears.length} of ${series.length} years, at most ${peakModelled}, last in ${lastModelled!.year}.`}{' '}
          {firstReplay
            ? `The replay starts in ${firstReplay.year}, the first year with two indicators in force.`
            : 'No year before today has two indicators in force, so there is no replay.'}{' '}
          This never enters a score.{' '}
          <Link href={decisionHref('D174')} className="underline underline-offset-4">
            How it is built
          </Link>
          ,{' '}
          <Link href={countriesHistoryHref} className="underline underline-offset-4">
            every country and cohort
          </Link>
          .
        </p>
      </div>
    </div>
  )
}


function crossesZero(d: HistoryDelta): boolean {
  return d.lo <= 0 && d.hi >= 0
}


function segments<T extends { year: number }>(points: T[]): T[][] {
  const out: T[][] = []
  for (const p of points) {
    const current = out[out.length - 1]
    const previous = current?.[current.length - 1]
    if (!current || !previous || p.year - previous.year > 1) out.push([p])
    else current.push(p)
  }
  return out
}
