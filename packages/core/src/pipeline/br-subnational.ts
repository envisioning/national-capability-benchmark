import { readFile } from 'node:fs/promises'
import { BR_STATES, CorroborationFile, ObservationFile, brSubnationalSeriesUrl } from '../model/index.js'
import type { CorroborationFile as CorroborationFileType, SubnationalValue } from '../model/index.js'
import { BR_SUBNATIONAL_SOURCE } from '../model/sources.js'
import { FILES, brSubnationalFile } from './paths.js'
import { writeOut } from './store.js'

export const BR_SUBNATIONAL_INDICATOR = 'income_inequality'
export const BR_SUBNATIONAL_YEAR = 2024

type SidraRow = {
  D1C?: string
  D1N?: string
  D3C?: string
  V?: string
}

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, 'utf8')) as unknown
}

async function fetchSidra(year: number): Promise<SidraRow[]> {
  const response = await fetch(brSubnationalSeriesUrl(year))
  if (!response.ok) throw new Error(`IBGE SIDRA: HTTP ${response.status}`)
  const body: unknown = await response.json()
  if (!Array.isArray(body)) throw new Error('IBGE SIDRA: response was not an array')
  return body.slice(1) as SidraRow[]
}

function statesFromRows(rows: SidraRow[], year: number): SubnationalValue[] {
  const byCode = new Map(rows.map((row) => [row.D1C, row]))
  if (byCode.size !== BR_STATES.length || BR_STATES.some((state) => !byCode.has(state.code))) {
    throw new Error(`IBGE SIDRA: expected all ${BR_STATES.length} Brazilian federative units`)
  }

  return BR_STATES.map((state) => {
    const row = byCode.get(state.code) as SidraRow
    const value = Number(row.V)
    if (!Number.isFinite(value) || value < 0 || value > 1) {
      throw new Error(`IBGE SIDRA: invalid Gini value for ${state.name}`)
    }
    if (row.D3C !== String(year) || row.D1N !== state.name) {
      throw new Error(`IBGE SIDRA: unexpected metadata for ${state.name}`)
    }
    return {
      iso: `BR-${state.iso}`,
      name: state.name,
      value,
      year,
    }
  })
}

async function nationalValue(year: number): Promise<{ value: number; year: number }> {
  const file = ObservationFile.parse(await readJson(FILES.worldBank))
  const rows = file.observations.filter(
    (row) =>
      row.indicatorId === BR_SUBNATIONAL_INDICATOR &&
      row.iso3 === 'BRA' &&
      row.geometry === 'national' &&
      row.year === year,
  )
  const row = rows[0]
  if (!row) {
    throw new Error(
      `National ${BR_SUBNATIONAL_INDICATOR} observation for BRA/${year} is missing; refresh the national ingest first`,
    )
  }
  return { value: Number((row.value / 100).toFixed(3)), year }
}

export async function buildBrazilSubnational(
  year = BR_SUBNATIONAL_YEAR,
): Promise<CorroborationFileType> {
  const [states, national] = await Promise.all([fetchSidra(year), nationalValue(year)])
  const file = {
    indicatorId: BR_SUBNATIONAL_INDICATOR,
    iso3: 'BRA',
    geometry: 'state' as const,
    reconciliation: 'aggregate' as const,
    asOf: `${year}-12-31`,
    source: `${BR_SUBNATIONAL_SOURCE.publisher}, table ${BR_SUBNATIONAL_SOURCE.table}`,
    sourceUrl: BR_SUBNATIONAL_SOURCE.url,
    national,
    states: statesFromRows(states, year),
  }
  return CorroborationFile.parse(file)
}

export async function writeBrazilSubnational(
  year = BR_SUBNATIONAL_YEAR,
): Promise<CorroborationFileType> {
  const file = await buildBrazilSubnational(year)
  await writeOut(brSubnationalFile(file.indicatorId), `${JSON.stringify(file, null, 2)}\n`)
  return file
}
