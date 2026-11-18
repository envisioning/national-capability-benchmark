import type { Metadata } from 'next'
import { PressView } from '@/components/PressView'
import {
  PRESS_WORDS_PT_BR,
  brazilPressEntries,
  pressContactHref,
  pressCountryCount,
  pressRulesHref,
} from '@/lib/press'

export const metadata: Metadata = {
  title: 'Imprensa, NCB Brasil',
  description: 'Onde está cada número do NCB sobre o Brasil, como citar e com quem falar.',
}

/** The press page in Brazil's layer. See D193. */
export default function BrazilPressPage() {
  return (
    <PressView
      words={PRESS_WORDS_PT_BR}
      entries={brazilPressEntries()}
      countryCount={pressCountryCount}
      rulesHref={pressRulesHref}
      contactHref={pressContactHref}
    />
  )
}
