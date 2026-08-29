import type { Dimension } from '../model/dimensions.js'
import type {
  InstitutionLegalNature,
  InstitutionLevel,
  InstitutionRelation,
  InstitutionRelationFamily,
  InstitutionRole,
  InstitutionSystem,
} from '../model/institutions.js'
import type { ScoreBandId } from '../pipeline/bands.js'
import type { ConfidenceBandId } from '../pipeline/confidence.js'

/**
 * A lexicon is one language's rendering of the model's vocabulary plus the
 * strings the agenda renderer needs. Lexicons are data, so a new language is a
 * pull request against this directory and nothing else.
 *
 * The ground layer stays English: ids, JSON output and the registry never
 * translate. A lexicon is an interpretation layer over that ground, and every
 * lookup falls back to the registry's English name when a translation is
 * missing, so a partial lexicon renders complete pages from day one.
 */
export type Lang = 'en' | 'pt-BR'

export type AgendaStrings = {
  /** {country} */
  title: string
  /**
   * {date}. Metadata, not prose: the renderer sets it beside the title as a
   * dateline and never inside a sentence.
   */
  generated: string
  /**
   * {countries} {limits}. The standing disclaimer under the title. Keep the
   * three claims: relative scores, confidence reported separately, read the
   * limits before quoting. {limits} is filled by the renderer, which links
   * docs/KNOWN-ARTEFACTS.md in the repository.
   */
  intro: string
  /**
   * The phrase {limits} renders as in the viewer, where the link target is the
   * local limits page rather than the repository file. See D41.
   */
  limitsLabel: string
  /** {countryTopic}: the country name with its article, for prose position. */
  standingHeading: string
  colDimension: string
  colScore: string
  colConfidence: string
  colTrend: string
  /** {delta} {years} {n} */
  trendCell: string
  /** {delta} {years} {n} {c}: the variant for a basket partly clamped at the frame edge. */
  trendCellClamped: string
  noTrend: string
  noScore: string
  raiseHeading: string
  raiseIntro: string
  measureHeading: string
  measureIntro: string
  holdHeading: string
  /** {threshold} */
  holdIntro: string
  /** {dimension} {score} {band} */
  holdItemLine: string
  /** {dimension} {score} {band} */
  raiseItemHeading: string
  /** {dimension} {confidence} {band} */
  measureItemHeading: string
  /** {n} */
  scoredOn: string
  scoredOnOne: string
  /** {list} */
  gapsLine: string
  /** {list}: datasets that exist and were rejected, kept on the record. */
  retiredLine: string
  exemplarsLine: string
  evidenceElsewhereLine: string
  agendaHeading: string
  /** {n} */
  agendaIntro: string
  colIndicator: string
  colAsks: string
  /** {countryTopic} */
  ownEvidenceHeading: string
  /** {country} */
  ownEvidenceIntro: string
  /** The Brazil-only institutional-history heading. */
  brazilEvidenceHeading: string
  /** The Brazil-only institutional-history framing. */
  brazilEvidenceIntro: string
  contributeHeading: string
  /** {repo} */
  contributeBody: string
  /** Link from an agenda to the full country profile in the ground layer. */
  profileLink: string
}

export type Lexicon = {
  lang: Lang
  /** BCP 47 locale used for number formatting. */
  numberLocale: string
  dimensions: Record<Dimension, string>
  questions: Record<Dimension, string>
  /** Country display names by iso3. Missing ids fall back to the registry name. */
  countries: Record<string, string>
  /**
   * Definite article per iso3, for languages that inflect country names in
   * prose ("o Brasil", "as Filipinas"). Countries that take none stay absent.
   */
  countryArticles: Record<string, string>
  /** Indicator display names by id. Missing ids fall back to the registry name. */
  indicators: Record<string, string>
  /** Indicator definitions by id. Missing ids fall back to the registry definition. */
  indicatorDefinitions: Record<string, string>
  bands: Record<ConfidenceBandId, string>
  /** What each confidence band means, printed under the legend beside its label. */
  bandMeanings: Record<ConfidenceBandId, string>
  /** Score band labels and meanings, for the legend beside any table of scores. */
  scoreBands: Record<ScoreBandId, { label: string; meaning: string }>
  /** {a} {b}: how a legend prints an inclusive range. */
  legendRange: string
  /** {a}: how a legend prints the open top range. */
  legendRangeTop: string
  radar: RadarStrings
  agenda: AgendaStrings
  institutions: InstitutionStrings
}

/**
 * The words the radar needs beyond the model's own vocabulary. Everything the
 * readout prints comes from `dimensions`, `questions` and the same score and
 * confidence the tables use, so only the click affordance is left.
 */
export type RadarStrings = {
  /** What clicking an axis does. It is the accessible name of an axis target. */
  compare: string
}

/** Fill {name} placeholders from a map. Unknown placeholders are left visible. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) =>
    key in values ? String(values[key]) : m,
  )
}

/**
 * The words the institution map needs. The vocabulary maps translate the model
 * enums; the rest are the page's own labels. A missing language never reaches
 * this file: the view reads one lexicon and nothing else, so adding a country
 * or a language changes data and not components. See D56.
 */
export type InstitutionStrings = {
  levels: Record<InstitutionLevel, string>
  systems: Record<InstitutionSystem, string>
  natures: Record<InstitutionLegalNature, string>
  roles: Record<InstitutionRole, string>
  /** The verb, read from each end of the relation. */
  relations: Record<InstitutionRelation, { outgoing: string; incoming: string }>
  /**
   * One band per relation family. `empty` states that the map records no
   * relation of that kind, which is a fact about the map and stays on screen.
   */
  families: Record<InstitutionRelationFamily, { label: string; empty: string }>
  findHeading: string
  findName: string
  findNamePlaceholder: string
  findLevel: string
  findSystem: string
  findJurisdiction: string
  nationalJurisdiction: string
  anyLevel: string
  anySystem: string
  /** {n} */
  shown: string
  noMatch: string
  rolesHeading: string
  dimensionsHeading: string
  noDimensions: string
  /** Column heading over the relations that reach the institution. */
  incomingHeading: string
  /** Column heading over the relations the institution exercises. */
  outgoingHeading: string
  ledgerHint: string
  /** {n} */
  relationCount: string
  relationCountOne: string
  noRelations: string
  sourceLink: string
  matrixHeading: string
  matrixIntro: string
  /** Axis caption over the row headers. */
  matrixFrom: string
  /** Axis caption over the column headers. */
  matrixTo: string
  matrixAllFamilies: string
  matrixLegendLabel: string
  /** {n} {from} {to}: the accessible name of a cell. */
  matrixCell: string
  /** {from} {to} */
  matrixCellOne: string
  /** {from} {to} */
  matrixCellNone: string
  /** {total} {filled} {cells} */
  matrixSummary: string
}
