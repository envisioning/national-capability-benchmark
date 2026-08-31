# Brazil subnational research brief

Status: diagnostic contract and registry pipeline implemented; next valuable
series is still in source research

Recorded: 2026-08-31

Dataset: 5.0.0, generated 2026-08-31

This brief covers the work package that turns the Brazil subnational pilot into
a maintained layer. It extends D66, which created the two-geometry model, and it
does not propose changing the national comparison layer. Read D66 before this
file.

## What exists today

| Piece | Where | State |
| --- | --- | --- |
| Geometry and reconciliation fields | `packages/core/src/model/schema.ts` | Live on `Observation` and `SubnationalFile`; checks are computed |
| State registry | `packages/core/src/model/br-states.ts` | 27 units, code, ISO suffix, name and sourced population metadata |
| Adapter | `packages/core/src/pipeline/br-subnational.ts` | Registry-driven SIDRA adapter with an explicit Brazil-state guard |
| Source | `BR_SUBNATIONAL_SOURCE` in `model/sources.ts` | IBGE SIDRA table 7435, variable 10681 |
| Command | `pnpm bench br-subnational` | Standalone and included in `bench all` |
| Output | `data/out/subnational/BRA/income_inequality.json` | Indexed, schema-described, 27 states, 2024, Gini |
| Reader | `/country/BRA/local` | One diagnostic card, one indicator |

The layer is now a small maintained diagnostic pipeline. The research frontier
is choosing series that expose a national measurement failure, not adding more
descriptive texture to a well-observed cell.

## Research findings and current status

### 1. The reconciliation rule is now explicit and computed

The old fixture declared `reconciliation: "aggregate"`, but the published data
contradicted it. The national coefficient is 0.503. The unweighted mean of the
27 state coefficients is 0.486, and only seven states sit at or above the
national value.

That gap is not an error in the source. It is the between-state term. A Gini is
not additively decomposable, so state coefficients cannot compose a national
coefficient by any weighting. The correct rule for this series is `independent`.

The current file publishes the equal-unit mean as a diagnostic, alongside the
signed residual of -0.017. `bench validate` recomputes the check and rejects an
`aggregate` claim whose per-series tolerance is exceeded.

The lesson is broader than this fixture: reconciliation is a claim about the
relationship between a national value and its units, not a label an author can
add without a computation. D66 introduced the rule to stop a reader assuming
state values can be averaged; the current file now makes that assumption
testable.

### 2. The pilot remains deliberately modest

`income_inequality` belongs to `shared_purpose` and is already observed
nationally for the full country set. A state range beside it adds texture to a
cell that is not in difficulty.

The layer earns its cost where the national layer fails. That is Coordination,
which currently holds three retired rows, three gaps and two observed rows, and
sits at the coverage floor. A3 in `docs/KNOWN-ARTEFACTS.md` records that
Coordination and Trust are inseparable from GDP with present sources. Brazilian
administrative data can address Coordination and no international publisher can.

### 3. The layer is now inside the pipeline

`bench all` builds it, `bench validate` checks it, and `datapackage.json` names
the two subnational schemas. State-value changes append to
`data/observations/revisions.json`, and the Next tracing rules cover the indexed
output path.

### 4. The adapter is registry-driven

`SUBNATIONAL_SERIES` declares the current series and
`br-subnational.ts` reads that registry. The current adapter family is IBGE
SIDRA for Brazil states; a different publisher still needs an adapter behind the
same file contract.

### 5. The state registry carries sourced denominator metadata

`BR_STATES` now carries the 1 July 2024 IBGE population estimate and its source
metadata. The current Gini deliberately uses `equal`, not population weighting,
because a population-weighted mean of state Ginis would still not be a Gini
decomposition.

## What the layer is for

One sentence, so the next change can be tested against it.

**A subnational file shows whether a national value is consistent with the units
that deliver it, and exposes the variation the national value hides. It never
produces a capability score for a state.**

## Work plan and handoff

### Stage 1: make the rule computable — complete

The published file now checks the reconciliation claim rather than merely
asserting it.

- Added `denominator` to the file: `population`, `equal`, or `none`.
- Added a `check` block holding the recomposed value, the published national
  value, the residual, and the tolerance the rule was tested against.
- `bench validate` fails when a file declares `aggregate` and the residual
  exceeds tolerance. The rule is then a claim the build defends.
- Restated the pilot to `independent` and published the residual beside it. The
  0.017 gap becomes the file's most informative number: it reveals a difference
  between the state view and the national statistic without pretending to be a
  decomposed share of national inequality.
- Added sourced population to `BR_STATES` from IBGE, with year and source URL.

### Stage 2: turn the adapter into a registry — complete for the current adapter family

One registry entry per subnational series, in the shape the indicator registry
already uses.

```
{ indicatorId, iso3, geometry, source, reconciliation, denominator,
  unit, direction, years, transform }
```

`br-subnational.ts` becomes a generic SIDRA adapter driven by that registry, and
a second publisher becomes a second adapter behind the same result contract that
`pipeline/adapters/types.ts` already defines. No further `buildXSubnational`
functions.

`CorroborationFile` is now `SubnationalFile`. The layer does more than
corroborate once it publishes series the national layer does not carry.

### Stage 3: choose series that earn the layer — in progress

Selection rule: publish a subnational series when it measures something the
national layer cannot, in a dimension the national layer measures badly.

Candidates in priority order.

| Priority | Series | Dimension | Publisher | Why it is first |
| --- | --- | --- | --- | --- |
| 1 | Budget execution fidelity by state | Coordination | SICONFI | A potentially useful administrative counterpart to the Coordination delivery problem; exact fields, coverage and any aggregate rule still need testing |
| 2 | Intermunicipal consortia, planning bodies, councils | Coordination | IBGE MUNIC and ESTADIC | A census of all 27 states and 5,570 municipalities that asks directly about the coordination instruments the dimension defines, and speaks to the `civil_society_strength` and `public_private_collaboration` gaps |
| 3 | Risk management and contingency planning | Anticipation | IBGE MUNIC | Addresses `government_foresight_capacity`, a gap with no international source |
| 4 | Stalled federal works | Building | TCU | Speaks to `large_project_delivery`, a gap, and is a delivery measure rather than an input measure |

Trust has no subnational source in this list. There is no state-level
generalised trust survey, and the gap should stay declared rather than filled
with a proxy. Record that as the outcome of the search, not as an omission.

The first candidate now has a source memo and coverage preflight at
`docs/research/subnational/SICONFI-BUDGET-EXECUTION.md`. Each candidate needs
the source memo that `docs/RESEARCH-ROADMAP.md` step 1 requires before
implementation. The SICONFI preflight found 27 / 27 state coverage in sampled
years, but material original-to-updated budget revisions leave its construct
and denominator unresolved. A subnational series is subject to the same
inspectability and transform rules as a national one. It is exempt only from the
country-coverage gate, which does not apply.

### Stage 4: publish it into the schema — complete

- Move output to `data/out/subnational/{ISO3}/{indicatorId}.json`. The current
  path names one country in a directory that will hold more.
- Write `data/out/subnational/index.json` naming every published file with its
  indicator, geometry, year, rule and residual. Readers and the layer registry
  read the index. Nothing probes the filesystem, which is the rule
  `INSTITUTION_MAPS` already follows.
- Emit `subnational.schema.json` from the Zod schema and add the resource to
  `datapackage.json`, both on `bench score`, as D37 requires.
- Add the build to `bench all` and the check to `bench validate`.
- Log restatements to `data/observations/revisions.json` on the same terms as
  the national ingest.
- Update `outputFileTracingIncludes` for the new path. A tracing miss is silent.

## Schema changes

| Change | File | Kind |
| --- | --- | --- |
| `CorroborationFile` renamed to `SubnationalFile` | `model/schema.ts` | Breaking, published field renamed |
| `denominator`, `check`, `unit`, `direction`, `retrievedAt` added | `model/schema.ts` | Additive |
| `SUBNATIONAL_SERIES` registry added | `model/subnational.ts` | Additive |
| `population` and its source added to `BR_STATES` | `model/br-states.ts` | Additive |
| Output path moves under `data/out/subnational/{ISO3}/` | `pipeline/paths.ts` | Breaking, consumer path changes |
| `subnational.schema.json` and its datapackage resource | `pipeline/datapackage.ts` | Additive |

Nothing on this list touches `DimensionResult`, `buildFrame`, `score`,
`confidence`, `momentum` or the coverage floor. The dataset version moved to
5.0.0 because the published file and path contract changed. This was not a
frame rebase, so the national scores did not move. Future additions that do not
change the country frame can use the minor version rule in D37.

## What this must never become

The next agent will be tempted by all four.

- A capability score for a state. Twenty-seven units cannot set a frame, and the
  reasoning in D47 applies unchanged.
- A ranking of states. D1 withholds a headline score for the country set, and a
  state league table would reintroduce it one level down.
- A subnational input to national confidence. Confidence describes the evidence
  behind the national score. A state file is not that evidence.
- A radar with 27 series on it. The radar reads one axis at a time by design.

The layer is published beside the score and is never read by it, on the same
terms as a behavioural check under D60.

## Decision entry recorded

Stages 1 and 2 changed the contract D66 wrote. D89 records the superseding
decision: subnational files are registry-driven diagnostics, their checks are
computed, and their values remain outside the national score and confidence.

## Open questions

1. Does the layer publish municipal geometry, or stop at state? MUNIC is a
   municipal census, so candidate 2 forces the answer.
2. What tolerance makes an `aggregate` claim pass? It has to be declared per
   series, not globally, because a budget total and a survey rate do not
   recompose to the same precision.
3. Does a subnational file carry its own confidence? The current answer is no.
   Coverage of 27 of 27 units is a different statement from coverage of 36 of 52
   countries, and reusing the word would mislead.
