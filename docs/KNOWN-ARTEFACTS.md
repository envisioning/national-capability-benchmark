# Known artefacts

Places where the v0 model produces a number that is wrong about the world rather
than informative about it. These are not bugs in the code: the pipeline is doing
what it was told. They are failures of measurement, and anyone building on this
needs to know them before quoting a score.

Evidence for each is either a diagnostic in `data/out/diagnostics.json` or the
in-session panel run in `data/delphi/in-session-round1.json`, which scored 144
of the 468 country-dimension cells against the same evidence briefs.

Numbers here are from dataset 4.0.0 unless a figure names the run it comes from.
Where a figure predates the current frame it says so, because the scale it was
measured on is not the scale in use.

---
## A1 — Experimentation is not measured, it is inferred from patents

**Severity: medium.**

Four of eight indicators are observed. GEM early-stage entrepreneurial activity
and fear of failure carry half the dimension, so it no longer rests on patents
alone. Venture capital, regulatory sandboxes, university spinouts and business
R&D share are still gaps. Mean confidence is 0.226, above only Coordination,
Trust and Shared Purpose, and the GEM series covers 16 of the 52 countries, so
36 are scored on patents and trademarks alone. See D21.

Resident patents and resident trademarks per head measure formalised, completed,
defensible invention, which is close to the opposite of the many-cheap-
experiments construct the dimension is supposed to capture.

The panel and the indicators disagree here more than anywhere else in the model.
The four largest departures across the 16 countries the panel covers:

| Country | Indicators | Panel | Gap |
| --- | ---: | ---: | ---: |
| Estonia | 30.2 | 70 | +39.8 |
| United States | 55.8 | 95 | +39.2 |
| Netherlands | 28.0 | 65 | +37.0 |
| India | 9.8 | 40 | +30.2 |

The Netherlands' 28.0 is not a finding about Dutch innovation. It is the absence
of venture-capital data. Uruguay scores 34.3, having legalised and regulated a
national cannabis market and run a fintech sandbox. Argentina scores 21.5, having
produced more technology firms of scale per head than anywhere else in the
region.

**Fix.** A venture capital series is still missing. The only inspectable
aggregate, the OECD SME and Entrepreneurship Financing scoreboard, covers 6 of
the 16 original countries and omits Brazil, India, South Africa and Singapore.
Business R&D share is the next best candidate, from UNESCO or OECD research and
development statistics. Extending GEM coverage to the other 36 countries is the
cheaper half.

---

## A2 — Per-capita normalisation flattens India

**Severity: medium.**

India scores 9.8 on Experimentation and 26.7 on Anticipation. Both come from
dividing absolute counts by 1.4 billion people. The arithmetic is correct and the
result is not informative on Experimentation: it says India files few patents per
head, which was never the question. The panel put India at 40 there, a gap of
30.2 points, and at 25 on Anticipation, which the indicators now match within
1.7.

**Fix.** Per-capita is right for most indicators and wrong where capability is
concentrated in institutions rather than spread across a population. Consider a
per-capita and absolute-capacity pair for research and experimentation
indicators, reported separately.

---

## A3 — Coordination and Trust remain weakly separable from wealth

**Severity: high. The first source-backed Trust release is still thin.**

The current figures are from dataset 5.0.0. Coordination publishes a score for
51 of 52 countries, based on border time, budget execution and V-Dem's
expert-coded civil-society index. Trust publishes a
score for 36 of 52 countries, based on the Joint EVS/WVS A165 social-trust
measure and the 2019-frozen contract-enforcement measure. Trust's dimension
correlation with log GDP per capita is 0.627 (Spearman 0.711, n=35), so the
release is usable as a research baseline but not a clean claim of wealth-free
trust. D23 retired the WGI perception composites and D44 retired homicide.

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
test was class P and every indicator that survived was class C. The current
Trust release adds a class P social measure from a named academic survey to the
class C contract measure. The social measure alone correlates with log GDP per
capita at 0.669 in the current alignment, so it is a watch item rather than a
verdict. Coordination now has a 2024 V-Dem civil-society index beside the
World Bank budget-execution and older border-time rows; the new index's own
correlation is 0.395, but all three remain a partial operational proxy rather
than a direct test of cross-agency delivery.

**Fix.** These dimensions need observable, behavioural indicators that are not
WGI and not frozen at 2019. V-Dem and budget execution are useful additions for
Coordination, but they do not show whether agencies delivered the same
objective. Trust needs pooled EVS/WVS rows, a recent court-throughput or case
clearance series, and broader institutional-performance evidence. See also A9,
which is the same problem seen from a small competent state, and D20, where
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
asks whether people can see themselves in a common project. Singapore scores 20.9
while being one of the most effective collective actors in the set. The panel put
it at 55, splitting the difference between very high collective-action capacity
and genuinely limited pluralism.

The spec is explicit that political uniformity is not a capability, so the fix is
not simply to raise Singapore.

Voice and accountability is retired, so Singapore's 20.9 is gone. Shared Purpose
now rests on two indicators, tax revenue and income inequality, at mean
confidence 0.223, and it publishes a score for 46 of 52 countries. Its
correlation with log GDP per capita is 0.45, the lowest of the seven dimensions
that publish. The behavioural measures it needs are civic participation and
volunteering, both still gaps, plus voter turnout, which is published by
International IDEA and would have to be entered by hand.

---
## A6 — Doing Business indicators are frozen at 2019

**Severity: low, correctly handled.**

Five indicators come from the discontinued Doing Business programme: time and
procedures to start a business, border compliance time, contract enforcement
time, electricity connection speed. All are stuck at 2019 and the World Bank has
archived the codes.

The recency term already marks them down, so this is visible rather than hidden.
It is listed because these five have to migrate to B-READY, which is in the API
as `IC.BRE.*` inside World Development Indicators and covers 12 of the 52
countries in its 2024 round. The migration waits on coverage and not on the
publisher. See A12.

---
## A7 — Learning overstates Brazil and understates Korea, Estonia and Singapore

**Severity: medium.**

The Learning dimension leans on enrolment and expenditure, which are inputs, plus
the Human Capital Index, whose last full round is 2020. Countries with high
enrolment and weak outcomes score well. Countries with exceptional measured
outcomes do not get credit for them.

Against the panel, Korea is 29.1 points low, Singapore 29.0 and Estonia 28.2.
The error runs the other way where enrolment rose fast and measured outcomes did
not follow: Peru is 19.7 points high, Mexico 14.8, Colombia 12.3 and Brazil 8.2.

**Fix.** A learning-outcomes series (PISA or PIAAC) would resolve most of this.
It is a gap because coverage across the country set is uneven, not because the
data does not exist.

---

## A8 — Every correlation here is a hint, not a result

**Severity: structural.**

Every correlation in `diagnostics.json` is computed on the 52 countries loaded.
Fifty-two points is enough to reverse a finding and not enough to establish one.
Two dimension pairs sat at 0.94 on the 16-country run and read as
near-duplicates. At 52 no dimension pair passes the redundancy threshold at all,
and the highest is Anticipation with Agency at 0.83. The nine dimensions
separate when the sample is wide enough to separate them.

The redundancy and wealth-proxy findings are strong enough to act on because
they also have a mechanical explanation, not because the coefficient is large.

Do not report any of these correlations as established until the country set is
substantially larger, and never quote one without its n.

---

## A9 — Coordination reads far too low for small, competent states

**Severity: medium. No score carries it today, and it will return with the first
replacement indicator.**

Coordination now publishes a thin score for most countries, but the artefact is
still active because the measurement error is a property of the indicator type,
not of one run.

On the perception layer D23 retired, and on the frame in use then, Uruguay
scored 18.8 on Coordination. In the same decade it delivered Plan Ceibal, a
national digital government stack, and the first nationally regulated cannabis
market in the world, each of which required several institutions to move
together and hold position for years. Costa Rica showed the same pattern more
mildly at 33.7, against a national choice in
1949 to abolish the army and redirect the money into health and education that
has now held for three generations.

Those scores came from the Worldwide Governance Indicators and the Logistics
Performance Index. Both are surveys weighted toward how a country looks to
international business, and a small country with a small port does not look like
much through that lens whatever its state can actually organise.

**Fix.** The same fix as A3. Coordination needs observable evidence of
institutions acting together, not perception surveys of business conditions.
Delivery records for cross-agency national programmes would be the direct
measure, and they are a declared gap.

---
## A10 — The frame is 52 countries wide, and they are not the world

**Severity: structural.**

Every country in the benchmark sets the endpoints of every indicator scale and is
measured against the result. See D47. So 0 and 100 mean "weakest and strongest of
these 52", and the 52 were picked to expose contrasts and to cover Latin America
whole (D51), not to sample the world. A score is a position in this set and
carries no claim about a country outside it.

Two consequences follow.

**Scores are only comparable inside one dataset version.** Adding a country moves
the endpoints it touches and restates every number. That is done as an announced
rebase with a major version bump, and 3.0.0 numbers do not compare with 4.0.0
ones. Anything quoting a score has to quote the version with it.

**Clamping has moved to history.** No observed cell clamps: 0 of 1,604, because a
current value cannot fall outside a frame its own country helped build. The
`outOfFrame` flag now fires only where a historical value sits outside the
current frame, which is 64 of 603 momentum baskets. A trend carrying a clamped
basket member is part distance-to-the-clamp rather than movement in the country,
and every surface that prints a trend prints that count.

---

## A11 — Building measures industrial output, and reads as delivery capacity

**Severity: medium.**

Building asks whether a country can build and deliver. Its five measured
indicators are manufacturing value added, high-technology export share, labour
productivity, electricity connection speed and economic complexity. All five
describe industrial output. Nothing in the measured set can see a national
programme that was specified, funded and delivered.

Brazil scores 25.3 at confidence 0.544, one of the better evidenced of its nine
dimensions. The score is a correct statement about Brazilian industrial output
and it is read as a statement about Brazilian delivery capacity, which is a
different construct. In the same decade Brazil built and ran Pix, which settled
7.98 billion transactions in July 2026, and GOV.BR, which reports 175 million
active accounts.

The two indicators that would carry the delivery construct,
`large_project_delivery` and `firm_scale_up_rate`, are both gaps.

**Fix.** Two parts, one done and one open. Documented deliveries are now
recorded in `data/evidence/records.json` against the gap they bear on, outside
the score, so the cases are written down with sources and limits instead of
being argued in prose. Seventy-nine records cover 22 countries and bear on 16
different gaps. Brazil's 24 run from Casa da Moeda in 1694 to Pix in 2020. See D20.
The open part is a comparable delivery series across the country set, without
which the gap cannot be promoted to an indicator.

**Watch for.** The same reading error in reverse. A country with strong
industrial output and a poor record of finishing public programmes scores well
here, and the benchmark currently has no way to say so.

---
## A12 — Coordination and Trust are scored on thin evidence

**Severity: high. Trust is partly measured and Coordination remains narrow.**

The figures in this entry are from dataset 5.0.0.

| Dimension | Observed indicators | Confidence | What is left | Publishes a score |
| --- | ---: | ---: | --- | --- |
| Coordination | 3 of 8 for 51 countries | 0.063 to 0.258, mean 0.226 | Border time from 2019, budget execution and V-Dem civil-society strength at 2024 | 51 of 52 |
| Trust | 2 of 8 for 36 countries | 0.000 to 0.159, mean 0.130 | Joint EVS/WVS A165 plus contract enforcement days from 2019; court clearance remains a gap | 36 of 52 |
| Shared Purpose | 2 of 7 | 0.000 to 0.272, mean 0.223 | Tax revenue, income inequality | 46 of 52 |

Coordination's score now carries a third row from V-Dem's expert-coded civil
society participation index. It remains a narrow operational proxy: budget
alignment, border processing and civil-society judgements do not show whether
several institutions delivered a shared national objective. Trust now prints a provisional score where both rows are observed,
but every published score rests on exactly two indicators at confidence 0.159.
Sixteen countries remain below the coverage floor. Shared Purpose sits one
indicator above the floor and prints, drawn dashed with a marked axis and a
confidence band that says do not quote it alone. That is a mitigation and not a
fix.

**Trust still has a narrow family balance.** D57 splits the dimension into a
social family, which asks whether people rely on strangers, and an institutional
family, which asks whether they rely on courts, government and the civil
service. The current social family has one observed row in 36 countries. The
institutional family has one observed row in 51, while court performance and
institutional trust remain gaps. `familyBalance` publishes this coverage, so a
reader can see that the structural test is met only by the social plus stale
contract pair.

**Fix.** Pool the held EVS/WVS country rows with respondent-level weights when
the license permits, then land court throughput and case clearance, cross-agency
delivery records, institutional trust, and behavioural measures of corruption
experience. The V-Dem row is a partial Coordination repair, not a replacement
for delivery records. The generative panel can
interpret the dimensions while those data are missing, but its values stay
beside the indicator score and never become observations.

**What the World Bank can and cannot supply.** `GF.XPD.BUDG.ZS`, primary
government expenditure as a proportion of the original approved budget, covers
44 of 52 at 2024 and correlates with log GDP per capita at 0.285. The value is
two-sided: both underspending and overspending can indicate weak execution, so
the registry converts it to absolute distance from 100 before scoring. The CPIA
cluster covers only 10 of 52. Of the two Enterprise Survey corruption series,
`IC.FRM.CORR.ZS` asks a firm what it believes firms similar to itself pay, so it
records belief and is ineligible, while `IC.FRM.BRIB.ZS` asks whether the
responding firm was itself asked for a bribe across six public transactions. The
second covers 49 of 52, 44 of them at 2023 or later, and D60 wires it as a
behavioural check: fetched, published beside Trust and excluded from the frame,
the mean, the coverage floor and the confidence. It is not admissible as the
score, because it puts the two-indicator dimension at about 0.53 against log GDP
per capita where contract enforcement days alone sits at about 0.14, a larger
wealth contribution than the one D44 retired an indicator over. Trust now has a
source-backed score from the Joint EVS/WVS adapter, but still needs court data
and a broader social and institutional comparison. The remaining shortlist is
OECD Government at a Glance and a harmonized court or audit source.

**B-READY is what the frozen rows become.** `IC.BRE.*` replaces Doing Business
inside World Development Indicators. The API's 2024 dispute-resolution rows
cover only 12 of the 52 countries; the official 2025 downloadable package
reaches 25, one country below the half-frame gate, so it remains a candidate
rather than a scored replacement. Its dispute-resolution and operational-
efficiency fields are promising, but the package mixes expert and firm-survey
inputs and does not publish the court clearance numerator and denominator the
Trust gate requires. Revisit the next release instead of forcing a partial
series into the frame.

V-Dem civil-society strength is now an adapter-backed Coordination row (D83),
but its expert coding keeps confidence low and does not answer cross-agency
delivery. Voter turnout, volunteering and civic participation are absent from
the catalogue under any database id, and the interpersonal and institutional
trust items were never World Bank series. The Joint EVS/WVS adapter now supplies
the first social row; Trust still needs an adapter for court clearance and
Coordination needs one for delivery beyond the V-Dem and budget rows.
The shortlist is ILOSTAT, IDEA voter turnout, and OECD government at a glance
for court clearance. `ingest: 'manual'` remains available for sources with no
usable API.

The one indicator added to fix contamination was the contamination: D42 showed
that `homicide_rate` raised Trust's wealth correlation by 0.288, so D44 retired
it. Generative estimates are therefore a useful research layer, but they cannot
repair a missing observation series.

This artefact remains open while the dimensions rely on narrow proxies. For
Trust, D57 sets the stricter condition: one harmonised social measure and one
comparable institutional-performance measure, because two indicators from the
same family would clear the floor without answering the dimension. The current
release meets that structure with A165 and contract enforcement, but court
performance, broader coverage and the wealth and redundancy review remain open.
The budget series opens the Coordination door; it does not close its measurement
problem.
