import type { Metadata } from 'next'
import Link from 'next/link'
import { LEXICONS, MAP_DIMENSIONS, countryName, countryTopic, fill, isThinEvidence } from '@ncb/core'
import type { CapabilityMap } from '@ncb/core'
import {
  Confidence,
  DimensionScore,
  Empty,
  Meta,
  PageTitle,
  Score,
  Section,
} from '@/components/ui'
import { loadCapabilityMaps } from '@/lib/capability-map'
import { MISSING_DATA_HINT } from '@/lib/data'
import { decisionHref } from '@/lib/links'
import type { MapReading } from '@/lib/map-reading'
import { capitalize, mapWords } from '@/lib/words'

/**
 * One country's capability map, the index: every published capability with
 * its score, its confidence and where the score sits against the peer median,
 * each linking to that capability's map.
 *
 * Nine pages do not fit a tab strip, and the nav tree stops at four levels,
 * so the map is one tab and this page lists its pages. The rows are in the
 * model's order and nothing here sorts them: a list ordered by score is a
 * ranking of one country's capabilities. Every number comes from
 * `buildCapabilityMap`, the same call each capability's page makes. The
 * ground layer's English map and every layer's map render this one component,
 * each through its own lexicon and addresses. See D133, D134 and D136.
 */
export function capabilityMapIndexMetadata(reading: MapReading): Metadata {
  const x = LEXICONS[reading.lang].capabilityMap.index
  return {
    title: fill(x.metaTitle, { country: countryName(LEXICONS[reading.lang], reading.iso3) }),
    description: capitalize(
      fill(x.metaDescription, {
        countryTopic: countryTopic(LEXICONS[reading.lang], reading.iso3),
      }),
    ),
  }
}

export async function CapabilityMapIndex({ reading }: { reading: MapReading }) {
  const ISO3 = reading.iso3
  const lex = LEXICONS[reading.lang]
  const words = mapWords(reading.lang)
  const m = lex.capabilityMap
  const x = m.index
  const topic = countryTopic(lex, ISO3)
  const countWord = words?.countWord ?? String

  const position = (map: CapabilityMap): string => {
    if (map.scorePosition === 'above') return x.above
    if (map.scorePosition === 'below') return x.below
    if (map.scorePosition === 'level') return x.level
    return x.none
  }

  const loaded = await loadCapabilityMaps(ISO3, MAP_DIMENSIONS)
  if (!loaded) {
    return <Empty hint={words?.noData ?? MISSING_DATA_HINT} />
  }
  const { maps, version } = loaded
  const peerCount = maps[0]?.peerRule.count ?? 0

  return (
    <>
      <PageTitle>{fill(x.title, { countryTopic: topic })}</PageTitle>
      {version ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Meta icon="file-clock">{fill(m.dataset, { version })}</Meta>
        </div>
      ) : null}
      <p className="mb-12 mt-6 max-w-3xl text-lg leading-relaxed">
        {fill(x.intro, { countryTopic: topic, n: countWord(maps.length), count: peerCount })}
      </p>
      {maps[0] && maps[0].income === null && maps[0].incomePublished ? (
        <p className="-mt-8 mb-12 max-w-3xl text-lg leading-relaxed">{fill(m.noIncome, { countryTopic: topic })}</p>
      ) : null}

      <Section title={x.heading}>
        <ul className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {maps.map((map) => {
            const href = reading.dimensionHref(map.dimension)
            const label = lex.dimensions[map.dimension] ?? map.dimension
            const thin = !map.belowCoverageFloor && isThinEvidence(map.confidence)
            return (
              <li
                key={map.dimension}
                className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center sm:gap-8"
              >
                <div className="min-w-0">
                  <Link href={href} className="text-xl font-medium tracking-tight hover:underline">
                    {label}
                  </Link>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {capitalize(position(map))}
                    {map.peerScoreMedian === null
                      ? null
                      : `, ${fill(x.peersScored, { n: map.peersScored, count: map.peers.length })}`}
                  </p>
                  {map.belowCoverageFloor ? (
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {fill(m.floorNote, { n: map.observedIndicators })}
                    </p>
                  ) : thin ? (
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {fill(m.thinNote, { band: lex.bands[map.band] })}
                    </p>
                  ) : null}
                </div>
                <span className="inline-flex items-center gap-2">
                  <span className="text-xs text-[var(--muted)]">{m.scoreLabel}</span>
                  <DimensionScore dim={map} size="sm" notMeasured={lex.agenda.noScore} locale={lex.numberLocale} />
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="text-xs text-[var(--muted)]">{m.confidenceLabel}</span>
                  <Confidence value={map.confidence} locale={lex.numberLocale} />
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="text-xs text-[var(--muted)]">{x.colPeerMedian}</span>
                  <Score value={map.peerScoreMedian} size="sm" nullLabel={m.noValue} locale={lex.numberLocale} />
                </span>
              </li>
            )
          })}
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">{x.note}</p>
        {reading.indexDecisions.map((id) => (
          <p key={id} className="mt-6 text-lg">
            <Link href={decisionHref(id)} className="underline underline-offset-4">
              {capitalize(fill(m.decisionLink, { id }))}
            </Link>
          </p>
        ))}
      </Section>
    </>
  )
}
