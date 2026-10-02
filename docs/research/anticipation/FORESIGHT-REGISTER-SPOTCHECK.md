# Foresight register spot-check: round 2

A person checks this sample before any foresight register score is used, and
before coding of the 53 starts (owner ruling of 2026-10-02, codebook 1.1
section 7). The pilot report is `FORESIGHT-REGISTER-PILOT.md`, round 2.

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

| # | Body | Result | Note |
| ---: | --- | --- | --- |
| 1 | ARE Ministry of Cabinet Affairs | | |
| 2 | ARE Federal National Council | | |
| 3 | ARE Dubai Future Foundation | | |
| 4 | SGP Centre for Strategic Futures | | |
| 5 | SGP Committee on the Future Economy | | |
| 6 | BRA Ipea | | |
| 7 | NGA Vice President's foresight programme | | |
| 8 | NGA NACETEM | | |
| 9 | GBR DCDC | | |
| 10 | EST Development Fund | | |
| 11 | CHE EDA Policy Planning | | |
| + | SGP Scenario Planning Office | | |
| + | BRA SAE/PR | | |

Checked by: ______ on ______. Error rate over the 11 sampled: __ of 11.
