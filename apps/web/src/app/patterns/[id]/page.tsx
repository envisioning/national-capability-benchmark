import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { COUNTRY_NAMES, DIMENSION_LABELS, INDICATORS_BY_ID } from '@ncb/core'
import type { Dimension, EvidenceRecord } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import {
  PatternLimits,
  PatternMechanism,
  PatternMeta,
  PatternMetrics,
} from '@/components/PatternCard'
import { Eyebrow, Headline, PageTitle, Section } from '@/components/ui'
import { loadEvidence } from '@/lib/data'
import { evidenceHref, indicatorHref, patternsHref } from '@/lib/links'

export const dynamic = 'force-dynamic'

async function findRecord(id: string): Promise<EvidenceRecord | null> {
  const records = await loadEvidence()
  return records.find((r) => r.id === id) ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const record = await findRecord(id)
  if (!record) return {}
  return {
    title: `${record.title}, NCB`,
    description: record.claim,
  }
}

export default async function PatternPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const record = await findRecord(id)
  if (!record) notFound()

  const records = await loadEvidence()
  const def = INDICATORS_BY_ID[record.indicatorId]
  const dimension = def?.dimension as Dimension | undefined
  const country = COUNTRY_NAMES[record.iso3] ?? record.iso3
  const sameCountry = records.filter((r) => r.iso3 === record.iso3 && r.id !== record.id)
  const sameIndicator = records.filter(
    (r) => r.indicatorId === record.indicatorId && r.iso3 !== record.iso3,
  )

  return (
    <>
      <p className="mb-6">
        <Link
          href={patternsHref}
          className="inline-flex items-center gap-2 text-xs text-[var(--muted)] underline underline-offset-4"
        >
          <Icon name="arrow-left" size={13} />
          All documented deliveries
        </Link>
      </p>

      <Eyebrow>
        {country}
        {dimension ? `, ${DIMENSION_LABELS[dimension].toLowerCase()}` : ''}
      </Eyebrow>
      <PageTitle>{record.title}</PageTitle>
      <Headline>{record.claim}</Headline>

      <div className="mb-6 max-w-3xl">
        <PatternMeta record={record} />
        <PatternMetrics record={record} />
        <PatternMechanism record={record} />
        <PatternLimits record={record} />
      </div>

      <p className="mb-12 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
        This record documents what {country} delivered. It bears on{' '}
        <Link href={indicatorHref(record.indicatorId)} className="underline underline-offset-4">
          {def?.name ?? record.indicatorId}
        </Link>
        , an indicator with no comparable dataset, so the record stays outside every score and every
        confidence. One country with a case study is still one country.
      </p>

      {sameCountry.length > 0 ? (
        <Section
          title={`More from ${country}`}
          icon={<Icon name="flag" size={22} />}
          hint={`${sameCountry.length} other documented ${sameCountry.length === 1 ? 'delivery' : 'deliveries'}.`}
        >
          <RelatedList records={sameCountry} />
        </Section>
      ) : null}

      {sameIndicator.length > 0 ? (
        <Section
          title="The same indicator elsewhere"
          icon={<Icon name={dimension ? DIMENSION_ICON[dimension] : 'layers'} size={22} />}
          hint={`${sameIndicator.length} documented ${sameIndicator.length === 1 ? 'delivery' : 'deliveries'} filed against ${def?.name ?? record.indicatorId} in other countries.`}
        >
          <RelatedList records={sameIndicator} />
        </Section>
      ) : null}
    </>
  )
}

function RelatedList({ records }: { records: EvidenceRecord[] }) {
  return (
    <ul className="max-w-3xl space-y-4">
      {records.map((r) => (
        <li key={r.id} className="border-t border-[var(--rule)] pt-4">
          <p className="text-xs font-medium tracking-tight">
            <Link href={evidenceHref(r.id)} className="underline underline-offset-4">
              {r.title}
            </Link>
          </p>
          <p className="mt-1 text-lg leading-relaxed">{r.claim}</p>
        </li>
      ))}
    </ul>
  )
}
