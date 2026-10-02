# What could give Anticipation a row that is not a stock

Task: Anticipation tracks log GDP per capita at r 0.872 (n 51, dataset 7.8.0)
on two scored rows, `sci_articles_per_million` and `statistical_performance`,
both of which track income themselves. That is the strongest finding against
the project's claim. Desk-triage candidate rows that observe a state or a
society looking ahead and acting on it, rather than a stock money buys, under
D117 and D118: construct first, then ceiling against the 53, the A13 regime
test, redundancy, and last the correlation with log GDP per capita, printed and
deciding nothing. Also check whether the Q3 Tier B rows can now be replaced.

Track: source-backed measurement. Desk triage plus value preflights where a
publisher served the frame in one call. Nothing is wired: no registry row,
adapter or observation changed.

Date: 2026-10-02. Dataset 7.8.0 (`data/out/index.json` and
`data/out/diagnostics.json` at HEAD).

## Where the dimension stands

| | Value |
| --- | --- |
| Scored rows | `sci_articles_per_million` (53 observed), `statistical_performance` (52) |
| Declared gaps in the denominator | `government_foresight_capacity`, `basic_research_share` |
| Conditions beside it (D122) | R&D spending, researchers, secure servers |
| Mean confidence | 0.45 (O1 met) |
| Coverage part of confidence | 0.5 everywhere: two observed of four counted |
| r with log GDP | 0.872, Spearman 0.892 (n 51) |
| Scored countries | 52 (Cuba has no SPI value) |

Anticipation meets O1. Its problem is O2, and O2 is reported, not targeted:
no row is added or dropped to move it (D118). The question here is
therefore only whether any source observes the construct the dimension names,
"identifying and preparing for emerging change", better than a count of
articles per head.

One structural fact frames every candidate. With two scored rows,
neither can leave the scores until a third exists: moving
`sci_articles_per_million` out today leaves one row and drops all 52 scored
countries under the D45 floor. The Q3 replacement the conditions audit named
for it, OpenAlex impact, was wired in Learning as `research_citation_impact`
(D124), and one series cannot score in two dimensions. Its correlation with
articles per head is 0.796, so it would not be new evidence here anyway.

## Disclosure on D118

Construct verdicts were written to a scratch file before any candidate value
was fetched. Two exceptions: census dates and the IMF fiscal-council landscape
were partly known from general knowledge when the constructs were written, and
the SPI pillar values below were pulled after the SPI codebook showed that
census and SDDS subscription sit inside the existing row. The regime split is
V-Dem's Regimes of the World for 2025 (`v2x_regime` via Our World in Data's
`political-regime` grapher): five closed autocracies (ARE CHN CUB HTI VNM),
12 electoral autocracies, 21 electoral democracies and 15 liberal
democracies, the same split A13 quotes.

## Ranked triage

r values are against log GDP per capita PPP from `diagnostics.json`, n 51 at
most (no GDP for Cuba and Venezuela). Redundancy is r with the published
normalised values of the two scored rows. "Regime" is the mean by regime
class, closed autocracy, electoral autocracy, electoral democracy, liberal
democracy.

| Rank | Candidate | Construct | Ceiling of 53 | Regime test (A13) | Redundancy | r log GDP (printed) | Cost | Verdict |
| ---: | --- | --- | --- | --- | --- | ---: | --- | --- |
| 1 | Foresight function register, coded by the project from dated acts (fills `government_foresight_capacity`) | dated acts: a standing function established, reporting, surviving a change of government | 53 by construction | at risk: plan-making autocracies code high on existence; the continuity test cannot run without turnover | not tested | not computed | high: a 53-country harmonisation the project authors | **decision, then a pilot** |
| 2 | UNFCCC long-term strategy (LT-LEDS, Paris Art. 4.19) on file | dated filing of a mid-century plan, voluntary, open to every Party | 53 (34 filed) | passes: 0.40, 0.58, 0.52, 0.93 | 0.41 articles, 0.44 SPI | 0.47 | small: Climate Watch API, one call | **check at most** |
| 3 | NDC 3.0 submission timeliness (deadline 10 Feb 2025) | diplomatic compliance with a fixed date | 48 dated | fails: closed autocracies earliest (ARE, CUB) | 0.25, 0.16 | 0.32 (n 46) | same API | dead |
| 4 | First Biennial Transparency Report on time (31 Dec 2024) | reporting on past emissions | 53 (38 on time) | passes: 0.40, 0.42, 0.81, 0.93 | 0.34, 0.44 | 0.38 | same API | dead on construct: looks back |
| 5 | 2020-round population census held (UNSD census dates) | a state counting itself when due | 53 (46 held) | passes: 0.60, 0.75, 0.90, 1.00 | 0.31, 0.42 | 0.52 | UNSD page | dead: inside SPI pillar 4, at ceiling |
| 6 | IMF SDDS Plus / SDDS / e-GDDS tier and release-calendar observance | committing to publish on announced dates | about 53 | not tested | inside SPI dimension 2.1 | not computed | IMF DSBB | dead: already scored in SPI |
| 7 | One SPI pillar in place of the overall score | data services (P2) or data sources (P4) | 52 | P2 54.5 to 93.0, P4 43.8 to 82.6 | P2 0.95, P4 0.92 with the overall | P2 0.70, P4 0.79, overall 0.77 | WB | dead: not new evidence; picking a pillar by r is what D118 forbids |
| 8 | Fiscal countercyclicality: minus the correlation of real government consumption growth with real GDP growth, 2000 to 2024 | saving in good years for bad ones | 48 | passes: -0.14, -0.16, -0.23, -0.11 | 0.26, 0.11 | 0.23 | WB, but a statistic the project authors | dead: unstable (halves Spearman 0.14) |
| 9 | IMF Fiscal Rules and Fiscal Council datasets (2024 update) | de jure rules and bodies that bind future budgets | about 120 countries with rules, 54 councils worldwide | not tested | not tested | not computed | IMF files (403 to this session) | dead on construct |
| 10 | Open Budget Survey: budget proposal shows two or more out-years | a table in a published document | 41 | not tested | not tested | not computed | IBP question-level data | hold; weak construct, inverse coverage skew |
| 11 | Medium-term expenditure frameworks (WB MTEF dataset, PEFA PI-16, OECD budget practices) | practice rated by assessors | WB set ends 2008; PEFA skips most rich countries; OECD set OECD only | | | | | dead on ceiling and recency |
| 12 | Pension automatic adjustment to life expectancy (OECD Pensions at a Glance) | a rule adopted ahead of a known pressure | about 29 (23 OECD members plus six G20) | | | | | dead on ceiling, skewed rich |
| 13 | National Adaptation Plans on NAP Central | dated plan filing | at most 36: the 17 Annex I Parties in the frame are outside the NAP process | | | | | dead: not comparable across the frame |
| 14 | Early warning (Sendai target G, MHEWS score) | self-assessment | | | | | | dead; the Q2 memo covers the family |
| 15 | Pandemic preparedness (WHO SPAR, JEE, GHS Index) | self-assessment, one-off external review, expert composite last scored 2021 | | | | | | dead on construct and recency |
| 16 | Sovereign wealth or stabilisation fund under a rule | a stock of resource rents | | | | | | dead on construct |
| 17 | Findex "saved for old age", 2024 | household act bounded by the ability to save and displaced by mandatory pensions | 29: the 2024 wave skips 21 high-income frame countries, plus CUB HTI RWA | China first at 43.4% | 0.74 articles, 0.08 SPI | 0.48 (n 28) | WB, db 28 | dead on ceiling and construct |
| 18 | Global Preferences Survey patience (Falk et al.) | a disposition, one 2012 wave | about 40 | | | | | dead: stale, attitudinal |
| 19 | BTI steering capability plus SGI strategic capacity | expert characterisation, two instruments split by OECD membership | 53 only as a splice | | | | | dead: the D23 family, and a splice the project would author |
| 20 | Net-zero target in law (Net Zero Tracker, LSE Climate Change Laws of the World) | a pledge | 53 | | | | | dead: declarative, overlaps rank 2 |
| 21 | The evidence grid's foresight column as a register | record versus no-case note | 53 (16 records, 37 notes) | | | | | dead: it is not a register (below) |

## Candidate notes

### 1. A coded register of foresight functions

**Construct (written first).** The gap's own definition: existence, mandate
and continuity of a national strategic foresight function. The behavioural
reading is a set of dated acts, each checkable against a primary document: a
function at the centre of government or in the legislature is established by
a named act; it has published a forward-looking product in the last three
years; it has survived at least one change of government; it has been closed
(a dated reversal, as the evidence corpus records for the US Office of
Technology Assessment in 1995 and Poland's RCSS in 2006). That is closer to
"preparing for emerging change" than anything below, because a closure is
observable and a unit that outlives its founders is a revealed commitment.

**Why the evidence corpus cannot be read as this register.** The
foresight column of the D135 grid is closed for all 53: 17 records in 16
countries and 37 no-case notes. A note closes a cell when no delivery with a
publisher metric was found, not when no function exists. Canada's note
rejects Policy Horizons Canada on `publisher_metric`; the United Arab
Emirates' note rejects its Ministry of Cabinet Affairs and the Future; Sweden's
rejects the Prime Minister's Office foresight function because the page
answered 403. Read as a 0/1 series, the grid would score how documentable a
delivery is, which leans to countries whose institutions publish English
metrics. EVIDENCE.md forbids turning records into a synthetic indicator, and
this is why.

**Regime risk (A13).** Existence rewards plan-making. China's Five-Year
Plans, the UAE's future ministry and Singapore's Centre for Strategic Futures
would code high on existence and mandate, and the continuity test (survives a
change of government) cannot run where government does not change. The
coding rule would need to read continuity as surviving a change of head of
government or of ruling coalition, and to say what a closed regime scores on
it, before any country is coded.

**Cost and tier.** The project would author the series: a coding rule,
53 coded rows, each with a cited primary document, and a second coder on a
sample. No tier in `SOURCE_TIERS` fits a project-coded register;
`expert_panel` (0.5) is the nearest. Back of envelope: filling the gap takes
Anticipation's coverage part from 0.5 to 0.75 and mean confidence from 0.45
to about 0.58 at that tier, and it removes a declared gap rather than adding a
row.

### 2. Long-term strategy on file (LT-LEDS)

**Construct (written first).** Article 4.19 of the Paris Agreement invites
every Party to file a mid-century low-emission development strategy. Filing
is voluntary and dated, and unlike the NDC each EU member files its own. It
is a public act of looking 25 years ahead, but what is observed is that a
document is on file; its content is not comparable, and it covers one
domain.

**Values.** Climate Watch (WRI) serves the UNFCCC register in one call
(`/api/v1/data/lts_content`, indicator `lts_date`, read 2026-10-02; the
UNFCCC site itself answered with a bot challenge and was not used). 34 of 53
have filed; not filed: BOL BRA CUB DOM ECU EST HND HTI ISR KEN MYS NIC PHL POL
PRY RWA SLV VEN VNM. Regime means 0.40, 0.58, 0.52, 0.93, so it does not
reward closed regimes. r 0.41 with articles per head, 0.44 with SPI, 0.47
with log GDP (n 51).

**Reading.** A binary filing is weak evidence of capability; Brazil, Estonia
and Poland have not filed, Mexico filed in 2016 and never updated. It
belongs, if anywhere, beside the dimension as a check under D60 and D121
(`ingest: 'adapter'`), with the filing date published and the reason it is
not scored attached: a document on file, not an act of preparation. As a
check it moves no score, confidence or correlation.

### 3. and 4. NDC and BTR timeliness

The NDC 3.0 dates (indicator `2025_date`) fail twice. The EU files one NDC
for its members, so DEU ESP EST FIN FRA IRL NLD POL PRT SWE share one date,
5 November 2025; ten countries read one act. And the earliest filers are the
COP hosts and troika: the United Arab Emirates (96 days early), Brazil (89),
then the United States, which filed in December 2024 and withdrew. Closed
autocracies average 62 days early against 209 late for liberal democracies.
Timeliness reads climate diplomacy, not preparation. The BTR is a report on
past emissions, a sensing act like the SPI, not a forward one.

### 5. to 7. Census, SDDS and the SPI pillars

The SPI codebook places "population and housing census" in dimension 4.1 and
"SDDS/e-GDDS subscription" in dimension 2.1, so both are already inside
`statistical_performance`. The census preflight also fails on spread: 46 of
53 held a 2020-round census, and the seven that did not are CUB ETH HND HTI
IND NGA THA (UNSD census dates page, read 2026-10-02; Thailand is listed with
no 2020-round date, which may reflect a register-based round and needs
checking). Swapping the overall SPI for one pillar would be choosing a
component by its income correlation, which D118 forbids; none of the
pillars is closer to anticipation in construct than the overall score.

### 8. Fiscal countercyclicality

**Construct (written first).** A government that saves in good years and
spends in bad ones is acting on a forecast it does not control. It is
behaviour, but the row would be a statistic the project defines, with free
choices of filter, window and spending aggregate.

**Values.** On WDI real government consumption (`NE.CON.GOVT.KD`) and real GDP
(`NY.GDP.MKTP.KD`), 48 of 53 (no NGA, VEN; three short series). The order is
not stable: Spearman 0.14 between 2000 to 2011 and 2012 to 2024, and the
full-window order correlates only 0.61 with the same statistic stopped at
2019. France, Brazil and the United Kingdom sit at the procyclical end,
probably because 2020 volume measures of government output (schools closed,
health counted by activity) fell with GDP; this was not checked. A
stability that low fails before construct or income matter.

### 9. Fiscal rules and councils

Existence of a numerical rule or an independent fiscal institution is a de
jure feature of the budget environment, the Tier B kind the conditions audit
describes, not an act. The ten EU members in the frame are required by EU
law to have an independent fiscal institution, so their councils are one act
of the Union. The 2024 update adds compliance indicators, but each country
sets its own threshold and breaches follow shocks, so compliance is not
comparable across countries. The IMF pages and files answered 403 to this
session; the counts above are from the IMF PFM blog and search abstracts.

### 10. Open Budget Survey, out-year estimates

IBP's 2023 round has country pages for 41 of the 53. Missing: ARE CHE CUB EST
FIN HTI IRL ISR NLD PAN SGP URY, mostly small high-income states. The item
records whether a table of out-year figures appears in a budget document,
which a mechanical extrapolation satisfies. Question-level values were not
fetched. If a later pass wants it, the first question is whether the item
sits at its ceiling among the 41.

### 17. Findex saved for old age

The probe reported 0 of 53 for `fin17f@28`, which is wrong: rows from the
Global Financial Inclusion database (source 28) come back with an empty
`countryiso3code` and the ISO3 code in `country.id`, and both `probe.ts` and
`ingest.ts` skip rows with an empty `countryiso3code`. Read directly, the 2024
wave covers 29 of 53, with China first at 43.4% and Nicaragua last at 1.7%.

## The Q3 rows

Simulated by dropping each row from the published normalised values and
re-averaging under the two-row floor (the simulation reproduces every
published score exactly). The r figures are printed and decide nothing.

| Dimension | Row | If it leaves the scores | Replacement now in place |
| --- | --- | --- | --- |
| Learning | `vocational_secondary_share` (Tier B) | 53 to 52 scored; r 0.749 to 0.778 | yes: `research_citation_impact` (D124), with HCI and firm training |
| Adaptability | `labor_force_participation`, `electricity_transmission_losses` (Tier B) | 53 scored either way; both out, r 0.738 to 0.456 | yes: export diversification (D119) and long-term unemployment (D120, 44 of 53) |
| Agency | `business_start_days`, `business_start_procedures` (Tier B, frozen 2019) | both out, 52 to 34 scored; one out, 52 | not yet: perceived control covers 37 |
| Shared purpose | `income_inequality` (Tier B) | 51 to 34 scored | not yet: civic participation covers 37 |
| Anticipation | `sci_articles_per_million` (borderline) | 52 to 0 scored | no: nothing tested here can replace it |
| Learning | `human_capital_index` (borderline) | not simulated | no: no learning-outcome series covers the frame |

So three of the six Tier B rows now meet the condition the conditions audit
set ("only once its dimension has a capability row to replace it"): the
Learning row and both Adaptability rows. Each is still its own decision under
D122, a major dataset version, and its confidence effect needs a proper
rescore, which this memo did not run. The Adaptability pair matters to the
Brazil report, which would read Adaptability without the state of the grid
and the participation level.

## Recommendations

At most two, in order. Neither wires a row today.

1. **Decide whether the project will author a register for
   `government_foresight_capacity`, and if so pilot it before coding the
   frame.** It is the only candidate that observes the construct the
   dimension names rather than a proxy for it. Treatment if adopted: fill the
   existing gap as an indicator, class `C`, from a published coding rule of
   dated acts (established by a named act, a forward product in the last
   three years, survived a change of government, closed), each cell citing
   its primary document, at tier `expert_panel`. Before the frame: write the
   rule and the closed-regime reading of the continuity test, then code ten
   countries across all four regime classes and income quartiles with a
   second coder, and stop if the codes sit at a ceiling or sort by regime.
   This is a new decision: the project would become the publisher of a
   scored series, which no decision allows yet, and D20 and EVIDENCE.md keep
   the evidence records out of it. Expected O1 effect about +0.13 at that
   tier; the income correlation is to be printed after coding.

2. **Optionally publish the LT-LEDS filing as a behavioural check beside
   Anticipation** (`__check__long_term_strategy_filed`, adapter from the
   Climate Watch API, filing date as the published value, 53 of 53, reason:
   a document on file is not an act of preparation, and its content is not
   comparable). It moves no score, confidence or correlation, passes the
   regime test, and gives a reader one dated forward act per country beside
   the two rows that track income. It needs a decision entry naming the test
   it failed (construct), per D60. If the owner wants nothing that moves
   nothing, skip it.

Not recommended: every other row in the table. The finding stands as
published: Anticipation's two capability rows track income, and no
full-frame source tested on 2026-10-02 observes a state acting ahead of
change without being a document, a self-assessment, a stock, or already
inside the SPI.

## Sources read

- Climate Watch API, `lts_content` (`lts_date`) and `ndc_content`
  (`2025_status`, `2025_date`, `btr`, `btr_date`, `submission_date`),
  2026-10-02. Licence not checked in this session.
- UNSD, census dates for the 2010 and 2020 rounds, 2026-10-02.
- World Bank SPI documentation (`worldbank.github.io/SPI`), and WDI series
  `IQ.SPI.OVRL`, `IQ.SPI.PIL1` to `PIL5`, `NE.CON.GOVT.KD`,
  `NY.GDP.MKTP.KD`, `fin17f` (source 28).
- International Budget Partnership, Open Budget Survey 2023 country pages.
- IMF PFM blog, "Fiscal Rules and Fiscal Councils" (December 2025); IMF
  dataset pages returned 403.
- Our World in Data, `political-regime` (V-Dem RoW), 2025 values.
- `data/evidence/records.json` and `searched.json`, foresight column.
