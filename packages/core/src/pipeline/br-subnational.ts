import { readFile } from 'node:fs/promises'
import { relative } from 'node:path'
import {
  BR_STATES,
  ObservationFile,
  RevisionFile,
  SubnationalFile,
  SubnationalIndexFile,
  SUBNATIONAL_SERIES,
  brSubnationalSeriesUrl,
} from '../model/index.js'
import type {
  Revision,
  SubnationalFile as SubnationalFileType,
  SubnationalIndexFile as SubnationalIndexFileType,
  SubnationalSeriesDef,
  SubnationalValue,
} from '../model/index.js'
import { BR_STATE_POPULATION_SOURCE } from '../model/sources.js'
import { FILES, OUT_DIR, subnationalFile } from './paths.js'
import { writeOut } from './store.js'

type SidraRow = {
  D1C?: string
  D1N?: string
  D3C?: string
  V?: string
}

const round3 = (value: number): number => Number(value.toFixed(3))

async function readJson(path: string): Promise<unknown | null> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as unknown
  } catch {
    return null
  }
}

async function fetchSidra(series: SubnationalSeriesDef, year: number): Promise<SidraRow[]> {
  const response = await fetch(brSubnationalSeriesUrl(year, series.sidra))
  if (!response.ok) throw new Error(`IBGE SIDRA: HTTP ${response.status}`)
  const body: unknown = await response.json()
  if (!Array.isArray(body)) throw new Error('IBGE SIDRA: response was not an array')
  return body.slice(1) as SidraRow[]
}

function unitsFromRows(
  rows: SidraRow[],
  series: SubnationalSeriesDef,
  year: number,
): SubnationalValue[] {
  if (series.iso3 !== 'BRA' || series.geometry !== 'state') {
    throw new Error(`IBGE SIDRA adapter currently supports BRA/state only; got ${series.iso3}/${series.geometry}`)
  }
  const byCode = new Map(rows.map((row) => [row.D1C, row]))
  if (byCode.size !== BR_STATES.length || BR_STATES.some((state) => !byCode.has(state.code))) {
    throw new Error(`IBGE SIDRA: expected all ${BR_STATES.length} Brazilian federative units`)
  }

  return BR_STATES.map((state) => {
    const row = byCode.get(state.code) as SidraRow
    const value = Number(row.V)
    if (!Number.isFinite(value) || value < 0 || value > 1) {
      throw new Error(`IBGE SIDRA: invalid value for ${state.name}`)
    }
    if (row.D3C !== String(year) || row.D1N !== state.name) {
      throw new Error(`IBGE SIDRA: unexpected metadata for ${state.name}`)
    }
    return {
      iso: `BR-${state.iso}`,
      name: state.name,
      value,
      year,
      ...(series.denominator === 'population' ? { denominatorValue: state.population } : {}),
    }
  })
}

async function nationalValue(
  series: SubnationalSeriesDef,
  year: number,
): Promise<{ value: number; year: number }> {
  const file = ObservationFile.parse(await readJson(FILES.worldBank))
  const row = file.observations.find(
    (observation) =>
      observation.indicatorId === series.national.indicatorId &&
      observation.iso3 === series.iso3 &&
      observation.geometry === 'national' &&
      observation.year === year,
  )
  if (!row) {
    throw new Error(
      `National ${series.national.indicatorId} observation for ${series.iso3}/${year} is missing; refresh the national ingest first`,
    )
  }
  return { value: round3(row.value / series.national.divisor), year }
}

export function recomposeSubnational(
  units: SubnationalValue[],
  denominator: SubnationalSeriesDef['denominator'],
): number | null {
  if (denominator === 'none' || units.length === 0) return null
  if (denominator === 'equal') {
    return units.reduce((sum, unit) => sum + unit.value, 0) / units.length
  }
  if (units.some((unit) => unit.denominatorValue === undefined)) {
    throw new Error('Subnational population denominator is missing from one or more units')
  }
  const total = units.reduce((sum, unit) => sum + (unit.denominatorValue ?? 0), 0)
  if (total <= 0) throw new Error('Subnational population denominator is not positive')
  return units.reduce(
    (sum, unit) => sum + unit.value * (unit.denominatorValue ?? 0),
    0,
  ) / total
}

export async function buildSubnational(
  series: SubnationalSeriesDef,
  year = series.years[series.years.length - 1] as number,
): Promise<SubnationalFileType> {
  if (!series.years.includes(year)) {
    throw new Error(`${series.indicatorId}: year ${year} is not in the registry`)
  }
  const retrievedAt = new Date().toISOString()
  const [rows, national] = await Promise.all([fetchSidra(series, year), nationalValue(series, year)])
  const units = unitsFromRows(rows, series, year)
  const recomposed = recomposeSubnational(units, series.denominator)
  const check = {
    recomposed: recomposed === null ? null : round3(recomposed),
    national: national.value,
    residual: recomposed === null ? null : round3(recomposed - national.value),
    tolerance: series.tolerance,
  }
  return SubnationalFile.parse({
    indicatorId: series.indicatorId,
    iso3: series.iso3,
    geometry: series.geometry,
    reconciliation: series.reconciliation,
    denominator: series.denominator,
    unit: series.unit,
    direction: series.direction,
    transform: series.transform,
    asOf: `${year}-12-31`,
    retrievedAt,
    source: `${series.source.publisher}, ${series.source.series ?? series.source.adapter ?? 'source'}`,
    sourceUrl: series.source.url,
    denominatorSource:
      series.denominator === 'population'
        ? {
            publisher: BR_STATE_POPULATION_SOURCE.publisher,
            year: BR_STATE_POPULATION_SOURCE.year,
            url: BR_STATE_POPULATION_SOURCE.url,
          }
        : null,
    national,
    check,
    units,
  })
}

function revisionKey(unit: SubnationalValue): string {
  return unit.iso
}

async function recordSubnationalRevision(
  before: SubnationalFileType | null,
  after: SubnationalFileType,
): Promise<void> {
  const old = new Map((before?.units ?? []).map((unit) => [revisionKey(unit), unit.value]))
  const next = new Map(after.units.map((unit) => [revisionKey(unit), unit.value]))
  const revisions: Revision[] = []
  let changed = 0
  let added = 0
  let removed = 0

  for (const [unit, value] of next) {
    const previous = old.get(unit)
    const base = {
      indicatorId: after.indicatorId,
      iso3: after.iso3,
      geometry: after.geometry,
      unit,
      year: after.national.year,
    }
    if (previous === undefined) {
      added += 1
      revisions.push({ ...base, from: null, to: value })
    } else if (previous !== value) {
      changed += 1
      revisions.push({ ...base, from: previous, to: value })
    }
  }
  for (const [unit, value] of old) {
    if (next.has(unit)) continue
    removed += 1
    revisions.push({
      indicatorId: after.indicatorId,
      iso3: after.iso3,
      geometry: after.geometry,
      unit,
      year: before?.national.year ?? after.national.year,
      from: value,
      to: null,
    })
  }

  const existing = await readJson(FILES.revisions)
  const parsed = existing ? RevisionFile.safeParse(existing) : null
  const runs = parsed?.success ? parsed.data.runs : []
  runs.push({
    retrievedAt: after.retrievedAt,
    previousRetrievedAt: before?.retrievedAt ?? null,
    observationsBefore: old.size,
    observationsAfter: next.size,
    changed,
    added,
    removed,
    revisions: revisions.slice(0, 500),
    omitted: Math.max(0, revisions.length - 500),
  })
  await writeOut(FILES.revisions, `${JSON.stringify({ runs }, null, 2)}\n`)
}

export async function writeSubnationalSeries(
  series: SubnationalSeriesDef,
  year = series.years[series.years.length - 1] as number,
): Promise<SubnationalFileType> {
  const path = subnationalFile(series.iso3, series.indicatorId)
  const previousRaw = await readJson(path)
  const previous = previousRaw ? SubnationalFile.safeParse(previousRaw) : null
  const file = await buildSubnational(series, year)
  await writeOut(path, `${JSON.stringify(file, null, 2)}\n`)
  await recordSubnationalRevision(previous?.success ? previous.data : null, file)
  return file
}

export async function writeSubnationalOutputs(year?: number): Promise<SubnationalIndexFileType> {
  const files = []
  for (const series of SUBNATIONAL_SERIES) {
    const file = await writeSubnationalSeries(series, year)
    const path = relative(OUT_DIR, subnationalFile(series.iso3, series.indicatorId))
    files.push({
      indicatorId: file.indicatorId,
      iso3: file.iso3,
      path,
      geometry: file.geometry,
      year: file.national.year,
      reconciliation: file.reconciliation,
      denominator: file.denominator,
      residual: file.check.residual,
      units: file.units.length,
    })
  }
  const index = SubnationalIndexFile.parse({ generatedAt: new Date().toISOString(), files })
  await writeOut(FILES.subnationalIndex, `${JSON.stringify(index, null, 2)}\n`)
  return index
}
