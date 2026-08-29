# Trust research baseline

Status: baseline complete

Recorded: 2026-08-29

Dataset: 4.3.0, generated 2026-08-28

This baseline is the starting point for TRUST-1 through TRUST-5 in
`docs/RESEARCH-ROADMAP.md`. It is a research note, not a new score.

## Current state

Trust has eight registry rows:

| Family | Row | Status | Current coverage | Problem |
| --- | --- | --- | ---: | --- |
| Institutional | `rule_of_law` | retired | 0 of 52 | WGI perception composite, retired under D23. |
| Institutional | `control_of_corruption` | retired | 0 of 52 | WGI perception composite, retired under D23. |
| Institutional | `contract_enforcement_days` | observed | 51 of 52 | Doing Business series frozen at 2019. |
| None | `homicide_rate` | retired | 0 of 52 | Physical safety is not trust and the row raises GDP sensitivity. |
| Social | `interpersonal_trust` | gap | 0 of 52 | WVS extraction and harmonisation are not yet in the repository. |
| Institutional | `institutional_trust` | gap | 0 of 52 | OECD coverage is limited and WVS access and harmonisation remain unresolved. |
| Social | `willingness_to_cooperate_strangers` | gap | 0 of 52 | WVS extraction and harmonisation are not yet in the repository. |
| Institutional | `court_case_clearance` | gap | 0 of 52 | Court data needs a cross-publisher harmonisation path. |

The current output publishes no Trust score. The observed row is one stale
institutional measure, so the coverage floor correctly leaves `score` null.
The current output does publish the `bribery_incidence` behavioural check for
all 52 countries. It is evidence beside Trust, not a Trust indicator. D60
excludes it because adding it would increase the dimension's GDP sensitivity.

## Acceptance test

Trust is ready for a source-backed score only when all of these are true:

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

Use the official [WVS wave 7 documentation](https://www.worldvaluessurvey.org/WVSDocumentationWV7.jsp)
and its questionnaire and codebook. The extraction note must identify the
variable, response coding, survey year, sample weight and missing-value codes.
It must also show which of the 52 countries participated and whether fieldwork
years can be treated as one reference period.

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

Use the new adapter command when one exists. For a manual import, validate the
observation file before scoring. Then run:

```bash
pnpm bench score
pnpm bench diagnose
pnpm bench report
pnpm bench validate
pnpm build
pnpm typecheck
```

Do not promote either Trust family from a memo alone. The promotion change must
include the registry, source code or permitted manual data, the version bump,
the decision entry and generated output. Only after that release should an
agent run the full Delphi review described in TRUST-5.

## Baseline evidence

- `data/out/index.json` reports dataset version 4.3.0.
- `data/out/countries/*.json` contains one observed Trust indicator in 51
  countries and no published Trust score.
- `data/out/diagnostics.json` reports Trust as 1 of 8 observed indicators,
  0.123 mean coverage and 0.068 mean confidence.
- `docs/DECISIONS.md` D57 defines the two-family acceptance test.
- `docs/DECISIONS.md` D60 defines the excluded bribery-incidence check.
