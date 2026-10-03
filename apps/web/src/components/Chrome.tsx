'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { REPO_URL } from '@ncb/core'
import type { Lang } from '@ncb/core'
import { chromeWords, pathLang, type ChromeWords } from '@/lib/chrome'
import { changelogHref } from '@/lib/links'

/**
 * The parts of the root layout that speak, in the language of the page they
 * frame. The root layout is shared by every route and cannot read the path,
 * so each of these reads it here, on the server render as on the client,
 * and the document's language is right in the HTML a crawler or a screen
 * reader receives. See D158.
 */
export function useChrome(): { lang: Lang; words: ChromeWords } {
  const lang = pathLang(usePathname())
  return { lang, words: chromeWords(lang) }
}

/** The document element, with the language of the page inside it. */
export function LangHtml({ className, children }: { className: string; children: React.ReactNode }) {
  const { lang } = useChrome()
  return (
    <html lang={lang} className={className}>
      {children}
    </html>
  )
}

export function SkipLink({ className }: { className: string }) {
  const { words } = useChrome()
  return (
    <a href="#main" className={className}>
      {words.skipToContent}
    </a>
  )
}

/** The wordmark link: its accessible name is the only word it carries. */
export function HomeLink({ className, children }: { className: string; children: React.ReactNode }) {
  const { words } = useChrome()
  return (
    <Link href="/" aria-label={words.home} className={className}>
      {children}
    </Link>
  )
}

/** The footer's sentence about what the project measures. */
export function FooterLead() {
  const { words } = useChrome()
  return (
    <div>
      <p className="max-w-3xl text-lg leading-relaxed">{words.footer.tagline}</p>
      <p className="mt-2 max-w-3xl text-xs text-[var(--footer-muted)]">{words.footer.sub}</p>
    </div>
  )
}

/** The footer's last row: who builds it, the versions, the code and the licence. */
export function FooterMeta({
  appVersion,
  datasetVersion,
  licenseHref,
}: {
  appVersion: string
  datasetVersion: string
  licenseHref: string
}) {
  const { words } = useChrome()
  const f = words.footer
  return (
    <>
      <p>
        {f.poweredBefore}
        <a
          href="https://envisioning.com"
          rel="noopener external"
          className="footer-strong-link underline underline-offset-2"
        >
          Envisioning
        </a>
        {f.poweredAfter}
      </p>
      <nav aria-label={f.projectAria}>
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          <li>
            {f.app} {appVersion}
          </li>
          <li>
            {f.dataset} {datasetVersion}
          </li>
          <li>
            <Link href={changelogHref}>{f.changelog}</Link>
          </li>
          <li>
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href={licenseHref}>{f.license}</a>
          </li>
        </ul>
      </nav>
    </>
  )
}
