import type { Metadata } from 'next'
import { DECISIONS_DOC, docHref } from '@ncb/core'
import { Markdown } from '@/lib/markdown'
import { Empty, Eyebrow, Headline, PageTitle } from '@/components/ui'
import { ptDecisionsMarkdown } from '@/lib/pt-credibility'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Decisões, NCB',
  description: 'As escolhas por trás do benchmark, seus trade-offs e o que poderia derrubá-las.',
}

export default function PortugueseDecisionsPage() {
  const doc = ptDecisionsMarkdown()

  return (
    <div lang="pt-BR">
      <Eyebrow>Registro de decisões</Eyebrow>
      <PageTitle>Estas escolhas explicam como o benchmark funciona</PageTitle>
      <Headline>
        Cada entrada registra uma escolha, seus trade-offs e o que poderia derrubá-la. Os ids permanecem iguais ao documento fonte para manter a auditoria.
      </Headline>
      {doc ? <Markdown source={doc} /> : <Empty hint="O registro de decisões não está disponível nesta implantação." />}
      <p className="mt-12 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        Esta é a edição editorial em português de <a href={docHref(DECISIONS_DOC)} className="underline underline-offset-4">{DECISIONS_DOC}</a>. O documento fonte mantém o registro oficial e completo.
      </p>
    </div>
  )
}
