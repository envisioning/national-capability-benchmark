import Link from 'next/link'
import { COUNTRY_FRAMES, DIMENSIONS } from '@ncb/core'
import { Radar } from '@/components/Radar'
import { ConfidenceTable, ScoreTable } from '@/components/views/ScoreTables'
import {
  ConfidenceBar,
  ConfidenceLegend,
  Empty,
  Eyebrow,
  Headline,
  Highlight,
  PageTitle,
  Section,
} from '@/components/ui'
import { MISSING_DATA_HINT, loadScores } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const data = await loadScores()
  if (!data) return <Empty hint={MISSING_DATA_HINT} />

  const extended = data.countries.filter((c) => COUNTRY_FRAMES[c.iso3] === 'extended').length

  return (
    <>
      <Eyebrow>{data.countries.length} countries, nine dimensions</Eyebrow>
      <PageTitle>What is this country capable of doing?</PageTitle>
      <Headline>
        Nine capability dimensions, scored from public data and read as a{' '}
        <Highlight>shape</Highlight> rather than a rank. Every score carries the raw indicators it
        came from and a separate number saying how well we know it.
      </Headline>

      <Section
        title="Each country comes out a different shape"
        hint={`Scores run 0 to 100 against a frame fixed by the ten reference countries. We never compute a composite. Two countries with the same average can have opposite profiles, and that difference is the whole point of the exercise.${
          extended > 0
            ? ` ${extended} countries marked ext were added later and are scored against that same frame, so adding them moved nobody else's number.`
            : ''
        }`}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        hint="Click any heading to sort. Darker cells are higher scores."
      >
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
