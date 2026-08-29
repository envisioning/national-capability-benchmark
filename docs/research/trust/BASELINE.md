# Trust research baseline

Status: source-backed first release, court-performance follow-up open

Recorded: 2026-08-29

Dataset: 4.4.0, generated 2026-08-29

This baseline is the starting point for TRUST-1 through TRUST-5 in
`docs/RESEARCH-ROADMAP.md`.
The detailed extraction note is [`JOINT-EVS-WVS.md`](JOINT-EVS-WVS.md).

## Current state

Trust has eight registry rows:

| Family | Row | Status | Current coverage | Problem |
| --- | --- | --- | ---: | --- |
| Institutional | `rule_of_law` | retired | 0 of 52 | WGI perception composite, retired under D23. |
| Institutional | `control_of_corruption` | retired | 0 of 52 | WGI perception composite, retired under D23. |
| Institutional | `contract_enforcement_days` | observed | 51 of 52 | Doing Business series frozen at 2019. |
| None | `homicide_rate` | retired | 0 of 52 | Physical safety is not trust and the row raises GDP sensitivity. |
| Social | `interpersonal_trust` | observed by adapter | 36 of 52 | Joint EVS/WVS A165 has 39 recognized benchmark countries; Germany, Great Britain and the Netherlands have separate EVS and WVS rows held for pooled microdata. |
| Institutional | `institutional_trust` | gap | 0 of 52 | OECD coverage is limited and WVS access and harmonisation remain unresolved. |
| Social | `willingness_to_cooperate_strangers` | gap | 0 of 52 | WVS extraction and harmonisation are not yet in the repository. |
| Institutional | `court_case_clearance` | gap | 0 of 52 | Court data needs a cross-publisher harmonisation path. |

The current output publishes a Trust score for 36 countries where both the
Joint EVS/WVS social row and the contract-enforcement row are observed. The
score is provisional: both cells rest on exactly two indicators and confidence
is 0.159, while 16 countries remain below the coverage floor. The
`bribery_incidence` behavioural check still publishes for all 52 countries. It
is evidence beside Trust, not a Trust indicator. D60 excludes it because adding
it would increase the dimension's GDP sensitivity.

## Acceptance test

The first provisional source-backed Trust score requires the first and second
conditions below. A finished Trust release must satisfy all six:

1. At least one social series and one institutional-performance series are in
   the frame.
2. Both series have documented country overlap and coverage against the full
   52-country set.
3. The source definitions, reference periods, weights, missing codes and
   transformations are comparable across countries.
4. The institutional series observes performance or completed work. A new
   perception composite does not pass this test.
5. The combined Trust dimension clears the coverage floor where it publishes,
   and its wealth attribution does not recreate the D23, D42 or D60 failure.
6. The two families add distinct information rather than repeating the same
   survey or administrative source under different names.

The half-frame screen from D52 is the first coverage test for a candidate. It
means at least 26 of the current 52 countries, subject to the stronger Trust
acceptance test above. A candidate that fails remains a gap or a check. Do not
lower this screen silently.

## Source work order

### Social first: generalised interpersonal trust

Use the official [Joint EVS/WVS 2017-2022 documentation](https://www.gesis.org/en/european-values-study/data-and-documentation/joint-evs/wvs-2017-2022-dataset),
the [A165 codebook](https://access.gesis.org/dbk/69548?download_purpose=-99)
and the [weighted results table](https://access.gesis.org/dbk/69549). The
adapter's extraction note identifies A165, response coding, `gwght`, missing
values, the 2022 release year and the 39 recognized benchmark countries. Its
three held duplicate-country rows are a known coverage limit, not an
interpolation.

Do not commit the source microdata unless the license permits it. A permitted
derived country-year file and a reproducible extraction script are preferable
to copying a restricted respondent-level file.

### Institutional performance second: court case clearance

Start with [CEPEJ-STAT](https://www.coe.int/en/web/cepej/cepej-stat), then check
OECD and national court statistics for countries outside CEPEJ coverage. Record
the exact case class, court level, numerator, denominator and year for every
candidate value. CEPEJ's clearance-rate definition is a useful starting point,
but it does not make different national court systems automatically
comparable.

The [OECD Trust Survey](https://www.oecd.org/en/publications/2024/07/oecd-survey-on-drivers-of-trust-in-public-institutions-2024-results_eeb36452.html)
is a comparator for perceived institutional trust. It is not a
replacement for court performance in this acceptance test because its current
wave does not cover the full benchmark set.

## Files an agent should produce

For each source candidate, create a memo in this directory with:

- source URL and release date;
- license and inspectability decision;
- variable or series identifiers;
- country and year coverage table;
- codebook and harmonisation rules;
- missingness, weights and reference-period treatment;
- raw-to-derived transformation;
- GDP sensitivity and redundancy plan;
- recommendation: indicator, check, manual, gap or rejected.

Keep raw downloads outside the repository when their terms require it. Commit
only permitted derived data, fixtures, extraction code and source metadata.

## Commands after data work

For the current social adapter, run `pnpm bench trust fetch`. For a manual
import, validate the observation file before scoring. Then run:

```bash
pnpm bench score
pnpm bench diagnose
pnpm bench report
pnpm bench validate
pnpm build
pnpm typecheck
```

The social family is promoted in dataset 4.4.0. Do not promote the remaining
Trust gaps from a memo alone. Each promotion change must include the registry,
source code or permitted manual data, the version bump, the decision entry and
generated output. Run the full Delphi review described in TRUST-5 only after
reviewing the source-backed release.

## Baseline evidence

- `data/out/index.json` reports dataset version 4.4.0, with Trust scores in 36
  of 52 countries.
- `data/out/countries/*.json` contains the Joint EVS/WVS social row in 36
  countries and the contract-enforcement row in 51.
- `data/out/diagnostics.json` reports Trust as 2 of 8 observed indicators,
  0.209 mean coverage and 0.130 mean confidence. Trust's dimension GDP
  correlation is 0.627; the Joint EVS/WVS row alone is 0.669 in the current
  alignment and is a watch item rather than a reason to hide the source.
- `docs/DECISIONS.md` D57 defines the two-family acceptance test.
- `docs/DECISIONS.md` D60 defines the excluded bribery-incidence check.
- `docs/DECISIONS.md` D64 records the source-adapter promotion and its limits.
