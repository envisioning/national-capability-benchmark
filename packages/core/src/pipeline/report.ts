import {
  COUNTRY_FRAMES,
  DIMENSIONS,
  DIMENSION_LABELS,
  INDICATORS_BY_ID,
  isEvidential,
} from '../model/index.js'
import { CONFIDENCE_BANDS, confidenceBand } from './confidence.js'
import { momentumSpansIn } from './trend.js'
import type { CountryResult, DelphiRunFile, Dimension } from '../model/index.js'
import type { Diagnostics } from './diagnostics.js'
import { cellConsensus, indicatorConsensus, missingEvidenceRanking } from '../delphi/consensus.js'
import { median, round } from './stats.js'

export function mdTable(headers: string[], rows: Array<Array<string | number | null>>): string {
  const head = `| ${headers.join(' | ')} |`
  const sep = `| ${headers.map(() => '---').join(' | ')} |`
  const body = rows.map((r) => `| ${r.map((c) => (c === null ? 'no data' : String(c))).join(' | ')} |`)
  return [head, sep, ...body].join('\n')
}

const table = mdTable

export function buildReport(
  countries: CountryResult[],
  diag: Diagnostics,
  delphi: DelphiRunFile | null,
): string {
  const out: string[] = []

  out.push('# National Capability Benchmark, prototype v0')
  out.push('')
  out.push(
    `Generated ${diag.generatedAt}. ${countries.length} countries, nine dimensions, equal weights within each dimension, no headline ranking.`,
  )
  out.push('')
  const extended = countries.filter((c) => COUNTRY_FRAMES[c.iso3] === 'extended')
  if (extended.length > 0) {
    out.push(
      `Scores run against a frame fixed by the ${countries.length - extended.length} reference countries. ${extended.length} countries were added after that frame was set and are marked below. Adding them did not move any existing score.`,
    )
    out.push('')
  }
  out.push('')

  out.push('## Each country gets nine scores and no ranking')
  out.push('')
  out.push(
    table(
      ['Country', ...DIMENSIONS.map((d) => DIMENSION_LABELS[d])],
      countries.map((c) => [
        c.country + (COUNTRY_FRAMES[c.iso3] === 'extended' ? ' (added)' : ''),
        ...DIMENSIONS.map((d) => c.dimensions[d]?.score ?? null),
      ]),
    ),
  )
  out.push('')
  out.push('Confidence is reported separately and never folded into the score above. Each cell shows the number and the band it falls in.')
  out.push('')
  out.push(
    table(
      ['Country', ...DIMENSIONS.map((d) => DIMENSION_LABELS[d])],
      countries.map((c) => [
        c.country,
        ...DIMENSIONS.map((d) => {
          const v = c.dimensions[d]?.confidence
          return v === undefined ? null : `${v.toFixed(2)} ${confidenceBand(v).label}`
        }),
      ]),
    ),
  )
  out.push('')
  out.push('## Where each country is moving, on the same ruler')
  out.push('')
  const lists = countries.flatMap((c) => DIMENSIONS.map((d) => c.dimensions[d]?.momentum ?? []))
  const spans = momentumSpansIn(lists)
  if (spans.length === 0) {
    out.push('No dimension has enough indicators observed at both ends of any span.')
    out.push('')
  } else {
    out.push(
      'Change in dimension score, scored against the current frame so the scale holds still, and computed only on the indicators observed at both ends. That matched basket is smaller than the full dimension, so these numbers move on a different base from the scores above. The number in brackets is how many indicators carry the cell.',
    )
    out.push('')
    for (const span of spans) {
      const at = (c: CountryResult, d: Dimension) =>
        (c.dimensions[d]?.momentum ?? []).find((m) => m.currentYear - m.baseYear === span) ?? null
      out.push(`### Over ${span} years`)
      out.push('')
      out.push(
        table(
          ['Country', ...DIMENSIONS.map((d) => DIMENSION_LABELS[d])],
          countries.map((c) => [
            c.country,
            ...DIMENSIONS.map((d) => {
              const m = at(c, d)
              if (!m) return null
              return `${m.delta > 0 ? '+' : ''}${m.delta.toFixed(1)} (${m.matchedIndicators})`
            }),
          ]),
        ),
      )
      out.push('')
      const medians = DIMENSIONS.map((d) => {
        const deltas = countries
          .map((c) => at(c, d)?.delta)
          .filter((v): v is number => typeof v === 'number')
        return {
          dimension: d,
          median: deltas.length ? round(median(deltas), 1) : null,
          n: deltas.length,
        }
      }).filter((r) => r.median !== null)
      out.push(
        table(
          ['Dimension', `Median change over ${span} years`, 'Countries with a trend'],
          medians.map((r) => [DIMENSION_LABELS[r.dimension], r.median, r.n]),
        ),
      )
      out.push('')
    }
    out.push(
      'Read the median before the country. Several indicators measure adoption of things that spread worldwide, so almost every country rises and a positive number is not evidence of catching up. A country gains ground only where its change beats the median in that column. The short span is broad and shallow, the long span is narrow and deep, and a dimension that appears in one and not the other is telling you how far its data reaches.',
    )
    out.push('')
  }

  const best = Math.max(
    ...countries.flatMap((c) => DIMENSIONS.map((d) => c.dimensions[d]?.confidence ?? 0)),
  )
  const topBand = confidenceBand(best)
  out.push(
    `The strongest evidence base anywhere in this run scores ${best.toFixed(2)}, which is ${topBand.label}. No country and dimension pair reaches the good band.`,
  )
  out.push('')
  out.push('Bands:')
  out.push('')
  for (let i = 0; i < CONFIDENCE_BANDS.length; i++) {
    const b = CONFIDENCE_BANDS[i] as (typeof CONFIDENCE_BANDS)[number]
    const above = CONFIDENCE_BANDS[i - 1]
    const range = above ? `${b.min.toFixed(2)} to ${above.min.toFixed(2)}` : `${b.min.toFixed(2)} and above`
    out.push(`- **${b.label}** (${range}): ${b.meaning}`)
  }
  out.push('')

  out.push('## Some dimensions are far better measured than others')
  out.push('')
  const measurability = [...diag.measurability].sort((a, b) => b.meanConfidence - a.meanConfidence)
  out.push(
    table(
      ['Dimension', 'Indicators', 'Observed', 'Gaps', 'Mean coverage', 'Mean confidence', 'Subjectivity share'],
      measurability.map((m) => [
        DIMENSION_LABELS[m.dimension],
        m.indicatorsDefined,
        m.indicatorsObserved,
        m.gaps,
        m.meanCoverage,
        m.meanConfidence,
        m.subjectivityShare,
      ]),
    ),
  )
  out.push('')
  const easiest = measurability.slice(0, 3).map((m) => DIMENSION_LABELS[m.dimension])
  const hardest = measurability.slice(-3).map((m) => DIMENSION_LABELS[m.dimension])
  out.push(`Best measured: ${easiest.join(', ')}. Weakest evidence base: ${hardest.join(', ')}.`)
  out.push('')

  out.push('## Some dimensions rest mostly on judgment')
  out.push('')
  const subjective = [...diag.measurability]
    .filter((m) => m.subjectivityShare >= 0.5)
    .sort((a, b) => b.subjectivityShare - a.subjectivityShare)
  if (subjective.length === 0) {
    out.push('No dimension is carried mostly by perception proxies and unmeasured items.')
  } else {
    for (const m of subjective) {
      out.push(
        `- **${DIMENSION_LABELS[m.dimension]}**: ${Math.round(m.subjectivityShare * 100)}% of its indicators are perception proxies or have no data at all (${m.gaps} of ${m.indicatorsDefined} unmeasured).`,
      )
    }
  }
  out.push('')

  out.push('## Every dimension is checked against GDP per capita')
  out.push('')
  out.push(
    table(
      ['Dimension', 'Pearson r vs log GDP per capita', 'Spearman', 'n'],
      [...diag.dimensionVsGdp]
        .sort((a, b) => Math.abs(b.pearson ?? 0) - Math.abs(a.pearson ?? 0))
        .map((d) => [DIMENSION_LABELS[d.dimension], d.pearson, d.spearman, d.n]),
    ),
  )
  out.push('')

  out.push('## Every indicator is checked the same way')
  out.push('')
  const wealthy = diag.indicatorVsGdp.filter((i) => i.flaggedAsWealthProxy)
  out.push(
    table(
      ['Indicator', 'Dimension', 'Class', 'r vs log GDP pc', 'Registry prior'],
      wealthy.map((i) => [
        INDICATORS_BY_ID[i.indicatorId]?.name ?? i.indicatorId,
        DIMENSION_LABELS[i.dimension],
        i.measurementClass,
        i.r,
        i.wealthProxyPrior,
      ]),
    ),
  )
  out.push('')

  out.push('## The model is re-scored without its wealth-correlated indicators')
  out.push('')
  out.push(`Dropped ${diag.gdpStrippedTest.excluded.length} indicators correlating with log GDP per capita at 0.7 or above, then re-scored.`)
  out.push('')
  if (diag.gdpStrippedTest.dimensionsEmptied.length > 0) {
    out.push(
      `${diag.gdpStrippedTest.dimensionsEmptied.map((d) => DIMENSION_LABELS[d]).join(' and ')} lose every measured indicator in this test and cannot be scored at all without wealth-correlated evidence. That is the strongest single result in the prototype: as currently specified, those dimensions are not separable from income per head.`,
    )
    out.push('')
  }
  out.push(
    table(
      ['Dimension', 'Mean absolute score shift', 'Countries changing rank position'],
      DIMENSIONS.map((d) => [
        DIMENSION_LABELS[d],
        diag.gdpStrippedTest.perDimensionMeanAbsShift.find((x) => x.dimension === d)?.meanAbsShift ?? null,
        diag.gdpStrippedTest.rankChanges.find((x) => x.dimension === d)?.changedPositions ?? null,
      ]),
    ),
  )
  out.push('')

  out.push('## Indicator pairs are checked for redundancy')
  out.push('')
  if (diag.redundantIndicatorPairs.length === 0) {
    out.push('No indicator pair reaches 0.85 across the ten countries.')
  } else {
    out.push(
      table(
        ['Indicator A', 'Indicator B', 'r'],
        diag.redundantIndicatorPairs
          .slice(0, 25)
          .map((p) => [
            INDICATORS_BY_ID[p.a]?.name ?? p.a,
            INDICATORS_BY_ID[p.b]?.name ?? p.b,
            p.r,
          ]),
      ),
    )
  }
  out.push('')

  out.push('## Dimension pairs are checked for overlap')
  out.push('')
  if (diag.duplicateDimensionCandidates.length === 0) {
    out.push('No dimension pair reaches 0.9. The nine dimensions carry distinct information at this sample size.')
  } else {
    out.push(
      table(
        ['Dimension A', 'Dimension B', 'r'],
        diag.duplicateDimensionCandidates.map((p) => [
          DIMENSION_LABELS[p.a as Dimension],
          DIMENSION_LABELS[p.b as Dimension],
          p.r,
        ]),
      ),
    )
  }
  out.push('')
  out.push(
    `${countries.length} countries give ${countries.length - 2} degrees of freedom, so treat every correlation here as a hint rather than a result.`,
  )
  out.push('')

  out.push('## Switzerland, Singapore and Estonia are compared directly')
  out.push('')
  const focus = ['CHE', 'SGP', 'EST']
  out.push(
    table(
      ['Dimension', ...focus],
      DIMENSIONS.map((d) => [
        DIMENSION_LABELS[d],
        ...focus.map((iso3) => countries.find((c) => c.iso3 === iso3)?.dimensions[d]?.score ?? null),
      ]),
    ),
  )
  out.push('')

  out.push('## Brazil is the reference case')
  out.push('')
  const brazil = countries.find((c) => c.iso3 === 'BRA')
  if (brazil) {
    const ranked = DIMENSIONS.map((d) => ({ d, s: brazil.dimensions[d]?.score ?? null }))
      .filter((x): x is { d: Dimension; s: number } => x.s !== null)
      .sort((a, b) => b.s - a.s)
    out.push(
      `Strongest: ${ranked.slice(0, 3).map((x) => `${DIMENSION_LABELS[x.d]} (${x.s})`).join(', ')}.`,
    )
    out.push('')
    out.push(
      `Weakest: ${ranked.slice(-3).map((x) => `${DIMENSION_LABELS[x.d]} (${x.s})`).join(', ')}.`,
    )
  }
  out.push('')

  out.push('## Some indicators have no dataset behind them')
  out.push('')
  const byDimension = new Map<Dimension, typeof diag.dataGaps>()
  for (const g of diag.dataGaps) {
    const list = byDimension.get(g.dimension) ?? []
    list.push(g)
    byDimension.set(g.dimension, list)
  }
  for (const d of DIMENSIONS) {
    const list = byDimension.get(d)
    if (!list?.length) continue
    out.push(`**${DIMENSION_LABELS[d]}**`)
    out.push('')
    for (const g of list) out.push(`- ${g.name}: ${g.reason}`)
    out.push('')
  }

  if (delphi) {
    out.push('## A panel of models scored the same cells')
    out.push('')
    out.push(
      `Run ${delphi.runId}, provenance \`${delphi.provenance}\`, ${delphi.rounds} round(s), panel: ${delphi.panel.map((p) => `${p.stance} (${p.model})`).join(', ')}.`,
    )
    out.push('')
    if (!isEvidential(delphi.provenance)) {
      out.push(
        '> This run came from the deterministic offline stand-in. It exercises the pipeline and is not evidence about any country.',
      )
      out.push('')
    } else if (delphi.panel.length < 3) {
      out.push(
        `> Only ${delphi.panel.length} panelist(s). There is no distribution: the median is one opinion and the interquartile range is zero. Read the numbers below as a single judgment.`,
      )
      out.push('')
    }
    if (delphi.note) {
      out.push(`> ${delphi.note}`)
      out.push('')
    }

    const cells = cellConsensus(delphi)
    const finalRound = Math.max(...cells.map((c) => c.round), 0)
    const finals = cells.filter((c) => c.round === finalRound)

    const converged = finals.filter((c) => c.iqrShift !== null && c.iqrShift < 0).length
    const withShift = finals.filter((c) => c.iqrShift !== null).length
    if (withShift > 0) {
      out.push(`Convergence: ${converged} of ${withShift} cells narrowed between rounds.`)
      out.push('')
    }

    const dissent = finals.filter((c) => c.dissent).sort((a, b) => b.iqr - a.iqr)
    out.push('### The panel is allowed to stay split')
    out.push('')
    if (dissent.length === 0) {
      out.push('No cell has an interquartile range above 25 points.')
    } else {
      out.push(
        table(
          ['Country', 'Dimension', 'Median', 'IQR', 'Range'],
          dissent
            .slice(0, 20)
            .map((c) => [c.country, DIMENSION_LABELS[c.dimension], c.median, c.iqr, `${c.min} to ${c.max}`]),
        ),
      )
    }
    out.push('')

    out.push('### The panel and the indicators disagree most here')
    out.push('')
    out.push(
      table(
        ['Country', 'Dimension', 'Indicator score', 'Panel median', 'Difference'],
        finals
          .map((c) => {
            const indicatorScore = countries.find((x) => x.iso3 === c.iso3)?.dimensions[c.dimension]?.score ?? null
            return {
              c,
              indicatorScore,
              diff: indicatorScore === null ? null : round(c.median - indicatorScore, 1),
            }
          })
          .filter((r) => r.diff !== null)
          .sort((a, b) => Math.abs(b.diff as number) - Math.abs(a.diff as number))
          .slice(0, 20)
          .map((r) => [
            r.c.country,
            DIMENSION_LABELS[r.c.dimension],
            r.indicatorScore,
            r.c.median,
            r.diff,
          ]),
      ),
    )
    out.push('')

    const judged = indicatorConsensus(delphi)
    if (judged.length > 0) {
      out.push('### The panel rates these indicators weakest')
      out.push('')
      out.push(
        table(
          ['Indicator', 'Registry class', 'Panel class', 'Construct validity', 'Wealth proxy risk', 'Prior'],
          judged
            .slice(0, 20)
            .map((j) => [
              INDICATORS_BY_ID[j.indicatorId]?.name ?? j.indicatorId,
              j.registryClass,
              j.panelClass === j.registryClass ? j.panelClass : `${j.panelClass} (reclassified)`,
              j.constructValidity,
              j.wealthProxyRisk,
              j.wealthProxyPrior,
            ]),
        ),
      )
      out.push('')
    }

    const missing = missingEvidenceRanking(delphi)
    if (missing.length > 0) {
      out.push('### The panel named the evidence it wanted')
      out.push('')
      out.push(
        table(
          ['Evidence', 'Mentions', 'Dimensions'],
          missing.slice(0, 25).map((m) => [m.evidence, m.mentions, m.dimensions.length]),
        ),
      )
      out.push('')
    }
  }

  out.push('## These assumptions can be challenged')
  out.push('')
  out.push('- The 0 to 100 scale is fixed by the ten reference countries. Countries added later are scored against that frame and never move it. See docs/DECISIONS.md D16.')
  out.push('- Indicators inside a dimension carry equal weight. No expert weighting has been applied.')
  out.push('- Only the most recent observation per indicator is used. There is no trend line and nothing is smoothed.')
  out.push('- Winsorizing uses Tukey fences at three interquartile ranges, so it clips extreme outliers only.')
  out.push('- A missing indicator lowers confidence and is dropped from the mean. It is never imputed.')
  out.push('- Confidence is coverage x recency x source quality and is reported beside the score, never inside it.')
  out.push('- Delphi estimates are stored separately from indicator scores and never enter `score`.')
  out.push('')

  return `${out.join('\n')}\n`
}
