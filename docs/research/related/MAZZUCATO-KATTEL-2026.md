# Mazzucato and Kattel (2026): market-shaping states

Research note, 2026-10-31. Nothing in this note touches the registry, a score,
a confidence or the published output. The layer test reads the committed
`data/out/diagnostics.json` (generated 2026-10-17) and is reproduced with
`node scripts/capability-layers.mjs`.

## The source

Mazzucato, M. and Kattel, R. (2026). *Market-Shaping States: A new theory of
public sector capacities and capabilities.* UCL Institute for Innovation and
Public Purpose, Working Paper WP 2026-03. ISSN 2635-0122.
https://discovery.ucl.ac.uk/id/eprint/10223350/

The paper was recommended to the project. It is theory: it proposes a
framework and has no indicators and no data. The measurement work behind it is
the IIPP Public Sector Capabilities Index (PSCI),
https://www.ucl.ac.uk/bartlett/research-projects/2024/feb/public-sector-capabilities-index.

## What it argues

- The state shapes markets and does more than fix market failures. Public
  capacity has to be judged against that larger role.
- Public capacity has three layers:
  - **Structural capacities**: legal mandates, fiscal space, civil service,
    coordinating bodies, long-term planning instruments. The paper calls them
    stocks.
  - **Organisational routines**: the repeated practices that turn a mandate
    into action. They link the other two layers.
  - **Dynamic capabilities**: sense, experiment, revise strategy, reconfigure
    structures. The paper calls them flows.
- The interactions between the layers matter more than any one layer.
  Capability accumulates and also decays: when budgets, staff or routines
  erode, the loss compounds.
- Capacity is often inferred from outcome proxies, for example low crime as
  evidence of good policing. The paper names this as a weakness of the
  existing measures.

## Where it meets NCB

- **The same weakness.** NCB scores outcome proxies in several dimensions, and
  `docs/KNOWN-ARTEFACTS.md` says so: A1 for Experimentation and A3 for
  Coordination and Trust. The paper gives an outside source for that
  limit.
- **The stock and flow split is already in the model.** D122 moved stocks
  of infrastructure, access, money, people and enrolment to `role:
  'condition'`, out of the scores. That is the paper's capacity versus
  capability distinction, applied at country level. The paper is a citation
  for D122. It does not ask for a change to D122.
- **PSCI is the nearest neighbour.** PSCI assesses municipal and national
  governments on their ability to mobilise, learn, adapt and shape markets.
  NCB differs in three ways. Its unit is the country and not the
  government. `docs/WHY.md` treats capacity as dispersed across society and
  not held by the state alone. And NCB gives no policy advice, while the
  paper is normative and argues for market-shaping. A reader who knows IIPP
  will ask about the overlap, so this comparison belongs in any pitch that
  names IIPP.
- **Brazil.** IIPP has advised the Brazilian federal government on
  mission-oriented industrial policy. This note does not verify the
  details. Check them before a pitch to BNDES cites them.

## The layer test

**Question.** Inside the scored capability rows, does the paper's split
between routines and dynamic capabilities separate rows that track income
from rows that do not? If dynamic rows track income less, the weaker claim
(D138) gets a mechanism: a country's shape at a given income would sit in
what it changes, not in what it repeats.

**Method.** `scripts/capability-layers.mjs` tags each of the 34 scored rows
with one layer and compares mean |r| against log GDP per capita from
`diagnostics.indicatorVsGdp`. The tagging rule:

| Layer | Rule |
| --- | --- |
| structural | a stock of rules, institutions or accumulated capability |
| routine | the level of an activity the country repeats every year |
| dynamic | change in what the country does: entry, novelty, reabsorption |
| unmapped | a perception or a distribution the framework has no layer for |

The paper describes public organisations, so the mapping onto
country-level rows is ours. Five tags are contested. Patents, trademarks
and industrial designs measure new things, but each one is an annual level
of a repeated activity. The statistical system is close to the paper's
"sensing". Long-term unemployment could be read as a routine outcome. The
script runs once with the primary tags and once with all five moved.

**Result.** Primary tags:

| Layer | Rows | Mean abs r | Share above 0.5 |
| --- | ---: | ---: | ---: |
| condition (D122, not scored) | 14 | 0.695 | |
| structural | 7 | 0.479 | 3/7 |
| routine | 16 | 0.443 | 6/16 |
| dynamic | 5 | 0.463 | 1/5 |
| unmapped | 6 | 0.339 | 1/6 |

Routine minus dynamic is -0.020, one-sided permutation p 0.58. With the
contested tags moved, dynamic rises to 0.541 (8 rows) and routine falls to
0.390 (13 rows): the gap reverses, p 0.96.

**Reading.**

- The routine and dynamic split does not separate income-tracking rows from
  the others on the current registry. The direction of the gap depends on
  how five rows are tagged, so the split carries no signal here.
- The one clear gap is between conditions and every scored layer: 0.695
  against 0.34 to 0.48. That is the D122 split again. The stocks the paper
  calls structural capacity, measured as things a country has, track income.
  The rows NCB scores track it less, whatever layer they are given.
- Five dynamic rows is too few to test. The dynamic layer is the thinnest
  part of the registry. `new_repositories_per_million` (0.72) carries most of
  its income correlation, and `early_stage_entrepreneurial_activity` runs the
  other way (-0.30).
- Six of 34 scored rows have no layer in the framework: perceptions,
  inequality and civic membership. The framework does not cover the trust
  and shared purpose side of NCB.

**Verdict.** Do not add a layer field to the registry. The test gives no
reason to, and D122 already holds the split that matters. Cite the paper
beside D122 and in the PSCI comparison.

## What would reopen this

- More dynamic rows. The paper's dynamic layer is about revision and
  reconfiguration, and NCB measures this mostly through the trend layer
  (`momentum`, D22) and not through scored rows. A test of the trend layer's
  income correlation per dimension is the closer reading of the paper, and
  it is not run here.
- PSCI data. If IIPP publishes national scores or a method, compare the
  dimensions they share with NCB on the countries both cover.
