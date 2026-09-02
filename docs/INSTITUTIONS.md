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

The viewer has three readings of the same graph. The directory keeps every node
reachable by name, level, system and jurisdiction. The profile centers one
institution and shows its direct neighbors with the relationship verbs. The
system matrix counts the channels between systems and links back to the
profiles. Clicking an institution in any surface keeps the selected profile in
sync. These are presentation choices only; they do not change the network file
or add a second interpretation of an edge.

The shared ontology includes a `public_security_defense` system. It keeps
policing, intelligence, civil protection and military defence visible as a
distinct institutional function rather than treating every security body as a
court or a ministry. Its occupants remain country-specific, so another country
can use a different legal arrangement without changing the schema.

## Bodies no country owns

The United Nations, its programmes and agencies, the multilateral lenders and
the intergovernmental standard setters belong to no country. They live once,
in `data/institutions/global.json`, and never in a country file. A global node
has the same shape as a country node, at the level `global`, with an id that
starts with `global.` and a `members` field: the registry codes of the
benchmarked countries that belong to it, sourced from the body's own member
list. A programme with no membership omits the field.

A country map reaches a global body by id in an edge. That edge lives in the
country file, because a relation between a global body and a national
institution is a fact about the country and carries a source of its own:
UNDP delivers the Atlas of Human Development with Ipea, so the edge is in
Brazil's file. An edge between two global bodies, such as a programme attached
to the UN, lives in the ledger.

Before anything renders, `attachGlobalInstitutions` joins the two: every body
the country's edges name and every body that lists the country as a member
enters the country's network at the global level, and a ledger edge comes along
only when both of its ends are attached. Membership renders as a line on the
body's profile. It never enters a score or a confidence. See D107.

A body enters the ledger under the same rules as any other organisation, read
from the country's side: it funds, regulates, trains, produces evidence for or
delivers with a national institution, or a benchmarked country is a member of
it. A regional body, such as a development bank that serves one continent,
also belongs to no country and can enter the ledger; the decision log records
that a rule for regional bodies is not yet written.

## Coverage is a claim

Each file declares its territorial coverage. `baseline` means the national
cross-system backbone is present. `pilot` means a subnational area is being
used to test the method. `scaffold` means the area has an initial,
source-backed institutional backbone but still needs the sectoral and
municipal depth required for a pilot. `planned` means the area is explicitly
in scope and not yet curated.

Brazil starts with the federal backbone, São Paulo as the first state pilot and
the municipality of São Paulo as the first municipal connection. The other 25
states and the Federal District begin as scaffolds, so every federative unit is
discoverable from the first release while the pilot method is still tested in
one state. The viewer's jurisdiction filter keeps the federal spine visible and
adds the selected state's institutions and any nested municipal nodes.
The next state is selected by missing institutional function and regional
contrast, not by convenience alone.

A state reaches pilot coverage when it has, at minimum:

- executive, legislature, state court, public prosecution and external and
  internal control;
- civil police, uniformed police, fire and rescue, and public defence;
- the main organisations for finance, statistics or data, workforce formation,
  science and technology, regulation and municipal delivery;
- a source for every node and every edge;
- at least one cross-level relationship to a federal or municipal institution.

The Brazil file currently gives every state and the Federal District a first
security and rights layer. That layer is still `scaffold`: it records the
institutions and a few durable links, but it does not yet describe each state's
finance, health, education, environmental, data or regulatory systems. São
Paulo remains the only state with the deeper pilot treatment. The federative
pilot also adds one finance or planning anchor in Maranhão, Minas Gerais and
Pará, while São Paulo is still the only municipality represented.

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

The generated country agenda carries the reverse navigation as `institutionIds`
on each dimension-level agenda item. The ids are derived from the node's
existing `dimensions` field, so the agenda and the institution map cannot drift
into two mappings. They help a reader move from an agenda item to institutions
worth investigating. They do not claim that an institution performed well and
they never enter a score or confidence calculation.

## Validation

Run `pnpm bench validate` after editing an institutional network. The validator
checks the schema, duplicate ids, missing endpoints, self-relations, duplicate
coverage areas and orphaned nodes. It also checks the global ledger: every
member is a registry code, no country file mints a `global.` id, a country edge
naming a global body resolves against the ledger, and no country edge joins
two global bodies. A valid file can still be wrong about the
world. Read each cited source before changing a competency or relationship.
