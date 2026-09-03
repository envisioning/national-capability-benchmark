'use client'

import { useState } from 'react'
import type { LaneField as LaneFieldData } from '@ncb/core'
import { LaneField } from '@/components/LaneField'
import { DIMENSION_ICON } from '@/components/Icon'
import { Button, ClassBadge } from '@/components/ui'
import {
  LANE_ARRANGEMENTS,
  capabilityHref,
  exploreHref,
  indicatorHref,
  type LaneArrangement,
} from '@/lib/links'

const ARRANGEMENT_LABELS: Record<LaneArrangement, string> = {
  registry: 'By registry',
  measure: 'By correlation with income',
}

/**
 * The lane field with its one control.
 *
 * The arrangement is the address, written back without a navigation so the
 * dots travel instead of the page reloading. The server reads the same value
 * on the next request, which is why a shared link opens on the arrangement
 * the sender saw. See D108.
 */
export function ExploreView({
  field,
  initial,
}: {
  field: LaneFieldData
  initial: LaneArrangement
}) {
  const [arrangement, setArrangement] = useState<LaneArrangement>(initial)

  const choose = (next: LaneArrangement) => {
    setArrangement(next)
    window.history.replaceState(null, '', exploreHref(next))
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Arrangement">
        {LANE_ARRANGEMENTS.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={option === arrangement ? 'default' : 'outline'}
            aria-pressed={option === arrangement}
            disabled={option === 'measure' && !field.measured}
            onClick={() => choose(option)}
          >
            {ARRANGEMENT_LABELS[option]}
          </Button>
        ))}
      </div>

      <LaneField
        field={field}
        arrangement={arrangement}
        laneIcon={DIMENSION_ICON}
        laneHref={capabilityHref}
        dotHref={(dot) => indicatorHref(dot.id)}
        renderDetail={(dot) => (
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[var(--muted)]">
            <ClassBadge value={dot.measurementClass} />
            <span>{dot.publisher}</span>
          </div>
        )}
      />

      {field.measured ? (
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          An indicator at or past {field.thresholds.measure.toFixed(2)} is flagged as a wealth proxy
          in the diagnostics. A line joins two indicators whose series correlate at{' '}
          {field.thresholds.link.toFixed(2)} or above across the countries both observe.
        </p>
      ) : null}
    </>
  )
}
