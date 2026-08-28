import type { Metadata } from 'next'
import { localizeInstitutionNetworkPtBr } from '@ncb/core'
import { InstitutionsView } from '@/components/views/InstitutionsView'
import { Empty, Eyebrow, Headline, Highlight, PageTitle } from '@/components/ui'
import { loadInstitutionNetwork } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Instituições brasileiras, NCB',
  description:
    'Um mapa das instituições que autorizam, financiam, regulam, controlam, aprendem e entregam políticas públicas no Brasil.',
}

export default async function BrazilianInstitutionsPage() {
  const raw = await loadInstitutionNetwork('BRA')
  if (!raw) {
    return <Empty hint="A rede institucional ainda não foi gerada." />
  }
  const network = localizeInstitutionNetworkPtBr(raw)

  return (
    <>
      <Eyebrow>
        Mapa institucional do Brasil · versão experimental {network.version}
      </Eyebrow>
      <PageTitle>Nenhum organograma explica sozinho como o Brasil funciona</PageTitle>
      <Headline>
        Escolha uma instituição para ver o que ela faz, quem limita seu poder e de quais{' '}
        <Highlight>relações</Highlight> sua atuação depende.
      </Headline>
      <p className="mb-12 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        {network.scope} O mapa explica funções e vínculos. Ele não mede desempenho e não altera as
        notas do NCB.
      </p>

      <InstitutionsView network={network} />
    </>
  )
}
