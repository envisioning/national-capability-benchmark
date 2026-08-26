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

Four of the six largest panel-versus-indicator disagreements in the whole model
are in this one dimension:

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
28 points each.

**Fix.** A learning-outcomes series (PISA or PIAAC) would resolve most of this.
It is a gap because coverage across these ten countries is uneven, not because
the data does not exist.

---

## A8 — Ten countries give eight degrees of freedom

**Severity: structural.**

Every correlation in `diagnostics.json` is computed on n = 10. A correlation of
0.9 on ten points is a hint, not a result. The redundancy and wealth-proxy
findings above are strong enough to act on because they also have a mechanical
explanation, not because the coefficient is large.

Do not report any of these correlations as established until the country set is
substantially larger.
