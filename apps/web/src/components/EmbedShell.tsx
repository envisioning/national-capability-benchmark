import type { ReactNode } from 'react'

export type EmbedTheme = 'light' | 'dark' | 'print'

type SearchParams = Record<string, string | string[] | undefined>

/** The only themes an embed accepts. Unknown values use the stable light theme. */
export function embedTheme(params: SearchParams): EmbedTheme {
  const value = Array.isArray(params.theme) ? params.theme[0] : params.theme
  return value === 'dark' || value === 'print' ? value : 'light'
}

/** Shared shell for iframe pages. The root layout hides site chrome around it. */
export function EmbedShell({
  theme,
  children,
}: {
  theme: EmbedTheme
  children: ReactNode
}) {
  return <div className={`embed-shell embed-theme-${theme}`}>{children}</div>
}
