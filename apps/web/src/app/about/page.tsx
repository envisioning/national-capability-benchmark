import type { Metadata } from 'next'
import Link from 'next/link'
import {
  COUNTRIES,
  DIMENSIONS,
  DIMENSION_LABELS,
  INDICATORS,
  REPO_URL,
  WHY_DOC,
  docHref,
  isScored,
} from '@ncb/core'
import { Eyebrow, Headline, Note, PageTitle, Section } from '@/components/ui'
import {
  capabilitiesHref,
  capabilityHref,
  challengeHref,
  decisionsHref,
  glossaryHref,
  limitsHref,
} from '@/lib/links'

export const metadata: Metadata = {
  title: 'About, NCB',
  description:
    'What the National Capability Benchmark is, who built it, and where to start reading.',
}

export default function AboutPage() {
  const wired = INDICATORS.filter(isScored).length
  const gaps = INDICATORS.filter((i) => i.ingest === 'gap').length

  return (
    <>
      <Eyebrow>About</Eyebrow>
      <PageTitle>We measure what a country can do</PageTitle>
      <Headline>
        NCB is a prototype benchmark from Envisioning. It scores {COUNTRIES.length} countries on
        nine dimensions using public data. Each score has a separate confidence value, and there
        is no overall ranking.
      </Headline>

      <Section
        title="Wealth does not tell the whole story"
        hint="Most indices track income or governance. This tests whether a country’s ability to act under uncertainty can be measured separately."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          Countries can be wealthy without being equally able to anticipate change, coordinate,
          learn, experiment, adapt, build or sustain shared purpose. This benchmark tests whether
          those capabilities can be observed separately.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed">
          If the claim holds, countries at the same income level have different capability shapes,
          and a dimension can improve without the country first getting richer. If it fails, the
          dimensions will track GDP per head. The{' '}
          <Link href="/diagnostics" className="underline underline-offset-4">
            diagnostics
          </Link>{' '}
          will show which result the data support.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed">
          The full argument is in{' '}
          <a href={docHref(WHY_DOC)} className="underline underline-offset-4">
            {WHY_DOC}
          </a>, including what would disprove it.
        </p>
      </Section>

      <Section
        title="The benchmark uses nine dimensions"
        hint="Each dimension asks its own question. Together they make up the profile. There is no composite score."
      >
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          {DIMENSIONS.map((d) => (
            <li key={d}>
              <Link href={capabilityHref(d)} className="underline underline-offset-4">
                {DIMENSION_LABELS[d]}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          Of {INDICATORS.length} indicators, {wired} have published values and {gaps} are gaps.
          Gaps stay in the registry, lower confidence, and define the data-collection agenda. Raw
          values include their source and year.
        </p>
      </Section>

      <Section
        title="Brazil is the first case"
        hint="The same frame covers every country. Fitting one country is not enough."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          The benchmark grew out of Envisioning&apos;s work on national capability. Brazil is the
          first field case, with other Latin American countries on the same scale and under the
          same rules.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed">
          Brazil has no special treatment in the code. Adding a country rebases the frame and
          requires a major version bump. A{' '}
          <Link href="/pt" className="underline underline-offset-4">
          Portuguese version
          </Link>{' '}
          opens on Brazil&apos;s shape and agenda.
        </p>
      </Section>

      <Section
        title="The method and limits are open"
        hint="Confidence stays separate from the score, and known failures sit beside the numbers they affect."
      >
        <ul className="max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
          <li>
            The{' '}
            <Link href="/method" className="underline underline-offset-4">
              method
            </Link>{' '}
            explains how a statistic becomes a score and a trend.
          </li>
          <li>
            The{' '}
            <Link href={limitsHref} className="underline underline-offset-4">
              limits
            </Link>{' '}
            records where the benchmark is known to mislead.
          </li>
          <li>
            The{' '}
            <Link href={decisionsHref} className="underline underline-offset-4">
              decision log
            </Link>{' '}
            records each methodological choice and what would overturn it.
          </li>
          <li>
            The{' '}
            <Link href={challengeHref} className="underline underline-offset-4">
              challenge page
            </Link>{' '}
            is where objections, gap fills and evidence records go.
          </li>
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          Code, data and docs live in the{' '}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            open-source repository on GitHub
          </a>
          . Check any number against its source.
        </p>
      </Section>

      <Section
        title="Envisioning built NCB"
        hint="Envisioning researches how societies anticipate and act on change. This benchmark is one tool."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          <a
            href="https://envisioning.com"
            className="underline underline-offset-4"
            rel="noopener"
          >
            Envisioning
          </a>{' '}
          is a technology research institute and advisory. NCB helps read a country&apos;s capability
          shape, test interventions, and see what public data can measure.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed">
          It is a research prototype. It does not rank countries or give policy advice. Delphi
          estimates are model output. Envisioning seeks institutional partners to improve the
          method, fill gaps with comparable data, and connect diagnosis to intervention.
        </p>
      </Section>

      <Section title="Start with the countries page">
        <ul className="max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
          <li>
            <Link href="/" className="underline underline-offset-4">
              Countries
            </Link>{' '}
              opens profiles with a radar chart and sortable table.
          </li>
          <li>
            <Link href={capabilitiesHref} className="underline underline-offset-4">
              Capabilities
            </Link>{' '}
              compares one dimension across the full set.
          </li>
          <li>
            <Link href="/agenda" className="underline underline-offset-4">
              Agendas
            </Link>{' '}
              turn scores into a raise, measure and hold list for each country.
          </li>
          <li>
            The{' '}
            <Link href={glossaryHref} className="underline underline-offset-4">
              glossary
            </Link>{' '}
              defines the project&apos;s terms.
          </li>
        </ul>
        <Note>
          Check confidence before quoting a score. Thin dimensions rely on one or two indicators.
        </Note>
      </Section>
    </>
  )
}
