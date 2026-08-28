import Link from 'next/link'
import { DIMENSION_LABELS } from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { capabilityHref } from '@/lib/links'

/** The shared inline link to a capability's canonical landing page. */
export function CapabilityLink({
  dimension,
  children,
  className = 'hover:underline',
}: {
  dimension: Dimension
  children?: React.ReactNode
  className?: string
}) {
  return (
    <Link href={capabilityHref(dimension)} className={className}>
      {children ?? DIMENSION_LABELS[dimension]}
    </Link>
  )
}
