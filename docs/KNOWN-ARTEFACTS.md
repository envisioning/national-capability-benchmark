# Known artefacts

Places where the v0 model produces a number that is wrong about the world rather
than informative about it. These are not bugs in the code: the pipeline is doing
what it was told. They are failures of measurement, and anyone building on this
needs to know them before quoting a score.

Evidence for each is either a diagnostic in `data/out/diagnostics.json` or the
in-session panel run in `data/delphi/in-session-round1.json`, which scored 144 of
the 360 country-dimension cells against the same evidence briefs.

Numbers here are from dataset 3.0.0 unless a figure names the run it comes from.
Where a figure predates the current frame it says so, because the scale it was
measured on is not the scale in use.

---
## A1 — Experimentation is not measured, it is inferred from patents

**Severity: medium.**

Four of eight indicators are observed. GEM early-stage entrepreneurial activity
and fear of failure carry half the dimension, so it no longer rests on patents
alone. Venture capital, regulatory sandboxes, university spinouts and business
R&D share are still gaps. Mean confidence is 0.252, the second lowest of the nine
dimensions, and the GEM series covers only the first 16 countries, so 24 of 40
are scored on patents and trademarks alone. See D21.

Resident patents and resident trademarks per head measure formalised, completed,
defensible invention, which is close to the opposite of the many-cheap-
experiments construct the dimension is supposed to capture.

The panel and the indicators disagree here more than anywhere else in the model.
The four largest departures across the 16 countries the panel covers:

| Country | Indicators | Panel | Gap |
| --- | ---: | ---: | ---: |
| Estonia | 29.9 | 70 | +40.1 |
| Netherlands | 25.7 | 65 | +39.3 |
| United States | 55.8 | 95 | +39.2 |
| India | 9.5 | 40 | +30.5 |

The Netherlands' 25.7 is not a finding about Dutch innovation. It is the absence
of venture-capital data. Uruguay scores 34.2, having legalised and regulated a
national cannabis market and run a fintech sandbox. Argentina scores 21.3, having
produced more technology firms of scale per head than anywhere else in the
region.

**Fix.** A venture capital series is still missing. The only inspectable
aggregate, the OECD SME and Entrepreneurship Financing scoreboard, covers 6 of
the 16 original countries and omits Brazil, India, South Africa and Singapore.
Business R&D share is the next best candidate, from UNESCO or OECD research and
development statistics. Extending GEM coverage to the other 24 countries is the
cheaper half.

---

## A2 — Per-capita normalisation flattens India

**Severity: medium.**

India scores 9.5 on Experimentation and 20.8 on Anticipation. Both come from
dividing absolute counts by 1.4 billion people. The arithmetic is correct and the
result is not informative on Experimentation: it says India files few patents per
head, which was never the question. The panel put India at 40 there, a gap of
30.5 points, and at 25 on Anticipation, which the indicators now match within
4.2.

**Fix.** Per-capita is right for most indicators and wrong where capability is
concentrated in institutions rather than spread across a population. Consider a
per-capita and absolute-capacity pair for research and experimentation
indicators, reported separately.

---

## A3 — Coordination and Trust are mostly measured by perception of wealth

**Severity: high. This is the strongest single finding of the prototype.**

Neither dimension publishes a score for any country. D23 retired every perception
indicator named below, D44 retired the homicide rate, and D45's coverage floor
then stopped both dimensions printing a number on what was left. The finding
below is why.

Both dimensions leaned on the Worldwide Governance Indicators, which are expert
and firm perception composites that track income closely by construction. On the
16-country run, with those indicators in place, Coordination correlated with log
GDP per capita at 0.90 and Trust at 0.88.

Drop every indicator correlating with log GDP per capita at |r| ≥ 0.7 and each
dimension kept exactly one indicator:

| Dimension | Indicator | r with log GDP | Class | Survives |
| --- | --- | ---: | --- | --- |
| Coordination | Regulatory quality | +0.92 | P | no |
| Coordination | Government effectiveness | +0.91 | P | no |
| Coordination | Logistics performance | +0.72 | P | no |
| Coordination | Time to export | +0.68 | C | yes |
| Trust | Control of corruption | +0.85 | P | no |
| Trust | Rule of law | +0.83 | P | no |
| Trust | Contract enforcement days | +0.61 | C | yes |

The pattern to read is the class column. Every indicator that fails the test is
class P and every indicator that survives is class C. The wealth correlation in
these two dimensions is carried by perception measures, and the two behavioural
measures available are both weaker proxies for income, each frozen at 2019.

**Fix.** These dimensions need observable, behavioural indicators that are not
WGI and not frozen at 2019. Court throughput and border-compliance time are the
start. Civil society strength (V-Dem) and cross-agency delivery records are the
missing pieces. See also A9, which is the same problem seen from a small
competent state, and D20, where documented cross-agency delivery is being
collected as evidence.

**Overturned by.** Behavioural indicators that hold their own correlation with
income below 0.7 and cover the country set. Until then, treat any future
Coordination or Trust score as partly a statement about income per head.

---

## A4 — The four WGI series are one measurement wearing four names

**Severity: closed. None of the four are scored. See D23.**

Government effectiveness, regulatory quality, rule of law and control of
corruption correlate with each other between 0.93 and 0.98 across the ten
countries. They are spread across Coordination, Trust and Shared Purpose, so a
single underlying perception measure is being counted three times in three
different dimensions.

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
confidence 0.236, and it publishes a score for 37 of 40 countries. Its
correlation with log GDP per capita is 0.46, the lowest of the seven dimensions
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
It is listed because the replacement (B-READY) is not in the API yet and someone
will eventually need to migrate these five.

---
## A7 — Learning overstates Brazil and understates Korea, Estonia and Singapore

**Severity: medium.**

The Learning dimension leans on enrolment and expenditure, which are inputs, plus
the Human Capital Index, whose last full round is 2020. Countries with high
enrolment and weak outcomes score well. Countries with exceptional measured
outcomes do not get credit for them.

Against the panel, Singapore is 27.1 points low, Korea 26.2 and Estonia 23.9.
The error runs the other way where enrolment rose fast and measured outcomes did
not follow: Peru is 21.5 points high, Mexico 19.1, Colombia 15.0 and Brazil 10.7.

**Fix.** A learning-outcomes series (PISA or PIAAC) would resolve most of this.
It is a gap because coverage across the country set is uneven, not because the
data does not exist.

---

## A8 — Every correlation here is a hint, not a result

**Severity: structural.**

Every correlation in `diagnostics.json` is computed on the 40 countries loaded.
Forty points is enough to reverse a finding and not enough to establish one. Two
dimension pairs sat at 0.94 on the 16-country run and read as near-duplicates.
At 40 no dimension pair passes the redundancy threshold at all, and the highest
is Anticipation with Learning at 0.79. The nine dimensions separate when the
sample is wide enough to separate them.

The redundancy and wealth-proxy findings are strong enough to act on because
they also have a mechanical explanation, not because the coefficient is large.

Do not report any of these correlations as established until the country set is
substantially larger, and never quote one without its n.

---

## A9 — Coordination reads far too low for small, competent states

**Severity: medium. No score carries it today, and it will return with the first
replacement indicator.**

Coordination publishes no score, so the artefact is currently latent. It is kept
because the measurement error that produced it is a property of the indicator
type, not of the run.

On the perception layer D23 retired, Uruguay scored 18.8 on Coordination. In the
same decade it delivered Plan Ceibal, a national digital government stack, and
the first nationally regulated cannabis market in the world, each of which
required several institutions to move together and hold position for years. Costa
Rica showed the same pattern more mildly at 33.7, against a national choice in
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
## A10 — The frame is 40 countries wide, and they are not the world

**Severity: structural.**

Every country in the benchmark sets the endpoints of every indicator scale and is
measured against the result. See D47. So 0 and 100 mean "weakest and strongest of
these 40", and the 40 were picked to expose contrasts, not to sample the world. A
score is a position in this set and carries no claim about a country outside it.

Two consequences follow.

**Scores are only comparable inside one dataset version.** Adding a country moves
the endpoints it touches and restates every number. That is done as an announced
rebase with a major version bump, and 2.0.0 numbers do not compare with 3.0.0
ones. Anything quoting a score has to quote the version with it.

**Clamping has moved to history.** No observed cell clamps: 0 of 1,263, because a
current value cannot fall outside a frame its own country helped build. The
`outOfFrame` flag now fires only where a historical value sits outside the
current frame, which is 53 of 485 momentum baskets. A trend carrying a clamped
basket member is part distance-to-the-clamp rather than movement in the country,
and every surface that prints a trend prints that count.

---

## A11 — Building measures industrial output, and reads as delivery capacity

**Severity: medium.**

Building asks whether a country can build and deliver. Its six measured
indicators are manufacturing value added, high-technology export share, labour
productivity, logistics infrastructure, electricity connection speed and
economic complexity. All six describe industrial output. Nothing in the measured
set can see a national programme that was specified, funded and delivered.

Brazil scores 15.1 at confidence 0.544, one of the better evidenced of its nine
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
being argued in prose. Fifteen records cover Brazil, Estonia, India and Uruguay,
and they bear on three different gaps rather than one. Brazil's 11 run from
Embrapa in 1973 to Pix in 2020. See D20. The open part is a comparable delivery
series across the country set, without which the gap cannot be promoted to an
indicator.

**Watch for.** The same reading error in reverse. A country with strong
industrial output and a poor record of finishing public programmes scores well
here, and the benchmark currently has no way to say so.

---
## A12 — Three dimensions are now scored on almost nothing

**Severity: high. Created deliberately by D23.**

Retiring the perception layer removed the only indicators three dimensions had.

| Dimension | Observed indicators | Confidence | What is left | Publishes a score |
| --- | ---: | ---: | --- | --- |
| Coordination | 1 of 7 | 0.079 | Time to export, frozen at 2019 | no |
| Trust | 1 of 7 | 0.079 | Contract enforcement days, frozen at 2019 | no |
| Shared Purpose | 2 of 7 | 0.236 | Tax revenue, income inequality | 37 of 40 |

Coordination and Trust print nothing under D45's coverage floor. Their indicator
rows, confidence and trend still publish, so the evidence is visible and the
number that would misread it is not. Shared Purpose sits one indicator above the
floor and prints, drawn dashed with a marked axis and a confidence band that says
do not quote it alone. That is a mitigation and not a fix.

**Fix.** Land observable replacements: court throughput and case clearance,
budget execution rates, cross-agency delivery records, voter turnout,
volunteering, civic participation. Until at least two land per dimension, treat
Coordination, Trust and Shared Purpose as unmeasured, and consider whether a
dimension below a coverage floor should print a score at all.

**The World Bank API cannot supply that fix.** Twenty-five candidate series were
probed against the ten countries of the original prototype set. The result, per
dimension:

- **Coordination: nothing.** `IQ.SPI.PIL2/PIL4`, `IC.IMP.CSBC`,
  `IC.EXP.CSBC.CD` and `GF.XPD.BUDG.ZS` return no data. `IQ.CPA.PUBS.XQ` covers
  1 of 10, IDA borrowers only. `SL.TLF.CACT.ZS` covers 10 of 10 and correlates
  with log GDP at 0.88, so it is a wealth proxy. `IQ.SPI.OVRL` is already wired
  to Anticipation.
- **Trust: one candidate, and it was rejected.** `IC.FRM.CORR.ZS` covers 10 of
  10 across 2020 to 2025, is behavioural and correlates with log GDP at 0.667,
  under the line. It was wired and scored. It lifted Trust confidence for 34 of
  40 countries from very thin to thin, and it moved Trust's own GDP correlation
  from 0.385 to 0.619. Reverted, with 0 of 360 published cells changed. Its
  siblings are not independent evidence either: `IC.FRM.BRIB.ZS` correlates with
  it at 0.87 across those ten, and `IC.TAX.GIFT.ZS` is degenerate, with
  three zeroes and the United States scoring worse than Chile.
- **Shared Purpose: one untaken candidate.** `SG.GEN.PARL.ZS`, women in the
  national parliament, covers 10 of 10 at 2025, spreads 13.8 to 44.9 and
  correlates at 0.33. Its statistics are the best on the board and whether
  representational breadth belongs in this dimension is unsettled.
  `SL.EMP.VULN.ZS` is rejected: every value is an ILO modelled estimate, which
  is imputation entering a model whose invariant forbids it.

So the fix needs the project's second source adapter. The shortlist is ILOSTAT,
IDEA voter turnout, and OECD government-at-a-glance for budget execution and
court clearance. `ingest: 'manual'` already exists for anything with no API.

The one indicator added to fix the contamination was the contamination.
`wealthAttribution` in the diagnostics shows `homicide_rate` alone raising
Trust's wealth correlation by 0.288, from 0.096 to 0.385, the largest single
wealth contribution in the model. D42 records the diagnostic and D44 the
retirement.

This artefact closes when two observable indicators land per dimension, and not
before. Removal silenced the misleading number. It did not measure anything.
