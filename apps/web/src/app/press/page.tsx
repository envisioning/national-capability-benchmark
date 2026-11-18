import type { Metadata } from 'next'
import { PressView } from '@/components/PressView'
import { loadDiagnostics, loadIndex } from '@/lib/data'
import {
  PRESS_WORDS_EN,
  groundPressEntries,
  pressContactHref,
  pressCountryCount,
  pressRulesHref,
} from '@/lib/press'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'For the press, NCB',
  description: 'Where each NCB number lives, how to cite it and who to ask.',
}

/** The press page, in the ground layer. See D193. */
export default async function PressPage() {
  const [index, diagnostics] = await Promise.all([loadIndex(), loadDiagnostics()])
  return (
    <PressView
      words={PRESS_WORDS_EN}
      entries={groundPressEntries(index?.countries ?? [], diagnostics?.income ?? [])}
      countryCount={pressCountryCount}
      rulesHref={pressRulesHref}
      contactHref={pressContactHref}
    />
  )
}
