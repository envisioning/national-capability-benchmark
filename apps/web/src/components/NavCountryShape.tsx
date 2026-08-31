'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { COUNTRY_NAMES } from '@ncb/core'
import type { RadarProfile } from '@/lib/profile'
import { CountryLabel } from '@/components/ui'

/**
 * The country the reader is standing in, drawn as its shape, at the head of
 * the Countries menu.
 *
 * The menu's rows are the same from everywhere by design, so nothing in it
 * says where the reader is. The shape does, and it says it in the one language
 * this site is built to be read in: nine axes at a glance, which is the whole
 * argument for publishing no single number.
 *
 * It is a picture and not a control. The rows below it are where the menu goes
 * and the profile is a click away on the crumb, so a second link here would be
 * a third thing competing for the same intent. See D87.
 */

/* The radar is the largest component in the viewer and the header renders on
   every page. Loading it with the menu keeps it out of the initial bundle of a
   reader who never opens one. */
const Radar = dynamic(() => import('@/components/Radar').then((m) => m.Radar), {
  ssr: false,
  loading: () => <div className="h-[168px] w-full" />,
})

/**
 * One shape per country per session.
 *
 * The cache holds the request and not the answer, so a second mount while the
 * first is still in the air joins it instead of asking again. Two mounts is
 * the normal case, not the edge: the menu opens and closes as the pointer
 * moves, and React's strict mode mounts every effect twice in development.
 */
const cache = new Map<string, Promise<RadarProfile | null>>()

function shape(iso3: string): Promise<RadarProfile | null> {
  const held = cache.get(iso3)
  if (held) return held
  const request = fetch(`/api/shape/${iso3}`)
    .then((response) => (response.ok ? (response.json() as Promise<RadarProfile>) : null))
    .catch(() => null)
    .then((data) => {
      /* A failure is not worth remembering: the next open should try again. */
      if (!data) cache.delete(iso3)
      return data
    })
  cache.set(iso3, request)
  return request
}

export function NavCountryShape({ iso3 }: { iso3: string }) {
  const [profile, setProfile] = useState<RadarProfile | null>(null)

  useEffect(() => {
    /* A menu closes faster than a network answers, and the answer to a country
       the reader has already left is not worth rendering. */
    let live = true
    shape(iso3).then((data) => {
      if (live && data) setProfile(data)
    })
    return () => {
      live = false
    }
  }, [iso3])

  const name = COUNTRY_NAMES[iso3.toUpperCase()]
  if (!name) return null

  return (
    <div className="border-b border-[var(--rule)] px-2 pb-2 pt-1">
      <div className="px-1 pb-1 text-xs font-medium">
        <CountryLabel iso3={iso3} name={name} />
      </div>
      {profile ? (
        <Radar
          labels="icons"
          interactive={false}
          series={[
            {
              label: name,
              values: profile.values,
              confidences: profile.confidences,
              color: 'var(--primary)',
            },
          ]}
        />
      ) : (
        <div className="h-[168px] w-full" />
      )}
    </div>
  )
}
