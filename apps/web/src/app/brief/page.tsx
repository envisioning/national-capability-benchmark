import type { Metadata } from 'next'
import { BriefDocument } from '@/components/BriefDocument'
import { loadBrief } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'The benchmark in two pages, NCB',
  description:
    'The claim the benchmark tests, what the current release reads, what the instrument is and what it needs, computed from the published files and set to print on two pages.',
}

/** The English brief, rendered from data/out/brief/brief.en.md. See D163. */
export default async function BriefPage() {
  const source = await loadBrief('en')
  return (
    <BriefDocument
      source={source}
      missing="The brief is not available in this deployment. Run pnpm bench brief in the repository root."
    />
  )
}
