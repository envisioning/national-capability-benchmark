import type { Metadata } from 'next'
import Link from 'next/link'
import { MAP_DIMENSIONS, PT_BR, countryName, countryTopic, fill, isThinEvidence } from '@ncb/core'
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
import { capabilityMapHref, decisionHref } from '@/lib/links'
import { capitalize, ptCountWord } from '@/lib/words'

export const dynamic = 'force-dynamic'

/**
 * Brazil's capability map, the index: every published capability with its
 * score, its confidence and where the score sits against the peer median,
 * each linking to that capability's map.
 *
 * Nine pages do not fit the layer's tab strip, and the nav tree stops at four
 * levels, so the map is one section and this page lists its pages. The rows
 * are in the model's order and nothing here sorts them: a list ordered by
 * score is a ranking of one country's capabilities. Every number comes from
 * `buildCapabilityMap`, the same call each capability's page makes. See D133.
 */
const ISO3 = 'BRA'
const PAGE_DECISION = 'D133'

const lex = PT_BR
const m = PT_BR.capabilityMap
const x = m.index
const topic = countryTopic(lex, ISO3)
const name = countryName(lex, ISO3)

export const metadata: Metadata = {
  title: fill(x.metaTitle, { country: name }),
  description: fill(x.metaDescription, { countryTopic: topic }),
}

function position(map: CapabilityMap): string {
  if (map.scorePosition === 'above') return x.above
  if (map.scorePosition === 'below') return x.below
  if (map.scorePosition === 'level') return x.level
  return x.none
}

export default async function BrazilCapabilityMapIndexPage() {
  const loaded = await loadCapabilityMaps(ISO3, MAP_DIMENSIONS)
  if (!loaded) {
    return (
      <Empty hint="Ainda não há dados gerados. Rode pnpm bench all na raiz do repositório e recarregue." />
    )
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
        {fill(x.intro, { countryTopic: topic, n: ptCountWord(maps.length), count: peerCount })}
      </p>

      <Section title={x.heading}>
        <ul className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {maps.map((map) => {
            const href = capabilityMapHref(ISO3, map.dimension)
            const label = lex.dimensions[map.dimension] ?? map.dimension
            const thin = !map.belowCoverageFloor && isThinEvidence(map.confidence)
            return (
              <li
                key={map.dimension}
                className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center sm:gap-8"
              >
                <div className="min-w-0">
                  {href ? (
                    <Link href={href} className="text-xl font-medium tracking-tight hover:underline">
                      {label}
                    </Link>
                  ) : (
                    <span className="text-xl font-medium tracking-tight">{label}</span>
                  )}
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
                  <DimensionScore dim={map} size="sm" notMeasured={lex.agenda.noScore} />
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="text-xs text-[var(--muted)]">{m.confidenceLabel}</span>
                  <Confidence value={map.confidence} />
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="text-xs text-[var(--muted)]">{x.colPeerMedian}</span>
                  <Score value={map.peerScoreMedian} size="sm" nullLabel={m.noValue} />
                </span>
              </li>
            )
          })}
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">{x.note}</p>
        <p className="mt-6 text-lg">
          <Link href={decisionHref(PAGE_DECISION)} className="underline underline-offset-4">
            {capitalize(fill(m.decisionLink, { id: PAGE_DECISION }))}
          </Link>
        </p>
      </Section>
    </>
  )
}
