# Known artefacts

Places where the v0 model produces a number that is wrong about the world rather
than informative about it. These are not bugs in the code: the pipeline is doing
what it was told. They are failures of measurement, and anyone building on this
needs to know them before quoting a score.

Evidence for each is either a diagnostic in `data/out/diagnostics.json` or the
in-session panel run in `data/delphi/in-session-round1.json`, which scored all
ninety cells against the same evidence briefs.

---

## A1 — Experimentation is not measured, it is inferred from patents

**Severity: was high, now medium. Partly fixed on 2026-08-26.**

**What changed.** GEM early-stage entrepreneurial activity and fear of failure
are wired, so four of eight indicators are observed and the dimension no longer
rests on patents alone. Confidence rose from 0.178 to 0.394, correlation with
log GDP per capita fell from 0.624 to 0.568, Korea's 100 became 75, and the mean
distance between the panel and the indicators fell from 27.1 to 18.3 points.
Venture capital, regulatory sandboxes, university spinouts and business R&D
share are still gaps, and the numbers below describe the state before the fix.
See D21.

Six of eight Experimentation indicators are gaps. The score is carried by
resident patents and resident trademarks per head, which measure formalised,
completed, defensible invention — close to the opposite of the many-cheap-
experiments construct the dimension is supposed to capture.

Confirmed again when six Latin American countries were added: Experimentation
was the single largest panel-versus-indicator departure for five of the six.
Across all sixteen countries it is the worst-measured dimension by a distance.

Four of the six largest disagreements in the original ten are in this one
dimension:

| Country | Indicators | Panel | Gap |
| --- | ---: | ---: | ---: |
| Netherlands | 9.2 | 65 | +56 |
| Estonia | 19.9 | 70 | +50 |
| United States | 47.5 | 95 | +47 |
| India | 0.0 | 40 | +40 |
| South Korea | 100.0 | 70 | −30 |

Korea's 100 is a filing artefact: Korean firms file defensively and at volume.
The Netherlands' 9.2 is not a finding about Dutch innovation, it is the absence
of GEM and venture-capital data.

The Latin American additions make the same point with new cases. Uruguay scores
10.3, having legalised and regulated a national cannabis market and run a fintech
sandbox. Argentina scores 11.2, having produced more technology firms of scale
per head than anywhere else in the region.

**Fix.** GEM is wired. A venture capital series is still missing: the only
inspectable aggregate, the OECD SME and Entrepreneurship Financing scoreboard,
covers 6 of the 16 countries and omits Brazil, India, South Africa and
Singapore. Business R&D share is the next best candidate, from UNESCO or OECD
research and development statistics.

---

## A2 — Per-capita normalisation flattens India

**Severity: high.**

India scores 1.1 on Anticipation and 0.0 on Experimentation. Both come from
dividing absolute counts by 1.4 billion people, then min-maxing against
Switzerland and Korea. The arithmetic is correct and the result is not
informative: it says India is not Switzerland per head, which was never the
question.

The panel put India at 25 and 40 on those two dimensions.

**Fix.** Per-capita is right for most indicators and wrong where capability is
concentrated in institutions rather than spread across a population. Consider a
per-capita and absolute-capacity pair for research and experimentation
indicators, reported separately.

---

## A3 — Coordination and Trust are mostly measured by perception of wealth

**Severity: high. This is the strongest single finding of the prototype.**

*Rewritten 2026-08-26 against the sixteen-country diagnostics. The original text
said both dimensions empty out entirely under the GDP-stripped test. That was
true of the ten-country run and it is no longer true.*

Both dimensions correlate with log GDP per capita at the dimension level:
Coordination 0.90, Trust 0.88, on sixteen countries. Both lean on the Worldwide
Governance Indicators, which are expert and firm perception composites that track
income closely by construction.

Drop every indicator correlating with log GDP per capita at |r| ≥ 0.7 and each
dimension keeps exactly one indicator:

| Dimension | Indicator | r with log GDP | Class | Survives |
| --- | --- | ---: | --- | --- |
| Coordination | Regulatory quality | +0.92 | P | no |
| Coordination | Government effectiveness | +0.91 | P | no |
| Coordination | Logistics performance | +0.72 | P | no |
| Coordination | Time to export | +0.68 | C | yes |
| Trust | Control of corruption | +0.85 | P | no |
| Trust | Rule of law | +0.83 | P | no |
| Trust | Contract enforcement days | +0.61 | C | yes |

`dimensionsEmptied` is now empty, and that is a weaker result than it looks. Each
dimension survives on a single Doing Business indicator frozen at 2019. The
scores move by 23.9 points in Coordination and 17.9 points in Trust when the
perception indicators come out, which means the surviving indicator says
something quite different from the three it replaces.

The pattern to read is the class column. Every indicator that fails the test is
class P and every indicator that survives is class C. The wealth correlation in
these two dimensions is carried by perception measures, and the two behavioural
measures we have are both weaker proxies for income.

**Fix.** Unchanged in substance. These dimensions need observable, behavioural
indicators that are not WGI and not frozen at 2019. Court throughput and
border-compliance time are the start and they are carrying too much alone.
Civil society strength (V-Dem) and cross-agency delivery records are the missing
pieces. See also A9, which is the same problem seen from a small competent
state, and D20, where documented cross-agency delivery is being collected as
evidence.

**Overturned by.** Behavioural indicators that hold their own correlation with
income below 0.7 and cover the reference set. Until then, treat a high
Coordination or Trust score as partly a statement about income per head.

---

## A4 — The four WGI series are one measurement wearing four names

**Severity: medium.**

Government effectiveness, regulatory quality, rule of law and control of
corruption correlate with each other between 0.93 and 0.98 across the ten
countries. They are spread across Coordination, Trust and Shared Purpose, so a
single underlying perception measure is being counted three times in three
different dimensions.

**Fix.** Pick one WGI series per dimension at most, or collapse all four into a
single institutional-quality indicator and let the dimensions differ on
everything else.

---

## A5 — Voice and accountability is answering a different question in Shared Purpose

**Severity: medium.**

`GOV_WGI_VA.EST` measures the democratic channel for participation. Shared Purpose
asks whether people can see themselves in a common project. Singapore scores 20.9
while being one of the most effective collective actors in the set. The panel put
it at 55, splitting the difference between very high collective-action capacity
and genuinely limited pluralism.

The spec is explicit that political uniformity is not a capability, so the fix is
not simply to raise Singapore.

**Fix.** Shared Purpose needs behavioural indicators — civic participation,
volunteering — not a democracy proxy. All are currently gaps.

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
enrolment and weak outcomes score well; countries with exceptional measured
outcomes do not get credit for them.

The panel moved Brazil down 13 points and Korea, Estonia and Singapore up 20 to
28 points each. Adding Latin America made the direction unmistakable: Peru fell
19 points and Mexico 17, both countries where enrolment rose fast and measured
outcomes did not follow.

**Fix.** A learning-outcomes series (PISA or PIAAC) would resolve most of this.
It is a gap because coverage across these ten countries is uneven, not because
the data does not exist.

---

## A8 — The country set is small, so every correlation is a hint

**Severity: structural.**

Every correlation in `diagnostics.json` is computed on the countries currently
loaded, which is sixteen. That is better than the original ten and still small. A correlation of
0.9 on sixteen points is a hint rather than a result. The redundancy and wealth-proxy
findings above are strong enough to act on because they also have a mechanical
explanation, not because the coefficient is large.

Do not report any of these correlations as established until the country set is
substantially larger.

---

## A9 — Coordination reads far too low for small, competent states

**Severity: medium. Found when Latin America was added.**

Uruguay scores 18.8 on Coordination. In the same decade it delivered Plan
Ceibal, a national digital government stack, and the first nationally regulated
cannabis market in the world, each of which required several institutions to
move together and hold position for years.

The dimension leans on the Worldwide Governance Indicators and the Logistics
Performance Index. Both are surveys weighted toward how a country looks to
international business, and a small country with a small port does not look like
much through that lens whatever its state can actually organise.

Costa Rica shows the same pattern more mildly at 33.7, against a national choice
in 1949 to abolish the army and redirect the money into health and education
that has now held for three generations.

**Fix.** The same fix as A3. Coordination needs observable evidence of
institutions acting together, not perception surveys of business conditions.
Delivery records for cross-agency national programmes would be the direct
measure, and they are a declared gap.

---

## A10 — The reference frame is ten countries wide, and they are not the world

**Severity: structural. Introduced deliberately by D16.**

Pinning the normalization frame to the ten reference countries is what makes the
benchmark extensible: adding the six Latin American countries moved zero of the
ninety existing cells. The cost is that 0 and 100 mean "weakest and strongest of
those particular ten", and those ten were picked to expose contrasts, not to
sample the world.

Watch the `outOfFrame` flag. A country genuinely outside the reference range
clamps, and clamping loses information. Colombia already sits near the floor on
Trust and Coordination. If clamping becomes common, the frame is too narrow for
the countries being asked about, and the answer is a deliberate, versioned
rebase rather than quietly widening the scale.

---

## A11 — Building measures industrial output, and reads as delivery capacity

**Severity: medium. Found while building the Brazil view.**

Building asks whether a country can build and deliver. Its six measured
indicators are manufacturing value added, high-technology export share, labour
productivity, logistics infrastructure, electricity connection speed and
economic complexity. All six describe industrial output. Nothing in the measured
set can see a national programme that was specified, funded and delivered.

Brazil scores 11.5 with confidence 0.643, the highest confidence of its nine
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
being argued in prose. Six records cover Brazil, Estonia, India and Uruguay. See
D20. The open part is a comparable delivery series across the reference set,
without which the gap cannot be promoted to an indicator.

**Watch for.** The same reading error in reverse. A country with strong
industrial output and a poor record of finishing public programmes scores well
here, and the benchmark currently has no way to say so.
