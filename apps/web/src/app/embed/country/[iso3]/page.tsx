import { notFound } from 'next/navigation'
import { EN } from '@ncb/core'
import { Radar } from '@/components/Radar'
import { EmbedShell, embedTheme } from '@/components/EmbedShell'
import { CountryLabel, FrameNote, PageTitle, RadarEvidenceLegend } from '@/components/ui'
import { loadCountry } from '@/lib/data'
import { absoluteHref, countryProfileHref } from '@/lib/links'
import { toProfile } from '@/lib/profile'

export const revalidate = 1800

export default async function CountryEmbedPage({
  params,
  searchParams,
}: {
  params: Promise<{ iso3: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ iso3 }, query] = await Promise.all([params, searchParams])
  const country = await loadCountry(iso3)
  if (!country) notFound()

  const profile = toProfile(country)
  return (
    <EmbedShell theme={embedTheme(query)}>
      <div className="embed-card">
        <p className="embed-kicker">National Capability Benchmark</p>
        <PageTitle>
          <CountryLabel iso3={country.iso3} name={country.country} />
        </PageTitle>
        <Radar
          series={[{
            label: profile.country,
            values: profile.values,
            confidences: profile.confidences,
            color: 'var(--primary)',
          }]}
          lex={EN}
        />
        <RadarEvidenceLegend interactive={false} />
        <FrameNote />
        <p className="embed-source">
          <a href={absoluteHref(countryProfileHref(country.iso3))}>
            Open the full {country.country} profile
          </a>
        </p>
      </div>
    </EmbedShell>
  )
}
