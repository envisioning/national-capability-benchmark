import Link from 'next/link'
import { DIMENSIONS, DIMENSION_LABELS } from '@ncb/core'
import { Radar } from '@/components/Radar'
import {
  ConfidenceBar,
  ConfidenceLegend,
  Empty,
  Eyebrow,
  Headline,
  Highlight,
  PageTitle,
  ScoreCell,
  Scroller,
  Section,
  Table,
  Td,
  Th,
} from '@/components/ui'
import { MISSING_DATA_HINT, loadScores } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const data = await loadScores()
  if (!data) return <Empty hint={MISSING_DATA_HINT} />

  return (
    <>
      <Eyebrow>Ten countries, nine dimensions</Eyebrow>
      <PageTitle>What is this country capable of doing?</PageTitle>
      <Headline>
        Nine capability dimensions, scored from public data and read as a{' '}
        <Highlight>shape</Highlight> rather than a rank. Every score carries the raw indicators it
        came from and a separate number saying how well we know it.
      </Headline>

      <Section
        title="Each country comes out a different shape"
        hint="Scores run 0 to 100 against the other nine countries in this run. We never compute a composite. Two countries with the same average can have opposite profiles, and that difference is the whole point of the exercise."
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {data.countries.map((c) => (
            <Link
              key={c.iso3}
              href={`/country/${c.iso3}`}
              className="rounded-xl border border-[var(--rule)] p-4 transition-all duration-200 hover:border-[var(--foreground)]"
            >
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-xs font-medium">{c.country}</span>
                <span className="text-xs text-[var(--muted)]">{c.iso3}</span>
              </div>
              <Radar
                series={[
                  {
                    label: c.country,
                    values: DIMENSIONS.map((d) => c.dimensions[d]?.score ?? null),
                    color: 'var(--primary)',
                  },
                ]}
              />
            </Link>
          ))}
        </div>
      </Section>

      <Section
        title="The same numbers, ready for a chart"
        hint="Darker cells are higher scores. Click a country for the indicators behind every number."
      >
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Country</Th>
                {DIMENSIONS.map((d) => (
                  <Th key={d} align="right">
                    {DIMENSION_LABELS[d]}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.countries.map((c) => (
                <tr key={c.iso3}>
                  <Td>
                    <Link href={`/country/${c.iso3}`} className="hover:underline">
                      {c.country}
                    </Link>
                  </Td>
                  {DIMENSIONS.map((d) => (
                    <ScoreCell key={d} value={c.dimensions[d]?.score ?? null} />
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section
        title="A score and its confidence are two different claims"
        hint="Confidence is coverage times recency times source quality. It sits beside the score and never inside it. A thin evidence base stays visible, because nothing gets imputed to cover it."
      >
        <ConfidenceLegend />
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Country</Th>
                {DIMENSIONS.map((d) => (
                  <Th key={d}>{DIMENSION_LABELS[d]}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.countries.map((c) => (
                <tr key={c.iso3}>
                  <Td>{c.country}</Td>
                  {DIMENSIONS.map((d) => (
                    <Td key={d}>
                      <ConfidenceBar value={c.dimensions[d]?.confidence ?? 0} />
                    </Td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>
    </>
  )
}
