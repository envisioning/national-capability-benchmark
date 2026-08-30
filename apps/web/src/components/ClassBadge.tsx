'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { MeasurementClass } from '@ncb/core'
import { MEASUREMENT_CLASS_LABELS, MEASUREMENT_CLASS_MEANING } from '@ncb/core'
import { CLASS_ICON, Icon } from '@/components/Icon'

type Point = { left: number; top: number; above: boolean }

const MARGIN = 8
const WIDTH = 260
/** Enough of a guess to choose a side. The transform does the exact work. */
const HEIGHT_GUESS = 150

/**
 * Centre the card over the badge, pull it back inside the viewport, and flip it
 * above the badge when the bottom of the window is closer than the card is tall.
 * Flipping uses a transform rather than a measured height, so the card is placed
 * before it has ever been drawn.
 */
function place(rect: DOMRect): Point {
  const left = Math.min(
    Math.max(MARGIN, rect.left + rect.width / 2 - WIDTH / 2),
    Math.max(MARGIN, window.innerWidth - WIDTH - MARGIN),
  )
  const above = window.innerHeight - rect.bottom < HEIGHT_GUESS
  return { left, top: above ? rect.top - 6 : rect.bottom + 6, above }
}

/**
 * The measurement class of an indicator: an icon and a letter together.
 *
 * The icon is the same everywhere that class appears, so it becomes learnable.
 * The letter is monospaced and holds one character of width, from Tailwind's own
 * `font-mono` default rather than a brand token, so the four badges are the same
 * size and a column of them lines up.
 *
 * Pointing at one reads it out in full. The card renders through a portal
 * because a table scrolls horizontally, and an absolutely positioned card
 * inside that scroller is clipped by it. A native `title` would escape the
 * clip, but it waits a second, styles itself and never appears on a touch
 * screen. The full label also ships as screen-reader text, so the meaning does
 * not depend on a pointer.
 */
export function ClassBadge({ value }: { value: MeasurementClass }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [point, setPoint] = useState<Point | null>(null)
  const meaning = MEASUREMENT_CLASS_MEANING[value]

  const show = useCallback(() => {
    const el = ref.current
    if (el) setPoint(place(el.getBoundingClientRect()))
  }, [])
  const hide = useCallback(() => setPoint(null), [])

  useEffect(() => {
    if (!point) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide()
    }
    window.addEventListener('scroll', show, true)
    window.addEventListener('resize', show)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('scroll', show, true)
      window.removeEventListener('resize', show)
      window.removeEventListener('keydown', onKey)
    }
  }, [point, show, hide])

  return (
    <>
      <span
        ref={ref}
        onPointerEnter={show}
        onPointerLeave={hide}
        onClick={() => (point ? hide() : show())}
        className="inline-flex cursor-help items-center gap-1 rounded-md border border-[var(--rule)] px-1.5 py-0.5 text-xs font-medium"
      >
        <Icon name={CLASS_ICON[value]} size={12} />
        <span aria-hidden="true" className="w-[1ch] text-center font-mono">
          {value}
        </span>
        <span className="sr-only">{MEASUREMENT_CLASS_LABELS[value]}</span>
      </span>
      {point
        ? createPortal(
            <span
              aria-hidden="true"
              style={{
                left: point.left,
                top: point.top,
                width: WIDTH,
                transform: point.above ? 'translateY(-100%)' : undefined,
              }}
              className="pointer-events-none fixed z-50 block rounded-lg border border-[var(--rule)] bg-[var(--surface)] px-3 py-2 text-xs leading-relaxed"
            >
              <span className="block font-medium">
                {value}, {MEASUREMENT_CLASS_LABELS[value]}
              </span>
              <span className="mt-1 block text-[var(--muted)]">{meaning.plain}</span>
              <span className="mt-1 block text-[var(--muted)]">{meaning.example}</span>
            </span>,
            document.body,
          )
        : null}
    </>
  )
}
