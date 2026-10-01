# UNCTAD export concentration

Task: Adaptability, fills the declared gap `export_diversification`

Track: source-backed measurement

Status: wired as an adapter (D119). Source memo in GitHub issue #24.

## Source and construct

UNCTADstat dataset `US.ConcentDiversIndices`, "Merchandise: Product
concentration and diversification indices of individual economies", annual
from 1995 to 2025. The row uses the **Concentration Index** for **flow `02`
(exports)**: a normalised Herfindahl-Hirschman index of the export basket across
SITC Rev.3 3-digit products, 0 when exports are spread evenly and 1 when one
product is everything. It is stored as published, with `direction:
'lower_better'`. The Diversification Index in the same file measures distance
from the world basket and is not used.

## Release pin

| Item | Value |
| --- | --- |
| Bulk URL | `https://unctadstat-api.unctad.org/bulkdownload/US.ConcentDiversIndices/US_ConcentDiversIndices` |
| Dataset page | https://unctadstat.unctad.org/datacentre/dataviewer/US.ConcentDiversIndices |
| Archive | 7z, 189,457 bytes, one member `US_ConcentDiversIndices.csv` (1,444,411 bytes, dated 2026-06-24) |
| Archive SHA-256 | `4c415acc2bcc2173d2abccf962cdfe34c791503427d4446385b266982c9711a7` |
| CSV SHA-256 (the pin) | `f3d5bd01e4c7b2a090f4ccd97002c8e6359a675f19ad0794a009db7756f0f86e` |
| Reference year | 2025 |

The URL is not versioned. Two downloads on 2026-10-01 returned byte-identical
archives. The adapter hashes the extracted CSV and refuses a file that does not
match, so a publisher refresh is reviewed and re-pinned in `source-catalog.ts`
rather than absorbed silently. Extraction uses `bsdtar`, which ships with macOS
and reads 7z.

Economies are UN M49 numeric codes written with three digits (`076` Brazil,
`840` United States, `231` Ethiopia, `360` Indonesia); aggregates use four
digits. The adapter carries the 53-country M49 map and its test fails if a
benchmark country has none.

## Licence

Read on 2026-10-01 at https://unctadstat.unctad.org/EN/About.html, under
"Terms of use": all materials on the site are under the Creative Commons
Attribution 3.0 IGO licence, and data and metadata may be copied, duplicated
and redistributed provided the UNCTAD Data Hub is cited as the source. Every
observation note carries "CC BY 3.0 IGO, source: UNCTAD Data Hub". This
resolves the open licence question in issue #24.

## Coverage

| Test | Result |
| --- | --- |
| Benchmark countries | 53 / 53 |
| Latest year | 2025 for every country |
| Flagged `Estimated` | 15: ARE, AUS, BOL, CRI, CUB, DOM, ETH, HTI, NGA, NLD, PAN, PER, PRY, RWA, SLV |
| SITC 931 flag (more than 30% unclassified) | none of the 53 at 2025 |
| Range | 0.0588 (POL) to 0.7624 (VEN) |
| Source tier | `international_organization` |

Every value written to `data/observations/unctad-concentration.json` was
checked against the CSV and against the table in issue #24. No value is
imputed or carried forward; a country without a 2025 value would be reported
as held.

## Diagnostics at wiring

Construct first: the row was accepted on what it measures (D119). These are
findings, from a local `bench score` and `bench diagnose` on dataset 6.1.2.

| Measure | Before | After |
| --- | ---: | ---: |
| Adaptability r with log GDP per capita (n 51) | 0.818 | 0.839 |
| Adaptability Spearman | 0.831 | 0.837 |
| Adaptability mean confidence | 0.469 | 0.588 |
| Observed Adaptability rows per country | 4 | 5 |
| Mean confidence vs log GDP, all dimensions | 0.336 | 0.336 |
| Brazil Adaptability score / confidence | 56.6 / 0.475 | 61.9 / 0.594 |

The row's own r with log GDP is 0.445, its wealth-attribution delta is +0.021,
and it forms no redundant pair.

## Validity caveats

- **Concentration is not always fragility.** Switzerland (0.364, gold and
  pharmaceuticals), Ireland (0.330, pharmaceuticals) and Singapore (0.271,
  re-exports) look concentrated because a few lines are worth a lot.
- **Commodity prices.** Venezuela (0.762), Nigeria (0.619), Ethiopia and Chile
  move with prices even when the basket does not change.
- **Level of detail.** At 3-digit SITC, diversity within a product line is
  invisible.
- **Merchandise only.** Services are excluded, which understates Ireland, the
  United Kingdom and India.
- **Estimated values.** 15 of 53 are UNCTAD mirror estimates from partner
  data, marked in the observation note.

## Reproduction

```text
pnpm bench unctad fetch
pnpm bench score
pnpm bench diagnose
```

The adapter is `packages/core/src/pipeline/adapters/unctad.ts`; the pin lives
in `packages/core/src/model/source-catalog.ts`.
