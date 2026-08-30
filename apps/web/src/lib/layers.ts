import type { Lang } from '@ncb/core'

/**
 * Country layers.
 *
 * The ground layer is comparative and English: every country on one ruler,
 * scored from the same registry. A country layer is a second reading of one
 * country, written in that country's language and at that country's depth. It
 * is not a translation of the benchmark. A translated mirror of the whole
 * world says the same thing twice and drifts; a layer says something the
 * comparison cannot, because it carries the institutions, the subnational
 * spread and the audience of one country.
 *
 * A layer exists only where that country-specific work is done, which is why
 * this registry is short. Brazil is the first and, today, the only one.
 * See D69.
 */

/** The kinds of section a layer can hold. */
export type LayerSectionId = 'agenda' | 'institutions' | 'local' | 'support'

export type LayerSection = {
  id: LayerSectionId
  /** Nav label, in the layer's language. */
  label: string
  /**
   * The path segment under the layer, or null when the section still lives in
   * the ground layer and the layer only links to it.
   */
  slug: string | null
}

export type CountryLayer = {
  iso3: string
  /** First path segment: the country's own name for itself. */
  slug: string
  /** How the layer names itself. */
  label: string
  /**
   * How the layer is named in the crumb that offers both readings. The country
   * crumb before it already carries the country's name, so this says only the
   * language.
   */
  readingLabel: string
  /** The language the layer is written in. */
  lang: Lang
  /** Label for the layer's own front page. */
  overviewLabel: string
  /** What the layer holds, in reading order. */
  sections: readonly LayerSection[]
}

export const COUNTRY_LAYERS: readonly CountryLayer[] = [
  {
    iso3: 'BRA',
    slug: 'brasil',
    label: 'Brasil',
    readingLabel: 'Em português',
    lang: 'pt-BR',
    overviewLabel: 'Visão geral',
    sections: [
      { id: 'agenda', label: 'Agenda', slug: 'agenda' },
      { id: 'institutions', label: 'Instituições', slug: 'instituicoes' },
      /* The subnational reading is still an English ground-layer page. The
       * layer links to it until it is written in Portuguese, at which point
       * this slug becomes 'estados' and nothing else changes. */
      { id: 'local', label: 'Estados', slug: null },
      { id: 'support', label: 'Apoie', slug: 'apoie' },
    ],
  },
]

/** The layer for one country, or null where the project has not written one. */
export function countryLayer(iso3: string): CountryLayer | null {
  const code = iso3.toUpperCase()
  return COUNTRY_LAYERS.find((layer) => layer.iso3 === code) ?? null
}

/** The layer a path segment names, or null when the segment is not a layer. */
export function layerBySlug(slug: string): CountryLayer | null {
  const wanted = slug.toLowerCase()
  return COUNTRY_LAYERS.find((layer) => layer.slug === wanted) ?? null
}

/** Whether this country has a layer of its own. */
export const hasCountryLayer = (iso3: string): boolean => countryLayer(iso3) !== null

/**
 * Whether one country's pages may be read in one language.
 *
 * A lexicon renders any country, but only a country with a layer in that
 * language has an audience for it. Everything else stays in the ground layer,
 * so a language never becomes a second copy of the benchmark. See D69.
 */
export function servesLanguage(iso3: string, lang: Lang): boolean {
  if (lang === 'en') return true
  return countryLayer(iso3)?.lang === lang
}

/** One section of one layer, by id. */
export function layerSection(layer: CountryLayer, id: LayerSectionId): LayerSection | null {
  return layer.sections.find((section) => section.id === id) ?? null
}

/** The section a path segment names inside one layer. */
export function layerSectionBySlug(layer: CountryLayer, slug: string): LayerSection | null {
  const wanted = slug.toLowerCase()
  return layer.sections.find((section) => section.slug === wanted) ?? null
}

/**
 * Countries whose institution map is published.
 *
 * The nav is rendered in the header, above every layout that could read the
 * filesystem, so which surfaces a country has must be knowable without opening
 * a file. Keep this in step with `data/institutions/*.json`. A stale entry
 * costs a link to a page that says the country is not mapped yet, which is the
 * state that page already renders. See D73.
 */
export const INSTITUTION_MAPS: readonly string[] = ['BRA']

/** Whether this country's institution map is published. */
export const hasInstitutionMap = (iso3: string): boolean =>
  INSTITUTION_MAPS.includes(iso3.toUpperCase())
