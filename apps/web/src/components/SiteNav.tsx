'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '@/components/Icon'
import { Flag } from '@/components/ui'
import { NavCountryShape } from '@/components/NavCountryShape'
import {
  FOOTER_NAV_GROUPS,
  navRows,
  nodeOwns,
  pathCountry,
  sectionMenuEntries,
  type NavNode,
  type NavRow,
} from '@/lib/nav'

/* Navigation carries label type, the same 12px the brand gives every button
   and every table header. The crumb band and the tab strip already sit at that
   size, so all three levels of the tree read as one system and the lime
   underline, not a font size, says where the reader is. */
const SECTION_LINK =
  'inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-[var(--muted)] transition-colors duration-200 hover:bg-[var(--surface-sunken)] hover:text-[var(--foreground)]'
const SECTION_CURRENT =
  'inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold text-[var(--foreground)]'
/* The lime mark sits on the label rather than on the control, because the
   control now also holds a chevron and an underlined chevron is a smudge. */
const SECTION_MARK = 'underline decoration-[var(--primary)] decoration-2 underline-offset-[6px]'
const SECTION_MOBILE_LINK =
  'flex w-full items-center rounded-md px-3 py-3 text-xs font-medium text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--surface-sunken)]'
const SECTION_MOBILE_CURRENT =
  'flex w-full items-center rounded-md bg-[var(--surface-sunken)] px-3 py-3 text-xs font-semibold text-[var(--foreground)]'

const DISCLOSURE_MOBILE =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--muted)] transition-colors duration-200 hover:bg-[var(--surface-sunken)] hover:text-[var(--foreground)]'
/* A panel at Card geometry: rounded-lg over a 1px rule, and no shadow, because
   the viewer publishes none. It sits on the raised surface so the page reads
   through the rule rather than through the panel. See D81. */
const MENU_PANEL =
  'rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-1'
/* A row of words needs the width of its longest word. A shape needs enough to
   be read as one, which is the width the countries grid gives its cards. */
const MENU_WIDTH = 'min-w-[13rem]'
const MENU_WIDTH_PREVIEW = 'w-[15rem]'
const MENU_ITEM =
  'flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-[var(--muted)] transition-colors duration-200 hover:bg-[var(--surface-sunken)] hover:text-[var(--foreground)]'
const MENU_ITEM_CURRENT =
  'flex items-center gap-2 rounded-md bg-[var(--surface-sunken)] px-3 py-2 text-xs font-semibold text-[var(--foreground)]'

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

/** One entry inside an opened section, on either band. */
function MenuItem({ node, current, mobile }: { node: NavNode; current: boolean; mobile?: boolean }) {
  return (
    <Link
      href={node.href}
      lang={node.lang}
      role="menuitem"
      aria-current={current ? 'page' : undefined}
      className={`${current ? MENU_ITEM_CURRENT : MENU_ITEM}${mobile ? ' py-2.5' : ''}`}
    >
      {node.iso3 ? <Flag iso3={node.iso3} /> : null}
      {node.label}
    </Link>
  )
}

/**
 * A section, and the pages under it.
 *
 * One control, not two. The section is a link, hovering it opens what it
 * holds, and a click always means the same thing, which is go there. The panel
 * is the row the tab strip would otherwise show only once the reader is
 * already inside, read from the same level of the same tree, so a menu and a
 * tab strip cannot disagree about what a section holds.
 *
 * The panel hangs directly under the link, and the gap above it is a
 * transparent part of the panel rather than a gap: empty space between a
 * trigger and what it opens is somewhere for the pointer to fall through. It
 * closes when the pointer leaves both, after a beat long enough to survive a
 * cut corner, and on Escape with focus back on the link, and on arriving at a
 * new page.
 *
 * A keyboard has no hover, so ArrowDown from the link opens the panel and
 * lands on its first item, and the arrow keys walk it from there because
 * `role="menu"` promises they will. See D85.
 */
function SectionMenu({ node, current }: { node: NavNode; current: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  /* Which item the keyboard asked for, held until the panel exists to hold it. */
  const [pendingFocus, setPendingFocus] = useState<number | null>(null)
  const wrapper = useRef<HTMLDivElement>(null)
  const link = useRef<HTMLAnchorElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const closing = useRef<ReturnType<typeof setTimeout> | null>(null)
  const panelId = useId()
  const entries = sectionMenuEntries(node, pathname)

  /** The items, in the order the arrow keys walk them. */
  function focusItem(index: number) {
    const items = Array.from(
      panel.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]') ?? [],
    )
    if (items.length === 0) return
    items[(index + items.length) % items.length]?.focus()
  }

  function hold() {
    if (!closing.current) return
    clearTimeout(closing.current)
    closing.current = null
  }

  /* A pointer cutting the corner between the link and the panel should not
     close the thing it is on its way to. */
  function closeSoon() {
    hold()
    closing.current = setTimeout(() => setOpen(false), 140)
  }

  /* A keyboard open has to wait for the panel to mount before it can focus
     anything in it, and the wait is a render rather than a frame: a tab that
     is not painting never runs a frame callback. */
  useEffect(() => {
    if (!open || pendingFocus === null) return
    focusItem(pendingFocus)
    setPendingFocus(null)
  }, [open, pendingFocus])

  /* Arriving somewhere is leaving the menu, whether or not the reader used it. */
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => () => hold(), [])

  useEffect(() => {
    if (!open) return
    /* Escape is read from the document rather than from the panel: a hover
       opens the menu without moving focus into it. */
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setOpen(false)
      link.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  /* The tree says a menu has a picture and what it is of; this decides whether
     there is one to draw. A country menu opened away from a country has
     nothing to show, and shows nothing. */
  const previewIso3 = node.menuPreview === 'country' ? pathCountry(pathname) : null

  const label = current ? <span className={SECTION_MARK}>{node.label}</span> : node.label

  if (entries.length === 0) {
    return (
      <Link
        href={node.href}
        aria-current={current ? 'page' : undefined}
        className={current ? SECTION_CURRENT : SECTION_LINK}
      >
        {label}
      </Link>
    )
  }

  return (
    <div
      ref={wrapper}
      className="relative"
      onMouseEnter={() => {
        hold()
        setOpen(true)
      }}
      onMouseLeave={closeSoon}
    >
      <Link
        ref={link}
        href={node.href}
        aria-current={current ? 'page' : undefined}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
          event.preventDefault()
          hold()
          setOpen(true)
          setPendingFocus(event.key === 'ArrowDown' ? 0 : -1)
        }}
        className={current ? SECTION_CURRENT : SECTION_LINK}
      >
        {label}
        <Icon
          name="chevron-down"
          size={13}
          className={`text-[var(--muted)] transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </Link>

      {open ? (
        /* The bridge: the offset belongs to the panel, so the pointer never
           crosses dead space on its way down. */
        <div className="absolute right-0 top-full z-50 pt-2">
          <div
            ref={panel}
            id={panelId}
            role="menu"
            aria-label={node.label}
            onKeyDown={(event) => {
              const items = Array.from(
                panel.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]') ?? [],
              )
              const index = items.indexOf(document.activeElement as HTMLAnchorElement)
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                focusItem(index + 1)
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault()
                focusItem(index - 1)
              }
              if (event.key === 'Home') {
                event.preventDefault()
                focusItem(0)
              }
              if (event.key === 'End') {
                event.preventDefault()
                focusItem(-1)
              }
            }}
            className={`${MENU_PANEL} ${previewIso3 ? MENU_WIDTH_PREVIEW : MENU_WIDTH}`}
          >
            {previewIso3 ? <NavCountryShape iso3={previewIso3} /> : null}
            {entries.map((entry) => (
              <MenuItem key={entry.href} node={entry} current={nodeOwns(entry, pathname)} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

/** The section parents, and what each of them opens. */
function SectionLinks({ sections }: { sections: NavRow }) {
  return (
    <nav aria-label="Sections" className="flex flex-wrap items-center justify-end gap-1">
      {sections.entries.map((node) => (
        <SectionMenu key={node.href} node={node} current={node === sections.active} />
      ))}
    </nav>
  )
}

/**
 * The same sections in the sheet, where a section opens in place rather than
 * over the page.
 *
 * A phone has no room for a panel beside anything, and the sheet is already
 * the whole width, so the pages drop under the section that holds them. The
 * section the reader is in opens on arrival, because that is the one set they
 * are demonstrably reading.
 */
function MobileSections({ sections }: { sections: NavRow }) {
  const pathname = usePathname()
  const [openHref, setOpenHref] = useState<string | null>(sections.active?.href ?? null)

  return (
    <nav aria-label="Mobile sections" className="flex flex-col gap-1">
      {sections.entries.map((node) => {
        const entries = sectionMenuEntries(node, pathname)
        const open = openHref === node.href
        const panelId = `site-nav-mobile-${node.href.replace(/\W+/g, '-')}`
        return (
          <div key={node.href}>
            <div className="flex items-center gap-1">
              <Link
                href={node.href}
                aria-current={node === sections.active ? 'page' : undefined}
                className={node === sections.active ? SECTION_MOBILE_CURRENT : SECTION_MOBILE_LINK}
              >
                {node.label}
              </Link>
              {entries.length > 0 ? (
                <button
                  type="button"
                  aria-label={`${node.label} pages`}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenHref(open ? null : node.href)}
                  className={DISCLOSURE_MOBILE}
                >
                  <Icon
                    name="chevron-down"
                    size={16}
                    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                  />
                </button>
              ) : null}
            </div>
            {open && entries.length > 0 ? (
              <div
                id={panelId}
                role="menu"
                aria-label={node.label}
                className="mb-1 ml-3 flex flex-col border-l border-[var(--rule)] pl-2"
              >
                {entries.map((entry) => (
                  <MenuItem
                    key={entry.href}
                    node={entry}
                    current={nodeOwns(entry, pathname)}
                    mobile
                  />
                ))}
              </div>
            ) : null}
          </div>
        )
      })}
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

      {/* The sheet rides inside a sticky header, and a sticky box taller than the
          window has a bottom the reader cannot scroll to. It carries its own
          scroll instead, sized to leave the lockup row and the tabs on screen.
          See D85. */}
      {menuOpen ? (
        <div
          id="site-nav-mobile"
          className="max-h-[70dvh] basis-full overflow-y-auto border-t border-[var(--rule)] pt-3 md:hidden"
        >
          <MobileSections sections={sections} />
        </div>
      ) : null}

      {trail.length > 0 ? (
        <nav aria-label="Breadcrumb" className="basis-full">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 md:justify-end">
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
        {/* The sections sit at the right edge from md up, so every level below
            them hangs from the same edge and the eye tracks one column down.
            Below md the sections fold into the sheet and there is no right edge
            to agree with, so the tabs read from the left. */}
        <ul className="-mb-px flex flex-wrap gap-x-6 pt-3 md:justify-end">
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
      {/* Method holds nine pages and takes two columns of the five. */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
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
