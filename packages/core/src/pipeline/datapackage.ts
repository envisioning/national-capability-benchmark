import { z } from 'zod'
import {
  COUNTRY_ISO3,
  DATASET_VERSION,
  DIMENSIONS,
  REPO_URL,
  publisherSummaries,
  CountryFile,
  FactorHistoryFile,
  FactorStructure,
  ResidualStructure,
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

/**
 * One shape as a draft-07 JSON Schema, wrapped under `definitions` with a root
 * `$ref`: the layout the files carried when zod-to-json-schema wrote them, so a
 * reader that resolved `#/definitions/<Name>` keeps working. Zod 4 writes the
 * body. Its `int()` is a safe integer and the generator states those bounds on
 * every integer; they are dropped because they say nothing a reader needs.
 */
function namedJsonSchema(schema: z.ZodType, name: string): object {
  const { $schema, ...body } = z.toJSONSchema(schema, {
    target: 'draft-7',
    override: ({ jsonSchema }) => {
      if (jsonSchema.type !== 'integer') return
      if (jsonSchema.minimum === Number.MIN_SAFE_INTEGER) delete jsonSchema.minimum
      if (jsonSchema.maximum === Number.MAX_SAFE_INTEGER) delete jsonSchema.maximum
    },
  })
  return { $ref: `#/definitions/${name}`, definitions: { [name]: body }, $schema }
}

/** JSON Schema per published shape, keyed by file name under data/out/schema. */
export function jsonSchemas(): Record<string, object> {
  return {
    'index.schema.json': namedJsonSchema(IndexFile, 'IndexFile'),
    'country.schema.json': namedJsonSchema(CountryFile, 'CountryFile'),
    'indicator.schema.json': namedJsonSchema(IndicatorAcrossCountries, 'IndicatorAcrossCountries'),
    'subnational.schema.json': namedJsonSchema(SubnationalFile, 'SubnationalFile'),
    'subnational-index.schema.json': namedJsonSchema(SubnationalIndexFile, 'SubnationalIndexFile'),
    /* The factor test is one field of diagnostics.json, which has no schema
     * of its own yet, so this one describes `factorStructure` alone. D137. */
    'factor-structure.schema.json': namedJsonSchema(FactorStructure, 'FactorStructure'),
    'factor-history.schema.json': namedJsonSchema(FactorHistoryFile, 'FactorHistoryFile'),
    /* Likewise `residualStructure`, the aggregate tests on what is left after income. D138. */
    'residual-structure.schema.json': namedJsonSchema(ResidualStructure, 'ResidualStructure'),
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
        title: 'One indicator or condition across every country, ranked best first',
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
        name: 'diagnostics',
        path: 'diagnostics.json',
        title:
          'The tests the model has to pass. Its factorStructure field, whether the nine dimensions are one factor that tracks income, is described by schema/factor-structure.schema.json, and its residualStructure field, the aggregate tests of what is left after income, by schema/residual-structure.schema.json',
        format: 'json',
        mediatype: 'application/json',
      },
      {
        name: 'factor-history',
        path: 'factor-history.json',
        title: 'The first-factor share and its chance level at every committed dataset release',
        format: 'json',
        mediatype: 'application/json',
        schema: 'schema/factor-history.schema.json',
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
