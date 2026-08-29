import { Icon } from '@/components/Icon'
import type { CheckResult } from '@ncb/core'

/**
 * Series published beside a dimension and excluded from every number above.
 *
 * A check measures something real about the dimension and fails this project's
 * own test for scoring it, so the reader gets the value and the reason together.
 * It enters no frame, no mean, no coverage count and no confidence.
 * See docs/DECISIONS.md D60.
 */
export function CheckList({ checks }: { checks: CheckResult[] }) {
  const observed = checks.filter((c) => c.value !== null)
  if (observed.length === 0) return null

  return (
    <div className="mt-6 rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] p-4">
      <p className="mb-1 inline-flex items-center gap-2 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
        <Icon name="eye" size={14} />
        Behavioral check, not scored
      </p>
      <p className="mb-4 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        Each number below is published beside the score and stays out of it. It is not in the
        frame, the average, the indicator count or the confidence.
      </p>
      <ul className="space-y-5">
        {observed.map((c) => (
          <li key={c.checkId}>
            <p className="text-xs font-medium tracking-tight">
              {c.name}
              <span className="ml-2 font-normal text-[var(--muted)]">
                {c.source}, {c.year}
              </span>
            </p>
            <p className="mt-1 text-lg leading-relaxed">
              <span className="tabular-nums">{c.value?.toLocaleString('en-US')}</span> {c.unit},{' '}
              {c.direction === 'lower_better' ? 'lower is better' : 'higher is better'}.{' '}
              {c.definition}
            </p>
            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">{c.note}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
