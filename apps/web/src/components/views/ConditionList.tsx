import { Icon } from '@/components/Icon'
import type { ConditionResult } from '@ncb/core'

/** A published value at the precision a reader can use: whole numbers from 100 up. */
export function conditionValue(value: number, locale = 'en-US'): string {
  const digits = Math.abs(value) >= 100 ? 0 : Math.abs(value) >= 1 ? 1 : 2
  return value.toLocaleString(locale, { maximumFractionDigits: digits })
}

/**
 * What the country has to work with on one capability.
 *
 * A condition is a stock of infrastructure, access, money, people or
 * enrolment, or income itself. It is published as the source wrote it, with
 * its rank among the countries that have it, and it enters no frame, no mean,
 * no coverage count, no confidence and no trend. It is never drawn with
 * `Score`, because a raw value on the score's ramp would read as a score. It is
 * a separate panel from `CheckList`: a check is a reading of the capability
 * the model declined to score, a condition is not a reading of the capability
 * at all. See docs/DECISIONS.md D122.
 */
export function ConditionList({ conditions }: { conditions: ConditionResult[] }) {
  if (conditions.length === 0) return null

  return (
    <div className="mt-6 rounded-lg border border-[var(--rule)] p-4">
      <p className="mb-1 inline-flex items-center gap-2 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
        <Icon name="package" size={14} />
        Conditions, not scored
      </p>
      <p className="mb-4 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        What the country has to work with on this capability. The values are shown as the source
        published them and are not part of the score, the confidence or the trend. The rank counts
        the countries with a value, best first.
      </p>
      <ul className="space-y-5">
        {conditions.map((c) => (
          <li key={c.indicatorId}>
            <p className="text-xs font-medium tracking-tight">
              {c.name}
              <span className="ml-2 font-normal text-[var(--muted)]">
                {c.source}
                {c.year === null ? '' : `, ${c.year}`}
              </span>
            </p>
            {c.value === null ? (
              <p className="mt-1 text-lg leading-relaxed text-[var(--muted)]">
                No value for this country. {c.definition}
              </p>
            ) : (
              <p className="mt-1 text-lg leading-relaxed">
                <span className="tabular-nums">{conditionValue(c.value)}</span> {c.unit}
                {c.rank === null ? '' : (
                  <span className="text-[var(--muted)]">
                    , rank <span className="tabular-nums">{c.rank}</span> of{' '}
                    <span className="tabular-nums">{c.n}</span>
                  </span>
                )}
                . {c.definition}
              </p>
            )}
            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">{c.note}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
