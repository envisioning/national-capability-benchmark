import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { COUNTRIES } from '@ncb/core'
import type { CountryResult } from '@ncb/core'
import { CompareBoard } from '@/components/views/CompareBoard'
import { ComparePicker } from '@/components/views/ComparePicker'
import { DefineLink, Empty, Eyebrow, Headline, PageTitle } from '@/components/ui'
import { MISSING_DATA_HINT, loadCountry, loadIndex } from '@/lib/data'
import {
  compareBaseHref,
  compareHref,
  countriesHref,
  readCompareCodes,
} from '@/lib/links'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ codes?: string[] }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const codes = readCompareCodes((await params).codes)
  const names = codes.map((iso3) => COUNTRIES.find((c) => c.iso3 === iso3)?.name ?? iso3)
  if (names.length < 2) {
    return {
      title: 'Compare countries, NCB',
      description:
        'Put up to four countries side by side across nine capability dimensions, down to the indicator behind every score.',
    }
  }
  return {
    title: `${names.join(' and ')}, compared, NCB`,
    description: `${names.join(', ')} side by side across nine capability dimensions, with the confidence, the trend and every indicator behind each score.`,
  }
}

export default async function ComparePage({ params }: Params) {
  const requested = (await params).codes ?? []
  const codes = readCompareCodes(requested)

  /* The address is the state, so it is normalised before anything is drawn: a
   * hand-written `/compare/bra/idn` and a shared `/compare/BRA-IDN` are the
   * same reading and must not be two pages. See D70. */
  const canonical = compareHref(codes)
  if (requested.join('/') !== codes.join('-')) redirect(canonical)

  const data = await loadIndex()
  if (!data || data.countries.length === 0) return <Empty hint={MISSING_DATA_HINT} />

  const all = [...data.countries]
    .map((c) => ({ iso3: c.iso3, country: c.country }))
    .sort((a, b) => a.country.localeCompare(b.country))

  /* Full country files, because this page reads indicator rows. Four files is
   * a bounded read and never a list: D27 forbids loading them to build one. */
  const loaded = await Promise.all(codes.map((iso3) => loadCountry(iso3)))
  const countries = loaded.filter((c): c is CountryResult => c !== null)
  const selected = countries.map((c) => ({ iso3: c.iso3, country: c.country }))

  return (
    <>
      <Eyebrow>One reference country, up to three others</Eyebrow>
      <PageTitle>Countries side by side</PageTitle>
      <Headline>
        A country score only means something against other countries. This page puts a reference
        country beside up to three others on the same nine axes, then follows every row down to the
        indicator it was built from.
      </Headline>
      <p className="mb-10 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        The first country is the{' '}
        <DefineLink term="Reference country">reference</DefineLink>: it keeps the filled shape and
        every other column is read as a distance from it. The selection lives in the address, so{' '}
        <code className="text-xs">{compareBaseHref}/BRA-IDN-ZAF</code> is a comparison you can send
        to somebody. There is still no composite score and no ranking.
      </p>

      <ComparePicker selected={selected} all={all} />

      {countries.length < 2 ? (
        <div className="max-w-3xl rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] p-4">
          <p className="text-lg leading-relaxed">
            Pick a second country to start the comparison. Every country in the benchmark is
            available, and all of them are measured against the same frame, so any pair is a fair
            reading.
          </p>
          <p className="mt-3 text-lg leading-relaxed text-[var(--muted)]">
            Browsing first is fine:{' '}
            <Link href={countriesHref} className="underline underline-offset-4">
              every country as a shape
            </Link>{' '}
            shows all {data.countries.length} at once, and a few pairs worth opening are{' '}
            <Link href={compareHref(['BRA', 'IDN'])} className="underline underline-offset-4">
              Brazil and Indonesia
            </Link>
            ,{' '}
            <Link href={compareHref(['KOR', 'ISR'])} className="underline underline-offset-4">
              South Korea and Israel
            </Link>{' '}
            and{' '}
            <Link
              href={compareHref(['ZAF', 'BRA', 'IND'])}
              className="underline underline-offset-4"
            >
              South Africa, Brazil and India
            </Link>
            .
          </p>
        </div>
      ) : (
        <CompareBoard countries={countries} />
      )}
    </>
  )
}
