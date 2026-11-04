import Link from 'next/link'
import {
  DIMENSIONS,
  DIMENSION_LABELS,
  RAISE_BELOW,
  isThinEvidence,
  primaryMomentum,
  splitAgenda,
} from '@ncb/core'
import type { CountryAgenda, CountryResult, Dimension, DimensionResult } from '@ncb/core'
import { CapabilityLink } from '@/components/CapabilityLink'
import { ContestedBadge } from '@/components/ChallengeDialog'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { ConfidenceText, Delta, DefineLink, DimensionScore, Score } from '@/components/ui'
import { DimensionPeek } from '@/components/views/DimensionPeek'
import { agendaHref, scoreAnchorId } from '@/lib/links'
import { dimensionLabel, sentenceLabel } from '@/lib/labels'

const ROW_GRID =
  'lg:grid lg:grid-cols-[minmax(0,10rem)_minmax(6rem,1fr)_3.5rem_3.5rem_6.5rem_5rem] lg:items-center lg:gap-4'

/**
 * The top of a country page: one sentence, then all nine capabilities on one
 * axis, grouped the way the agenda groups them.
 *
 * It selects from the agenda and never calculates. Scores and confidence come
 * from the published files, the groups from `splitAgenda`, and the peer median
 * from `buildCapabilityMap`. A tick against a median places the country and
 * ranks nothing. A row links to its section on the same page. See D35, D38, D130
 * and D189.
 */
export function CountrySummary({
  country,
  agenda,
  peerMedians,
  peerCount,
  contestedCounts,
  frameSize,
}: {
  country: CountryResult
  agenda: CountryAgenda | null
  peerMedians: Partial<Record<Dimension, number>>
  peerCount: number
  contestedCounts: Record<string, number>
  frameSize: number
}) {
  const split = agenda ? splitAgenda(agenda) : null
  const groups: Array<{ label: string; dimensions: Dimension[] }> = split
    ? [
        { label: 'Raise, lowest first', dimensions: split.raise.map((d) => d.dimension) },
        {
          label: 'Measure before managing, thinnest first',
          dimensions: split.measure.map((d) => d.dimension),
        },
        { label: 'Keep watching, highest first', dimensions: split.hold.map((d) => d.dimension) },
      ]
    : [{ label: 'Capabilities', dimensions: [...DIMENSIONS] }]

  return (
    <div>
      {split ? <Sentence split={split} /> : null}

      <p className="mb-4 mt-5 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        A solid dot has usable or good evidence and a hollow dot has thin evidence.
        {peerCount > 0 ? ` The tick is the median of the ${peerCount} countries nearest in income.` : ''}{' '}
        A score is a position among the {frameSize} countries, not a percentage.
      </p>

      <div aria-hidden="true" className={`hidden pb-2 text-[10px] font-medium uppercase tracking-[0.05em] text-[var(--muted)] ${ROW_GRID}`}>
        <span>Capability</span>
        <span>0 to 100</span>
        <span className="text-right">Score</span>
        <span className="text-right">Peers</span>
        <span>Confidence</span>
        <span>Trend</span>
      </div>

      <div className="space-y-5">
        {groups
          .filter((g) => g.dimensions.length > 0)
          .map((g) => (
            <section key={g.label} aria-label={g.label}>
              <p className="border-b border-[var(--rule)] pb-2 text-xs font-medium uppercase tracking-[0.05em] text-[var(--muted)]">
                {g.label}
              </p>
              <ul>
                {g.dimensions.map((d) => {
                  const dim = country.dimensions[d]
                  return dim ? (
                    <Row
                      key={d}
                      dimension={d}
                      dim={dim}
                      iso3={country.iso3}
                      peer={peerMedians[d] ?? null}
                      contested={contestedCounts[`${country.iso3}|${d}`] ?? 0}
                    />
                  ) : null
                })}
              </ul>
            </section>
          ))}
      </div>

      {agenda ? (
        <p className="mt-5 text-xs leading-relaxed text-[var(--muted)]">
          These groups are the country&apos;s{' '}
          <DefineLink term="Capability agenda">capability agenda</DefineLink>, computed from the
          scores.{' '}
          <Link href={agendaHref(agenda.iso3)} className="font-medium underline underline-offset-4">
            Read the full agenda
          </Link>
          . It names comparable evidence from other countries and the {agenda.gapCount} gaps in the
          registry.
        </p>
      ) : null}
    </div>
  )
}

function Sentence({ split }: { split: ReturnType<typeof splitAgenda> }) {
  const strongest = split.hold[0]
  const lowest = split.raise[0]
  const thinnest = split.measure[0]
  const link = (d: Dimension) => (
    <CapabilityLink dimension={d} className="underline underline-offset-4">
      {dimensionLabel(d)}
    </CapabilityLink>
  )
  return (
    <p className="text-lg leading-relaxed">
      {strongest ? (
        <>
          Strongest usable evidence: {link(strongest.dimension)}, at{' '}
          <Score value={strongest.score} size="sm" />.{' '}
        </>
      ) : (
        <>No capability reaches {RAISE_BELOW} on usable evidence. </>
      )}
      {lowest ? (
        <>
          Raise {link(lowest.dimension)} first, at <Score value={lowest.score} size="sm" />.{' '}
        </>
      ) : null}
      {thinnest ? (
        <>
          {link(thinnest.dimension)} needs more evidence: confidence is{' '}
          <span className="tabular-nums">{thinnest.confidence.toFixed(2)}</span>.
        </>
      ) : null}
    </p>
  )
}

function Row({
  dimension,
  dim,
  iso3,
  peer,
  contested,
}: {
  dimension: Dimension
  dim: DimensionResult
  iso3: string
  peer: number | null
  contested: number
}) {
  const thin = isThinEvidence(dim.confidence)
  const trend = primaryMomentum(dim.momentum)
  const label = dimensionLabel(dimension)
  return (
    <li className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 border-b border-[var(--rule-soft)] py-2.5 text-xs ${ROW_GRID}`}>
      <a href={`#${dimension}`} className="inline-flex min-w-0 items-center gap-2 font-medium underline underline-offset-4">
        <Icon name={DIMENSION_ICON[dimension]} size={14} className="shrink-0 text-[var(--muted)]" />
        <span className="truncate">{label}</span>
      </a>

      <div className="col-span-2 row-start-2 lg:col-span-1 lg:col-start-2 lg:row-start-1">
        <Axis score={dim.belowCoverageFloor ? null : dim.score} peer={peer} thin={thin} label={label} />
      </div>

      <span
        id={scoreAnchorId(iso3, dimension)}
        className="col-start-2 row-start-1 inline-flex scroll-mt-20 items-center justify-end gap-2 lg:col-start-3"
      >
        <span id={`score-${dimension}`} aria-hidden="true" className="scroll-mt-20" />
        <DimensionPeek dimension={dimension} iso3={iso3}>
          <DimensionScore dim={dim} size="sm" thin={thin} />
        </DimensionPeek>
        <ContestedBadge count={contested} />
      </span>

      <div className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-1 lg:contents">
        <span className="tabular-nums text-[var(--muted)] lg:text-right">
          <span className="lg:hidden">Peers </span>
          {peer === null ? 'none' : peer.toFixed(1)}
        </span>
        <ConfidenceText value={dim.confidence} />
        <span className="inline-flex items-center gap-1">
          <Delta value={trend?.delta ?? null} />
          {/* A trend and a score sit on different baskets, so the basket size is printed. */}
          {trend ? <span className="text-[10px] text-[var(--muted)]">({trend.matchedIndicators})</span> : null}
        </span>
      </div>
    </li>
  )
}

/**
 * One country on the frame: the dot is the score and the tick is the peer
 * median. Both numbers are printed beside it, because the mark is a second
 * encoding and never the only one.
 */
function Axis({
  score,
  peer,
  thin,
  label,
}: {
  score: number | null
  peer: number | null
  thin: boolean
  label: string
}) {
  return (
    <div
      role="img"
      aria-label={`${label}: score ${score === null ? 'not measured' : score.toFixed(1)}, income peer median ${
        peer === null ? 'not available' : peer.toFixed(1)
      }${thin ? ', thin evidence' : ''}`}
      className="relative mx-1.5 h-4"
    >
      <span className="absolute inset-x-0 top-1/2 h-px bg-[var(--rule)]" />
      {peer === null ? null : (
        <span
          className="absolute top-0.5 h-3 w-px bg-[var(--foreground)] opacity-60"
          style={{ left: `${peer}%` }}
        />
      )}
      {score === null ? null : (
        <span
          className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--primary)] ${
            thin ? 'bg-[var(--background)]' : 'bg-[var(--primary)]'
          }`}
          style={{ left: `${score}%` }}
        />
      )}
    </div>
  )
}
