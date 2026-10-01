# V-Dem political polarization

Task: issue #22, Shared Purpose

Track: source-backed measurement

Status: published as a behavioural check under D60, not scored (D121, A13).
The registry gap `political_polarization` stays open.

## Source and construct

The candidate is `v2cacamps`, V-Dem's "Political polarization" item in the
[Country-Year: V-Dem Full+Others v15 release](https://www.v-dem.net/data/the-v-dem-dataset/country-year-v-dem-fullothers-v15/),
codebook section 3.15.1.1. The question is whether society is polarized into
antagonistic political camps, clarified as the extent to which political
differences affect social relationships beyond political discussion. Responses
run from 0, supporters of opposing camps generally interact in a friendly
manner, to 4, they generally interact in a hostile manner. Coders answer on
that ordinal scale and V-Dem's Bayesian measurement model aggregates them.

On its face that is the declared construct of the `political_polarization`
gap: the degree to which political differences run along a single hostile
divide. It counts hostility between camps and not the existence of
disagreement, which is the distinction the registry note asks for.

The item is not in the Core archive the adapter pinned for D83. It is in the
Full+Others archive of the same release (v15, 2025-03-04, CC BY-SA 4.0), at
`https://www.v-dem.net/media/datasets/V-Dem-CY-FullOthers-v15_csv.zip`, about
26 MB zipped and 400 MB unpacked. The adapter now pins that archive for both
V-Dem series and streams the CSV line by line. Its `v2x_cspart` values match
the Core archive for all 53 countries: the re-fetch restated none of them.

## Variable choice

The adapter reads `v2cacamps_osp`, the measurement-model estimate linearly
mapped back onto the original 0 to 4 response scale, so the published value
reads against the codebook's own answer labels. It correlates with the
unbounded model estimate `v2cacamps` at 0.985 across the frame. Higher is more
hostile, so the check's direction is `lower_better`.

## Coverage

| Test | Result |
| --- | --- |
| Benchmark countries | 53 / 53 |
| Reference year | 2024 for every emitted row |
| Distinct values | 52 |
| Range in the frame | 0.40 (Ireland) to 3.98 (Poland, Turkey) |
| Coders per country-year | 3 to 10 |
| Direction | Lower is better |
| Source tier | `expert_panel` |
| Treatment | behavioural check, observation id `__check__political_polarization` |

No value is imputed or carried forward.

## Why it is a check and not a row

The series passes every numeric gate. Scored, on branch
`polarization-vdem` (commit 1c0f6b5), it correlated with log GDP per capita at
0.335 (n = 51, direction-corrected), its strongest pairing with any scored row
was 0.565 with `interpersonal_trust`, and it lifted Shared Purpose from 47 to
52 published countries and mean confidence from 0.260 to 0.350.

It fails on construct. Sorted by V-Dem's own regime classification
(`v2x_regime`, 2024), the values form a U. Liberal democracies average 1.77 and
closed autocracies 1.85; electoral autocracies average 2.98 and electoral
democracies 2.80. A low value has two causes the number cannot separate: camps
that compete and still meet as fellow citizens, and a regime under which no
opposition camp may organise. The United Arab Emirates (1.06), Rwanda (0.98) and
Singapore (1.15) read beside Ireland (0.40) and Japan (0.87). Scored, the row
raised the United Arab Emirates by 11.1 points and Rwanda by 11.5, and let
Singapore and Vietnam publish a Shared Purpose score for the first time on the
strength of their calm.

Low measured hostility under repression is not shared purpose. That is the trap
A5 recorded with Singapore under voice and accountability, inverted: there a
perception composite penalised political uniformity, here an expert item
rewards it. The project decided construct first (D121): a row is judged on what
it measures, and its income correlation is reported, not used as the gate. So
the series is published beside the dimension with the reason attached, where a
reader can see it, and is kept out of every number.

## As a check, on dataset 6.1.2

| Test | Result |
| --- | --- |
| `behaviouralChecks` countries | 53 |
| Published value against log GDP per capita | r = -0.335 (richer reads calmer) |
| Published value against the Shared Purpose score | r = -0.227 (n = 47) |
| Shared Purpose scores, confidence, coverage | unchanged in all 477 country-dimension cells |

## What would score it

A second V-Dem item that conditions the reading on competition existing at all,
for example scoring the item only where `v2x_regime` is at least electoral
autocracy and declaring it unobserved elsewhere; or a behavioural Shared
Purpose row (civic participation, volunteering, voter turnout) landing and
agreeing with the item outside the closed regimes. Either would be a new
decision, and the gap in `indicators.ts` stays open for it.

## Reproduction

```text
pnpm bench vdem fetch
pnpm bench score
pnpm bench diagnose
```

The adapter and its variable table are in
`packages/core/src/pipeline/adapters/vdem.ts`; the pinned archive is in
`packages/core/src/model/source-catalog.ts`; the check is in
`packages/core/src/model/checks.ts`; the output is
`data/observations/vdem-cy-core.json`, whose name predates the switch of
archive.
