import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { COUNTRIES, DIMENSIONS } from '@ncb/core'
import type { CountryResult } from '@ncb/core'
import { DATA_ROOT } from './data'

const AGENDA_DIR = resolve(DATA_ROOT, 'out/agenda')
const CHANGELOG_PATH = resolve(DATA_ROOT, '../CHANGELOG.md')

export type AgendaFeedEntry = {
  iso3: string
  lang: 'en' | 'pt-BR'
  title: string
  summary: string
  updated: string
}

export type DatasetFeedEntry = {
  version: string
  updated: string
}

const isoDate = (date: string): string => `${date}T00:00:00.000Z`

function firstParagraph(markdown: string): string {
  const paragraph = markdown
    .split(/\r?\n\s*\r?\n/)
    .map((part) => part.trim())
    .find((part) => part && !part.startsWith('#') && !/^\*[^*]+\*$/.test(part))
  return (paragraph ?? '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_]/g, '')
}

/** Read the generated markdown agendas, which are the feed's source material. */
export async function loadAgendaFeedEntries(): Promise<AgendaFeedEntry[]> {
  let names: string[]
  try {
    names = await readdir(AGENDA_DIR)
  } catch {
    return []
  }

  const known = new Set<string>(COUNTRIES.map((country) => country.iso3))
  const files = names
    .map((name) => {
      const match = /^(?<iso3>[A-Z]{3})\.(?<lang>en|pt-BR)\.md$/.exec(name)
      const iso3 = match?.groups?.iso3
      const lang = match?.groups?.lang
      if (!iso3 || !lang || !known.has(iso3)) return null
      return {
        name,
        iso3,
        lang: lang as AgendaFeedEntry['lang'],
      }
    })
    .filter((file): file is { name: string; iso3: string; lang: AgendaFeedEntry['lang'] } => Boolean(file))
    .sort((a, b) => a.name.localeCompare(b.name))

  return Promise.all(
    files.map(async ({ name, iso3, lang }) => {
      const markdown = await readFile(resolve(AGENDA_DIR, name), 'utf8')
      const heading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim()
      const date = markdown.match(/^\*(?:Generated|Gerado)\s+(\d{4}-\d{2}-\d{2})\*$/m)?.[1]
      const country = COUNTRIES.find((candidate) => candidate.iso3 === iso3)?.name ?? iso3
      return {
        iso3,
        lang,
        title: heading ?? `Capability agenda: ${country}`,
        summary: firstParagraph(markdown) || `Capability agenda for ${country}.`,
        updated: isoDate(date ?? new Date(0).toISOString().slice(0, 10)),
      }
    }),
  )
}

/** Read every semantic version explicitly recorded in CHANGELOG.md. */
export async function loadDatasetFeedEntries(defaultDate: string): Promise<DatasetFeedEntry[]> {
  let changelog: string
  try {
    changelog = await readFile(CHANGELOG_PATH, 'utf8')
  } catch {
    return []
  }

  const entries: DatasetFeedEntry[] = []
  const heading = /^##\s+[^\n]*?(?:\[|\b)(?:v)?(\d+\.\d+\.\d+)(?:\]|\b)[^\n]*$/gm
  for (const match of changelog.matchAll(heading)) {
    const line = match[0]
    const version = match[1]
    if (!version) continue
    const date = line.match(/\b(\d{4}-\d{2}-\d{2})\b/)?.[1] ?? defaultDate
    entries.push({ version, updated: isoDate(date) })
  }
  return entries
}

/** The flat table's RFC 4180 escaping, reused by the per-country export. */
function csvCell(value: string | number | null): string {
  if (value === null) return ''
  const text = String(value)
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** Serialize one country with exactly the columns used by data/out/table.csv. */
export function countryCsv(country: CountryResult): string {
  const headers = ['country', 'iso3', ...DIMENSIONS]
  const values: Array<string | number | null> = [
    country.country,
    country.iso3,
    ...DIMENSIONS.map((dimension) => country.dimensions[dimension]?.score ?? null),
  ]
  return `${headers.join(',')}\r\n${values.map(csvCell).join(',')}\r\n`
}
