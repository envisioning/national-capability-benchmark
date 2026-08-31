# V-Dem civil-society strength

Task: P1 Coordination, promoted as part of dataset 4.5.0

Track: source-backed measurement

Status: promoted with an explicit expert-coding limitation

## Source and construct

The candidate is `v2x_cspart`, V-Dem's civil society participation index in
the [Country-Year: V-Dem Core v15 release](https://www.v-dem.net/data/the-v-dem-dataset/country-year-v-dem-core-v15/).
The codebook describes a 0–1 index of the autonomy, organisation and
participatory reach of civil-society organisations. That is the declared
construct of `civil_society_strength`; it is not a score of government
reputation and it does not claim to measure court throughput or cross-agency
delivery.

The release is publicly downloadable as a ZIP archive at
`https://www.v-dem.net/media/datasets/V-Dem-CY-Core-v15_csv.zip`, published in
March 2025 under CC BY-SA 4.0. The adapter fixes the release, variable and
reference year (2024), extracts the CSV and emits the project's existing
national observation shape. The raw archive is not committed; the derived
53-row observation file is.

## Coverage and treatment

| Test | Result |
| --- | --- |
| Benchmark countries | 53 / 53 |
| Reference year | 2024 for every emitted row |
| Value range | 0–1, as published |
| Direction | Higher is better |
| Source tier | `expert_panel` |
| Treatment | `indicator`, `adapter` ingest |

No value is imputed or carried forward. A country missing from a future pinned
release will be reported as held and will not silently inherit 2024.

## Diagnostics at promotion

The new row has Pearson r = 0.395 with log GDP per capita (n = 50), below the
0.70 wealth-proxy screen. The Coordination dimension is r = 0.561 (Spearman
0.611, n = 50); the row contributes a wealth-attribution delta of 0.046 and
does not form a redundant pair with an existing Coordination row. Coordination
publishes a score for 52 of 53 countries because the coverage floor still
requires two observed indicators.

These tests are necessary, not proof that expert judgements are unbiased. The
source tier remains visible in every indicator row and continues to lower
confidence. The remaining Coordination gaps are university–industry
collaboration and public–private collaboration. Court performance remains the
open institutional Trust work package.

## Reproduction

```text
pnpm bench vdem fetch
pnpm bench score
pnpm bench diagnose
pnpm bench report
pnpm bench validate
```

The adapter is `packages/core/src/pipeline/adapters/vdem.ts`; the pinned source
identifiers live in `packages/core/src/model/source-catalog.ts` and the output
is `data/observations/vdem-cy-core.json`.
