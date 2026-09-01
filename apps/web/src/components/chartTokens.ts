/**
 * The drawing grammar every chart in the viewer shares.
 *
 * A chart is built from lines the reader looks past and lines the reader looks
 * at, and the difference between the two is a weight and a shade. Those were
 * chosen once per chart: the radar, the field, the bubble and the sparkline
 * between them carried nine stroke widths and twelve opacities, all within a
 * tenth of each other and none of them named. A reader learns a picture faster
 * when the same weight means the same thing across every picture on the site,
 * and nothing was holding that together except whoever last eyeballed a number.
 *
 * Both scales below are what the charts already drew, collapsed onto their
 * nearest step, and nothing moved by more than 0.1. They are absolute,
 * because every chart here draws a viewBox unit at
 * roughly one displayed pixel. A chart deliberately shrunk below that, like the
 * peer radar in a table cell, shrinks whole and keeps the ratios.
 *
 * In-chart text is not here. The radar names its axes inside a 260 unit field
 * and the flag field labels its ticks inside a 960 unit one, so one number
 * cannot mean one size across both: those sizes belong to each chart's own
 * geometry and are named there. See D103.
 */

/**
 * Line weights, in chart units.
 *
 * Four charts read this: `Radar`, `FlagField`, `FlagBubble` and `Sparkline`.
 * `Icon` keeps Lucide's own weight of 2 because its transform scales it down
 * with the glyph, `Og` draws a 1200 pixel social card, `EnvisioningMark` is
 * brand geometry and `DotField` is atmosphere rather than a chart. None of
 * those four read this file.
 */
export const CHART_STROKE = {
  /** The frame: rings, spokes, ticks, the scale rule, a sparkline's baseline. */
  hair: 0.75,
  /** The frame line meant to be noticed: the median, a clamp mark, the axis under the pointer. */
  rule: 1,
  /** The outline of a mark, and of a comparator's shape. */
  mark: 1.25,
  /** A series drawn small, and the halo around the mark being pointed at. */
  line: 1.5,
  /** The data at full size: a filled shape's edge, the focal country's ring. */
  data: 2,
} as const

/**
 * How dark chart furniture sits against the page.
 *
 * A mark's own ink is not on this ramp. A flag bubble's ring is drawn at full
 * strength because it carries the confidence, and fading it would encode the
 * same thing twice.
 */
export const CHART_INK = {
  /** An area lying behind the data, like the middle half of a field. */
  band: 0.05,
  /** A grid line the reader is not meant to count. */
  grid: 0.15,
  /** The frame the data sits on. */
  frame: 0.25,
  /** The one line, or mark, the reader is meant to notice. */
  emphasis: 0.4,
  /** A number or a word printed inside the chart. */
  label: 0.55,
} as const

/**
 * How a chart moves. Three speeds, because a chart does three things: it moves
 * a mark to a new score, it brings a mark in or takes it away, and it answers
 * the pointer.
 */
export const CHART_MOTION = {
  /** A mark travelling to a new position on the scale. */
  travel: '700ms cubic-bezier(0.22, 0.61, 0.36, 1)',
  /** A mark arriving on the field or leaving it. */
  fade: '250ms ease',
  /** The chart answering the pointer. */
  state: '140ms ease',
} as const
