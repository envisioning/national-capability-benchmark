/**
 * Countries with the first international institutional-history sections.
 * The list is deliberately explicit: adding a country is an editorial act,
 * not a side effect of finding three evidence records.
 */
export const AGENDA_HISTORY_COUNTRIES = ['EST', 'SGP', 'KOR', 'DEU', 'GBR', 'URY', 'NLD'] as const
export type AgendaHistoryCountry = (typeof AGENDA_HISTORY_COUNTRIES)[number]

/** Minimum number of sourced entries before the history section is shown. */
export const AGENDA_HISTORY_MIN_ENTRIES = 3

export function isAgendaHistoryCountry(iso3: string): iso3 is AgendaHistoryCountry {
  return (AGENDA_HISTORY_COUNTRIES as readonly string[]).includes(iso3.toUpperCase())
}
