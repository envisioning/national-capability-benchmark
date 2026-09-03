'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * The Envisioning dot motif, breathing.
 *
 * The parent brand keeps this in `lib/design/dot-motif.ts` and draws it with
 * `home-commit-wave-grid.tsx`: a small opaque centre inside a larger
 * translucent bubble, radar-inspired, used behind heroes and CTA panels, with
 * the bubble breathing along a diagonal phase. This viewer draws the same
 * motion at the parent's cycle, and it draws it behind `prefers-reduced-motion`:
 * a reader who has asked for no motion gets one still frame as an SVG pattern,
 * which is also what the server renders and what a reader sees before any
 * script runs. The canvas takes over only when motion is allowed and the band
 * is on screen, and its first frame is the still frame, so nothing jumps. See
 * D112, which supersedes the still-only clause of D81.
 *
 * The geometry is the parent's, not ours: 36px spacing, a fixed 1.5px centre,
 * a bubble from 2.5px to 10px, and a 3200ms breath.
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
/* The parent's PHASE_STEP and BREATHE_CYCLE_MS: the phase each step along a
   diagonal advances by, and how long one breath takes. */
const PHASE_STEP = 0.55
const BREATHE_CYCLE_MS = 3200

/* One tile, repeated. Wide and shallow so the diagonal never lines up with
   itself inside a band a reader can see all of at once. The canvas reads the
   same tiled phase, so its first frame is the still frame. */
const TILE_COLS = 10
const TILE_ROWS = 4

/** The phase of one cell. Identical for the still pattern and the canvas. */
function phaseAt(col: number, row: number): number {
  return ((col % TILE_COLS) + (row % TILE_ROWS)) * PHASE_STEP
}

/**
 * The bubble radius at one phase, at one moment in the breath.
 *
 * Rounded to a thousandth of a pixel, because Node and the browser compute a
 * sine one ulp apart and the still frame is server rendered: an unrounded
 * radius hydrates as a mismatch on every circle.
 */
function bubbleAt(phase: number, t: number): number {
  const intensity = 0.5 + 0.5 * Math.sin(t + phase)
  return Math.round((BUBBLE_MIN + (BUBBLE_MAX - BUBBLE_MIN) * intensity) * 1000) / 1000
}

type Dot = { x: number; y: number; bubble: number }

function tile(): Dot[] {
  const dots: Dot[] = []
  for (let row = 0; row < TILE_ROWS; row += 1) {
    for (let col = 0; col < TILE_COLS; col += 1) {
      dots.push({
        x: col * SPACING + SPACING / 2,
        y: row * SPACING + SPACING / 2,
        bubble: bubbleAt(phaseAt(col, row), 0),
      })
    }
  }
  return dots
}

/** The colour the SVG draws with, read once so the canvas cannot drift from it. */
function inkOf(el: Element): { r: number; g: number; b: number } {
  const match = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(el).color)
  if (!match) return { r: 255, g: 255, b: 255 }
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) }
}

/**
 * Whether the reader allows motion. Null until the client knows, which is the
 * server's answer too, so the still frame is what renders first everywhere.
 */
function useMotionAllowed(): boolean | null {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const read = () => setAllowed(!media.matches)
    read()
    media.addEventListener('change', read)
    return () => media.removeEventListener('change', read)
  }, [])
  return allowed
}

/**
 * The breathing frame, on a canvas over the still pattern.
 *
 * It draws only while the band is on screen and the tab is visible, and it
 * measures its own box so the grid stays on the same 36px lattice the pattern
 * uses. Time starts at mount, so the first frame is the still frame.
 */
function Breath() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const ctx = el.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let ink = inkOf(el)
    let frame: number | null = null
    let visible = true
    let onScreen = true
    const start = performance.now()

    const resize = () => {
      const rect = el.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      const dpr = window.devicePixelRatio || 1
      el.width = Math.round(width * dpr)
      el.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ink = inkOf(el)
    }

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height)
      const t = ((now - start) / BREATHE_CYCLE_MS) * Math.PI * 2
      const cols = Math.ceil(width / SPACING)
      const rows = Math.ceil(height / SPACING)
      const bubble = `rgba(${ink.r},${ink.g},${ink.b},${AMBIENT_ALPHA})`
      const centre = `rgba(${ink.r},${ink.g},${ink.b},${CENTRE_ALPHA})`
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const x = col * SPACING + SPACING / 2
          const y = row * SPACING + SPACING / 2
          ctx.fillStyle = bubble
          ctx.beginPath()
          ctx.arc(x, y, bubbleAt(phaseAt(col, row), t), 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = centre
          ctx.beginPath()
          ctx.arc(x, y, INNER_RADIUS, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const loop = (now: number) => {
      frame = null
      if (!visible || !onScreen) return
      draw(now)
      frame = requestAnimationFrame(loop)
    }
    const run = () => {
      if (frame === null && visible && onScreen) frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      if (frame !== null) cancelAnimationFrame(frame)
      frame = null
    }

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      visible ? run() : stop()
    }
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver((entries) => {
            onScreen = entries.some((entry) => entry.isIntersecting)
            onScreen ? run() : stop()
          })
    const sizer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)

    resize()
    draw(start)
    run()
    observer?.observe(el)
    sizer?.observe(el)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      observer?.disconnect()
      sizer?.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}

/**
 * @param id A document-unique id for the pattern. Two fields on one page with
 *   the same id would resolve to whichever rendered first.
 */
export function DotField({ id = 'dot-field', className = '' }: { id?: string; className?: string }) {
  const dots = tile()
  const motion = useMotionAllowed()
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}
    >
      {motion ? (
        <Breath />
      ) : (
        <svg focusable="false" className="absolute inset-0 h-full w-full">
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
      )}
    </div>
  )
}
