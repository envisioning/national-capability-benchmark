import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CONTRIBUTING_DOC,
  DATASET_VERSION,
  DECISIONS_DOC,
  EVIDENCE_DOC,
  ISSUES_URL,
  LICENSE_DOC,
  LIMITS_DOC,
  NOTICE_DOC,
  REPO_URL,
  WHY_DOC,
  docHref,
} from '@ncb/core'
import { Empty, Eyebrow, Headline, Note, PageTitle, Scroller, Section, Table, Td, Th } from '@/components/ui'
import { MarkdownLine } from '@/lib/markdown'
import { decisionChallenges, openArtefacts } from '@/lib/docs'
import { loadDoc, loadIndex } from '@/lib/data'
import { artefactHref, decisionHref, decisionsHref, limitsHref } from '@/lib/links'
import { capitalize, countWord } from '@/lib/words'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Challenge this, NCB',
  description:
    'Known failures, decisions under review, ways to object, and citation details.',
}

export default async function ChallengePage() {
  const [decisionsDoc, limitsDoc, index] = await Promise.all([
    loadDoc('DECISIONS.md'),
    loadDoc('KNOWN-ARTEFACTS.md'),
    loadIndex(),
  ])
  const challenges = decisionsDoc ? decisionChallenges(decisionsDoc) : []
  const artefacts = limitsDoc ? openArtefacts(limitsDoc) : []
  const worst = artefacts.filter((a) => a.severity === 'high').length
  const year = index ? new Date(index.generatedAt).getUTCFullYear() : new Date().getUTCFullYear()
  const version = index?.version ?? DATASET_VERSION

  return (
    <>
      <Eyebrow>Challenge this</Eyebrow>
      <PageTitle>The benchmark is built to be argued with</PageTitle>
      <Headline>
        Every decision names the evidence that would overturn it. Known failures sit beside the
        scores they affect. Bring a series, a case or an objection.
      </Headline>

      <Section
        title="Start with what we already think is wrong"
        hint={`${capitalize(countWord(artefacts.length))} artefacts are open: places where the model produces a number that misdescribes the world.${
          worst > 0
            ? ` ${capitalize(countWord(worst))} ${worst === 1 ? 'is' : 'are'} marked high. Public data covers the dimensions this project most wants to measure worst.`
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
          carries the full entry, its diagnostic and a possible fix.
        </p>
      </Section>

      <Section
        title="Every decision names the evidence that would overturn it"
        hint="The decision log lists each challenge clause, newest first. Decisions stay fixed; new evidence adds a superseding entry."
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
        title="Ways to object"
        hint="Use the repository so the argument stays visible after it is settled."
      >
        <ul className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <li>
            <strong className="font-medium">Dispute a decision.</strong> Name the decision id and
            evidence in an issue. A new entry supersedes a decision; the old one stays visible.
          </li>
          <li>
            <strong className="font-medium">Fill a gap.</strong> Point to a published series covering
            at least two countries with comparable definitions, an open URL, publisher, reference
            period and method. National statistical sources are welcome.
          </li>
          <li>
            <strong className="font-medium">File an evidence record.</strong> Document a national
            delivery with one published number and a statement of what it does not show. Records
            never enter a score, and one in five must document erosion or collapse.
          </li>
          <li>
            <strong className="font-medium">Add a language.</strong> Add a lexicon data file. The
            English ground layer lets readers check the translation against its source.
          </li>
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          <a href={docHref(CONTRIBUTING_DOC)} className="underline underline-offset-4">
            {CONTRIBUTING_DOC}
          </a>{' '}
          has the rules for each,{' '}
          <a href={docHref(EVIDENCE_DOC)} className="underline underline-offset-4">
            {EVIDENCE_DOC}
          </a>{' '}
          has the inclusion test for records, and{' '}
          <a href={docHref(WHY_DOC)} className="underline underline-offset-4">
            {WHY_DOC}
          </a>{' '}
          states the claim under test. Objections go to{' '}
          <a href={ISSUES_URL} className="underline underline-offset-4">
            the issue tracker
          </a>
          .
        </p>
      </Section>

      <Section
        title="How to cite it"
        hint="Quote the dataset version with every score. Adding a country rebases the frame and restates all scores."
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
