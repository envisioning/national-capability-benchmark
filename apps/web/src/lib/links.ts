import type { Lang } from '@ncb/core'

/**
 * Where a named thing lives in the viewer. One rule per kind of thing, so a
 * country named in a bullet, in a table and in a heading all reach the same
 * page, and a new page moves every reference to it at once.
 */

/** The full country profile. Ground layer, English. */
export const countryProfileHref = (iso3: string): string => `/country/${iso3}`

/** One country's capability agenda, in the language the reader is already in. */
export const agendaHref = (iso3: string, lang: Lang): string =>
  lang === 'pt-BR' ? `/pt/agenda/${iso3}` : `/agenda/${iso3}`

/** The registry row for one indicator, declared gaps included. */
export const indicatorHref = (id: string): string => `/indicators#${id}`

/** One evidence record, on the patterns page. */
export const evidenceHref = (recordId: string): string => `/patterns#${recordId}`
