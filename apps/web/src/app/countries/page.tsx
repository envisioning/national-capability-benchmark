import Link from 'next/link'
import { Radar } from '@/components/Radar'
import { ConfidenceTable } from '@/components/views/ScoreTables'
import {
  ConfidenceLegend,
  CountryLabel,
  DimensionLegend,
  Empty,
  FrameNote,
  Headline,
  PageTitle,
  RadarEvidenceLegend,
  Section,
} from '@/components/ui'
import { MISSING_DATA_HINT, loadIndex } from '@/lib/data'
import { capabilitiesHref, compareBaseHref, countryProfileHref } from '@/lib/links'
import { toProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Countries, NCB',
  description:
    'Nine-dimension profiles for every country in the benchmark, with the confidence behind each score.',
}

export default async function CountriesPage() {
  const data = await loadIndex()
  if (!data || data.countries.length === 0) return <Empty hint={MISSING_DATA_HINT} />

  /* Alphabetical. Any other order on this page would be a ranking, and there is
   * no headline number to rank by. */
  const countries = [...data.countries].sort((a, b) => a.country.localeCompare(b.country))

  return (
    <>
      <PageTitle>Country profiles</PageTitle>
      <Headline>
        Each profile shows nine capability scores together. Two countries can have the same average
        and very different profiles, so the benchmark does not publish an overall score.
      </Headline>
      <p className="mb-10 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        Open a country to see its indicator rows, trend, and agenda. To compare a few countries,
        put{' '}
        <Link href={compareBaseHref} className="underline underline-offset-4">
          up to four side by side
        </Link>
        . To compare one capability across the full set, the{' '}
        <Link href={capabilitiesHref} className="underline underline-offset-4">
          capabilities directory
        </Link>{' '}
        puts them all on one scale.
      </p>

      <Section
        title="Different profiles, same average"
        hint="Each score runs from 0 to 100, using all countries to set the comparison frame. The benchmark has no composite score, so countries with the same average can still have different profiles."
      >
        <DimensionLegend />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c) => {
            const profile = toProfile(c)
            return (
              <Link
                key={profile.iso3}
                href={countryProfileHref(profile.iso3)}
                className="rounded-xl border border-[var(--rule)] p-4 transition-all duration-200 hover:border-[var(--foreground)]"
              >
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-xs font-medium">
                    <CountryLabel iso3={profile.iso3} name={profile.country} />
                  </span>
                  <span className="text-xs text-[var(--muted)]">{profile.iso3}</span>
                </div>
                <Radar
                  labels="icons"
                  interactive={false}
                  hoverLabels
                  series={[
                    {
                      label: profile.country,
                      values: profile.values,
                      confidences: profile.confidences,
                      color: 'var(--primary)',
                    },
                  ]}
                />
              </Link>
            )
          })}
        </div>
        <RadarEvidenceLegend interactive={false} />
        <FrameNote />
      </Section>

      <Section
        title="Score and confidence stay separate"
        hint="Confidence is coverage times recency times source quality. It sits beside the score; missing data lowers coverage and is never imputed."
      >
        <ConfidenceLegend />
        <ConfidenceTable countries={countries} />
      </Section>
    </>
  )
}
