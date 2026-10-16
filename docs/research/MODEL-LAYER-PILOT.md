# Model layer pilot: blind estimates against hard data

Report, 2026-10-16. Issue #91. Design: `docs/research/MODEL-LAYER.md`.
Dataset 9.3.0. Raw estimates, prompts, the coded evidence figures and every
number below are in `data/research/model-layer-pilot/`. Reproduce with
`node scripts/model-layer-pilot.mjs prompts` and
`node scripts/model-layer-pilot.mjs score`.

## Verdict

**No indicator passes the gate.** The estimates stay research notes. Nothing
in this change touches a score, a confidence or the published output, and no
`modelledScore` is added. MODEL-LAYER.md says a failed pilot keeps Delphi and
is published as a finding. This is that finding.

| Indicator | Held-out rank corr. (>= 0.7) | Band in unit (worst income group) | Income tracking, estimate vs hard | Gate |
| --- | --- | --- | --- | --- |
| `interpersonal_trust` | **Not measurable.** No post-cutoff cells. Recall figure 0.961 | 3.7 points (Q2). Q1 has 8 cells and no band | 0.586 vs 0.604, passes | **Fail** |
| `bribery_incidence` | 0.789 on 38 probable post-cutoff cells, passes | 16.3 points (Q2) | **-0.760 vs -0.533**, fails | **Fail** |
| `unemployment_rate` | **Not measurable.** No post-cutoff cells. Recall figure 0.969 | 0.8 points (Q2) | **-0.114 vs -0.067**, fails | **Fail** |
| `large_project_delivery` (gap) | **-0.036** against record cost overruns, 0.117 against schedule overruns | 156 points cost, 116 schedule | **-0.782 vs -0.023** (cost), fails | **Fail** |

The figures are for the ensemble, the median of three models. The trust and
unemployment rows fail on the first criterion because #91 asks for a held-out
correlation and none can be computed, so the measured-cell figures show what
the models remember. Bribery is the only row with held-out cells and it
fails on income. The gap row fails on rank and on income.

## What ran

**Models.** Three Claude models, one vendor (D155): `claude-opus-5-5`,
`claude-sonnet-5-5` and `claude-fable-5-1`. Each self-reported a training
cutoff of 2026-06. Haiku was not added (D13: no smaller model to widen a
panel). The run is in-session, through Claude Code subagents. No API key
exists on this machine, so the route is not the gateway.

**Contexts.** Twelve, one per model per indicator, each fresh. Each context
had one instruction: read one prompt file, write one answer file, use no
other tool. The transcripts confirm one Read, one Write and the hand-back per
context, and no search, fetch, command or other file read. A subagent loads
the repository's agent notes (`AGENTS.md`). They hold no value of these four
rows.

**Prompt.** `data/research/model-layer-pilot/prompts/{indicator}.txt`,
version 1.0.0. It holds the registry definition, the registry unit, and one
line per country: ISO3 code, name and reference year. Nothing else: no
indicator name, no value, no income, no other series. The builder scans each
prompt for every hard value of its row and stops if it finds one. Countries
are listed in one fixed shuffled order (seed 91), so the order carries no
region or income signal. Each model also gave a self-confidence from 0 to 1
per cell.

**Reference year.** The year of the hard value where one exists, otherwise
the row's modal year: 2022 for trust (the Joint EVS/WVS release year), 2025
for bribery and unemployment, 2025 for the gap row. So the prompt carries
the year of each bribery survey. MODEL-LAYER.md allows the reference year in
the prompt.

**One deviation from the design.** The design describes a prompt per cell.
This run asked for 125 countries in one context, so each model saw its own
earlier answers for the same row. That can make a model's answers more
consistent with each other, which raises rank correlation. It cannot leak a
hard value, because no hard value is in the context.

## What the estimates are scored against

| Row | Truth | Cells |
| --- | --- | --- |
| `interpersonal_trust` | Joint EVS/WVS A165, `data/observations/joint-evs-wvs.json` | 72 measured, 53 blank |
| `bribery_incidence` | Enterprise Surveys `IC.FRM.BRIB.ZS`, latest year per country, `worldbank.json` | 121 measured, 4 blank |
| `unemployment_rate` | ILO modelled estimate `SL.UEM.TOTL.ZS`, latest year, `worldbank.json` | 125 measured |
| `large_project_delivery` | Overruns coded from evidence records, `evidence-overruns.json` | 70 countries with a cost figure, 54 with a schedule figure |

**Income.** Log GDP per capita, PPP, constant international dollars,
`NY.GDP.PCAP.PP.KD`, the series the diagnostics use. Quartiles over the 123
countries that have it, with breaks at about $8,000, $18,800 and $42,000.
Cuba and Venezuela have no value and drop out of the quartile and income
figures only. Income tracking is the Pearson correlation with log GDP, the
D42 and D48 test.

**Error band.** The 80th percentile of absolute error in the indicator's
unit: four fills in five fall inside it. A band is reported for a group with
at least 10 cells. Both rules were fixed in the code before any estimate was
scored.

**Post-cutoff cells.** All three cutoffs are 2026-06. The repository's
ingest history starts on 2026-08-26, after the cutoff, so it cannot date a
value's first publication. The date comes from the publisher's calendar:

- Trust: every value is from fieldwork that ended by 2022, released before
  2026. None is post-cutoff.
- Unemployment: the ILO's November edition first carries a year's
  estimate, so the 2025 values were out in November 2025. None is
  post-cutoff. Later revisions are not first publications.
- Bribery: a value from a 2025 survey is counted as probably published
  after June 2026. Surveys are released after fieldwork, usually within a
  year. This is a proxy and not a date: an early-2025 survey released before
  June 2026 is counted wrongly. 38 cells qualify.

The gate uses the post-cutoff set where it holds at least 20 cells.

**Gap row figures.** The `large_project_delivery` records are documented
deliveries. They are not a dataset. A record is coded only where its own
text states a baseline and an outturn, or a forecast, for the same scope:
94 of 190 records, 86 countries. Cost overrun is outturn over baseline
minus one. Schedule overrun is actual or forecast duration over planned
duration minus one. Each record carries flags where the figure is a lower
bound, a forecast, a sub-project, per kilometre, nominal, or a bid
estimate. A country's figure is the median of its records. The
`costClean` variant drops lower bounds, bid estimates, sub-projects and
per-kilometre figures (60 countries). Records about adoption or coverage,
cancellations with no baseline, IT systems, decommissioning and operating
subsidies are not coded. The coding was done by the session that ran the
pilot, from record text alone, before scoring.

## Results

Rank corr. is Spearman. MAE is the mean absolute error in the row's unit.
Bias is the mean of estimate minus truth. "vs log GDP" is the estimates'
Pearson correlation with log GDP per capita on the same cells as the truth.

### Interpersonal trust (% agreeing)

Truth: n 72, median 17.0, IQR 21.1, correlation with log GDP 0.604.

| Model | n | Rank corr. | MAE | Bias | Band | vs log GDP |
| --- | --: | --: | --: | --: | --: | --: |
| Opus 5.5 | 72 | 0.967 | 1.83 | -0.18 | 3.40 | 0.593 |
| Sonnet 5.5 | 72 | 0.842 | 4.99 | 2.61 | 8.34 | 0.563 |
| Fable 5.1 | 72 | 0.964 | 1.63 | -0.27 | 2.18 | 0.601 |
| Ensemble | 72 | 0.961 | 1.89 | 0.19 | 3.40 | 0.586 |

| Ensemble by income quartile | n | Rank corr. | MAE | Bias | Band |
| --- | --: | --: | --: | --: | --: |
| Q1 (poorest) | 8 | 0.929 | 3.34 | 3.26 | none |
| Q2 | 20 | 0.917 | 1.99 | -0.24 | 3.68 |
| Q3 | 21 | 0.947 | 2.03 | -0.24 | 3.00 |
| Q4 | 22 | 0.998 | 1.14 | -0.01 | 1.80 |

An error of two points on a survey share is the size of the survey's own
sampling error. That is recall of the published table, not an estimate.
The blanks the layer exists to fill are where nothing was published: 23 of
the 53 blank countries are in Q1, where only eight cells are measured, too
few for a band. The models know the difference. Mean self-confidence falls
from 0.37 to 0.19 (Opus), 0.31 to 0.19 (Sonnet) and 0.52 to 0.26 (Fable)
between measured and blank cells. The calibration set and the fill set are
two kinds of cell, and this run can measure only the first.

### Bribery incidence (% of firms)

Truth: n 121, median 7.1, IQR 15.1, correlation with log GDP -0.533.

| Model | n | Rank corr. | MAE | Bias | Band | vs log GDP | Post-cutoff: n, rank corr., MAE |
| --- | --: | --: | --: | --: | --: | --: | --- |
| Opus 5.5 | 121 | 0.766 | 5.58 | -3.09 | 9.26 | -0.722 | 38, 0.772, 5.75 |
| Sonnet 5.5 | 121 | 0.740 | 7.20 | 2.42 | 12.40 | -0.799 | 38, 0.757, 7.05 |
| Fable 5.1 | 121 | 0.733 | 6.40 | 1.79 | 10.88 | -0.710 | 38, 0.747, 5.98 |
| Ensemble | 121 | 0.755 | 6.15 | 0.72 | 10.11 | -0.760 | 38, 0.789, 5.65 |

| Ensemble by income quartile | n | Rank corr. | MAE | Bias | Band |
| --- | --: | --: | --: | --: | --: |
| Q1 | 30 | 0.433 | 8.84 | 4.64 | 11.08 |
| Q2 | 30 | 0.718 | 8.23 | -0.67 | 16.26 |
| Q3 | 30 | 0.535 | 3.94 | 1.06 | 7.09 |
| Q4 | 30 | 0.448 | 3.29 | -2.63 | 4.74 |

The overall rank correlation clears 0.7, but inside each income quartile it
falls to between 0.43 and 0.72. Most of the overall correlation is the
income ordering. All three models track income more than the data does: the
ensemble's gap is 0.227, with a 90 percent bootstrap interval of 0.127 to
0.330, so the failure is not sampling noise. Filling bribery from these
estimates would make Trust more income-driven than its data. That is the
mechanism D48 found in the panel column, now measured on one indicator.

The post-cutoff cells correlate better (0.789) than the pre-cutoff ones
(0.716). The 2025 surveys span a wider income range (standard deviation of
log GDP 1.27 against 1.01), which raises a rank correlation driven by
income. Read together with the proxy dating, the post-cutoff figure is
weak evidence that the models estimate rather than recall.

The largest ensemble errors are Guinea (published 7.6, estimated 45), Israel
(28.5 against 3), Ukraine (37.4 against 12), Mali (4.0 against 25) and
Russia (26.8 against 8). Where the survey reads against the country's
reputation, the models follow the reputation.

### Unemployment rate (% of labour force)

Truth: n 125, median 5.1, IQR 4.2, correlation with log GDP -0.067.

| Model | n | Rank corr. | MAE | Bias | Band | vs log GDP |
| --- | --: | --: | --: | --: | --: | --: |
| Opus 5.5 | 125 | 0.969 | 0.48 | 0.24 | 0.64 | -0.090 |
| Sonnet 5.5 | 125 | 0.955 | 0.61 | 0.28 | 0.79 | -0.125 |
| Fable 5.1 | 125 | 0.969 | 0.55 | 0.28 | 0.71 | -0.115 |
| Ensemble | 125 | 0.969 | 0.52 | 0.27 | 0.65 | -0.114 |

| Ensemble by income quartile | n | Rank corr. | MAE | Bias | Band |
| --- | --: | --: | --: | --: | --: |
| Q1 | 31 | 0.948 | 0.78 | 0.46 | 0.79 |
| Q2 | 31 | 0.959 | 0.72 | 0.50 | 0.80 |
| Q3 | 30 | 0.981 | 0.38 | 0.12 | 0.52 |
| Q4 | 31 | 0.992 | 0.20 | -0.01 | 0.39 |

This is the recall baseline, as designed: half a point of error on a
published series the models have read. It fails the gate twice. It has no
held-out cells. Its estimates also track income slightly more than the data
(gap 0.047, 90 percent interval -0.029 to 0.102), so that failure is within
sampling noise, but the gate is written as a strict comparison and is
applied as written. The row has no blank to fill.

### Large project delivery (% overrun, gap row)

Coded record figures: cost overrun for 70 countries, median 40 percent,
IQR 90, correlation with log GDP -0.023. Schedule overrun for 54
countries, median 59 percent, correlation with log GDP -0.002.

| Ensemble against | n | Rank corr. | MAE | Bias | Band | Estimate vs log GDP | Truth vs log GDP |
| --- | --: | --: | --: | --: | --: | --: | --: |
| Cost overrun | 70 | -0.036 | 78.6 | -37.1 | 81.6 | -0.782 | -0.023 |
| Cost overrun, clean records | 60 | -0.054 | 65.8 | -23.6 | 73.1 | -0.805 | 0.046 |
| Schedule overrun | 54 | 0.117 | 48.6 | -29.7 | 63.0 | -0.798 | -0.002 |

No model reaches a rank correlation of 0.2 with either figure (per-model
values are in `calibration.json`). The models agree with each other
(pairwise rank correlation 0.91 to 0.94) and with income (-0.74 to -0.85):
their shared answer is "poorer countries overrun more". The coded records
show no income gradient. The models also report that they are guessing:
mean self-confidence is 0.06 (Opus), 0.07 (Sonnet) and 0.15 (Fable), the
same on countries with records and without.

The records are a selected sample. Development-bank completion reports
dominate the poorer countries and audit-office reports the richer ones, and
a record exists because someone documented a delivery. So the absent income
gradient is a fact about this evidence, not proof that none exists in the
world. Neither reading supports the estimates: they disagree with the only
figures the project holds, and their agreement with each other comes from a
shared income prior. MODEL-LAYER.md rule 5 would publish such a row as an
"uncalibrated estimate" borrowing error from similar measured rows. This
pilot gives no measured row to borrow from, because bribery, the nearest
institutional row, fails on income in the same direction.

## What this finding says

1. **On published rows, the models recall.** Trust and unemployment come
   back within about two points and half a point. The design anticipated
   this in rule 4. No post-cutoff value exists to separate recall from
   estimation, so these rows cannot pass a held-out test today.
2. **Where the record is thin, the models fall back on income.** Bribery
   estimates track log GDP at -0.76 against the data's -0.53, and project
   delivery estimates at -0.78 against roughly zero. A fill from these
   estimates would raise the benchmark's dependence on income, which D48 and
   the third gate criterion exist to prevent.
3. **The models know when they are guessing**, and their self-confidence
   falls by half on blank trust cells. Self-confidence did not predict error
   on measured cells well enough to use: the correlation with absolute error
   is between -0.59 and 0.27 across models and rows.
4. **Three models of one vendor agree too much** to give an independent
   spread. The median cross-model range per cell is 4.5 points on trust,
   5 on bribery and 0.3 on unemployment. On the gap row the pairwise rank
   correlation (0.91 to 0.94) is far above any model's correlation with the
   records.

## What follows

- **Delphi stays** (#33), as MODEL-LAYER.md says for a failed pilot. D11,
  D63 and D48 stand unchanged. No decision entry is proposed, because no
  indicator passed.
- **The estimates are research notes.** They live in
  `data/research/model-layer-pilot/` and nothing reads them.
- **A held-out test is possible soon for unemployment.** The ILO's November
  2026 edition will publish 2026 values, after every cutoff in this cohort.
  Estimates for reference year 2026 made now and scored when the World Bank
  carries that edition would give the clean post-cutoff test this run could
  not. The same holds for trust when the next EVS/WVS wave releases.
- **A second vendor** (OpenAI through codex, D154) would test whether the
  income prior is one vendor's or a property of models in general.

## Limits of this run

- One vendor, three models with one self-reported cutoff. The cutoffs are
  what each model states in its own context and are not confirmed by
  Anthropic documentation available here.
- One context per row, not per cell (see "What ran").
- Post-cutoff dating for bribery is a proxy from the survey year.
- The gap row's truth is coded from evidence-record text by the same model
  family that estimated it, in a separate context and before scoring. Each
  coded figure carries its basis in `evidence-overruns.json` for review.
- The Q1 trust band cannot be computed from eight cells, and Q1 holds most
  of the blanks.

## Files

| Path | Holds |
| --- | --- |
| `scripts/model-layer-pilot.mjs` | Prompt builder with the blindness check, and the scorer with the gate |
| `data/research/model-layer-pilot/prompts/` | The four prompts as sent, and `manifest.json` |
| `data/research/model-layer-pilot/estimates/{model}__{indicator}.json` | Raw answers: model id, stated cutoff, 125 cells each |
| `data/research/model-layer-pilot/evidence-overruns.json` | Cost and schedule overruns coded from 94 records, with basis and flags |
| `data/research/model-layer-pilot/calibration.json` | Every figure in this report, per model, ensemble, quartile and cutoff split, with the gate |
