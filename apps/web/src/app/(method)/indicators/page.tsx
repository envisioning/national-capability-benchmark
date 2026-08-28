import type { Metadata } from 'next'
import { INDICATORS, isScored } from '@ncb/core'
import { IndicatorRegistry } from '@/components/views/IndicatorRegistry'
import { Eyebrow, Headline, PageTitle } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Indicator registry, NCB',
  description:
    'The full indicator registry, with source, class, definition and data status.',
}

export default function IndicatorsPage() {
  const wired = INDICATORS.filter(isScored).length
  return (
    <>
      <Eyebrow>The registry</Eyebrow>
      <PageTitle>Every indicator stays on the record</PageTitle>
      <Headline>
        {INDICATORS.length} indicators are listed here. {wired} have data; gaps and retired rows
        stay visible because they lower confidence and set the collection agenda.
      </Headline>
      <IndicatorRegistry />
    </>
  )
}
