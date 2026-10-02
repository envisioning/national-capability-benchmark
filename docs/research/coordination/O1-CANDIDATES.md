# Coordination: O1 candidates

Status: desk triage, 2026-10-02. Dataset 7.8.0 on `main`. Nothing in the
registry, the adapters or the data has moved. Method: `docs/RESEARCH-ROADMAP.md`,
"Triage at the desk", under D117 and D118.

## Why this sweep

Coordination misses O1: mean confidence 0.362 against 0.40, on three scored
rows (`time_to_export`, Doing Business, frozen at 2018 or 2019;
`budget_execution_fidelity`, `GF.XPD.BUDG.ZS`, 45 of 53; `civil_society_strength`,
V-Dem `v2x_cspart`, 53 of 53) and two declared gaps
(`university_industry_collaboration`, `public_private_collaboration`). The
coverage denominator is five, so a country observed on all three rows has
coverage 0.6, and the frozen border row holds recency to 0.58 on a third of
the score. The V-Dem sweep (D131, `docs/research/vdem-sweep/TRIAGE.md`) found
nothing in V-Dem that observes independent actors acting together, and the
roadmap parks cross-agency delivery as having no full-frame source family.

The question this sweep asks of every candidate: does it observe independent
actors acting together, or a state coordinating its own parts, and does it do
so without reading executive-led coordination as no coordination (A9)?

## Disclosure on D118

The construct verdicts below were written from the publishers' documentation
and the dimension question ("How effectively can independent actors organize
around shared objectives?") before the candidate's income correlation was
computed. Values were on screen while coverage was counted for every candidate
that reached a preflight: Enterprise Surveys customs clearance, the WUENIC DTP1
and DTP3 estimates, ILOSTAT collective bargaining coverage and the OpenAlex
counts. Two verdicts turned on what the values showed about the construct, not
on income: the OpenAlex row (the collaboration rate barely varies, so the
variation is something else) and DTP dropout (15 countries tied at zero). Both
say so where they are written. r with log GDP per capita is printed for every
candidate that reached values, against the `diagnostics.json` income series,
and decided nothing.

PEFA PI-1 is already in use. `GF.XPD.BUDG.ZS` is SDG 16.6.1, primary
expenditure against the original approved budget. The UN SDG database records
PEFA and finance ministries as its source, and it has no breakdown by function.

## Summary

Ranked by what a session would buy, after construct. "Coverage" counts the 53
at the registry's scope. "r" is the candidate's oriented correlation with log
GDP per capita (higher means richer countries read better), n in brackets.
"A13" asks whether closed or electoral autocracies read well because there is
nothing to observe. "A9" asks whether the row reads a state that coordinates
through its own agencies as one that does not.

| # | Candidate | Construct | Coverage | Spread | A13 / A9 | Redundancy | r log GDP | Verdict |
| --- | --- | --- | ---: | --- | --- | --- | ---: | --- |
| 1 | Enterprise Surveys: days to clear direct exports through customs (`IC.CUS.DURS.EX`) | Outcome. Firms report the time the border took on their own shipments. Successor construct to `time_to_export` | 50 (no ARE CUB HTI); 46 at 2018 or later, 45 at 2023 to 2025 | 1.2 to 27.5 days | Passes both. CHN 11th, SGP 21st, VNM 20th of 50; the time is measured, so a quiet border reads fast only if it is fast | r 0.23 with `time_to_export`, 0.30 with `civil_society_strength`; no pair above 0.40 in any dimension | 0.12 (49) | **Preflight, then indicator (recommendation 1)** |
| 1b | Same, imports (`IC.CUS.DURS.IM`) | Same outcome on imports, where more agencies inspect | 50 | 2.2 to 20.2 days | Passes | r 0.44 with exports | 0.54 (49) | Folded into recommendation 1 as a stability test |
| 2 | OpenAlex: share of a country's works co-authored by a company and a university, 2022 to 2024 | Looked like behaviour (two kinds of actor acting together); on preflight it reads how much industry publishes | 48 at a base of 30 co-authored works (no HND SLV NIC DOM HTI) | 0.1% to 8.5% | Passes: SGP 11th, CHN 17th, ARE 20th of 48 | r 0.82 with `sci_articles_per_million`, 0.73 with `research_citation_impact` | 0.71 (46) | **Dead on construct after preflight** (below). The gap stays declared |
| 3 | WHO/UNICEF WUENIC: DTP1 to DTP3 dropout, 2025 | Follow-through of a multi-visit programme across levels of government | 53 | 15 of 53 tied at 0.0 | Passes (ARE 4th, CHN 7th) | r 0.40 with budget execution | 0.41 (51) | Dead on spread and construct |
| 4 | ILOSTAT collective bargaining coverage (`DF_ILR_CBCT_NOC_RT`) | Firms and unions bound by joint agreements | 44 (no IND IDN ARE NGA BOL ECU GTM DOM HTI); latest 2012 to 2020, 34 at 2018 or later | 0.4% to 98% | Fails A13: CUB 76.8, CHN 45.0 under state unions; ARE absent where unions are banned | r 0.31 with civil society | 0.46 (42) | Dead: reads the legal extension of agreements (FRA 98, URY 95) and is six years stale |
| 5 | OECD Trade Facilitation Indicators, TFI I internal border agency co-operation | Whether institutional frameworks, mechanisms and IT systems for inter-agency co-operation exist, scored 0 to 2 | 163 economies; the 53 not counted | Coarse 0/1/2 variables, some ranked by sample percentile | Not tested | n/a | not computed | Dead on construct: a stock of arrangements, the de jure kind. CC BY 4.0, biennial, next update 2026-27 |
| 6 | UN Global Survey on Digital and Sustainable Trade Facilitation (institutional arrangement and cooperation group) | Implementation stage of 62 measures, from questionnaires validated by the regional commissions | 174 to 180 economies | Implementation rates, 71% global mean | Not tested | Same construct as TFI | not computed | Dead on construct: adoption of measures, not delivery |
| 7 | WTO TFA implementation rate (TFAD notifications) | Share of TFA commitments a member notifies as implemented | 52 at most (ETH is not a WTO member) | Developed members implemented all commitments at entry into force in 2017 by rule, so the rich frame sits at 100 | n/a | n/a | not computed | Dead on spread and construct: a legal notification |
| 8 | B-READY International Trade pillar 3, operational efficiency (`IC.BRE.IT.P3`) | De facto time and cost of trading, partly from firm surveys | 13 in the API (2024 round) | 33.9 to 92.3 | n/a | Would be redundant with 1 | not computed | Dead at the ceiling. Reopen when a round lists 27 of 53 |
| 9 | PEFA PI-2, expenditure composition outturn | Reallocation between functions during execution: the state holding to its own allocation | 89 countries assessed under the 2016 framework, mostly low and middle income; rich members largely absent | A to D grades on variance bands | n/a | Same plan-to-spend family as `budget_execution_fidelity` | not computed | Dead: ceiling below 27 for a recent assessment by the publisher's own description, guardrail failure if it were not, and redundant |
| 10 | UN E-Government Survey, Online Service Index | Desk review of national portals: which services are online | 193 | Wide | n/a | n/a | not computed | Dead on construct: an adoption level; the interoperability items are not published per country |
| 11 | ISORA (IMF, OECD, CIAT, IOTA): tax administration data exchange with other agencies | Whether third-party data-sharing arrangements exist | Published only for administrations that consent | Yes/no items | n/a | n/a | not computed | Dead on construct (an arrangement) and on inspectability |
| 12 | IMF Fiscal Transparency Evaluations; Open Budget Survey | Publication of budget documents, oversight | FTE about 40 countries ever; OBS 125 | n/a | n/a | n/a | not computed | Dead: FTE at the ceiling; OBS is transparency, a Trust construct |
| 13 | Interoperable or fast payment systems (BIS CPMI, World Bank GPSS) | Presence and reach of payment infrastructure | GPSS wide, CPMI rich only | n/a | n/a | n/a | not computed | Dead on construct: infrastructure that money buys (D122) |
| 14 | ITF/OECD transport statistics; LPI 2023 trade-tracking KPIs; Container Port Performance Index | Freight volumes; port dwell and vessel time | ITF members, one LPI edition, CPPI by port with landlocked ETH RWA BOL PRY out | n/a | n/a | n/a | not computed | Dead: ceiling, one-off, or terminal operator efficiency rather than agencies acting together |

## Recommendation 1: customs clearance time from the Enterprise Surveys

**Construct.** The Enterprise Surveys ask each firm that exported directly in
the last fiscal year how many days its exports took, on average, from arrival
at the point of exit to clearance through customs. The value is that time,
reported by the firms that went through it, and averaged per country. It
observes what `time_to_export` was admitted to observe: whether the agencies
at a border act together quickly enough for a shipment to move. It is
experience, not reputation, which is the line D123 drew when it scored
`bribery_incidence` from the same survey. It does not read Doing Business's
standard case, so it is not frozen. Two limits: the question names customs, so
it reads the other border agencies only to the extent their checks hold a
shipment before customs releases it, and it covers direct exporters, who in
small economies are few. Class O, direction lower is better, World Bank source
in WDI (`source=2`), tier `international_organization`.

**Coverage.** 50 of 53. ARE, CUB and HTI have no survey. Latest year 2025 for
19, 2024 for 13, 2023 for 13, then ZAF 2020, ARG 2017, HND and NIC 2016 and
VEN 2010. The rich economies are covered because the surveys now run in them
(USA 2024, DEU 2025, JPN 2025). Four latest values are older than eight years
(VEN, HND, NIC, ARG), so 46 are 2018 or later, and those four would carry the
recency floor or be held.
`pnpm bench probe --series IC.CUS.DURS.EX` passes coverage, recency and spread.

**A13 and A9.** Closed autocracies average 3.6 days (CHN, VNM; ARE and CUB
absent), electoral autocracies 8.4 and democracies 6.3. The row cannot be
vacuous in the A13 sense, because it measures a time and not the absence of an
event. On A9 it reads the executive-led states on what they deliver: CHN 3.1
days (11th of 50), VNM 4.0 (20th), SGP 4.1 (21st), RWA 7.3 (35th). It does not
reward or penalise coordinating through the executive.

**Redundancy.** r 0.23 with `time_to_export`, -0.02 with budget execution,
0.30 with civil-society strength, 0.28 with the Coordination score. Its largest
r with any scored row in any dimension is 0.40 (`business_start_procedures`).
`bribery_incidence` shares the survey and is not among its six largest
correlates.

**r with log GDP per capita.** 0.12 (n 49), printed and not used. The import
form is 0.54.

**The problem: it is noisy.** Across the 43 countries with two survey rounds
the latest value correlates 0.37 with the one before it (Spearman 0.34); on the
25 pairs where both rounds are 2016 or later, 0.44 (0.41). Averaging exports
and imports does not help (0.37 and 0.38). Some of that is real change across
rounds that are years apart. Some is not: France 10.4 days in 2021 and 2.2 in
2025, India 17.3 in 2022 and 2.5 in 2025, Türkiye 2.6 in 2019 and 10.9 in 2024,
and Korea at 15.4 and Japan at 10.1 days, which no account of either border
supports. A mean over a few dozen direct exporters moves a lot when one or two
report a long wait. The disaster-warning check passed this stability test at
a Spearman of 0.78, for comparison.

**Treatment.** A preflight first, then an indicator if it passes. The preflight
reads the number of direct exporters behind each country's mean and its
standard error from the Enterprise Surveys indicator portal or the microdata,
and checks whether the median clearance time is published as well. It holds a
country whose base is under 30 firms, the base the disaster-warning memo used.
If the held countries leave 40 or more, wire `customs_clearance_time` as a new
Coordination row beside `time_to_export`, with a decision entry. Do not retire
`time_to_export` in the same change. Retirement means a dataset this project
rejected (D100), and the Doing Business row was frozen, not rejected. Revisit
it when B-READY's trade pillar lists 27 of 53. If the preflight shows the noise
is in the means and not in the bases, publish the row as a check under D60
instead, naming the round-to-round test it failed.

**What it would move.** Simulated with the scorer's confidence formula
(`confidenceFor` in `packages/core/src/pipeline/score.ts`, current year 2026)
on the 7.8.0 cells. These are not a rescore:

| | Mean confidence | r(Coordination confidence, log GDP) |
| --- | ---: | ---: |
| 7.8.0 (recomputed; published 0.362) | 0.362 | -0.37 (51) |
| Customs row added, denominator 6 | 0.436 | -0.11 (51) |
| Customs row added and `time_to_export` retired, denominator 4 (not recommended) | 0.508 | -0.12 (51) |

Added as a sixth counted row it clears O1 by itself. Coordination's own
confidence leans toward poorer countries today, because budget execution misses
USA, GBR, SWE, CAN and ISR. The new row flattens that lean. The roadmap's
guardrail is the mean confidence across all nine dimensions against income
(0.28 at 7.8.0). It needs a rescore, and the row should leave it about where it
is, because it covers rich and poor countries alike. The dimension's r with log
GDP needs the rescore too. The row's own r is low, so expect it to fall from
0.56, not rise.

## The OpenAlex finding (not a recommendation)

`university_industry_collaboration` is a declared gap, and OpenAlex (D124) is
already pinned. A work with an author at a company and an author at a
university is two kinds of actor acting together, and filling a gap row raises
coverage without raising the denominator. The simulated gain is the largest in
this memo, 0.362 to 0.514. It is still not recommended. The preflight showed
the share does not measure collaboration:

- Of the works with a company author, 71% to 100% also have a university
  author, in almost every country (`type:company` against
  `type:company,type:education`, 2022 to 2024, articles and reviews, core
  corpus). Firms that publish nearly always publish with universities. The
  share of all works that are joint therefore reads how much industry
  publishes, and that is the size of business research, a stock. The
  conditional rate is the one that would read collaboration, and it barely
  varies; it reads lowest where large corporate labs publish alone (USA 74,
  JPN 73, NLD 75).
- The share of all works correlates 0.82 with `sci_articles_per_million` and
  0.73 with `research_citation_impact`. It is the research system's size,
  scored a third time.
- A domestic form (works with authors from one country only) falls to 33 of
  53 at a base of 30, because in smaller systems the company partner is
  usually foreign.
- OpenAlex tags a company only when its affiliation string resolves to a ROR
  record of type company. That coverage is thinner for local firms outside
  English-language markets, which would lean the row toward income.

Treatment: gap kept. If the project wants a Learning-side or conditions-side
reading of business research, that is a separate question and not this one.
Requests used, for reproduction: `https://api.openalex.org/works?corpus=core&group_by=authorships.institutions.country_code&filter=publication_year:2022-2024,type:article|review`
plus `,authorships.institutions.type:company` and
`,authorships.institutions.type:company,authorships.institutions.type:education`,
and the same with `countries_distinct_count:1` for the domestic form. Retrieved
2026-10-02.

## Notes on the dead candidates

- **DTP1 to DTP3 dropout.** The construct is reasonable: a programme that
  starts a child on a series and finishes it has kept national procurement,
  district supply and clinic follow-up working together. Two things kill it.
  Fifteen of 53 sit at exactly 0.0, because WUENIC rounds coverage to integers
  and sets DTP1 equal to DTP3 where the data cannot separate them (Mexico, whose
  DTP3 reporting is known to be weak, reads 0.0). And countries whose third
  dose falls at 11 or 12 months (DEU 8.2, FIN 6.1) read as dropping out when
  they are only on a later schedule. GHO codes `VACCINECOVERAGE_DTP1` and
  `WHS4_100`, 2025 round.
- **Collective bargaining coverage.** The coordination literature does use
  this construct: whether firms and unions coordinate wages. But
  coverage mostly reads whether the law extends an agreement to firms that did
  not sign it, which is a design choice. 19 of the 53 have no value from 2018
  or later, ILOSTAT has nothing after 2020, and state unions put Cuba and
  China high.
- **Trade facilitation (OECD TFI, UN survey, WTO TFAD).** Every one of them
  scores whether a country has the arrangement: a committee, a single window, a
  notified commitment. TFI I is the closest construct to "a state coordinating
  its parts" found in this sweep. It scores the mechanisms and not what they
  deliver, and the delivery is what recommendation 1 measures.
- **PEFA PI-2.** The best construct among the budget items, since it reads the
  parts of a state holding to the allocation among them. The 2016-framework
  assessments cover 89 countries over 2016 to 2025, assessed on request and
  mostly in low and middle income, so the frame's rich members are missing
  and the dates spread over a decade. The PEFA download pages answered 403 to
  this session. The count against the 53 was not made; it is the one number in
  this table taken from the publisher's description, not counted.

## What is left for Coordination

Cross-agency delivery still has no full-frame series, and this sweep does not
change the roadmap's parked note. Customs clearance is one agency's throughput
at one border, observed by its users. It is the nearest observable this sweep
found, and it is a different thing from a measure of agencies delivering one
objective together. `public_private_collaboration` gets no candidate.
`university_industry_collaboration` gets one, and it fails.
