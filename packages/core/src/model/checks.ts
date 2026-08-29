import { z } from 'zod'
import { CheckDef } from './schema.js'
import type { Dimension } from './dimensions.js'
import { WB_DEFAULT_DATABASE } from './sources.js'
import { WB_PUBLISHER } from './indicators.js'
import type { SeriesRequest } from './indicators.js'

type Raw = z.input<typeof CheckDef>

/**
 * Observation id prefix for a behavioural check.
 *
 * A check is fetched and stored like an indicator and must never be mistaken
 * for one, so it lives under its own prefix in the observation file. Nothing
 * that builds the frame or the mean reads this prefix. See D60.
 */
export const CHECK_PREFIX = '__check__'

/**
 * Behavioural checks: series fetched and published beside a dimension, never
 * inside it.
 *
 * The registry in `indicators.ts` answers what the model scores. This answers
 * what the model looked at, could not score, and refused to throw away. A check
 * enters no frame, no mean, no coverage count and no confidence. It is rendered
 * with the reason it is not scored, so a reader can weigh the series without
 * the benchmark asserting it.
 *
 * A check is not a softer indicator. Anything that passes the project's tests
 * belongs in `indicators.ts` as a scored row instead. See D60.
 */
const RAW: Raw[] = [
  {
    id: 'bribery_incidence',
    dimension: 'trust',
    family: 'institutional',
    name: 'Bribery incidence',
    definition:
      'Firms asked for at least one bribe payment across six public transactions covering utilities, permits, licences and taxes.',
    unit: '% of firms',
    direction: 'lower_better',
    source: {
      publisher: WB_PUBLISHER,
      series: 'IC.FRM.BRIB.ZS',
      url: 'https://data.worldbank.org/indicator/IC.FRM.BRIB.ZS',
      tier: 'international_organization',
      inspectable: true,
    },
    notes:
      'Experience rather than reputation: the question asks whether the responding firm was itself asked, so it is not the perception composite D23 retired. It covers 49 of 52 countries and 44 of them at 2023 or later. It is not scored because it carries income. On a rank-normalised estimate it correlates with log GDP per capita at about 0.66 alone and takes the two-indicator Trust dimension to about 0.53, against 0.14 for contract enforcement days by itself, which is a larger wealth contribution than the one D44 retired an indicator over. Read it beside the score, not as the score.',
  },
]

export const CHECKS: CheckDef[] = RAW.map((c) => CheckDef.parse(c))

export const CHECKS_BY_ID: Record<string, CheckDef> = Object.fromEntries(
  CHECKS.map((c) => [c.id, c]),
)

export function checksFor(dimension: Dimension): CheckDef[] {
  return CHECKS.filter((c) => c.dimension === dimension)
}

/** The World Bank series the checks need, in the same shape the indicators use. */
export function worldBankCheckSeries(): SeriesRequest[] {
  const byKey = new Map<string, SeriesRequest>()
  for (const c of CHECKS) {
    if (!c.source.series) continue
    const sourceId = c.wbSourceId ?? WB_DEFAULT_DATABASE
    byKey.set(`${c.source.series}@${sourceId}`, { series: c.source.series, sourceId })
  }
  return [...byKey.values()]
}
