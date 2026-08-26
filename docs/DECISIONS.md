# Decision record

Principle 8 of the spec says record all assumptions so the model can later be
challenged and revised. This file is that record.

Each decision states what we chose, why, what it costs us, and **what evidence
would overturn it**. A decision with no overturning condition is a belief, not a
decision, and does not belong here.

Append new decisions. Do not edit a decision in place: supersede it with a new
one and mark the old as superseded, so the reasoning stays auditable.

---

## D1 — Nine dimensions, no headline ranking

**Choice.** Report nine 0–100 dimension scores. Never compute a composite.

**Why.** A composite collapses exactly the information the benchmark exists to
produce. Two countries with the same average can have opposite shapes, and the
shape is the finding.

**Cost.** Harder to communicate. There is no number to put in a headline.

**Overturned by.** Evidence that the nine dimensions are so correlated that the
shape carries no information beyond a single factor. Watch
`diagnostics.dimensionPairs`: if most pairs sit above r ≈ 0.9 on a larger country
set, the dimensional structure is not earning its keep.

---

## D2 — Normalisation is relative to the country set, not to an absolute frontier

**Choice.** Min-max each indicator across the countries in the run, mapping the
weakest to 0 and the strongest to 100.

**Why.** No defensible absolute frontier exists for most of these indicators, and
inventing one imports a value judgement we cannot support.

**Cost.** This is the single most consequential assumption in the model.
**Scores from two different country sets are not comparable.** Adding an
eleventh country changes every number. A country scoring 0 is the weakest of the
set, not incapable.

**Overturned by.** A move to a large enough country set that absolute anchoring
becomes possible, or an explicit decision to anchor against fixed reference
values per indicator.

---

## D3 — Equal weights inside a dimension

**Choice.** Every indicator in a dimension counts the same.

**Why.** Any other weighting in v0 would be arbitrary, and arbitrary weights are
harder to challenge than equal ones because they look considered.

**Cost.** A dimension carried by four indicators gives each 25% of the score
regardless of quality. A weak indicator drags as hard as a strong one.

**Overturned by.** Delphi construct-validity ratings that are stable across
several real panels. Weight by panel-rated validity only once the panel itself
has been shown to agree.

---

## D4 — Confidence is reported beside the score, never inside it

**Choice.** `confidence = coverage × recency × source_quality`, published as its
own number. It never adjusts, discounts or shrinks the capability score.

**Why.** Folding evidence quality into a capability score conflates two different
claims: how capable a country is, and how well we know. A reader can weigh those
separately; a blended number hides the trade.

**Cost.** Two numbers to carry everywhere. Consumers who want one number will
invent their own blend, probably worse than ours.

**Overturned by.** Nothing we can foresee. This is close to load-bearing.

---

## D5 — Missing data is dropped, never imputed

**Choice.** A missing indicator leaves the dimension mean and lowers coverage.

**Why.** Principle 6. Imputation makes a thin evidence base look identical to a
thick one.

**Cost.** A dimension with one observed indicator out of eight still produces a
score, computed from that single indicator. The score looks as solid as any
other; only the confidence number reveals it is not.

**Overturned by.** Nothing. But see D6 — this is why a floor may be needed.

---

## D6 — Dimensions are scored at any coverage above zero

**Choice.** As long as one indicator is observed, a dimension gets a score.

**Why.** Suppressing low-coverage dimensions would blank out Experimentation
entirely and hide the finding that it cannot be measured.

**Cost.** This is a live risk. Experimentation is scored from two indicators out
of eight and reads as a real measurement in the flat table. The v0 in-session
estimates disagree with it by up to 56 points.

**Overturned by.** A published deliverable. Before anything is published, either
introduce a coverage floor below which a dimension reports null, or mark
low-coverage cells visually in every output. **Open, unresolved.**

---

## D7 — Winsorize with Tukey fences at k = 3

**Choice.** Clip values beyond the quartiles ± 3 IQR. Record which values were
clipped.

**Why.** The spec says winsorize if necessary. With ten countries a percentile
rule such as p5/p95 would always clip the top and bottom country, destroying the
variation the benchmark exists to expose. Tukey at k = 3 clips genuine extremes
and usually nothing at all.

**Cost.** On heavy-tailed indicators such as patents, one country can still drag
the whole scale.

**Overturned by.** Evidence that a specific indicator's distribution needs a
transform rather than a clip. Prefer adding a `transform` to the registry over
lowering k.

---

## D8 — Only the most recent observation, no trends

**Choice.** One value per indicator per country: the latest non-null year.

**Why.** v0 is a structural test, not a time series. Trends multiply the
methodological surface before the cross-section is defensible.

**Cost.** A country improving fast and a country decaying fast look identical.
Capability arguably lives in the derivative.

**Overturned by.** The cross-section holding up. Trend is the obvious v1
extension and the data is already fetched from 2000 onward.

---

## D9 — Gap indicators stay in the registry

**Choice.** Indicators the spec asks for and no dataset supports are recorded
with `ingest: 'gap'`. They lower coverage, appear in the data-gap report, and are
shown to the Delphi panel.

**Why.** They are the collection agenda, and deleting them would make the
confidence scores lie.

**Cost.** Confidence numbers look bad. That is the point.

**Overturned by.** Nothing. Do not delete gaps to make numbers look better.

---

## D10 — Inspectability is a hard filter on sources

**Choice.** Reject sources whose underlying data or method cannot be inspected,
even when they cover every country. This is why university-industry
collaboration and volunteering are gaps despite GII and CAF publishing figures.

**Why.** Principle 4. A benchmark built on unauditable inputs cannot be
challenged, and the whole design assumes challenge.

**Cost.** Real coverage loss in Coordination and Shared Purpose.

**Overturned by.** A source opening its microdata, or an explicit decision to
accept composite indices with a recorded quality penalty via `source.tier`.

---

## D11 — Delphi output never enters the capability score

**Choice.** Panel estimates live in `delphiScore` / `delphiIqr`. `score` is
indicator-derived only. `blendedScore` falls back to the panel only where no
indicator evidence exists at all, and `blendedFrom` records which was used.

**Why.** Mixing model judgement into an indicator score makes the result
unauditable and makes the panel's disagreement with the indicators invisible —
and that disagreement is the most useful output of the panel.

**Cost.** Consumers must decide for themselves what to do with two numbers.

**Overturned by.** Nothing at v0. Any future blending must be a new, explicit,
named field, never a change to `score`.

---

## D12 — Panel disagreement is recorded, not averaged away

**Choice.** Keep the median and the interquartile range. Flag IQR > 25 as
dissent. Panelists are instructed not to converge for the sake of converging.

**Why.** A stable disagreement is a finding about the dimension. Classical Delphi
pushes toward consensus; we want the residual.

**Cost.** No single clean number per cell.

**Overturned by.** Evidence that panel dissent is noise rather than signal — for
instance if dissent does not correlate with low coverage across several runs.

---

## D13 — Panel diversity comes from vendors, not from model size

**Choice.** One top-tier model per vendor, paired with a fixed analytical stance.
Do not add cheaper or smaller models to widen the panel.

**Why.** Delphi needs independent error. Two models from one lab share training
data and agree for reasons unrelated to the evidence. A weaker model adds
variance that reads as disagreement but is just incapacity, and the IQR is the
output we care about most.

**Cost.** None worth counting. `pnpm bench cost` puts a four-panelist,
two-round, ten-country run in single-digit dollars. Cost is not a constraint at
this scale and must not be treated as one.

**Overturned by.** Evidence that stance dominates model, in which case several
stances on one model would be as good and simpler to reason about.

---

## D14 — Provenance is stored, never inferred

**Choice.** Every Delphi run file declares `provenance`: `gateway`,
`in_session`, `human` or `mock`. Downstream code branches on that field.

**Why.** Provenance was previously inferred by string-matching the model name.
That is how a dry run ends up quoted in a report.

**Cost.** Hand-authored runs must remember to set it. `pnpm bench validate`
catches it when they do not.

**Overturned by.** Nothing.

---

## D15 — The World Bank is the only wired ingestion source in v0

**Choice.** One adapter. Everything else is a gap.

**Why.** One well-understood source with a documented API beats four
half-understood ones, and it makes the gap list honest rather than a mixture of
"no data exists" and "we did not get to it".

**Cost.** Several gaps are gaps only because no adapter exists, not for any
methodological reason. Those are marked in their registry notes. The strongest
candidates are OpenAlex citation impact, V-Dem civil society and polarisation,
and UNCTAD export concentration.

**Overturned by.** Writing the next adapter. Each one is independent work.
