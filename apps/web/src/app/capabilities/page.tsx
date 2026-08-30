import Link from 'next/link'
import { DIMENSIONS, DIMENSION_LABELS, DIMENSION_QUESTIONS, contestedDisputeCounts } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { ScoreTable } from '@/components/views/ScoreTables'
import { Empty, FrameNote, Headline, PageTitle, ScoreLegend, Section } from '@/components/ui'
import { MISSING_DATA_HINT, loadDisputes, loadIndex } from '@/lib/data'
import { capabilityHref } from '@/lib/links'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Capabilities, NCB',
  description: 'The nine capability dimensions, the indicators behind them and every country score.',
}

export default async function CapabilitiesPage() {
  const [data, disputes] = await Promise.all([loadIndex(), loadDisputes()])
  /* Alphabetical, like every other list of countries here. The table sorts on
   * click, so a reader who wants a ranking asks for one. */
  const countries = data
    ? [...data.countries].sort((a, b) => a.country.localeCompare(b.country))
    : []
  const contestedCounts = contestedDisputeCounts(disputes)

  return (
    <>
      <PageTitle>Compare countries by capability</PageTitle>
      <Headline>Each capability has its own question, indicators and country comparison.</Headline>

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

      <Section
        title="The same scores as a table"
        hint="Every country on every capability, in one grid. Click any heading to sort."
      >
        {countries.length === 0 ? (
          <Empty hint={MISSING_DATA_HINT} />
        ) : (
          <>
            <ScoreLegend />
            <ScoreTable countries={countries} contestedCounts={contestedCounts} />
            <FrameNote />
          </>
        )}
      </Section>
    </>
  )
}
