import type { Metadata } from 'next'
import { BriefDocument } from '@/components/BriefDocument'
import { loadBrief } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'O NCB em duas páginas, NCB Brasil',
  description:
    'A tese que o NCB testa, o que a versão atual dos dados lê, o que o instrumento é e do que precisa, calculado a partir dos arquivos publicados e pronto para imprimir em duas páginas.',
}

/** The Portuguese brief, rendered from data/out/brief/brief.pt-BR.md. See D163. */
export default async function BrazilBriefPage() {
  const source = await loadBrief('pt-BR')
  return (
    <BriefDocument
      source={source}
      missing="O resumo não está disponível nesta publicação. Rode pnpm bench brief na raiz do repositório."
    />
  )
}
