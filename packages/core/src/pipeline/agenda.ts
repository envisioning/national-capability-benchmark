import {
  COUNTRY_FRAMES,
  COUNTRY_NAMES,
  DIMENSIONS,
  INDICATORS_BY_ID,
  REFERENCE_ISO3,
  indicatorsFor,
} from '../model/index.js'
import type {
  CountryResult,
  Dimension,
  EvidenceRecord,
} from '../model/index.js'
import { CONFIDENCE_BANDS, confidenceBand } from './confidence.js'
import type { ConfidenceBandId } from './confidence.js'
import { primaryMomentum } from './trend.js'
import { mdTable } from './report.js'
import { fill } from '../i18n/index.js'
import type { Lexicon } from '../i18n/index.js'
import { round } from './stats.js'

/**
 * The capability agenda: the country's scores turned into a list of things to
 * do, computed from the data rather than written beside it.
 *
 * The JSON is language neutral and is the ground layer. The rendered markdown
 * is an interpretation layer over it, one file per lexicon. Nothing in this
 * module invents a number: every figure comes from the scored output, every
 * gap from the registry, every case from the evidence records. See D35.
 */

export const REPO_URL = 'https://github.com/envisioning/national-capability-benchmark'

/** How many exemplar countries an agenda item names. */
const EXEMPLAR_COUNT = 3
/** Dimensions scoring below this, with usable evidence, become raise items. */
const RAISE_BELOW = 50

export type AgendaKind = 'raise' | 'measure' | 'hold'

export type AgendaExemplar = {
  iso3: string
  country: string
  score: number
  confidence: number
}

export type AgendaEvidenceRef = {
  id: string
  iso3: string
  country: string
  indicatorId: string
  title: string
}

export type AgendaTrend = {
  spanYears: number
  delta: number
  basket: number
}

export type AgendaDimension = {
  dimension: Dimension
  kind: AgendaKind
  score: number | null
  confidence: number
  band: ConfidenceBandId
  trend: AgendaTrend | null
  /** Ids of indicators the score currently rests on. */
  scoredOn: string[]
  /** Declared gaps in this dimension. */
  gaps: string[]
  /** Datasets that exist and were rejected. They lower confidence like gaps do. */
  retired: string[]
  /** Highest-scoring countries with usable evidence, the subject excluded. */
  exemplars: AgendaExemplar[]
  /** Evidence records other countries filed against this dimension's gaps. */
  evidenceElsewhere: AgendaEvidenceRef[]
}

export type CountryAgenda = {
  generatedAt: string
  iso3: string
  country: string
  frame: 'reference' | 'extended'
  /** All nine dimensions, in canonical order. Priority is derived from `kind`. */
  dimensions: AgendaDimension[]
  /** The subject country's own evidence records, across all dimensions. */
  ownEvidence: Array<{
    id: string
    indicatorId: string
    dimension: Dimension
    title: string
    claim: string
  }>
  /** Total declared gaps across the registry, the size of the measurement agenda. */
  gapCount: number
}

const usableMin = (): number => {
  const band = CONFIDENCE_BANDS.find((b) => b.id === 'usable')
  if (!band) throw new Error('confidence bands are missing the usable band')
  return band.min
}

export function buildAgenda(
  countries: CountryResult[],
  evidence: EvidenceRecord[],
  iso3: string,
  generatedAt: string,
): CountryAgenda {
  const subject = countries.find((c) => c.iso3 === iso3)
  if (!subject) throw new Error(`No scored result for ${iso3}`)
  const usable = usableMin()

  const dimensions: AgendaDimension[] = DIMENSIONS.map((dimension) => {
    const result = subject.dimensions[dimension]
    if (!result) throw new Error(`${iso3} has no result for ${dimension}`)

    const defs = indicatorsFor(dimension)
    const gaps = defs.filter((d) => d.ingest === 'gap').map((d) => d.id)
    const retired = defs.filter((d) => d.ingest === 'retired').map((d) => d.id)
    const scoredOn = result.indicators
      .filter((i) => i.status === 'observed')
      .map((i) => i.indicatorId)

    const kind: AgendaKind =
      result.confidence < usable
        ? 'measure'
        : result.score !== null && result.score < RAISE_BELOW
          ? 'raise'
          : 'hold'

    const momentum = primaryMomentum(result.momentum)
    const trend: AgendaTrend | null = momentum
      ? {
          spanYears: momentum.currentYear - momentum.baseYear,
          delta: momentum.delta,
          basket: momentum.matchedIndicators,
        }
      : null

    const exemplars: AgendaExemplar[] = countries
      .filter((c) => c.iso3 !== iso3)
      .map((c) => ({ iso3: c.iso3, result: c.dimensions[dimension] }))
      .filter(
        (c): c is { iso3: string; result: NonNullable<typeof c.result> } =>
          c.result !== undefined &&
          c.result.score !== null &&
          c.result.confidence >= usable,
      )
      .sort((a, b) => (b.result.score ?? 0) - (a.result.score ?? 0))
      .slice(0, EXEMPLAR_COUNT)
      .map((c) => ({
        iso3: c.iso3,
        country: COUNTRY_NAMES[c.iso3] ?? c.iso3,
        score: c.result.score as number,
        confidence: c.result.confidence,
      }))

    const dimensionIndicatorIds = new Set(defs.map((d) => d.id))
    const evidenceElsewhere: AgendaEvidenceRef[] = evidence
      .filter((r) => r.iso3 !== iso3 && dimensionIndicatorIds.has(r.indicatorId))
      .map((r) => ({
        id: r.id,
        iso3: r.iso3,
        country: COUNTRY_NAMES[r.iso3] ?? r.iso3,
        indicatorId: r.indicatorId,
        title: r.title,
      }))

    return {
      dimension,
      kind,
      score: result.score,
      confidence: result.confidence,
      band: confidenceBand(result.confidence).id,
      trend,
      scoredOn,
      gaps,
      retired,
      exemplars,
      evidenceElsewhere,
    }
  })

  const ownEvidence = evidence
    .filter((r) => r.iso3 === iso3)
    .map((r) => ({
      id: r.id,
      indicatorId: r.indicatorId,
      dimension: INDICATORS_BY_ID[r.indicatorId]?.dimension as Dimension,
      title: r.title,
      claim: r.claim,
    }))

  return {
    generatedAt,
    iso3,
    country: subject.country,
    frame: COUNTRY_FRAMES[iso3] ?? 'extended',
    dimensions,
    ownEvidence,
    gapCount: dimensions.reduce((n, d) => n + d.gaps.length, 0),
  }
}

/* ------------------------------ Rendering ------------------------------ */

const fmt = (n: number, locale: string): string =>
  round(n, 1).toLocaleString(locale, { maximumFractionDigits: 1 })

/** Confidence keeps two decimals: 0.54 and 0.48 must not both print as 0.5. */
const fmtConf = (n: number, locale: string): string =>
  round(n, 2).toLocaleString(locale, { maximumFractionDigits: 2 })

const countryName = (lex: Lexicon, iso3: string): string =>
  lex.countries[iso3] ?? COUNTRY_NAMES[iso3] ?? iso3

/** The name as it sits in prose: with its article in languages that use one. */
const countryTopic = (lex: Lexicon, iso3: string): string => {
  const article = lex.countryArticles[iso3]
  return article ? `${article} ${countryName(lex, iso3)}` : countryName(lex, iso3)
}

const signed = (n: number, locale: string): string =>
  (n > 0 ? '+' : '') + fmt(n, locale)

const indicatorName = (lex: Lexicon, id: string): string =>
  lex.indicators[id] ?? INDICATORS_BY_ID[id]?.name ?? id

const indicatorDefinition = (lex: Lexicon, id: string): string =>
  lex.indicatorDefinitions[id] ?? INDICATORS_BY_ID[id]?.definition ?? ''

function trendCell(lex: Lexicon, trend: AgendaTrend | null): string {
  if (!trend) return lex.agenda.noTrend
  return fill(lex.agenda.trendCell, {
    delta: signed(trend.delta, lex.numberLocale),
    years: trend.spanYears,
    n: trend.basket,
  })
}

/** Render one country's agenda through one lexicon. Same JSON, any language. */
export function renderAgenda(agenda: CountryAgenda, lex: Lexicon): string {
  const s = lex.agenda
  const out: string[] = []
  const date = agenda.generatedAt.slice(0, 10)

  const name = countryName(lex, agenda.iso3)
  const topic = countryTopic(lex, agenda.iso3)

  out.push(`# ${fill(s.title, { country: name })}`)
  out.push('')
  out.push(fill(s.intro, { date, reference: REFERENCE_ISO3.length }))
  out.push('')

  out.push(`## ${fill(s.standingHeading, { countryTopic: topic })}`)
  out.push('')
  out.push(
    mdTable(
      [s.colDimension, s.colScore, s.colConfidence, s.colTrend],
      agenda.dimensions.map((d) => [
        lex.dimensions[d.dimension],
        d.score === null ? s.noScore : fmt(d.score, lex.numberLocale),
        `${fmtConf(d.confidence, lex.numberLocale)} (${lex.bands[d.band]})`,
        trendCell(lex, d.trend),
      ]),
    ),
  )
  out.push('')

  const raise = agenda.dimensions
    .filter((d) => d.kind === 'raise')
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
  if (raise.length > 0) {
    out.push(`## ${s.raiseHeading}`)
    out.push('')
    out.push(s.raiseIntro)
    out.push('')
    for (const d of raise) {
      out.push(
        `### ${fill(s.raiseItemHeading, {
          dimension: lex.dimensions[d.dimension],
          score: d.score === null ? s.noScore : fmt(d.score, lex.numberLocale),
          band: lex.bands[d.band],
        })}`,
      )
      out.push('')
      out.push(lex.questions[d.dimension])
      out.push('')
      const lines: string[] = []
      lines.push(
        d.scoredOn.length === 1 ? s.scoredOnOne : fill(s.scoredOn, { n: d.scoredOn.length }),
      )
      if (d.exemplars.length > 0) {
        lines.push(
          fill(s.exemplarsLine, {
            list: d.exemplars
              .map((e) => `${countryName(lex, e.iso3)} ${fmt(e.score, lex.numberLocale)}`)
              .join(', '),
          }),
        )
      }
      if (d.evidenceElsewhere.length > 0) {
        lines.push(
          fill(s.evidenceElsewhereLine, {
            list: d.evidenceElsewhere
              .map((e) => `${e.title} (${countryName(lex, e.iso3)})`)
              .join('; '),
          }),
        )
      }
      if (d.gaps.length > 0) {
        lines.push(
          fill(s.gapsLine, {
            list: d.gaps.map((id) => indicatorName(lex, id)).join(', '),
          }),
        )
      }
      out.push(lines.map((l) => `- ${l}`).join('\n'))
      out.push('')
    }
  }

  const measure = agenda.dimensions
    .filter((d) => d.kind === 'measure')
    .sort((a, b) => a.confidence - b.confidence)
  if (measure.length > 0) {
    out.push(`## ${s.measureHeading}`)
    out.push('')
    out.push(s.measureIntro)
    out.push('')
    for (const d of measure) {
      out.push(
        `### ${fill(s.measureItemHeading, {
          dimension: lex.dimensions[d.dimension],
          confidence: fmtConf(d.confidence, lex.numberLocale),
          band: lex.bands[d.band],
        })}`,
      )
      out.push('')
      out.push(lex.questions[d.dimension])
      out.push('')
      const lines: string[] = []
      lines.push(
        d.scoredOn.length === 1 ? s.scoredOnOne : fill(s.scoredOn, { n: d.scoredOn.length }),
      )
      if (d.gaps.length > 0) {
        lines.push(
          fill(s.gapsLine, {
            list: d.gaps.map((id) => indicatorName(lex, id)).join(', '),
          }),
        )
      }
      out.push(lines.map((l) => `- ${l}`).join('\n'))
      out.push('')
    }
  }

  out.push(`## ${s.agendaHeading}`)
  out.push('')
  out.push(fill(s.agendaIntro, { n: agenda.gapCount }))
  out.push('')
  out.push(
    mdTable(
      [s.colDimension, s.colIndicator, s.colAsks],
      agenda.dimensions.flatMap((d) =>
        d.gaps.map((id) => [
          lex.dimensions[d.dimension],
          indicatorName(lex, id),
          indicatorDefinition(lex, id),
        ]),
      ),
    ),
  )
  out.push('')

  if (agenda.ownEvidence.length > 0) {
    out.push(`## ${fill(s.ownEvidenceHeading, { countryTopic: topic })}`)
    out.push('')
    out.push(s.ownEvidenceIntro)
    out.push('')
    out.push(
      agenda.ownEvidence
        .map((r) => `- **${r.title}** (${lex.dimensions[r.dimension]}). ${r.claim}`)
        .join('\n'),
    )
    out.push('')
  }

  out.push(`## ${s.contributeHeading}`)
  out.push('')
  out.push(fill(s.contributeBody, { repo: REPO_URL }))
  out.push('')

  return out.join('\n')
}
