import { EN, indicatorName, unitName } from '@ncb/core'
import type { GapExplanation } from '@ncb/core'
import { conditionValue } from '@/components/views/ConditionList'

/**
 * How a gap is built, row by row: the walk from the peers' median score to the
 * country's score. Each row of the score moves the total by its share of the
 * gap, so the bar a row draws is the number `explainGap` stored. The peers'
 * median score is not the mean of their row medians, so what the rows do not
 * account for is drawn as its own bar and named, never hidden. See D197.
 */

const signed = (n: number): string => `${n > 0 ? '+' : ''}${n.toFixed(1)}`
const pct = (v: number): string => `${Math.min(100, Math.max(0, v))}%`

type Step = { key: string; label: string; detail?: string; from: number; to: number; kind: 'row' | 'rest' }

export function gapSteps(gap: GapExplanation, countryName: string): {
  steps: Step[]
  start: { label: string; value: number }
  end: { label: string; value: number }
} {
  let at = gap.peerMedian
  const steps: Step[] = gap.drivers.map((d) => {
    const from = at
    at += d.contribution
    return {
      key: d.indicatorId,
      label: indicatorName(EN, d.indicatorId),
      ...(d.value === null
        ? {}
        : { detail: `${conditionValue(d.value)} ${unitName(EN, d.unit)}${d.year ? ` (${d.year})` : ''}` }),
      from,
      to: at,
      kind: 'row' as const,
    }
  })
  const rest = Math.round((gap.score - at) * 10) / 10
  if (Math.abs(rest) >= 0.1) {
    steps.push({ key: 'rest', label: 'Not split by row', detail: "the peers' median score differs from their row medians", from: at, to: gap.score, kind: 'rest' })
  }
  return {
    steps,
    start: { label: `Median of its ${gap.peersScored} income peers`, value: gap.peerMedian },
    end: { label: `${countryName}'s score`, value: gap.score },
  }
}

function Row({ label, detail, children, value, strong = false }: { label: string; detail?: string | undefined; children: React.ReactNode; value: string; strong?: boolean }) {
  return (
    <li className="grid grid-cols-[1fr_4rem] items-center gap-x-4 gap-y-1 sm:grid-cols-[minmax(0,15rem)_1fr_4rem]">
      <span className="col-span-2 sm:col-span-1">
        <span className={`block text-xs ${strong ? 'font-semibold' : 'font-medium'}`}>{label}</span>
        {detail ? <span className="block text-xs text-[var(--muted)]">{detail}</span> : null}
      </span>
      <span className="relative block h-6 rounded-sm bg-[var(--surface-sunken)]">{children}</span>
      <span className={`text-right text-xs tabular-nums ${strong ? 'font-semibold' : 'font-medium'}`}>{value}</span>
    </li>
  )
}

/** A tick across the track at one value: where the walk starts or ends. */
function Tick({ at, strong = false }: { at: number; strong?: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute -top-1 -bottom-1 ${strong ? 'w-1' : 'w-0.5'} -translate-x-1/2 rounded-full bg-[var(--foreground)]`}
      style={{ left: pct(at) }}
    />
  )
}

export function GapWaterfall({ gap, countryName }: { gap: GapExplanation; countryName: string }) {
  const { steps, start, end } = gapSteps(gap, countryName)
  return (
    <figure className="max-w-4xl">
      <ol className="space-y-3" aria-label={`From ${start.label.toLowerCase()} to ${end.label}, row by row`}>
        <Row label={start.label} value={start.value.toFixed(1)}>
          <Tick at={start.value} />
        </Row>
        {steps.map((s) => {
          const left = Math.min(s.from, s.to)
          const width = Math.max(Math.abs(s.to - s.from), 0.4)
          const up = s.to >= s.from
          const fill =
            s.kind === 'rest'
              ? 'border border-dashed border-[var(--muted)]'
              : up
                ? 'bg-[var(--foreground)]'
                : 'border-2 border-[var(--foreground)] bg-[var(--background)]'
          return (
            <Row key={s.key} label={s.label} detail={s.detail} value={signed(s.to - s.from)}>
              <span aria-hidden className="absolute inset-y-0 border-l border-dotted border-[var(--rule)]" style={{ left: pct(s.from) }} />
              <span aria-hidden className={`absolute inset-y-1 rounded-sm ${fill}`} style={{ left: pct(left), width: pct(width) }} />
            </Row>
          )
        })}
        <Row label={end.label} value={end.value.toFixed(1)} strong>
          <span aria-hidden className="absolute inset-y-0 border-l border-dotted border-[var(--rule)]" style={{ left: pct(start.value) }} />
          <Tick at={end.value} strong />
        </Row>
      </ol>
      <figcaption className="mt-3 text-xs text-[var(--muted)]">
        Each bar is one row of the score: how far it moves the score from the peers&apos; median, on the 0 to 100 scale. A filled bar adds, an open bar takes away.
      </figcaption>
    </figure>
  )
}
