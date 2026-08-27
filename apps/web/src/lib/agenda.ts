import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { CountryAgenda } from '@ncb/core'
import { DATA_ROOT } from './data'

/**
 * The computed capability agenda for one country, written by `pnpm bench
 * agenda`. Language neutral: the page renders it through a lexicon. See D35.
 */
export async function loadAgenda(iso3: string): Promise<CountryAgenda | null> {
  try {
    const raw = await readFile(
      resolve(DATA_ROOT, 'out/agenda', `${iso3.toUpperCase()}.json`),
      'utf8',
    )
    return JSON.parse(raw) as CountryAgenda
  } catch {
    return null
  }
}
