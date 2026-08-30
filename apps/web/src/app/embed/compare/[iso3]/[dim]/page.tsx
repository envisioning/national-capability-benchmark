import { notFound } from 'next/navigation'
import { confidenceBand, DIMENSIONS, DIMENSION_LABELS } from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { FlagField, type FlagFieldPoint } from '@/components/FlagField'
import { EmbedShell, embedTheme } from '@/components/EmbedShell'
import { CountryLabel, FrameNote, PageTitle } from '@/components/ui'
import { loadIndex } from '@/lib/data'
import { absoluteHref, capabilityHref, countryProfileHref } from '@/lib/links'

export const revalidate = 1800

function asDimension(value: string): Dimension | null {
  return DIMENSIONS.includes(value as Dimension) ? (value as Dimension) : null
}

export default async function CompareEmbedPage({
  params,
  searchParams,
}: {
  params: Promise<{ iso3: string; dim: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ iso3: rawIso3, dim: rawDimension }, query] = await Promise.all([params, searchParams])
  const dimension = asDimension(rawDimension)
  if (!dimension) notFound()

  const data = await loadIndex()
  const iso3 = rawIso3.toUpperCase()
  const focal = data?.countries.find((country) => country.iso3 === iso3)
  if (!data || !focal) notFound()

  const points: FlagFieldPoint[] = data.countries.flatMap((country) => {
    const result = country.dimensions[dimension]
    if (result?.score === null || result?.score === undefined) return []
    const band = confidenceBand(result.confidence)
    return [{
      key: country.iso3,
      iso3: country.iso3,
      label: country.country,
      value: result.score,
      confidence: result.confidence,
      detail: `${band.label} evidence`,
      focal: country.iso3 === focal.iso3,
    }]
  })

  return (
    <EmbedShell theme={embedTheme(query)}>
      <div className="embed-card">
        <p className="embed-kicker">National Capability Benchmark</p>
        <PageTitle>{DIMENSION_LABELS[dimension]}</PageTitle>
        <p className="embed-lede">
          <CountryLabel iso3={focal.iso3} name={focal.country} /> compared with the countries in
          the frame
        </p>
        <FlagField points={points} />
        <FrameNote />
        <p className="embed-source">
          <a href={absoluteHref(capabilityHref(dimension))}>
            Open the full {DIMENSION_LABELS[dimension]} comparison
          </a>
          <span aria-hidden="true"> · </span>
          <a href={absoluteHref(countryProfileHref(focal.iso3))}>Open the country profile</a>
        </p>
      </div>
    </EmbedShell>
  )
}
