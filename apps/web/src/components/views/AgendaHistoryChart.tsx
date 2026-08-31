'use client'

import { useMemo, useState } from 'react'
import type { Dimension } from '@ncb/core'
import { fill, signed } from '@ncb/core'
import { Icon } from '@/components/Icon'

export type AgendaHistorySpan = {
  spanYears: number
  baseYear: number
  currentYear: number
  baseScore: number
  currentScore: number
  delta: number
  matchedIndicators: number
  clamped: number
  series: Array<{ year: number; score: number }>
}

export type AgendaHistoryDimension = {
  dimension: Dimension
  label: string
  spans: AgendaHistorySpan[]
}

export type AgendaHistoryEvent = {
  id: string
  dimension: Dimension
  title: string
  year: number
}

export type AgendaHistoryLabels = {
  dimension: string
  period: string
  axis: string
  years: string
  noHistory: string
  noSpan: string
  readout: string
  readoutClamped: string
  caveat: string
  chartAria: string
  pointAria: string
  agendaItems: string
  eventTimelineAria: string
  eventAria: string
}

const WIDTH = 760
const HEIGHT = 320
const PLOT = { left: 48, right: 16, top: 18, bottom: 38 }
const EVENT_HEIGHT = 136
const EVENT_PLOT = { left: 48, right: 16, top: 16, bottom: 34 }
const EVENT_BASELINE = EVENT_HEIGHT - EVENT_PLOT.bottom
const MAX_EVENT_LANES = 3
const Y_TICKS = [0, 25, 50, 75, 100]

/**
 * The agenda's historical view is intentionally one dimension at a time. A
 * nine-line plot would turn different evidence baskets into visual noise, so
 * the reader chooses the capability question first and the time span second.
 */
export function AgendaHistoryChart({
  dimensions,
  events,
  timelineStartYear,
  labels,
  numberLocale,
}: {
  dimensions: AgendaHistoryDimension[]
  events: AgendaHistoryEvent[]
  timelineStartYear: number
  labels: AgendaHistoryLabels
  numberLocale: string
}) {
  const spanOptions = useMemo(
    () =>
      [
        ...new Set(
          dimensions.flatMap((dimension) => dimension.spans.map((span) => span.spanYears)),
        ),
      ].sort((a, b) => a - b),
    [dimensions],
  )
  const availableDimensions = useMemo(
    () => dimensions.filter((dimension) => dimension.spans.length > 0),
    [dimensions],
  )
  const longestSpan = spanOptions[spanOptions.length - 1] ?? 0
  const firstDimensionForLongestSpan =
    dimensions.find((dimension) =>
      dimension.spans.some((span) => span.spanYears === longestSpan),
    ) ?? availableDimensions[0]
  const [selectedSpan, setSelectedSpan] = useState(longestSpan)
  const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(
    firstDimensionForLongestSpan?.dimension ?? null,
  )

  const activeDimension =
    availableDimensions.find((dimension) => dimension.dimension === selectedDimension) ??
    availableDimensions[0] ??
    null
  const activeSpan =
    activeDimension?.spans.find((span) => span.spanYears === selectedSpan) ??
    activeDimension?.spans[0] ??
    null
  const activeEvents = useMemo(
    () =>
      activeDimension && activeSpan
        ? events
            .filter(
              (event) =>
                event.dimension === activeDimension.dimension &&
                event.year >= timelineStartYear &&
                event.year <= activeSpan.currentYear,
            )
            .sort((a, b) => a.year - b.year || a.title.localeCompare(b.title))
        : [],
    [activeDimension, activeSpan, events, timelineStartYear],
  )

  if (availableDimensions.length === 0 || spanOptions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--rule)] px-6 py-12 text-center text-lg text-[var(--muted)]">
        {labels.noHistory}
      </div>
    )
  }

  const formatNumber = (value: number) =>
    new Intl.NumberFormat(numberLocale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value)

  const formatSpan = (span: number) => `${span} ${labels.years}`
  const activeEventLanes = eventLanes(activeEvents)

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
            {labels.dimension}
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={labels.dimension}>
            {dimensions.map((dimension) => {
              const isAvailable = dimension.spans.some((span) => span.spanYears === selectedSpan)
              const isSelected = activeDimension?.dimension === dimension.dimension
              return (
                <button
                  key={dimension.dimension}
                  type="button"
                  disabled={!isAvailable}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedDimension(dimension.dimension)}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    isSelected
                      ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                      : 'border-[var(--rule)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-sunken)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Icon name="chart-line" size={13} />
                  {dimension.label}
                </button>
              )
            })}
          </div>
        </div>

        {spanOptions.length > 1 ? (
          <div>
            <p className="text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
              {labels.period}
            </p>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={labels.period}>
              {spanOptions.map((span) => (
                <button
                  key={span}
                  type="button"
                  aria-pressed={selectedSpan === span}
                  onClick={() => {
                    setSelectedSpan(span)
                    const firstAvailable = dimensions.find((dimension) =>
                      dimension.spans.some((candidate) => candidate.spanYears === span),
                    )
                    const selectedHasSpan = dimensions.some(
                      (dimension) =>
                      dimension.dimension === selectedDimension &&
                        dimension.spans.some(
                          (candidate) => candidate.spanYears === span,
                        ),
                    )
                    if (firstAvailable && !selectedHasSpan) {
                      setSelectedDimension(firstAvailable.dimension)
                    }
                  }}
                  className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                    selectedSpan === span
                      ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                      : 'border-[var(--rule)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-sunken)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {formatSpan(span)}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {activeDimension && activeSpan ? (
        <>
          <div className="rounded-xl border border-[var(--rule)] bg-[var(--surface-sunken)] p-3 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-4 text-xs text-[var(--muted)]">
              <span>{labels.axis}</span>
              <span className="tabular-nums">0–100</span>
            </div>
            <div className="overflow-x-auto">
              <svg
                width="100%"
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                preserveAspectRatio="xMinYMin meet"
                role="img"
                aria-label={fill(labels.chartAria, {
                  dimension: activeDimension.label,
                  baseYear: activeSpan.baseYear,
                  currentYear: activeSpan.currentYear,
                })}
                className="block h-auto w-full"
                style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
              >
                {Y_TICKS.map((tick) => {
                  const y = yPosition(tick)
                  return (
                    <g key={tick}>
                      <line
                        x1={PLOT.left}
                        y1={y}
                        x2={WIDTH - PLOT.right}
                        y2={y}
                        stroke="var(--rule)"
                        strokeOpacity={tick === 0 ? 0.9 : 0.55}
                        strokeWidth={tick === 0 ? 1 : 0.75}
                      />
                      <text
                        x={PLOT.left - 10}
                        y={y + 4}
                        textAnchor="end"
                        fill="var(--muted)"
                        fontSize="11"
                      >
                        {tick}
                      </text>
                    </g>
                  )
                })}

                {yearTicks(activeSpan.baseYear, activeSpan.currentYear).map((year) => {
                  const x = xPosition(year, activeSpan.baseYear, activeSpan.currentYear)
                  return (
                    <g key={year}>
                      <line
                        x1={x}
                        y1={PLOT.top}
                        x2={x}
                        y2={HEIGHT - PLOT.bottom}
                        stroke="var(--rule)"
                        strokeOpacity={0.35}
                        strokeWidth={0.75}
                      />
                      <text
                        x={x}
                        y={HEIGHT - 12}
                        textAnchor="middle"
                        fill="var(--muted)"
                        fontSize="11"
                      >
                        {year}
                      </text>
                    </g>
                  )
                })}

                {seriesSegments(activeSpan.series).map((segment, index) => (
                  <polyline
                    key={index}
                    points={segment
                      .map((point) =>
                        `${xPosition(
                          point.year,
                          activeSpan.baseYear,
                          activeSpan.currentYear,
                        ).toFixed(1)},${yPosition(point.score).toFixed(1)}`,
                      )
                      .join(' ')}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth={2.25}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}

                {activeSpan.series.map((point) => (
                  <circle
                    key={point.year}
                    cx={xPosition(point.year, activeSpan.baseYear, activeSpan.currentYear)}
                    cy={yPosition(point.score)}
                    r={3.5}
                    fill="var(--primary)"
                    stroke="var(--surface-sunken)"
                    strokeWidth={1.5}
                  />
                ))}
              </svg>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed">
            <span className="font-medium">{activeDimension.label}</span>{' '}
            {activeSpan.baseYear} → {activeSpan.currentYear}:{' '}
            {fill(activeSpan.clamped > 0 ? labels.readoutClamped : labels.readout, {
              from: formatNumber(activeSpan.baseScore),
              to: formatNumber(activeSpan.currentScore),
              delta: signed(activeSpan.delta, numberLocale),
              years: activeSpan.spanYears,
              n: activeSpan.matchedIndicators,
              c: activeSpan.clamped,
            })}
          </p>

          {activeEvents.length > 0 ? (
            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
                {labels.agendaItems}
              </p>
              <div className="mt-2 rounded-xl border border-[var(--rule)] bg-[var(--surface-sunken)] p-3 sm:p-5">
                <div className="overflow-x-auto">
                  <svg
                    width="100%"
                    viewBox={`0 0 ${WIDTH} ${EVENT_HEIGHT}`}
                    preserveAspectRatio="xMinYMin meet"
                    role="img"
                    aria-label={fill(labels.eventTimelineAria, {
                      dimension: activeDimension.label,
                      baseYear: timelineStartYear,
                      currentYear: activeSpan.currentYear,
                    })}
                    className="block h-auto w-full"
                    style={{ aspectRatio: `${WIDTH} / ${EVENT_HEIGHT}` }}
                  >
                    {yearTicks(timelineStartYear, activeSpan.currentYear).map((year) => {
                      const x = xPosition(
                        year,
                        timelineStartYear,
                        activeSpan.currentYear,
                        EVENT_PLOT,
                      )
                      return (
                        <g key={year}>
                          <line
                            x1={x}
                            y1={EVENT_PLOT.top}
                            x2={x}
                            y2={EVENT_BASELINE}
                            stroke="var(--rule)"
                            strokeOpacity={0.4}
                            strokeWidth={0.75}
                          />
                          <text
                            x={x}
                            y={EVENT_HEIGHT - 10}
                            textAnchor="middle"
                            fill="var(--muted)"
                            fontSize="11"
                          >
                            {year}
                          </text>
                        </g>
                      )
                    })}
                    <line
                      x1={EVENT_PLOT.left}
                      y1={EVENT_BASELINE}
                      x2={WIDTH - EVENT_PLOT.right}
                      y2={EVENT_BASELINE}
                      stroke="var(--rule)"
                      strokeWidth={1}
                    />
                    {activeEvents.map((event, index) => {
                      const x = xPosition(
                        event.year,
                        timelineStartYear,
                        activeSpan.currentYear,
                        EVENT_PLOT,
                      )
                      const y = EVENT_BASELINE - 14 - (activeEventLanes[index] ?? 0) * 18
                      return (
                        <g
                          key={event.id}
                          role="img"
                          aria-label={fill(labels.eventAria, {
                            title: event.title,
                            year: event.year,
                          })}
                        >
                          <line
                            x1={x}
                            y1={y}
                            x2={x}
                            y2={EVENT_BASELINE}
                            stroke="var(--ring)"
                            strokeOpacity={0.65}
                            strokeWidth={1.25}
                          />
                          <circle
                            cx={x}
                            cy={y}
                            r={4}
                            fill="var(--surface-sunken)"
                            stroke="var(--ring)"
                            strokeWidth={2}
                          />
                        </g>
                      )
                    })}
                  </svg>
                </div>
              </div>
              <ul className="mt-3 grid gap-x-6 gap-y-1 text-xs leading-relaxed sm:grid-cols-2">
                {activeEvents.map((event) => (
                  <li key={event.id}>
                    <span className="mr-2 tabular-nums text-[var(--muted)]">{event.year}</span>
                    {event.title}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-[var(--rule)] px-6 py-12 text-center text-lg text-[var(--muted)]">
          {labels.noSpan}
        </div>
      )}

      <p className="mt-4 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">{labels.caveat}</p>
    </div>
  )
}

function xPosition(
  year: number,
  baseYear: number,
  currentYear: number,
  plot = PLOT,
): number {
  const span = currentYear - baseYear || 1
  return plot.left + ((year - baseYear) / span) * (WIDTH - plot.left - plot.right)
}

function yPosition(score: number): number {
  return HEIGHT - PLOT.bottom - (score / 100) * (HEIGHT - PLOT.top - PLOT.bottom)
}

function yearTicks(baseYear: number, currentYear: number): number[] {
  const span = currentYear - baseYear
  const step = span > 40 ? 10 : span > 16 ? 5 : span > 10 ? 2 : 1
  const ticks: number[] = []
  for (let year = baseYear; year <= currentYear; year += step) ticks.push(year)
  if (ticks[ticks.length - 1] !== currentYear) ticks.push(currentYear)
  return ticks
}

function eventLanes(events: AgendaHistoryEvent[]): number[] {
  const lastYearByLane: number[] = []
  return events.map((event) => {
    const openLane = lastYearByLane.findIndex((lastYear) => event.year - lastYear >= 3)
    if (openLane >= 0) {
      lastYearByLane[openLane] = event.year
      return openLane
    }
    if (lastYearByLane.length < MAX_EVENT_LANES) {
      lastYearByLane.push(event.year)
      return lastYearByLane.length - 1
    }
    const reuseLane = lastYearByLane.indexOf(Math.min(...lastYearByLane))
    lastYearByLane[reuseLane] = event.year
    return reuseLane
  })
}

function seriesSegments(series: Array<{ year: number; score: number }>) {
  const ordered = [...series].sort((a, b) => a.year - b.year)
  const segments: Array<Array<{ year: number; score: number }>> = []
  for (const point of ordered) {
    const current = segments[segments.length - 1]
    const previous = current?.[current.length - 1]
    if (!current || !previous || point.year - previous.year > 1) {
      segments.push([point])
    } else {
      current.push(point)
    }
  }
  return segments
}
