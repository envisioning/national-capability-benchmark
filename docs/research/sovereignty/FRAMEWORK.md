# Sovereign technological capability: framework

*SOV-1 (#103). Decision D171. Research only: nothing in this layer enters a
score, a confidence, the frame, the panel or the viewer, and it publishes no
index and no ranking. Records live in `data/sovereignty/{ISO3}.json`, are
checked by `pnpm bench sovereignty validate`, and are read in
[CATALOG-BRA.md](CATALOG-BRA.md).*

The nine dimensions ask what a country can do. This layer asks a narrower
question about one kind of thing a country can do: for a specific
technological capability that matters to the country, **where does control
sit at each stage of its life, and what would stop it working?**

It is a descriptive record, not a tenth dimension. It does not add up. A
country with thirty records of foreign provision and a country with three of
verified control are not comparable by counting, because the records are
chosen for what they show, not sampled from a population (see "What a case
is" below). It is also distinct from the Exponential Leverage proposal
(#12), which asks how far a capability multiplies other capability; this
layer asks who can stop it.

---

## 1. Terms

Each term is defined by what a researcher would observe. Where everyday use
is looser, this definition wins inside the layer.

**Technological sovereignty.** The ability of a country's own institutions
to keep a nationally material technological function working, change it,
and replace any part of it, on decisions taken under the country's own law,
when a foreign party withdraws, refuses or is compelled by its own law to
act. It is a property of one function at one stage, not of a country or an
industry. It does not require that everything be made at home: a function
built on imported parts with documented, usable substitutes can be
sovereign at that stage.

**Strategic autonomy.** The wider political room to choose: to decide
whether to depend, on whom, and on what terms. A country can have strategic
autonomy and choose dependence (buying a launch on the open market), or
lack it while operating a domestic system (a single foreign supplier it
cannot refuse). This layer records the evidence autonomy would rest on; it
does not judge whether a dependence was wise.

**Supplier dependence.** A stage relies on an input, service, licence or
skill that only a foreign party currently supplies. Recorded as a
dependency with its supplier, the jurisdiction the supplier answers to, the
substitutes and the time to switch. Dependence is not the same as import:
an imported commodity with many suppliers in many jurisdictions is a weak
dependence; a domestic product built on one foreign vendor's proprietary
platform is a strong one.

**Resilience.** Whether the function keeps working, or recovers, when a
dependency fails: an embargo, a sanction, a vendor exit, a cable cut, an
export licence withdrawn. Recorded as switching and recovery ability with
evidence (a drill, a documented fallback, a previous disruption and what
happened). An untested fallback is recorded as untested.

**Competitiveness.** Whether the capability holds its place against
alternatives on cost, quality or market share. Recorded only where it bears
on control: a domestic capability that cannot sell may not survive to be
controlled. Competitiveness is not sovereignty. A world-leading exporter can
depend on one foreign engine; a protected domestic supplier can be
sovereign and uncompetitive.

### Five things that are not the same

| Observed fact | What it shows | What it does not show |
| --- | --- | --- |
| **Ownership**: a domestic entity owns the asset or company | who receives the profit and appoints the board | who can design, repair or replace it |
| **Domestic operation**: domestic staff run it day to day | that the skill to run it exists at home | that it runs without foreign licences, updates or parts |
| **Domestic design**: the architecture and IP were produced at home | the ability to specify and change the system | that it can be built at home |
| **Manufacturing**: the physical product is made at home | production capacity | that the critical components, tools or inputs are made at home |
| **Effective control**: domestic institutions can keep it working, change it and replace parts under domestic law | sovereignty at that stage | anything about other stages |

**Data residency is not control.** A server in a Brazilian data centre
operated by a company subject to a foreign law that can compel access, or
whose software stops receiving updates when a foreign licence ends, is
domestic residency under foreign-dependent operation. Residency is recorded
as a fact about the deployment stage; it never by itself earns `verified`
at operation or governance.

**Nationality of a brand or a paper is not control.** A Brazilian brand on
an imported product, a patent filed by a Brazilian inventor, or a research
paper by a Brazilian team is a lead. It supports a classification only at
the stage it documents (research, or design and IP) and only when the
source shows the work was done and is held at home.

---

## 2. Lifecycle stages

Every record classifies all eight stages, in this order. A stage with no
evidence is `unknown`, never skipped.

| Id | Stage | The question it answers |
| --- | --- | --- |
| `research` | Research | Is the underlying science and engineering knowledge produced and held by domestic institutions? |
| `design_ip` | Design and IP | Who specifies the system and who owns or licenses the intellectual property needed to change it? |
| `components` | Critical components | Where do the components, materials or inputs without which the system cannot be built come from? |
| `production` | Production and integration | Who manufactures, assembles, integrates or (for software) builds and releases it? |
| `deployment` | Deployment | Who installs, launches, rolls out or puts it into service, and where does it physically sit? |
| `operation` | Operation | Who runs it day to day, and can they keep running it without a foreign party's continuing permission? |
| `maintenance` | Maintenance and upgrades | Who repairs, patches, supplies spares and upgrades it over its life? |
| `governance` | Governance and standards | Under whose law, regulator and technical standards does it operate, and who can change the rules? |

A stage that does not apply to a function (a payment rule set has no
physical components) is classified on its nearest real counterpart (the
hardware and software the system runs on) and the `basis` says so.

---

## 3. Control classifications

One classification per stage. The test is applied in order: the first that
fits is the classification.

1. **`unknown`.** No fetched source settles who controls the stage, or the
   sources contradict each other and neither is clearly stronger. Unknown is
   a finding, not a failure: it is the research agenda. Never guess to
   avoid it.

2. **`foreign_provision`.** A foreign party performs the stage. The
   domestic side buys the result: a satellite built abroad, a launch on a
   foreign rocket, an imported fertiliser, a foreign cloud service consumed
   as a service.

3. **`foreign_dependent_operation`.** Domestic actors perform the stage,
   but a documented input, licence, service or skill that only a foreign
   party supplies is needed to keep performing it, and no usable substitute
   is documented. Domestic staff operating foreign-licensed software in a
   domestic building is the type case.

4. **`partial`** (partial or joint control). Control is shared by contract
   or ownership (co-development, licensed production, a joint venture, a
   technology-transfer agreement still in force), or a domestic route exists
   but carries only part of the need beside a foreign one. Both halves must
   be sourced.

5. **`verified`.** A named domestic institution performs the stage, a
   fetched source documents it doing so, and either no foreign input at this
   stage can stop it or every such input has a documented substitute that
   is in use or has been exercised. `verified` is the hardest label to earn
   and the one most likely to be challenged; every `verified` stage carries
   at least one source.

The classifications describe a stage, never a sector. "Aerospace" has no
classification. "The E2's engines at the components stage" has one.

### Worked tie-breakers

- **Imported but plural.** Many foreign suppliers in several jurisdictions,
  with a record of switching: `verified` is possible if the stage is
  otherwise domestic, and the dependency is still recorded. One foreign
  supplier, or several under one jurisdiction's export control:
  `foreign_dependent_operation`.
- **Licensed technology.** A licence that has been fully transferred,
  with domestic staff who have changed the design since: `verified` at
  design. A licence still in force that the licensor can end: `partial`.
- **Open source.** An open-source dependency the domestic side can fork,
  build and maintain without the upstream: not a foreign dependency in
  itself. Record it as `open_source` with the upstream named; if the
  domestic side has never built or patched it, say so in `switching`.
- **State-owned and foreign-dependent.** Domestic state ownership does not
  change the classification. A state company running foreign-licensed
  software is `foreign_dependent_operation` at operation.

---

## 4. Evidence fields

A record is one capability in one country. The schema is
`SovereigntyCase` in `packages/core/src/sovereignty/schema.ts`. Field by
field:

- **`id`**: `{iso3}.sov.{slug}`, lowercase, stable for the life of the
  record. The slug is the name people use for the capability (`bra.sov.pix`),
  never a judgment.
- **`title`**, **`domain`**: the capability's name and one of the domains in
  `SovereigntyDomain`. A domain is a filing label, never a unit of
  assessment.
- **`function`**: what the capability does, in one sentence a sceptic could
  check. "Settles retail payments between accounts at different
  institutions in under ten seconds, every day of the year", never "digital
  sovereignty in payments".
- **`status`**: `deployed` (in national service now), `demonstrated` (works,
  shown in service or test, not at national scale), `pilot`, `proposed`, or
  `discontinued`. `statusSourceIds` must name a fetched source; the
  validator refuses `deployed` or `demonstrated` without one.
- **`organizations`**: each with `name`, `role`, `country` (ISO3, or the
  foreign party's), and `institutionId` where the organisation is a node in
  `data/institutions`. The validator checks that the id exists.
- **`stages`**: all eight, each with `control`, `basis` (one or two
  sentences naming the fact the classification rests on) and `sourceIds`.
  Any classification other than `unknown` needs at least one fetched
  source.
- **`dependencies`**: each with `kind` (`imported_input`, `single_vendor`,
  `foreign_jurisdiction`, `foreign_licence`, `open_source`,
  `foreign_service`, `skills`), `stage`, `item`, `supplier`,
  `jurisdiction` (ISO3 or `multiple` or `unknown`), `substitutes`,
  `switching` (what it would take to replace it, and how long, or `unknown`)
  and `sourceIds`. An imported engine, a foreign-built satellite or a
  foreign-hosted service stays visible here even when the system is
  Brazilian-designed.
- **`counterevidence`**: claims that cut against the record's own
  classifications, each with sources. Required to be considered, allowed to
  be empty, and an empty list on a record with a `verified` stage is a
  warning.
- **`uncertainty`**: what the record cannot settle and why.
- **`challengesNarrative`**: true when the case shows a dependence,
  reversal or failure that a national success story would omit. The
  catalogue must carry such cases; see the selection rule below.
- **`sources`**: each with `id` (local to the record), `url`, `publisher`,
  `title`, `published` (year, or `null` when undated), `accessed`
  (YYYY-MM-DD) and `access`: `fetched` (the researcher opened the page and
  read the claim there) or `blocked` (the page would not load; recorded so
  the next researcher knows it was tried). Only a `fetched` source supports
  a claim. `quote` holds a short verbatim excerpt in the original language,
  so an auditor can find the claim on the page.
- **`reviewedAt`**: the date the whole record was last checked.

---

## 5. Inclusion and evidence standard

### What a case is

A case enters when both of these hold:

1. **A specific, nationally material function.** The capability does a
   named thing that matters at national scale: it carries payments, feeds
   the country, powers the grid, defends the territory, protects health or
   runs the state. "Brazil's tech sector" is not a case.
2. **A documented capability or a documented dependence.** A fetched source
   shows the function being performed, built or attempted, or shows the
   country depending on someone else for it. A plan or strategy alone is a
   case only with `status: proposed`, and never earns `verified` at any
   stage past `research`.

### Evidence rules

- **Read before you write.** Open the page and read the claim there. A
  search snippet, a memory or a press summary of a press release is a lead.
  This is the verification protocol of `docs/EVIDENCE.md`, applied here.
- **Provenance travels with every claim.** URL, publisher, year, access
  date, and a quote. A claim no fetched source carries is `unknown`.
- **Observed status, not ambition.** Record what is running, not what a
  launch said would run. When a source is the programme describing itself,
  say so in `basis` or `uncertainty`.
- **Limitations and contradictions are part of the record.** Contradictory
  sources go in `counterevidence`, not in a footnote and not out.
- **Open sources only.** D154 applies: every source opens without an
  account. A source behind a login or a paywall is not cited; if it is the
  only one, the claim is `unknown`.
- **No inference from nationality.** See section 1.

### Selection rule

The catalogue is chosen, not sampled, so it must be chosen against its own
bias. For every three records, at least one has `challengesNarrative: true`.
The validator warns below that quota. A catalogue of national triumphs is a
brochure, and the evidence layer already learned that (`docs/EVIDENCE.md`).

### Reproducibility between researchers

Two researchers given the same source list should reach the same
classification at each stage, because each label is a test on documented
facts, applied in a fixed order. Where they do not, the disagreement is
recorded in the record's `uncertainty` with both readings and the stage is
`unknown` until a source settles it. The first audit is an open item for
MZ (section 8).

### Updating

Each record is re-checked once a year, or when its status changes. A
re-check opens every `fetched` source again, updates `accessed`, and moves
a source that no longer carries the claim to `blocked` with a note, which
turns the stage it supported back to `unknown` unless another source holds
it. `reviewedAt` moves only when every source has been re-opened.

---

## 6. Testing the rubric on four Brazilian cases

The rubric was applied to four contrasting cases before the catalogue was
built. The full records, with sources, are in `data/sovereignty/BRA.json`
and summarised in [CATALOG-BRA.md](CATALOG-BRA.md). This section records
what the test showed about the rubric, not about the cases.

{{RUBRIC_TEST}}

---

## 7. What this layer will not do

- It will not produce a sovereignty score, index or ranking, for Brazil or
  across countries. The records are not a sample and their count measures
  research effort.
- It will not feed any of the nine dimensions, their confidence, the
  frame, the panel or #12's leverage outputs. A future link to a dimension
  is a separate decision.
- It will not recommend. "Brazil should build its own fab" is not in any
  record. A dependency recorded is a fact, not a target.
- It will not be published in the viewer until a separate publication
  decision.

## 8. Open questions for MZ

- Whether the first inter-researcher audit is done by a person or, as D154
  allowed for the foresight register, by a second model family from the
  source list alone.
- Whether a second country follows Brazil, and which, given that the
  framework's tie-breakers were tuned on Brazilian cases.
- Whether `challengesNarrative` should become a quota checked as an error
  rather than a warning.
