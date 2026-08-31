# Brazil subnational research brief

Status: pilot fixture published, layer not yet systematic

Recorded: 2026-08-30

Dataset: 4.4.0, generated 2026-08-29

This brief covers the work package that turns the Brazil subnational pilot into
a maintained layer. It extends D66, which created the two-geometry model, and it
does not propose changing the national comparison layer. Read D66 before this
file.

## What exists today

| Piece | Where | State |
| --- | --- | --- |
| Geometry and reconciliation fields | `packages/core/src/model/schema.ts` | Live on `Observation` and `CorroborationFile` |
| State registry | `packages/core/src/model/br-states.ts` | 27 units, code, ISO suffix and name only |
| Adapter | `packages/core/src/pipeline/br-subnational.ts` | One hard-coded indicator and year |
| Source | `BR_SUBNATIONAL_SOURCE` in `model/sources.ts` | IBGE SIDRA table 7435, variable 10681 |
| Command | `pnpm bench br-subnational [--year]` | Standalone, not part of `bench all` |
| Output | `data/out/br-subnational/income_inequality.json` | 27 states, 2024, Gini |
| Reader | `/country/BRA/local` | One card, one indicator |

The layer works. It is a fixture rather than a pipeline.

## Five problems

### 1. The declared reconciliation rule is false for this series

The fixture declares `reconciliation: "aggregate"`. The published data
contradicts it. The national coefficient is 0.503. The unweighted mean of the 27
state coefficients is 0.486, and only seven states sit at or above the national
value.

That gap is not an error in the source. It is the between-state term. A Gini is
not additively decomposable, so state coefficients cannot compose a national
coefficient by any weighting. The correct rule for this series is `independent`.

The general failure is worse than the specific one. Nothing computes the rule.
An author writes `aggregate` into a file and no gate disagrees. D66 introduced
the rule to stop a reader assuming state values can be averaged, and the first
fixture makes exactly that assumption in the field meant to prevent it.

### 2. The pilot indicator is the least useful one available

`income_inequality` belongs to `shared_purpose` and is already observed
nationally for the full country set. A state range beside it adds texture to a
cell that is not in difficulty.

The layer earns its cost where the national layer fails. That is Coordination,
which currently holds three retired rows, three gaps and two observed rows, and
sits at the coverage floor. A3 in `docs/KNOWN-ARTEFACTS.md` records that
Coordination and Trust are inseparable from GDP with present sources. Brazilian
administrative data can address Coordination and no international publisher can.

### 3. The layer is outside the pipeline

`bench all` does not build it, so it goes stale in a way no run reports.
`bench validate` does not check it. `datapackage.json` does not name it and
`data/out/schema/` carries no schema for it, so the directory that is meant to
be self-describing under D37 does not describe this file. There is no revisions
log, so a restated state value leaves no trace, which is the failure D25 exists
to prevent on the national side.

### 4. The adapter is written for one series

`BR_SUBNATIONAL_INDICATOR` and `BR_SUBNATIONAL_YEAR` are module constants and
`buildBrazilSubnational` fetches one SIDRA table. A second indicator means a
second copy of the function. The repository's rule is one registry per concept,
and this concept has none.

### 5. The state registry cannot support a weighting

`BR_STATES` carries code, ISO suffix and name. Any honest aggregate check needs
a sourced population or another declared denominator. Without one, the check in
problem 1 cannot be computed even where it is valid.

## What the layer is for

One sentence, so the next change can be tested against it.

**A subnational file shows whether a national value is consistent with the units
that deliver it, and exposes the variation the national value hides. It never
produces a capability score for a state.**

## The fix, in four stages

### Stage 1: make the rule computable

Extend the published file so the reconciliation claim is checked rather than
asserted.

- Add `denominator` to the file: `population`, `equal`, or `none`.
- Add a `check` block holding the recomposed value, the published national
  value, the residual, and the tolerance the rule was tested against.
- Fail `bench validate` when a file declares `aggregate` and the residual
  exceeds tolerance. The rule is then a claim the build defends.
- Restate the pilot to `independent` and publish the residual beside it. The
  0.017 gap becomes the file's most informative number: it is the share of
  national inequality that lies between states rather than within them.
- Add sourced population to `BR_STATES` from IBGE, with year and source URL.

### Stage 2: turn the adapter into a registry

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

Rename `CorroborationFile` to `SubnationalFile`. The layer does more than
corroborate once it publishes series the national layer does not carry.

### Stage 3: choose series that earn the layer

Selection rule: publish a subnational series when it measures something the
national layer cannot, in a dimension the national layer measures badly.

Candidates in priority order.

| Priority | Series | Dimension | Publisher | Why it is first |
| --- | --- | --- | --- | --- |
| 1 | Budget execution fidelity by state | Coordination | SICONFI | An exact subnational counterpart to an already scored national row, and genuinely `aggregate`, so it tests the Stage 1 machinery on a series where the rule is true |
| 2 | Intermunicipal consortia, planning bodies, councils | Coordination | IBGE MUNIC and ESTADIC | A census of all 27 states and 5,570 municipalities that asks directly about the coordination instruments the dimension defines, and speaks to the `civil_society_strength` and `public_private_collaboration` gaps |
| 3 | Risk management and contingency planning | Anticipation | IBGE MUNIC | Addresses `government_foresight_capacity`, a gap with no international source |
| 4 | Stalled federal works | Building | TCU | Speaks to `large_project_delivery`, a gap, and is a delivery measure rather than an input measure |

Trust has no subnational source in this list. There is no state-level
generalised trust survey, and the gap should stay declared rather than filled
with a proxy. Record that as the outcome of the search, not as an omission.

Each candidate needs the source memo that `docs/RESEARCH-ROADMAP.md` step 1
requires before implementation. A subnational series is subject to the same
inspectability and transform rules as a national one. It is exempt only from the
country-coverage gate, which does not apply.

### Stage 4: publish it into the schema

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
`confidence`, `momentum` or the coverage floor. The dataset version moves by
minor for the additions, and the file rename plus the path move make it a major
under D37 whenever they land. Neither is a frame rebase, so no published score
moves.

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

## Decision entry required

Stages 1 and 3 change the contract D66 wrote, so they need a decision that
supersedes its fixture language and states the computed-rule requirement. Read
the highest number in `docs/DECISIONS.md` immediately before writing and
re-check it after. The file held 80 entries through D81 when this brief was
written.

## Open questions

1. Does the layer publish municipal geometry, or stop at state? MUNIC is a
   municipal census, so candidate 2 forces the answer.
2. What tolerance makes an `aggregate` claim pass? It has to be declared per
   series, not globally, because a budget total and a survey rate do not
   recompose to the same precision.
3. Does a subnational file carry its own confidence? The current answer is no.
   Coverage of 27 of 27 units is a different statement from coverage of 36 of 52
   countries, and reusing the word would mislead.
