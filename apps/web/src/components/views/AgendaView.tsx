import Link from 'next/link'
import type { CountryAgenda, Dimension, Lexicon } from '@ncb/core'
import {
  RAISE_BELOW,
  COUNTRY_ISO3,
  REPO_URL,
  countryName,
  countryTopic,
  fill,
  fmt,
  fmtConf,
  indicatorDefinition,
  indicatorName,
  signed,
  splitAgenda,
} from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { CapabilityLink } from '@/components/CapabilityLink'
import { fillNodes, joinNodes } from '@/lib/fill'
import { countryProfileHref, evidenceHref, indicatorHref, limitsHref } from '@/lib/links'
import {
  ConfidenceBar,
  ConfidenceLegend,
  CountryLabel,
  Eyebrow,
  Meta,
  PageTitle,
  Score,
  ScoreLegend,
  Scroller,
  Section,
  Table,
  Td,
  Th,
} from '@/components/ui'

/**
 * Every link the agenda writes gets the same underline. Full-strength
 * decoration on purpose: the rule-colored variant read as plain text.
 */
const LINK = 'underline underline-offset-4 hover:decoration-2'

/**
 * One country's capability agenda, rendered through one lexicon. The same
 * JSON drives this page in every language and the markdown in
 * data/out/agenda, so the three cannot disagree. See D35.
 */
export function AgendaView({
  agenda,
  lex,
  profileHref,
}: {
  agenda: CountryAgenda
  lex: Lexicon
  /** The full country profile in the ground layer. */
  profileHref: string
}) {
  const s = lex.agenda
  const name = countryName(lex, agenda.iso3)
  const topic = countryTopic(lex, agenda.iso3)
  const date = agenda.generatedAt.slice(0, 10)

  const { raise, measure, hold } = splitAgenda(agenda)

  /**
   * Every country, indicator and evidence record the agenda names is a link,
   * built from the id the JSON carries. Nothing here is written by hand, so a
   * new gap or a new exemplar arrives already linked. A country name reaches
   * that country's data, which is the ground layer and stays English, as the
   * registry and the evidence pages do.
   */
  const countryLink = (iso3: string) => (
    <Link href={countryProfileHref(iso3)} className={LINK}>
      <CountryLabel iso3={iso3} name={countryName(lex, iso3)} />
    </Link>
  )
  const indicatorLink = (id: string) => (
    <Link href={indicatorHref(id)} className={LINK}>
      {indicatorName(lex, id)}
    </Link>
  )
  const evidenceLink = (id: string, title: string) => (
    <Link href={evidenceHref(id)} className={LINK}>
      {title}
    </Link>
  )

  const trendText = (d: CountryAgenda['dimensions'][number]): string =>
    d.trend
      ? fill(d.trend.clamped > 0 ? s.trendCellClamped : s.trendCell, {
          delta: signed(d.trend.delta, lex.numberLocale),
          years: d.trend.spanYears,
          n: d.trend.basket,
          c: d.trend.clamped,
        })
      : s.noTrend

  return (
    <>
      <div className="mb-10">
        <Eyebrow>{fill(s.title, { country: '' }).replace(/[:：]\s*$/, '')}</Eyebrow>
        <PageTitle>
          <CountryLabel iso3={agenda.iso3} name={name} />
        </PageTitle>
        {/* Metadata as metadata: the dateline is a pill, never a sentence.
            Language switching lives in the layout header, not here. */}
        <p className="mt-3">
          <Meta icon="calendar">{fill(s.generated, { date })}</Meta>
        </p>
      </div>

      <p className="mb-4 max-w-3xl text-lg leading-relaxed">
        {fillNodes(s.intro, {
          countries: COUNTRY_ISO3.length,
          /* The viewer has its own limits page, so {limits} lands there. The
           * rendered markdown keeps the repository link, because a document
           * reaches readers who have neither the site nor a checkout. See D41. */
          limits: (
            <Link href={limitsHref} className={LINK}>
              {s.limitsLabel}
            </Link>
          ),
        })}
      </p>
      <p className="mb-10 text-lg">
        <Link href={profileHref} className="underline underline-offset-4">
          {s.profileLink}
        </Link>
      </p>

      <Section title={fill(s.standingHeading, { countryTopic: topic })}>
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>{s.colDimension}</Th>
                <Th align="right">{s.colScore}</Th>
                <Th>{s.colConfidence}</Th>
                <Th>{s.colTrend}</Th>
              </tr>
            </thead>
            <tbody>
              {agenda.dimensions.map((d) => (
                <tr key={d.dimension}>
                  <Td>
                    <CapabilityLink
                      dimension={d.dimension}
                      className="inline-flex items-center gap-2"
                    >
                      <Icon name={DIMENSION_ICON[d.dimension]} size={15} />
                      {lex.dimensions[d.dimension]}
                    </CapabilityLink>
                  </Td>
                  <Td align="right">
                    <Score value={d.score} size="sm" nullLabel={s.noScore} />
                  </Td>
                  <Td>
                    <ConfidenceBar value={d.confidence} />
                  </Td>
                  <Td dim>{trendText(d)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
        <ScoreLegend lex={lex} />
        <ConfidenceLegend lex={lex} />
      </Section>

      {raise.length > 0 ? (
        <Section title={s.raiseHeading} hint={s.raiseIntro}>
          <div className="grid gap-5">
            {raise.map((d) => {
              const rows: React.ReactNode[] = [
                <>
                  {d.scoredOn.length === 1
                    ? s.scoredOnOne
                    : fill(s.scoredOn, { n: d.scoredOn.length })}{' '}
                  <span className="text-[var(--muted)]">{trendText(d)}.</span>
                </>,
              ]
              if (d.exemplars.length > 0) {
                rows.push(
                  fillNodes(s.exemplarsLine, {
                    list: joinNodes(
                      d.exemplars.map((e) => (
                        <>
                          {countryLink(e.iso3)} {fmt(e.score, lex.numberLocale)}
                        </>
                      )),
                    ),
                  }),
                )
              }
              if (d.evidenceElsewhere.length > 0) {
                rows.push(
                  fillNodes(s.evidenceElsewhereLine, {
                    list: joinNodes(
                      d.evidenceElsewhere.map((e) => (
                        <>
                          {evidenceLink(e.id, e.title)} ({countryLink(e.iso3)})
                        </>
                      )),
                      '; ',
                    ),
                  }),
                )
              }
              if (d.gaps.length > 0) {
                rows.push(
                  fillNodes(s.gapsLine, { list: joinNodes(d.gaps.map((id) => indicatorLink(id))) }),
                )
              }
              if (d.retired.length > 0) {
                rows.push(
                  fillNodes(s.retiredLine, {
                    list: joinNodes(d.retired.map((id) => indicatorLink(id))),
                  }),
                )
              }
              return (
                <AgendaCard
                  key={d.dimension}
                  dimension={d.dimension}
                  name={lex.dimensions[d.dimension]}
                  question={lex.questions[d.dimension]}
                  score={<Score value={d.score} size="sm" nullLabel={s.noScore} />}
                  confidence={d.confidence}
                  rows={rows}
                />
              )
            })}
          </div>
        </Section>
      ) : null}

      {measure.length > 0 ? (
        <Section title={s.measureHeading} hint={s.measureIntro}>
          <div className="grid gap-5 lg:grid-cols-2">
            {measure.map((d) => {
              const rows: React.ReactNode[] = [
                <>
                  {d.scoredOn.length === 1
                    ? s.scoredOnOne
                    : fill(s.scoredOn, { n: d.scoredOn.length })}
                </>,
              ]
              if (d.gaps.length > 0) {
                rows.push(
                  fillNodes(s.gapsLine, { list: joinNodes(d.gaps.map((id) => indicatorLink(id))) }),
                )
              }
              if (d.retired.length > 0) {
                rows.push(
                  fillNodes(s.retiredLine, {
                    list: joinNodes(d.retired.map((id) => indicatorLink(id))),
                  }),
                )
              }
              return (
                <AgendaCard
                  key={d.dimension}
                  dimension={d.dimension}
                  name={lex.dimensions[d.dimension]}
                  question={lex.questions[d.dimension]}
                  confidence={d.confidence}
                  rows={rows}
                />
              )
            })}
          </div>
        </Section>
      ) : null}

      {hold.length > 0 ? (
        <Section title={s.holdHeading} hint={fill(s.holdIntro, { threshold: RAISE_BELOW })}>
          <ul className="max-w-3xl space-y-2 text-lg leading-relaxed">
            {hold.map((d) => (
              <li key={d.dimension} className="flex flex-wrap items-center gap-2">
                <Icon name={DIMENSION_ICON[d.dimension]} size={15} className="text-[var(--muted)]" />
                {lex.dimensions[d.dimension]}
                <Score value={d.score} size="sm" nullLabel={s.noScore} />
                <ConfidenceBar value={d.confidence} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section title={s.agendaHeading} hint={fill(s.agendaIntro, { n: agenda.gapCount })}>
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>{s.colDimension}</Th>
                <Th>{s.colIndicator}</Th>
                <Th>{s.colAsks}</Th>
              </tr>
            </thead>
            <tbody>
              {agenda.dimensions.flatMap((d) =>
                d.gaps.map((id) => (
                  <tr key={id}>
                    <Td dim>
                      <CapabilityLink
                        dimension={d.dimension}
                        className="inline-flex items-center gap-2"
                      >
                        <Icon name={DIMENSION_ICON[d.dimension]} size={13} />
                        {lex.dimensions[d.dimension]}
                      </CapabilityLink>
                    </Td>
                    <Td>{indicatorLink(id)}</Td>
                    <Td dim>{indicatorDefinition(lex, id)}</Td>
                  </tr>
                )),
              )}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      {agenda.ownEvidence.length > 0 ? (
        <Section
          title={fill(s.ownEvidenceHeading, { countryTopic: topic })}
          hint={s.ownEvidenceIntro}
        >
          <ul className="max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
            {agenda.ownEvidence.map((r) => (
              <li key={r.id}>
                <span className="font-medium">{evidenceLink(r.id, r.title)}</span>{' '}
                <span className="text-xs text-[var(--muted)]">
                  ({lex.dimensions[r.dimension]})
                </span>
                <p className="text-[var(--muted)]">{r.claim}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section title={s.contributeHeading}>
        <p className="max-w-3xl text-lg leading-relaxed">
          {fillNodes(s.contributeBody, {
            repo: (
              <a href={REPO_URL} className={LINK}>
                {REPO_URL.replace('https://', '')}
              </a>
            ),
          })}
        </p>
      </Section>
    </>
  )
}

/**
 * One agenda item, as a card.
 *
 * The claims were a bulleted list under a heading, which read as prose and hid
 * that each line answers a different question: what the score rests on, who
 * scores higher, who has filed evidence, what is not measured. Rows separated
 * by a rule make that structure visible without changing a single string, so
 * the Portuguese page and the markdown documents still render the same
 * sentences from the same JSON. See D35.
 */
function AgendaCard({
  dimension,
  name,
  question,
  score,
  confidence,
  rows,
}: {
  dimension: Dimension
  name: string
  question: string
  score?: React.ReactNode
  confidence: number
  rows: React.ReactNode[]
}) {
  return (
    <article className="rounded-xl border border-[var(--rule)] p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Icon name={DIMENSION_ICON[dimension]} size={18} className="text-[var(--muted)]" />
        <h3 className="text-xl font-medium tracking-tight">
          <CapabilityLink dimension={dimension}>{name}</CapabilityLink>
        </h3>
        {score}
        <ConfidenceBar value={confidence} />
      </div>
      <p className="mt-2 text-lg leading-relaxed text-[var(--muted)]">{question}</p>
      <div className="mt-4 divide-y divide-[var(--rule-soft)] border-t border-[var(--rule-soft)]">
        {rows.map((row, i) => (
          <p key={i} className="py-3 text-lg leading-relaxed">
            {row}
          </p>
        ))}
      </div>
    </article>
  )
}
