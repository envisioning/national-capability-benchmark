import type { Metadata } from 'next'
import { PT_BR, localizeInstitutionNetworkPtBr } from '@ncb/core'
import { InstitutionsView } from '@/components/views/InstitutionsView'
import { Empty, Eyebrow, Headline, Highlight, Note, PageTitle } from '@/components/ui'
import { loadInstitutionNetwork } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Instituições brasileiras, NCB',
  description:
    'Um mapa das instituições que autorizam, financiam, regulam, controlam, aprendem e entregam políticas públicas no Brasil.',
}

export default async function BrazilInstitutionsPage() {
  const networkResult = await loadInstitutionNetwork('BRA')
  if (networkResult.error) {
    if (networkResult.error.kind === 'missing') {
      return <Empty hint="A rede institucional ainda não foi gerada." />
    }

    return (
      <>
        <Eyebrow>Mapa institucional do Brasil</Eyebrow>
        <PageTitle>O mapa institucional não pôde ser carregado</PageTitle>
        <Headline>A rede institucional não pôde ser carregada.</Headline>
        <Note tone="stop">{networkResult.error.message}</Note>
        <p className="max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          Corrija o arquivo da rede e rode <code>pnpm bench validate</code> antes de recarregar a página.
        </p>
      </>
    )
  }
  const raw = networkResult.network
  const network = localizeInstitutionNetworkPtBr(raw)

  return (
    <>
      <Eyebrow>Mapa institucional do Brasil · versão experimental {network.version}</Eyebrow>
      <PageTitle>Nenhum organograma explica sozinho como o Brasil funciona</PageTitle>
      <Headline>
        Escolha uma instituição para ver o que ela faz, quem limita seu poder e de quais{' '}
        <Highlight>relações</Highlight> sua atuação depende.
      </Headline>
      <p className="mb-12 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        {network.scope} O mapa explica funções e vínculos. Ele não mede desempenho e não altera as
        notas do NCB. São {network.nodes.length} instituições e {network.edges.length} relações, e
        cada uma delas tem uma fonte.
      </p>

      <InstitutionsView network={network} lex={PT_BR} />
    </>
  )
}
