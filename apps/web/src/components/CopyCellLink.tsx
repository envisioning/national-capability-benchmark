'use client'

import { useState } from 'react'

/** Copy a stable score-cell URL without nesting a second button in the peek trigger. */
export function CopyCellLink({ href }: { href: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    const absolute = new URL(href, window.location.origin).href
    try {
      await navigator.clipboard.writeText(absolute)
    } catch {
      const area = document.createElement('textarea')
      area.value = absolute
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      type="button"
      tabIndex={0}
      role="button"
      onClick={copy}
      className="text-[10px] text-[var(--muted)] underline decoration-dotted underline-offset-2 hover:text-[var(--foreground)] hover:decoration-solid"
      aria-label={copied ? 'Cell link copied' : 'Copy link to this cell'}
      title={copied ? 'Cell link copied' : 'Copy link to this cell'}
    >
      {copied ? 'Copied' : 'Copy link'}
    </button>
  )
}
