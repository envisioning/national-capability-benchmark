# Carriers research brief: who organises the people the state does not reach

Status: research. No source tested, no adapter, no schema change.

Recorded: 2026-10-05

Dataset: 6.1.2

This brief defines a research lens before anything is built. It extends D169,
which fixes how religious traditions and bodies enter the institution layer.
Read D169, D66, D68, D89 and D107 before this file.

The first case is the growth of evangelical and Pentecostal churches in Brazil
and Latin America. The lens is not specific to religion. It asks the same
question of every organisation outside the state that holds capability for a
population.

## The question

**Where the state does not reach a population, which organisations organise
it, what can that population then do, and what does the state do about it?**

Four sub-questions follow. Every work package below answers one of them.

1. **Reach.** Where are the population and the state not in the same place?
2. **Carrier.** Which organisations are there instead?
3. **Consequence.** What changes in the population after a carrier arrives?
4. **Settlement.** Does the state partner with the carrier, ignore it, or get
   taken over by it?

## Terms

The brief uses these words with one meaning each. None of them is in the
glossary yet. A term enters `glossary.ts` in the same change that puts it into
the model, as D26 requires.

| Term | Meaning in this brief |
| --- | --- |
| Carrier | An organisation outside the state that holds a capability for a population: it organises, delivers, teaches or mobilises. A church, a cooperative, a union, an NGO, a criminal faction. |
| State reach | The density of public service points per resident in a place: health units, schools, social-assistance centres. |
| Low reach | A place where state reach falls behind population, usually after fast population growth. |
| Presence | The share of a population in a religious tradition, or the density of carriers of one kind. D169 part 2. |
| Settlement | The relation a state takes to a carrier: partner, parallel or capture. |
| Congregational turn | The shift from belonging by place (a parish, a village) to belonging by chosen network (a congregation). |

"Gap" keeps its NCB meaning, a declared indicator with no data. This brief
never uses it for a place the state does not serve.

## Why this matters to NCB

The lens is useful only if it serves the claim under test. It does that in
four places.

### 1. It observes the process the national score cannot see

`docs/WHY.md`: "Capability changes below the national level. It changes when a
group gains the agency, knowledge, tools and connections to build something,
then repeats it. A national score cannot see that directly."

A church that opens, grows, splits and opens again is that process, and in
Brazil it leaves an administrative trace: a CNPJ registration with an opening
date, a closing date and a municipality. Very few organisations outside the
state leave a trace like this at that scale. The lens gives the project one
observable case of the micro-process its national score claims to be a proxy
for.

### 2. It tests the Envisioning strategy directly

The strategy argues that capacity is dispersed and that countries often lack
the means to make it accumulate. Carrier networks are dispersed capacity that
does accumulate, outside the state. If the lens finds that carriers accumulate
where the state does not, that is evidence for the strategy's diagnosis and a
description of one mechanism. If carriers do not accumulate either, the
diagnosis is broader than the state.

### 3. It can explain part of the wealth residual

D68 publishes each dimension score against the score income predicts. A
country above its income line on Coordination or Trust needs an explanation
that is not wealth. Dense carrier networks are one candidate explanation. The
lens can test it (H6). This speaks to the first failure condition in
`docs/WHY.md`: dimensions that collapse into income.

### 4. It addresses named artefacts

- **A3 and A12.** Coordination and Trust are thin and close to GDP. Carriers
  produce Coordination and Trust that national surveys and governance
  composites miss. The lens will not produce a scored indicator quickly, but
  it can produce evidence records and diagnostics for the two weakest
  dimensions.
- **Bonding against bridging trust.** A dense membership network raises trust
  inside it and can lower trust across it. The current Trust indicators do not
  separate the two. The lens names the problem; a future artefact entry
  records it before anyone quotes a Trust score for a carrier-dense country.
- **A1.** Experimentation is inferred from patents. Church founding is
  non-patent institutional experiment at scale. This is a description, not a
  proposal to score church openings as Experimentation. Counting churches as
  innovation would take a side.

## The case: why evangelical churches grow

The mechanism, stated as claims the research can test. The figures are
approximate and need a source memo before any surface quotes them.

- **The shock is urbanisation.** Large populations moved from the countryside
  to urban peripheries in Latin America, sub-Saharan Africa and, earlier,
  Korea. They lost kin and village. State services arrived late.
- **The supply is cheap.** The Catholic model needs a seminary-trained,
  celibate priest. The Pentecostal model needs a lay leader and a room. One
  model scales slowly, the other scales like a franchise. This is the
  supply-side reading in the economics of religion literature (Stark, Finke,
  Chesnut).
- **Belonging changes from place to network.** A parish maps onto territory,
  as the state does. A congregation is a chosen network and ignores territory.
  The state still coordinates by place. A growing share of the population
  coordinates by network. This is the congregational turn, and it is the part
  of the change with the largest consequence for Coordination.
- **Scale.** Brazil moved from about nine in ten Catholic in 1970 to about 57%
  Catholic and 27% evangelical in the 2022 Census. Pew (2014) recorded the same
  direction across Latin America. Guatemala and Honduras are near 40%
  Protestant. Nigeria, Kenya and the Philippines have large Pentecostal and
  charismatic sectors. Korea's Protestant growth ran beside its
  industrialisation and then stopped.

## What a carrier changes, by dimension

Every row has a gain and a cost. The lens records both. It never nets them.

| Dimension | Gain | Cost |
| --- | --- | --- |
| Agency | Sobriety, saving and business discipline. Household money moves from alcohol to the family (Brusco, Colombia). An exit from addiction and crime. | Prosperity teaching moves money upward to the leadership. |
| Coordination | Fast mobilisation by network: disasters, food, shelter, votes. | The network does not align with the state's territorial units. |
| Trust | High trust between strangers who share membership. | The same trust can stop at the edge of the membership. |
| Learning | Mass literacy, public speaking and leadership practice. Own media: television, radio, messaging groups. | A parallel information system that can carry distrust of science. |
| Experimentation | Very cheap to start, split and close an organisation. | Little quality control or accountability. |
| Adaptability | Present in the periphery before the state is. | Present for members first. |
| Building | A building in every neighbourhood. | Few of them connect to public systems. |
| Shared purpose | A clear common project for members. | A competing national project and a source of polarisation. |

## Settlement: the three forms

The settlement is a choice a state makes. It is the part of the lens most
useful to a reader asking what a country can do.

| Form | What it looks like | Observable markers |
| --- | --- | --- |
| Partner | The state contracts the carrier to deliver. | `funds` and `delivers_with` edges from public bodies to carriers. Brazil: Santas Casas inside SUS, federally funded therapeutic communities. |
| Parallel | Both serve the same people and ignore each other. | Carrier presence high, no edges between the carrier and public bodies. |
| Capture | The carrier takes state power and sets the agenda by membership. | Carrier-titled candidates elected, a parliamentary caucus acting as veto player, `regulates` edges pointing the wrong way in practice. |

A country can show all three at once in different sectors or places. The lens
records the mix, not a single label.

Korea is the comparison case: churches absorbed the urbanisation shock and
mostly became partners. Whether Brazil, Guatemala or Nigeria follow that path
is an open empirical question, and the lens does not predict it.

## Hypotheses

Each hypothesis names what would falsify it. A result in either direction is a
finding. Every cross-place result is a hint (A8), not a causal claim.

| Id | Hypothesis | Unit | Falsified if |
| --- | --- | --- | --- |
| H1 | Carriers open where state reach is low. | Brazilian municipality, year | Church openings are unrelated to state reach, or open where reach is high. |
| H2 | Carriers open after population inflow. | Municipality, year | Openings do not follow population growth or migration. |
| H3 | Carrier density goes with later change in local outcomes. | Municipality, year | No association with homicide, school completion or women's labour participation after controls. |
| H4 | Carriers move into the state where they are dense. | Municipality, election | Carrier-titled candidates are not more frequent or more successful where carrier density is high. |
| H5 | The settlement form can be read from the institution map. | Country | The `funds`, `delivers_with` and `regulates` edges do not separate the three forms. |
| H6 | Carrier density explains part of the wealth residual. | Country | Residuals on Coordination and Trust are unrelated to carrier presence. |

H1 to H4 use Brazilian municipal data. H5 uses the institution layer. H6 uses
the national presence layer and D68.

## Candidate sources

None of these has a source memo or a preflight. "Candidate" means a publisher
exists and the series appears to fit. Step 2 of the roadmap workflow applies to
each one.

### Brazil, municipal

| Use | Source | Field | Open question |
| --- | --- | --- | --- |
| Carrier openings and closings | Receita Federal, CNPJ open data | Legal nature 322-0, Organização Religiosa; start date; status and status date; municipality | Informal churches never register. How far back the opening dates are reliable. |
| State reach: health | DATASUS CNES | Establishments by type and municipality | Which establishment types count. |
| State reach: schools | INEP Censo Escolar | Public schools by municipality | Public only, or all. |
| State reach: social assistance | Censo SUAS | CRAS units by municipality | Series start year. |
| Presence | IBGE Census 2022, religion | Population by religion | Whether the municipal tables are published and at what detail. |
| Population inflow | IBGE estimates, Census 2022 | Population change, migration items | Whether migration is available at municipal level. |
| Outcomes | DATASUS SIM, INEP, IBGE | Homicide, school completion, labour | Small-number noise in small municipalities. |
| Carriers in politics | TSE candidate data | Ballot name, occupation, result | Ballot titles ("Pastor", "Bispo", "Missionário") undercount. Other traditions use other titles. |

### National, 53 countries

| Use | Source | Open question |
| --- | --- | --- |
| Presence by tradition | National censuses where one asks; Pew religious composition | Census years differ. Pew values are modelled for countries without a census question. |
| Presence by tradition | World Religion Database | Subscription licence. May fail the inspectability rule. |
| Membership and bridging trust | WVS and EVS: active membership of a religious organisation; trust in people of another religion | Wave and country coverage across the 53. |
| Trust in religious bodies | Latinobarómetro, Afrobarometer | Regional only. |
| Restrictions on religion | Pew Government Restrictions and Social Hostilities indexes | A scoring question. Separate decision. |

Brazil has an unusually complete open stack at municipal level. That joined
panel is new, as far as the brief knows. It is also why the work starts with
Brazil, consistent with `docs/WHY.md`. The national presence layer applies to
all 53 countries on the same terms.

## What the data looks like and who uses it

The docs name three audiences. Phase one asks researchers to try to falsify
the framework (D50). The first institutional audience is Brazilian and
regional (D51, `docs/WHY.md`). Machines read the same data through the API,
the Data Package and `/llms.txt` (D37). The docs define no other audience, and
this brief does not add one.

### Four outputs

**1. The Brazil municipal panel (CARRIERS-1).** One row per municipality and
year. Counts and densities only. Illustrative shape, not a schema:

```
{ municipalityCode, year,
  carriers:   { opened, closed, active, activePer10k, legalNature: "322-0" },
  stateReach: { healthUnitsPer10k, publicSchoolsPer10k, crasPer10k },
  population: { total, changeFromPriorYear },
  politics:   { carrierTitledCandidates, carrierTitledElected },   // election years only
  source:     { per field: publisher, series, retrievedAt } }
```

Every field keeps its source, as every observation does. No row carries a
score.

**2. The national presence layer (CARRIERS-2).** One row per country,
tradition and year: share of population, source, year, and whether the value
is counted (census) or modelled (Pew). It is context data beside the country
page and never enters a score.

**3. Carrier nodes in the institution map (CARRIERS-3).** Religious and other
carrier bodies as nodes with the D169 `tradition` tag, and the edges that show
the settlement: `funds`, `delivers_with`, `regulates`.

**4. Evidence records and diagnostics (CARRIERS-4, CARRIERS-6).** Documented
deliveries, and a review entry on presence against the wealth residual.

### How each audience uses them

| Audience | Output | Use |
| --- | --- | --- |
| Researcher | Municipal panel through the Data Package | Download, test H1 to H4, publish a result or a challenge. The joined panel is the output most likely to be new to them. |
| Researcher | Presence layer, residual review | Test H6 against the 53-country frame. |
| Brazilian institution | Municipal panel on `/country/BRA/local` | See where state reach falls behind population and how carrier activity moved there over time. Description only: the site gives no advice (`docs/WHY.md`). |
| Brazilian institution | Carrier nodes in `/network` | See which carriers already deliver inside a public system, and through which public body. For example, which philanthropic hospitals the health system funds. |
| Regional institution | Presence layer, settlement edges | Compare how countries in the region relate to carriers. |
| Any reader | Country page | Read the presence composition beside the network, with source and year, as context for the radar. |
| Agenda | Carrier nodes | An agenda item can name a carrier through `institutionIds` only where a sourced partner edge exists. A carrier with no edge to a public body is not something the country acts through. |
| Delphi panel | Presence layer, nodes | Name carriers and settlement per country and list missing evidence (CARRIERS-5). |

### Publication rule: counts, never lists

The CNPJ register names every registered religious organisation, with its
address. The panel publishes counts and densities per municipality. It never
publishes the list of organisations, their names or their addresses, even
though the source is public. Afro-Brazilian terreiros face attacks, and a
joined, searchable map of where each one is would make that easier. A carrier
enters as a named node only through the institution inclusion rules, which
admit bodies with a recurring public role, not each place of worship.

The same rule limits misuse in the other direction. A per-municipality count
of churches beside carrier-titled election results is useful to a campaign.
The panel aggregates to the municipality and publishes no finer unit.

## Work packages

Each package names its track, as the roadmap requires.

| Id | Track | Output | Depends on |
| --- | --- | --- | --- |
| CARRIERS-0 | Research | This brief. | D169 |
| CARRIERS-1 | Source-backed, diagnostic | Source memo and preflight for the Brazil municipal panel: CNPJ 322-0 first, then CNES, Censo Escolar, Censo SUAS, TSE. Coverage, years, joins on municipality code. | Decision on municipal geometry |
| CARRIERS-2 | Source-backed, context | Source memo for the national presence layer across 53 countries. Licence check on WRD. | D169 |
| CARRIERS-3 | Institutions | Schema change from D169, then religious and other carrier nodes in `BRA.json` and the global ledger. | D169 |
| CARRIERS-4 | Evidence | Evidence records under `docs/EVIDENCE.md`: Pastoral da Criança, carrier response to the 2024 Rio Grande do Sul floods, federally funded therapeutic communities. | None |
| CARRIERS-5 | Delphi | A carriers prompt for panelists: name the carriers and the settlement form for each country, and list the missing evidence. Output is research leads only. | CARRIERS-2 |
| CARRIERS-6 | Diagnostic | H6: presence against the D68 residual, per dimension. A review entry in `docs/reviews/`. | CARRIERS-2 |

CARRIERS-4 can start now. It needs no schema change and no new source.
CARRIERS-1 is the package most likely to produce something new, and it is
blocked on one decision.

## Decisions needed before building

1. **Municipal geometry.** D66 and D89 define a state-level subnational layer
   for Brazil. H1 to H4 need 5,570 municipalities. That is a new geometry and
   needs its own decision: whether it lives in the subnational registry, what
   reconciliation rule it carries, and whether it publishes or stays in
   diagnostics.
2. **Criminal factions as carriers.** They fit the definition. They are also
   the most sensitive carrier to map, and their sources are journalism and
   security research, not registries. Recommendation: evidence records only,
   from published research, and no nodes.
3. **Non-religious carriers.** Unions, cooperatives and NGOs use the same
   `community_life` system from D169. Whether CARRIERS-1 includes their CNPJ
   legal natures from the start, or religion first and others after.
4. **The name of the lens on reader surfaces.** "Carriers" is a working name.

## What this must never become

- **A ranking of traditions or churches.** D169 forbids it. A map that shows
  which faith "does more" takes a side.
- **A capability score for a carrier, a municipality or a state.** The D89
  rule applies unchanged.
- **A scored indicator built from religiosity.** Religiosity falls as income
  rises, so it would make A3 worse.
- **Evangelicals only.** Catholic social networks, Spiritist charity,
  Afro-Brazilian terreiros, Muslim, Jewish and Indigenous bodies are carriers
  on the same terms. Some terreiros face attacks from some evangelical groups.
  Leaving them out is a choice that takes a side.
- **Policy advice.** `docs/WHY.md` rules it out. The lens describes the
  settlement a country has. It does not recommend one.
- **A causal claim from cross-place data.** H1 to H6 produce associations.
  A causal claim needs a design the brief does not have yet.

## What would end the lens

- CNPJ 322-0 cannot place openings in time or place reliably. H1 to H4 then
  have no carrier series, and the lens falls back to evidence records.
- Carrier density adds nothing to the residual (H6 falsified) and the
  municipal hypotheses show no pattern. The lens then describes Brazil and
  explains nothing the frame needs.
- Readers treat presence or settlement as a judgement of a faith or a country.
  The layer then comes off reader surfaces and stays in diagnostics, as D169
  states.
