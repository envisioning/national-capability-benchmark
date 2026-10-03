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

## D50 — The falsification conditions are an index, not a second document

*Recorded 2026-08-28. Extends D40 and D49.*

**Choice.** The site gets a `/challenge` page, and everything on it is derived.
The open artefacts come from the severity line of each entry in
`docs/KNOWN-ARTEFACTS.md`. The falsification conditions come from the
**Overturned by** clause of each entry in `docs/DECISIONS.md`, newest first.
`apps/web/src/lib/docs.ts` does the reading. Neither document gains a summary
of itself, and the page holds no claim that is not already in one of them.

The footer carries the same idea in one line on every page: the dataset
version, a link to the challenge page, the repository and the license split.

**Why.** Phase one of this project asks researchers to try to falsify the
framework. Until now the site invited that in prose and offered no way to do
it: no repository link outside a document body, no issue route, no citation
string, and no version stamp a reader could quote with a number. The material
for all of it already existed. Every decision has stated what would overturn it
since D1, and `CONTRIBUTING.md` has stated the four contribution routes and the
two-country rule for a gap. None of it was reachable from the viewer.

Hand-writing the list was the obvious alternative and the wrong one. A
hand-written index of 48 falsification conditions is stale on the next appended
decision, and the failure is silent. Deriving it means a new decision reaches
the challenge page in the same commit that records it.

**Cost.** A markdown parser for a subset of a subset: the entry heading and two
labelled paragraphs. It reads `**Overturned by.**` and `**Severity:`, so an
entry that renames either label drops off the page without erroring. The
`docs/` writing convention is now load bearing in the viewer, which it was not
before, and the two labels are checked nowhere.

**Overturned by.** A decision entry that needs more than one falsification
condition, or an artefact whose severity is a judgment rather than a word. Both
would mean the structure belongs in data rather than in prose, and the entries
would move to a file the documents render from instead of the other way round.

## D51 — Latin America is covered whole, not sampled

*Recorded 2026-08-28. Applies the D47 bump rules: dataset 4.0.0.*

**Choice.** Every sovereign Latin American country is in the benchmark:
Bolivia, Paraguay, Ecuador, Venezuela, Panama, Guatemala, Honduras,
El Salvador, Nicaragua, the Dominican Republic, Cuba and Haiti join the eight
already present, for 20 of 52 countries. `LATAM_ISO3` in
`packages/core/src/model/countries.ts` is the one definition of the region,
and the Portuguese edition renders the whole set.

**Why.** The project's first field case is Brazil and its first institutional
audience is Brazilian and regional (see docs/WHY.md). A regional comparison
sampled at eight countries invited the question "why these eight" from exactly
the audience the work is for. Covering the region whole removes the selection
question, makes the benchmark legible to regional institutions, and puts the
frame's floor where the region's hard cases are: Venezuela, Cuba, Haiti and
Nicaragua enter with thin statistics, and publishing them as thin evidence is
the honest version of the claim.

**What the rebase did.** At 52 countries, 232 of 276 comparable dimension
cells moved against 3.0.0. The mean move is 3.5 points and the largest is 20.3
(Philippines, Agency, 14.2 to 34.5). Brazil moves on six of its seven scored
dimensions, Agency most (48.8 to 59.6): the frame now contains the region's
weaker states, so middle positions rise. The 3.0.0 numbers are not comparable
to these. Every country still scores at least five of nine dimensions, and 0
of 1,604 observed cells clamp.

**Cost.** Twelve countries with weaker statistical systems thin coverage at
the low end: GEM still covers 16 of 52, and the mean move above rests only on
the cells scored in both versions. The ingest itself was clean, 7,411 values
added with 0 failures and 0 restatements. Sparse-data countries render mostly
dashed radars, which is the design working, and A10's warning stands: 52
countries are still not the world.

**What would overturn it.** Evidence that thin-coverage countries distort an
indicator's Tukey fences enough to change well-evidenced countries' readings,
or a regional dataset that covers the twelve better than the World Bank does.

## D52 — A candidate series is tested before it becomes a registry row

*Recorded 2026-08-28. Extends D23 and D49.*

**Choice.** `pnpm bench probe --series a,b[@db]` fetches candidate World Bank
series against the live country set and reports four things per candidate:
coverage, latest year, spread, and correlation with log GDP per capita. A
candidate passes when it covers at least half the country set, carries a value
no older than eight years, holds at least three distinct values, and correlates
with income below the same 0.70 the diagnostics use. The probe writes nothing.
It fetches, prints and exits, so it can run while other work is in flight.

**Why.** The test already existed and lived in people's heads. A12 records a
25-series probe done by hand against the ten countries of the original
prototype, and D44 retired the homicide rate after wiring it, scoring it and
reading the diagnostic afterwards. Wiring first and testing later costs a
rebase every time it goes wrong, and the country set has since grown from ten
to 52, which invalidates the coverage half of every earlier hand probe.

A pass is not a decision. Coverage, recency, spread and the wealth test are
necessary and nowhere near sufficient: what the series measures is the argument,
and that stays a judgment recorded here. The probe exists to stop that argument
being had about a series that has 6 countries or is income wearing a hat.

**Cost.** One more pipeline module and a command. The thresholds are constants
in `pipeline/probe.ts` and they are arbitrary in the same way every threshold
in this project is: defensible, not derived. A candidate that fails coverage
today can pass after the publisher's next round, so a failed probe dates.

`--search` reads the publisher's own catalogue of about 30,000 series by name,
so a candidate list starts from what exists rather than from memory. A name
absent from the catalogue is absent from the API at every database id, which is
how a gap gets recorded as unfillable rather than untried.

**Overturned by.** A second ingester. The probe speaks World Bank, and the
series that would fill Coordination and Trust are the ones the World Bank does
not publish, so its long-term job is to be generalised or retired.

## D53 — The radar answers a pointer, and it has no resting number

**Decision.** The radar carries its own interaction layer and its own readout.
Each of the nine axes owns a sector of the chart as a hit target. Pointing at a
sector raises that axis and steps the other eight back, and the number, its
confidence and the dimension's question print under the chart.

The readout always shows an axis and never nothing. It opens on the first axis
in the fixed dimension order, hover previews another, and leaving the chart
returns it to the last axis the reader chose. Every row is always drawn at a
fixed height, so the block is the same size before, during and after a hover.
Hover and click land on the same axis: a click moves the readout and opens the
comparison panel for the dimension the readout is showing.

A finger reads on the first tap and opens the panel on the second. A keyboard
reaches the axes as one tab stop and moves between them with the arrow keys.
The chart's accessible name is an `aria-label`, not an SVG `<title>`, because a
`<title>` renders as a native tooltip over the shape it names.

**Why.** The chart showed nine numbers and printed none of them. A reader who
wanted one had to find the country table further down the page, match a row by
name and lose the shape while doing it. Every number was already on the page
and none of them was reachable from the picture that plotted it.

The hit target is a sector rather than a vertex because a vertex is two pixels
wide. Under a finger it is smaller than the contact patch, and a chart that
cannot be read by touch is not readable on the device most Brazilian readers
will open it on.

The opening axis is a position in the fixed dimension order and never a summary.
The obvious thing to put under a radar at rest is the mean of its axes, and that
is the headline score this benchmark refuses to publish. Nine dimensions at
equal weights average to a number that ranks countries, which is the claim D16
and D47 exist to withhold. So the readout starts on one dimension out of nine
and says which one it is.

Confidence stays a separate statement inside the readout. The score prints
through `Score`, the confidence prints through `ConfidenceBar` beside it with
its band named, and neither is folded into the other.

**Cost.** `Radar` is now a client component, so every page that draws one ships
it. The grid pages draw 52 of them and pass `interactive={false}`, which keeps
them as pictures inside their links: a hover readout there would compete with
the navigation the card exists for, and 52 readouts would add 52 reserved
blocks to a page that is meant to be scanned.

The readout is a fixed block under every interactive radar whether or not
anybody points at it, and its question line is sized for two lines in both
lexicons. A readout that grew and shrank would drag the page under the pointer
and make the next axis harder to hit than the last one, so a row that is
sometimes half empty is the cheaper of the two failures.

**Overturned by.** Evidence that readers want the numbers printed on the chart
itself. Nine labels on a 260 unit square collide at the sizes this chart is
drawn at, which is why they are not there, but a larger chart on the country
page could carry them and would make the readout redundant.

## D54 — An institution map explains capability and never scores it

*Recorded 2026-08-28. Extends D20, D31, D35 and D46.*

**Choice.** Each country may publish one institutional capability network at
`data/institutions/{ISO3}.json`. The schema is shared across countries and
separates organisations, typed relationships and territorial coverage. A node
records the organisation's legal nature, roles, level of government, source
and the NCB dimensions it helps a reader investigate. An edge always has a
direction, a named relation and its own source. There is no generic
`connected_to` relation.

Official registers provide the structural skeleton where they exist. Brazil
uses SIORG for the federal executive and the São Paulo government directory
for the state executive. A curated overlay adds the institutions those
registers omit and the relationships an organisation chart cannot express:
Congress, courts, prosecutors, audit, funding, regulation, data, training and
cross-level delivery.

The layer has its own experimental version. It does not change
`DATASET_VERSION`, any `DimensionResult`, a score or confidence. A direct link
from an institution to an NCB dimension is navigation, not a point or a weight.
The evidential path stays the one D20 established: an institution participates
in a documented delivery, the delivery bears on a declared indicator gap, and
that indicator belongs to a dimension.

Brazil begins with a federal baseline, São Paulo as the first state pilot and
the municipality of São Paulo as the first municipal connection. Every state
and the Federal District is present in the coverage plan from the first file,
so the pilot cannot quietly become the scope. Display text is Portuguese for
the Brazilian page, while ids, enums and English ground-layer descriptions
stay language neutral and translations stay in `packages/core/src/i18n/`.

**Why.** The evidence records name actors only inside prose. That is enough to
document one delivery and not enough to answer which institutions hold the
same capability, which constraints reach them, or what another country would
need to reproduce the arrangement. Turning every organisation into an
indicator would make the score reward documentation density. Leaving them in
paragraphs makes the institutional mechanism impossible to traverse.

A complete force-directed diagram was the obvious first interface and is not
the one published. At 47 nodes and 64 relationships it is already a hairball.
The viewer opens on one institution, draws its immediate network and lists all
of its relationships in words. The directory keeps the whole set reachable,
and the data keeps the whole graph available for later views.

**Cost.** The capability overlay is curated and therefore contestable. SIORG
can tell the project that an entity is linked to a ministry; it cannot decide
that an audit relation matters to Trust or that a training organisation bears
on Learning. Those mappings need sources, review and dates, and the first file
is deliberately incomplete outside the federal backbone and São Paulo.

The schema can record that a relation exists but does not yet record its legal
scope, intensity or historical intervals. `funds` can therefore describe a
standing funding channel without saying how much moves through it, and two
lines with the same verb can carry very different practical weight.

**Overturned by.** A cross-government official register that publishes the
same organisations and capability relationships with stable identifiers, or a
cross-country construction whose network measures survive differences in
documentation coverage. The first would replace the curated skeleton. The
second would justify considering a network measure as evidence, but it would
still need a separate decision before entering any score.

---

## D55 — Budget execution is the first API-backed Coordination replacement

*Recorded 2026-08-28. Extends D45 and D52. Evidence from the World Bank probe
and the 4.1.0 ingest.*

**Choice.** Add `budget_execution_fidelity` to Coordination using World Bank
series `GF.XPD.BUDG.ZS`. The series measures primary government expenditure as a
proportion of the original approved budget. The registry applies a new
`distance_from_100` transform and scores the absolute distance from 100 with
`lower_better`, so both underspending and overspending count as deviation.

The series covers 44 of the 52 countries, reaches 2024, and correlates with log
GDP per capita at 0.285 in the pre-wiring probe. After ingest, it gives 44
countries a second observed Coordination indicator beside border compliance
time. Those countries now receive a Coordination score under D45. The dataset
version moves from 4.0.0 to 4.1.0 because an indicator was added without adding
a country.

**Why.** A country has to carry approved plans into actual spending before it
can coordinate public action. This is an observable administrative result, and
the API is reproducible. It also improves coverage without restoring the WGI
perception composites that made Coordination track income.

**Cost.** Budget execution is still a proxy. A close match between planned and
actual spending does not show that agencies agreed on an objective, delivered
it, or produced a useful result. The series has uneven country coverage, its
latest value varies by country, and the score remains thin because Coordination
still has six other gap or retired rows. The absolute-distance transform is a
modelled choice: a small deviation may be healthy under a shock, while a value
near 100 may hide poor delivery against a badly designed budget.

Generative estimates remain a separate layer. A gateway or in-session Delphi
run may estimate Coordination and Trust where indicator evidence is missing,
but generated values stay in `delphiScore` and `blendedScore`; they never enter
`DimensionResult.score`, the observation file, or confidence. A real gateway
run requires `AI_GATEWAY_API_KEY` and multi-vendor panel configuration. A mock
run exercises the pipeline and is not evidence.

**Overturned by.** Cross-country delivery evidence showing that budget
execution fidelity has little relationship to the ability of independent actors
to complete shared objectives, or a better comparable indicator that measures
joint delivery directly and survives the same wealth-attribution test.

---

## D56 — The institution map reads as a directory and a relation ledger, never as a drawn network

*Recorded 2026-08-28. Supersedes the interface D54 described. Extends D26, D35
and D53.*

**Choice.** The institution page publishes no node-link diagram. It publishes
three surfaces, each answering one question.

The directory comes first. Filters by name, level and system, then cards
grouped by system, each card carrying the institution's level and its number of
recorded relations. The reader arrives with a name in mind, so the name is the
entry point.

The profile follows, and its relations render as a ledger rather than a
picture. Every relation belongs to exactly one of four families declared in
`INSTITUTION_RELATION_FAMILY` in `packages/core/src/model/institutions.ts`:
authority, control, funding and joint work. The families render in a fixed
order, and a family with no relation prints that it has none, because an
absent relation is a fact about the map. Within a family, incoming relations
sit left of a vertical spine and outgoing relations sit right of it, so every
line reads left to right in the direction of its own relation and the verb
always takes its active form. The geometry supplies the subject.

Nothing on the page is laid out by hand. Every surface derives from counts, so
a country with 12 institutions and a country with 400 render through the same
code. Institution names live in wrapping DOM text and never inside a
fixed-width SVG rectangle.

Language reaches the view as one `lex` prop, as D53 already requires of the
radar. The institution vocabulary moved out of `institutions-pt-br.ts` and into
`Lexicon.institutions`, so both lexicons carry it and a second country in a
second language changes data rather than components. Only the per-institution
summaries and the scope sentence stay in the country file, because they
describe one country rather than the shared model.

**Why.** D54 already recorded that a complete diagram of 47 nodes and 64
relationships is a hairball. The published overview grid was that diagram with
a grid substituted for a force layout, and it inherited the same failure. Its
plane encoded only system membership, which each box label already stated. Its
64 lines rendered 13 different relation verbs identically, so the picture
asserted only that the institutions are connected, which curation guarantees.
Two nodes held 33 of the 128 relation endpoints, so the layout spent its whole
canvas drawing the spokes of a star. Node labels ran at 9px and truncated at 16
characters, below anything in the type scale, and the mobile branch rendered no
diagram at all.

The families are the move that makes the ledger carry information a list of
lines could not. They match the three questions the page headline already
asks, and they let an empty band speak: BNDES exercises one relation and
receives three, and the ledger shows that shape at a glance.

The same day this was recorded, the Brazilian file grew from 47 institutions
toward a curated entry for every state. A layout with hard-coded columns and
fixed box heights would have broken on that growth. A count-derived layout did
not.

**Cost.** The page no longer offers any single picture of a whole country's
wiring. A reader who wants to see the shape of the state as one object has to
assemble it from profiles. The system-by-system relation matrix is the intended
answer and is not built: in the current Brazilian file 30 of its 100 cells are
filled, which is dense enough to read and sparse enough to be legible, but it
is a separate change.

The `level` enum still carries Brazilian assumptions in what its four values
mean. Germany, the United Kingdom and a European Union member state each divide
government differently, and `external` describes a different relationship in
each. The enum survives the first international map only because the labels are
now a lexicon lookup.

**Overturned by.** A country map whose relation set does not sort cleanly into
the four families, which would mean the families encode Brazil rather than the
model. Or evidence from readers that the whole-network shape is the question
they arrive with, which would make the matrix the page's first surface rather
than its missing one.

---

## D57 — Trust is two families, and it publishes nothing until both are answered

*Recorded 2026-08-28. Extends D20, D23, D44 and D45. Adds the indicator family
to the registry.*

**Choice.** Trust means the expectation that people and institutions behave
reliably outside close personal networks. That is two questions, not one, and
the registry now says so. Every Trust row carries a `family`: `social` for
generalised interpersonal trust and trust in strangers, `institutional` for
confidence in government, courts and the civil service, contract enforcement
time and court case clearance. `court_case_clearance` is added as a gap in the
institutional family, because D23 named court throughput as the observable
replacement for the two retired WGI composites and nothing has filled it since.
`homicide_rate` stays retired and stays untagged: D44 retired it because it
belongs to neither family.

The family weights nothing. Scoring stays the equal-weight mean of whatever is
observed, and the coverage floor from D45 still decides whether a dimension
publishes. The family is a diagnostic. `familyBalance` in
`packages/core/src/pipeline/diagnostics.ts` reports, per dimension that declares
families, how many indicators each family holds, how many are observed, and how
many scored countries rest on a single family. The report and the diagnostics
page render it.

A first credible Trust score is one harmonised social measure plus one
comparable institutional-performance measure. Until both exist across enough
countries, Trust publishes no score.

**What this rules out.** The WGI rule of law and control of corruption
composites stay retired: they correlate with each other above 0.95 and with log
GDP per capita at 0.83, and they are one measurement wearing two names. Homicide
stays retired: physical safety is not trust, and D42 measured it adding 0.288 to
this dimension's wealth correlation. `IC.FRM.CORR.ZS` is ineligible on its
definition, which asks a firm what it believes firms *similar to itself* pay,
so it records belief rather than experience. No synthetic or model-generated
value ever becomes an observation.

`IC.FRM.BRIB.ZS` is the one Enterprise Survey series this decision does not
reject on its definition. It asks whether the responding firm was itself asked
for a bribe across six public transactions, so it records experience. It covers
49 of 52 countries, 44 of them at 2023 or later. It is admissible as a secondary
behavioural check and it is not admissible as the Trust score, because a
rank-normalised estimate puts it at about 0.66 against log GDP per capita on its
own and puts the two-indicator dimension at about 0.53, against 0.14 for
contract enforcement days alone. That is a larger wealth contribution than the
one D44 retired an indicator over. Scoring Trust with it would clear the
coverage floor by re-creating A3 and A4.

**Why.** Trust was the one dimension where the fastest route to a published
number was also the route that would make the number wrong, and the pressure to
take it came from the empty axis rather than from any evidence. Writing the two
families into the registry makes the empty axis legible: it is not that Trust
has one indicator, it is that Trust has one family answered and one family with
no data at all. It also states the acceptance test in advance, so a future
series is judged against a written contract instead of against the wish for a
complete radar.

The families exist as a diagnostic rather than as a weight because weighting
them now would be a second unevidenced choice on top of a thin dimension. Three
correlated survey items counted as three independent signals is a real problem,
and it is a problem that starts when the data arrives. The count is published
first so the weighting decision, when it comes, can cite it.

**Costs.** One more gap row lowers Trust's confidence again, which is correct
and reads as a regression to anybody who has not read this entry. The family is
a free-text field on the registry, so a typo makes a new family silently.
Nothing validates the vocabulary, because a fixed enum would have to guess the
families of eight other dimensions that have not needed them yet.

**Overturned by.** A harmonised social-trust series and a comparable
institutional-performance series that together clear the floor, whose combined
dimension survives the D42 wealth-attribution test. That closes the decision by
satisfying it. The decision is wrong instead if the two families turn out to
correlate above the redundancy threshold once both are measured, which would
mean Trust asks one question after all and the split encodes a distinction the
world does not make.

---

## D58 — The country's wiring is a system matrix, and its ramp is fixed rather than fitted

*Recorded 2026-08-28. Completes D56, which named this surface and did not build
it.*

**Choice.** The institution page publishes one picture of a whole country: a
matrix counting the relations that run from every system to every system, ten
by ten, including the diagonal. `buildInstitutionMatrix` in
`packages/core/src/pipeline/institutions.ts` computes it, and
`INSTITUTION_SYSTEMS` in the model fixes the axis order so two lexicons cannot
present the same matrix with its rows in different places. Nothing here reaches
a score, a confidence or `data/out`.

A family filter narrows the count to authority, control, funding or joint work,
which is where the matrix earns its place: the four families run through
visibly different cells, and the whole-map view hides that.

The matrix owns its readout, the way the radar does. It always reads one cell,
it opens on the busiest cell rather than on nothing, and the readout names both
institutions in every relation as links into their profiles, so the matrix is a
way into the map and not only a summary of it.

The ramp is three fixed breaks on the count: one, two to four, five or more.
Colour never encodes the number, which is printed in the cell; it encodes
whether a channel is busy. The ramp is the score ramp with its lime top
removed, because a hundred lime cells would spend the single accent this page
has.

**Why.** Terciles were tried first and are wrong for this quantity. Relation
counts are one spike at 1 with a thin long tail: in the current Brazilian map 13
of 33 filled cells hold exactly one relation and the busiest holds 52. Cutting
at terciles left the bottom band empty, put 2 and 52 in the same band, and gave
the joint work view a single band covering 1 to 26. A fitted ramp also moved
whenever the family filter changed, so the same colour meant a different
quantity one click later.

Fixed breaks are available here in a way they are not for a score. A count is
absolute. One relation is one relation in every country, while a score is a
position inside a frame that a new country rebases. So the ramp holds still
across families and across countries, and two national matrices can be read
side by side. Against the current file every family view fills all three bands.

The matrix renders as a `<table>` with row and column headers rather than
through `DataTable`. `DataTable` owns its `<td>` and sorts columns; a matrix
sorts nothing and its cells are buttons. The table element is what carries the
row and column relationship to a screen reader, and that is the reason to use
it.

Selecting an institution now scrolls the profile into view. The Brazilian
directory passed two hundred cards while this was being built, far enough that
a click near the bottom changed a heading the reader could not see.

**Cost.** A cell counts relations of very different weight, which is the limit
D54 already recorded in the schema: `funds` can describe a standing channel
without saying how much moves through it. A busy cell therefore means well
documented as much as it means important, and the matrix inherits every
curation bias in the map beneath it.

Aggregating to ten systems also hides which institution inside a system holds a
channel. Two hundred institutions collapse into a hundred cells, and the
readout is the only way back out.

**Overturned by.** A country whose map fills so few cells that the matrix reads
as empty rather than sparse, which would mean the surface needs a coverage
threshold before it renders. Or relation weights in the schema, which would make
a count the wrong quantity to put in a cell.

---

## D59 — The data publishes a quoting contract for automated readers, and no MCP server

**Choice.** Publish two agent-facing surfaces and stop there. `docs/FOR-AGENTS.md`
states the contract: a score never travels alone, which fields must accompany
it, and the six things not to do with it. `/llms.txt` in the viewer is the map
that points at it, generated from the registry and the current index rather than
hand-written. Do not build an MCP server for this dataset yet.

**Why.** The risk this project runs with an automated reader is not that the
data is hard to reach. It is that the data is easy to reach and the caveats are
not attached to it. `index.json` hands a model 52 countries and nine scores in
one request. Nothing in that file stops the model averaging the nine, ranking
the countries by the mean, quoting a `very thin` dimension on its own, or
reading a null as a zero. Every one of those is a claim the project explicitly
refuses to make, and every one of them is one fetch away.

So the gap is a contract, not a transport. A written contract closes it at the
cost of one file, and the same file serves a human reading the repository.

`/llms.txt` is generated because the alternative is a hand-kept file stating a
country count and a dataset version that the next re-ingest moves. A stale map
of a dataset that versions itself is worse than no map.

An MCP server was the other candidate and it is the wrong tool here now. The
whole scored output is a few megabytes and `index.json` is about half a
megabyte, so there is no corpus too large to hand over and no query problem to
solve. The directory is already self-describing through `datapackage.json` and
the generated schemas, so a client that can fetch a URL can already read it and
validate what it read. Nothing is behind auth. Against that, a server is a
second place the published shape is written, which is exactly what D30 and the
single-source-of-truth invariants exist to prevent, and it is a deployment that
can drift from the dataset version it wraps.

**Cost.** A contract in a file is advisory. A server could refuse to answer
without the confidence attached; a markdown document can only ask. We are
choosing the surface that cannot enforce, on the argument that a reader who will
ignore `docs/FOR-AGENTS.md` will also strip the fields an MCP tool returns.

`/llms.txt` is also a convention rather than a standard, and it is read by some
clients and ignored by most. The file is cheap enough that this is acceptable,
but it should not be treated as coverage.

Generating the file makes it a dynamic route rather than a static asset, so it
costs a function invocation and it fails if `data/out` is missing, the same way
every other page here does.

**Overturned by.** Evidence that agents are a real consumer rather than an
assumed one: referrer or user-agent data showing automated fetches of
`data/out`, or a citation of an NCB number in a generated document that drops
the confidence. Either would justify the enforcing surface. The other trigger is
the Delphi layer becoming interactive, so a caller wants to run a scored what-if
against the frame instead of reading a fixed file. That is a tool call, not a
document, and it is the point where MCP earns its keep. It belongs as a route
handler in `apps/web` reading `@ncb/core` and `data/out` the way the pages do,
so that no third copy of the model exists.

---

## D60 — A series that cannot be scored is published beside the score, with the reason attached

*Recorded 2026-08-28. Extends D23, D42, D44 and D57. Adds the behavioural check
to the model.*

**Choice.** The model gains a third kind of row. An indicator is scored. A gap
is declared and unfilled. A **check** is fetched, published and excluded from
every number: the frame, the mean, the coverage floor, the indicator count and
the confidence. Checks live in `packages/core/src/model/checks.ts`, they are
observed under the `__check__` prefix in the observation file, and each one
carries the reason it is not scored as a field that renders to the reader.

The first check is `bribery_incidence`, World Bank `IC.FRM.BRIB.ZS`, filed
against Trust in the institutional family. It covers 49 of 52 countries and 44
of them at 2023 or later. It asks whether the responding firm was itself asked
for a bribe across six public transactions, so it records experience rather than
reputation, which is what separates it from the perception composites D23
retired and from `IC.FRM.CORR.ZS`, whose own definition asks a firm what it
believes firms similar to itself pay.

It is not scored. On a rank-normalised estimate it correlates with log GDP per
capita at about 0.66 by itself and takes the two-indicator Trust dimension to
about 0.53, where contract enforcement days alone sits at 0.14. That is a larger
wealth contribution than the 0.288 D44 retired an indicator over, so scoring it
would clear the D45 coverage floor by re-creating A3 and A4. D57 already fixed
what Trust needs before it publishes, and this series is not it.

`behaviouralChecks` in the diagnostics recomputes the wealth test on every run,
so the exclusion is standing evidence rather than a claim in a document. A check
is published as the publisher wrote it and is never normalised, because putting
it on the 0 to 100 scale would invite exactly the reading this decision refuses.

**Why.** Retiring a series and publishing a series were the only two options the
model had, and neither fits a number that is real, current, wide in coverage and
disqualified. Retiring it hides evidence a reader should see. Scoring it makes
the benchmark assert something its own diagnostics reject. The check is the
third option: show the number, show the reason, keep it out of the arithmetic.

It also changes what an empty dimension looks like. Trust publishes no score and
now publishes a current, behavioural, 49-country reading beside the empty axis.
That is a more honest surface than either a blank or a number the model does not
believe.

**Costs.** A published number that is not in the score will be quoted as though
it were, and no design prevents that. The mitigation is that the reason travels
in the same object: `note` on every published `CheckResult`, rendered on the
country page and the capability page and printed in the report. A second cost is
that the check is a new concept with a small surface, which makes it a place to
put anything inconvenient. The rule against that is in `checks.ts`: a series
that passes the tests belongs in `indicators.ts`, and a check needs a decision
entry naming the test it failed. Third, the `/sources` page is built from the
indicator registry and does not yet list check series, so the fetch it prints
back is now incomplete by one call.

**Overturned by.** Evidence that readers treat a check as a score, which would
mean publishing it beside the dimension does the harm the exclusion was meant to
avoid, and the row should be retired instead. Or a change in the series that
breaks its correlation with income, which would make it an indicator and move it
to the other registry.

---

## D61: Social cards are static metadata images with stable public paths

*Recorded 2026-08-29. Implements issue 1.*

**Choice.** Generate the country, capability and agenda social cards through
Next's `opengraph-image` metadata convention and expose them at the stable
paths `/og/country/<ISO3>`, `/og/dimension/<dimension>` and
`/og/agenda/<ISO3>` with rewrites. Each image uses `ImageResponse`, reads the
same scored output as the viewer, and declares `generateStaticParams`, so the
cards are emitted during the production build and served as immutable assets.

Radar coordinates live in a browser safe module shared by `Radar` and the
server-only `radarToSvgPath` entry point in `Og.tsx`. Confidence is passed to
the helper for profile parity but does not change a score's position. The
dimension card pins Brazil as the reference country because that route has no
country parameter of its own.

The current dataset emits 52 country cards, 52 agenda cards and nine dimension
cards, 113 images in total. The issue description's arithmetic of 52 cards
times three routes would imply 156 images, but the dimension route has nine
valid parameters, one per capability dimension.

**Why.** Social crawlers need a stable image URL and the benchmark's radar is
the clearest compact representation of a country profile. Build time generation
keeps the card independent of request latency, gives the CDN an immutable
asset, and makes a missing country or dimension fail during the build rather
than when a reader shares a link.

The image renderer cannot parse the page's WOFF2 fonts, and its default emoji
renderer fetches flag artwork from a remote CDN. The cards therefore register
Next's bundled TTF and use the registry's ISO2 code in a lime country mark.
This keeps builds offline and reproducible. Vendored flag artwork can replace
the mark later if exact national flag rendering becomes material.

**Costs.** The image route is a second presentation of the data, so its visual
layout can drift from the viewer even though its radar coordinates are shared.
The card also has less room for confidence and provenance than the page, which
is why it carries the site level caveat and never introduces a headline score.
Static output must be rebuilt after a dataset refresh, just like the committed
JSON and agenda documents.

**Overturned by.** Evidence that crawlers cannot follow the stable rewrites, or
that shared cards are stale after a data release, would justify an on demand
route or a different cache strategy. Evidence that readers need exact national
flag artwork would justify adding a small vendored asset set rather than
reintroducing a remote emoji dependency.

## D62: Disputes preserve the target snapshot and count distinct target countries

*Recorded 2026-08-29. Implements issue 2.*

**Choice.** A score can open a small challenge form with its country, dimension,
score and confidence already attached. The POST endpoint validates the argument,
checks the country and dimension against the registry, then reads the current
country file to store the canonical target values. The record is appended to
`data/disputes/<YYYY-MM-DD>.jsonl` with `status: submitted`. The schema also
holds a maintainer response and signature, and requires a signature before an
accepted record can parse. A rejected record remains in the public ledger but
does not count toward a contested badge.

The badge threshold is three non-rejected disputes from three distinct target
countries in one dimension. It appears only on the target cells named by those
disputes, and carries the distinct-country count. The threshold is a constant in
`packages/core/src/model/challenges.ts` rather than a display decision hidden in
a component.

**Why.** A reader should be able to challenge the number while looking at it,
and the challenge should keep the exact score and confidence that prompted the
argument. Counting distinct countries prevents repeated submissions from one
place from looking like independent corroboration. Keeping rejected records
visible preserves the review trail without letting a decision that was declined
change the page's warning state.

**Costs.** The current ledger is an append-only filesystem store. It works in a
checkout and on a self-hosted Node process, but a Vercel deployment needs a
durable write target before this endpoint can accept public submissions at
scale. Acceptance remains a maintainer action: changing status, adding a
signature and writing the resolving decision are intentionally separate from a
reader's POST. The form also accepts an optional URL, so an argument can still
be weak even when it looks complete.

**Overturned by.** Evidence that the filesystem ledger loses accepted records
or receives enough submissions to need concurrency control would justify a
durable store and an authenticated review tool. Evidence that three distinct
countries does not separate useful disputes from repetition would justify a new
threshold decision with observed submission data.

## D63: Source-backed scores and Delphi estimates remain separate tracks

*Recorded 2026-08-29. Clarifies D11 and supersedes the wider fallback described
as a cost in D45.*

**Choice.** The source-backed track is the measurement layer. It uses the
registry, named publishers and observed values to produce `score`, `confidence`
and indicator rows. World Bank is the only automated ingestion source in v0;
manually authored observations remain a separate input. The Delphi track is an
interpretation layer. It reads the source-backed evidence
brief to review thin or questionable dimensions, then stores `delphiScore`,
`delphiIqr`, rationales, self-confidence and missing evidence. It never creates
an observation, changes confidence or enters `DimensionResult.score`.

`blendedScore` uses the indicator score when the dimension clears its coverage
floor. It falls back to Delphi only when no indicator is observed, and
`blendedFrom` records the source. A dimension with one observed indicator stays
unmeasured rather than receiving a generated replacement.

Runs record the dataset version, country set, scope, coverage ceiling and prompt
version alongside model identity and provenance. A country-restricted or
coverage-restricted run is an archive by default. It becomes active only when
the operator passes `--activate`. A published run after a country-set change
must cover the full rebased set.

**Why.** The benchmark needs a number that can be traced to a source and a
separate judgment about what that number misses. Joining them would hide the
difference between measurement and interpretation, and would make a model
estimate look like a new observation. Explicit run scope also keeps a
10-country preflight from replacing the active run for the whole benchmark.

**Costs.** Some dimensions remain without a blended value when one indicator is
present but the coverage floor is not met. A full panel rerun is required after
a country addition if its estimates are interpreted against the rebased frame.
The panel remains an audit and fallback, not a substitute for closing source
gaps.

**Overturned by.** A defensible method that combines source and panel values
without hiding either provenance, or a source-backed series that measures the
currently unmeasured dimensions with comparable country coverage, would justify
a new decision.

## D64: The first Trust social measure is a pinned Joint EVS/WVS adapter

*Recorded 2026-08-29. Extends D57 and D63.*

**Choice.** The first source-backed social measure for Trust is `A165`, “Most
people can be trusted”, from the official Joint EVS/WVS 2017-2022 results
release 5.0.0. The adapter reads the publisher's aggregate table, which is
weighted by `gwght`, preserves the published percentage answering `1` (trusted),
stores the release year 2022 and emits the existing observation shape. It does
not copy respondent-level microdata or ask a model to generate a value.

The adapter returns the shared coverage report defined in
`pipeline/adapters/types.ts`, writes `data/observations/joint-evs-wvs.json` and
records additions or changes in `data/observations/revisions.json`. The store
loads it alongside World Bank and manual observations, so scoring, confidence,
diagnostics and reports use the same metric path for every source. Countries
with separate EVS and WVS rows, currently Germany, Great Britain and the
Netherlands, are held until pooled microdata weights can be harmonised
reproducibly. The existing contract-enforcement row is the institutional-
performance leg for this provisional release; court clearance remains a gap.

**Why.** The official aggregate release is inspectable, has a stable source
endpoint and covers the benchmark sufficiently for the first social-family
release. Using the publisher's weighted result avoids silently choosing a
pooling rule for two survey programmes and avoids storing restricted
respondent-level data. A source adapter makes the extraction repeatable and
lets future EVS/WVS releases replace the file through the same revision log.

**Costs.** Only 36 of 52 benchmark countries emit a unique row, although 39
are recognized before duplicate-country rows are held. The item is a perception
proxy, its reference year represents a multi-year fieldwork release, and the
2019 contract-enforcement series is stale. Trust therefore publishes a thin
two-indicator score for 36 countries at confidence 0.159. Its current GDP
correlation is 0.627, and the A165 row alone is 0.669, so the release remains a
watch item for wealth sensitivity, survey comparability and redundancy.

**Overturned by.** A reproducible pooled-microdata treatment that improves
coverage without weakening comparability, or a comparable court-performance
series that changes the institutional leg, would justify a follow-up decision.
Evidence that A165 is not comparable across the benchmark countries or that
the two-family Trust result fails the wealth and redundancy review would require
retiring or reclassifying the row.

## D65: Provisional layers need evidence before public promotion

*Recorded 2026-08-29. Implements issue 14 and sets the promotion gate for
issues 11, 12 and 13.*

**Choice.** Velocity and Exponential Leverage remain provisional and offline
until each layer meets its own promotion criteria. The criteria are:

1. **Velocity has a settled method.** The base and current years, the treatment
   of negative deltas, low-confidence dimensions and confidence changes are
   documented, tested against the fixture, and stable across a six-month record
   of three quarterly reviews under the process in issue 13. At least one
   external reviewer must confirm that the result is interpretable as a rate of
   movement rather than a second capability score.
2. **Exponential Leverage has a settled method and complete shape.** All eleven
   dimensions are either sourced or explicitly labeled metric-under-
   development, and the weights, offsets, source changes and foundation
   coherence rule are documented and tested. The layer must also have a
   six-month record of three quarterly reviews and at least one public review
   from outside the maintainer team.
3. **Promotion is a recorded decision.** Passing the technical checks does not
   publish either layer. A later decision must link the review record, the
   external or public review signal, the final fixture and the user-facing
   caveat before the sandbox becomes a public surface.

These criteria are the contract between the provisional fixtures in issues 11
and 12 and the quarterly review process in issue 13. Until the criteria are
met, a missing value is a missing value, and neither layer is used in the
headline score, confidence, agenda, or ranking.

**Why.** Both layers are useful experiments but can look more authoritative
than their inputs deserve. A fixed review period makes learning visible, while
the separate requirements force the two layers to resolve their different
methodological risks. External review is necessary because internal iteration
can show that code runs without showing that the measure means what readers
think it means.

**Costs.** The layers may remain provisional for longer than a release cycle,
and a useful sandbox result may never qualify for publication. The review
record also creates maintenance work every quarter. Those costs are preferable
to turning an exploratory rate or composite into an unqualified benchmark
claim.

**Overturned by.** Evidence that the criteria do not detect methodological
failure, that three quarterly reviews are too short to reveal instability, or
that independent reviewers cannot distinguish either layer from a capability
score would require revising the promotion gate before publication. Evidence
that a layer is not learning after three consecutive reviews would trigger
retirement rather than a weaker promotion standard.

## D66: Subnational observations corroborate the national comparison layer

*Recorded 2026-08-29. Extends D12, D25 and D49. Implements issue 9.*

**Choice.** The benchmark keeps one comparison layer: observations with
`geometry: "national"` are the only observations read by frames, scores, trends
and confidence. The observation schema also admits `state`, `province`,
`region` and `municipality` rows, each carrying a `reconciliation` rule of
`aggregate`, `independent` or `context_only`. Existing files default to the
national geometry and the context-only rule when they do not yet carry the new
fields.

Subnational rows live beside the comparison layer and are consumed by a
destination page through a separately validated corroboration fixture. The
fixture carries the publisher's national value, constituent values, source,
date and rule together. It does not produce a per-state capability score or
silently reweight the national result.

**Why.** A federal aggregate answers the cross-country question but can hide
variation between the units that actually deliver policy. Adding a geometry
field makes that missing layer explicit without allowing a state observation to
enter a national frame. Requiring a reconciliation rule prevents a reader from
assuming that every state range can be averaged into a national statistic.

**Costs.** The data model has two spatial layers to maintain, and every
subnational fixture needs its own source, date and editorial review. A fixture
can show that a national number is consistent with its parts, but it cannot
make unlike administrative units comparable or turn a context measure into a
score. The initial reader and fixture are intentionally limited to Brazil.

**Overturned by.** A documented method that establishes a comparable
subnational capability frame without changing the national comparison, or
evidence that the declared reconciliation rules systematically mislead readers,
would justify revising this boundary. A source that publishes only incompatible
geometries would justify withholding its fixture rather than relaxing the
schema.

## D67: The front page reads one capability at a time, and certainty is the ring

*Recorded 2026-08-30. Extends D32, D47 and D53.*

**Choice.** The front page opens on a single capability, drawn as every country
on one 0 to 100 axis, and the reader switches capability rather than scrolling
past nine charts. One component, `FlagHistogram`, serves all nine dimensions.
Switching moves each country from its old score to its new one instead of
redrawing the field. The frame is laid out for all nine dimensions at once, so
the chart height and the axis hold still while the flags travel.

Pointing at a flag opens a card beside it that reads the country at a glance:
the score on this capability, its confidence, its trend, and the highest and
lowest of the same country's nine capabilities. The card never takes the
pointer. The flag itself is a link into the country profile, so the card can
stay purely informative and a reader never has to travel into a tooltip to
click something. No flag fades while another is read: the halo says which one
is being pointed at, and 52 flags at two strengths reads as a rendering fault.

The chart itself is `FlagField`, and it is the only one of its kind. The
capability pages, the dimension and indicator peek panels and the compare embed
all draw the same picture with the same geometry, from the same component. A
surface that needs more in the hover card adds a field to `FlagFieldPoint`
rather than a second distribution. `Distribution`, the older strip chart that
mapped confidence to marker opacity, is deleted.

The mark is `FlagBubble`: a flag inside a bubble, drawn at the origin so the
chart owns the position. The bubble's ring carries the evidence and the flag
never does. The ring is solid at the usable band's floor and above, and it
breaks below it, with the gaps opening as confidence falls. The ramp lives in
`apps/web/src/lib/evidence.ts` as `evidenceOpenness`, and the radar's dashed
edge reads the same function, so the two charts cannot disagree about which
countries are drawn solid.

Each dimension names both ends of its own axis. `DIMENSION_ENDPOINTS` in
`packages/core/src/model/dimensions.ts` is the only place those words are
written, beside the questions they belong to.

The grid of 52 radars moves to `/countries`, which the Countries nav entry now
points at, and the full score table is added to `/capabilities`. The front page
keeps the dataset markup and gains no ranking.

**Why.** The old front page asked a reader to compare 52 nine-axis shapes
before knowing what any axis meant. A shape is the right picture for one
country and the wrong one for a first visit. One capability on one axis is
readable without instruction, and moving the flags between capabilities is the
only way the page demonstrates its own claim: that a country strong on one
capability can sit at the floor of the next. That claim is the reason there is
no composite score.

Opacity was the wrong channel for certainty. It asks a reader to compare the
strength of 52 marks against different backgrounds, it collides with the
dimming used for hover, and on a flag it reads as a rendering fault rather than
as a measure. A ring is a separate channel from the mark it surrounds, and it
already means thin evidence on the radar.

**Costs.** The front page now shows one dimension rather than nine, so a reader
who wants the whole picture makes one more click. The animation needs every
country's nine scores in the client bundle, which is the slim index and not the
country files. The shared field is taller than the strip chart it replaces,
because a bubble needs more column spacing than a bare flag, so the compare
embed's advertised height rises from 300 to 420 and anybody who has already
embedded it keeps the old height until they update the snippet.

**Overturned by.** Evidence that readers cannot find the capability switch, or
that they read the animated move as data changing rather than as the question
changing, would justify returning to nine small charts shown together. Evidence
that a broken ring is not read as uncertainty in testing would justify a
different second channel, but not a return to flag opacity.

## D68: The wealth residual is published per dimension and never summed

*Recorded 2026-08-30. Extends D1, D23 and D47. Joins the provisional gate in
D65.*

**Choice.** A new provisional layer, written by `pnpm bench residual` into
`data/out/residual.json` under `residual/0.1-exploratory`. For each dimension,
ordinary least squares fits the published score against log10 GDP per capita
across every country scored on that dimension. The residual is the observed
score minus the fitted score. The layer publishes:

- one residual per country per dimension, beside the score and the fitted value,
- one fit per dimension carrying slope, intercept, Pearson r, r², n, the
  standard error of the estimate, a fit strength band and the mean absolute rank
  shift between the score order and the residual order.

The shape has no country-level field and never will. Nine residuals averaged
into one number is the headline score D1 withholds with a regression in front of
it. Residuals never enter `score`, `blendedScore`, confidence, momentum or the
agenda. A dimension with no score publishes no residual, a country with no
income observation publishes none at all, and a dimension fitted on fewer than
20 countries publishes neither a fit nor its residuals.

The layer is offline in the sense D65 means. It renders at
`/method/residual/sandbox`, which is unlinked and carries `robots: noindex`,
the same shape as the velocity and leverage sandboxes. No score, confidence,
agenda, country page or public surface reads the file, and no navigation points
at the sandbox until a later decision promotes it.

**Why.** D1 refuses a composite because the mean of nine dimensions ranks
countries. Measured on the current release, that mean correlates with log GDP
per capita at r 0.866, Spearman 0.879, higher than seven of the nine dimensions
on their own. Averaging cancels the two dimensions that do not track income,
Shared Purpose at 0.451 and Coordination at 0.467, against the ones that do, and
what survives the cancellation is wealth. The mean is also computed over
different baskets: 23 of 52 countries score fewer than nine dimensions under the
D45 coverage floor, so a mean over five and a mean over nine would print as the
same kind of number.

The residual answers the question the composite was reaching for and does not
reproduce the development ranking. It says whether a country is above or below
what its income buys, which is the comparison this benchmark exists to make. The
first run puts China +21.6, South Korea +11.4, Finland +10.2, Rwanda +9.6 and
Ethiopia +8.9 above their income lines on the mean of the nine residuals, and
Panama -17.2, the United Arab Emirates -16.8 and Argentina -11.1 below. Those
five numbers are stated here as the evidence for the layer and are exactly what
the published file refuses to compute, because the same averaging failure
applies to residuals.

The fit travels with every residual for one reason. Where the income line
explains little, the residual is close to the score, and a weak fit dressed as
a residual would smuggle a capability ranking back in. Coordination and Shared
Purpose are both weak on this release, at r² 0.218 and 0.204, and their mean
absolute rank shifts are 6.9 places out of 44 and 5.5 out of 46. Anticipation,
at r² 0.763, moves 11.9 places out of 50. The layer publishes the difference
rather than hiding it.

**Costs.**

- A regression sits between the reader and the data. Every published residual
  depends on a modeling choice, which no score in this benchmark does.
- The country being read helped fit the line it is measured against, so an
  outlier pulls the line toward itself and understates its own residual. China
  is the case to watch. A leave-one-out fit is the candidate fix for 0.2.
- The residual inherits A3. Where a dimension's evidence is itself wealth
  correlated, removing income removes part of the capability signal too.
- A negative residual reads as blame. "Below what its income predicts" is a
  statement about a fit, not about effort, and the layer has no user-facing copy
  yet that says so.
- The mean absolute rank shift is in places, so it is read against `n` in the
  same row and is not comparable across dimensions with different country
  counts.
- A straight line in log income predicts scores the scale cannot hold. Five of
  424 cells fit below zero, all of them Ethiopia, Haiti and Rwanda on
  Experimentation and Anticipation, and the residual there carries the
  impossible part with it. The cell records this as `outOfScale`, the same
  convention a clamped scored cell uses with `outOfFrame`. Clamping the fitted
  value would break the property that makes the residual worth having, because
  residuals of a clamped line no longer sum to zero against income.
- Venezuela and Cuba have no GDP per capita observation in the current
  ingestion, so they carry no residual on any dimension.

**Overturned by.** Evidence that residual order tracks income anyway. Pearson
against log GDP per capita is zero by construction under a full-set linear fit,
so the test is the rank correlation, which is not forced. On this release every
dimension sits between -0.081 and +0.129 in Spearman terms. A later release
carrying a dimension above about 0.3 would mean the relation between income and
that dimension is not linear in log income, and a straight line is the wrong
model for it. Evidence that readers read a residual
as a capability score would stop promotion under D65 rather than change the
method. Evidence that leave-one-out fits move outlier residuals by more than the
standard error of the estimate would make the full-set fit in 0.1 wrong rather
than simple.

---

## D69: A country layer replaces the translated edition

*Recorded 2026-08-30. Supersedes the viewer half of D35.*

**Choice.** The viewer publishes one benchmark, in English, and country layers
beside it. A country layer is a second reading of one country, written in that
country's language and at that country's depth: its shape, its computed
agenda, its institution map and its subnational spread. It is not the benchmark
translated. Brazil is the first and today the only layer, at `/brasil`.

`COUNTRY_LAYERS` in `apps/web/src/lib/layers.ts` is the only place a layer is
declared: the country, the slug, the language, the section order and the
labels. Every address, the nav between the layer's pages, the way back out to
the comparison, and the gate on which languages a country's pages may render
in, all read that registry.

The Portuguese mirror is gone: `/pt`, the Portuguese agenda list over all 52
countries, and the translated method, glossary, limits and decisions pages.
Every one of those addresses now redirects into the layer or back into the
ground layer. The home page no longer changes language with `Accept-Language`,
the country agenda no longer honours `?lang=`, and the header carries no
language control. A lexicon still renders any country, but a rendered lexicon
with no page behind it is not a published thing, so the feed drops those
entries.

No country layer appears in the sections at the top of the site, and no layer
has a nav of its own. A layer serves one country's audience and is reached from
that country. Where it sits in the navigation is settled by D73, which gives
the whole viewer one tree: a layer is a reading of its country, beside the
English one.

The ground-layer half of D35 stands unchanged. Ids, registry definitions, JSON
output and the method documents stay English, and the layer reads exactly those
files, so a claim it makes can be checked against its source.

**Why.** A translated edition promises a second complete site and cannot keep
it. Ours mirrored nine pages of a growing site, and the mirror drifted the
moment either side moved, while the pages a Brazilian institution actually
needs, the institution map and the state spread, had no home in either
language. A layer inverts that cost: it grows only where the project has done
country-specific work, and its existence is evidence that the work was done. It
also states the audience honestly. The benchmark's subject is the comparison,
and a reader who wants Brazil is a sub-audience, reached from Brazil rather
than from the top of the site.

**Cost.** Brazil's pages exist twice, once in the comparison and once in the
layer, and the two can disagree in emphasis even though they read the same
JSON. A Portuguese reader on any other country now gets English with no offer
of anything else, which is a real loss for the 51 countries that will not get a
layer. `pnpm bench agenda` still renders `{ISO3}.pt-BR.md` for every country,
so those files are generated with no page behind them; restricting generation
to layer countries is separate work. The layer's subnational section is still
the English ground-layer page at `/country/BRA/local`, declared in the registry
with a null slug until it is written in Portuguese.

**Overturned by.** A second lusophone or hispanophone country layer whose
sections turn out to be identical to Brazil's, which would show that what we
called country-specific work was a language after all. Evidence that readers
arriving from a Portuguese search reach the English home and leave, which would
justify an entry offer on the ground layer rather than only inside Brazil's
pages. A partner institution that needs the method and limits documents in
Portuguese in order to review the framework, which would justify translating
those two documents as documents rather than restoring an edition.

---

## D70: A comparison is an address, and one country in it is the reference

*Recorded 2026-08-30.*

**Choice.** The viewer publishes a top-level comparison at `/compare`. It holds
one reference country plus up to three others, and the whole selection lives in
the path: `/compare/BRA-IDN-ZAF`. The first code is the reference. Every other
column is read as a distance from it, and moving a country to the front changes
the reading without changing a number.

`compareHref` and `readCompareCodes` in `apps/web/src/lib/links.ts` are the only
places the shape is written or parsed, as D46 requires. The parser is forgiving
in the ways a person writing a URL is: hyphens, slashes and commas all separate,
case does not matter, and a code that is not in the country registry is dropped
rather than raised. The page then redirects to the canonical hyphen form, so a
hand-typed address and a shared one are the same page. `COMPARE_MAX` is four.

The picker writes the address and never local state, so every selection a reader
builds is a link they can send. The page reads the country files rather than the
index, because it goes down to the indicator rows; four files is a bounded read
and never the list D27 forbids.

Four shapes are not stacked on one radar. Each country gets its own card with
the reference drawn behind it as a muted outline. Comparison stays in the
tables: nine capability rows with the gap from the reference under each score,
confidence in its own table, trend in a third, and then every indicator in the
registry with each country's normalised chip and published value.

`Reference country` is a glossary entry, because the page invents the term.

**Why.** A score in this benchmark only means something against other countries,
and until now the viewer offered two ways to get there: one comparator behind a
selector on a country profile, which vanished when the reader navigated away, and
one capability across all 52 countries. Neither answers the question a reader
actually arrives with, which is how a small set of countries differ across the
whole profile. Putting the selection in the path makes that reading a citable
object: a researcher can send `/compare/BRA-IDN` into a document and it opens the
same page for everybody.

The reference is named rather than implied because a table of four columns with
no stated baseline invites the reader to invent one, usually the highest column,
which is the ranking this project withholds. Naming it makes the arithmetic
explicit and reversible.

**Cost.** The page is the only surface that loads several country files at once,
so it is the heaviest page in the viewer, and the indicator section grows with
the registry. A four-country comparison is wide on a phone: the tables scroll
horizontally inside their own containers rather than reflowing. The reference
also carries a risk the picker cannot remove, which is that a reader treats the
reference country as a target instead of a baseline. The glossary entry and the
column label say it is not; nothing enforces it.

Combinations are not in the sitemap. 52 countries make 1,326 pairs before any
triple, and a crawl map that carried them would drown the pages that are actually
published. Only `/compare` is listed.

**Overturned by.** Evidence that readers build comparisons and never send them,
which would make the address a cost with no benefit and argue for local state and
a shorter page. A reader study showing that the reference column is read as a
target would force the gap column out, leaving four independent columns. A fifth
country asked for often enough would mean the page is being used as a table, and
the answer to that is the flat CSV rather than a wider page.

## D71: One inbox, and support is a page on both layers

*Recorded 2026-08-30.*

**Choice.** The viewer publishes one communication page, `/contact`, and one
support page per layer: `/support` on the ground layer and `/brasil/apoie`
inside Brazil's layer. `supportHref` and `contactHref` in
`apps/web/src/lib/links.ts` are the only places those addresses are written, as
D46 requires, and `support` joins `LayerSectionId` in
`apps/web/src/lib/layers.ts`, so a layer either holds its own reading of the
page or falls back to the ground-layer one through the same map every other
section uses.

The support pages name three things and no more: use the benchmark, contribute
to it, fund a named piece of it. Each way ends at an address a reader can act on
today, and every invitation to write ends at `/contact` carrying a topic in the
query string.

`/api/contact` validates `ContactSubmission` from
`packages/core/src/model/contact.ts`, redeems a Turnstile token when the keys
are set, and forwards the lead to core.envisioning.com over an HMAC-signed
request through `apps/web/src/lib/core-api.ts`. It stores nothing in this
repository. The payload is the one envisioning.com and event-bff already send,
including the two traps those repositories document: `sourcePage` is never sent,
because Core answers 500 when it is present, and an empty `title` is replaced
with a placeholder, because Core rejects a blank one. Without
`INTERNAL_REQUEST_SECRET` the route answers 503 rather than pretending to send.

**Why.** A benchmark that asks institutions to use it, argue with it and fund it
has to say where each of those goes. Until now the site named the issue tracker
and nothing else, so an institution with a budget line and no GitHub account had
no address at all.

One inbox rather than a form per page, because a second form is a second payload
to keep in step and a second place a message can go unread. The message reaches
the CRM that already fans a lead out to the sender's confirmation mail, the team
notification and Slack, so nothing new has to be built or watched. Nothing is
stored here on purpose: a dispute is published beside the number it argues with,
which is why `/api/challenge` writes to disk, and an enquiry is private, which
is why this one does not.

Two support pages rather than one translated page, for the reason D69 gives.
Funding is the most local thing on the site. The ground page names research
grants and multilateral budgets in general; the Brazilian page names the windows
a Brazilian institution actually holds, and that list is not a translation of
anything.

**Cost.** The route depends on a service outside this repository, so the form
fails when Core does, and the failure is only visible in the logs. The pages
name funding venues that change, which is prose that will go stale and that no
test catches. Adding `support` to `LayerSectionId` means every future layer has
to answer whether it holds its own support page, even where the ground-layer one
would do. The contact form is English on a page a Portuguese reader can reach;
the Brazilian page says so and says the reply comes in Portuguese, which is a
statement about how the team behaves rather than something the code enforces.

**Overturned by.** Messages arriving that the CRM cannot route, which would
argue for a repository-side record the way disputes have one. A second country
layer whose institutions want a support page identical to the ground-layer one,
which would make the per-layer section the wrong shape and argue for one page
with a country-specific funding block. Evidence that readers use the form to
file objections about specific scores, which would mean the split between
`/contact` and `/challenge` is legible to us and not to them.

## D72: Agenda items carry navigation to related institutions

*Recorded 2026-08-30.* Extends D35 and D54.

**Choice.** Each dimension-level item in a generated country agenda carries an
`institutionIds` array. The ids point to nodes in that country's
`data/institutions/{ISO3}.json` network. The array is computed from the node's
existing `dimensions` field, which is already the curated navigation link from
an institution to an NCB question. Countries without an institutional network
carry an empty array. The links are explanatory navigation only: they do not
add evidence, alter a score or change confidence.

**Why.** The agenda and institutional map previously met only through a reader
who knew both files. The new field makes the path from a current agenda item to
the institutions worth investigating explicit, while keeping one mapping to
curate. Brazil is the first test: its agenda now carries the ids of the
institutions tagged for each of the nine dimensions.

**Cost.** A broad dimension can point to many institutions, especially in
Brazil's scaffolded state layer. The ids say where to look, not which actor is
responsible for a specific gap or that it delivered well. A future item-level
relationship may need a more specific, sourced link when the agenda stops being
dimension-level.

**Overturned by.** Evidence that the node dimension tags are too broad to help
readers navigate, which would justify a separately curated agenda relationship
with its own source and scope. A country layer whose agenda items are more
specific than dimensions would justify adding stable item ids before extending
the link.

---

## D73: Navigation is one tree, resolved against the path, drawn as a breadcrumb and tabs

*Recorded 2026-08-30. Supersedes the nav rules in D69 and folds in the method
subnav.*

**Choice.** The viewer has one navigation tree, in `apps/web/src/lib/nav.ts`,
and one rule for what is current. `navRows` walks it against the current path
and returns the rows to draw; `HeaderNav` draws them and nothing else in the
viewer draws navigation. Every row sits in the header.

The tree is four deep and the walk stops there:

1. the sections
2. the country you are in
3. which reading of it, where the project has written more than one
4. the pages of that reading

It reaches the reader as two bands rather than four rows. Everything above the
deepest level is a breadcrumb in the header; the deepest level is a tab strip
on its own rule under the header. Stacking four nav rows failed a look test:
three levels each drew the same lime underline for current, so nothing said
which one was the deepest, and two adjacent rows read as one group. The
breadcrumb and the tab bar are borrowed shapes, and the borrowing is the point.
A reader already knows what a slash-separated trail means and what a tab does,
so neither has to be learned.

A trail of one crumb repeats the section already marked in the row above it, so
it does not render. Method and Capabilities go straight from their section to
their tabs, and the breadcrumb appears only where there is a trail to state.

The markup is copied in rather than installed, the way `Icon.tsx` copies Lucide
paths. Both are plain elements with Tailwind classes.

A node declares how it claims a path and what opens under it. Countries has 52
children and no control can show them, so its child is resolved from the path:
the crumb names the one country you are in, never the set. Method and
Capabilities enumerate their children, because nine fits in a tab strip.

A country layer is a reading of that country and sits beside the English one,
never under its pages. That is what keeps the tree four deep rather than five,
and it is also what the layer is: another way to read the same country. Both
readings render in the same crumb, separated by a middot rather than a slash,
because they are alternatives at one level and not steps in a trail. A country
with one reading skips that level, so its trail ends at the country.

A crumb marks its selection only when it holds more than one node. A lone crumb
is a step, and a step is an ancestor of the current page rather than the page
itself, so it carries no marker. A crumb offering both readings marks the
selected one with the same lime underline the sections and the tabs use, which
keeps one meaning for that mark across the whole nav and stops the selection
resting on a colour difference alone.

Because the rows render in the header, above every layout that could open a
file, which surfaces a country has must be knowable without touching the
filesystem. `hasLocalDestination` already read the layer registry;
`INSTITUTION_MAPS` in `apps/web/src/lib/layers.ts` now names the countries whose
institution map is published.

This replaces three mechanisms that each had their own idea of what counted as
current: `PRIMARY_NAV` with `primaryNavOwns`, `METHOD_SUBNAV` with
`methodSubnavOwns`, and `CountrySubnav` with `countrySubnavOwns`. The first two
rendered in the header and the third in the page body, so the site had two
places a reader had to look to find out where they were.

**Why.** Three ownership rules is three chances to disagree, and they did: a
country page lit Countries in the header while its own row of pages appeared
somewhere else entirely, and the layer arrived with a fourth rule. One tree
makes the depth a property of the structure rather than of whichever component
happened to render. It also forces the honest question at every node, which is
what a level means: section, then which reading of which country, then which
page. A level that cannot answer that does not belong in the nav.

**Costs.** The header carries a breadcrumb under the sections, and a tab strip
sits beneath it, where a country's pages used to sit at the top of the page
body. The tab strip is a second band with its own rule, so the site has two
horizontal rules above the content instead of one. `INSTITUTION_MAPS` is a hand-maintained list that can fall out of
step with `data/institutions/*.json`; a stale entry costs a link to a page that
says the country is not mapped yet, which is a state that page already renders.
Pages outside the seven sections, `/support`, `/contact` and the comparison's
own deep links, light nothing at level one except where a node claims them, so
a new top-level page has to be placed in the tree or it will read as orphaned.

**Overturned by.** A fifth level that cannot be collapsed into a reading or a
page, which would mean the four-deep cap is wrong rather than the content.
Evidence that readers do not read the middot crumb as a choice between
readings, which would justify a labelled switcher instead. A country whose
pages do not fit in one tab strip, which would justify the docs-site shape of
moving the lower levels into a left rail.

## D74: Brazil's institution map uses an explicit inclusion rule and a federative pilot

*Recorded 2026-08-30. Extends D56 and D58.*

**Choice.** An institution belongs in a country map when it is a federative-level
entity that allocates authoritative public data on at least one NCB dimension
indicator, or a federal entity that exercises authority over a capability-relevant
activity at national scope and has a public source citation a Brazilian reader
can follow in under two clicks. The rule is descriptive: inclusion does not
measure performance, enter a score or imply that the institution delivered well.

Brazil's first federative pilot names the state finance and planning functions
alongside the São Paulo State Public Defender: Sefaz-SP, Sefaz-MA, Seplag-MG,
Sefa-PA and the São Paulo Defensoria Pública. The rest of the state layer stays
scaffolded until its sectoral institutions have the same source-backed treatment.

**Why.** The original map showed the federal lens well but made the state layer
look more complete than its evidence warranted. Naming the rule makes expansion
repeatable, while the five-entry pilot tests whether the same concepts survive
when authority, data and delivery sit below the Union.

**Costs.** A public source can make an institution easy to find without proving
that it has capability in practice. The pilot also leaves many state functions
outside the map, and the two-click test depends on websites that can move.

**Overturned by.** Evidence that the inclusion rule systematically favors bodies
with better websites over bodies with greater authority, which would require a
separate source-access criterion. A state-level map whose institutions cannot be
described without adding a new level or system, which would overturn the current
federative pilot shape.

## D75: The thesis argues, the about page describes, and the front page carries one module per section

*Recorded 2026-08-30.*

**Choice.** Three public pages are split by job and never restate each other.

1. **`/thesis` owns the argument.** Why capability is worth measuring, what the
   claim is, and how far the current data supports it. It draws the wealth
   correlation for all nine dimensions, so the reader sees the result rather
   than a promise to look it up. The two provisional layers are described as
   computed and unpublished, gated by D65, never in the future tense.
2. **`/about` owns the object.** What the dataset is made of, how big it is,
   when it last ran, what the benchmark refuses to do, what it gets wrong and
   how to argue with it. It states no second version of the claim, and links to
   the thesis for it.
3. **The front page carries one module per section of the site.** Each module
   is a sentence, a live number and one link out. No module reprints a list that
   has a page of its own.

Numbers inside these pages are computed, never typed into the copy.
`readWealthTracking` in `apps/web/src/lib/wealth.ts` is the only place the
GDP correlation column is summarised, and the front page, the thesis and the
about page all read it, so the three cannot state different results for the
same run.

**Why.** The two pages had grown into one argument told twice: both listed the
nine capabilities, both named Brazil as the first case, both named Envisioning,
and both stated the wealth claim. Two statements of one claim drift apart the
first time only one of them is edited, and the about page had already drifted
into promising a diagnostic result that the diagnostics had answered several
releases earlier. The front page had the opposite failure. It printed the nine
capabilities twice, once as the histogram's switch and once as a card grid, and
compressed every other section of the site into a single paragraph of inline
links, so a reader could not tell that agendas, limits or the decision log
existed.

**Costs.** A reader who lands on `/about` looking for the argument has to follow
one link. The front page is longer, and each module has to be maintained against
the section it stands for: a new top-level section needs a module or it goes
unmentioned. The `widestSpread` sentence names whichever country currently has
the widest gap, so it can change between runs, which is the point of computing
it rather than writing it.

**Overturned by.** Evidence that readers arriving on the about page expect the
argument there and do not follow the link would move the claim back. Evidence
that the front page's modules are read as a menu rather than as the benchmark
would return it to the chart alone. A front page that grows past one module per
section is the signal that this rule has stopped holding.

## D76: AI scouts the evidence queue, but source checks and publication stay separate

*Recorded 2026-08-30. Extends D20, D31, D33 and D52.*

**Choice.** Evidence expansion becomes an AI-first, source-first workflow with
three explicit objects:

1. A **research slot** is an uncovered country × declared-gap combination,
   selected by a deterministic inventory of the current evidence corpus.
2. A **research lead** is an AI-generated hypothesis containing a route, a
   possible mechanism, a scale test, disqualifiers and source-search targets.
3. An **evidence record** remains the source-checked, human-approved object in
   `data/evidence/records.json`.

`pnpm bench research inventory` writes the queue and balance report.
`pnpm bench research scout` uses the AI Gateway to generate bounded leads, and
`pnpm bench research critique` red-teams them against the five inclusion tests.
Runs are immutable artifacts under `data/research/runs`. They are validated but
never loaded by scoring, confidence, the agenda generator or the viewer's
documented-delivery table. No AI stage can approve publication.

The scout must distinguish a possible institutional case, a source-backed
dataset task and a gap that should not be forced into a case story. It must
return search targets rather than invented URLs, numbers or coverage claims.
The researcher still opens the source, verifies the metric and reference
period, writes the limits and pattern fields, and runs the existing evidence
validation gate before adding a record.

**Why.** The current evidence layer has 52 records but is concentrated in 20
countries, 15 gap indicators and one dimension, while its own reversal quota is
below target. Hand-authoring one story at a time will keep selecting visible
countries and familiar programmes. A deterministic slot inventory gives the AI
a bounded search space that points at the actual missing cells rather than at
whatever country has the best English-language documentation.

AI is useful for breadth: it can generate competing search hypotheses, identify
adjacent constructs, propose source families and attack a lead before research
time is spent. It is unsafe as an unreviewed fact source. Separating leads from
records preserves D20's score boundary and D33's selection discipline while
making the discovery process repeatable and auditable.

The first planning milestone is 100 qualified deliveries across at least 40
countries and 20 gap indicators, with at least 20 reversals and no country above
one-third of the corpus. This is a corpus target, not a scoring threshold.

**Costs.** AI scout output can still be plausible and wrong, so a valid JSON
run is not evidence and a critique is not a source check. The extra stages add
research artifacts and review time. The deterministic queue can encode the
existing corpus's blind spots, so its priority is a starting order rather than
a claim about which countries matter most. AI model choice, prompts and source
access also become part of the research record and need versioning.

The current evidence schema does not gain AI-authored factual fields. That
keeps the published contract stable and means an AI run cannot accidentally be
served as a delivery. If future work needs source packets, reviewer identities
or automatic draft comparison, those fields require a new decision rather than
being smuggled into `EvidenceRecord`.

**Overturned by.** Evidence that AI-generated leads systematically reduce
source quality or increase conceptual mismatches compared with unaided
research, which would narrow AI to clerical extraction. Evidence that the
research queue is too broad to review, which would require a smaller slot
contract or a separate country-set research frame. A source-backed comparable
series that closes a gap supersedes the case lane for that indicator under D20.

## D77: Correct the D76 corpus-balance description

*Recorded 2026-08-30. Clarifies D76; it does not change the workflow.*

**Choice.** The current evidence corpus is represented across all nine
dimensions. It is uneven rather than one-dimensional: Building has the largest
share at 19 of 52 records, followed by Adaptability at 8, while the remaining
dimensions have between 1 and 5 records. The AI research queue must therefore
expand countries, gap indicators and thin dimensions, while preserving the
reversal and concentration guardrails.

**Why.** D76's phrase "one dimension" was inaccurate. Leaving it in the
decision log would give the AI queue the wrong diagnosis and make the research
plan less auditable.

**Overturned by.** A refreshed inventory showing a different distribution
supersedes these counts; the rule to derive the diagnosis from the inventory
remains.

## D78: Taking part is a section of the site, and one registry declares the ways in

*Recorded 2026-08-30. Extends D71 and D75, and renames the surface D50 reads.*

**Choice.** Four things, together.

1. **Participate is a section.** `/support`, `/gaps`, `/objections` and
   `/contact` sit under one node in `apps/web/src/lib/nav.ts`, and the footer
   column derives from it. Before this, `/support` and `/contact` were in no
   navigation at all: a reader who had decided to help could only find them
   through a sentence at the foot of another page.
2. **One contribution registry.** `packages/core/src/model/contribute.ts` holds
   every way in. Each entry names the ask, what it has to carry, who usually
   brings it, how much work it is and what changes in the published benchmark
   when it lands. `ContributionList` renders it and `contributionHref` in
   `links.ts` addresses it. No page writes its own list of ways to help.
3. **The gaps are published as open work.** `/gaps` is a second reading of
   `ingest: 'gap'` and `ingest: 'retired'` from the indicator registry, one
   entry per gap with what it tries to observe, why it is open and a link that
   opens the contact form on that indicator. No new data.
4. **`/challenge` becomes `/objections`.** The old address redirects
   permanently. The score-side control keeps the verb, because challenging a
   score is what the reader is doing there.

The funded pieces in `FUNDABLE_PIECES` each state a scope and an effect, so a
reader can size the work before writing.

**Why.** The project asked for help in four places, in four vocabularies, and
scaled every ask to an institution. Nothing a single reader could do in five
minutes was addressed anywhere, while the most specific request the project can
make, the 26 declared gaps, rendered only as rows in a registry table. The word
challenge read as a competition to somebody arriving from outside, which is the
opposite of an invitation to argue. A registry rather than four page sections
means a new way in is declared once and appears everywhere it belongs, which is
the rule the indicator registry and the glossary already follow.

**Costs.** The contribution registry is prose held in code, so a copy change is
a build. `/gaps` restates registry rows that `/indicators` already renders,
which is a second surface over one source and has to stay a second reading
rather than becoming a second list. The rename leaves a redirect to carry, and
older links and citations that name `/challenge` now take a hop.

**Overturned by.** Evidence that readers use the participate section as a menu
and never act would mean the ways are wrong rather than badly addressed.
Evidence that `/gaps` produces unusable dataset suggestions in volume would
mean the five-minute rung needs a higher bar, not a wider door. If a country
layer needs its own contribution registry, because its institutions take part
in ways this one cannot express, the registry becomes per layer and this
decision is superseded.

## D79: Headings are short and plain, and Octa is the wordmark plus one title

**Decision.** Three rules on the rendered surface, two for language and one for
type.

1. **A heading states what the section holds, in about six words.** It stays a
   statement that could be true or false, per the existing rule, but it drops
   the aphorism. "How much of this is income?" replaces "The claim is that
   capability is not simply wealth". "What each country should work on"
   replaces "Each country gets an agenda, not a grade". "Nine scores, read
   together" replaces "A country is a shape, and no country is one number". The
   "X, not Y" inversion goes out of headings entirely rather than being capped
   at one per page, because a heading is where the reader notices it.
2. **Octa is the wordmark and the front page hero title.** `PageTitle` renders
   Inter. `HeroTitle` in `apps/web/src/components/ui.tsx` is the only Octa
   title on the site and is one step larger than a page title, at `text-4xl
   sm:text-6xl` against `text-3xl sm:text-4xl`.

3. **The project describes itself by what it measures.** The footer line, the
   metadata description and the social card carried "measures what a country
   can do, apart from how rich it is" over "52 countries, nine capabilities,
   public data, no ranking". All three now name capabilities: "measures whether
   a country can anticipate change, coordinate around it and build what it
   decides to build". The refusals keep their home on `/about`, whose job is to
   hold them.

The same pass removed the connective filler that named two pages and joined
them with "and", of which "About says what it is made of and what it refuses to
do, and contact reaches a person" was the clearest case.

Three further rules came out of the same reading. Reader copy carries no
internal fact: "one inbox for the whole project" is a contract between agents
and a reader never asked how many inboxes exist. Reader copy never reassures:
"a person reads it and replies" invites the suspicion it denies and promises
what the page cannot keep. And three short sentences in a row is the rhythm of
generated text whatever the words are, so vary the length or cut to one.

**Why.** The maxim heading was the project's house style and it read as
generated text. The self-description had the matching fault: a benchmark that
introduces itself as not-wealth and not-a-ranking has told the reader two
things it is not before naming one thing it does, and a count is not a claim.

On the headings, every section opened with a small thesis, so a reader scanning
the page met nine arguments and no map, and the pattern told them nothing about
where to click. The heading rule that produced it, "a statement that could be
true or false", is still right; what it lacked was a length and a subject. The
subject of a heading is the section, never the project's belief about the
section. Octa had the same problem in type: a display face on every page title
is a body face with extra weight, and it stopped marking anything. One Octa
title per site restores the signal, and the front page is where a first-time
reader meets the name.

**Costs.** Some headings lost information that now has to sit in the hint line
below, which is one more line to keep true. Short headings are more likely to
collide across pages, so "Known failures" and "Datasets we rejected" now appear
in more than one place and a reader arriving from search sees less context.
Dropping Octa from page titles makes the site quieter, and the brand mark now
rests on the wordmark, the accent and the layout rather than on the typeface.

**Overturned by.** Evidence that readers cannot tell sections apart from
headings alone would mean the six-word target is too tight for this material.
A brand revision at envisioning.com that puts Octa back on section titles would
supersede the type half of this decision, which follows the parent system
rather than setting it.

## D80: The site has five sections, and a page joins the one that answers its reader's question

*Recorded 2026-08-30. Amends the tree D73 declared and the placement D75 and D78
assumed.*

**Choice.** The header carries five sections and no more:

```
Countries · Capabilities · Method · Participate · About
```

Two sections fold into others, and nothing about the pages changes.

1. **Agendas moves under Countries.** The row under Countries answers "which
   country". Once the path names one, that country is the row, because 52 will
   not fit in a control. Before it does, the row offers the readings that take
   the whole set: all countries, compare, agendas. `COUNTRY_INDEX_PAGES` holds
   them. An agenda index is a way of reading the country set, not a separate
   thing the site is about.
2. **Thesis moves under About.** `ABOUT_PAGES` is overview, thesis, changelog.
   D75 gave those two pages different jobs and that stands: the thesis argues
   and the overview describes. Both answer the question a newcomer asks before
   either of them, which is what a section is.

Adding a sixth section is a decision, not a page. A new page joins the list
whose reader's question it answers, all four of which live in
`apps/web/src/lib/nav.ts` beside the tree.

`READING_PAGES` in the same file flattens the destinations for `/llms.txt`,
because a machine has no rows to open. The footer renders four columns from the
same lists.

**Why.** Seven sections made the header a menu of the project's own internal
distinctions. Thesis and About were separate because they do different jobs,
which is a reason for two pages and not for two headings: the site was saying
"here is what we are" twice at the top level, and a reader arriving cold had to
guess which one to open first. Agendas was a section because it has an index
page, which is not the same as being one of the things the site is about. A
section is a reader's question, and there are five of them: which country, which
capability, how is it built, how do I take part, what is this.

**Costs.** The thesis is the project's strongest single page and it now sits one
click below the header. The agenda index loses its permanent slot, and inside a
country the header no longer offers a route back to compare or to the agenda
index, only to the section itself. Countries' second row changes membership with
the path, which is one more rule than a fixed list, and it is why that behaviour
is written down here and commented at the node.

**Overturned by.** Evidence that readers cannot find the thesis, or that traffic
to it collapses against its old placement, would restore it as a section rather
than reopen the grouping. Evidence that the changing row under Countries reads
as instability, rather than as one question answered two ways, would split it
into a fixed row plus a country crumb, which costs a level of depth D73 caps at
four.

## D81: The viewer owns one button, one field and one control, and no shadows

*Recorded 2026-08-30. Extends the brand contract D18 and D79 set.*

**Choice.** Four primitives in `apps/web/src/components/ui.tsx` hold every
interactive and panel geometry on the site.

1. **`Button`, `ButtonLink` and `buttonClass`.** 40px tall, 32px at
   `size="sm"`, a 12px medium label at both, `rounded-md`, a 200ms colour
   transition. Four variants carry emphasis and nothing else: `default` is the
   filled action, `accent` is lime on navy ink and a page carries at most one,
   `outline` sits beside content, `ghost` goes inside a control that already has
   an edge.
2. **`fieldClass`.** 40px, `rounded-md`, body type, because a reader writes prose
   into a form field and 12px is not a size to write in. A field and the button
   under it share a height, so a form lands on one rhythm.
3. **`controlClass`.** 32px, `rounded-md`, label type. A filter names a choice
   rather than taking prose, and it matches the small button so a filter strip
   mixing a select and a button sits on one line.
4. **`Card`.** `rounded-lg` over a 1px rule, three fills and three paddings.

Two consequences follow. **The viewer publishes no shadows.** envisioning.com
specifies a four-tier neutral shadow scale and puts `shadow-md` on cards; this
site uses none. **Navigation carries label type at every level**, so there is no
`text-sm` anywhere, which the type scale in `AGENTS.md` already stated and the
header alone was breaking.

The front page opens on `hero-band`, a flat dark section on the footer's
surface. The band spans the window through `full-bleed` and carries its own
container: `main` is a centred column, and a dark surface that stops at the
column edge reads as a card sitting on the page rather than as the page opening.
That is how envisioning.com draws every section, and it is why `html` and `body`
now clip their horizontal overflow, which absorbs the scrollbar width `100vw`
overshoots by.

The viewer draws no gradient anywhere. The band's one decoration is the dot
motif, which envisioning.com keeps in `lib/design/dot-motif.ts`: a small opaque
centre inside a larger translucent bubble, at an ambient alpha of 0.15. NCB
draws one still frame of it as an SVG pattern instead of the parent's canvas
animation, because a research surface does not need a background that moves and
a still pattern costs no JavaScript. `DotField` is atmosphere and carries no
meaning: the same motif carrying meaning is `FlagBubble` inside `FlagField`,
where the centre is a country and the ring is how well evidenced its score is.
Those two must never be confused on one page, which is why the field is
`aria-hidden` and lives only in the band.

Navigation hangs from one edge for the same reason. The sections sit right from
`md` up, so the crumb trail and the tab strip do too.

**Why.** Before this, eight files hand-rolled a button and reached five
different geometries: `px-4 py-2`, `px-3 py-2`, `px-3 py-1.5`, `px-2 py-1` and
`px-1.5 py-0.5`. Two files declared a `CONTROL` constant with different padding
under the same name, and two more inlined a third copy. Nine files repeated one
card class string verbatim. Every one of them was individually reasonable and
together they meant the site had no button, so a change to how a button looks
was a change to eight files and a chance to miss one.

The shadow omission is a real divergence from the parent brand and is recorded
rather than left to look like an oversight. An elevation under a table of scores
reads as chrome and competes with the score bands, which are the one thing on
the page that has to be read by tone. The 1px rule already separates a panel
from the page on both themes.

The nav size is the other divergence. envisioning.com's nav is 14px; NCB's
header stacks sections, a crumb trail and a tab strip, and the crumbs and tabs
were already 12px. Making the sections 12px too means a reader locates
themselves by the lime underline and the position, not by a font size that only
distinguished the top row.

**What it costs.** The three heights are three numbers to keep apart, and the
next agent will reach for the wrong one at least once. A 12px section link is a
small target, so the desktop row carries `py-2` and the mobile sheet keeps
`py-3`. Two panels in `EvidenceList` and `CheckList` still hold their classes by
hand, because the `:has()` rules in `globals.css` select on them, and a reader
of those two files will not find the `Card` the rest of the site uses.

**Overturned by.** Evidence that a 12px section link is missed or mis-tapped
would take navigation back to 14px and record it as the scale's one exception.
Evidence that panels do not separate from the page on a real screen, rather than
in a design review, would bring back the shadow scale. A second dark band
proving useful on a page other than the front page would turn `hero-band` from
a one-off into a section treatment.

---

## D82: The drawn network is a separate deployment reading a published feed

*Recorded 2026-08-30. Extends D54, D56 and D59. Does not supersede D56: the
ledger stays the authoritative reading of a relation.*

**Choice.** The project publishes an explorer feed for each mapped country at
`data/out/institutions/{ISO3}.{lang}.json`, written by `pnpm bench
institutions` and served at `/api/institutions/{ISO3}?lang=`. The feed is a
projection of `data/institutions/{ISO3}.json` and never a second source of
truth: every institution, relation and source comes from that file, and every
label comes from a lexicon.

The network is drawn by `@envisioning/app`, which is not a dependency of this
repository. It is closed source and this repository is public, so a viewer that
imported it could not be installed or built by anyone outside Envisioning. The
explorer is therefore a separate deployment that reads the feed over HTTP.

`localizeInstitutionNetwork` in `packages/core/src/i18n/institutions-pt-br.ts`
is the one place a country file's own prose is rendered into a language. The
viewer's ledger and the feed both call it, so the two surfaces cannot describe
the same institution in different words.

Only a jurisdiction the map marks `baseline` or `pilot` is worth drawing.
`DRAWABLE_COVERAGE` reads that status from the file rather than from a
hand-written list.

**Why.** D56 refused a node-link diagram and its reasons were specific: 13
relation verbs rendered identically, a star topology that spent the canvas on
spokes, and labels below the type scale. Two of those are now answerable. The
force layout has a selected-item mode that draws concentric rings around one
institution, which is the interface D56 described in words, and its labels are
measured pills at `mn` and `sm` rather than 9px SVG text.

The third is not answerable and the data says so louder than before. The
Brazilian map has grown to 359 institutions and 378 relations, and 261 of those
institutions carry exactly one relation. The 26 scaffold states are each one hub
with about eight spokes: 26 copies of the same star. Drawing all of it would
show a fringe, not a structure. The union carries 85 internal relations and Sao
Paulo 22, and those two do have a shape, which is why the drawable rule reads
coverage status.

A picture also cannot carry a relation's direction. `RELATION_FAMILY_STRENGTH`
maps the four families onto line width, and that is the whole of what the
drawing distinguishes. Direction and verb stay in the ledger, which is why the
ledger remains authoritative and the network is a second reading beside it.

Keeping the drawing outside this repository is what makes it affordable. An
in-repo mount would add about 30 transitive dependencies to a repository that
today depends on Next, React and its own core, pin React to an exact patch
version, and require a private registry token to install. The cost of the
separate deployment is one HTTP hop and one published shape.

**Cost.** The feed is a published artefact that can go stale against the map
behind it. `pnpm bench institutions` is a separate command rather than part of
`pnpm bench all`, following `velocity`, `leverage` and `residual`, so a change
to `data/institutions/*.json` that does not rerun it leaves the explorer
showing the previous map.

Language is baked in at write time, because the feed embeds rendered labels. A
new lexicon means a new file rather than a parameter, which is the same trade
the agenda documents make.

The explorer's chrome is not this project's. It brings its own header, menu and
URL grammar, so it cannot sit inside the navigation tree D73 and D80 describe.
It is reached as a leaf from the institution page and is not a nav tab.

`level` still carries Brazilian assumptions, as D56 already recorded, and
`LEVEL_COLOURS` now spends the one accent on `federal`. A country whose
capability backbone is not federal will need that mapping revisited rather than
reused.

**Overturned by.** Evidence from readers that they arrive wanting the whole
network shape, which would make the drawing the institution page's first
surface rather than a leaf beside it. Or a relation schema that records
direction and scope in a way a line can carry, which would remove the reason
the ledger stays authoritative. Or `@envisioning/app` becoming installable from
a public registry, which would make the in-repo mount cost only its
dependencies.

## D83 — V-Dem civil-society strength is the first adapter-backed Coordination repair

*Recorded 2026-08-31. Extends D23, D55 and the Coordination queue in the
research roadmap. Promotes `civil_society_strength` from a gap to an adapter.*

**Choice.** Add V-Dem's country-year civil society participation index
(`v2x_cspart`) from the pinned Country-Year Core v15 release as a third
Coordination indicator. The adapter fetches the public CC BY-SA 4.0 archive,
extracts the 2024 country-year rows and emits the existing observation shape;
the release, variable and year are fixed in `source-catalog.ts`. All 52
benchmark countries are present, so no country is silently carried forward or
excluded. The source remains explicitly expert-coded (`expert_panel`), and the
confidence penalty for that tier stays visible beside every score.

The first rescore gives Coordination a third observed row for 51 of 52
countries (the coverage floor therefore publishes 51 scores). Coordination's
Pearson correlation with log GDP per capita is 0.561 (Spearman 0.611, n=50),
down from the 0.627 Trust correlation and below the 0.70 wealth-proxy screen.
The new row's own correlation is 0.395 and its wealth-attribution delta is
0.046; it forms no redundant pair with an existing Coordination row. The row
does not erase the remaining gaps: university-industry collaboration and
public-private collaboration stay unmeasured, and the single-country score
below the floor stays visibly null.

**Why.** The index measures autonomy, organisation and participatory reach of
civil society rather than government reputation, so it answers a declared
Coordination construct without restoring the four mutually redundant WGI
composites retired by D23. It is not administrative performance data and it is
not a substitute for cross-agency delivery. Publishing the expert-coded source
with its tier and keeping the wealth diagnostics live is the smallest repair
that adds a full-frame signal while preserving those limits.

**Cost.** Coordination scores move materially because a new 0–1 frame is added;
old values are not comparable, so this is a minor dataset release and every
generated output is restated. The adapter depends on the publisher's archive
layout and on `unzip`; a future release must update the pinned variable or
fixture deliberately rather than changing the URL in place. V-Dem's expert
coding can still reflect the evaluators' assumptions, so a lower GDP
correlation is not proof that the measure is unbiased. Court performance,
cross-agency delivery and the Trust institutional family remain open work.

**Overturned by.** A release revision that changes the construct or removes
country coverage below the half-frame gate; a diagnostic release that pushes
the row above the wealth-proxy threshold or into a redundant pair; or direct
validation showing that the CSV values cannot be reproduced from the pinned
archive. Any of those would return the row to `gap` or replace it with a more
observable series.

---

## D84 — An indicator is checked for whether it still separates countries

*Recorded 2026-08-31. Extends D22 and D42. Adds `discriminationTrend` to
`data/out/diagnostics.json` and a section to the report. Changes no score.*

**Choice.** Report, for every scored indicator, the interquartile spread of its
normalised values in each year of a twenty-year window, and whether that spread
is narrowing. Two flags: `fading`, where the rank correlation of spread against
year is at or below -0.5 and the spread has narrowed by at least a quarter, and
`lowDiscrimination`, where the latest spread is under ten points regardless of
what it has done over time. The window's rules are the trend layer's rules
rather than new ones. Historical values are scored against the frame built from
every country's current values, so a change in spread is a change in the
countries and never a change in the scale, and the spread is computed on the
countries observed at both ends, so an indicator that gained coverage does not
read as one that gained variance. The balanced panel size, the filled year
count, the carried-forward cell count and the clamped cell count are published
beside every row, because each of them can hold a spread still rather than
measure it.

**Why.** Every other block in the diagnostics is a cross-section of the latest
year: how a series correlates with income, whether two series carry the same
information, how much of a dimension rests on judgement. None of them can see a
series that has stopped varying. An indicator whose cross-country spread has
collapsed still contributes a full share to its dimension's equal-weight mean,
and what it contributes after that is closer to noise than to a measurement.
That failure is silent, it arrives gradually, and nothing in the pipeline would
have noticed it. The first run finds it in two places, both of them plausible
as real convergence rather than as error: internet use, which the world has
genuinely levelled on, and income inequality, on a series sparse enough that
the carried-forward count has to be read beside the trend.

The test also answers a question the registry could not otherwise ask. Eighteen
of the thirty-six scored indicators cannot be tested at all, because they start
after the window opens or stop before it closes. That is a finding about what
this benchmark can watch over time, and it now has a number.

**Cost.** A falling spread has more than one cause and this reports only the
number. Real convergence, a publisher's methodology change, a survey series
repeating its last round between waves and a frame that clamps early values all
produce the same shape, and only the carried-forward and clamped counts
separate them, and only partially. The twenty-year window is a choice: it is
long enough to see a slow narrowing and short enough that half the registry
still reaches it, but an indicator whose decay is slower than the window will
pass. The flag thresholds are conventions with no theory behind them. Nothing
reads the block, by design: it changes no score, no confidence and no
weighting, so an indicator that fades goes on carrying a full share until a
separate decision retires or reweights it.

**Overturned by.** A demonstration that spread on the fixed frame is the wrong
statistic, most plausibly because clamping compresses early years enough to
invert the sign for a class of indicator; or a fading flag that survives its
carried-forward and clamped counts, which would make the block a trigger for
reweighting rather than a report, and would need a decision saying what a
faded indicator's share becomes.

## D85 — A section opens its pages from the header, and the header travels with the reader

*Recorded 2026-08-31. Extends D73, which stands: one tree, one ownership rule.*

**Choice.** Every section in the header opens its own pages. The section is
one control and not two: it is a link, hovering it opens what it holds, and a
click always means the same thing, which is go there. The panel shows what the
tab strip would otherwise show only once the reader is already inside. Below
`md` there is no hover to open anything, so the sheet keeps a separate chevron
and the pages open in place under the section.

The panel reads the same level of the same tree the tabs read, through
`sectionMenuEntries` in `apps/web/src/lib/nav.ts`. A menu and a tab strip
cannot disagree about what a section holds, because neither knows anything the
tree did not tell it.

One node needed a second answer. Countries resolves its row from the path, so
on a country page the row is that country, which is what the crumb is for. A
menu is opened from anywhere, and answering "which country am I in" to a reader
who asked "what is in Countries" is answering a question nobody asked. A node
may now declare `menuChildren`, the row it offers when opened rather than when
walked, and Countries declares the three cross-country readings. It is the only
node that needs it, and the field exists so the exception is stated in the tree
instead of being guessed at by the renderer.

The panel hangs directly under the link, and the offset above it belongs to
the panel rather than being a gap: empty space between a trigger and what it
opens is somewhere for the pointer to fall through on the way down. A menu
closes when the pointer leaves both, after a beat long enough to survive a cut
corner, and on Escape with focus back on the link, and on arriving at a new
page. Escape is read from the document rather than from the panel, because a
hover opens a menu without moving focus into it.

A keyboard has no hover. ArrowDown from a section link opens its panel and
lands on the first item, the arrow keys walk it and wrap at both ends, and Home
and End reach the ends directly, because `role="menu"` promises a reader that
they will. The item focused on a keyboard open is chosen in a render and not in
a frame callback: a tab that is not painting never runs a frame, and the focus
was silently lost there before this was written down.

The lime mark moved from the control onto the label inside it. The control now
holds a chevron as well, and an underline drawn under a chevron is a smudge.

The header is sticky, and the tab strip rides inside it so the two bands stick
as one. A menu the page can scroll out from under is a menu that has to be
scrolled back to. `html, body { overflow-x: clip }` in `globals.css` is what
allows this, and D81 chose `clip` over `hidden` for exactly this reason. The
tab strip moved inside the `header` element rather than beside it, which also
keeps the embed rule in `globals.css` pointing at one element to hide.

The sheet carries its own scroll at `70dvh`. A sticky box taller than the
window has a bottom that no amount of scrolling reaches, and the sheet with a
section expanded is taller than a phone.

**Why.** The tab strip only exists once the reader is standing in the section
that owns it, so the site's shape was legible only from inside. Nine method
pages, three cross-country readings and four ways to take part were one click
away from a reader who already knew they existed and invisible to one who did
not. The footer listed them, which is a fine second answer and a poor first
one. This costs the header a duplicate of the row already under it while the
reader is inside a section, and that duplicate is the price of the same set
being reachable from outside it.

**Cost.** Hover is not an input every reader has. A touch reader taps a
section and goes there, which is what the tap did before this, so the panels
are a desktop affordance and the sheet's chevron is what stands in for them.
The sticky band is 189px on a country page, where the crumb takes a line of its
own, against 120px on a method page and 72px where a section has no pages under
it; on a short window that is a real share of the fold. A panel that opens on
hover also opens on the way past, which is the price of not making the reader
click for it.

**Overturned by.** Evidence that readers open sections they are already in more
than sections they are not, which would make the menus a duplicate of the tabs
rather than a way past them; or a header that has to grow a fourth row, which
would make the sticky band too tall to keep.

## D86 — The front page states the claim under test, not the shape of the data

*Recorded 2026-08-31. Divides with D75 and D80.*

**Choice.** The dark band that opens the front page says what the benchmark is
testing: that a country's capability is separate from its wealth, and that
public data can see the difference. It no longer says how the data is shaped.
The count of dimensions, the common scale and the confidence beside each score
left the band, and the sections under it keep all three.

Three pages now hold three different things about one project, and none of them
repeats another. `/thesis` argues why capability is the bottleneck now, which
is a claim about the world. The front page states the claim the benchmark can
fail, which is a claim about the instrument. `/about` says what the instrument
is made of. D75 split the second and third; this splits the first from both.

**Why.** The band read as a specification. "Nine capabilities, scored from
public data" answers a question nobody has asked yet: a reader who has not been
told why capability is worth separating from income has no use for how many
parts it has, and the two sections directly under the band already say it
better, with the data drawn beside them. An opening that describes its own
format spends the one place on the site where a stranger is still deciding
whether the project is about anything.

Stating the claim also states the failure. "Tests whether" is a promise that
the answer could be no, and the diagnostics section further down the same page
reports how far the separation actually holds. An opening that can be wrong is
worth more than one that cannot.

**Cost.** The band no longer says what the reader is looking at, so the first
concrete fact about the data now arrives one section down. A reader who came
for the numbers reads a sentence of argument first. The claim is also stated in
`docs/WHY.md` and argued on `/thesis`, so three surfaces now carry a version of
it and can drift apart; the front page holds the shortest one on purpose, and
it is the one to change last.

**Overturned by.** Evidence that readers arrive already knowing why capability
is worth measuring and leave because the front page will not tell them what it
holds, which would make the band the wrong place for an argument.

## D87 — The Countries menu draws the country you are standing in

*Recorded 2026-08-31. Extends D85.*

**Choice.** The Countries menu opens with the shape of the country the path
names, drawn as the same nine-axis radar the countries grid gives every card,
above the three cross-country rows. Away from a country there is no shape and
the menu is what it was.

This is the answer to a problem D85 created. That decision made the menu's rows
path-independent on purpose: a menu is opened from anywhere, so it offers the
readings that hold from anywhere, and a reader standing in Chile who opens
Countries sees the same three rows as a reader standing in Japan. Correct, and
it leaves the menu with nothing that says where the reader is. The shape says
it, in the one language this site is built to be read in. It is also the
argument for publishing no single number, made in the smallest space the site
has: nine axes at a glance, and no total anywhere on them.

A node declares `menuPreview` and the renderer decides how to draw it, the same
division `menuChildren` uses. The tree says there is a picture and what it is
of; it does not know what a radar is.

The shape is fetched when the menu opens, from `/api/shape/[iso3]`, which
returns nine scores and nine confidences and nothing else. The header renders
above every page, and the slim index is 597KB with no cache in `loadIndex`, so
reading it in the root layout would make a reader on the glossary page parse
every country in the benchmark to render a chart they will never open. The
cache holds the request rather than the answer, so the second mount joins the
first instead of asking again. The radar is loaded with the menu through
`next/dynamic` for the same reason: it is the largest component in the viewer
and it should not sit in the first bundle of a reader who never opens a menu.

The picture is not a link. The rows below it are where the menu goes, and the
country's own profile is one click away in the crumb beside it, so a third
target here would compete with both.

**Why.** A shape is what this project has instead of a rank, and the menu was
the one place a reader could open, on a country page, and be told nothing about
that country. It also costs nothing to a reader who does not open it, which is
what made it worth adding to a header whose restraint is deliberate.

**Cost.** A chart that arrives over the network arrives late: the panel opens
at its full height with an empty box where the shape will be, and on a slow
connection the reader sees the rows before the picture. Holding the height is
the deliberate half of that, because a panel that grows under a moving pointer
is worse than one that waits. It is also the first thing in the viewer that
draws data outside a page, which means the header can now be wrong about the
data in a way it never could before: a shape cached at the top of a session
survives a re-ingest that changes it.

**Overturned by.** A measurement that readers open the Countries menu to
navigate and are slowed by a picture in the way; or a second menu wanting a
preview of its own, which would make `menuPreview` a general mechanism rather
than the one exception it is written as.

## D88 — The footer is the tree, not a copy of it

*Recorded 2026-08-31. Completes D73.*

**Choice.** `FOOTER_NAV_GROUPS` is derived from `NAV_TREE`: one column per
section, labelled by the section, holding what that section opens. It was a
hand-written list of four groups that spread the same page arrays the tree
walks, close enough to look derived and not derived at all.

It had already drifted. Capabilities opened nine dimensions in the header and
was a single link in the footer, and the footer's first column was called
Explore, which is not a section and answers to nothing in the tree. A sixth
section would have reached the header, the crumb, the tab strip and the sheet,
and never the footer, and nothing would have failed.

The column count is derived as well. It was `lg:grid-cols-5` in the markup
beside a comment naming the one group that took two of them, which is the same
kind of fact written down in the same wrong place: the moment the groups came
from the tree, that number put a section on a row of its own. A group longer
than six entries takes two columns and splits inside them, and the row is as
wide as the groups need. The rule is the length and never the name.

D73 said one tree, one ownership rule, one renderer, and it meant the header.
The footer was outside that sentence and stayed a copy for as long as the
sentence stopped where it did.

**Why.** Two lists of one thing agree only while somebody edits both, and the
proof that nobody had was sitting in the footer: a section that opened nine
pages upstairs offered one downstairs. A missing footer link is the quietest
possible failure, because the page it points at still exists and still works,
and nothing anywhere reports that the way in went away.

**Cost.** The footer now shows every capability, which is nine more links in a
place that carried 19 and now carries 28, and the sections no longer get to
disagree with it on purpose. A footer that wants to say less than the header
says, which is a reasonable thing for a footer to want, now has to say it in
the tree or not at all. The width map spells out the classes Tailwind can see,
so a tree wider than the map wraps to a second row rather than overflowing:
that is the right failure, and it is still a failure that only shows up on
screen.

**Overturned by.** A section whose footer column is the wrong shape for what it
holds, most plausibly Countries once there is a way to offer more than the
three cross-country readings; or a decision that the footer's job is a chosen
short list rather than the whole tree, which would want the choice recorded in
the tree as a field, never as a second array.
---
## D89 — The subnational layer is a computable diagnostic registry, not a second score

*Recorded 2026-08-31. Supersedes the fixture language in D66 while preserving
its national-score boundary.*

**Choice.** Subnational output is published through a registry of country,
geometry, source, unit, reconciliation rule and denominator method. Each
published file carries the national value beside its constituent values, the
retrieval metadata and a `check` block containing the recomposed value, the
national value, the signed residual and a tolerance. `aggregate` is a claim
that the build tests: validation fails when the recomposed value differs from
the published national value by more than that series' tolerance. `equal` and
`population` describe how the diagnostic recomposition is calculated;
`none` means no recomposition is claimed. The denominator is therefore a
calculation method, not evidence that the statistic is additively decomposable.

The 2024 IBGE state Gini fixture is restated as `independent` with an equal-unit
diagnostic. Its published state mean is 0.486 against a national coefficient of
0.503, a signed residual of about -0.017. That residual is shown because it
reveals the between-state component that a state range hides; it is not a
failed build and it is not a national score. Population denominators are
recorded from IBGE's 1 July 2024 federative-unit estimates so a future
aggregate series can be recomposed without an unsourced weighting.

The registry and its files remain outside `buildFrame`, `score`, `confidence`,
`momentum`, agendas and rankings. A subnational unit receives no capability
score and no benchmark confidence. The first maintained geometry is state;
publishing municipal output requires a separate decision about the unit of
analysis and the resulting reader contract.

**Why.** D66 correctly kept subnational observations beside the comparison
layer, but a hand-written reconciliation label let the first fixture assert a
false aggregate relationship. Making the calculation and its inputs explicit
turns the label into an auditable claim. A registry prevents every new series
from growing a bespoke adapter, while a small index makes the research layer
discoverable without filesystem probing. Keeping the Gini independent preserves
the useful local variation instead of forcing a mathematically invalid national
recomposition. The first candidate for expansion is SICONFI budget execution,
but it must pass the source-memo and exact-variable checks before publication.

**Costs.** The output contract and path are breaking for consumers of the pilot,
so the dataset version moves major even though national scores do not move. A
per-series tolerance needs editorial review, and population estimates may not
be the right denominator for every administrative statistic. The registry
still needs one adapter per publisher family, and a state census can show
variation without proving delivery quality. Municipal data is deliberately
left unresolved rather than smuggled in through a state-shaped interface.

**Overturned by.** A reproducible decomposition method showing that the Gini
fixture's state values can validly compose the national coefficient; evidence
that readers mistake the diagnostic residual for a score; or a source release
whose unit definitions cannot be mapped to the registry without silent
imputation would require revising the contract. A successful municipal pilot
with a clear audience and stable unit identifiers would justify a separate
geometry decision, not a relaxation of the national boundary.

## D90 — Evidence coverage is a complete country-by-capability matrix

*Recorded 2026-08-31. Extends D20, D35, D46 and D76.*

**Choice.** The agenda index derives one complete matrix from the published
evidence register: every country in `COUNTRY_ISO3` is a row and every dimension
in `DIMENSIONS` is a column, including the empty cells. A filled cell prints the
number of documented deliveries filed against that country's gap indicators in
that dimension and links to the same filtered delivery register D46 defines.
Row totals state both capabilities covered and records filed; column totals
state countries represented and records filed.

`buildAgendaEvidenceCoverage` in `packages/core/src/pipeline/agenda.ts` is the
only aggregation. It reads each record's dimension through the indicator
registry, so a record cannot be filed into a second hand-written capability
map. The matrix remains a reading of `data/evidence/records.json`: it enters no
score, confidence, coverage floor or research-run approval path.

An empty cell is labelled as an uncovered research slot, not as evidence that
the country lacks the capability. A filled cell is evidence that at least one
qualifying delivery was documented, not evidence that the whole capability is
present. Record counts are therefore inventory counts and never capability
weights.

**Why.** The delivery register could answer which cases exist after filtering,
and the research inventory counted countries and dimensions separately, but
neither showed their intersection. A reader could see 79 records and 22
represented countries without seeing that the current corpus fills only 44 of
468 country-dimension cells. Keeping every zero visible makes language bias,
country concentration and thin dimensions concrete before the next source
search begins.

The matrix also replaces the agenda index's separate country list. Every row
still reaches the country's agenda, while the page no longer prints the same
country set twice.

**Costs.** Fifty-two rows and nine capability columns require horizontal
scrolling on a narrow screen. A count can conceal that several deliveries use
the same publisher or bear on the same gap indicator, so the cell is a doorway
to the records rather than a quality grade. As the corpus grows, large counts
may become less useful than a status or source-family split; adding either must
still preserve the one-record-one-delivery rule and the empty cells.

**Overturned by.** Evidence that researchers choose better-balanced source
checks from a smaller queue view, or that readers consistently mistake filled
cells for scored capability, would move the matrix off the public agenda index
and leave it as a research artifact. A comparable series that closes a gap
removes that indicator from the case lane under D20; the matrix must then be
rebuilt from the remaining admissible records rather than preserving a stale
cell for visual completeness.

## D91 — Country context and page links share one subnavigation band

*Recorded 2026-08-31. Supersedes the visible rendering half of D73; the single
navigation tree and path-based ownership remain.*

**Choice.** The five global sections remain the only top-level row. Every route
with child pages gets one subnavigation band beneath it. On a country route,
the country context and the deepest page set share that band; on a layered
country route, the country context, the English/local reading choices and the
current reading's page set share it as well. The global section is not repeated
inside the breadcrumb because it is already active in the row above. The tree
in `nav.ts` still carries the levels needed to resolve ownership and links, but
the renderer never gives each level its own horizontal row.

**Why.** The country screenshot made the navigation read as three steps:
section, country and page. The repeated `Countries` label added no wayfinding,
and a separate country row followed by a page row made the header taller than
the page hierarchy required. Keeping the country context beside its page links
preserves the reader's location and every destination while making the one
subnav rule consistent with Method, Capabilities and the country index.

**Costs.** A narrow viewport can wrap the context and page links within the same
band, so it is a flexible row rather than a guaranteed single line. Layered
countries still have more choices in that row because their reading is a real
alternative, and the breadcrumb remains a compact context selector rather than
a full linear history. The navigation tree is deeper than its visible bands,
which must stay clear in comments and accessibility labels.

**Overturned by.** Evidence that readers cannot tell country context from page
links in the shared band, or that the wrapped row becomes harder to operate than
the previous stacked treatment, would justify restoring separate context and
page bands. A new kind of country layer with more than one reading or a page
set that cannot fit the shared row would require a new layout decision rather
than an exception in a component.

## D92 — The agenda history reaches for the oldest fetched year, but never invents a trend

*Recorded 2026-08-31. Extends D22 and D24.*

**Choice.** World Bank ingestion now requests history from 1976, which is the
current 50-year look-back. The default momentum spans are ten years, twenty
years, thirty years and the oldest configured ingest year. The last span is
derived from `INGEST_FROM_YEAR` and the scoring year rather than hard-coded, so
the horizon follows the source window. A span is published only when its
matched basket still has at least two indicators and covers half of the
country's current observed indicators in that dimension. The agenda chart
offers the spans present in that country's published output, one dimension at a
time, on today's 0–100 frame.

The older fetch added 3,611 observations without restating or dropping an
existing value. In the current 52-country run, a 50-year matched basket exists
for eight country-dimension cells; Brazil's dimension-level history reaches
thirty years in Agency, Adaptability and Building, while individual indicators
can reach further. A missing 50-year dimension line is therefore an evidence
boundary, not a claim that the country did not change.

**Why.** The request for a longer country timeline is useful, and the raw
World Bank series contain some pre-1990 history. Extending the fetch gives the
chart a chance to show a genuine long movement while preserving D22's two
guards against dataset churn: one current ruler and one basket held constant
between the endpoints. Keeping ten and twenty years beside the longer views
also shows when a long line depends on a narrower set of measures.

**Costs.** The observation and country output files grow, and a 50-year span is
available for only a small minority of country-dimension cells because many
indicators began later or are periodic. The current frame makes historical
values comparable but not absolute development levels; values outside it still
clamp and are counted. A 1976 start is a retrieval boundary, not evidence that
every country is observed continuously from that year. The chart must continue
to show gaps rather than fill them.

**Overturned by.** A source window with stable, comparable pre-1976 coverage
would justify moving the ingest start earlier. Evidence that a longer matched
trend systematically misleads readers about a discontinuity, or that its
minimum basket hides more than it reveals, would justify removing the oldest
default span while retaining the indicator-level histories.

## D93 — The history window reaches 1960, and the fetch must not truncate it

*Recorded 2026-08-31. Supersedes the 1976 retrieval boundary in D92 while
preserving its matched-basket and no-imputation rules.*

**Choice.** `INGEST_FROM_YEAR` moves to 1960, the earliest year the registered
World Bank request can usefully ask for across the benchmark's current source
families. The default momentum spans keep ten, twenty, thirty and fifty years,
then add the oldest configured window, which is derived from the scoring year
and the ingest start. The World Bank request page size rises from 3,000 to
10,000 rows so 52 countries over the longer window arrive in one complete
response. The ingest report remains authoritative: a source failure is carried
forward, while a successful response is never silently truncated.

The first corrected 1960 fetch added 4,570 observations and dropped none. The
previous incomplete attempt had recorded 4,251 apparent drops before the page
size was corrected; the following run restored them as additions, leaving the
observation file complete for the successful response. No value was restated.

**Why.** More history gives the agenda a wider context and lets the benchmark
test whether a dimension's movement survives a longer comparison. The window
is intentionally wider than the requested fifty years so a source series that
starts in 1960 can be used at its earliest point. The published dimension trend
still requires two indicators at both ends and half of the current observed
basket. A missing long span is evidence coverage, not a zero and not an
extrapolation.

**Costs.** Many World Bank indicators begin after 1960, so dimension-level
trends will remain much shorter than individual indicator lines. The files and
revision log grow, and the ingest boundary may span political or statistical
breaks that the model cannot identify. A large page size is safe only while the
country set and requested years fit below it; if they grow beyond that, the
fetcher needs explicit pagination rather than another silent increase.

**Overturned by.** A registered source release with earlier, comparable data
would justify moving the window again. Evidence of incomplete responses under
the current page size, or a reader test showing that the extra context is
mistaken for an absolute development score, would require pagination or a
different presentation boundary before extending the range further.

## D94 — Dated agenda evidence anchors a separate history rail

*Recorded 2026-08-31. Extends D20, D22, D35 and D92.*

**Choice.** Every country's agenda evidence record carries its sourced
`started` year into `ownEvidence`. The agenda history chart filters those
records to the selected dimension and plots them by year on a separate rail
aligned to the full configured source window. The capability line remains the
matched indicator basket and retains its own span, base score, current score,
confidence and clamp caveat. The event rail is context only: it never enters a
score, confidence, momentum basket, agenda kind or ranking. Each marker has
the record title and year in its accessible label, and the visible list below
the rail keeps the items discoverable without requiring hover.

**Why.** The benchmark already records institutional changes beside missing
indicators, but the prose list made it hard to see sequence and overlap. A
separate rail puts a documented delivery next to the period in which the
quantitative evidence moved without pretending that the delivery caused that
movement. Keeping it separate also allows an older agenda item to remain useful
when no dimension-level basket reaches back to its year.

**Costs.** A dated delivery is not a complete history and its start year is not
the year its effects appeared. Several items can share a year, so markers may
stack into lanes. The rail can show only evidence records with a sourced start
year inside the configured window; earlier records stay in the agenda list.

**Overturned by.** Evidence that readers infer causation from proximity alone,
or that the rail becomes too dense to identify individual records, would justify
removing it or limiting it to an explicit event-selection view. A comparable
series that directly measures the documented delivery could move it into the
capability line under D20, but it would still not make the event marker a score.

## D95 — The country shape belongs to the field hover, not the Countries menu

*Recorded 2026-08-31. Supersedes D87.*

**Choice.** The homepage's FlagHistogram passes each country's nine scores and
confidences into the shared `FlagFieldPoint`, and the field's existing hover
card draws the country radar beside its one-capability position. The Countries
menu keeps only the navigation rows it opens; it carries no country preview.

The radar is passive and not a second target: the flag remains the link to the
country profile. It is loaded dynamically when a hover card needs it, so the
field's initial bundle and the other FlagField surfaces do not pay for a chart
that has not been requested. Other surfaces can opt in by supplying the same
optional shape field, while the shared field geometry and hover behavior remain
the only distribution implementation.

D87 put the right picture in the wrong place. A reader looking at the field is
already asking what the country at that position looks like across the other
capabilities; a navigation menu is answering where its links go. Keeping the
shape with the flag makes the explanation arrive at the point of attention and
leaves the menu legible as a menu.

**Why.** The homepage is the comparative entry point and already has the full
slim profile for every country. Re-fetching one profile from a header menu
added latency, a second data path and a large visual interruption to a control
whose job is navigation. The hover card has the score, confidence, trend and
within-country spread already, so the radar completes that reading without
introducing a new interaction target.

**Cost.** The shape is available only while a flag's hover card is open and is
not present in the Countries menu. A compact radar adds height to that card and
can extend above or below the field near an edge, so the card remains
pointer-transparent and the flag remains the only link. The homepage already
ships the nine-value profile needed to draw it; dynamic loading limits the
additional JavaScript cost until the reader asks for the shape.

**Overturned by.** Evidence that readers need country context while navigating
from a country page, or that the homepage hover card becomes too tall to read,
would justify revisiting the placement. A second surface needing the same shape
should extend `FlagFieldPoint` or a shared profile component, not recreate the
radar or add another menu-specific data path.

## D96 — Native tooltips are for exceptions, not metrics

*Recorded 2026-08-31. Extends D18, D53 and D67.*

**Choice.** The viewer does not attach native browser tooltips to every score,
confidence meter, trend mark, table cell or chart point. Score bands are
explained in the visible score legend; confidence bands are explained in the
visible confidence legend; trend context is printed beside the change; and
compact states such as clamping, missing coverage and rejected inputs are
named in the row or a screen-reader-only description. SVG charts use their
chart-level accessible names and visible event lists rather than `<title>`
elements that appear on pointer hover.

The deliberate `FlagField` country card remains the one richer hover reading.
It is part of the field's interaction contract, is pointer-transparent, and
does not add a second link or a tooltip to each metric inside the card. See
D67 and D95.

**Why.** Native `title` hovers are browser-controlled, inconsistent across
devices, unavailable on touch, and easy to trigger accidentally when a table is
dense. The same explanations were already present in page copy, legends,
dialog content or linked detail pages, so repeating them on every number made
the interface feel noisy without adding a reliable reading path. Moving the
important meanings into the page also preserves them for keyboard and touch
readers.

**Cost.** A reader no longer gets an extra sentence by pausing over an
individual score or chart point. The replacement is intentionally less
per-cell: legends and row labels explain the shared rule, while the field card
is reserved for the chart that needs point-of-attention context. A future
detail interaction should be an explicit, keyboard-reachable disclosure rather
than another native `title` attribute.

**Overturned by.** Evidence that a specific dense view loses an important
meaning after the change would justify adding a visible or keyboard-reachable
detail control for that view. It would not justify restoring a repeated native
tooltip to a shared metric component.

## D97 — Challenge entry is centralized in the header

*Recorded 2026-08-31. Supersedes the score-side trigger in D62 and the
score-side wording in D78.*

**Choice.** The score-side Challenge control is removed from radar readouts and
score tables. One `Challenge` action lives in the global header on desktop and
mobile. It opens the public dispute form with country and capability selectors;
the submission endpoint still validates the target and captures the current
score and confidence from the country file. Contested badges remain beside
affected scores because they report state rather than offer an action.

`/objections` remains the public ledger and explanation of how to object. The
header action is the single entry point for a new score dispute, so a reader
does not have to find a particular table cell before deciding to argue with the
benchmark.

**Why.** A challenge button in every score cell repeated the same action across
the radar, country profile, capability table and all-country table. That made
the benchmark's invitation to argue compete with the scores themselves and
made the most useful action depend on which surface happened to be open. A
single header action is discoverable everywhere while the selectors preserve
the target snapshot that D62 requires.

**Cost.** The form no longer inherits a target automatically from the number
beside it. The reader must choose the country and capability, and the form
does not show the selected score until the server records the submission. The
public ledger and the contested state remain separate from the entry action so
that removing a button does not remove the review trail.

**Overturned by.** Evidence that readers cannot identify the target from the
selectors, or that objections fall because the score is no longer visible at
the moment the form opens, would justify adding a target-aware preview to the
central form. It would not justify restoring a button to every score cell.

## D98 — Confidence values use one compact display

*Recorded 2026-08-31. Supersedes the confidence-meter presentation in D17 and
the `ConfidenceBar` presentation described in D18.*

**Choice.** Every viewer surface renders a confidence value as one
band-colored chip containing its exact two-decimal number. The separate track
and number are removed. Confidence remains a separate claim from the score;
the visible confidence legend names the bands, and radar edges and flag rings
continue to provide the chart-specific evidence encoding.

**Why.** A track followed by a number made one confidence value read as two
controls and consumed more space than the score it qualified. One compact
display keeps the exact value legible, preserves the band distinction, and
lets tables, cards and prose use the same treatment.

**Cost.** The chip no longer uses bar length to show the magnitude within a
band. The number is the precise magnitude and the legend explains the shared
band colors; charts retain their own dashed-edge and ring treatments.

**Overturned by.** Evidence that readers mistake the chip's band color or lose
the exact value would justify a more explicit single-element treatment, such as
a chip that includes the band label, but not a return to a repeated track and
number pair.

## D99 — Portugal joins the benchmark frame as a source-backed country

*Recorded 2026-08-31. Extends D47, D52, D64 and D83.*

**Choice.** Portugal (`PRT`, flag code `PT`) joins the single country registry.
No indicator, weight or transform changes. The 53-country set therefore builds
the normalization frame, and the published dataset moves from 5.1.0 to 6.0.0.
The existing World Bank ingest, Joint EVS/WVS trust adapter and V-Dem adapter
are rerun against the expanded set; no manual or synthetic Portugal values are
added.

The source-backed release emits 841 World Bank observations for Portugal, one
2022 Joint EVS/WVS A165 trust observation and one 2024 V-Dem civil-society
observation. Portugal publishes all nine dimension scores in the rebased output,
with the lowest current scores in Experimentation (30.3) and Building (33.9).
Trust is readable but remains very thin at 36.8 with confidence 0.159, so the
profile is a measured research case rather than a claim of a complete national
capability picture.

Portugal has no documented delivery records yet. The refreshed research
inventory keeps it in the queue with 25 uncovered country-gap slots; those
slots are leads for source and case research, not evidence and not scores.

**Why.** Portugal adds a useful Southern European comparison to Spain and the
other European cases while preserving the benchmark's one shared frame. The
country is added as a data-set expansion because it is an explicit research
case, not as a side effect of closing an indicator gap.

**Cost.** Every score and historical normalized series is restated under 6.0.0;
5.1.0 values are not comparable to the new frame. The country addition also
increases the current evidence matrix from 468 to 477 country-dimension cells.
Portugal remains absent from the Brazil-specific country layer under D69, and
its research queue remains empty of documented deliveries until a source-backed
or evidence-track contribution passes the existing gates.

**Overturned by.** Evidence that Portugal is outside the benchmark's declared
comparison purpose, that its source mappings are not reproducible, or that the
expanded frame distorts well-evidenced countries enough to invalidate the
relative scale would justify removing or revising this case in a subsequent
versioned rebase.

---
## D100 — A retired row no longer lowers coverage

*Recorded 2026-08-31. Amends D23 and D45; the confidence definition comes from D37's contract.*

**Choice.** `confidence = coverage x recency x source_quality` keeps its shape,
and `coverage` changes its denominator. It was observed indicators over every
row the dimension declares. It is now observed indicators over the rows that
could carry a number: the observed rows plus the declared gaps. Rows marked
`ingest: 'retired'` leave the denominator.

Retired rows do not leave anything else. They stay in the registry, they stay
published on each country's indicator list with `status: 'retired'`, they stay
counted in `measurability` in the diagnostics, and the evidence for rejecting
each one stays in its registry note and its decision. A reader can still see
that Trust declares eight constructs and measures two.

**Why.** A gap and a retirement are different facts about the world and the
denominator was reading them as one. A gap says nobody publishes a comparable
series, so the dimension cannot be measured here yet. A retirement says a series
exists, this project inspected it, and it measures the wrong thing: the four WGI
series correlating with each other between 0.93 and 0.98 and with log GDP per
capita at 0.91 (D23, A4), the LPI recording how a country looks to freight
forwarders (A9). Charging a dimension for refusing those was charging it for the
discipline that makes the rest of the number worth reading.

It also put a ceiling nothing could lift. Coordination and Trust each declare
eight rows and retire three. Under the old denominator their coverage could not
exceed 0.625 however much data landed, which capped their confidence near 0.53
and made the `good` band unreachable by construction rather than by evidence.
A confidence scale that a dimension cannot climb is not measuring how much is
known about it.

**Cost.** Every published confidence value for Coordination, Trust, Building and
Shared Purpose restates upward, and two dimensions cross a band boundary:
Coordination from very thin to thin, Shared Purpose from very thin to thin. No
score moves, the normalization frame is untouched, and no country is added or
removed. The change makes four dimensions look better evidenced without a single
new observation, which is real: the reader must still read `observedIndicators`
beside the confidence, and A12 remains the entry that says what Trust and
Coordination actually rest on.

The bump is minor. The frame holds and no published field is added or removed,
so D37's major test is not met, but a consumer pinned to a confidence band will
see cells move. D37's three cases do not describe a change to how a published
number is computed, and this entry records that the bump was chosen rather than
derived.

The change is not sufficient for its own motivation. Measured against the
current output it moves the site mean confidence from 0.386 to 0.422, and Trust
stays very thin at 0.209 because Trust's problem is two observed rows, not three
retired ones. Coverage still has to be earned.

**Overturned by.** Evidence that readers take the higher confidence as a claim
about evidence rather than about declared measurability, or a decision to retire
rows for reasons other than rejecting an inspected dataset, which would make the
denominator selective in a way this entry does not defend.

---
## D101 — Portugal's first evidence batch stays outside the score

*Recorded 2026-08-31. Amends the research-state statements in D99 and extends
D20 and D33.*

**Choice.** Five source-backed records for Portugal enter
`data/evidence/records.json`: national digital identity, the CoLAB
applied-research network, the Qualifica adult-learning programme, Portugal
Ventures, and the dismantled Novas Oportunidades programme. They document
delivered institutional cases against four gap indicators, include one reversal,
and remain evidence rather than observations: they do not enter a score,
confidence value, normalization frame or dimension coverage count.

The refreshed research inventory therefore reports 204 deliveries across all 53
countries and 21 gap indicators, including five Portugal records. Portugal still
has 21 uncovered country-gap slots, which remain the queue for comparable source
work. The records' claims, dates, publishers and limits stay in the evidence
ledger; no research lead is treated as a scored series.

**Why.** Portugal's source-backed country profile benefits from documented cases
that show how institutions deliver, rebuild or scale capability, especially where
the benchmark's comparable indicators remain gaps. Keeping the cases in the
evidence layer preserves the distinction between a sourced national example and
a country-comparable measurement.

**Cost.** D99's statements that Portugal had no documented delivery records and
25 uncovered country-gap slots are superseded by this batch. The dataset remains
6.0.0, all nine Portugal scores and the 53-country frame are unchanged, and the
four gap indicators remain gaps until a comparable series covers at least two
countries. If a gap is later promoted, these records may be stranded under D20;
the decision and git history keep that research trail auditable.

**Overturned by.** A source correction, failure of the evidence inclusion tests,
or proof that a record is an announcement rather than a delivered institutional
case would justify removing or rewriting that record in a later evidence change.

---
## D102 — The confidence-method update keeps Portugal on the same frame

*Recorded 2026-08-31. Extends D37, D99, D100 and D101.*

**Choice.** The Portugal country addition remains the Dataset 6.0.0 frame rebase.
The later retired-row denominator change in D100 is published as Dataset 6.1.0:
it restates confidence values, but does not add or remove a country, alter the
normalization frame or change any dimension score. Portugal remains one of 53
countries with nine published scores, five non-scored evidence records and 21
uncovered research slots.

**Why.** The semantic version separates the material country-set rebase from a
method change that affects confidence but leaves scores and the frame intact.
Naming both releases lets a reader distinguish Portugal's admission from the
later confidence restatement while keeping the evidence and research trail
continuous.

**Cost.** A consumer pinned to Dataset 6.0.0 will see different confidence values
than one reading 6.1.0, even though the Portugal scores and frame are identical.
The current Portugal Trust confidence is 0.255 under the 6.1.0 denominator, and
its low confidence still limits how strongly that score should be read.

**Overturned by.** Evidence that the denominator change altered a score or the
normalization frame, or that the version boundary hides a published-shape change,
would justify revising the release classification in a later decision.

---
## D103 — Every chart draws from one set of weights and shades

*Recorded 2026-09-01. Extends D81 to the charts.*

**Choice.** `CHART_STROKE`, `CHART_INK` and `CHART_MOTION` in
`apps/web/src/components/chartTokens.ts` hold five line weights, five opacities
and three speeds, and the radar, the flag field, the flag bubble and the
sparkline read them. A stroke width or a frame opacity written into a chart by
hand is drift, and `pnpm design:check` says so.

The four charts carried nine stroke widths and twelve opacities between them,
every one of them chosen in the file that used it. Almost all of them were
already within a tenth of each other, which is the tell: nobody was disagreeing,
everybody was eyeballing. Collapsed onto five steps each, no weight moved by
more than 0.1 and no shade by more than 0.1, and the radar's filled edge, the
sparkline's series and the focal bubble's ring now say the same thing at the
same weight.

The steps are absolute rather than relative, because every chart here draws a
viewBox unit at roughly one displayed pixel. A chart deliberately shrunk below
that, like the peer radar in a table cell or the shape inside the field's
hover card, shrinks whole and keeps the ratios, which is what it is for.

In-chart text is not in the file. The radar names its axes inside a 260 unit
field and the flag field labels its ticks inside a 960 unit one, so one number
cannot mean one size across both, and a token that has to be scaled at every
use is a literal with a longer name. Those sizes are named inside each chart's
own geometry instead, where the field width they are sized against is.

Four things that draw are outside it and say why in their own file: `Icon`
carries Lucide's weight on Lucide's grid, `EnvisioningMark` is brand geometry,
`Og` draws a 1200 pixel social card in a different medium, and `DotField` is
atmosphere rather than data, which D81 already required it to stay.

**Why.** A reader learns a picture once. The weight of a line is how a chart
says whether something is the frame or the finding, and that only works while
every chart on the site agrees. Nothing was holding the agreement together: the
weights were close because they were copied, and a copy drifts on the first
change nobody compares. The same argument D81 makes for the button and the
field, one step down, where it is harder to see going wrong.

The check that guards it warns rather than fails. Every rule in it is a judgment
the author is allowed to overrule, a stroke width is not a broken build, and a
gate that stops a deploy over a hairline teaches people to route around it. What
it buys is that the drift is said out loud on the build where it happened.

**Cost.** Five steps is fewer than the charts were using, so a chart that wants
a weight between two of them has to argue for a sixth step in this file rather
than type a number. That is the intended cost and it will be paid by somebody
who is right. The shades moved slightly: the median line on the flag field is a
little darker, its ticks a little lighter, and the radar's outer ring a little
lighter than they were. The warning-only check will be ignored the first time
somebody is in a hurry, and nothing will report that it was.

**Overturned by.** A chart whose natural drawing scale is not one unit to one
pixel, which would make an absolute scale wrong rather than merely coarse and
would want the weights expressed as a ratio of the field; or evidence that a
reader distinguishes fewer than five weights on these surfaces, which would
shorten the scale rather than lengthen it.

---

## D104 — The drawn network is mounted in this repository, and the ledger stays authoritative

*Recorded 2026-09-01. Supersedes the deployment clause of D82. Keeps everything
else D82 recorded: the projection, the feed, the drawable rule and the ledger's
primacy.*

**Choice.** `@envisioning/app` is a dependency of `apps/web`, and the drawn
network is mounted at `/network`, reading the same feed `bench institutions`
writes. `/api/institutions/{ISO3}` still publishes that feed, now for readers
outside this deployment rather than for the drawing itself.

The route is a leaf. The library brings its own header, menu and URL grammar,
so `/network` is reached from a link on each institution page and is not a node
in the navigation tree D73 and D80 describe. Its stylesheet is imported in the
route's own layout, so it loads there and nowhere else, and `theme.css` restates
NCB's tokens in the shape the library reads rather than sampling its palette.

**Why.** D82 put the drawing outside the repository because this repository is
public and the library is not, so an in-repo dependency makes the viewer
uninstallable for anyone without an Envisioning token. That cost was stated and
accepted deliberately: one deployment is simpler to keep in step than two, and
the project's contributors today are the people who have the token.

**Cost.** This is the real one, and it is not small.

An outside contributor cannot run `pnpm install` at all. The failure is not
scoped to `/network`: it is the whole workspace, and the error is a 401 with no
explanation of what to do about it. `CONTRIBUTING.md` describes a build that a
reader of the public repository cannot perform.

The dependency adds 246 packages to a repository that previously depended on
Next, React and its own core, including d3, zustand, three Radix packages and
the AI SDK. `/network` is a 519 kB first load against roughly 150 kB for every
other route.

The peer dependency is an exact pin, `react@19.2.4`, and this repository
resolves 19.2.8. pnpm reports it as an unmet peer on every install. Nothing
fails today, and a future release of either side can turn that warning into a
break.

Deployment needs the token too. Vercel has no `.npmrc` for a private scope
unless one is provided, so the build fails there until an `NPM_RC` environment
variable carries the registry line and a token that has not expired.

**Overturned by.** A contributor outside Envisioning who cannot build the
project, which is the failure this trades away and the one that should reverse
it. Or `@envisioning/app` published to a public registry, which removes the
whole cost. Or the drawing earning its own deployment for another reason, which
would return to what D82 described without needing this entry.

---
## D106 — The panel is four vendors, activation is explicit, and lost calls are counted

*Recorded 2026-08-31. Extends D12, D13 and D14. Governs the first gateway run.*

**Choice.** Three changes to the Delphi run path, taken together because they
are the same failure: a panel that looks stronger than it is.

1. **Four distinct vendors, one per stance.** `DEFAULT_MODELS` gains
   `mistral/mistral-medium-3.5` beside Anthropic, OpenAI and Google. `buildPanel`
   deals models round-robin across four stances, so the previous three-model
   default gave `anthropic/claude-opus-5` both the Institutionalist and the
   Execution realist seat. Half the panel was one model arguing with itself, and
   nothing in the run file said so.
2. **Activation is always explicit.** A run with `--max-coverage 1` over the full
   country set used to set `activate` true whether or not the flag was passed,
   replacing `latest.json` the moment the run finished. `docs/PANEL.md` and
   `docs/RESEARCH-ROADMAP.md` both say to activate after review. The code now
   agrees with them.
3. **Failed calls are counted and published.** A provider call that fails after
   retries is still dropped so one vendor timing out does not cost the other 459
   calls. `attemptedCalls` and `failedCalls` now travel on the run file, the
   command warns, and `bench validate` reports the count and any cell-round that
   came back with fewer panelists than the panel declares.

The pricing table is also read from the gateway's public model list rather than
from vendor pricing pages, so no panel model carries an unverified price.

**Why.** D12 makes the interquartile range the dissent signal, and dissent above
25 points is how this project finds likely mismeasurement. Every one of the
three defects narrows that range without narrowing the disagreement it is
supposed to measure. Two stances on one model agree more than two vendors would.
A run that lost a vendor to rate limiting returns cells scored by three
panelists instead of four, and a shorter list has a smaller IQR. An unreviewed
run reaching `latest.json` publishes both artefacts before anyone can see them.
A partial failure therefore reads as consensus, which is the one reading the
panel must never produce by accident.

D13 says cost is not the constraint at this scale, so widening the panel to four
vendors is not a budget question. The gateway list gives the fourth vendor at
$1.50 and $7.50 per million tokens.

**Cost.** `pnpm bench delphi` no longer activates anything on its own, so an
operator who relied on the old behaviour must add `--activate` after review.
`DelphiRunFile` gains two optional fields; existing runs parse unchanged and
report nothing, which is correct, because a run written before this change has
no failure record to publish. Model ids still have to be checked against the
gateway before a run: the endpoint is public and needs no key, but a stale id
still fails a whole panelist, and that failure is now counted rather than
silent.

**Overturned by.** Evidence that stance and vendor are not separable, which
would make the round-robin deal the wrong unit; or a provider contract that
makes a dropped call recoverable, which would let the run retry rather than
record.

---

## D107 — A global body lives once, in a ledger, and a country map reaches it by id

*Recorded 2026-09-02. Extends D54, D56 and D82. Answers the question D56 left
open about what `external` means outside Brazil.*

**Choice.** `data/institutions/global.json` holds the bodies no country owns:
the United Nations and its programmes and agencies, the multilateral lenders
and the intergovernmental standard setters. Each is one node with the same
shape as a country node, at a new level, `global`, under a new legal nature,
`international_organization`, with an id that starts with `global.` and a
`members` field listing the registry codes of the benchmarked countries that
belong to it. A body with no membership, such as a programme, omits the field.

A country file never holds a global node. It reaches one by id in an edge,
which is where a relation between a global body and a national institution
belongs, because that relation is a fact about the country with a source of
its own: UNDP produces the Atlas of Human Development with Ipea, the IMF's
Article IV consultation produces evidence for the Banco Central, IBGE produces
Brazil's SDG indicators for the UN statistical system. A relation between two
global bodies, such as UNDP's attachment to the UN, lives in the ledger.

`attachGlobalInstitutions` in `packages/core/src/pipeline/institutions.ts` is
the only place a global node enters a country's network. It attaches every body
the country's edges name and every body that lists the country as a member,
and it brings a ledger edge along only when both of its ends are attached.
The viewer's loader, the explorer feed and the tests all call it, so every
surface renders the same network and the file on disk stays a country file.
The agenda reads the file alone: its `institutionIds` point at institutions a
country can act through, and a country does not act through the IMF.

Membership renders as a line on the body's profile, in the ledger and in the
drawn network's description: how many of the benchmarked countries belong to
it, and whether the country being read does. The validator checks that every
member is a registry code, that no country file mints a `global.` id, that a
country edge naming a global id resolves against the ledger, and that no
country edge joins two global bodies.

**Why.** D56 recorded that `external` carries a Brazilian assumption and that
the enum survives a second country only because its labels are a lexicon
lookup. This is the case it was waiting for. A foreign private university
inside São Paulo and the IMF are not the same kind of outsider: one acts
inside one country and is a fact about that country's map, the other belongs
to no country and would be duplicated 53 times if it were. Duplication is
the failure D26 and the registry invariants exist to prevent: 53 copies of
the UN with 53 sources and 53 summaries drift, and a reader comparing two
countries' maps sees two UNs.

Membership sits on the body rather than as a `member_of` edge because it is a
property of the body, sourced once from its own member list, and because a
membership edge would need a national node to hang from. Brazil's map has no
node for the state itself; the union is a jurisdiction, not an institution.

**Cost.** The ledger is a second file every institution surface must read,
and a country page now fails when the ledger is malformed, the way it fails
when the country file is. The `members` field is a second kind of fact in a
file that otherwise records mechanisms, and it will need refreshing when a
country joins or leaves a body. Two of the eight sources, the OECD and IMF
member pages, refuse automated fetches, so a live check of the ledger's URLs
cannot confirm them.

A body's system and dimensions are a judgment: the WHO under `regulation`
and the UN under `strategy_management` are defensible and not the only
reading. The 11 systems were drawn for a state and a global body fits them
loosely.

The drawn network gives global bodies their own jurisdiction cluster, which
is not drawable on its own, so they appear only beside the union's network or
in a selected institution's neighbourhood.

**Overturned by.** A body that belongs to no country but acts inside only
one, which would make the ledger a place for regional bodies too and need a
rule for which file holds them. Or a second country map whose relations to
global bodies do not sort into the four families, the same test D56 set. Or
readers treating membership counts as a score, which would mean the line
should come off the profile.

---

## D108 — The registry and its diagnostics are drawn as lanes, and the drawing is a viewer component

*Recorded 2026-09-02. Extends D26, D53 and D67. Does not touch D56, D58 or
D104: the institution map keeps its ledger, its matrix and its drawn network.*

**Choice.** The viewer publishes one lane field, `LaneField` in
`apps/web/src/components/LaneField.tsx`, and one page that draws it, `/explore`
in the Method section. A lane is a capability, a dot is an indicator, and the
mark says whether the row has data: a filled dot does, a dashed ring is a
declared gap and a thin ring is a retired row. A line joins two indicators
whose series correlate at `REDUNDANCY_THRESHOLD` or above. The field has two
arrangements. `registry` packs each lane in registry order, so the length of
a lane is the size of the capability's basket. `measure` moves every dot with
data to its absolute correlation with log GDP per capita, draws
`WEALTH_CORRELATION_THRESHOLD` as a rule, marks each lane's own correlation as
a tick and parks the unmeasured rows at the left. A dot keeps its node between
the two arrangements, so the reader watches it travel. The arrangement is the
address: `exploreHref` and `readLaneArrangement` in `apps/web/src/lib/links.ts`
are the only place that shape is written or read.

The projection is computed once, by `buildIndicatorLanes` in
`packages/core/src/pipeline/lanes.ts`, from the registry and the published
diagnostics. It reads `indicatorVsGdp`, `wealthAttribution`, `dimensionVsGdp`
and `redundantIndicatorPairs` and nothing else. Nothing in it reaches a score,
a confidence or `data/out`.

The field owns its readout, as the radar and the system matrix do. It always
reads one dot and never none, at a fixed height a hover cannot change, and it
opens on the dot with the most links because that is the dot the diagnostics
have most to say about. The readout names every joined indicator as a control
that moves the reading there, so the field is a way into the diagnostics and
not only a summary of them.

The encodings are chosen against the charts that already exist. No dot is
sized, because size on this site would read as a score. No dot carries a ring
for certainty, because that ring belongs to the flag bubble. No dot is a flag,
because a flag is a country and these are indicators. The selected dot is the
page's one lime mark. Lane names are DOM text beside the field, never SVG text
inside it, and the field lays out in pixels from a measured width rather than
through a scaled `viewBox`, so a dot is the same size on a phone as on a desk.

**Why.** The registry page and the diagnostics page hold the same 69 rows as
tables, and neither shows the shape of the whole: that Anticipation and
Agency fill their lanes with data while Trust and Shared Purpose are mostly
rings, or that every redundant pair the diagnostics find runs through the
same five income-tracking indicators. A3 states the second fact in prose. A
line between two dots past the threshold states it in one glance, and the
`measure` arrangement puts the whole of the wealth-sensitivity finding on one
axis with the threshold drawn through it.

The lane layout was chosen over the force layout the institution network uses
because position here means something. A force layout's plane encodes nothing
a reader can name, which is what D56 held against the drawn overview. A lane
encodes membership and, in the measured arrangement, a number the diagnostics
already publish, so the plane carries two facts before any line is drawn.

The projection lives in core rather than in the view so a second drawing can
read it. The institution map is the dataset whose shape matches this picture
most closely, and a lane version of it is a candidate to replace the
closed-source network D104 mounts. That decision is not taken here. The
component is built so that taking it later is a data change and not a second
component.

**Cost.** The `measure` arrangement puts 36 dots on one axis, and the site's
rule that every distribution is a `FlagField` was written for countries on a
score axis. This is a different object, indicators on a correlation, and it is
drawn with different marks so the two cannot be confused, but it is a second
axis chart and a reader who has learned the field will meet a new one.

Six links is a sparse picture. The redundancy threshold is deliberately high,
so the drawing says little about pairs at 0.8, and a reader could take the
absence of a line for independence. The readout prints the threshold for that
reason.

Dots that share a correlation step above or below one another by a fixed
offset, so a vertical position inside a lane means nothing and could be read
as if it did. The lane is 48 pixels tall to keep that offset small.

**Overturned by.** A reader taking a dot's position inside a lane, or its
absence of a line, for a finding the diagnostics do not make, which would mean
the encodings need a legend the field does not carry or the drawing needs to
go. Or the lane picture of the institution map being built and the two
components diverging, which would mean the projection was not general enough
and the second drawing should have been a data change.

---

## D109 — The mounted network owns a deterministic, opaque theme boundary

*Recorded 2026-09-02. Extends D103 and D104.*

**Choice.** The `/network` leaf pins `@envisioning/app` to the dark theme in
its own layout. Its route stylesheet maps the NCB palette to the library's
surface tokens and repeats the library's `--color-*` aliases inside the shell.
The dense network toolbar's `sm:bg-panel/90` and `sm:bg-panel/95` surfaces are
solid on this route; the graph drawing itself is unchanged.

**Why.** The library declares its Tailwind aliases at `:root` as values such
as `var(--panel)`. NCB had supplied `--panel` only on `.explorer-shell`, so
the alias was resolved at the root before the shell could provide its value.
The library's nominally solid `bg-panel` surfaces consequently computed as
transparent, and its intentionally translucent toolbar let graph lines bleed
through the controls. Event-bff demonstrates the required boundary by pinning
its map to a real `.light` wrapper; the network keeps NCB's dark graph palette
but follows the same ownership rule.

**Cost.** The network has a stable dark presentation rather than inheriting the
host OS preference. The adapter depends on the library's current token names
and toolbar class names, so a library upgrade needs a surface check. A future
visualization can choose a different chrome policy, but it must document that
choice at its own route boundary.

**Overturned by.** `@envisioning/app` exposing a supported scoped-theme API and
an opaque network-toolbar option, which would remove the route adapter; or
evidence that the graph is more legible when its controls are translucent,
which would justify restoring alpha for this visualization.

---

## D110 — The network opens on a national scope, with state institutions one switch away

*Recorded 2026-09-02. Extends D82, D104 and D109.*

**Choice.** The mounted network keeps the state layer in the published feed but
opens broad views with it hidden. Brazil has 282 state-level institutions and
75 federal institutions, so all levels together make the overview carry more
labels than the national structure can support. A route-owned
`StateLevelToggle` writes the library's existing `criteria[level.id][$in][]`
grammar into the address. The dependency adapter applies that criterion to the
`allInstitutions` entity set, so the switch removes state nodes and their lines
from the graph rather than merely highlighting them. The generic Level filter
remains the full multi-select control for exact scopes.

The default is conditional. A view without a selected institution starts on
the non-state levels present in that feed; a view with an institution selected
keeps all levels, because a state relation is part of that institution's
neighbourhood. A URL-specified level criterion always wins. Other criteria and
the dataset selection survive the switch, and the feed, API and source ledger
are unchanged.

**Why.** The network's forcefield visualization reads entities without applying
the app's generic filter state. Copying the filter into a second local state
would make the modal, the address and the graph disagree. Reusing the app's
criteria shape at the route dependency boundary gives the quick switch and the
full filter one scope contract, while keeping the source data complete for
institution pages and later visualizations.

**Cost.** The route adapter follows the library's current query grammar and
filters the entity collection for every surface mounted under the network,
not only the drawing. On a live scope change the library may animate removed
labels out before they disappear, so the map settles rather than snapping.
The default hides the state layer only for an unselected overview; readers who
want the full map must make one explicit switch or clear the level criterion.

**Overturned by.** `@envisioning/app` exposing a supported visualization-level
`applyCriteria` or scope API, which would let the route remove its adapter and
use the library's own control end to end; or evidence that the 282-state-node
overview is a clearer first reading than the national scope.

---

## D111 — The network sidebar is the facet navigator

*Recorded 2026-09-02. Extends D56, D82, D104 and D110.*

**Choice.** The network sidebar exposes the institution directory plus one
destination for each reusable facet in the feed: systems as clusters, levels
as tags and jurisdictions as clusters. Each facet has an index and a detail
page whose related-institutions list is joined from the same entity records.
Facet cards show their related-institution count. The institution list keeps
the exact multi-select filters and its `Group by` control, and the forcefield
keeps its `Group by` control for changing the spatial arrangement. The sidebar
therefore browses a facet, while the filters narrow a view and grouping changes
how the current set is read.

**Why.** Event-bff's Envisioning implementation treats clusters and tags as
first-class navigation surfaces instead of hiding every useful dimension in a
filter modal. NCB's feed already declared these relationships and the graph
already knew how to cluster by them, but only systems were reachable from the
sidebar. Giving the three facets stable entry points makes the same data
legible as a directory, a tag index or a jurisdiction map without duplicating
the ledger or inventing a second filtering model.

**Cost.** The sidebar grows from three to five destinations and is therefore
more dependent on the library's compact-menu and navigation-map behavior. A
facet page is a browsing surface, not an independent dataset: its counts and
related institutions change with the published feed, and it does not replace
the exact filter grammar. The network's facet pages also inherit the mounted
library's route and token contracts.

**Overturned by.** Evidence that readers cannot distinguish browsing a facet
from filtering the institution set, or that the sidebar becomes unusable at
the supported breakpoints; or a supported Envisioning facet-navigation API
that provides the same destinations without route configuration.

---

## D112 — The hero's dot motif breathes, behind the reader's motion setting

*Recorded 2026-09-02. Supersedes the still-only clause of D81. Keeps every
other clause of D81: the alphas, the geometry, the one dark band, and the
rule that the motif is atmosphere and never data.*

**Choice.** `DotField` draws the parent brand's breathing motion. The bubble
around each centre grows and shrinks on a sine along the same diagonal phase
the still frame already froze, on the parent's 3200ms cycle, at the alphas
D81 set. The motion is gated three ways. A reader whose system asks for
reduced motion gets the still SVG pattern and no script runs for it. The
server renders that same still frame, so it is what every reader sees first.
The canvas takes over only when motion is allowed, and it stops drawing when
the band leaves the viewport or the tab is hidden. Its first frame is the
still frame, because both read one `phaseAt` and time starts at mount, so
the handover does not jump.

**Why.** D81 recorded that a research surface does not need a background that
moves and that a still frame costs no JavaScript. Both are still true and
neither was the reason a reader asked whether the motif was animated. The
still frame is one moment of a motion the parent site runs everywhere, and a
reader who knows the parent reads it as animation that has stopped, which is
a broken thing rather than a quiet one. Drawing the motion restores the motif
to what it is, and gating it behind the reader's own setting keeps the quiet
version for the readers who asked for it.

The alphas do not move. At 0.05 and 0.22 the breath is felt in peripheral
vision and is hard to see when looked at, which is the test D81 set for the
still frame and the test the moving one has to pass too.

**Cost.** The hero now runs a requestAnimationFrame loop while it is on
screen, on the one route that opens the site. The loop draws about 300
circles a frame at desktop width and stops off screen, so the cost is a few
milliseconds a frame for as long as the band is visible and nothing after.
The still pattern is kept for the reduced-motion reader, so there are two
drawings of one motif in one file, and a change to the geometry has to reach
both, which `phaseAt` and `bubbleAt` are there to make one change.

**Overturned by.** A reader finding the motion distracting at these alphas,
which would mean atmosphere has become texture and the still clause of D81
should return. Or a measured cost on the front page's interaction readiness
that the loop causes, which would mean the canvas has to wait for idle before
it starts.

---

## D113 — The front page shows a surface rather than naming it

*Recorded 2026-09-02. Amends the one-link clause of D75. Extends D53, D58 and
D108.*

**Choice.** Where a section of the site is a drawing, the front page draws it
and the drawing is the link. Two modules changed. The wealth module, which
states how far each capability tracks income, now carries the lane field in
its measured arrangement as a still picture, and the picture opens `/explore`.
A new module carries Brazil's system matrix as a still picture, cells shaded
by count and nothing else, and the picture opens `/network`. Both pictures
are the same components the pages draw, in a non-interactive mode: no readout,
no hover, no keyboard, one link around the whole. `LaneField` gained
`interactive={false}` for it, the way `Radar` has inside a grid card, and
`MatrixPicture` in `apps/web/src/components/MatrixPicture.tsx` is the matrix
without its readout, reading the same `MATRIX_FILL` the institution page reads.

**Why.** A sentence that names a page tells a reader it exists. The page's
own picture, at the size the front page has room for, tells the reader what it
is, and that is the difference between a visit and a link that was never
followed. D75 wrote each module as a sentence, a live number and one link out,
and a link that is a picture keeps the count while carrying more.

Brazil is drawn because it is the one country with a map. The front page does
not choose it; it has nothing else to draw. When a second map lands, this
module becomes a choice and needs a rule, which is why the module is gated on
the file and not on a list.

**Cost.** The front page now loads the Brazilian institution file and the
global ledger on every request, beside the index, the diagnostics and the
evidence corpus. It is a few hundred kilobytes of JSON read from disk, and
nothing is cached, which is the cost every other page pays too.

The lane field is a client component, so the front page ships it whether or
not the reader points at it. It is drawn without a readout, which makes the
still picture the picture's whole meaning: a reader who cannot point at a dot
reads nothing about any one indicator here and has to open the page.

The matrix picture carries no axis names. Ten unlabeled rows against ten
unlabeled columns is a texture until the reader opens the page, and the
section hint has to carry what the axes are.

**Overturned by.** A second institution map, which makes the Brazilian module
a choice the front page has no rule for. Or a measured cost on the front
page's response time from the added reads, which would mean the matrix
should be computed once by `bench institutions` and read from `data/out`.

## D114 — A count is drawn as a count, and a year as a position in time

*Recorded 2026-09-02. Extends D103. Serves D45 and D100.*

**Choice.** Two marks, both second encodings of numbers the viewer already
printed. `CoverageMark` draws one tick per indicator row a capability is
measured against, filled where the row was observed for this country, with a
notch at the coverage floor. `RecencyTick` draws a rail from the first year the
ingest fetches to the current one, with a tick at the year a value was observed
and a quiet line trailing it for how long ago that was. Both print the number
beside the mark and neither replaces it.

Coverage reached the reader as `0.71`. Seven rows cannot produce a hundred
values, so two decimals claimed a resolution the count does not have, and the
ratio hid the thing a reader most needs from it: how far a capability is from
the two rows a score requires. Below the floor it was worse. The page printed
the words "not measured" and the count that explains them existed only in
screen reader text, so the reader who could see the page was told least.

Recency is one of the three factors behind every confidence and it reached the
reader as a decimal in a sortable column, or as a bare year on an indicator
record. Both are unreadable without a scale: 2011 means nothing until it sits
next to what a current round looks like. The rail is that scale, and the length
of the trailing line is the staleness the decimal was trying to say.

Both denominators come from `countedForCoverage` in the registry, which the
scorer also uses, so the mark and the confidence figure beside it can never be
counted against different denominators. A retired row is in neither.

**Why.** These are the two things this dataset is least certain about, and both
were rendered as the kind of number a reader skims past. A count drawn as a
count is read without being parsed: five ticks lit of seven is a glance, 0.71 is
arithmetic. The floor notch is the same argument for D45, which withholds a
score below two observed rows and until now gave the reader no way to see how
close a capability was to publishing one.

**Cost.** Two more marks to learn, on tables that already carry a score band, a
confidence chip and a trend arrow. The coverage mark stops being countable
somewhere above a dozen rows, so a capability that grows past that needs a
different form rather than a tighter pitch. The recency rail's right edge is
the current year, which means every mark on the site shifts by a hair each
January, and a screenshot taken now will not line up with one taken next year.

Two places that were named as candidates and refused. `/gaps` counts registry
rows with no dataset, which is a different claim from rows observed for a
country, and one mark meaning two things is worse than two marks. The indicator
peek panel already draws a field above its list and a bar in every row, so a
third mark there would crowd a reading rather than open it.

**Overturned by.** A capability with enough rows that the ticks stop being
countable, which would want a different form for coverage and not a smaller
pitch; or evidence that readers take the trailing line for a bar rather than
for elapsed time, which would make the rail worse than the year it replaced.

---

## D115 — Out of frame is read against the values that built the frame

**Decision.** `buildFrame` keeps the unclipped extremes of the values that set
it, as `observedMin` and `observedMax`, and `scoreAgainstFrame` marks a value
out of frame when it lies beyond them, as well as when its clipped position
falls outside the endpoints. Dataset 6.1.1.

**Why.** D47 promises that a current value can never fall outside a frame its
own country helped build, and that a historical value beyond it clamps and is
flagged. The flag was read from the clipped value only. When a current outlier
is winsorized onto the upper fence, that fence is also the top endpoint, so a
historical value further out was clipped to exactly the endpoint and never
reported. The synthetic test in `normalize.test.ts` found it. A value between
the fence and the most extreme current value is winsorized exactly as that
current value is, and stays in frame: the frame was built with a country there.

**Cost.** Four more clamped cells across the momentum baskets in
`diagnostics.json`. No score and no current cell moves, because a current value
sits inside the observed extremes by construction. The two new fields live on
the internal `Frame` type and are not published.

**Overturned by.** A reason to treat the fence rather than the observed extreme
as the edge of the frame, which would mean flagging every winsorized historical
value, and the current outlier's own winsorized value with it, breaking the D47
promise from the other side.

---

## D116 — The sources page prints the check series too

**Decision.** `/sources` lists every behavioural check from `checks.ts` in its
own section, with the series code, its database and the full request built by
the same `worldBankSeriesUrl` call the indicator example uses. This closes the
cost D60 recorded, that the fetch the page prints back was short by the check
calls.

**Why.** The page's claim is that a reader can repeat every call the benchmark
makes. A check is fetched on every ingest, so leaving it off made that claim
false by one series.

**Cost.** A second table on a page that already carries the indicator one, for
series that never enter a score. The section says so in its heading and links
the glossary entry rather than defining a check again.

**Overturned by.** A check fetched from somewhere other than the World Bank,
which the request builder cannot print, and which would need the page to print
another source's call shape before it could stay complete.

---

## D117 — Research is chosen by two objectives and triaged before values are fetched

**Decision.** Every research task names the objective it moves and reports the
move in its handoff. O1, informative: every dimension reaches a mean confidence
of at least 0.40. O2, separable from wealth: no dimension sits above r = 0.70
against log GDP per capita. A guardrail sits beside them: mean confidence must
not come to track wealth. `docs/RESEARCH-ROADMAP.md` holds the queue in that
order and a desk triage step that every candidate passes before any value is
fetched: the publisher's own coverage ceiling against the 53, whether the
values will spread, whether the series is a stock that money buys, and whether
one adapter or one file serves the whole frame. A candidate that fails triage is
recorded in one paragraph and stopped. The queue opens with sweeps of the two
source families that already have adapters and full coverage, V-Dem and the
Joint EVS/WVS release, ahead of single indicators.

**Why.** The claim under test is that capability is separate from wealth
(`docs/WHY.md`, D1). At dataset 6.1.2 four dimensions miss O1 (Trust 0.21,
Experimentation 0.23, Shared purpose 0.26, Coordination 0.36) and four miss O2
(Anticipation 0.87, Agency 0.85, Adaptability 0.82, Learning 0.73), and the
rows carrying O2 are mostly class `I` diffusion stocks. The queue was ordered
by gap instead, and TRUST-2 showed the cost: a full value preflight and a search
of every national judiciary ended at 13 of 53, a result the desk ceiling of 26
already implied, on a ratio that sits between 0.87 and 1.02 in 12 of the 13
countries it reached. Harmonised administrative statistics across this frame
exist mostly where a regional body pays for them, so indicator-by-indicator
search drifts toward rich-country sources, which is what the guardrail
watches. Mean confidence against log GDP is r = 0.34 across 51 countries today.

**Cost.** The two targets are judgment, not derived: 0.40 separates the four
thin dimensions (0.21 to 0.36) from the rest (0.47 and up), and 0.70 reuses the probe's single-series screen at
the dimension level. Candidates that would raise confidence only for rich
countries, PISA among them, are parked, so Learning's O1 standing gains nothing
from them for now. A triage paragraph can kill a series that a full preflight
would have rescued.

**Overturned by.** A dimension that reaches both targets and still fails the
claim, for example by pairing with another dimension in
`duplicateDimensionCandidates` in `diagnostics.json`, which would show the objectives measure the wrong thing; or
a triaged-out candidate that a later preflight shows would have cleared the
half-frame screen, which would show the triage questions are too strict.

---

## D118 — A row is chosen for what it measures, and its income correlation is reported, not used to choose it

*Recorded 2026-10-01. Supersedes the O2 target in D117, the wealth condition in
D52's probe pass and the acceptance rule in D42. Keeps D42's diagnostic.*

**Decision.** A candidate is accepted, held as a check, left as a gap or
retired on its construct: what it observes, whether that is a capability or a
stock that money buys, and whether it is behaviour, an outcome or a
perception. The source memo states that argument, with its date, before any
value is fetched. The correlation with log GDP per capita, the
`wealthAttribution` delta and the dimension's correlation after the change are
still computed, and every decision entry and handoff prints them. They are
findings, and they no longer pass or fail a row.

In practice:

- `pnpm bench probe` reports a series that tracks log GDP at 0.70 or more as a
  flag beside the verdict, not as a failure. Coverage, recency and spread still
  fail a series.
- O2 becomes a reported outcome. Each release prints every dimension's
  correlation with income, and the research queue no longer aims at a
  threshold. O1, the 0.40 confidence target, and the guardrail stay: neither
  chooses rows by what they say about income.
- The roadmap's wealth-link work becomes a construct audit. A diffusion stock
  such as secure servers or broadband subscriptions is retired if it does not
  observe the capability its dimension names, and kept if it does, whatever
  its correlation.
- Exclusions that rested on income alone are reopened for a construct review.
  The `bribery_incidence` check (D60) is the first: it records experience, not
  reputation, and D60 held it out only for its wealth contribution. D44's
  retirement of `homicide_rate` gave construct reasons too and stands.
- The next real use of the benchmark is a report on Brazil's adaptability, so
  the queue serves Adaptability first. The frame does not change: every source
  is still tested against all 53 countries, and Brazil has no special
  treatment in the code.

**Why.** `docs/WHY.md` calls the benchmark a test of whether capability is
separate from wealth, and names the failure: the nine dimensions collapse into
one factor that tracks GDP per head. If rows are admitted or dropped by what
they do to that correlation, the test cannot fail, because any row that would
make it fail is removed. D42 and D44 show the mechanism. `IC.FRM.CORR.ZS` was
wired and reverted in one session because it moved Trust from 0.385 to 0.619,
and D60 held out a behavioural bribery measure for the same reason. Both were
reasonable steps under the rule as written. Repeated across the registry,
though, the rule makes a low income correlation a product of the selection.
Choosing by construct and letting the correlation land where it does turns the
dimension correlations back into evidence. The wealth residual (D68) still
shows what a dimension carries beyond income, and it does so honestly only if
the rows were not chosen to make it large.

**Cost.** Some dimension correlations will rise, and a dimension may cross 0.70
and stay there. That is published as a finding against the claim. A construct
argument is softer than a number and easier to dispute, so the memo states it
before the values are seen. The rows chosen under the old screen are not
re-admitted wholesale: each reopening is its own reviewed change, and that is
slow. D117's triage keeps its ceiling, spread and cost questions, and its
wealth question becomes the construct question above.

**Overturned by.** An audit of rows decided after this entry showing that the
construct arguments, written before the values, still drift toward rows that
lower the income correlation. That would show the pre-commitment is not
working. It would also be overturned by rows admitted under this rule that
reviewers agree are levels of spending or adoption under another name, which
would show the construct question is too loose to stand in for the number.

---

## D119 — Export concentration from UNCTADstat fills export diversification

**Decision.** `export_diversification` moves from `gap` to `adapter`. The
value is UNCTADstat's Concentration Index (`US.ConcentDiversIndices`, flow `02`,
exports): a normalised Herfindahl-Hirschman index of the merchandise export
basket across SITC Rev.3 3-digit products, 0 when exports are spread evenly
and 1 when one product is everything. It is stored as published, so the row
becomes `direction: 'lower_better'` with the unit "index 0-1, lower = more
diversified", rather than being inverted in the adapter. The adapter fetches
the keyless bulk 7z, extracts its one CSV with `bsdtar`, joins UN M49 codes to
the registry, and emits the pinned year 2025 only. The file is pinned by the
SHA-256 of the CSV (release stamped 2026-06-24), so a publisher refresh fails
the fetch until someone re-pins it. UNCTAD's footnote travels in each
observation note: 15 of the 53 values are marked `Estimated` (mirror data from
partners). The Diversification Index in the same file is not used: it measures
distance from the world basket, which is a resemblance, not a spread.

**Why.** The row is accepted on its construct, decided before its wealth
correlation was read. Adaptability asks whether a country can absorb a shock
and reallocate. A basket spread across many products is the standing result of
past reallocation and the exposure a single price or demand shock meets, which
is the construct the registry already declared for this row. It is class `C`,
an observed outcome of the economy's structure, and not a diffusion stock that
money buys directly. The source covers all 53 countries at 2025 from one
international publisher, so it adds evidence without favouring rich countries.

Reported as findings, not tests. The row's own correlation with log GDP per
capita is r = 0.445 (n 51; the stored HHI is direction-adjusted so a higher
normalised score is more diversified). Its wealth-attribution delta is +0.021:
with the row Adaptability sits at r = 0.839 (Spearman 0.837, n 51), without it
0.818, so the row does not move Adaptability toward O2 and slightly away from
it. It forms no redundant pair. Adaptability's mean confidence rises from 0.469
to 0.588, observed rows from 4 to 5 for every country, and mean confidence
against log GDP across all dimensions stays at r = 0.34, so the guardrail
holds.

**Cost.** The index reads a product mix, not the capacity to switch.
Switzerland (0.364, gold and pharmaceuticals), Ireland (0.330,
pharmaceuticals) and Singapore (0.271, re-exports) score as concentrated
because a few lines are worth a lot, not because they are fragile. Commodity
exporters such as Venezuela (0.762) and Nigeria (0.619) move with prices from
year to year even when the basket does not. It is merchandise only, so
services-led exporters read narrower than they are, and 3-digit SITC hides
diversity inside a product line. The registry note says all of this. The
history from 1995 is in the file and is not emitted, so the row has no trend
and no discrimination trend yet. The fetch depends on `bsdtar` being on the
path. The data is CC BY 3.0 IGO and must be cited as the UNCTAD Data Hub.

**Overturned by.** A source that observes reallocation itself, such as entry
into new export products or the speed a basket recovers after a price shock,
at comparable coverage, which would answer the construct more directly and
replace this row; or evidence that the high-value-line artefact moves more
countries than the three named, which would make the row read wealth structure
rather than exposure and return it to `gap`.

---

## D120 — Long-term unemployment is wired from ILOSTAT behind a plausibility gate

**Decision.** `long_term_unemployment_share` (Adaptability) moves from `gap` to
`adapter`. The adapter reads ILOSTAT's `DF_UNE_TUNE_SEX_AGE_DUR_NB` in one SDMX
call and derives the share as unemployed 12 months or more over the unemployed
with a stated duration, both sexes, age 15 and over, a labour force survey
preferred where ILOSTAT holds more than one. Lower is better, raw percentage.
Before emitting, it runs a plausibility gate on every country, naming none: it
drops a country-year under 3%; every year of a survey whose median for that
country is under 3%; a run of one or two observations that sits more than 15
points beyond both neighbours when those neighbours agree within 15 points; and
a latest value more than 15 points from the one before it, which waits for the
next year to confirm it. A jump the next year keeps is a level shift and stays.
It emits the latest surviving year and logs every dropped value with its
country, year, value and reason. The run of 2026-10-01 emits 44 of 53
countries, holds KOR, MEX, PER, PHL, SLV and URY with no surviving year, and
drops 78 country-years; Brazil is 30.2% in 2025 from PNAD Contínua. The list is
in `docs/research/adaptability/ILOSTAT-LONG-TERM-UNEMPLOYMENT.md`.

**Why.** Construct first. The row observes whether people who lose work find
new work, which is reallocation, the centre of Adaptability, and it is
behaviour rather than a stock money buys. That is the reason it is accepted.
Its two readings are recorded in the registry note: a high share is slow
reallocation where the unemployment rate is also high (South Africa, Kenya,
Nigeria) and a small residual pool where the rate is low (Switzerland, Japan),
so it is read beside `unemployment_rate`. Some questionnaires cannot record a
long search, and their published shares (under 1% in every year for Korea,
the Philippines and Peru, and for Uruguay outside 2021 and 2022) describe the
instrument. A rule applied to every
country keeps the exclusion auditable and stops it from becoming a list of
countries the benchmark disliked. The survey-median clause exists because a
year-by-year floor alone let one year of an otherwise sub-3% questionnaire
through (Mexico 2022 at 3.1, El Salvador 2021 at 4.6), and those would have
taken the best cells in the frame. As a reported finding, not a test: the
row's normalised score correlates with log GDP per capita at r = 0.355 (raw
share -0.355, n 42), its wealth-attribution delta is 0.005, and on the local
run Adaptability moves from r = 0.818 to 0.824 (n 51) while its mean
confidence rises from 0.469 to 0.558.

**Cost.** The thresholds, 3% and 15 points, are judgment. A real one-year
excursion of more than 15 points is dropped as a spike, and a real level shift
in the latest year is held back for one release, emitting the year before.
The survey-median clause goes beyond the owner's two-clause rule and removes
values that clear 3%. The gate cannot see a break with no spike: Ethiopia is
emitted at 53.9 for 2013 because its only other year, 2021, falls under the
floor. ILO's own unreliable flag is recorded in each note and not used. Four
emitted countries come from household surveys rather than labour force
surveys, Brazil among them, and Argentina's survey is urban only. ILOSTAT
revises in place, so the retrieval date is the release identifier.

**Overturned by.** A national statistics office or the ILO documenting that a
held series is a valid measure of long-term unemployment, which would make the
floor a rule that removes real values; a second source for the same countries,
such as OECD or Eurostat, that disagrees with the gate's survivors by more
than the gate's own 15-point tolerance; or a review of `unemployment_rate`
beside this row showing the two readings cannot be separated in practice,
which would make the row a check under D60 instead of an indicator.

---

## D121 — V-Dem polarization is published as a behavioural check, not scored

*Recorded 2026-10-01. Extends D60 and D83. Supersedes the overturn clause of
D116. Issue #22.*

**Decision.** V-Dem's political polarization item is published beside Shared
Purpose as a behavioural check under D60 and enters no score. The check is
`political_polarization` in `checks.ts`, read from `v2cacamps_osp`, the
measurement-model estimate on the codebook's 0 to 4 scale, where 0 means
supporters of opposing camps generally meet in a friendly manner and 4 in a
hostile one, direction `lower_better`, V-Dem v15 (2025-03-04), year 2024,
tier `expert_panel`, CC BY-SA 4.0. It covers 53 of 53 countries.

The registry gap `political_polarization` in `indicators.ts` stays a gap. The
measurement Shared Purpose wants, hostility between camps that are free to
exist, is still unmade, and this item is not it. The check shares the gap's id
on purpose, and its observations sit under `__check__political_polarization`,
so the two never meet in a frame. The branch `polarization-vdem` (commit
1c0f6b5) that scored the item is not merged; its adapter work is.

The item is not in the Core archive D83 pinned, so the V-Dem adapter now pins
the Full+Others archive of the same release, `V-Dem-CY-FullOthers-v15_csv.zip`,
streams its 400 MB CSV line by line and reads a table of variables, one per
observation id. Its `v2x_cspart` values match Core's for all 53 countries, so
civil-society strength does not restate. The observation file keeps its name,
`vdem-cy-core.json`.

Checks are no longer World Bank only. `CheckDef` gains `ingest`, `worldbank`
by default or `adapter`, and `pinned`, which names the dataset, the archive
URL, the file inside it, the column and the year. An adapter check must carry
`pinned`, and `checks.ts` refuses one that does not. The World Bank ingest and
`worldBankCheckSeries` skip adapter checks, the adapter emits them under
`CHECK_PREFIX`, and the scorer, `behaviouralChecks`, the report and the
capability and country pages read them unchanged. `/sources` prints the World
Bank request for a World Bank check and the pinned archive URL, file, column
and year for an adapter check.

**Why.** The project judges a row by what it measures first and reports its
income correlation beside it; the correlation is evidence, not the gate. On
construct this item fails in a way no numeric screen sees. Scored on the
branch, it passed every gate: 0.335 against log GDP per capita, 0.565 at most
against any scored row, 53 of 53 countries, and it lifted Shared Purpose from
47 to 52 published countries. But a low reading has two causes the number
cannot separate. On V-Dem's own regime classification the 2024 values form a
U: liberal democracies average 1.77 and closed autocracies 1.85, while
electoral democracies and electoral autocracies average 2.80 and 2.98. Scored,
the item raised the United Arab Emirates by 11.1 points and Rwanda by 11.5,
and published Singapore and Vietnam on the strength of their calm. Low
measured polarization under repression is not people seeing themselves in a
common project. It is A5 inverted: there a perception composite penalised
political uniformity, here an expert item rewards it, and the spec refuses
both readings. A13 records it.

The item is still worth showing. It is current, full-frame, inspectable and
asks the right question of every country where camps may compete. A check is
the D60 shape for a series that is real and disqualified, and the reason
travels with the number.

**Cost.** Shared Purpose stays at two rows, 47 published countries and mean
confidence 0.260; the coverage the item would have bought is declined. No score
moves: all 477 country-dimension cells are identical with the check present.
D60 framed a check as a series kept out on income. This one is kept out on
construct, and its wealth correlation, -0.335 on the published value in
`behaviouralChecks`, is reported and is not the reason; the glossary entry and
the diagnostics comment now say a check can fail either way. A published
number outside the score will be quoted as a finding for the closed regimes it
flatters, and the attached note is the only guard. The adapter downloads
26 MB instead of 15 MB and depends on the Full+Others member name as well as
on `unzip`. The dataset version does not move: no scored row, field or country
changes, and `checks` is an existing field.

**D116 amended.** D116's overturn clause named a check fetched from somewhere
other than the World Bank, which the request builder could not print. This
decision is that check. D116 stands as amended: `/sources` stays complete by
printing each check's own call shape, the World Bank request where `ingest` is
`worldbank` and the pinned file, column and year where it is `adapter`. D116's
clause is superseded by this decision's.

**Overturned by.** A V-Dem reading conditioned on competition existing at all,
or a behavioural Shared Purpose row (civic participation, volunteering, voter
turnout) that agrees with this item outside the closed regimes, either of which
would let the item or a variant score and move it to `indicators.ts`; a V-Dem
release that changes the question or drops coverage below half the frame; or
evidence that readers take the check for a score, which under D60 would retire
it. For `/sources`: a check whose source has neither an API request nor a
pinned file to print, which would leave the page short of a call again.

---

## D122 — What a country has is published beside its score as a condition, not scored

*Recorded 2026-10-01. Extends D118 and D60. Dataset 7.0.0. Memo:
`docs/research/CONDITIONS-AUDIT.md`.*

**Decision.** The registry gains a second role. A row with `role: 'capability'`
observes the country doing what its dimension names, a behaviour, a
throughput, an outcome or performance relative to resources, and it is scored
when it has data. A row with `role: 'condition'` records what the country has
to work with, a stock of infrastructure, access, money, people or enrolment,
or income itself. A condition stays in `indicators.ts` and keeps its ingest
route, so it is fetched on every World Bank ingest. It is not scored:
`isScored` is false for it, so it leaves the frame, the dimension mean, the
coverage denominator, the confidence, the momentum basket, the redundancy test
and `wealthAttribution`, exactly as a retired row leaves the denominator under
D100. `indicatorsFor` no longer returns it and `conditionsFor` does.

It is published beside its dimension as `conditions` on every
`DimensionResult`: the value as the publisher wrote it, unit, year, source,
and its rank among the `n` countries that have it, read in the row's direction
on the registry transform. No condition is put on the 0 to 100 scale, for the
reason D60 gives for checks: a number on that scale reads as a score.
`indicators/{id}.json` is still written for each condition, with
`role: 'condition'`, no normalised value and countries in rank order.
`diagnostics.conditions` correlates every condition with log GDP per capita
and with its own dimension's published score. The country page, the
capability page, the Brazil layer, the agenda in both lexicons, `/sources`,
`/indicators` and `/explore` show conditions as a separate layer. On
`/explore` a condition is a square in its capability's lane, placed by its
correlation with income in the measure arrangement, never flagged as a wealth
proxy and never joined by a redundancy line, because both are verdicts on
scored rows.

Tier A of the audit moves, 10 rows: `rd_expenditure_gdp`,
`researchers_per_million` and `secure_internet_servers` beside Anticipation;
`internet_users`, `account_ownership` and `domestic_credit_private` beside
Agency; `tertiary_enrollment` and `education_expenditure_gdp` beside Learning;
`broadband_subscriptions` beside Adaptability; `labour_productivity` beside
Building. Each row's note says why, on construct. Tier B (business start days
and procedures, vocational share, labour force participation, transmission
losses, income inequality) stays scored, and so do the two borderline rows,
`sci_articles_per_million` and `human_capital_index`. A Tier B row moves only
on its own decision entry, and only once its dimension has a capability row to
take its place: as a block Tier B leaves Agency and Shared Purpose below the
D45 floor in every country.

**Why.** `docs/WHY.md` says the benchmark tests whether capability is separate
from wealth. D118 chose rows by what they measure, and the construct audit
then found that ten scored rows measure what money buys rather than what a
country does with it. Averaging them into a capability score answers the
question the benchmark refuses, how rich is this country, under the name of
another. Retiring them would have thrown away the other half of the reading.
The Brazil adaptability report needs both sides: what a country has to work
with, and whether it turns that into capability. The second correlation in
`diagnostics.conditions` is that map. It is the reason the layer exists.

Measured on the 7.0.0 run against 6.2.0, same observations, no re-ingest:

| Dimension | r log GDP | Mean confidence | Scored countries | Brazil |
| --- | --- | --- | --- | --- |
| Anticipation | 0.873 → 0.872 | 0.601 → 0.451 | 53 → 52 | 37.3 → 45.8 |
| Agency | 0.851 → 0.638 | 0.577 → 0.383 | 52 → 52 | 58.9 → 51.6 |
| Learning | 0.731 → 0.658 | 0.495 → 0.368 | 53 → 52 | 43.5 → 30.2 |
| Adaptability | 0.839 → 0.738 | 0.676 → 0.638 | 53 → 53 | 62.7 → 65.4 |
| Building | 0.635 → 0.434 | 0.603 → 0.551 | 53 → 53 | 25.3 → 28.2 |

Coordination, Trust, Experimentation and Shared Purpose do not move. Across
the eight dimensions with a complete panel (46 countries, Trust left out for
coverage), the first factor's share of variance falls from 0.62 to 0.50 and the
mean absolute correlation between dimensions from 0.55 to 0.42. On all nine
(33 countries) the share falls from 0.60 to 0.50. The guardrail, mean
confidence across dimensions against log GDP per capita, falls from 0.39 to
0.32 (n 51). Redundant indicator pairs fall from six to none. Cuba loses its
Anticipation and Learning scores, each now on one observed row. 261 of 477
country-dimension cells change.

The conditions themselves, r against log GDP per capita and against their
dimension's score:

| Condition | Dimension | r log GDP | r dimension score |
| --- | --- | ---: | ---: |
| R&D expenditure | Anticipation | 0.63 (n 49) | 0.71 (n 50) |
| Researchers in R&D | Anticipation | 0.79 (n 48) | 0.88 (n 49) |
| Secure internet servers (logged) | Anticipation | 0.90 (n 51) | 0.89 (n 52) |
| Internet users | Agency | 0.88 (n 51) | 0.46 (n 52) |
| Account ownership | Agency | 0.79 (n 51) | 0.50 (n 52) |
| Credit to the private sector | Agency | 0.54 (n 51) | 0.50 (n 52) |
| Tertiary enrolment | Learning | 0.81 (n 50) | 0.67 (n 51) |
| Public education expenditure | Learning | 0.35 (n 51) | 0.47 (n 52) |
| Fixed broadband subscriptions | Adaptability | 0.85 (n 51) | 0.67 (n 53) |
| Output per worker | Building | 0.89 (n 51) | 0.46 (n 51) |

Most conditions go with income more closely than with the capability they sit
beside, which is what the split was for. Anticipation is the exception: its
conditions go with its score as closely as with income, and its two capability
rows track income at 0.87 by themselves. That is published as a finding
against the claim, not corrected.

**Cost.** Confidence falls where conditions carried it. Agency (0.38) and
Learning (0.37) drop below the O1 target of 0.40, and Anticipation scores on
two rows. That evidence was always this thin; the stocks hid it. Agency now
rests on new business density and two Doing Business series frozen at 2019
(A6), and its scores move most: Nicaragua rises 31.8 points, Rwanda 22.4,
Japan falls 20.2 and Venezuela reaches 0. The GDP-stripped test now empties
Anticipation, because both of its remaining rows sit past the wealth
threshold. Published scores move in five dimensions and `DimensionResult`
gains a field, so this is a major version under D37 and 6.x numbers are not
comparable. A condition beside a score will be read as part of it by some
readers, as a check can be; the panel says "not scored" in its label and the
note travels with the value. The rule is a construct judgment, and the audit
was written with the income correlations in view, which the memo discloses.
A row's role can be argued, and each argument costs a decision entry.

**Overturned by.** Evidence that a condition observes the capability after all,
for instance a use measure that tracks the stock so closely that the two
cannot be separated, which would return that row to the score by its own
decision. Readers or consumers treating the conditions layer as a second
score, which would mean the layer does the harm D60 warns of and the rows
should move to the indicator rows with status, or out of the published
dimension altogether. Or a capability row for Anticipation, Agency or Learning
whose arrival shows that the confidence lost here was a cost of the split
rather than of thin evidence, which would reopen whether the move should have
waited for replacements, as Tier B does.

---

## D123 — Bribery incidence is scored in Trust, because it observes whether the rules hold

*Recorded 2026-10-01. Reopens the check D60 created, under D118. Supersedes D60's
reason for holding it out; D60's mechanism for checks stands.*

**Decision.** `bribery_incidence`, World Bank `IC.FRM.BRIB.ZS`, moves from
`checks.ts` to the indicator registry as a scored row in Trust's institutional
family, lower is better. It is the share of firms asked for at least one bribe
across six public transactions: utilities, permits, licences and taxes.

**Why.** Trust asks how much cooperation is possible beyond immediate personal
networks, and its high end reads "strangers cooperate on the strength of the
rules". This series observes whether the rules hold where a firm meets the
state as a stranger. It records experience, not reputation: the respondent is
asked whether it was itself asked, which is what separated it from the
perception composites D23 retired. D60 judged it valid on that ground and held
it out only because it carried income. D118 removes that reason. Its income
correlation (about 0.66 alone when D60 measured it) is now published as a
finding.

It covers 50 of 53 countries, all but Argentina (2017), Nicaragua and Honduras
(2016), South Africa (2020) and Venezuela (2010) at 2023 or later, because the
Enterprise Surveys now run in high-income economies too. It gives Trust's
institutional family a second observed row beside contract enforcement, which
D57 asks for before Trust can be read.

**Cost.** Respondent reticence. Firms in some systems do not report a bribe
request to a survey, so a low value can mean clean transactions or a cautious
answer. China reads 0.14% and Korea 0.02% while Vietnam, surveyed by the same
programme, reads 31%. Where it bites, the pattern is the A13 trap in survey
form, and it is recorded as an
artefact rather than corrected, because the Enterprise Surveys' own reticence
adjustment is not published per country. Venezuela's 2010 value is old and the
recency term marks it down. Trust's correlation with income rises; the release
prints by how much.

**Overturned by.** Evidence that reticence, not experience, drives the
cross-country ordering: for example the Enterprise Surveys' published
reticence indicators placing the lowest-reporting countries among the most
reticent. That would make the row a perception of risk rather than an
observation, and it would return to a check with that reason.

---

## D124 — Research citation impact is wired from OpenAlex as a top 10% share

*Recorded 2026-10-01. Issue #23. D122 and D123 are being written on other
branches; this entry takes the next free number after them.*

**Decision.** `research_citation_impact` (Learning) moves from `gap` to
`adapter`. The value is the share of a country's articles and reviews,
published 2019 to 2021 and stamped 2021, that OpenAlex places in the top 10%
most cited for their subfield and publication year
(`citation_normalized_percentile.is_in_top_10_percent`), divided by the same
share across every work with an institution country. A work counts for every
country any author's institution sits in (whole counting). Unit "ratio to
world average", `higher_better`, class `O`, tier `academic_survey`. The
definition is reworded from "field-normalised citation impact" to say this.

The adapter `openalex-top10-share-v1` makes two grouped calls by
`authorships.institutions.country_code` and two baseline counts, with
`corpus=core` written into each request. It asserts that all 53 countries
appear in both grouped results and counts any that does not with two
per-country calls; on 2026-10-01 none was missing. OpenAlex has no version
parameter, so the observation file carries the pin under `openalex`: every
request, the retrieval date, the totals and each country's two counts. The
values derive from those counts, a rescore never touches the network, and a
refetch is the explicit `pnpm bench openalex fetch`, diffed into
`revisions.json`. The `mailto` and any API key are sent and never stored.
Brazil is 0.602 (62,795 of 606,599 works, 10.35% against 17.20%). The memo is
`docs/research/learning/OPENALEX-CITATION-IMPACT.md`.

**Why.** Construct first. Learning asks whether a country absorbs and produces
knowledge. Whether the research it produces is used by others, relative to what
is normal in that field, is an outcome of that, not a stock of spending,
enrolment or researchers that money buys directly. A share is size
independent, the field and year normalisation is OpenAlex's own, and a count of
flags cannot be moved by one paper the way a mean FWCI can. The ratio to the
affiliated world corrects a level OpenAlex sets against a pool dominated by
unaffiliated, uncited works (affiliated works sit at 17%, not 10%); within one
window it rescales every country alike and changes no score. Dataset 7.0.0
(D122) moves Learning's stock rows to the conditions layer and leaves Learning
thin, and this row measures the dimension rather than its inputs.

Reported as findings, not tests, from a local run on dataset 6.2.0: the row's
normalised score correlates with log GDP per capita at r = 0.588 (n 51), its
wealth-attribution delta is 0.063, and Learning moves from r = 0.731 to 0.794
(Spearman 0.733 to 0.813) while its mean confidence rises from 0.495 to 0.586.
It forms no redundant pair; the closest rows are `interpersonal_trust` at
0.799 and `sci_articles_per_million` at 0.796. The prior `wealthProxyPrior`
moves from 0.3 to 0.6, which is what the issue memo measured.

**Cost.** Whole counting lifts small countries whose researchers co-author
with larger systems: counting only single-country works, Panama falls from
21.25% to 3.14%, Kenya from 19.83% to 5.94% and Estonia from 32.89% to 18.26%.
The domestic-only share is not published; it is the obvious behavioural check
under D60 and is left as follow-up. 37% of articles and reviews with a
percentile in the window carry no institution country, and missing affiliations
thin small producers most; Haiti rests on 389 works and no floor is applied.
Conference papers are out, which understates computing-heavy systems.
The value drifts: OpenAlex recomputes citations, percentiles and affiliations
continuously, and on the day of the fetch some counts moved within two minutes.
A later fetch will restate every value, which `revisions.json` will show, and
the number published is the number read on the stamped retrieval date. The
data is CC0; the fetch costs four credits of the keyless $0.10 daily budget.

**Overturned by.** A fractional-count or domestic-only reading, from the
OpenAlex snapshot or the API, that reorders the frame enough to show whole
counting is reading collaboration networks rather than use of a country's own
research, which would swap the construct or make this row a check; affiliation
coverage shown to bias the share by country income or region, which would
make the row read indexing rather than research; or OpenAlex changing the
percentile's pool or definition, which would need a new adapter version and a
new entry.

---

## D127 — Perceived control is scored in Agency from the Joint EVS/WVS A173 mean

*Recorded 2026-10-01. Extends D64's adapter under D117 and D118. D125 and D126
are being written on other branches; this entry and D128 take the next numbers
after them.*

**Decision.** `perceived_control` (Agency) moves from `gap` to `adapter`. The
value is the publisher-weighted mean, on the 1 to 10 scale, of A173, "how much
freedom of choice and control you feel you have over the way your life turns
out", from the same pinned Joint EVS/WVS 2017-2022 v5.0.0 results PDF as
`interpersonal_trust`. Class `P`, `higher_better`, tier `academic_survey`,
unit `mean 1-10`, publisher Joint EVS/WVS. The adapter now reads an item table,
`JOINT_EVS_WVS_ITEMS`, the way `vdem.ts` reads variables; country mapping and
D64's hold rule are shared, so Germany, the United Kingdom and the Netherlands
are held. The A165 output is unchanged: the refetch restated no trust value or
note. `pnpm bench evs fetch` runs the adapter, with `trust` kept as an alias.
The memo is `docs/research/agency/EVS-WVS-ITEMS.md`.

The statistic is the published mean because it is what the table prints. The
table gives the full distribution, the valid-answer base, the mean and the
standard deviation, and no top-box share. A share answering 7 to 10 would have
to be summed from category percentages whose denominator includes don't know
and no answer, which is a number the publisher does not publish.

**Why.** Construct first, written in the memo before values were read in.
Agency asks how able people are to turn an intention into action. A173 does
not observe action; it observes the felt capacity to act, whether people
believe what they decide changes what happens to them. That is the half of the
question no current row reaches: Agency rested on new business density and two
Doing Business rows frozen at 2019 (A14). It is a perception and is labelled
as one, as `interpersonal_trust` is.

Reported as findings, not tests (D118), from a local run on dataset 7.1.0: the
row covers 37 of 53 countries, fieldwork 2017 (eight countries, the United
States among them) to 2023 (India), every value stamped with the release year
2022. Brazil is 7.5 (16th of 37, fieldwork 2018). The value correlates with log
GDP per capita at r = -0.154 (n 36); its `wealthAttribution` delta is -0.059.
Agency moves from r = 0.638 to 0.579 against log GDP, its mean confidence from
0.383 to 0.483, which crosses O1, and it stays scored in 52 countries. The
United States, Nicaragua and Venezuela, which were Agency on the two frozen
rows alone, now carry a third. The guardrail, mean confidence against log GDP,
falls from 0.333 to 0.286 (n 51), together with D128. No redundant pair forms;
the row correlates with interpersonal trust at -0.14.

**Cost.** Response style on a 10-point scale differs across cultures, so part
of the ordering is how samples use a scale: Mexico, Uruguay and Colombia sit at
8.1 to 8.2, Japan at 6.0 on a mail survey. A closed or electoral autocracy can
read high, and two do: Vietnam is third at 8.1 and Nicaragua fifth at 8.0,
surveyed in 2019-20 after the 2018 crackdown. That is the A13 pattern in a
perception, recorded as artefact A15 and not corrected. The mean is printed to
one decimal over a spread of 6.0 to 8.2, so ties are common. Fieldwork years
differ by up to six years and the stamped year hides it; the note carries each
country's survey year. Sixteen countries have no row, Costa Rica, Ireland,
Israel and South Africa among them.

**Overturned by.** Evidence that the cross-country ordering is mostly response
style, for example anchoring-vignette or scale-use studies that reorder the
frame when applied, which would make the row a measure of how samples answer
10-point questions; a behavioural Agency row with frame coverage that
contradicts it, which would make it a check under D60; or a release whose
pooled microdata let the three held countries in, which needs a new entry for
the pooling rule.

---

## D128 — Civic participation is scored in Shared purpose from charitable membership (A080_01)

*Recorded 2026-10-01. Extends D64's adapter under D117 and D118, beside D127.*

**Decision.** `civic_participation` (Shared purpose) moves from `gap` to
`adapter`. The value is the publisher-weighted share of respondents who mention
membership of a humanitarian or charitable organisation, A080_01, in the same
pinned results PDF, read by the same item table and hold rule as D127. Class
`C`, `higher_better`, unit `% mentioning`. The definition narrows from "active
membership in associations, unions, parties and community organisations" to
what the row measures. Religious membership (A065) is left out because it
reads religiosity; an "any non-religious membership" count would match the old
definition better, but the aggregate table does not publish it and the adapter
does not use microdata.

The joint file harmonises two questions. EVS 2017 shows a list and asks which
organisations the respondent belongs to; WVS 7 reads each type aloud and asks
whether the respondent is an active member, an inactive member or not a
member. The codebook recodes both WVS member answers to 1, so the stored
"Mentioned" column is belongs (EVS) or active or inactive member (WVS), over
all respondents including don't know and no answer.

**Why.** Construct first, written in the memo before values were read in.
Shared purpose asks whether people can imagine themselves as participants in
a common project. Joining an organisation whose purpose is to act for people
outside one's own network is a reported behaviour, and of the ten membership
items it is the closest to acting for strangers; unions and professional
bodies read interest groups, sports and culture read leisure, and parties are
the democratic channel A5 retired. Shared purpose had two scored rows and was
the thinnest dimension after Trust.

Reported as findings (D118), same run: 37 of 53 countries, fieldwork 2017 to
2023. Brazil is 9.7% (25th of 37). The value correlates with log GDP per
capita at r = -0.331 (n 36); the `wealthAttribution` delta is -0.172. Shared
purpose moves from r = 0.457 (n 47) to 0.202 (n 50) against log GDP, its mean
confidence from 0.260 to 0.343, still under O1, and it is scored in 51
countries instead of 47: Nigeria, Vietnam, Singapore and Venezuela clear the
coverage floor. Brazil's Shared purpose moves from 34.9 to 30.7. No redundant
pair forms. The A13 fear did not materialise: China reads 2.7% and Vietnam
9.4%, so state mass organisations, which are unions and youth and women's
federations, do not inflate a charitable item. Cuba is not in the release.

**Cost.** Question format. The eight EVS countries in the frame average 9.9%
and the 29 WVS countries 19.4%; among the ten countries surveyed by both
programmes the WVS share is higher in eight, by a median 1.9 points (Great
Britain +16.0, Czechia -5.0), with fieldwork years also differing inside the
pairs. Inside the EVS group the share tracks income at 0.83; across the frame
it runs against it. Part of the spread is the format, and a reader should
check that before reading the negative income correlation as evidence for
the claim. Estonia's 1.5% is the floor and the value most exposed to it; Kenya
(38.4%) and Indonesia (37.9%) top the row with inactive members counted.
Membership is not activity. One item is narrower than the construct. The row
is artefact A15 with D127.

**Overturned by.** Microdata showing that the EVS-WVS difference holds within
countries after fieldwork year is controlled, at a size that reorders the
frame, which would hold the row until a format adjustment is documented; a
harmonised "any non-religious membership" or volunteering series with frame
coverage, which would replace the single item; or evidence that charitable
membership in some countries is a condition of employment or state
programmes, which would make it the A13 case after all.

---

## D129 — Voter turnout is published as a behavioural check beside Shared Purpose, not scored

*Recorded 2026-10-01. Extends D60, D118 and D121. Answers Q8 of the O1 triage
sweep.*

**Decision.** V-Dem's election turnout is published beside Shared Purpose as
a behavioural check under D60 and enters no score. The check is
`voter_turnout` in `checks.ts`, read from `v2eltrnout` in the Full+Others
archive the V-Dem adapter already pins (v15, 2025-03-04, CC BY-SA 4.0). The
codebook (3.1.4.3) defines it as the percentage of all *registered* voters who
cast a vote in the national election according to official results; it is not
the voting-age-population reading, which is `v2elvaptrn`. Where executive and
legislative elections fall on the same day V-Dem codes the executive turnout,
and the country-year takes the maximum across that year's elections. Unit
`% of registered voters`, direction `higher_better`, tier `expert_panel`. It
covers 52 of 53 countries; China holds no national election V-Dem codes.

V-Dem codes election variables in election years only, so the adapter's
single-year design would leave most of the frame blank at 2024. Each entry in
the adapter's variable table now names its year rule. `release_year` keeps the
old behaviour for civil-society strength and polarization. `latest_election`
reads each benchmark country's newest row up to 2024 that carries a value,
emits it with that row's year, and never reaches back to an older election when
the newest one is out of scale. Election years run 2016 (Haiti) to 2024: 18
countries at 2024, 15 at 2023, 9 at 2022, 7 at 2021, one each at 2020, 2019
(United Arab Emirates) and 2016. The observation note carries `v2elcomvot`
(compulsory voting, codebook 3.1.2.3) and `v2x_regime` (Regimes of the World)
for the same country-year, with their codebook labels, as context and never as
values. `CheckDef.pinned` gains `years`, `only` by default or `latest_up_to`,
and `/sources` prints "in each country's latest year with a value, up to 2024"
for this check instead of "for 2024".

No registry gap is added. Polarization shares its id with a declared gap
because that gap names a measurement Shared Purpose still wants; turnout is not
such a measurement, so the check stands alone. No scoring rule is added: the
triage sweep's proposed rule (score where `v2x_regime` is 2 or 3 and
`v2elcomvot` is 0 or 1) is recorded in the memo and not wired.

**Why.** D118 chooses rows for what they measure. Turnout is a revealed act of
taking part in a common decision, the most direct behaviour the benchmark can
see for Shared Purpose, and that is why it is published. It is not scored
because three things move it that are not whether people see themselves in a
common project, and the number cannot tell them apart. It reads the democratic
channel, which A5 retired voice and accountability for: a country without
competitive elections reads low or high for reasons of regime. Compulsory
voting turns it into a reading of the law: Brazil enforces it (code 2,
sanctions enforced at minimal cost; 79.42% in 2022), and the eight countries
that enforce sanctions average 82.6% against 65.4% for the 36 where voting is
voluntary. And autocracies manage it, the A13 trap from the other side:
Vietnam reads 95.6, Rwanda 98.2, Ethiopia 93.6 and Singapore 93.6, which is
mobilisation, not participation. By regime at the election year the means are
flat, 68.8 closed autocracies (n 3), 70.9 electoral autocracies (16), 67.5
electoral democracies (15) and 69.6 liberal democracies (18): the series does
not separate the regimes it should, which is the construct failure in one line.
The sweep's rule would leave about 27 scorable countries and exclude Brazil,
the benchmark's subject, so a scored row is declined.

**Cost.** Shared Purpose stays at two rows, 47 published countries, mean
confidence 0.260. No score moves: all 477 country-dimension cells, their
confidences and every composite are identical with the check present; the only
change in `index.json` is the new check row. Reported as a finding, not a
reason: `behaviouralChecks` puts the published value at r = 0.053 against log
GDP per capita (n 52) and 0.007 against the Shared Purpose score (n 46).
Turnout is not a wealth proxy; it fails on construct alone, as polarization
did. The latest-election rule mixes vintages up to eight years apart (Haiti
2016), and a country-year maximum mixes presidential and parliamentary
elections across countries; the year shown on every row is the only guard. The
United Arab Emirates' 34.8% (2019) is turnout of a hand-picked electoral
college, not of citizens. The adapter now fully parses every benchmark row up
to 2024 instead of only the release year, which costs a few seconds. The
dataset version does not move: no scored row, field or country changes.

**Overturned by.** A scoring rule conditioned on regime and compulsion that
the project adopts on construct, which would move the conditioned subset to
`indicators.ts` as a row and leave the rest as this check; a turnout source
that measures participation outside the electoral channel; a V-Dem release that
changes `v2eltrnout`'s denominator or drops coverage below half the frame; or
evidence that readers take the check for a score, which under D60 would retire
it.

---

## D130 — Brazil's layer publishes a computed map of Adaptability among its income peers

**Decision.** The Brazil layer gains `/brasil/adaptacao`, a Portuguese page
that reads one capability for one country as a map: the score and its
confidence as two numbers, each capability row the score rests on (value as
published, year, position on the 0 to 100 frame, source), each condition
beside it with its value, rank and the two correlations D122 already
publishes (with log GDP per capita and with the dimension's score), and the
country's place among its income peers. `buildCapabilityMap` in
`packages/core/src/pipeline/capability-map.ts` computes all of it from the
published files and nothing else; the page renders it through the lexicon
(`Lexicon.capabilityMap`, English and Portuguese). Only Adaptability is
published. The function takes the dimension as a parameter, the layer section
id is `map.<dimension>`, and `MAP_DIMENSIONS` lists what is published, so a
second capability is a registry line, a slug and a decision entry. The slug is
`adaptacao` because the lexicon names the dimension Adaptação.

The peer rule: the 10 countries nearest the subject in log10 GDP per capita
(`NY.GDP.PCAP.PP.KD`, latest published year per country), ties broken by
iso3, the subject never its own peer, a country with no income never a peer.
The set is the same for every dimension. A peer median is taken over the
peers that have the value; a peer with no score is listed and left out of the
score median. Above, below or level is decided at the precision the value is
printed at (one decimal for a 0 to 100 position, three for a condition's
published value). For the set to be computed from published data, income has
to be published: `diagnostics.json` gains `income`, the latest GDP per capita
per country with its year, rounded to the dollar. That is a field added, so
the dataset moves to 7.2.0 and no published number changes.

The no-prescription rule: every sentence the page computes compares one value
with one median, or states a correlation. No string in `capabilityMap` may say
what a country should do, rank it among its peers, or explain why a gap
exists. The reading lists rows above, below and level with the peer median and
conditions the country has more or less of, by id, through
`readCapabilityMap`; the words are the lexicon's. Splitting the agenda stays
`splitAgenda`'s job (D39); this page does not sort anything into raise or
hold, and the FlagField it draws is the one chart (D67), fed only the peers
and the subject.

On dataset 7.2.0 Brazil's peers are Colombia, Mexico, Thailand, Paraguay, the
Dominican Republic, Peru, China, Vietnam, Indonesia and Argentina, at US$
15,091 to 27,847 against Brazil's 20,025 (2025). Brazil's Adaptability is
65.4 (confidence 0.68, good) against a peer median of 70.3. All five scored
rows sit below the peer median; export diversification only just (83.0
against 83.4). Fixed broadband, the one condition, is above it (24.1 against
16.1 per 100 people) and correlates 0.85 with income and 0.67 with the score.

**Why.** The owner's framing is that the page is the map toward adaptability,
not a verdict on it. D122 made the map possible by separating what a country
does from what it has; this page lays the two side by side for the reader the
layer serves. WHY.md rules out a ranking, a target and policy advice, and
says a national score is a coarse proxy, so the comparison is a median and
the limits are on the page: the proxy, the peer rule's blindness to
everything but income, correlation read across the whole set, and the row
caveats of D119 and D120 (merchandise concentration is a product mix;
long-term unemployment passes a gate, and Brazil's comes from PNAD Contínua,
a household survey). A hand-picked peer list would be the comparison the
author wanted; a fixed rule on the series the wealth tests already read is
one a reader can recompute. Ten is enough for a median to mean something and
few enough that the set stays near in income (a factor of about 1.4 either
side for Brazil); a ±band was rejected because its count swings with where a
country sits in the income distribution.

**Cost.** Income is the only thing peers share: size, region, production
structure and regime are outside the rule, and a GDP revision can swap a
peer. The page is Brazil-only and Portuguese-only, so the comparison is not
yet checkable on the ground layer for another country. Level is decided at
printed precision, so 83.0 against 83.4 reads as below. The row caveats are
static lexicon text and must be kept in step with D119 and D120 by hand.
Publishing GDP per capita puts income one click from every score, which the
project has so far kept inside correlations.

**Overturned by.** A reader or reviewer showing that a sentence on the page is
read as advice despite the rule, which would cut the reading section back to
numbers; evidence that the peer set is unstable across releases (more than
half the peers swapping on a routine re-ingest), which would move the rule to
a wider set or a band; or a second dimension's map showing the layout does not
carry it, which would move the page to the ground layer with the layer as one
reading of it.

---

## D125 — The GEM extension is held, because it adds evidence mostly where income already is

*Recorded 2026-10-01. Brief: the Experimentation section of
`docs/research/O1-TRIAGE-SWEEP.md`. The extraction is kept in
`docs/research/experimentation/GEM-AND-DESIGNS.md` and `gem-extract.py`.*

**Decision.** `early_stage_entrepreneurial_activity` and `failure_tolerance`
stay on their original 16 countries. The values for every other benchmark
country in the seven GEM Global Reports for survey years 2019 to 2025 were
read, checked against the printed pages and recorded in the memo, and they are
not entered in `manual.json`. Industrial designs (D126) ships without them.

**Why.** The guardrail beside O1 says confidence must not come to track
wealth (D117). GEM participation is chosen and paid for by national teams, and
the 14 benchmark countries it has not surveyed since 2019 are, apart from
Singapore, lower-income: Vietnam, the Philippines, Malaysia, Nigeria, Kenya,
Rwanda, Ethiopia, Bolivia, Paraguay, Honduras, Nicaragua, Cuba and Haiti.
Measured on dataset 7.2.0, where the guardrail is 0.286: the extension
over 2022 to 2025 raises it to 0.357; widening the window to 2019 to 2025, to
reach poorer countries surveyed earlier, raises it further to 0.387, because
three of the five countries the wider window adds are high-income. With
industrial designs alone it is 0.298. Experimentation's own confidence against
log GDP would go from 0.20 to 0.57. The extension would raise
Experimentation's mean confidence from 0.225 to 0.350, and that gain would sit
almost entirely in countries the benchmark already knows best.

The construct is not the problem. TEA counts people trying and fear of
failure is the attitude the dimension names; the rule for a future entry
stands: survey year, not report year; the latest year in the window, never an
average; and only the fear of failure question GEM introduced in 2019, over
adults who see good opportunities.

**Cost.** Experimentation stays the thinnest dimension, at mean confidence
0.27 with designs, and 37 countries stay scored on patents, trademarks and
designs alone (A1). Values that were read and verified stay unpublished.

**Overturned by.** GEM surveying enough of the missing lower-income countries
that the extension no longer raises the guardrail, or an open GEM data release
that covers them; or a decision that a source raising confidence in richer
countries is acceptable when its construct is sound, which would supersede
this entry and D117's guardrail together.

---

## D126 — Resident industrial design applications are scored in Experimentation

*Recorded 2026-10-01. Same brief as D125.*

**Decision.** A new Experimentation row, `resident_industrial_designs_per_million`,
World Bank `IP.IDS.RSCT`: industrial design applications by residents at
their national office, per million people, `higher_better`, class `O`. The
per-head transform is the one `resident_trademarks_per_million` uses
(`per_million_population` over `SP.POP.TOTL`), so the two rows are built
alike. Coverage 50 of 53 (no NLD, VEN, HTI); 45 at 2021, the others between
2007 (ETH) and 2020.

**Why.** Construct first. A filed design is a registered attempt at a new
product form. It costs less and is filed more often than a patent, which is
closer to the dimension's many-small-experiments reading than patents are,
and it is an output rather than a stock. Reported as findings, not tests: the
probe gives r = 0.02 for the raw count against GDP; the scored row's
normalised value correlates with log GDP per capita at r = 0.494 (trademarks
0.578, patents 0.524), its wealth-attribution delta is 0.007, and its r with
`resident_trademarks_per_million` is 0.816 (n 49), under the 0.85 redundancy
flag. On dataset 7.3.0 this row takes Experimentation from r = 0.623 to 0.572
with log GDP and its mean confidence from 0.225 to 0.271; the guardrail moves
from 0.286 to 0.298. The GEM extension it was built beside is held (D125).

**Cost.** Three traps, all in the registry note. China subsidised design
filings as it did patents, so its count runs ahead of the attempts behind it;
it reaches the fence with Korea, Turkey, Germany, France, the United Kingdom
and Switzerland. EU applicants increasingly file at the EUIPO, which a
national resident count misses, so EU members read low. The Netherlands files
through the Benelux office and has no national series. The row partly
duplicates trademarks (r 0.816), so filing culture weighs twice.

**Overturned by.** A redundancy reading at or above 0.85 with trademarks, which
would make one of the two rows a check; evidence that subsidised or strategic
filing, not attempts, sets the cross-country order; or a WIPO series that
counts a country's residents at every office it files at (national, EUIPO,
Hague), which would replace this one.

---

## D131 — Government compliance with the courts is scored in Trust; the rest of the V-Dem sweep is declined

*Recorded 2026-10-01. Answers Q5 of the research roadmap. Extends D57, D118 and
D121. One combined entry: one row wired, every other candidate declined. The
triage table is `docs/research/vdem-sweep/TRIAGE.md`.*

**Decision.** A new Trust row in the institutional family, `court_compliance`:
V-Dem's compliance with judiciary (`v2jucomp`, codebook 3.8.1.11), "how often
would you say the government complies with important decisions by other courts
with which it disagrees?", read as `v2jucomp_osp`, the measurement-model
estimate on the original 0 (never) to 4 (always) scale, from the Full+Others v15
archive the adapter already pins, year 2024. 53 of 53 countries. Direction
higher is better, class O, tier `expert_panel`. The adapter reads it as a
fourth entry in its variable table under the `release_year` rule. It fills no
existing gap: it is neither public confidence (`institutional_trust`) nor
court throughput (`court_case_clearance`).

Twenty other variables were triaged for Trust and Coordination and none is
wired, as a score or as a check. Coordination gains nothing.

**Why this one.** Trust's high end is strangers cooperating on the strength of
the rules. A ruling a stranger obtains is worth something only if the state
obeys the rulings it loses, so whether the rules bind the strongest party is
the institutional precondition of the dimension. The variable is an expert
code, the same kind of instrument as the WGI composites D23 retired, and it is
even one of their inputs (through V-Dem's judicial constraints and liberal
component indices, which the WGI rule of law estimate uses). What separates it
is the object coded: one act whose instances are public, a court ruling against
the government and the government's response, so a coder answers about a
frequency that the record can check. The retired composites, and the V-Dem
items this sweep declined in their place (`v2clrspct` impartial
administration, `v2cltrnslw` predictable enforcement, `v2exbribe`,
`v2excrptps` and `v2jucorrdc` bribery), ask for a characterisation of how
clean or impartial a country's institutions are, or about hidden acts no coder
observes: a reputation, whatever the method.

The A13 test was written before the values were read: where courts never rule
against the state there is nothing to disobey, and a closed regime could read
well on silence. It does not happen. Closed autocracies average 0.72 on the
0 to 4 scale and electoral autocracies 1.67, against 2.75 for electoral and
3.53 for liberal democracies; China reads 0.21, the United Arab Emirates 0.59,
Vietnam 1.25. Singapore (3.54, 12th of 53) is the one autocracy that reads
high, and the registry note names it. Scored, the row moves Trust against the
trap the dimension already carried through bribery reticence (D123): China
falls from 88.7 to 67.5, Rwanda from 78.9 to 63.9, El Salvador from 69.8 to
51.1.

**Why not the others.** Coordination's best candidate, range of consultation
(`v2dlconslt`), observes who is heard while policy is made, not whether
independent actors then act together; it is a deliberative-democracy component
and it fails A13 (closed autocracies 0.47 above electoral autocracies -0.32;
Vietnam level with Uruguay). Merit appointment, bureaucratic pay and fiscal
source are properties of the state apparatus, conditions under D122, and the
model starts no expert-coded condition here. The CSO consultation and
participation items feed `v2x_cspart` (r 0.90 and 0.88). Common-good
justification puts Cuba second of 53. Compliance with the high court
duplicates the row chosen (r 0.95). Each verdict is in the triage table.

**Findings, reported and not used to decide.** The row's r with log GDP per
capita is 0.533; its largest r with another Trust row is 0.36 (bribery
incidence). On dataset 7.3.0 it moves Trust's r with log GDP from 0.571 (n 49)
to 0.671 (n 51), a wealth-attribution delta of 0.155, close to bribery
incidence's 0.162; Trust's mean confidence from 0.311 to 0.347, still under
O1's 0.40; its scored countries from 50 to 52 (the United Arab Emirates and
Haiti publish for the first time, both on the institutional family alone; Cuba
stays below the floor); and Brazil's Trust from 41.4 to 55.9 at confidence
0.396. The guardrail does not move: the mean confidence across dimensions
correlates with log GDP per capita at 0.298 before and after, because the row
covers every country.

**Cost.** The row reads regime: r 0.88 with V-Dem's electoral democracy index.
That follows from the construct, since in this frame the states that do not
obey their courts are autocracies, but it means Trust now carries a democracy
signal, and r 0.82 with the Coordination row `civil_society_strength` from the
same source. Trust's income correlation rises by 0.10 toward the 0.70 line O2
reports. Two countries publish Trust on one family, which D57 counts in
`familyBalance` (15 countries now, 13 before). An expert code is still
an expert code: the source tier is `expert_panel` and the note says to read it
as a judgement of a public act. The dataset version is not bumped in this
change; adding a scored row is a minor bump when it ships.

**Overturned by.** Evidence that coders score compliance from a country's
general reputation rather than from rulings and responses, for example a
validation against documented non-compliance events that the code does not
track, which would make it the reputation D23 retired and return it to a check
or retire it; a closed regime reading high on silence in a later release, the
A13 failure written down here; a harmonised court-performance series
(clearance or enforcement) across the frame, which answers the institutional
family more directly and would make this row a check beside it; or a redundancy
reading at or above 0.85 with another Trust row.

## D132 — Confidence in the courts is published as a check beside Trust; `institutional_trust` stays a gap

*Recorded 2026-10-01. Extends D57, D60, D64, D118 and D121. The memo is
`docs/research/trust/EVS-WVS-INSTITUTIONAL-TRUST.md`.*

**Decision.** The Joint EVS/WVS adapter reads a fourth item from the same
pinned results release (v5.0.0, weighted by `gwght`): E069_17, confidence in
the justice system and courts. It is emitted as the behavioural check
`__check__institutional_trust`, declared in `checks.ts` under the gap's own id
with `ingest: 'adapter'` and a `pinned` entry naming `ZA7505_cdb_Tables.pdf`,
as polarization shares its id with its gap (D121). The stored value is the
published share answering "a great deal", over all respondents; the other
published shares (quite a lot, not very much, none at all, don't know, no
answer) and the fieldwork year are quoted in each observation's note. The
same hold rule applies: Germany, Great Britain and the Netherlands have
separate EVS and WVS rows and are held. 37 of 53 countries, fieldwork 2017 to
2023. The `institutional_trust` row stays `ingest: 'gap'`. Nothing is scored.

**Why this item.** The construct was written before any value was read.
Courts answer the dimension most directly: a court is where a stranger goes
when the rule is broken, so confidence in it is the respondent's estimate that
the rule will be enforced. Civil service was the second choice. Government,
parliament and parties were argued out because they read the incumbent and
the electoral cycle of each fieldwork year, not whether the rules hold
whoever governs; police was argued out because it carries crime exposure,
which D44 showed travels with income. The table prints no mean and no "great
deal plus quite a lot" column, so the one published number that reads
confidence by itself is "a great deal"; the sum would be computed from two
rounded columns, which D64's rule forbids.

**Why a check and not a score.** The A13 test was run before deciding, on
V-Dem v15's 2024 Regimes of the World (`v2x_regime`) read from the pinned
archive. Share saying a great deal: closed autocracies 28.1 (China, Vietnam),
electoral autocracies 23.5 (n 9), liberal democracies 14.0 (n 11), electoral
democracies 7.9 (n 15). Counting quite a lot too: 88.3, 60.3, 60.9 and 36.2.
India (39.7), the Philippines (33.0) and Indonesia (30.6) lead the published
share; Vietnam and China lead the combined one. Every other item tested reads
the same way, autocracies above democracies on both statistics: civil service
(great deal 16.9 against 5.7), police (23.6 against 15.9), parliament (18.4
against 4.2) and government (26.2 against 6.5). The item also does not track
the institutional fact it would stand for: across the 37 countries it
correlates -0.13 with V-Dem's government compliance with the courts
(`court_compliance`, D131), the row that does score in this family. Scored, it
would rank highest the states whose courts are least able to rule against
them. That is A13's failure, and D60 says the honest form is a check.

**Findings, reported and not used to decide.** The published share correlates
-0.18 with log GDP per capita (n 36); the combined share would be 0.30.
`behaviouralChecks` reports r -0.056 with the Trust score (n 37). Brazil reads
11.8 percent a great deal (38.5 quite a lot), 19th of 37. Trust does not move:
r with log GDP 0.671 (n 51), mean confidence 0.347, 52 countries scored,
Brazil 55.9 at confidence 0.396, all as on dataset 7.4.0. The guardrail, the
mean confidence across dimensions against log GDP per capita, stays 0.298. The
A165, A173 and A080_01 observations are unchanged in value and note; only
their retrieval stamp moves.

**Cost.** Trust still misses O1's 0.40 confidence target and the institutional
family still has no survey row: this change publishes evidence and closes
nothing. A reader may take the check's high values for autocracies as a
finding; the attached note is the only mitigation. Storing the "a great deal"
share alone reads only the top category, which is a narrower and noisier
statistic than the conventional two-category share; the alternative needed a
computed value. No dataset version bump: a check adds no scored row.

**Overturned by.** A release that publishes a valid-answer mean or a
two-category share for the battery, with the regime pattern gone (autocracies
no higher than democracies) when tested the same way; pooled microdata with a
list-experiment or anonymity adjustment that removes the deference component
in closed and electoral autocracies; or a confidence measure that tracks
`court_compliance` (r at or above 0.5) rather than running against it, which
would show it reads the institution and not the regime.

---

---

## D133 — Brazil's layer publishes the capability map for all nine dimensions

*Recorded 2026-10-01. Extends D130, which published Adaptability alone and
named "a second dimension's map" as a test of the layout.*

**Decision.** `MAP_DIMENSIONS` is every dimension. Each is computed by the
same `buildCapabilityMap`, with no branch per dimension: a dimension with no
conditions (Coordination, Trust, Experimentation and Shared purpose on
dataset 7.4.0) returns an empty `conditions` list, and its page draws no
conditions panel and says in one sentence that none is published. A score
below the coverage floor renders through `DimensionScore` with the observed
count, and thin confidence is read through `isThinEvidence`; no page holds a
threshold.

Navigation. Nine tabs do not fit the layer's band and the tree stops at four
levels (D73, D80), so the layer has one `map` section, labelled Mapa, at
`/brasil/mapa`. That page lists the nine in the model's order with the score,
the confidence, the peer median and above, below or level, each linking to
`/brasil/mapa/<segment>`. The pages under it are not nodes: the Mapa tab owns
them by address prefix, so the band lights Mapa on each. The segment is
`mapSlug` of the pt-BR lexicon's dimension name (Adaptação is `adaptacao`,
Propósito compartilhado `proposito-compartilhado`), so the lexicon is the one
place a name is declared; a test pins the nine segments, so a rename that
would move a published address fails until a redirect is added.
`/brasil/adaptacao` answers 301 to `/brasil/mapa/adaptacao`. The section id
`map.<dimension>` of D130 is retired in favour of `map`.

Artefacts. Each page names the known artefacts that bear on its dimension by
id, linked to `/limits`. The join is one table, `ARTEFACT_SCOPES` in
`packages/core/src/model/artefacts.ts`: an id, the dimensions it touches or
`all` for a structural one (A8, A10), and an optional country scope, which
keeps A2 (India) off Brazil's pages. A test reads the headings of
`docs/KNOWN-ARTEFACTS.md` and fails when the table and the document disagree.
The map carries the result as `artefacts`, so a page holds no id.

Hand-written facts. D130's long-term unemployment caveat said Brazil's
ILOSTAT value comes from PNAD Contínua, which the published output does not
carry (the pinned observation note does). It is the only one. The construct
caveat is now country-neutral and the Brazil sentence moved to
`capabilityMap.countryRowFacts`, keyed by iso3 and row, with a comment naming
D120 as the decision whose supersession makes it stale. No other
hand-written fact about Brazil was added: every number on the nine pages is
computed.

On dataset 7.4.0, against the 10 income peers of D130 (every peer scored on
every dimension), Brazil reads above the peer median on Anticipation (45.8
against 42.7, confidence 0.455), Agency (55.8 against 53.9, 0.555),
Coordination (86.4 against 68.6, 0.373, thin), Trust (55.9 against 53.2,
0.396, thin) and Experimentation (25.6 against 14.4, 0.430, thin), and below
it on Learning (28.0 against 35.8, 0.539), Adaptability (65.4 against 70.3,
0.678), Building (28.2 against 40.1, 0.568) and Shared purpose (30.7 against
44.3, 0.433, thin). No dimension is below the coverage floor. These are
findings, recorded to date the release; the pages compute them.

**Why.** The owner's framing for the phase is to use the instrument: thin
dimensions are published findings to read and argue with. One map was a
demonstration; nine is the instrument, and holding eight back would make
Adaptability look like a chosen exhibit. D130 already made the function
dimension-agnostic, so this is a navigation and copy change, not a model
change. One section with an index keeps the four-level tree and gives the
reader a single place where all nine sit side by side, in a fixed order that
is not a ranking. Slugs from the lexicon avoid a second list of names; the
pin keeps that from breaking links silently. Artefact ids in a table rather
than in page prose mean a new artefact, or a dimension it touches, is one
line and is checked against the document.

**Cost.** Four of the nine pages read thin evidence, and Coordination's
above-median reading rests on 0.373 confidence and three rows (A3, A9, A12):
a reader can quote it as a finding. The pages say thin plainly and name the
artefacts, which is the mitigation and not a fix. The index puts nine
above-or-below words in one column, which invites counting them: five above
and four below is not a verdict on Brazil, and the page says the capabilities
do not add up. `Confiança` is both the Trust dimension and the confidence
label in Portuguese, so the Trust page carries the same word twice in
different senses. The artefact pages are English. The slug of a dimension
now depends on lexicon copy.

**Overturned by.** A reader reading the index as a scorecard (counting
above and below as a result), which would drop the position column from the
index and leave it on each page; a lexicon rename the redirect table cannot
absorb; or a second country layer, which would move the map index to the
ground layer as D130's clause already anticipates.

---

## D134 — Mexico, Colombia, Chile and Argentina get Spanish layers with the computed sections

*Recorded 2026-10-01. Supersedes the sentence "Brazil is the first and today
the only layer" in D69, and answers the second-layer clause of D130 and D133
for these four countries.*

**Decision.** The owner set the phase as using the instrument, and chose four
Spanish-speaking countries to receive a layer each, like Brazil's: Mexico at
`/mexico`, Colombia at `/colombia`, Chile at `/chile` and Argentina at
`/argentina`. Each holds three things and nothing else: an overview, the agenda
at `/<slug>/agenda` and the capability map at `/<slug>/mapa` with nine pages
under it. All four read one lexicon, `packages/core/src/i18n/es.ts`, in
neutral Latin American Spanish.

The four are entries in `COUNTRY_LAYERS`, not folders. One dynamic `[layer]`
route serves every layer without a folder of its own; Brazil's static
`/brasil` folder wins over it and is unchanged, and any other first segment
answers 404. The map pages of every layer, Brazil's included, render one
shared component through the layer's lexicon and `LAYER_WORDS`, so Brazil's
nine map pages and the Spanish ones cannot diverge in structure.

What the Spanish layers do not hold, and why:

- No institutions section. `data/institutions` has Brazil alone, and
  `INSTITUTION_MAPS` stays `['BRA']`.
- No subnational section. No subnational data exists for the four.
- No support page. `/brasil/apoie` names Brazilian funding venues; the
  ground-layer `/support` is the comparative page, and a Spanish one would be
  a page of claims the project has not done the work for (D71, D78).
- No hand-written overview. Brazil's overview is prose about Brazil. The
  Spanish overview states nothing the published files do not: the nine scores
  with the confidence beside each, in the model's order, links to the map and
  the agenda, and the known artefacts that bear on the country's dimensions,
  by id, from `ARTEFACT_SCOPES`. No sentence on it is a claim about the
  country.

Terms. The confidence number is "solidez de la evidencia", "solidez" for
short, because "confianza" is the Trust dimension; the pt-BR copy made the
same move to "solidez da evidência". The score is "puntuación" throughout,
never "nota". Two dimension names are chosen for a Spanish reader rather than
copied: Agency is "Iniciativa", because "agencia" reads as an organisation,
and Building is "Ejecución", because "construcción" reads as the construction
sector. The nine map segments are `mapSlug` of the Spanish names
(`anticipacion`, `iniciativa`, `coordinacion`, `confianza`, `aprendizaje`,
`experimentacion`, `adaptacion`, `ejecucion`, `proposito-compartido`), pinned
by a test in `es.test.ts`. Numbers format as `es-419`.

Rendering. A lexicon may now name the countries it is written for
(`Lexicon.layerCountries`). `pnpm bench agenda` renders `{ISO3}.es.md` for the
four only, and `bench institutions` writes no Spanish feed for Brazil. The
viewer checks at load that the lexicon's list and the Spanish entries in
`COUNTRY_LAYERS` name the same countries. Portuguese keeps rendering every
country, which is the D69 cost this does not reopen. The feed reads the
Spanish agendas through `agendaHrefInLanguage`, which already gates on the
layer, and the sitemap lists every new page from the registry.

Hand-written facts. Two, both in `capabilityMap.countryRowFacts` against D120,
on the long-term unemployment row: Argentina's ILOSTAT series is the urban-only
Encuesta Permanente de Hogares and the ILO flags the value unreliable, and
Mexico's series fails the plausibility gate in every year, so the row is
empty. The published output carries neither the survey name nor the reason a
value is missing. Colombia and Chile get none: both are labour force surveys
that pass the gate.

On dataset 7.5.0 against the 10 income peers each (every peer scored on every
dimension): Mexico reads above the peer median on seven dimensions and below
on Coordination (67.8 against 69.6, 0.373, thin) and Trust (44.5 against
60.1, 0.387, thin). Colombia reads above on Anticipation, Agency,
Experimentation and Shared purpose and below on the other five. Chile reads
above on six and below on Trust (66.7 against 67.4), Adaptability (64.9
against 71.0) and Building (32.3 against 37.2). Argentina reads below the
peer median on all nine. Peers: Mexico THA BRA DOM CHN COL PRY ARG CRI PER
CHL; Colombia BRA PRY MEX PER THA VNM IDN DOM ECU CHN; Chile URY CRI ARG MYS
TUR PAN CHN DOM EST THA; Argentina CRI CHL CHN DOM URY THA MEX MYS TUR PAN.
These are findings that date the release; the pages compute them.

**Why.** D69 grew a layer only where country-specific work was done, and
argued that its existence was evidence of the work. D130 and D133 made the
capability map a computed reading that needs no country-specific work: the
same call, a lexicon and a peer rule. A layer that holds only computed
sections is the instrument used, which is the phase the owner set. Keeping
the overview computed keeps D69's argument honest: the Spanish layers claim
nothing a reader cannot recompute, and where the project has done no work
(institutions, states, funding) they publish no page. One route from the
registry means a fifth layer is one entry and a lexicon, never a copied
folder that drifts.

**Cost.** The Spanish layers are thinner than Brazil's and look like it: an
overview of nine rows is not what `/brasil` is. One neutral Spanish is not
the Spanish of any of the four, and `es-419` prints decimals with a point,
which Argentina, Chile and Colombia write with a comma. Argentina reads below
its peer median on all nine dimensions, and a column of nine "below" invites
the scorecard reading D133's overturn clause names. The ground-layer map
index D130 and D133 anticipated for a second layer is not built: five
countries have a map and 48 do not, and the map stays reachable only through
a layer. The artefact pages, method, glossary and limits stay English, as for
Brazil. "Iniciativa" and "Ejecución" diverge from the English names, so a
reader moving between layers meets two words for one capability.

**Overturned by.** A Spanish reader showing that a sentence on these pages
reads as advice or as a claim about the country the data does not carry;
the four layers' sections staying identical to each other through the next
releases while Brazil's grow, which would show D69 was right that a layer
without country work is a translation, and would move the map to the ground
layer for every country with the layers as readings of it; or a reader in
one of the four countries finding the neutral Spanish wrong enough to need a
national lexicon.

---

## D135 — The evidence corpus is complete when every grid cell is closed, and a cell can close without a record

*Recorded 2026-10-01. Extends D33 and D76.*

**Decision.** "Exhaustive" evidence research has one meaning: every cell of a
grid of the 53 registry countries against the declared gaps a delivery can
evidence is closed. The columns are `EVIDENCE_GRID_INDICATORS` in
`packages/core/src/model/research.ts`: large project delivery, institutional
responsiveness, disaster preparedness, public-private collaboration,
university-industry collaboration, government foresight, regulatory sandbox
activity and adult learning participation, 424 cells. A cell closes with an
evidence record, or with a no-case note in `data/evidence/searched.json`:
the date, the candidate lists searched, and each candidate with the first
inclusion test it failed. A record always outranks a note.
`buildEvidenceGrid` in `packages/core/src/pipeline/research.ts` derives the
grid, the D76 inventory carries it and drops closed cells from its queue,
and `pnpm bench validate` prints it on every run. The validator errors when
a column stops being a declared gap and warns when a record has made a note
stale.

**Why.** The corpus could only grow, never finish. D76's slot queue listed
every uncovered country-gap pair, about 900 of them, including survey
constructs a delivery cannot evidence, and a slot only left the queue when a
record filled it. A country with no sandbox or no foresight unit would stay
open forever, and the queue would keep sending research to it, which is the
pressure that turns a weak case into a record. A dated note makes the
negative result a finding that can be checked and repeated. The first run
of the check found that `civic_participation` had already been moved to a
measured row from the Joint EVS/WVS release, which is why it is not a
column.

**Cost.** A no-case note is only as good as the lists searched. A
researcher who searches a thin list closes a cell too early, and the grid
then reads as complete when it is not. The column set is judgment: adult
learning participation and university-industry collaboration sit close to
survey and dataset constructs, and records against them are often one step
from the indicator's definition. The grid counts closure, not quality, so a
cell closed by a weak record looks the same as one closed by a strong one.

**Overturned by.** Notes that a later search with the same lists overturns
at a high rate, which would show the notes are closing cells on thin
searches and need a second researcher; or a comparable series for any
column, which promotes the gap under D20 and removes the column.

---

## D136 — Every country gets the capability map in the ground layer, and the layers' maps become readings of it

*Recorded 2026-10-01. Answers the overturn clauses of D130 ("would move the
page to the ground layer with the layer as one reading of it") and D133 ("a
second country layer, which would move the map index to the ground layer"),
and the cost D134 recorded: five countries had a map and 48 did not. Replaces
the per-lexicon `countryRowFacts` of D133 and D134.*

**Decision.** The ground layer publishes the capability map for all 53
countries, in English: `/country/<ISO3>/map`, the index of nine capabilities
with the score and the confidence as two numbers and the position against the
income-peer median, and `/country/<ISO3>/map/<dimension>`, one page per
capability. The segment is the dimension id, the one `/capabilities/<id>`
uses, so the English addresses depend on the registry and not on lexicon
copy. Both pages render the same two components the layers render,
`CapabilityMapIndex` and `CapabilityMapDimension`, through `EN`. What used to
be a layer argument is now a `MapReading` (`apps/web/src/lib/map-reading.ts`):
the iso3, the language, the addresses the pages link between and the
decisions they cite. `groundMapReading` and `layerMapReading` build the two
kinds, so a layer's map and the English one cannot diverge in structure and
the layers' pages render as before.

Navigation. The map is one page of the English reading, labelled Map, after
Agenda, in the order a layer holds its sections. The nine capability pages are
owned by the prefix, as `/brasil/mapa` owns its nine, so the tree stays at four
levels: Countries, the country, the reading where a layer exists, then Map. On
a map page of a country with a layer, the crumb that offers both readings
points the other reading at the same page there (`mapCounterparts`), so
switching language keeps the reader on the capability; elsewhere the crumb is
unchanged. Peer flags on the field chart link to the peer's profile, as they
do in the layers.

Hand-written facts. The layers carried three sentences about one country's
long-term unemployment row (Brazil's PNAD Contínua, Argentina's urban EPH and
ILO flag, Mexico's empty row), each written per language. The ground layer
shows such facts, so they move to one keyed table, `COUNTRY_ROW_FACTS` in
`packages/core/src/model/row-facts.ts`, read by every reading: a country, a
row, a kind, the survey's own name where the kind needs it, and the decisions
it rests on. A lexicon holds one template per kind
(`capabilityMap.rowFacts`), never a sentence per country; the gate's floor in
the Mexican sentence is read from `LTU_GATE`. `buildCapabilityMap` carries the
country's facts as `facts`. On a ground layer that reads every country, a fact
shown for a country with a layer and withheld from another with the same fact
would be a selection, so the table holds every country the pinned ILOSTAT
release says it about: household surveys for Brazil, Honduras and Paraguay;
a household survey the ILO flags unreliable for Kenya; an urban-only survey
the ILO flags for Argentina; an ILO unreliable flag for the United Arab
Emirates, Finland and France; and no year passing the D120 gate for South
Korea, Mexico, Peru, the Philippines, El Salvador and Uruguay. 14 entries. A
test reads `data/observations/ilostat-ltu.json` and fails when a survey or a
flag in the file and the table disagree, and another pins the Portuguese and
Spanish sentences as they were, so the layers' text is unchanged.

Deriving these from the published data was considered and declined for now.
`data/out` does not carry the observation note: the survey and the flag would
need a new published field (a dataset minor, a rescore and a schema change),
and the gate's held countries are in no observation at all, so the empty-row
fact would also need the adapter to publish its drops, which means a re-fetch.

Degradation, on dataset 7.5.0. Cuba and Venezuela have no GDP per capita in
`diagnostics.income`, so their maps form no peer set: every position reads "no
comparison", and the pages say in one sentence why (`capabilityMap.noIncome`,
new in all three lexicons). Cuba is below the coverage floor on Anticipation,
Agency, Coordination, Trust and Shared purpose, Haiti on Shared purpose; those
pages render through `DimensionScore` with the observed count. Rwanda's and
Ethiopia's medians on two dimensions rest on nine scored peers of 10. Every
other map has 10 scored peers. Argentina is the one country below the peer
median on all nine; no country is above on all nine.

The English lexicon now gives six names an article inside a sentence ("the
United States", "the Netherlands", "the United Kingdom", "the United Arab
Emirates", "the Philippines", "the Dominican Republic"), which the map's
headings need and the English agenda already lacked; the six English agenda
documents are re-rendered. No published field is added, so the dataset stays
7.5.0. App 1.22.0.

**Why.** The owner's phase is to use the instrument, and the instrument was
reachable only through five layers. D130 and D133 made the map a computed
reading that needs no country work, and D134's overturn clause names exactly
this move: the map belongs to the ground layer for every country, with the
layers as readings of it. WHY.md asks whether capability is separable from
wealth; a reading per country against the countries at the same income is the
form of that question one country's reader can check, and it should be
checkable for any of the 53, not for the five with a language of their own.
The ground layer is English because it is the benchmark itself, not a
translation of it (D69). Dimension ids rather than English slugs keep one
address convention across `/capabilities` and the map. One fact table with
templates is the smallest change that stops three languages carrying three
copies of country prose that drift apart.

**Cost.** 530 new pages, each a reading a reader can quote: nine above or
below words per country, and for some countries (Argentina among them) a
column that invites the scorecard reading D133 names. The index keeps the
mitigations the layers have (no verdict colour, no counts, the note that the
capabilities do not add up); it is not a fix. The fact table is still
hand-kept: a re-fetch that moves a held country out of the gate is not caught
by the test, only a moved survey or flag is. The map for Cuba and Venezuela is
a table of scores without the comparison that defines the page. The crumb
switch lands on the matching page only for the map; the agenda still switches
to the other reading's front page. Five tabs on Brazil's English reading wrap
to a second line at phone width.

**Overturned by.** A reader treating the English index as a scorecard (a
ranking of a country's capabilities or a count of above and below quoted as a
result), which would drop the position column from every index, layers
included; a published field carrying the survey and the gate's drops, which
would retire `COUNTRY_ROW_FACTS` in favour of the data; or the fact table
growing past one indicator, which would show the facts are a data problem and
move them into the adapter's output.

## D137 — The one-factor test is computed and published every release

*Recorded 2026-10-01. Puts in the data the test docs/WHY.md names first under
what would show the idea was wrong: "the nine dimensions collapse into one
factor across a wide country set, with no information beyond income per
head." Until now it was computed by hand, once, on a different basis.*

**Decision.** `diagnostics.factorStructure` publishes, on every
`bench diagnose`, a principal-component reading of the nine dimension scores:

- The correlation matrix of the published dimension scores (`score`, never
  `blendedScore`, so the panel cannot enter) over the **complete cases**:
  countries with all nine scored. Every dropped country is named with the
  dimensions it lacks. Pairwise correlations over different country sets were
  rejected because the result need not be a correlation matrix of anything and
  its eigenvalues can go negative. Nothing is imputed (the rule since D45).
- If complete cases fall below `FACTOR_MIN_COUNTRIES` (30), the same
  solution is also computed on the dimensions scored for at least
  `FACTOR_NEAR_FULL_COVERAGE` (90%) of countries, and the page names them. A
  one-line reading quotes that fallback only then.
- Eigenvalues by cyclic Jacobi rotation in `pipeline/stats.ts`, no new
  dependency. The **first-factor share** is the largest eigenvalue over the
  number of dimensions. Loadings are the eigenvector times the root of its
  eigenvalue (each dimension's correlation with the factor), signed so they
  sum positive.
- The first factor's country scores (standardised scores times the unit
  eigenvector) correlated with log GDP per capita, with its n, and r squared
  as the share of the factor income accounts for.
- A **chance level**: the first-factor share of `n` by `p` independent
  standard normal draws, 2000 samples, seed 20261001, mean and 95th
  percentile. At n 51 and nine dimensions chance alone gives about 0.19, so
  a share is never read against 1/9.
- Reading: at an absolute r of 0.8 or more with income, every surface says
  the shared factor looks like income; from 0.5 it says income accounts for
  part of it; below, that it is mostly something else
  (`FACTOR_INCOME_BANDS`). The sentences are templates over the numbers in
  `apps/web/src/lib/factor.ts` and `report.ts`, never fixed prose.

The release history is `data/out/factor-history.json`, written by `bench
diagnose` from git: for every `Dataset X.Y.Z` changelog release, the last
commit whose `data/out/index.json` carried that version, run through the same
function. Income comes from that commit's diagnostics (D130 on) or, before
that, from the GDP context series in its `worldbank.json`. Past output is
read as published rather than rescored, because the question is what each
release said. The current release comes from the run itself. Without git the
committed file is kept. It sits in `data/out`, not `data/research`, because
the viewer reads it and `data/research` holds the evidence corpus.

On dataset 7.6.0: 51 complete cases (Cuba, Haiti dropped), share 0.529
against chance 0.189 (95th 0.215); the factor correlates 0.86 with log GDP
per capita (n 50), r squared 0.74. The shared factor looks like income, and
the page says so. History: 0.604 at 6.2.0 and 0.498 at 7.0.0, both on 33
complete cases, when the stock rows left the scores (D122). The hand figure
quoted before (0.62 to 0.50) was on eight dimensions with Trust left out and
46 countries; this rule replaces it.

**Why.** It is the test the project names as the one that would show it is
wrong, and a test computed once by hand cannot fail in public.

**Cost.** A principal-component share is one summary of a 9 by 9 matrix: it
says how much moves together, not what the remaining variation is worth. At
51 countries a share or an r moves by several hundredths on a handful of
countries (A8). The chance level assumes Gaussian independent dimensions;
bounded 0 to 100 scores are not Gaussian, and the baseline is a reference,
not a significance test. Complete cases drop the least-measured countries,
which are not a random sample. The 0.8 and 0.5 reading bands are judgment.

**Overturned by.** A country set wide enough that the factor's r with income
can be estimated within a few hundredths, which would replace the bands with
a confidence interval; a parallel-analysis or permutation baseline built on
the actual score distributions, if it moves the chance level by more than
0.02; or an imputation rule adopted elsewhere in the model, which would make
complete cases the odd one out.

## D138 — What is left after income is tested in aggregate every release

*Recorded 2026-10-01. Follows D137, which found that the shared factor of the
nine dimensions looks like income. Respects D65 and D68: every number this
decision publishes is an aggregate over countries, and no residual of any one
country reaches a page, a feed or a published file it was not already in.
The reading rules below were written and committed before any of the four
tests was run on the data.*

**Decision.** `diagnostics.residualStructure` publishes, on every
`bench diagnose`, four tests on the wealth residual of D68: each dimension's
score minus the score its income predicts, from the same per-dimension
ordinary least squares on log10 GDP per capita over every country scored on
that dimension (unrounded, `linearFit` in `pipeline/stats.ts`). Tests (a),
(b) and (d) read the **complete cases**: countries with all nine residuals.
Nothing is imputed. Each test is built so that it can fail, and pure noise
around income reads as no structure.

- **(a) Is there structure left after income?** The correlation matrix of
  the nine residual columns over the complete cases, its eigenvalues and the
  first factor's loadings. The first-factor share is read against the D137
  chance level (`firstFactorChance`, 2000 draws, seed 20261001) at one fewer
  country, because the income fit uses up a degree of freedom. A
  within-dimension permutation baseline (each residual column shuffled across
  countries on its own, 2000 draws, seed 20261002) is published beside it as
  the check D137 named. *Reading:* a share above the chance 95th percentile
  reads **structure** (what is left after income moves together, so it is not
  independent noise around the income line); at or below it reads **none**.
- **(b) Same income, different shape.** Each residual column is divided by
  its standard deviation so every dimension counts the same. A country's
  **shape** is its nine standardised residuals minus their own mean, so a
  country above its income line everywhere has a level, not a shape. Its peer
  distance is the mean, over its `MAP_PEER_COUNT` (10) nearest complete-case
  countries in log GDP per capita (`incomePeers`), of the root mean square
  difference between the two shapes. The null shuffles each standardised
  residual column across countries (2000 draws, seed 20261003): every
  dimension keeps its spread, every country keeps its income peers, and any
  link between a country's nine residuals is broken. In plain words, it is
  what peer distances look like if the residuals were dealt out at random,
  with no country-specific shape. Published: the median observed peer
  distance with the null median and its 5th and 95th percentiles, and the
  share of countries whose peer distance exceeds the 95th percentile of their
  own null, with that share's own null mean and 95th percentile. No country
  is named. *Reading:* a median below the null 5th percentile reads
  **alike** (income peers share a shape, so income predicts shape); otherwise
  a share above its null 95th percentile reads **differ** (more countries sit
  far from their peers than random dealing produces); otherwise **noise**
  (peers differ by the amount chance gives).
- **(c) Is it stable?** From git, the same releases `factor-history.json`
  reads (D137), the residual of each dimension at each release from that
  release's published scores and income. For every pair of consecutive
  releases with the same country set, and for every dimension whose residuals
  moved by at least 0.05 points for some country between the two, the
  Spearman correlation of the residual order over the countries in both.
  Published per dimension: pairs compared, mean and minimum. *Reading:*
  every tested dimension's minimum at or above 0.8 reads **stable**; any
  tested dimension's minimum below 0.5 reads **churning** (that dimension's
  residual order follows indicator choice rather than countries, and the
  pages say so); otherwise **mixed**; no moved pair reads **untested**.
  Leave-one-out on the current release, per dimension: the largest change in
  the slope when one country is dropped, in standard errors of the slope,
  and the largest change in a dropped country's own residual (its residual
  against the line fitted without it), in residual standard deviations.
  *Reading:* any dimension above 1 residual standard deviation reads
  **fragile**, the condition D68 named as making the full-set fit wrong;
  otherwise **robust**.
- **(d) How much of a profile is income?** For each complete-case country,
  one minus the sum of its nine squared residuals over the sum of its nine
  squared deviations from each dimension's mean: the share of how far its
  profile sits from the average profile that its income line accounts for.
  Published: the mean (the headline), the median and the pooled share. A
  country's share can be negative when its income line points the wrong way.
  *Reading:* a mean of 0.5 or more reads **most**; 0.25 or more reads
  **part**; below reads **little**.

**What the four mean for the claim.** The strong claim, that capability is
separate from wealth, is read from D137's band alone. The weaker claim, that
countries at the same income have different capability shapes, so a profile
carries information beyond income, is read:

- **holds** when (b) reads differ and (c) does not read churning;
- **fails** when (b) reads alike, or when (a) reads none and (b) reads noise;
- **mixed** otherwise.

Every sentence on `/thesis` and `/diagnostics` that states one of these
verdicts is a template chosen by the computed reading in
`apps/web/src/lib/residual.ts`, never fixed prose.

**Amendment to (b), before the first run on data.** The (b) rule above
failed its own synthetic check, before it was run on the benchmark's
scores. On 50 synthetic countries with a planted shape (each country leaning
one way on four dimensions and the other way on five, by its own amount,
independent of income) it read **alike**, because a median of root mean
square distances shrinks when shapes vary along one direction, whatever the
peers. It compared peers with random dealing when the question "do income
peers share a shape?" compares peers with countries chosen without regard to
income. Replaced, still before any run on data:

- The peer distance is the **mean**, over countries, of the mean **squared**
  shape distance to the 10 income peers, per dimension.
- **alike** when that mean falls below the 5th percentile of the same mean
  with every profile kept whole and the incomes dealt out at random (2000
  draws, seed 20261004): income peers are more alike in shape than countries
  picked without regard to income, so income still predicts the shape.
- otherwise **differ** when the first-factor share of the **shape columns**
  (the standardised residuals minus each country's own mean) exceeds the 95th
  percentile of the same share with each residual column dealt out at random
  before the shapes are taken (2000 draws, seed 20261003): shapes line up
  along shared contrasts that random dealing does not produce, and since
  peers are not more alike than anyone, countries at the same income spread
  along them.
- otherwise **noise**.
- Published but not read: the peer distance against the random-dealing noise
  floor, and the share of countries whose peer distance clears the 95th
  percentile of their own noise floor (one in twenty by construction).

The synthetic checks in `residual-structure.test.ts` now hold the rule to
four cases: pure noise around income reads none and noise; a planted shape
reads structure and differ; a level shared by all nine reads structure and
noise, so the weaker claim reads mixed; a shape that income dictates through
a curve a straight line cannot remove reads alike. The rest of the decision
is unchanged.

**Results.** *Written after the first run on data, dataset 7.7.0; the
rules above were not edited after it.*

50 complete cases (Cuba and Haiti lack a dimension, Venezuela an income
figure).

- (a) **structure.** The residuals' first factor carries 0.279 against a
  chance level of 0.191 (95th 0.217); the permutation baseline agrees (0.190,
  95th 0.215), so D137's Gaussian chance level holds within 0.002 here.
  Loadings: Anticipation 0.84, Learning 0.70, Coordination 0.67, Trust 0.63,
  Shared purpose 0.61, Agency 0.27, and near zero on Experimentation,
  Adaptability and Building. What is left after income is not independent
  noise: a country above its line on the institutional dimensions tends to be
  above it on the others of that group.
- (b) **differ.** Mean peer distance 1.559 against 1.538 with incomes dealt
  at random (5th 1.464, 95th 1.605): income peers are no more alike in shape
  than anyone. The shape columns' first-factor share is 0.264 against 0.204
  under random dealing (95th 0.232). Descriptive: the peer distance sits below
  the random-dealing floor (1.780, 5th 1.682), because part of what is left
  is a shared level; 6% of countries clear their own 95th against 5% by
  construction.
- (c) **mixed** between releases: 22 releases, 19 consecutive pairs on the
  same 53 countries, 23 dimension comparisons where a residual moved. Lowest
  Spearman 0.718 on Trust (n 36), then Coordination 0.740 (n 44), Shared
  purpose 0.759, Adaptability 0.777 and Agency 0.780; Building 0.984 and
  Experimentation 0.912 hold. None below 0.5. **robust** without one
  country: the largest own-residual shift is 0.249 residual SD (Agency), the
  largest slope shift 0.66 standard errors (Trust). D68's leave-one-out
  overturn condition is not met.
- (d) **part.** Mean 0.306, median 0.443, pooled 0.392.

The weaker claim reads **holds**. The strong claim reads, from D137, that
what the nine share is mostly income.

**Why.** D137 settled the strong claim against the benchmark for the shared
factor. If the project is to keep saying a capability profile is worth
reading, the claim it can still make has to be tested in public, with rules
that could have said no. Fixing the rules first, and committing them, is
what makes a "holds" mean something.

**Cost.** (b) reads "differ" on a narrow margin (0.264 against 0.232) at 50
countries, and A8 applies to every figure: a handful of countries could move
it across the line. The (b) rule was amended once, after a synthetic check and
before any run on data; the amendment and its reason are above. Standardising
each residual by its spread gives a thin dimension the same weight as a well
measured one. The release test reads past releases as published, so pairs
where only one or two dimensions moved carry most of it, and the 0.8 and 0.5
bands are judgment. Complete cases drop the least measured countries. The
within-column nulls assume countries are exchangeable once income is out,
which neighbours, regions and shared data sources violate. No test here can
separate a real country-specific shape from measurement error that happens to
be shared across a country's indicators, for example one national statistics
office feeding several rows; only indicators from independent sources, or a
measurement-noise model per row, could.

**Overturned by.** A release where (b) reads alike or noise, which flips the
weaker claim to fails or mixed on every surface without an edit; a churning
release reading on any dimension; a measurement-noise floor built from
indicator uncertainty that puts the shape share inside it; or a wider country
set on which the margin in (b) can be estimated within a few hundredths.

## D139 — A panel figure is compared with the indicators only on the dataset it was scored on

*Recorded 2026-10-02. Resolves #41.*

**Decision.** No artefact, page or report compares a Delphi run with indicator
scores unless the run's `datasetVersion` matches the current dataset.
Until then the run is a research note, which is what `isDelphiRunForDataset`
already enforces in scoring: dataset 7.7.1 publishes no `delphiScore` in any
cell. `docs/KNOWN-ARTEFACTS.md` quotes no panel figure, and A1, A2, A5, A7 and
A9 lose the panel evidence they used to cite.

**Why.** The run `data/delphi/latest.json` points at is the 2026-08-26
in-session run: one panelist, 16 countries, no dataset version, scored
against a frame that still held the perception rows D23 retired. Its
estimates were anchored on those scores, so on Coordination its upward
corrections (Uruguay 18.8 to 45, Brazil 15.5 to 35, Colombia 4.3 to 18) read
as downward gaps against today's scores, and the 35.6 point mean gap #41 asked
about measures the change of ruler. Rank agreement, which the anchor does not
move, is 0.70 on Coordination, mid-pack of the nine.

**Cost.** The artefacts lose an independent second opinion until a reviewed
panel exists, and A7 had no other evidence for Korea and Estonia reading low:
it now rests on the indicator rows alone and was retitled.

**Overturned by.** A reviewed gateway panel scored against the current dataset
version (#33), which makes the comparison readable again.

---

## D140 — Trust in strangers is scored in Trust as the share trusting a first-time acquaintance completely or somewhat (G007_34_B)

*Recorded 2026-10-02. Extends D64's adapter under D117 and D118, beside D127
and D128. Closes #63. Answers Q6 of the O1 triage sweep.*

**Decision.** `willingness_to_cooperate_strangers` (Trust, social family)
moves from `gap` to `adapter`. It is read from G007_34_B, "trust: people you
meet for the first time", in the same pinned Joint EVS/WVS results PDF
(release 5.0.0), by the same item table, country mapping and hold rule as
D127 and D128. Class `P`, `higher_better`, unit `% expressing trust`. The
definition narrows from "trust in people met for the first time and in people
of another nationality" to the first-time item alone. G007_36_B (another
nationality) is not averaged in: one item per row, as D128 did for
membership, and it reads attitudes to foreigners as much as trust.

The value is the sum of two published columns, trust completely plus trust
somewhat, over all respondents including don't know and no answer. This is a
narrow exception to the adapter's rule that a stored value is a number the
publisher prints. It applies to this item only. The note on every
observation quotes both addends and every other published share, so the sum
can be checked against the table by hand.

**Why.** Construct first, in
`docs/research/shared-purpose/EVS-WVS-BEHAVIOURAL-ITEMS.md`, written before
values were read. Trust asks how far cooperation reaches beyond a person's
own network. A165 asks about "most people", which a respondent can fill with
their own circle; this item names the stranger. EVS 2017 and WVS 7 ask it in
one wording on one four-point scale, and inside the dual-programme pairs the
WVS share is a median 2.2 points higher, against a 66 point spread.

Why the sum. The scale has four points and the trust and distrust halves
split at its natural midpoint, so the cut is not chosen the way a 7 to 10 cut
on a ten-point scale would be. Both columns share one denominator, so the sum
is exact to the rounding of the printed figures, within about 0.1. That is
what separates it from the A173 refusal, where the publisher printed a mean
and a top-box share would have been a chosen cut on a ten-point scale. The
single printed column "trust completely" has no usable spread (0.1 to 9.5).
The other printed column, "do not trust at all", would keep the rule but
reads closer to A165 (r -0.79 against 0.66 for the sum) and flips the
registry's unit and direction. The sum matches the unit the registry
declared.

Reported as findings (D118), same run: 37 of 53 countries, fieldwork 2017 to
2023, range 7.8 (Ecuador) to 73.9 (Sweden); Brazil 22.7, 22nd of 37. The row
correlates with log GDP per capita at r = 0.34 (n 36), with A165 at 0.66,
under the 0.85 redundancy flag, and no redundant pair forms. Autocracies do
not inflate it: closed 22.2, electoral autocracies 23.7, electoral
democracies 21.5, liberal democracies 40.4. Trust's mean confidence moves from
0.347 to 0.418, which clears O1, its observed rows from 3.6 to 4.3, and its
r with log GDP from 0.675 to 0.606 (n 51). Scored countries stay at 52,
because no country is added. The social family now has both its rows
observed. The guardrail, mean confidence across dimensions against log GDP
per capita, moves from 0.298 to 0.278 (n 51). The one-factor share (D137)
moves from 0.531 to 0.523, its correlation with income from 0.858 to 0.854,
and Trust's loading from 0.804 to 0.760. Every D138 reading is unchanged:
structure, peers differ, stability mixed, leave-one-out robust, income
explains part, the weak claim holds. The largest Trust moves are falls where
"most people" read high and a stranger reads low: Japan 79.4 to 64.3,
Singapore 84.6 to 70.8, South Korea 80.8 to 67.6, China 67.6 to 55.8 (20th to
28th of 52) and Malaysia 68.2 to 56.7. Ethiopia rises 41.9 to 45.6 (46th to
36th) and Sweden 87.9 to 90.3. Brazil moves from 55.9 to 49.3.

**Cost.** The rule that a stored value is printed by the publisher now has an
exception, and an exception invites a second. A summed value carries the
rounding of two cells instead of one. It is a perception, class `P`, the same
class and source as A165, so the social family is still two survey items from
one release and no behaviour. The 13 countries outside the release and the
three held (DEU, GBR, NLD) keep three Trust rows where the 37 now have five,
so Trust's confidence gap between them widens. Ethiopia's 47.8 (fifth of 37,
fieldwork 2020) is the value to check first. The EVS countries in the frame
are all European and average twice the WVS ones, which is region and cannot
be separated from format in the aggregate table.

**Overturned by.** A published single column or mean for G007_34_B in a later
release, which would replace the sum and close the exception; microdata
showing the EVS-WVS difference reorders the frame once fieldwork year is
controlled; or a fieldwork review showing the Ethiopia sample, or any other
outlier, is not national, which would hold that country's value.

---

## D141 — Vocational share, labour force participation and transmission losses move to the conditions layer

*Recorded 2026-10-02. Extends D122 to three of its six Tier B rows. Issue
#68. Dataset 8.0.0. Memo: `docs/research/CONDITIONS-AUDIT.md` and the Q3
section of `docs/research/anticipation/O1-CANDIDATES.md`.*

**Decision.** Three scored rows take `role: 'condition'` and are published
beside their dimension under D122, unscored: `vocational_secondary_share`
beside Learning, and `labor_force_participation` and
`electricity_transmission_losses` beside Adaptability. Each keeps its World
Bank route, is fetched on every ingest and is published with its value, year
and rank among the countries that have it. D122 let a Tier B row move only
on its own decision and only once its dimension had a capability row to take
its place. This entry is that decision for the three, one paragraph each,
and the replacements are already scored.

**Vocational share of secondary enrolment (Learning).** The share of
secondary pupils on a vocational track describes how a school system is
built, not what anyone learns in it, and the registry's own note said higher
is not unambiguously better. It was the row that pulled Korea and Japan down
in A7. Its latest year is 2019. Learning now reads the Human Capital Index,
firm training and research citation impact (D124), which is the capability
row D122 asked for. As a condition it correlates with log GDP per capita at
0.26 (n 51) and with the new Learning score at 0.28 (n 52).

**Labour force participation (Adaptability).** How much of the
working-age population is in the labour force is a level set by norms,
schooling and age structure. Its note called it "how much of the population
can be reallocated at all", which is a description of what the economy has
to move, not of it moving, and participation norms confounded it for India
in particular. Adaptability reads reallocation through long-term
unemployment (D120) and the breadth of the export basket (D119), beside the
unemployment rate. As a condition it correlates with log GDP per capita at
0.575 (n 51) and with the new Adaptability score at 0.23 (n 53).

**Electricity transmission losses (Adaptability).** The state of the grid,
and whether the operator can bill what it delivers, is infrastructure a
country has to change with, which is the reason D122 gave for moving
broadband. It now sits beside broadband in the same layer. It correlates with
log GDP per capita at 0.69 (n 51) and with the new Adaptability score at
0.36 (n 53).

**Why.** Construct, under D118. Each row records what a country has, not
what it does, and each dimension now has scored rows that observe the
capability itself. The correlations below are printed as findings and
decided nothing.

Measured on the 8.0.0 run against 7.8.0, same observations:

| Dimension | Mean confidence | Observed rows (mean) | Scored countries | r log GDP (n 51) |
| --- | --- | --- | --- | --- |
| Learning | 0.496 → 0.513 | 3.89 → 2.89 | 53 → 52 | 0.749 → 0.779 |
| Adaptability | 0.638 → 0.522 | 4.83 → 2.83 | 53 → 53 | 0.738 → 0.456 |

Learning's confidence rises although it loses a row, because the row it
loses was observed at 2019 and the coverage denominator shrinks with it.
Cuba falls to one observed Learning row and publishes no Learning score.
Learning moves most at the top: Singapore 67.7 to 84.2 (seventh to first of
52), the United Arab Emirates 49.9 to 73.6, Canada 58.9 to 76.1 and the
United States 45.5 to 60.7; Bolivia falls 57.2 to 35.9 (14th to 38th) and
Honduras 38.2 to 33.2. Brazil moves from 28.0 to 35.0, 45th to 39th.
Adaptability moves most where unemployment is low and exports are broad:
India 59.5 to 85.4 (44th to tenth), Mexico 69.2 to 88.0 (32nd to sixth), El
Salvador 69.4 to 86.5, Cuba 63.7 to 82.9 and Honduras 43.8 to 70.5;
Switzerland falls 75.3 to 65.3 (20th to 43rd), the United Arab Emirates 74.7
to 68.7 and Nigeria 57.4 to 45.5. Brazil moves from 65.4 to 73.7, 36th to
35th. Across the release, with D142 and D143, the one-factor share (D137)
falls from 0.523 to 0.485 and its correlation with income from 0.854 to
0.845; Adaptability's loading falls from 0.742 to 0.424. The guardrail,
mean confidence across dimensions against log GDP per capita, moves from
0.278 to 0.289 (n 51). Every D138 reading is unchanged: structure, peers
differ, stability mixed, leave-one-out robust, income explains part, the
weak claim holds.

**Cost.** Adaptability's confidence falls by 0.12 and its correlation with
income by 0.28, and the second is not a gain to claim: the rows that left
carried income, and what remains is thinner. Nine countries read
Adaptability on two rows, the unemployment rate and export concentration,
because the ILOSTAT gate holds or lacks their long-term unemployment: South
Korea, India, Mexico, Peru, Uruguay, China, the Philippines, El Salvador and
Haiti. Four of them, Mexico, China, El Salvador and India, are in the top
ten. The unemployment rate's own note calls it blunt, since low unemployment
can mean a rigid labour market as easily as a fluid one, and on two rows it
is half the score. The Brazil adaptability report reads Adaptability without
the grid and the participation level in the score; both remain on the page
as conditions. Published scores move in two dimensions, so this is a major
version under D37 and 7.x numbers are not comparable.

**Overturned by.** A use measure showing that one of the three tracks a
capability rather than a stock, such as grid losses moving with reform
episodes the Adaptability rows also see, which would return that row to the
score by its own decision; or evidence that the unemployment rate on two rows
orders countries by labour-market rigidity rather than reallocation, which
would make the two-row Adaptability scores a known artefact and argue for
holding them until long-term unemployment covers them.

---

## D142 — Business share of R&D is retired: the only working source reads the make-up of a spending stock

*Recorded 2026-10-02. Under D100 and D118. Issue #25. Dataset 8.0.0. Memo:
`docs/research/experimentation/O1-CANDIDATES.md`, candidate 6.*

**Decision.** `business_rd_share` (Experimentation) moves from `gap` to
`ingest: 'retired'`. It stays in the registry and on every country's
indicator list with `status: 'retired'`, its note names the evidence, and it
leaves the coverage denominator under D100. Its source field now names the
dataset that was inspected, OECD MSTI with RICYT, in place of UNESCO UIS,
which stopped publishing the series in March 2023.

**Why.** Construct first. Under D100 a gap says nobody publishes a
comparable series and a retirement says a series exists, was inspected and
measures the wrong thing. This row now fits the second. RICYT's open API
serves R&D by sector of performance for Latin America, Brazil included, and
with OECD MSTI the splice reaches 34 of 53 countries, 33 of them at 2019 or
later. What it reads is the share of a country's R&D spending that business
performs: the composition of a spending stock. D122 already moved R&D
spending itself out of the scores as a condition, and the share of that
stock is a description of the same thing. It is high where business research
is large (Israel 94) and where total research is tiny and one firm dominates
it (Thailand 80 and Vietnam 73 in the UIS archive). State enterprises count
as business, so China and Vietnam read their ownership model, not firms
experimenting. The splice's correlation with log GDP per capita, 0.742 (n
34), and with R&D intensity, about 0.75, are printed as findings; the
retirement does not rest on them, and it does not rest on Experimentation's
O1 shortfall.

Experimentation's denominator falls from nine rows to eight. Its mean
confidence moves from 0.271 to 0.305 with no new observation, and no score
moves. That rise is what D100 does by design, and it is not why the row is
retired: AGENTS.md is explicit that gaps are not removed to make numbers
look better. Experimentation still misses O1.

**Cost.** The benchmark no longer asks for a series it once named as the
next best candidate for Experimentation in A1, and a reader who wants the
corporate side of research has to read the R&D spending condition beside
Anticipation. A version of the share restricted to private enterprises, if a
publisher ever separates them, would be a different series and would need a
new row.

**Overturned by.** A publisher that separates state from private enterprise
in R&D by sector of performance across at least half the frame, which would
remove the ownership confound and reopen the row as a gap; or an argument
that the composition of R&D spending observes firms experimenting rather
than what a country spends, which would make it a condition beside
Anticipation's R&D spending instead.

---

## D143 — National belonging is retired: the only cross-national item reads pride and fails the regime test

*Recorded 2026-10-02. Under D100 and D118. Issue #67. Dataset 8.0.0. Memos:
`docs/research/shared-purpose/O1-CANDIDATES.md`, candidate 2, and
`docs/research/shared-purpose/EVS-WVS-BEHAVIOURAL-ITEMS.md`.*

**Decision.** `national_belonging` (Shared purpose) moves from `gap` to
`ingest: 'retired'`. It stays in the registry and on every country's
indicator list with `status: 'retired'`, with the evidence in its note, and
it leaves the coverage denominator under D100. Its source field names the
item inspected, G006 in the Joint EVS/WVS.

**Why.** Construct first. The row asked for reported pride in and
identification with the national community, and its own note said high
national pride is not the capacity for collective action and must not be
read as such. The Joint EVS/WVS sweep read G006, national pride, the only
cross-national item aimed at it, and it fails A13: electoral autocracies read
75% very proud against 47% in liberal democracies, so scored it would lift
the regimes that cultivate uniformity, which is the failure D121 kept
polarization out of the score for. The other candidate found, ISSP 2023's
closeness-to-country item, is also a perception and covers 16 countries.
Under D100 that is a series inspected and rejected, not a measurement nobody
can make.

Shared purpose's denominator falls from six rows to five. Its mean
confidence moves from 0.343 to 0.411 with no new observation, which clears
O1 on the arithmetic of D100 rather than on evidence. That effect is not the
reason. The case rests on construct: the project does not believe pride is
a capability a behaviour could one day observe under this name, and the
observable acts of a shared project, civic participation (D128), tax revenue
and, as a gap, volunteering, stay. No score moves.

**Cost.** Shared purpose now reads O1 as met while it rests on the same
three rows it had at 7.8.0, and a reader comparing confidence across
releases will see a rise with nothing behind it. A5 says so. The registry no
longer names identification with a national community as part of the
dimension, and a reader who thinks it belongs there has to argue it as a new
row with a behavioural construct.

**Overturned by.** A cross-national item on belonging that is behavioural or
that reads the same in every regime class, for example one that sorts
liberal democracies and autocracies alike, which would reopen the row as a
gap with that item as its candidate; or evidence that `volunteering_rate` and
civic participation cannot carry the dimension without it.

---

## D144 — Customs clearance time is published beside Coordination as a behavioural check

*Recorded 2026-10-02. Under D60 and D118. Issue #66. Dataset 8.0.0. Memo:
`docs/research/coordination/O1-CANDIDATES.md`, recommendation 1 and its
preflight.*

**Decision.** World Bank `IC.CUS.DURS.EX`, the average days to clear direct
exports through customs reported by manufacturing firms that export
directly, in the Enterprise Surveys, is published beside Coordination as
`customs_clearance_time` in `checks.ts`, `lower_better`, unit days, `ingest:
'worldbank'` from World Development Indicators (source 2). It is observed
under `__check__customs_clearance_time` and enters no frame, mean, coverage
count or confidence. The 8.0.0 ingest added 151 country-years and restated
nothing. It covers 50 of 53 countries (no survey for the United Arab
Emirates, Cuba or Haiti), latest 2025.

**Why.** On construct it passes: firms report the time the border took on
their own shipments, which is the cooperation of agencies Coordination asks
about and the current successor to the Doing Business border time frozen at
2019. It passes the A13 regime test as well (China, Vietnam and Singapore sit
in the middle of the frame). It fails two other tests, and those are the
reasons it is a check:

1. **The sample base cannot be verified.** The number of firms behind each
   country's mean, and its standard error, are published only in the
   microdata, behind a registration. On a proxy from the published tables,
   firms surveyed times the weighted share exporting directly, 37 of 53
   countries reach 30 firms. The 12 held, ten of them in Latin America, are
   Panama, Nicaragua, Rwanda, Mexico, Honduras, Israel, Ecuador, Uruguay, the
   Dominican Republic, Bolivia, the Philippines and Paraguay. The proxy itself
   cannot settle the cases near 30, so the recommendation's own gate, 40
   countries, is neither met nor refuted.
2. **The questionnaire broke in 2024.** Rounds fielded from 2024 add an
   all-agency release question, and since July 2025 the publisher drops every
   answer where customs time exceeds it. A country surveyed on both sides
   moves for reasons that are not its border: India 17.3 days in 2022 to 2.5
   in 2025 on more than 9,000 firms each round, France 10.4 to 2.2. No
   benchmark country has two rounds on the new questionnaire, so stability
   within one design cannot be tested.

Its income correlation is printed and is not a reason: -0.12 on the
published value against log GDP per capita (n 50), -0.28 against the
Coordination score, from `behaviouralChecks`. No Coordination score,
confidence or count moves.

**Cost.** D60's mechanism now holds a check kept out on sample and
comparability grounds, alongside the income and construct reasons D60 and
D121 used; the glossary entry says so. A published value outside the score
will be quoted as a finding, including the twelve held countries and the
cross-questionnaire moves, and the attached note is the only guard. The
World Bank API lags the Enterprise Surveys portal, so the check can show an
older round than the portal (Argentina 2017 against a 2026 portal round).

**Overturned by.** Reopened as an indicator question when either holds:
someone with microdata access reads the per-country item base, and 40 or
more countries pass at 30 firms on the real base; or a second round on the
2024 questionnaire lets stability be tested within one design. If it is
reopened, prefer the all-agency measure, which asks about every border
agency and needs a pinned adapter from the Enterprise Surveys portal.
Retired instead if readers treat the check as a score, as D60 provides.

---

## D145 — New public repositories are scored in Experimentation from the GitHub Innovation Graph behind an access gate

*Recorded 2026-10-02. Under D117 and D118, in the pattern of D120 and D124.
Issue #65. Dataset 8.1.0. Memo: `docs/research/experimentation/O1-CANDIDATES.md`,
candidate 1 and recommendation 1. D125 stays held: no GEM extension.*

**Decision.** `new_repositories_per_million` joins Experimentation as a scored
row: class `O`, `higher_better`, tier `academic_survey`, transform
`per_million_population` over `SP.POP.TOTL`, unit "per million people". The
value is the change in GitHub's count of public repositories located in the
country from the latest first quarter a year earlier to the latest first
quarter, read from `data/repositories.csv` in `github/innovationgraph` (CC0).
The adapter `github-innovation-graph-new-repos-v1` runs as `pnpm bench github
fetch`, emits the count, and leaves the division by population to the scorer,
as the patent, trademark and design rows do. The publisher restates its files
in place every quarter and keeps old versions only in git, so the pin is the
commit: `GITHUB_IG_COMMIT` in `model/source-catalog.ts`, here `054c7dbc`
("release q1 2026 data", 2026-07-07), which `/sources` prints as the row's
link. The observation file carries the pin under `github`: repository, full
SHA, path, retrieval date, latest quarter in the file, the window, the gate's
parameters, and every benchmark country's first-quarter stock since 2020, so a
rescore never touches the network. `--commit latest` names the newest commit;
moving the pin is an edit to the constant and a revision run.

Before emitting, an access gate runs on every country and names none. A
country whose stock grew by less than a quarter of the median benchmark
country's growth over the same window is held: it gets no value, never a zero,
and the file records its growth, the threshold and its year-on-year changes
under `held`. On the 2026 Q1 file the median is 24.6% and the threshold 6.2%.
China (down 0.1%, the stock fell in four of six yearly windows) and Cuba (up
2.8%) are held; the next lowest is the United Kingdom at 12.9%. 51 of 53
countries are scored on the row. Brazil adds 3,925,512 repositories, 18,446
per million, 17th of 51, normalized 25.5. Glossary: "Access gate".

**Why.** Construct first, written in the memo before values were read in.
Experimentation asks whether a country makes many cheap attempts and abandons
them freely. A public repository costs nothing to start, needs no fee or
lawyer, and is kept whether or not it is abandoned; a yearly count per head is
the closest open measure of that, of the same kind as trademarks and designs
per million. It is behaviour, the change in a year; the level, developers or
repositories per million, is platform adoption and was rejected in the memo.
It covers every benchmark country at a current date, and its rank order is
stable year to year (Spearman 0.97 to 0.98).

The gate is a rule because the exclusion has to be auditable, as D120's is.
The stock is net of deletions and relocations, so a stock that stalls while
the platform grows by at least 12.9% everywhere else records where developers
can or do host code, not how many projects they start: China's developers
work behind network filtering and on domestic platforms, and Cuba's access to
the platform has been constrained by US trade controls. GitHub's own
trade-controls page now lists its services as generally available in Cuba, so
a sanctions citation alone would not hold the row out; the stalled stock is
the evidence, and a rule on it applies to any country that stalls next.

Reported as findings, not tests (D118), on dataset 8.1.0 against 8.0.0. The
row's normalized value correlates with log GDP per capita at r = 0.701 (log10
of the per-million value 0.815, n 50), and its wealth-attribution delta is
0.080. Experimentation's correlation with log GDP moves from 0.572 to 0.651
(Spearman 0.726 to 0.801, n 51), a finding against the claim in this
dimension. Its mean confidence moves from 0.305 to 0.364, still under O1, and
the bottom quarter from 0.192 to 0.253; 53 countries are scored either way.
The guardrail, mean confidence against log GDP per capita, moves from 0.289
to 0.286 (n 51). The shared factor's share moves from 0.485 to 0.498 and its
correlation with income from 0.845 to 0.847. Under D138 no reading changes:
the residuals still share structure (0.287 against a 95th of 0.217), peers
still differ, release order stays mixed, income is still part of the
distance and the weaker claim holds; Experimentation's residual loading rises
from 0.05 to 0.17. No redundant pair forms. No other dimension's score or
confidence moves.

**Cost.** One platform and public work only: GitLab, Bitbucket, Gitee and
private repositories are invisible, and the publisher is a firm reporting on
its own platform, for which no source tier fits; `academic_survey` is the
nearest. Location is the members' modal IP location, so VPN users are
misplaced and Singapore's 260,665 per million is partly a hub; the upper
Tukey fence caps it at 100, with Estonia next at 89.8. Coursework,
bootcamps and tutorials create repositories and may lift countries with large
student cohorts. The quarter-of-median threshold is judgment, and the gate
reads only the latest window, so a country whose count resumes growing is
scored as soon as one window clears. Held countries carry an unmeasured scored
row: China's and Cuba's Experimentation confidence falls from 0.267 to 0.237,
and their scores rest on the other rows (China 100, Cuba 1.1, unchanged). The
largest score moves are Ireland +14.9, Germany -13.5, Turkey -13.3, the
Netherlands +12.1 and France -12.1; Brazil's score does not move (25.6). The
value is stamped with the closing first quarter's year and divided by the
latest population, which is one year older.

**Overturned by.** Evidence that new repositories track platform adoption
rather than attempts, for example a within-country series in which the count
follows developer sign-ups and not new projects, which would make the row a
behavioural check under D60. A second code-hosting source with frame coverage
that reorders the frame, which would show the row reads one platform's share
of the market. A held country whose count resumes growing past the threshold
for a reason that is not access, or an unheld country falling under it for a
reason that is about capability, either of which would show the gate removes
real values. Or GitHub changing what `repositories` counts or how it locates
one, which needs a new adapter version and a new entry.

## D146 — The foresight register is piloted before it is coded, and the pilot sends the codebook back for revision

*Recorded 2026-10-02. Follows #68. Codebook 1.0 is `2cc0577`, committed before any coding.*

**Decision.** `government_foresight_capacity` stays a declared gap. The
project-coded register of government foresight functions was piloted on ten
countries (HTI, VNM, ARE, NIC, SGP, NGA, BRA, GBR, EST, CHE), drawn across the
four V-Dem regime classes and the income quartiles with a fixed seed and
Brazil fixed, by two independent coders. Codebook 1.1 must settle the eight
ambiguities the pilot found, then the same ten are recoded, before any
decision to code the 53 or to score the row. Pilot:
`docs/research/anticipation/FORESIGHT-REGISTER-PILOT.md` and
`data/research/foresight-register-pilot.json`.

**Why.** I1, established by a named act, reached Krippendorff alpha 0.79
against the 0.80 threshold fixed before coding (0.69 on the six countries
with a function). I4 never fired. Brazil's agreed score of 100 hid a
disagreement over which bodies qualify. The survival rule, any change of the
person holding executive power, did not reward closed regimes: closed
autocracies average 11 and liberal democracies 100, regime rho 0.72, under the
0.80 stop rule. The named-act rule leans towards states that legislate their
foresight bodies, which scores Singapore 67 on documentation rather than
function. Income r 0.69 (n 10) is printed and decided nothing.

**Cost.** A second coding round before any row exists, so Anticipation keeps
two scored rows that track income (r 0.872) at least that long. Both coders
were one model, so their errors are correlated, and even a passing recode
needs a human coder, or a 20 percent human second coding on the frame, before
promotion.

**Overturned by.** A recode under 1.1, with at least one human coder,
reaching alpha of at least 0.80 on every item and on body-by-body decisions,
with no ceiling and regime rho under 0.80, which supports coding the 53 at
tier `expert_panel`. Regime rho at or above 0.80, or eight of ten at one
score after revision, stops the register.

## D147 — Two evidence records leave the corpus with the row they were filed against

*Recorded 2026-10-02. Follows D142, which retired `business_rd_share`.*

**Decision.** `gbr-business-rd-share` and `prt-sifide` are deleted from
`data/evidence/records.json`. Both were filed against `business_rd_share`,
and no declared gap fits them: the first is the retired statistic itself, the
second an R&D tax incentive. They remain in git. `bra-embrapii` and
`bra-sibratec` are refiled under `university_industry_collaboration`, whose
construct they fit. `bench validate` now warns on any record filed against a
retired row, which is how these went unnoticed for one release.

**Why.** A retired row is a measurement the project declined to make (D100),
so a record filed against it stands against nothing. EVIDENCE.md requires
deleted ids to be named in a decision entry so the corpus history stays
auditable.

**Cost.** Two delivered cases leave the published corpus. Neither was a
reversal, so the quota is unaffected.

**Overturned by.** `business_rd_share` returning as a gap or a scored row,
which would make both records admissible again.

## D148 — The foresight register goes to the 53 under agent coding and a human spot-check

*Recorded 2026-10-02. Follows D146 and #68. Codebook 1.1 is `92ff79e`, committed before recoding; round 2 is `c371654`.*

**Decision.** Coding of `government_foresight_capacity` proceeds to the 53
countries once a person has checked the sample in
`docs/research/anticipation/FORESIGHT-REGISTER-SPOTCHECK.md` and it passes.
The row stays a declared gap and is not scored until a further decision
promotes it at tier `expert_panel`. Before the 53 are coded, codebook 1.2
settles whether a parent body is coded separately when its foresight unit
outlives it. This supersedes D146's requirement of at least one human coder:
two agent coders of different model families code, and a person checks a
seeded, regime-stratified 20 percent of bodies before anything is scored
(owner ruling, 2026-10-02).

**Why.** Under codebook 1.1, which applies the owner's ruling that I1 accepts
any official record dating a body's creation, two fresh coders agreed on every
item in all ten pilot countries: alpha 1.00 on I1 to I3 and on the score. I4
is 0 throughout, a floor. Body-by-body alpha is 0.83 on the measure fixed in
1.1, and the three split bodies are closed bodies that change no item. Regime
rho fell from 0.72 to 0.64, under the 0.80 stop rule, and no ceiling fired
(five at 100, four at 0). Income r 0.83 (n 10) is printed and decides nothing.

**Cost.** Both coders are one vendor's models, so their errors stay
correlated, and a 20 percent spot-check is weaker than a human second coder.
Body alpha is 0.79 on the bodies both coders judged, under the threshold on
round 1's measure. I4 has never fired, so its reliability is unmeasured. On
the ten, I1 and I2 move together and the score is close to binary: if the 53
confirm that, the row reads whether a qualifying body exists, with survival on
top, and at r 0.83 on the pilot it will not lower Anticipation's income
correlation.

**Overturned by.** A spot-check that overturns two or more of the 11 sampled
bodies, or any body decision that changes a country item. Or, on the 53:
alpha under 0.80 on any item or on body-by-body decisions in a 20 percent
second coding, regime rho at or above 0.80, or 43 or more of the 53 at one
score.

## D149 — New export products are scored in Adaptability from the Growth Lab's Atlas trade data

*Recorded 2026-10-02. Under D117 and D118, in the pattern of D119 and D124.
Fixes A16 in part. Memo: `docs/research/adaptability/A16-FIXES.md`,
recommendation 1 and the preflight of 2026-10-02. Dataset 8.2.0.*

**Decision.** `new_export_products_rate` joins Adaptability as a scored row:
class `O`, `higher_better`, tier `academic_survey`, unit "% of products not
exported competitively at the start". A product is new when its revealed
comparative advantage averaged under 0.5 over 2009-2011 and at least 1 over
2022-2024, with mean exports of at least USD 1 million a year over 2022-2024.
The rate is new products over the products under 0.5 at the start, stamped
2024. The source is the Harvard Growth Lab's Atlas of Economic Complexity,
International Trade Data (HS, 92), `doi:10.7910/DVN/T4CHWJ` version 18.0
(2026-04-22, CC0), file `hs92_country_product_year_4.csv`. The adapter
`atlas-hs92-new-export-products-v1` runs as `pnpm bench atlas fetch`,
downloads the file by its Dataverse id, refuses it unless its MD5 and SHA-256
match the pin in `model/source-catalog.ts`, and reads only the two windows.
Only four-digit codes are products, so the unspecified `XXXX` line is never
one. The observation file carries the pin under `atlas`: release, checksums,
the rule, the product universe (1,242) and, for every country, the products
it had room to enter, the new ones by code, and how many of them it exports
more of than it imports. Glossary: "New export product".

**Preflight.** The owner made wiring conditional on two traps. Entrepot hubs:
the file has gross exports only, so the test was a net exporter variant (a
new product counts only where exports exceed imports). It orders the frame at
Spearman 0.93 against the published rate; the hubs keep 0.56 to 0.69 of their
new products against a frame median of 0.75, and so do open economies inside
value chains (Poland 0.60, Portugal 0.50, El Salvador 0.40); no hub's rank
moves more than the frame's median move of four places. The row is scored on
gross exports and the net count travels in the pin. Sanctioned trade: Cuba
and Venezuela, and Haiti, which is not sanctioned, did not report to UN
Comtrade in one or both windows and are read from partner reports. A
sanctions regime is a shock an economy reallocates under, so their values are
a reading, not an artefact; a gate keyed to sanctions would need a list and
one keyed to reporting would catch Haiti. 19 of Venezuela's 21 new products
grew in absolute value; across the frame 6 of 1,381 crossed the line only
because a basket shrank. Both are scored, with no gate.

**Why.** Construct first, written before values were read. Adaptability asks
whether an economy can absorb a shock and reallocate, and entry into new
export lines is reallocation observed: capital and workers moving into
products the country was not making. It is behaviour, not a stock money buys,
and counting over the room left does not reward a basket that was already
broad. It covers all 53 countries at 2024 from one release, its order is
stable across windows (Spearman 0.92 to 0.94), and it is the only candidate
in the memo that gives the nine countries the ILOSTAT gate holds a third row
on evidence about reallocation rather than slack.

Reported as findings, not tests, on 8.2.0 against 8.1.0. The row's
normalised value correlates with log GDP per capita at 0.18 (n 51); its
wealth-attribution delta is -0.025. No redundant pair forms; its overlap with
export concentration is 0.54 normalised.

| Adaptability | 8.1.0 | 8.2.0 |
| --- | ---: | ---: |
| Mean confidence | 0.522 | 0.577 |
| Bottom quarter confidence | 0.390 | 0.469 |
| Observed rows (mean) | 2.83 | 3.83 |
| Scored countries | 53 | 53 |
| r with log GDP (n 51) | 0.456 | 0.431 |
| Spearman with log GDP | 0.278 | 0.325 |

The nine of A16 move from two rows to three and from confidence 0.380 to
0.459: India 85.4 (10th) to 83.3 (4th), China 87.0 (7th) to 80.2 (7th),
South Korea 83.4 (13th) to 72.7 (12th), the Philippines 74.5 (34th) to 69.9
(22nd), Mexico 88.0 (6th) to 64.3 (28th), El Salvador 86.5 (8th) to 62.6
(32nd), Peru 70.4 (39th) to 50.7 (46th), Uruguay 64.8 (44th) to 46.3 (49th),
Haiti 31.6 (52nd) to 22.5 (53rd). Every Adaptability score moves, because a
quarter of each is now the new row (rank Spearman 0.80 between releases):
the United States 88.4 (5th) to 71.6 (17th), Cuba 82.9 to 62.2, Ecuador 80.9
to 62.4, the United Arab Emirates 68.7 (41st) to 72.0 (16th); Brazil 73.7
(35th) to 61.4 (37th). The top ten becomes Poland, Vietnam, Thailand, India,
the Netherlands, Israel, China, Turkey, Estonia and Malaysia. No other
dimension's score or confidence moves.

The guardrail, mean confidence across dimensions against log GDP per capita,
moves from 0.286 to 0.274 (n 51). The shared factor (D137) carries 0.496 of
the variance, from 0.498, and correlates 0.845 with income, from 0.847;
Adaptability's loading moves from 0.424 to 0.400. Under D138 no reading
changes: the residuals still share structure (0.286 against a 95th of
0.217), peers still differ, release order stays mixed, leave-one-out is
robust, income is part of the distance and the weaker claim holds;
Adaptability's residual loading moves from -0.284 to -0.255.

D119's overturning clause said a source observing entry into new export
products would replace export concentration. This entry keeps both, and
supersedes that half of the clause: concentration reads the exposure a single
price shock meets, entry reads the move away from it, and the two overlap at
0.54, well under a duplicate.

**Cost.** Merchandise only, so services exporters (the United States, the
United Kingdom, India's software) are read on goods. Exports are gross, so a
hub counts what passes through it, inside the noise the preflight measured
but not zero. A resource find counts as entry when it crosses the line. The
thresholds (0.5, 1, USD 1 million, three-year means, fifteen years) are
judgment fixed in the memo before wiring. The window is slow, so the row
moves little between releases and has no trend. The publisher is an
academic group, for which `academic_survey` is the nearest tier. Three
countries rest on partner reports. The fetch downloads 452 MB. A16 is
restated, not closed: the nine still have no long-term share.

**Overturned by.** A domestic-exports series (re-exports removed) at frame
coverage that reorders the hubs by more than the frame's typical move, which
would make the gross rate a hub artefact and call for that series or a gate.
Evidence that entry counts track resource finds or a shrinking basket more
than reallocation, for instance a window in which most new products are
minerals or crossed the line on a falling total. Or a new release of the
file that changes the definition of RCA or the reconciliation, which needs a
new pin and a revision run.

## D150 — Informal employment is published beside Adaptability as a condition

*Recorded 2026-10-02. Extends D122 and D141. Memo:
`docs/research/adaptability/A16-FIXES.md`, recommendation 2. Dataset 8.2.0.*

**Decision.** `informal_employment_share` joins the registry with
`role: 'condition'` beside Adaptability: informal employment as a share of
total employment, ILOSTAT SDG indicator 8.3.1 (`DF_SDG_0831_SEX_ECO_RT`),
both sexes, whole economy, the latest year since 2010, a labour force survey
preferred where ILOSTAT holds more than one for a year. It is read by the
ILOSTAT adapter through the SDMX endpoint D120 uses, as
`pnpm bench ilostat fetch --only informality`, into
`data/observations/ilostat-informality.json`, and published with its value,
year and rank among the countries that have it, never on the 0 to 100 scale.
Direction is `lower_better`, which orders the rank and claims nothing about
Adaptability. The World Bank API does not carry the series at comparable
coverage: `pnpm bench probe` finds non-agricultural informality in the Gender
Statistics database at 24 of 53 and the Jobs database's own measure at 29 of
53, latest 2021.

**Why.** Construct. The share of work with no contract, registration or
social protection describes the labour market a country reallocates
through, not the reallocation. It is the context A16 asks for beside a low
unemployment rate: India 87.2%, Peru 70.5%, El Salvador 63.6% and Mexico
56.9%. It fails the indicator test on direction: informal work is both the
slack that absorbs a shock and the precarity that keeps a worker from moving
up. That is what D122 makes a condition, as D141 did for labour force
participation. It changes no score or confidence. As a finding, it
correlates with log GDP per capita at 0.90 in its ranked direction (n 42) and
with the Adaptability score at 0.30 (n 43).

**Cost.** 43 of 53. ILOSTAT has no value for the United States, Canada,
Australia, Japan, Singapore, Israel, Malaysia, China, the Philippines and
Cuba, two of them among the nine A16 names. Some values are old (Haiti and
Nicaragua 2012, South Korea 2019). Comparability is weak: European values
come from EU-SILC, an income survey with a proxy definition, which the
observation note says. ILOSTAT revises in place, so the retrieval date is the
release identifier. In this frame the condition is very nearly income.

**Overturned by.** A defensible direction, for instance evidence that
informality reliably slows or speeds reallocation after a shock across
countries, which would make it an indicator on its own entry. Or a
harmonised series that closes the EU-SILC gap and the ten missing countries,
which would make the rank comparable enough to read across income groups.

---

## D151 — A construct still wanted stays a gap when its only series fails a construct test; national belonging is reopened

*Recorded 2026-10-02. Amends D100. Supersedes D143. Leaves D121 and D132
standing. Owner decision of 2026-10-02. Memo: `docs/research/GAP-AUDIT.md`,
classes (b) and the notes on D121, D132 and D143. Dataset 8.3.0.*

**Decision.** D100's description of a retirement gains a rule. A row is
retired when the project no longer wants its construct measured, or when the
row's definition is not a capability: a row defined as one rejected dataset
(the WGI and LPI rows of D23), or as the make-up of a spending stock
(`business_rd_share`, D142). A construct the benchmark still wants stays a
declared gap when the only series aimed at it is inspected and fails A13 or
another construct test. The failed series is recorded in the row's note and,
where it is worth showing, published as a check under D60, and the row stays
in the coverage denominator.

Under that rule `institutional_trust` (D132) and `political_polarization`
(D121) stay declared gaps, unchanged, with their checks beside them. And
`national_belonging` moves from `ingest: 'retired'` back to `ingest: 'gap'`.
Its definition drops pride: it now reads reported identification with and
attachment to the national community, as distinct from pride in the nation.
Its note names G006 as the inspected item that is not wired and ISSP 2023 as
the 16-country lead. The rows retired under D23, D44 and D142 are not
reopened by this entry; a challenge to any of them is a new decision.

**Why.** The audit found three rows tested the same way, each with one
cross-national series that reads the definition and fails A13 because closed
or electoral autocracies read best. D143 retired its row and D121 and D132
kept theirs, and D100 as written sided with D143. The owner's position is the
one D121 and D132 took: the benchmark wants as many relevant constructs read
as it can get, and a construct is not abandoned because the first instrument
aimed at it flatters uniformity. D143 gave a reason of its own, that pride is
not a capability. That holds for pride, and the reopened definition no longer
asks for it. Whether people count themselves members of the community whose
common project Shared purpose asks about is still wanted, and nobody can
measure it comparably yet, which is what a gap says.

The rule also closes the hole D100's overturn clause warned about. A
retirement now records a judgement on the construct, not on the first proxy
tried. Without the rule, any construct could leave the denominator by trying
one bad series, and the confidence of the dimensions that most need
measurement would rise for the attempt.

**Cost.** Shared purpose's denominator rises from five rows to six. Its mean
confidence falls from 0.411 to 0.343, under O1's 0.40 again, with no
observation lost. That is the honest state: Shared purpose rests on three
scored rows, the same three it had at 7.8.0, and the confidence 8.0.0 to 8.2.0
published came from a retirement and not from evidence (A5 said so). 28
countries' Shared purpose confidence falls from usable to thin and two from
thin to very thin, so their agendas move the dimension from raise to measure;
China's leading item changes from Shared purpose to Anticipation, and
Switzerland and South Korea are left with no raise item. No score moves. The
guardrail moves from 0.274 to 0.272. Three dimensions now miss O1:
Coordination, Experimentation and Shared purpose. The bump is minor, because
a registry row changes status and no country or published field changes,
as D100's own restatement was.

**Overturned by.** Evidence that readers take a declared gap with a failed
series beside it as a measurement the project made, which would argue for a
third status between gap and retired; or an owner decision that a specific
construct is no longer wanted, which retires that row under this rule. For
`national_belonging`: an item on belonging that reads the same in every
regime class, or a behaviour of belonging, for 27 or more of the frame,
would make it an indicator candidate.

---

## D152 — Four gaps that read a stock are redefined as behaviour and stay declared gaps

*Recorded 2026-10-02. Extends D118 and D122; under D151. Owner decision of
2026-10-02. Memo: `docs/research/GAP-AUDIT.md`, class (c). Dataset 8.3.0.*

**Decision.** The four gaps the construct audit classed as not a capability
keep their ids and their dimensions and stay `ingest: 'gap'`, under new
definitions that name an act a series could be tested against.

- `basic_research_share` (Anticipation), now "Long-horizon research
  commitments": new competitively awarded public research grants that run
  five years or longer, as a share of all new competitive public grants
  awarded in the year. Unit `% of new grants`, class C. It was the share of
  R&D spending classed as basic research, the make-up of a spending stock that
  D142 retired `business_rd_share` for. No grant register has been triaged.
- `venture_capital_gdp` (Experimentation), now "Venture deals": first venture
  capital rounds closed by companies based in the country in the year, per
  million people, counted by deal and never by amount. Unit `per million
  people`, class C. It was venture capital deployed as a share of GDP, a level
  of financial depth of the kind `domestic_credit_private` is (D122).
  Candidates: the OECD SME and Entrepreneurship Financing scoreboard (6 of the
  16 countries checked under D21, amounts not deals), national association
  counts on their own definitions, and commercial deal databases that fail
  D10.
- `adult_digital_skills` (Agency), now "Adults doing digital tasks": the share
  of adults who carried out a named digital task in the last three months,
  counted one task at a time and never as a skill level. Unit `% of adults`,
  class C. It was the share who can perform standard tasks, a skill level of
  the kind D122 moved out with `internet_users`. Candidate: ITU ICT skills by
  type (SDG 4.4.1) through the UIS API, probed 2026-10-02 at 33 of 53 for
  attaching a file, 25 at 2018 or later.
- `regulatory_sandbox_activity` (Experimentation), now "Firms through
  regulatory sandboxes": firms admitted to, and firms completing, a regulatory
  sandbox or controlled trial regime in the year, per million people, summed
  across regulators. Unit `firms per million people`, class C. It was the
  number and breadth of live sandboxes, a policy stock. Candidate: the cohort
  lists regulators publish one by one; the evidence corpus holds 22 records
  against the row, most of them admission or exit counts on each regulator's
  own definition. It stays an evidence grid column (D135).

Each note names the bar a series must clear: one definition, 27 or more of
the frame. The es and pt-BR lexicons carry the new names and definitions,
and two new units.

**Why.** D151 keeps a construct in the denominator while the project wants
it. A row whose definition reads a stock is not a construct the project
wants scored (D122 moved ten such rows out), so the audit's choice was
between a condition, a retirement and a redefinition. The owner chose the
redefinition: each row points at a capability the dimension lacks, and the
stock wording was the first available proxy written into the definition, not
the thing wanted. A first round counts an attempt with outside money where an
amount counts the money; a grant length is a funder deciding to wait; a task
done is an act where a skill is a level; a firm through a sandbox is a trial
run where a regime is a permission. Each new definition is narrow enough that
a candidate series can be held against it and fail.

The ids stay. `venture_capital_gdp` no longer describes its row, but evidence
records, `/indicators#venture_capital_gdp`, `data/out/indicators/` and any
pinned consumer read the id, and renaming it would remove a published id,
which D37 makes a major version. Its note says the id keeps its first name.

**Cost.** No confidence moves: each row was a gap and stays one, so the
denominators of Anticipation, Agency and Experimentation are unchanged, as
are all scores. The audit's alternative, retiring or moving the four rows,
would have raised those three dimensions' confidence with no observation (the
audit printed Anticipation 0.451 to 0.601, Agency 0.483 to 0.604 and
Experimentation 0.364 to 0.468), and this decision declines that. Rows now
ask for series that mostly do not exist: the grant and sandbox rows are
registers Envisioning would have to build, and the venture row has no
inspectable full-frame source. A1's fix now asks for a deal count rather than
an amount.

**Overturned by.** A source that reads the old definition at full frame and
an argument that the stock, not the act, is the capability; evidence that a
redefined row's candidate series reads income and nothing else once wired,
which would make it a condition under D122; or an owner decision that a
construct is no longer wanted, which retires the row under D151.

---

## D153 — The frame takes every country of a million people that is measurable in all nine dimensions

*Recorded 2026-10-02. Dataset 9.0.0. Supersedes D99's closing of the
country list at 53 and the per-country `reason` that D27, D51 and D99
wrote for each addition. Extends D51's rule-based completion to the world.
Re-baselines the guardrail beside O1 in D117. Applies D47: a major version.*

**Choice.** The benchmark holds 125 countries: the 53 it held at 8.3.0 and
every World Bank economy of at least one million people (`SP.POP.TOTL`,
latest year) that reaches `MIN_INDICATORS_FOR_SCORE` observed rows in all
nine dimensions on the 8.3.0 registry with the adapters already wired. That
rule picked 72 countries in `docs/research/FRAME-EXPANSION.md` (set C), and
the rescore confirms it: all 72 publish nine scores at 9.0.0. In
population order they are Pakistan, Bangladesh, Russia, Egypt, the
Democratic Republic of the Congo, Iran, Tanzania, Italy, Myanmar, Sudan,
Uganda, Iraq, Angola, Ukraine, Morocco, Uzbekistan, Mozambique, Ghana,
Madagascar, Côte d'Ivoire, Nepal, Mali, Burkina Faso, Malawi, Zambia, Sri
Lanka, Kazakhstan, Romania, Zimbabwe, Guinea, Burundi, Tunisia, Belgium,
Jordan, Czechia, Tajikistan, Papua New Guinea, Greece, Azerbaijan, Hungary,
Austria, Belarus, Laos, Kyrgyzstan, Serbia, the Republic of the Congo,
Bulgaria, Denmark, Lebanon, Norway, Slovakia, New Zealand, Georgia, Croatia,
Mongolia, Bosnia and Herzegovina, Namibia, Armenia, Lithuania, Jamaica, the
Gambia, Botswana, Lesotho, Moldova, Albania, Guinea-Bissau, Slovenia,
Latvia, North Macedonia, Cyprus, Trinidad and Tobago and Mauritius.

Out by the same rule: the 22 economies that clear eight dimensions (the
seven OAPI members with no national IP office series, the Gulf monarchies
with no Gini or tax ratio, and others), the 13 that clear seven or fewer,
the 15 economies under a million that clear all nine (Iceland, Luxembourg,
Malta, Montenegro and eleven others, most of them small islands), and
Taiwan, which the World Bank API does not carry. The million line is the
smallest country already in the frame (Estonia), the Growth Lab's own
ranking floor, and the point below which each microstate would move the
Tukey fences as much as India does; admitting them is a separate question
with its own entry.

At 125 the `reason` field cannot be a case per country, and a case chosen
per country is the selection question D51 removed for Latin America. Every
one of the 72 carries one shared sentence that states the rule, and the
original 53 keep theirs.

**What changed in the code.** `countries.ts` gains the 72 entries.
`UNCTAD_M49` gains their M49 codes (all 125 resolve). The Joint EVS/WVS
adapter gains two source aliases: the release prints Uzbekistan as
"Uzbequistan" and cuts Bosnia and Herzegovina's label at the column edge
to "Bosnia and"; the adapter test that once reported that cut label as
unmapped now holds it to the alias. The Spanish lexicon names every
country, as its test requires, and the Portuguese one names the 72 too.
`COUNTRY_ROW_FACTS` gains the ILOSTAT facts the pinned file states for the
new countries: the Democratic Republic of the Congo and Botswana read from
household surveys (Botswana's flagged unreliable), and Belgium, Croatia,
Jamaica, Myanmar and Uganda carry an unreliable flag. The scoring test's
permutation fixture assumed a prime country count; 125 is not, so it now
checks that each row's multiplier is coprime with the count.

**The ingest.** Each source ran through its own command, so
`revisions.json` logs every addition: World Bank 55,557 values added and 0
restated, Joint EVS/WVS 174, V-Dem 288, UNCTAD 72, ILOSTAT long-term
unemployment 66 and informal employment 59, Growth Lab Atlas 72, GitHub
71. OpenAlex added 72 and restated 50 of the 53's values, by a mean of 0.010
on a ratio near 1 and at most 0.088 (Thailand), because its counts move
between reads and the API has no versions (D124). The gates ran on the new
frame:

- ILOSTAT's plausibility gate (D120) holds the same six countries it held
  before (South Korea, Mexico, Peru, the Philippines, El Salvador, Uruguay),
  and drops single years for seven new ones without emptying their rows:
  Bulgaria 2025 and Iran 2018, Madagascar 2022 and Mali 2024 as unconfirmed
  jumps, Egypt 2011, Georgia 2019 and Mauritius 2022 as spikes. Six new
  countries have no ILOSTAT value at all: Uzbekistan, Guinea, Tajikistan,
  Papua New Guinea, the Republic of the Congo, Trinidad and Tobago.
- The GitHub access gate (D145) takes its median over the benchmark, so it
  moved: median stock growth 26.9%, gate 6.7%. It holds China (minus 0.1%),
  Cuba (2.8%) and, new, Belarus (6.2%). Iran is not held.
- The D64 hold on countries with separate EVS and WVS rows now holds ten:
  Armenia, Czechia, Romania, Russia, Serbia, Slovakia and Ukraine join
  Germany, the United Kingdom and the Netherlands. The hold stays. The
  survey memo shows that pooling them would raise the guardrail to about
  0.60, which is a finding for the pooling question, not a reason in it.

**The statistics, at the D137 and D138 precision.** At 8.3.0 the factor
test ran on 51 complete cases and the residual tests on 50. At 9.0.0 they
run on 123 and 122 (Cuba and Haiti stay out of the complete cases;
Venezuela and Cuba have no income figure).

| Reading | 8.3.0, 53 | 9.0.0, 125 |
| --- | --- | --- |
| D137 first-factor share | 0.496 (chance 95th 0.215) | 0.505 (chance 95th 0.175) |
| D137 factor r with log GDP | 0.845, n 50 | 0.815, n 122 |
| 95% interval of that r (Fisher) | 0.74 to 0.91 | 0.745 to 0.867 |
| D138 (a) residual share | 0.286 (95th 0.217), structure | 0.308 (95th 0.175), structure |
| D138 (b) shape share | 0.276 (95th 0.233), differ | 0.226 (95th 0.190), differ |
| D138 (b) margin | 0.043 | 0.036 |
| D138 (b) income-dealt peer distance | 1.523 (5th 1.471) | 1.396 (5th 1.389) |
| D138 (c) release stability | mixed, 25 pairs | mixed, the same 25 pairs |
| D138 leave-one-out | robust | robust |
| D138 (d) income share of a profile | mean 0.323, part | mean 0.233, little |
| Weaker claim | holds | holds |

The interval on r is now about plus or minus 0.06, close to the 0.05 the
memo predicted, and it still contains 0.8: the factor still reads as
income, at "strong" by a margin smaller than its own uncertainty. D137's
overturn clause asks for the bands to give way to an interval once r can be
estimated within a few hundredths. This entry publishes the interval; the
change to `readFactorTest` and the surfaces that print the band is a new
reading rule and gets its own entry. The (b) margin narrowed from 0.043 to
0.036, but its null threshold fell from 0.233 to 0.190 as the memo said a
wider set would, so the reading rests on a tighter estimate: the memo's
resampling put its standard error near 0.02 at this size, against 0.03 to
0.035 at 50. (d) moves from "part" to "little": on the wider frame income
accounts for under a quarter of the average country's distance from the
average profile, though the pooled share is 0.411 against 0.399. (c)
compares consecutive releases on the same country set, so 9.0.0 pairs with
nothing and its history starts again with the next release on 125.

Correlation of each dimension with log GDP per capita, 8.3.0 (n 51) to
9.0.0 (n 123): Anticipation 0.872 to 0.863, Agency 0.579 to 0.466,
Coordination 0.558 to 0.533, Trust 0.606 to 0.354, Learning 0.779 to 0.709,
Experimentation 0.651 to 0.728, Adaptability 0.431 to 0.533, Building 0.434
to 0.573, Shared purpose 0.202 to 0.259. No dimension pair passes the
redundancy threshold. 0 of 3,721 observed current cells clamp.

**The guardrail is re-baselined at 0.526.** Mean confidence across the nine
dimensions correlates with log GDP per capita at r = 0.526 across the 123
countries with an income figure (slope 0.046 confidence per tenfold
income), against 0.272 across 51 at 8.3.0. The owner re-baselines rather
than refusing the frame, for this reason: 0.27 was partly a product of
which 53 were chosen. The original set reached the poor countries the
Joint EVS/WVS release happened to survey (Ethiopia, Nigeria, Kenya,
Bolivia, Nicaragua, Guatemala), so survey presence correlated 0.04 with
income inside it and 0.37 in the wider set; across all 154 measurable
countries of a million or more the figure is 0.41. Confidence does not
depend on the frame, and the 53 read 0.272 inside the 9.0.0 output too:
the rise is who is measured, not how. The survey memo
(`docs/research/trust/SURVEY-COVERAGE-FOR-EXPANSION.md`) decomposes it:
with no survey items anywhere the figure would be 0.460, so the survey gap
explains about 0.07 of it, and the rest comes from the IP office rows, the
ILOSTAT row and the other thin columns. The pending repair is Afrobarometer
Round 8, whose trust item is the Joint release's word for word and would
take the guardrail to about 0.509 and Trust back above 0.40; it waits on a
written licence confirmation. From here the guardrail watches drift from
0.526 inside the 125, which is what it was for: a source that only reaches
rich countries raises it, and that rise is the warning.

**O1.** Mean confidence, 8.3.0 to 9.0.0: Anticipation 0.451 to 0.453,
Agency 0.483 to 0.470, Coordination 0.362 to 0.371, Trust 0.418 to 0.398,
Learning 0.513 to 0.523, Experimentation 0.364 to 0.318, Adaptability 0.577
to 0.580, Building 0.551 to 0.548, Shared purpose 0.343 to 0.319; across
all nine 0.451 to 0.442. Trust drops under 0.40 by construction of the
frame, because half its rows are survey items the new poorer countries
lack, and joins Coordination, Experimentation and Shared purpose below the
target. Experimentation falls furthest, because GEM stays at 16 (D125) and
the national IP office rows thin out. The roadmap queue reads these
figures from now on.

**Evidence grid and foresight register.** D135 called the corpus complete
when every grid cell is closed. The grid is now 1,000 cells, 424 of them
closed and 576 open, all 576 in the new countries; the corpus is not
complete again until they close, and the research inventory prints them as
the queue. The foresight register (D148) was planned as nine batches for
the 53; the 72 add about twelve more under the same runbook. Neither
backlog blocks the release: an open cell lowers no score and no
confidence.

**Delphi.** No panel run is on this dataset. D139 already kept the 8.x
session estimates off every comparison with 9.0.0 indicators. A full run
over 125 countries prices at about $58 with the current four panelists.

**The front-page field.** `FlagField` now draws up to 125 flags on one
axis. Checked at this release on the front page and a capability page, at
desktop and phone widths: the stacks fit the frame and no flag overlaps
another, so the component is unchanged. On a phone each flag shrinks to
about eight pixels, which reads as a distribution but is a small target to
tap; a fix stays inside the D67 component, never a second distribution.

**Cost.** Every published number from 8.3.0 is restated and is not
comparable with 9.0.0. Of the 470 dimension cells scored in both, 462 moved,
by a mean of 3.2 points; the largest moves are Experimentation for Israel
(28.3 to 48.0), Sweden and the United Kingdom, which rise because the
countries added below them widen the bottom of the IP office rows. Brazil
moves on all nine dimensions, and its ranks restate against 125. The observation file grows
from 17 to 40 MB, `data/out` from 20 to 42 MB, and `index.json`, which every
list page reads whole, grows with it. The 72 arrive with no evidence
records, no foresight coding and no panel estimate. The `velocity` and
`leverage` sandbox fixtures were regenerated for the 125, the first time
since 6.1.1, and on today's registry velocity finds a complete five-year
series in at most four dimensions for any country, so it excludes all of
them from its country-level read; that is the registry since 6.1.1, not
the rebase.

**Overturned by.** A rescore on a later release whose D137 interval on r
or D138 (b) margin is no tighter than this one, which would mean the
added countries are noisier than the 50 they joined and the precision
argument failed; a source that measures Experimentation for the OAPI
members or Shared purpose for the Gulf, which would bring the
eight-dimension group under the rule and reopen it; or a guardrail that
rises above 0.526 inside the 125 without a country being added, which is
the drift the re-baselined figure exists to catch.

---

## D154 — Open data and model knowledge only: no gated sources, and an in-session multi-vendor panel is a panel

*Recorded 2026-10-03. Owner ruling of 2026-10-03. Extends D10. Supersedes
the gated reopening routes in D64 and D144, the licence-confirmation step
D153 named for the guardrail repair, the rule in `docs/PANEL.md` that a
gateway run must replace an in-session run before publication, the
four-vendor requirement for in-session runs (D13), and D148's human
spot-check. Closes #73, #66 and #38.*

**Choice.** The project works from two inputs: open data, and what language
models know about the world. It makes no registrations, licence requests,
accounts or emails to data owners.

(a) **Open data only.** A source enters the benchmark only if its data and
the values the project derives from it can be downloaded without an account
and republished under the project's licence (CC BY 4.0 for `data/out`) on
the publisher's terms as published. A term that is silent on redistribution
fails the test: the project does not write to ask. This extends D10, which
asked whether a source can be inspected, with a second question, whether it
can be taken and republished without asking anyone. Every source wired at
dataset 9.0.0 was admitted with a licence note in its memo; one found to
fail the test is reviewed under this entry in its own change, never kept
silently. This closes:

- **Afrobarometer Round 8 Q83** as a fill-only second source for A165 (#73).
  The data are free and under copyright, citation required, and the terms
  say nothing on redistribution, so the written confirmation D153 waited on
  will not be sought. Latinobarómetro forbids republishing and stays out on
  the same rule; Arab Barometer (registration) and Asian Barometer
  (application per dataset) were already of no use to set C and are now out
  on access too.
- **Enterprise Surveys microdata** (#66). The per-country firm base for
  customs clearance sits behind `login.enterprisesurveys.org`. D144's first
  reopening route, reading the real base from the microdata, is closed.
  `customs_clearance_time` stays a check beside Coordination. D144's second
  route stays open because it needs only published values: a second round
  on the 2024 questionnaire, read from the World Bank API or a portal table
  that downloads without an account.
- **GESIS/EVS respondent-level pooling** (#38, TRUST-1 pooling). The pooled
  weights need the registered GESIS microdata download. The D64 hold stays
  on all ten countries with separate EVS and WVS rows: Germany, the United
  Kingdom, the Netherlands, Armenia, Czechia, Romania, Russia, Serbia,
  Slovakia and Ukraine. D64's "pooled-microdata treatment" overturn route is
  closed; a pooling rule that works from the published release tables alone
  would still qualify.
- **Gallup World Poll**, which D10 already excluded. `volunteering_rate`,
  whose definition Gallup's item matches word for word, stays a declared gap.

(b) **Model knowledge is the interpretation layer.** An in-session panel is
a panel for publication when it has at least three panelists drawn from at
least two model vendors, each panelist runs in a separate context with one
fixed stance from `packages/core/src/delphi/panel.ts`, and every panelist
scores from the same evidence brief printed by `pnpm bench prompt` for the
current dataset. Its provenance is `in_session` and is never relabelled
`gateway`: `gateway` still means real API calls through the AI Gateway
(D14). `isPanel` already accepts such a run, because it counts three or more
panel entries on an evidential provenance; what the schema cannot check,
context separation and vendor mix, is recorded in the run's `note` and
`panel` entries (`docs/PANEL.md`). The invariant does not move: a panel
estimate never enters `score`. It reaches the output only as `delphiScore`
and `delphiIqr`, and through `blendedScore`'s existing fallback when a
dimension has no observed indicator, recorded in `blendedFrom`. D139 still
applies: the run must carry the current `datasetVersion` before any surface
compares it with the indicators. A multi-vendor gateway run remains the
stronger instrument, with four vendors, two rounds dispatched by code and
failed calls counted, and should be preferred whenever an
`AI_GATEWAY_API_KEY` exists. The two vendors available in session today are
Anthropic (Claude, through separate subagents) and OpenAI (through the codex
CLI).

(c) **The foresight register's spot-check is done by a third model family.**
D148 asked a person to check a seeded, regime-stratified 20 percent of
bodies before the 53 are coded. That check is now done by a model family
not used to code: OpenAI through the codex CLI, against the same checklist
in `docs/research/anticipation/FORESIGHT-REGISTER-SPOTCHECK.md` (confirmed,
overturned or cannot verify, per body, from the cited sources or their
archived copies). D148's thresholds and overturn clause are unchanged: two
or more of the 11 sampled bodies overturned, or any body decision that
changes a country item, stops the coding.

**Why.** A source that needs an account or a permission is one the next
maintainer cannot reproduce without the same account or the same letter, and
one whose derived values the project cannot be sure it may publish. Waiting
on those has parked three repairs for weeks with no date. Model knowledge is
available now, in session, from more than one vendor; the panel layer was
built to hold it beside the indicators rather than in them, so admitting it
changes no score.

**Cost.** Stated with the numbers the closed routes would have moved.

- **Trust stays under O1 at 0.398.** Afrobarometer would have taken it to
  0.410 on set C (`docs/research/trust/SURVEY-COVERAGE-FOR-EXPANSION.md`),
  with Latinobarómetro 0.415. Seventeen set C countries keep no A165 value:
  Angola, Burkina Faso, Botswana, Côte d'Ivoire, Ghana, Guinea, the Gambia,
  Lesotho, Mali, Mozambique, Mauritius, Malawi, Namibia, Sudan, Tanzania,
  Uganda and Zambia.
- **The guardrail stays at about 0.526** (0.529 on the memo's set C
  calculation). Afrobarometer would have moved it to about 0.509 and taken
  survey presence off the income gradient (0.37 to 0.03). Of the 0.526,
  about 0.07 is the survey gap (0.460 with no survey items anywhere), and
  that part now has no repair in view.
- **Ten countries keep no survey value in Trust, Agency or Shared purpose**
  under the D64 hold. Pooling would have raised Trust to 0.414 but the
  guardrail to 0.599, so this cost is coverage, not wealth separation.
- **Coordination stays at 0.371 against O1's 0.40.** The customs row, kept
  to the 37 countries passing on the proxy base, would have cleared O1 by
  0.006 at 7.8.0 (0.406, `docs/research/coordination/O1-CANDIDATES.md`);
  all 46 at 2018 or later would have given 0.435. Neither is now reachable
  through the microdata.
- **An in-session panel has fewer independent errors than a gateway run.**
  With two vendors and four stances, each vendor takes two stances, so half
  the pairs in the IQR share a model's training data; D13's reason for one
  model per vendor holds and is paid here. Rounds are dispatched by an agent,
  not code, so a missed panelist is a reviewer's catch, not a counted failed
  call.
- **The foresight spot-check loses its human.** Three model families now
  touch the register (the coders' and the checker's), and none is a person;
  an error all three share passes.

**Overturned by.** A source that fails the access test publishing open
terms, which readmits it under this rule with no further step (Afrobarometer
stating redistribution terms that cover derived country shares is the one
worth watching). An owner ruling that accepts one gated source by name. For
(b): an in-session panel whose stance-by-vendor spread shows that the two
stances on one vendor agree more with each other than with the other
vendor's on the same stance, by more than the panel's own median IQR, which
would mean the panel is measuring vendors rather than countries and needs a
third vendor before publication. For (c): a later human or gateway check
that overturns a body the codex check confirmed.
