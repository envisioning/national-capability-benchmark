# Foresight register spot-check: the pilot recode under codebook 1.3

> **Status, 2026-10-16.** This sheet is drawn and not yet checked. The 1.3
> recode it samples, `FORESIGHT-REGISTER-RESULTS.md`, was never committed and
> no copy survives, so the recode has to run again under codebook 1.3 before
> this check can be read against it. The sample rule and seed below stay valid.


The round 2 spot-check (`FORESIGHT-REGISTER-SPOTCHECK.md`) overturned three of
11 sampled bodies and failed D148. Codebook 1.3 settles the points those
overturns traced to. The ten pilot countries were recoded under 1.3 by two
fresh coders, and this check is drawn from that recode's adjudicated body
list before any of the 125 is coded. The recode is reported in
`FORESIGHT-REGISTER-RESULTS.md`, section 1.

## How the sample was drawn

The 1.3 coders and the adjudicator examined 56 distinct bodies across the ten
countries. The sample is 11 of them, 20 percent, drawn by the round 2 rule
with a new seed:

- The strata are the four V-Dem regime classes. Each class gets
  round(0.2 x its bodies): closed autocracy 3 of 15 (ARE, HTI, VNM),
  electoral autocracy 2 of 10 (NIC, SGP), electoral democracy 5 of 24 (BRA,
  GBR, NGA), liberal democracy 1 of 7 (CHE, EST).
- Within a class, max(1, round(n x GFFs / bodies)) are drawn from the bodies
  adjudicated as meeting the unit (a GFF), and the rest from those adjudicated
  as failing it.
- Candidates sorted by id, drawn with `rng.sample`, classes in the order
  above, GFFs before rejections,
  `rng = random.Random("ncb-foresight-spotcheck-1.3-2026-10-03")`.

The bodies on which the two coders split, on the unit or on a body code, are
checked in addition. One of them, the Senate's Comissão Senado do Futuro, was
also drawn.

## What a check is

For each body, open the sources (use the archived copy when the live page has
changed, and render a page that builds its text in the browser) and answer
the questions under it. Then record one of:

- **Confirmed**: the unit decision and every code stand under codebook 1.3.
- **Overturned**: the unit decision or a code is wrong. Say which and why,
  with the source, and say whether a country item changes, reading the
  country's bodies listed under the entry.
- **Cannot verify**: the source does not show what is claimed, and no other
  primary page does either.

Codes: `record` is I1 read on the body, `product` I2, `survived` I3,
`closedNoSuccessor` I4. A country item is the maximum over its operating
bodies (I4 over every body).

## The sample

### 1. ARE: Government Development and the Future Office (closed autocracy, GFF)

- **Adjudicated:** meets the unit. record 1, product 1, survived
  `no_change`, closedNoSuccessor 0. Both coders agreed.
- **Sources:**
  - https://gdf.gov.ae/en/brief (archived https://web.archive.org/web/20250617064302/https://gdf.gov.ae/en/brief)
  - https://gdf.gov.ae/en/news-details/the-government-development-and-the-future-office-launches-the-10-future-emerging-opportunities-report (archived https://web.archive.org/web/20250521204619/https://gdf.gov.ae/en/news-details/the-government-development-and-the-future-office-launches-the-10-future-emerging-opportunities-report)
  - https://www.moca.gov.ae/en/media/news/government-development-and-the-future-office-launches-10-future-emerging-opportunities-report
- **Verify:**
  - [ ] The office's official page names a foresight function ("foresee
        future trends", readiness for the future) across government
        (conditions 3 and 4), not only government development.
  - [ ] An official page dates its creation to the 5 July 2020 restructure
        (record 1).
  - [ ] "10 Future Emerging Opportunities" (11 November 2023) names the
        office as author or issuing body, its horizon is the next decade,
        and the Future Today Institute is a co-author rather than the sole
        author with the office as commissioner (product 1).
  - [ ] The prime minister has held office since 2006 (`no_change`).
- **The country's GFFs:** `ARE.gdfo` (this body); `ARE.moca`, Ministry of
  Cabinet Affairs, future foresight portfolio since 2016: record 1, product
  0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1,
  I3 0 `no_change`, I4 0; score 67.

### 2. HTI: Parliament (closed autocracy, rejected)

- **Adjudicated:** fails the unit. Coder B examined it; coder A did not list
  it. No technology assessment, futures or prospective office found.
  chambredesdeputes.ht served a defaced directory listing (archived
  2026-05-16) and senat.ht did not resolve.
- **Sources:** none with a mandate. Check senat.ht, chambredesdeputes.ht and
  their archived copies.
- **Verify:**
  - [ ] Neither chamber has a standing office, committee or institute with a
        foresight or technology assessment mandate.
- **The country's GFFs:** none. Country items all 0; score 0.

### 3. VNM: Vietnam Academy of Social Sciences (closed autocracy, rejected)

- **Adjudicated:** fails condition 3. Coder A examined it; coder B did not
  list it. A research academy; no foresight function named in its mandate.
- **Sources:** none cited. Check vass.gov.vn and the government decree on its
  functions.
- **Verify:**
  - [ ] The academy's decreed functions name no foresight function under
        condition 3 (dự báo, forecasting, does not count).
- **The country's GFFs:** none. Country items all 0; score 0.

### 4. SGP: Centre for Strategic Futures (electoral autocracy, GFF)

- **Adjudicated:** meets the unit. record 1, product 1, survived 1,
  closedNoSuccessor 0. Both coders agreed.
- **Sources:**
  - https://www.csf.gov.sg/who-we-are/ (archived https://web.archive.org/web/20260914055254/https://www.csf.gov.sg/who-we-are/)
  - https://file.go.gov.sg/csfforesight2024.pdf (archived https://web.archive.org/web/20260124075530/https://file.go.gov.sg/csfforesight2024.pdf)
  - https://www.csf.gov.sg/media-centre/foresight-series/ (archived https://web.archive.org/web/20260914055241/https://www.csf.gov.sg/media-centre/foresight-series/)
  - https://www.csf.gov.sg/media-centre/thinking-about-tomorrow/ (archived https://web.archive.org/web/20261003073855/https://www.csf.gov.sg/media-centre/thinking-about-tomorrow/)
- **Verify:**
  - [ ] The who-we-are page dates the centre to 2009 (record 1).
  - [ ] Foresight 2024 is issued by the centre, dated on or after
        2023-10-02, and mainly about the long-term future (product 1).
  - [ ] Something dated at least six months after the 15 May 2024 change of
        prime minister shows the centre operating (survived 1).
- **The country's GFFs:** `SGP.csf` (this body); `SGP.spo`, Scenario
  Planning Office (1995), later Strategic Policy Office, merged 2015: record
  1, product 0, survived 1, closedNoSuccessor 0. Country items: I1 1, I2 1,
  I3 1, I4 0; score 100.

### 5. NIC: Secretaría de la Presidencia, planning directorate (electoral autocracy, rejected)

- **Adjudicated:** fails condition 3 and the planning-office exclusion. Both
  coders agreed. It builds and tracks the national human development plan.
- **Sources:** Ley 290 and its Reglamento, Decreto 71-98 (consolidated
  text, legislacion.asamblea.gob.ni); presidencia.gob.ni and sepres.gob.ni
  did not render to coder B.
- **Verify:**
  - [ ] The Reglamento and any official page give the Secretariat planning
        and follow-up functions and name no prospective or futures function.
- **The country's GFFs:** none. Country items all 0; score 0.

### 6. GBR: Parliamentary Office of Science and Technology (electoral democracy, GFF)

- **Adjudicated:** meets the unit. record 1, product 1, survived 1,
  closedNoSuccessor 0. Both coders agreed.
- **Sources:**
  - https://www.parliament.uk/globalassets/documents/post/POST_evaluation2009_FINAL_080110.pdf (archived https://web.archive.org/web/20210926151108/https://www.parliament.uk/globalassets/documents/post/POST_evaluation2009_FINAL_080110.pdf)
  - https://post.parliament.uk/research-briefings/post-pn-0742/ (archived https://web.archive.org/web/20260922042506/https://post.parliament.uk/research-briefings/post-pn-0742/)
- **Verify:**
  - [ ] POST is an office of both Houses, permanent since 2001, and its
        about page names horizon scanning or technology assessment for
        parliament (conditions 1 to 4).
  - [ ] An official parliament page dates its establishment (record 1).
  - [ ] POSTnote 742, or another POST product dated on or after 2023-10-02,
        is mainly about emerging technology or the long-term future, with no
        stated horizon under ten years (product 1).
  - [ ] It operated at least six months after the 5 July 2024 change of
        prime minister (survived 1).
- **The country's GFFs:** `GBR.post` (this body); `GBR.goscience`,
  Government Office for Science: record 0, product 1, survived 1;
  `GBR.foresight`, its Futures, Foresight and Emerging Technologies team:
  record 1, product 0, survived 1; `GBR.hsp`, Horizon Scanning Programme
  team, closed with a named successor: record 1, product 0, survived 1. All
  closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### 7. BRA: Conselho de Altos Estudos e Avaliação Tecnológica, Câmara dos Deputados (electoral democracy, rejected)

- **Adjudicated:** fails the unit, low confidence: neither coder read its
  founding act. Closed 2013-03-26 by Resolução da Câmara 26/2013, which
  created CEDES in its place. Both coders agreed.
- **Sources:** Resolução da Câmara dos Deputados 26/2013 (camara.leg.br,
  no snapshot: save failed). The council's founding resolution is unread.
- **Verify:**
  - [ ] The council's own mandate, if found, names emerging technologies or
        the long-term future under condition 3. If it does, it is a GFF that
        closed before the I4 window with CEDES as its successor in the same
        branch, and no country item changes; record whether it does.
- **The country's GFFs:** `BRA.ipea`, Ipea: record 1, product 0, survived
  1; `BRA.seplan`, Secretaria Nacional de Planejamento: record 1, product 1,
  survived `no_change`; `BRA.sublp`, its Long-term Planning
  Undersecretariat: record 1, product 0, survived `no_change`. All
  closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### 8. BRA: Centro de Estudos e Debates Estratégicos, Câmara dos Deputados (electoral democracy, rejected)

- **Adjudicated:** fails condition 3. Both coders agreed. Resolução 26/2013
  gives it policy studies and "estudos de viabilidade e análise de impactos,
  riscos e benefícios" of technologies, plans and policies: a general impact
  mandate that names neither emerging technologies nor the long-term future.
- **Sources:** Resolução da Câmara dos Deputados 26/2013,
  https://www2.camara.leg.br/legin/fed/rescad/2013/resolucaodacamaradosdeputados-26-26-marco-2013-775538-norma-pl.html
  (no snapshot: save failed).
- **Verify:**
  - [ ] The resolution's statement of purposes names no foresight term and no
        new or emerging technology as the object of its assessments.
- **The country's GFFs:** as entry 7.

### 9. BRA: Comissão Senado do Futuro (electoral democracy, rejected; a split)

- **Coders:** A meets the unit (low confidence) and codes I4 1. B fails
  condition 3 (low confidence).
- **Adjudicated:** fails condition 3. Regimento Interno do Senado art. 104-D:
  "À Comissão Senado do Futuro compete promover discussões sobre grandes
  temas e o futuro do País, bem como aprimorar a atuação do Senado nessas
  questões." Discussing major themes and the country's future names none of
  the terms condition 3 lists, nor a direct equivalent: it is a forum, not a
  mandate to explore alternative futures. Closed 2023-06-07 by Resolução do
  Senado 14/2023, which made it the Comissão de Defesa da Democracia. Because
  it fails the unit, its closure is not I4, and Brazil's I4 is 0.
- **Sources:**
  - Regimento Interno do Senado Federal (2018 edition), https://www25.senado.leg.br/documents/12427/45868/RISF+2018+Volume+1.pdf/cd5769c8-46c5-4c8a-9af7-99be436b89c4 (archived https://web.archive.org/web/20230320181613/https://www25.senado.leg.br/documents/12427/45868/RISF%202018%20Volume%201.pdf/cd5769c8-46c5-4c8a-9af7-99be436b89c4)
  - Resolução do Senado 14/2023, https://www2.camara.leg.br/legin/fed/ressen/2023/resolucao-14-7-junho-2023-794275-norma-pl.html (no snapshot: save failed)
- **Verify:**
  - [ ] Art. 104-D, as in force before 2023-06-07, is the commission's whole
        mandate, and no other Senate act gave it a foresight function.
  - [ ] Read against condition 3's term list, the mandate does not name a
        foresight function. If you read it as naming one, Brazil's I4 is 1
        and its score 80: say so.
- **The country's GFFs:** as entry 7.

### 10. NGA: Legislative Centre for Security Analysis, NILDS (electoral democracy, rejected)

- **Adjudicated:** fails condition 4. Coder B examined it; coder A did not
  list it. A peace and security research arm of the National Institute for
  Legislative and Democratic Studies.
- **Sources:** none cited. Check nilds.gov.ng.
- **Verify:**
  - [ ] Its mandate is confined to security.
- **The country's GFFs:** none. Country items all 0; score 0.

### 11. EST: Arenguseire Keskus, Foresight Centre (liberal democracy, GFF)

- **Adjudicated:** meets the unit. record 1, product 1, survived 1,
  closedNoSuccessor 0. Both coders agreed.
- **Sources:**
  - Foresight Act, https://www.riigiteataja.ee/en/eli/509022018003/consolide (archived https://web.archive.org/web/20250808103748/https://www.riigiteataja.ee/en/eli/509022018003/consolide); the page renders in a browser.
  - https://arenguseire.ee/en/reports/the-future-of-accessibility-of-local-public-services-trends-and-scenarios-up-to-2050/ (archived https://web.archive.org/web/20260315145723/https://arenguseire.ee/en/reports/the-future-of-accessibility-of-local-public-services-trends-and-scenarios-up-to-2050/)
  - https://valitsus.ee/peaminister-ministrid/varasemad-valitsused (archived https://web.archive.org/web/20261001195808/https://valitsus.ee/peaminister-ministrid/varasemad-valitsused)
- **Verify:**
  - [ ] The Foresight Act defines foresight and places the centre at the
        Chancellery of the Riigikogu, with a date (record 1).
  - [ ] The report on local public services is issued by the centre, dated on
        or after 2023-10-02, with scenarios to 2050 (product 1).
  - [ ] The centre was established before a change of prime minister and
        operated at least six months after it (survived 1).
- **The country's GFFs:** `EST.fc` (this body); `EST.edf`, Estonian
  Development Fund, closed: record 1, product 0, survived 1,
  closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

## The adjudicated splits, checked in addition

### EST: Eesti Arengufond, Estonian Development Fund (unit split)

- **Coders:** A meets the unit (condition 4 low confidence). B fails
  condition 4: its foresight function served "sustainable economic
  development of Estonia".
- **Adjudicated:** meets the unit, low confidence, as in round 2. The act
  created a public-law body reporting to the Riigikogu whose tasks included
  organising foresight; its monitoring reports covered society, technology
  and the economy. record 1: the Estonian Development Fund Act, passed
  2006-11-15 and in force 2006-12-01 (RT I 2006, 52, 385), which both coders
  read in a browser under 1.3. Its foresight task was repealed with effect
  from 2016-06-29, when the Foresight Act gave the function to the
  Riigikogu's Foresight Centre, a same-branch successor. closedNoSuccessor 0.
  No country item changes.
- **Source:** https://www.riigiteataja.ee/akt/13238017 (renders in a browser)
- **Verify:**
  - [ ] The act names foresight ("arenguseire") as a task, and that task is
        not confined to one sector (condition 4).
  - [ ] The foresight task passed to the Foresight Centre within 24 months.

### GBR: Horizon Scanning Programme team (unit split)

- **Coders:** A meets the unit (low confidence on condition 2). B fails it
  for lack of a primary page read.
- **Adjudicated:** meets the unit, low confidence. The gov.uk team page,
  first published 2014-07-03, describes cross-government horizon scanning
  beyond the parliamentary term, and now states that the team no longer
  exists and points to Futures, Foresight and Emerging Technologies in the
  Government Office for Science. record 1, product 0, survived 1,
  closedNoSuccessor 0 (named same-branch successor). No country item
  changes.
- **Source:** https://www.gov.uk/government/groups/horizon-scanning-programme-team
- **Verify:**
  - [ ] The page states the team's horizon scanning mandate and names its
        successor.

### GBR: Government Office for Science, Futures, Foresight and Emerging Technologies team (product split)

- **Coders:** both meet the unit. A codes product 1 for the team; B codes it
  0 and credits the product to the parent office.
- **Adjudicated:** product 0 for the team under codebook 1.3: "Global supply
  chains: a Foresight report on risk and resilience" is issued under the
  Government Office for Science, and the page does not name the team as an
  institution. The product counts for `GBR.goscience`. No country item
  changes.
- **Source:** https://www.gov.uk/government/publications/global-supply-chains-a-foresight-report-on-risk-and-resilience (archived https://web.archive.org/web/20261002151539/https://www.gov.uk/government/publications/global-supply-chains-a-foresight-report-on-risk-and-resilience)
- **Verify:**
  - [ ] The publication page names the Government Office for Science, and
        not the team, as the issuing organisation.

### GBR: Government Office for Science (survival split)

- **Coders:** both meet the unit. A codes survived 1; B codes `no_change`
  because it read no date for the office.
- **Adjudicated:** survived 1. The Foresight annual review 2010 (gov.uk,
  2011) shows the office holding the foresight function by 2011, before the
  2016, 2019, 2022 and 2024 changes of prime minister, and it operates
  today. record stays 0: no official record dates the office's own creation
  or mandate. No country item changes.
- **Source:** https://assets.publishing.service.gov.uk/media/5a7ba10b40f0b645ba3c58dc/11-p91-foresight-annual-review-2010.pdf (archived https://web.archive.org/web/20261003080023/https://assets.publishing.service.gov.uk/media/5a7ba10b40f0b645ba3c58dc/11-p91-foresight-annual-review-2010.pdf)
- **Verify:**
  - [ ] The review shows the Government Office for Science holding the
        foresight function before July 2016.

## Result
