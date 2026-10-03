import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import { APP_VERSION, DATASET_VERSION, LICENSE_DOC, docHref } from '@ncb/core'
import { FooterLead, FooterMeta, HomeLink, LangHtml, SkipLink } from '@/components/Chrome'
import { EnvisioningMark } from '@/components/EnvisioningMark'
import { FooterNav, HeaderNav, ScrollAwareHeader, SectionTabs, SiteChrome } from '@/components/SiteNav'
import { siteOrigin } from '@/lib/links'
import './globals.css'

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? 'ncb.envisioning.com'
const PLAUSIBLE_SCRIPT_URL =
  process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL ?? 'https://plausible.io/js/script.js'

/*
 * Inter is self-hosted from rsms/inter, matching envisioning.com. Envisioning
 * Octa is display only, and rare: the wordmark and the front page hero title.
 * Page titles are Inter. Set Octa with font-variation-settings so the width
 * axis travels.
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
    'A prototype that measures whether a country can anticipate change, coordinate around it and build what it decides to build.',
  manifest: '/manifest.webmanifest',
}

/* The browser chrome follows the page: the same pair as --background in
 * globals.css, chosen by the OS the way the tokens are. */
export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#202333' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* The document's language is the page's: English on the ground layer, a
       layer's own language under its slug. See D158. */
    <LangHtml className={`${inter.variable} ${interItalic.variable} ${octa.variable}`}>
      <body className="min-h-screen antialiased">
        <SkipLink className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-[1000] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-xs focus:font-medium focus:text-black" />

        {/* The whole nav travels with the reader. A section opens its pages from
            the header, and a menu the page can scroll out from under is a menu
            that has to be scrolled back to. `overflow-x: clip` in globals.css
            is what lets this stick. See D85. */}
        <SiteChrome>
        <ScrollAwareHeader>
          <div>
            <div className="m-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-3 sm:gap-x-8 sm:px-12 sm:py-4">
              {/* The compact lockup follows the parent Envisioning shell: the EV glyph
                  and product name share one row, while the descriptor sits beneath the
                  wordmark rather than changing the glyph's vertical alignment. */}
              <HomeLink className="inline-flex shrink-0 flex-col items-start text-[var(--foreground)]">
                <span className="inline-flex items-center gap-3">
                  <EnvisioningMark className="h-5 w-5" />
                  <span
                    className="font-display text-[34px] leading-none"
                    style={{ fontVariationSettings: '"wght" 500, "wdth" 100' }}
                  >
                    NCB
                  </span>
                </span>
                <span className="mt-1 pl-8 text-[9px] uppercase leading-[1.15] tracking-[0.06em] text-[var(--muted)]">
                  National Capability Benchmark
                </span>
              </HomeLink>
              <HeaderNav />
            </div>
          </div>

          {/* The deepest level of the nav tree shares the header surface instead
              of sitting behind its own separator. It renders nothing on a page
              that has no pages beside it and rides inside the sticky header so
              the whole navigation stays together. See D73 and D91. */}
          <SectionTabs />
        </ScrollAwareHeader>
        </SiteChrome>

        <main id="main" className="m-auto max-w-6xl px-6 py-12 sm:px-12 sm:py-16">
          {children}
        </main>

        <SiteChrome>
        <footer className="footer-band w-full border-t border-[var(--rule)]">
          <div className="m-auto max-w-6xl px-6 py-12 sm:px-12">
            <div className="flex flex-col gap-4 border-b border-[var(--rule)] pb-10 sm:flex-row sm:items-center sm:gap-8">
              <HomeLink className="footer-brand-lockup flex shrink-0 flex-col items-start">
                <span className="inline-flex items-center gap-3">
                  <EnvisioningMark className="h-[18px] w-[18px]" />
                  <span
                    className="font-display text-[32px] leading-none"
                    style={{ fontVariationSettings: '"wght" 500, "wdth" 100' }}
                  >
                    NCB
                  </span>
                </span>
                <span className="mt-1 pl-[30px] text-[9px] uppercase leading-[1.15] tracking-[0.06em] text-[var(--footer-muted)]">
                  National Capability Benchmark
                </span>
              </HomeLink>
              <FooterLead />
            </div>

            <FooterNav />
          </div>

          {/* The one place every page names the dataset it is showing and where the code lives. */}
          <div className="m-auto flex max-w-6xl flex-col gap-4 border-t border-[var(--rule)] px-6 pt-6 pb-14 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-12">
            <FooterMeta
              appVersion={APP_VERSION}
              datasetVersion={DATASET_VERSION}
              licenseHref={docHref(LICENSE_DOC)}
            />
          </div>
        </footer>
        </SiteChrome>

        {process.env.NODE_ENV === 'production' ? (
          <Script
            id="plausible-analytics"
            src={PLAUSIBLE_SCRIPT_URL}
            data-domain={PLAUSIBLE_DOMAIN}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </LangHtml>
  )
}
