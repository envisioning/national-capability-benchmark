# Joint EVS/WVS Trust source note

Status: promoted as the first source-backed social Trust measure in dataset
4.4.0

Track: source-backed measurement

Recorded: 2026-08-29

## Source

The source is the official [Joint EVS/WVS 2017-2022 dataset documentation](https://www.gesis.org/en/european-values-study/data-and-documentation/joint-evs/wvs-2017-2022-dataset)
and its [weighted results table](https://access.gesis.org/dbk/69549), release
5.0.0, published 2024-06-24. The [codebook](https://access.gesis.org/dbk/69548?download_purpose=-99)
identifies `A165 - Most people can be trusted` as EVS5 Q7 and WVS7 Q57.

The publisher's aggregate table is weighted by `gwght`. Response code `1`
means most people can be trusted, response code `2` means one must be very
careful, and negative codes are missing. The adapter preserves the published
percentage for response `1`. It stores the release reference year 2022, uses
no additional transform and marks the indicator as a perception proxy from an
academic survey.

The aggregate result is inspectable and does not require respondent-level
microdata in this repository. No restricted microdata or credentials are
committed.

## Coverage and harmonisation

The adapter compares every source label against the canonical 52-country
registry. It recognized 39 benchmark countries and emitted 36 unique country
rows. Germany, Great Britain and the Netherlands have separate EVS and WVS
rows in the aggregate table. They are held rather than averaged because the
project has not yet documented a pooled respondent-weight rule. The other 16
benchmark countries have no usable A165 row in this release.

There is no interpolation, carry-forward or country-specific recoding. The
observation value is the publisher's percentage, with its source URL, release
year, academic-survey tier and retrieval timestamp attached. The output is
`data/observations/joint-evs-wvs.json` and the source adapter is
`packages/core/src/pipeline/adapters/joint-evs-wvs.ts`.

## Reproduction

Run the pinned source adapter, then use the shared model pipeline:

```bash
pnpm bench trust fetch
pnpm bench score
pnpm bench diagnose
pnpm bench report
pnpm bench validate
```

The adapter writes changes to `data/observations/revisions.json`. The store
loads this file with World Bank and manual observations. The normal scoring,
confidence, diagnostics and report code then treats the source as one of the
registered measurement inputs. The Delphi layer is not called and no AI value
is written by this import.

## Promotion review

The social row combines with the existing `contract_enforcement_days` row to
produce a provisional Trust score for 36 countries. Those cells have two
observed indicators and confidence 0.159. Trust correlates with log GDP per
capita at Pearson 0.627 and Spearman 0.711 on 35 aligned countries; A165 alone
has Pearson 0.669 in the current alignment. These are published diagnostics
and watch items, not grounds for hiding the source.

This does not finish Trust. The next source task is a comparable
institutional-performance measure, preferably court-case clearance. The next
social task is a licensed, reproducible pooled treatment for the three held
EVS/WVS country rows. See D64 and the [Trust baseline](BASELINE.md).
