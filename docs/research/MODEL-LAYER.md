# The model layer: blind estimates, calibrated against hard data

Design memo, 2026-10-03. Status: **design, pilot not yet run.** No decision
entry exists yet; this memo becomes one after the pilot (see the last
section). Owner choices recorded here were made by MZ on 2026-10-03.

## The idea in one paragraph

NCB keeps two kinds of numbers. **Hard data** comes from named publishers
and builds `score`, `confidence` and the normalisation frame, as now.
**Model estimates** come from language models asked, blind, for the value
of an indicator in a country. Models estimate every cell, including those
with hard data, so their accuracy can be measured against the data per
indicator, per model and per income group. Where the measured accuracy is
good enough, the estimates fill the blanks, each one carrying an error band
taken from that calibration and published in its own field. The Delphi
panel stops being a separate track and becomes one task of this layer.

## Why

- Coverage. Thin rows (trust, perceived control, bribery, the gaps) leave
  dimensions under their coverage floor or at low confidence. Hard data
  will not fill most of them under D154.
- Comparability. A model estimate that has never been checked against
  anything is an opinion. The same estimate, calibrated on hundreds of
  measured cells, is a measurement with a known error.
- Continuity. Each dataset release and each new model is a new calibration
  run, so the layer improves the way the research does: it is never done.

## One layer, three tasks

| Task | Question | Sees hard data | Output |
| --- | --- | --- | --- |
| **E: estimate** | What is this indicator's value for this country? | **No** | One value per model per cell, the ensemble median and the spread across models |
| **C: calibrate** | How wrong is each model, and where? | Yes, compares E to hard data | Error, bias and rank correlation per model x indicator x income group; error bands; a model leaderboard |
| **J: judge** (Delphi, reshaped) | Do the indicators read this country right? | Yes, hard data plus E | Mismeasurement flags, missing-evidence leads, rationales |

The spread across models in E is the disagreement D12 asked the panel to
keep. The fixed stances in `packages/core/src/delphi/panel.ts` survive as
optional lenses in J, where a viewpoint helps critique; they add nothing to
a blind numerical estimate.

## Rules

1. **Blind by construction.** E's prompt contains the country, the
   indicator's registry definition and unit, and the reference year. It
   never contains the value, neighbouring values, income or any other
   series. (Owner choice: bare prompt.) A prompt-content test enforces it.
2. **Hard data owns the frame.** Estimates are normalised onto the frame
   the hard data built: they never set a fence, an endpoint or a coverage
   count. A value outside the frame clamps and is flagged. `score` and
   `confidence` stay hard-data only, so D11 holds.
3. **An indicator earns publication.** Estimates for an indicator are
   published only when its calibration passes:
   - rank correlation of at least 0.7 between ensemble and hard data on
     held-out cells;
   - an error band reported in the indicator's own unit;
   - the estimates track log GDP per capita no more than the hard data
     does (the D48 test, applied to the estimates), so filling cannot make
     the benchmark more income-driven than its data;
   - the error band published for fills is the worst income group's, since
     the blanks sit mostly in poorer countries.
   Below the bar, estimates stay research notes.
4. **Recall is not estimation.** Models have read the World Bank and the
   WVS. Calibration reports error separately on values first published
   after each model's training cutoff, and the gate uses that figure where
   enough such cells exist.
5. **Gap indicators.** A row with no hard data anywhere cannot be
   calibrated directly. (Owner choice: calibrate by proxy and publish
   flagged.) Its estimates borrow the error of the model on the most
   similar measured rows, are spot-checked against the published figures
   in evidence records (`large_project_delivery` alone has about 115
   records carrying cost or schedule overruns), and are published marked
   "uncalibrated estimate".
6. **Dimension reading.** (Owner choice.) A new named field,
   `modelledScore`, per dimension, computed from hard values where they
   exist and estimates elsewhere, on the hard-data frame, with its own
   band. It never replaces `score`. The radar and the field chart draw it
   as a distinct mark; the hard score keeps the filled shape. It replaces
   the D63 fallback of `blendedScore` to the panel.
7. **Runs are pinned and append-only**, like adapters: a run records
   models, cutoffs, prompt version, dataset version and every request.
   Adding a model is a new run read alongside the others, as in
   signals-benchmark. Calibration reruns on every dataset release.
8. **Model cohort.** (Owner choice.) In-session Claude models now (D155
   allows one vendor), with OpenAI via codex and a gateway run appended as
   they become available. The leaderboard shows vendor diversity, so a
   one-vendor calibration is visibly one vendor.

## Data shapes (sketch)

- `data/models/estimates/{runId}.json`: run metadata plus cells
  `{ iso3, indicatorId, model, value, unit, year, selfConfidence }`.
- `data/out/calibration.json`: per indicator, per model and ensemble:
  n, rank correlation, mean absolute error, bias, by income group and by
  pre/post cutoff, plus the gate verdict.
- Country and indicator outputs gain `estimate { value, band, n, spread,
  calibrated }` on rows and `modelledScore`, `modelledBand` on dimensions.
  Nothing existing changes shape (minor dataset version).

## What happens to Delphi

| Today | Becomes |
| --- | --- |
| Dimension 0-100 guess per panelist, deliberation rounds | Dropped: E estimates indicators, `modelledScore` aggregates them |
| `delphiScore`, `delphiIqr` | Superseded by `modelledScore` and its band |
| Fallback for dimensions with no data (D63) | `modelledScore` |
| Critique: where the indicators misread a country (A1, A7) | **Kept as task J** |
| Missing-evidence leads | Kept in J, and large calibration errors point to them too |
| Stances | Optional lenses in J |

The in-session panel for dataset 9.0.0 that D154 and D155 set up runs to
completion as the last Delphi run and the baseline J is compared with.

## Pilot

Four indicators, chosen to test the failure modes:

| Indicator | Why |
| --- | --- |
| `interpersonal_trust` (Joint EVS/WVS) | Survey row with patchy coverage: the fill the layer is for |
| `bribery_incidence` (Enterprise Surveys) | Administrative survey row with gaps and noise |
| `unemployment_rate` (World Bank) | Well measured everywhere: the recall baseline |
| `large_project_delivery` (gap) | Proxy calibration against evidence-record overruns |

Two or three Claude models in separate contexts, blind prompts, all 125
countries. Report per model and ensemble: rank correlation and error
overall, by income quartile, and on post-cutoff values; the correlation
of estimates with log GDP against the hard data's; and for the gap row,
agreement with evidence-record figures.

**The pilot decides the design.** If the survey rows pass the gate, the
layer is built and a decision entry supersedes D11's no-blending note
(adding `modelledScore`), D63's fallback and the Delphi panel's
dimension estimates. If they fail, estimates stay research notes, Delphi
is kept, and that is a published finding about what models know.
