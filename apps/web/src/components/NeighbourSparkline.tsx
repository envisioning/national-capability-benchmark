'use client'

import { Radar } from '@/components/Radar'
import type { RadarProfile } from '@/lib/profile'

/** A compact, read-only radar used to compare a destination with its peers. */
export function NeighbourSparkline({ profile }: { profile: RadarProfile }) {
  return (
    <div className="w-28 shrink-0" aria-label={`${profile.country} peer radar`}>
      <Radar
        labels="icons"
        interactive={false}
        series={[
          {
            label: profile.country,
            iso3: profile.iso3,
            values: profile.values,
            confidences: profile.confidences,
            color: 'var(--muted)',
          },
        ]}
      />
    </div>
  )
}
