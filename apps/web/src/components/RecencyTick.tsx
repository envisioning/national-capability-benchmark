import { INGEST_FROM_YEAR } from '@ncb/core'
import { CHART_INK, CHART_STROKE } from '@/components/chartTokens'

/**
 * When a value was observed, drawn as a position in time.
 *
 * Recency is one of the three factors behind a confidence and it reached the
 * reader as a decimal with no year attached, or as a year with nothing to
 * measure it against. A reader who sees 2011 has to know what a current round
 * looks like before that number means anything.
 *
 * The rail runs from the first year the ingest fetches to the current one. The
 * tick is the observation and the quiet line trailing it is how long ago that
 * was, so a stale row is visibly a long tail and a current one is a tick at the
 * end. The year stays printed beside it.
 *
 * A row with no observation draws the rail alone. An empty rail and a rail with
 * a tick at the far left are different claims, and neither is a zero.
 */
export function RecencyTick({
  year,
  from = INGEST_FROM_YEAR,
  to = new Date().getUTCFullYear(),
  width = 64,
  className = '',
}: {
  /** The year observed, or null where the row has no value. */
  year: number | null
  from?: number
  /** The end of the rail. Defaults to the current year. */
  to?: number
  width?: number
  className?: string
}) {
  const span = Math.max(1, to - from)
  const x = year === null ? 0 : Math.min(1, Math.max(0, (year - from) / span)) * width

  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <svg width={width} height={12} aria-hidden="true" className="shrink-0 text-[var(--foreground)]">
        <line
          x1={0}
          y1={6}
          x2={width}
          y2={6}
          stroke="currentColor"
          strokeOpacity={CHART_INK.frame}
          strokeWidth={CHART_STROKE.hair}
        />
        {year === null ? null : (
          <>
            {/* How long ago, as length. */}
            <line
              x1={x}
              y1={6}
              x2={width}
              y2={6}
              stroke="currentColor"
              strokeOpacity={CHART_INK.grid}
              strokeWidth={CHART_STROKE.mark}
            />
            <line
              x1={x}
              y1={2}
              x2={x}
              y2={10}
              stroke="currentColor"
              strokeWidth={CHART_STROKE.data}
            />
          </>
        )}
      </svg>
      <span className="tabular-nums">
        {year ?? 'no data'}
        {year === null ? null : (
          <span className="sr-only">
            . The rail runs from {from} to {to}.
          </span>
        )}
      </span>
    </span>
  )
}
