import {
  COUNTRIES,
  DATASET_VERSION,
  DIMENSIONS,
  FOR_AGENTS_DOC,
  INDICATORS,
  LIMITS_DOC,
  DECISIONS_DOC,
  isScored,
  rawHref,
} from '@ncb/core'
import { loadIndex } from '@/lib/data'
import {
  METHOD_SUBNAV,
  PRIMARY_NAV,
  aboutHref,
  capabilitiesHref,
  challengeHref,
  thesisHref,
} from '@/lib/links'

/**
 * `/llms.txt`, the entry point for a program, a model or an agent.
 *
 * It is generated rather than written, because a hand-kept file would state a
 * country count and a dataset version that a re-ingest moves. Every number
 * below comes from the registry or from the index the pipeline just wrote, so
 * the file cannot drift from what it describes. See D59.
 *
 * The rules themselves are not here. They are in `docs/FOR-AGENTS.md`, which
 * this file links to as the first thing a reader should open, so the contract
 * has one home and this stays a map.
 */

/** Absolute, because a link in this file is followed outside a browser. */
const abs = (origin: string, path: string): string => `${origin}${path}`

/**
 * One to nine spelled out, numerals from 10. The house copy rule, applied to a
 * count that is computed rather than typed.
 */
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const spell = (n: number): string => WORDS[n] ?? String(n)

/** What each reader lens is for, in one line. Keyed by the nav href. */
const PRIMARY_NOTES: Record<string, string> = {
  '/': 'Every country, nine dimensions each, with the confidence beside every score.',
  [capabilitiesHref]: 'One page per capability: what it asks, what measures it, who scores well.',
  '/agenda': 'What each country should raise, measure and hold, computed from its own profile.',
  [thesisHref]: 'Why capability matters when intelligence, agents and robotics change the conditions of action.',
  '/method': 'How the benchmark is built and how to audit it.',
  [challengeHref]: 'What would overturn the model, and how to file an objection.',
  [aboutHref]: 'What this is, who built it, and where to start reading.',
}

const METHOD_NOTES: Record<string, string> = {
  '/method': 'Normalisation, scoring, confidence and the coverage floor.',
  '/indicators': 'The registry: every indicator, including the declared gaps and the retired rows.',
  '/sources': 'Who publishes each series and the exact call that fetches it.',
  '/diagnostics': 'Correlations, redundancy and the GDP-sensitivity test.',
  '/delphi': 'The expert layer, its provenance, and why it never enters a score.',
  '/patterns': 'Documented deliveries filed against indicators that have no dataset.',
  '/limits': 'Where the model is wrong about the world rather than informative about it.',
  '/decisions': 'Every methodological choice, its cost, and what would overturn it.',
  '/glossary': 'Every term this project invents, defined once.',
}

export async function GET(request: Request): Promise<Response> {
  const { origin } = new URL(request.url)
  const index = await loadIndex()

  const scored = INDICATORS.filter(isScored).length
  const gaps = INDICATORS.filter((i) => i.ingest === 'gap').length
  const retired = INDICATORS.filter((i) => i.ingest === 'retired').length
  const generated = index?.generatedAt?.slice(0, 10) ?? 'unpublished'
  const version = index?.version ?? DATASET_VERSION

  const lines = [
    '# NCB, the National Capability Benchmark',
    '',
    '> A prototype that measures what a country can do, separately from how rich it is.',
    `> ${COUNTRIES.length} countries, ${spell(DIMENSIONS.length)} capability dimensions, each scored 0 to 100 from`,
    '> public data, each with a separate confidence number, and no headline ranking.',
    '',
    `Dataset version ${version}, generated ${generated}. The registry holds ${INDICATORS.length} indicators:`,
    `${scored} are scored, ${gaps} are declared gaps with no adequate dataset, and ${retired} were`,
    'rejected after inspection. Gaps and retired rows stay listed and lower confidence,',
    'because they are the data-collection agenda.',
    '',
    'A score published here never travels alone. It carries a confidence number, the count of',
    'indicators it rests on, and a flag for whether it cleared the coverage floor. Confidence is',
    'never folded into the score. There is no composite and no ranking. Read the contract before',
    'quoting anything.',
    '',
    '## Start here',
    '',
    `- [The quoting contract for automated readers](${rawHref(FOR_AGENTS_DOC)}): what a score means, which fields must travel with it, and the six things not to do with it. Read this first.`,
    `- [Known limits](${rawHref(LIMITS_DOC)}): where the model currently produces a number that is wrong about the world. Rendered at ${abs(origin, '/limits')}.`,
    `- [Decision record](${rawHref(DECISIONS_DOC)}): every methodological choice, what it costs, and what evidence would overturn it. Rendered at ${abs(origin, '/decisions')}.`,
    '',
    '## Data',
    '',
    `- [Data package descriptor](${rawHref('data/out/datapackage.json')}): Frictionless descriptor. Version, licence, sources, and every resource with its schema. Fetch this first.`,
    `- [Country index](${rawHref('data/out/index.json')}): every country, ${spell(DIMENSIONS.length)} dimensions each, with score, confidence, coverage and trend. No indicator rows. This answers every cross-country question.`,
    `- [One country in full](${rawHref('data/out/countries/BRA.json')}): every indicator row with its raw value, its normalised value, its source, its year and its whole series. Swap BRA for any ISO3 code in the index.`,
    `- [One indicator across every country](${rawHref('data/out/indicators/economic_complexity.json')}): the same data turned inside out. Swap the id for any scored indicator.`,
    `- [One capability agenda](${rawHref('data/out/agenda/BRA.json')}): what a country should raise, measure and hold, language neutral, with a rendered markdown edition beside it per language.`,
    `- [Diagnostics](${rawHref('data/out/diagnostics.json')}): correlations, redundancy and the GDP-sensitivity test.`,
    `- [Flat table](${rawHref('data/out/table.csv')}): one row per country and dimension, for a spreadsheet.`,
    '',
    '## Live endpoints',
    '',
    `- [One dimension across every country](${abs(origin, '/api/dimension/coordination')}): score, confidence, trend delta, basket size and span. Swap the id for any of: ${DIMENSIONS.join(', ')}.`,
    `- [One indicator across every country](${abs(origin, '/api/indicator/economic_complexity')}): the JSON the viewer fetches when a reader clicks a number.`,
    '',
    '## Reading',
    '',
    ...PRIMARY_NAV.map(
      (entry) => `- [${entry.label}](${abs(origin, entry.href)}): ${PRIMARY_NOTES[entry.href] ?? ''}`,
    ),
    '',
    '## Method',
    '',
    ...METHOD_SUBNAV.map(
      (entry) => `- [${entry.label}](${abs(origin, entry.href)}): ${METHOD_NOTES[entry.href] ?? ''}`,
    ),
    '',
    '## Optional',
    '',
    `- [Why this exists](${rawHref('docs/WHY.md')}): the claim under test and what would sink it.`,
    `- [The Delphi contract](${rawHref('docs/PANEL.md')}): how the expert layer works, its provenance rules, and why a mock run is never evidence.`,
    `- [The evidence rule](${rawHref('docs/EVIDENCE.md')}): what may be filed as a documented delivery, and what may never be scored.`,
    `- [Third-party terms](${rawHref('NOTICE.md')}): what in this repository is not MIT. The data is CC BY 4.0.`,
    '',
  ]

  return new Response(`${lines.join('\n')}\n`, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
