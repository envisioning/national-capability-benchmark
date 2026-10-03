# Foresight register codebook

Version **1.3**, fixed 2026-10-03 before the pilot recode under it and before the frame is coded. Changes from
earlier versions and the reason for each are listed under "Changelog" at the
foot of the file.

The coding rule for a project-authored register that would fill
`government_foresight_capacity` ("existence, mandate and continuity of a
national strategic foresight function"). Recommendation 1 of
`docs/research/anticipation/O1-CANDIDATES.md`, decided as a pilot on
issue #68 on 2026-10-02: ten countries, this rule fixed before any country is
coded, two independent coders, nothing scored until the pilot is reviewed.

Version 1.0 was fixed on 2026-10-02 and committed before the first coding.
Version 1.1 settles the eight ambiguities the pilot found
(`FORESIGHT-REGISTER-PILOT.md`) and the owner's ruling on I1, and is committed
before the recode. Version 1.2 settles how a parent body and a foresight unit
inside it are coded, and how I4 is carried while it is unvalidated, and is
committed before the 53 are coded. Version 1.3 settles whose product a
product is, and how a primary page that does not render is read, after the
round 2 spot-check overturned three of 11 sampled bodies on those points
(`FORESIGHT-REGISTER-SPOTCHECK.md`); it is committed before the ten are
recoded under it. A change to anything in this file after
coding starts is
a new version of the codebook, recorded at the foot of the file with the
reason, and every country is recoded under it.
No item is reweighted, redefined or dropped after the codes are seen, to move
a correlation (D118).

Coding date: **2026-10-02**. Every window below counts back from it.

---

## 1. The unit: a government foresight function

A **government foresight function** (GFF) is an organisational body of the
national state that meets all four conditions:

1. **Of the state.** A ministry, department, agency, directorate or unit of
   the national executive, a statutory public body, or an organ of the
   national legislature (a committee, office or institute of parliament). A
   body set up by the state but run by a contractor counts when the state
   holds the mandate and the contract (the German Bundestag's TAB is the
   example). A **public-law body** counts as of the state whatever its legal
   name (foundation, autarchy, institute, agency) when all three hold: an
   act or decree of the national state created it; it is attached to and
   supervised by a ministry, the centre of government or the legislature;
   and the state appoints its head. A private-law foundation, a company, a
   university or a university centre is not of the state, even when public
   money or a public mandate funds it.
2. **Standing.** It exists without an end date. A commission, task force or
   project with a sunset clause or a single deliverable is not standing.
3. **Mandated for foresight.** A written mandate (the founding act, an
   organisational regulation, standing orders, or the body's own official
   "about" page) names as a function of the body the exploration of the
   long-term future: alternative futures, scenarios, megatrends, horizon
   scanning, emerging change, or long-range technology assessment, with a
   horizon of at least ten years or no stated horizon.
   - **Impact assessment is not technology assessment.** A mandate to assess
     the impact, feasibility or cost of laws, policies, plans or
     technologies in general meets condition 3 only when it also names new
     or emerging technologies or scientific developments, or the long-term
     future, as its object. Ex-ante regulatory impact assessment, policy
     evaluation and studies commissioned case by case do not meet it on
     their own.
   - **The named function is read from its term.** The terms that name a
     foresight function are: foresight, strategic foresight, futures or
     futures studies, prospective (French), prospectiva or prospectivo
     (Spanish, Portuguese), Vorausschau or Zukunftsforschung, long-term
     scenarios, alternative futures, megatrends, horizon scanning, and their
     direct equivalents in the official language. "Prospects", "outlook",
     "perspectives", "forecast", "projections", "development orientation"
     and "vision" do not name one: they describe the expected path of one
     plan or economy, not an exploration of alternatives. The coder records
     the original term and its gloss.
4. **Not confined to one sector.** The mandate reaches across policy domains.
   A body whose foresight mandate covers one sector only (defence, energy,
   climate, agriculture, health, labour market, or science and technology
   policy alone) does not count. Technology assessment for a legislature
   counts, because emerging technology is assessed for every committee and
   every domain it touches.

**What does not count, on its own:**

- A planning office or ministry whose product is the national development
  plan, a five-year plan, or a multi-year investment plan. A plan is a
  commitment about the next plan period, not an exploration of futures. A
  planning body counts only when condition 3 is met by a named function,
  one of the terms listed under condition 3, in its act, organisational
  regulation or official page, and condition 3 is then read on that
  function, not on the plan. "Development prospects" in a planning
  institute's mandate is not a named function.
- A long-term vision document (Vision 2030, 2045, 2050), however long its
  horizon, unless a standing body that meets 1 to 4 produced it and keeps
  producing.
- Statistics offices, central banks, fiscal councils, budget offices and
  debt offices, including their long-term projections. These project one
  variable under stated assumptions; they are not foresight functions.
- Universities, think tanks, foundations, NGOs, consultancies, and donor or
  UN projects, even when government funds or hosts them. A public-law body
  that meets condition 1 (Finland's Sitra, created by statute and answering
  to parliament, is one) counts only when its act or statute names
  foresight as a function under condition 3; coders record the legal form
  either way.
- A single event, workshop, training or exercise.
- Sub-national bodies.

A country may have more than one GFF. Coders list every candidate body they
examine, whether it meets the unit or not, with the per-body codes section 5
asks for, and code the country from the bodies that meet it as section 2
says. The country item is 1 when any operating GFF carries it.

**Parent bodies and the units inside them.** Every body is judged on its own
mandate, and a body's mandate is not read from a unit inside it, nor a unit's
from the body that houses it.

- A **unit** (a centre, office or team) inside a larger body is a candidate
  of its own. It is a GFF when its own mandate meets section 1: it is of the
  state as part of its parent, so condition 1 holds, and conditions 2 to 4
  are read on what the record says the unit does.
- A **parent** is a GFF of its own only when the parent's own mandate (its
  act, organisational regulation or official page) names a foresight
  function under condition 3 and meets condition 4. Housing a foresight unit
  does not make a parent a GFF. A head of government's office, a cabinet
  office or a ministry whose own mandate names no foresight function is not
  listed as a GFF; the coder names it in the unit's `unitNote` as the
  unit's home.
- When both meet section 1, **both are listed and coded**, each with its own
  dates, status and body codes. A parent that closes, merges or is renamed
  while its unit continues is recorded as ended on the date the record gives,
  and the continuing unit is read as its successor under I4 when it meets
  the successor test there. Coding both cannot count anything twice, because
  the country items are the maximum over bodies.
- A **closed predecessor** is listed like any other candidate. I4 asks for
  every GFF established since 1990, operating or not, and that includes a
  parent or predecessor whose foresight unit or successor still operates.
  A coder who treats such a body as the lineage of a body still operating,
  and does not list it, has missed a body.
- **Dates stay with the body.** A unit's establishment date is the earliest
  date on the record at which the unit itself held a foresight mandate, never
  its parent's or predecessor's. I3 is read on each body's own dates, so a
  successor does not inherit its predecessor's survival.

Why, on the construct: the unit of this register is a body the state has
mandated for foresight, and the mandate is what the state put on its record
for that body. Reading a parent's mandate from its unit would make every
office that houses a futures team a foresight body; reading a unit's
history from its parent would let a body claim a survival it has not shown,
because a mandate moved into a new body is a new decision by whoever moved
it, and that person can still end it. A reorganisation is not a reversal,
which I4's successor rule already provides, so a lineage costs nothing on
I4 and earns nothing on I3.

## 2. The items

Each item is coded at the country level, from the GFFs the coder listed. Each
item is `1`, `0`, or for I3 only, a `0` with the reason `no_change`.

### I1. Established on the official record, with a date

`1` when at least one GFF that is operating on the coding date has an
**official record that dates its creation**, or the grant of its foresight
mandate. An official record is any of:

- a published act: a law, decree, executive order, cabinet or council
  decision, parliamentary resolution, change to standing orders, or an
  organisational regulation issued under one;
- an official government or legislature page (an official URL as I2
  defines it) that states when the body was established or received the
  mandate, such as "set up in the Prime Minister's Office in 2009", or an
  official announcement of the cabinet restructure that created it.

The item reads the function, not the paperwork: it asks whether the state
has put on its own record that it created this body, and when. A cabinet
restructure announced on an official page without a published decree meets
it, and so does a resolution of a House of the legislature. News, encyclopaedias, international organisations and academic papers
do not, though they may lead to a record that does. The coder records the
record's name or URL, its number where it has one, and the date it gives
(at least the year).

`0` when no operating GFF exists, or when no official record of the state
dates any operating GFF's creation or mandate.

### I2. A forward-looking product in the last three years

`1` when at least one operating GFF published a forward-looking product dated
between **2023-10-02 and 2026-10-02**, authored by the GFF, at an official
URL.

A forward-looking product is a document whose main subject is the long-term
future: a scenario set, a megatrends or trends report, a horizon scan, a
futures report to government or parliament, a technology assessment of an
emerging technology. An activity report, a strategy or plan, a budget, a
press release, a news item, an event page or a methods toolkit is not a
product. An official URL is on a domain the state or the legislature
controls (for example `gov.sg`, `riigikogu.ee`, `bundestag.de`,
`gov.br`), or the GFF's own domain when its official pages state that it is
the GFF's site.

- **Horizon.** The product's stated horizon is at least ten years after its
  publication date, or it states no horizon and is one of the forms above.
  A product whose stated horizon is under ten years (a five-year horizon
  scan, a three-year outlook) does not count. This is the same ten years
  condition 3 asks of a mandate, so a body and its products are read on
  one definition of the long term.
- **Authorship.** A product counts for the body named on it, or on the
  official page that publishes it, **as an institution**: author,
  co-author or issuing body. Co-authorship with a consultancy, a university
  or an international organisation does not disqualify it. A product
  written by a third party and credited to the GFF only as commissioner,
  funder, sponsor or host does not count.
  - **Between bodies of the state.** A product of a unit counts for that
    unit and not for the body that houses it, and a parent's product does
    not count for a unit inside it: the rule section 1 applies to
    mandates. Each body's `product` code reads only the products issued in
    its own name.
  - **Affiliation is not authorship.** The affiliation printed beside an
    individual author's name records employment, not issuance. A product
    issued by one body and written by staff of another counts for the
    issuing body, and for the other only when the product or its page
    names that body as an institution (as author, co-author or issuing
    body, or in a credit line or logo block naming it).

`0` otherwise, including when a product exists only on a third-party site.

### I3. Survived a change of chief executive

`1` when at least one operating GFF was established before a change of the
**effective chief executive** and kept operating after it, shown by a
product, a budget line, an act, or an official page dated at least six
months after the change.

The effective chief executive is the person who holds executive power:

- in a parliamentary system, and in a monarchy with a governing prime
  minister, the prime minister;
- in a presidential or semi-presidential system, the president;
- in a one-party state, the leader of the ruling party (China and Vietnam:
  the general secretary; Cuba: the first secretary);
- in a federation of monarchies (the United Arab Emirates), the prime
  minister;
- in a **collegial executive**, where a council holds executive power
  jointly and its chair rotates, the council. A change of the effective
  chief executive occurs on the date by which a majority of the members who
  sat on the council when the GFF was established have left it. The rotating presidency is not a change, because
  the chair holds no executive power the other members lack.

The rule for a collegial executive follows from the construct, not from the
case: the test is whether the function outlived those who could have made
it, and in a collegial executive no single person could; a majority could.

**Any change of the person counts**: an election, a party succession, a
resignation, a death, a coup. A change of ruling party or coalition is not
required. An acting or interim holder of less than six months does not count.

`0` with reason `no_change` when no change of the effective chief executive
has occurred since the GFF was established. Where a body was founded in one
form and received its foresight mandate later, "established" means the
earliest date on the official record at which the body held a foresight
mandate; a statute reissued in the same terms does not reset it. The coder
says which date was used.

`0` with reason `did_not_survive` when the GFF ended at or within two years
after a change. `0` with no reason when no operating GFF exists.

**How closed and non-alternating regimes are read (the A13 risk).** Three
readings were considered:

- *Not applicable, rescale the other items.* Rejected. A closed regime with a
  unit and a recent product would reach 100 on two items, so the absence of
  turnover would be rewarded. That is the A13 inversion: calm that comes from
  having no opposition read as capability.
- *Zero for every closed or non-alternating regime.* Rejected. It would code
  regime type into a capability row, and a party succession that kept a unit
  alive is the same revealed commitment as an election that did.
- *Count every change of the person who holds executive power, by any route,
  and code 0 with reason `no_change` where none has occurred.* **Adopted.**
  The test is whether the function outlived the person who could have made
  it. The same rule binds a democracy whose unit was founded under the
  incumbent: it also codes `no_change`. A one-party state with regular
  leadership succession can pass; a regime where one ruler has held power
  since before the unit was founded cannot yet.

The cost is named: a unit founded under a long-ruling leader reads as
unproven however old it is, and the reason code keeps that visible so a
reader can tell "not yet tested" from "failed". The pilot reports the item by
regime class so the reading can be checked against A13.

### I4. Closed or merged, with date

Recorded for every GFF the coder finds, operating or not, established at any
time since 1990. For each GFF that ended, the coder records the date, the
official record that ended it, and whether a successor took its foresight
mandate within 24 months (named, with its record).

`1` when a GFF ended **between 2016-10-02 and 2026-10-02** with no successor
within 24 months. `0` otherwise, including mergers whose successor carries
the foresight mandate.

**While I4 is unvalidated.** In the pilot I4 was 0 for every country from
every coder, so its reliability has not been measured. It stays in the score
formula unchanged when the 53 are coded, and is coded, adjudicated and
reported like the other items. Its agreement on the 20 percent second coding
of the 53 is reported on its own (section 7), with the number of countries
where either coder coded it 1. If I4 is 1 in **no** country of the 53 after
adjudication, it has added nothing to any score, and whether to drop it is
put to a decision entry before the register is promoted. It is not dropped
by this file, and not after the codes are seen without that entry (D118).
If it is 1 in one or more countries, it stays, and the report says on how
many countries its agreement rests.

**Successor.** A successor is a body that meets section 1, in the same branch
as the closed GFF, and whose foresight mandate is on the official record
(I1's definition) within 24 months after the end. The branch is the
executive (with the statutory and public-law bodies the executive
supervises) or the legislature (with the bodies that answer to it). No act
naming the transfer is needed: a body that receives the mandate on the same
day the GFF closes, by a restructure on the record, is a successor. A body
in the other branch is not a successor, because a closure in the executive
is not undone by a legislature that kept its own office.

## 3. Score from items

```
score = round(100 * (I1 + I2 + I3) / 3) - 20 * I4, floored at 0
```

Possible values: 0, 33, 67, 100, and 13, 47, 80 where a closure applies.

- The three items are equal because none is privileged by the construct:
  existence on the record is mandate, a product is operation, survival is
  continuity, and the gap's definition names all three.
- I4 is a deduction, not an item in the mean, because a closure is a dated
  reversal and the absence of a closure is not evidence of anything. The
  deduction is bounded to ten years so a reversal is read as recent
  behaviour, and is not applied when a successor took the mandate, because a
  reorganisation is not a reversal. A closure with no successor and no other
  GFF already zeroes I1 to I3; the deduction then has no effect beyond the
  floor, which is intended.
- A country with no GFF scores 0. That is a coded value, not a missing value:
  the search was run and found nothing that meets section 1. A country where
  the search could not be run (every official site unreachable) is coded
  `null` with the reason, and is missing.

The score is not published and enters nothing until the pilot is reviewed and
a decision promotes the register. If promoted, its tier is `expert_panel`, as
the gap's registry row already declares.

## 4. Evidence rules

- **Primary official sources only establish an item.** The official gazette
  or legal database, the legislature's site, a government domain, or the
  GFF's own official site. OECD, UNDP, UNESCAP, EU, academic papers,
  Wikipedia, news and search snippets are leads: they may point to a primary
  source, and never carry an item alone.
- **Every `1` cites at least one source**, with: the URL, a Wayback Machine
  snapshot URL (`https://web.archive.org/web/<timestamp>/<url>`), the retrieval date, and a quotation of at most 25
  words from the page that carries the item (the act's name and date, the
  product's title and date, the post-change evidence). A snapshot is
  required: where none exists the coder requests one through
  `https://web.archive.org/save/<url>`. Where the archive refuses or rate
  limits the request, the coder records `archived: null` with the reason
  (`rate_limited`, `blocked`, `save_failed`), and the reviewer requests one
  before promotion.
- **Every `0` records what was searched**: the query terms, the domains, and
  each candidate body rejected with the section 1 condition or the item it
  failed. A `0` without a search record is not a code.
- **Search protocol.** For each country, search at least: the centre of
  government (head of government's office, cabinet office or presidency),
  the planning ministry or agency, the science and technology ministry, and
  the legislature, in English and in the official language(s), with the
  terms foresight, strategic foresight, futures, future generations, horizon
  scanning, megatrends, scenarios, technology assessment, long term, and
  their translations (prospectiva, prospective, Zukunft, Vorausschau,
  toekomst, framtid, tulevaisuus, 미래, 未来, tương lai, and so on).
- **A page that does not render is read before it is coded 0.** A primary
  page that does not render to the coder's fetcher (a legal database or
  gazette that builds its text in the browser, a page that answers 403 to
  a script) is read through a browser-rendered fetch or an archived copy
  (`https://web.archive.org/web/<timestamp>/<url>`) before any item it
  would carry is coded 0. Where neither is possible, the item codes 0 with
  `confidence: "low"` and a note beginning `unrendered: <url>`, and the
  adjudicator renders the page before the code stands. A search-engine
  snippet of the page stays a lead and never carries an item.
- **Dates are read from the source**, never from memory. If a date cannot be
  seen on a primary page, the item it supports codes `0` and the note says
  why.
- **Uncertainty is recorded, not resolved by the coder's prior.** A coder who
  is unsure writes `confidence: "low"` on the item and the reason; the code
  still follows the rule.
- The project's evidence corpus (`data/evidence`) is not read during coding.
  It was built under a different rule (a delivery with a publisher metric,
  EVIDENCE.md) and would leak one reading into the other.

## 5. Coder output

One JSON file per coder:

```json
{
  "coder": "a",
  "codebookVersion": "1.3",
  "codedAt": "2026-10-02",
  "countries": [
    {
      "iso3": "BRA",
      "functions": [
        {
          "name": "official name, and English gloss",
          "level": "executive | legislature | statutory_body",
          "legalForm": "free text",
          "status": "operating | closed | merged",
          "established": { "act": "name and number", "date": "YYYY-MM-DD or YYYY" },
          "ended": { "act": "name", "date": "YYYY-MM-DD", "successor": "name or null" },
          "meetsUnit": true,
          "unitNote": "why it meets or fails section 1, naming the condition",
          "body": {
            "record": 1,
            "product": 1,
            "survived": "1 | no_change | did_not_survive",
            "closedNoSuccessor": 0
          }
        }
      ],
      "items": {
        "I1": { "value": 1, "function": "name", "confidence": "high | low", "note": "", "sources": [] },
        "I2": { "value": 1, "function": "name", "product": { "title": "", "date": "" }, "confidence": "high", "note": "", "sources": [] },
        "I3": { "value": 0, "reason": "no_change | did_not_survive | null", "change": { "from": "", "to": "", "date": "" }, "confidence": "high", "note": "", "sources": [] },
        "I4": { "value": 0, "confidence": "high", "note": "", "sources": [] }
      },
      "score": 67,
      "searched": ["queries and domains"],
      "rejected": [{ "name": "", "failed": "section 1 condition or item", "why": "" }]
    }
  ]
}
```

A source is `{ "url": "", "archived": "", "retrievedAt": "2026-10-02", "quote": "" }`,
with `archivedNote` giving the reason when `archived` is null.

`functions` holds **every candidate body the coder examined**, those that
meet the unit (`meetsUnit: true`) and those that fail it (`false`, with the
condition in `unitNote`). `body` is coded only for bodies that meet the
unit: each field is the item of section 2 read on that body alone. The
country items are the maximum over operating bodies for I1 to I3, and I4
over every body. `rejected` is kept for names the coder dismissed without
examination (a body named in a lead that does not exist).

## 6. Pilot sample: the draw rule

Ten countries, chosen so that every V-Dem Regimes of the World class (2025,
`v2x_regime` via Our World in Data `political-regime`) and every income
quartile (log GDP per capita PPP from `data/out/diagnostics.json`, `income`,
51 countries, quartiles by rank) is present, and the closed class is
oversampled because the A13 risk lives there.

The ten cells, fixed before the draw:

| Regime class | Income quartile cells |
| --- | --- |
| Closed autocracy | Q1, Q2, Q4 |
| Electoral autocracy | Q1, Q4 |
| Electoral democracy | Q1, Q2 (Brazil, fixed), Q3 |
| Liberal democracy | Q3, Q4 |

Within each cell the country is drawn uniformly at random with Python's
`random.Random("ncb-foresight-pilot-2026-10-02")`, cells taken in the table's
order, each cell's candidates sorted by ISO3, `rng.choice` called once per
cell including single-country cells and skipping the Brazil cell. Brazil is
fixed by the owner.
Countries with no income value (Cuba, Venezuela) are not drawn, because the
pilot prints a correlation with income. A cell with one country is not a
draw; the pilot report names those.

## 7. Agreement and the usability threshold

The two coders work independently from this file and the country list only.
Neither sees the other's output, the evidence corpus, or the triage memo.

- **Statistic.** Krippendorff's alpha, nominal, per item (I1, I2, I3, I4)
  over the ten countries; and alpha, interval, on the score. I3's reason code
  is compared as a three-way nominal (`1`, `no_change`, other `0`) as well.
- **Body by body.** Item agreement can hide a disagreement over which bodies
  carry the items, as happened in round 1. The adjudicator matches the two
  coders' candidate bodies into one list per country, by identity: the same
  organisation under the same or a successor name, matched on name, branch
  and founding record, and publishes the matching table. A body either coder
  lists is a unit. Its value for each coder is `1` when that coder found it
  meets section 1, and `0` when the coder rejected it **or did not list
  it**, because a body a coder missed is a body that coder did not count.
  The statistic is Krippendorff's alpha, nominal, over every matched body,
  with percent agreement and a bootstrap over countries printed beside it.
  As a second reading, on the bodies both coders found to meet the unit,
  alpha is computed for each of the four body codes. The body alpha is held
  to the same 0.80 threshold as the items.
- **Threshold.** The register is usable when **alpha is at least 0.80 on
  every item and on the score**. Between 0.667 and 0.80 on any item, the
  codebook is revised at the point the disagreements trace to, and the pilot
  is recoded. Below 0.667 on any item after one revision, the item is
  dropped or the register stops.
- **Degenerate items.** Where an item has no variance across both coders,
  alpha is undefined. The report prints percent agreement, and the item is
  treated as a ceiling or floor (below).
- **Small sample.** With ten units, alpha has a wide interval. The report
  prints a bootstrap interval over countries, and a pass at ten is a reason
  to code the frame, not proof of reliability on 53. The full frame is
  recoded by a second coder on a random 20 percent before promotion.
- **Coders.** In round 1 both coders were instances of one language model.
  In round 2 the two coders are language models of different families, each
  given only this file and the country list, which reduces but does not
  remove correlated error (same search tools, same open web). The report
  says so. Before any score is published, a person checks a sample of about
  20 percent of the coded bodies, drawn with a fixed seed and stratified so
  every regime class appears, against their sources (owner ruling,
  2026-10-02). A check that overturns a body's unit decision or any of its
  codes is reported with the sample's error rate, and the verdict waits on
  it.
  The check's checklist names, for each sampled body, every body the
  adjudication holds as a GFF in that body's country, with each one's body
  codes and the country items, so that the checker can tell whether an
  overturn changes a country item.

## 8. Stop rules and verdict

Decided before coding. After adjudication of disagreements:

- **Ceiling or floor.** Eight or more of the ten countries at the same score:
  stop. The row would not discriminate.
- **Regime sort.** Spearman's rho between the score and the regime class
  (closed 0, electoral autocracy 1, electoral democracy 2, liberal democracy
  3) of 0.80 or more in absolute value: the row is reading regime type, and
  it stops or the unit definition is revised. The mean score by class is
  printed either way.
- **Income.** r with log GDP per capita is printed and decides nothing (D117,
  D118).
- **Verdict.** *Go to 53* when every alpha, item and body by body, is at
  least 0.80 and no stop rule fires; the coding of the 53 then starts after
  the human spot-check passes. *Revise the codebook* when an alpha falls between 0.667 and 0.80 or a
  disagreement traces to a rule this file leaves ambiguous. *Stop* when a stop
  rule fires or an alpha is below 0.667 after one revision.

## Versions

- 1.0, 2026-10-02. Fixed before coding.
- 1.1, 2026-10-02. Fixed before the round 2 recode. See the changelog below.
- 1.2, 2026-10-02. Fixed before the 53 are coded. See the changelog below.
- 1.3, 2026-10-03. Fixed before the pilot recode under it. See the changelog below.

## Changelog

### 1.3, 2026-10-03

Fixed after the round 2 spot-check (`FORESIGHT-REGISTER-SPOTCHECK.md`)
overturned three of the 11 sampled bodies, which fails D148's rule, and
before the ten pilot countries are recoded under it. Each change was decided
on the construct and names no country. Section 1, the items' definitions
and windows, the score, the thresholds and the stop rules read as in 1.2.

1. **Product credit goes to the named issuing body only** (section 2, I2).
   A unit's product is the unit's and not its parent's, and the reverse.
   Why: section 1 already judges each body on its own mandate; I2 reads
   whether a body operates, and the record of operation is what the state
   publishes under that body's name. One overturn read an office's report
   as the product of the ministry that houses it. The country item is the
   maximum over bodies, so this moves an item only where the issuing unit
   fails the unit test.
2. **An affiliation line is not authorship** (section 2, I2). Why: it
   records where an author is employed, not which body issued the product.
   One overturn read a ministry's study as the product of the institute
   that employs its authors.
3. **Unrendered pages are rendered before a 0** (section 4). Why: a 0 that
   says a date could not be read measures the coder's tools, not the
   state's record. One overturn and the adjudicated code it overturned both
   rested on a gazette page neither had read, one through a search snippet.
4. **The spot-check checklist shows the country's other bodies** (section
   7). Why: one overturn was reported as changing a country item because
   the checklist did not show the other body that already carried it.

### 1.2, 2026-10-02

Fixed before any of the 53 is coded, from the two points the round 2 pilot
left open (`FORESIGHT-REGISTER-PILOT.md`, round 2 verdict, and D148). Both
were decided on the construct, and neither rule names a country. No rule the
round 2 spot-check tests was changed: section 1's four conditions, I1 to I4
and their windows, the successor test, the score, the evidence rules and the
thresholds and stop rules of sections 7 and 8 read as in 1.1. The 53 include
the ten pilot countries, which are recoded under 1.2 with the rest.

1. **Parent bodies and their units** (section 1). Every body is judged on
   its own mandate. A unit inside a larger body is a candidate of its own; a
   parent is a GFF only when its own mandate names a foresight function;
   when both qualify both are listed and coded, a parent that ends while its
   unit continues is recorded as ended, and the unit is read as its
   successor under I4's test. Closed predecessors are listed, because I4
   asks for every GFF since 1990. Dates stay with the body, so I3 is never
   inherited. Why: the register's unit is a body the state mandated, and a
   mandate moved to a new body is a new decision that its maker can still
   reverse. In round 2 one coder treated a closed parent as its unit's
   lineage and did not list it, which 1.1 left open; no item depended on it.
2. **I4 while unvalidated** (section 2, I4). I4 stays in the formula, is
   coded and reported on its own in the second coding, and is put to a
   decision entry if it is 1 in no country of the 53. Why: in both pilot
   rounds it was 0 everywhere, so its reliability is unmeasured, and an item
   that never fires adds nothing to any score; but dropping an item after
   the codes are seen is what D118 forbids without a decision.
### 1.1, 2026-10-02

Every change below was decided on the construct, before the round 2 coding,
from the eight ambiguities the round 1 pilot reported and the owner's ruling
of 2026-10-02. The rules name no pilot country as an example, so that the
recode tests the rules and not the round 1 adjudications. None was chosen for its effect on the regime correlation or
on any country's score. The stop rules and thresholds of sections 7 and 8
are unchanged.

1. **I1 reads an official record, not only an act** (owner ruling, and
   pilot ambiguity 4). Renamed "Established on the official record, with a
   date". Any official record of the state that dates the body's creation or
   mandate meets it: a published act, decree or resolution, or an official
   government or legislature page that dates it. Why: the item is meant to
   read whether the state has committed to the function on its own record.
   Under 1.0 it read whether the state publishes its administrative
   decisions as acts, which is a habit of legal culture, and a body created
   by an announced restructure is no less created.
2. **Collegial executives** (ambiguity 1). For I3, a council that holds
   executive power jointly is the chief executive, and a change occurs when
   a majority of the members at the GFF's founding have left. The rotating
   chair is not a change. Why: the test is whether the function outlived
   those who could have made it, and in a council no single person could.
3. **Legislative impact mandates** (ambiguity 2). A general impact,
   feasibility or evaluation mandate meets condition 3 only when it names
   emerging technologies or the long-term future. Why: condition 3 is about
   exploring the long-term future, and ex-ante assessment of a given bill or
   policy is evaluation, not exploration.
4. **Public-law research foundations** (ambiguity 3). A body created by act
   of the state, supervised by a ministry, the centre of government or the
   legislature, and headed by a state appointee is of the state whatever its
   legal name. Universities, private-law foundations and companies are not.
   Why: condition 1 asks whether the state owns the function, which the
   legal label does not decide; 1.0's treatment of Sitra already implied it.
5. **Unpublished restructures** (ambiguity 4). Settled by change 1: an
   official page announcing or dating the restructure is an official record;
   a restructure known only from news is not.
6. **Consultancy co-authorship** (ambiguity 5). A product counts when the
   GFF is named as author, co-author or issuing body; co-authors do not
   disqualify it. A product credited to the GFF only as commissioner,
   funder, sponsor or host does not count. Why: I2 reads whether the body
   operates, and a body that co-writes a product operates; one that only
   pays for a product shows a budget, not operation.
7. **Minimum product horizon** (ambiguity 6). A product's stated horizon
   must be at least ten years after publication, or unstated. Why: the same
   ten years condition 3 requires of a mandate, so a body and its products
   are read on one definition of the long term.
8. **Same-day transfers** (ambiguity 7). A successor is a body in the same
   branch whose foresight mandate is on the official record within 24
   months of the closure; no act naming the transfer is needed. Why: I4
   reads a reversal, and a mandate moved to another body the same day is a
   reorganisation. The branch condition stops a legislature's office from
   cancelling an executive's closure.
9. **"Prospects" wording in planning mandates** (ambiguity 8). The terms
   that name a foresight function are listed under condition 3; "prospects",
   "outlook", "forecast", "projections" and "vision" are not among them.
   Why: they describe the expected path of a plan, not alternative futures,
   which is the distinction the planning-body exclusion already drew.
10. **Body-by-body agreement** (pilot recommendation 4). Coders list every
    candidate body with per-body codes (section 5), and section 7 defines a
    body-level alpha over matched bodies, with a missed body counted as not
    qualifying, held to the 0.80 threshold. Why: in round 1 one country's
    agreed score hid a split over which bodies qualify.
11. **Coders and the human check** (owner ruling). Round 2 uses two coders
    of different model families, and a person spot-checks about 20 percent
    of the coded bodies before anything is scored. Why: model-on-model
    agreement is correlated, and the spot-check is the owner's chosen
    substitute for a full human coder at this stage.
12. **Archived snapshots are required** (section 4). Coders request a
    Wayback snapshot where none exists and record the reason when the
    archive refuses. Why: round 1 left several sources without one.
13. **Mandate date for I3** (found while drafting change 4, no pilot split).
    Where a body received its foresight mandate after it was founded, I3
    counts from the earliest date on the record at which it held that
    mandate, and a reissued statute does not reset it. Why: the item reads
    whether the foresight function outlived a change, not the building it
    sits in, and 1.0 left the start date undefined for an older body, such
    as a public-law institute, whose mandate came later.
