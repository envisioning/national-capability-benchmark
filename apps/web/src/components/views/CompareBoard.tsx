import Link from 'next/link'
import {
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_QUESTIONS,
  INDICATORS_BY_ID,
  primaryMomentum,
} from '@ncb/core'
import type { CountryResult, Dimension, IndicatorResult } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { Radar } from '@/components/Radar'
import {
  Confidence,
  ConfidenceLegend,
  CountryLabel,
  Delta,
  DimensionScore,
  FrameNote,
  RadarEvidenceLegend,
  Score,
  ScoreLegend,
  Scroller,
  Section,
  Table,
  Td,
  Th,
} from '@/components/ui'
import { capabilityHref, countryProfileHref, indicatorHref } from '@/lib/links'
import { toProfile } from '@/lib/profile'

/**
 * How far one country sits from the reference on the same axis.
 *
 * A gap is not a trend, so it does not borrow the trend's arrows. Sign and
 * number carry it, and a missing score on either side prints nothing rather
 * than a zero: two countries cannot be a fixed distance apart when one of them
 * has no measurement.
 */
function Gap({ value, reference }: { value: number | null; reference: number | null }) {
  if (value === null || reference === null) return null
  const gap = value - reference
  const text = Math.abs(gap) < 0.05 ? 'level' : `${gap > 0 ? '+' : ''}${gap.toFixed(1)}`
  return (
    <span className="block text-xs tabular-nums text-[var(--muted)]">
      {text}
    </span>
  )
}

/** The column heading for one country: its flag, its name and the way to its profile. */
function CountryHead({ country, reference }: { country: CountryResult; reference: boolean }) {
  return (
    <Th align="right">
      <Link href={countryProfileHref(country.iso3)} className="hover:underline">
        <CountryLabel iso3={country.iso3} name={country.country} />
      </Link>
      {reference ? <span className="ml-2 font-normal">reference</span> : null}
    </Th>
  )
}

/**
 * One country's shape, with the reference country drawn behind it.
 *
 * Every card holds the same two questions: what is this country's shape, and
 * where does it leave the reference. Four shapes stacked on one chart would
 * need four colours the brand does not have and would collide with the dashed
 * edge that already means thin evidence, so the comparison is made card by
 * card instead. See D70.
 */
function ShapeCard({
  country,
  reference,
}: {
  country: CountryResult
  reference: CountryResult
}) {
  const profile = toProfile(country)
  const base = toProfile(reference)
  const isReference = country.iso3 === reference.iso3

  return (
    <Link
      href={countryProfileHref(country.iso3)}
      className="rounded-xl border border-[var(--rule)] p-4 transition-all duration-200 hover:border-[var(--foreground)]"
    >
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-medium">
          <CountryLabel iso3={profile.iso3} name={profile.country} />
        </span>
        <span className="text-xs text-[var(--muted)]">
          {isReference ? 'reference' : profile.iso3}
        </span>
      </div>
      <Radar
        labels="icons"
        interactive={false}
        hoverLabels
        series={[
          ...(isReference
            ? []
            : [
                {
                  label: base.country,
                  values: base.values,
                  confidences: base.confidences,
                  color: 'var(--muted)',
                  outline: true,
                },
              ]),
          {
            label: profile.country,
            values: profile.values,
            confidences: profile.confidences,
            color: 'var(--primary)',
          },
        ]}
      />
    </Link>
  )
}

/** The indicator rows a dimension holds, taken in registry order. */
function rowsFor(country: CountryResult | undefined, dimension: Dimension): IndicatorResult[] {
  return country?.dimensions[dimension]?.indicators ?? []
}

/** Keep the comparison shapes as large as the selected country set allows. */
function shapeGridColumns(countryCount: number): string {
  if (countryCount === 2) return 'lg:grid-cols-2'
  if (countryCount === 3) return 'lg:grid-cols-3'
  return 'lg:grid-cols-4'
}

/**
 * Two to four countries read against each other, dimension by dimension and
 * then indicator by indicator.
 *
 * The first country is the reference. It keeps the filled shape, it is the
 * column every gap is measured from, and swapping it changes the reading
 * without changing the data. Nothing here computes a new number: every value
 * is the published one, and a gap is a subtraction the reader could do.
 */
export function CompareBoard({ countries }: { countries: CountryResult[] }) {
  const reference = countries[0]
  if (!reference) return null

  /* The registry order is the same in every country file, so the reference
   * country's rows decide the row order and the others are looked up by id. */
  const indicatorRows = (dimension: Dimension) =>
    rowsFor(reference, dimension).map((row) => ({
      row,
      byCountry: countries.map(
        (c) => rowsFor(c, dimension).find((r) => r.indicatorId === row.indicatorId) ?? null,
      ),
    }))

  return (
    <>
      <Section
        title="Each shape against the reference"
        hint="The reference country is drawn as an outline behind every other card, so each card answers the same question: where does this country leave the reference. The nine axes are in the same order on every chart."
      >
        <div
          className={`grid grid-cols-1 gap-8 sm:grid-cols-2 ${shapeGridColumns(countries.length)}`}
        >
          {countries.map((c) => (
            <ShapeCard key={c.iso3} country={c} reference={reference} />
          ))}
        </div>
        <RadarEvidenceLegend interactive={false} />
        <FrameNote />
      </Section>

      <Section
        title="Capability scores, side by side"
        hint="Scores run 0 to 100 against all countries in the comparison frame, so a gap of 10 points means the same thing on every row. The number under each score is the distance from the reference."
      >
        <ScoreLegend />
        <Scroller>
          <Table>
            <caption className="sr-only">
              Dimension scores for {countries.map((c) => c.country).join(', ')}
            </caption>
            <thead>
              <tr>
                <Th>Capability</Th>
                {countries.map((c) => (
                  <CountryHead key={c.iso3} country={c} reference={c.iso3 === reference.iso3} />
                ))}
              </tr>
            </thead>
            <tbody>
              {DIMENSIONS.map((d) => {
                const base = reference.dimensions[d]?.score ?? null
                return (
                  <tr key={d}>
                    <Td>
                      <Link
                        href={capabilityHref(d)}
                        className="inline-flex items-center gap-2 hover:underline"
                      >
                        <Icon
                          name={DIMENSION_ICON[d]}
                          size={14}
                          className="text-[var(--muted)]"
                        />
                        {DIMENSION_LABELS[d]}
                      </Link>
                    </Td>
                    {countries.map((c) => {
                      const dim = c.dimensions[d] ?? null
                      return (
                        <Td key={c.iso3} align="right">
                          <DimensionScore dim={dim} />
                          {c.iso3 === reference.iso3 ? null : (
                            <Gap value={dim?.score ?? null} reference={base} />
                          )}
                        </Td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section
        title="Confidence in each score"
        hint="Confidence is coverage times recency times source quality. It never enters the score above, and a country can lead a row on a thinner evidence base than the country beside it."
      >
        <ConfidenceLegend />
        <Scroller>
          <Table>
            <caption className="sr-only">
              Confidence for {countries.map((c) => c.country).join(', ')}
            </caption>
            <thead>
              <tr>
                <Th>Capability</Th>
                {countries.map((c) => (
                  <CountryHead key={c.iso3} country={c} reference={c.iso3 === reference.iso3} />
                ))}
              </tr>
            </thead>
            <tbody>
              {DIMENSIONS.map((d) => (
                <tr key={d}>
                  <Td>{DIMENSION_LABELS[d]}</Td>
                  {countries.map((c) => (
                    <Td key={c.iso3} align="right">
                      <Confidence value={c.dimensions[d]?.confidence ?? null} />
                    </Td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section
        title="Which way each country is moving"
        hint="A trend is measured on the indicators observed at both ends of the span, which is a smaller basket than the score. The basket size is printed beside each change, and two countries can be on different baskets in the same row."
      >
        <Scroller>
          <Table>
            <caption className="sr-only">
              Trend for {countries.map((c) => c.country).join(', ')}
            </caption>
            <thead>
              <tr>
                <Th>Capability</Th>
                {countries.map((c) => (
                  <CountryHead key={c.iso3} country={c} reference={c.iso3 === reference.iso3} />
                ))}
              </tr>
            </thead>
            <tbody>
              {DIMENSIONS.map((d) => (
                <tr key={d}>
                  <Td>{DIMENSION_LABELS[d]}</Td>
                  {countries.map((c) => {
                    const m = primaryMomentum(c.dimensions[d]?.momentum ?? [])
                    return (
                      <Td key={c.iso3} align="right">
                        {m ? (
                          <span className="inline-flex items-center gap-1">
                            <Delta
                              value={m.delta}
                            />
                            <span className="text-[10px] text-[var(--muted)]">
                              ({m.matchedIndicators})
                            </span>
                          </span>
                        ) : (
                          <Delta value={null} />
                        )}
                      </Td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section
        title="The indicators behind those rows"
        hint="The chip is the indicator normalized onto the 0 to 100 frame, so higher is better on every row whatever the unit does. The published value and its year sit under it. A row with no dataset is a declared gap and lowers confidence for every country at once."
      >
        {DIMENSIONS.map((d) => {
          const rows = indicatorRows(d)
          if (rows.length === 0) return null
          return (
            <div key={d} className="mb-10">
              <h3 className="flex items-center gap-2 text-xl font-medium tracking-tight">
                <Icon
                  name={DIMENSION_ICON[d]}
                  size={16}
                  className="text-[var(--muted)]"
                />
                {DIMENSION_LABELS[d]}
              </h3>
              <p className="mb-4 mt-1 text-xs text-[var(--muted)]">{DIMENSION_QUESTIONS[d]}</p>
              <Scroller>
                <Table>
                  <caption className="sr-only">
                    {DIMENSION_LABELS[d]} indicators for{' '}
                    {countries.map((c) => c.country).join(', ')}
                  </caption>
                  <thead>
                    <tr>
                      <Th>Indicator</Th>
                      <Th>Unit</Th>
                      {countries.map((c) => (
                        <CountryHead
                          key={c.iso3}
                          country={c}
                          reference={c.iso3 === reference.iso3}
                        />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ row, byCountry }) => {
                      const def = INDICATORS_BY_ID[row.indicatorId]
                      return (
                        <tr key={row.indicatorId}>
                          <Td>
                            <Link
                              href={indicatorHref(row.indicatorId)}
                              className="hover:underline"
                            >
                              {row.name}
                            </Link>
                          </Td>
                          <Td dim>{def?.unit}</Td>
                          {byCountry.map((cell, i) => (
                            <Td key={countries[i]!.iso3} align="right">
                              {cell && cell.status === 'observed' && cell.normalized !== null ? (
                                <>
                                  <Score value={cell.normalized} size="sm" />
                                  <span className="block text-xs tabular-nums text-[var(--muted)]">
                                    {cell.raw === null
                                      ? ''
                                      : cell.raw.toLocaleString('en-US')}
                                    {cell.year === null ? '' : ` (${cell.year})`}
                                  </span>
                                </>
                              ) : (
                                <span className="text-xs text-[var(--muted)]">
                                  {cell?.status === 'gap'
                                    ? 'no dataset'
                                    : cell?.status === 'retired'
                                      ? 'retired'
                                      : 'no data'}
                                </span>
                              )}
                            </Td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </Scroller>
            </div>
          )
        })}
      </Section>
    </>
  )
}
