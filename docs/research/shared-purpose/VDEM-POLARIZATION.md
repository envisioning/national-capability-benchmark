# V-Dem political polarization

Task: issue #22, Shared Purpose, promoted in dataset 6.2.0

Track: source-backed measurement

Status: promoted with a closed-regime limitation (A13)

## Source and construct

The candidate is `v2cacamps`, V-Dem's "Political polarization" item in the
[Country-Year: V-Dem Full+Others v15 release](https://www.v-dem.net/data/the-v-dem-dataset/country-year-v-dem-fullothers-v15/),
codebook section 3.15.1.1. The question is whether society is polarized into
antagonistic political camps, clarified as the extent to which political
differences affect social relationships beyond political discussion. Responses
run from 0, supporters of opposing camps generally interact in a friendly
manner, to 4, they generally interact in a hostile manner. Coders answer on
that ordinal scale and V-Dem's Bayesian measurement model aggregates them.

That is the declared construct of `political_polarization`: the degree to
which political differences run along a single hostile divide. It counts
hostility between camps and not the existence of disagreement, which is the
distinction the registry note asks for.

The item is not in the Core archive the adapter pinned for D83. It is in the
Full+Others archive of the same release (v15, 2025-03-04, CC BY-SA 4.0), at
`https://www.v-dem.net/media/datasets/V-Dem-CY-FullOthers-v15_csv.zip`, about
26 MB zipped and 400 MB unpacked. The adapter now pins that archive for both
V-Dem rows and streams the CSV line by line. Its `v2x_cspart` values match the
Core archive for all 53 countries, so civil-society strength does not restate.

## Variable choice

The adapter reads `v2cacamps_osp`, the measurement-model estimate linearly
mapped back onto the original 0 to 4 response scale, so the published raw value
reads against the codebook's own answer labels. It correlates with the
unbounded model estimate `v2cacamps` at 0.985 across the frame, and the
normalization is rank-robust to the difference. Higher is more hostile, so the
registry direction is `lower_better`.

## Coverage and treatment

| Test | Result |
| --- | --- |
| Benchmark countries | 53 / 53 |
| Reference year | 2024 for every emitted row |
| Distinct values | 52 |
| Range in the frame | 0.40 (Ireland) to 3.98 (Poland, Turkey) |
| Coders per country-year | 3 to 10 |
| Direction | Lower is better |
| Source tier | `expert_panel` |
| Treatment | `indicator`, `adapter` ingest |

No value is imputed or carried forward.

## Diagnostics at promotion

| Test | Result |
| --- | --- |
| Row against log GDP per capita | r = 0.335 (n = 51), below the 0.70 screen |
| Strongest correlation with any scored row | 0.565 with `interpersonal_trust` (n = 37), below the 0.85 redundancy threshold |
| Against the other Shared Purpose rows | 0.30 with income inequality, 0.04 with tax revenue |
| Against Coordination rows | 0.17 with civil-society strength, under 0.10 with the rest |
| Shared Purpose against log GDP per capita | 0.479 (n = 51), up from 0.457 (n = 47) |
| Wealth-attribution delta of the row | 0.093 (0.386 without it, 0.479 with it) |

The row passes every numeric gate. It raises the dimension's wealth
correlation by 0.093, more than the 0.046 D83 accepted and well under the 0.288
D44 retired a row over, and Shared Purpose remains the least wealth-tracking of
the nine dimensions.

It is not a behavioural check under D60: it fails none of the tests a check
must name.

## The limitation

Sorted by V-Dem's own regime classification (`v2x_regime`, 2024), the values
form a U. Liberal democracies average 1.77 and closed autocracies 1.85;
electoral autocracies average 2.98 and electoral democracies 2.80. A closed
regime with no organised opposition reads as calm. The United Arab Emirates
(1.06), Rwanda (0.98) and Singapore (1.15) sit beside Ireland, Japan and
Switzerland. This is recorded as A13 and in D115.

## Reproduction

```text
pnpm bench vdem fetch
pnpm bench score
pnpm bench diagnose
pnpm bench report
pnpm bench agenda
pnpm bench validate
```

The adapter is `packages/core/src/pipeline/adapters/vdem.ts`; the pinned
archive and the variable table live in
`packages/core/src/model/source-catalog.ts`; the output is
`data/observations/vdem-cy-core.json`, whose name predates the switch of
archive.
