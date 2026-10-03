# Foresight register spot-check: round 2

This sample is checked before any foresight register score is used, and
before coding of the 53 starts (owner ruling of 2026-10-02, codebook 1.1
section 7). Under D154 the checker is a model family not used to code:
OpenAI through the codex CLI, working through the same questions below. The pilot report is `FORESIGHT-REGISTER-PILOT.md`, round 2.

## How the sample was drawn

The round 2 coders, together with the adjudicator, examined 56 distinct
bodies across the ten pilot countries (the matching table is in
`data/research/foresight-register-pilot.json`, `round2.bodies`). The sample
is 11 of them, 20 percent, drawn by a rule fixed before the draw:

- The strata are the four V-Dem regime classes. Each class gets
  round(0.2 x its bodies): closed autocracy 3 of 16, electoral autocracy 2
  of 9, electoral democracy 4 of 21, liberal democracy 2 of 10.
- Within a class, max(1, round(n x GFFs / bodies)) are drawn from the bodies
  adjudicated as meeting the unit (a GFF), and the rest from the bodies
  adjudicated as failing it, so every class contributes one GFF and at
  least one rejection.
- Candidates sorted by id, drawn with `rng.sample`, classes in the order
  above, GFFs before rejections, `rng = random.Random("ncb-foresight-spotcheck-2026-10-02")`.

The three bodies on which the coders split are listed after the sample. They
are checked in addition, because each is an adjudicator's call. One of them,
the Estonian Development Fund, was also drawn.

## What a check is

For each body, open the sources (use the archived copy when the live page has
changed) and answer the questions under it. Then record one of:

- **Confirmed**: the unit decision and every code stand.
- **Overturned**: the unit decision or a code is wrong. Say which and why.
- **Cannot verify**: the source does not show what is claimed, and no other
  primary page does either.

An overturn is reported with the sample's error rate, and the verdict waits on
it (codebook section 7). Codes: `record` is I1 read on the body, `product` I2,
`survived` I3, `closedNoSuccessor` I4.

## The sample

### 1. ARE: Ministry of Cabinet Affairs, future foresight portfolio (closed autocracy, GFF)

- **Adjudicated:** meets the unit. record 1, product 0, survived `no_change`,
  closedNoSuccessor 0. Both coders agreed.
- **Sources:**
  - https://www.moca.gov.ae/en/area-of-focus/future-foresight
    (archived https://web.archive.org/web/20250820150808/https://www.moca.gov.ae/en/area-of-focus/future-foresight)
  - https://www.moca.gov.ae/en/about/about-moca
    (archived https://web.archive.org/web/20240531035725/https://www.moca.gov.ae/en/about/about-moca)
  - https://uaecabinet.ae/en/news/ministers-of-the-future-government-take-the-oath-before-the-uae-prime-minister
    (**no snapshot**: the Wayback save returned HTTP 520; request one)
- **Verify:**
  - [ ] An official page gives the foresight mandate in words (condition 3),
        not only a ministry title.
  - [ ] An official page dates the 2016 creation of the future portfolio
        (I1 under 1.1: an official page that dates it is enough).
  - [ ] The prime minister has held office since 2006, so no change has
        occurred since 2016 (`no_change`).
  - [ ] No ministry-authored forward-looking product dated 2023-10-02 or
        later is on an official URL (product 0).

### 2. ARE: Federal National Council (closed autocracy, rejected)

- **Adjudicated:** fails the unit. Both coders agreed. A: a "Future
  Committee" appears in news only, and the 2023 rules list no such standing
  committee. B: no foresight or technology assessment office or committee.
- **Sources:** none cited. Check almajles.gov.ae.
- **Verify:**
  - [ ] The council's current standing committees include no futures or
        technology assessment committee.
  - [ ] If a "Future Committee" did exist as a standing body, note its dates:
        an end inside 2016-10-02 to 2026-10-02 with no successor would make
        I4 1.

### 3. ARE: Dubai Future Foundation (closed autocracy, rejected)

- **Adjudicated:** fails the unit, sub-national (Emirate of Dubai). Both
  coders agreed.
- **Sources:** none cited. Check dubaifuture.ae and the Dubai law that
  created it.
- **Verify:**
  - [ ] The foundation was created by the Emirate of Dubai, not by federal
        law.

### 4. SGP: Centre for Strategic Futures (electoral autocracy, GFF)

- **Adjudicated:** meets the unit. record 1, product 1, survived 1,
  closedNoSuccessor 0. Both coders agreed.
- **Sources:**
  - https://www.csf.gov.sg/who-we-are/
    (archived https://web.archive.org/web/20260914055254/https://www.csf.gov.sg/who-we-are/)
  - https://file.go.gov.sg/csfforesight2024.pdf
    (archived https://web.archive.org/web/20260124075530/https://file.go.gov.sg/csfforesight2024.pdf)
  - https://www.csf.gov.sg/media-centre/foresight-series/
    (archived https://web.archive.org/web/20260914055241/https://www.csf.gov.sg/media-centre/foresight-series/)
- **Verify:**
  - [ ] The who-we-are page dates the centre to 2009 (record 1).
  - [ ] Foresight 2024 is authored by the centre, dated on or after
        2023-10-02, and is mainly about the long-term future with no
        stated horizon under ten years. Coder A noted that it is an
        anniversary issue mixing reflections with research, and that its
        month is not on a primary page.
  - [ ] Something dated at least six months after the May 2024 handover
        from Lee Hsien Loong to Lawrence Wong shows the centre operating
        (survived 1).

### 5. SGP: Committee on the Future Economy (electoral autocracy, rejected)

- **Adjudicated:** fails the unit. Coder A rejected it on conditions 2 and 4
  (a single-deliverable committee, economy only); coder B did not list it.
- **Sources:** none cited. Check mti.gov.sg.
- **Verify:**
  - [ ] The committee was set up for one report (2017) and has no standing
        mandate.

### 6. BRA: Ipea, Instituto de Pesquisa Econômica Aplicada (electoral democracy, GFF)

- **Adjudicated:** meets the unit, as a public-law foundation. record 1,
  product 0, survived 1, closedNoSuccessor 0. Both coders agreed. It carries
  Brazil's I3.
- **Sources:**
  - Decreto 11.194/2022 (statute), art. 3 III, "realizar estudos
    prospectivos de médio e longo prazo":
    https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/decreto/D11194.htm
    (archived https://web.archive.org/web/20251215131458/https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/decreto/D11194.htm)
  - https://www.ipea.gov.br/portal/o-que-fazemos/estudos-prospectivos
    (archived https://web.archive.org/web/20261002151916/https://www.ipea.gov.br/portal/o-que-fazemos/estudos-prospectivos)
- **Verify:**
  - [ ] Ipea meets condition 1 as a public-law body: created by an act of
        the state, supervised by a ministry, head appointed by the state.
  - [ ] "Estudos prospectivos de médio e longo prazo" is a named foresight
        function under condition 3. "Prospectivo" is on the 1.1 term list,
        and "médio e longo prazo" sets no horizon under ten years. Coder B
        was unsure on this point.
  - [ ] The prospective-studies competence predates the 2023-01-01 change
        of president. Coder A traced it to the 1999 statute; the 2022
        statute alone would also predate the change.
  - [ ] No Ipea-authored product with a horizon of ten years or more is on
        an official URL since 2023-10-02. The adjudicator found Ipea's 2025
        "Relatório Brasil 2050: Estudo Temático Estratégico, Análise
        Macroeconômica", cited in the planning ministry's 2050 scenarios. It
        was coded as a macroeconomic projection, not a product. Check
        whether it should count.

### 7. NGA: Office of the Vice President, foresight programme (electoral democracy, rejected)

- **Adjudicated:** fails the unit. Both coders agreed, on different
  conditions. A: condition 3, no official page names a foresight mandate
  for OSPRE. B: condition 2, a capacity-building programme with UNICEF and
  no standing body on the record.
- **Sources:** none on a government domain. The coders' leads were
  unicef.org and news.
- **Verify:**
  - [ ] No statehouse.gov.ng or other federal page creates a standing
        foresight office. A proposed National Office for Strategic Foresight
        that was never established does not count.

### 8. NGA: National Centre for Technology Management, NACETEM (electoral democracy, rejected)

- **Adjudicated:** fails condition 4, science, technology and innovation
  only. Both coders agreed.
- **Sources:** none cited. Check nacetem.gov.ng.
- **Verify:**
  - [ ] The centre's mandate is confined to technology management and
        science and innovation policy.

### 9. GBR: Development, Concepts and Doctrine Centre (electoral democracy, rejected)

- **Adjudicated:** fails condition 4, defence only. Both coders agreed,
  although Global Strategic Trends covers trends across every domain.
- **Sources:** none cited. Check gov.uk/government/organisations/development-concepts-and-doctrine-centre.
- **Verify:**
  - [ ] The centre's mandate is to inform defence. The breadth of its
        product does not widen the mandate, which is what condition 4
        reads.

### 10. EST: Eesti Arengufond, Estonian Development Fund (liberal democracy, GFF by adjudication)

- **Adjudicated:** meets the unit; the coders split (A no, B yes). record 0,
  product 0, survived 1, closedNoSuccessor 0. It closed on 2016-06-29,
  before the I4 window, so no country item depends on it.
- **Sources:**
  - https://arenguseire.ee/eesti-arengufondi-raportid/ (the Foresight
    Centre's page: a public-law organisation founded by the Riigikogu,
    working through investment, foresight and growth programmes, wound up in
    2016)
  - The Development Fund Act, https://www.riigiteataja.ee/akt/13238017
    (renders only in a browser; not read by either coder or the adjudicator)
- **Verify:**
  - [ ] The act names foresight ("arenguseire") as a task (condition 3).
  - [ ] The foresight mandate reaches across domains rather than the economy
        alone (condition 4). This is the weakest part of the adjudication.
  - [ ] The act's date (record: 1 if a primary page dates it).

### 11. CHE: Federal Department of Foreign Affairs, Policy Planning (liberal democracy, rejected)

- **Adjudicated:** fails condition 4, foreign policy only. Coder A rejected
  it; coder B did not list it.
- **Sources:** named on https://www.bk.admin.ch/de/perspektiven-schweiz-2040
  (archived https://web.archive.org/web/20260929005612/https://www.bk.admin.ch/de/perspektiven-schweiz-2040).
- **Verify:**
  - [ ] The unit's forward-looking mandate is confined to foreign policy.

## The adjudicated splits, checked in addition

### SGP: Scenario Planning Office, later Strategic Policy Office (1995 to 2015)

- **Coders:** A did not code it separately (CSF's lineage). B: meets the
  unit, merged 2015, successor CSF in the Strategy Group.
- **Adjudicated:** meets the unit. record 1, product 0, survived 1,
  closedNoSuccessor 0. The adjudicator read the CSF page: "In 1995, the
  Government set up the Scenario Planning Office in the Prime Minister's
  Office to develop scenarios from a whole-of-government perspective". It is
  a distinct body that closed in 2015, before the I4 window, with a
  same-branch successor. No item changes.
- **Source:** https://www.csf.gov.sg/who-we-are/ (archived above).
- **Verify:**
  - [ ] It was a body of its own, not a name for CSF.

### BRA: Secretaria Especial de Assuntos Estratégicos, SAE/PR (2019 to 2022 form)

- **Coders:** A fails condition 3 ("scenarios" only in an intelligence
  advisory unit). B meets the unit, low confidence.
- **Adjudicated:** meets the unit. record 1, product 0, survived
  `did_not_survive`, closedNoSuccessor 0. The adjudicator read Decreto
  10.374/2020 as amended by Decreto 10.817/2021. Its directorates are to
  "realizar estudos e análises de cenários que contribuam para a formulação
  do planejamento nacional de longo prazo", across the economy, science and
  technology, defence and international affairs. Long-term scenarios are a
  named function and they reach across domains, so condition 3 and
  condition 4 hold. It closed on 2023-01-01, and Decreto 11.353 gave the
  planning ministry prospective studies the same day: a same-branch
  successor, so I4 is 0. No country item changes, because Brazil's I1 to I3
  rest on other bodies.
- **Source:** https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/decreto/D10374.htm
- **Verify:**
  - [ ] The scenario wording is in the regimental structure in force when
        the body closed, not only in the revoked articles.
  - [ ] The same-day successor reading under codebook 1.1, section 2, I4.

### EST: Estonian Development Fund

Drawn in the sample, item 10.

## Result

Checked 2026-10-03 by an agent checker, not a person, under the owner's
ruling of 2026-10-03 that a single-vendor check is acceptable (D154 as
amended). The checker was `claude-sonnet-5-5`, a fresh subagent given only
this file's sample (without this table) and codebook 1.2, with live web
search. Its raw output is `data/research/foresight-register-spotcheck.json`.
A first attempt with an OpenAI model through the Codex CLI stopped before
any verdict: the Codex workspace ran out of credits.

| # | Body | Result | Note |
| ---: | --- | --- | --- |
| 1 | ARE Ministry of Cabinet Affairs | Overturned (product) | The checker found "10 Future Emerging Opportunities", 11 November 2023, horizon the next decade, on moca.gov.ae, and coded product 1. The page names the Government Development and the Future Office as author, which the round 2 table holds as a separate GFF (`ARE.gdfo`, product 1). The overturn reads a unit's product as its parent's: a point codebook 1.2 leaves open (see below). No country item changes: ARE's I2 is already 1 through `ARE.gdfo`. The checker flagged a change because the checklist did not show `ARE.gdfo`. |
| 2 | ARE Federal National Council | Confirmed | Read from a digest of the committee page, not the page itself. |
| 3 | ARE Dubai Future Foundation | Confirmed | Emirate level. The founding law's number is not confirmed on a primary page. |
| 4 | SGP Centre for Strategic Futures | Confirmed | Product rests on Foresight 2024 alone. |
| 5 | SGP Committee on the Future Economy | Confirmed | |
| 6 | BRA Ipea | Overturned (product) | "Estudo Estratégico de Análise Macroeconômica" (Brasília 2025, gov.br/planejamento) builds exploratory scenarios to 2050. The Ministry of Planning and Budget issues it; its two coordinators and five authors are all marked "IPEA". The checker read that as Ipea authorship. Whether staff affiliation names a body as author is a point codebook 1.2 leaves open (see below). No country item changes: Brazil's I2 is already 1 through `BRA.seplan`. |
| 7 | NGA Vice President's foresight programme | Confirmed | Rests on a search for absence. |
| 8 | NGA NACETEM | Confirmed | Mandate wording not read on the official page. |
| 9 | GBR DCDC | Confirmed | |
| 10 | EST Development Fund | Overturned (record) | The checker coded record 1 on the act's date, 15 November 2006. It saw the date only in a search digest of Riigi Teataja, which renders only in a browser. Section 4 holds a search snippet to be a lead, so the overturn does not meet the codebook's own evidence rule. The adjudicated 0 was coded for the same reason: neither the coders nor the checker read the page. No country item changes: the body closed in 2016. |
| 11 | CHE EDA Policy Planning | Confirmed | |
| + | SGP Scenario Planning Office | Confirmed | |
| + | BRA SAE/PR | Confirmed | The structure in force at closure is Decreto 11.285/2022 with the same scenario wording, not 10.374 as amended. Decreto 11.353 takes effect on 2023-01-24, inside the 24 months, so the successor reading stands. |

Checked by: `claude-sonnet-5-5` (agent checker, Anthropic) on 2026-10-03.
Error rate over the 11 sampled: 3 of 11 (27 percent). Without number 10, whose overturn rests on a search snippet, it is 2 of 11 (18 percent).

## Verdict: the check fails D148

D148 is overturned by a spot-check that overturns two or more of the 11
sampled bodies, or by any body decision that changes a country item. The
checker overturned three, and two even after setting aside the one that breaks
the evidence rule. Read against the adjudicated body table, none of the
three changes a country item. The first condition fires, so the check fails.
Coding of the 125 does not start (runbook section 0), and the next step is a
decision entry.

The check is same-vendor. The pilot coders were Claude Sonnet and Opus, and
so is the checker. The check therefore measures how stable the adjudication
is when a fresh context reads it. It does not test errors shared by one
vendor's models with the same search tools. A different vendor would have
found as much or more.

### Where the overturns trace

Two of the three trace to rules codebook 1.2 leaves open. One traces to
evidence access. Neither of the first two is a misreading of a source.

1. **Whose product is a unit's product** (number 1). Section 1 judges every
   body on its own *mandate* and says a parent's mandate is not read from a
   unit inside it. I2 names the author through "the GFF is named on the
   product". Nothing says whether a product by a unit or office counts for
   the ministry that houses it. The pilot coders read it as the unit's
   only. The checker read it as the parent's too.
2. **Whether staff affiliation names a body as author** (number 6). I2 counts
   a GFF "named on the product, or on the official page that publishes it,
   as author, co-author or issuing body". A product issued by one body,
   with every author marked as staff of another, satisfies one reading and
   fails the other.
3. **Gazettes that render only in a browser** (number 10). Section 4 codes a
   date 0 when it cannot be seen on a primary page. A coder or checker
   whose fetcher cannot render the gazette cannot see the date, whatever
   the act says. This is a tooling gap, not a rule gap. It decides an
   item wherever a national legal database is script-rendered.

### Proposed codebook change (1.3)

Decided on the construct, naming no country, and committed before any
recode:

- **I2, authorship between bodies.** "A product counts for the body named
  on it, or on the page that publishes it, as an institution: author,
  co-author or issuing body. A product of a unit counts for the unit and not
  for the body that houses it, and a parent's product does not count for its
  unit, the same rule section 1 applies to mandates. Individual authors'
  affiliations do not name a body: a product issued by one body and written
  by staff of another counts for the issuing body, and for the other only
  when it is named as an institution." Why: I2 reads whether a body
  operates. The record of operation is what the state publishes under a
  body's name, and an affiliation line records employment, not issuance.
  Because the country item is the maximum over bodies, the rule moves an
  item only where the unit itself fails the unit test. That is where the
  attribution matters.
- **Section 4, rendering.** "A primary page that does not render to the
  coder's fetcher is read through a browser-rendered fetch or an archived
  copy before any item it carries is coded 0. Where neither is possible,
  the item codes 0 with `confidence: "low"` and the note
  `unrendered: <url>`, and the adjudicator renders the page before the
  code stands. A search snippet stays a lead." Why: a 0 that says the date
  could not be read measures the coder's tools, not the state's record.
- **Spot-check checklist.** The checklist shows every GFF the adjudication
  holds for the body's country, with each one's body codes. Then a checker
  can tell whether an overturn changes a country item. Number 1 was flagged
  as one because the list left out `ARE.gdfo`.

The three changes need a decision entry superseding D148's go. They also
need a recode of the ten pilot countries under 1.3, and a fresh spot-check
drawn under the same rule with a new seed, before coding the 125.
