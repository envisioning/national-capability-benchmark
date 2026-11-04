'use client'

import { useEffect, useState } from 'react'

/**
 * "On this page", read from the page's own headings, so it cannot disagree with
 * them. A heading without an address gets one from its text. The box holds its
 * height before hydration, so the page does not jump when the links arrive. See
 * D190.
 */
export function PageContents() {
  const [items, setItems] = useState<Array<{ id: string; text: string }>>([])

  useEffect(() => {
    const found = [...document.querySelectorAll<HTMLElement>('main h2')]
      .filter((h) => h.offsetParent !== null)
      .map((h) => {
        const text = h.textContent?.trim() ?? ''
        const owner = h.closest<HTMLElement>('[id]')
        const id =
          h.id ||
          owner?.id ||
          text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        if (!h.id && !owner) h.id = id
        h.classList.add('scroll-mt-24')
        return { id, text }
      })
    setItems(found)
  }, [])

  return (
    <nav
      aria-label="On this page"
      className="mb-10 min-h-16 border-y border-[var(--rule)] py-3 text-xs leading-relaxed"
    >
      <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {items.map((item) => (
          <li key={item.id} className="break-inside-avoid py-0.5">
            <a href={`#${item.id}`} className="text-[var(--muted)] underline-offset-4 hover:text-[var(--foreground)] hover:underline">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
