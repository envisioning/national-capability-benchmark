import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Link from 'next/link'
import { COUNTRIES, DATASET_VERSION, LICENSE_DOC, REPO_URL, docHref } from '@ncb/core'
import { LanguageSwitch } from '@/components/NavLinks'
import { FooterNav, HeaderNav } from '@/components/SiteNav'
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://national-capability-benchmark.vercel.app',
  ),
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
          <div className="m-auto flex max-w-6xl flex-wrap items-start gap-x-8 gap-y-4 px-6 py-6 sm:px-12">
            {/* The lockup: the short name carries the size, the long name sits
                under it in three lines so the block stays narrow beside the nav. */}
            <Link href="/" className="flex flex-col leading-none">
              <span
                className="font-display text-[40px] leading-[0.9]"
                style={{ fontVariationSettings: '"wght" 500, "wdth" 100' }}
              >
                NCB
              </span>
              <span className="mt-1.5 text-[10px] uppercase leading-[1.25] tracking-[0.06em] text-[var(--muted)]">
                National
                <br />
                Capability
                <br />
                Benchmark
              </span>
            </Link>
            <HeaderNav />
            {/* Language is an interpretation layer, not a section, so the switch
                sits apart from the nav and appears only where a counterpart
                page exists. See D35. */}
            <LanguageSwitch />
          </div>
        </header>

        <main id="main" className="m-auto max-w-6xl px-6 py-12 sm:px-12 sm:py-16">
          {children}
        </main>

        <footer className="w-full border-t border-[var(--rule)] bg-[var(--surface-sunken)]">
          <div className="m-auto max-w-6xl px-6 py-12 sm:px-12">
            <p className="max-w-3xl text-lg leading-relaxed">
              NCB is a prototype benchmark from Envisioning, a technology research institute and
              advisory.
            </p>
            <p className="mt-4 max-w-3xl text-xs text-[var(--muted)]">
              It scores {COUNTRIES.length} countries on nine dimensions using public data. Every
              score runs from 0 to 100 and carries its own confidence value. There is no overall
              ranking.
            </p>
            <FooterNav />
            {/* The one place every page names the dataset it is showing and where the code lives. */}
            <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--rule)] pt-6 text-xs text-[var(--muted)]">
              <span>Dataset {DATASET_VERSION}</span>
              <a href={REPO_URL} className="hover:text-[var(--foreground)]">
                Source and data on GitHub
              </a>
              <a href={docHref(LICENSE_DOC)} className="hover:text-[var(--foreground)]">
                MIT code, published data under its own terms
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
