import { Icon } from '@/components/Icon'
import { EN, fill, indicatorDefinition, indicatorName, unitName } from '@ncb/core'
import type { ConditionResult, Lexicon } from '@ncb/core'

/** A published value at the precision a reader can use: whole numbers from 100 up. */
export function conditionValue(value: number, locale = 'en-US'): string {
  const digits = Math.abs(value) >= 100 ? 0 : Math.abs(value) >= 1 ? 1 : 2
  return value.toLocaleString(locale, { maximumFractionDigits: digits })
}

/**
 * The panel's own words. English by default; a layer page passes its own set
 * with its lexicon. See D69 and D130.
 */
export type ConditionListWords = {
  label: string
  intro: string
  /** {definition} */
  noValue: string
  /** {rank} {n} */
  rank: string
}

export const CONDITION_WORDS_EN: ConditionListWords = {
  label: 'Conditions, not scored',
  intro:
    'What the country has to work with on this capability. The values are shown as the source published them and are not part of the score, the confidence or the trend. The rank counts the countries with a value, best first.',
  noValue: 'No value for this country. {definition}',
  rank: 'rank {rank} of {n}',
}

/**
 * What the country has to work with on one capability.
 *
 * A condition is a stock of infrastructure, access, money, people or
 * enrolment, or income itself. It is published as the source wrote it, with
 * its rank among the countries that have it, and it enters no frame, no mean,
 * no coverage count, no confidence and no trend. It is never drawn with
 * `Score`, because a raw value on the score's ramp would read as a score. It is
 * a separate panel from `CheckList`: a check is a reading of the capability
 * the model declined to score, a condition is not a reading of the capability
 * at all. See docs/DECISIONS.md D122.
 *
 * A page in another language passes its lexicon and words; names, units and
 * definitions then come from the lexicon, and the registry note, which is
 * English, is left out. `aside` adds lines under a condition, which is how the
 * capability map prints its correlations and peer median (D130).
 */
export function ConditionList({
  conditions,
  lex = EN,
  words = CONDITION_WORDS_EN,
  aside,
}: {
  conditions: ConditionResult[]
  lex?: Lexicon
  words?: ConditionListWords
  aside?: (condition: ConditionResult) => React.ReactNode
}) {
  if (conditions.length === 0) return null
  const english = lex.lang === 'en'

  return (
    <div className="mt-6 rounded-lg border border-[var(--rule)] p-4">
      <p className="mb-1 inline-flex items-center gap-2 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
        <Icon name="package" size={14} />
        {words.label}
      </p>
      <p className="mb-4 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">{words.intro}</p>
      <ul className="space-y-5">
        {conditions.map((c) => {
          const name = english ? c.name : indicatorName(lex, c.indicatorId)
          const definition = english ? c.definition : indicatorDefinition(lex, c.indicatorId)
          const unit = english ? c.unit : unitName(lex, c.unit)
          return (
            <li key={c.indicatorId}>
              <p className="text-xs font-medium tracking-tight">
                {name}
                <span className="ml-2 font-normal text-[var(--muted)]">
                  {c.source}
                  {c.year === null ? '' : `, ${c.year}`}
                </span>
              </p>
              {c.value === null ? (
                <p className="mt-1 text-lg leading-relaxed text-[var(--muted)]">
                  {fill(words.noValue, { definition })}
                </p>
              ) : (
                <p className="mt-1 text-lg leading-relaxed">
                  <span className="tabular-nums">{conditionValue(c.value, lex.numberLocale)}</span>{' '}
                  {unit}
                  {c.rank === null ? '' : (
                    <span className="text-[var(--muted)]">
                      , <span className="tabular-nums">{fill(words.rank, { rank: c.rank, n: c.n })}</span>
                    </span>
                  )}
                  . {definition}
                </p>
              )}
              {english ? (
                <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[var(--muted)]">{c.note}</p>
              ) : null}
              {aside ? aside(c) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
