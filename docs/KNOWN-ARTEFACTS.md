# Known artefacts

Places where the v0 model produces a number that is wrong about the world rather
than informative about it. These are not bugs in the code: the pipeline is doing
what it was told. They are failures of measurement, and anyone building on this
needs to know them before quoting a score.

Evidence for each is a diagnostic in `data/out/diagnostics.json` or a figure
from the published output. The run `data/delphi/latest.json` points at is an
in-session panel on dataset 10.0.0: three Claude panelists, one vendor, two
rounds over all 1,215 cells (D155). Its estimates are `delphiScore` and never
`score`. Under D155 its spread measures stance and not vendor, so a narrow IQR
is a floor on the real uncertainty. A panel figure quoted below is a second
opinion beside the indicators, and the panel median tracks income more closely
than the indicator score on every dimension (`panelVsGdp` in the
diagnostics), so a panel figure that lifts a country is never evidence on its
own.

Every entry below is on dataset 10.0.0, the 135-country frame of D176,
except where it names another run. A figure that came from a counterfactual
rescore or a count the published files do not carry keeps the run it comes
from: the scored-row counterfactual in A13 and the question-format split in
A15, which were made on the 53 countries of the 8.x frame. The World Bank's
list of frame countries for the B-READY 2026 round in A6 and the B-READY
public services correlation in A12 were taken against the 125 of D153 on
2026-10-17, and the CPIA count in A12 on 2026-10-16. A3 also quotes the
16-country run that last scored the WGI rows, and A4 the ten-country one. A12
quotes one figure D131 measured on V-Dem v15. A13's regime groups and its
electoral democracy correlation read the 2025 rows of the V-Dem v16
country-year file for the 125 of D153, and A10's democracy share is counted
on the same 125; neither covers the ten countries D176 added. A10's counts
of the economies outside the frame come from the frame expansion memo of
2026-11, which counted them on the 9.6.0 registry. Panel figures come from
the 10.0.0 run named above (D139, D160). Where a figure predates the current frame, the scale it
was measured on is not the scale in use.

---
## A1 — Experimentation is not measured, it is inferred from patents

**Severity: medium.**

The figures in this entry are from dataset 10.0.0.

Six of eleven indicators are observed for most countries: resident patents,
trademarks and industrial designs per head (D126), new public software
repositories per head (D145), B-READY insolvency efficiency for the 82
countries the 2025 round reached (D173), and, for the 16 countries GEM
covered first, early-stage entrepreneurial activity and fear of failure.
Venture deals, firms through regulatory sandboxes and university spinouts
are still gaps (since D152 the first two count deals and firms, where they
used to read money and regimes). Business R&D share is retired: its only
working source reads the make-up of a spending stock, and state enterprises
count as business (D142). Mean confidence is 0.394, under the 0.40
objective. All 135 countries publish a score. Twelve sit on two rows at the
coverage floor, at confidence 0.099 to 0.180: Guinea, Mali, Burkina Faso,
the Republic of the Congo, Cameroon, Chad, Senegal, Togo, the Central African
Republic, Mauritania, Timor-Leste and Eswatini. GEM's later reports are held
out because, on the 53 countries of dataset 7.2.0, the 14 that GEM skips are
mostly lower-income and the gain would sit where income already is (D125);
those reports were not read for the 72 countries D153 added or the ten D176
added. See D21.

Resident patents and resident trademarks per head measure formalised,
completed, defensible invention, which is close to the opposite of the
many-cheap-experiments construct the dimension is supposed to capture. The
repository row is the one cheap attempt the dimension observes, and it sees
one platform: public GitHub work, located by IP address, so VPN users are
misplaced and Singapore reads high partly as a regional hub. The insolvency
row reads the other end, how cheaply a failed venture can close in court,
and it reads an institution rather than the attempts themselves. A zero on
it means no liquidation and no reorganisation closed in three years (12
countries), and it counts as a value (D173). Chad, the Central African
Republic and Timor-Leste publish an Experimentation score on such a zero and
the repository row (D176). Experimentation's correlation with log GDP per
capita is 0.739 (n 133).

Belgium scores 53.0, 13th of 135, and the Netherlands 52.6, 15th. Neither is
a finding about innovation in the Low Countries: both miss the trademark and
design rows, venture capital is a gap, and Belgium's score rests on patents,
repositories and insolvency. Uruguay scores 32.2, 43rd, having legalised and
regulated a national cannabis market and run a fintech sandbox. Argentina
scores 23.6, 57th, having produced more technology firms of scale per head
than anywhere else in the region.

The filing rows count filings at a national office, so a country whose
residents file at a regional office reads thin or stale. The Netherlands and
Belgium file trademarks and designs at the Benelux office. Twelve members of
OAPI, the regional office for francophone Africa, are in the frame. Most
have no national filing row at all, and the national series the others have
are old. A value more than 15 years old does not count (D159), so Mali's
patent row (one filing in 1981), the Republic of the Congo's (1988) and
Burkina Faso's patent and design rows (2010) are set aside. Each of the three
publishes on the repository row and the insolvency row, and so do Cameroon,
Chad, Senegal, Togo and the Central African Republic. At the other end China
scores 98.0, first of 135, on the three filing rows alone: each sits at the
top of its frame, the filings were subsidised (D126), and the repository row
that would temper them is held by the access gate, and B-READY has not
reached China.

The panel agrees on the order: its Experimentation ranks correlate with the
indicator ranks at 0.93 (Spearman, 135 countries). It reads the top lower,
with China seventh at 65 against 98.0, and lifts India from 74th to 34th.

**Fix.** A venture deal count is still missing: first rounds per million
people, counted by deal and not by amount (D152). The only inspectable
aggregate, the OECD SME and Entrepreneurship Financing scoreboard, carries
amounts rather than deals for 6 of the 16 original countries and omits Brazil,
India, South Africa and Singapore.
GEM has not surveyed 14 of the 53 original countries
since at least 2019, so its coverage cannot grow evenly from the published
reports.

---

## A2 — Per-capita normalisation flattens India

**Severity: medium.**

India scores 16.2 on Experimentation, 74th of 135 on dataset 10.0.2. It comes
from dividing absolute counts by 1.4 billion people. The arithmetic is correct
and the result is not informative: it says India files few patents per head,
which was never the question. Counted whole, India is third of 135 on
scientific articles, fifth of 119 on resident patents and first of 132 on new
public repositories. Anticipation reads 34.6, 74th of 134, on articles
per head and statistical performance; the per-head stocks of researchers and
research spending are conditions beside it and do not enter it (D122). The
panel reads both higher: Experimentation 40, 34th of 135, and Anticipation 42,
49th, each with an IQR of 1.

**Fix.** Per-capita is right for most indicators and wrong where capability is
concentrated in institutions rather than spread across a population. Consider a
per-capita and absolute-capacity pair for research and experimentation
indicators, reported separately.

---

## A3 — Trust's low income correlation comes from which countries the survey reaches

**Severity: high. Trust's 0.426 against log GDP per capita mixes two bases of
evidence and understates how closely each tracks income; Coordination still
tracks income through trade compliance.**

The figures in this entry are from dataset 10.0.0 unless they name the
16-country run or another release. Coordination publishes a score for 130 of
135 countries, from B-READY trade compliance efficiency (82 countries, D167),
budget execution and V-Dem's expert-coded civil-society index. Trust
publishes for 132 of 135, from five rows: B-READY dispute resolution
efficiency (82 countries, D167); bribery incidence (D123); government
compliance with the courts (V-Dem, D131); and two Joint EVS/WVS items, A165
social trust and G007_34_B trust in people met for the first time (D140),
which cover the same 72. Trust correlates with log GDP per capita at 0.426
(Spearman 0.445, n 131) and Coordination at 0.439 (Spearman 0.458, n 130),
so both are usable as
research baselines but not as clean claims of wealth-free capability. D23
retired the WGI perception composites and D44 retired homicide.

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
test was class P and every indicator that survived was class C. Trust's rows
correlate with log GDP per capita at 0.604 for the A165 social measure, 0.532
for bribery incidence, 0.466 for court compliance, 0.465 for dispute
resolution efficiency (n 82) and 0.318 for trust in strangers. The A165
measure is a watch item rather than a verdict. Dispute resolution efficiency
carries the most income: without it Trust's correlation falls from 0.426 to
0.332 (n 131). Without court compliance it falls to 0.384, but 19 countries
drop under the coverage floor (n 112). The two survey rows pull the other
way: dropping trust in strangers would raise the correlation to 0.531, and
dropping A165 to 0.500, although A165 alone tracks income more closely than
any other Trust row. The dispute resolution row replaced contract
enforcement days, which correlated at 0.160 across 123 on 9.3.0.

**The 0.426 is a mix, not a separation.** The countries without the survey
rows are poorer: a median income per head of 7,187 dollars across the 60 of
them that publish a score and have an income figure, against 25,095 across
the 71 with both rows. Inside each group Trust tracks income more closely
than across the frame: at 0.752 among the 71 with both survey rows, and at
0.517 among the 60 scored on the institutional rows alone. Scored on the
institutional rows alone in every country, Trust would correlate at 0.628
(n 130). The frame-wide figure is lower than all three because the two
groups are scored on different rows, so it is a change of evidence and not a
sign that Trust has come apart from income. Do not quote 0.426 as Trust's
distance from wealth.

Coordination's rows sit at 0.532 for trade compliance efficiency (n 82),
0.267 for V-Dem civil-society strength and 0.202 for budget execution;
without trade compliance Coordination's correlation falls to 0.305 (n 122).
Border time, the Doing Business row it replaced, correlated at 0.544 on
9.3.0. 48 of the 53 countries B-READY has not reached are scored on budget
execution and civil society alone. All three remain a partial
operational proxy rather than a direct test of cross-agency delivery.

**Fix.** These dimensions need observable, behavioural indicators that are not
WGI and that reach the countries B-READY does not. V-Dem and budget execution are useful additions for
Coordination, but they do not show whether agencies delivered the same
objective. Trust's social family is two perception items from one survey
release and no behaviour. Trust needs a recent court-throughput or case
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

Voice and accountability is retired. On dataset 10.0.0 Shared Purpose rests on
three rows, tax revenue, income inequality and EVS/WVS civic participation
(D128, read through A15), at mean confidence 0.322, under the 0.40 objective,
and it publishes a score for 131 of 135 countries. Tax revenue takes OECD
Global Revenue Statistics values for 14 countries the World Bank does not
serve (D172). Its correlation with log GDP per capita is 0.262 (n 130), the
lowest of the nine dimensions. Singapore scores 32.3, 123rd of 131, on the
two rows it has. Volunteering, national belonging and
polarization are gaps. National belonging has no usable series: its only
cross-national item, national pride, is not belonging and fails the regime
test A13 describes, so it is not wired, and the gap counts against confidence
(D151). The panel puts Singapore 18th of 135 on Shared purpose, at 58 with an
IQR of 4, and Shared purpose is where panel and indicator ranks agree least,
at 0.65.

V-Dem's polarization item brings the Singapore question back from the other
side: a regime with no organised opposition can read as calm, as the United
Arab Emirates does. It is published
beside Shared Purpose as a behavioural check and not scored. See A13 and D121.

Voter turnout, from the same pinned V-Dem file, is published beside Shared
Purpose as a behavioural check and not scored, because it reads this same
democratic channel as well as compulsory voting and managed mobilisation. See
D129.

---
## A6 — One Doing Business indicator is frozen at 2019, and B-READY reaches 74 countries

**Severity: medium.**

The discontinued Doing Business programme supplied five scored rows. Four
are now read from their B-READY successors, the third pillar of each topic,
which scores the transaction itself: business entry efficiency in Agency,
trade compliance efficiency in Coordination and dispute resolution
efficiency in Trust (D167), and utility connection efficiency in Building
(D171). B-READY publishes scores, so these rows no longer count days or
hours, and each adds something the old row did not read: cost, imports and
firms' own reports for trade, and water, internet and the reliability of
supply for utilities.

Procedures to start a business has no successor and stays at 2019, because
B-READY counts no procedures. The recency term marks it down, and D159's
15-year limit sets it aside in the 2035 release.

The cost is coverage. B-READY's 2025 round reaches 82 of the 135, and the 53
it has not reached lose a row in Agency, Coordination, Trust and Building.
Brazil is one of them, and so are Liberia and Mauritania, two of the ten
D176 added. Insolvency efficiency in Experimentation (D173) is a fifth
B-READY row on the same 82 countries. Eight scores fall under the coverage
floor: Agency for Haiti, Sudan and Malawi, Coordination for the United Arab
Emirates, Venezuela, Iran and Denmark, Trust for the United Arab Emirates and
Haiti, and Building for Venezuela (A17). Counted against the 125 of D153 on
2026-10-17, the World Bank lists 36 more frame countries, Brazil among them,
for its 2026 round. Until that round reaches the API, the rows are recent
where they exist and absent elsewhere. See A12 and A14.

---
## A7 — Learning understates Korea and Japan

**Severity: medium.**

Learning is scored on three rows: the Human Capital Index, whose last full
round is 2020; the share of firms offering formal training; and research
citation impact (D124). Enrolment, public education spending and the
vocational share of secondary enrolment are conditions beside the score (D122,
D141). None of the three scored rows observes what adults can do, so
countries with exceptional measured outcomes do not get full credit for them.

On dataset 10.0.0 Korea scores 52.4, 36th of 133, and Japan 52.6, 35th,
although their Human Capital Index rows are third and second of 131. The
other two rows pull them down: Korea reads 17.4 on firm training and 53.5 on
citation impact, and Japan 40 and 30.4, against 52.5 and 100 for Singapore,
which scores 84.2, third behind Norway (85.4) and New Zealand (84.4). The
panel lifts both: Korea to 60, 27th of 135, and Japan to 58, 30th, and it
puts Singapore first at 85.

**Fix.** A learning-outcomes series (PISA or PIAAC) would resolve most of this.
It is a gap because coverage across the country set is uneven, not because the
data does not exist.

---

## A8 — Every correlation here is a hint, not a result

**Severity: structural.**

Every correlation in `diagnostics.json` is computed on the 135 countries
loaded, and most on fewer: 133 have an income figure, and 125 have all nine
dimensions scored. Two dimension pairs sat at 0.94 on the 16-country run and
read as near-duplicates. On dataset 10.0.0 no dimension pair passes the
redundancy threshold, and the highest is Anticipation with Experimentation at
0.775 (n 134). Pairs separating is not the same as the nine being separate:
one shared factor carries 0.506 of the variance over the 125 countries with
all nine scored, well above the 0.174 chance gives at that size, and that
factor correlates 0.831 with log GDP per capita (n 125). The one-factor test
(D137) is the stronger reading. The 95% interval for that r, by Fisher's z at
n 125, runs from 0.767 to 0.878, five to six hundredths either side: enough
to say the factor tracks income strongly, and too wide to place it on one
side of the 0.8 edge of the strong band.

The redundancy and wealth-proxy findings are strong enough to act on because
they also have a mechanical explanation, not because the coefficient is large.

The 135 are nearly every country of a million people that can be measured,
so a larger set will not tighten these figures much: the frame expansion memo
puts plus or minus 0.03 on r at about 350 countries, which do not exist.

A correlation here is also a statement about which countries are in the
frame. From 8.3.0 to 9.0.0 Trust's correlation with log GDP per capita fell
from 0.606 to 0.354, below the 95% interval of 0.40 to 0.76 that 51
countries gave it, while Agency's fell from 0.579 to 0.466 and Building's rose
from 0.434 to 0.573, inside theirs. A3 shows that Trust's fall is a change in
which rows the added countries have. Never quote one of these correlations without its n and its dataset
version, and quote the interval where one is given.

---

## A9 — Coordination reads Singapore and other executive-led states low

**Severity: low. The size failure is absent from the 10.0.0 scores; one row
moves states that coordinate through the executive down by a third to a
half.**

The figures in this entry are from dataset 10.0.0.

Coordination publishes a score for 130 of 135 countries. Cuba, the United
Arab Emirates, Venezuela, Iran and Denmark sit below the coverage floor on
one row. Three rows feed it: B-READY trade compliance efficiency (82
countries, 2025, D167), budget execution fidelity (`GF.XPD.BUDG.ZS`, 122
countries, 2015 to 2024) and V-Dem civil-society strength (`v2x_cspart`, 135
countries, 2025). 74 countries are scored on all three and 56 on two.
Confidence runs from 0.100 to 0.480, mean 0.363, and the score correlates
with log GDP per capita at 0.439 (n 130).

The entry was opened for a different failure, and the rows in use do not
produce it. On the perception layer D23 retired, Uruguay scored 18.8 and Costa
Rica 33.7, because the Worldwide Governance Indicators and the Logistics
Performance Index read a small country with a small port as a weak one. On
the current rows Uruguay scores 79.3 and Costa Rica 75.0 against a frame
median of 71.3, the 12 least populous countries in the frame have a median of
76.6, and the score's correlation with log population is -0.05 (n 130).

What is left falls on a narrower set of states. With equal row weights,
civil-society strength is a third of the score where all three rows are
observed and half of it where B-READY has not reached, and it measures
whether society organises independently of the state. A state that
coordinates through its own agencies reads on that row as one that does not
coordinate:

| Country | Score | Operational rows, mean | Civil-society strength |
| --- | ---: | ---: | ---: |
| Singapore | 71.0 | 88.0 | 37.0 |
| China | 55.8 | 96.0 (budget execution only) | 15.6 |
| Rwanda | 63.8 | 77.8 | 35.9 |
| Eswatini | 69.9 | 88.0 | 33.8 |
| Laos | 57.3 | 77.6 | 16.7 |
| Tajikistan | 51.0 | 72.4 | 8.2 |
| Belarus | 45.2 | 86.8 (budget execution only) | 3.7 |
| Azerbaijan | 46.8 | 70.2 | 0.0 |
| Egypt | 53.9 | 93.1 (budget execution only) | 14.8 |
| Russia | 50.3 | 86.9 (budget execution only) | 13.7 |

The operational rows are trade compliance efficiency and budget execution.
The United Arab Emirates has civil-society strength and no operational row,
so it publishes no Coordination score. Singapore is the case the entry was
written for, a small state with whole-of-government coordination as its
organising principle, and it sits 67th of 130, below the frame median. Every
other country in the table sits lower still, at 70th or below, while scoring
70 or more on the operational rows. The row does not read autocracy alone:
El Salvador reads 36.4 on it against 68.9 on its other two rows, and Mexico
45.7 against 62.8. Part of the reading is
defensible, since D83 admits the row for the coordination a state does with
society. The part that is wrong is reading its absence as an absence of
coordination among institutions.

**The panel reads Singapore the other way.** On the 10.0.0 panel Singapore
is 9th of 135 on Coordination, at 81 with an IQR of 4.5, against 67th of 130
on the indicators. Coordination is where panel and indicator ranks agree
second least, at 0.72, and the panel reads it 16.4 points below the
indicators on average. It does not lift the executive-led states as a group:
Egypt is 100th at 43, Russia 102nd at 42, and the United Arab Emirates,
which has no indicator score, 69th at 55. The panel is one vendor and tracks
income more closely than the indicators do, so this is a second opinion and
does not correct the score.

**Fix.** Cross-agency delivery records, a declared gap, would measure the
construct directly and would let civil-society strength sit in a family of
its own beside them, the way D57 splits Trust. A multi-vendor or gateway
panel on the 10.0.0 frame would test whether the Singapore reading is the
model family's or the construct's.

---
## A10 — The frame is every measurable country of a million people, and that is not the world

**Severity: structural.**

Every country in the benchmark sets the endpoints of every indicator scale and is
measured against the result. See D47. So 0 and 100 mean "weakest and strongest of
these 135". D153 sets who the 135 are by one rule, and D176 re-applied it:
every World Bank economy of at least one million people that reaches
`MIN_INDICATORS_FOR_SCORE` observed rows in all nine dimensions. A score is a
position in this set and carries no claim about a country outside it.

The rule selects on measurability, so what it leaves out is not a random
sample. Of the 160 economies of a million people or more, 25 are outside: 12
that clear eight dimensions, among them Niger and Gabon, OAPI members with
no national IP office rows and one Experimentation row, and Saudi Arabia,
Kuwait and Bahrain, Gulf monarchies with no Gini or tax ratio for Shared
Purpose; and 13 that clear seven or fewer, such as Afghanistan, Yemen, Syria
and North Korea. The 57 economies under a million are out by the size line,
15 of which would clear all nine on the 8.3.0 count, and Taiwan is out
because the World Bank API does not carry it. Each of the 25 is missing
because a publisher does not reach it in at least one dimension, so the frame
leans toward the countries the international datasets cover. Counted in the
frame expansion memo of 2026-11, it holds 32 of the 38 economies in the
world's poorest income quartile and 32 of the 38 in the richest. On the 125
of D153, 54% of the frame is a democracy by V-Dem's Regimes of the World,
against 44% of the 158 it classifies.

The rule admits and does not expel (D176). On 10.0.0, 10 countries in the
frame publish no score in at least one dimension, because D159's age limit
and D167's move to B-READY removed rows after D153 set the frame. No country
leaves the frame for that.

Two consequences follow.

**Scores are only comparable inside one dataset version.** Adding a country moves
the endpoints it touches and restates every number. That is done as an announced
rebase with a major version bump, and 9.6.0 numbers do not compare with 10.0.0
ones. Anything quoting a score has to quote the version with it.

**Clamping happens only in history.** No observed cell clamps: on dataset
10.0.0, 0 of 3,837, because a current value cannot fall outside a frame its own
country helped build. The `outOfFrame` flag fires only where a historical value
sits outside the current frame, which is 16 of 608 momentum baskets. A trend
carrying a clamped basket member is part distance-to-the-clamp rather than
movement in the country, and every surface that prints a trend prints that
count.

---

## A11 — Building measures industrial output, and reads as delivery capacity

**Severity: medium.**

Building asks whether a country can build and deliver. Its four measured
indicators are manufacturing value added, high-technology export share,
utility connection efficiency and economic complexity. Output per worker sits
beside them as a condition (D122). All four describe industrial output. Nothing
in the measured set can see a national programme that was specified, funded and
delivered.

On dataset 10.0.0 Brazil scores 36.5, 38th of 134, at confidence 0.475. B-READY
has not yet reached Brazil, so the score rests on three of the four rows (A6). The score is a correct statement about Brazilian industrial output
and it is read as a statement about Brazilian delivery capacity, which is a
different construct. In the same decade Brazil built and ran Pix, which settled
7.98 billion transactions in July 2026, and GOV.BR, which reports 175 million
active accounts.

The two indicators that would carry the delivery construct,
`large_project_delivery` and `firm_scale_up_rate`, are both gaps.

**Fix.** Two parts, one done and one open. Documented deliveries are
recorded in `data/evidence/records.json` against the gap they bear on, outside
the score, so the cases are written down with sources and limits instead of
being argued in prose. 863 records cover 125 of the 135 countries and are
filed against 16 indicators, every one a declared gap. The ten countries
D176 added have no record yet. Brazil's 27 run from Casa da
Moeda in 1694 to the federal cash grant after the 2024 Rio Grande do Sul
floods.
See D20.
The open part is a comparable delivery series across the country set, without
which the gap cannot be promoted to an indicator.

**Watch for.** The same reading error in reverse. A country with strong
industrial output and a poor record of finishing public programmes scores well
here, and the benchmark currently has no way to say so.

---
## A12 — Coordination and Trust are scored on thin evidence

**Severity: high. Trust is partly measured and Coordination remains narrow.**

The figures in this entry are from dataset 10.0.0 unless they name another
run.

| Dimension | Observed indicators | Confidence | What is left | Publishes a score |
| --- | ---: | ---: | --- | --- |
| Coordination | 3 of 5 for 74 countries | 0.100 to 0.480, mean 0.363 | B-READY trade compliance efficiency at 2025 for 82 countries, budget execution from 2015 to 2024 and V-Dem civil-society strength at 2025 | 130 of 135 |
| Trust | 5 of 7 for 41 countries | 0.072 to 0.546, mean 0.386 | B-READY dispute resolution efficiency at 2025 for 82 countries, bribery incidence from 2014 to 2025, V-Dem court compliance at 2025, and EVS/WVS A165 and trust in strangers at 2022; court clearance and institutional trust remain gaps | 132 of 135 |
| Shared Purpose | 3 of 6 for 66 countries | 0.016 to 0.433, mean 0.322 | Tax revenue (World Bank, with an OECD fill for 14 countries), income inequality, EVS/WVS civic participation; national belonging, volunteering and polarization remain gaps | 131 of 135 |

Coordination remains a narrow operational proxy: budget alignment, border
processing and civil-society judgements do not show whether several
institutions delivered a shared national objective (A9). Coordination
publishes for 130: Cuba, the United Arab Emirates, Venezuela, Iran and
Denmark rest on civil-society strength alone, because B-READY has not reached
them and none has a budget execution value. Trust prints for 132 of 135, but
country-level confidence runs from 0.072 to 0.546, and the spread is the
survey and B-READY: the 72 countries with both EVS/WVS rows sit at 0.280 to
0.546, and the 60 scored without them at 0.121 to 0.343. Cuba, the United
Arab Emirates and Haiti are below the floor on Trust, and Cuba on both.
Shared Purpose has a third row in 66 countries; the 65 on two rows sit at
0.079 to 0.316 and print, drawn dashed with a marked axis and a confidence
band that says do not quote it alone. Four countries publish no Shared
Purpose score, each on one row: Cuba, Haiti, Papua New Guinea and Trinidad
and Tobago. That is a mitigation and not a fix.

**Trust still has a narrow family balance.** D57 splits the dimension into a
social family, which asks whether people rely on strangers, and an institutional
family, which asks whether they rely on courts, government and the civil
service. The social family has both its rows observed, A165 and trust in
strangers (D140), in the same 72 countries, so it is two perception items from
one survey release and no behaviour. The institutional family has three of
five: dispute resolution efficiency, bribery incidence and court compliance.
60 of the 132 scored countries rest on the institutional family alone. Among them
are the ten whose survey values are held because the release prints separate
EVS and WVS rows (D64): Germany, the Netherlands, the United Kingdom, Armenia,
Czechia, Romania, Russia, Serbia, Slovakia and Ukraine. Court case clearance
and institutional trust remain gaps. `familyBalance` publishes this coverage.

**The two social items disagree where "most people" means one's own circle.**
China reads 63.5% on A165, fourth of 72 after Denmark, Norway and Finland, and
13.4% on trusting a stranger, 60th. Japan (33.7%, 16th, against 10.4%, 65th),
Singapore (34.4%, 14th, against 18.0%, 51st), South Korea (32.9%, 18th,
against 17.5%, 53rd) and Malaysia (19.6%, 33rd, against 14.9%, 56th) split the
same way, and so do Belarus (40.0%, 12th, against 20.1%, 47th) and Tajikistan
(20.6%, 32nd, against 10.3%, 66th). The second row pulls their Trust scores
down: Japan to 58.7, 56th of 132, Singapore to 67.2, South Korea to 66.4,
Malaysia to 56.6 and China to 49.5, 82nd. Ethiopia goes the other way, 11.9%
on A165 and 47.8% on strangers, eighth of 72, and is the value to check first
(D140); Myanmar (15.1% against 41.3%, 11th) splits the same way. Read a high
A165 alone as a statement about a respondent's own network, and read China's
Trust score through its court compliance (4.5 of 100) as much as through
either survey row.

**Fix.** Land court throughput and case clearance, cross-agency
delivery records, institutional trust, and behavioural measures of corruption
experience. The V-Dem row is a partial Coordination repair, not a replacement
for delivery records. The generative panel can
interpret the dimensions while those data are missing, but its values stay
beside the indicator score and never become observations. The ten countries
D64 holds have no open route to a survey value: pooling their rows needs the
registered microdata download, which D154 excludes.

**What the World Bank can and cannot supply.** `GF.XPD.BUDG.ZS`, primary
government expenditure as a proportion of the original approved budget, covers
122 of 135 with a latest year between 2015 and 2024, 25 of them at 2024, and
its scored row correlates with log GDP per capita at 0.202. The value is
two-sided: both underspending and overspending can indicate weak execution, so
the registry converts it to absolute distance from 100 before scoring. The CPIA
cluster rates only countries that borrow from the World Bank's concessional
window, and on 2026-10-16 its public administration rating covered 46 of the
125 of D153 since 2010. Of the two Enterprise Survey corruption series,
`IC.FRM.CORR.ZS` asks a firm what it believes firms similar to itself pay, so it
records belief and is ineligible, while `IC.FRM.BRIB.ZS` asks whether the
responding firm was itself asked for a bribe across six public transactions. The
second covers 131 of 135, 130 of them inside D159's window and 115 of those
at 2023 or later, and D123 scores it in Trust's institutional family. Its
correlation with log GDP per capita is 0.532.
It carries the reticence risk D123 records: China reads 0.14% and Korea 0.02%
while Vietnam, surveyed by the same programme, reads 31%. Trust still needs
court data and a broader social comparison. The remaining shortlist is OECD
Government at a Glance and a harmonized court or audit source.

**B-READY replaced two of the frozen rows here.** D167 scores the third
pillar of B-READY dispute resolution in Trust and of international trade in
Coordination, for the 82 of 135 countries the 2025 round reaches. Both are
scores of time, cost and, for disputes, reliability, and they correlate with
log GDP per capita at 0.465 and 0.532. Other B-READY series track income
more closely (public services at 0.812, measured against the 125 of D153).
None publishes the court clearance
numerator and denominator the Trust gate requires, so court case clearance
stays a gap.

Government compliance with the courts (`court_compliance`, V-Dem `v2jucomp`,
D131) covers 135 of 135. It is an expert code of a public act, and it reads
regime: D131 measured r 0.88 with V-Dem's electoral democracy index on the v15
release. The row reads v16, and the pinned file does not carry the index, so
that figure is not recomputed. Two autocracies read high: Singapore, 14th of
135, plausibly because its courts seldom rule against the state, and Jordan, a
closed autocracy, 22nd. Nicaragua, Chad, Azerbaijan, Venezuela and China sit
in the bottom five, with Tajikistan, Myanmar, Belarus, Cuba, and Laos and
the United Arab Emirates (tied), next above them.

V-Dem civil-society strength is an adapter-backed Coordination row (D83),
but its expert coding keeps confidence low and does not answer cross-agency
delivery. Voter turnout, volunteering and civic participation are absent from
the catalogue under any database id, and the interpersonal and institutional
trust items were never World Bank series. The Joint EVS/WVS adapter supplies
both social rows; Trust still needs an adapter for court clearance and
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
release meets that structure with two social and three institutional rows,
but court throughput, a behavioural social row and the wealth and redundancy
review remain open.
The budget series opens the Coordination door; it does not close its measurement
problem.

---
## A13 — Polarization reads calm where there are no camps to polarize

**Severity: low. The series is published as a behavioural check and is not
scored (D121). Across the 125 closed regimes do not read calm as a group; the
failure is single autocracies among the calmest countries in the frame.**

The `political_polarization` check is V-Dem's `v2cacamps_osp`: whether
supporters of opposing political camps meet in a hostile rather than a friendly
manner, on a 0 to 4 scale. The question counts hostility and not disagreement,
which is what the registry gap asks for. It cannot tell a society where camps
meet in friendship from one where no opposition camp is allowed to exist.

The 2025 values in V-Dem v16 do not sort cleanly by regime. Grouped by V-Dem's
Regimes of the World classification (`v2x_regime`), read for the 125 of D153
and not for the ten D176 added, the 26 liberal democracies average 1.64, the 41 electoral democracies 2.60, the 41 electoral
autocracies 2.86 and the 17 closed autocracies 2.68. Across the 125 the closed
group reads calmer than the electoral autocracies and more hostile than both
groups of democracies, so the calm end of the scale is not where closed
regimes sit as a group. The closed group is also the widest, from 1.05 for
Laos to 3.99 for Myanmar. The calm reading correlates with the electoral
democracy index (`v2x_polyarchy`) at 0.37 (n = 125).

The failure is carried by single countries and not by a group. Of the 16
calmest of the 135, five are autocracies: Kyrgyzstan (0.96, 10th), Laos and
Tajikistan (1.05, 12th), the United Arab Emirates (1.07, 14th) and Uzbekistan
(1.09, 16th), beside Ireland at 0.41, Norway at 0.62, Japan at 0.86 and
Denmark at 0.93. Jordan, a closed autocracy, reads 1.43, and Cuba 1.75, near
the liberal democracy mean. Rwanda reads 2.67 and Singapore 1.83, both
electoral autocracies and neither calm. The same release codes Rwanda 0.96 and
Singapore 1.27 for 2024, so a single year moved Rwanda by 1.7 points with no
change in its regime class. A latest-year expert code of this item can swing
that far, and a reader comparing two countries on it is partly comparing
coding years.

Scored as a third Shared Purpose row against the 8.1.0 frame, it would raise
the United Arab Emirates by 11.1 points, Singapore by 7.7 and China by 4.8, and
let Haiti publish a Shared Purpose score for the first time, at 35.9, on one
World Bank row and this one. Rwanda would fall 4.2 and Vietnam 3.3. The largest
gains go to calm democracies, Panama by 18.0, Paraguay by 13.3 and Japan by
11.8, which is the reading the item is meant to give. The United Arab Emirates
gain is A5 inverted: A5 retired a perception composite that penalised
political uniformity, and this item rewards it. Political uniformity is not a
capability, and low measured hostility under repression is not shared purpose.

The numeric gates do not catch it. On dataset 10.0.0 the value passes the
wealth screen at 0.221 against log GDP per capita and the redundancy screen
at 0.457 at most (interpersonal trust, n = 72). On the 8.1.0 frame, adding it
would have raised Shared Purpose's own correlation with income from 0.202
(n = 50) to 0.406 (n = 51, with Haiti). The decision stands on construct and
not on correlation.

**What is published.** The value sits on every country page under Shared
Purpose as a check, not scored, with this reason attached, and the capability
page lists it. `behaviouralChecks` in `diagnostics.json` reports its
correlation on the published value as -0.221 against log GDP per capita
across the 135 and -0.082 against the Shared Purpose score (n = 131). No
Shared Purpose score, confidence or coverage count moves.

**What remains.** A reader can still take a low value for a closed regime as a
finding; the attached reason is the only mitigation. The fix that would let it
score is a reading conditioned on competition existing at all, or a behavioural
row (civic participation, volunteering, voter turnout) that agrees with the
item outside the closed regimes. Neither is wired, and the gap stays open.

---
## A14 — Agency rests on registration rules where business counts are missing

**Severity: medium.**

The figures in this entry are from dataset 10.0.0.

Agency is scored on four rows: new business density, perceived control over
life (D127), B-READY business entry efficiency (D167), and the number of
procedures to start a business. The last comes from Doing Business and
stopped in 2019 (A6). Business entry efficiency is a 2025 score of the time
and cost to register a firm, and it reaches 82 of the 135. Internet users,
account ownership and private credit sit beside the score as conditions
(D122). So two of the four scored rows read registration rules, one of them
from 2019, and the one current row that is not about registering a business
is a perception (A15).

Where new business density is missing, Agency rests on those rules and
perceived control. The United States scores 73.6 on business entry
efficiency, procedures and perceived control, at confidence 0.443.
Nicaragua (79.9), Lebanon (31.6) and Venezuela (39.1) have no B-READY value
and score on the 2019 procedure count and perceived control alone, at
confidence 0.255. Cameroon (62.4) has neither new business density nor
perceived control, so it scores on business entry efficiency and the 2019
procedure count, two registration rules and nothing else, at confidence
0.301. Sudan, Haiti and Malawi have only the procedure count, so they
publish no Agency score: Sudan has neither new business density nor
perceived control, and the business density of Haiti and Malawi is from 2010
and 2009, older than D159 lets a value count.

The procedure count is inside D159's 15 years until the 2035 release, so the
rule does not touch it yet. For Liberia and Mauritania, which B-READY has not
reached, it is one of the two rows that carry Agency.

Read Agency through its confidence. The fix is a behavioural row that observes
people acting, which the O1 triage sweep did not find with frame coverage.

---

## A15 — Two survey rows read regime and question format

**Severity: medium. Both rows are scored (D127, D128). On the 135 neither
row's income correlation is a finding: perceived control has none, and civic
participation's negative one carries the question format.**

The figures in this entry are from dataset 10.0.0 unless they name another
run. None of the ten countries D176 added is in the survey release, so both
rows still cover the same 72.

`perceived_control` (Agency, A173) is a perception, and a closed or electoral
autocracy can read high on it. Vietnam reads 8.1 out of 10, third of 72 with
Colombia, and Nicaragua 8.0, fifth, surveyed in 2019-20 after the 2018
crackdown; Venezuela reads 7.7, ninth. Response style on a 10-point scale
moves the ordering too: Mexico, Uruguay and Colombia sit at 8.1 to 8.2 and
Japan, on a mail survey, at 6.0, tied 70th with Greece. The row correlates
with log GDP per capita at -0.006 (n 71), so what it adds to Agency is
unrelated to income and partly a reading of regime and response style.

`civic_participation` (Shared purpose, A080_01) harmonises two questions. EVS
shows a list and asks which organisations the respondent belongs to; WVS reads
each type aloud and counts active and inactive members. The published values
do not name the programme behind a single-row country, so the format split is
quoted from dataset 8.0.0, where the eight EVS countries in the frame averaged
9.9% and the 29 WVS countries 19.4%, and the row tracked income at 0.83 inside
the EVS group. Among the ten countries the release surveyed under both
programmes, WVS reads higher in eight, by a median 1.9 points; all ten are
in the frame, and D64 holds their survey values out of the score. On 10.0.0
Azerbaijan (0.5%) and Estonia (1.5%,
EVS) are the floor and Kenya (38.4%) and Indonesia (37.9%, both WVS) the top,
and across the 72 the row runs against income at -0.271 (n 71).

**What is published.** Both values, with the programme's question, the survey
year and the valid-answer base in each observation's note. The release stamps
every value 2022, though fieldwork ran from 2017 to 2023.

**What remains.** Neither row is adjusted. A reader can take Vietnam's
perceived control or the income correlation of either row as a
finding; read them through this entry first. A behavioural row with frame
coverage is the fix. A format term needs pooled respondent-level microdata,
which sits behind a registration the open-data rule excludes (D154), so none
is in view.

---

## A16 — Adaptability reads low unemployment unchecked in 18 countries

**Severity: low.**

The figures in this entry are from dataset 10.0.0.

Adaptability scores four rows: the unemployment rate, the long-term
unemployment share (D120), export concentration (D119) and new export
products (D149). 17 countries have no long-term share. ILOSTAT publishes none
for India, China, Haiti, Uzbekistan, Guinea, Tajikistan, Papua New Guinea, the
Republic of the Congo, Trinidad and Tobago, the Central African Republic and
Mauritania, and the plausibility gate holds every year it publishes for South
Korea, Mexico, Peru, the Philippines, El Salvador and Uruguay. Cuba joins
them: its only share is from 2010, which D159 sets aside, and it reads 55.8
(85th) on a 1.7% unemployment rate (9th lowest) and new export products
ranked 131st. Those 18 are scored on the other three rows, so the
unemployment rate is a third of each score with nothing beside it that tells
a fluid labour market from one where nobody can afford to stay unemployed.

| Country | Adaptability | Unemployment rate | New export products | Informal employment |
| --- | ---: | ---: | ---: | ---: |
| India | 82.9, 4th | 4.2%, 54th | 6.6%, 9th | 87.2% (2025) |
| Uzbekistan | 82.4, 5th | 4.6%, 58th | 9.0%, 1st | no value |
| China | 80.2, 9th | 4.6%, 57th | 5.7%, 20th | no value |
| South Korea | 73.1, 31st | 2.7%, 20th | 4.5%, 32nd | 29.1% (2019) |
| Philippines | 71.4, 40th | 2.2%, 13th | 5.2%, 22nd | no value |
| Mexico | 65.7, 55th | 2.7%, 18th | 1.7%, 87th | 56.9% (2025) |
| El Salvador | 64.1, 62nd | 3.3%, 37th | 1.5%, 93rd | 63.6% (2025) |
| Trinidad and Tobago | 56.5, 81st | 3.3%, 40th | 1.2%, 102nd | no value |
| Tajikistan | 56.0, 84th | 6.9%, 97th | 2.2%, 79th | 63.6% (2016) |
| Cuba | 55.8, 85th | 1.7%, 9th | 0.3%, 131st | no value |
| Peru | 53.3, 92nd | 5.1%, 72nd | 1.2%, 101st | 70.5% (2025) |
| Papua New Guinea | 52.2, 99th | 2.6%, 16th | 0.5%, 127th | no value |
| Uruguay | 47.8, 105th | 7.5%, 100th | 1.1%, 108th | 32.7% (2025) |
| Central African Republic | 43.5, 116th | 6.3%, 88th | 0.4%, 129th | no value |
| Guinea | 39.1, 120th | 5.2%, 73rd | 1.0%, 112th | no value |
| Mauritania | 38.1, 121st | 10.3%, 115th | 1.3%, 97th | 89.3% (2019) |
| Haiti | 27.2, 129th | 14.9%, 126th | 0.7%, 121st | 91.6% (2012) |
| Republic of the Congo | 12.5, 135th | 19.9%, 132nd | 0.6%, 124th | no value |

Ranks are of 135: lowest unemployment first, most new products first.
Informal employment is a condition beside the score (D150) and is not ranked
here. On dataset 10.0.0 all 18 carry Adaptability confidence 0.459; the
other 117 run from 0.478 to 0.617, mean 0.596.

**What is wrong.** In India, Mexico, El Salvador, Tajikistan and Peru most
work is informal, and a person who loses a job there takes any work within
weeks, so the unemployment rate reads low because unemployment cannot be
afforded. On four rows that low rate is checked by the long-term share:
Ethiopia (3.3%), Nigeria (3.1%) and Burundi (0.9%) carry long-term shares of
53.9%, 52.5% and 95.5% and rank 94th, 110th and 123rd. For the 18, the check
is the new export products row, which observes reallocation rather than
slack, and the informality figure printed beside the score, which a reader
has to put together with the rate. India's fourth place rests on a low rate and
a high entry rate; its informal share is 87%, so the low rate is the weaker
half of that reading. Uzbekistan's fifth rests on the highest entry rate in
the frame and a rate in the middle of it. China, Uzbekistan, the Philippines,
Trinidad and Tobago, Papua New Guinea, the Central African Republic, Guinea,
Cuba and the Republic of the Congo have no informality value either.

**Fix.** A long-term share for the 18: a labour force survey that records
the length of a search, passed through the same gate. ILOSTAT's duration
tables give the same questionnaire signature at every band for six of the
gate-held countries (see the A16 fixes memo), so for them this waits on a
survey change. The two declared gaps would add rows for every country, but
neither has a source.

## A17 — Venezuela's Building has no manufacturing row

**Severity: low.**

The figures in this entry are from dataset 10.0.0.

The World Bank publishes Venezuela's manufacturing value added
(`NV.IND.MANF.ZS`) as exactly 0% of GDP for every year from 1991 to 2011,
its last year. The ingest drops those zeros as placeholders (D157), and the
one value before them, 14.2% in 1990, is more than 15 years old and does not
count (D159). So the row a reader would most expect to describe a
petro-state's industrial base is empty. B-READY has not reached Venezuela,
so the utility connection row is empty too (A6), and Building rests on
economic fitness alone, at confidence 0.159. One row is under the coverage
floor, and Venezuela publishes no Building score.

Nothing in the frame's sources says what Venezuela's manufacturing share is
today. The confidence still publishes, and its coverage part says how much is
missing.

**Fix.** A national or regional source for Venezuela's manufacturing value
added, published and comparable with the World Bank series.
