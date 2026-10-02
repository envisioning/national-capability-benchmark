# Foresight register codebook

The coding rule for a project-authored register that would fill
`government_foresight_capacity` ("existence, mandate and continuity of a
national strategic foresight function"). Recommendation 1 of
`docs/research/anticipation/O1-CANDIDATES.md`, decided as a pilot on
issue #68 on 2026-10-02: ten countries, this rule fixed before any country is
coded, two independent coders, nothing scored until the pilot is reviewed.

Fixed: 2026-10-02, committed before the first coding. A change to anything in
this file after coding starts is a new version of the codebook, recorded at
the foot of the file with the reason, and every country is recoded under it.
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
   example).
2. **Standing.** It exists without an end date. A commission, task force or
   project with a sunset clause or a single deliverable is not standing.
3. **Mandated for foresight.** A written mandate (the founding act, an
   organisational regulation, standing orders, or the body's own official
   "about" page) names as a function of the body the exploration of the
   long-term future: alternative futures, scenarios, megatrends, horizon
   scanning, emerging change, or long-range technology assessment, with a
   horizon of at least ten years or no stated horizon.
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
  planning body counts only when condition 3 is met by a named function
  ("prospective", "prospectiva", "foresight", "futures", "long-term
  scenarios") in its act or organisational regulation, and condition 3 is
  then read on that function, not on the plan.
- A long-term vision document (Vision 2030, 2045, 2050), however long its
  horizon, unless a standing body that meets 1 to 4 produced it and keeps
  producing.
- Statistics offices, central banks, fiscal councils, budget offices and
  debt offices, including their long-term projections. These project one
  variable under stated assumptions; they are not foresight functions.
- Universities, think tanks, foundations, NGOs, consultancies, and donor or
  UN projects, even when government funds or hosts them. A body that is a
  foundation or company in law but is created by statute and answers to
  parliament (Finland's Sitra) counts only when its statute names foresight
  as a function; coders record the legal form either way.
- A single event, workshop, training or exercise.
- Sub-national bodies.

A country may have more than one GFF. Coders list every one they find and
code the country from them as section 2 says.

## 2. The items

Each item is coded at the country level, from the GFFs the coder listed. Each
item is `1`, `0`, or for I3 only, a `0` with the reason `no_change`.

### I1. Established by a named, dated act

`1` when at least one GFF that is operating on the coding date was
established, or given its foresight mandate, by a named act with a date: a
law, decree, executive order, cabinet or council decision, parliamentary
resolution or change to standing orders, or an organisational regulation
issued under one. The coder records the act's name, number where it has one,
and date (at least the year; the day where the act carries it).

`0` when no operating GFF exists, or when the only operating GFF exists by
administrative practice with no act that can be named and dated.

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
  minister.

**Any change of the person counts**: an election, a party succession, a
resignation, a death, a coup. A change of ruling party or coalition is not
required. An acting or interim holder of less than six months does not count.

`0` with reason `no_change` when no change of the effective chief executive
has occurred since the GFF was established. `0` with reason
`did_not_survive` when the GFF ended at or within two years after a change.
`0` with no reason when no operating GFF exists.

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
time since 1990. For each GFF that ended, the coder records the date, the act
that ended it, and whether a successor took its foresight mandate within 24
months (named, with its act).

`1` when a GFF ended **between 2016-10-02 and 2026-10-02** with no successor
within 24 months. `0` otherwise, including mergers whose successor carries
the foresight mandate.

## 3. Score from items

```
score = round(100 * (I1 + I2 + I3) / 3) - 20 * I4, floored at 0
```

Possible values: 0, 33, 67, 100, and 13, 47, 80 where a closure applies.

- The three items are equal because none is privileged by the construct:
  existence by act is mandate, a product is operation, survival is
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
  snapshot URL (`https://web.archive.org/web/<timestamp>/<url>`) where one
  exists or can be found, the retrieval date, and a quotation of at most 25
  words from the page that carries the item (the act's name and date, the
  product's title and date, the post-change evidence). Where no snapshot
  exists, the coder records `archived: null` and says so; the reviewer
  requests one before promotion.
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
  "codebookVersion": "1.0",
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
          "unitNote": "why it meets or fails section 1, naming the condition"
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

A source is `{ "url": "", "archived": "", "retrievedAt": "2026-10-02", "quote": "" }`.

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
- **Coders.** In this pilot both coders are instances of one language model
  given the same file. Their errors are correlated (same training, same
  search tool), so agreement between them overstates what two human coders
  would reach. The report says so.

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
- **Verdict.** *Go to 53* when every alpha is at least 0.80 and no stop rule
  fires. *Revise the codebook* when an alpha falls between 0.667 and 0.80 or a
  disagreement traces to a rule this file leaves ambiguous. *Stop* when a stop
  rule fires or an alpha is below 0.667 after one revision.

## Versions

- 1.0, 2026-10-02. Fixed before coding.
