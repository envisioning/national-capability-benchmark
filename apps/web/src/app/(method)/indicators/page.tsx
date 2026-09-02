import type { Metadata } from 'next'
import Link from 'next/link'
import { INDICATORS, isScored } from '@ncb/core'
import { IndicatorRegistry } from '@/components/views/IndicatorRegistry'
import { Headline, PageTitle } from '@/components/ui'
import { exploreHref } from '@/lib/links'

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
        remain visible because they affect confidence and the collection agenda. The same registry
        is{' '}
        <Link href={exploreHref()} className="underline underline-offset-4">
          drawn as lanes
        </Link>
        .
      </Headline>
      <IndicatorRegistry />
    </>
  )
}
