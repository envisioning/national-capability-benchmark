import {
  COUNTRIES,
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_QUESTIONS,
  INDICATORS,
  REFERENCE_ISO3,
  isScored,
  SOURCE_TIERS,
} from '@ncb/core'
import { Scroller, Section, Table, Td, Th } from '@/components/ui'
import { DIMENSION_ICON, Icon, TIER_ICON } from '@/components/Icon'

export default function MethodPage() {
  const gaps = INDICATORS.filter((i) => i.ingest === 'gap').length
  const retired = INDICATORS.filter((i) => i.ingest === 'retired').length
  const wired = INDICATORS.filter(isScored).length
  const manual = INDICATORS.filter((i) => i.ingest === 'manual').length

  return (
    <>
      <Section
        title="Why this exists"
        hint="The benchmark tests one claim: that what a country is able to do is a separate property from what it earns. If the claim holds, two countries at the same income have different capability shapes. If it fails, the nine dimensions collapse into a single factor that tracks income per head. The diagnostics test for that collapse and publish the result either way."
      >
        <ul className="max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
          <li>
            The frame has no home country. The {REFERENCE_ISO3.length} reference countries set the
            scale together, and every country is scored against it the same way. A frame built
            around one country only describes that country.
          </li>
          <li>
            A high score is not a model to copy. A mechanism that works in one country works because
            of conditions that do not travel with it. The shape says where to look. What to build
            depends on conditions where you are.
          </li>
          <li>
            Capability changes below the national level, in groups small enough to act. A country
            score can only describe the conditions those groups work in, so treat every number here
            as a coarse proxy for something happening several levels underneath it.
          </li>
          <li>
            Treat this as a measuring instrument. It exists so a reader can check an attempt to
            raise a capability after the fact. Confidence, declared gaps and revisions are published
            beside every score and never resolved into it.
          </li>
        </ul>
      </Section>

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
                  <Td>
                    <span className="inline-flex items-center gap-2">
                      <Icon name={DIMENSION_ICON[d]} size={14} className="text-[var(--muted)]" />
                      {DIMENSION_LABELS[d]}
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
          <li>Take the most recent comparable value per indicator per country, with its source and year.</li>
          <li>Apply the declared transform: per million people, log, or none.</li>
          <li>Winsorize with Tukey fences at three interquartile ranges, so only extreme outliers move.</li>
          <li>
            Normalize to 0 through 100 against the frame set by the {REFERENCE_ISO3.length}{' '}
            reference countries, reversing lower-is-better indicators.
          </li>
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
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          Of {INDICATORS.length} indicators, {wired} carry data, {gaps} are declared gaps and{' '}
          {retired} are retired. A gap is something the spec asks for that no comparable dataset
          covers. A retired indicator has a dataset that this project rejected, so far always a
          perception composite. Both stay in the registry, both lower confidence, and both are the
          data collection agenda.{' '}
          {manual} values are entered by hand from a published source with no API, with the
          retrieval date stored on every value.
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
      </Section>

      <Section
        title="Thin evidence is drawn on the chart"
        hint="Confidence is coverage times recency times source quality, and it never enters the score. It is banded, and the bands drive the display everywhere: a dimension in the thin or very thin band is drawn with a dashed edge, a hollow point and a marked axis label. The point still sits at the score, because confidence does not move it."
      >
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          <li>Coverage is the share of a dimension's indicators that have a value.</li>
          <li>Recency decays after two grace years, over a twelve-year window, to a floor of 0.1.</li>
          <li>Source quality is the mean tier weight of the values that are present.</li>
          <li>
            The product is bounded well below 1 in practice, so the bands are set against what a
            dimension can realistically reach.
          </li>
        </ul>
      </Section>

      <Section
        title="Momentum is measured on one ruler and a matched basket"
        hint="A score says where a country stands. Momentum says which way it is going, over ten years, and two rules keep that number honest."
      >
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          <li>
            Historical values are scored against the frame in use today, so the scale holds still
            and a change in the score is a change in the country.
          </li>
          <li>
            Only indicators observed at both ends of the span count, and the same basket is used for
            every year between. A dimension that gained an indicator would otherwise show movement
            that belongs to the dataset.
          </li>
          <li>
            The basket is smaller than the dimension, so its level differs from the headline score.
            The number of indicators is printed next to every trend.
          </li>
          <li>
            Two spans are published. Ten years is broad and shallow, twenty years is narrow and
            deep, and a dimension that has one but not the other is telling you how far its data
            reaches.
          </li>
          <li>
            Every indicator also carries its own line, back to 1990 where the data goes that far.
            One indicator is comparable with itself, so nothing has to be matched and the line is
            not held back by the shallowest series in its dimension. Gaps in a line are real gaps,
            because nothing is carried forward or filled in.
          </li>
          <li>
            Every point on a line carries the value as published, the normalized value and its
            source tier, so a reader can check a chart point by point.
          </li>
          <li>
            Published statistics get restated. Each data run compares itself against the file it
            replaces and writes what moved to a revision log, so a number that changed under us
            leaves a record.
          </li>
          <li>
            A value more than five years old does not count toward a year, and a country that sat
            outside today's frame clamps at 0 or 100 with the clamp recorded.
          </li>
          <li>
            Several indicators measure adoption of things that spread worldwide, so most countries
            rise. Compare a country against the median change in that dimension before calling it
            progress.
          </li>
        </ul>
      </Section>

      <Section
        title="Documented deliveries are recorded outside the score"
        hint="Some indicators ask for something real that no dataset measures. Where a country has visibly done that thing, the case is written down as an evidence record filed against the gap it bears on."
      >
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          <li>Each record carries one published number, its reference period, a source and a retrieval date.</li>
          <li>Each record states what the case does not show. That field is required.</li>
          <li>Records never enter a score and never raise confidence.</li>
          <li>
            A gap becomes a scored indicator only when a comparable series covers at least two
            reference countries, which is the minimum the scale needs.
          </li>
        </ul>
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

      <Section
        title="The scale is fixed by ten countries and holds still"
        hint={`Ten reference countries set the Tukey fences and the 0 and 100 endpoints for every indicator. Every other country is scored against that same fixed frame, so adding a country moves nobody else's number. Verified when six countries were added: 0 of 90 existing cells moved. A country outside the frame clamps to 0 or 100 and the cell is flagged, because widening the scale quietly would change what every published number means. The ${COUNTRIES.length} countries here are chosen to expose different capability structures, and ranking them against each other is not the exercise.`}
      >
        <Scroller>
          <Table>
            <thead>
              <tr>
                <Th>Country</Th>
                <Th>Role in the scale</Th>
                <Th>Why it is in the prototype</Th>
              </tr>
            </thead>
            <tbody>
              {COUNTRIES.map((c) => (
                <tr key={c.iso3}>
                  <Td>{c.name}</Td>
                  <Td dim>{c.frame === 'reference' ? 'sets the frame' : 'scored against the frame'}</Td>
                  <Td dim>{c.reason}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section title="These assumptions can be challenged">
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          <li>
            0 and 100 mean the weakest and strongest of the ten reference countries on that
            indicator. Those ten were picked to expose contrasts and they are not a sample of the
            world, so a low score means near the floor of this frame and says nothing about a
            percentage of capability.
          </li>
          <li>Only the latest observation is used. There is no trend line and nothing is back-filled.</li>
          <li>
            {COUNTRIES.length} countries give few degrees of freedom, so every correlation in the
            diagnostics is a hint and none of them are established results.
          </li>
          <li>Doing Business series are frozen at 2019 and are marked down by the recency term.</li>
          <li>Coordination and Trust still lean on perception composites that track income per head.</li>
          <li>Political uniformity is never treated as a capability.</li>
        </ul>
      </Section>
    </>
  )
}
