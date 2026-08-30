import { countryFlag } from '@ncb/core'
import { evidenceOpenness } from '@/lib/evidence'

/**
 * One country as a mark on a chart: a flag inside a bubble.
 *
 * The bubble carries the certainty and the flag never does. Fading a flag to
 * show thin evidence makes a crowded chart look like a printing fault, and it
 * asks the reader to compare opacities across markers that sit on different
 * backgrounds. So the flag is always drawn at full strength and the ring around
 * it is what breaks: solid at usable evidence and above, dashed below, with the
 * gaps opening as confidence falls. Same rule and same ramp as the radar's
 * dashed edge, read from `evidenceOpenness`. See D32 and D53.
 *
 * The mark draws itself at the origin. Its position belongs to the caller,
 * which is what lets a chart animate a bubble from one score to another.
 */

/** Emoji faces, in the order the platforms actually ship them. */
const EMOJI_FONTS =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif'

export type FlagBubbleProps = {
  iso3: string
  /** Bubble radius in user units. The flag is sized from it. */
  r?: number
  /** Evidence confidence from 0 to 1. Null means the chart has none to show. */
  confidence?: number | null
  /** The country being read. Drawn with a lime ring. */
  focal?: boolean
  /** Pointed at right now. Drawn with a halo. */
  active?: boolean
}

export function FlagBubble({
  iso3,
  r = 15,
  confidence = null,
  focal = false,
  active = false,
}: FlagBubbleProps) {
  const flag = countryFlag(iso3)
  const open = evidenceOpenness(confidence)
  /* Dashes are spaced so a whole number of them fits the ring. A remainder
   * would leave one long dash at the top of every bubble, which reads as a
   * defect rather than as a measure. */
  const circumference = 2 * Math.PI * r
  const period = Math.max(4, r * 0.55) + open * r * 0.5
  const count = Math.max(6, Math.round(circumference / period))
  const unit = circumference / count
  const gap = unit * (0.18 + open * 0.42)
  const stroke = focal ? 'var(--primary)' : 'var(--rule)'

  /* Pointing at one mark never fades the others. A field of 52 flags read at
   * two strengths looks like a rendering fault, and the halo already says which
   * one is being read. */
  return (
    <g>
      {active ? (
        <circle r={r + 3} fill="none" stroke="var(--foreground)" strokeOpacity={0.18} strokeWidth={1.5} />
      ) : null}
      <circle r={r} fill="var(--surface)" />
      <circle
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth={focal ? 2 : 1.25}
        strokeOpacity={focal ? 1 : 0.9}
        strokeDasharray={open > 0 ? `${(unit - gap).toFixed(2)} ${gap.toFixed(2)}` : undefined}
        strokeLinecap="round"
      />
      {flag ? (
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={r * 1.15}
          aria-hidden="true"
          style={{ fontFamily: EMOJI_FONTS }}
        >
          {flag}
        </text>
      ) : (
        /* No flag for this code. The ISO3 keeps the mark identifiable. */
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={r * 0.62}
          fontWeight={500}
          fill="currentColor"
          aria-hidden="true"
        >
          {iso3}
        </text>
      )}
    </g>
  )
}

/**
 * What a solid ring and a broken ring mean. Printed under any chart drawn with
 * flag bubbles, because the ring is the only place the certainty is shown.
 */
export function FlagBubbleLegend({ note }: { note?: string }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--muted)]">
      <li className="inline-flex items-center gap-2">
        <svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden="true">
          <circle r={6.5} fill="none" stroke="var(--foreground)" strokeWidth={1.25} />
        </svg>
        <span>Solid ring: usable or good evidence</span>
      </li>
      <li className="inline-flex items-center gap-2">
        <svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden="true">
          <circle
            r={6.5}
            fill="none"
            stroke="var(--foreground)"
            strokeWidth={1.25}
            strokeDasharray="2.6 2.6"
            strokeLinecap="round"
          />
        </svg>
        <span>Broken ring: thin evidence, opening further as confidence falls</span>
      </li>
      <li>{note ?? 'The bubble sits at the score, because confidence never moves it.'}</li>
    </ul>
  )
}
