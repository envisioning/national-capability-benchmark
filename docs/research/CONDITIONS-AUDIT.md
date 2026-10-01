# Conditions audit: which scored rows observe capability, and which describe its conditions

Status: Tier A adopted in dataset 7.0.0 (D122), 2026-10-01. Tier B and the two
borderline rows are held. The figures below are the scratch rescore of 6.2.0
that the decision was made on.

## Why

The benchmark tests whether capability is separate from wealth (`docs/WHY.md`).
D118 chooses rows for what they measure. The owner then decided that rows
describing the conditions capability works in, such as stocks of
infrastructure, access, spending and enrolment, leave the dimension scores
and are published in a conditions layer beside each dimension, the same way
checks are (D60). A score then reads what a country does, and the conditions
layer reads what it has to work with. That split is the map the Brazil
adaptability report needs: conditions on one side, the capability they produce
or fail to produce on the other.

## The rule

A row **observes capability** when it records the country doing what its
dimension names: a behaviour, a throughput, an outcome, a rate, or performance
relative to resources.

A row **describes a condition** when it records what the country has: a stock
of infrastructure, access, money, people or enrolment, or a structural
feature of the environment that actors work within.

Conditions come in two tiers:

- **Tier A, bought conditions.** Stocks and inputs that money buys, plus
  income itself.
- **Tier B, environment conditions.** Rules, structure and participation
  levels that money does not directly buy.

**Disclosure.** D118 asks for the construct verdict before the values are
seen. In this audit the per-row income correlations were printed in the same
listing as the definitions, so the verdicts below were written with them in
view. The rule above is stated so that someone else can repeat the verdicts
from the definitions alone. Each correlation is shown so a reader can check
for drift.

## Verdicts, all 38 scored rows

| Dimension | Row | Class | Verdict | Reason | r log GDP |
| --- | --- | --- | --- | --- | ---: |
| Anticipation | `rd_expenditure_gdp` | I | **Condition A** | Spending; its own note calls it an input | 0.63 |
| Anticipation | `researchers_per_million` | I | **Condition A** | Standing stock of people | 0.79 |
| Anticipation | `secure_internet_servers` | I | **Condition A** | Diffusion stock of digital adoption | 0.90 |
| Anticipation | `sci_articles_per_million` | O | Capability, borderline | Research activity, but volume per head; OpenAlex impact would replace it | 0.79 |
| Anticipation | `statistical_performance` | C | Capability | Performance of the national sensing system | 0.77 |
| Agency | `internet_users` | I | **Condition A** | Access stock | 0.88 |
| Agency | `account_ownership` | I | **Condition A** | Access stock; its note calls it a precondition | 0.79 |
| Agency | `domestic_credit_private` | I | **Condition A** | Financial depth, a stock | 0.54 |
| Agency | `business_start_days` | C | Condition B | Regulatory friction actors face, not their action. Frozen at 2019 | 0.60 |
| Agency | `business_start_procedures` | C | Condition B | Same as above | 0.64 |
| Agency | `new_business_density` | C | Capability | Intention becoming a registered firm | 0.41 |
| Coordination | `time_to_export` | C | Capability | Throughput of agencies acting together | 0.55 |
| Coordination | `budget_execution_fidelity` | C | Capability | Plan against delivery | 0.22 |
| Coordination | `civil_society_strength` | C | Capability | Participation and organisation (expert-coded) | 0.40 |
| Trust | `contract_enforcement_days` | C | Capability | Court throughput | 0.17 |
| Trust | `interpersonal_trust` | P | Capability | The attitude the dimension names | 0.66 |
| Learning | `tertiary_enrollment` | I | **Condition A** | Volume of enrolment; its note says it measures nothing learned | 0.81 |
| Learning | `education_expenditure_gdp` | I | **Condition A** | Its note calls it a pure input | 0.35 |
| Learning | `vocational_secondary_share` | I | Condition B | Structure of the school system; direction is ambiguous | 0.26 |
| Learning | `human_capital_index` | C | Capability, borderline | Learning-adjusted outcome, but it folds in child survival and stunting | 0.88 |
| Learning | `firm_training_incidence` | C | Capability | Firms acting to build skills | 0.26 |
| Experimentation | `resident_patents_per_million` | O | Capability | Completed experiments | 0.52 |
| Experimentation | `resident_trademarks_per_million` | O | Capability | Many small experiments | 0.58 |
| Experimentation | `early_stage_entrepreneurial_activity` | C | Capability | People trying | -0.30 |
| Experimentation | `failure_tolerance` | P | Capability | The attitude the dimension names | 0.48 |
| Adaptability | `broadband_subscriptions` | I | **Condition A** | Infrastructure stock | 0.85 |
| Adaptability | `labor_force_participation` | I | Condition B | A participation level shaped by norms; its note calls it how much can be reallocated at all | 0.58 |
| Adaptability | `electricity_transmission_losses` | O | Condition B | State of the grid | 0.69 |
| Adaptability | `unemployment_rate` | O | Capability | Labour-market outcome | 0.16 |
| Adaptability | `long_term_unemployment_share` | O | Capability | Reallocation speed | 0.36 |
| Adaptability | `export_diversification` | C | Capability | Breadth of what the economy sells | 0.45 |
| Building | `labour_productivity` | O | **Condition A** | Income per worker. Its note says it was kept so the GDP test has something to bite on; in the conditions layer it still does | 0.89 |
| Building | `manufacturing_value_added` | O | Capability | Making physical things at scale | 0.17 |
| Building | `high_tech_exports_share` | O | Capability | Sophistication of what is built | 0.45 |
| Building | `electricity_connection_speed` | C | Capability | Delivery end to end | 0.03 |
| Building | `economic_complexity` | O | Capability | What the economy can make | 0.46 |
| Shared purpose | `income_inequality` | O | Condition B | Its note calls it a structural constraint | 0.38 |
| Shared purpose | `tax_revenue_gdp` | O | Capability | Revealed willingness to fund public goods | 0.22 |

Tier A holds 10 rows and Tier B holds 6. The other 22 stay scored.

## What each tier does to the model

This is a scratch rescore of 6.2.0 with the moved rows retired. Retired rows
leave the confidence denominator, which is how a conditions row would behave.

| Dimension | r log GDP: now → A → A+B | Mean confidence: now → A → A+B | Scored countries: now → A → A+B | Brazil: now → A → A+B |
| --- | --- | --- | --- | --- |
| Anticipation | 0.87 → 0.87 → 0.87 | 0.60 → 0.45 → 0.45 | 53 → 52 → 52 | 37.3 → 45.8 → 45.8 |
| Agency | 0.85 → 0.64 → none | 0.58 → 0.38 → 0.28 | 52 → 52 → **0** | 58.9 → 51.6 → none |
| Coordination | 0.56, unchanged | 0.36, unchanged | 52 | 86.4 |
| Trust | 0.61, unchanged | 0.21, unchanged | 37 | 26.9 |
| Learning | 0.73 → 0.66 → 0.73 | 0.49 → 0.37 → 0.35 | 53 → 52 → 48 | 43.5 → 30.2 → 41.8 |
| Experimentation | 0.62, unchanged | 0.23, unchanged | 52 | 30.0 |
| Adaptability | 0.84 → 0.74 → 0.46 | 0.68 → 0.64 → 0.52 | 53 | 62.7 → 65.4 → 73.7 |
| Building | 0.64 → 0.43 → 0.43 | 0.60 → 0.55 → 0.55 | 53 | 25.3 → 28.2 → 28.2 |
| Shared purpose | 0.46 → 0.46 → none | 0.26 → 0.26 → 0.16 | 47 → 47 → **0** | 34.9 → 34.9 → none |

| Whole model | now | A | A+B |
| --- | ---: | ---: | ---: |
| Share of variance on the first factor of the dimension scores | 0.62 (8 dims) | 0.50 (8 dims) | 0.52 (6 dims) |
| Mean absolute correlation between dimensions | 0.57 | 0.49 | 0.46 |
| Guardrail: mean confidence vs log GDP | 0.39 | 0.32 | 0.36 |

## Reading

- **Tier A is the claim's test, run honestly.** The single-factor share falls
  from 0.62 to 0.50 and the dimensions separate (mean r 0.57 to 0.49). Much of
  the one-factor collapse `WHY.md` warns about was carried by bought
  conditions. The guardrail improves as well.
- **Anticipation does not move.** It stays at 0.87 with only statistical
  performance and articles per head left. The capability rows themselves track
  income there. That is a finding against the claim, and it is published as
  one.
- **Tier B is not viable as a block.** It leaves Agency and Shared purpose
  below the two-row floor (D45) everywhere. Each Tier B row should move only
  when its dimension has a capability row to replace it.
- **Confidence falls where conditions carried it.** Agency (0.38) and
  Learning (0.37) drop below the 0.40 target. The thin evidence on those
  dimensions was hidden by stocks. O1 work then points at Agency and Learning,
  where OpenAlex (#23) is already researched.
- **Brazil moves.** Anticipation rises (37 to 46) and Learning falls (44 to
  30). The Adaptability report reads 65.4 under Tier A, without broadband.

## Proposal

1. Move Tier A (10 rows) to the conditions layer as one major release (7.0.0),
   with a decision entry, a published conditions layer per dimension, and
   both lexicons.
2. Hold Tier B. Move each row only once its dimension has a capability
   replacement, and decide each one separately.
3. Flag the two borderline rows (`sci_articles_per_million`,
   `human_capital_index`) for replacement rather than moving them now:
   OpenAlex impact for the first, a learning-outcome series for the second.
