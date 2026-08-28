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

> **Superseded by D22 and D24 on 2026-08-26.** The scoring rule stands: a score
> still uses only the latest observation and nothing is imputed. The "no
> trends" half fell when momentum shipped as a separate layer, on a matched
> basket against the current frame.

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

**Broken and restored, 2026-08-26.** The comparison panels added by D30 printed
the word frame beside every reference country in their lists, which is the same
marking this decision removed, inverted. It is gone again. The distinction stays
where it belongs, in the method page and in the glossary.

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

## D29 — The eighth dimension keeps one name, and the axes carry their marks

*Recorded 2026-08-26.*

**Choice.** Two display changes, no change to any number.

The eighth dimension is labelled `Building`. The spec called it
"Building / Execution" and the slash was doing no work: it read as two names for
one thing and it broke every table column it appeared in. The dimension id stays
`building`, because it is the key in every scored file, every trend basket and
every Delphi estimate on disk. Renaming the key would invalidate all of it to
change a word on a screen.

The label was briefly `Execution` on the same day. That word makes a promise the
data cannot keep. Execution means finishing: cost performance, schedule
performance, delivery. Those are `large_project_delivery` and
`firm_scale_up_rate`, and both are gaps. What the dimension actually scores is
four outcome measures of industrial output, manufacturing value added,
high-technology export share, output per worker and economic fitness, plus a
permit-speed score frozen at 2019. Calling that Execution invites a reader to
take 9.4 as "Brazil cannot deliver" on the same page that documents Pix, SUS,
the electoral system and Embrapa. Building is looser in a way that happens to be
honest, and it matches Construção in the strategy this benchmark serves.

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

---

## D31 — A record carries its mechanism, and patterns get their own page

*Recorded 2026-08-26. Extends D20.*

**Choice.** An evidence record gains an optional `pattern`: the mechanism in one
or two sentences, the preconditions that had to already exist, and where the move
has travelled. All 15 records now carry one, and `pnpm bench validate` warns when
a record does not.

The layer also stops being something a reader finds by opening a country. There
is a `/patterns` page listing every record across every country, grouped by the
dimension it bears on.

**Why.** The record already said what a country did. It did not say how, and how
is the only part that transfers. Pix as a number is 7.98 billion transactions a
month, which tells a Brazilian nothing they can act on and tells anybody else
nothing at all. Pix as a mechanism is a central bank that wrote the standard,
compelled participation above a size threshold, ran settlement itself and priced
it at zero, which is a move somebody else can consider, and whose three
preconditions tell them whether it would work where they are.

Everything else in a record is sourced from a named publisher. The mechanism is
not: it is our reading. It sits in its own field for that reason, so the sourced
and the interpreted are never confused.

**Cost.**

- The mechanism is an argument and can be wrong in a way a published number
  cannot. It is signed by being ours, and a reader who disagrees is disagreeing
  with an analysis rather than with a statistic.
- Preconditions are the weakest part. They are what makes a copy fail, they are
  the hardest thing to establish, and three lines per record is a first pass.
- Fifteen records across four countries is a library, not a discipline. The
  interesting version compares mechanisms across countries facing the same
  constraint, and that needs many more records.

**Overturned by.** Enough records to compare mechanisms rather than list them, at
which point the page becomes a query rather than a list.

---

## D32 — Evidence is drawn as a gradient, and every chart is a control

*Recorded 2026-08-26.*

**Choice.** Four changes to how charts behave, and one naming change.

The radar edge no longer switches between solid and dashed at a threshold. Each
edge is cut into fourteen segments, confidence is interpolated along it, and the
gap between dashes opens as the evidence thins. An edge running from a
well-evidenced dimension to a poorly evidenced one comes apart gradually, which
is what the underlying quantity actually does.

The asterisk after a thin axis label is gone. The dashed edge and the hollow
vertex already said it twice.

Axis labels are controls. Clicking one opens the 40-country panel for that
dimension, the same panel a score opens.

Distribution dots respond to a pointer: the country under it is named where it
sits, with its raw value, and the hit target is twice the size of the dot.

The product is called NCB in the wordmark, with the full name beside it.

**Why.** A benchmark whose whole argument is "the evidence is uneven" should draw
the unevenness rather than annotate it. A threshold hides the gradient it stands
on: Adaptability at 0.47 and Learning at 0.52 are nearly the same amount of
evidence and were drawn as opposite states.

Making labels controls follows from D30. If a number opens onto its field, the
name of the thing it measures should too, and a reader hunting for context should
not have to learn which parts of a page are live.

**Cost.**

- Nine axes times fourteen segments times each series is a lot of line elements
  for one chart. It is still under a hundred and fifty and the radar has no
  dependencies, so it stays cheap.
- The gradient makes a single edge harder to read exactly. That is honest: the
  precise confidence numbers are in the table beside it and always were.
- Native dialogs centre themselves through a margin the CSS reset removes. Both
  panels set it back explicitly, which is the second trap this element has
  sprung after inheriting text alignment.

**Overturned by.** Nothing foreseeable. If the gradient reads as noise at small
sizes, the icon-labelled radars can fall back to the threshold.


---

## D33 — Evidence records get an inclusion rule before they get more records

*Recorded 2026-08-27. Extends D20 and D31.*

**Choice.** `docs/EVIDENCE.md` states the inclusion rule for evidence records
and how a record is written. Five tests decide whether a case gets in: it bears
on a declared gap, a named publisher carries the number, the delivery is
institutional, it was delivered rather than announced, and its limits can be
written honestly. Three disciplines govern the corpus: at least one record in
five documents a reversal, expansion goes by dimension rather than by country,
and no country holds more than a third of the set. Records stranded by a gap
promotion are deleted in the promoting change, with their ids named in its
decision entry.

**Why.** D20 rejected curated national successes with no schema, no source
discipline and no limits. The schema fixed source discipline and limits. It did
not fix selection: nothing said who picks the cases, what disqualifies one, or
how many failures the set must carry, and a validator cannot see that a corpus
of pure successes is a brochure. Fifteen records exist, eleven of them
Brazilian, twelve of them on one indicator, and six of nine dimensions have
none. Expanding that to forty countries without a written rule reproduces the
failure D20 exists to prevent, inside a schema.

The rule is written down now, before the corpus grows, because a rule adopted
at fifteen records constrains the author and a rule adopted at a hundred and
fifty indicts the archive.

**Cost.**

- The one-in-five reversal quota and the one-third country ceiling are round
  numbers, not derived ones. They exist to force the question at authoring
  time, not because five and three are correct.
- Deleting stranded records on promotion loses their rendered text from the
  site. The decision entry and git history keep it, but a reader of the
  patterns page does not see git history.
- The rule makes authoring slower. That is partly the point.

**Overturned by.** A corpus that satisfies every test and still reads as
advocacy — that would mean selection bias lives somewhere the rule does not
reach, and the rule needs to move from authoring discipline to independent
review. Or a demonstrated need to document sub-national or non-state
deliveries, which test three currently excludes.

---

## D34 — Countries are identified by ISO 3166-1 alpha-3, recorded after the fact

*Recorded 2026-08-27.*

**Choice.** The country identifier everywhere in this project is the ISO 3166-1
alpha-3 code: `iso3` in `countries.ts`, the cell key in observations, the file
name in `data/out/countries/{ISO3}.json`, and the route in the viewer. Alpha-2
is not used anywhere.

**Why.** The World Bank v2 API returns every observation row keyed by
`countryiso3code`, and the request path takes the same code, which the pipeline
stores verbatim as `sourceUrl` provenance. Alpha-3 is therefore the identity
the raw data arrives with, and using alpha-2 would add a translation table
between the source and the store for no benefit. The convention also matches
the rest of the cross-country data world (IMF, ILOSTAT, Penn World Table),
which matters because ILOSTAT is a planned adapter, and the codes read better
as file names: `CHE` reads as Switzerland where `CH` invites confusion with
China.

This entry records a constraint, not a choice that could have gone the other
way. It exists because the question "why three letters" had no written answer.

**Cost.** None beyond the three characters.

**Overturned by.** A primary data source that keys on something else and
outweighs the World Bank in the registry. That would justify an internal ID
with per-source mappings, and this entry should be superseded when it happens.

## D35 — The agenda is computed, and language is an interpretation layer

*Recorded 2026-08-27.*

**Choice.** `pnpm bench agenda` turns each country's scored output into a
capability agenda: a language-neutral JSON in `data/out/agenda/{ISO3}.json` and
one rendered markdown per lexicon beside it. The generator classifies each
dimension by two published thresholds. Confidence below the usable band makes a
dimension a measure-first item, because the score cannot carry a decision.
Usable confidence with a score under 50 makes it a raise item. Raise items name
the three highest-scoring countries whose own evidence is usable, and the
evidence records other countries filed against the dimension's gaps. The
declared gaps across all dimensions form the measurement agenda. The subject
country's own evidence records close the document, outside the numbers, as
always.

Language lives in `packages/core/src/i18n` as lexicons: data files mapping the
model's vocabulary and the agenda strings into one language each. The ground
layer stays English end to end: ids, registry definitions, JSON output. A
lexicon lookup that misses falls back to the registry English, so a partial
lexicon renders complete pages. `pt-BR` is the first lexicon and the template
for the next one.

**Why.** A hand-written national to-do list is advocacy the moment it is
signed, and it goes stale the first time the data moves. A computed agenda is
neither: it regenerates with every run, every claim in it traces to a score, a
gap or a record, and a reader who distrusts a translated page can diff it
against the JSON it renders. Separating lexicon from renderer makes a new
language a data contribution rather than a code change, which is the shape of
contribution the project wants most.

**Cost.** Two thresholds are now product decisions: the usable band already
lives in `confidence.ts`, and the raise cutoff of 50 is a constant in
`agenda.ts` with no empirical basis yet. Evidence record titles and claims
render untranslated inside non-English documents, because records are ground
data. Exemplar selection rewards measured countries: a country with real
capability and thin evidence cannot appear as an exemplar, which repeats the
benchmark's general bias toward the measurable.

**Overturned by.** A reader study or field use showing the raise cutoff
misleads at 50, which would justify deriving it from the score distribution
instead. Records gaining translated fields, which would remove the mixed-language
cost. A lexicon whose translation drifts from the registry meaning, which
would justify review rules for lexicon changes rather than plain PRs.

---

## D36 — A record states where the delivery stands, and a claim can carry two numbers

*Recorded 2026-08-27. Extends D20, D31 and D33.*

**Choice.** Two additions to `EvidenceRecord`.

`status`, required: where the delivery stands as of the record's retrieval
date. One of `operating`, `concluded`, `eroded`, `dismantled`. A reversal is a
record whose status is `eroded` or `dismantled`, tested by `isReversal` from
`@ncb/core`, and `pnpm bench validate` warns when reversals fall below the
one-in-five quota D33 set.

`secondMetric`, optional: a second published number in the same shape as
`metric`, for the claims one number cannot hold. An `eroded` record pairs its
current value with the peak it fell from, and the validator warns when it does
not. A delivery record can pair scale with a cost or schedule figure.

All fifteen records now carry a status: twelve `operating`, two `concluded`
(Plano Real, Luz para Todos), one `eroded` (the immunisation programme, whose
peak of 99 percent in 2003 is now its second metric). Both surfaces that render
records print the status and the second number.

**Why.** D33 requires the corpus to carry its reversals and gave the quota to
the author's discipline, because free text is not countable. That made the
rule's own enforcement section admit the validator was blind to the thing the
rule most cares about. The immunisation record proved the point: its erosion,
the reason it is in the set, lived entirely in `limits` prose and rendered as
"running since 1973" — indistinguishable from Pix.

The second slot exists because the flagship indicator asks for cost and
schedule performance and every record filed against it admits in `limits` that
one scale number cannot show that. One optional slot is the smallest change
that lets a record hold a claim with two sides.

**Cost.**

- Status is a judgement stamped at retrieval time and it goes stale silently.
  A programme dismantled after the record was written still reads `operating`
  until someone edits the file. `retrievedAt` bounds the staleness; nothing
  detects it.
- Four states force real cases into coarse bins. Proálcool nearly collapsed in
  the 1990s and is `operating`; the near-collapse stays in `limits`, and the
  bin says nothing about the path.
- Two metric slots invite cramming. The rule stays one delivery, one record;
  the second slot is for the other side of the same claim, not a second claim.

**Overturned by.** Records that repeatedly need a third number, or statuses
that keep landing in the wrong bin — either means the lifecycle deserves a
dated series, not two stamps, and the slot design should be replaced rather
than extended.

---

## D37 — The output directory describes itself

*Recorded 2026-08-27. Extends D27 and D30; D34 records the country identifier.*

**Choice.** `data/out` becomes a self-describing dataset, built on standards a
consumer's tooling already speaks.

1. **JSON Schema.** `bench score` emits a schema for each published shape into
   `data/out/schema/`: the index file, the country file and the indicator
   view. They are generated from the Zod schemas in
   `packages/core/src/model/schema.ts` by `zod-to-json-schema`, so the Zod
   definitions stay the single source of truth and the emitted schemas cannot
   drift from what the pipeline writes. This is the package's one new
   dependency, taken so the schemas would not be hand-written copies.
2. **Data Package.** `data/out/datapackage.json` is a Frictionless Data
   Package descriptor naming every published file, its schema, its source and
   its license. Standard data tooling can consume the directory from that one
   file.
3. **Semantic versioning.** The dataset carries a version, defined once in
   `packages/core/src/model/version.ts` and stamped into the index, every
   country file and the descriptor. Major = the frame rebased or a published
   field removed, which is the "versioned, announced act" the frame invariant
   already required without naming a scheme. Minor = countries, indicators or
   fields added. Patch = a re-ingest under the same registry. The version
   describes the contract, not the method; KNOWN-ARTEFACTS.md tracks the
   method. First stamped version: 1.0.0.
4. **Data license.** The derived dataset is CC BY 4.0, matching the World Bank
   data it derives from. Stated in NOTICE.md and in the descriptor.
5. **RFC 4180.** `table.csv` now uses CRLF line endings and quotes fields
   containing CR, so it is a conforming file rather than a nearly conforming
   one.
6. **Schema.org.** The viewer's landing page embeds a JSON-LD `Dataset` block,
   which is what dataset search engines index.

**Why.** The project's boundary rule is stable IDs and standard formats,
because the output is meant to be consumed by things this repository does not
know about. Until now that contract lived only in TypeScript types, which a
non-TypeScript consumer cannot read, and the version of what they were reading
was not written anywhere. Each of the six is the smallest standard that closes
one of those gaps. Full SDMX and RDF were considered and rejected as
institutional-publisher machinery; keeping source series codes verbatim as
provenance borrows the useful part.

**Cost.**

- One new dependency in `@ncb/core` (`zod-to-json-schema`), against a standing
  preference for zero. The alternative was a second, hand-maintained copy of
  every published shape, which is the drift this repository's DRY rule exists
  to prevent.
- The version is bumped by hand. A forgotten bump mislabels a release; the
  bump rules sit on the constant to make that harder.
- CRLF in `table.csv` will show as a whole-file diff against the previous LF
  file exactly once.

**Overturned by.** A consumer that standard tooling cannot serve from the Data
Package, which would argue for a real API. Or the schemas drifting from the
files in practice, which would mean generation is wired to the wrong place and
validation of the emitted output should be added to `bench validate`.

---

## D38 — The homepage is global, and one country is a layer on top of it

*Recorded 2026-08-27. Supersedes the focal-case layout noted in D29.*

**Choice.** The homepage no longer leads with one country. It opens on the grid
of every country's shape, sorted alphabetically, followed by the score table and
the confidence table. `FOCUS_ISO3` is deleted from
`apps/web/src/lib/profile.ts`, and the page title asks about a country rather
than this country. `CompareRadar` stays where it belongs: on a country page,
where the reader has already chosen a subject.

The dashed-edge legend and the frame note now ship under the grid. Both were
previously reachable only inside `CompareRadar`, so a reader who never opened a
country page never learnt what a dashed edge meant. `RadarEvidenceLegend` takes
an `interactive` prop, because the grid radars pass no `onSelectDimension` and
the legend was promising a click that is not there.

The method page loses its Brazil bullet too. What that bullet actually argued
is that a frame fitted to one country describes that country, and it makes that
argument without naming one.

A country-specific entry point is a layer above this page, not the spine of it.
It is not built yet.

**Why.** Two readers arrive here. One works inside a country and wants that
country. The other wants to know what the benchmark measures and whether the
method holds. Leading on Brazil served the first and asked the second to read
past a case they did not choose. The grid answers both: it shows nine dimensions
producing 40 different shapes, which is the claim the project actually makes,
and every card is a door into a country. The measurement is global, so the
front door should be too.

**Cost.** The homepage loses its one large, readable radar and the compare
control. A first-time reader now meets the nine axes at icon size and has to
open a country to see the shape drawn with words on it. `DimensionLegend`
carries the names on the grid, and the accessible description in every radar
carries them in full, but that is a legend, not a labelled chart. If the icons
turn out to need a worked example first, the fix is a single labelled radar
above the grid, not a return to a focal country.

**Overturned by.** Use showing readers cannot enter the grid without a worked
example. A decision to make this viewer a country-specific product, which would
put the focal case back and make the global grid the secondary surface.

---

## D40 — A date is metadata, and a document a reader is told to open is a link

*Recorded 2026-08-27. Extends D35.*

**Choice.** Two presentation rules, both applied everywhere a document is
rendered.

A generation date is metadata about the document, so it sits under the title on
its own line and never inside a sentence. The agenda lexicons carry it as
`agenda.generated`, separate from `agenda.intro`, and the renderer prints it as
a dateline: `*Gerado em 2026-08-27 a partir da rodada de dados atual*`. The
viewer prints the same string in the muted metadata size under the page title.
`report.md` splits its dateline off the same way. The intro that follows now
opens on what a score means, which is the first thing a reader needs.

A repository file a rendered document tells a reader to open is a link. The URL
is built by `docHref` in `packages/core/src/model/project.ts`, which also holds
`REPO_URL`, `LIMITS_DOC` and `DECISIONS_DOC`. The agenda intro links
`docs/KNOWN-ARTEFACTS.md`, the report links `docs/DECISIONS.md`, and
`datapackage.json` reads its homepage from the same constant instead of
repeating the URL.

**Why.** "Gerado em 2026-08-27 a partir da rodada de dados atual." read as the
first claim the agenda makes, ahead of the claim about what the numbers are.
Nobody reads a document for its build date.

The linking rule fixes a worse problem. The agenda tells every reader to read
the limits before quoting a number, and it named a path only somebody with a
checkout could open. The instruction was correct and the reader could not follow
it. A published document reaches people who will never clone the repository.

**Cost.**

- `docHref` pins the `main` branch, so a link from an old rendered document
  points at the current file rather than the file that was current when the
  document was written. The alternative, a commit SHA, would make the output
  churn on every run.
- The lexicons carry one more key, and a partial lexicon that omits `generated`
  falls back to English while the rest of the page is translated.
- Markdown emphasis is the whole dateline treatment. A renderer that ignores
  emphasis prints the date as an ordinary line.

**Overturned by.** A viewer page that renders the limits document itself, which
would give the viewer a local target for `{limits}` while the markdown keeps the
repository link. Or a versioned documentation site, which would replace the
branch in `docHref` with a release.

---

## D41 — The pipeline stops discarding its own warnings, and the viewer carries them

*Recorded 2026-08-27. Extends D40 and takes up its overturn clause; extends D12,
D23, D25, D35. Prompted by a full coherence review of the model and the viewer.*

**Choice.** A set of repairs with one principle: a warning the pipeline computes
is published and rendered, and a claim a surface makes is derived from the data
it sits above, never hard-coded beside it.

- `Momentum.clamped` was computed and read by nothing. It now travels:
  `AgendaTrend` carries it, the report marks clamped cells, the agenda documents
  and the viewer print it beside every trend, and the glossary example for
  momentum names it. Brazil's headline "+26.2 on Agency over ten years" carries
  "2 of 4 clamped" everywhere it appears, because part of that delta is boundary
  distance rather than movement.
- Clamping is aggregated. `Diagnostics.outOfFrame` counts clamped cells overall
  and per country, the report prints it, and the diagnostics page renders it.
  12.7% of observed cells clamp in the current run, concentrated in the
  lowest-income extended countries, which is A10 stated as one number.
- Exemplars exclude clamped countries. An agenda offers its exemplars as
  somebody to learn from, and a clamped 100 is partly an artefact of the frame.
- `evidenceElsewhere` matches its contract: records filed against the
  dimension's declared gaps only, not any indicator in the dimension.
- `dataGaps` carries a `status`, so retired indicators stop being reported as
  "no dataset exists". A rejected dataset and a missing one are different
  claims, per D23.
- The report derives its confidence headline instead of asserting "no pair
  reaches the good band" (0.67 crossed the threshold and the sentence shipped
  false). Diagnostics page headings are computed from the tables under them for
  the same reason: two of them had gone stale enough to be wrong.
- The dissent threshold has one home, `DISSENT_IQR` in the model layer.
  `isPanel` is now actually called; the viewer gates every Delphi surface on
  `isEvidential` and presents a non-panel run as "session estimate", never as
  "panel median". A mock run renders nowhere as evidence.
- A failed World Bank fetch carries the previous file's observations forward for
  that series instead of dropping them, so a transient error can no longer be
  written into the revision log as the publisher removing decades of data.
- The viewer renders `docs/KNOWN-ARTEFACTS.md` at `/limits`, in the nav, with
  one anchor per artefact. The agenda's `{limits}` points there in the viewer
  and stays on the repository link in the rendered markdown, which is the split
  D40's overturn clause anticipated and MZ asked for.
- Language switching left the nav. It is one control in the layout header,
  driven by `languageCounterpart` in `apps/web/src/lib/links.ts`, shown only
  where a counterpart page exists. Every URL shape lives in that file again.

Dataset version goes to 1.1.0: fields were added, nothing published moved.

**Why.** The review found the same failure four ways: comments promising what no
code enforced, warnings computed and thrown away, findings hard-coded above the
data that had moved past them, and caveats that stopped at the repository
boundary while the numbers crossed it. Each repair is small; the pattern was
the risk.

**Cost.**

- Computed headings can read awkwardly ("None of nine dimensions..."), and a
  heading that is always true is less quotable than a sharp claim.
- Excluding clamped countries from exemplars can leave a dimension with fewer
  than three exemplars even when well-scored countries exist.
- The carried-forward observations of a failed series age silently until the
  next successful fetch; only the ingest report on stdout says it happened.
- `/limits` renders an internal document written in British English with em
  dashes, against the viewer's copy rules. The renderer converts the heading
  dashes and leaves the body verbatim, because mangling the record would be
  worse than the style breach.

**Overturned by.** A run where the exemplar exclusion empties most dimensions,
which would argue for annotating clamped exemplars instead of excluding them. A
persistent ingest failure record, which would replace the silent carry-forward.

---

## D42 — A candidate is judged on what it does to its dimension, not on its own correlation

*Recorded 2026-08-27. Extends D23; answers A12.*

**Choice.** `bench diagnose` now emits `wealthAttribution`: for every indicator,
its dimension's correlation with log GDP per capita as published, the same
correlation with that indicator dropped from the mean, and the difference. The
diagnostics page prints it, sorted by the indicator that raises its dimension's
wealth correlation most. A candidate indicator is accepted or rejected on that
delta, and no longer on its own correlation alone.

The counterfactual is computed from the matrix rather than read from the
published score, so dropping a row means recomputing the dimension mean exactly
the way `score.ts` does, with missing values dropped and nothing imputed.

**Why.** The existing test asks whether one series tracks income and flags it
above 0.70. That is not the question the benchmark's central claim rests on. A
dimension can hold indicators that each sit under the line and still track
income as a group, and an indicator under the line can still make its dimension
worse.

This was found by making the mistake. A probe of 25 candidate World Bank series,
run to answer A12, produced one usable observable trust measure:
`IC.FRM.CORR.ZS`, the share of firms expected to give gifts to public officials.
It resolves for all ten reference countries, it is behavioural, and it
correlates with log GDP at 0.667, under the line. It was wired, ingested and
scored. It raised Trust confidence for 34 of 40 countries from very thin to
thin, and it moved Trust's own correlation with GDP per capita from 0.385 to
0.619. It was reverted the same session, and 0 of 360 published cells now differ
from before the attempt.

The first run of the new diagnostic then found something the project did not
know. `homicide_rate` raises Trust's wealth correlation by 0.288, from 0.096 to
0.385. It is the largest single wealth contribution in the model, and it is the
indicator D23 added as the observable replacement for the retired perception
composites. `contract_enforcement_days` runs the other way at -0.189: without
it Trust would correlate at 0.573. The dimension the project treats as its most
income-contaminated is contaminated by one row, and that row was added to fix
contamination.

**Cost.**

- The delta is computed against the current country set and moves when countries
  are added. It is a diagnostic and not a threshold, and no rule fires on it.
- It cannot separate an indicator that imports wealth from an indicator that
  correctly measures a capability wealthy countries genuinely have. Homicide may
  be either. The number says where to argue, and it does not settle the argument.
- Nine dimensions times 34 indicators means the dimension mean is recomputed 34
  times per run. It is not measurable next to ingestion.

**Overturned by.** Evidence that a high delta is routinely the right answer,
which would make the diagnostic noise. Or a dimension-level wealth test derived
from a partial correlation rather than a leave-one-out, which would be the
stronger statistic if the country set ever grows enough to support it.

---

## D43 — The country page opens on the agenda, and the split has one home

*Recorded 2026-08-27. Completes D38; extends D35. Originally written as D39, which a
concurrent session overwrote; D39 is deliberately left unused.*

**Choice.** `/country/{ISO3}` opens with a lede computed from
`data/out/agenda/{ISO3}.json`: the strongest dimension where the evidence is
usable, the first dimension the evidence says to raise, the first that cannot be
judged at all, then two lists, raise items lowest score first and measure items
thinnest evidence first. Every entry links to that dimension's section further
down the same page, and the block links out to the full agenda.

The lede selects and never calculates. Every score and confidence it prints
comes straight out of the agenda JSON. The sorting comes from `splitAgenda` in
`packages/core/src/pipeline/agenda.ts`, which `AgendaView` calls as well, so one
function decides which dimension leads and the country page and the agenda
document cannot disagree.

The eyebrow names the country's role in the frame, and the registry `reason`
moves to a quiet line under the agenda. `RAISE_BELOW` is exported, because the
page states the threshold when a country has no dimension above it.

This is the layer D38 said was not built. It is not specific to one country: any
country with an agenda file gets it, and Brazil is only the country somebody
asked about first.

**Why.** A reader landing on a country met a radar and nine tables, and had to
read all nine to learn where to look. The agenda already computed that answer
for the markdown documents and the viewer was not using it. Putting it at the
top costs no new computation and opens the page on a finding. Brazil reads
"Nothing here scores above 50 on evidence strong enough to act on", which is the
honest headline for that country and was previously buried nine sections deep.

**Cost.**

- The lede repeats what the sections below say. A reader who scrolls meets each
  named dimension twice.
- `hold` is a real agenda kind with no list of its own here. Only the top one
  appears, in the first sentence, so a country with eight holds shows one.
- The threshold sentence prints `RAISE_BELOW` as a bare number, so a reader can
  meet 50 before meeting the frame note that says what 0 to 100 means.

**Overturned by.** A country page that reads better with the shape first and the
agenda second, which would move the block under the radar. Or a `hold` list long
enough to deserve a column of its own.

---

## D44 — The homicide rate is retired, because it was the wealth signal it was hired to remove

*Recorded 2026-08-27. Supersedes the Trust half of D23. Evidence from D42.*

**Choice.** `homicide_rate` becomes `ingest: 'retired'`. The row stays, is never
fetched or scored, and lowers confidence exactly as a gap does.

**Why.** D23 added it as the observable replacement for two retired WGI
perception composites, on the argument that it is counted by police and health
systems rather than reported as an opinion. D42's leave-one-out diagnostic then
measured what it actually did to the dimension. It raised Trust's correlation
with log GDP per capita by 0.288, from 0.096 to 0.385, the largest single wealth
contribution anywhere in the model. Removing it moves Trust to 0.097 and changes
no other dimension.

The objection is not to the dataset, which is sound, and not to the reasoning in
D23, which was right about the difference between an outcome and an opinion. It
is that across this country set the variation homicide carries is mostly income.
Homicide is driven heavily by organised crime, and a society can be physically
safe while trusting very little. The benchmark exists to show that capability is
a separate property from wealth, and this row was quietly arguing the opposite.

**Cost.** Trust now has one observed indicator of seven, `contract_enforcement
_days`, frozen at 2019, and its confidence falls from 0.191 to 0.079. The
dimension is now honestly unmeasured where it was previously measured wrongly.
That is a worse-looking model and a truer one, and it forces D45.

**Overturned by.** A country set wide enough that homicide stops tracking
income, which would mean the correlation was an artefact of ten reference
countries. Or a behavioural trust measure landing beside it, which would let the
dimension carry homicide without homicide carrying the dimension.

---

## D45 — A dimension with fewer than two observed indicators publishes no score

*Recorded 2026-08-27. Answers the question A12 left open. Forced by D44.*

**Choice.** `MIN_INDICATORS_FOR_SCORE` is two, in
`packages/core/src/pipeline/score.ts`. Below it `DimensionResult.score` is null,
`belowCoverageFloor` is true, and `observedIndicators` says how many there were.
Two is the same minimum D20 requires before a gap is promoted to a scored
indicator, so the model uses one number for the same idea.

Confidence, the indicator rows, the evidence records and the trend all still
publish. What is withheld is only the average.

Three surfaces changed with it. The radar leaves an unmeasured axis empty and
closes the shape across the gap, where before it plotted the missing value at
the centre and drew a country as catastrophically weak on a dimension nobody had
measured. `DimensionScore` in the viewer prints "not measured" with the
indicator count on hover, so the reason is available rather than implied. The
flat table and the country tables read from it.

This withholds 84 of 360 published cells: Coordination and Trust for all 40
countries, plus Experimentation for one country and Shared Purpose for three.

**Why.** Coordination printed 46.7 for Brazil off a single border-time measure
frozen at 2019, and moved from 15.5 to 46.7 without anything changing in Brazil.
A12 recorded that as an artefact and mitigated it with a dashed edge and a
confidence band, then said plainly that the mitigation is not a fix. A mean of
one number is not a measurement of a dimension. Printing it invites exactly the
decision the evidence cannot carry, and the display treatments were asking the
reader to discount a number the model should not have offered.

**Cost.**

- Two of nine dimensions now show nothing for every country. A reader meeting
  the benchmark for the first time sees a seven-sided shape and has to learn why.
- `blendedScore` falls back to the panel when the floor withholds a score, which
  is a wider fallback than the invariant described. The panel guards still hold:
  a non-evidential run is never presented as evidence.
- The floor is a count and ignores what the indicators are. Two weak indicators
  pass and one strong one does not.
- Comparisons against anything published before today lose two dimensions.

The dataset goes to 2.0.0. D37 reserves major for a rebased frame or a removed
field, and neither happened here. But a consumer parsing `score` as a number now
gets null for 84 of 360 cells, which breaks them exactly as a removed field
would. The rule is about what breaks a reader, so the version follows the break.

**Overturned by.** Replacement indicators landing in Coordination and Trust,
which is what A12 asks for and would make the floor moot for them. Or evidence
that readers treat an empty axis as a zero anyway, which would mean the
withholding needs words on the chart and not only in the table.

## D46 — A case study is an address, and the list of them is a filter

*Recorded 2026-08-27. Extends D20 and D33.*

**Choice.** Every evidence record gets its own page at `/patterns/{id}`, and the
`/patterns` index becomes a filtered view over the corpus.

`evidenceHref` in `apps/web/src/lib/links.ts` now writes `/patterns/nld-delta-programme`
instead of `/patterns#nld-delta-programme`. The record id is the slug, so the
address is already in the data and no second identifier exists. The record page
carries the full record, the indicator it bears on, and two related lists: the
other deliveries from the same country, and the same indicator in other
countries.

The index keeps its dimension grouping and gains five controls: a text search
over the title, claim, limits, mechanism, preconditions, country and publisher;
a country select; a dimension select; a status select that also offers
reversals as one class; and a switch for records that carry a mechanism.

The filters are the query string, `?q=`, `?country=`, `?dimension=`, `?status=`
and `?mechanism=1`. `readPatternFilters` and `patternsHref` in
`apps/web/src/lib/links.ts` parse and build that shape, and both the server page
and the client view use them, so the address is read where it is written. The
page reads `searchParams` and renders the narrowed list, which means a shared
link shows what the sender saw with no client round trip. Each control change
rewrites the address with `history.replaceState`, so a keystroke never reaches
the server. Unrecognised values are dropped and the full list renders.

One card renders in both places. `apps/web/src/components/PatternCard.tsx` holds
the metadata line, the metrics line, the mechanism block and the limits line,
and the index and the record page both read from it.

**Why.** The corpus reached 33 records across 19 countries, and an anchor into
one long page is not a citable thing. A reader who wants to send somebody the
Delta Programme record sends a whole page and a scroll position, the browser
lands them mid-list with no context above the fold, and a search engine indexes
one page for 33 deliveries. D33 asks the corpus to carry its reversals, which
only works if a reversal can be pointed at.

The filters follow from the same growth. Grouping by dimension was enough at
nine records. At 33 the reader has a question, usually about one country or one
kind of loss, and scrolling is the wrong answer to it.

**Cost.**

- Any link written against the old anchor form now lands on the index without
  scrolling. Nothing outside the viewer wrote one, and `evidenceHref` was
  already the only place that built it.
- The index sends the whole corpus to the browser to filter it. At 33 records
  that is small, and it will not stay small. The filter state is in the URL
  already, so moving the filtering to the server is the next move and needs no
  new contract.
- `replaceState` keeps 30 filter changes out of the history stack, and the cost
  is that the back button does not step through them. It leaves the page.
- The query string is a published surface now. Renaming a dimension id or a
  status value breaks a link somebody saved.
- Two more routes to keep in `outputFileTracingIncludes` reasoning. Both read
  `data/evidence`, which is already listed.

**Overturned by.** The corpus growing past the point where shipping it to the
browser is reasonable, which makes the index a server-rendered list reading the
same query parameters. Or evidence that readers never use the
record pages, which would mean the anchor was enough and the cost was the two
extra clicks to reach a mechanism.

---

## D47 — Every country sets the frame it is scored against

*Supersedes D16. Recorded 2026-08-27.*

**Choice.** An indicator's Tukey fences and its 0 and 100 endpoints are computed
over **every country in the benchmark**. There is no reference set and no
extended set. The `frame` field is gone from `packages/core/src/model/countries.ts`,
and `REFERENCE_ISO3`, `EXTENDED_ISO3` and `COUNTRY_FRAMES` are gone with it.
`buildFrame` takes all transformed values.

Stability moves from a privileged subset to the version number. The frame holds
still inside a published dataset version. Adding a country rebases the frame,
restates every score, and takes a **major** bump. That amends the D37 bump
rules: a country addition is no longer minor.

**Why.** D16 bought comparability across runs by scoring 30 countries against a
ruler built from the other ten. That is a measurement claim the data cannot
support. A country measured against a frame it is absent from is not being
placed among its peers; it is being told its distance from ten countries chosen
in the prototype to expose contrasts. When the value falls outside their range
the number stops being a measurement at all and becomes the sentence "beyond
these ten", written as 0 or 100.

D27 already recorded the cost arriving: 165 of 1,303 observed cells clamped,
12.7 percent, concentrated in Ethiopia, Nigeria, Rwanda and Kenya. A10 said
watch the flag. The flag was firing on one seventh of the low-income evidence.
The stability D16 protected was real, but it was the stability of a scale that
had stopped describing a third of the countries on it.

**What the rebase did.** At 40 countries, 356 of 360 dimension cells moved. The
mean move is 3.8 points and the largest is 21.7 (South Africa, Agency). Clamped
current cells go from 165 to **0**, which is now structural: a value cannot fall
outside a frame its own country helped build.

**Cost.**

- **Every published number from 2.0.0 is restated.** The dataset is 3.0.0 and
  the two are not comparable. Anything quoting a 2.0.0 score is stale.
- **Every future country addition is a rebase.** This is the guarantee D16
  bought, given up on purpose. Adding a country is now announced, versioned and
  followed by a full rescore, and it can no longer be a side effect of loading
  data.
- **Correlation with income rose.** Anticipation 0.85 to 0.87, Agency 0.79 to
  0.81, Building 0.56 to 0.59, Experimentation 0.40 to 0.52, Shared Purpose 0.33
  to 0.46. Unclamping the low-income countries restored their spread, and that
  spread is largely income-ordered. The clamp had been hiding the strength of
  A3, not weakening it. No dimension pair passes the redundancy threshold, so
  D27's finding survives the rebase.
- **`outOfFrame` now means something narrower.** A current cell cannot set it.
  It fires on history scored against the current frame, where it still carries
  the trend caveat: 53 of 485 momentum baskets hold a clamped member.
- The frame is now sensitive to which countries happen to be loaded, which is
  what D2 was criticised for. The difference is that the sensitivity is
  declared, versioned and rescored rather than silent.

**Overturned by.** Absolute anchoring per indicator, which would remove the
country set from the scale entirely and make a score comparable across
versions. It needs a defensible floor and ceiling for each of the 33 scored
indicators, hand-set and defended one at a time, and it trades a frame that
describes this set for one that describes a claim about the world.

---

## D48 — The panel column takes the same wealth test as the indicators

**Choice.** `diagnostics.json` gains `panelVsGdp`. It correlates the published
`delphiScore` column with log GDP per capita, dimension by dimension, and prints
the indicator score for the countries the panel covered beside it. The
`WEALTH_CORRELATION_THRESHOLD` of D42 flags a dimension the same way it flags an
indicator. `backfillCandidate` marks the dimensions that publish no indicator
score at all, because those are the only places a panel estimate could become
the published number. A run that is not evidential reports its provenance and no
rows: correlating mock estimates would produce a figure that reads as a finding.

**Why.** The panel was described as evidence the indicators cannot reach. It is
not independent evidence. A language model reads the same published record the
indicators are drawn from, plus press coverage, so the perception layer D23
retired can return through the panel wearing a new name. D42 tests that
mechanism on indicators and nothing tested it on the panel. Every Delphi surface
gated on provenance and panel size, which are questions about who produced the
number, and none asked what the number tracks.

**What it found, on the run active today.** The `in_session` run, one panelist,
16 countries. Eight of nine dimensions of the panel column correlate with log
GDP per capita at or above 0.70: Adaptability 0.93, Learning 0.92, Anticipation
0.91, Coordination 0.86, Building 0.84, Trust 0.83, Agency 0.80, Experimentation
0.77. Shared Purpose is the exception at 0.55. On Learning the panel is 0.15
above the indicators for the same countries, on Experimentation 0.14, on Shared
Purpose 0.20.

Coordination and Trust are the finding. Neither publishes an indicator score
under D45, so the panel is the only candidate for filling them, and the panel
column on both sits above the line that retired the Worldwide Governance
Indicators. Filling those two dimensions from this panel would restore the
measurement D23 removed.

**Cost.** One correlation per dimension, and a section in the report and the
diagnostics page that says the panel layer fails its own test. n is 16 and the
panel is one analyst, so this is a hint under A8 and not a result. It is enough
to stop the backfill and not enough to condemn a gateway panel that has never
been run.

**Overturned by.** A gateway run whose panel column holds under 0.70 on the
dimensions the indicators cannot measure. That is the evidence that would let a
panel estimate carry a dimension, and this diagnostic is how it gets checked.

## D49 — The fetch describes itself once, and the viewer prints that description

*Recorded 2026-08-28. Extends D37 and D40.*

**Choice.** How a value reaches the dataset is declared in
`packages/core/src/model/sources.ts` and nowhere else. The file holds the API
base, the World Bank database ids with what a reader must know about each, the
first year every series is asked for, the reader-facing label for each ingest
route, and the request builder. `pipeline/ingest.ts` builds its calls from it.
The new `/sources` page prints the same call and groups the registry by
publisher from the same file.

**Why.** Provenance was published per indicator and nowhere in aggregate. The
registry row carried a publisher and a link, the method page ranked source
tiers by weight, and neither told a reader that 31 of 67 indicators come from
one API, that eight World Bank series sit in the registry unscored, or which
database a series needs. That last one is not decoration: the v2 API answers
"indicator not found" for a code outside World Development Indicators when the
request carries no `source` parameter, and until now that fact lived only in
`AGENTS.md`, where no reader of the site can reach it.

The alternative was a hand-written sources page. A page that describes a fetch
in prose drifts from the fetch on the first registry change, and the drift is
silent because nothing compiles the prose. Declaring the shape once and
generating the page keeps the two in step by construction, which is the same
argument D40 makes for building document links from `project.ts`.

The data package descriptor also stops hand-listing its sources. It now names
every publisher that supplies a value, from the same function, so a publisher
that starts supplying one appears in the machine-readable descriptor without
anybody remembering to add it.

**Cost.** One more file in the model layer, and a page that reads
`data/out/indicators/*.json` to count what each publisher currently supplies.
That is 39 small reads on one page, against the country files D27 forbids.
`WB_DATABASES` and the trap table in `AGENTS.md` now say overlapping things and
have to be kept in step by hand.

**Overturned by.** A second ingester. The World Bank shape is generalised in
`sources.ts` only as far as one publisher needs, and an ILOSTAT or OECD adapter
would want a per-publisher description rather than a World Bank one with other
publishers listed beside it.
