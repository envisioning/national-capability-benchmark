import type { Metadata } from 'next'
import { DiagnosticsView } from '@/components/views/DiagnosticsView'
import { Empty } from '@/components/ui'
import { MISSING_DATA_HINT, loadDiagnostics, loadFactorHistory } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Diagnostics, NCB',
  description:
    'Tests for income bias, one shared factor, redundant indicators, weak evidence and unstable scores.',
}

export default async function DiagnosticsPage() {
  const diag = await loadDiagnostics()
  if (!diag) return <Empty hint={MISSING_DATA_HINT} />
  const history = await loadFactorHistory()
  return <DiagnosticsView diag={diag} factorHistory={history?.releases ?? []} />
}
