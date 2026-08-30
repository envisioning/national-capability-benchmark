import type { Metadata } from 'next'
import { COUNTRY_NAMES, EN } from '@ncb/core'
import { InstitutionsView } from '@/components/views/InstitutionsView'
import { Empty, Eyebrow, Headline, Note, PageTitle } from '@/components/ui'
import { loadInstitutionNetwork } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ iso3: string }>
}): Promise<Metadata> {
  const { iso3 } = await params
  const name = COUNTRY_NAMES[iso3.toUpperCase()]
  return name ? { title: `${name} institutions, NCB` } : {}
}

export default async function CountryInstitutionsPage({
  params,
}: {
  params: Promise<{ iso3: string }>
}) {
  const { iso3: rawIso3 } = await params
  const iso3 = rawIso3.toUpperCase()
  const name = COUNTRY_NAMES[iso3]
  if (!name) return <Empty hint="This country is not in the benchmark." />

  const networkResult = await loadInstitutionNetwork(iso3)
  if (networkResult.error) {
    if (networkResult.error.kind === 'missing') {
      return <Empty hint={`We have not yet mapped this country's institutions.`} />
    }

    return (
      <>
        <Eyebrow>Institutional map of {name}</Eyebrow>
        <PageTitle>The institution map could not be loaded</PageTitle>
        <Headline>The institution network could not be loaded.</Headline>
        <Note tone="stop">{networkResult.error.message}</Note>
        <p className="max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          Fix the network file, then run <code>pnpm bench validate</code> before reloading this page.
        </p>
      </>
    )
  }
  const network = networkResult.network

  return (
    <>
      <Eyebrow>Institutional map of {name} · experimental version {network.version}</Eyebrow>
      <PageTitle>Institutions show how capability is organized</PageTitle>
      <Headline>
        Choose an institution to see what it does, who limits its power and which relationships its action depends on.
      </Headline>
      <p className="mb-12 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        {network.scope} The map explains functions and relationships. It does not measure performance or change NCB scores. There are {network.nodes.length} institutions and {network.edges.length} relationships, each with a source.
      </p>
      <InstitutionsView network={network} lex={EN} />
    </>
  )
}
