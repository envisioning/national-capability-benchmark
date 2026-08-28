import Link from 'next/link'
import { DIMENSIONS, DIMENSION_LABELS, DIMENSION_QUESTIONS } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { Eyebrow, Headline, PageTitle } from '@/components/ui'
import { capabilityHref } from '@/lib/links'

export const metadata = {
  title: 'Capabilities, NCB',
  description: 'The nine capability dimensions and the indicators behind them.',
}

export default function CapabilitiesPage() {
  return (
    <>
      <Eyebrow>Capabilities</Eyebrow>
      <PageTitle>Compare countries by capability</PageTitle>
      <Headline>Each capability has its own question, indicators and country comparison.</Headline>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DIMENSIONS.map((dimension) => (
          <Link
            key={dimension}
            href={capabilityHref(dimension)}
            className="group rounded-xl border border-[var(--rule)] p-5 transition-all duration-200 hover:border-[var(--foreground)]"
          >
            <div className="flex items-center gap-3">
              <Icon name={DIMENSION_ICON[dimension]} size={22} className="text-[var(--muted)]" />
              <h2 className="text-xl font-medium tracking-tight group-hover:underline">
                {DIMENSION_LABELS[dimension]}
              </h2>
            </div>
            <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
              {DIMENSION_QUESTIONS[dimension]}
            </p>
            <span className="mt-6 inline-block text-xs font-medium underline underline-offset-4">
              Open page
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
