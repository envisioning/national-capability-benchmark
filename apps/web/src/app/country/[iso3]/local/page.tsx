import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CHALLENGE_STATUS_LABELS,
  COUNTRY_NAMES,
  DIMENSIONS,
  DIMENSION_LABELS,
  EN,
} from '@ncb/core'
import type { DisputeRecord } from '@ncb/core'
import { InstitutionsView } from '@/components/views/InstitutionsView'
import { NeighbourSparkline } from '@/components/NeighbourSparkline'
import { Radar } from '@/components/Radar'
import { CountryLabel, DefineLink, Empty, Headline, Note, PageTitle, Section } from '@/components/ui'
import {
  objectionDetailHref,
  compareHref,
  countryProfileHref,
  hasLocalDestination,
  methodHref,
} from '@/lib/links'
import {
  loadCorroboration,
  loadCountry,
  loadDisputes,
  loadIndex,
  loadInstitutionNetwork,
} from '@/lib/data'
import { toProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

const LOCAL_INDICATOR = 'income_inequality'
const PEER_CODES = ['ARG', 'MEX', 'IDN', 'IND'] as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ iso3: string }>
}): Promise<Metadata> {
  const { iso3: rawIso3 } = await params
  const name = COUNTRY_NAMES[rawIso3.toUpperCase()]
  return name ? { title: `${name} local reading, NCB` } : {}
}

export default async function CountryLocalPage({
  params,
}: {
  params: Promise<{ iso3: string }>
}) {
  const { iso3: rawIso3 } = await params
  const iso3 = rawIso3.toUpperCase()
  const name = COUNTRY_NAMES[iso3]

  if (!name) return <Empty hint="This country is not in the benchmark." />

  if (!hasLocalDestination(iso3)) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--rule)] px-6 py-16 text-center text-lg text-[var(--muted)]">
        <p>A local destination view is not available for {name} yet.</p>
        <p className="mt-4">
          <Link href={countryProfileHref(iso3)} className="underline underline-offset-4">
            Open the {name} country profile
          </Link>{' '}
          or read the <Link href={methodHref} className="underline underline-offset-4">method</Link>.
        </p>
      </div>
    )
  }

  const [country, index, networkResult, corroboration, records] = await Promise.all([
    loadCountry('BRA'),
    loadIndex(),
    loadInstitutionNetwork('BRA'),
    loadCorroboration('BRA', LOCAL_INDICATOR),
    loadDisputes(),
  ])
  if (!country) return <Empty hint="Brazil's scored output is not available in this deployment." />

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

  return (
    <>
      <PageTitle>
        <CountryLabel iso3="BRA" name="Brazil" /> below the national score
      </PageTitle>
      <Headline>
        The national benchmark shows Brazil beside its peers. This page shows what the national
        number looks like with Brazil&apos;s states and institutions in view.
      </Headline>

      <Section
        title="The national score is the first layer"
        hint="The radar keeps the nine national dimensions together. The paragraph beside it explains what the shape can and cannot say."
      >
        <div className="grid items-start gap-8 md:grid-cols-[10rem_1fr]">
          <div className="w-40 rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] p-2">
            <RadarPlaceholder profile={profile} />
          </div>
          <p className="max-w-3xl text-lg leading-relaxed">
            Brazil&apos;s benchmark shape is a national view of a country with several centres of
            action. The federal score captures evidence that can be compared across the benchmark
            set, so it is useful for asking where Brazil&apos;s capacity differs from its peers. It
            does not describe every state, municipality or delivery system. A federal ministry,
            state government and city can face different constraints while contributing to the
            same national result. The local layer keeps that distinction visible. It brings
            together a source-backed state range for one indicator, a map of institutions and the
            public challenges attached to Brazil&apos;s national scores. Those additions are a way to
            investigate the result, rather than a second score. They can show whether a national
            value is broadly consistent with its constituent parts, where variation is large and
            which organisations mediate action. They also show where the evidence stops. The
            state fixture uses the publisher&apos;s coefficient and year, while the benchmark keeps
            its existing national display and comparison frame. The two views can therefore be
            read together without pretending that a state average is a capability score or that
            one institution explains a whole dimension. Brazil&apos;s local reading is an invitation
            to ask better follow-up questions.
          </p>
        </div>
      </Section>

      <Section
        title="Brazil beside four peers"
        hint="Each mini-radar uses the same nine national dimensions and current comparison frame. Open one to read it beside Brazil, row by row and indicator by indicator."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {peers.map((peer) => (
            <Link
              key={peer.iso3}
              href={compareHref(['BRA', peer.iso3])}
              className="flex items-center gap-4 rounded-lg border border-[var(--rule)] p-4 hover:border-[var(--muted)]"
            >
              <NeighbourSparkline profile={peer} />
              <span>
                <span className="block text-xs font-medium">
                  <CountryLabel iso3={peer.iso3} name={peer.country} />
                </span>
                <span className="mt-2 block text-lg leading-relaxed text-[var(--muted)]">
                  {peerSentence(peer)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        title="One national value, 27 states"
        hint="One indicator is available in the pilot. The state range adds detail without entering the country comparison."
      >
        {corroboration ? (
          <CorroborationCard file={corroboration} />
        ) : (
          <Empty hint="The Brazil corroboration fixture is not available in this deployment." />
        )}
      </Section>

      <Section
        title="Who acts locally"
        hint="The map is an explanatory layer. It does not measure institutional performance or change the national scores."
      >
        {networkResult.network ? (
          <>
            <Note>the agency disagrees with this entry</Note>
            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
              Brazil&apos;s network contains {networkResult.network.nodes.length} institutions and {networkResult.network.edges.length}{' '}
              sourced relationships. The same map is embedded here so the institutional layer can
              be read beside the radar and the state evidence.
            </p>
            <InstitutionsView network={networkResult.network} lex={EN} />
          </>
        ) : networkResult.error.kind === 'missing' ? (
          <Empty hint="Brazil's institutional map is not available in this deployment." />
        ) : (
          <Note tone="stop">
            Brazil&apos;s institutional map could not be loaded. {networkResult.error.message}{' '}
            Fix the network file and run <code>pnpm bench validate</code> before reloading this page.
          </Note>
        )}
      </Section>

      <Section
        title="Disputes stay on the national ledger"
        hint="Accepted and live Brazil disputes stay visible here, while rejected records remain out of the public destination view."
      >
        {disputes.length ? (
          <ul className="max-w-3xl space-y-4">
            {disputes.map((dispute) => (
              <li key={dispute.id} className="rounded-lg border border-[var(--rule)] p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-3 text-xs">
                  <Link href={objectionDetailHref(dispute.id)} className="font-medium underline underline-offset-4">
                    {dispute.id}
                  </Link>
                  <span className="text-[var(--muted)]">{CHALLENGE_STATUS_LABELS[dispute.status]}</span>
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {DIMENSION_LABELS[dispute.target.dimension]}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-lg leading-relaxed">{dispute.argument}</p>
              </li>
            ))}
          </ul>
        ) : (
          <Empty hint="No accepted or live Brazil disputes are in the ledger yet." />
        )}
      </Section>
    </>
  )
}

function RadarPlaceholder({ profile }: { profile: ReturnType<typeof toProfile> }) {
  return (
    <Radar
      labels="icons"
      interactive={false}
      series={[
        {
          label: profile.country,
          iso3: profile.iso3,
          values: profile.values,
          confidences: profile.confidences,
          color: 'var(--primary)',
        },
      ]}
    />
  )
}

function peerSentence(profile: ReturnType<typeof toProfile>): string {
  const leading = profile.values.reduce<{ index: number; value: number } | null>(
    (best, value, index) =>
      value !== null && value > (best?.value ?? Number.NEGATIVE_INFINITY)
        ? { index, value }
        : best,
    null,
  )
  const dimension = leading ? DIMENSIONS[leading.index] : null
  return dimension
    ? `${profile.country} is a useful peer reference, with its strongest current signal in ${DIMENSION_LABELS[dimension].toLowerCase()}.`
    : `${profile.country} is a peer reference with a comparable national frame.`
}

function CorroborationCard({
  file,
}: {
  file: Awaited<ReturnType<typeof loadCorroboration>>
}) {
  if (!file) return null
  const values = file.states.map((state) => state.value)
  const low = Math.min(...values)
  const high = Math.max(...values)
  const source = (
    <a
      href={file.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="underline underline-offset-4"
    >
      {file.source}
    </a>
  )

  return (
    <div className="max-w-3xl rounded-lg border border-[var(--rule)] bg-[var(--surface-sunken)] p-5">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-[var(--muted)]">National coefficient</p>
          <a
            href={file.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block text-3xl font-light tabular-nums underline underline-offset-4"
          >
            {file.national.value.toFixed(3)}
          </a>
          <p className="mt-1 text-xs text-[var(--muted)]">{file.national.year}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-[var(--muted)]">State range</p>
          <a
            href={file.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block text-3xl font-light tabular-nums underline underline-offset-4"
          >
            {low.toFixed(3)} to {high.toFixed(3)}
          </a>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {file.states.length} federative units, {file.asOf}
          </p>
        </div>
      </div>
      <p className="mt-6 text-lg leading-relaxed">
        <DefineLink term="Reconciliation rule" />: <strong>{file.reconciliation}</strong>. The
        state values corroborate the published national coefficient for the same year. They are
        shown on the coefficient scale and stay outside the NCB score.
      </p>
      <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">Source: {source}.</p>
    </div>
  )
}
