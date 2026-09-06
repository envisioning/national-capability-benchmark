import type { Metadata } from 'next'
import Link from 'next/link'
import { DIMENSIONS, DIMENSION_LABELS, confidenceBand, primaryMomentum } from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { CHART_INK, CHART_MOTION, CHART_STROKE } from '@/components/chartTokens'
import { CoverageMark } from '@/components/CoverageMark'
import { RecencyTick } from '@/components/RecencyTick'
import { FlagBubble } from '@/components/FlagBubble'
import { FlagField } from '@/components/FlagField'
import type { FlagFieldPoint } from '@/components/FlagField'
import { Radar } from '@/components/Radar'
import {
  Confidence,
  ConfidenceLegend,
  Delta,
  DimensionScore,
  Eyebrow,
  Headline,
  Note,
  PageTitle,
  Score,
  ScoreLegend,
  Section,
  Sparkline,
} from '@/components/ui'
import { loadCountry, loadIndex } from '@/lib/data'
import { decisionHref } from '@/lib/links'

/**
 * Every mark the viewer draws, on one page, at the size it is drawn.
 *
 * This is a workbench and not a reader surface. It is in no navigation and no
 * sitemap: it shows every mark side by side, including the states a reader
 * meets once a year, which is a page about the drawing rather than about the
 * benchmark.
 *
 * Everything on it is live. The weights come from the tokens and the charts
 * come from the current index, so a change to either shows up here without
 * anybody remembering to update a swatch. A mark drawn here and nowhere else
 * has no reason to exist: every specimen below ships on a real page.
 */

export const metadata: Metadata = {
  title: 'Marks, NCB',
  description: 'Every chart and mark the viewer draws, with the weights and shades behind them.',
  robots: { index: false, follow: false },
}

/** The country the specimens are drawn from. Any country in the frame would do. */
const SPECIMEN = 'BRA'
const SPECIMEN_DIMENSION: Dimension = 'anticipation'

function DecisionLink({ id }: { id: string }) {
  return (
    <Link className="hover:underline" href={decisionHref(id)}>
      {id}
    </Link>
  )
}

/** One specimen with its name, what it encodes and the decision behind it. */
function Specimen({
  name,
  encodes,
  decision,
  children,
}: {
  name: string
  encodes: string
  decision?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-[var(--rule)] p-4">
      <p className="text-xs font-medium">{name}</p>
      <p className="mt-1 text-xs text-[var(--muted)]">
        {encodes}
        {decision ? (
          <>
            {' '}
            <DecisionLink id={decision} />
          </>
        ) : null}
      </p>
      <div className="mt-4">{children}</div>
    </div>
  )
}

/* ---------------------------------------------------------------- tokens -- */

function StrokeScale() {
  return (
    <ul className="space-y-3">
      {Object.entries(CHART_STROKE).map(([name, width]) => (
        <li key={name} className="flex items-center gap-4">
          <span className="w-16 text-xs font-medium">{name}</span>
          <span className="w-10 text-xs tabular-nums text-[var(--muted)]">{width}</span>
          <svg width="220" height="8" aria-hidden="true" className="text-[var(--foreground)]">
            <line x1={0} y1={4} x2={220} y2={4} stroke="currentColor" strokeWidth={width} />
          </svg>
        </li>
      ))}
    </ul>
  )
}

function InkScale() {
  return (
    <ul className="space-y-3">
      {Object.entries(CHART_INK).map(([name, ink]) => (
        <li key={name} className="flex items-center gap-4">
          <span className="w-16 text-xs font-medium">{name}</span>
          <span className="w-10 text-xs tabular-nums text-[var(--muted)]">{ink}</span>
          <span
            className="block h-4 w-[220px] bg-[var(--foreground)]"
            style={{ opacity: ink }}
            aria-hidden="true"
          />
        </li>
      ))}
    </ul>
  )
}

/* --------------------------------------------------- the two count marks -- */

const COVERAGE_STATES: Array<{ observed: number; total: number; note: string }> = [
  { observed: 5, total: 7, note: 'scored, most rows observed' },
  { observed: 3, total: 7, note: 'scored, under half' },
  { observed: 1, total: 6, note: 'below the floor, no score published' },
  { observed: 4, total: 4, note: 'every row observed' },
]

const RECENCY_STATES: Array<{ year: number | null; note: string }> = [
  { year: 2024, note: 'current round' },
  { year: 2019, note: 'frozen when Doing Business stopped' },
  { year: 2011, note: 'the trust table, still the latest wave' },
  { year: null, note: 'declared gap, never observed' },
]

function StateTable({
  today,
  rows,
}: {
  today: string
  rows: Array<{ note: string; today: string; mark: React.ReactNode }>
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full max-w-3xl text-xs">
        <thead>
          <tr className="border-b border-[var(--rule)] text-left">
            <th className="py-2 pr-6 font-medium">State</th>
            <th className="py-2 pr-6 font-medium">{today}</th>
            <th className="py-2 font-medium">Now</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.note} className="border-b border-[var(--rule-soft)]">
              <td className="py-3 pr-6 text-[var(--muted)]">{row.note}</td>
              <td className="py-3 pr-6 tabular-nums text-[var(--muted)]">{row.today}</td>
              <td className="py-3">{row.mark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------ page -- */

export default async function ChartsPage() {
  const index = await loadIndex()
  const country = await loadCountry(SPECIMEN)
  const dimension = country?.dimensions[SPECIMEN_DIMENSION] ?? null

  const points: FlagFieldPoint[] =
    index?.countries.flatMap((c) => {
      const result = c.dimensions[SPECIMEN_DIMENSION]
      if (result?.score === null || result?.score === undefined) return []
      return [
        {
          key: c.iso3,
          iso3: c.iso3,
          label: c.country,
          value: result.score,
          confidence: result.confidence,
          detail: `${confidenceBand(result.confidence).label} evidence`,
          focal: c.iso3 === SPECIMEN,
        },
      ]
    }) ?? []

  const radarSeries = country
    ? [
        {
          label: country.country,
          iso3: country.iso3,
          values: DIMENSIONS.map((d) => country.dimensions[d]?.score ?? null),
          confidences: DIMENSIONS.map((d) => country.dimensions[d]?.confidence ?? null),
          color: 'var(--primary)',
        },
      ]
    : []

  const momentum = dimension ? primaryMomentum(dimension.momentum) : null

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Eyebrow>Workbench</Eyebrow>
      <PageTitle>Every mark the viewer draws</PageTitle>
      <Note>
        This page is not published. It is in no navigation and no sitemap, because it shows every
        mark beside every state it can take, which is a page about how the viewer draws rather than
        about what the benchmark found. Every specimen is drawn from the current index, so nothing
        here can go stale on its own.
      </Note>

      <Section
        title="Five weights and five shades, and every chart reads them"
        hint="A hairline is the frame and a heavy line is the data. Both scales come from the token file, so this page cannot disagree with the charts under it."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Specimen name="CHART_STROKE" encodes="Line weight, in chart units." decision="D103">
            <StrokeScale />
          </Specimen>
          <Specimen name="CHART_INK" encodes="How dark chart furniture sits against the page." decision="D103">
            <InkScale />
          </Specimen>
        </div>
        <p className="mt-4 text-xs text-[var(--muted)]">
          Motion is three speeds: {CHART_MOTION.travel} for a mark moving to a new score,{' '}
          {CHART_MOTION.fade} for one arriving or leaving, {CHART_MOTION.state} for the chart
          answering the pointer.
        </p>
      </Section>

      <Section
        title="What the viewer draws today"
        hint="Each specimen at the size it ships, with the decision that fixed its encoding."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Specimen
            name="Radar"
            encodes="Nine capabilities at once, with thin evidence as a dashed edge."
            decision="D53"
          >
            {radarSeries.length > 0 ? (
              <div className="max-w-sm">
                <Radar series={radarSeries} labels="full" interactive={false} />
              </div>
            ) : (
              <p className="text-xs text-[var(--muted)]">No index loaded.</p>
            )}
          </Specimen>

          <Specimen
            name="Radar, icon labels"
            encodes="The same shape small enough for a table cell or a card."
            decision="D53"
          >
            {radarSeries.length > 0 ? (
              <div className="w-28">
                <Radar series={radarSeries} labels="icons" interactive={false} />
              </div>
            ) : null}
          </Specimen>

          <Specimen
            name="FlagBubble"
            encodes="One country, with certainty as the ring and never as the flag."
            decision="D32"
          >
            <svg width="320" height="46" aria-hidden="true">
              {[
                { x: 24, confidence: 0.8, focal: false, active: false },
                { x: 84, confidence: 0.35, focal: false, active: false },
                { x: 144, confidence: 0.1, focal: false, active: false },
                { x: 204, confidence: 0.8, focal: true, active: false },
                { x: 264, confidence: 0.8, focal: false, active: true },
              ].map((state) => (
                <g key={state.x} transform={`translate(${state.x} 23)`}>
                  <FlagBubble
                    iso3={SPECIMEN}
                    confidence={state.confidence}
                    focal={state.focal}
                    active={state.active}
                  />
                </g>
              ))}
            </svg>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Good evidence, thin, very thin, the country being read, and the one under the pointer.
            </p>
          </Specimen>

          <Specimen
            name="Sparkline"
            encodes="The matched basket over time, on a fixed 0 to 100 axis."
            decision="D22"
          >
            {momentum && momentum.series.length > 1 ? (
              <Sparkline series={momentum.series} />
            ) : (
              <p className="text-xs text-[var(--muted)]">No momentum series for this dimension.</p>
            )}
          </Specimen>

          <Specimen name="Score and DimensionScore" encodes="A 0 to 100 position, banded." decision="D18">
            <div className="flex flex-wrap items-center gap-3">
              <Score value={72.4} size="md" />
              <Score value={41.9} size="md" />
              <Score value={null} size="md" />
              <DimensionScore dim={{ score: null, belowCoverageFloor: true, observedIndicators: 1 }} />
            </div>
            <div className="mt-4">
              <ScoreLegend />
            </div>
          </Specimen>

          <Specimen
            name="Confidence and Delta"
            encodes="Certainty, and change over the momentum span."
            decision="D98"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Confidence value={0.71} size="md" />
              <Confidence value={0.42} size="md" />
              <Confidence value={0.18} size="md" />
              <Confidence value={null} />
              <Delta value={2.4} />
              <Delta value={-1.1} />
              <Delta value={0} />
              <Delta value={null} />
            </div>
            <div className="mt-4">
              <ConfidenceLegend className="" />
            </div>
          </Specimen>
        </div>

        <div className="mt-4">
          <Specimen
            name="FlagField"
            encodes={`Every country on one 0 to 100 axis. Drawn here for ${DIMENSION_LABELS[SPECIMEN_DIMENSION]}.`}
            decision="D67"
          >
            {points.length > 0 ? (
              <FlagField points={points} />
            ) : (
              <p className="text-xs text-[var(--muted)]">No index loaded.</p>
            )}
          </Specimen>
        </div>
      </Section>

      <Section
        title="Coverage is a count, so it is drawn as a count"
        hint="A capability has about seven indicator rows, and how many were observed used to reach the reader as a two decimal ratio. One tick per row, filled where the row was observed, and the notch at the two rows a score needs."
      >
        <StateTable
          today="Was"
          rows={COVERAGE_STATES.map((state) => ({
            note: state.note,
            today:
              state.observed >= 2 ? (state.observed / state.total).toFixed(2) : 'not measured',
            mark: <CoverageMark observed={state.observed} total={state.total} />,
          }))}
        />
        <Headline>Where it is drawn</Headline>
        <p className="mt-2 max-w-3xl text-lg leading-relaxed">
          The coverage column on a country page and the observed column on a capability page. Both
          count against the rows a coverage figure is measured against, so a retired row is in
          neither. The count stays printed beside the mark, because the mark is a second encoding
          and never the only one.
        </p>
      </Section>

      <Section
        title="Recency is a year, so it is drawn as a year"
        hint="Recency is one of the three factors behind a confidence. The rail runs from 1990, the first year the ingest fetches, to this one. The tick is the observation and the quiet line trailing it is how long ago that was."
      >
        <StateTable
          today="Was"
          rows={RECENCY_STATES.map((state) => ({
            note: state.note,
            today: state.year === null ? 'no data' : String(state.year),
            mark: <RecencyTick year={state.year} />,
          }))}
        />
        <Headline>Where it is drawn</Headline>
        <p className="mt-2 max-w-3xl text-lg leading-relaxed">
          The year on every indicator record on a country page, and the latest year each publisher
          holds on the sources page. The indicator peek panel already draws a bar per row and a
          field above it, so a third mark there would crowd the reading rather than open it.
        </p>
      </Section>
    </main>
  )
}
