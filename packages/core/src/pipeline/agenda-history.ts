import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import {
  AGENDA_HISTORY_COUNTRIES,
  AGENDA_HISTORY_MIN_ENTRIES,
} from '../model/agenda-history.js'
import { ROOT } from './paths.js'

export const AGENDA_HISTORY_DISCIPLINE_DOC =
  'packages/core/src/model/agenda-history-discipline.md'

export type AgendaHistoryDiscipline = {
  minimumEntries: number
  countries: readonly string[]
}

/** Read the editorial contract instead of hiding its floor in the CLI. */
export async function readAgendaHistoryDiscipline(
  root = ROOT,
): Promise<AgendaHistoryDiscipline> {
  const path = resolve(root, AGENDA_HISTORY_DISCIPLINE_DOC)
  const body = await readFile(path, 'utf8')
  const match = body.match(/<!--\s*minimum-entries:\s*(\d+)\s*-->/)
  if (!match) {
    throw new Error(`${path}: missing agenda-history minimum-entries marker`)
  }
  const minimumEntries = Number(match[1])
  if (minimumEntries !== AGENDA_HISTORY_MIN_ENTRIES) {
    throw new Error(
      `${path}: document floor ${minimumEntries} does not match model floor ${AGENDA_HISTORY_MIN_ENTRIES}`,
    )
  }
  return { minimumEntries, countries: AGENDA_HISTORY_COUNTRIES }
}

export function assertAgendaHistoryFloor(
  iso3: string,
  entries: number,
  discipline: AgendaHistoryDiscipline,
): void {
  if (
    (discipline.countries as readonly string[]).includes(iso3.toUpperCase()) &&
    entries < discipline.minimumEntries
  ) {
    throw new Error(
      `${iso3}: institutional history has ${entries} entries; at least ${discipline.minimumEntries} are required`,
    )
  }
}
