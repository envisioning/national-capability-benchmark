import { MIN_INDICATORS_FOR_SCORE } from '@ncb/core'
import { CHART_INK, CHART_STROKE } from '@/components/chartTokens'

/**
 * How many of a capability's indicator rows were observed for one country,
 * drawn as the count it is.
 *
 * Coverage is a fraction over a denominator of about seven, and it reached the
 * reader as 0.71, which implies a resolution seven rows do not have. Below the
 * coverage floor it reached the reader as the words "not measured", and the
 * count that explains them was only in screen reader text. One tick per row,
 * filled where the row was observed, and the reader counts.
 *
 * The notch is the floor: two observed rows before a capability is scored at
 * all, so a country one row short of a score looks one row short. See D45.
 *
 * The count is printed beside the mark and never replaced by it. Nothing here
 * is a second claim: it is the same number the tables already carried.
 */
export function CoverageMark({
  observed,
  total,
  floor = MIN_INDICATORS_FOR_SCORE,
  className = '',
}: {
  observed: number
  /** Rows counted against, which excludes retired rows. See D100. */
  total: number
  floor?: number
  className?: string
}) {
  if (total <= 0) return <span className="text-[var(--muted)]">no rows</span>

  /* Tight enough that seven rows fit a table cell, wide enough that two
     neighbouring ticks stay two ticks rather than a bar. */
  const pitch = 5
  const width = total * pitch
  const short = observed < floor

  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <svg width={width} height={12} aria-hidden="true" className="shrink-0 text-[var(--foreground)]">
        {Array.from({ length: total }, (_, i) => (
          <line
            key={i}
            x1={i * pitch + 1}
            y1={1}
            x2={i * pitch + 1}
            y2={9}
            stroke="currentColor"
            strokeOpacity={i < observed ? 1 : CHART_INK.grid}
            strokeWidth={CHART_STROKE.mark}
          />
        ))}
        {floor > 0 && floor < total ? (
          <line
            x1={floor * pitch - pitch / 2}
            y1={10}
            x2={floor * pitch - pitch / 2}
            y2={12}
            stroke="currentColor"
            strokeOpacity={CHART_INK.frame}
            strokeWidth={CHART_STROKE.hair}
          />
        ) : null}
      </svg>
      <span className="tabular-nums">
        {observed} of {total}
        {short ? (
          <span className="sr-only">
            . Below the coverage floor: this model needs {floor} observed rows before it publishes a
            score.
          </span>
        ) : null}
      </span>
    </span>
  )
}
