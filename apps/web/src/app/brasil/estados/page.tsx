import type { Metadata } from 'next'
import Link from 'next/link'
import { DIMENSIONS, PT_BR, SUBNATIONAL_SERIES, countryName, fill } from '@ncb/core'
import type { DisputeRecord } from '@ncb/core'
import { Radar } from '@/components/Radar'
import { SubnationalUnitTable } from '@/components/views/SubnationalUnitTable'
import { Card, CountryLabel, DefineLink, Empty, Headline, PageTitle, Section } from '@/components/ui'
import {
  loadCountry,
  loadDisputes,
  loadIndex,
  loadInstitutionNetwork,
  loadSubnationalFile,
} from '@/lib/data'
import { countryLayer, layerSection } from '@/lib/layers'
import { compareHref, layerSectionHref, objectionDetailHref } from '@/lib/links'
import { toProfile } from '@/lib/profile'
import { LAYER_WORDS } from '@/lib/words'

export const dynamic = 'force-dynamic'

/*
 * Brazil's subnational reading in Portuguese: the same files the English
 * `/country/BRA/local` reads, through the pt-BR lexicon and the layer's
 * words. Every number on the page comes from `data/out`. See D69.
 */
const LOCAL_SERIES = SUBNATIONAL_SERIES.find((series) => series.iso3 === 'BRA')
const PEER_CODES = ['ARG', 'MEX', 'IDN', 'IND'] as const
const W = LAYER_WORDS['pt-BR']!.local!
const LOCALE = PT_BR.numberLocale

export const metadata: Metadata = {
  title: W.metaTitle,
  description: W.metaDescription,
}

const fixed = (n: number) =>
  n.toLocaleString(LOCALE, { minimumFractionDigits: 3, maximumFractionDigits: 3 })

export default async function BrazilStatesPage() {
  const layer = countryLayer('BRA')
  if (!layer || !LOCAL_SERIES) return <Empty hint={W.missingFile} />

  const [country, index, networkResult, subnational, records] = await Promise.all([
    loadCountry('BRA'),
    loadIndex(),
    loadInstitutionNetwork('BRA'),
    loadSubnationalFile('BRA', LOCAL_SERIES.indicatorId),
    loadDisputes(),
  ])
  if (!country) return <Empty hint={W.missingCountry} />

  const profile = toProfile(country)
  const peers = PEER_CODES.flatMap((code) => {
    const peer = index?.countries.find((candidate) => candidate.iso3 === code)
    return peer ? [toProfile(peer)] : []
  })
  const disputes = records
    .filter(
      (record): record is DisputeRecord =>
        record.kind === 'dispute' &&
        record.target.iso3 === 'BRA' &&
        record.status !== 'rejected',
    )
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  const institutionsSection = layerSection(layer, 'institutions')

  return (
    <>
      <PageTitle>{W.title}</PageTitle>
      <Headline>{W.headline}</Headline>

      <Section title={W.nationalHeading} hint={W.nationalHint}>
        <div className="grid items-start gap-8 md:grid-cols-[10rem_1fr]">
          <Card padding="sm" className="w-40">
            <Radar
              labels="icons"
              interactive={false}
              lex={PT_BR}
              series={[
                {
                  label: countryName(PT_BR, 'BRA'),
                  iso3: 'BRA',
                  values: profile.values,
                  confidences: profile.confidences,
                  color: 'var(--primary)',
                },
              ]}
            />
          </Card>
          <p className="max-w-3xl text-lg leading-relaxed">
            {fill(W.nationalBody, { countries: index?.countries.length ?? 0 })}
          </p>
        </div>
      </Section>

      <Section title={W.peersHeading} hint={W.peersHint}>
        <div className="grid gap-4 sm:grid-cols-2">
          {peers.map((peer) => (
            <Link
              key={peer.iso3}
              href={compareHref(['BRA', peer.iso3])}
              className="flex items-center gap-4 rounded-lg border border-[var(--rule)] p-4 hover:border-[var(--muted)]"
            >
              <div className="w-28 shrink-0">
                <Radar
                  labels="icons"
                  interactive={false}
                  lex={PT_BR}
                  series={[
                    {
                      label: countryName(PT_BR, peer.iso3),
                      iso3: peer.iso3,
                      values: peer.values,
                      confidences: peer.confidences,
                      color: 'var(--muted)',
                    },
                  ]}
                />
              </div>
              <span>
                <span className="block text-xs font-medium">
                  <CountryLabel iso3={peer.iso3} name={countryName(PT_BR, peer.iso3)} />
                </span>
                <span className="mt-2 block text-lg leading-relaxed text-[var(--muted)]">
                  {peerSentence(peer.values)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {subnational ? (
        <Section
          title={fill(W.statesHeading, { n: subnational.units.length })}
          hint={W.statesHint}
        >
          <StatesCard file={subnational} />
          <div className="mt-8 max-w-3xl">
            <p className="mb-4 text-xs text-[var(--muted)]">
              {PT_BR.indicators[subnational.indicatorId] ?? subnational.indicatorId}.{' '}
              {PT_BR.indicatorDefinitions[subnational.indicatorId] ?? ''}{' '}
              {W.direction[subnational.direction]}
            </p>
            <SubnationalUnitTable
              rows={subnational.units}
              national={subnational.national.value}
              locale={LOCALE}
              words={{
                caption: W.tableCaption,
                unit: W.unitColumn,
                value: W.valueColumn,
                gap: W.gapColumn,
                year: W.yearColumn,
              }}
            />
          </div>
        </Section>
      ) : (
        <Section title={layerSection(layer, 'local')?.label ?? ''} hint={W.statesHint}>
          <Empty hint={W.missingFile} />
        </Section>
      )}

      {networkResult.network && institutionsSection ? (
        <Section title={W.institutionsHeading} hint={W.institutionsHint}>
          <p className="max-w-3xl text-lg leading-relaxed">
            {fill(W.institutionsBody, {
              nodes: networkResult.network.nodes.length,
              edges: networkResult.network.edges.length,
            })}{' '}
            <Link
              href={layerSectionHref(layer, institutionsSection)}
              className="underline underline-offset-4"
            >
              {W.institutionsLink}
            </Link>
            .
          </p>
        </Section>
      ) : null}

      <Section title={W.disputesHeading} hint={W.disputesHint}>
        {disputes.length ? (
          <ul className="max-w-3xl space-y-4">
            {disputes.map((dispute) => (
              <li key={dispute.id} className="rounded-lg border border-[var(--rule)] p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-3 text-xs">
                  <Link
                    href={objectionDetailHref(dispute.id)}
                    className="font-medium underline underline-offset-4"
                  >
                    {dispute.id}
                  </Link>
                  <span className="text-[var(--muted)]">{W.disputeStatus[dispute.status]}</span>
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {PT_BR.dimensions[dispute.target.dimension] ?? dispute.target.dimension}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-lg leading-relaxed">{dispute.argument}</p>
              </li>
            ))}
          </ul>
        ) : (
          <Empty hint={W.disputesNone} />
        )}
      </Section>
    </>
  )
}

/** The peer's highest scored capability, named in Portuguese. */
function peerSentence(values: readonly (number | null)[]): string {
  const leading = values.reduce<{ index: number; value: number } | null>(
    (best, value, index) =>
      value !== null && value > (best?.value ?? Number.NEGATIVE_INFINITY)
        ? { index, value }
        : best,
    null,
  )
  const dimension = leading ? DIMENSIONS[leading.index] : null
  return dimension
    ? fill(W.peerStrongest, { dimension: PT_BR.dimensions[dimension] ?? dimension })
    : W.peerNone
}

function StatesCard({
  file,
}: {
  file: NonNullable<Awaited<ReturnType<typeof loadSubnationalFile>>>
}) {
  const values = file.units.map((unit) => unit.value)
  const low = Math.min(...values)
  const high = Math.max(...values)
  const date = new Date(`${file.asOf}T00:00:00Z`).toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  const orNa = (n: number | null | undefined) => (n === null || n === undefined ? W.notAvailable : fixed(n))

  return (
    <Card padding="lg" className="max-w-3xl">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-[var(--muted)]">{W.nationalValue}</p>
          <a
            href={file.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block text-3xl font-light tabular-nums underline underline-offset-4"
          >
            {fixed(file.national.value)}
          </a>
          <p className="mt-1 text-xs text-[var(--muted)]">{file.national.year}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-[var(--muted)]">{W.stateRange}</p>
          <a
            href={file.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block text-3xl font-light tabular-nums underline underline-offset-4"
          >
            {fill(W.rangeValue, { low: fixed(low), high: fixed(high) })}
          </a>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {fill(W.unitsCount, { n: file.units.length, date })}
          </p>
        </div>
      </div>
      <p className="mt-6 text-lg leading-relaxed">
        <DefineLink term="Reconciliation rule">{W.reconciliationLabel}</DefineLink>:{' '}
        <strong>{W.reconciliation[file.reconciliation]}</strong>.{' '}
        {fill(W.reconciliationBody, {
          recomposed: orNa(file.check.recomposed),
          national: fixed(file.check.national),
          residual: orNa(file.check.residual),
        })}
      </p>
      <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
        {W.source}:{' '}
        <a href={file.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">
          {file.source}
        </a>
        .
      </p>
    </Card>
  )
}
