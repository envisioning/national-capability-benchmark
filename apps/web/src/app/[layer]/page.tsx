import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  COUNTRY_ISO3,
  LEXICONS,
  MAP_DIMENSIONS,
  countryName,
  fill,
  isThinEvidence,
} from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import {
  Confidence,
  ConfidenceLegend,
  CountryLabel,
  DimensionScore,
  Empty,
  Meta,
  PageTitle,
  Section,
} from '@/components/ui'
import { loadCapabilityMaps } from '@/lib/capability-map'
import { layerBySlug, layerSection } from '@/lib/layers'
import {
  artefactHref,
  capabilityMapHref,
  countryProfileHref,
  decisionHref,
  layerSectionHref,
} from '@/lib/links'
import { LAYER_WORDS, capitalize } from '@/lib/words'

export const dynamic = 'force-dynamic'

/**
 * The front page of a layer served by the `[layer]` route.
 *
 * Brazil's overview is written prose about Brazil. These layers carry no
 * country-specific work beyond what the model computes, so their front page
 * says nothing the published files do not: the nine scores with their
 * confidence in the model's order, the links to the map and the agenda, and
 * the known artefacts that bear on the country's scores, by id. No sentence
 * here is about the country; every one is about the instrument, with the
 * country's numbers in it. See D134.
 */
const PAGE_DECISION = 'D134'

type Params = { params: Promise<{ layer: string }> }

function overviewLayer(slug: string) {
  const layer = layerBySlug(slug)
  const pages = layer ? LAYER_WORDS[layer.lang]?.pages : undefined
  return layer && pages ? { layer, pages } : null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const found = overviewLayer((await params).layer)
  if (!found) return {}
  const country = countryName(LEXICONS[found.layer.lang], found.layer.iso3)
  return {
    title: fill(found.pages.overviewMetaTitle, { country }),
    description: fill(found.pages.overviewMetaDescription, { country }),
  }
}

export default async function LayerOverviewPage({ params }: Params) {
  const found = overviewLayer((await params).layer)
  if (!found) notFound()
  const { layer, pages } = found
  const lex = LEXICONS[layer.lang]
  const words = LAYER_WORDS[layer.lang]
  const m = lex.capabilityMap
  const name = countryName(lex, layer.iso3)

  const loaded = await loadCapabilityMaps(layer.iso3, MAP_DIMENSIONS)
  if (!loaded) return <Empty hint={words?.noData ?? ''} />
  const { maps, version } = loaded
  const scored = maps.filter((map) => map.score !== null).length

  const mapSection = layerSection(layer, 'map')
  const agendaSection = layerSection(layer, 'agenda')

  /* Which dimensions each artefact touches here, in document order of first
   * appearance, from the same table every map page reads. */
  const touched = new Map<string, Dimension[]>()
  for (const map of maps) {
    for (const id of map.artefacts.specific) touched.set(id, [...(touched.get(id) ?? []), map.dimension])
  }
  const specific = [...touched.keys()].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))
  const structural = maps[0]?.artefacts.structural ?? []
  const artefactLink = (id: string, first = false) => (
    <Link href={artefactHref(id)} className="underline underline-offset-4">
      {first ? capitalize(fill(m.artefactLink, { id })) : fill(m.artefactLink, { id })}
    </Link>
  )

  return (
    <>
      <PageTitle>
        <CountryLabel iso3={layer.iso3} name={fill(pages.overviewTitle, { country: name })} />
      </PageTitle>
      {version ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Meta icon="file-clock">{fill(m.dataset, { version })}</Meta>
        </div>
      ) : null}
      <p className="mb-12 mt-6 max-w-3xl text-lg leading-relaxed">
        {fill(pages.overviewIntro, { country: name, countries: COUNTRY_ISO3.length })}
      </p>

      <Section
        title={pages.scoresHeading}
        hint={capitalize(fill(pages.scoresIntro, { n: words?.countWord(scored) ?? scored }))}
      >
        <ul className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {maps.map((map) => {
            const href = capabilityMapHref(layer.iso3, map.dimension)
            const label = lex.dimensions[map.dimension] ?? map.dimension
            const thin = !map.belowCoverageFloor && isThinEvidence(map.confidence)
            return (
              <li
                key={map.dimension}
                className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-8"
              >
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-2">
                    <Icon
                      name={DIMENSION_ICON[map.dimension]}
                      size={16}
                      className="text-[var(--muted)]"
                    />
                    {href ? (
                      <Link href={href} className="text-xl font-medium tracking-tight hover:underline">
                        {label}
                      </Link>
                    ) : (
                      <span className="text-xl font-medium tracking-tight">{label}</span>
                    )}
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                    {lex.questions[map.dimension]}
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
                  <span className="text-xs text-[var(--muted)]">
                    {fill(m.bandLine, { band: lex.bands[map.band] })}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
        <ConfidenceLegend lex={lex} className="mt-6" />
      </Section>

      <Section title={pages.readingsHeading}>
        <ul className="max-w-3xl space-y-3 text-lg">
          {mapSection ? (
            <li>
              <Link href={layerSectionHref(layer, mapSection)} className="underline underline-offset-4">
                {pages.mapLink}
              </Link>
            </li>
          ) : null}
          {agendaSection ? (
            <li>
              <Link
                href={layerSectionHref(layer, agendaSection)}
                className="underline underline-offset-4"
              >
                {pages.agendaLink}
              </Link>
            </li>
          ) : null}
          <li>
            <Link href={countryProfileHref(layer.iso3)} className="underline underline-offset-4">
              {lex.agenda.profileLink}
            </Link>
          </li>
        </ul>
      </Section>

      <Section
        title={pages.artefactsHeading}
        hint={fill(pages.artefactsIntro, { country: name })}
      >
        <ul className="max-w-3xl space-y-3 text-lg leading-relaxed">
          {specific.map((id) => (
            <li key={id}>
              {artefactLink(id, true)}: {(touched.get(id) ?? []).map((d) => lex.dimensions[d]).join(', ')}.
            </li>
          ))}
          {structural.length > 0 ? (
            <li>
              {pages.artefactsStructural}:{' '}
              {structural.map((id, i) => (
                <span key={id}>
                  {i > 0 ? ', ' : null}
                  {artefactLink(id)}
                </span>
              ))}
              .
            </li>
          ) : null}
        </ul>
        <p className="mt-6 text-lg">
          <Link href={decisionHref(PAGE_DECISION)} className="underline underline-offset-4">
            {capitalize(fill(m.decisionLink, { id: PAGE_DECISION }))}
          </Link>
        </p>
      </Section>
    </>
  )
}
