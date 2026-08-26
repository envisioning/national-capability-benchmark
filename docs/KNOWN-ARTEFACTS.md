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

**Severity: high. Do not publish this dimension as it stands.**

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

**Fix.** Wire GEM early-stage entrepreneurial activity and a venture-capital
series. Until then, treat Experimentation as unmeasured.

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

## A3 — Coordination and Trust are not separable from GDP per capita

**Severity: high. This is the strongest single finding of the prototype.**

Every measured indicator in both dimensions correlates with log GDP per capita at
|r| ≥ 0.7. Strip those indicators and both dimensions cannot be scored at all —
`diagnostics.gdpStrippedTest.dimensionsEmptied` lists them.

Both dimensions lean on the Worldwide Governance Indicators, which are expert and
firm perception composites that track income closely by construction.

**Fix.** These dimensions need observable, behavioural indicators that are not
WGI. Court throughput and border-compliance time are a start and are already in.
Civil society strength (V-Dem) and cross-agency delivery records are the missing
pieces.

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
