'use client'

import { useEffect, useRef } from 'react'
import { Icon } from '@/components/Icon'

/**
 * A closed section that keeps its content in the document.
 *
 * Search still finds the content, the browser opens it on a find, and a print
 * carries it. An address that names the section, or anything inside it, opens
 * it, and so does a link to it on the same page, where the browser fires no hash
 * change when the address is already current. This is the one disclosure on the
 * site with a chevron and an address. See D189 and D190.
 */
export function Fold({
  id,
  summary,
  children,
  defaultOpen = false,
  className = 'border-b border-[var(--rule)]',
  section = false,
}: {
  id?: string
  summary: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
  /** One of a page's capability sections, which the rail and the toggle reach. */
  section?: boolean
}) {
  const ref = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const open = () => {
      el.open = true
    }
    const openIfNamed = (): Element | null => {
      const hash = window.location.hash.slice(1)
      if (!hash) return null
      const name = decodeURIComponent(hash)
      const target = id === name ? el : el.querySelector(`[id="${CSS.escape(name)}"]`)
      if (target) open()
      return target
    }
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (id && target instanceof Element && target.closest(`a[href="#${id}"]`)) open()
    }
    openIfNamed()?.scrollIntoView()
    const onHash = () => {
      openIfNamed()
    }
    window.addEventListener('hashchange', onHash)
    window.addEventListener('beforeprint', open)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('beforeprint', open)
      document.removeEventListener('click', onClick)
    }
  }, [id])

  return (
    <details
      ref={ref}
      id={id}
      open={defaultOpen || undefined}
      data-fold-section={section ? '' : undefined}
      className={`group scroll-mt-40 ${className}`}
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 py-4 [&::-webkit-details-marker]:hidden">
        <Icon
          name="chevron-down"
          size={16}
          className="shrink-0 -rotate-90 text-[var(--muted)] transition-transform duration-200 group-open:rotate-0"
        />
        <div className="min-w-0 grow">{summary}</div>
      </summary>
      <div className="pb-8 pt-2">{children}</div>
    </details>
  )
}
