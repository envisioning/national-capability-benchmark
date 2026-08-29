import type { Metadata } from 'next'
import { Empty, Eyebrow, Headline, PageTitle } from '@/components/ui'
import { VelocityView } from '@/components/views/VelocityView'
import { MISSING_DATA_HINT, loadVelocity } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Velocity sandbox, NCB',
  description: 'Offline inspection of the provisional capability velocity fixture.',
  robots: { index: false, follow: false },
}

export default async function VelocitySandboxPage() {
  const velocity = await loadVelocity()
  if (!velocity) return <Empty hint={`${MISSING_DATA_HINT} Then run pnpm bench velocity.`} />

  return (
    <>
      <Eyebrow>Provisional layer</Eyebrow>
      <PageTitle>Velocity is an offline experiment</PageTitle>
      <Headline>
        This sandbox applies a placeholder rate to the foundation&apos;s existing momentum series so
        the method can be inspected before it earns a public surface.
      </Headline>
      <VelocityView velocity={velocity} />
    </>
  )
}
