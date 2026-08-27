import type { Lang } from '@ncb/core'

/**
 * Where a named thing lives in the viewer. One rule per kind of thing, so a
 * country named in a bullet, in a table and in a heading all reach the same
 * page, and a new page moves every reference to it at once.
 */

/** The full country profile. Ground layer, English. */
export const countryProfileHref = (iso3: string): string => `/country/${iso3}`

/** One country's capability agenda, in the language the reader is already in. */
export const agendaHref = (iso3: string, lang: Lang = 'en'): string =>
  lang === 'pt-BR' ? `/pt/agenda/${iso3}` : `/agenda/${iso3}`

/** The registry row for one indicator, declared gaps included. */
export const indicatorHref = (id: string): string => `/indicators#${id}`

/** One evidence record, on the patterns page. */
export const evidenceHref = (recordId: string): string => `/patterns#${recordId}`

/** The known limits of the data, rendered from docs/KNOWN-ARTEFACTS.md. */
export const limitsHref = '/limits'

/**
 * The same page in the other language, where one exists.
 *
 * Language switching is not navigation: the Portuguese edition mirrors only the
 * pages that are interpretation layers (the home reading and the agendas), so
 * the switch is contextual and appears only where a counterpart page exists.
 * One rule here, one control in the layout, no per-page switch links. See D35.
 */
export function languageCounterpart(
  pathname: string,
): { href: string; label: string; lang: Lang } | null {
  if (pathname === '/' || pathname === '') return { href: '/pt', label: 'Português', lang: 'pt-BR' }
  if (pathname === '/pt') return { href: '/', label: 'English', lang: 'en' }
  /* The Portuguese edition's reading of the agendas starts at /pt. */
  if (pathname === '/agenda') return { href: '/pt', label: 'Português', lang: 'pt-BR' }
  const agenda = pathname.match(/^\/agenda\/([A-Z]{3})$/)
  if (agenda) return { href: `/pt/agenda/${agenda[1]}`, label: 'Português', lang: 'pt-BR' }
  const ptAgenda = pathname.match(/^\/pt\/agenda\/([A-Z]{3})$/)
  if (ptAgenda) return { href: `/agenda/${ptAgenda[1]}`, label: 'English', lang: 'en' }
  if (pathname === '/pt/agenda') return { href: '/agenda', label: 'English', lang: 'en' }
  return null
}
