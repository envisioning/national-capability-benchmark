import { dimensionLabel } from '@/lib/labels'
import Link from 'next/link'
import { DIMENSIONS, DIMENSION_LABELS, DIMENSION_QUESTIONS, contestedDisputeCounts } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { Headline, PageTitle } from '@/components/ui'
import { capabilityHref, countriesHref } from '@/lib/links'

export const metadata = {
  title: 'Capabilities, NCB',
  description: 'The nine capability dimensions, the indicators behind them and every country score.',
}

export default function CapabilitiesPage() {
  return (
    <>
      <PageTitle>Capabilities</PageTitle>
      <Headline>
        Each capability has a question, a set of indicators, and a comparison across countries.
      </Headline>

      <div className="mb-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DIMENSIONS.map((dimension) => (
          <Link
            key={dimension}
            href={capabilityHref(dimension)}
            className="group rounded-xl border border-[var(--rule)] p-5 transition-all duration-200 hover:border-[var(--foreground)]"
          >
            <div className="flex items-center gap-3">
              <Icon name={DIMENSION_ICON[dimension]} size={22} className="text-[var(--muted)]" />
              <h2 className="text-xl font-medium tracking-tight group-hover:underline">
                {dimensionLabel(dimension)}
              </h2>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
              {DIMENSION_QUESTIONS[dimension]}
            </p>
          </Link>
        ))}
      </div>

      <p className="text-xs text-[var(--muted)]">
        All nine for every country, side by side, are on{' '}
        <Link href={countriesHref} className="underline underline-offset-4">
          Countries
        </Link>
        .
      </p>
    </>
  )
}
