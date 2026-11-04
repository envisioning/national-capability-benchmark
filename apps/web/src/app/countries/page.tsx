import { COUNTRY_INCOME_GROUPS, COUNTRY_REGIONS, DIMENSIONS } from '@ncb/core'
import { CountryFinder, type FinderCountry, type FinderState } from '@/components/views/CountryFinder'
import { Empty, FrameNote, Headline, PageTitle } from '@/components/ui'
import { MISSING_DATA_HINT, loadIndex } from '@/lib/data'
import { toProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Countries, NCB',
  description:
    'Nine-dimension profiles for every country in the benchmark, with the confidence behind each score.',
}

const one = (value: string | string[] | undefined): string =>
  typeof value === 'string' ? value : ''

/** What the address asks for, with anything unknown dropped. */
function readState(params: Record<string, string | string[] | undefined>): FinderState {
  const region = one(params.region)
  const income = one(params.income)
  return {
    q: one(params.q).slice(0, 60),
    region: region in COUNTRY_REGIONS ? (region as FinderState['region']) : '',
    income: income in COUNTRY_INCOME_GROUPS ? (income as FinderState['income']) : '',
    view: one(params.view) === 'shapes' ? 'shapes' : 'table',
    measure: one(params.show) === 'confidence' ? 'confidence' : 'score',
  }
}

export default async function CountriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [data, params] = await Promise.all([loadIndex(), searchParams])
  if (!data || data.countries.length === 0) return <Empty hint={MISSING_DATA_HINT} />

  const countries: FinderCountry[] = [...data.countries]
    .sort((a, b) => a.country.localeCompare(b.country))
    .map((c) => ({
      ...toProfile(c),
      floors: DIMENSIONS.map((d) => c.dimensions[d]?.belowCoverageFloor ?? false),
      observed: DIMENSIONS.map((d) => c.dimensions[d]?.observedIndicators ?? 0),
    }))

  return (
    <>
      <PageTitle>Countries</PageTitle>
      <Headline>
        Nine capability scores for each of {countries.length} countries, with no overall score. Two
        countries can share an average and differ on every capability.
      </Headline>
      <CountryFinder countries={countries} initial={readState(params)} />
      <FrameNote />
    </>
  )
}
