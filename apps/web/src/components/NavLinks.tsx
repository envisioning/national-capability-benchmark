'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Icon } from '@/components/Icon'
import { languageCounterpart } from '@/lib/links'

/**
 * The one language control. Rendered in the header, visible only on pages that
 * exist in the other language, per `languageCounterpart`. Language is an
 * interpretation layer, so this is not a nav destination. See D35.
 */
export function LanguageSwitch() {
  const pathname = usePathname()
  const [search, setSearch] = useState('')
  useEffect(() => {
    const current = new URLSearchParams(window.location.search)
    if (!current.has('lang') && pathname === '/' && navigator.language.toLowerCase().startsWith('pt')) {
      setSearch('lang=pt-BR')
      return
    }
    setSearch(window.location.search)
  }, [pathname])
  const counterpart = languageCounterpart(pathname, search)
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
