# For automated readers

Read this if you are a program, a model or an agent that intends to fetch a
number from this project and repeat it somewhere else. It is the contract that
sits on top of the data, and it exists because the files alone will let you say
something false without erroring.

Humans reach the same rules through the pages of the viewer. This file states
them once, in the order a fetch happens. It states rules, not counts. The live
counts, the dataset version and the generation date are in `/llms.txt` on the
site and in `data/out/datapackage.json` in the repository, and both are written
by the pipeline, so neither can go stale the way a sentence here would.

---

## 1. The one rule

**A capability score never travels alone.**

Every score published here is accompanied by a separate confidence number, a
count of the indicators the score rests on, and a flag saying whether the
dimension cleared the coverage floor at all. Confidence is never folded into the
capability score: they are two numbers and they answer two different questions.
The score says where the country sits. The confidence says how much evidence
that position rests on.

Repeating the score without the confidence is not a shortened quote. It is a
different claim, and the project has no way to defend it.

### Assessment tracks

The source-backed track is the measurement layer. It uses registry-defined
indicators and named publishers, then computes `score`, `confidence` and the
indicator rows. World Bank is the only automated ingestion source in v0. A
small set of manually authored observations is stored separately. Other
publishers remain declared gaps until an adapter and comparable coverage exist.

The Delphi track is an interpretation layer. It reads the source-backed
evidence brief to review thin or questionable dimensions. It can record a
separate estimate, rationale, disagreement and missing evidence. It never
creates an observation, changes confidence or turns an evidence record into a
measurement.

---

## 2. What to fetch

The scored output is in `data/out`. The directory is self-describing: a
Frictionless Data Package descriptor plus one JSON Schema per published shape,
both generated from the same Zod schemas the pipeline validates against.

| File | What it is | Fetch it when |
| --- | --- | --- |
| `data/out/datapackage.json` | The descriptor. Version, licence, sources, every resource and its schema. | First. It tells you what the rest is. |
| `data/out/index.json` | Every country, nine dimensions each, with score, confidence, coverage and trend. No indicator rows, no yearly series. | You want more than one country. |
| `data/out/countries/{ISO3}.json` | One country in full: every indicator row, its raw and normalised value, its source and year, and its whole series back to 1990. | You want one country in depth. |
| `data/out/indicators/{id}.json` | One indicator across every country. The same data turned inside out. | You want one measure compared across the frame. |
| `data/out/agenda/{ISO3}.json` | The computed capability agenda: which dimensions to raise, which to measure, which to hold. Language neutral. | You want the reading rather than the numbers. |
| `data/out/agenda/{ISO3}.{lang}.md` | The same agenda rendered as prose, one file per lexicon. | You want the reading in a language. |
| `data/out/diagnostics.json` | Correlations, redundancy and the GDP-sensitivity test. | You are checking whether the model earns its structure. |
| `data/out/table.csv` | The flat table. One row per country and dimension. | You want a spreadsheet. |
| `data/out/schema/*.json` | JSON Schema for the index, a country file and an indicator file. | You are validating what you fetched. |

**Never load the country files to build a list.** All of them together are
several megabytes and `index.json` answers every cross-country question. This is
the mistake D27 exists to prevent.

The viewer also serves two JSON routes for the two most common cross-country
questions, so you do not have to pull a file to answer them:

- `GET /api/dimension/{dimension}` — one dimension across every country, with
  score, confidence, trend delta, basket size and span.
- `GET /api/indicator/{id}` — one indicator across every country.

---

## 3. The fields that must travel with a score

On every dimension object:

| Field | Why you need it |
| --- | --- |
| `score` | The number. `null` when the dimension did not clear the coverage floor. |
| `confidence` | Coverage times recency times source quality. Multiplicative, so the top of the scale is unreachable in practice. |
| `confidenceParts` | The three factors separately, when you need to say which one is weak. |
| `observedIndicators` | How many indicators the score actually rests on. |
| `belowCoverageFloor` | True when fewer than two indicators were observed. The score is then `null` and the dimension publishes no position. |
| `delphiScore`, `delphiIqr` | The final panel estimate and its disagreement range. These are separate from the source-backed score. |
| `blendedScore`, `blendedFrom` | The blend falls back to the Delphi panel only where no indicator evidence exists. `blendedFrom` records which source was used. Read it before you quote `blendedScore`. |
| `momentum` | The trend. A list, one entry per span, shortest first. |

Confidence bands are defined once, in
`packages/core/src/pipeline/confidence.ts`, and every surface reads them from
there. The bands are `good` at 0.65 and up, `usable` at 0.45, `thin` at 0.25 and
`very thin` below that. A `very thin` score rests on one or two indicators, and
the band's own text says not to quote it on its own. Take that literally.

Score bands are in `packages/core/src/pipeline/bands.ts` and are deliberately
frame-relative. `strong` means strong inside this set of countries, not strong
in the world.

When `delphiScore` or `blendedFrom: "delphi"` is present, read
`data/delphi/latest.json` as well. The run records its provenance, model and
stance, dataset version, country set, prompt version and scope. A panel estimate
without that context is incomplete.

---

## 4. What not to do

**Do not average the nine dimensions into one number.** There is no composite
and no headline ranking, by design. A composite collapses exactly the
information the benchmark exists to produce: two countries with the same mean
can have opposite shapes, and the shape is the finding. See D1. This includes
sorting a table of countries by the mean of their axes, which is a ranking
wearing a different hat.

**Do not read a null score as zero.** A `null` means the dimension published no
position, because fewer than two of its indicators were observed. Zero means the
country sits at the floor of the frame. Plotting the first as the second invents
a finding. See D45.

**Do not compare numbers across a major dataset version.** The version is
semantic and lives in `packages/core/src/model/version.ts`. A major bump means
the normalisation frame rebased, which restates every published score.
Every country in the set helps set each indicator's endpoints, so adding one
country moves all of them. Numbers from two major versions are not the same
quantity. See D37 and D47.

**Do not present a Delphi run as evidence without checking its provenance.**
Provenance is stored on the run file and is never inferred from a model string.
A run written with `provenance: "mock"` is a deterministic offline stand-in and
is not evidence of anything. A run with fewer than three panelists has no
distribution to read and is a session estimate, not a panel. Gate on
`isEvidential(run.provenance)` and `isPanel(run)`, both exported from
`@ncb/core`.

**Do not quote a trend without its basket size and its span.** A trend is
computed against the current frame on the indicators observed at both ends, so a
trend and a score sit on different baskets of indicators. `matchedIndicators`
and the two years are on every momentum entry, and every surface in this project
that prints a trend prints its basket. Use `primaryMomentum` when you need one
number. See D22, D24 and D25.

**Do not treat an evidence record as data.** Records in `data/evidence` are
documented deliveries filed against indicators that have no dataset. They never
enter a score and never enter a confidence. A record's `pattern` field is
analysis by this project; everything else in the record comes from a named
publisher. Keep the two apart. See D20 and D31.

**Do not read a raw indicator value as a score.** `raw` is the publisher's
value in the publisher's units. `normalized` is a 0 to 100 position inside this
frame. A value outside the frame clamps and sets `outOfFrame` on the cell.

**Do not present a score as an absolute verdict.** It is a position among the
countries in the benchmark. The frame is wide but it is not the world. See A10.

---

## 5. Read the limits before you quote

`docs/KNOWN-ARTEFACTS.md` states where the model currently produces a number
that is wrong about the world rather than informative about it. It is rendered
at `/limits` on the site, and it states what is wrong now, not what we used to
think.

The ones that will bite an automated reader first:

- **A1** — Experimentation is not measured. It is inferred from patents.
- **A3** — Coordination and Trust are mostly measured by perception of wealth,
  and are not separable from GDP in the current data.
- **A9** — Coordination reads far too low for small, competent states.
- **A10** — The frame is wide and it is not the world.
- **A11** — Building measures industrial output and reads as delivery capacity.
- **A12** — Coordination and Trust are scored on almost nothing.

If your output quotes a dimension named above, quote the artefact with it.

`docs/DECISIONS.md`, rendered at `/decisions`, holds every methodological
choice, why it was made, what it costs, and what evidence would overturn it.
Each entry ends with an `Overturned by` clause. That clause is the honest answer
to "how would you know if this were wrong", and it is a better thing to quote
than a score.

---

## 6. Pinning and citation

Pin what you read. `index.json`, every country file and `datapackage.json` all
carry `version` and `generatedAt`. Record both alongside any number you store,
because a patch-level re-ingest can restate a value, and every restatement is
logged in `data/observations/revisions.json`.

Cite it as:

> NCB, the National Capability Benchmark, version X.Y.Z, generated YYYY-MM-DD.
> Envisioning. https://github.com/envisioning/national-capability-benchmark

The data is published under CC BY 4.0. The code is MIT. Third-party terms that
are neither are named in `NOTICE.md`, and the brand system in the viewer is not
covered by the code licence.

---

## 7. If you find an error

The project wants to be corrected. `/challenge` on the site lists what would
overturn the model and how to file an objection, and issues go to
https://github.com/envisioning/national-capability-benchmark/issues.

A useful objection names the decision or the artefact it disputes, and says what
evidence would settle it. That is the same standard the decision log holds
itself to.
