import type { Metadata } from 'next'
import { DiagnosticsView } from '@/components/views/DiagnosticsView'
import { Empty } from '@/components/ui'
import { MISSING_DATA_HINT, loadDiagnostics } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Diagnostics, NCB',
  description:
    'The model tested against its own failure modes: wealth correlation, redundancy, dimension collapse, clamping, and measurement quality.',
}

export default async function DiagnosticsPage() {
  const diag = await loadDiagnostics()
  if (!diag) return <Empty hint={MISSING_DATA_HINT} />
  return <DiagnosticsView diag={diag} />
}
