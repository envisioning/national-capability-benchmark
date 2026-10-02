import { z } from 'zod'
import { CheckDef } from './schema.js'
import type { Dimension } from './dimensions.js'
import { WB_DEFAULT_DATABASE } from './sources.js'
import type { SeriesRequest } from './indicators.js'
import {
  JOINT_EVS_WVS_PUBLISHER,
  JOINT_EVS_WVS_RELEASE_YEAR,
  JOINT_EVS_WVS_RESULTS_FILE,
  JOINT_EVS_WVS_RESULTS_URL,
  VDEM_CY_CSV,
  VDEM_CY_DATASET,
  VDEM_CY_PAGE_URL,
  VDEM_CY_RELEASE,
  VDEM_CY_URL,
  VDEM_CY_YEAR,
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
 * and no dashes. The figures are from the V-Dem v16 2025 values; see D121 and A13. */
const NOTES_POLARIZATION =
  'The question counts hostility and leaves disagreement alone, which is what pluralism asks for. It is not scored because a low reading has two causes the number cannot tell apart. Where camps compete openly, a calm reading means people who disagree still meet as fellow citizens. Where no opposition may organize, it means there is no camp left to be hostile to. In 2025 the five closed autocracies in the frame average 2.18 and the liberal democracies 1.67, while electoral democracies and electoral autocracies sit near 2.8 and 3.3. Scored, the reading would have lifted the United Arab Emirates about 11 points on this capability for a uniformity the benchmark does not count as shared purpose. Income is not why it is left out: richer countries read only somewhat calmer, at about -0.41 against log GDP per capita.'

/* Rendered to readers, so American spelling and no dashes. The figures are from
 * each country's latest election up to 2025 in V-Dem v16; see D129, A5 and A13. */
const NOTES_TURNOUT =
  'Turnout is the one act in which a whole population takes part in a common decision, so it is the closest behavioral reading of shared purpose the benchmark has. It is not scored for three reasons the number cannot separate. It reads the democratic channel, which is why voice and accountability was retired from this capability (A5): a country with no competitive elections cannot score well for reasons unrelated to whether its people see themselves in a common project. Compulsory voting turns it into a reading of the law: Brazil enforces it, and the eight countries that enforce sanctions average 83 percent against 65 where voting is voluntary. And closed and electoral autocracies manage it: Vietnam reads 95.6, Rwanda 98.2 and Singapore 92.8, which is mobilization, not participation (A13). The year shown is the latest national election, because elections are coded only in the year they happen.'

/* Rendered to readers, so American spelling and no dashes. The figures are the
 * published "a great deal" shares of the 2017 to 2022 fieldwork, grouped by
 * V-Dem's 2025 Regimes of the World (v16); see D132 and A13. */
const NOTES_COURT_CONFIDENCE =
  'Confidence in the courts is the public half of what this capability asks: whether people expect the rules to be enforced when a stranger breaks them. It is not scored because the survey answer reads two things the number cannot tell apart. Where courts are independent, confidence is a judgment of how they perform. Where they answer to the state, it is also deference, and saying otherwise to an interviewer has a cost. In this frame the pattern runs the wrong way. India, the Philippines and Indonesia, all electoral autocracies in the V-Dem 2025 classification, lead on the share saying a great deal, and Vietnam and China, the two closed autocracies surveyed, lead once quite a lot is counted too. The ten electoral autocracies average 21.8 percent saying a great deal and the two closed autocracies 28.1, against 13.6 for liberal and 8.4 for electoral democracies. Scored, it would rank highest the states whose courts are least able to rule against them. Income is not why it is left out: the share correlates about -0.18 with log GDP per capita. The value is the share saying a great deal; the share saying quite a lot is in the source note.'

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
      url: VDEM_CY_PAGE_URL,
      tier: 'expert_panel',
      inspectable: true,
    },
    pinned: {
      dataset: `${VDEM_PUBLISHER} ${VDEM_CY_DATASET} v${VDEM_CY_RELEASE}`,
      url: VDEM_CY_URL,
      file: VDEM_CY_CSV,
      variable: 'v2cacamps_osp',
      year: VDEM_CY_YEAR,
    },
    notes: NOTES_POLARIZATION,
  },
  {
    /* No declared gap carries this id: turnout is not a measurement Shared
     * Purpose is waiting for, so there is nothing to share an id with. The
     * observation id carries the check prefix, as for polarization. See D129. */
    id: 'voter_turnout',
    dimension: 'shared_purpose',
    name: 'Voter turnout',
    definition:
      'Share of registered voters who cast a vote in the latest national election up to 2025, according to official results, as coded by V-Dem from IDEA, IPU and IFES sources. Where executive and legislative elections fall on the same day, the executive turnout is coded.',
    unit: '% of registered voters',
    direction: 'higher_better',
    ingest: 'adapter',
    source: {
      publisher: VDEM_PUBLISHER,
      series: 'v2eltrnout',
      url: VDEM_CY_PAGE_URL,
      tier: 'expert_panel',
      inspectable: true,
    },
    pinned: {
      dataset: `${VDEM_PUBLISHER} ${VDEM_CY_DATASET} v${VDEM_CY_RELEASE}`,
      url: VDEM_CY_URL,
      file: VDEM_CY_CSV,
      variable: 'v2eltrnout',
      year: VDEM_CY_YEAR,
      years: 'latest_up_to',
    },
    notes: NOTES_TURNOUT,
  },
  {
    /* Shares its id with the declared gap in indicators.ts on purpose, as
     * polarization does: the gap is the measurement Trust still wants, and this
     * is what the model looked at and declined to score in its place. The
     * observation id carries the check prefix. See D132. */
    id: 'institutional_trust',
    dimension: 'trust',
    family: 'institutional',
    name: 'Confidence in the courts',
    definition:
      'Share of survey respondents saying they have a great deal of confidence in the justice system and courts, of the four answers a great deal, quite a lot, not very much and none at all, in the Joint EVS/WVS 2017 to 2022 survey round.',
    unit: '% a great deal',
    direction: 'higher_better',
    ingest: 'adapter',
    source: {
      publisher: JOINT_EVS_WVS_PUBLISHER,
      series: 'E069_17',
      adapter: 'joint-evs-wvs-results-pdf',
      url: JOINT_EVS_WVS_RESULTS_URL,
      tier: 'academic_survey',
      inspectable: true,
    },
    pinned: {
      dataset: `${JOINT_EVS_WVS_PUBLISHER} 2017-2022 v5.0.0 results by country`,
      url: JOINT_EVS_WVS_RESULTS_URL,
      file: JOINT_EVS_WVS_RESULTS_FILE,
      variable: 'E069_17',
      year: JOINT_EVS_WVS_RELEASE_YEAR,
    },
    notes: NOTES_COURT_CONFIDENCE,
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
