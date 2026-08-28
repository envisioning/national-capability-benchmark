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
        nine capability dimensions from public data, prints a separate confidence number beside
        every score, and withholds a headline ranking on purpose.
      </Headline>

      <Section
        title="Wealth and capability are different claims"
        hint="Most international indices track income, comfort or governance quality. This project tests whether capacity to act under uncertainty is a separate property."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          A country&apos;s wealth and a country&apos;s capability are not the same thing. Indices
          that correlate with each other are often measuring much the same thing. This benchmark
          asks whether a country&apos;s ability to anticipate change, coordinate action, learn,
          experiment, adapt, build and hold shared purpose can be observed on its own.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed">
          If the claim holds, two countries at the same income level have different capability
          shapes, and a country can raise a dimension without first getting rich. If the claim
          fails, the nine dimensions collapse into one factor that tracks GDP per head, and the{' '}
          <Link href="/diagnostics" className="underline underline-offset-4">
            diagnostics
          </Link>{' '}
          are built to show that rather than hide it.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed">
          The full argument lives in{' '}
          <a href={docHref(WHY_DOC)} className="underline underline-offset-4">
            {WHY_DOC}
          </a>
          , including what would tell us this was the wrong idea.
        </p>
      </Section>

      <Section
        title="Nine dimensions carry the answer"
        hint="Each dimension has its own question. The shape across all nine is the finding. There is no composite score."
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
          Of {INDICATORS.length} registered indicators, {wired} carry a published value today and{' '}
          {gaps} are declared gaps with no adequate comparable series. Gaps stay in the registry,
          lower confidence, and form the data-collection agenda. Every raw value stays visible with
          its source and year.
        </p>
      </Section>

      <Section
        title="Brazil is where the work lands first"
        hint="The frame applies to every country on the same terms. A capability model that only fits one country describes that country instead of measuring capability."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          The benchmark grew out of an Envisioning strategy on national capability, with Brazil as
          the field case the results are meant to serve first. Since the Latin America expansion,
          peers across the region sit beside Brazil on the same scale, with the same indicators and
          the same rules.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed">
          Nothing about Brazil is special-cased in the code. Adding a country rebases the frame for
          everyone and requires a major version bump. A{' '}
          <Link href="/pt" className="underline underline-offset-4">
            Portuguese reading
          </Link>{' '}
          of the benchmark opens on Brazil&apos;s shape and agenda for institutions that work in
          that language.
        </p>
      </Section>

      <Section
        title="The method and the limits are published"
        hint="This is a measuring instrument, not a report card. Confidence never enters the score, and known failures sit beside the numbers they affect."
      >
        <ul className="max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
          <li>
            The{' '}
            <Link href="/method" className="underline underline-offset-4">
              method page
            </Link>{' '}
            walks through how a published statistic becomes a score and a trend.
          </li>
          <li>
            The{' '}
            <Link href={limitsHref} className="underline underline-offset-4">
              limits page
            </Link>{' '}
            records where a number is known to be wrong about the world.
          </li>
          <li>
            The{' '}
            <Link href={decisionsHref} className="underline underline-offset-4">
              decision log
            </Link>{' '}
            names every methodological choice and the evidence that would overturn it.
          </li>
          <li>
            The{' '}
            <Link href={challengeHref} className="underline underline-offset-4">
              challenge page
            </Link>{' '}
            is where objections, gap fills and evidence records are filed.
          </li>
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          Code, data and documentation live in the{' '}
          <a href={REPO_URL} className="underline underline-offset-4">
            public repository
          </a>
          . A number on this site can be checked against its source by someone who does not trust
          us.
        </p>
      </Section>

      <Section
        title="Envisioning built this as a prototype"
        hint="The institute researches how societies anticipate and act on change. This benchmark is one instrument in that work."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          <a
            href="https://envisioning.com"
            className="underline underline-offset-4"
            rel="noopener"
          >
            Envisioning
          </a>{' '}
          is a technology research institute and advisory. NCB is a prototype: useful for reading a
          country&apos;s capability shape, testing whether an intervention moved a dimension, and
          arguing about what public data can and cannot see.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed">
          It is not a league table, not an Envisioning position on any country, and not policy
          advice. Panel estimates in the Delphi layer are model output and say so. Envisioning is
          looking for institutional partners to harden the method, fill the declared gaps with
          comparable national data, and close the loop between diagnosis and intervention.
        </p>
      </Section>

      <Section title="Start on the countries page if you are new here">
        <ul className="max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
          <li>
            <Link href="/" className="underline underline-offset-4">
              Countries
            </Link>{' '}
            opens every profile as a radar chart and a sortable table.
          </li>
          <li>
            <Link href={capabilitiesHref} className="underline underline-offset-4">
              Capabilities
            </Link>{' '}
            walks one dimension at a time across the full set.
          </li>
          <li>
            <Link href="/agenda" className="underline underline-offset-4">
              Agendas
            </Link>{' '}
            turn the scores into a raise, measure and hold list per country.
          </li>
          <li>
            The{' '}
            <Link href={glossaryHref} className="underline underline-offset-4">
              glossary
            </Link>{' '}
            defines every term invented for this project, once.
          </li>
        </ul>
        <Note>
          Read the confidence beside a score before quoting it. A thin dimension rests on one or two
          indicators and cannot carry an argument alone.
        </Note>
      </Section>
    </>
  )
}
