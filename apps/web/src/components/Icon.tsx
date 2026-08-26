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
  | 'minus'
  | 'plug'
  | 'ruler'
  | 'search-x'
  | 'target'
  | 'trending-down'
  | 'trending-up'
  | 'triangle-alert'
  | 'users'

const PATHS: Record<IconName, string> = {
  'archive': `<rect width='20' height='5' x='2' y='3' rx='1' /> <path d='M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8' /> <path d='M10 12h4' />`,
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
  'minus': `<path d='M5 12h14' />`,
  'plug': `<path d='M12 22v-5' /> <path d='M15 8V2' /> <path d='M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z' /> <path d='M9 8V2' />`,
  'ruler': `<path d='M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z' /> <path d='m14.5 12.5 2-2' /> <path d='m11.5 9.5 2-2' /> <path d='m8.5 6.5 2-2' /> <path d='m17.5 15.5 2-2' />`,
  'search-x': `<path d='m13.5 8.5-5 5' /> <path d='m8.5 8.5 5 5' /> <circle cx='11' cy='11' r='8' /> <path d='m21 21-4.3-4.3' />`,
  'target': `<circle cx='12' cy='12' r='10' /> <circle cx='12' cy='12' r='6' /> <circle cx='12' cy='12' r='2' />`,
  'trending-down': `<path d='M16 17h6v-6' /> <path d='m22 17-8.5-8.5-5 5L2 7' />`,
  'trending-up': `<path d='M16 7h6v6' /> <path d='m22 7-8.5 8.5-5-5L2 17' />`,
  'triangle-alert': `<path d='m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3' /> <path d='M12 9v4' /> <path d='M12 17h.01' />`,
  'users': `<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' /> <path d='M16 3.128a4 4 0 0 1 0 7.744' /> <path d='M22 21v-2a4 4 0 0 0-3-3.87' /> <circle cx='9' cy='7' r='4' />`,
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

