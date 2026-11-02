import Link from 'next/link'
import { CohortHistoryView } from '@/components/views/CohortHistoryView'
import { DefineLink, Empty, Headline, PageTitle, Section } from '@/components/ui'
import { MISSING_DATA_HINT, loadAllHistories, loadHistoryIndex } from '@/lib/data'
import { buildHistoryPage } from '@/lib/history'
import { decisionHref } from '@/lib/links'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'History by cohort, NCB',
  description:
    'How each capability moved since 2000 for every country and for cohorts of countries, with the fill error shown beside every change.',
}

/** How the holdout labels each fill method, in reading order. */
const FILL_LABELS: Record<string, string> = {
  interpolated: 'Drawn between two published values',
  carried: 'Carried forward, all ages',
  'carried:1-3': 'Carried forward 1 to 3 years',
  'carried:4-15': 'Carried forward 4 to 15 years',
  modelled: 'Modelled, all distances',
  'modelled:1-3': 'Modelled 1 to 3 years from a published value',
  'modelled:4-7': 'Modelled 4 to 7 years away',
  'modelled:8+': 'Modelled 8 or more years away',
  flat: 'Comparison: the nearest value held flat',
}

export default async function CountriesHistoryPage() {
  const [index, files] = await Promise.all([loadHistoryIndex(), loadAllHistories()])
  if (!index || files.length === 0) return <Empty hint={MISSING_DATA_HINT} />
  const data = buildHistoryPage(index, files)
  const order = Object.keys(FILL_LABELS)
  const validation = [...data.validation].sort(
    (a, b) => order.indexOf(a.fill) - order.indexOf(b.fill),
  )

  return (
    <>
      <PageTitle>History by cohort</PageTitle>
      <Headline>
        How each capability moved from {data.fromYear} to {data.toYear}, for groups of countries and
        for each of the {files.length}, on today&apos;s indicators and today&apos;s frame.
      </Headline>
      <p className="mb-10 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        This is a <DefineLink term="Reconstructed history">reconstructed history</DefineLink> and it
        is provisional. Most indicators start late or have gaps, so some past years are filled in,
        and the share filled is shown with every line. The dashed replay uses only the values that
        existed each year. The history never enters a score.{' '}
        <Link href={decisionHref('D174')} className="underline underline-offset-4">
          How it is built
        </Link>{' '}
        and{' '}
        <Link href={decisionHref('D178')} className="underline underline-offset-4">
          why it is published
        </Link>
        .
      </p>

      <Section
        title="Cohorts and countries"
        hint="Income groups are fixed by GDP per capita in 2000, so a country that grew richer stays in its starting group. A cohort's change is the median of its countries' own changes."
      >
        <CohortHistoryView data={data} />
      </Section>

      <Section
        title="How wrong the fill is"
        hint="Published values were hidden and filled again. The error of each method sets the width of every band on this page and on the country pages."
      >
        <div className="max-w-3xl overflow-x-auto">
          <table className="w-full text-xs tabular-nums">
            <thead className="text-left text-[var(--muted)]">
              <tr className="border-b border-[var(--rule)]">
                <th className="py-2 pr-4 font-normal">Method</th>
                <th className="py-2 pr-4 font-normal">Cells tested</th>
                <th className="py-2 pr-4 font-normal">Typical error, points</th>
                <th className="py-2 pr-4 font-normal">Bias, points</th>
              </tr>
            </thead>
            <tbody>
              {validation.map((row) => (
                <tr key={row.fill} className="border-b border-[var(--rule)]">
                  <td className="py-2 pr-4">{FILL_LABELS[row.fill] ?? row.fill}</td>
                  <td className="py-2 pr-4">{row.n}</td>
                  <td className="py-2 pr-4">{row.rmse.toFixed(1)}</td>
                  <td className="py-2 pr-4">{row.bias.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
          Typical error is the root mean square error on a 0 to 100 scale. The model is kept only
          while it beats the flat comparison.
        </p>
      </Section>
    </>
  )
}
