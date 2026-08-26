import { DiagnosticsView } from '@/components/views/DiagnosticsView'
import { Empty } from '@/components/ui'
import { MISSING_DATA_HINT, loadDiagnostics } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function DiagnosticsPage() {
  const diag = await loadDiagnostics()
  if (!diag) return <Empty hint={MISSING_DATA_HINT} />
  return <DiagnosticsView diag={diag} />
}
