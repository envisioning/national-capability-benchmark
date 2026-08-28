# Institutional networks: inclusion and authoring guide

The institutional network explains where a country's capability is held, how
it moves and what constrains it. It is not an organisation chart. An
organisation chart records hierarchy inside one administration; this layer
crosses branches of government, levels of the federation and selected actors
outside the state.

The network is explanatory evidence. It never enters a capability score or its
confidence. A node's dimension links say which NCB questions the organisation
helps a reader investigate. They are not weights, points or claims of
performance.

## The two layers

The structural skeleton should come from an official registry wherever one
exists. In Brazil, SIORG is the reference register for the federal executive,
and the São Paulo government directory is the starting point for the state
executive. These sources describe what exists and where it is administratively
linked.

The capability overlay is curated. It adds Congress, courts, prosecutors,
audit bodies, universities and the selected private or social organisations
that the executive registries omit. It also adds typed relationships such as
funding, regulation and audit. Every node and every relationship carries its
own source because administrative links and competencies change.

## When an organisation enters

An organisation enters when at least one of these is true:

1. The constitution or a law gives it an independent power, check or duty.
2. It controls a system used by many other organisations: finance, data,
   standards, infrastructure, training, audit or regulation.
3. It is the only or principal interface between levels of government for a
   material public function.
4. It participates in a documented delivery in `data/evidence`.
5. It sits outside the state but has a recurring role in public capability. A
   private university can enter under this rule; fame alone cannot.

Internal departments stay out unless they hold a lever that cannot be
represented by their parent organisation. Officeholders stay out. The node is
the institution, not the person currently leading it.

## What a relationship means

Every edge has a direction and a verb. `linked_to` records administrative
vinculation, not subordination. `funds` means the source has a standing funding
role toward the target; one isolated grant is not enough. `checks`, `audits`
and `regulates` stay separate because they are different constraints.

`delivers_with` is reserved for a recurring federative or institutional
arrangement. A one-off project belongs in an evidence record first. Its actors
can be promoted into the network after the arrangement proves durable.

Never add `connected_to`. If the relationship cannot be named, the network
does not yet know what the line means.

## Country and language structure

One language-neutral file lives at `data/institutions/{ISO3}.json`. Stable ids,
roles, relationship types and English ground-layer summaries travel across
countries. Official names stay in the institution's own language. Display
translations live under `packages/core/src/i18n/`.

The ontology is shared; the occupants are local. A development bank, a
constitutional court and a school of government use the same types in every
country even though their legal forms and powers differ. A source and a plain
description carry that local difference rather than a Brazil-specific field in
the schema.

## Coverage is a claim

Each file declares its territorial coverage. `baseline` means the national
cross-system backbone is present. `pilot` means a subnational area is being
used to test the method. `planned` means the area is explicitly in scope and
not yet curated.

Brazil starts with the federal backbone, São Paulo as the first state pilot and
the municipality of São Paulo as the first municipal connection. All 26 states
and the Federal District are listed in the coverage plan from the beginning.
The next state is selected by missing institutional function and regional
contrast, not by convenience alone.

A state reaches pilot coverage when it has, at minimum:

- executive, legislature, state court, public prosecution and external and
  internal control;
- the main organisations for finance, statistics or data, workforce formation,
  science and technology, regulation and municipal delivery;
- a source for every node and every edge;
- at least one cross-level relationship to a federal or municipal institution.

## Connection to the NCB

The safest path is indirect:

`institution -> documented delivery -> declared indicator gap -> dimension`

Direct node-to-dimension links are navigation. They help a reader ask, for
example, which organisations bear on Coordination or Learning. Evidence
records remain the place where a delivered programme, number, mechanism and
limits are documented.

Network measures such as centrality, density or resilience do not enter the
benchmark. They would first need comparable construction across countries and
a decision showing that the result measures capability rather than the amount
of documentation available.

## Validation

Run `pnpm bench validate` after editing an institutional network. The validator
checks the schema, duplicate ids, missing endpoints, self-relations, duplicate
coverage areas and orphaned nodes. A valid file can still be wrong about the
world. Read each cited source before changing a competency or relationship.
