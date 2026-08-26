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

> **Superseded by D16 on 2026-08-26.** The relative principle stands. What
> changed is *which* set defines the scale: a fixed reference set rather than
> whichever countries happen to be loaded.

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

---

## D16 — The normalization frame is pinned to the ten reference countries

*Supersedes D2. Recorded 2026-08-26, when the first six countries were added
beyond the prototype set.*

**Choice.** Every indicator's Tukey fences and its 0 and 100 endpoints are
computed from the **ten reference countries only**. Every other country is
scored against that same fixed frame. A country outside the frame clamps to 0 or
100 and the cell is flagged `outOfFrame`.

Countries carry `frame: 'reference' | 'extended'` in
`packages/core/src/model/countries.ts`. The reference ten are the original
prototype set.

**Why.** Under D2 the scale was recomputed from whichever countries were loaded,
so adding one country silently moved every existing score. That makes the
benchmark unusable as an ongoing instrument: no published number survives the
next data load, and no two runs are comparable. Since countries and indicators
will keep being added, the scale has to hold still.

Verified when the six Latin American countries were added: **0 of 90 reference
cells moved.**

**Cost.**

- The reference set is now load-bearing and effectively frozen. Changing its
  membership rebases everything, and that is a deliberate, announced act.
- An extended country genuinely outside the reference range loses information at
  the clamp. Colombia already sits near the floor on Trust. If clamping becomes
  common the frame is too narrow for the countries being asked about, and that
  is the signal to rebase rather than to widen quietly.
- The ten reference countries are not a representative sample of the world. They
  were chosen to expose different capability structures, so the frame is biased
  toward the contrasts they happen to span.

**Overturned by.** A sustained pattern of `outOfFrame` cells, or a decision to
move to absolute anchoring per indicator. Either way, rebasing is a versioned
event: bump a frame version, re-publish, and say plainly that the old numbers
are not comparable.

---

## D17 — Confidence bands are fixed thresholds, and not a red-to-green scale

*Recorded 2026-08-26.*

**Choice.** Four bands in `packages/core/src/pipeline/confidence.ts`: very thin
below 0.25, thin to 0.45, usable to 0.65, good above. The viewer colors by band
on an ordinal ramp from muted navy to brand lime. The report prints the band
label. One source of truth, so the two cannot drift.

**Why.** Confidence is a product of three fractions, so its usable range is
compressed and small differences near the bottom matter more than they look.
Bands make that legible where a raw number does not.

Red to green was rejected: it fails for the most common colour vision
deficiencies, and it reads as pass and fail when the thing being encoded is a
quantity. The chosen ramp was checked with the palette validator. The worst
adjacent pair separates at dE 18.7 in light and 18.2 in dark under normal
vision. The dark pair sits at dE 6.8 under tritanopia, which is acceptable only
because the numeric value is printed beside every bar and the bar length carries
the same magnitude.

**Cost.** The thresholds are a judgement. Nothing in the data says 0.45 is the
line between thin and usable.

**Overturned by.** Evidence about how readers actually act on the bands, or a
change to the confidence formula that shifts its range.

---

## D18 — One display for every 0 to 100 score

*Recorded 2026-08-26.*

**Choice.** Every 0 to 100 number in the viewer renders through a single
component, `Score`, as a filled chip carrying the number and coloured by one of
four bands from `packages/core/src/pipeline/bands.ts`. Dimension scores, panel
medians and normalized indicator values all use it. No table gets its own
treatment.

**Why.** The first version tinted the cell background by value at low opacity.
Across a sixteen-country table you could not tell 1.1 from 98.7 at a glance,
which is the only reading that table exists to support. Three different
renderings of the same quantity had also accumulated: a tint, a plain number,
and a bar.

Four discrete bands rather than a continuous ramp, for the same reason
Metacritic uses bands: a continuous tint cannot separate 20 from 40 at chip
size. The ramp recedes into the page at the bottom and reaches brand lime at the
top, in both themes, so low values sink and high values stand out. Not red to
green, for the reasons in D17.

Worst adjacent pair separates at dE 22.6 light and 22.0 dark under normal
vision, and every label clears 4.5:1 against its fill.

**Cost.**

- The band edges at 25, 50 and 75 are arbitrary. Two countries either side of a
  boundary look further apart than they are, which is the standard cost of
  banding and the reason the number is always printed inside the chip.
- The labels say "strong" and "weak", which sound absolute. They are positions
  against the reference frame, and the tooltip and the legend say so.

**Overturned by.** Evidence that readers misread band edges as real differences,
or a move away from a frame-relative scale.

---

## D19 — Extended countries get no visual marking

*Recorded 2026-08-26. Reverses a choice made the same day.*

**Choice.** Countries added after the reference frame was fixed are displayed
exactly like the reference ten. No badge, no marker, no dimming.

**Why.** A marker was briefly shipped. It implied the numbers were less
trustworthy, which is false: every country is measured against the same frame by
the same method, and that is the entire point of D16. The distinction is real
but it is about how the scale was built, not about the quality of any country's
score, so it belongs in the method documentation rather than on every row.

**Cost.** A reader cannot tell from the table which countries defined the frame.
The method page and D16 say which ten they are.

**Overturned by.** A case where the distinction changes how a number should be
read, most likely a country clamping at 0 or 100. Flag `outOfFrame` on that
cell rather than reinstating a badge on the country.

---

## D20 — Documented deliveries are recorded as evidence and never scored

*Recorded 2026-08-26.*

**Choice.** `data/evidence/records.json` holds evidence records: a documented
case of a country doing the thing an indicator is meant to measure, filed
against an indicator whose `ingest` is `gap`. Each record carries a claim, one
published number with its reference period, a source with a tier and a retrieval
date, and a required `limits` field saying what the case does not show.

Records never enter `DimensionResult.score` and never raise confidence. They are
schema-checked by `pnpm bench validate` and displayed on the country page under
the dimension they belong to.

A gap becomes an indicator only when a comparable series covers at least two
reference countries, which is the minimum `buildFrame` needs to produce a scale.
Promoting one is a separate, recorded act.

**Why.** Brazil scores 11.5 on Building. Every measured indicator in that
dimension is industrial output: manufacturing value added, high-technology
exports, labour productivity, economic complexity. The dimension is defined as
the capacity to build and deliver, and it currently cannot see a national
programme that was delivered. Pix and GOV.BR are exactly that, and both sit
inside `large_project_delivery`, which is a declared gap.

The alternative was to put those cases in the page copy above the chart. That
was rejected. Curated national successes with no schema, no source discipline
and no limits can be assembled for any country, and a page that argues against
its own number is unfalsifiable. Encoding the cases makes them checkable, keeps
the score honest and turns the disagreement into a measurement task.

The two constructs inside Building are now named: industrial output, which the
six measured indicators carry, and state delivery capacity, which
`large_project_delivery` carries and no dataset covers. The nine dimensions do
not change. See KNOWN-ARTEFACTS A11.

**Cost.**

- A record is hand-written, so the layer is only as good as its author. The
  required `limits` field and the validator reduce that risk without removing
  it.
- One country with two records and fifteen countries with none reads as a claim
  about Brazil. It is a claim about what the indicators cannot see, and the same
  cases exist elsewhere. Estonia, India and Uruguay have obvious candidates and
  no records yet.
- The layer can become a place to park advocacy. The promotion rule is what
  stops that: a record is a step toward an indicator, and it is not a substitute
  for one.

**Overturned by.** A comparable delivery series covering the reference set, at
which point `large_project_delivery` leaves `gap`, the records become source
notes on a scored indicator, and this decision is superseded.

**Update, same day.** The layer opened with two Brazilian records, which read as
a claim about Brazil. It now holds 15 records across four countries.

Brazil has 11, covering half a century: Embrapa from 1973, Proalcool from 1975,
the immunisation programme from 1973, SUS from 1988, electronic voting from
1996, Plano Real in 1994, deepwater and pre-salt oil, Bolsa Familia and its
registry from 2003, Luz para Todos from 2003, GOV.BR from 2019 and Pix from
2020. Estonia has X-Road, India has the Jan Dhan accounts, and Uruguay has the
renewable electricity build and Plan Ceibal.

Records also stopped being a single-indicator affair. Twelve sit on
`large_project_delivery`, two on `institutional_responsiveness` (Plano Real,
Proalcool) and one on `government_foresight_capacity` (Embrapa), so the layer
documents three gaps in three dimensions.

Brazilian sources arrived with the second batch. Seven records now cite IPEADATA,
which serves series from the Ministry of Social Development, the Superior
Electoral Court and the National Petroleum Agency at
`official_statistical` tier, against the `international_organization` tier of the
World Bank records. That is the per-point tier from D25 earning its place.

Several records exist to keep the layer from becoming advocacy. The immunisation
record carries a capability that eroded, from 99 percent coverage in 2003 to 68
percent in 2021. Plan Ceibal carries a delivery whose only available measure is
weak and stale. The pre-salt record states that individual platforms ran years
late, which is precisely the cost and schedule evidence the indicator wants and
the production figure hides. A library of national wins would include none of
those sentences.

Fifteen records are still not a series, so the promotion rule above is
unchanged.

---

## D21 — GEM is wired by hand, venture capital stays a gap

*Recorded 2026-08-26.*

**Choice.** Two Experimentation indicators leave `gap` and become
`ingest: 'manual'`, entered in `data/observations/manual.json` from the GEM
Adult Population Survey key indicators:

- `early_stage_entrepreneurial_activity`, the TEA rate as published.
- `failure_tolerance`, stored as 100 minus the published fear of failure rate.

Sixteen countries, 15 of them from 2023 or later. Singapore last took part in
2014 and is entered at that year, so the recency term marks it down to a weight
of 0.17 rather than hiding it.

`venture_capital_gdp` stays a gap. The OECD SME and Entrepreneurship Financing
scoreboard is the only inspectable aggregate. Checked on 2026-08-26, it carries
venture capital for 6 of these 16 countries, in national currency rather than as
a share of GDP, with 2022 as the latest year. Brazil, India, South Africa and
Singapore are absent. Wiring it would score the rich half of the set and lower
coverage for the rest, which is the wealth-proxy failure of A3 rebuilt on
purpose.

**Why.** Experimentation was the worst-measured dimension in the benchmark and
A1 said not to publish it. Two of eight indicators carried it, both counting
formalised invention, which is close to the opposite of the many-cheap-attempts
construct.

What changed:

- Experimentation confidence rises from 0.178 to 0.394 for most countries, which
  moves it from very thin to thin.
- Correlation with log GDP per capita falls from 0.624 to 0.568. TEA itself
  correlates at −0.296, the first direct capability measure in the registry that
  does not track income upward.
- Korea's 100 disappears. It scores 75, because the patent filing artefact is now
  diluted by two indicators where Korea is ordinary.
- Mean distance between the panel and the indicators falls from 27.1 to 18.3
  points across the sixteen countries.
- No other dimension moved. Verified against the previous `scores.json`.

**Cost.**

- Hand-entered data goes stale silently. There is no fetcher, so somebody has to
  re-export from GEM and update the file. The retrieval date is on every
  observation.
- TEA counts every new business, so necessity self-employment weighs the same as
  a funded startup. Chile at 29.4 and Argentina at 21.4 sit above the United
  States at 17.7 for that reason. This is a real property of the measure and it
  is now in the indicator notes.
- GEM publishes the fear of failure rate among adults who already see good
  opportunities, so the denominator is not the adult population the unit label
  suggests.
- Four of eight Experimentation indicators are still gaps, so the dimension is
  better measured and not well measured.

**Overturned by.** An inspectable venture capital or business R&D series that
covers the reference set, or a GEM licensing change that stops the data being
usable this way.

---

## D22 — Momentum is measured on one ruler and a matched basket

*Recorded 2026-08-26.*

**Choice.** Ingestion keeps every year the World Bank returns from the start year
rather than the latest value alone. Scoring still reads only the latest value, so
no score moves. On top of that history, every country and dimension carries a
`momentum` object: the change in score over ten years, plus the yearly series
behind it.

Two rules make the number mean something.

1. **One ruler.** Historical values are normalised against the frame built from
   the reference countries' *current* values. The scale does not move, so a
   change in the score is a change in the country. A value outside today's frame
   clamps and the clamp is counted in `momentum.clamped`.
2. **A matched basket.** Only indicators observed at both ends of the span enter,
   and that same basket is used for every year in between. A dimension that
   gained an indicator would otherwise show movement belonging to the dataset.
   The basket is reported with its size, and `baseScore` and `currentScore`
   describe the basket rather than the headline score.

A trend is reported when the basket holds at least two indicators and covers at
least half of what the country is currently scored on in that dimension. An
observation older than five years does not count toward a year.

**Why.** Capability is a rate as much as a level. Every existing index publishes
levels, and levels on public data reproduce the development ranking, which is
the failure this benchmark exists to avoid. Direction is where the analytical
value is, and the data to compute it was already being fetched and thrown away.

The first run says something the levels cannot. Brazil sits near the floor on
Agency at 31 and has moved +26.2 points in ten years against a median of +12.7.
Coordination fell in 11 of 16 countries. Estonia lost 14.2 points on
Adaptability. India lost 19.3 on Learning.

**Cost.**

- The observation file grows from 203 KB to 3.6 MB. It is still plain JSON and
  still inspectable.
- Momentum and score sit on different baskets, so the two numbers are not
  directly comparable. Every surface that prints a trend prints the basket size
  next to it.
- Several indicators track worldwide technology diffusion, so almost every
  country rises on Anticipation and Agency. A positive number is not evidence of
  catching up. The report prints the median change per dimension for that reason.
- Ten years is a choice. A longer span covers fewer indicators and a shorter one
  is mostly noise.
- Doing Business indicators are frozen at 2019, so any basket containing them
  measures a shorter period than it claims.

**Overturned by.** Enough indicator history to score a full basket at both ends,
which would let momentum use the whole dimension rather than a subset. A move to
absolute anchoring would also change what a fixed ruler means and this decision
would need restating.

---

## D23 — The perception layer is retired, and the cost is visible

*Recorded 2026-08-26.*

**Choice.** Seven indicators leave the scored set. They keep their rows, with
`ingest: 'retired'`, which means a dataset exists and this project rejected it.
Retired indicators are not fetched, not scored, and they lower coverage exactly
as a gap does.

| Retired | Dimension | Why |
| --- | --- | --- |
| Government effectiveness | Coordination | WGI perception composite |
| Regulatory quality | Coordination | WGI, r 0.93 with the above |
| Logistics performance | Coordination | Freight forwarder survey |
| Rule of law | Trust | WGI perception composite |
| Control of corruption | Trust | WGI, r 0.95 with the above |
| Voice and accountability | Shared Purpose | WGI, and artefact A5 |
| Logistics infrastructure | Building | The same freight forwarder survey |

One indicator is added: intentional homicide rate, from the World Bank, in
Trust. It is counted by police and health systems rather than reported as an
opinion.

**Why.** Grouping every scored indicator by its own measurement class showed
that the wealth correlation was a property of the evidence, not of the
dimensions. Perception indicators averaged 0.75 against log GDP per capita with
75% above the wealth-proxy line. Direct capability measures averaged 0.55 with
20% above it. The benchmark exists to avoid reproducing a development ranking,
and the perception layer was the mechanism reproducing it.

Effect on the wealth correlation:

| Dimension | Before | After |
| --- | ---: | ---: |
| Coordination | 0.90 | 0.68 |
| Trust | 0.88 | 0.79 |
| Building | 0.82 | 0.78 |
| Shared Purpose | 0.34 | 0.18 |

Coordination drops below the wealth-proxy line. The anticipation and
coordination pair, which correlated at 0.94 and was the strongest duplicate
candidate in the model, is no longer flagged. One duplicate pair remains,
anticipation and agency at 0.94. One perception indicator remains in the whole
scored set: GEM fear of failure, which is a self-report about the respondent
rather than a judgement about the country.

**Cost. This is the important part.**

- Coordination now rests on one indicator, time to export, frozen at 2019.
  Confidence falls from 0.46 to 0.079. Trust rests on two and falls to 0.20.
  Shared Purpose rests on two and falls to 0.25. Those three dimensions are
  effectively unmeasured, and the scores they print should be read as such. The
  radar draws them dashed, the tables print the band, and the numbers still
  move enough to mislead a casual reader. That is a real risk this decision
  accepts on purpose, because the alternative is a number that looks solid and
  measures income.
- Estonia scores 97.8 on Coordination and South Africa scores 0.0, both on a
  single 2019 border-time measure. Neither is a finding.
- The replacement is not income-free. Homicide correlates with log GDP per
  capita at 0.77 in this set, above the threshold. The difference is that the
  mechanism is visible and arguable rather than definitional.
- Momentum baskets shrink where retired series carried them.

**Overturned by.** Observable replacements: court throughput and case clearance,
budget execution rates, cross-agency programme delivery, voter turnout,
volunteering rates, civic participation. Each one that lands raises the coverage
this decision knocked down. If none land, the honest conclusion is that
Coordination and Trust cannot be measured with public data, and they should be
reported as unmeasured rather than scored.

---

## D24 — Two spans for a dimension, and a full line for every indicator

*Recorded 2026-08-26. Extends D22.*

**Choice.** Three changes to the trend layer.

1. Ingestion defaults to 1990 rather than 2000. The observation file grows to
   3.8 MB and no score moves.
2. `momentum` becomes a list, one entry per span, shortest first. Ten years and
   twenty years are published. `primaryMomentum` returns the first entry for
   surfaces that show one number.
3. Every indicator result carries its own normalised series, one point per
   observed year, back to whatever the data supports.

**Why.** D22's matched basket is held to the shallowest indicator in a
dimension, so one span had to choose between breadth and reach. Measured on
Brazil, the basket falls from four indicators at ten years to two at twenty in
Anticipation and Building, while Adaptability holds four all the way to
twenty-five. Publishing both spans lets each dimension say how far its own
evidence reaches instead of being cut to the shortest common span.

An indicator, unlike a dimension, is comparable with itself. Nothing has to be
matched, so its line runs as far back as the series does: 36 points for Brazil
on several World Bank series, against six for the Doing Business rows.

The twenty-year view already says something the ten-year view cannot. Building
falls by a median of 5.9 points across all sixteen countries over twenty years
and is flat over ten. Colombia is at −14.3, Argentina −11.5, India −10.4, Brazil
−4.7, and Korea is the one clear gain at +11.3.

**Cost.**

- `scores.json` grows to 2.1 MB because every indicator now carries its history.
  The viewer reads it per request, which is fine locally and would need an API if
  this were ever served at scale.
- Two numbers per cell invite cherry-picking the flattering span. Both are
  always printed together with their basket sizes.
- Reaching back to 1990 covers a period when several of these countries changed
  political and economic system, so a twenty-year line crosses a discontinuity
  the model cannot see.
- Nothing is interpolated or extrapolated. A gap in a line is a real gap, and a
  series that stops, such as every Doing Business row in 2019, simply stops.

**Overturned by.** Enough indicator history to compute a full-dimension basket at
both ends, which would make the matched basket unnecessary and both spans
directly comparable to the headline score.

---

## D25 — Every point carries its provenance, and every run records what moved

*Recorded 2026-08-26.*

**Choice.** Two changes, both aimed at making the history checkable before the
country set grows.

1. Each point in an indicator's series carries the value as published, the
   normalised value and its own source tier. A chart can be inspected point by
   point rather than trusted.
2. Every ingest compares itself against the file it is about to replace and
   appends what moved to `data/observations/revisions.json`: values restated,
   years added, years dropped, with the before and after for each. A full copy
   of the observation file is written to `data/observations/snapshots` only when
   `--snapshot` is passed.

**Why.** The audit trail claimed more than it delivered. Provenance was complete
at the file level and absent from the rendered line: the viewer drew a series of
normalised numbers with no raw value, no tier and no way to check any of it.

The second half matters more. A published statistic is not fixed. Agencies
restate, rebase and revise, and an ingest that overwrites its own file makes that
invisible, so the record would always claim a number had been what it is now.
That is the failure mode a benchmark cannot have.

Per-point tiers exist for what comes next. A series will mix an international
republisher with a national statistics office as soon as national sources are
added, and the reader has to see which point came from where. The World Bank is
a republisher of IBGE, MCTI and the rest, so today every point says
`international_organization` and that is itself worth showing.

**Cost.**

- `scores.json` grows from 2.1 MB to 3.0 MB. The viewer reads it per request.
  At 60 countries this file has to become per-country files or an API, and that
  is the next structural limit rather than a future one.
- A full snapshot is 3.8 MB, so snapshots are opt-in and gitignored, and the
  revision log is the record that ships with the repository. The log stays small
  because it holds only what changed. Anyone wanting bit-for-bit archives of
  every run has to keep them outside git.
- A run that re-baselines everything would write one very large entry, so the
  list is capped at 500 revisions per run with the remainder counted in
  `omitted`.
- The log starts now. Everything ingested before today has no revision history
  and never will.

**Overturned by.** A move to per-country output files, which would change where
the series lives but not what it has to carry.

---

## D26 — Every term is defined once, in plain language, in the model

*Recorded 2026-08-26.*

**Choice.** `packages/core/src/model/glossary.ts` holds a definition of every
term this project invents or borrows: dimension, indicator, measurement class,
score, reference frame, normalisation, winsorizing, out of frame, confidence and
its three parts, confidence band, source tier, gap, retired indicator, evidence
record, momentum, matched basket, indicator line, Delphi panel, provenance,
dissent, wealth proxy and known artefact. Each entry carries a one-line version,
a full explanation written for somebody who has never seen the benchmark, and a
worked example from the current data.

The viewer renders it at `/glossary`. Measurement classes get their own block
because they appear as a bare letter everywhere else. `ClassLegend` ships under
every table that shows those letters, and country pages open with a short guide
to reading the page.

**Why.** The viewer was showing a reader the letter `C`, a dashed radar edge and
a confidence band of 0.079 and assuming all three were self-explanatory. None of
them are. A benchmark that wants to be argued with has to be legible first, and a
definition sitting only in `DECISIONS.md` is not available to the person looking
at the chart.

Putting the glossary in the model rather than in the page matters for the same
reason the confidence thresholds live in one file: two explanations of one term
drift, and the drift is invisible until somebody quotes the wrong one.

**Cost.**

- Definitions age with the model. An entry naming a current number, such as
  Coordination sitting at 0.079 confidence, is stale the moment that changes.
  Examples are marked as examples for that reason, and a model change now has to
  update its entry in the same commit.
- The glossary is prose in a package that is otherwise data and arithmetic.

**Overturned by.** Nothing foreseeable. A second surface that needs the same
definitions, such as a printed report or an API, reads the same file.

---

## D27 — Forty countries, and output split one file per country

*Recorded 2026-08-26.*

**Choice.** Twenty-four countries join the extended set, taking the benchmark to
40: Germany, France, the United Kingdom, Spain, Poland, Sweden, Finland,
Ireland, Canada, Australia, Japan, China, Indonesia, Vietnam, the Philippines,
Malaysia, Thailand, Turkey, Israel, the United Arab Emirates, Nigeria, Kenya,
Rwanda and Ethiopia. The reference ten are untouched.

Scoring now writes `data/out/index.json`, the slim list of nine scores per
country, and `data/out/countries/{ISO3}.json`, one country in full. The single
`scores.json` is gone. It had reached 7.3 MB and the viewer read all of it to
draw any page.

**Why, on the countries.** Every correlation in the diagnostics was a hint on 16
points. At 40 the picture changes and some of it reverses:

| Dimension | vs log GDP at 16 | at 40 |
| --- | ---: | ---: |
| Anticipation | 0.91 | 0.85 |
| Adaptability | 0.87 | 0.80 |
| Agency | 0.89 | 0.79 |
| Learning | 0.79 | 0.77 |
| Coordination | 0.68 | 0.61 |
| Building | 0.78 | 0.56 |
| Experimentation | 0.57 | 0.40 |
| Trust | 0.79 | 0.39 |
| Shared Purpose | 0.18 | 0.33 |

The headline is the duplicate list. At 16 countries, Anticipation and
Coordination correlated at 0.94 and Anticipation and Agency at 0.94, which
suggested the nine dimensions were three signals wearing nine names. **At 40
countries, no dimension pair passes the redundancy threshold at all.** The
dimensions separate once the country set is wide enough to separate them, and
the earlier finding was substantially an artefact of a narrow, mostly rich
sample.

**Why, on the files.** A country page needs one country. A grid of 40 radars
needs nine numbers each. Serving 7.3 MB for either is the scaling limit D25
predicted, arriving exactly where it said it would.

**Cost.**

- **Clamping is now common, and that is a warning.** 165 of 1,303 observed cells
  sit outside the reference frame and are clamped, 12.7 percent, concentrated in
  Ethiopia, Nigeria, Rwanda and Kenya. A10 said watch this flag, and it is now
  firing loudly. The ten reference countries do not span the range being asked
  about, and a low-income country pinned at 0 on twenty cells is losing real
  information. A versioned rebase of the frame is now a live question rather
  than a hypothetical one.
- The GEM values cover only the original 16 countries, so the two Experimentation
  indicators are missing for the 24 new ones and their coverage is lower.
- Twenty-four countries arrived with no Delphi estimates, so the panel now covers
  16 of 40.
- The observation file is 9.2 MB.

**Overturned by.** A frame rebase, which would be a versioned event with its own
decision, or a move to absolute anchoring per indicator.

---

## D28 — Icons are copied in, one per concept, never alone

*Recorded 2026-08-26.*

**Choice.** `apps/web/src/components/Icon.tsx` holds the path data for 23 Lucide
icons, copied from lucide.dev rather than installed as a package, and credited
in NOTICE.md. Concept-to-icon maps live beside them: measurement class, row
status, source tier and glossary group.

Three rules govern their use.

1. One icon per concept, reused everywhere that concept appears, so the glyph
   becomes learnable instead of decorative.
2. An icon never appears alone. The measurement class badge still prints its
   letter, the trend still prints its number and sign, and the status cell still
   prints its word.
3. Every icon is `aria-hidden`, because the text beside it is the accessible
   name.

**Why.** The viewer asked a reader to decode a bare letter, a dashed line and a
band. D26 fixed the words. An icon carried alongside those words gives the eye
something to recognise at a glance in a dense table, which is where most of this
data is read.

Copying the paths rather than installing `lucide-react` keeps the web app on
three dependencies, which is a standing choice here, and it means an icon cannot
change under us on a package update. The cost is that updating an icon is manual,
which is the right trade for a set this small.

**Cost.** A reader who does not recognise a glyph loses nothing, because rule 2
holds, but a reader who misreads one could be briefly misled. Icons were chosen
so that a wrong guess stays close: a target for the direct measure, a plug for an
input, a rising line for an outcome, an eye for a perception.

**Overturned by.** A need for many more icons, at which point installing the
package beats maintaining a copied set.

**Update, same day.** Extended to 36 icons. The nine dimensions each have one,
used on the country page headings, the dimension table and the method page, so
Building is always a hammer and Trust is always a handshake. The four confidence
bands get a signal-strength ramp beside the meter, which is a third encoding of
the same quantity alongside the bar length and the printed number.

---

## D29 — The dimension is called Execution, and the axes carry their marks

*Recorded 2026-08-26.*

**Choice.** Two display changes, no change to any number.

The eighth dimension is labelled `Execution`. The spec called it
"Building / Execution" and the slash was doing no work: it read as two names for
one thing and it broke every table column it appeared in. The dimension id stays
`building`, because it is the key in every scored file, every trend basket and
every Delphi estimate on disk. Renaming the key would invalidate all of it to
change a word on a screen.

The radar takes a `labels` prop. `full` prints the dimension mark and the words,
`icons` prints the mark alone, `none` prints neither. The 40-country grid uses
`icons`, because at that card size the words rendered at seven pixels and were
decoration. Every radar now also carries a `<title>` and a `<desc>` listing each
dimension and its score, so a screen reader gets the full profile in words
whatever the visual labels do.

**Why.** A reader learning nine glyphs once can then read 40 cards at a glance,
which is the whole reason the grid exists. The written names stay on the large
radar, in the dimension table, on the method page and in the accessible
description, so the icons are never the only carrier.

**Update, same day.** Two corrections after seeing it in use. The axis marks are
drawn at one strength for every dimension: fading them for thin evidence made the
whole ring look washed out on a country where most dimensions are thin, and that
evidence is already carried by the dashed edge, the hollow vertex and the
asterisk. The radars are also drawn larger. The focal column is wider, the country
grid went from four columns to three, and the geometry now depends on what labels
the axes: words need a wide margin and shrink the shape to a small figure in a
large box, marks need very little. The icon-labelled radar draws its shape across
78 percent of its box against 54 percent before, so at a 1280 pixel viewport the
drawn spider on a country card went from about 135 pixels across to 256, and the
labelled one from 205 to 287.

**Cost.** A reader who has not learned the marks has to visit a labelled radar
first. The nine icons are a judgement: a telescope for Anticipation and a
handshake for Trust are readable, while a shuffle for Adaptability and a hand for
Agency are weaker. Those two are the ones to revisit if anybody misreads them.

**Overturned by.** Evidence that the grid is unreadable without words, which
would mean going back to labels and making the cards larger.

---

## D30 — Every number opens onto the field it sits in

*Recorded 2026-08-26.*

**Choice.** Clicking an indicator name, an indicator's normalized score or a
dimension score opens a panel listing every country on that measure, ranked,
with the country being read marked and the ten frame countries marked.

Scoring writes a third artefact for this, `data/out/indicators/{id}.json`, which
is the scored matrix turned inside out: one file per indicator holding every
country's raw value, year, source tier, normalized position and whether it
clamped. Two route handlers serve it and the dimension equivalent, and the panels
fetch on demand rather than shipping 34 payloads with every page.

**Why.** A table cell reading 17.6 is not information. The same cell next to the
other 39 countries, the two values that fix the ends of the scale and the year
each country's number comes from is information. This is what Our World in Data
does well and what a static table cannot do at all.

The panels also surface problems that the country page hides by construction.
Opening R&D expenditure shows Israel at 6.35 percent of GDP and South Korea at
4.94 both sitting at exactly 100, because Israel is outside the frame and clamped,
which is artefact A10 made visible instead of documented. Opening Coordination
shows the Netherlands, France and Spain tied at 100 with confidence 0.079, which
is A12 in one glance.

**Cost.**

- Another 392 KB of generated output, and another artefact to keep in step with
  the scores. It is written by the same command, so it cannot drift.
- The panels are client components with a fetch, so the context is not available
  without JavaScript. The raw value, year, source and normalized score all stay
  in the table itself, so nothing is lost, only the comparison.
- A dialog inherits text alignment from wherever it sits in the DOM. Both panels
  set their own, which is a small trap worth remembering for the next one.

**Update, same day.** Both panels now open with a distribution plot and keep the
ranked list below it. Every country is a dot on the same 0 to 100 axis, dots that
would overlap stack upward so a cluster reads as a column, and the box behind
them is the middle half of the field with the median as a line. The country being
read is filled and labelled. In the dimension panel a hollow dot means thin
evidence, the same convention the radar uses.

The shape is the point. R&D expenditure puts a dozen countries in a single column
at the floor of the scale and spreads the rest thinly across the top half, which
a rank cannot show and a bar chart of 40 rows buries.

**Overturned by.** Nothing foreseeable for the panel itself. A reader who wants
the underlying distribution rather than the normalized one needs a raw axis with
a log option, which is a further step.

