import Link from 'next/link'
import { CONTRIBUTION_EFFORT_LABELS } from '@ncb/core'
import type { ContributionId, ContributionWay } from '@ncb/core'
import { CONTRIBUTION_ICON, Icon } from '@/components/Icon'
import { contributionHref, contributionIsExternal } from '@/lib/links'

/**
 * The ways to take part, drawn from the registry.
 *
 * Every surface that invites a contribution renders this, so the objections
 * page, the support page and the gaps page cannot describe the same act in
 * three vocabularies. The registry holds what each one is; this holds how it
 * looks; `links.ts` holds where it goes. See D78.
 */
export function ContributionList({
  ways,
  /** Show the effort tier on each card. Off where the whole list is one tier. */
  showEffort = true,
}: {
  ways: readonly ContributionWay[]
  showEffort?: boolean
}) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {ways.map((way) => {
        const href = contributionHref(way)
        const external = contributionIsExternal(way)
        return (
          <li
            key={way.id}
            className="rounded-xl border border-[var(--rule)] p-5 transition-all duration-200 hover:border-[var(--foreground)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="flex items-center gap-2.5 text-xl font-medium tracking-tight">
                <Icon
                  name={CONTRIBUTION_ICON[way.id as ContributionId]}
                  size={18}
                  className="text-[var(--muted)]"
                />
                {way.label}
              </h3>
              {showEffort ? (
                <span className="shrink-0 rounded-full border border-[var(--rule)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                  {CONTRIBUTION_EFFORT_LABELS[way.effort]}
                </span>
              ) : null}
            </div>

            <p className="mt-3 text-lg leading-relaxed">{way.ask}</p>

            <dl className="mt-4 space-y-2 text-xs leading-relaxed">
              <div>
                <dt className="inline font-medium">It needs. </dt>
                <dd className="inline text-[var(--muted)]">{way.requires}</dd>
              </div>
              <div>
                <dt className="inline font-medium">Usually. </dt>
                <dd className="inline text-[var(--muted)]">{way.who}</dd>
              </div>
              <div>
                <dt className="inline font-medium">What it changes. </dt>
                <dd className="inline text-[var(--muted)]">{way.outcome}</dd>
              </div>
            </dl>

            <p className="mt-4 text-xs font-medium">
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 underline underline-offset-4"
                >
                  Start here
                  <Icon name="arrow-right" size={14} />
                </a>
              ) : (
                <Link
                  href={href}
                  className="inline-flex items-center gap-1.5 underline underline-offset-4"
                >
                  Start here
                  <Icon name="arrow-right" size={14} />
                </Link>
              )}
            </p>
          </li>
        )
      })}
    </ul>
  )
}
