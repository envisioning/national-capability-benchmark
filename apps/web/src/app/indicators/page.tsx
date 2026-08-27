import type { Metadata } from 'next'
import { INDICATORS, isScored } from '@ncb/core'
import { IndicatorRegistry } from '@/components/views/IndicatorRegistry'
import { Eyebrow, Headline, PageTitle } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Indicator registry, NCB',
  description:
    'Every indicator the model asks for: observed, declared gap, or retired, with source, class and definition.',
}

export default function IndicatorsPage() {
  const wired = INDICATORS.filter(isScored).length
  return (
    <>
      <Eyebrow>The registry</Eyebrow>
      <PageTitle>Every indicator stays on the record</PageTitle>
      <Headline>
        {INDICATORS.length} indicators, of which {wired} carry data today. The rest are declared
        gaps or rejected datasets, kept visible because they lower confidence and form the
        collection agenda.
      </Headline>
      <IndicatorRegistry />
    </>
  )
}
