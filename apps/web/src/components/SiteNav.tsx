'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Icon } from '@/components/Icon'
import { Flag } from '@/components/ui'
import { FOOTER_NAV_GROUPS, navRows, nodeOwns, type NavNode, type NavRow } from '@/lib/nav'

const SECTION_LINK =
  'inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-[var(--muted)] transition-colors duration-200 hover:bg-[var(--surface-sunken)] hover:text-[var(--foreground)]'
const SECTION_CURRENT =
  'inline-flex items-center rounded-md px-3 py-1.5 text-sm font-semibold text-[var(--foreground)] underline decoration-[var(--primary)] decoration-2 underline-offset-[6px]'
const SECTION_MOBILE_LINK =
  'flex w-full items-center rounded-md px-3 py-3 text-sm font-medium text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--surface-sunken)]'
const SECTION_MOBILE_CURRENT =
  'flex w-full items-center rounded-md bg-[var(--surface-sunken)] px-3 py-3 text-sm font-semibold text-[var(--foreground)]'

const CRUMB_LINK =
  'text-xs font-medium text-[var(--muted)] transition-all duration-200 hover:text-[var(--foreground)]'
/* A step in the trail that happens to be an ancestor of the current page. It
   is not where the reader is, so it carries no marker. */
const CRUMB_CURRENT = 'text-xs font-medium text-[var(--foreground)]'
/* The selected one of several alternatives offered inside a single crumb. The
   lime underline means the same here as on a section and on a tab. */
const CRUMB_SELECTED =
  'text-xs font-medium text-[var(--foreground)] underline decoration-[var(--primary)] decoration-2 underline-offset-4'

const TAB =
  'inline-block border-b-2 border-transparent pb-3 text-xs font-medium text-[var(--muted)] transition-all duration-200 hover:text-[var(--foreground)]'
const TAB_CURRENT =
  'inline-block border-b-2 border-[var(--primary)] pb-3 text-xs font-medium text-[var(--foreground)]'

/**
 * One crumb: a single place in the trail, or a choice between the readings of
 * one country.
 *
 * A crumb holding one node is a step, and a step is not where the reader is,
 * so it gets no marker. A crumb holding several is a selection, and the
 * selected one carries the lime underline the sections and the tabs use. See
 * D73.
 */
function Crumb({ nodes, active }: { nodes: NavNode[]; active: NavNode | null }) {
  const selecting = nodes.length > 1
  return (
    <span className="inline-flex items-center gap-1.5">
      {nodes.map((node, index) => {
        const current = node === active
        const style = current ? (selecting ? CRUMB_SELECTED : CRUMB_CURRENT) : CRUMB_LINK
        return (
          <span key={node.href} className="inline-flex items-center gap-1.5">
            {index > 0 ? (
              <span aria-hidden className="text-[var(--muted)] opacity-50">
                ·
              </span>
            ) : null}
            <Link
              href={node.href}
              lang={node.lang}
              aria-current={current ? 'page' : undefined}
              className={`inline-flex items-center gap-1.5 ${style}`}
            >
              {node.iso3 ? <Flag iso3={node.iso3} /> : null}
              {node.label}
            </Link>
          </span>
        )
      })}
    </span>
  )
}

/** The section parents, rendered once for the desktop band and once in the mobile menu. */
function SectionLinks({ sections, mobile = false }: { sections: NavRow; mobile?: boolean }) {
  return (
    <nav
      aria-label={mobile ? 'Mobile sections' : 'Sections'}
      className={mobile ? 'flex flex-col gap-1' : 'flex flex-wrap items-center justify-end gap-1'}
    >
      {sections.entries.map((node) => (
        <Link
          key={node.href}
          href={node.href}
          aria-current={node === sections.active ? 'page' : undefined}
          className={
            mobile
              ? node === sections.active
                ? SECTION_MOBILE_CURRENT
                : SECTION_MOBILE_LINK
              : node === sections.active
                ? SECTION_CURRENT
                : SECTION_LINK
          }
        >
          {node.label}
        </Link>
      ))}
    </nav>
  )
}

/**
 * The sections, and the trail into wherever the reader is.
 *
 * One tree in `lib/nav.ts` decides both. The levels above the deepest become
 * this breadcrumb; the deepest becomes the tab strip below the header, drawn
 * by `SectionTabs`. Two bands, one walk, so the trail and the sibling pages
 * can never disagree about where the reader is. See D73.
 */
export function HeaderNav() {
  const pathname = usePathname()
  const rows = navRows(pathname)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const sections = rows[0]
  if (!sections) return null
  /* A trail of one crumb repeats the section already underlined above it, so
     it carries nothing. Method and Capabilities go straight to their tabs. */
  const full: NavRow[] = rows.slice(0, -1)
  const trail: NavRow[] = full.length > 1 ? full : []

  return (
    <div className="contents">
      <div className="hidden md:ml-auto md:block">
        <SectionLinks sections={sections} />
      </div>

      <button
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="site-nav-mobile"
        onClick={() => setMenuOpen((open) => !open)}
        className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md text-[var(--foreground)] transition-colors hover:bg-[var(--surface-sunken)] md:hidden"
      >
        <Icon name={menuOpen ? 'x' : 'menu'} size={20} />
      </button>

      {menuOpen ? (
        <div
          id="site-nav-mobile"
          className="basis-full border-t border-[var(--rule)] pt-3 md:hidden"
        >
          <SectionLinks sections={sections} mobile />
        </div>
      ) : null}

      {trail.length > 0 ? (
        <nav aria-label="Breadcrumb" className="basis-full">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {trail.map((row, index) => (
              <li key={row.parent?.href ?? 'root'} className="flex items-center gap-x-2">
                {index > 0 ? (
                  <span aria-hidden className="text-[var(--muted)] opacity-40">
                    /
                  </span>
                ) : null}
                {/* The sections are drawn in full above, so the trail names only
                    the current one. Every level below is a set of alternatives
                    and the crumb offers all of them. */}
                <Crumb
                  nodes={index === 0 ? (row.active ? [row.active] : []) : row.entries}
                  active={row.active}
                />
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
    </div>
  )
}

/**
 * The pages of wherever the reader is, as a tab strip on its own rule under
 * the header. It is the deepest level of the same walk `HeaderNav` renders.
 */
export function SectionTabs() {
  const pathname = usePathname()
  const rows = navRows(pathname)
  if (rows.length < 2) return null
  const tabs = rows[rows.length - 1]
  if (!tabs) return null

  return (
    <div className="w-full border-b border-[var(--rule)]">
      <nav
        aria-label={tabs.parent?.label ?? 'Pages'}
        className="m-auto max-w-6xl px-6 sm:px-12"
      >
        <ul className="-mb-px flex flex-wrap gap-x-6 pt-3">
          {tabs.entries.map((node) => (
            <li key={node.href}>
              <Link
                href={node.href}
                lang={node.lang}
                aria-current={node === tabs.active ? 'page' : undefined}
                className={node === tabs.active ? TAB_CURRENT : TAB}
              >
                {node.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

/** Footer navigation: the same tree, grouped in columns. */
export function FooterNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Site" className="mt-10">
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
              {group.items.map((node) => {
                const current = nodeOwns(node, pathname)
                return (
                  <li key={node.href}>
                    <Link
                      href={node.href}
                      aria-current={current ? 'page' : undefined}
                      className={
                        current
                          ? 'text-xs font-medium text-[var(--foreground)]'
                          : 'text-xs font-medium text-[var(--muted)] transition-all duration-200 hover:text-[var(--foreground)]'
                      }
                    >
                      {node.label}
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
