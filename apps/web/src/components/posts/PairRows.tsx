import { COUNTRY_NAMES, EN, indicatorName, unitName } from '@ncb/core'
import type { Pair } from '@ncb/core'
import { CountryLabel } from '@/components/ui'
import { conditionValue } from '@/components/views/ConditionList'
import { dimensionLabel } from '@/lib/labels'

/**
 * The subject beside its twin: two countries with about the same income, far
 * apart on one capability. Each row is the 0 to 100 scale with both
 * countries on it, the subject filled and the twin open, the same pair of
 * marks the waterfall uses for adding and taking away. The rows run widest
 * difference first, so the rows that separate them come first. Every number
 * comes from the post. See D200.
 */

const pct = (v: number): string => `${Math.min(100, Math.max(0, v))}%`
const name = (iso3: string): string => COUNTRY_NAMES[iso3] ?? iso3
const dollars = (v: number | null): string => (v === null ? 'no income figure' : `$${Math.round(v).toLocaleString('en-US')} a head`)

function Dot({ at, open = false }: { at: number; open?: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--foreground)] ${
        open ? 'bg-[var(--background)]' : 'bg-[var(--foreground)]'
      }`}
      style={{ left: pct(at) }}
    />
  )
}

export function PairRows({ pair }: { pair: Pair }) {
  const { a, b } = pair
  const value = (v: number | null, year: number | null, unit: string): string =>
    v === null ? 'no value' : `${conditionValue(v)} ${unitName(EN, unit)}${year ? ` (${year})` : ''}`
  return (
    <figure className="max-w-4xl">
      <div className="grid gap-4 sm:grid-cols-2">
        {[a, b].map((side, i) => (
          <div key={side.iso3} className="flex items-start gap-3">
            <span
              aria-hidden
              className={`mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[var(--foreground)] ${
                i === 0 ? 'bg-[var(--foreground)]' : 'bg-[var(--background)]'
              }`}
            />
            <div>
              <p className="text-lg font-medium">
                <CountryLabel iso3={side.iso3} name={name(side.iso3)} />
              </p>
              <p className="text-xs text-[var(--muted)]">
                {dimensionLabel(pair.dimension)} {side.score.toFixed(1)} · {dollars(side.gdpPerCapita)}
                {side.incomeYear ? ` (${side.incomeYear})` : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
      <ol
        className="mt-6 space-y-4"
        aria-label={`${name(a.iso3)} and ${name(b.iso3)} on each row of ${dimensionLabel(pair.dimension).toLowerCase()}`}
      >
        {pair.rows.map((r) => {
          const lo = Math.min(r.a.position, r.b.position)
          const hi = Math.max(r.a.position, r.b.position)
          return (
            <li key={r.indicatorId} className="grid gap-x-4 gap-y-1 sm:grid-cols-[minmax(0,15rem)_1fr]">
              <span>
                <span className="block text-xs font-medium">{indicatorName(EN, r.indicatorId)}</span>
                <span className="block text-xs text-[var(--muted)]">
                  {name(a.iso3)}: {value(r.a.value, r.a.year, r.unit)}
                </span>
                <span className="block text-xs text-[var(--muted)]">
                  {name(b.iso3)}: {value(r.b.value, r.b.year, r.unit)}
                </span>
              </span>
              <span className="relative block h-6 self-center rounded-sm bg-[var(--surface-sunken)]">
                <span
                  aria-hidden
                  className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-[var(--foreground)]"
                  style={{ left: pct(lo), width: pct(hi - lo) }}
                />
                <Dot at={r.b.position} open />
                <Dot at={r.a.position} />
              </span>
            </li>
          )
        })}
      </ol>
      <figcaption className="mt-3 text-xs text-[var(--muted)]">
        Each row is one part of the score, placed on the 0 to 100 scale, higher always better. Filled is {name(a.iso3)},
        open is {name(b.iso3)}. The rows where they sit furthest apart come first.
      </figcaption>
    </figure>
  )
}
