import type { Metadata } from 'next'
import Link from 'next/link'
import {
  PT_BR,
  countryName,
  countryTopic,
  fill,
  fmt,
  fmtConf,
  indicatorName,
  readCapabilityMap,
  unitName,
} from '@ncb/core'
import type { Dimension } from '@ncb/core'
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
import { countryLayer, layerSection } from '@/lib/layers'
import {
  capabilityHref,
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
 * files, and every sentence compares a value with a median. See D130.
 */
const ISO3 = 'BRA'
const DIMENSION: Dimension = 'adaptability'
/** The decision that records this page, its peer rule and its no-advice rule. */
const PAGE_DECISION = 'D130'

const m = PT_BR.capabilityMap
const lex = PT_BR
const dimensionName = lex.dimensions[DIMENSION]
const topic = countryTopic(lex, ISO3)
const name = countryName(lex, ISO3)

export const metadata: Metadata = {
  title: fill(m.metaTitle, { dimension: dimensionName, country: name }),
  description: fill(m.metaDescription, { dimension: dimensionName, countryTopic: topic }),
}

const money = (n: number): string =>
  `US$ ${n.toLocaleString(lex.numberLocale, { maximumFractionDigits: 0 })}`
const r = (n: number | null): string => (n === null ? '?' : fmtConf(n, lex.numberLocale))
const list = (items: string[]): string =>
  new Intl.ListFormat(lex.numberLocale, { style: 'long', type: 'conjunction' }).format(items)
const lowerFirst = (s: string): string => s.charAt(0).toLowerCase() + s.slice(1)

export default async function BrazilAdaptabilityMapPage() {
  const layer = countryLayer(ISO3)
  const loaded = await loadCapabilityMap(ISO3, DIMENSION)
  if (!layer || !loaded) {
    return (
      <Empty hint="Ainda não há dados gerados. Rode pnpm bench all na raiz do repositório e recarregue." />
    )
  }
  const { map, subject, version } = loaded
  const reading = readCapabilityMap(map)
  const agendaSection = layerSection(layer, 'agenda')
  const subjectConditions = subject.dimensions[DIMENSION]?.conditions ?? []
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

  const caveats = map.rows.flatMap((row) => {
    const caveat = m.rowCaveats[row.id]
    return caveat ? [{ id: row.id, ...caveat }] : []
  })

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
              </span>
            </li>
          ))}
        </ul>
        {map.gaps.length > 0 ? (
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
            {fill(m.gapsLine, { list: list(map.gaps.map((id) => lowerFirst(rowName(id)))) })}
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
        </ul>
        <ul className="mt-8 space-y-2 text-lg">
          <li>
            <Link href={limitsHref} className="underline underline-offset-4">
              {capitalize(lex.agenda.limitsLabel)}
            </Link>
          </li>
          <li>
            <Link href={decisionHref(PAGE_DECISION)} className="underline underline-offset-4">
              {capitalize(fill(m.decisionLink, { id: PAGE_DECISION }))}
            </Link>
          </li>
          {agendaSection ? (
            <li>
              <Link href={layerSectionHref(layer, agendaSection)} className="underline underline-offset-4">
                {m.agendaLink}
              </Link>
            </li>
          ) : null}
          <li>
            <Link href={capabilityHref(DIMENSION)} className="underline underline-offset-4">
              {fill(m.capabilityLink, { dimension: dimensionName })}
            </Link>
          </li>
        </ul>
      </Section>
    </>
  )
}
