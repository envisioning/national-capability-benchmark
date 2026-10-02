# What could lift Experimentation to O1

Task: Experimentation has the lowest mean confidence of the nine dimensions
(0.271 on dataset 7.7.0, target 0.40). Find what could lift it, starting from
the GEM memo (`GEM-AND-DESIGNS.md`), then triage every other candidate at the
desk under D117 and D118: construct first, then ceiling against the 53, the
regime test of A13, redundancy, and only then the correlation with log GDP per
capita, printed and deciding nothing.

Track: source-backed measurement. Desk triage plus value preflights. Nothing
is wired: no registry row, adapter or observation changed.

Date: 2026-10-02. Dataset 7.7.0 (`data/out/index.json` at HEAD gives the same
0.271). Constructs below were written before any value was pulled; the
numbers that follow each were added after.

## Where the dimension stands

Nine rows count toward coverage: three filing rows observed almost everywhere
(patents 53, trademarks 51, designs 50, all latest 2021, recency 0.75), two
GEM rows on 16 countries, and four gaps (venture capital, sandboxes,
spinouts, business R&D share). 37 countries sit on three rows at confidence
0.237. Haiti, Nicaragua and Venezuela sit below 0.09 because their filing
rows are old or missing.

Arithmetic that frames every candidate below. Confidence is coverage times
mean recency times mean tier quality. A new registry row raises the
denominator from 9 to 10, so a row covering every country adds about 0.06 to
the mean; filling an existing gap keeps the denominator at 9 and adds more.
O1 needs about +0.13. No single source available today gets there.

## Simulated O1 effect

Desk simulation with the scorer's own recency rule (two grace years, then
linear decay over twelve) and tier weights, reproducing the published
confidence to within 0.001 per country. "Guardrail" is the correlation of
each country's mean confidence across the nine dimensions with log GDP per
capita, recomputed with only Experimentation changed; it reads 0.298 on the
current working tree, so compare moves, not levels, with the 0.286 D125
quotes from 7.2.0.

| Run | Mean confidence | Experimentation confidence r log GDP | Guardrail | Bottom quarter mean |
| --- | ---: | ---: | ---: | ---: |
| Dataset 7.7.0 | 0.271 | 0.260 | 0.298 | 0.170 |
| GitHub new repositories, new row (tier 0.85) | 0.331 | 0.257 | 0.295 | 0.241 |
| GitHub new repositories, new row (tier 0.95) | 0.339 | 0.260 | 0.296 | 0.248 |
| GEM 2019 to 2025 extension (D125, held) | 0.350 | 0.571 | 0.389 | 0.193 |
| GEM extension and GitHub | 0.402 | 0.570 | 0.378 | 0.262 |
| Doing Business resolving insolvency, 2019 (51) | 0.298 | 0.260 | 0.296 | 0.204 |
| B-READY business insolvency, 2025 round (26) | 0.290 | 0.312 | 0.316 | 0.159 |
| B-READY business insolvency, 2026 round (46) | 0.326 | 0.316 | 0.304 | 0.204 |
| GitHub and B-READY 2026 round | 0.375 | 0.314 | 0.300 | 0.266 |
| GEM, GitHub and B-READY 2026 round | 0.440 | 0.574 | 0.373 | 0.294 |

Only the GEM extension moves the guardrail, for the reason D125 records. A
row that covers all 53 adds evidence evenly and holds it flat.

## Ranked triage

| Rank | Candidate | Construct | Ceiling of 53 (current) | Regime test (A13) | Redundancy | r log GDP (printed) | Cost | Verdict |
| ---: | --- | --- | --- | --- | --- | ---: | --- | --- |
| 1 | GitHub Innovation Graph: new public repositories per million | behaviour: projects started | 53 (52 positive), quarterly to 2026 Q1 | fails for CHN and CUB: platform access | 0.50 patents, 0.46 trademarks, 0.33 designs; 0.63 new business density (Agency) | 0.77 (log), 0.70 normalised | one CC0 CSV in a public repo | **preflight, indicator** |
| 2 | GEM TEA and fear of failure, 16 to 39 (D125) | behaviour, perception | 39 | passes | existing rows | existing rows | extracted, in memo | **hold; reopening is a decision** |
| 3 | B-READY business insolvency (`IC.BRE.BI.*`) | rules and operating cost of exiting a failed firm | 13 in API, 26 in the 2025 package, 46 listed after 2026 round | passes on paper | not tested | 0.39 raw (n 13) | WB adapter | **wait** for 27 in the API |
| 4 | GEM exit and re-entry | behaviour: abandon and retry | 29 | passes | not tested | not computed | manual, with GEM | check (no O1 gain) |
| 5 | WIPO filings by origin at every office (EUIPO, Hague, Benelux) | behaviour, as now | about 53 | passes | replaces designs | not computed | WIPO IPSDC export, no API | replacement for D126's row, not new evidence |
| 6 | `business_rd_share` from OECD MSTI plus RICYT | spending composition (input) | 34 (33 at 2019 or later), with BRA | fails: state enterprises count as business (CHN, VNM) | 0.75 with R&D intensity (UIS archive) | 0.742 (n 34) | two adapters | **gap stays**; reclassify |
| 7 | Doing Business resolving insolvency (`RESLV.ISV.*`) | expert estimate of a stylised case | 51 (time), 52 (recovery), all 2019 | passes | not tested | -0.45 time, 0.67 recovery (raw) | WB adapter | dead: frozen, A6 says migrate off DB |
| 8 | GitHub pushes per million | behaviour, mostly volume of an adopted platform | 53 | fails for CHN, CUB | 0.37 patents | 0.82 | same CSV | dead: duplicates rank 1 with more adoption in it |
| 9 | GitHub developers per million | stock: accounts, including inactive | 53 | fails for CHN, CUB | | 0.92 | same CSV | dead: adoption level |
| 10 | GitHub per-developer rates (pushes, new repos) | ambiguous: coursework reads as experimentation | 53 | fails for CHN, CUB | | 0.04 and -0.60 | same CSV | dead: direction not defensible |
| 11 | Enterprise Surveys innovation (`IC.FRM.INNOV.T7`, `T9`; `IC.FRM.NPRD.ZS`) | behaviour, firm self-report | 34 at 2019; NPRD 46, no BRA CHE AUS JPN ARE CUB HTI, years 2010 to 2025 | passes | | -0.08 (T7), 0.06 (NPRD) | WB | dead (reconfirms the sweep) |
| 12 | GEM informal investor rate | behaviour: adults funding others' starts | GEM frame, at most 39 | passes | | not computed | manual; not verified that the appendix tables carry it | hold with GEM |
| 13 | Clinical trials registered per million (ClinicalTrials.gov, WHO ICTRP) | where sponsors site trials | about 53 | partly: regulatory market | | not computed | open API | dead on construct |
| 14 | OECD SME financing VC, OECD business demography, PCT, sandboxes, spinouts | various | 6 of 16, 23, 47 (treaty), none, none | | | | | dead (sweep stands) |
| 15 | Joint EVS/WVS Schwartz items: "new ideas, creative" (A189), "adventure and risk" (A195) | perception, values | waves 5 and 6 only, to my reading; not checked against the pinned file | | | | existing adapter | dead: stale and attitudinal |

## Candidate notes

### 1. GitHub new public repositories per million

**Construct (written first).** A public repository is a software project
someone started. It costs nothing, most are abandoned, and the platform keeps
the attempt either way. Counting new ones per head is the closest thing in
any open dataset to "many cheap attempts, freely abandoned": an output count
of the same kind as trademarks and designs per million, but on a medium where
starting costs no fee and needs no lawyer. It is behaviour, not a stock: the
row is the change in the year, not the level. The level (developers per
million) is adoption and is dead.

**Source.** GitHub Innovation Graph, `data/repositories.csv` in
github.com/github/innovationgraph, CC0, quarterly from 2020 Q1, refreshed
quarterly (last push 2026-09-01; latest quarter 2026 Q1). Location is the
modal daily IP location of the members with triage access; a metric is
suppressed below 100 developers, which no benchmark country hits.
`repositories` is a stock at quarter end, including repositories no longer
maintained, so the row is `repositories(Q1 y) - repositories(Q1 y-1)` over
`SP.POP.TOTL`. Net of deletions and of relocations.

**Ceiling and spread.** 53 of 53. Year to 2026 Q1, per million: Singapore
263,874, then Estonia 61,324, the Netherlands 53,145, Finland 44,567 ... Brazil
18,517 (16th) ... Venezuela 2,794, Haiti 1,425, Ethiopia 1,376, Cuba 112.
China is negative in four of the five yearly windows. Rank order is stable
year to year (Spearman 0.97 to 0.98, n 52). A Tukey fence at three IQRs clamps
Singapore alone.

**Regime test (A13).** Fails in two countries, for a reason a reader can
check. China reads the Great Firewall and Gitee, not its developers: the
count falls while every other country's rises. Cuba reads US sanctions on
the platform. Both should be treated as missing through a published
plausibility gate in the manner of D120, never scored at zero. Singapore's
value is a hub effect (regional offices, cloud and VPN exits), which the fence
absorbs.

**Redundancy.** Log value against the normalised existing rows: patents 0.50,
trademarks 0.46, designs 0.33, TEA -0.37 (n 16). Against `new_business_density`
in Agency, 0.63 (n 48). Below the 0.85 flag everywhere.

**Income (printed, not deciding).** Log value r 0.77 (n 50); the normalised
row 0.70. Simulated, Experimentation's own r with log GDP per capita would go
from 0.572 to 0.653 (n 51), which is a finding against the claim in this
dimension, to be published if the row is wired.

**Traps.** Public activity only, on one platform; GitLab, Bitbucket and
private work are invisible. IP location misplaces VPN users. Coursework,
bootcamps and tutorials create repositories, which may lift countries with
large student cohorts (Kenya and Rwanda lead the per-developer rates). The
publisher is a firm reporting on its own platform: no tier in `SOURCE_TIERS`
fits; `academic_survey` (0.85) is the closest and was used in the simulation.

**O1.** As a new row, mean confidence 0.271 to about 0.33, bottom quarter
0.170 to 0.241, guardrail flat.

### 2. GEM extension (held under D125)

Nothing new since the memo. GEM has still not surveyed the 14 missing
countries. The extension alone takes mean confidence to 0.350 and the
guardrail from 0.298 to 0.389 here. Paired with the GitHub row it reaches
0.402, which crosses O1, with the guardrail at 0.378: the GitHub row offsets
about a tenth of the rise and no more. Reopening needs the decision D125
names: that a source raising confidence in richer countries is acceptable
when its construct is sound.

### 3. B-READY business insolvency

The dimension asks how easily attempts are abandoned, and nothing in the
registry observes the cost of abandoning. The `failure_tolerance` note
already names bankruptcy law and time to discharge as the observable
substitute. B-READY's business insolvency topic (`IC.BRE.BI.OS`, pillar 3
`IC.BRE.BI.P3`, operational efficiency of resolving insolvency) is that
measure, current and open. It covers 13 of 53 in the API (2024 round), 26 in
the 2025 package and 46 once the 2026 round is out; see Task B. It is the
forward replacement for row 7 and should be preflighted as a new
Experimentation row (or as the gap behind `failure_tolerance`) when the API
holds 27. A rules score is closer to an institution than to behaviour, so
pillar 3 (efficiency in practice) should be preferred to the overall score.

### 6. Business share of R&D from MSTI plus RICYT

RICYT's open API serves GERD by sector of performance as JSON with no key
(`https://app.ricyt.org/api/comparative/ALL/2015,2025/GASIDSEPER`, row
"Business Enterprise (Public and Private)", share of GERD). It fills the hole
issue 25 named: Brazil 50.3% (2023), Peru 29.9% (2023), Uruguay 52.4% (2023),
Mexico 18.2% (2023, against MSTI's 22.5% for 2017), Panama 1.1% (2023), Bolivia
13.5% (2021), Guatemala 11.2% (2019), Honduras 10.3% (2019). It has nothing
for Cuba, the Dominican Republic, El Salvador, Nicaragua, Venezuela or Haiti,
and Ecuador stops at 2014 and Paraguay at 2011. With OECD MSTI's 27 the
splice reaches 34, 33 of them at 2019 or later, and still has no India, no
Southeast Asia except Singapore, no Africa except South Africa and no Gulf.

The construct fails before the coverage does. It is the composition of a
spending stock, and D122 moved R&D spending itself out of the scores as a
condition. The share is high where business R&D is large (Israel 94) and where
total R&D is tiny and one firm dominates (Thailand 80, Vietnam 73 in the UIS
archive), and state enterprises count as business, so China and Vietnam read
their ownership model. The splice correlates 0.742 with log GDP per capita
(n 34) and about 0.75 with R&D intensity. The row should stay a gap, or move
out of the coverage denominator by decision: as a condition beside
Anticipation's R&D spending, or retired with this evidence (D100). That choice
is a decision entry, not wiring.

### 7. Doing Business resolving insolvency

51 or 52 of 53, all frozen at 2019 (recency 0.58), from a lawyer survey on a
stylised case. Adding a new frozen Doing Business row runs against A6, which
exists to move the five already scored off the programme. B-READY row 3
supersedes it.

### 11. Enterprise Surveys

Re-probed 2026-10-02: `IC.FRM.INNOV.T7` and `T9` 34/53, latest 2019;
`IC.FRM.NPRD.ZS` 46/53, missing Brazil, Switzerland, Australia, Japan, the
United Arab Emirates, Cuba and Haiti, latest years from 2010 to 2025 (13 at
2023, 13 at 2024). The sweep's verdict stands.

## Recommendations

At most two, in order.

1. **Wire GitHub new public repositories per million as an Experimentation
   indicator**, class `O`, `higher_better`, per million over `SP.POP.TOTL`,
   value = change in the repository stock over the four quarters to the
   latest Q1, through a small adapter that pins the CSV commit. China and Cuba
   are held out by a published gate (platform access, not capability), in
   the manner of D120. Reason: it is the only candidate that observes cheap,
   abandonable attempts directly, covers all 53 at a current date, and adds
   evidence evenly across incomes, so it moves O1 by about 0.06 without
   moving the guardrail. It needs a decision entry (new source, new tier
   question, the gate) and a minor dataset version. It raises the dimension's
   income correlation to about 0.65, which is to be printed. If the owner
   reads the row as platform adoption rather than attempts, the fallback
   treatment is a behavioural check, which publishes it and moves nothing.

2. **Reopen the GEM extension only by superseding D125, and only together with
   row 1.** Reason: the two together are the only combination available today
   that crosses O1 (0.402), at the cost of a guardrail rise of about 0.08. The
   values are already extracted and verified. This is a decision for the
   owner, not a wiring task. Without it, Experimentation's realistic ceiling
   until the 2026 B-READY round reaches the API is about 0.33.

Not recommended for wiring now: B-READY insolvency (13 in the API), business
R&D share (construct), Doing Business insolvency (frozen).
