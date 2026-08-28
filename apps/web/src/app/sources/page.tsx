import type { Metadata } from 'next'
import Link from 'next/link'
import {
  COUNTRY_ISO3,
  INDICATORS,
  INGEST_FROM_YEAR,
  INGEST_ROUTES,
  INGEST_ROUTE_LABELS,
  NO_PUBLISHER,
  WB_DATABASES,
  WB_DEFAULT_DATABASE,
  WB_PUBLISHER,
  docHref,
  publisherSummaries,
  worldBankSeriesUrl,
} from '@ncb/core'
import type { IngestRoute, PublisherSummary } from '@ncb/core'
import { DefineLink, Eyebrow, Headline, Note, PageTitle, Scroller, Section, Table, Td, Th } from '@/components/ui'
import { Icon, TIER_ICON } from '@/components/Icon'
import { loadIndicatorCoverage } from '@/lib/data'
import { indicatorHref, limitsHref, publisherSlug } from '@/lib/links'
import { capitalize, countWord } from '@/lib/words'

export const metadata: Metadata = {
  title: 'Sources, NCB',
  description:
    'Who publishes every number in the benchmark, which World Bank database each series comes from, and the exact request the ingester makes.',
}

/** The series the request example is built from. Any fetched row would do. */
const EXAMPLE_ID = 'rd_expenditure_gdp'

/** The routes a publisher's rows take, as one phrase. Only "gap" takes a plural. */
function routeSummary(routes: Record<IngestRoute, number>): string {
  return INGEST_ROUTES.filter((route) => routes[route] > 0)
    .map((route) => {
      const count = routes[route]
      const label =
        route === 'gap' && count > 1 ? 'declared gaps' : INGEST_ROUTE_LABELS[route]
      return `${count} ${label}`
    })
    .join(', ')
}

function PublisherName({ summary }: { summary: PublisherSummary }) {
  if (!summary.named) return <span className="text-[var(--muted)]">no publisher named</span>
  if (!summary.url) return <>{summary.publisher}</>
  return (
    <a className="hover:underline" href={summary.url}>
      {summary.publisher}
    </a>
  )
}

export default async function SourcesPage() {
  const publishers = publisherSummaries()
  const coverage = await loadIndicatorCoverage()

  const fetched = INDICATORS.filter((i) => i.ingest === 'worldbank')
  const manual = INDICATORS.filter((i) => i.ingest === 'manual')
  const retired = INDICATORS.filter((i) => i.ingest === 'retired')
  const gaps = INDICATORS.filter((i) => i.ingest === 'gap')
  const example = INDICATORS.find((i) => i.id === EXAMPLE_ID)
  /* The retirements so far are all perception composites bar one. See D23 and D44. */
  const perception = retired.filter((i) => i.measurementClass === 'P').length
  /* Rows whose publisher field names nobody: a gap with no candidate dataset behind it. */
  const unnamed = INDICATORS.filter((i) => i.source.publisher === NO_PUBLISHER).length
  const thisYear = new Date().getFullYear()

  /** Values held per publisher, counted as country cells rather than series. */
  const valuesFor = (summary: PublisherSummary): { values: number; latestYear: number | null } => {
    let values = 0
    let latestYear: number | null = null
    for (const def of summary.indicators) {
      const row = coverage.get(def.id)
      if (!row) continue
      values += row.countries
      latestYear = latestYear === null ? row.latestYear : Math.max(latestYear, row.latestYear)
    }
    return { values, latestYear }
  }

  const databases = Object.values(WB_DATABASES).map((db) => ({
    ...db,
    fetched: fetched.filter((i) => (i.wbSourceId ?? WB_DEFAULT_DATABASE) === db.id).length,
    retired: retired.filter((i) => (i.wbSourceId ?? WB_DEFAULT_DATABASE) === db.id).length,
  }))

  return (
    <>
      <Eyebrow>Sources</Eyebrow>
      <PageTitle>Every number here names its publisher</PageTitle>
      <Headline>
        Of {INDICATORS.length} indicators, {fetched.length + manual.length} carry a value today:{' '}
        {fetched.length} fetched from the World Bank API and {manual.length} read by hand off a
        published table. The remaining {gaps.length + retired.length} rows name a source and hold no
        number. Deleting them would raise confidence without adding evidence, so they stay.
      </Headline>

      <Section
        title="Most of the data arrives through one API call per series"
        hint={`The ingester asks the World Bank v2 API for one series at a time, all ${COUNTRY_ISO3.length} countries in a single request, every year from ${INGEST_FROM_YEAR}. Scoring reads the latest value per country and the rest becomes the trend layer.`}
        icon={<Icon name="globe" size={22} />}
      >
        {example ? (
          <>
            <p className="max-w-3xl text-lg leading-relaxed">
              This is the request behind {example.name}, exactly as the ingester sends it.
              Paste it into a browser and the response is the data this benchmark scored.
            </p>
            <code className="mt-4 block overflow-x-auto whitespace-pre rounded bg-[var(--surface-sunken)] px-3 py-3 text-xs">
              {worldBankSeriesUrl({
                series: example.source.series ?? '',
                ...(example.wbSourceId === undefined ? {} : { sourceId: example.wbSourceId }),
                countries: COUNTRY_ISO3,
                fromYear: INGEST_FROM_YEAR,
                toYear: thisYear,
              })}
            </code>
          </>
        ) : null}

        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          The database id decides whether the call works at all. World Development Indicators is
          the default and needs no source parameter. Every other database refuses its own series
          codes without one, and answers that the indicator does not exist. Each registry row
          stores the id its series needs, and the {countWord(databases.length)} databases below are
          every one this project reaches into.
        </p>

        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th align="right">Id</Th>
                <Th>Database</Th>
                <Th align="right">Fetched</Th>
                <Th align="right">Retired</Th>
                <Th>What to know about it</Th>
              </tr>
            </thead>
            <tbody>
              {databases.map((db) => (
                <tr key={db.id}>
                  <Td align="right">{db.id}</Td>
                  <Td>{db.name}</Td>
                  <Td align="right">{db.fetched || ''}</Td>
                  <Td align="right">{db.retired || ''}</Td>
                  <Td dim>{db.note}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section
        title="Every publisher the registry names, and what it supplies today"
        hint={`A publisher with no fetched rows is a plan rather than a feed: the registry names where the number would come from if somebody harmonized it. Values counts country cells, so one series across ${COUNTRY_ISO3.length} countries counts ${COUNTRY_ISO3.length} times.`}
      >
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Publisher</Th>
                <Th>
                  <DefineLink term="Source tier">Tier</DefineLink>
                </Th>
                <Th align="right">Indicators</Th>
                <Th>
                  <DefineLink term="Ingest route">Route</DefineLink>
                </Th>
                <Th align="right">Values</Th>
                <Th align="right">Latest year</Th>
              </tr>
            </thead>
            <tbody>
              {publishers.map((p) => {
                const { values, latestYear } = valuesFor(p)
                return (
                  <tr key={p.publisher} id={p.named ? publisherSlug(p.publisher) : undefined}>
                    <Td>
                      <PublisherName summary={p} />
                    </Td>
                    <Td dim>
                      {p.tiers.map((tier) => (
                        <span key={tier} className="mr-3 inline-flex items-center gap-1.5">
                          <Icon name={TIER_ICON[tier]} size={12} />
                          {tier.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </Td>
                    <Td align="right">{p.total}</Td>
                    <Td dim>{routeSummary(p.routes)}</Td>
                    <Td align="right">{values || ''}</Td>
                    <Td align="right">{latestYear ?? ''}</Td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Scroller>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          The {countWord(unnamed)} rows with no publisher named are the hardest part of the
          collection agenda: the model asks for something and nobody has proposed a dataset that
          would answer it. The{' '}
          <Link href="/indicators" className="underline underline-offset-4">
            registry
          </Link>{' '}
          carries the reason on each row.
        </p>
      </Section>

      {manual.length > 0 ? (
        <Section
          title={`${capitalize(countWord(manual.length))} ${
            manual.length === 1 ? 'number is' : 'numbers are'
          } typed in, and each one says where from`}
          hint="Some publishers put their results in a report and offer no API. A value entered by hand carries the page it was read from and the date somebody read it, so the claim can be checked against the same table."
        >
          <Scroller>
            <Table>
              <thead>
                <tr>
                  <Th>Indicator</Th>
                  <Th>Publisher</Th>
                  <Th>Where it was read</Th>
                </tr>
              </thead>
              <tbody>
                {manual.map((def) => (
                  <tr key={def.id}>
                    <Td>
                      <Link href={indicatorHref(def.id)} className="hover:underline">
                        {def.name}
                      </Link>
                    </Td>
                    <Td dim>{def.source.publisher}</Td>
                    <Td dim>
                      {def.source.url ? (
                        <a className="hover:underline" href={def.source.url}>
                          {def.source.url.replace(/^https?:\/\//, '')}
                        </a>
                      ) : (
                        'no link on the row'
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Scroller>
        </Section>
      ) : null}

      <Section
        title={`${capitalize(countWord(retired.length))} series stay in the registry and are never fetched`}
        hint="A retired row has a working dataset behind it. This project rejected what the dataset measures and kept the row, so the decision stays challengeable and the coverage it used to fill still counts against confidence."
        icon={<Icon name="archive" size={22} />}
      >
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Indicator</Th>
                <Th>Publisher</Th>
                <Th>Series code</Th>
                <Th>Database</Th>
              </tr>
            </thead>
            <tbody>
              {retired.map((def) => (
                <tr key={def.id}>
                  <Td>
                    <Link href={indicatorHref(def.id)} className="hover:underline">
                      {def.name}
                    </Link>
                  </Td>
                  <Td dim>{def.source.publisher}</Td>
                  <Td dim>{def.source.series}</Td>
                  <Td dim>
                    {def.source.publisher === WB_PUBLISHER
                      ? WB_DATABASES[def.wbSourceId ?? WB_DEFAULT_DATABASE]?.name
                      : ''}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          {capitalize(countWord(perception))} of them are perception composites, which record what
          experts and firms say about a country. The exception is the homicide rate, retired once a
          diagnostic showed it was carrying income into a trust score. The{' '}
          <Link href={limitsHref} className="underline underline-offset-4">
            limits page
          </Link>{' '}
          holds what each retirement costs.
        </p>
      </Section>

      <Section title="The published files say all of this to a machine as well">
        <ul className="max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
          <li>
            <a href={docHref('data/out/datapackage.json')} className="underline underline-offset-4">
              datapackage.json
            </a>{' '}
            is a Frictionless Data Package descriptor: every published file, its schema, the license
            and the source list.
          </li>
          <li>
            <a href={docHref('data/observations/worldbank.json')} className="underline underline-offset-4">
              worldbank.json
            </a>{' '}
            holds every fetched value with its year, its tier and the date it was retrieved, from{' '}
            {INGEST_FROM_YEAR} on.
          </li>
          <li>
            <a href={docHref('data/observations/revisions.json')} className="underline underline-offset-4">
              revisions.json
            </a>{' '}
            records what each fetch restated, added or dropped, so a publisher rewriting its own
            history leaves a mark here.
          </li>
          <li>
            <a href={docHref('packages/core/src/model/indicators.ts')} className="underline underline-offset-4">
              indicators.ts
            </a>{' '}
            is the registry itself. Publisher, series code, database id and route are declared there
            and nowhere else, which is why this page can be generated instead of maintained.
          </li>
        </ul>
        <Note>
          Data is committed to the repository, so the site shows whatever the last data run
          produced. Re-running the fetch reproduces the numbers, and any that moved appear in the
          revision log.
        </Note>
      </Section>
    </>
  )
}
