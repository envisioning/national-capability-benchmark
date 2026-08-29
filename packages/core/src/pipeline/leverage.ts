import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import {
  COUNTRIES,
  COUNTRY_ISO3,
  CountryFile,
  DIMENSIONS,
  LeverageCell as LeverageCellSchema,
  LeverageFile,
  LEVERAGE_DIMENSIONS,
} from '../model/index.js'
import type {
  CountryResult,
  LeverageCell,
  LeverageDimension,
  LeverageFile as LeverageFileType,
} from '../model/index.js'
import { FILES, countryFile } from './paths.js'

export const LEVERAGE_METHOD_VERSION = 'leverage/0.1-exploratory' as const

type LeverageSpec = {
  dimension: LeverageDimension
  indicatorId: string | null
  weight: number
  baseOffset: number
}

/** Six transparent public-data proxies are wired in v1; five remain null. */
export const LEVERAGE_SPECS: readonly LeverageSpec[] = [
  { dimension: 'ai_access', indicatorId: null, weight: 50, baseOffset: 23 },
  { dimension: 'compute', indicatorId: null, weight: 40, baseOffset: 13 },
  { dimension: 'data_availability', indicatorId: 'statistical_performance', weight: 65, baseOffset: 10 },
  { dimension: 'connectivity', indicatorId: 'internet_users', weight: 70, baseOffset: 8 },
  { dimension: 'energy', indicatorId: 'electricity_transmission_losses', weight: 75, baseOffset: 5 },
  { dimension: 'capital_availability', indicatorId: 'domestic_credit_private', weight: 60, baseOffset: 12 },
  { dimension: 'robotics', indicatorId: null, weight: 55, baseOffset: 18 },
  { dimension: 'scientific_capacity', indicatorId: 'rd_expenditure_gdp', weight: 80, baseOffset: 4 },
  { dimension: 'advanced_manufacturing', indicatorId: 'manufacturing_value_added', weight: 70, baseOffset: 10 },
  { dimension: 'technical_talent', indicatorId: null, weight: 65, baseOffset: 12 },
  { dimension: 'institutional_deployability', indicatorId: null, weight: 50, baseOffset: 20 },
]

/** The placeholder weighted sum, capped at the display ceiling. */
export function leverageScore(rawValue: number, weight: number, baseOffset: number): number {
  return Math.min(100, rawValue * weight + baseOffset)
}

type FoundationDimension = NonNullable<CountryResult['dimensions'][typeof DIMENSIONS[number]]>
type IndicatorResult = FoundationDimension['indicators'][number]

function findIndicator(country: CountryResult, indicatorId: string): IndicatorResult | null {
  for (const dimension of DIMENSIONS) {
    const result = country.dimensions[dimension]
    const indicator = result?.indicators.find((candidate) => candidate.indicatorId === indicatorId)
    if (indicator) return indicator
  }
  return null
}

function cellFor(country: CountryResult, spec: LeverageSpec): LeverageCell {
  if (spec.indicatorId === null) {
    return LeverageCellSchema.parse({
      value: null,
      rawValue: null,
      weight: spec.weight,
      baseOffset: spec.baseOffset,
      note: 'source not yet integrated; future work.',
      source: null,
    })
  }

  const indicator = findIndicator(country, spec.indicatorId)
  if (!indicator || indicator.normalized === null || indicator.year === null) {
    return LeverageCellSchema.parse({
      value: null,
      rawValue: null,
      weight: spec.weight,
      baseOffset: spec.baseOffset,
      note: 'source series has no current value; future work.',
      source: null,
    })
  }

  const rawValue = Number((indicator.normalized / 100).toFixed(3))
  const value = Number(leverageScore(rawValue, spec.weight, spec.baseOffset).toFixed(1))
  return LeverageCellSchema.parse({
    value,
    rawValue,
    weight: spec.weight,
    baseOffset: spec.baseOffset,
    note: `Placeholder input from ${indicator.source}; rawValue is the current normalized foundation value divided by 100.`,
    source: {
      indicatorId: spec.indicatorId,
      publisher: indicator.source,
      year: indicator.year,
    },
  })
}

function countryLeverage(country: CountryResult): Record<LeverageDimension, LeverageCell> {
  return Object.fromEntries(
    LEVERAGE_SPECS.map((spec) => [spec.dimension, cellFor(country, spec)]),
  ) as Record<LeverageDimension, LeverageCell>
}

export function buildLeverage(
  countries: CountryResult[],
  generatedAt = new Date().toISOString(),
): LeverageFileType {
  const output = {
    generatedAt,
    methodVersion: LEVERAGE_METHOD_VERSION,
    countries: Object.fromEntries(
      countries.map((country) => [country.iso3, countryLeverage(country)]),
    ),
  }
  return LeverageFile.parse(output)
}

async function loadCountry(iso3: string): Promise<CountryResult> {
  const path = countryFile(iso3)
  const parsed = CountryFile.safeParse(JSON.parse(await readFile(path, 'utf8')))
  if (!parsed.success) throw new Error(`Invalid country output for ${iso3}: ${path}`)
  return parsed.data.country
}

/** Read the foundation outputs and write the provisional leverage fixture. */
export async function writeLeverage(
  generatedAt = new Date().toISOString(),
): Promise<LeverageFileType> {
  const countries = await Promise.all(COUNTRY_ISO3.map((iso3) => loadCountry(iso3)))
  if (countries.length !== COUNTRIES.length) {
    throw new Error(`Expected ${COUNTRIES.length} country files, found ${countries.length}`)
  }
  const output = buildLeverage(countries, generatedAt)
  await mkdir(dirname(FILES.leverage), { recursive: true })
  await writeFile(FILES.leverage, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
  return output
}
