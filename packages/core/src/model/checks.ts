import { z } from 'zod'
import { CheckDef } from './schema.js'
import type { Dimension } from './dimensions.js'
import { WB_DEFAULT_DATABASE } from './sources.js'
import type { SeriesRequest } from './indicators.js'
import {
  VDEM_CY_V15_CSV,
  VDEM_CY_V15_DATASET,
  VDEM_CY_V15_PAGE_URL,
  VDEM_CY_V15_RELEASE,
  VDEM_CY_V15_URL,
  VDEM_CY_V15_YEAR,
  VDEM_PUBLISHER,
} from './source-catalog.js'

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
/* Rendered to readers on the capability and country pages, so American spelling
 * and no dashes. The figures are from the 2024 values; see D121 and A13. */
const NOTES_POLARIZATION =
  'The question counts hostility and leaves disagreement alone, which is what pluralism asks for. It is not scored because a low reading has two causes the number cannot tell apart. Where camps compete openly, a calm reading means people who disagree still meet as fellow citizens. Where no opposition may organize, it means there is no camp left to be hostile to. In 2024 the five closed autocracies in the frame average 1.85 and the liberal democracies 1.77, while electoral democracies and electoral autocracies sit near 2.8 and 3.0. Scored, the reading would have lifted the United Arab Emirates and Rwanda about 11 points on this capability for a uniformity the benchmark does not count as shared purpose. Income is not why it is left out: richer countries read only somewhat calmer, at about -0.34 against log GDP per capita.'

const RAW: Raw[] = [
  {
    /* Shares its id with the declared gap in indicators.ts on purpose: the gap
     * is the measurement Shared Purpose still wants, and this is what the model
     * looked at and declined to score in its place. The observation id carries
     * the check prefix, so the two never meet in a frame. See D121. */
    id: 'political_polarization',
    dimension: 'shared_purpose',
    name: 'Political polarization',
    definition:
      'Whether supporters of opposing political camps generally meet in a friendly or a hostile manner, rated by V-Dem country experts from 0, friendly, to 4, hostile.',
    unit: 'index 0-4',
    direction: 'lower_better',
    ingest: 'adapter',
    source: {
      publisher: VDEM_PUBLISHER,
      series: 'v2cacamps_osp',
      url: VDEM_CY_V15_PAGE_URL,
      tier: 'expert_panel',
      inspectable: true,
    },
    pinned: {
      dataset: `${VDEM_PUBLISHER} ${VDEM_CY_V15_DATASET} v${VDEM_CY_V15_RELEASE}`,
      url: VDEM_CY_V15_URL,
      file: VDEM_CY_V15_CSV,
      variable: 'v2cacamps_osp',
      year: VDEM_CY_V15_YEAR,
    },
    notes: NOTES_POLARIZATION,
  },
]

export const CHECKS: CheckDef[] = RAW.map((c) => {
  const check = CheckDef.parse(c)
  /* An adapter check prints its pinned file on /sources in place of a World
   * Bank request, so it cannot be declared without one. See D116 and D121. */
  if (check.ingest === 'adapter' && !check.pinned) {
    throw new Error(`Check ${check.id} is fetched by an adapter and names no pinned release`)
  }
  return check
})

export const CHECKS_BY_ID: Record<string, CheckDef> = Object.fromEntries(
  CHECKS.map((c) => [c.id, c]),
)

export function checksFor(dimension: Dimension): CheckDef[] {
  return CHECKS.filter((c) => c.dimension === dimension)
}

/**
 * The World Bank series the checks need, in the same shape the indicators use.
 * An adapter check is not here: its adapter emits it under `CHECK_PREFIX`.
 */
export function worldBankCheckSeries(): SeriesRequest[] {
  const byKey = new Map<string, SeriesRequest>()
  for (const c of CHECKS) {
    if (c.ingest !== 'worldbank' || !c.source.series) continue
    const sourceId = c.wbSourceId ?? WB_DEFAULT_DATABASE
    byKey.set(`${c.source.series}@${sourceId}`, { series: c.source.series, sourceId })
  }
  return [...byKey.values()]
}
