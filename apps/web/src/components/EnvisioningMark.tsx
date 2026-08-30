import type { CSSProperties } from 'react'

/**
 * The Envisioning EV glyph, vendored as a presentational SVG from the parent
 * brand mark. It inherits currentColor so it can sit naturally in the NCB
 * header and footer without adding an image request.
 */
export function EnvisioningMark({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="3.2 3.2 19.6 19.6"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="none" strokeWidth="1" fillRule="evenodd">
        <g transform="translate(-1, -1)">
          <g transform="translate(4.2, 4.2)">
            <polygon points="0 13.29944 7.000025 13.29944 7.000025 6.29944 0 6.29944" />
            <g transform="translate(9.8, 0)">
              <path d="M7.000025,19.6 L0,19.6 L0,14.7 C0,14.37478 0.0452901618,14.05117 0.134680481,13.73848 L2.80001,4.40979 L2.80001,0 L9.800035,0 L9.800035,4.9 C9.800035,5.22522 9.75474484,5.54883 9.66535452,5.86152 L7.000025,15.19021 L7.000025,19.6 Z" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
