# V-Dem voter turnout

Task: O1 triage sweep, Shared Purpose, Q8

Track: source-backed measurement

Status: published as a behavioural check under D60, not scored (D129). No
registry gap is added.

## Source and construct

`v2eltrnout`, "Election turnout", codebook 3.1.4.3 of the
[Country-Year: V-Dem Full+Others v15 release](https://www.v-dem.net/data/the-v-dem-dataset/country-year-v-dem-fullothers-v15/),
read from the archive the adapter already pins for civil-society strength and
polarization. The question is what percentage of all **registered voters**
cast a vote in the national election according to official results. The
voting-age-population reading is a separate variable, `v2elvaptrn` (3.1.4.4),
which IDEA estimates and which can exceed 100. When executive and legislative
elections share a date, V-Dem codes the executive turnout; the country-year
aggregation is the maximum of the year's elections. Sources are Nohlen, IPU,
IDEA and IFES.

## Reading rule

V-Dem codes election variables in election years only. The adapter's
single-year design reads 2024 for every variable, which here would cover 18
countries. Each variable in the adapter's table now carries a year rule:
`latest_election` takes each benchmark country's newest coded row up to 2024
and keeps that row's year on the observation. An out-of-scale newest value
(outside 0 to 100) drops the country rather than falling back to an older
election. `v2elcomvot` and `v2x_regime` from the same country-year go into the
observation note with their codebook labels.

## Coverage

| Test | Result |
| --- | --- |
| Benchmark countries | 52 / 53 (no CHN) |
| Election years | 2024: 18, 2023: 15, 2022: 9, 2021: 7, 2020: 1 (BOL), 2019: 1 (ARE), 2016: 1 (HTI) |
| Range | 18.1 (Haiti 2016) to 98.2 (Rwanda 2024) |
| Brazil | 79.42, 2022, `v2elcomvot` 2 (sanctions enforced, minimal cost), `v2x_regime` 2 |
| Source tier | `expert_panel` |
| Treatment | behavioural check, observation id `__check__voter_turnout` |

## Why it is a check and not a row

| Group (at election year) | n | Mean turnout |
| --- | --- | --- |
| Closed autocracy | 3 | 68.8 |
| Electoral autocracy | 16 | 70.9 |
| Electoral democracy | 15 | 67.5 |
| Liberal democracy | 18 | 69.6 |
| Voting not compulsory | 36 | 65.4 |
| Compulsory, unenforced | 8 | 74.0 |
| Compulsory, enforced at minimal cost | 8 | 82.6 |

Compulsion moves the series by about 17 points; regime moves it by none, so
managed turnout in autocracies (Vietnam 95.6, Rwanda 98.2, Ethiopia 93.6,
Singapore 93.6 under enforced compulsion) sits beside free turnout in
democracies on the same scale. It also reads the democratic channel A5 retired.
The triage sweep's rule (`v2x_regime` 2 or 3 and `v2elcomvot` 0 or 1) leaves
27 countries and excludes Brazil; it is not wired.

## Findings

- `behaviouralChecks`: r = 0.053 against log GDP per capita (n 52), 0.007
  against the Shared Purpose score (n 46). Not a wealth proxy; kept out on
  construct.
- No scored cell, confidence or composite moves; 477 cells identical.
- The United Arab Emirates' 34.8% (2019) is turnout of an appointed electoral
  college for the Federal National Council, not of citizens.
- The voice-and-accountability retirement note in `indicators.ts` still lists
  voter turnout among declared gaps; it is a check now, not a gap.
