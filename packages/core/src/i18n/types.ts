import type { Dimension } from '../model/dimensions.js'
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
   * {date} {countries} {reference}. The standing disclaimer under the title.
   * Keep the three claims: relative scores, confidence reported separately,
   * read the artefacts before quoting.
   */
  intro: string
  /** {countryTopic}: the country name with its article, for prose position. */
  standingHeading: string
  colDimension: string
  colScore: string
  colConfidence: string
  colTrend: string
  /** {delta} {years} {n} */
  trendCell: string
  noTrend: string
  noScore: string
  raiseHeading: string
  raiseIntro: string
  measureHeading: string
  measureIntro: string
  /** {dimension} {score} {band} */
  raiseItemHeading: string
  /** {dimension} {confidence} {band} */
  measureItemHeading: string
  /** {n} */
  scoredOn: string
  scoredOnOne: string
  /** {list} */
  gapsLine: string
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
  contributeHeading: string
  /** {repo} */
  contributeBody: string
  /** Link from an agenda to the full country profile in the ground layer. */
  profileLink: string
  /** Label on the link to this document in the other language. */
  switchLanguage: string
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
  agenda: AgendaStrings
}

/** Fill {name} placeholders from a map. Unknown placeholders are left visible. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) =>
    key in values ? String(values[key]) : m,
  )
}
