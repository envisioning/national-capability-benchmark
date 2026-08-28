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
    'Benchmark publishers, World Bank databases, and the requests used to fetch the data.',
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
        {INDICATORS.length} indicators are listed here. {fetched.length + manual.length} have data:
        {' '}{fetched.length} come from the World Bank API and {manual.length} from published tables.
        The other {gaps.length + retired.length} have no value and remain visible.
      </Headline>

      <Section
        title="The data comes from one API call per series"
        hint={`Requests cover all ${COUNTRY_ISO3.length} countries from ${INGEST_FROM_YEAR} onward. Scoring uses the latest value; older values feed trends.`}
        icon={<Icon name="globe" size={22} />}
      >
        {example ? (
          <>
            <p className="max-w-3xl text-lg leading-relaxed">
              This is the request for {example.name}. Paste it into a browser to see the response
              used by the benchmark.
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
          Each registry row carries a database id. World Development Indicators is the default;
          other databases need a source parameter. The project uses {countWord(databases.length)}
          databases.
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
        title="Publishers and their data"
        hint={`No fetched rows means a planned source. Values count country cells, so one series across ${COUNTRY_ISO3.length} countries counts ${COUNTRY_ISO3.length} times.`}
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
          The {countWord(unnamed)} rows without a publisher are open collection questions. The{' '}
          <Link href="/indicators" className="underline underline-offset-4">
            registry
          </Link>{' '}
          carries the reason on each row.
        </p>
      </Section>

      {manual.length > 0 ? (
        <Section
          title={`${capitalize(countWord(manual.length))} ${manual.length === 1 ? 'value is' : 'values are'} entered by hand`}
          hint="These publishers provide reports, not APIs. Each value keeps its source page and retrieval date."
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
        title={`${capitalize(countWord(retired.length))} retired series ${retired.length === 1 ? 'is' : 'are'} excluded`}
        hint="A retired row has a rejected dataset. It stays visible so the decision can be challenged and lowers confidence."
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
          {capitalize(countWord(perception))} are perception composites. The exception is the
          homicide rate, retired after diagnostics showed it carried income into a trust score. The{' '}
          <Link href={limitsHref} className="underline underline-offset-4">
            limits page
          </Link>{' '}
          holds what each retirement costs.
        </p>
      </Section>

      <Section title="Published files are machine-readable">
        <ul className="max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
          <li>
            <a href={docHref('data/out/datapackage.json')} className="underline underline-offset-4">
              datapackage.json
            </a>{' '}
            lists the files, schemas, license and sources.
          </li>
          <li>
            <a href={docHref('data/observations/worldbank.json')} className="underline underline-offset-4">
              worldbank.json
            </a>{' '}
            holds fetched values with year, tier and retrieval date, from {INGEST_FROM_YEAR} on.
          </li>
          <li>
            <a href={docHref('data/observations/revisions.json')} className="underline underline-offset-4">
              revisions.json
            </a>{' '}
            records what each fetch restated, added or dropped.
          </li>
          <li>
            <a href={docHref('packages/core/src/model/indicators.ts')} className="underline underline-offset-4">
              indicators.ts
            </a>{' '}
            is the registry of publishers, series codes, database ids and ingest routes.
          </li>
        </ul>
        <Note>
          Data is committed to the repository. The site shows the last run; changed values appear
          in the revision log.
        </Note>
      </Section>
    </>
  )
}
