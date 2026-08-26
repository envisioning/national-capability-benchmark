import Link from 'next/link'
import { DIMENSIONS } from '@ncb/core'
import { Radar } from '@/components/Radar'
import { CompareRadar } from '@/components/views/CompareRadar'
import { CountryDimensionTable } from '@/components/views/CountryDimensionTable'
import { ConfidenceTable, ScoreTable } from '@/components/views/ScoreTables'
import {
  ConfidenceLegend,
  Empty,
  Eyebrow,
  Headline,
  Highlight,
  PageTitle,
  ScoreLegend,
  Section,
} from '@/components/ui'
import { MISSING_DATA_HINT, loadIndex } from '@/lib/data'
import { FOCUS_ISO3, toProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const data = await loadIndex()
  if (!data) return <Empty hint={MISSING_DATA_HINT} />

  const focus = data.countries.find((c) => c.iso3 === FOCUS_ISO3) ?? data.countries[0]
  if (!focus) return <Empty hint={MISSING_DATA_HINT} />
  const others = data.countries.filter((c) => c.iso3 !== focus.iso3)

  return (
    <>
      <Eyebrow>{data.countries.length} countries, nine dimensions</Eyebrow>
      <PageTitle>What is this country capable of doing?</PageTitle>
      <Headline>
        Nine capability dimensions, scored from public data and read as a{' '}
        <Highlight>shape</Highlight> rather than a rank. Every score carries the raw indicators it
        came from and a separate number saying how well we know it.
      </Headline>
      <p className="mb-10 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        New here? The{' '}
        <a href="/glossary" className="underline underline-offset-4">
          glossary
        </a>{' '}
        defines every term on these pages, including the four letters beside each indicator and what
        a dashed line on a chart means. Nothing assumes you have seen this before.
      </p>

      <Section
        title={`${focus.country} is the focal case`}
        hint={`This benchmark is built for work inside one country, so ${focus.country} leads and everybody else sits behind a comparison the reader picks. Picking one moves no number, because the scale is fixed by the 10 reference countries and holds still.`}
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,520px)_1fr]">
          <div>
            <CompareRadar focus={toProfile(focus)} others={others.map(toProfile)} />
            <Link
              href={`/country/${focus.iso3}`}
              className="mt-4 inline-block text-xs font-medium underline underline-offset-4"
            >
              Open the {focus.country} profile, indicator by indicator
            </Link>
          </div>
          <CountryDimensionTable country={focus} />
        </div>
      </Section>

      <Section
        title="Each country comes out a different shape"
        hint="Scores run 0 to 100 against a frame fixed by ten reference countries, and every country is measured the same way. We never compute a composite. Two countries with the same average can have opposite profiles, and that difference is the whole point of the exercise."
      >
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                labels="icons"
                series={[
                  {
                    label: c.country,
                    values: DIMENSIONS.map((d) => c.dimensions[d]?.score ?? null),
                    confidences: DIMENSIONS.map((d) => c.dimensions[d]?.confidence ?? null),
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
        hint="Click any heading to sort."
      >
        <ScoreLegend />
        <ScoreTable countries={data.countries} />
      </Section>

      <Section
        title="A score and its confidence are two different claims"
        hint="Confidence is coverage times recency times source quality. It sits beside the score and never inside it. A thin evidence base stays visible, because nothing gets imputed to cover it."
      >
        <ConfidenceLegend />
        <ConfidenceTable countries={data.countries} />
      </Section>
    </>
  )
}
