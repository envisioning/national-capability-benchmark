import { COUNTRIES, DIMENSIONS, DIMENSION_LABELS, DIMENSION_QUESTIONS, SOURCE_TIERS } from '@ncb/core'
import { Scroller, Section, Table, Td, Th } from '@/components/ui'

export default function MethodPage() {
  return (
    <>
      <Section
        title="This measures capability, not wealth"
        hint="Capacity to anticipate change, coordinate action, learn, adapt and build under uncertainty. It is not a measure of wealth, quality of life, competitiveness or government popularity."
      >
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Dimension</Th>
                <Th>The question it has to answer</Th>
              </tr>
            </thead>
            <tbody>
              {DIMENSIONS.map((d) => (
                <tr key={d}>
                  <Td>{DIMENSION_LABELS[d]}</Td>
                  <Td dim>{DIMENSION_QUESTIONS[d]}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section title="Six steps turn an indicator into a score">
        <ol className="max-w-3xl list-decimal space-y-3 pl-5 text-lg leading-relaxed">
          <li>Take the most recent comparable value per indicator per country, with its source and year.</li>
          <li>Apply the declared transform: per million people, log, or none.</li>
          <li>Winsorize with Tukey fences at three interquartile ranges, so only extreme outliers move.</li>
          <li>Normalize to 0 through 100 across the ten countries, reversing lower-is-better indicators.</li>
          <li>Average the available indicators inside a dimension with equal weights.</li>
          <li>
            Compute confidence separately as coverage × recency × source quality, and never fold it
            into the score.
          </li>
        </ol>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          A missing indicator lowers coverage and drops out of the mean. Nothing is imputed. Equal
          weighting is a deliberate v0 choice: an arbitrary expert weighting would be harder to
          challenge and no more defensible.
        </p>
      </Section>

      <Section
        title="Every indicator says what it actually measures"
        hint="We prefer C, then I, and use O and P only where nothing better exists. The classification is stored in the dataset so it can be argued with."
      >
        <ul className="max-w-3xl space-y-2 text-lg leading-relaxed">
          <li><strong>C</strong> is a direct capability measure.</li>
          <li><strong>I</strong> is an input to the capability.</li>
          <li><strong>O</strong> is a downstream outcome correlated with it.</li>
          <li><strong>P</strong> is a perception proxy.</li>
        </ul>
      </Section>

      <Section
        title="Source quality feeds confidence only"
        hint="The weight each tier contributes to the source-quality term of the confidence score. Delphi estimates carry the least."
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
                  <Td>{tier.replace(/_/g, ' ')}</Td>
                  <Td align="right">{weight.toFixed(2)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section
        title="A panel of models judges what the data cannot"
        hint="Each panelist holds a fixed analytical stance, so disagreement between them has a reason behind it. They score the same cells the indicators do, and they audit the indicator set itself."
      >
        <ul className="max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
          <li>Round 1: each panelist scores every dimension from the evidence brief plus its own knowledge.</li>
          <li>
            Round 2: each panelist sees the anonymized round-1 scores and rationales and either
            revises or defends. Panelists are told not to converge for the sake of converging.
          </li>
          <li>
            We keep the median and the interquartile range. A range above 25 points gets recorded
            as unresolved disagreement, and we do not average it away.
          </li>
          <li>
            Panel estimates are stored in their own file and never enter the indicator-derived
            score. They appear beside it, and fill a cell only when no indicator evidence exists.
          </li>
          <li>
            The panel also re-classifies every indicator as C, I, O or P, rates construct validity
            and wealth-proxy risk, and names redundant pairs.
          </li>
        </ul>
      </Section>

      <Section title="Ten countries chosen to expose different structures" hint="They are here to test whether the framework tells them apart. Ranking them against each other is not the exercise.">
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Country</Th>
                <Th>Why it is in the prototype</Th>
              </tr>
            </thead>
            <tbody>
              {COUNTRIES.map((c) => (
                <tr key={c.iso3}>
                  <Td>{c.name}</Td>
                  <Td dim>{c.reason}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section title="These assumptions can be challenged">
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          <li>Normalization is relative to these ten countries. An eleventh country changes every score.</li>
          <li>Only the latest observation is used. There is no trend line and nothing is back-filled.</li>
          <li>Ten countries give eight degrees of freedom, so every correlation here is a hint.</li>
          <li>Doing Business series are frozen at 2019 and are marked down by the recency term.</li>
          <li>Political uniformity is never treated as a capability.</li>
        </ul>
      </Section>
    </>
  )
}
