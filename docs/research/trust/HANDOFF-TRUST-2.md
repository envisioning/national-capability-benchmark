# Handoff: TRUST-2 court case clearance value preflight

**Done 2026-10-01.** Steps 1 to 5 were run and the screen failed at 13 of 53.
The result is in `COURT-CLEARANCE.md` under "Value preflight". This file is
kept as the record of what was asked.

For an agent with open web access. Written 2026-10-01 at the end of a session
whose egress policy blocked every primary host.

```text
Task: TRUST-2
Track: source-backed
Status: blocked (egress), desk preflight complete
Dataset and release: 6.1.2, app 1.15.1
Indicator ids: court_case_clearance (gap); candidate companion: court disposition time (not in registry)
Countries covered: 0 / 53 fetched; 26 mapped to regional publishers, 5 to national
Years covered: CEPEJ 2022; CEJA 2025 release, years unverified
Source and license: CEPEJ (Council of Europe), CEJA (OAS-affiliated); reuse terms unverified
Files changed: docs/research/trust/COURT-CLEARANCE.md, this file, docs/RESEARCH-ROADMAP.md
Commands run: none against data; curl and WebFetch to primary hosts refused
Diagnostics result: none
Decision entry: none yet
Version impact: none yet; promotion would be a minor bump (indicator added, no country)
Next action: below
```

## Read first

1. `AGENTS.md`, especially the invariants on gaps, adapters, revisions and
   versioning.
2. `docs/research/trust/COURT-CLEARANCE.md`: coverage map, construct
   findings, proposed treatment and gate. This handoff does not repeat them.
3. `docs/RESEARCH-ROADMAP.md`, sections TRUST-2 to TRUST-4.
4. D23, D57 and D60 in `docs/DECISIONS.md`.
5. `docs/research/trust/JOINT-EVS-WVS.md` and
   `packages/core/src/pipeline/adapters/joint-evs-wvs.ts`, as the pattern
   for a pinned-release adapter.

## Blocked hosts, so you do not retry blind

`rm.coe.int`, `www.coe.int`, `cejamericas.org`, `www.cnj.jus.br`,
`sdmx.oecd.org`, `api.worldbank.org`, `public.tableau.com`. Check you can
reach the first two before starting.

## Your job, in order

Stop at the first step that fails its condition. Write the failure into
`COURT-CLEARANCE.md` and leave the row as a gap.

### 1. CEPEJ values (14 countries)

Source: the CEPEJ 2024 country profiles, 2022 data, and CEPEJ-STAT if it
exports. For NLD CHE EST DEU FRA GBR ESP PRT POL SWE FIN IRL TUR ISR, record:
incoming, resolved and pending at year end, for civil and commercial litigious
cases at first instance, for 2020, 2021 and 2022 if the 2022 and 2020 cycles
publish them. Also record the clearance rate and disposition time as CEPEJ
prints them, so the arithmetic can be checked.

For GBR, record England and Wales, Scotland and Northern Ireland separately.
Note any `NA`, and any footnote that changes the scope.

Find CEPEJ's reuse terms and quote them.

### 2. CEJA scope and values (12 countries)

Source: the ICJ CEJA 2025 report (Spanish, and the English edition announced
2025-09-23). Settle first: are its TR and TC counted per matter (civil, penal,
labour, family) or pooled? Which years? Which instance?

- If a civil split exists: record incoming, resolved and pending for BRA BOL
  CHL COL CRI ECU SLV NIC PAN URY PER DOM, for every year given.
- If it pools all matters: record that CEJA cannot fill a civil and
  commercial row. Then check each country's own judiciary statistics for a
  civil split before dropping it.

### 3. Brazil crosswalk

Compare CEJA's Brazil figure with CNJ Justiça em Números for the same year:
headline IAD, and the IAD for the state courts' civil first instance if CNJ
publishes it. A gap larger than a few points means the routes differ in scope.
Say which one the row should use.

### 4. The 22 unfound countries

CAN MEX ARG KOR JPN CHN IDN VNM PHL MYS THA ARE ZAF NGA RWA ETH PRY VEN GTM
HND CUB HTI. Search each country's judiciary or statistics office for annual
civil case incoming and resolved counts. One line per country: found (URL,
scope, years) or not found (what you searched). Also check whether OECD's
judicial-performance work or the World Justice Project publish a cross-country
clearance or disposition series that covers several of them.

### 5. Coverage verdict

Count countries where civil and commercial first-instance values exist for
the reference period. The half-frame screen needs 27 of 53. Below it, the
row stays a gap: record the count and stop.

### 6. Only if step 5 passes

- Put the values in a fixture file under the adapter's test folder, not in
  `data/observations`, until review.
- Compute both clearance (three-year mean) and disposition time. Correlate
  each with `contract_enforcement_days` and with GDP per capita over the
  overlapping countries. Report n with every figure.
- Write the decision entry per `AGENTS.md`: read the highest D number
  immediately before writing, check again after, append only, and include an
  `**Overturned by.**` clause. It must settle the open choices in the note:
  the multi-year rule, the pooling rule for multi-jurisdiction countries, a
  cap at 100 or the Tukey fences, and clearance or disposition time or both.
- Only then build the adapter, wire the row, bump the minor dataset version,
  run `pnpm bench score`, `diagnose`, `report`, `validate`, `pnpm build` and
  `pnpm typecheck`.

## Rules that bite here

- Never copy a value you did not see in the source. Record the URL and page
  or table for every number.
- Never mix scopes in one row without a flag. A pooled all-matter rate is not
  a civil rate.
- Do not use Delphi to fill a missing country.
- Do not add a country. Puerto Rico is in CEJA and outside the frame.
- Do not delete or retire the gap if the screen fails. A failed preflight is a
  result: write it down.

## Handoff back

End with the roadmap template filled in (bottom of
`docs/RESEARCH-ROADMAP.md`). Update the Status line of TRUST-2 in the roadmap
and the Status line of `COURT-CLEARANCE.md`.
