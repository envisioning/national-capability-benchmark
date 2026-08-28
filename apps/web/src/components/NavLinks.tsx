'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { languageCounterpart } from '@/lib/links'

const NAV = [
  { href: '/', label: 'Profiles' },
  { href: '/agenda', label: 'Agendas' },
  { href: '/indicators', label: 'Indicators' },
  { href: '/patterns', label: 'Patterns' },
  { href: '/diagnostics', label: 'Diagnostics' },
  { href: '/delphi', label: 'Delphi panel' },
  { href: '/method', label: 'Method' },
  { href: '/sources', label: 'Sources' },
  { href: '/limits', label: 'Limits' },
  { href: '/decisions', label: 'Decisions' },
  { href: '/glossary', label: 'Glossary' },
]

/** Whether a nav entry owns the current path, so section pages light their parent. */
function owns(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/' || pathname.startsWith('/country')
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function NavLinks() {
  const pathname = usePathname()
  return (
    <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium">
      {NAV.map((n) => {
        const current = owns(n.href, pathname)
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={current ? 'page' : undefined}
            className={
              current
                ? 'text-[var(--foreground)] underline decoration-[var(--primary)] decoration-2 underline-offset-8'
                : 'text-[var(--muted)] transition-all duration-200 hover:text-[var(--foreground)]'
            }
          >
            {n.label}
          </Link>
        )
      })}
    </nav>
  )
}

/**
 * The one language control. Rendered in the header, visible only on pages that
 * exist in the other language, per `languageCounterpart`. Language is an
 * interpretation layer, so this is not a nav destination. See D35.
 */
export function LanguageSwitch() {
  const pathname = usePathname()
  const counterpart = languageCounterpart(pathname)
  if (!counterpart) return null
  return (
    <Link
      href={counterpart.href}
      lang={counterpart.lang}
      className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[var(--rule)] px-3 py-1 text-xs font-medium text-[var(--muted)] transition-all duration-200 hover:text-[var(--foreground)]"
    >
      <Icon name="languages" size={13} />
      {counterpart.label}
    </Link>
  )
}
