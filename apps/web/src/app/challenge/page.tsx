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
    'What would overturn each decision, what is known to be wrong today, how to file an objection, and how to cite the dataset.',
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
        A measuring instrument earns its authority by surviving attempts to break it. Every decision
        here states the evidence that would overturn it, every known failure is published beside the
        scores it affects, and the data and code are open. Bring a series, a case or an objection.
      </Headline>

      <Section
        title="Start with what we already think is wrong"
        hint={`${capitalize(countWord(artefacts.length))} artefacts are open: places where the model produces a number that misdescribes the world rather than measuring it.${
          worst > 0
            ? ` ${capitalize(countWord(worst))} ${worst === 1 ? 'is' : 'are'} marked high, and they name the same problem: the dimensions this project most wants to measure are the ones public data covers worst.`
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
          carries each one in full, with the diagnostic behind it and what a fix would take.
        </p>
      </Section>

      <Section
        title="Every decision names the evidence that would overturn it"
        hint="This is the same clause from every entry in the decision log, newest first, in one list. A decision is never edited once recorded: bring the evidence and it gets superseded by a later entry, so the reasoning stays readable end to end."
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
          holds all {challenges.length} entries with the choice, the reason and the cost.
        </p>
      </Section>

      <Section
        title="Four ways to put an objection on the record"
        hint="All four run through the repository, in the open, where the argument stays readable after it is settled."
      >
        <ul className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <li>
            <strong className="font-medium">Dispute a decision.</strong> Open an issue naming the
            decision id and the evidence. A decision that falls is superseded by a new entry, never
            rewritten, so the reasoning behind the old one stays visible.
          </li>
          <li>
            <strong className="font-medium">Fill a gap.</strong> Point at a published series that
            covers at least two countries on comparable definitions, opens without authentication,
            and names its publisher, reference period and method. National statistical sources are
            wanted: several gaps are measurable inside one country today and internationally never.
          </li>
          <li>
            <strong className="font-medium">File an evidence record.</strong> A documented national
            delivery, with one published number and a required statement of what the case does not
            show. Records never enter a score, and one in five has to document erosion or collapse,
            because a corpus of successes is a brochure.
          </li>
          <li>
            <strong className="font-medium">Add a language.</strong> A lexicon is one data file. The
            ground layer stays English, so a translated page can always be checked against the file
            that generated it.
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
          states the claim under test and what would sink it. Objections go to{' '}
          <a href={ISSUES_URL} className="underline underline-offset-4">
            the issue tracker
          </a>
          .
        </p>
      </Section>

      <Section
        title="How to cite it"
        hint="A score is a position inside one dataset version. Quote the version with the number, because adding a country rebases the frame and restates every score."
      >
        <code className="block overflow-x-auto rounded bg-[var(--surface-sunken)] px-3 py-3 text-xs">
          Envisioning ({year}). NCB, the National Capability Benchmark, dataset {version}. {REPO_URL}
        </code>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          The code is MIT, in{' '}
          <a href={docHref(LICENSE_DOC)} className="underline underline-offset-4">
            {LICENSE_DOC}
          </a>
          . The data carries the terms of the bodies that published it, which{' '}
          <a href={docHref(NOTICE_DOC)} className="underline underline-offset-4">
            {NOTICE_DOC}
          </a>{' '}
          sets out source by source. Keep the attribution when you redistribute a number.
        </p>
        <Note>
          This is a prototype and it says so in its own numbers. Read the limits before quoting a
          score, and read the confidence beside it: a dimension in the thin band rests on one or two
          indicators and cannot carry an argument alone.
        </Note>
      </Section>
    </>
  )
}
