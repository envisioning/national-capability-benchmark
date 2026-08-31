import { zodToJsonSchema } from 'zod-to-json-schema'
import {
  COUNTRY_ISO3,
  DATASET_VERSION,
  DIMENSIONS,
  REPO_URL,
  publisherSummaries,
  CountryFile,
  IndexFile,
  IndicatorAcrossCountries,
  SubnationalFile,
  SubnationalIndexFile,
  SUBNATIONAL_SERIES,
} from '../model/index.js'

/*
 * The self-describing layer of `data/out`: JSON Schema for every published
 * shape, and a Frictionless Data Package that names each file, its schema and
 * its license. Both regenerate on `bench score`, so they can never drift from
 * the Zod schemas in model/schema.ts, which stay the single source of truth.
 * See docs/DECISIONS.md D37.
 */

/** JSON Schema per published shape, keyed by file name under data/out/schema. */
export function jsonSchemas(): Record<string, object> {
  return {
    'index.schema.json': zodToJsonSchema(IndexFile, 'IndexFile'),
    'country.schema.json': zodToJsonSchema(CountryFile, 'CountryFile'),
    'indicator.schema.json': zodToJsonSchema(IndicatorAcrossCountries, 'IndicatorAcrossCountries'),
    'subnational.schema.json': zodToJsonSchema(SubnationalFile, 'SubnationalFile'),
    'subnational-index.schema.json': zodToJsonSchema(SubnationalIndexFile, 'SubnationalIndexFile'),
  }
}

/**
 * The Data Package descriptor, one small file that makes the whole output
 * directory readable by standard data tooling. Paths are relative to
 * `data/out`, where the descriptor lives.
 */
export function buildDataPackage(indicatorIds: string[], generatedAt: string): object {
  return {
    profile: 'data-package',
    name: 'national-capability-benchmark',
    title: 'NCB, the National Capability Benchmark',
    description:
      'A prototype that measures what a country can do, separately from how rich it is. Nine capability dimensions scored from public data, each with a separate confidence number.',
    version: DATASET_VERSION,
    created: generatedAt,
    homepage: REPO_URL,
    licenses: [
      {
        name: 'CC-BY-4.0',
        path: 'https://creativecommons.org/licenses/by/4.0/',
        title: 'Creative Commons Attribution 4.0 International',
      },
    ],
    /* Read from the registry, so a publisher that starts supplying values appears
     * here without anybody remembering to add it. See D49. */
    sources: publisherSummaries()
      .filter((p) => p.live > 0)
      .map((p) => ({ title: p.publisher, ...(p.url ? { path: p.url } : {}) })),
    contributors: [{ title: 'Envisioning', path: 'https://envisioning.com', role: 'author' }],
    resources: [
      {
        name: 'index',
        path: 'index.json',
        title: 'All countries, nine scores each, no indicator detail',
        format: 'json',
        mediatype: 'application/json',
        schema: 'schema/index.schema.json',
      },
      {
        name: 'countries',
        path: COUNTRY_ISO3.map((iso3) => `countries/${iso3}.json`),
        title: 'One country in full, including every indicator row and its yearly series',
        format: 'json',
        mediatype: 'application/json',
        schema: 'schema/country.schema.json',
      },
      {
        name: 'indicators',
        path: indicatorIds.map((id) => `indicators/${id}.json`),
        title: 'One indicator across every country, ranked best first',
        format: 'json',
        mediatype: 'application/json',
        schema: 'schema/indicator.schema.json',
      },
      {
        name: 'table',
        path: 'table.csv',
        title: 'The flat table: one row per country, one column per dimension',
        format: 'csv',
        mediatype: 'text/csv',
        dialect: { delimiter: ',', lineTerminator: '\r\n', quoteChar: '"', doubleQuote: true },
        schema: {
          fields: [
            { name: 'country', type: 'string' },
            { name: 'iso3', type: 'string', constraints: { pattern: '^[A-Z]{3}$' } },
            ...DIMENSIONS.map((d) => ({ name: d, type: 'number' })),
          ],
        },
      },
      {
        name: 'subnational-index',
        path: 'subnational/index.json',
        title: 'Published subnational series and their diagnostic summaries',
        format: 'json',
        mediatype: 'application/json',
        schema: 'schema/subnational-index.schema.json',
      },
      {
        name: 'subnational',
        path: SUBNATIONAL_SERIES.map((series) =>
          `subnational/${series.iso3}/${series.indicatorId}.json`,
        ),
        title: 'Subnational values beside the national comparison layer; never scored',
        format: 'json',
        mediatype: 'application/json',
        schema: 'schema/subnational.schema.json',
      },
    ],
  }
}
