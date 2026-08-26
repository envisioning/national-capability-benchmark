'use client'

import { useState } from 'react'
import type { Dimension } from '@ncb/core'
import { Radar } from '@/components/Radar'
import { FrameNote, RadarEvidenceLegend } from '@/components/ui'
import type { RadarProfile } from '@/lib/profile'
import { DimensionDialog } from '@/components/views/DimensionPeek'

/**
 * One country's shape, with a second country available behind a selector.
 *
 * The focal country keeps the filled shape and the comparator draws as an
 * outline. Reading two countries at once is a question about what the focal
 * country could learn, so the comparator is a deliberate choice by the reader
 * and never the default.
 */
export function CompareRadar({
  focus,
  others,
}: {
  focus: RadarProfile
  others: RadarProfile[]
}) {
  const [iso3, setIso3] = useState('')
  const [peek, setPeek] = useState<Dimension | null>(null)
  const comparator = others.find((o) => o.iso3 === iso3) ?? null

  /* One flat list. Countries added after the frame was fixed are displayed like
   * every other country, because they are measured the same way. See D19. */
  const options = [...others].sort((a, b) => a.country.localeCompare(b.country))

  return (
    <div>
      <Radar
        onSelectDimension={setPeek}
        series={[
          {
            label: focus.country,
            values: focus.values,
            confidences: focus.confidences,
            color: 'var(--primary)',
          },
          ...(comparator
            ? [
                {
                  label: comparator.country,
                  values: comparator.values,
                  confidences: comparator.confidences,
                  color: 'var(--muted)',
                  outline: true,
                },
              ]
            : []),
        ]}
      />

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ background: 'var(--primary)' }}
          />
          <span className="font-medium">{focus.country}</span>
        </span>
        {comparator ? (
          <span className="inline-flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-sm border"
              style={{ borderColor: 'var(--muted)' }}
            />
            <span className="font-medium">{comparator.country}</span>
          </span>
        ) : null}

        <label className="ml-auto inline-flex items-center gap-2 text-[var(--muted)]">
          <span>Compare with</span>
          <select
            value={iso3}
            onChange={(e) => setIso3(e.target.value)}
            className="rounded-md border border-[var(--rule)] bg-[var(--surface)] px-2 py-1 text-xs"
          >
            <option value="">nobody</option>
            {options.map((o) => (
              <option key={o.iso3} value={o.iso3}>
                {o.country}
              </option>
            ))}
          </select>
        </label>
      </div>

      <RadarEvidenceLegend />
      <FrameNote />

      {peek ? (
        <DimensionDialog
          dimension={peek}
          iso3={focus.iso3}
          open
          onClose={() => setPeek(null)}
        />
      ) : null}
    </div>
  )
}
