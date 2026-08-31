import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  CHALLENGE_STATUS_LABELS,
  COUNTRY_NAMES,
  DIMENSION_LABELS,
} from '@ncb/core'
import { Confidence, CountryLabel, Meta, Note, PageTitle, Section } from '@/components/ui'
import { loadDispute } from '@/lib/data'
import { capabilityHref, objectionsHref } from '@/lib/links'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const dispute = await loadDispute(id)
  if (!dispute) return {}
  const country = COUNTRY_NAMES[dispute.target.iso3] ?? dispute.target.iso3
  return {
    title: `Dispute for ${country} ${DIMENSION_LABELS[dispute.target.dimension]}, NCB`,
    description: 'A public objection to one National Capability Benchmark score.',
  }
}

export default async function ObjectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const dispute = await loadDispute(id)
  if (!dispute) notFound()

  const country = COUNTRY_NAMES[dispute.target.iso3] ?? dispute.target.iso3

  return (
    <>
      <p className="mb-6">
        <Link href={objectionsHref} className="text-xs text-[var(--muted)] underline underline-offset-4">
          All objections
        </Link>
      </p>
      <PageTitle>A reader challenged this score</PageTitle>
      <p className="mt-4 flex flex-wrap gap-2">
        <Meta>{CHALLENGE_STATUS_LABELS[dispute.status]}</Meta>
        <Meta>submitted {dispute.submittedAt.slice(0, 10)}</Meta>
      </p>

      <Section title="This score is under review">
        <div className="grid max-w-2xl grid-cols-[auto_1fr] gap-x-5 gap-y-3 text-lg">
          <span className="text-[var(--muted)]">Country</span>
          <span>
            <CountryLabel iso3={dispute.target.iso3} name={country} />
          </span>
          <span className="text-[var(--muted)]">Dimension</span>
          <Link
            href={capabilityHref(dispute.target.dimension)}
            className="underline underline-offset-4"
          >
            {DIMENSION_LABELS[dispute.target.dimension]}
          </Link>
          <span className="text-[var(--muted)]">Score</span>
          <span className="tabular-nums">{dispute.target.value?.toFixed(1) ?? 'no data'}</span>
          <span className="text-[var(--muted)]">Confidence</span>
          <Confidence value={dispute.target.confidence} />
        </div>
      </Section>

      <Section title="The reader gave an argument">
        <p className="max-w-3xl whitespace-pre-wrap text-lg leading-relaxed">{dispute.argument}</p>
        {dispute.sourceUrl ? (
          <p className="mt-5 text-xs leading-relaxed">
            <a
              href={dispute.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              Open the cited source
            </a>
          </p>
        ) : null}
      </Section>

      <Section title="A maintainer records the outcome">
        {dispute.status === 'submitted' ? (
          <Note>This submission is awaiting maintainer review.</Note>
        ) : dispute.maintainerResponse ? (
          <p className="max-w-3xl whitespace-pre-wrap text-lg leading-relaxed">
            {dispute.maintainerResponse}
          </p>
        ) : (
          <p className="text-lg text-[var(--muted)]">No response has been recorded.</p>
        )}
        {dispute.maintainerSignature ? (
          <p className="mt-5 text-xs text-[var(--muted)]">
            Signed by {dispute.maintainerSignature}
          </p>
        ) : null}
      </Section>
    </>
  )
}
