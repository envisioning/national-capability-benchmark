import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CHALLENGE_STATUS_LABELS,
  COUNTRY_NAMES,
  CONTRIBUTING_DOC,
  DATASET_VERSION,
  DECISIONS_DOC,
  EVIDENCE_DOC,
  LICENSE_DOC,
  LIMITS_DOC,
  NOTICE_DOC,
  REPO_URL,
  WHY_DOC,
  contributionWay,
  docHref,
} from '@ncb/core'
import type { ContributionId } from '@ncb/core'
import {
  CountryLabel,
  Empty,
  Headline,
  Note,
  PageTitle,
  Scroller,
  Section,
  Table,
  Td,
  Th,
} from '@/components/ui'
import { MarkdownLine } from '@/lib/markdown'
import { ContributionList } from '@/components/ContributionList'
import { decisionChallenges, openArtefacts } from '@/lib/docs'
import { loadDisputes, loadDoc, loadIndex } from '@/lib/data'
import {
  artefactHref,
  decisionHref,
  decisionsHref,
  gapsHref,
  limitsHref,
  objectionDetailHref,
  supportHref,
} from '@/lib/links'
import { capitalize, countWord } from '@/lib/words'

export const dynamic = 'force-dynamic'

/** The ways in that end up in a public record rather than in the inbox. */
const OBJECTION_WAYS: ContributionId[] = ['object', 'gap', 'evidence']

export const metadata: Metadata = {
  title: 'Objections, NCB',
  description: 'Known failures, decisions under review, and ways to object.',
}

export default async function ObjectionsPage() {
  const [decisionsDoc, limitsDoc, index, records] = await Promise.all([
    loadDoc('DECISIONS.md'),
    loadDoc('KNOWN-ARTEFACTS.md'),
    loadIndex(),
    loadDisputes(),
  ])
  const disputes = records
    .filter((record) => record.kind === 'dispute')
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  const challenges = decisionsDoc ? decisionChallenges(decisionsDoc) : []
  const artefacts = limitsDoc ? openArtefacts(limitsDoc) : []
  const worst = artefacts.filter((a) => a.severity === 'high').length
  const year = index ? new Date(index.generatedAt).getUTCFullYear() : new Date().getUTCFullYear()
  const version = index?.version ?? DATASET_VERSION

  return (
    <>
      <PageTitle>Argue with the benchmark</PageTitle>
      <Headline>
        Every decision names the evidence that would overturn it. Known failures sit beside the
        scores they affect. Bring a series, a case or an objection.
      </Headline>

      <Section
        title="Open disputes"
        hint={`${disputes.length} dispute${disputes.length === 1 ? '' : 's'} in the ledger. New submissions await maintainer review.`}
      >
        {disputes.length > 0 ? (
          <Scroller>
            <Table>
              <thead>
                <tr>
                  <Th>Record</Th>
                  <Th>Country</Th>
                  <Th>Dimension</Th>
                  <Th>Status</Th>
                  <Th>Argument</Th>
                </tr>
              </thead>
              <tbody>
                {disputes.map((dispute) => (
                  <tr key={dispute.id}>
                    <Td>
                      <Link href={objectionDetailHref(dispute.id)} className="hover:underline">
                        {dispute.id}
                      </Link>
                    </Td>
                    <Td>
                      <CountryLabel
                        iso3={dispute.target.iso3}
                        name={COUNTRY_NAMES[dispute.target.iso3] ?? dispute.target.iso3}
                      />
                    </Td>
                    <Td>{dispute.target.dimension}</Td>
                    <Td dim>{CHALLENGE_STATUS_LABELS[dispute.status]}</Td>
                    <Td dim>
                      <span className="block max-w-xl whitespace-pre-wrap">{dispute.argument}</span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Scroller>
        ) : (
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
            No objections have been filed yet. Use the Challenge action in the top navigation to file the first one.
          </p>
        )}
      </Section>

      <Section
        title="Known failures"
        hint={`${capitalize(countWord(artefacts.length))} artefacts are open: places where the model produces a number that misdescribes the world.${
          worst > 0
            ? ` ${capitalize(countWord(worst))} ${worst === 1 ? 'has' : 'have'} high severity.`
            : ''
        }`}
      >
        {artefacts.length > 0 ? (
          <Scroller>
            <Table>
              <thead>
                <tr>
                  <Th>Id</Th>
                  <Th>Severity</Th>
                  <Th>What it is</Th>
                </tr>
              </thead>
              <tbody>
                {artefacts.map((a) => (
                  <tr key={a.id}>
                    <Td>
                      <Link href={artefactHref(a.id)} className="hover:underline">
                        {a.id}
                      </Link>
                    </Td>
                    <Td dim>{a.severity}</Td>
                    <Td dim>{a.title}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Scroller>
        ) : (
          <Empty hint={`The limits document is not available in this deployment. It is ${LIMITS_DOC} in the repository.`} />
        )}
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          The{' '}
          <Link href={limitsHref} className="underline underline-offset-4">
            limits page
          </Link>{' '}
          carries the full entry, the test behind it and a possible fix.
        </p>
      </Section>

      <Section
        title="What would overturn each decision"
        hint="The decision log lists each challenge clause, newest first. New evidence adds a superseding entry."
      >
        {challenges.length > 0 ? (
          <Scroller>
            <Table>
              <thead>
                <tr>
                  <Th>Id</Th>
                  <Th>The choice</Th>
                  <Th>What would overturn it</Th>
                </tr>
              </thead>
              <tbody>
                {challenges.map((c) => (
                  <tr key={c.id}>
                    <Td>
                      <Link href={decisionHref(c.id)} className="hover:underline">
                        {c.id}
                      </Link>
                    </Td>
                    <Td>{c.title}</Td>
                    <Td dim>
                      <MarkdownLine text={c.overturnedBy} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Scroller>
        ) : (
          <Empty hint={`The decision log is not available in this deployment. It is ${DECISIONS_DOC} in the repository.`} />
        )}
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          The{' '}
          <Link href={decisionsHref} className="underline underline-offset-4">
            decision log
          </Link>{' '}
          holds {challenges.length} entries with each choice, reason and cost.
        </p>
      </Section>

      <Section
        title="How to object"
        hint="Each one keeps its record in public, so the argument stays visible after it is settled."
      >
        <ContributionList ways={OBJECTION_WAYS.map(contributionWay).filter((way) => way !== null)} />
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          <a href={docHref(CONTRIBUTING_DOC)} className="underline underline-offset-4">
            {CONTRIBUTING_DOC}
          </a>{' '}
          has the rules for each,{' '}
          <a href={docHref(EVIDENCE_DOC)} className="underline underline-offset-4">
            {EVIDENCE_DOC}
          </a>{' '}
          has the inclusion test for evidence records, and{' '}
          <a href={docHref(WHY_DOC)} className="underline underline-offset-4">
            {WHY_DOC}
          </a>{' '}
          states the claim under test. The{' '}
          <Link href={gapsHref} className="underline underline-offset-4">
            open gaps
          </Link>{' '}
          name every indicator with no dataset behind it, and{' '}
          <Link href={supportHref} className="underline underline-offset-4">
            ways to help
          </Link>{' '}
          holds every other way in.
        </p>
      </Section>

      <Section
        title="How to cite it"
        hint="Quote the dataset version with every score. Adding a country changes the frame and restates all scores."
      >
        <code className="block overflow-x-auto rounded bg-[var(--surface-sunken)] px-3 py-3 text-xs">
          Envisioning ({year}). NCB, the National Capability Benchmark, dataset {version}. {REPO_URL}
        </code>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          The code is MIT, in{' '}
          <a href={docHref(LICENSE_DOC)} className="underline underline-offset-4">
            {LICENSE_DOC}
          </a>
          . Data keeps the terms of its publishers, listed in{' '}
          <a href={docHref(NOTICE_DOC)} className="underline underline-offset-4">
            {NOTICE_DOC}
          </a>{' '}
          . Keep the attribution when redistributing a number.
        </p>
        <Note>
          This is a prototype. Read the limits and the confidence beside a score; a thin dimension
          rests on one or two indicators and cannot carry an argument alone.
        </Note>
      </Section>
    </>
  )
}
