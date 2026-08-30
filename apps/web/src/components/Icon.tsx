/**
 * Icons, drawn inline from the Lucide set.
 *
 * The paths are copied from lucide-icons/lucide, ISC licensed, credited in
 * NOTICE.md. Copying the handful we use keeps the app on three dependencies,
 * which is a standing choice in this repository, and it means an icon cannot
 * quietly change under us on a package update.
 *
 * An icon here always carries meaning that the text beside it also carries. It
 * is a second encoding, never the only one, so nothing is lost to a reader who
 * does not recognise the glyph or who cannot see it. Every icon is
 * `aria-hidden`, because the label next to it is the accessible name.
 */
export type IconName =
  | 'archive'
  | 'arrow-left'
  | 'arrow-right'
  | 'bot'
  | 'building-2'
  | 'chart-line'
  | 'circle-check'
  | 'circle-dashed'
  | 'compass'
  | 'dot'
  | 'eye'
  | 'file-clock'
  | 'gauge'
  | 'globe'
  | 'graduation-cap'
  | 'layers'
  | 'list-filter'
  | 'menu'
  | 'minus'
  | 'plug'
  | 'ruler'
  | 'search-x'
  | 'target'
  | 'x'
  | 'trending-down'
  | 'trending-up'
  | 'triangle-alert'
  | 'users'
  | 'book-open'
  | 'flag'
  | 'flask-conical'
  | 'hammer'
  | 'hand'
  | 'handshake'
  | 'network'
  | 'shuffle'
  | 'signal'
  | 'signal-high'
  | 'signal-low'
  | 'signal-medium'
  | 'telescope'
  | 'languages'
  | 'calendar'

const PATHS: Record<IconName, string> = {
  'archive': `<rect width='20' height='5' x='2' y='3' rx='1' /> <path d='M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8' /> <path d='M10 12h4' />`,
  'arrow-left': `<path d='m12 19-7-7 7-7' /> <path d='M19 12H5' />`,
  'arrow-right': `<path d='M5 12h14' /> <path d='m12 5 7 7-7 7' />`,
  'bot': `<path d='M12 8V4H8' /> <rect width='16' height='12' x='4' y='8' rx='2' /> <path d='M2 14h2' /> <path d='M20 14h2' /> <path d='M15 13v2' /> <path d='M9 13v2' />`,
  'building-2': `<path d='M10 12h4' /> <path d='M10 8h4' /> <path d='M14 21v-3a2 2 0 0 0-4 0v3' /> <path d='M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2' /> <path d='M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16' />`,
  'chart-line': `<path d='M3 3v16a2 2 0 0 0 2 2h16' /> <path d='m19 9-5 5-4-4-3 3' />`,
  'circle-check': `<circle cx='12' cy='12' r='10' /> <path d='m9 12 2 2 4-4' />`,
  'circle-dashed': `<path d='M10.1 2.182a10 10 0 0 1 3.8 0' /> <path d='M13.9 21.818a10 10 0 0 1-3.8 0' /> <path d='M17.609 3.721a10 10 0 0 1 2.69 2.7' /> <path d='M2.182 13.9a10 10 0 0 1 0-3.8' /> <path d='M20.279 17.609a10 10 0 0 1-2.7 2.69' /> <path d='M21.818 10.1a10 10 0 0 1 0 3.8' /> <path d='M3.721 6.391a10 10 0 0 1 2.7-2.69' /> <path d='M6.391 20.279a10 10 0 0 1-2.69-2.7' />`,
  'compass': `<circle cx='12' cy='12' r='10' /> <path d='m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z' />`,
  'dot': `<circle cx='12' cy='12' r='1' />`,
  'eye': `<path d='M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0' /> <circle cx='12' cy='12' r='3' />`,
  'file-clock': `<path d='M16 22h2a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v2.85' /> <path d='M14 2v5a1 1 0 0 0 1 1h5' /> <path d='M8 14v2.2l1.6 1' /> <circle cx='8' cy='16' r='6' />`,
  'gauge': `<path d='m12 14 4-4' /> <path d='M3.34 19a10 10 0 1 1 17.32 0' />`,
  'globe': `<circle cx='12' cy='12' r='10' /> <path d='M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' /> <path d='M2 12h20' />`,
  'graduation-cap': `<path d='M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z' /> <path d='M22 10v6' /> <path d='M6 12.5V16a6 3 0 0 0 12 0v-3.5' />`,
  'layers': `<path d='M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z' /> <path d='M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12' /> <path d='M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17' />`,
  'list-filter': `<path d='M3 6h18' /> <path d='M7 12h10' /> <path d='M10 18h4' />`,
  'menu': `<path d='M4 6h16' /> <path d='M4 12h16' /> <path d='M4 18h16' />`,
  'languages': `<path d='m5 8 6 6' /> <path d='m4 14 6-6 2-3' /> <path d='M2 5h12' /> <path d='M7 2h1' /> <path d='m22 22-5-10-5 10' /> <path d='M14 18h6' />`,
  'calendar': `<path d='M8 2v4' /> <path d='M16 2v4' /> <rect width='18' height='18' x='3' y='4' rx='2' /> <path d='M3 10h18' />`,
  'minus': `<path d='M5 12h14' />`,
  'plug': `<path d='M12 22v-5' /> <path d='M15 8V2' /> <path d='M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z' /> <path d='M9 8V2' />`,
  'ruler': `<path d='M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z' /> <path d='m14.5 12.5 2-2' /> <path d='m11.5 9.5 2-2' /> <path d='m8.5 6.5 2-2' /> <path d='m17.5 15.5 2-2' />`,
  'x': `<path d='M18 6 6 18' /> <path d='m6 6 12 12' />`,
  'search-x': `<path d='m13.5 8.5-5 5' /> <path d='m8.5 8.5 5 5' /> <circle cx='11' cy='11' r='8' /> <path d='m21 21-4.3-4.3' />`,
  'target': `<circle cx='12' cy='12' r='10' /> <circle cx='12' cy='12' r='6' /> <circle cx='12' cy='12' r='2' />`,
  'trending-down': `<path d='M16 17h6v-6' /> <path d='m22 17-8.5-8.5-5 5L2 7' />`,
  'trending-up': `<path d='M16 7h6v6' /> <path d='m22 7-8.5 8.5-5-5L2 17' />`,
  'triangle-alert': `<path d='m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3' /> <path d='M12 9v4' /> <path d='M12 17h.01' />`,
  'users': `<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' /> <path d='M16 3.128a4 4 0 0 1 0 7.744' /> <path d='M22 21v-2a4 4 0 0 0-3-3.87' /> <circle cx='9' cy='7' r='4' />`,
  'book-open': `<path d='M12 5v16' /> <path d='M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z' />`,
  'flag': `<path d='M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528' />`,
  'flask-conical': `<path d='M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2' /> <path d='M6.453 15h11.094' /> <path d='M8.5 2h7' />`,
  'hammer': `<path d='m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9' /> <path d='m18 15 4-4' /> <path d='m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5' />`,
  'hand': `<path d='M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2' /> <path d='M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2' /> <path d='M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8' /> <path d='M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15' />`,
  'handshake': `<path d='m11 17 2 2a1 1 0 1 0 3-3' /> <path d='m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4' /> <path d='m21 3 1 11h-2' /> <path d='M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3' /> <path d='M3 4h8' />`,
  'network': `<rect x='16' y='16' width='6' height='6' rx='1' /> <rect x='2' y='16' width='6' height='6' rx='1' /> <rect x='9' y='2' width='6' height='6' rx='1' /> <path d='M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3' /> <path d='M12 12V8' />`,
  'shuffle': `<path d='m18 14 4 4-4 4' /> <path d='m18 2 4 4-4 4' /> <path d='M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22' /> <path d='M2 6h1.972a4 4 0 0 1 3.6 2.2' /> <path d='M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45' />`,
  'signal': `<path d='M2 20h.01' /> <path d='M7 20v-4' /> <path d='M12 20v-8' /> <path d='M17 20V8' /> <path d='M22 4v16' />`,
  'signal-high': `<path d='M2 20h.01' /> <path d='M7 20v-4' /> <path d='M12 20v-8' /> <path d='M17 20V8' />`,
  'signal-low': `<path d='M2 20h.01' /> <path d='M7 20v-4' />`,
  'signal-medium': `<path d='M2 20h.01' /> <path d='M7 20v-4' /> <path d='M12 20v-8' />`,
  'telescope': `<path d='m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44' /> <path d='m13.56 11.747 4.332-.924' /> <path d='m16 21-3.105-6.21' /> <path d='M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z' /> <path d='m6.158 8.633 1.114 4.456' /> <path d='m8 21 3.105-6.21' /> <circle cx='12' cy='13' r='2' />`,
}

/**
 * The inner markup of an icon, for callers drawing their own SVG.
 *
 * The radar places icons at its axis ends, inside an SVG it already owns, so it
 * needs the shapes without a second `<svg>` wrapper around them.
 */
export function iconMarkup(name: IconName): string {
  return PATHS[name]
}

export function Icon({
  name,
  size = 16,
  className,
}: {
  name: IconName
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      dangerouslySetInnerHTML={{ __html: PATHS[name] }}
    />
  )
}

/**
 * What each concept looks like. One icon per concept, used everywhere that
 * concept appears, so the glyph becomes learnable instead of decorative.
 */
export const CLASS_ICON = {
  C: 'target',
  I: 'plug',
  O: 'trending-up',
  P: 'eye',
} as const satisfies Record<string, IconName>

export const STATUS_ICON = {
  observed: 'circle-check',
  missing: 'dot',
  gap: 'circle-dashed',
  retired: 'archive',
} as const satisfies Record<string, IconName>

export const TIER_ICON = {
  official_statistical: 'building-2',
  international_organization: 'globe',
  academic_survey: 'graduation-cap',
  composite_index: 'chart-line',
  expert_panel: 'users',
  llm_delphi: 'bot',
} as const satisfies Record<string, IconName>

export const GROUP_ICON = {
  'What is being measured': 'compass',
  'How a number is made': 'ruler',
  'How good the evidence is': 'gauge',
  'What is missing': 'search-x',
  'How things change over time': 'chart-line',
  'What sits beside the score': 'layers',
} as const satisfies Record<string, IconName>

export const DIMENSION_ICON = {
  anticipation: 'telescope',
  agency: 'hand',
  coordination: 'network',
  trust: 'handshake',
  learning: 'book-open',
  experimentation: 'flask-conical',
  adaptability: 'shuffle',
  building: 'hammer',
  shared_purpose: 'flag',
} as const satisfies Record<string, IconName>

export const CONFIDENCE_ICON = {
  very_thin: 'signal-low',
  thin: 'signal-medium',
  usable: 'signal-high',
  good: 'signal',
} as const satisfies Record<string, IconName>
