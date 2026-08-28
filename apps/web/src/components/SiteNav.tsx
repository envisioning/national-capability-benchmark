'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FOOTER_NAV_GROUPS,
  METHOD_SUBNAV,
  PRIMARY_NAV,
  challengeHref,
  isMethodSection,
  methodSubnavOwns,
  primaryNavOwns,
  type MethodSectionHref,
  type PrimaryNavHref,
} from '@/lib/links'

const NAV_LINK =
  'text-xs font-medium transition-all duration-200 text-[var(--muted)] hover:text-[var(--foreground)]'
const NAV_CURRENT =
  'text-xs font-medium text-[var(--foreground)] underline decoration-[var(--primary)] decoration-2 underline-offset-8'
const NAV_SECTION =
  'text-xs font-medium text-[var(--foreground)] transition-all duration-200'

function footerOwns(href: string, pathname: string): boolean {
  if (href === challengeHref) return pathname === challengeHref
  if (href === '/method') return pathname === '/method'
  if ((METHOD_SUBNAV as readonly { href: string }[]).some((entry) => entry.href === href)) {
    return methodSubnavOwns(href as MethodSectionHref, pathname)
  }
  return primaryNavOwns(href as PrimaryNavHref, pathname)
}

/**
 * Site header nav. On method pages a second row stacks beneath the first,
 * aligned to the same column and rhythm as Countries through Challenge.
 */
export function HeaderNav() {
  const pathname = usePathname()
  const inMethod = isMethodSection(pathname)

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <nav aria-label="Primary" className="flex flex-wrap gap-x-6 gap-y-2">
        {PRIMARY_NAV.map((entry) => {
          if (entry.href === '/method' && inMethod) {
            return (
              <Link key={entry.href} href={entry.href} className={NAV_SECTION}>
                {entry.label}
              </Link>
            )
          }
          const current = primaryNavOwns(entry.href, pathname)
          return (
            <Link
              key={entry.href}
              href={entry.href}
              aria-current={current ? 'page' : undefined}
              className={current ? NAV_CURRENT : NAV_LINK}
            >
              {entry.label}
            </Link>
          )
        })}
      </nav>

      {inMethod ? (
        <nav aria-label="Method" className="flex flex-wrap gap-x-6 gap-y-2">
          {METHOD_SUBNAV.map((entry) => {
            const current = methodSubnavOwns(entry.href, pathname)
            return (
              <Link
                key={entry.href}
                href={entry.href}
                aria-current={current ? 'page' : undefined}
                className={current ? NAV_CURRENT : NAV_LINK}
              >
                {entry.label}
              </Link>
            )
          })}
        </nav>
      ) : null}
    </div>
  )
}

/** Footer navigation: same routes as the header, grouped in columns. */
export function FooterNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Site" className="mt-10 border-t border-[var(--rule)] pt-10">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {FOOTER_NAV_GROUPS.map((group) => (
          <div
            key={group.label}
            className={group.label === 'Method' ? 'sm:col-span-2' : undefined}
          >
            <h2 className="text-xs font-medium uppercase tracking-[0.05em] text-[var(--muted)]">
              {group.label}
            </h2>
            <ul
              className={
                group.label === 'Method'
                  ? 'mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3'
                  : 'mt-4 space-y-2'
              }
            >
              {group.items.map((entry) => {
                const current = footerOwns(entry.href, pathname)
                return (
                  <li key={entry.href}>
                    <Link
                      href={entry.href}
                      aria-current={current ? 'page' : undefined}
                      className={
                        current
                          ? 'text-xs font-medium text-[var(--foreground)]'
                          : NAV_LINK
                      }
                    >
                      {entry.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
