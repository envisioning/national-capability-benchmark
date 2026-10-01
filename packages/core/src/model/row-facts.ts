/**
 * Facts about one country's indicator row that the published output does not
 * carry.
 *
 * A capability map names the rows a score rests on, and a few of those rows
 * have a fact a reader needs that no published field holds: which survey a
 * series comes from, or why the row is empty. The pinned observation file and
 * the adapter's gate log hold them; `data/out` does not. Each one is a
 * sentence a re-ingest cannot correct, so the list is as short as possible
 * and every entry names the decision whose supersession makes it stale.
 *
 * This is the one place such a fact is declared, for every reading of the
 * country: the ground-layer map and any layer map read the same entry. A
 * lexicon holds one template per `kind`, never a sentence per country, so a
 * language translates the kind and the country-specific part (the survey's
 * own name, a proper noun) stays here. See D136, which replaced the
 * per-lexicon `countryRowFacts` of D133 and D134.
 */

/**
 * What kind of fact. A template per kind lives in
 * `Lexicon.capabilityMap.rowFacts`, filled with the country, `{survey}` and
 * `{floor}`.
 *
 * - `household_survey`: the series comes from a household survey rather than
 *   a labour force survey. `{survey}` names it.
 * - `household_survey_unreliable`: the same, and the publisher flags the
 *   value unreliable.
 * - `urban_survey_unreliable`: the series comes from a survey covering urban
 *   areas only, and the publisher flags the value unreliable. `{survey}`.
 * - `flagged_unreliable`: the publisher flags the value unreliable.
 * - `gate_never_passed`: no year of the series passes the plausibility gate,
 *   so the row is empty. `{floor}` is the gate's floor, read from the gate.
 */
export type RowFactKind =
  | 'household_survey'
  | 'household_survey_unreliable'
  | 'urban_survey_unreliable'
  | 'flagged_unreliable'
  | 'gate_never_passed'

export const ROW_FACT_KINDS: readonly RowFactKind[] = [
  'household_survey',
  'household_survey_unreliable',
  'urban_survey_unreliable',
  'flagged_unreliable',
  'gate_never_passed',
]

export type CountryRowFact = {
  iso3: string
  indicatorId: string
  kind: RowFactKind
  /** The survey's own name, as its publisher writes it. Not translated. */
  survey?: string
  decisions: readonly string[]
}

const LTU = 'long_term_unemployment_share'

/*
 * Every country the pinned ILOSTAT release says one of these things about,
 * not only the countries with a layer: the ground layer reads all 53, and a
 * fact shown for one country and withheld from another with the same fact
 * would be a selection. The survey and the flag are read from the `note` of
 * each observation in data/observations/ilostat-ltu.json, and a test holds
 * this table to that file. The six countries with no surviving year are the
 * "held" row of the gate log in
 * docs/research/adaptability/ILOSTAT-LONG-TERM-UNEMPLOYMENT.md, every one
 * dropped by the floor clauses. Stale when D120 is superseded or on a
 * re-fetch that moves a survey, a flag or a held country; the test fails on
 * the first two.
 */
export const COUNTRY_ROW_FACTS: readonly CountryRowFact[] = [
  { iso3: 'BRA', indicatorId: LTU, kind: 'household_survey', survey: 'PNAD Contínua', decisions: ['D120'] },
  {
    iso3: 'HND',
    indicatorId: LTU,
    kind: 'household_survey',
    survey: 'Encuesta Permanente de Hogares de Propósitos Múltiples',
    decisions: ['D120'],
  },
  {
    iso3: 'PRY',
    indicatorId: LTU,
    kind: 'household_survey',
    survey: 'Encuesta Permanente de Hogares Continua',
    decisions: ['D120'],
  },
  { iso3: 'KEN', indicatorId: LTU, kind: 'household_survey_unreliable', decisions: ['D120'] },
  {
    iso3: 'ARG',
    indicatorId: LTU,
    kind: 'urban_survey_unreliable',
    survey: 'Encuesta Permanente de Hogares',
    decisions: ['D120'],
  },
  { iso3: 'ARE', indicatorId: LTU, kind: 'flagged_unreliable', decisions: ['D120'] },
  { iso3: 'FIN', indicatorId: LTU, kind: 'flagged_unreliable', decisions: ['D120'] },
  { iso3: 'FRA', indicatorId: LTU, kind: 'flagged_unreliable', decisions: ['D120'] },
  ...['KOR', 'MEX', 'PER', 'PHL', 'SLV', 'URY'].map(
    (iso3): CountryRowFact => ({ iso3, indicatorId: LTU, kind: 'gate_never_passed', decisions: ['D120'] }),
  ),
]

/** The facts declared for one country, in table order. */
export const rowFactsFor = (iso3: string): CountryRowFact[] =>
  COUNTRY_ROW_FACTS.filter((fact) => fact.iso3 === iso3.toUpperCase())
