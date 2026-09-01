import '@envisioning/app/styles.css'
import './theme.css'
import { Icons } from '@envisioning/app'

/**
 * The drawn network runs inside its own chrome.
 *
 * `@envisioning/app` brings a header, a menu and a URL grammar of its own, so
 * this route is a leaf and never a level of the navigation tree D73 and D80
 * describe. The library's compiled stylesheet is imported here rather than in
 * the root layout, so it loads on this route and nowhere else. See D82.
 */
export default function NetworkLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="explorer-shell">
      {/* The library's icons are an SVG sprite that every one of its components
          references by id. Without this the rail and the toolbars render empty
          boxes. */}
      <Icons />
      {children}
    </div>
  )
}
