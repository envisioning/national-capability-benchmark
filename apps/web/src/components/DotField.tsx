/**
 * The Envisioning dot motif, drawn flat.
 *
 * The parent brand keeps this in `lib/design/dot-motif.ts`: a small opaque
 * centre inside a larger translucent bubble, radar-inspired, used behind heroes
 * and CTA panels. This viewer draws one still frame of it rather than the
 * canvas animation, because a research surface does not need a background that
 * moves, and a still SVG costs no JavaScript.
 *
 * The geometry is the parent's, not ours: 36px spacing, a fixed 1.5px centre,
 * and a bubble from 2.5px to 10px. The bubble size follows the same diagonal
 * phase the animated grid breathes on, frozen at one moment, so this reads as
 * the same motif standing still.
 *
 * The alphas are ours. The parent draws this over its own surfaces at
 * `AMBIENT_OUTER_ALPHA` 0.15 with an opaque centre, and on this band that
 * centre is a pure white pinprick every 36px: a texture loud enough to read as
 * content in a band whose job is to carry one sentence. Both are pulled down
 * until the motif is felt rather than seen. See D81.
 *
 * It is atmosphere and never data. Every real distribution on this site is a
 * `FlagField`, where a bubble means confidence and a position means a score.
 */

const SPACING = 36
const INNER_RADIUS = 1.5
const BUBBLE_MIN = 2.5
const BUBBLE_MAX = 10
/* Atmosphere, not texture. The centre is the brighter of the two and carries
   the motif; the bubble is barely there. */
const AMBIENT_ALPHA = 0.05
const CENTRE_ALPHA = 0.22
/* The parent's PHASE_STEP: the phase each step along a diagonal advances by. */
const PHASE_STEP = 0.55

/* One tile, repeated. Wide and shallow so the diagonal never lines up with
   itself inside a band a reader can see all of at once. */
const TILE_COLS = 10
const TILE_ROWS = 4

type Dot = { x: number; y: number; bubble: number }

function tile(): Dot[] {
  const dots: Dot[] = []
  for (let row = 0; row < TILE_ROWS; row += 1) {
    for (let col = 0; col < TILE_COLS; col += 1) {
      const intensity = 0.5 + 0.5 * Math.sin((col + row) * PHASE_STEP)
      dots.push({
        x: col * SPACING + SPACING / 2,
        y: row * SPACING + SPACING / 2,
        bubble: BUBBLE_MIN + (BUBBLE_MAX - BUBBLE_MIN) * intensity,
      })
    }
  }
  return dots
}

/**
 * @param id A document-unique id for the pattern. Two fields on one page with
 *   the same id would resolve to whichever rendered first.
 */
export function DotField({ id = 'dot-field', className = '' }: { id?: string; className?: string }) {
  const dots = tile()
  return (
    <svg
      aria-hidden
      focusable="false"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`.trim()}
    >
      <defs>
        <pattern
          id={id}
          width={TILE_COLS * SPACING}
          height={TILE_ROWS * SPACING}
          patternUnits="userSpaceOnUse"
        >
          {dots.map((dot) => (
            <g key={`${dot.x}-${dot.y}`} fill="currentColor">
              <circle cx={dot.x} cy={dot.y} r={dot.bubble} opacity={AMBIENT_ALPHA} />
              <circle cx={dot.x} cy={dot.y} r={INNER_RADIUS} opacity={CENTRE_ALPHA} />
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
