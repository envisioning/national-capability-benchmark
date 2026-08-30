import type { Metadata } from 'next'
import { Empty, Headline, PageTitle } from '@/components/ui'
import { LeverageView } from '@/components/views/LeverageView'
import { MISSING_DATA_HINT, loadLeverage } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Leverage sandbox, NCB',
  description: 'Offline inspection of the provisional exponential leverage fixture.',
  robots: { index: false, follow: false },
}

export default async function LeverageSandboxPage() {
  const leverage = await loadLeverage()
  if (!leverage) return <Empty hint={`${MISSING_DATA_HINT} Then run pnpm bench leverage.`} />

  return (
    <>
      <PageTitle>Leverage is an offline experiment</PageTitle>
      <Headline>
        This sandbox applies a placeholder weighted sum to six transparent public-data proxies and
        keeps five future sources visibly null.
      </Headline>
      <LeverageView leverage={leverage} />
    </>
  )
}
