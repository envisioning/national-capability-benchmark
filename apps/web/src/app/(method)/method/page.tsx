import type { Metadata } from 'next'
import Link from 'next/link'
import {
  COUNTRIES,
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_QUESTIONS,
  DISSENT_IQR,
  INDICATORS,
  MEASUREMENT_CLASS_MEANING,
  isScored,
  SOURCE_TIERS,
} from '@ncb/core'
import type { MeasurementClass } from '@ncb/core'
import { CountryLabel, Eyebrow, Headline, PageTitle, Scroller, Section, Table, Td, Th } from '@/components/ui'
import { capabilityHref, challengeHref, sourcesHref } from '@/lib/links'
import { DIMENSION_ICON, Icon, TIER_ICON } from '@/components/Icon'

export const metadata: Metadata = {
  title: 'Method, NCB',
  description:
    'How published statistics become capability scores, confidence values and trends.',
}

export default function MethodPage() {
  const gaps = INDICATORS.filter((i) => i.ingest === 'gap').length
  const retired = INDICATORS.filter((i) => i.ingest === 'retired').length
  const wired = INDICATORS.filter(isScored).length
  const manual = INDICATORS.filter((i) => i.ingest === 'manual').length
  const classes: MeasurementClass[] = ['C', 'I', 'O', 'P']

  return (
    <>
      <Eyebrow>Method</Eyebrow>
      <PageTitle>Capability is measured apart from wealth</PageTitle>
      <Headline>
        The benchmark tests whether what a country can do is distinct from what it earns. Every
        choice below is open to challenge.
      </Headline>

      <Section
        title="Why this exists"
        hint="If the claim holds, countries with similar incomes have different capability shapes. If it fails, the dimensions track income instead."
      >
        <ul className="max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
          <li>
            All {COUNTRIES.length} countries set the scale. A frame built around one country would
            only describe that country.
          </li>
          <li>
            A high score is not a model to copy. Mechanisms depend on local conditions. The shape
            says where to look; context says what to build.
          </li>
          <li>
            Capability changes below the national level, in groups small enough to act. A country
            score is a coarse proxy for their conditions.
          </li>
          <li>
            Treat this as a measuring instrument. It tests whether an attempt to raise a capability
            worked. Confidence, gaps and revisions sit beside each score.
          </li>
          <li>
            The{' '}
            <Link href="/diagnostics" className="underline underline-offset-4">
            diagnostics
            </Link>{' '}
            tests whether dimensions collapse into income. The{' '}
            <Link href="/limits" className="underline underline-offset-4">
            limits
            </Link>{' '}
            records known failures.
          </li>
        </ul>
      </Section>

      <Section
        title="This measures capability, not wealth"
        hint="The benchmark measures capacity to anticipate, coordinate, learn, adapt and build under uncertainty. Wealth, quality of life and popularity are outside its scope."
      >
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Dimension</Th>
                <Th>Question</Th>
              </tr>
            </thead>
            <tbody>
              {DIMENSIONS.map((d) => (
                <tr key={d}>
                  <Td>
                    <span className="inline-flex items-center gap-2">
                      <Icon name={DIMENSION_ICON[d]} size={14} className="text-[var(--muted)]" />
                      <Link href={capabilityHref(d)} className="hover:underline">
                        {DIMENSION_LABELS[d]}
                      </Link>
                    </span>
                  </Td>
                  <Td dim>{DIMENSION_QUESTIONS[d]}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section title="Six steps turn an indicator into a score">
        <ol className="max-w-3xl list-decimal space-y-3 pl-5 text-lg leading-relaxed">
            <li>Take the latest comparable value for each country and indicator, with source and year.</li>
          <li>Apply the declared transform: per million people, log, or distance from a target.</li>
          <li>Winsorize extreme outliers with Tukey fences at three interquartile ranges.</li>
          <li>
            Normalize to 0 through 100 against the frame set by all {COUNTRIES.length} countries.
            Reverse indicators where lower is better.
          </li>
          <li>Average the available indicators inside a dimension with equal weights.</li>
          <li>
            Compute confidence separately as coverage × recency × source quality.
          </li>
        </ol>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          Missing indicators lower coverage and drop out of the mean. Nothing is imputed. Equal
          weighting keeps v0 easy to challenge.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          Of {INDICATORS.length} indicators, {wired} have data, {gaps} are gaps and {retired} are
          retired. Gaps lack a comparable dataset; retired rows have a rejected one. Both lower
          confidence and define the collection agenda. {manual} values were entered by hand, with
          retrieval dates stored.
        </p>
      </Section>

      <Section
        title="Every indicator states what it measures"
        hint="The dataset labels each indicator as C, I, O or P so the classification can be checked."
      >
        {/* Rendered from the glossary's single source, never retyped: the exact
            drift D26 forbids is a second copy of these four sentences. */}
        <ul className="max-w-3xl space-y-3 text-lg leading-relaxed">
          {classes.map((c) => (
            <li key={c}>
              <strong>{c}</strong>, {MEASUREMENT_CLASS_MEANING[c].label}.{' '}
              {MEASUREMENT_CLASS_MEANING[c].plain}{' '}
              <span className="text-[var(--muted)]">{MEASUREMENT_CLASS_MEANING[c].example}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Source quality feeds confidence only"
        hint="Each tier affects source quality and confidence. Delphi estimates carry the least weight."
      >
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Tier</Th>
                <Th align="right">Weight</Th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(SOURCE_TIERS).map(([tier, weight]) => (
                <tr key={tier}>
                  <Td>
                    <span className="inline-flex items-center gap-2">
                      <Icon name={TIER_ICON[tier as keyof typeof TIER_ICON]} size={14} />
                      {tier.replace(/_/g, ' ')}
                    </span>
                  </Td>
                  <Td align="right">{weight.toFixed(2)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          A tier says who published a number. The{' '}
          <Link href={sourcesHref} className="underline underline-offset-4">
          sources page
          </Link>{' '}
          lists the publisher, database and request.
        </p>
      </Section>

      <Section
        title="Thin evidence is drawn on the chart"
        hint="Confidence never enters the score. Thin evidence gets a dashed edge and hollow point; the gap widens as confidence falls."
      >
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          <li>Coverage is the share of a dimension's indicators that have a value.</li>
          <li>Recency decays after two grace years, over a twelve-year window, to a floor of 0.1.</li>
          <li>Source quality is the mean tier weight of the values that are present.</li>
          <li>
            The product stays below 1 in practice, so the bands reflect realistic values.
          </li>
        </ul>
      </Section>

      <Section
        title="Momentum uses a matched basket"
        hint="Momentum shows score change over time on the current frame. Only indicators observed at both ends count."
      >
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          <li>
            Historical values use today&apos;s frame, so score change reflects the country.
          </li>
          <li>
            The same basket is used for every year. A new indicator cannot create movement.
          </li>
          <li>
            The basket may be smaller than the dimension, so trend level can differ from the score.
            Its size is printed beside the trend.
          </li>
          <li>
            Ten-year and twenty-year spans are published. A missing span shows the data&apos;s reach.
          </li>
          <li>
            Each indicator carries its own line back to 1990 where available. Nothing is carried
            forward or filled in.
          </li>
          <li>
            Each point carries the published value, normalized value and source tier.
          </li>
          <li>
            Each run compares its data with the previous file and logs restated, added or dropped
            values.
          </li>
          <li>
            Values more than five years old do not count for a year. Historical values outside the
            frame clamp to 0 or 100, and the clamp is recorded.
          </li>
          <li>
            Adoption indicators often rise for every country. Compare each change with the median
            before calling it progress.
          </li>
        </ul>
      </Section>

      <Section
        title="Documented deliveries are recorded outside the score"
        hint="Evidence records document work that a gap indicator cannot measure. They stay outside scores."
      >
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          <li>Each record carries a published number, reference period, source and retrieval date.</li>
          <li>Each record states what the case does not show.</li>
          <li>Records never affect scores or confidence.</li>
          <li>
            A gap becomes scorable when a comparable series covers at least two countries.
          </li>
        </ul>
      </Section>

      <Section
        title="A panel of models judges what the data cannot"
        hint="Each panelist has a fixed stance. The panel scores the same cells and audits the indicators."
      >
        <ul className="max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
          <li>Round 1: each panelist scores every dimension from the evidence brief and its knowledge.</li>
          <li>
            Round 2: each panelist sees the anonymized round-1 scores and rationales, then revises
            or defends its scores.
          </li>
          <li>
            We keep the median and interquartile range. A range above {DISSENT_IQR} points is
            unresolved disagreement.
          </li>
          <li>
            Panel estimates stay in their own file and never enter the indicator score. They fill a
            cell only when indicator evidence is absent.
          </li>
          <li>
            The panel also rates each indicator&apos;s class, validity, wealth-proxy risk and redundancy.
          </li>
          <li>
            The{' '}
            <Link href="/delphi" className="underline underline-offset-4">
              Delphi page
            </Link>{' '}
            shows the current run and its provenance. The active run is a working session, not a
            panel.
          </li>
        </ul>
      </Section>

      <Section
        title="All countries set the scale"
        hint={`All ${COUNTRIES.length} countries set each indicator's fences and endpoints. The frame stays fixed within a version; adding a country rebases it and requires a major version bump.`}
      >
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Country</Th>
                <Th>Why it is included</Th>
              </tr>
            </thead>
            <tbody>
              {COUNTRIES.map((c) => (
                <tr key={c.iso3}>
                  <Td>
                    <CountryLabel iso3={c.iso3} name={c.name} />
                  </Td>
                  <Td dim>{c.reason}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section
        title="These assumptions can be challenged"
        hint="The decision log records each choice and what evidence would overturn it."
      >
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          <li>
            0 and 100 are the weakest and strongest values among the {COUNTRIES.length} countries.
            They are not a sample of the world, and a low score is not a percentage of capability.
          </li>
          <li>
            Scores use only the latest observation. Trends use a matched basket against today's
            frame. Nothing is back-filled or imputed.
          </li>
          <li>
            With {COUNTRIES.length} countries, diagnostics are hints, not established results.
          </li>
          <li>Doing Business series are frozen at 2019 and are marked down by the recency term.</li>
          <li>
            Retiring the perception composites left Coordination, Trust and Shared Purpose with
            one or two indicators each. The{' '}
            <Link href="/limits" className="underline underline-offset-4">
              limits page
            </Link>{' '}
            carries the detail.
          </li>
          <li>Political uniformity is never treated as a capability.</li>
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          <Link href={challengeHref} className="underline underline-offset-4">
          How to argue with any of this
          </Link>{' '}
          and what would make each decision fall.
        </p>
      </Section>
    </>
  )
}
