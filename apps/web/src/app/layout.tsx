import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Link from 'next/link'
import Script from 'next/script'
import { COUNTRIES, DATASET_VERSION, LICENSE_DOC, REPO_URL, docHref } from '@ncb/core'
import { EnvisioningMark } from '@/components/EnvisioningMark'
import { FooterNav, HeaderNav, SectionTabs } from '@/components/SiteNav'
import { changelogHref, siteOrigin } from '@/lib/links'
import './globals.css'

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? 'ncb.envisioning.com'
const PLAUSIBLE_SCRIPT_URL =
  process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL ?? 'https://plausible.io/js/script.js'

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
  metadataBase: new URL(siteOrigin()),
  title: 'NCB, the National Capability Benchmark',
  description:
    'A prototype that measures what a country can do, separately from how rich it is.',
}

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
          <div className="m-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4 sm:gap-x-8 sm:px-12 sm:py-5">
            {/* The compact lockup follows the parent Envisioning shell: EV glyph,
                then the product name. The full name remains available to assistive
                technology without making the global header compete with the page. */}
            <Link
              href="/"
              aria-label="NCB, National Capability Benchmark home"
              className="inline-flex shrink-0 items-center gap-3 text-[var(--foreground)]"
            >
              <EnvisioningMark className="h-5 w-5" />
              <span className="flex flex-col leading-none">
                <span
                  className="font-display text-[34px] leading-none"
                  style={{ fontVariationSettings: '"wght" 500, "wdth" 100' }}
                >
                  NCB
                </span>
                <span className="mt-1 text-[9px] uppercase leading-[1.15] tracking-[0.06em] text-[var(--muted)]">
                  National Capability Benchmark
                </span>
              </span>
            </Link>
            <HeaderNav />
          </div>
        </header>

        {/* The deepest level of the nav tree, on its own rule under the header,
            so the trail and the sibling pages read as different things. It
            renders nothing on a page that has no pages beside it. See D73. */}
        <SectionTabs />

        <main id="main" className="m-auto max-w-6xl px-6 py-12 sm:px-12 sm:py-16">
          {children}
        </main>

        <footer className="footer-band w-full border-t border-[var(--rule)]">
          <div className="m-auto max-w-6xl px-6 py-12 sm:px-12">
            <div className="flex flex-col gap-4 border-b border-[var(--rule)] pb-10 sm:flex-row sm:items-center sm:gap-8">
              <Link
                href="/"
                aria-label="NCB home"
                className="footer-brand-lockup flex shrink-0 items-center gap-3"
              >
                <EnvisioningMark className="h-[18px] w-[18px]" />
                <span
                  className="font-display text-[32px] leading-none"
                  style={{ fontVariationSettings: '"wght" 500, "wdth" 100' }}
                >
                  NCB
                </span>
              </Link>
              <div>
                <p className="max-w-3xl text-lg leading-relaxed">
                  <span className="text-[var(--footer-ink)]">NCB</span> is a prototype benchmark
                  from Envisioning for reading what a country can do under uncertainty.
                </p>
                <p className="mt-2 max-w-3xl text-xs text-[var(--footer-muted)]">
                  It scores {COUNTRIES.length} countries on nine dimensions using public data.
                  Every score runs from 0 to 100 and carries its own confidence value. There is
                  no overall ranking.
                </p>
              </div>
            </div>

            <FooterNav />
          </div>

          {/* The one place every page names the dataset it is showing and where the code lives. */}
          <div className="m-auto flex max-w-6xl flex-col gap-4 border-t border-[var(--rule)] px-6 pt-6 pb-14 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-12">
            <p>
              Powered by{' '}
              <a
                href="https://envisioning.com"
                rel="noopener external"
                className="footer-strong-link underline underline-offset-2"
              >
                Envisioning
              </a>
              , a technology research institute and advisory.
            </p>
            <nav aria-label="Project and legal information">
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                <li>Dataset {DATASET_VERSION}</li>
                <li>
                  <Link href={changelogHref}>Changelog</Link>
                </li>
                <li>
                  <a href={REPO_URL} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href={docHref(LICENSE_DOC)}>License</a>
                </li>
              </ul>
            </nav>
          </div>
        </footer>

        {process.env.NODE_ENV === 'production' ? (
          <Script
            id="plausible-analytics"
            src={PLAUSIBLE_SCRIPT_URL}
            data-domain={PLAUSIBLE_DOMAIN}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  )
}
