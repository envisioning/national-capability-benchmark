import type { Metadata } from 'next'
import { Empty, Eyebrow, Headline, PageTitle } from '@/components/ui'
import { ResidualView } from '@/components/views/ResidualView'
import { MISSING_DATA_HINT, loadResidual } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Wealth residual sandbox, NCB',
  description: 'Offline inspection of the provisional wealth-residual fixture.',
  robots: { index: false, follow: false },
}

export default async function ResidualSandboxPage() {
  const residual = await loadResidual()
  if (!residual) return <Empty hint={`${MISSING_DATA_HINT} Then run pnpm bench residual.`} />

  return (
    <>
      <Eyebrow>Provisional layer</Eyebrow>
      <PageTitle>Richer countries score higher, so this layer draws that line and removes it</PageTitle>
      <Headline>
        This sandbox fits each dimension against income per head and publishes how far every
        country sits from its own line. It never adds the nine distances together.
      </Headline>
      <ResidualView residual={residual} />
    </>
  )
}
