import type { Metadata } from 'next'
import { LIMITS_DOC, docHref } from '@ncb/core'
import { Markdown } from '@/lib/markdown'
import { Empty, Eyebrow, Headline, PageTitle } from '@/components/ui'
import { ptArtefactsMarkdown } from '@/lib/pt-credibility'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Limites conhecidos, NCB',
  description: 'Falhas de medição conhecidas, com evidências e possíveis correções.',
}

export default function PortugueseLimitsPage() {
  const doc = ptArtefactsMarkdown()

  return (
    <div lang="pt-BR">
      <Eyebrow>Leia antes de citar</Eyebrow>
      <PageTitle>Alguns números aqui podem estar errados</PageTitle>
      <Headline>
        Estes são erros de medição conhecidos, com evidências e possíveis correções. O pipeline funciona como foi projetado; o desenho às vezes está errado.
      </Headline>
      {doc ? <Markdown source={doc} /> : <Empty hint="O registro de limites não está disponível nesta implantação." />}
      <p className="mt-12 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        Esta é a edição editorial em português de <a href={docHref(LIMITS_DOC)} className="underline underline-offset-4">{LIMITS_DOC}</a>. O documento fonte mantém o registro oficial.
      </p>
    </div>
  )
}
