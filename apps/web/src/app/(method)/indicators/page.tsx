import type { Metadata } from 'next'
import { INDICATORS, isScored } from '@ncb/core'
import { IndicatorRegistry } from '@/components/views/IndicatorRegistry'
import { Headline, PageTitle } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Indicator registry, NCB',
  description:
    'The full indicator registry, with source, class, definition and data status.',
}

export default function IndicatorsPage() {
  const wired = INDICATORS.filter(isScored).length
  return (
    <>
      <PageTitle>Every indicator the model asks for</PageTitle>
      <Headline>
        {INDICATORS.length} indicators are listed here. {wired} have data. Gaps and retired rows
        remain visible because they affect confidence and the collection agenda.
      </Headline>
      <IndicatorRegistry />
    </>
  )
}
