'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LEXICONS, REPO_URL, fill } from '@ncb/core'
import type { Lang } from '@ncb/core'
import { chromeWords, pathLang, type ChromeWords } from '@/lib/chrome'
import { absoluteHref, changelogHref } from '@/lib/links'
import { Button } from '@/components/ui'

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
    <html lang={LEXICONS[lang].htmlLang} className={className}>
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

/**
 * The citation box at the foot of every page: the dataset version, the page's
 * own address and the day it was read, in the page's language, with a copy
 * button. The address is the site origin plus the path, so a preview host is
 * never what a reader cites. See D193.
 */
export function CiteLine({ datasetVersion }: { datasetVersion: string }) {
  const { lang, words } = useChrome()
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)
  const c = words.cite
  const date = new Date().toLocaleDateString(LEXICONS[lang].numberLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const text = fill(c.template, { version: datasetVersion, url: absoluteHref(pathname ?? '/'), date })
  return (
    <aside aria-label={c.heading} className="mt-16 max-w-3xl rounded-lg border border-[var(--rule)] px-4 py-4">
      <p className="text-xs uppercase tracking-[0.05em] text-[var(--muted)]">{c.heading}</p>
      <p className="mt-2 text-xs text-[var(--muted)]">{c.lead}</p>
      <p className="mt-1 break-words text-xs" suppressHydrationWarning>
        {text}
      </p>
      <Button
        size="sm"
        className="mt-3"
        onClick={() => {
          void navigator.clipboard?.writeText(text).then(() => setCopied(true))
        }}
      >
        {copied ? c.copied : c.copy}
      </Button>
    </aside>
  )
}
