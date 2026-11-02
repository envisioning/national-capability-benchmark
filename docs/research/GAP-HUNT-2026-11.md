# Gap hunt: five declared gaps, one at a time

Date: 2026-11-02. Dataset 9.4.0, 125 countries (D153). Track:
source-backed measurement, desk research plus coverage counts. Nothing is
wired: no registry row, adapter, observation or output changed.

## What this hunt tests

`docs/WHY.md` makes the gap list the data-collection agenda. The four
November sweeps (`trust/`, `coordination/`, `shared-purpose/` and
`experimentation/SWEEP-2026-11.md`) searched each dimension broadly. This
memo goes narrow: one declared gap at a time, looking for any open source
that observes the gap's own construct, including administrative records,
registries, digital traces and UN agency compendia. Sources the sweeps
already settled are not reopened unless this hunt reached something they
could not.

Rules: D118 (construct before values, never choose by GDP correlation), D122
(a stock that money buys is a condition), D151 (a wanted construct stays a
gap when its only series fails a construct test), D154 (downloads without
an account, terms explicitly allow redistribution, quoted from the
publisher's own page).

**Baseline.** The guardrail is the Pearson r of each country's mean
confidence over the nine dimensions with the log of GDP per head
(`diagnostics.income`). It reads 0.474 at 9.4.0. During this hunt another
session published 9.5.0 (D171, D172), where it reads 0.436. All figures
below use the 9.4.0 files pinned from commit `43f8efb0`, as the brief asks.
Where a 9.5.0 figure is given, it says so. Quartiles of log GDP per head
(Q1 poorest) hold 31, 31, 31 and 30 countries; Cuba and Venezuela have no
income figure.

**Simulation rule.** As in the Experimentation sweep: confidence is coverage
times mean recency times mean tier quality. A gap filled for a country adds
one observation with the denominator held. Recency: two grace years, then
linear decay over twelve, against 2026. The simulation reproduces the
published 9.4.0 means (Shared purpose 0.318, Trust 0.392, Coordination
0.361) and the guardrail (0.474).

### Disclosure on D118

Every construct paragraph below was written from the publisher's
documentation before values were read, with three exceptions where the
values arrived in the same file as the coverage count: the ILOSTAT volunteer
rates (section 1), the Joint EVS/WVS G257 table (section 2) and the OpenAlex
counts (section 4). Each section says where a verdict turned on what the
values showed. Correlations with income are printed and decide nothing.

## 1. `shared_purpose.volunteering_rate`

**The construct.** The registry asks for the share of adults who volunteered
time to an organisation in the last month. The ILO Manual on the
Measurement of Volunteer Work (ICLS-19) defines volunteer work as unpaid,
non-compulsory work for others, split into organisation-based and direct
(person to person) volunteering, and recommends a four-week reference
period in labour force survey modules. Organisation-based volunteering over
four weeks is the registry's construct exactly. Direct volunteering is
acting for strangers without an organisation, a defensible reading of the
dimension but not the row's definition. A 12-month or one-week reference
period counts a different behaviour: the 12-month rate catches anyone who
helped once in a year, and the one-week rate catches a narrow slice. Rates
on different periods are not one series.

### ILOSTAT, reached this time

The Shared purpose sweep got HTTP 403 from the ILO SDMX endpoint. From this
machine on 2026-11-02:

| Route | Result |
| --- | --- |
| `https://rplumber.ilo.org/files/website/bulk/indicator.html` (bulk index) | 200 |
| `https://rplumber.ilo.org/data/indicator/?id=POP_XVOL_SEX_VOL_RT_A&format=.csv` | 200, 1,106 rows, 65 reference areas, updated 2026-06-30 |
| `https://sdmx.ilo.org/rest/data/ILO,DF_POP_XVOL_SEX_VOL_RT/?format=csv` | 200 |
| `https://ilostat.ilo.org/data/bulk/` (the landing page) | 403 |

The bulk route needs no key and no account. The reference period sits in
the `note_source` code (`S16:5840` one week, `S16:5837` four weeks or a
calendar month, `S16:5846` three months, `S16:5832` 12 months), decoded with
`https://rplumber.ilo.org/metadata/dic/?var=note_source&format=.csv&lang=en`.
Volunteer type sits in `classif1` (`VOL_TYPE_TOTAL`, `_ORG`, `_DIRECT`).

**Licence.** ILO, Rights and permissions, section Data:
"As of 3 May 2023, databases and datasets together with the accompanying
referential metadata are covered by the Creative Commons CC BY 4.0
licence." URL: https://www.ilo.org/rights-and-permissions. The same
section adds that datasets "produced prior to 3 May 2023 do not
automatically benefit from a Creative Commons licence", and that the licence
does not cover microdata restricted to the ILO's use. The bulk file is
dated 2026-06-30, so it is a dataset published after the cut. **D154
passes**, with one risk recorded below.

**Coverage of the 125.** Total sex, latest year from 2015, any volunteer
type:

| Cut | Of 125 | Q1 / Q2 / Q3 / Q4 | Latest years |
| --- | ---: | --- | --- |
| Any reference period | 56 | 3 / 9 / 15 / 29 | 2015 to 2024; 41 from 2020 |
| 12 months, any type | 37 | 0 / 0 / 9 / 28 | mostly the EU-SILC 2022 module |
| 12 months, organisation-based | 35 | 0 / 0 / 9 / 26 | |
| 4 weeks, any type | 18 | 2 / 6 / 2 / 8 | 2015 to 2022; 7 from 2020 |
| **4 weeks, organisation-based (the registry's construct)** | **11** | **1 / 2 / 1 / 7** | 2016 to 2022 |
| 1 week, any type | 8 | 1 / 3 / 4 / 0 | Latin American LFS modules |

The 56 are ARM AUS AUT BEL BGD BGR BRA CAN CHE COL CRI CYP CZE DEU DNK ESP
EST FIN FRA GBR GRC GTM HRV HUN IDN IRL ISR ITA JPN KAZ KEN KOR LTU LVA MDA
MEX MKD MNG NLD NOR NPL NZL PER POL PRT ROU RUS SGP SRB SVK SVN SWE TJK UKR
USA ZAF. The 11 at the registry's construct are BEL CHE FIN NZL POL PRT RUS
SVN TJK UKR ZAF.

**What the values showed.** At four weeks the rates run from 0.3 (KAZ) and
1.3 (RUS) to 42 (MDA) and 51 (NZL). A spread that wide on one reference
period reads the module more than the behaviour: a single screener question
in a labour force survey and a dedicated module with prompts for each kind
of activity do not count the same people. The ILO notes record the period,
not the module design. This was seen in the values, not predicted.

**Effect.**

| Fill | Shared purpose mean | Guardrail |
| --- | ---: | ---: |
| 9.4.0 | 0.318 | 0.474 |
| Any period, 56 countries | 0.370 | 0.528 |
| 12 months, organisation-based, 35 | 0.350 | 0.520 |
| 4 weeks, any type, 18 | 0.331 | 0.481 |

On 9.5.0 the 56 move the guardrail from 0.436 to 0.489 and the 18 from 0.436
to 0.444. Any cut wide enough to matter leans rich: Q4 carries more than half.

**Risks.**
- The 3 May 2023 cut. The values for older surveys were compiled before the
  cut and republished in a 2026 dataset. The ILO page treats the dataset as
  the unit, so the 2026 release reads as covered. If the ILO ever reads the
  cut per observation, the pre-2023 rows leave.
- Mixing periods breaks comparability. Only one period may enter a row, and
  four weeks has 18 countries.
- Module design (above).

### UN Volunteers, State of the World's Volunteerism Report 2026

**Construct.** Appendix B estimates volunteer rates for people aged 15 and
over on a four-week reference period, regional and global, by the ILO's
labour-market estimation method. It pools ILOSTAT (64 countries), the 2021
UNV-Gallup survey (eight countries) and the 2025 UNV survey (eight
countries), with covariates. The report publishes regional and global rates
and data-availability tables (A2, A3), not a modelled rate per country. A
modelled country rate would be model output with GDP-type covariates, the
reason `O1-CANDIDATES.md` gave in October.

**Licence.** The report's own imprint (PDF at
https://knowledge.unv.org/evidence-library/state-of-the-worlds-volunteerism-report-2026,
file `The 2026 SWVR Web Version.pdf`): "Copyright © United Nations
Volunteers (UNV) 2025. Permission is required to reproduce any part of this
publication." **D154 fails.** The evidence-library page names no data annex
as a separate download.

**Verdict for the gap.** ILOSTAT is the gap's construct under an open
licence, and the 125 count now exists. It cannot fill the row: 11 countries
at the exact construct, 18 at the right period, and every wider cut adds
mostly rich countries and raises the guardrail by up to 0.054. Watch for
new four-week LFS modules; the row becomes a candidate when four-week rates
reach half the frame (63).

## 2. `shared_purpose.national_belonging` (D151)

**The construct.** Reported identification with and attachment to the
national community, as distinct from pride. D151 lets the row become an
indicator candidate on "an item on belonging that reads the same in every
regime class, or a behaviour of belonging", for half the frame or more.

### Behaviours: none observes it

Each behaviour below was judged on construct before any value was sought.

| Candidate | What it would observe | Verdict |
| --- | --- | --- |
| Emigration rate (UN DESA International Migrant Stock 2024) | exit from the national community | Construct fails: reads income gaps, conflict, visa access and diaspora networks. A13 fails by design, because a state that restricts exit reads as high belonging. Licence not checked |
| Out-of-country voter registration (International IDEA) | diaspora staying in the polity | Construct fails: reads electoral law (whether out-of-country voting exists) and the size of the diaspora |
| Naturalisation and renunciation of citizenship | joining or leaving the community | Construct fails: reads the host state's and the origin state's law, not the person's attachment |
| Voluntary military enlistment, reserves | service to the national community | Construct fails: conscription, pay and regime set it; no open cross-national series |
| Census response rates | doing one's part in a national count | No harmonised source (the Shared purpose sweep stands) |
| Wikimedia pageviews of national-day and anthem articles (CC0) | attention to national symbols | Construct fails: reads internet access, language edition and holiday calendars; attention is not attachment |

No behaviour isolates belonging from the conditions and regime around it.
The behaviour route stays closed.

### An item already in the pinned release: G257

The hunt found a belonging item inside the Joint EVS/WVS 2017–2022 release
the project already pins (`https://access.gesis.org/dbk/69549`, results by
country, version 5-0-0, the PDF the A165 and A080_01 adapter reads). Earlier
memos tested G006, national pride, and the ISSP 2023 closeness item (16
countries), but not this one.

**Construct (from the wording).** G257: "How close do you feel: to
country", four points from very close to not close at all, asked beside
closeness to the village or town (G255), the region (G256), the continent
(G062) and the world (G063). It asks attachment to the country as a
community among other communities, without the comparison to other nations
that pride carries. It is the reopened definition nearly word for word. It
is a perception, which the row already is (class P), not a behaviour. The
registry unit, "% expressing belonging", reads as the share who express any
attachment: very close plus close. That cut follows from the unit and was
fixed before the regime test below was read.

**Coverage.** 82 of 125 (8 / 21 / 26 / 26, plus Venezuela). Ten frame
countries have separate EVS and WVS rows (ARM CZE DEU GBR NLD ROU RUS SRB
SVK UKR) and stay under the D64 hold that D154 kept, so the adapter's rule
gives 72 (8 / 20 / 21 / 22). Fieldwork 2017 to 2022.

**Regime test (A13).** Regime classes from V-Dem `v2x_regime`, read from
the notes the V-Dem adapter writes on the turnout check (the class in the
latest coded election year), 81 of the 82 countries:

| Regime class | n | Very close | Very close plus close |
| --- | ---: | ---: | ---: |
| Closed autocracy | 5 | 55.8 | 87.4 |
| Electoral autocracy | 31 | 48.5 | 83.4 |
| Electoral democracy | 22 | 39.9 | 82.6 |
| Liberal democracy | 23 | 46.3 | 88.7 |

The intense category fails A13 the way pride did: closed autocracies read
highest. The share that expresses any attachment reads the same in every
regime class, which is D151's test. It sits near a ceiling: median 86.8, 10th
percentile 74.0, 90th 94.1, standard deviation 8.8. Lowest THA, BRA, MKD,
GTM, ETH, ALB; highest NOR, JOR, EGY, FIN, IRN, KGZ. r with log GDP of the
intense share is -0.24 (n 81), printed only.

**Effect.** Tier `academic_survey` (0.85), recency 0.58 (fieldwork about
2019):

| Fill | Shared purpose mean | Q1 / Q2 / Q3 / Q4 | Guardrail |
| --- | ---: | --- | ---: |
| 9.4.0 | 0.318 | 0.252 / 0.313 / 0.362 / 0.365 | 0.474 |
| G257, 72 single-sample countries | 0.365 | | 0.480 |
| G257, all 82 | 0.371 | 0.272 / 0.368 / 0.429 / 0.434 | 0.492 |

On 9.5.0 the 72 move the guardrail from 0.436 to 0.445.

**D154.** The release is the pinned route three wired rows already use, and
the PDF downloads without an account. No licence line for that PDF was found
in this repository's memos, and the GESIS study page answered 403 to this
session. That is a D154 check owed on a source already wired, not only on
this item.

**Risks.**
- Ceiling. With most countries between 74 and 94, small sampling and
  translation differences move ranks. The scorer's Tukey fences and 0 to
  100 rescaling will spread a narrow band.
- Q1 is thin: 8 of 31. The fill raises the guardrail slightly.
- The cut. Very close alone fails A13; the combined share passes. The cut
  follows from the registry unit, but an owner should confirm it in the
  decision entry, because a cut chosen after a regime table is the D118
  trap.
- Fieldwork age. Recency 0.42 to 0.83 by country.

**Verdict.** Not a behaviour. It is the first item found that meets D151's
item route on the combined share, at 72 to 82 of 125. It needs one decision
(the cut and its ceiling) and one D154 check on the pinned GESIS PDF.

## 3. `trust.court_case_clearance`

**The construct.** Civil and commercial cases resolved in a year over cases
filed, from court records. `COURT-CLEARANCE.md` mapped CEPEJ, CEJA, the EU
Justice Scoreboard and national judiciaries, and found 13 countries in scope.
The open question was an alternative with global reach.

### UNODC UN-CTS (courts and prosecution)

**Construct.** UN-CTS counts persons, not cases, in criminal justice: persons
brought into formal contact with the police, prosecuted, brought before
criminal courts, convicted, and held in prison unsentenced (SDG 16.3.2).
None is a civil clearance rate. The nearest outcome, the unsentenced share of
prisoners, reads criminal court delay mixed with pre-trial detention law and
bail practice. Construct fails.

**Licence.** The UNODC data portal (`dataunodc.un.org`) links to the UNODC
legal page, which reads: "The United Nations grants permission to Users to
visit the Site and to download and copy the information, documents and
materials ... for the User's personal, non-commercial use, without any right
to resell or redistribute them". URL: https://www.unodc.org/unodc/legal.html.
**D154 fails.** Coverage not counted.

### World Justice Project

**Construct.** Rule of Law Index 2025, sub-factor 7.5, "Civil justice is not
subject to unreasonable delay", is the nearest wording to the gap. It is
scored from the Qualified Respondents' Questionnaire (lawyers' ratings) and
the General Population Poll: a perception composite, the kind D23 retired
from WGI. The Access to Justice module (2017–2018) has a behavioural
outcome, whether a person's legal problem is done and fully resolved, but
its fieldwork is eight years old, about half the samples cover only the
three largest cities, and it counts all problems, not court cases.

**Download.** `https://worldjusticeproject.org/rule-of-law-index/downloads/2025_wjp_rule_of_law_index_HISTORICAL_DATA_FILE.xlsx`
(2.2 MB, no account). 143 countries, 113 of the 125 (26 / 29 / 29 / 28, plus
Venezuela). Missing: ARM AZE BDI CHE CUB GNB IRQ ISR LAO LSO PNG TJK.

**Licence.** Neither the workbook nor the Open Data Day 2026 page that lists
it states a licence. The Terms of Service page
(https://worldjusticeproject.org/terms-service) governs the community forum
only. The footer reads "© World Justice Project 2008-2025". Silent terms
fail. **D154 fails.**

**Effect (hypothetical, for the record).** 113 values at tier 0.95, recency
1.0: Trust mean 0.392 to 0.514, guardrail 0.474 to 0.482.

**Verdict for the gap.** No open source with global reach observes court
clearance. The route the Trust sweep named stays the only one in view:
B-READY Dispute Resolution pillar 3 (time, cost and reliability of resolving
a commercial dispute), a different row. `COURT-CLEARANCE.md`'s instruction
stands: do not search national judiciaries again.

## 4. `coordination.university_industry_collaboration` and `public_private_collaboration`

### The objection to answer

The Coordination sweep rejected an OpenAlex *domestic multi-institution*
share because it read publication conventions, not joint work: France reads
high because joint CNRS and university units count as two institutions on
one lab, and countries with large local-journal output read low, so the
share tracks the log of domestic output (r 0.59). `coordination/O1-CANDIDATES.md`
had already rejected the company-and-university co-authorship share on the
53 frame: firms that publish nearly always publish with universities, so
the share of all works reads how much industry publishes, and the share of
company works that are joint barely varies.

**Construct of the narrower share (written before values).** A work with an
author at an institution of ROR type `company` and an author at one of type
`education` records two kinds of actor producing one output. The type split
removes the joint-unit artefact: a CNRS-university unit is not a firm. It
does not remove the denominator problem, because a share of all works still
falls where local-journal output is large. It adds a new risk: the numerator
grows with business research spending, a stock that money buys (D122).
Prediction: the share of all works reads R&D intensity; the share of company
works reads how often firm labs publish alone. Neither reads a capacity to
coordinate.

### The test at 125

Requests, keyless, retrieved 2026-11-02:
`https://api.openalex.org/works?group_by=authorships.institutions.country_code&filter=publication_year:2022-2024,type:article|review`
plus `,authorships.institutions.type:company`, `,authorships.institutions.type:education`
and both together, each with and without `,countries_distinct_count:1`
(domestic). The keyless API now refuses cursor paging ("Paging past the
first page with cursor= needs a free API key"), so each request returns the
top 200 countries. That covers the whole frame for every count except the
domestic company counts, which exist for 103 countries.

| Form | Of 125 (base) | Q1 / Q2 / Q3 / Q4 | Median | ρ with domestic output | r with R&D % GDP | r log GDP (printed) | Guardrail |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: |
| A. Domestic joint share of all domestic works | 102 (500 works) | 20 / 25 / 27 / 29 | 0.1% | 0.63 | 0.78 | 0.54 | 0.497 |
| B. Domestic joint share of domestic company works | 58 (30 company works) | 2 / 10 / 17 / 28 | 70% | -0.02 | 0.03 | 0.01 | 0.553 |
| C. Joint share of all works | 107 (500) | 23 / 26 / 28 / 29 | 1.5% | 0.11 | 0.78 | 0.58 | |
| D. Joint share of company works | 97 (30) | 17 / 22 / 28 / 29 | 94% | -0.48 | -0.30 | -0.32 | 0.499 |
| E. Domestic joint share of education works | 106 (500) | 21 / 26 / 29 / 29 | 0.1% | 0.60 | 0.77 | 0.54 | |

Guardrail figures fill the gap at tier 0.95 and recency 1.0.

**Reading.**
- A, C and E correlate 0.77 to 0.78 with R&D expenditure as a share of
  GDP, a condition (D122). A and E also keep the output-volume dependence
  (ρ 0.60 to 0.63, against 0.59 in the sweep's objection). The narrower share
  swaps one artefact for a stronger one.
- B does not track income or volume, but it reaches 2 of 31 Q1 countries
  and lifts the guardrail by 0.079. Its low end is where large corporate labs
  publish alone (NLD 0.29, NZL 0.27, CHE 0.38), and that is not low
  coordination. Direction undecidable.
- D sits at a ceiling (median 94%) and reads 100% where the base is a few
  dozen works (BOL, MLI, MNG, SDN).

The values confirm the prediction. **Dead on construct**, at 125 as at 53.

### Patents

| Source | D154 | Verdict |
| --- | --- | --- |
| Google Patents Public Datasets | fails: the data are served through BigQuery, which needs a Google Cloud account and project; licence not read | rejected on access |
| The Lens | fails: the policies page (https://about.lens.org/policies/) requires a commercial licence for commercial use and puts API and bulk downloads under "additional terms" | rejected |
| PatentsView (USPTO) | not read: the terms page now redirects to `data.uspto.gov` and returned no text | rejected on construct first: US filings only, so it reads which firms patent in the United States |

Co-assigned university and company patents would also read patenting volume,
the same D122 objection as A, C and E.

### `public_private_collaboration`

Government and company co-authorship in OpenAlex carries the same confounds
as A to E: ROR typing of public research institutes (`government` against
`facility`) and the research-spending numerator. Not fetched. The registry
note's verdict on PPI investment databases stands. No open behavioural trace
of joint public-private delivery was found.

## Ranked shortlist

1. **Joint EVS/WVS G257, "close to country", for `national_belonging`.**
   Item route under D151, not a behaviour. Very close plus close reads the
   same across regime classes (87 / 83 / 83 / 89). 72 single-sample countries
   (8 / 20 / 21 / 22), 82 with the held pairs. Shared purpose 0.318 to 0.365,
   guardrail 0.474 to 0.480 (9.5.0: 0.436 to 0.445). Needs a decision entry
   on the cut and the ceiling, and a D154 check of the pinned GESIS PDF,
   which three wired rows also owe.
2. **ILOSTAT volunteer rate (watch).** CC BY 4.0 passes; downloads from
   `rplumber.ilo.org`. 56 of 125 on any reference period (3 / 9 / 15 / 29,
   guardrail +0.054), 18 at four weeks (2 / 6 / 2 / 8, +0.007), 11 at the
   registry's exact construct. Reopen when four-week rates reach 63.
3. **Nothing for `court_case_clearance`.** UN-CTS is criminal and fails D154;
   WJP is a perception composite with silent terms. B-READY DR pillar 3, in
   the Trust sweep, remains the only open court route.
4. **Nothing for the two Coordination gaps.** The industry–academia share
   does not avoid the sweep's objection: it adds an R&D-stock reading (r 0.78
   with R&D % GDP). Patent routes fail D154 or reach.

The SWVR 2026 fails D154 ("Permission is required to reproduce any part of
this publication") and publishes no country rates.

## Reproduction

Scripts in the scratchpad, nothing committed:
`/private/tmp/claude-501/-Users-mz-Dev-Envisioning/dd92a19c-aeec-4b12-8fe4-18abfcd37581/scratchpad/gaps/`.

- `sim.py`: the simulation, reading the 9.4.0 `index.json` and
  `diagnostics.json` from commit `43f8efb0` (`NCB_OUT` points it at 9.5.0
  from `01847599`).
- `ilo_vol.py`, `ilo_count.py`: ILOSTAT bulk file and dictionaries.
- `g257.py`: G257 parsed from the pinned results PDF (`pdftotext -layout`),
  regime classes from `data/observations/vdem-cy-core.json` notes.
- `wjp.py`: WJP 2025 historical workbook.
- `oa.py`, `oa_test.py`: the OpenAlex requests above and the five forms;
  R&D % GDP and articles per million from the 9.4.0 indicator files.
- Licence pages read 2026-11-02: https://www.ilo.org/rights-and-permissions,
  https://www.unodc.org/unodc/legal.html,
  https://worldjusticeproject.org/terms-service,
  https://about.lens.org/policies/, and the SWVR 2026 imprint.
