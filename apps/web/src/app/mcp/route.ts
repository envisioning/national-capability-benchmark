import {
  ARTEFACT_SCOPES,
  COUNTRY_NAMES,
  DATASET_VERSION,
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_QUESTIONS,
  INDICATORS,
  artefactsFor,
  confidenceBand,
  primaryMomentum,
  z,
} from '@ncb/core'
import type { Dimension, IndicatorDef } from '@ncb/core'
import { loadCountry, loadDoc, loadIndex } from '@/lib/data'
import { defineTool, mcpEndpoint, type Prompt } from '@/lib/mcp-server'
import { MCP_SERVER_NAME, MCP_SERVER_VERSION } from '@/lib/mcp-card'
import { COMPARE_MAX, compareHref, countryProfileHref } from '@/lib/links'

/**
 * The public MCP server: https://ncb.envisioning.com/mcp
 *
 * Read-only tools over data/out. The tools enforce the quoting contract in
 * docs/FOR-AGENTS.md: a score always comes with its confidence, its band, the
 * indicator count and the coverage flag, and there is no tool that ranks
 * countries or averages the nine dimensions (D1).
 */

export const dynamic = 'force-dynamic'

const SITE = 'https://ncb.envisioning.com'

const today = (): string => new Date().toISOString().slice(0, 10)

const cite = (title: string, url: string, version: string): string =>
  `${title}. National Capability Benchmark, dataset ${version}. Envisioning. ${url} (accessed ${today()})`

const CONTRACT =
  'Quote a score only with its confidence and band, the indicator count and the coverage flag. Never average the nine dimensions or rank countries (D1). A null score means no position, not zero (D45). Do not compare scores across major dataset versions. Read the limits before quoting.'

/** Lowercase, no accents. */
const fold = (s: string): string => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

/** ISO3 code or English name to ISO3, or null. */
function resolveCountry(input: string): string | null {
  const code = input.trim().toUpperCase()
  if (COUNTRY_NAMES[code]) return code
  const q = fold(input.trim())
  const exact = Object.entries(COUNTRY_NAMES).find(([, name]) => fold(name) === q)
  if (exact) return exact[0]
  const partial = Object.entries(COUNTRY_NAMES).filter(([, name]) => fold(name).includes(q))
  return partial.length === 1 ? (partial[0]?.[0] ?? null) : null
}

const unknownCountry = (input: string) =>
  `No country matches "${input}". Use an ISO3 code (for example BRA) or the English name. list_dimensions gives the frame size; the country list is at ${SITE}/countries.`

type DimensionResult = {
  score: number | null
  confidence: number
  observedIndicators: number
  belowCoverageFloor: boolean
  delphiScore?: number | null
  delphiIqr?: number | null
  blendedScore?: number | null
  blendedFrom?: string | null
  momentum: Parameters<typeof primaryMomentum>[0]
}

/** One dimension with every field the contract says must travel with the score. */
function dimensionView(iso3: string, dimension: Dimension, d: DimensionResult | undefined) {
  if (!d) return { dimension, label: DIMENSION_LABELS[dimension], score: null, published: false }
  const band = confidenceBand(d.confidence)
  const m = primaryMomentum(d.momentum)
  const limits = artefactsFor(dimension, iso3)
  return {
    dimension,
    label: DIMENSION_LABELS[dimension],
    score: d.score,
    confidence: d.confidence,
    confidenceBand: band.label,
    confidenceMeaning: band.meaning,
    observedIndicators: d.observedIndicators,
    belowCoverageFloor: d.belowCoverageFloor,
    trend: m
      ? { from: m.baseYear, to: m.currentYear, delta: m.delta, basket: m.matchedIndicators }
      : null,
    panel:
      d.delphiScore == null
        ? null
        : { delphiScore: d.delphiScore, delphiIqr: d.delphiIqr ?? null, blendedFrom: d.blendedFrom ?? null },
    limits: [...limits.specific, ...limits.structural].map((id) => `${SITE}/limits#${id}`),
  }
}

/* ---------- tools ---------- */

const listDimensions = defineTool({
  name: 'list_dimensions',
  title: 'List the nine dimensions',
  description:
    'The nine capability dimensions, the question each one answers, and how many indicators each has: scored, declared gaps, rejected, and conditions published beside it. Also the dataset version and the quoting contract. Start here.',
  input: z.object({}),
  run: async () => {
    const index = await loadIndex()
    const version = index?.version ?? DATASET_VERSION
    return {
      datasetVersion: version,
      countries: index?.countries.length ?? null,
      contract: CONTRACT,
      dimensions: DIMENSIONS.map((dimension) => {
        const rows = INDICATORS.filter((i) => i.dimension === dimension)
        return {
          dimension,
          label: DIMENSION_LABELS[dimension],
          question: DIMENSION_QUESTIONS[dimension],
          indicators: countByStatus(rows),
        }
      }),
      method: `${SITE}/method`,
      citation: cite('Method', `${SITE}/method`, version),
    }
  },
})

const getCountry = defineTool({
  name: 'get_country',
  title: 'Read one country',
  description:
    "One country's nine dimensions, each with score, confidence and its band, indicator count, coverage flag, trend, panel estimate where one exists, and links to the known limits that apply. Takes an ISO3 code or an English country name.",
  input: z.object({
    country: z.string().min(2).max(80).describe('ISO3 code (BRA) or English name (Brazil)'),
    indicators: z
      .boolean()
      .default(false)
      .describe('Add every observed indicator row: value, year and source'),
  }),
  run: async ({ country, indicators }) => {
    const iso3 = resolveCountry(country)
    if (!iso3) throw new Error(unknownCountry(country))
    const [index, full] = await Promise.all([loadIndex(), indicators ? loadCountry(iso3) : null])
    const row = index?.countries.find((c) => c.iso3 === iso3)
    if (!row) throw new Error(`${COUNTRY_NAMES[iso3]} is not in the published frame.`)
    const version = index?.version ?? DATASET_VERSION
    const url = `${SITE}${countryProfileHref(iso3)}`
    return {
      iso3,
      country: row.country,
      datasetVersion: version,
      dimensions: DIMENSIONS.map((dimension) => {
        const view = dimensionView(iso3, dimension, row.dimensions[dimension])
        if (!full) return view
        const rows = (full.dimensions[dimension]?.indicators ?? [])
          .filter((r) => r.status === 'observed')
          .map((r) => ({ id: r.indicatorId, name: r.name, value: r.raw, year: r.year, source: r.source }))
        return { ...view, indicators: rows }
      }),
      contract: CONTRACT,
      url,
      citation: cite(row.country, url, version),
    }
  },
})

const compareCountries = defineTool({
  name: 'compare_countries',
  title: 'Compare countries side by side',
  description:
    `Two to ${COMPARE_MAX} countries side by side on the nine dimensions, in the order you give them. The result is not sorted by score: the benchmark compares shapes and does not rank (D1).`,
  input: z.object({
    countries: z.array(z.string().min(2).max(80)).min(2).max(COMPARE_MAX).describe('ISO3 codes or English names'),
  }),
  run: async ({ countries }) => {
    const codes = countries.map((c) => {
      const iso3 = resolveCountry(c)
      if (!iso3) throw new Error(unknownCountry(c))
      return iso3
    })
    const index = await loadIndex()
    const version = index?.version ?? DATASET_VERSION
    const rows = codes.map((iso3) => {
      const row = index?.countries.find((c) => c.iso3 === iso3)
      if (!row) throw new Error(`${COUNTRY_NAMES[iso3]} is not in the published frame.`)
      return row
    })
    const url = `${SITE}${compareHref(codes)}`
    return {
      datasetVersion: version,
      countries: rows.map((r) => ({ iso3: r.iso3, country: r.country })),
      dimensions: DIMENSIONS.map((dimension) => ({
        dimension,
        label: DIMENSION_LABELS[dimension],
        values: rows.map((r) => ({ iso3: r.iso3, ...dimensionView(r.iso3, dimension, r.dimensions[dimension]) })),
      })),
      contract: CONTRACT,
      url,
      citation: cite(`Comparison: ${rows.map((r) => r.country).join(', ')}`, url, version),
    }
  },
})

type IndicatorStatus = 'scored' | 'gap' | 'rejected' | 'condition'

const statusOf = (i: IndicatorDef): IndicatorStatus =>
  i.role === 'condition' ? 'condition' : i.ingest === 'gap' ? 'gap' : i.ingest === 'retired' ? 'rejected' : 'scored'

function countByStatus(rows: IndicatorDef[]): Record<IndicatorStatus, number> {
  const out: Record<IndicatorStatus, number> = { scored: 0, gap: 0, rejected: 0, condition: 0 }
  for (const r of rows) out[statusOf(r)] += 1
  return out
}

const searchIndicators = defineTool({
  name: 'search_indicators',
  title: 'Search the indicator registry',
  description:
    'Search the registry of indicators by words in the name or definition, and filter by dimension or status: scored, gap (no adequate dataset yet), rejected (a dataset exists and the project disqualified it) or condition (published beside a dimension, never scored).',
  input: z.object({
    query: z.string().max(200).optional(),
    dimension: z.enum(DIMENSIONS).optional(),
    status: z.enum(['scored', 'gap', 'rejected', 'condition']).optional(),
  }),
  run: async ({ query, dimension, status }) => {
    const terms = fold(query ?? '').split(/\s+/).filter(Boolean)
    const items = INDICATORS.filter((i) => !dimension || i.dimension === dimension)
      .filter((i) => !status || statusOf(i) === status)
      .filter((i) => {
        const text = fold(`${i.id} ${i.name} ${i.definition}`)
        return terms.every((t) => text.includes(t))
      })
      .map((i) => ({
        id: i.id,
        name: i.name,
        dimension: i.dimension,
        status: statusOf(i),
        definition: i.definition,
        unit: i.unit,
        direction: i.direction,
        publisher: i.source.publisher,
        series: i.source.series ?? null,
        url: `${SITE}/indicators#${i.id}`,
      }))
    return { total: items.length, items }
  },
})

/** One `## <id> — title` section of a markdown document, or null. */
function section(markdown: string, id: string): { title: string; body: string } | null {
  const lines = markdown.split('\n')
  const start = lines.findIndex((l) => new RegExp(`^## ${id}\\b`).test(l))
  if (start < 0) return null
  const end = lines.findIndex((l, i) => i > start && l.startsWith('## '))
  const title = (lines[start] ?? '').replace(/^## /, '')
  return { title, body: lines.slice(start + 1, end < 0 ? undefined : end).join('\n').trim() }
}

const getDecision = defineTool({
  name: 'get_decision',
  title: 'Read a decision',
  description:
    'Read one entry of the decision record by number, for example D1 or D118: the methodological choice, why it was made, what it costs and what evidence would overturn it. Use it to answer "why does the benchmark do X?".',
  input: z.object({ id: z.string().regex(/^[dD]\d{1,4}$/, 'A decision number such as D118') }),
  run: async ({ id }) => {
    const code = id.toUpperCase()
    const doc = await loadDoc('DECISIONS.md')
    if (!doc) throw new Error('The decision record is not available.')
    const found = section(doc, code)
    if (!found) throw new Error(`No decision ${code}.`)
    const url = `${SITE}/decisions#${code}`
    return { id: code, title: found.title, markdown: found.body, url, citation: cite(found.title, url, DATASET_VERSION) }
  },
})

const getLimit = defineTool({
  name: 'get_limit',
  title: 'Read a known limit',
  description:
    'Read one known limit by id (A1, A2, ...): a place where the model produces a number that is wrong about the world. get_country lists the ids that apply to each score. Without an id, lists every limit with the dimensions and countries it covers.',
  input: z.object({ id: z.string().regex(/^[aA]\d{1,3}$/, 'A limit id such as A3').optional() }),
  run: async ({ id }) => {
    const doc = await loadDoc('KNOWN-ARTEFACTS.md')
    if (!doc) throw new Error('The limits document is not available.')
    if (!id) {
      return {
        items: ARTEFACT_SCOPES.map((a) => ({
          id: a.id,
          title: section(doc, a.id)?.title ?? a.id,
          dimensions: a.dimensions,
          countries: a.countries ?? 'all',
          url: `${SITE}/limits#${a.id}`,
        })),
      }
    }
    const code = id.toUpperCase()
    const found = section(doc, code)
    if (!found) throw new Error(`No limit ${code}.`)
    const url = `${SITE}/limits#${code}`
    return { id: code, title: found.title, markdown: found.body, url, citation: cite(found.title, url, DATASET_VERSION) }
  },
})

/* ---------- prompts ---------- */

const readCountry: Prompt = {
  name: 'read_country',
  title: 'Read a country profile',
  description: "A careful reading of one country's capability profile that follows the benchmark's quoting contract.",
  arguments: [{ name: 'country', description: 'ISO3 code or English name, for example Brazil', required: true }],
  render: ({ country }) =>
    [
      `Read the capability profile of ${country} with the NCB MCP server.`,
      '',
      '1. Call list_dimensions for the dataset version and the contract, then get_country.',
      '2. Describe the shape: which dimensions sit high and low inside the frame. Give every score with its confidence band and indicator count. Name the dimensions with no position (null score) as unmeasured, never as low.',
      '3. For each score you rely on, check its limits with get_limit and say plainly where a limit changes the reading.',
      '4. Where the panel estimate differs from the indicator score, say so and give both.',
      '5. If the reader asks how the country compares, use compare_countries with two to five peers they name or of similar income, and compare shapes. Do not rank and do not average the dimensions.',
      '',
      'Cite the ncb.envisioning.com link of everything you use, with the dataset version. Do not invent numbers.',
    ].join('\n'),
}

const handlers = mcpEndpoint({
  name: MCP_SERVER_NAME,
  version: MCP_SERVER_VERSION,
  instructions: [
    'The National Capability Benchmark (NCB) measures whether a country can anticipate change, coordinate around it and build what it decides to build: 135 countries, nine dimensions scored 0 to 100 from public data inside this frame, each with a separate confidence number. A prototype by Envisioning.',
    'Start with list_dimensions, then get_country or compare_countries. search_indicators explains what a dimension rests on; get_decision explains why; get_limit says where a number is wrong about the world.',
    CONTRACT,
    'Cite the ncb.envisioning.com link and the dataset version of everything you use; each result gives a citation line. The full contract: https://raw.githubusercontent.com/envisioning/national-capability-benchmark/main/docs/FOR-AGENTS.md',
  ].join(' '),
  tools: [listDimensions, getCountry, compareCountries, searchIndicators, getDecision, getLimit],
  prompts: [readCountry],
  ratePerMinute: 60,
})

export const { POST, GET, DELETE, OPTIONS } = handlers
