'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

function snippetFor({ src, title, height }: { src: string; title: string; height: number }) {
  return `<iframe src="${escapeAttribute(src)}" title="${escapeAttribute(title)}" loading="lazy" width="100%" height="${height}" style="border:0" referrerpolicy="strict-origin-when-cross-origin"></iframe>`
}

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const input = document.createElement('textarea')
  input.value = value
  input.setAttribute('readonly', '')
  input.style.position = 'fixed'
  input.style.opacity = '0'
  document.body.appendChild(input)
  input.select()
  const copied = document.execCommand('copy')
  input.remove()
  if (!copied) throw new Error('Copy failed')
}

/** One-click iframe code for pages that can be embedded elsewhere. */
export function EmbedCode({
  src,
  title,
  height,
  label = 'Embed this profile',
}: {
  src: string
  title: string
  height: number
  label?: string
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const snippet = snippetFor({ src, title, height })

  async function copy() {
    try {
      await copyText(snippet)
      setState('copied')
    } catch {
      setState('failed')
    }
  }

  return (
    <div className="inline-flex flex-wrap items-center gap-3">
      <Button type="button" size="sm" onClick={copy}>
        {label}
      </Button>
      <span aria-live="polite" className="text-xs text-[var(--muted)]">
        {state === 'copied'
          ? 'Copied iframe code'
          : state === 'failed'
            ? 'Copy failed. Select the code below.'
            : null}
      </span>
      <code className="basis-full max-w-full overflow-x-auto rounded-md bg-[var(--surface-sunken)] px-2 py-1 text-xs text-[var(--muted)]">
        {snippet}
      </code>
    </div>
  )
}
