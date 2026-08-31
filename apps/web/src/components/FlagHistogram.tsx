'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  DIMENSIONS,
  DIMENSION_ENDPOINTS,
  DIMENSION_LABELS,
  DIMENSION_QUESTIONS,
} from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { FlagField, layoutField, type FlagFieldPoint } from '@/components/FlagField'
import { FlagBubbleLegend } from '@/components/FlagBubble'
import type { HistogramProfile } from '@/lib/profile'
import { capabilityHref, countryProfileHref } from '@/lib/links'

/**
 * The nine capabilities, one at a time, over the shared field chart.
 *
 * Switching capability moves each flag from its old score to its new one
 * instead of redrawing the field, so the reader watches a country travel and
 * keeps hold of it. That motion is the point: it is the only way this page
 * shows that a country is not one number, which is the reason the benchmark
 * publishes no composite. See D67.
 */

/** The country's own spread, printed in the hover card beside the score. */
function shapeOf(profile: HistogramProfile) {
  let highest: { label: string; value: number } | null = null
  let lowest: { label: string; value: number } | null = null
  let scored = 0
  DIMENSIONS.forEach((d, i) => {
    const value = profile.values[i]
    if (value === null || value === undefined) return
    scored += 1
    if (highest === null || value > highest.value) highest = { label: DIMENSION_LABELS[d], value }
    if (lowest === null || value < lowest.value) lowest = { label: DIMENSION_LABELS[d], value }
  })
  return {
    highest: highest as { label: string; value: number } | null,
    lowest: lowest as { label: string; value: number } | null,
    scored,
    total: DIMENSIONS.length,
  }
}

export function FlagHistogram({
  profiles,
  initial = DIMENSIONS[0],
}: {
  profiles: HistogramProfile[]
  /** Which capability the chart opens on. Never a mean of the nine. */
  initial?: Dimension
}) {
  const [dimension, setDimension] = useState<Dimension>(initial)

  /* Every field is laid out once, because the frame has to hold still while a
   * flag travels: a chart that resized on each switch would move every other
   * country for a reason that has nothing to do with the data. */
  const fields = useMemo(() => {
    const built = {} as Record<Dimension, { points: FlagFieldPoint[]; layout: ReturnType<typeof layoutField> }>
    DIMENSIONS.forEach((d, i) => {
      const points: FlagFieldPoint[] = profiles.map((p) => ({
        key: p.iso3,
        iso3: p.iso3,
        label: p.country,
        value: p.values[i] ?? null,
        confidence: p.confidences[i] ?? null,
        delta: p.deltas[i] ?? null,
        href: countryProfileHref(p.iso3),
        shape: shapeOf(p),
        radar: {
          values: p.values,
          confidences: p.confidences,
        },
      }))
      built[d] = { points, layout: layoutField(points) }
    })
    return built
  }, [profiles])

  const tallest = Math.max(...DIMENSIONS.map((d) => fields[d].layout.stack))
  const field = fields[dimension]
  const endpoints = DIMENSION_ENDPOINTS[dimension]
  const label = DIMENSION_LABELS[dimension]
  const missing = field.points.length - field.layout.placed.length

  return (
    <div>
      <div role="group" aria-label="Capability" className="mb-6 flex flex-wrap gap-2">
        {DIMENSIONS.map((d) => {
          const current = d === dimension
          return (
            <button
              key={d}
              type="button"
              aria-pressed={current}
              onClick={() => setDimension(d)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                current
                  ? 'border-[var(--foreground)] bg-[var(--surface-sunken)] text-[var(--foreground)]'
                  : 'border-[var(--rule)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <Icon name={DIMENSION_ICON[d]} size={14} />
              {DIMENSION_LABELS[d]}
            </button>
          )
        })}
      </div>

      <p className="mb-6 max-w-3xl text-lg leading-relaxed">{DIMENSION_QUESTIONS[dimension]}</p>

      <FlagField
        points={field.points}
        layout={field.layout}
        reserveStack={tallest}
        ariaLabel={`${label} across ${field.layout.placed.length} countries on a 0 to 100 scale. Median ${field.layout.median.toFixed(
          1,
        )}.`}
        legend={false}
      />

      {/* Fixed height, so pointing at a flag never moves the chart above it. */}
      <div className="mt-5 flex min-h-[64px] flex-wrap items-start justify-between gap-x-8 gap-y-3">
        <div>
          <p className="text-xs font-medium">{endpoints.low.label}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">{endpoints.low.meaning}</p>
        </div>
        <div className="order-last w-full text-xs text-[var(--muted)] sm:order-none sm:w-auto sm:max-w-xs sm:text-center">
          {field.layout.placed.length} countries scored, median{' '}
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            {field.layout.median.toFixed(1)}
          </span>
          . Point at a flag to read the country, click it to open the profile.
        </div>
        <div className="text-right">
          <p className="text-xs font-medium">{endpoints.high.label}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">{endpoints.high.meaning}</p>
        </div>
      </div>

      <FlagBubbleLegend note="The shaded band is the middle half of the field and the line inside it is the median." />

      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
        {missing > 0
          ? `${missing} of ${field.points.length} countries have too few observed indicators on ${label.toLowerCase()} to publish a score, so they are not drawn. `
          : ''}
        <Link href={capabilityHref(dimension)} className="underline underline-offset-4">
          Open the {label.toLowerCase()} page
        </Link>{' '}
        for the indicators behind these scores.
      </p>
    </div>
  )
}
