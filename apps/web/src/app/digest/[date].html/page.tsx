import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { COUNTRIES, DIMENSION_LABELS } from '@ncb/core'
import { CountryLabel, Delta, Eyebrow, PageTitle, Score, Section, Table, Td, Th } from '@/components/ui'
import { loadIndex } from '@/lib/data'
import { countryCsvHref, countryProfileHref, digestHref } from '@/lib/links'
import { countryForDigest, digestDimensions, parseDigestDate } from '@/lib/digest'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>
}): Promise<Metadata> {
  const { date } = await params
  if (!parseDigestDate(date)) return {}
  return {
    title: `Country of the week, ${date}, NCB`,
    description: 'A dated comparison of one country with the current National Capability Benchmark frame.',
    robots: { index: false, follow: true },
  }
}
export default async function DigestPage({ params }: { params: Promise<{ date: string }> }) {
  const { date: value } = await params
  const date = parseDigestDate(value)
  const index = await loadIndex()
  if (!date || !index) notFound()

  const country = countryForDigest(date, index.countries)
  if (!country) notFound()
  const dimensions = digestDimensions(country, index.countries)
  const striking = dimensions.reduce<typeof dimensions[number] | null>(
    (best, candidate) =>
      !best || Math.abs(candidate.delta) > Math.abs(best.delta) ? candidate : best,
    null,
  )
  if (!striking) notFound()

  return (
    <>
      <Eyebrow>Country of the week</Eyebrow>
      <PageTitle>
        <CountryLabel iso3={country.iso3} name={country.country} />
      </PageTitle>
      <p className="mt-3 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">Week of {value}</p>

      <Section title={`${DIMENSION_LABELS[striking.dimension]} is this country's largest difference`}>
        <p className="max-w-3xl text-lg leading-relaxed">
          {country.country} scores <Score value={striking.score} size="sm" /> on{' '}
          {DIMENSION_LABELS[striking.dimension]}. The frame average is{' '}
          <Score value={striking.average} size="sm" />. That is a{' '}
          <Delta value={striking.delta} /> point difference.
        </p>
        <p className="mt-5 text-lg">
          <Link href={countryProfileHref(country.iso3)} className="underline underline-offset-4">
            Read the full country profile
          </Link>{' '}
          or <a href={countryCsvHref(country.iso3)} className="underline underline-offset-4">download its CSV</a>.
        </p>
      </Section>

      <Section title="The other dimension differences" hint={`The comparison uses the ${COUNTRIES.length}-country frame. Missing scores are left out of each average.`}>
        <Table>
          <thead>
            <tr>
              <Th>Dimension</Th>
              <Th align="right">Country</Th>
              <Th align="right">Frame average</Th>
              <Th align="right">Difference</Th>
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dimension) => (
              <tr key={dimension.dimension}>
                <Td>{DIMENSION_LABELS[dimension.dimension]}</Td>
                <Td align="right"><Score value={dimension.score} size="sm" /></Td>
                <Td align="right"><Score value={dimension.average} size="sm" /></Td>
                <Td align="right"><Delta value={dimension.delta} /></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <p className="text-xs leading-relaxed text-[var(--muted)]">
        This page is a dated digest for sharing. Its country rotates by week, while the comparison
        uses the dataset available when the page is read. The digest is excluded from search indexing.
      </p>
      <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
        <Link href={digestHref(value)} className="underline underline-offset-4">Copy this digest link</Link>
      </p>
    </>
  )
}
