'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'

/**
 * The page's address with a copy button. The address is built on the server
 * from the site origin, so what the reader copies is the canonical one and
 * never a preview host. See D192.
 */
export function ShareLink({ url, label, copied }: { url: string; label: string; copied: string }) {
  const [done, setDone] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <code className="break-all text-xs text-[var(--muted)]">{url}</code>
      <Button
        size="sm"
        onClick={() => {
          void navigator.clipboard?.writeText(url).then(() => setDone(true))
        }}
      >
        {done ? copied : label}
      </Button>
    </div>
  )
}
