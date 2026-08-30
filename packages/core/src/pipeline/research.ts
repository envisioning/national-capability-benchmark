import {
  COUNTRY_ISO3,
  COUNTRY_NAMES,
  DATASET_VERSION,
  DIMENSIONS,
  INDICATORS,
  INDICATORS_BY_ID,
  isReversal,
} from '../model/index.js'
import type { Dimension, EvidenceRecord } from '../model/index.js'
import {
  ResearchCandidate,
  ResearchInventory,
  ResearchScoutOutput,
  ResearchSlot,
} from '../model/research.js'
import type { ResearchCandidate as ResearchCandidateType } from '../model/research.js'

export const RESEARCH_PROMPT_VERSION = 'research-1'

export type ResearchSlotFilters = {
  countries?: readonly string[]
  indicators?: readonly string[]
  limit?: number
}

/**
 * Build the deterministic research map from the published evidence corpus.
 * Nothing in this inventory is an AI judgement. It tells an AI researcher
 * where the corpus is thin and gives it bounded, auditable work units.
 */
export function buildResearchInventory(
  records: readonly EvidenceRecord[],
  generatedAt = new Date().toISOString(),
  datasetVersion = DATASET_VERSION,
): ResearchInventory {
  const countryCounts = new Map(COUNTRY_ISO3.map((iso3) => [iso3, 0]))
  const dimensionCounts = new Map<Dimension, { records: number; countries: Set<string>; indicators: Set<string> }>()
  const indicatorCounts = new Map<string, { records: number; countries: Set<string> }>()
  const existingSlots = new Set<string>()

  for (const dimension of DIMENSIONS) {
    dimensionCounts.set(dimension, { records: 0, countries: new Set(), indicators: new Set() })
  }
  for (const def of INDICATORS.filter((indicator) => indicator.ingest === 'gap')) {
    indicatorCounts.set(def.id, { records: 0, countries: new Set() })
  }

  for (const record of records) {
    countryCounts.set(record.iso3, (countryCounts.get(record.iso3) ?? 0) + 1)
    const def = INDICATORS_BY_ID[record.indicatorId]
    const dimension = def?.dimension as Dimension | undefined
    if (dimension) {
      const counts = dimensionCounts.get(dimension)
      if (counts) {
        counts.records++
        counts.countries.add(record.iso3)
        counts.indicators.add(record.indicatorId)
      }
    }
    const indicator = indicatorCounts.get(record.indicatorId)
    if (indicator) {
      indicator.records++
      indicator.countries.add(record.iso3)
    }
    if (def?.ingest === 'gap') existingSlots.add(`${record.iso3}|${record.indicatorId}`)
  }

  const dimensions = DIMENSIONS.map((dimension) => {
    const counts = dimensionCounts.get(dimension) as {
      records: number
      countries: Set<string>
      indicators: Set<string>
    }
    return {
      dimension,
      records: counts.records,
      countries: counts.countries.size,
      indicators: counts.indicators.size,
    }
  })

  const countries = COUNTRY_ISO3.map((iso3) => ({
    iso3,
    country: COUNTRY_NAMES[iso3] ?? iso3,
    records: countryCounts.get(iso3) ?? 0,
  }))

  const indicators = INDICATORS.filter((indicator) => indicator.ingest === 'gap').map((def) => {
    const counts = indicatorCounts.get(def.id) as { records: number; countries: Set<string> }
    return {
      indicatorId: def.id,
      dimension: def.dimension,
      name: def.name,
      records: counts.records,
      countries: counts.countries.size,
    }
  })

  const sortedCountries = [...countries].sort((a, b) => b.records - a.records || a.iso3.localeCompare(b.iso3))
  const mostRepresented = sortedCountries[0]
  const reversalCount = records.filter((record) => isReversal(record.status)).length
  const reversalMinimum = Math.floor(records.length / 5)

  const slots: ResearchSlot[] = []
  for (const iso3 of COUNTRY_ISO3) {
    for (const def of INDICATORS.filter((indicator) => indicator.ingest === 'gap')) {
      if (existingSlots.has(`${iso3}|${def.id}`)) continue
      const countryRecords = countryCounts.get(iso3) ?? 0
      const dimension = dimensionCounts.get(def.dimension) as {
        records: number
        countries: Set<string>
        indicators: Set<string>
      }
      const indicator = indicatorCounts.get(def.id) as { records: number; countries: Set<string> }
      const priority = countryRecords * 1_000 + dimension.records * 100 + indicator.records * 10
      const reasons = [
        countryRecords === 0 ? 'country has no documented delivery' : `${countryRecords} country record(s) already`,
        `${dimension.records} record(s) in ${def.dimension}`,
        `${indicator.records} record(s) for this gap`,
      ]
      slots.push({
        iso3,
        indicatorId: def.id,
        dimension: def.dimension,
        priority,
        reason: reasons.join('; '),
      })
    }
  }
  slots.sort((a, b) => a.priority - b.priority || a.iso3.localeCompare(b.iso3) || a.indicatorId.localeCompare(b.indicatorId))

  return ResearchInventory.parse({
    generatedAt,
    datasetVersion,
    recordCount: records.length,
    countriesRepresented: countries.filter((country) => country.records > 0).length,
    gapIndicatorsRepresented: indicators.filter((indicator) => indicator.records > 0).length,
    dimensions,
    countries,
    indicators,
    guardrails: {
      reversalCount,
      reversalMinimum,
      reversalDeficit: Math.max(0, reversalMinimum - reversalCount),
      mostRepresentedCountry: mostRepresented?.iso3 ?? null,
      mostRepresentedCountryRecords: mostRepresented?.records ?? 0,
      countryCeilingAtCurrentSize: Math.floor(records.length / 3),
    },
    slots,
  })
}

/** Select bounded work for one AI scouting run. */
export function selectResearchSlots(
  inventory: ResearchInventory,
  filters: ResearchSlotFilters = {},
): ResearchSlot[] {
  const countries = filters.countries ? new Set(filters.countries.map((iso3) => iso3.toUpperCase())) : null
  const indicators = filters.indicators ? new Set(filters.indicators) : null
  const limit = Math.max(1, Math.floor(filters.limit ?? 24))
  return inventory.slots
    .filter((slot) => !countries || countries.has(slot.iso3))
    .filter((slot) => !indicators || indicators.has(slot.indicatorId))
    .slice(0, limit)
}

function slotDefinition(slot: ResearchSlot): string {
  const def = INDICATORS_BY_ID[slot.indicatorId]
  if (!def) return `${slot.indicatorId} (unknown registry indicator)`
  return [
    `${slot.iso3} ${COUNTRY_NAMES[slot.iso3] ?? slot.iso3}`,
    `${def.id}: ${def.name}`,
    `definition: ${def.definition}`,
    `unit: ${def.unit}`,
    `registry note: ${def.notes}`,
    `queue reason: ${slot.reason}`,
  ].join('\n')
}

export function buildResearchScoutPrompt(slots: readonly ResearchSlot[]): string {
  const slotText = slots.map((slot, index) => `## Slot ${index + 1}\n${slotDefinition(slot)}`).join('\n\n')
  return `You are the scouting researcher for the National Capability Benchmark.

Your job is to produce research leads, not evidence records. The benchmark's
published evidence layer accepts only a documented delivery against a declared
gap, with a publisher's number, national-scale operation and an honest limits
paragraph. A lead that cannot meet that standard must say so.

Hard rules:
- Use only the country and indicator slots supplied below.
- Read each indicator's definition literally. Do not substitute a nearby outcome,
  a famous programme, a ranking or a press claim.
- Separate three routes: \`case\` for a possible delivered institutional case,
  \`source_backed\` for a comparable dataset or source-adapter task, and
  \`do_not_force\` when the indicator is a survey/perception construct or the case
  route would be conceptually invalid.
- Never invent a metric, URL, publication, coverage figure or programme result.
- Source leads are search targets only. Give publisher/dataset names and search
  queries; do not present them as checked sources.
- A national strategy, pilot, launch announcement or single private-company
  success is not a delivered national case.
- Prefer leads that can later carry a dated number from an official statistic,
  audit, annual report, administrative dataset or inspectable academic source.
- Return one candidate for each slot, including a \`do_not_force\` candidate when
  the correct action is dataset research or rejection.

For each candidate provide:
- a stable lower-case id;
- the exact slot's country and indicator;
- the route and status (\`lead\`, \`researchable\`, \`source_required\`, or
  \`do_not_pursue\`);
- a short title and a falsifiable hypothesis;
- the metric that would be needed, the national-scale test, and explicit
  disqualifiers;
- one to four source search targets with concrete queries;
- a concise rationale for why this is the best next research move.

Research slots:

${slotText}`
}

export function buildResearchCritiquePrompt(
  candidates: readonly ResearchCandidateType[],
): string {
  return `You are the red-team reviewer for an AI-generated National Capability Benchmark research queue.

These are leads, not evidence. You may reject a lead or send it back for source
verification, but you may not approve publication. Apply the five inclusion tests:
declared gap, named publisher metric, institutional delivery, delivered at
national scale, and limits that can be stated without destroying the claim.

For every candidate:
- mark each test pass, fail or unknown;
- reject conceptual mismatches and survey constructs disguised as programmes;
- require a source check when the programme may fit but no number has been
  verified;
- list exactly what a researcher must retrieve before drafting an evidence
  record;
- never convert a source lead into a source citation.

Allowed verdicts are \`reject\`, \`needs_source\`, and \`ready_for_source_check\`.
\`ready_for_source_check\` still means unpublished.

Candidates:

${JSON.stringify(candidates, null, 2)}`
}

/** Deterministic offline stand-in: useful for testing the queue, never evidence. */
export function mockResearchCandidates(slots: readonly ResearchSlot[]): ResearchCandidateType[] {
  return slots.map((slot) => {
    const def = INDICATORS_BY_ID[slot.indicatorId]
    const name = def?.name ?? slot.indicatorId
    const country = COUNTRY_NAMES[slot.iso3] ?? slot.iso3
    return ResearchCandidate.parse({
      id: `${slot.iso3.toLowerCase()}-${slot.indicatorId.replace(/_/g, '-')}`,
      iso3: slot.iso3,
      indicatorId: slot.indicatorId,
      lane: 'case',
      status: 'lead',
      title: `${country}: investigate ${name}`,
      hypothesis: `There may be a delivered institutional case relevant to ${name}, but no factual claim is made by this offline scaffold.`,
      expectedMetric: `A named publisher's dated number for ${name}.`,
      scaleTest: 'Verify operation at national scale rather than announcement, pilot or isolated local activity.',
      disqualifiers: [
        'No inspectable publisher number.',
        'The case measures an adjacent outcome rather than the declared construct.',
      ],
      sourceLeads: [
        {
          publisher: 'To be identified',
          datasetOrPage: `${name} official statistics or evaluation`,
          why: 'Offline scaffold only; a researcher must identify and verify the source.',
          searchQueries: [`${country} ${name} official statistics`, `${country} ${name} evaluation annual report`],
        },
      ],
      rationale: slot.reason,
    })
  })
}

export function mockResearchReviews(candidates: readonly ResearchCandidateType[]) {
  return candidates.map((candidate) => ({
    candidateId: candidate.id,
    verdict: 'needs_source' as const,
    tests: {
      declaredGap: 'unknown' as const,
      institutionalDelivery: 'unknown' as const,
      nationalScale: 'unknown' as const,
      publisherMetric: 'fail' as const,
      limitsCanBeHonest: 'unknown' as const,
    },
    requiredEvidence: [
      'A source URL that opens and carries the metric.',
      'A reference period and the exact unit as published.',
      'Evidence that the delivery operated at national scale.',
    ],
    blockers: ['Offline review has no checked source packet.'],
    rationale: 'The deterministic reviewer refuses to promote an unverified lead.',
  }))
}

export function researchScoutOutputFromUnknown(value: unknown): ResearchCandidateType[] {
  return ResearchScoutOutput.parse(value).candidates
}
