# Known artefacts

Places where the v0 model produces a number that is wrong about the world rather
than informative about it. These are not bugs in the code: the pipeline is doing
what it was told. They are failures of measurement, and anyone building on this
needs to know them before quoting a score.

Evidence for each is a diagnostic in `data/out/diagnostics.json` or a figure
from the published output. The in-session panel runs in `data/delphi` are one
panelist each, carry no dataset version and were scored against older frames,
so a gap between one of them and a current score is not a finding (see A9).

Every entry is on dataset 7.7.1 except where it names another run. A3 also
quotes the 16-country run that last scored the WGI rows, and A4 the ten-country
one. A6 holds no dataset figures. Where a figure predates
the current frame, the scale it was measured on is not the scale in use.

---
## A1 — Experimentation is not measured, it is inferred from patents

**Severity: medium.**

Four of nine indicators are observed for most countries: resident patents,
trademarks and industrial designs per head (D126), and, for the 16 countries
GEM covered first, early-stage entrepreneurial activity and fear of failure.
Venture capital, regulatory sandboxes, university spinouts and business R&D
share are still gaps. Mean confidence is 0.271 on dataset 7.7.1, the lowest of
the nine dimensions. 37 countries are scored on patents, trademarks and
designs alone. GEM's later reports reach 40 of the 53, but the extension is
held because the 14 countries GEM skips are mostly lower-income and the gain
would sit where income already is (D125). See D21.

Resident patents and resident trademarks per head measure formalised, completed,
defensible invention, which is close to the opposite of the many-cheap-
experiments construct the dimension is supposed to capture.

On dataset 7.7.1 the Netherlands scores 28.1. That is not a finding about
Dutch innovation: its trademark and design rows are missing, venture capital is
a gap, and the score rests on resident patents and the two GEM rows. Uruguay
scores 28.6, having legalised and regulated a national cannabis market and run
a fintech sandbox. Argentina scores 19.6, having produced more technology firms
of scale per head than anywhere else in the region.

No panel figure is quoted here. The run `data/delphi/latest.json` points at,
a one-panelist in-session run, carries no dataset version
and was scored against an older frame, so its distance from a 7.7.1 score
measures the change of ruler as much as the country (see A9). As context only:
its mean absolute distance from the 7.7.1 Experimentation scores is 15.4 points
across its 16 countries, fifth of the nine dimensions, and its rank agreement
with them is a Spearman 0.55, second lowest.

**Fix.** A venture capital series is still missing. The only inspectable
aggregate, the OECD SME and Entrepreneurship Financing scoreboard, covers 6 of
the 16 original countries and omits Brazil, India, South Africa and Singapore.
Business R&D share is the next best candidate, from UNESCO or OECD research and
development statistics. GEM has not surveyed 14 of the countries since at
least 2019, so its coverage cannot grow evenly from the published reports.

---

## A2 — Per-capita normalisation flattens India

**Severity: medium.**

India scores 8.8 on Experimentation on dataset 7.7.1, 32nd of 53. It comes
from dividing absolute counts by 1.4 billion people. The arithmetic is correct
and the result is not informative: it says India files few patents per head,
which was never the question. Anticipation reads 35.5, 38th of 52, on articles
per head and statistical performance; the per-head stocks of researchers and
research spending are conditions beside it and do not enter it (D122). No
panel figure is quoted here, for the reason A9 gives.

**Fix.** Per-capita is right for most indicators and wrong where capability is
concentrated in institutions rather than spread across a population. Consider a
per-capita and absolute-capacity pair for research and experimentation
indicators, reported separately.

---

## A3 — Coordination and Trust remain weakly separable from wealth

**Severity: high. The first source-backed Trust release is still thin.**

The figures in this entry are from dataset 7.7.1 unless they name the
16-country run. Coordination publishes a score for 52 of 53 countries, from
border time, budget execution and V-Dem's expert-coded civil-society index.
Trust publishes for 52 of 53, from four rows: contract enforcement days, frozen
at 2019; bribery incidence (D123); government compliance with the courts
(V-Dem, D131); and the Joint EVS/WVS A165 social-trust item, which covers 37.
Trust correlates with log GDP per capita at 0.675 (Spearman 0.726, n 51) and
Coordination at 0.558 (Spearman 0.623, n 51), so both are usable as research
baselines but not as clean claims of wealth-free capability. D23 retired the
WGI perception composites and D44 retired homicide.

Both dimensions once leaned on the Worldwide Governance Indicators, which are expert
and firm perception composites that track income closely by construction. On the
16-country run, with those indicators in place, Coordination correlated with log
GDP per capita at 0.90 and Trust at 0.88.

Drop every indicator correlating with log GDP per capita at |r| ≥ 0.7 and each
dimension kept exactly one indicator. The table is from that same run, and the
indicators in it are retired, so it cannot be recomputed on the current frame:

| Dimension | Indicator | r with log GDP | Class | Survives |
| --- | --- | ---: | --- | --- |
| Coordination | Regulatory quality | +0.92 | P | no |
| Coordination | Government effectiveness | +0.91 | P | no |
| Coordination | Logistics performance | +0.72 | P | no |
| Coordination | Time to export | +0.68 | C | yes |
| Trust | Control of corruption | +0.85 | P | no |
| Trust | Rule of law | +0.83 | P | no |
| Trust | Contract enforcement days | +0.61 | C | yes |

The pattern to read is the class column. Every indicator that failed the old
test was class P and every indicator that survived was class C. On 7.7.1
Trust's rows correlate with log GDP per capita at 0.657 for the A165 social
measure, 0.552 for bribery incidence, 0.535 for court compliance and 0.166 for
contract enforcement days. The social measure is a watch item rather than a
verdict. Coordination's rows sit at 0.551 for border time, 0.388 for V-Dem
civil-society strength and 0.224 for budget execution, and all three remain a
partial operational proxy rather than a direct test of cross-agency delivery.

**Fix.** These dimensions need observable, behavioural indicators that are not
WGI and not frozen at 2019. V-Dem and budget execution are useful additions for
Coordination, but they do not show whether agencies delivered the same
objective. Trust needs pooled EVS/WVS rows, a recent court-throughput or case
clearance series, and broader institutional-performance evidence. See also A9,
which is the same problem seen from an executive-led state, and D20, where
documented cross-agency delivery is being collected as evidence.

**Overturned by.** Behavioural indicators that cover the country set and show
that each dimension remains distinct from income after its indicators are
combined. Until then, treat both as thin operational proxies and treat the
Trust score as provisional.

---

## A4 — The four WGI series are one measurement wearing four names

**Severity: closed. None of the four are scored. See D23.**

Government effectiveness, regulatory quality, rule of law and control of
corruption correlate with each other between 0.93 and 0.98 on the ten-country
run that last scored them. They are spread across Coordination, Trust and
Shared Purpose, so a single underlying perception measure is being counted
three times in three different dimensions.

None of the four are scored. The measurement-class analysis in D23 argued for
keeping none of them: they were the mechanism turning three dimensions into
restatements of income per head. The rows stay in the registry as retired, with
the reason on each.

---
## A5 — Voice and accountability is answering a different question in Shared Purpose

**Severity: closed. The indicator is retired. See D23.**

`GOV_WGI_VA.EST` measures the democratic channel for participation. Shared Purpose
asks whether people can see themselves in a common project. When the row was
last scored, before D23, Singapore read 20.9 while being one of the most
effective collective actors in the set.

The spec is explicit that political uniformity is not a capability, so the fix is
not simply to raise Singapore.

Voice and accountability is retired. On dataset 7.7.1 Shared Purpose rests on
three rows, tax revenue, income inequality and EVS/WVS civic participation
(D128, read through A15), at mean confidence 0.343, and it publishes a score
for 51 of 53 countries. Its correlation with log GDP per capita is 0.202 (n
50), the lowest of the nine dimensions. Singapore scores 37.0 on the two rows
it has. National belonging and volunteering are still gaps. No panel figure is
quoted here, for the reason A9 gives.

V-Dem's polarization item brings the Singapore question back from the other
side: a regime with no organised opposition can read as calm, as the United
Arab Emirates does. It is published
beside Shared Purpose as a behavioural check and not scored. See A13 and D121.

Voter turnout, from the same pinned V-Dem file, is now published beside Shared
Purpose as a behavioural check and not scored, because it reads this same
democratic channel as well as compulsory voting and managed mobilisation. See
D129.

---
## A6 — Doing Business indicators are frozen at 2019

**Severity: low, correctly handled.**

Five indicators come from the discontinued Doing Business programme: time and
procedures to start a business, border compliance time, contract enforcement
time, electricity connection speed. All are stuck at 2019 and the World Bank has
archived the codes.

The recency term already marks them down, so this is visible rather than hidden.
It is listed because these five have to migrate to B-READY, which is in the API
as `IC.BRE.*` inside World Development Indicators and covers 12 of the 53
countries in its 2024 round. The migration waits on coverage and not on the
publisher. See A12.

---
## A7 — Learning understates Korea and Japan

**Severity: medium.**

Learning is scored on four rows: the Human Capital Index, whose last full
round is 2020; the vocational share of secondary enrolment, which is a
structure of the school system and stale in many countries; the share of firms
offering formal training; and research citation impact (D124). Enrolment and
public education spending are conditions beside the score (D122). None of the
four scored rows observes what adults can do, so countries with exceptional
measured outcomes do not get full credit for them.

On dataset 7.7.1 Korea scores 42.4, 23rd of 53, and Japan 43.4, 22nd, although
their Human Capital Index rows are third and second of 50. The vocational share
pulls them down: Korea reads 14.7 and Japan 17.9 on that row, against 74.8 for
Finland, which leads the dimension at 76.3. The row rewards a school system
with a vocational track, which is a design choice and not a learning outcome.
Estonia (65.3, ninth) and Singapore (67.7, seventh) do not read low on 7.7.1;
citation impact puts them at 93.9 and 100. No panel figure is quoted here, for
the reason A9 gives.

**Fix.** A learning-outcomes series (PISA or PIAAC) would resolve most of this.
It is a gap because coverage across the country set is uneven, not because the
data does not exist.

---

## A8 — Every correlation here is a hint, not a result

**Severity: structural.**

Every correlation in `diagnostics.json` is computed on the 53 countries loaded.
Fifty-three points is enough to reverse a finding and not enough to establish one.
Two dimension pairs sat at 0.94 on the 16-country run and read as
near-duplicates. At 53 no dimension pair passes the redundancy threshold at all,
and on dataset 7.7.1 the highest is Anticipation with Learning at 0.79 (n 52).
Pairs separating is not the same as the nine being separate: on dataset 7.7.1
one shared factor carries 0.53 of the variance over the 51 countries with all
nine scored, well above the 0.19 chance gives at that size, and that factor
correlates 0.86 with log GDP per capita (n 50). The one-factor test (D137) is
the stronger reading, and it too is a hint at 51 countries.

The redundancy and wealth-proxy findings are strong enough to act on because
they also have a mechanical explanation, not because the coefficient is large.

Do not report any of these correlations as established until the country set is
substantially larger, and never quote one without its n.

---

## A9 — Coordination reads Singapore and other executive-led states low

**Severity: low. The size failure is absent from the 7.7.1 scores; one row
moves states that coordinate through the executive down by about a third.**

The figures in this entry are from dataset 7.7.1.

Coordination publishes a score for 52 of 53 countries. Cuba sits below the
coverage floor on one row. Three rows feed it: border time to export (Doing
Business, 52 countries, frozen at 2018 or 2019), budget execution fidelity
(`GF.XPD.BUDG.ZS`, 45 countries, 2018 to 2024) and V-Dem civil-society
strength (`v2x_cspart`, 53 countries, 2024). 45 countries are scored on all
three and seven on two. Confidence runs from 0.100 to 0.413, mean 0.362, and
the score correlates with log GDP per capita at 0.558 (n 51).

The entry was opened for a different failure, and that one is gone. On the
perception layer D23 retired, Uruguay scored 18.8 and Costa Rica 33.7, because
the Worldwide Governance Indicators and the Logistics Performance Index read a
small country with a small port as a weak one. On the rows in use now Uruguay
scores 73.9 and Costa Rica 88.6 against a frame median of 75.4, the 12 least
populous countries in the frame have a median of 76.6, and the score's
correlation with log population is 0.01 (n 52).

What is left falls on a narrower set of states. With equal row weights,
civil-society strength is a third of the score, and it measures whether society
organises independently of the state. A state that coordinates through its own
agencies reads on that row as one that does not coordinate:

| Country | Score | Border time and budget execution, mean | Civil-society strength |
| --- | ---: | ---: | ---: |
| Singapore | 72.1 | 90.1 | 35.9 |
| China | 65.6 | 91.4 | 14.1 |
| United Arab Emirates | 52.0 | 83.8 (border time only) | 20.2 |
| Rwanda | 61.1 | 74.3 | 34.8 |

Singapore is the case the entry was written for, a small state with whole-of-
government coordination as its organising principle, and it sits below the
frame median. The row does not read autocracy alone: El Salvador reads 35.4 on
it against 86.5 on its other two rows, and Mexico 44.7 against 84.6. Part
of the reading is defensible, since D83 admits the row for the coordination a
state does with society. The part that is wrong is reading its absence as an
absence of coordination among institutions.

**The panel gap is not evidence here.** The in-session run that
`data/delphi/latest.json` points at sits 35.7 points from the 7.7.1
Coordination score on average across its 16 countries, below it in 15, the
largest gap of the nine dimensions. That comparison measures the ruler, not the
countries. The run has one panelist, so `isPanel` is false; its provenance is
`in_session`, so `isEvidential` passes; and it carries no dataset version, so
the scorer attaches it to no cell and 7.7.1 publishes no `delphiScore` at all.
Its Coordination cells were anchored on the retired perception scores: the
rationales mark Uruguay up from 18.8 to 45, Brazil from 15.5 to 35 and
Colombia from 4.3 to 18. Against today's scores every one of those upward
corrections reads as a downward one. The rank agreement, which does not depend
on the anchor, is a Spearman 0.68 on Coordination, in the middle of the nine
(0.45 to 0.89).

**Fix.** Cross-agency delivery records, a declared gap, would measure the
construct directly and would let civil-society strength sit in a family of
its own beside them, the way D57 splits Trust. A reviewed gateway panel on the
7.7.1 frame would make the panel comparison readable again. Until one exists,
no panel figure belongs in this entry.

---
## A10 — The frame is 53 countries wide, and they are not the world

**Severity: structural.**

Every country in the benchmark sets the endpoints of every indicator scale and is
measured against the result. See D47. So 0 and 100 mean "weakest and strongest of
these 53", and the 53 were picked to expose contrasts and to cover Latin America
whole (D51), not to sample the world. A score is a position in this set and
carries no claim about a country outside it.

Two consequences follow.

**Scores are only comparable inside one dataset version.** Adding a country moves
the endpoints it touches and restates every number. That is done as an announced
rebase with a major version bump, and 5.1.0 numbers do not compare with 6.0.0
ones. Anything quoting a score has to quote the version with it.

**Clamping has moved to history.** No observed cell clamps: on dataset 7.7.1, 0
of 1,629, because a current value cannot fall outside a frame its own country
helped build. The `outOfFrame` flag fires only where a historical value sits
outside the current frame, which is 24 of 455 momentum baskets. A trend carrying a clamped
basket member is part distance-to-the-clamp rather than movement in the country,
and every surface that prints a trend prints that count.

---

## A11 — Building measures industrial output, and reads as delivery capacity

**Severity: medium.**

Building asks whether a country can build and deliver. Its four measured
indicators are manufacturing value added, high-technology export share,
electricity connection speed and economic complexity. Output per worker sits
beside them as a condition (D122). All four describe industrial output. Nothing
in the measured set can see a national programme that was specified, funded and
delivered.

On dataset 7.7.1 Brazil scores 28.2 at confidence 0.568, its second best
evidenced dimension after Adaptability. The score is a correct statement about Brazilian industrial output
and it is read as a statement about Brazilian delivery capacity, which is a
different construct. In the same decade Brazil built and ran Pix, which settled
7.98 billion transactions in July 2026, and GOV.BR, which reports 175 million
active accounts.

The two indicators that would carry the delivery construct,
`large_project_delivery` and `firm_scale_up_rate`, are both gaps.

**Fix.** Two parts, one done and one open. Documented deliveries are now
recorded in `data/evidence/records.json` against the gap they bear on, outside
the score, so the cases are written down with sources and limits instead of
being argued in prose. Three hundred and sixty-two records cover 53 countries
and bear on 21 different gaps. Brazil's 26 run from Casa da Moeda in 1694 to the
minimum-wage revaluation rule in 2023.
See D20.
The open part is a comparable delivery series across the country set, without
which the gap cannot be promoted to an indicator.

**Watch for.** The same reading error in reverse. A country with strong
industrial output and a poor record of finishing public programmes scores well
here, and the benchmark currently has no way to say so.

---
## A12 — Coordination and Trust are scored on thin evidence

**Severity: high. Trust is partly measured and Coordination remains narrow.**

The figures in this entry are from dataset 7.7.1.

| Dimension | Observed indicators | Confidence | What is left | Publishes a score |
| --- | ---: | ---: | --- | --- |
| Coordination | 3 of 5 for 45 countries | 0.100 to 0.413, mean 0.362 | Border time from 2019, budget execution from 2018 to 2024 and V-Dem civil-society strength at 2025 | 52 of 53 |
| Trust | 4 of 7 for 37 countries | 0.072 to 0.396, mean 0.347 | Contract enforcement days from 2019, bribery incidence from 2010 to 2025, V-Dem court compliance at 2025 and EVS/WVS A165 at 2022; court clearance, institutional trust and cooperation with strangers remain gaps | 52 of 53 |
| Shared Purpose | 3 of 6 for 33 countries | 0.000 to 0.433, mean 0.343 | Tax revenue, income inequality, EVS/WVS civic participation | 51 of 53 |

Coordination remains a narrow operational proxy: budget alignment, border
processing and civil-society judgements do not show whether several
institutions delivered a shared national objective (A9). Trust prints for 52
of 53, but country-level confidence runs from 0.072 to 0.396. Cuba is below
the floor on both. Shared Purpose has a third row in 33 countries; the 18 on
two rows sit on the floor and print, drawn dashed with a marked axis and a
confidence band that says do not quote it alone. Cuba and Haiti publish no
Shared Purpose score. That is a mitigation and not a fix.

**Trust still has a narrow family balance.** D57 splits the dimension into a
social family, which asks whether people rely on strangers, and an institutional
family, which asks whether they rely on courts, government and the civil
service. The social family has one observed row, A165, in 37 countries. The
institutional family has three: contract enforcement days, bribery incidence
and court compliance. 15 of the 52 scored countries rest on the institutional
family alone, and court case clearance and institutional trust remain gaps.
`familyBalance` publishes this coverage.

**Fix.** Pool the held EVS/WVS country rows with respondent-level weights when
the license permits, then land court throughput and case clearance, cross-agency
delivery records, institutional trust, and behavioural measures of corruption
experience. The V-Dem row is a partial Coordination repair, not a replacement
for delivery records. The generative panel can
interpret the dimensions while those data are missing, but its values stay
beside the indicator score and never become observations.

**What the World Bank can and cannot supply.** `GF.XPD.BUDG.ZS`, primary
government expenditure as a proportion of the original approved budget, covers
45 of 53 with a latest year between 2018 and 2024, 10 of them at 2024, and its
scored row correlates with log GDP per capita at 0.224. The value is
two-sided: both underspending and overspending can indicate weak execution, so
the registry converts it to absolute distance from 100 before scoring. The CPIA
cluster covers only 10 of 53. Of the two Enterprise Survey corruption series,
`IC.FRM.CORR.ZS` asks a firm what it believes firms similar to itself pay, so it
records belief and is ineligible, while `IC.FRM.BRIB.ZS` asks whether the
responding firm was itself asked for a bribe across six public transactions. The
second covers 50 of 53, 45 of them at 2023 or later, and D123 scores it in
Trust's institutional family. Its correlation with log GDP per capita is 0.552.
It carries the reticence risk D123 records: China reads 0.14% and Korea 0.02%
while Vietnam, surveyed by the same programme, reads 31%. Trust still needs
court data and a broader social comparison. The remaining shortlist is OECD
Government at a Glance and a harmonized court or audit source.

**B-READY is what the frozen rows become.** `IC.BRE.*` replaces Doing Business
inside World Development Indicators. The API's 2024 dispute-resolution rows
cover only 12 of the 53 countries; the official 2025 downloadable package
reaches 25, two countries below the half-frame gate, so it remains a candidate
rather than a scored replacement. Its dispute-resolution and operational-
efficiency fields are promising, but the package mixes expert and firm-survey
inputs and does not publish the court clearance numerator and denominator the
Trust gate requires. Revisit the next release instead of forcing a partial
series into the frame.

Government compliance with the courts (`court_compliance`, V-Dem `v2jucomp`,
D131) covers 53 of 53. It is an expert code of a public act, and it reads
regime: D131 measured r 0.88 with V-Dem's electoral democracy index on the v15
release, and Singapore is the one autocracy that reads high, plausibly because
its courts seldom rule against the state.

V-Dem civil-society strength is now an adapter-backed Coordination row (D83),
but its expert coding keeps confidence low and does not answer cross-agency
delivery. Voter turnout, volunteering and civic participation are absent from
the catalogue under any database id, and the interpersonal and institutional
trust items were never World Bank series. The Joint EVS/WVS adapter supplies
the social row; Trust still needs an adapter for court clearance and
Coordination needs one for delivery beyond the V-Dem and budget rows.
The shortlist for court clearance is OECD Government at a Glance. `ingest: 'manual'` remains available for sources with no
usable API.

The one indicator added to fix contamination was the contamination: D42 showed
that `homicide_rate` raised Trust's wealth correlation by 0.288, so D44 retired
it. Generative estimates are therefore a useful research layer, but they cannot
repair a missing observation series.

This artefact remains open while the dimensions rely on narrow proxies. For
Trust, D57 sets the stricter condition: one harmonised social measure and one
comparable institutional-performance measure, because two indicators from the
same family would clear the floor without answering the dimension. The current
release meets that structure with A165 and three institutional rows, but court
throughput, broader social coverage and the wealth and redundancy review remain
open.
The budget series opens the Coordination door; it does not close its measurement
problem.

---
## A13 — Polarization reads calm where there are no camps to polarize

**Severity: low. The series is published as a behavioural check and is not
scored. See D121.**

The `political_polarization` check is V-Dem's `v2cacamps_osp`: whether
supporters of opposing political camps meet in a hostile rather than a friendly
manner, on a 0 to 4 scale. The question counts hostility and not disagreement,
which is what the registry gap asks for. It cannot tell a society where camps
meet in friendship from one where no opposition camp is allowed to exist.

The 2025 values in V-Dem v16 do not sort cleanly by regime. Grouped by V-Dem's
own classification (`v2x_regime`), the 15 liberal democracies in the frame
average 1.67 and the five closed autocracies 2.18, while the 21 electoral
democracies average 2.78 and the 12 electoral autocracies 3.25. Closed
autocracies read calmer than both middle groups, so the U survives, but its
closed end sits half a point above the liberal democracies and the five spread
from 1.07 to 3.06. Across the frame the calm reading correlates with the
electoral democracy index (`v2x_polyarchy`) at 0.36 (n = 53).

The failure is now carried by two countries and not by a group. The United Arab
Emirates reads 1.07, the seventh calmest of the 53, beside Ireland at 0.41,
Japan at 0.86 and Finland at 1.27, and Cuba reads 1.75, at the liberal
democracy mean. Rwanda reads 2.67 and Singapore 1.83, both electoral
autocracies and neither calm. The same release codes Rwanda 0.96 and Singapore
1.27 for 2024, so a single year moved Rwanda by 1.7 points with no change in
its regime class. A latest-year expert code of this item can swing that far,
and a reader comparing two countries on it is partly comparing coding years.

Scored as a third Shared Purpose row against the 7.7.1 frame, it would raise
the United Arab Emirates by 11.1 points, Singapore by 7.7 and China by 4.8, and
let Haiti publish a Shared Purpose score for the first time, at 35.9, on one
World Bank row and this one. Rwanda would fall 4.2 and Vietnam 3.3. The largest
gains go to calm democracies, Panama by 18.0, Paraguay by 13.3 and Japan by
11.8, which is the reading the item is meant to give. The United Arab Emirates
gain is A5 inverted: A5 retired a perception composite that penalised
political uniformity, and this item rewards it. Political uniformity is not a
capability, and low measured hostility under repression is not shared purpose.

The numeric gates do not catch it. The scored row passes the wealth screen at
0.408 against log GDP per capita and the redundancy screen at 0.512 at most
(interpersonal trust, n = 37), though adding it would raise Shared Purpose's
own correlation with income from 0.214 to 0.406. The decision stands on
construct and not on correlation.

**What is published.** The value sits on every country page under Shared
Purpose as a check, not scored, with this reason attached, and the capability
page lists it. `behaviouralChecks` in `diagnostics.json` reports its
correlation on the published value as -0.408 against log GDP per capita
(n = 53) and -0.217 against the Shared Purpose score (n = 51). No Shared
Purpose score, confidence or coverage count moves.

**What remains.** A reader can still take a low value for a closed regime as a
finding; the attached reason is the only mitigation. The fix that would let it
score is a reading conditioned on competition existing at all, or a behavioural
row (civic participation, volunteering, voter turnout) that agrees with the
item outside the closed regimes. Neither is wired, and the gap stays open.

---
## A14 — Half of Agency's scored rows are frozen at 2019

**Severity: medium.**

Agency is scored on four rows: new business density, perceived control over
life (D127), and the time and the number of procedures to start a business.
The last two come from Doing Business and stopped in 2019 (A6). Internet
users, account ownership and private credit sit beside the score as
conditions (D122). So half the scored evidence is a 2019 reading of
registration rules, and the one current row that is not a business count is
a perception (A15).

Where new business density is missing, Agency is the two frozen rows and
perceived control. That holds for the United States (83.4), Nicaragua (80.1)
and Venezuela (25.8), each at confidence 0.37 on dataset 7.7.1.

Read Agency through its confidence. The fix is a behavioural row that observes
people acting, which the O1 triage sweep did not find with frame coverage.

---

## A15 — Two survey rows read regime and question format

**Severity: medium. Both rows are scored. See D127 and D128.**

The figures in this entry are from dataset 7.7.1.

`perceived_control` (Agency, A173) is a perception, and a closed or electoral
autocracy can read high on it. Vietnam reads 8.1 out of 10, third of 37, and
Nicaragua 8.0, fifth, surveyed in 2019-20 after the 2018 crackdown; Venezuela
reads 7.7. Response style on a 10-point scale moves the ordering too: Mexico,
Uruguay and Colombia sit at 8.1 to 8.2 and Japan, on a mail survey, at 6.0.
The row correlates with log GDP per capita at -0.15.

`civic_participation` (Shared purpose, A080_01) harmonises two questions. EVS
shows a list and asks which organisations the respondent belongs to; WVS reads
each type aloud and counts active and inactive members. The eight EVS
countries in the frame average 9.9% and the 29 WVS countries 19.4%. Among the
ten countries surveyed by both, WVS reads higher in eight, by a median 1.9
points. Estonia (1.5%, EVS) is the floor and Kenya (38.4%) and Indonesia
(37.9%, both WVS) the top. Inside the EVS group the row tracks income at 0.83;
across the frame it runs against income at -0.33.

**What is published.** Both values, with the programme's question, the survey
year and the valid-answer base in each observation's note. The release stamps
every value 2022, though fieldwork ran from 2017 to 2023.

**What remains.** Neither row is adjusted. A reader can take Vietnam's
perceived control or the negative income correlation of either row as a
finding; read them through this entry first. Pooled microdata with a format
term, or a behavioural row with frame coverage, is the fix.
