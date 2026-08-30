import Link from 'next/link'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { capabilityHref } from '@/lib/links'
import type { WealthReading } from '@/lib/wealth'
import { strengthText } from '@/lib/wealth'

/**
 * Nine capabilities against income, drawn on one axis.
 *
 * The thesis claims a country's ability to act can be read apart from its
 * wealth. This is the picture of how far that holds: each bar is how much of a
 * capability moves with GDP per head, and the line is the point past which the
 * project treats a dimension as an income proxy rather than a capability. Two
 * bars sit well left of it and two sit close to the right edge, which is the
 * whole argument and its main limit in one figure.
 *
 * The bar is a second encoding. The number is printed beside every row, so the
 * figure carries nothing that the text does not also say.
 */
export function WealthTracking({ reading }: { reading: WealthReading }) {
  const marker = `${reading.threshold * 100}%`

  return (
    <div>
      <ol className="space-y-2" aria-label="Capability correlation with GDP per capita">
        {reading.ranked.map((row) => (
          <li key={row.dimension} className="flex items-center gap-3">
            <Link
              href={capabilityHref(row.dimension)}
              className="flex w-44 shrink-0 items-center gap-2 text-xs font-medium hover:underline"
            >
              <Icon
                name={DIMENSION_ICON[row.dimension]}
                size={14}
                className="text-[var(--muted)]"
              />
              {row.label}
            </Link>
            <span className="relative h-5 flex-1 rounded-sm bg-[var(--surface-sunken)]">
              <span
                className={`absolute inset-y-0 left-0 rounded-sm ${
                  row.tracksWealth ? 'bg-[var(--muted)]' : 'bg-[var(--foreground)]'
                }`}
                style={{ width: `${(row.strength ?? 0) * 100}%` }}
              />
              <span
                aria-hidden
                className="absolute inset-y-[-3px] w-px bg-[var(--foreground)]"
                style={{ left: marker }}
              />
            </span>
            <span
              className="w-10 shrink-0 text-right text-xs font-medium"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {strengthText(row)}
            </span>
            <span
              className="w-14 shrink-0 text-right text-xs text-[var(--muted)]"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {row.n} countries
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        Absolute correlation with log GDP per capita, on a 0 to 1 axis. The line marks{' '}
        {reading.threshold.toFixed(1)}, the point at or above which the diagnostics call a
        dimension wealth tracking. Country counts differ because a dimension below the coverage
        floor publishes no score.
      </p>
    </div>
  )
}
