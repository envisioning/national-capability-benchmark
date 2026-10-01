import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  PT_BR,
  countryName,
  countryTopic,
  fill,
  fmt,
  fmtConf,
  indicatorName,
  isThinEvidence,
  readCapabilityMap,
  unitName,
} from '@ncb/core'
import { FlagField } from '@/components/FlagField'
import type { FlagFieldPoint } from '@/components/FlagField'
import { ConditionList, conditionValue } from '@/components/views/ConditionList'
import {
  Confidence,
  CountryLabel,
  DimensionScore,
  Empty,
  Eyebrow,
  Meta,
  PageTitle,
  Score,
  Section,
} from '@/components/ui'
import { loadCapabilityMap } from '@/lib/capability-map'
import { countryLayer, layerSection, mapDimensionBySlug } from '@/lib/layers'
import {
  artefactHref,
  capabilityHref,
  capabilityMapIndexHref,
  countryProfileHref,
  decisionHref,
  layerSectionHref,
  limitsHref,
} from '@/lib/links'
import { PT_CONDITION_WORDS, PT_FIELD_WORDS, capitalize, ptCountWord } from '@/lib/words'

export const dynamic = 'force-dynamic'

/**
 * Brazil's map of one capability, in Portuguese.
 *
 * Not a score page and not advice. Since D122 a dimension separates what a
 * country does (capability rows, scored) from what it has (conditions, beside
 * the score with a rank), and the diagnostics put each condition against
 * income and against the score. Laid side by side for one country and placed
 * among the countries at the nearest income, that split is a map. Every
 * number is computed by `buildCapabilityMap` in core from the published
 * files, and every sentence compares a value with a median. One page serves
 * every capability: the segment is the lexicon's name for the dimension, and
 * a dimension with no conditions says so and draws no conditions panel. See
 * D130 and D133.
 */
const ISO3 = 'BRA'
/** The decisions that record this page, its peer rule and its no-advice rule. */
const PAGE_DECISIONS = ['D130', 'D133'] as const

const m = PT_BR.capabilityMap
const lex = PT_BR
const topic = countryTopic(lex, ISO3)
const name = countryName(lex, ISO3)

type Params = { params: Promise<{ dimension: string }> }

function dimensionFor(slug: string) {
  const layer = countryLayer(ISO3)
  return layer ? mapDimensionBySlug(layer, slug) : null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const dimension = dimensionFor((await params).dimension)
  if (!dimension) return {}
  const dimensionName = lex.dimensions[dimension] ?? dimension
  return {
    title: fill(m.metaTitle, { dimension: dimensionName, country: name }),
    description: fill(m.metaDescription, { dimension: dimensionName, countryTopic: topic }),
  }
}

const money = (n: number): string =>
  `US$ ${n.toLocaleString(lex.numberLocale, { maximumFractionDigits: 0 })}`
const r = (n: number | null): string => (n === null ? '?' : fmtConf(n, lex.numberLocale))
const list = (items: string[]): string =>
  new Intl.ListFormat(lex.numberLocale, { style: 'long', type: 'conjunction' }).format(items)
const lowerFirst = (s: string): string => s.charAt(0).toLowerCase() + s.slice(1)

export default async function BrazilCapabilityMapPage({ params }: Params) {
  const dimension = dimensionFor((await params).dimension)
  if (!dimension) notFound()
  const dimensionName = lex.dimensions[dimension] ?? dimension
  const layer = countryLayer(ISO3)
  const loaded = await loadCapabilityMap(ISO3, dimension)
  if (!layer || !loaded) {
    return (
      <Empty hint="Ainda não há dados gerados. Rode pnpm bench all na raiz do repositório e recarregue." />
    )
  }
  const { map, subject, version } = loaded
  const reading = readCapabilityMap(map)
  const agendaSection = layerSection(layer, 'agenda')
  const subjectConditions = subject.dimensions[dimension]?.conditions ?? []
  const observed = map.rows.filter((row) => row.normalized !== null)
  const unscored = map.peers.length - map.peersScored
  const rowName = (id: string) => indicatorName(lex, id)

  const points: FlagFieldPoint[] = [
    {
      key: ISO3,
      iso3: ISO3,
      label: name,
      value: map.score,
      confidence: map.confidence,
      focal: true,
      ...(map.income ? { detail: money(map.income.gdpPerCapita) } : {}),
    },
    ...map.peers.map((peer) => ({
      key: peer.iso3,
      iso3: peer.iso3,
      label: countryName(lex, peer.iso3),
      value: peer.score,
      confidence: peer.confidence,
      detail: money(peer.gdpPerCapita),
      href: countryProfileHref(peer.iso3),
    })),
  ]

  const scoreSentence =
    map.score === null || map.peerScoreMedian === null || map.scorePosition === null
      ? null
      : capitalize(
          fill(
            map.scorePosition === 'above'
              ? m.scoreAbove
              : map.scorePosition === 'below'
                ? m.scoreBelow
                : m.scoreLevel,
            {
              countryTopic: topic,
              dimension: dimensionName,
              score: fmt(map.score, lex.numberLocale),
              median: fmt(map.peerScoreMedian, lex.numberLocale),
              n: map.peersScored,
            },
          ),
        )

  const conditionLine = (template: string, ids: string[]) =>
    ids.length === 0
      ? null
      : capitalize(
          fill(template, { countryTopic: topic, list: list(ids.map((id) => lowerFirst(rowName(id)))) }),
        )

  /* A row's construct caveat, then any hand-written fact about this country's
   * row that the published output does not carry. Both are lexicon text. */
  const facts = m.countryRowFacts[ISO3] ?? {}
  const caveats = map.rows.flatMap((row) => {
    const parts = [m.rowCaveats[row.id], facts[row.id]].filter(
      (x): x is { text: string; decisions: string[] } => x !== undefined,
    )
    if (parts.length === 0) return []
    return [
      {
        id: row.id,
        text: parts.map((x) => x.text).join(' '),
        decisions: [...new Set(parts.flatMap((x) => x.decisions))],
      },
    ]
  })
  const thin = !map.belowCoverageFloor && isThinEvidence(map.confidence)
  const artefactLinks = (ids: string[]) =>
    ids.map((id, i) => (
      <span key={id}>
        {i === 0 ? ' ' : ', '}
        <Link href={artefactHref(id)} className="underline underline-offset-4">
          {fill(m.artefactLink, { id })}
        </Link>
      </span>
    ))
  const mapIndex = capabilityMapIndexHref(ISO3)

  return (
    <>
      <PageTitle>{fill(m.title, { countryTopic: topic, dimension: dimensionName })}</PageTitle>
      {version ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Meta icon="file-clock">{fill(m.dataset, { version })}</Meta>
        </div>
      ) : null}
      <p className="mb-12 mt-6 max-w-3xl text-lg leading-relaxed">
        {fill(m.intro, { countryTopic: topic, count: map.peerRule.count })}
      </p>

      <Section title={m.scoreHeading}>
        <div className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-3">
          <span className="inline-flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
              {m.scoreLabel}
            </span>
            <DimensionScore dim={map} size="lg" notMeasured={lex.agenda.noScore} />
          </span>
          <span className="inline-flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
              {m.confidenceLabel}
            </span>
            <Confidence value={map.confidence} size="md" />
            <span className="text-xs text-[var(--muted)]">
              {fill(m.bandLine, { band: lex.bands[map.band] })}
            </span>
          </span>
        </div>
        {map.belowCoverageFloor ? (
          <p className="mb-4 max-w-3xl text-lg leading-relaxed">
            {fill(m.floorNote, { n: map.observedIndicators })}
          </p>
        ) : null}
        {thin ? (
          <p className="mb-4 max-w-3xl text-lg leading-relaxed">
            {fill(m.thinNote, { band: lex.bands[map.band] })}
          </p>
        ) : null}
        <p className="mb-4 max-w-3xl text-lg leading-relaxed">
          {fill(m.scoreIntro, { dimension: dimensionName, n: ptCountWord(observed.length) })}
        </p>
        {map.dimensionIncomeR === null ? null : (
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
            {fill(m.dimensionIncome, {
              dimension: dimensionName,
              r: r(map.dimensionIncomeR),
              n: map.dimensionIncomeN,
            })}
          </p>
        )}

        <Eyebrow>{m.rowsHeading}</Eyebrow>
        <ul className="mt-3 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {map.rows.map((row) => (
            <li key={row.id} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-8">
              <div className="min-w-0">
                <p className="text-xs font-medium tracking-tight">{rowName(row.id)}</p>
                <p className="mt-1 text-lg leading-relaxed">
                  {row.raw === null ? (
                    <span className="text-[var(--muted)]">{m.noValue}</span>
                  ) : (
                    <>
                      <span className="tabular-nums">{conditionValue(row.raw, lex.numberLocale)}</span>{' '}
                      {unitName(lex, row.unit)}
                    </>
                  )}
                </p>
                {row.year === null ? null : (
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {fill(m.rowSource, { source: row.source, year: row.year })}
                  </p>
                )}
              </div>
              <span className="inline-flex items-center gap-2">
                <span className="text-xs text-[var(--muted)]">{m.colPosition}</span>
                <Score value={row.normalized} size="sm" nullLabel={m.noValue} />
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="text-xs text-[var(--muted)]">{m.colPeerMedian}</span>
                <Score value={row.peerMedian} size="sm" nullLabel={m.noValue} />
                <span className="text-xs tabular-nums text-[var(--muted)]">
                  {fill(m.rowPeers, { n: row.peersWithValue })}
                </span>
              </span>
            </li>
          ))}
        </ul>
        {map.gaps.length > 0 ? (
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
            {fill(m.gapsLine, { list: list(map.gaps.map((id) => lowerFirst(rowName(id)))) })}
          </p>
        ) : null}
        {map.conditions.length === 0 ? (
          <p className="mt-8 max-w-3xl text-lg leading-relaxed">
            {fill(m.noConditions, { dimension: dimensionName })}
          </p>
        ) : null}
      </Section>

      {subjectConditions.length > 0 ? (
        <Section title={fill(lex.agenda.conditionsHeading, { countryTopic: topic })}>
          <p className="max-w-3xl text-lg leading-relaxed">{m.conditionsIntro}</p>
          <ConditionList
            conditions={subjectConditions}
            lex={lex}
            words={PT_CONDITION_WORDS}
            aside={(c) => {
              const row = map.conditions.find((x) => x.id === c.indicatorId)
              if (!row) return null
              return (
                <ul className="mt-2 space-y-1 text-xs leading-relaxed text-[var(--muted)]">
                  <li>{fill(m.conditionIncome, { r: r(row.incomeR), n: row.incomeN })}</li>
                  <li>
                    {fill(m.conditionScore, {
                      dimension: dimensionName,
                      r: r(row.scoreR),
                      n: row.scoreN,
                    })}
                  </li>
                  {row.peerMedian === null ? null : (
                    <li>
                      {fill(m.conditionPeerMedian, {
                        value: conditionValue(row.peerMedian, lex.numberLocale),
                        unit: unitName(lex, row.unit),
                        n: row.peersWithValue,
                      })}
                    </li>
                  )}
                </ul>
              )
            }}
          />
        </Section>
      ) : null}

      <Section title={fill(m.peersHeading, { countryTopic: topic })}>
        {map.peers.length === 0 ? (
          <p className="max-w-3xl text-lg leading-relaxed">{m.noPeers}</p>
        ) : (
          <>
            <p className="max-w-3xl text-lg leading-relaxed">
              {fill(m.peerRule, { count: map.peerRule.count })}
            </p>
            {map.peerIncome && map.income ? (
              <p className="mt-4 max-w-3xl text-lg leading-relaxed">
                {fill(m.peerRange, {
                  min: money(map.peerIncome.min),
                  max: money(map.peerIncome.max),
                  own: money(map.income.gdpPerCapita),
                  year: map.income.year,
                  countryTopic: topic,
                })}
              </p>
            ) : null}
            {unscored > 0 ? (
              <p className="mt-4 max-w-3xl text-lg leading-relaxed">
                {capitalize(fill(m.peersUnscored, { n: ptCountWord(unscored), count: map.peers.length }))}
              </p>
            ) : null}
            <div className="mt-8">
              <FlagField
                points={points}
                words={{ ...PT_FIELD_WORDS, legendNote: m.fieldNote }}
                ariaLabel={fill(m.fieldAria, {
                  count: map.peers.length + 1,
                  dimension: dimensionName,
                })}
              />
            </div>
            <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {map.peers.map((peer) => (
                <li
                  key={peer.iso3}
                  className="flex items-center justify-between gap-4 border-b border-[var(--rule)] pb-3 text-xs"
                >
                  <Link href={countryProfileHref(peer.iso3)} className="font-medium hover:underline">
                    <CountryLabel iso3={peer.iso3} name={countryName(lex, peer.iso3)} />
                  </Link>
                  <span className="inline-flex items-center gap-3">
                    <span className="tabular-nums text-[var(--muted)]">
                      {money(peer.gdpPerCapita)}, {peer.year}
                    </span>
                    <Score value={peer.score} size="sm" nullLabel={lex.agenda.noScore} />
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>

      {map.peers.length > 0 ? (
        <Section title={fill(m.readingHeading, { countryTopic: topic })}>
          <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
            {scoreSentence ? <p>{scoreSentence}</p> : null}
            {[
              [m.rowsAbove, reading.rowsAbove],
              [m.rowsBelow, reading.rowsBelow],
              [m.rowsLevel, reading.rowsLevel],
            ].map(([template, ids]) =>
              (ids as string[]).length === 0 ? null : (
                <p key={template as string}>
                  {fill(template as string, { list: list((ids as string[]).map((id) => lowerFirst(rowName(id)))) })}
                </p>
              ),
            )}
            {[
              conditionLine(m.conditionsMore, reading.conditionsMore),
              conditionLine(m.conditionsLess, reading.conditionsLess),
              conditionLine(m.conditionsLevel, reading.conditionsLevel),
            ].map((line, i) => (line ? <p key={i}>{line}</p> : null))}
            <p className="text-[var(--muted)]">{m.readingNote}</p>
          </div>
        </Section>
      ) : null}

      <Section title={m.limitsHeading}>
        <ul className="max-w-3xl list-disc space-y-4 pl-5 text-lg leading-relaxed">
          <li>{m.limitProxy}</li>
          <li>{fill(m.limitPeers, { count: map.peerRule.count })}</li>
          <li>{m.limitCorrelation}</li>
          {caveats.map((caveat) => (
            <li key={caveat.id}>
              {caveat.text}{' '}
              {caveat.decisions.map((id, i) => (
                <span key={id}>
                  {i === 0 ? '(' : ', '}
                  <Link href={decisionHref(id)} className="underline underline-offset-4">
                    {fill(m.decisionLink, { id })}
                  </Link>
                  {i === caveat.decisions.length - 1 ? ')' : ''}
                </span>
              ))}
            </li>
          ))}
          {map.artefacts.specific.length > 0 ? (
            <li>
              {fill(m.artefactsLine, { dimension: dimensionName })}
              {artefactLinks(map.artefacts.specific)}.
            </li>
          ) : null}
          {map.artefacts.structural.length > 0 ? (
            <li>
              {m.artefactsStructural}
              {artefactLinks(map.artefacts.structural)}.
            </li>
          ) : null}
        </ul>
        <ul className="mt-8 space-y-2 text-lg">
          <li>
            <Link href={limitsHref} className="underline underline-offset-4">
              {capitalize(lex.agenda.limitsLabel)}
            </Link>
          </li>
          {PAGE_DECISIONS.map((id) => (
            <li key={id}>
              <Link href={decisionHref(id)} className="underline underline-offset-4">
                {capitalize(fill(m.decisionLink, { id }))}
              </Link>
            </li>
          ))}
          {mapIndex ? (
            <li>
              <Link href={mapIndex} className="underline underline-offset-4">
                {m.indexLink}
              </Link>
            </li>
          ) : null}
          {agendaSection ? (
            <li>
              <Link href={layerSectionHref(layer, agendaSection)} className="underline underline-offset-4">
                {m.agendaLink}
              </Link>
            </li>
          ) : null}
          <li>
            <Link href={capabilityHref(dimension)} className="underline underline-offset-4">
              {fill(m.capabilityLink, { dimension: dimensionName })}
            </Link>
          </li>
        </ul>
      </Section>
    </>
  )
}
