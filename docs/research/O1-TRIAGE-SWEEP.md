# O1 triage sweep: Agency, Experimentation, Shared purpose

Status: desk triage, 2026-10-01. Dataset 6.2.0 on `main`; the conditions
release (D122, memo `docs/research/CONDITIONS-AUDIT.md` on
`claude/conditions-audit`) is assumed. Nothing in the registry or the data has
moved. Method: `docs/RESEARCH-ROADMAP.md`, "Triage at the desk".

## Why this sweep

After the conditions release, scores keep only rows that observe a country
doing the capability. Three dimensions are then thin and nobody is working
them: Agency (mean confidence about 0.38, rows left `new_business_density` and
the two Doing Business rows frozen at 2019, which the audit calls Tier B
conditions), Experimentation (0.23) and Shared purpose (0.26). Confidence is
coverage x recency x source quality, where coverage is observed rows over
counted rows (`packages/core/src/pipeline/score.ts`). The cheapest O1 gain is a
row that fills cells across many countries at once.

## Disclosure on D118

Construct verdicts below were written from the publishers' documentation and
the dimension questions in `packages/core/src/model/dimensions.ts`. No income
correlation was computed for any candidate. While counting coverage, some raw
values were on screen: the Joint EVS/WVS A080_01 table, the GEM 2025 Table A2
rows, the World Bank API sample for Findex `g20.made` (Brazil), and V-Dem's
`v2elcomvot` and `v2x_regime` codes, which are rules rather than outcomes.
Where a verdict mentions a value pattern, it says so.

## Two findings that are not new candidates

1. **The GEM rows only hold the original 16 countries.**
   `data/observations/manual.json` carries `early_stage_entrepreneurial_activity`
   and `failure_tolerance` for BRA USA NLD CHE SGP KOR EST IND CHL ZAF MEX ARG
   COL PER URY CRI and nothing else, although the frame has been 53 since D47
   and D51. The GEM global reports list far more benchmark economies (counts
   below). Re-reading published tables already in use is the largest O1 gain
   in this memo, at no construct risk.
2. **The Joint EVS/WVS results PDF the Trust adapter already parses carries
   every behavioural item Q6 asks about**, in the same table layout as A165:
   memberships A065 to A080_02, political action E025 to E028, voting E263 and
   E264, national pride G006, freedom of choice and control A173, and tax
   cheating F116. Each reaches the same 40 benchmark countries as A165 (37
   single rows plus DEU, GBR, NLD held for pooling). Missing for all items:
   ZAF CRI IRL ISR ARE RWA PRY PAN HND SLV DOM CUB HTI; E264 also lacks CHN.
   There is **no volunteering item** in this release. Source:
   [results table](https://access.gesis.org/dbk/69549) (downloaded from a
   local session without login; the roadmap's 403 note applies to cloud
   sessions). The 40-country ceiling is below 40 by the three held rows; the
   reason to accept it is the same as for Trust (D64): it is the only
   inspectable cross-national source for these items.

## Agency

Question: how able are individuals and organizations to turn an intention into
action?

### `perceived_control` from Joint EVS/WVS A173 — preflight

- **Construct.** A173 asks how much freedom of choice and control the
  respondent feels over the way their life turns out (1 to 10, published with a
  mean). It is a perception, class P, exactly the existing registry gap
  `perceived_control`. P rows stay in scores under the conditions rule (the
  audit keeps `interpersonal_trust` and `failure_tolerance`). It does not
  observe action; it observes the felt capacity to act, which is the agency
  half of the question.
- **Ceiling.** 37 now, 40 after pooling, reference year 2022 (release 5.0.0).
- **Spread.** A 1-10 mean over national samples; the table publishes a full
  distribution and a standard deviation, so spread is checkable at preflight.
- **Cost.** Lowest of any new row here: the adapter parses this exact PDF; the
  change is a second item code and a mean column instead of a percentage.
  Inspectable aggregate, no microdata.
- **Traps.** Response-style differences across cultures on 10-point scales;
  WVS and EVS fieldwork years differ by up to six years (the registry note
  already says so). Not an A13 case on its face, but check that closed
  autocracies do not read high (a respondent under repression may still
  report high control).

### GEM intention-to-action conversion — check candidate

- **Construct.** GEM publishes entrepreneurial intentions (adults expecting to
  start a business within three years) and TEA. TEA over intentions reads the
  share of stated intention that becomes a started business, which is the
  dimension question in one ratio. Intentions alone are off-construct (an
  intention is not an action).
- **Ceiling.** Same as the GEM extension below: 29 in 2024-25, 34 over
  2022-2025.
- **Spread.** Unknown until computed. The two items have different
  denominators (GEM asks intentions of adults not already running a business),
  so the ratio is not a clean rate.
- **Cost.** Manual, from the same report tables as the GEM extension. Same
  licence position as the existing GEM rows.
- **Traps.** TEA is already scored in Experimentation, so the ratio carries
  TEA into a second dimension; test redundancy first. Ceiling under 40 needs
  the reason that GEM is the only harmonised adult survey of start-ups.

### Findex: borrowed to start or operate a business (`fin22e`) — check candidate, weak

- **Construct.** A behaviour (borrowing for a business), but it mixes starting
  with operating and is gated by credit access, a condition. Closer to
  financial depth than to agency.
- **Ceiling.** 52 of 53 (no CUB), but only 29 have a 2024 value; 23 are
  stuck at 2017 (21 high-income economies plus HTI and RWA), because Findex
  2025 did not field this item there.
  [API](https://api.worldbank.org/v2/country/BRA;USA;NLD;CHE;SGP;KOR;EST;IND;CHL;ZAF;MEX;ARG;COL;PER;URY;CRI;DEU;FRA;GBR;ESP;PRT;POL;SWE;FIN;IRL;CAN;AUS;JPN;CHN;IDN;VNM;PHL;MYS;THA;TUR;ISR;ARE;NGA;KEN;RWA;ETH;BOL;PRY;ECU;VEN;PAN;GTM;HND;SLV;NIC;DOM;CUB;HTI/indicator/fin22e?format=json&source=28&per_page=20000)
- **Cost.** World Bank adapter, source 28. One call.
- **Traps.** The wave split is structural: rich countries are nine years old
  and the recency term would mark them down as a block, which is the
  guardrail problem in reverse. Not worth a session before the next Findex wave.

### Dead or off-construct for Agency

- **Findex made or received a digital payment (`g20.any`, `g20.made`).**
  52/53, but an adoption level, the same kind of row as `account_ownership`,
  which the audit moved to Tier A. Same rich/poor wave split (22 mostly
  high-income economies at 2021, 28 at 2024, HTI and RWA at 2017).
  [API](https://api.worldbank.org/v2/country/BRA;USA;NLD;CHE;SGP;KOR;EST;IND;CHL;ZAF;MEX;ARG;COL;PER;URY;CRI;DEU;FRA;GBR;ESP;PRT;POL;SWE;FIN;IRL;CAN;AUS;JPN;CHN;IDN;VNM;PHL;MYS;THA;TUR;ISR;ARE;NGA;KEN;RWA;ETH;BOL;PRY;ECU;VEN;PAN;GTM;HND;SLV;NIC;DOM;CUB;HTI/indicator/g20.made?format=json&source=28&per_page=20000)
- **Findex saved to start a business.** No such series in the current Findex
  database (source 28 indicator list, 3,313 series; only `fin22e` and
  `fin45b` mention business).
  [list](https://api.worldbank.org/v2/sources/28/indicators?format=json&per_page=5000)
- **Self-employment share (`SL.EMP.SELF.ZS`) and employers share
  (`SL.EMP.MPYR.ZS`).** 53/53 at 2025, but ILO modelled estimates, imputed
  where no labour force survey exists, and self-employment is mostly
  own-account necessity work in the informal economy: a labour-market
  structure, not intention becoming action.
- **WB Entrepreneurship Database.** Already wired (`IC.BUS.NDNS.ZS`, 49/53,
  missing USA VEN NIC CUB). It has no exit or survival series.
- **Firm entry and exit rates (OECD business demography).** The frame holds 23
  OECD members (USA NLD CHE KOR EST CHL MEX COL CRI DEU FRA GBR ESP PRT POL
  SWE FIN IRL CAN AUS JPN TUR ISR), so any OECD-only series is dead at the
  ceiling, and it would only cover rich countries (guardrail).
- **ILO job-to-job transitions.** The ILOSTAT dataflow list has no
  job-to-job flow series; the only transition flows are the youth
  school-to-work surveys.
  [dataflows](https://sdmx.ilo.org/rest/dataflow/ILO)
- **B-READY Business Entry** (`IC.BRE.BE.OS`). 13/53 in the 2024 round by the API count (`AGENTS.md` says 12), and a
  regulatory environment score, so a Tier B condition that might one day
  replace the frozen Doing Business rows in the conditions layer, not a
  capability row.

## Experimentation

Question: how easily can new approaches be attempted, tested, abandoned, and
improved?

### Extend the GEM rows from 16 to the GEM frame — preflight (existing rows)

- **Construct.** Unchanged: TEA counts people trying, fear of failure is the
  attitude the dimension names. The audit keeps both as capability.
- **Ceiling.** Benchmark economies in each GEM global report's appendix
  tables:
  - 2025 data, 28: ARE ARG BRA CAN CHE CHL CRI DEU ECU ESP EST FIN FRA GBR GTM
    IND ISR KOR MEX NLD PER POL SLV SWE THA USA VEN ZAF
    ([2025/2026 report](https://www.gemconsortium.org/file/open?fileId=51858))
  - 2024 data, 24, adding CHN
    ([2024/2025 report](https://www.gemconsortium.org/file/open?fileId=51621))
  - 2023 data, 26, adding COL PAN URY
    ([2023/2024 report](https://www.gemconsortium.org/file/open?fileId=51377))
  - 2022 data, 26, adding IDN JPN
    ([2022/2023 report](https://www.gemconsortium.org/file/open?fileId=51147))
  - Union 2022-2025: **34**. Never in that window: SGP PRT IRL AUS VNM PHL
    MYS TUR NGA KEN RWA ETH BOL PRY HND NIC DOM CUB HTI. Under 40, with the
    same reason as the existing rows: GEM is the only harmonised adult survey
    of start-up activity. Data four years old keeps a recency weight of about
    0.83.
- **Spread.** Already established by the 16-country rows.
- **Cost.** Manual entry from four appendix tables, about 18 new countries
  times two rows, one session. Same source URL and practice as the existing
  manual rows. The recent additions are mostly middle-income and LatAm (ECU
  GTM SLV VEN PAN COL URY THA IDN), so the guardrail should improve, not
  worsen.
- **Traps.** GEM participation is self-selected and paid by national teams,
  so the missing 19 are not random (Africa and Southeast Asia are mostly out).
  TEA counts necessity entrepreneurship as trying (registry note).
- **Expected gain.** In the 18 newly covered countries Experimentation goes
  from two observed rows to four. This is the single largest O1 move in the
  memo.

### Industrial design applications by residents per million (`IP.IDS.RSCT`) — preflight

- **Construct.** A filed design is a completed, registered attempt at a new
  product form: cheaper and more frequent than a patent, closer to trademarks'
  many-small-experiments reading. Output class O, capability.
- **Ceiling.** 50/53 (missing NLD VEN HTI); 45 have 2021 as latest, 47 at or
  after 2018.
  [API](https://api.worldbank.org/v2/country/BRA;USA;NLD;CHE;SGP;KOR;EST;IND;CHL;ZAF;MEX;ARG;COL;PER;URY;CRI;DEU;FRA;GBR;ESP;PRT;POL;SWE;FIN;IRL;CAN;AUS;JPN;CHN;IDN;VNM;PHL;MYS;THA;TUR;ISR;ARE;NGA;KEN;RWA;ETH;BOL;PRY;ECU;VEN;PAN;GTM;HND;SLV;NIC;DOM;CUB;HTI/indicator/IP.IDS.RSCT?format=json&per_page=20000)
  The NLD gap is probably the Benelux regional office (inference, not
  checked).
- **Spread.** Counts per million span orders of magnitude; the existing
  per-million transform and Tukey fences handle that.
- **Cost.** World Bank adapter, one registry row. WIPO's own data centre is
  the upstream and may be fresher than 2021 (not checked).
- **Traps.** China's subsidised design and utility filings inflate counts
  (same trap as patents); EU applicants increasingly file at EUIPO rather
  than nationally, so national resident counts undercount Europe. Redundancy
  with `resident_trademarks_per_million` must be read at preflight.

### Resident patents relative to R&D effort — check candidate (replacement question)

- **Construct.** Resident patent applications per unit of gross R&D
  spending: completed experiments relative to the resources spent on them.
  This is the "relative to resources" form of the existing patents row, and it
  moves the R&D stock (now a Tier A condition) into the denominator where it
  belongs.
- **Ceiling.** Both inputs are World Bank: `IP.PAT.RESD` 53/53 (46 at 2021)
  and `GB.XPD.RSDV.GD.ZS` 51/53 (no DOM HTI).
  [patents](https://api.worldbank.org/v2/country/BRA;USA;NLD;CHE;SGP;KOR;EST;IND;CHL;ZAF;MEX;ARG;COL;PER;URY;CRI;DEU;FRA;GBR;ESP;PRT;POL;SWE;FIN;IRL;CAN;AUS;JPN;CHN;IDN;VNM;PHL;MYS;THA;TUR;ISR;ARE;NGA;KEN;RWA;ETH;BOL;PRY;ECU;VEN;PAN;GTM;HND;SLV;NIC;DOM;CUB;HTI/indicator/IP.PAT.RESD?format=json&per_page=20000),
  [R&D](https://api.worldbank.org/v2/country/BRA;USA;NLD;CHE;SGP;KOR;EST;IND;CHL;ZAF;MEX;ARG;COL;PER;URY;CRI;DEU;FRA;GBR;ESP;PRT;POL;SWE;FIN;IRL;CAN;AUS;JPN;CHN;IDN;VNM;PHL;MYS;THA;TUR;ISR;ARE;NGA;KEN;RWA;ETH;BOL;PRY;ECU;VEN;PAN;GTM;HND;SLV;NIC;DOM;CUB;HTI/indicator/GB.XPD.RSDV.GD.ZS?format=json&per_page=20000)
- **Cost.** No new source, but a derived ratio needs GDP in money terms and a
  transform the registry does not have, so it is a decision (new transform or
  replace the patents row), not a wiring task.
- **Traps.** Tiny R&D denominators explode the ratio; strategic filing (Korea,
  US) stays. It adds no new cells, only a better construct, so its O1 gain is
  zero. Listed because the conditions release makes the question live.

### GEM business exit and re-entry — check candidate

- **Construct.** GEM reports adults who exited a business in the past 12
  months, whether it continued, negative versus positive reasons, and whether
  exiters expect to start again within three years. Exit with intent to start
  again is "abandoned and improved" observed directly. The exit rate alone is
  ambiguous in direction (churn or collapse).
- **Ceiling.** The exit tables appear in the 2024 and 2025 reports (Table A5
  in 2024/2025, Table A2 in 2025/2026): 29 benchmark economies across the
  two. Under 40.
- **Cost.** Manual, same session as the GEM extension.
- **Traps.** Small subsamples (exiters are a few percent of 2,000
  respondents), so the re-entry share is noisy. Publish as a check first.

### Dead for Experimentation

- **WIPO PCT applications by residents.** Six of the 53 are not PCT
  contracting states (ARG PRY BOL VEN HTI ETH) and URY joined only in January
  2025, so their residents cannot file directly: the row would read treaty
  membership, and drop Argentina.
  [WIPO contracting states](https://www.wipo.int/pct/en/pct_contracting_states.html)
- **Enterprise Surveys firm innovation.** `IC.FRM.INNOV.T7` (new
  product/service) 34/53, only 6 at or after 2018, no BRA or any large rich
  economy; the WDI composite `IC.FRM.NPRD.ZS` reaches 46/53 but mixes in R&D
  spending (an input) and **misses Brazil**, with latest years from 2010 to
  2025.
  [T7](https://api.worldbank.org/v2/country/all/indicator/IC.FRM.INNOV.T7?source=13&format=json),
  [NPRD](https://api.worldbank.org/v2/country/BRA;USA;NLD;CHE;SGP;KOR;EST;IND;CHL;ZAF;MEX;ARG;COL;PER;URY;CRI;DEU;FRA;GBR;ESP;PRT;POL;SWE;FIN;IRL;CAN;AUS;JPN;CHN;IDN;VNM;PHL;MYS;THA;TUR;ISR;ARE;NGA;KEN;RWA;ETH;BOL;PRY;ECU;VEN;PAN;GTM;HND;SLV;NIC;DOM;CUB;HTI/indicator/IC.FRM.NPRD.ZS?format=json&per_page=20000)
- **Business churn and young-firm share.** OECD-only (23 of 53), see Agency.
- **GEM product or market novelty ("Innovation").** GEM lists it among key
  indicators, but it is self-rated novelty by the entrepreneur, which is local
  ("new to your area") and not comparable across markets. Not worth a
  separate session; read it during the GEM extension only if it is in the
  same table.
- **OECD regulatory sandbox listings.** No maintained comparable register
  (registry note stands), and a count of regimes is a policy stock, not
  experimentation.
- **University spinouts.** No harmonised source (registry note stands).

## Shared purpose

Question: to what extent can people imagine themselves as participants in a
common project?

### `civic_participation` from Joint EVS/WVS memberships — preflight

- **Construct.** Self-reported membership in associations (A066 culture, A067
  unions, A068 parties, A071 environment, A072 professional, A074 sports,
  A078 consumer, A079 other, A080_01 humanitarian or charitable, A080_02
  self-help). Membership is a behaviour, class C, and matches the registry
  gap's definition. Recommended form: share mentioning at least one
  non-religious membership if the table allows it, otherwise A080_01
  (humanitarian or charitable) as the single item closest to acting for
  strangers. Exclude A065 (religious), which reads religiosity.
- **Ceiling.** 37 single rows plus three held, reference 2022.
- **Spread.** Percentages per item; spread is wide in the table.
- **Cost.** Same adapter, one or more item codes. A composite "any
  membership" is not in the aggregate table and would need microdata, which
  the adapter does not use; so the realistic first row is a single item.
- **Traps.** The joint file harmonises WVS7 (active or inactive member) and
  EVS5 (belong yes/no) into "mentioned"; the A080_01 table visibly runs high in
  several lower-income WVS samples and low in some EVS samples, which may be
  question format rather than behaviour (value pattern seen while counting).
  Read the codebook harmonisation note before preflight. Not an A13 case on its
  face, though state-sponsored mass organisations in CHN and VNM can inflate
  membership.

### Voter turnout from the pinned V-Dem file — check candidate (Q8)

- **Construct.** Turnout is the one mass behaviour in which a population
  acts on a common decision. It does not mean the same thing everywhere:
  under enforced compulsory voting it reads the law, and in closed or
  electoral autocracies it reads mobilisation (A13). Proposed rule:
  - score only where V-Dem `v2x_regime` is 2 or 3 (electoral or liberal
    democracy) and `v2elcomvot` is 0 or 1 (not compulsory, or compulsory
    with no sanctions or unenforced sanctions);
  - publish everywhere else as a check with the reason attached, as D121 does.
- **Ceiling.** Registered-voter turnout `v2eltrnout` 52/53 (no CHN), VAP
  turnout `v2elvaptrn` 51/53 (no CHN ARE), latest election on or after 2018
  for 51 and 50. Under the rule: 2024 `v2x_regime` puts ARE CHN CUB HTI VNM
  (closed) and ETH IDN IND NIC PHL RWA SGP SLV THA TUR VEN (electoral
  autocracy) out, 16 countries; `v2elcomvot` code 2 (sanctions enforced,
  minimal cost) holds AUS BOL BRA ECU PER PRY SGP URY, and code 1 holds ARG
  CHL CRI HND MEX PAN THA TUR. That leaves about 30 scorable countries and
  **excludes Brazil**, which is why this is a check, not a score.
  [V-Dem v15 Full+Others](https://www.v-dem.net/media/datasets/V-Dem-CY-FullOthers-v15_csv.zip),
  codebook entries 3.1.2.3 and 3.1.4.4.
- **Cost.** Zero acquisition: the archive the V-Dem adapter already pins
  carries `v2eltrnout`, `v2elvaptrn`, `v2elcomvot` and `v2x_regime`. V-Dem
  sources turnout from IDEA. The IDEA export itself
  ([xlsx](https://www.idea.int/data-tools/export?type=region_only&themeId=293&world=all&loc=home))
  has parliamentary turnout for 51/53 (no CHN ARE) but is staler: latest
  parliamentary election for HND and KEN is 2017 and HTI 2015. Its
  compulsory-voting flag is yes/no and lists 16 benchmark countries without
  enforcement levels, so V-Dem's ordinal code is the better rule. IDEA states
  no dataset licence on the database page; V-Dem is CC BY-SA 4.0.
- **Traps.** A13 and A5 both: turnout rewards electoral competition, which
  is the democratic-channel reading A5 retired. Election-year data only, so
  latest years vary by cycle.

### Share of blood donations from voluntary unpaid donors — check candidate

- **Construct.** Whole-blood donations from voluntary non-remunerated donors
  as a share of all donations (against family/replacement and paid). It is a
  revealed act of giving to strangers, relative to the system's total, so not
  a stock. Donations per 1,000 people is off-construct: it reads collection
  capacity and health-system spending.
- **Ceiling.** WHO's Global status report on blood safety and availability
  2025 (data 2023, published 2026-06-12) lists 168 reporting countries; the
  benchmark countries missing are IRL and ISR, so 51/53 named. Annex 3 gives
  counts by donor type per country for 2018 and 2023, with "not reported"
  cells and partial national coverage for 36 countries.
  [report PDF](https://iris.who.int/server/api/core/bitstreams/aa36bd85-6947-4097-adf6-f734922c8026/content),
  [publication page](https://www.who.int/publications/i/item/9789240121546)
- **Spread.** Weak at the top: WHO reports high-income countries at 98.4%
  voluntary as a group, so most rich and many middle-income countries sit near
  100, the clearance-ratio problem. Variation lives in LatAm, Africa and South
  Asia.
- **Cost.** One PDF annex parse (159 pages), CC BY-NC-SA 3.0 IGO.
- **Traps.** The share follows blood-service policy (national VNRD mandates,
  hospital replacement rules), so it partly reads institutional design, a Tier
  B condition. Partial-coverage returns for LMICs often cover only major
  cities (WHO Annex 1). Publish as a check if at all.

### Dead or held for Shared purpose

- **`volunteering_rate` from Gallup or CAF.** Gallup microdata stay
  proprietary (registry note). CAF's 2025 World Giving Report moved to an
  online panel run by Focaldata in 101 countries, n 250 to 1,000, and its
  method statement says non-OECD samples skew urban and educated: an internet
  artefact that would track wealth.
  [method statement](https://cdn.prod.website-files.com/67d1838beb72321adb3f57fc/6835d4af270837ade1cbbdeb_e0c0542705dd4a3243a28a4bcd6cc631_WGR%20Method%20Statement%202025.pdf)
  The Joint EVS/WVS release has no volunteering item either. The gap stays.
- **`national_belonging` from G006 (national pride).** 40 in the joint table,
  but a perception that the registry note already calls culturally loaded, and
  an A13 case: nationalist or closed states read proud. Check at most.
- **Political action (E025 petitions, E026 boycotts, E027 demonstrations).**
  40 in the joint table, behaviour, but it is the democratic channel A5
  retired, now from a survey: closed regimes read low for the reason A5 named.
  Hold.
- **Tax morale (F116, cheating on taxes justifiable).** 40 in the joint table;
  an attitude beside a scored behaviour (`tax_revenue_gdp`). Check at most.
- **Tax compliance gaps (VAT C-efficiency).** OECD-only or IMF country papers;
  no one file for the frame, and policy design (exemptions) dominates.
- **Trade union density (ILOSTAT).** 49/53 (no ARE NGA ECU CUB) but latest
  2018 or 2019 for most, and state unions in CHN, VNM, CUB make membership
  near-compulsory (A13). If anywhere, Coordination.
  [SDMX](https://sdmx.ilo.org/rest/data/ILO,DF_ILR_TUMT_NOC_RT/)
- **V-Dem `v2csprtcpt` (CSO participatory environment).** 53/53, but it feeds
  `v2x_cspart`, already scored as `civil_society_strength`; redundant
  (roadmap Q5 note).
- **Census or survey response rates.** No harmonised source; census rounds are
  ten-yearly and modes differ.

## Summary

| Candidate | Dimension | Construct | Ceiling of 53 | Cost | Verdict |
| --- | --- | --- | ---: | --- | --- |
| GEM TEA and fear of failure, 16 to GEM frame | Experimentation | doing / attitude (existing rows) | 34 (2022-25) | manual, 4 report tables | **preflight** |
| Industrial design applications per million | Experimentation | doing (output) | 50 | WB adapter | **preflight** |
| Patents per unit of R&D | Experimentation | relative to resources | 51 | WB, new transform | check (replacement question) |
| GEM exit and re-entry | Experimentation | doing (abandon, retry) | 29 | manual, with GEM | check |
| PCT by residents | Experimentation | treaty membership | 47 | WIPO | dead |
| Enterprise Surveys innovation | Experimentation | doing, stale; composite mixes R&D | 34 / 46, no BRA | WB | dead |
| Sandboxes, spinouts, churn, GEM novelty | Experimentation | stock / no source | under 27 or n/a | n/a | dead |
| `perceived_control` (A173) | Agency | perception | 37 (40 pooled) | existing adapter | **preflight** |
| GEM TEA over intentions | Agency | conversion of intention | 29 to 34 | manual, with GEM | check |
| Findex borrowed for business | Agency | behaviour gated by credit | 52, 23 at 2017 | WB | check, weak |
| Findex digital payments | Agency | adoption level | 52 | WB | dead (Tier A kind) |
| Self-employment, employers | Agency | labour structure, modelled | 53 | WB | dead |
| Firm entry/exit, job-to-job, B-READY | Agency | no frame source / condition | 23 / none / 13 | n/a | dead |
| `civic_participation` (memberships) | Shared purpose | behaviour (self-report) | 37 (40 pooled) | existing adapter | **preflight** |
| Voter turnout under a regime and compulsion rule | Shared purpose | behaviour, conditional | 52 as check, ~30 scorable, no BRA | pinned V-Dem | check |
| Voluntary share of blood donations | Shared purpose | revealed giving | 51 | one PDF annex | check |
| National pride, political action, tax morale | Shared purpose | perception / A5 channel | 40 | existing adapter | check or hold |
| CAF/Gallup volunteering, union density, CSO participation, response rates, VAT gap | Shared purpose | artefact / A13 / redundant / no source | various | n/a | dead |

### Ranked by expected O1 gain per session

1. **GEM extension** (Experimentation). Two existing rows from 16 to about 34
   countries, one manual session, no new construct, mostly middle-income
   additions. Fold in the exit/re-entry check and the TEA-over-intentions
   check for Agency in the same pass, since they come from the same tables.
2. **Joint EVS/WVS item generalisation** (Agency `perceived_control` A173,
   Shared purpose `civic_participation` single item). One adapter change
   lands two registry gaps at 37 countries each. This is Q6. Pooling the three
   held countries (TRUST-1) lifts Trust at the same time.
3. **Industrial design applications** (Experimentation). One World Bank row,
   50 countries.
4. **Voter turnout check** (Shared purpose). Zero acquisition from the pinned
   V-Dem file, but it adds no scored cells under the proposed rule, so no O1
   gain; it answers Q8 and gives A13 a behavioural comparison.
5. Patents per R&D and the blood-donation share: construct questions with no
   O1 gain; take them only when the dimension is otherwise settled.

Agency remains the weakest of the three after this sweep. No candidate found
observes individuals acting at full-frame coverage; the honest O1 route there
is `perceived_control` plus the GEM conversion check, and a decision on
whether the two Tier B Doing Business rows stay until something replaces them.
