import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Link from 'next/link'
import './globals.css'

/*
 * Inter is self-hosted from rsms/inter, matching envisioning.com. Envisioning
 * Octa is display only: page titles and the wordmark, never body, labels or
 * tables. Set Octa with font-variation-settings so the width axis travels.
 */
const inter = localFont({
  variable: '--font-inter',
  display: 'swap',
  src: './fonts/InterVariable.woff2',
  weight: '100 900',
  style: 'normal',
})

const interItalic = localFont({
  variable: '--font-inter-italic',
  display: 'swap',
  preload: false,
  src: './fonts/InterVariable-Italic.woff2',
  weight: '100 900',
  style: 'italic',
})

const octa = localFont({
  variable: '--font-octa',
  display: 'swap',
  src: './fonts/EnvisioningOcta-VF.woff2',
  weight: '100 900',
  style: 'normal',
  declarations: [{ prop: 'font-stretch', value: '100% 125%' }],
})

export const metadata: Metadata = {
  title: 'NCB, the National Capability Benchmark',
  description:
    'A prototype that measures what a country can do, separately from how rich it is.',
}

const NAV = [
  { href: '/', label: 'Profiles' },
  { href: '/indicators', label: 'Indicators' },
  { href: '/patterns', label: 'Patterns' },
  { href: '/diagnostics', label: 'Diagnostics' },
  { href: '/delphi', label: 'Delphi panel' },
  { href: '/method', label: 'Method' },
  { href: '/glossary', label: 'Glossary' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interItalic.variable} ${octa.variable}`}>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-[1000] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-xs focus:font-medium focus:text-black"
        >
          Skip to content
        </a>

        <header className="w-full border-b border-[var(--rule)]">
          <div className="m-auto flex max-w-6xl flex-wrap items-baseline gap-x-8 gap-y-3 px-6 py-6 sm:px-12">
            <Link href="/" className="flex items-baseline gap-3">
              <span
                className="font-display text-[22px] leading-none"
                style={{ fontVariationSettings: '"wght" 500, "wdth" 100' }}
              >
                NCB
              </span>
              <span className="text-xs text-[var(--muted)]">National Capability Benchmark</span>
            </Link>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-[var(--muted)] transition-all duration-200 hover:text-[var(--foreground)]"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <span className="ml-auto text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
              Prototype v0
            </span>
          </div>
        </header>

        <main id="main" className="m-auto max-w-6xl px-6 py-12 sm:px-12 sm:py-16">
          {children}
        </main>

        <footer className="w-full border-t border-[var(--rule)] bg-[var(--surface-sunken)]">
          <div className="m-auto max-w-6xl px-6 py-12 sm:px-12">
            <p className="max-w-3xl text-lg leading-relaxed">
              Envisioning is an emerging technology research institute and advisory, operating
              since 2010.
            </p>
            <p className="mt-4 max-w-3xl text-xs text-[var(--muted)]">
              Scores are a position from 0 to 100 against ten fixed reference countries. The scale
              holds still, so adding a country moves nobody else. Confidence is reported beside
              every score and never inside it.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
