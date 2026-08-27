import Link from 'next/link'
import type { CountryAgenda, Lexicon } from '@ncb/core'
import {
  REFERENCE_ISO3,
  REPO_URL,
  countryName,
  countryTopic,
  fill,
  fmt,
  fmtConf,
  indicatorDefinition,
  indicatorName,
  signed,
} from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { fillNodes, joinNodes } from '@/lib/fill'
import { agendaHref, evidenceHref, indicatorHref } from '@/lib/links'
import {
  ConfidenceBar,
  ConfidenceLegend,
  Eyebrow,
  PageTitle,
  Score,
  ScoreLegend,
  Scroller,
  Section,
  Table,
  Td,
  Th,
} from '@/components/ui'

/** Every link the agenda writes gets the same underline. */
const LINK = 'underline underline-offset-4 decoration-[var(--rule)] hover:decoration-current'

/**
 * One country's capability agenda, rendered through one lexicon. The same
 * JSON drives this page in every language and the markdown in
 * data/out/agenda, so the three cannot disagree. See D35.
 */
export function AgendaView({
  agenda,
  lex,
  profileHref,
  switchHref,
}: {
  agenda: CountryAgenda
  lex: Lexicon
  /** The full country profile in the ground layer. */
  profileHref: string
  /** The same agenda in the other language. */
  switchHref: string
}) {
  const s = lex.agenda
  const name = countryName(lex, agenda.iso3)
  const topic = countryTopic(lex, agenda.iso3)
  const date = agenda.generatedAt.slice(0, 10)

  const raise = agenda.dimensions
    .filter((d) => d.kind === 'raise')
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
  const measure = agenda.dimensions
    .filter((d) => d.kind === 'measure')
    .sort((a, b) => a.confidence - b.confidence)

  /**
   * Every country, indicator and evidence record the agenda names is a link,
   * built from the id the JSON carries. Nothing here is written by hand, so a
   * new gap or a new exemplar arrives already linked. Countries stay in the
   * language the reader is in; the registry and the evidence pages are ground
   * layer and stay English.
   */
  const countryLink = (iso3: string) => (
    <Link href={agendaHref(iso3, lex.lang)} className={LINK}>
      {countryName(lex, iso3)}
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
      ? fill(s.trendCell, {
          delta: signed(d.trend.delta, lex.numberLocale),
          years: d.trend.spanYears,
          n: d.trend.basket,
        })
      : s.noTrend

  return (
    <>
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Eyebrow>{fill(s.title, { country: '' }).replace(/[:：]\s*$/, '')}</Eyebrow>
          <PageTitle>{name}</PageTitle>
        </div>
        <Link
          href={switchHref}
          className="text-xs font-medium text-[var(--muted)] underline underline-offset-4 hover:text-[var(--foreground)]"
        >
          {s.switchLanguage}
        </Link>
      </div>

      <p className="mb-4 max-w-3xl text-lg leading-relaxed">
        {fill(s.intro, { date, reference: REFERENCE_ISO3.length })}
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
                    <span className="inline-flex items-center gap-2">
                      <Icon name={DIMENSION_ICON[d.dimension]} size={15} />
                      {lex.dimensions[d.dimension]}
                    </span>
                  </Td>
                  <Td align="right">
                    <Score value={d.score} size="sm" />
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
        <ScoreLegend />
        <ConfidenceLegend />
      </Section>

      {raise.length > 0 ? (
        <Section title={s.raiseHeading} hint={s.raiseIntro}>
          <div className="space-y-10">
            {raise.map((d) => (
              <div key={d.dimension}>
                <h3 className="flex items-center gap-2 text-xl font-medium tracking-tight">
                  <Icon name={DIMENSION_ICON[d.dimension]} size={18} className="text-[var(--muted)]" />
                  {lex.dimensions[d.dimension]}
                  <Score value={d.score} size="sm" />
                  <ConfidenceBar value={d.confidence} />
                </h3>
                <p className="mt-2 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
                  {lex.questions[d.dimension]}
                </p>
                <ul className="mt-3 max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
                  <li>
                    {d.scoredOn.length === 1
                      ? s.scoredOnOne
                      : fill(s.scoredOn, { n: d.scoredOn.length })}{' '}
                    <span className="text-[var(--muted)]">{trendText(d)}.</span>
                  </li>
                  {d.exemplars.length > 0 ? (
                    <li>
                      {fillNodes(s.exemplarsLine, {
                        list: joinNodes(
                          d.exemplars.map((e) => (
                            <>
                              {countryLink(e.iso3)} {fmt(e.score, lex.numberLocale)}
                            </>
                          )),
                        ),
                      })}
                    </li>
                  ) : null}
                  {d.evidenceElsewhere.length > 0 ? (
                    <li>
                      {fillNodes(s.evidenceElsewhereLine, {
                        list: joinNodes(
                          d.evidenceElsewhere.map((e) => (
                            <>
                              {evidenceLink(e.id, e.title)} ({countryLink(e.iso3)})
                            </>
                          )),
                          '; ',
                        ),
                      })}
                    </li>
                  ) : null}
                  {d.gaps.length > 0 ? (
                    <li>
                      {fillNodes(s.gapsLine, {
                        list: joinNodes(d.gaps.map((id) => indicatorLink(id))),
                      })}
                    </li>
                  ) : null}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {measure.length > 0 ? (
        <Section title={s.measureHeading} hint={s.measureIntro}>
          <div className="space-y-10">
            {measure.map((d) => (
              <div key={d.dimension}>
                <h3 className="flex items-center gap-2 text-xl font-medium tracking-tight">
                  <Icon name={DIMENSION_ICON[d.dimension]} size={18} className="text-[var(--muted)]" />
                  {lex.dimensions[d.dimension]}
                  <ConfidenceBar value={d.confidence} />
                </h3>
                <p className="mt-2 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
                  {lex.questions[d.dimension]}
                </p>
                <ul className="mt-3 max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
                  <li>
                    {d.scoredOn.length === 1
                      ? s.scoredOnOne
                      : fill(s.scoredOn, { n: d.scoredOn.length })}
                  </li>
                  {d.gaps.length > 0 ? (
                    <li>
                      {fillNodes(s.gapsLine, {
                        list: joinNodes(d.gaps.map((id) => indicatorLink(id))),
                      })}
                    </li>
                  ) : null}
                </ul>
              </div>
            ))}
          </div>
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
                      <span className="inline-flex items-center gap-2">
                        <Icon name={DIMENSION_ICON[d.dimension]} size={13} />
                        {lex.dimensions[d.dimension]}
                      </span>
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
