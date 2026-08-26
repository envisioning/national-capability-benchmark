import {
  COUNTRY_NAMES,
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_QUESTIONS,
  MEASUREMENT_CLASS_LABELS,
  indicatorsFor,
} from '../model/index.js'
import type { CountryResult, Dimension, IndicatorDef, IndicatorResult } from '../model/index.js'
import type { Panelist } from './panel.js'

export const SYSTEM_RULES = `You are a panelist on a Delphi study building the Envisioning National Capability Benchmark.

The benchmark measures a country's capacity to anticipate change, coordinate action, learn, adapt and build under uncertainty. It does not measure wealth, quality of life, competitiveness or government popularity.

Rules you must follow:
- Scores are relative to the ten prototype countries only: Brazil, United States, Netherlands, Switzerland, Singapore, South Korea, Estonia, India, Chile, South Africa. 0 is the weakest of these ten, 100 the strongest. Do not score against a global or absolute frontier.
- Capability is not the same as outcome or endowment. A rich country that cannot execute scores low on Building. A poor country that reallocates fast scores high on Adaptability.
- Political uniformity is not a capability. On Shared Purpose the target is productive pluralism and capacity for collective action, not consensus or national pride.
- Say what you do not know. A wide confidence interval is a legitimate answer and is more useful to us than false precision.
- Reason from the evidence given plus what you reliably know. Do not invent statistics or cite figures you cannot support.`

function indicatorLine(def: IndicatorDef, row: IndicatorResult | undefined): string {
  const cls = `${def.measurementClass} (${MEASUREMENT_CLASS_LABELS[def.measurementClass]})`
  if (!row || row.status === 'gap') {
    return `- ${def.name} [${cls}] — NO DATA. ${def.notes}`
  }
  if (row.status === 'missing') {
    return `- ${def.name} [${cls}] — missing for this country. Source: ${row.source}.`
  }
  return `- ${def.name} [${cls}] — raw ${row.raw} ${def.unit} (${row.year}), normalised ${row.normalized}/100 across the ten. Source: ${row.source}.${row.winsorized ? ' Value was winsorized.' : ''}`
}

export function evidenceBrief(result: CountryResult): string {
  const blocks = DIMENSIONS.map((dimension) => {
    const dim = result.dimensions[dimension]
    if (!dim) return ''
    const defs = indicatorsFor(dimension)
    const lines = defs.map((def, i) => indicatorLine(def, dim.indicators[i])).join('\n')
    const derived =
      dim.score === null
        ? 'no indicator-derived score (no usable data)'
        : `indicator-derived score ${dim.score}/100`
    return `## ${DIMENSION_LABELS[dimension]}
Question: ${DIMENSION_QUESTIONS[dimension]}
Evidence coverage: ${Math.round(dim.confidenceParts.coverage * 100)}% of defined indicators, mean evidence age weight ${dim.confidenceParts.recency}, ${derived}.
${lines}`
  })
  return `# Evidence brief: ${COUNTRY_NAMES[result.iso3] ?? result.country} (${result.iso3})\n\n${blocks.join('\n\n')}`
}

export function round1CellPrompt(panelist: Panelist, result: CountryResult): string {
  return `${panelist.stance.prompt}

${evidenceBrief(result)}

Score all nine dimensions for ${COUNTRY_NAMES[result.iso3] ?? result.country} on 0-100, relative to the ten prototype countries.

The indicator-derived score is one input, not the answer. Where evidence is thin or stale, say so and use your own knowledge, and set a lower selfConfidence. Where the indicators clearly mismeasure the dimension for this country, depart from them and explain why in one or two sentences.

For each dimension also list the specific evidence you would need in order to raise your confidence. Be concrete: name a dataset, a statistic or an observable event, not "more data".`
}

export function round2CellPrompt(
  panelist: Panelist,
  result: CountryResult,
  summary: string,
): string {
  return `${panelist.stance.prompt}

${evidenceBrief(result)}

# Round 1 panel results (anonymised)
${summary}

This is round 2. Read what the rest of the panel argued. Revise any score where another panelist has made a point you cannot answer. Hold any score you still believe, and say what the others got wrong.

Do not converge for the sake of converging. A stable disagreement that you can defend is a finding, and we record it.`
}

export function indicatorJudgementPrompt(panelist: Panelist, dimension: Dimension): string {
  const defs = indicatorsFor(dimension)
  const rows = defs
    .map(
      (d) =>
        `- id: ${d.id}
  name: ${d.name}
  definition: ${d.definition}
  unit: ${d.unit}
  currently filed as: ${d.measurementClass} (${MEASUREMENT_CLASS_LABELS[d.measurementClass]})
  direction: ${d.direction}
  source: ${d.source.publisher}${d.source.series ? ` ${d.source.series}` : ''} (${d.ingest === 'gap' ? 'no data available' : d.ingest === 'retired' ? 'disqualified, not scored' : d.ingest})
  our note: ${d.notes}`,
    )
    .join('\n')

  return `${panelist.stance.prompt}

You are auditing the indicator set for one dimension of the benchmark.

Dimension: ${DIMENSION_LABELS[dimension]}
Question the dimension must answer: ${DIMENSION_QUESTIONS[dimension]}

Indicators currently filed under it:
${rows}

For every indicator, judge:
1. measurementClass — is it C (a direct capability measure), I (an input to the capability), O (a downstream outcome correlated with it), or P (a perception proxy)? Correct our filing where we got it wrong.
2. constructValidity 0-1 — does it measure this dimension, or something adjacent?
3. wealthProxyRisk 0-1 — how much of its variation across countries is income per head rather than capability?
4. redundantWith — ids of other indicators in this list that carry the same information.
5. rationale — one or two sentences.

Judge every indicator in the list, including the ones with no data.`
}

export function anonymiseRound(
  estimates: Array<{ dimension: Dimension; score: number; rationale: string; panelist: string }>,
  self: string,
): string {
  const byDimension = new Map<Dimension, typeof estimates>()
  for (const e of estimates) {
    const list = byDimension.get(e.dimension) ?? []
    list.push(e)
    byDimension.set(e.dimension, list)
  }
  const blocks: string[] = []
  for (const dimension of DIMENSIONS) {
    const list = byDimension.get(dimension)
    if (!list || list.length === 0) continue
    const scores = list.map((e) => e.score).sort((a, b) => a - b)
    const lines = list
      .map((e, i) => {
        const who = e.panelist === self ? 'you' : `panelist ${String.fromCharCode(65 + i)}`
        return `  - ${who} scored ${e.score}: ${e.rationale}`
      })
      .join('\n')
    blocks.push(
      `${DIMENSION_LABELS[dimension]} — panel range ${scores[0]} to ${scores[scores.length - 1]}\n${lines}`,
    )
  }
  return blocks.join('\n\n')
}
