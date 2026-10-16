# Foresight register spot-check: the pilot recode under codebook 1.3

> **Status, 2026-10-16.** Drawn and checked. The first 1.3 recode, drawn on
> 2026-10-03, was never committed and is lost. The ten pilot countries were
> recoded on 2026-10-16 (`FORESIGHT-REGISTER-RESULTS.md`, section 1), and
> this sheet was redrawn from that recode's adjudicated body list with the
> rule and seed it already stated. The earlier draw is not kept: its body
> ids belong to the lost table.

The round 2 spot-check (`FORESIGHT-REGISTER-SPOTCHECK.md`) overturned three of
11 sampled bodies and failed D148. Codebook 1.3 settles the points those
overturns traced to. The ten pilot countries were recoded under 1.3 by two
fresh coders of different vendors, and this check is drawn from that
recode's adjudicated body list before any of the 125 is coded.

## How the sample was drawn

The 1.3 coders and the adjudicator examined 105 distinct bodies across the
ten countries (`data/research/foresight-register-pilot-1.3/bodies.json`).
The sample is 21 of them, 20 percent, drawn by the round 2 rule with the
seed this sheet fixed on 2026-10-03:

- The strata are the four V-Dem regime classes. Each class gets
  round(0.2 x its bodies): closed autocracy 7 of 34 (1 GFFs), electoral autocracy 4 of 22 (3 GFFs), electoral democracy 7 of 35 (13 GFFs), liberal democracy 3 of 14 (5 GFFs).
- Within a class, max(1, round(n x GFFs / bodies)) are drawn from the bodies
  adjudicated as meeting the unit (a GFF), and the rest from those adjudicated
  as failing it.
- Candidates sorted by id, drawn with `rng.sample`, classes in the order
  above, GFFs before rejections,
  `rng = random.Random("ncb-foresight-spotcheck-1.3-2026-10-03")`.

The two coders split on 17 bodies, on the unit or on a body code. The draw
took four of them (`GBR.hss`, `GBR.jdac`, `NGA.ospre`, `CHE.pstab`), and the
other 13 are checked in addition. The sample is larger than round 2's 11
because the coders listed more bodies.

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

### 1. ARE: Ministry of Cabinet Affairs (Ministry of Cabinet Affairs and the Future, 2016-2020) (closed autocracy, GFF)

- **Coders:** A meets the unit (record 1, product 0, survived `no_change`, closedNoSuccessor 0); B meets the unit (record 1, product 0, survived `no_change`, closedNoSuccessor 0). No split.
- **Adjudicated:** meets the unit. record 1, product 0, survived `no_change`, closedNoSuccessor 0. Status operating. Meets 1-4: federal ministry whose own pages name future foresight (istishraf al-mustaqbal) across all sectors; foresight mandate dated 2016.
- **Sources:**
  - https://uaecabinet.ae/en/news/mohammed-bin-rashid-launches-uae-strategy-for-the-future (archived https://web.archive.org/web/20250119204447/https://uaecabinet.ae/en/news/mohammed-bin-rashid-launches-uae-strategy-for-the-future): "Mohammed bin Rashid launches 'UAE Strategy for the Future' 29.09.2016 ... Ratified by the Ministry of Cabinet Affairs and The Future"
- **Verify:**
  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.
  - [ ] record 1: an official record does date its creation or foresight mandate.
  - [ ] product 0: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does not exist.
  - [ ] survived `no_change` holds on the body's own dates.
  - [ ] closedNoSuccessor 0 holds.
- **The country's GFFs:** `ARE.moca`, Ministry of Cabinet Affairs (Ministry of Cabinet Affairs and the Future, 2016-2020), operating: record 1, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 0, I3 0 `no_change`, I4 0; score 33.

### 2. ARE: World Governments Summit Organization (closed autocracy, rejected)

- **Coders:** A rejects it; B did not list it. No split.
- **Adjudicated:** fails the unit. Status operating. Fails condition 1 (self-described global non-profit, no founding act found) and condition 3.
- **Sources:** none cited. Check the body's official site and founding act.
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** `ARE.moca`, Ministry of Cabinet Affairs (Ministry of Cabinet Affairs and the Future, 2016-2020), operating: record 1, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 0, I3 0 `no_change`, I4 0; score 33.

### 3. HTI: Centre de Techniques de Planification et d'Économie Appliquée (closed autocracy, rejected)

- **Coders:** A did not list it; B rejects it. No split.
- **Adjudicated:** fails the unit. Status operating. Fails condition 3: training and applied planning.
- **Sources:** none cited. Check the body's official site and founding act.
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** none. Country items: I1 0, I2 0, I3 0, I4 0; score 0.

### 4. VNM: National Institute for Economics and Finance, Ministry of Finance (closed autocracy, rejected)

- **Coders:** A did not list it; B rejects it. No split.
- **Adjudicated:** fails the unit. Status operating. Fails condition 3: strategy and forecasting.
- **Sources:** none cited. Check the body's official site and founding act.
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** none. Country items: I1 0, I2 0, I3 0, I4 0; score 0.

### 5. ARE: Centennial Lab, Ministry of Cabinet Affairs (closed autocracy, rejected)

- **Coders:** A rejects it; B did not list it. No split.
- **Adjudicated:** fails the unit. Status operating. Fails condition 3: its own page sets a platform to implement UAE Centennial 2071 and promote readiness; no listed foresight term.
- **Ruling:** Fails condition 3. moca.gov.ae page read in a browser: 'a platform to develop ... projects related to the implementation of the UAE Centennial 2071; promote readiness'. A vision implementation, no listed term.
- **Sources:**
  - https://www.moca.gov.ae/en/area-of-focus/centennial-lab (no snapshot): "established as a platform to develop the foundations, methodologies ... related to the implementation of the UAE Centennial 2071"
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** `ARE.moca`, Ministry of Cabinet Affairs (Ministry of Cabinet Affairs and the Future, 2016-2020), operating: record 1, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 0, I3 0 `no_change`, I4 0; score 33.

### 6. ARE: Ministry of Industry and Advanced Technology (closed autocracy, rejected)

- **Coders:** A did not list it; B rejects it. No split.
- **Adjudicated:** fails the unit. Status operating. Fails condition 4: industry and technology sector only.
- **Sources:** none cited. Check the body's official site and founding act.
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** `ARE.moca`, Ministry of Cabinet Affairs (Ministry of Cabinet Affairs and the Future, 2016-2020), operating: record 1, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 0, I3 0 `no_change`, I4 0; score 33.

### 7. VNM: Ministry of Planning and Investment (closed autocracy, rejected)

- **Coders:** A did not list it; B rejects it. No split.
- **Adjudicated:** fails the unit. Status merged. Fails condition 3: planning ministry.
- **Sources:** none cited. Check the body's official site and founding act.
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** none. Country items: I1 0, I2 0, I3 0, I4 0; score 0.

### 8. SGP: Centre for Strategic Futures (CSF), Strategy Group, Prime Minister's Office (electoral autocracy, GFF)

- **Coders:** A meets the unit (record 1, product 1, survived `1`, closedNoSuccessor 0); B meets the unit (record 1, product 1, survived `1`, closedNoSuccessor 0). No split.
- **Adjudicated:** meets the unit. record 1, product 1, survived `1`, closedNoSuccessor 0. Status operating. Meets 1-4: its own page calls it a foresight unit established in 2009 for long-term futures research for the whole of government.
- **Sources:**
  - https://www.csf.gov.sg/who-we-are/ (archived https://web.archive.org/web/20260914055254/https://www.csf.gov.sg/who-we-are/): "In 2009, the Centre for Strategic Futures (CSF) was established as a futures think tank within SPO"
- **Verify:**
  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.
  - [ ] record 1: an official record does date its creation or foresight mandate.
  - [ ] product 1: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does exist.
  - [ ] survived `1` holds on the body's own dates.
  - [ ] closedNoSuccessor 0 holds.
- **The country's GFFs:** `SGP.csf`, Centre for Strategic Futures (CSF), Strategy Group, Prime Minister's Office, operating: record 1, product 1, survived `1`, closedNoSuccessor 0; `SGP.spo`, Scenario Planning Office (1995), renamed Strategic Policy Office (2003), Prime Minister's Office, merged: record 1, product 0, survived `1`, closedNoSuccessor 0; `SGP.fut`, Futures team, Strategy Group, operating: record 0, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### 9. NIC: Banco Central de Nicaragua (electoral autocracy, rejected)

- **Coders:** A did not list it; B rejects it. No split.
- **Adjudicated:** fails the unit. Status operating. Fails section 1: central bank exclusion.
- **Sources:** none cited. Check the body's official site and founding act.
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** none. Country items: I1 0, I2 0, I3 0, I4 0; score 0.

### 10. SGP: Parliament of Singapore and Parliament Secretariat (electoral autocracy, rejected)

- **Coders:** A did not list it; B rejects it. No split.
- **Adjudicated:** fails the unit. Status operating. Fails condition 3.
- **Sources:** none cited. Check the body's official site and founding act.
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** `SGP.csf`, Centre for Strategic Futures (CSF), Strategy Group, Prime Minister's Office, operating: record 1, product 1, survived `1`, closedNoSuccessor 0; `SGP.spo`, Scenario Planning Office (1995), renamed Strategic Policy Office (2003), Prime Minister's Office, merged: record 1, product 0, survived `1`, closedNoSuccessor 0; `SGP.fut`, Futures team, Strategy Group, operating: record 0, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### 11. NIC: Asamblea Nacional (electoral autocracy, rejected)

- **Coders:** A did not list it; B rejects it. No split.
- **Adjudicated:** fails the unit. Status operating. Fails condition 3.
- **Sources:** none cited. Check the body's official site and founding act.
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** none. Country items: I1 0, I2 0, I3 0, I4 0; score 0.

### 12. GBR: Cabinet Office Horizon Scanning Secretariat (electoral democracy, GFF)

- **Coders:** A meets the unit (record 0, product 0, survived `did_not_survive`, closedNoSuccessor 0); B rejects it. A split.
- **Adjudicated:** meets the unit. record 0, product 0, survived `no_change`, closedNoSuccessor 0. Status merged. Meets 1-4: a Cabinet Office secretariat for cross-government horizon scanning, shown to exist by the official page that records its March 2014 merger; founding date not on a record read.
- **Ruling:** Meets unit (A); A's entry is split into GBR.hss and GBR.hsc. The archived gov.uk group page (Wayback 2019-12-08) records that the Cabinet Office's Horizon Scanning Secretariat merged in March 2014. That establishes a standing cross-government horizon-scanning secretariat. No record dates its creation. It ended before the I4 window with a successor.
- **Sources:**
  - https://www.gov.uk/government/groups/horizon-scanning-programme-team (archived https://web.archive.org/web/20191208052150/https://www.gov.uk/government/groups/horizon-scanning-programme-team): "the Cabinet Office's Horizon Scanning Secretariat and the Government Office of Science's Horizon Scanning Centre were merged"
- **Verify:**
  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.
  - [ ] record 0: an official record does not date its creation or foresight mandate.
  - [ ] product 0: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does not exist.
  - [ ] survived `no_change` holds on the body's own dates.
  - [ ] closedNoSuccessor 0 holds.
- **The country's GFFs:** `GBR.gos`, Government Office for Science (GO-Science), operating: record 0, product 1, survived `1`, closedNoSuccessor 0; `GBR.ffet`, Futures, Foresight and Emerging Technologies team, GO-Science, operating: record 0, product 0, survived `1`, closedNoSuccessor 0; `GBR.hsp`, Horizon Scanning Programme team (Cabinet Office and GO-Science), closed: record 1, product 0, survived `1`, closedNoSuccessor 0; `GBR.hss`, Cabinet Office Horizon Scanning Secretariat, merged: record 0, product 0, survived `no_change`, closedNoSuccessor 0; `GBR.hsc`, Horizon Scanning Centre (OSI / GO-Science), merged: record 1, product 0, survived `1`, closedNoSuccessor 0; `GBR.post`, Parliamentary Office of Science and Technology (POST), operating: record 1, product 1, survived `1`, closedNoSuccessor 0; `GBR.jdac`, Joint Data and Analysis Centre Foresight team, Cabinet Office, operating: record 0, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### 13. NGA: Office for Strategic Preparedness and Resilience (OSPRE), Office of the Vice President (electoral democracy, GFF)

- **Coders:** A rejects it; B meets the unit (record 1, product 0, survived `1`, closedNoSuccessor 0). A split.
- **Adjudicated:** meets the unit. record 1, product 0, survived `1`, closedNoSuccessor 0. Status operating. Meets 1-4 at low confidence: created by Executive Order 12 (10 June 2022); its own official page names long-term horizon scanning and anticipatory intelligence across eleven domains, including health, food, energy, economy and governance.
- **Ruling:** Meets unit (B), low confidence. osprenigeria.gov.ng/services lists 'Short, medium, and long-term threat horizon scanning', and the about page lists 'over-the-horizon trends' across eleven domains (health, food, energy, economy, governance, environment, crime, security). A missed the listed term. The founding release calls it 'the human security sector cutting across the environment, public health and governance'. Section 1 condition 4 names defence, not human security, so whether a multi-domain human-security mandate is one sector is open.
- **Sources:**
  - https://statehouse.gov.ng/president-sets-up-national-early-warning-centre-in-vps-office/ (no snapshot): "The order signed on June 10, 2022 establishes the National Early Warning Centre"
  - https://www.osprenigeria.gov.ng/services (no snapshot): "Short, medium, and long-term threat horizon scanning"
  - https://www.radionigeriakaduna.gov.ng/2026/02/13/unicef-fg-launch-child-foresight-initiative/ (no snapshot): "Published on 13 February 2026 ... the Anticipatory Governance and Foresight Capacity (AGFC) programme implemented by the Office for Strategic Preparedness and Resilience (OSPRE)"
- **Verify:**
  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.
  - [ ] record 1: an official record does date its creation or foresight mandate.
  - [ ] product 0: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does not exist.
  - [ ] survived `1` holds on the body's own dates.
  - [ ] closedNoSuccessor 0 holds.
- **The country's GFFs:** `NGA.ospre`, Office for Strategic Preparedness and Resilience (OSPRE), Office of the Vice President, operating: record 1, product 0, survived `1`, closedNoSuccessor 0. Country items: I1 1, I2 0, I3 1, I4 0; score 67.

### 14. GBR: Joint Data and Analysis Centre Foresight team, Cabinet Office (electoral democracy, GFF)

- **Coders:** A did not list it; B meets the unit (record 0, product 0, survived `no_change`, closedNoSuccessor 0). A split.
- **Adjudicated:** meets the unit. record 0, product 0, survived `no_change`, closedNoSuccessor 0. Status operating. Meets 1-4 at low confidence: a Cabinet Office foresight team working across government, named on the GO-Science futures page; no dated record or own product found.
- **Ruling:** Meets unit (B), low confidence. The gov.uk futures page states that GO-Science works with the Cabinet Office 'through the Foresight team in the Joint Data and Analysis Centre', which works across government. No dated record or own product was found.
- **Sources:**
  - https://www.gov.uk/government/groups/futures-and-foresight (no snapshot): "GO-Science collaborates with the Cabinet Office through the Foresight team in the Joint Data and Analysis Centre ( JDAC )"
- **Verify:**
  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.
  - [ ] record 0: an official record does not date its creation or foresight mandate.
  - [ ] product 0: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does not exist.
  - [ ] survived `no_change` holds on the body's own dates.
  - [ ] closedNoSuccessor 0 holds.
- **The country's GFFs:** `GBR.gos`, Government Office for Science (GO-Science), operating: record 0, product 1, survived `1`, closedNoSuccessor 0; `GBR.ffet`, Futures, Foresight and Emerging Technologies team, GO-Science, operating: record 0, product 0, survived `1`, closedNoSuccessor 0; `GBR.hsp`, Horizon Scanning Programme team (Cabinet Office and GO-Science), closed: record 1, product 0, survived `1`, closedNoSuccessor 0; `GBR.hss`, Cabinet Office Horizon Scanning Secretariat, merged: record 0, product 0, survived `no_change`, closedNoSuccessor 0; `GBR.hsc`, Horizon Scanning Centre (OSI / GO-Science), merged: record 1, product 0, survived `1`, closedNoSuccessor 0; `GBR.post`, Parliamentary Office of Science and Technology (POST), operating: record 1, product 1, survived `1`, closedNoSuccessor 0; `GBR.jdac`, Joint Data and Analysis Centre Foresight team, Cabinet Office, operating: record 0, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### 15. BRA: Centro de Gestão e Estudos Estratégicos (CGEE) (electoral democracy, rejected)

- **Coders:** A rejects it; B rejects it. No split.
- **Adjudicated:** fails the unit. Status operating. Fails condition 1: private-law social organisation under a management contract.
- **Sources:** none cited. Check the body's official site and founding act.
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** `BRA.ipea`, Instituto de Pesquisa Econômica Aplicada (Ipea), Institute for Applied Economic Research, operating: record 1, product 0, survived `1`, closedNoSuccessor 0; `BRA.seplan`, Secretaria Nacional de Planejamento (Seplan), Ministry of Planning and Budget, operating: record 1, product 1, survived `no_change`, closedNoSuccessor 0; `BRA.splp`, Subsecretaria de Planejamento de Longo Prazo, Long-Term Planning Undersecretariat (Seplan/MPO), operating: record 1, product 0, survived `no_change`, closedNoSuccessor 0; `BRA.saedes`, Diretoria de Desenvolvimento Econômico e Social da SAE/PR, Directorate of Economic and Social Development, closed: record 1, product 0, survived `did_not_survive`, closedNoSuccessor 0; `BRA.nae`, Núcleo de Assuntos Estratégicos da Presidência, Strategic Affairs Unit of the Presidency, closed: record 1, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### 16. NGA: National Institute for Policy and Strategic Studies (electoral democracy, rejected)

- **Coders:** A rejects it; B rejects it. No split.
- **Adjudicated:** fails the unit. Status operating. Fails condition 3: long-range national plans, no listed term.
- **Sources:** none cited. Check the body's official site and founding act.
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** `NGA.ospre`, Office for Strategic Preparedness and Resilience (OSPRE), Office of the Vice President, operating: record 1, product 0, survived `1`, closedNoSuccessor 0. Country items: I1 1, I2 0, I3 1, I4 0; score 67.

### 17. BRA: Comissão Senado do Futuro, Senate Committee of the Future (electoral democracy, rejected)

- **Coders:** A rejects it; B did not list it. No split.
- **Adjudicated:** fails the unit. Status closed. Fails condition 3: art. 104-D gives 'promover discussões sobre grandes temas e o futuro do País', which names no listed foresight term.
- **Ruling:** Fails condition 3; I4 0 stands. Senate Resolution 14 of 8 May 2013, art. 104-D: 'promover discussões sobre grandes temas e o futuro do País'. 'O futuro do País' (the future of the country) is not one of the listed terms or a direct equivalent of 'futures studies'. The codebook does not say whether a bare 'future' counts as a direct equivalent of 'futures'. Read strictly, it does not.
- **Sources:**
  - https://www2.camara.leg.br/legin/fed/ressen/2013/resolucao-14-8-maio-2013-775951-publicacaooriginal-139761-pl.html (no snapshot): "Art. 104-D. À Comissão Senado do Futuro compete promover discussões sobre grandes temas e o futuro do País"
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** `BRA.ipea`, Instituto de Pesquisa Econômica Aplicada (Ipea), Institute for Applied Economic Research, operating: record 1, product 0, survived `1`, closedNoSuccessor 0; `BRA.seplan`, Secretaria Nacional de Planejamento (Seplan), Ministry of Planning and Budget, operating: record 1, product 1, survived `no_change`, closedNoSuccessor 0; `BRA.splp`, Subsecretaria de Planejamento de Longo Prazo, Long-Term Planning Undersecretariat (Seplan/MPO), operating: record 1, product 0, survived `no_change`, closedNoSuccessor 0; `BRA.saedes`, Diretoria de Desenvolvimento Econômico e Social da SAE/PR, Directorate of Economic and Social Development, closed: record 1, product 0, survived `did_not_survive`, closedNoSuccessor 0; `BRA.nae`, Núcleo de Assuntos Estratégicos da Presidência, Strategic Affairs Unit of the Presidency, closed: record 1, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### 18. BRA: National Congress science and technology committees (electoral democracy, rejected)

- **Coders:** A did not list it; B rejects it. No split.
- **Adjudicated:** fails the unit. Status operating. Fails condition 3: no technology-assessment or foresight mandate.
- **Sources:** none cited. Check the body's official site and founding act.
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** `BRA.ipea`, Instituto de Pesquisa Econômica Aplicada (Ipea), Institute for Applied Economic Research, operating: record 1, product 0, survived `1`, closedNoSuccessor 0; `BRA.seplan`, Secretaria Nacional de Planejamento (Seplan), Ministry of Planning and Budget, operating: record 1, product 1, survived `no_change`, closedNoSuccessor 0; `BRA.splp`, Subsecretaria de Planejamento de Longo Prazo, Long-Term Planning Undersecretariat (Seplan/MPO), operating: record 1, product 0, survived `no_change`, closedNoSuccessor 0; `BRA.saedes`, Diretoria de Desenvolvimento Econômico e Social da SAE/PR, Directorate of Economic and Social Development, closed: record 1, product 0, survived `did_not_survive`, closedNoSuccessor 0; `BRA.nae`, Núcleo de Assuntos Estratégicos da Presidência, Strategic Affairs Unit of the Presidency, closed: record 1, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### 19. CHE: Perspektivstab der Bundesverwaltung, Federal Administration Perspectives Staff (liberal democracy, GFF)

- **Coders:** A rejects it; B meets the unit (record 1, product 0, survived `1`, closedNoSuccessor 0). A split.
- **Adjudicated:** meets the unit. record 1, product 0, survived `1`, closedNoSuccessor 0. Status closed. Meets 1-4 at low confidence: a standing interdepartmental staff of the executive, led by the Chancellery, that drafted the four-yearly futures reports with future scenarios across policy areas; its 2009 reconstitution is on the Federal Council's official record.
- **Ruling:** Meets unit (B), low confidence. The Federal Council's 2010 business report (BK) records the constitutive meeting of the newly formed Perspektivstab on 12 Nov 2009 under the goal 'Früherkennung wichtiger Entwicklungen und Trends', with four alternative future scenarios. The BK page credits it with the 2007, 2011 and 2014 futures reports. B's Federal Council decision of 18 Sep 2009 was not found in the 2009 report. It is an interdepartmental staff, and section 1 does not say outright that such a staff is an organisational unit. It was operating after the 2010 council-majority change, so survived is 1. Its end is undated, and the BK carries the mandate in the same branch.
- **Sources:**
  - https://www.bk.admin.ch/dam/bk/de/dokumente/strategische-fuehrungsunterstuetzung/Gesch%C3%A4ftsbericht/geschaeftsberichtdesbundesrates2010-bandii.pdf.download.pdf/geschaeftsberichtdesbundesrates2010-bandii.pdf (archived https://web.archive.org/web/2024/https://www.bk.admin.ch/dam/bk/de/dokumente/strategische-fuehrungsunterstuetzung/Gesch%C3%A4ftsbericht/geschaeftsberichtdesbundesrates2010-bandii.pdf.download.pdf/geschaeftsberichtdesbundesrates2010-bandii.pdf): "Die konstituierende Sitzung des Perspektivstabes hat am 12. November 2009 stattgefunden ... vier unterschiedliche, aber plausible Zukunftsszenarien"
  - https://www.bk.admin.ch/de/lage-und-umfeldanalyse (archived https://web.archive.org/web/20261002151126/https://www.bk.admin.ch/de/lage-und-umfeldanalyse): "Der Bericht wurde von der Bundeskanzlei unter Einbezug der Expertise aus 30 Bundesämtern («Perspektivstab der Bundesverwaltung») erarbeitet"
- **Verify:**
  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.
  - [ ] record 1: an official record does date its creation or foresight mandate.
  - [ ] product 0: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does not exist.
  - [ ] survived `1` holds on the body's own dates.
  - [ ] closedNoSuccessor 0 holds.
- **The country's GFFs:** `CHE.bk`, Schweizerische Bundeskanzlei, Federal Chancellery, operating: record 1, product 1, survived `1`, closedNoSuccessor 0; `CHE.stf`, Sektion Strategische Führungsunterstützung, Strategic Management Support Section, operating: record 0, product 0, survived `no_change`, closedNoSuccessor 0; `CHE.pstab`, Perspektivstab der Bundesverwaltung, Federal Administration Perspectives Staff, closed: record 1, product 0, survived `1`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### 20. EST: Riigikogu and Chancellery of the Riigikogu (liberal democracy, rejected)

- **Coders:** A did not list it; B rejects it. No split.
- **Adjudicated:** fails the unit. Status operating. Fails condition 3 as parents: the Foresight Centre's mandate is its own.
- **Sources:** none cited. Check the body's official site and founding act.
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** `EST.fc`, Arenguseire Keskus, Foresight Centre, operating: record 1, product 1, survived `1`, closedNoSuccessor 0; `EST.edf`, Eesti Arengufond, Estonian Development Fund, closed: record 1, product 0, survived `1`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### 21. EST: Ministry of Economic Affairs and Communications (liberal democracy, rejected)

- **Coders:** A did not list it; B rejects it. No split.
- **Adjudicated:** fails the unit. Status operating. Fails condition 3: no own cross-policy foresight mandate.
- **Sources:** none cited. Check the body's official site and founding act.
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** `EST.fc`, Arenguseire Keskus, Foresight Centre, operating: record 1, product 1, survived `1`, closedNoSuccessor 0; `EST.edf`, Eesti Arengufond, Estonian Development Fund, closed: record 1, product 0, survived `1`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.


## The adjudicated splits, checked in addition

### +1. BRA: Instituto de Pesquisa Econômica Aplicada (Ipea), Institute for Applied Economic Research (electoral democracy, GFF)

- **Coders:** A meets the unit (record 1, product 0, survived `1`, closedNoSuccessor 0); B rejects it. A split.
- **Adjudicated:** meets the unit. record 1, product 0, survived `1`, closedNoSuccessor 0. Status operating. Meets 1-4: federal public foundation under the planning ministry; its statute names 'estudos prospectivos de médio e longo prazo' (prospectivo is a listed term) over economy, society and public management.
- **Ruling:** Meets unit (A). Decree 7.142 of 29 Mar 2010, Annex I art. 3 III, and Decree 11.194 of 8 Sep 2022: 'realizar estudos prospectivos de médio e longo prazo'. 'Prospectivo' is a listed term, no numeric horizon is stated, the remit crosses domains, and Ipea is a public foundation under the planning ministry. B missed the statute. Body codes: record 1, product 0 (repository search found no in-window Ipea futures product; TD 3139 is a crop-model projection), survived 1.
- **Sources:**
  - https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2010/Decreto/D7142.htm (archived https://web.archive.org/web/20261003075435/https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2010/Decreto/D7142.htm): "DECRETO Nº 7.142, DE 29 DE MARÇO DE 2010 ... III - realizar estudos prospectivos de médio e longo prazo"
  - https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/decreto/D11194.htm (archived https://web.archive.org/web/20261003075422/https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/decreto/D11194.htm): "DECRETO Nº 11.194, DE 8 DE SETEMBRO DE 2022 ... III - realizar estudos prospectivos de médio e longo prazo"
- **Verify:**
  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.
  - [ ] record 1: an official record does date its creation or foresight mandate.
  - [ ] product 0: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does not exist.
  - [ ] survived `1` holds on the body's own dates.
  - [ ] closedNoSuccessor 0 holds.
- **The country's GFFs:** `BRA.ipea`, Instituto de Pesquisa Econômica Aplicada (Ipea), Institute for Applied Economic Research, operating: record 1, product 0, survived `1`, closedNoSuccessor 0; `BRA.seplan`, Secretaria Nacional de Planejamento (Seplan), Ministry of Planning and Budget, operating: record 1, product 1, survived `no_change`, closedNoSuccessor 0; `BRA.splp`, Subsecretaria de Planejamento de Longo Prazo, Long-Term Planning Undersecretariat (Seplan/MPO), operating: record 1, product 0, survived `no_change`, closedNoSuccessor 0; `BRA.saedes`, Diretoria de Desenvolvimento Econômico e Social da SAE/PR, Directorate of Economic and Social Development, closed: record 1, product 0, survived `did_not_survive`, closedNoSuccessor 0; `BRA.nae`, Núcleo de Assuntos Estratégicos da Presidência, Strategic Affairs Unit of the Presidency, closed: record 1, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### +2. BRA: Subsecretaria de Planejamento de Longo Prazo, Long-Term Planning Undersecretariat (Seplan/MPO) (electoral democracy, GFF)

- **Coders:** A meets the unit (record 1, product 1, survived `no_change`, closedNoSuccessor 0); B meets the unit (record 1, product 0, survived `no_change`, closedNoSuccessor 0). A split.
- **Adjudicated:** meets the unit. record 1, product 0, survived `no_change`, closedNoSuccessor 0. Status operating. Meets 1-4 as a unit: Decree 11.353/2023 art. 16 II, 'elaborar estudos prospectivos e análises de cenários', for national long-term planning.
- **Ruling:** 0 (B). The Megatendências 2050 credit page lists 'Subsecretário de Planejamento de Longo Prazo' and a name, which is a person's post (1.3: affiliation is not authorship). The issuing body on the cover is MPO. The ministry's Relatório de Gestão 2025 credits the Estratégia Brasil 2050 series to 'SEPLAN'. The product counts for Seplan, not for its subsecretariat.
- **Sources:**
  - https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/D11353.htm (no snapshot): "Art. 16. À Subsecretaria de Planejamento de Longo Prazo compete: ... II - elaborar estudos prospectivos e análises de cenários"
- **Verify:**
  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.
  - [ ] record 1: an official record does date its creation or foresight mandate.
  - [ ] product 0: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does not exist.
  - [ ] survived `no_change` holds on the body's own dates.
  - [ ] closedNoSuccessor 0 holds.
- **The country's GFFs:** `BRA.ipea`, Instituto de Pesquisa Econômica Aplicada (Ipea), Institute for Applied Economic Research, operating: record 1, product 0, survived `1`, closedNoSuccessor 0; `BRA.seplan`, Secretaria Nacional de Planejamento (Seplan), Ministry of Planning and Budget, operating: record 1, product 1, survived `no_change`, closedNoSuccessor 0; `BRA.splp`, Subsecretaria de Planejamento de Longo Prazo, Long-Term Planning Undersecretariat (Seplan/MPO), operating: record 1, product 0, survived `no_change`, closedNoSuccessor 0; `BRA.saedes`, Diretoria de Desenvolvimento Econômico e Social da SAE/PR, Directorate of Economic and Social Development, closed: record 1, product 0, survived `did_not_survive`, closedNoSuccessor 0; `BRA.nae`, Núcleo de Assuntos Estratégicos da Presidência, Strategic Affairs Unit of the Presidency, closed: record 1, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### +3. BRA: Diretoria de Desenvolvimento Econômico e Social da SAE/PR, Directorate of Economic and Social Development (electoral democracy, GFF)

- **Coders:** A meets the unit (record 1, product 0, survived `no_change`, closedNoSuccessor 0); B did not list it. A split.
- **Adjudicated:** meets the unit. record 1, product 0, survived `did_not_survive`, closedNoSuccessor 0. Status closed. Meets 1-4 as a unit: Decree 11.285/2022 art. 23 III gives it scenario studies for long-term national planning across economic and social development.
- **Ruling:** Meets unit (A); survived did_not_survive (overturns A's no_change). Decree 11.285/2022 art. 23 III: 'realizar estudos e análises de cenários que contribuam para ... a formulação do planejamento nacional de longo prazo', across economic and social development. Decree 11.365 of 1 Jan 2023, issued on the day the presidency changed, revoked it. It ended at a change, which I3 codes did_not_survive. The same-day MPO successor (art. 16 II) keeps closedNoSuccessor at 0.
- **Sources:**
  - https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/decreto/D11285.htm (no snapshot): "Art. 23 ... III - realizar estudos e análises de cenários que contribuam para: a) a formulação do planejamento nacional de longo prazo"
- **Verify:**
  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.
  - [ ] record 1: an official record does date its creation or foresight mandate.
  - [ ] product 0: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does not exist.
  - [ ] survived `did_not_survive` holds on the body's own dates.
  - [ ] closedNoSuccessor 0 holds.
- **The country's GFFs:** `BRA.ipea`, Instituto de Pesquisa Econômica Aplicada (Ipea), Institute for Applied Economic Research, operating: record 1, product 0, survived `1`, closedNoSuccessor 0; `BRA.seplan`, Secretaria Nacional de Planejamento (Seplan), Ministry of Planning and Budget, operating: record 1, product 1, survived `no_change`, closedNoSuccessor 0; `BRA.splp`, Subsecretaria de Planejamento de Longo Prazo, Long-Term Planning Undersecretariat (Seplan/MPO), operating: record 1, product 0, survived `no_change`, closedNoSuccessor 0; `BRA.saedes`, Diretoria de Desenvolvimento Econômico e Social da SAE/PR, Directorate of Economic and Social Development, closed: record 1, product 0, survived `did_not_survive`, closedNoSuccessor 0; `BRA.nae`, Núcleo de Assuntos Estratégicos da Presidência, Strategic Affairs Unit of the Presidency, closed: record 1, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### +4. BRA: Núcleo de Assuntos Estratégicos da Presidência, Strategic Affairs Unit of the Presidency (electoral democracy, GFF)

- **Coders:** A rejects it; B meets the unit (record 1, product 0, survived `no_change`, closedNoSuccessor 0). A split.
- **Adjudicated:** meets the unit. record 1, product 0, survived `no_change`, closedNoSuccessor 0. Status closed. Meets 1-4: Decree 6.217/2007 names exploratory long-term scenarios and long-term development alternatives across national strategic affairs.
- **Ruling:** Meets unit (B); A's entry is split into BRA.nae and BRA.sae2008. Decree 6.217 of 4 Oct 2007: 'elaboração de cenários exploratórios ... de longo prazo' and 'alternativas de desenvolvimento de longo prazo'. Long-term scenarios and alternative futures are listed terms. Decree 6.517/2008 for the SAE names no listed term, so SAE fails. NAE ended in 2008, outside the I4 window.
- **Sources:**
  - https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2007/decreto/d6217.htm (no snapshot): "IX - preparação e promoção de estudos e elaboração de cenários exploratórios na área de assuntos de natureza estratégica de longo prazo"
- **Verify:**
  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.
  - [ ] record 1: an official record does date its creation or foresight mandate.
  - [ ] product 0: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does not exist.
  - [ ] survived `no_change` holds on the body's own dates.
  - [ ] closedNoSuccessor 0 holds.
- **The country's GFFs:** `BRA.ipea`, Instituto de Pesquisa Econômica Aplicada (Ipea), Institute for Applied Economic Research, operating: record 1, product 0, survived `1`, closedNoSuccessor 0; `BRA.seplan`, Secretaria Nacional de Planejamento (Seplan), Ministry of Planning and Budget, operating: record 1, product 1, survived `no_change`, closedNoSuccessor 0; `BRA.splp`, Subsecretaria de Planejamento de Longo Prazo, Long-Term Planning Undersecretariat (Seplan/MPO), operating: record 1, product 0, survived `no_change`, closedNoSuccessor 0; `BRA.saedes`, Diretoria de Desenvolvimento Econômico e Social da SAE/PR, Directorate of Economic and Social Development, closed: record 1, product 0, survived `did_not_survive`, closedNoSuccessor 0; `BRA.nae`, Núcleo de Assuntos Estratégicos da Presidência, Strategic Affairs Unit of the Presidency, closed: record 1, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### +5. CHE: Sektion Strategische Führungsunterstützung, Strategic Management Support Section (liberal democracy, GFF)

- **Coders:** A meets the unit (record 0, product 0, survived `no_change`, closedNoSuccessor 0); B meets the unit (record 0, product 0, survived `1`, closedNoSuccessor 0). A split.
- **Adjudicated:** meets the unit. record 0, product 0, survived `no_change`, closedNoSuccessor 0. Status operating. Meets 1-4 as a unit: its own page assigns it the continuous long-term situation and context analysis of the next 10 to 15 years, cross-departmental.
- **Ruling:** no_change (A). No record dates the section or its own foresight mandate (bk.admin.ch section page, read). B's 2006 record shows a predecessor planning section, and dates stay with the body. I3 has no reason code for a body whose date cannot be seen. Section 4 (dates read from the source) gives 0, recorded here as no_change.
- **Sources:**
  - https://www.bk.admin.ch/en/strategic-management-support-section (no snapshot): "carries out a continuous long-term situation and context analysis ... to identify and anticipate the key developments ... of the next 10 to 15 years"
- **Verify:**
  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.
  - [ ] record 0: an official record does not date its creation or foresight mandate.
  - [ ] product 0: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does not exist.
  - [ ] survived `no_change` holds on the body's own dates.
  - [ ] closedNoSuccessor 0 holds.
- **The country's GFFs:** `CHE.bk`, Schweizerische Bundeskanzlei, Federal Chancellery, operating: record 1, product 1, survived `1`, closedNoSuccessor 0; `CHE.stf`, Sektion Strategische Führungsunterstützung, Strategic Management Support Section, operating: record 0, product 0, survived `no_change`, closedNoSuccessor 0; `CHE.pstab`, Perspektivstab der Bundesverwaltung, Federal Administration Perspectives Staff, closed: record 1, product 0, survived `1`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### +6. EST: Estonian Development Fund foresight unit (liberal democracy, rejected)

- **Coders:** A did not list it; B meets the unit (record 1, product 0, survived `1`, closedNoSuccessor 0). A split.
- **Adjudicated:** fails the unit. Status closed. Not shown as a separately mandated unit: § 40 of the Development Fund Act did not render (Riigi Teataja builds text in the browser; the act was not found); the foresight duty read is the Fund's own (§ 2(2)2).
- **Ruling:** Fails: not shown as a separately mandated unit, low confidence. Riigi Teataja builds its text in the browser. I rendered the 2011 amendment (RT I, 30.12.2011, 2) and the Foresight Act, but could not reach the Development Fund Act text with s. 40. The foresight duty I read (s. 2(2)2, 'korraldab arenguseiret') belongs to the Fund. No item depends on it: the Fund's foresight duties ended on 29 Jun 2016.
- **Sources:** none cited. Check the body's official site and founding act.
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** `EST.fc`, Arenguseire Keskus, Foresight Centre, operating: record 1, product 1, survived `1`, closedNoSuccessor 0; `EST.edf`, Eesti Arengufond, Estonian Development Fund, closed: record 1, product 0, survived `1`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### +7. GBR: Futures, Foresight and Emerging Technologies team, GO-Science (electoral democracy, GFF)

- **Coders:** A meets the unit (record 1, product 1, survived `1`, closedNoSuccessor 0); B meets the unit (record 0, product 0, survived `no_change`, closedNoSuccessor 0). A split.
- **Adjudicated:** meets the unit. record 0, product 0, survived `1`, closedNoSuccessor 0. Status operating. Meets 1-4 as a unit: its own page names futures, foresight and horizon scanning work for civil servants across government.
- **Ruling:** record 0 (B), product 0 (B), survived 1 (A). The 2011 review dates the Foresight Programme to 1994. That is a programme, not a record dating this team. The products are issued 'From: Government Office for Science' and count for the parent. The team existed by 15 May 2023, when the Horizon Scanning Programme team page pointed to it, before the July 2024 change of prime minister. The GO-Science futures blog post of 4 Sep 2025 shows it operating more than six months after that change.
- **Sources:**
  - https://www.gov.uk/government/groups/futures-and-foresight (no snapshot): "We support civil servants to think about the future through our resources, training, advisory service, networks ... and technology horizon scanning service"
  - https://www.gov.uk/government/groups/horizon-scanning-programme-team (archived https://web.archive.org/web/20261012162801/https://www.gov.uk/government/groups/horizon-scanning-programme-team): "This team no longer exists. Go to Futures, Foresight and Emerging Technologies for information about horizon scanning."
  - https://foresightprojects.blog.gov.uk/2025/09 (no snapshot): "Posted on: 4 September 2025 ... Government Office for Science Futures, Foresight and Horizon Scanning programme"
- **Verify:**
  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.
  - [ ] record 0: an official record does not date its creation or foresight mandate.
  - [ ] product 0: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does not exist.
  - [ ] survived `1` holds on the body's own dates.
  - [ ] closedNoSuccessor 0 holds.
- **The country's GFFs:** `GBR.gos`, Government Office for Science (GO-Science), operating: record 0, product 1, survived `1`, closedNoSuccessor 0; `GBR.ffet`, Futures, Foresight and Emerging Technologies team, GO-Science, operating: record 0, product 0, survived `1`, closedNoSuccessor 0; `GBR.hsp`, Horizon Scanning Programme team (Cabinet Office and GO-Science), closed: record 1, product 0, survived `1`, closedNoSuccessor 0; `GBR.hss`, Cabinet Office Horizon Scanning Secretariat, merged: record 0, product 0, survived `no_change`, closedNoSuccessor 0; `GBR.hsc`, Horizon Scanning Centre (OSI / GO-Science), merged: record 1, product 0, survived `1`, closedNoSuccessor 0; `GBR.post`, Parliamentary Office of Science and Technology (POST), operating: record 1, product 1, survived `1`, closedNoSuccessor 0; `GBR.jdac`, Joint Data and Analysis Centre Foresight team, Cabinet Office, operating: record 0, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### +8. GBR: Horizon Scanning Programme team (Cabinet Office and GO-Science) (electoral democracy, GFF)

- **Coders:** A meets the unit (record 1, product 0, survived `1`, closedNoSuccessor 0); B did not list it. A split.
- **Adjudicated:** meets the unit. record 1, product 0, survived `1`, closedNoSuccessor 0. Status closed. Meets 1-4: joint executive team formed March 2014 to coordinate strategic horizon scanning across departments; closed with FFET named as successor on the same page.
- **Ruling:** Meets unit (A). Archived gov.uk page: the team 'coordinates strategic horizon scanning work across departments', formed March 2014. The current page says 'This team no longer exists. Go to Futures, Foresight and Emerging Technologies', which names a same-branch successor, so closedNoSuccessor is 0.
- **Sources:**
  - https://www.gov.uk/government/groups/horizon-scanning-programme-team (archived https://web.archive.org/web/20191208052150/https://www.gov.uk/government/groups/horizon-scanning-programme-team): "In March 2014, the Cabinet Office's Horizon Scanning Secretariat and ... Horizon Scanning Centre were merged to form the Horizon Scanning Programme team"
- **Verify:**
  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.
  - [ ] record 1: an official record does date its creation or foresight mandate.
  - [ ] product 0: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does not exist.
  - [ ] survived `1` holds on the body's own dates.
  - [ ] closedNoSuccessor 0 holds.
- **The country's GFFs:** `GBR.gos`, Government Office for Science (GO-Science), operating: record 0, product 1, survived `1`, closedNoSuccessor 0; `GBR.ffet`, Futures, Foresight and Emerging Technologies team, GO-Science, operating: record 0, product 0, survived `1`, closedNoSuccessor 0; `GBR.hsp`, Horizon Scanning Programme team (Cabinet Office and GO-Science), closed: record 1, product 0, survived `1`, closedNoSuccessor 0; `GBR.hss`, Cabinet Office Horizon Scanning Secretariat, merged: record 0, product 0, survived `no_change`, closedNoSuccessor 0; `GBR.hsc`, Horizon Scanning Centre (OSI / GO-Science), merged: record 1, product 0, survived `1`, closedNoSuccessor 0; `GBR.post`, Parliamentary Office of Science and Technology (POST), operating: record 1, product 1, survived `1`, closedNoSuccessor 0; `GBR.jdac`, Joint Data and Analysis Centre Foresight team, Cabinet Office, operating: record 0, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### +9. GBR: Horizon Scanning Centre (OSI / GO-Science) (electoral democracy, GFF)

- **Coders:** A meets the unit (record 0, product 0, survived `did_not_survive`, closedNoSuccessor 0); B meets the unit (record 1, product 0, survived `1`, closedNoSuccessor 0). A split.
- **Adjudicated:** meets the unit. record 1, product 0, survived `1`, closedNoSuccessor 0. Status merged. Meets 1-4: OSI/GO-Science centre launched March 2005 for cross-government horizon scanning; merged March 2014 into the Horizon Scanning Programme team.
- **Ruling:** record 1, survived 1 (B). The Science and Innovation Investment Framework annual report 2006, para 7.22: 'Launched in March 2005 ... OSI's Horizon Scanning Centre'. Blair handed over to Brown in June 2007, the centre kept operating, and it merged in March 2014, more than two years after any change. Its stated look-ahead of 'at least five to ten years' is at the edge of condition 3. Both coders accepted the unit, so it stands.
- **Sources:**
  - https://dera.ioe.ac.uk/id/eprint/14223/1/file31810.pdf (no snapshot): "Launched in March 2005 the remit of OSI's Horizon Scanning Centre (HSC) is to look at least five to ten years ahead"
- **Verify:**
  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.
  - [ ] record 1: an official record does date its creation or foresight mandate.
  - [ ] product 0: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does not exist.
  - [ ] survived `1` holds on the body's own dates.
  - [ ] closedNoSuccessor 0 holds.
- **The country's GFFs:** `GBR.gos`, Government Office for Science (GO-Science), operating: record 0, product 1, survived `1`, closedNoSuccessor 0; `GBR.ffet`, Futures, Foresight and Emerging Technologies team, GO-Science, operating: record 0, product 0, survived `1`, closedNoSuccessor 0; `GBR.hsp`, Horizon Scanning Programme team (Cabinet Office and GO-Science), closed: record 1, product 0, survived `1`, closedNoSuccessor 0; `GBR.hss`, Cabinet Office Horizon Scanning Secretariat, merged: record 0, product 0, survived `no_change`, closedNoSuccessor 0; `GBR.hsc`, Horizon Scanning Centre (OSI / GO-Science), merged: record 1, product 0, survived `1`, closedNoSuccessor 0; `GBR.post`, Parliamentary Office of Science and Technology (POST), operating: record 1, product 1, survived `1`, closedNoSuccessor 0; `GBR.jdac`, Joint Data and Analysis Centre Foresight team, Cabinet Office, operating: record 0, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### +10. GBR: Parliamentary Office of Science and Technology (POST) (electoral democracy, GFF)

- **Coders:** A meets the unit (record 0, product 1, survived `1`, closedNoSuccessor 0); B meets the unit (record 1, product 1, survived `1`, closedNoSuccessor 0). A split.
- **Adjudicated:** meets the unit. record 1, product 1, survived `1`, closedNoSuccessor 0. Status operating. Meets 1-4: office of Parliament doing technology assessment and horizon scanning for both Houses; made permanent by a House of Commons resolution of 21 November 2000.
- **Ruling:** 1 (B). Hansard, HC Deb 21 Nov 2000: 'Resolved, That this House approves the First Report from the Information Committee on the Future of the Parliamentary Office of Science and Technology', on the recommendation that POST become permanent from April 2001. I1 accepts a resolution of a House.
- **Sources:**
  - https://api.parliament.uk/historic-hansard/commons/2000/nov/21/parliamentary-office-of-science-and (no snapshot): "Resolved, That this House approves the First Report from the Information Committee on the Future of the Parliamentary Office of Science and Technology"
- **Verify:**
  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.
  - [ ] record 1: an official record does date its creation or foresight mandate.
  - [ ] product 1: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does exist.
  - [ ] survived `1` holds on the body's own dates.
  - [ ] closedNoSuccessor 0 holds.
- **The country's GFFs:** `GBR.gos`, Government Office for Science (GO-Science), operating: record 0, product 1, survived `1`, closedNoSuccessor 0; `GBR.ffet`, Futures, Foresight and Emerging Technologies team, GO-Science, operating: record 0, product 0, survived `1`, closedNoSuccessor 0; `GBR.hsp`, Horizon Scanning Programme team (Cabinet Office and GO-Science), closed: record 1, product 0, survived `1`, closedNoSuccessor 0; `GBR.hss`, Cabinet Office Horizon Scanning Secretariat, merged: record 0, product 0, survived `no_change`, closedNoSuccessor 0; `GBR.hsc`, Horizon Scanning Centre (OSI / GO-Science), merged: record 1, product 0, survived `1`, closedNoSuccessor 0; `GBR.post`, Parliamentary Office of Science and Technology (POST), operating: record 1, product 1, survived `1`, closedNoSuccessor 0; `GBR.jdac`, Joint Data and Analysis Centre Foresight team, Cabinet Office, operating: record 0, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### +11. NIC: National Council of the National Planning, Investment and Management System (SPING) (electoral autocracy, rejected)

- **Coders:** A did not list it; B meets the unit (record 1, product 0, survived `no_change`, closedNoSuccessor 0). A split.
- **Adjudicated:** fails the unit. Status operating. Fails condition 3 on its own mandate: the plan names 'planificación estratégica-prospectiva' as a process of the system, and the Council's own task list names no listed term.
- **Ruling:** Fails condition 3 (A's country reading). Plan Nacional 2022-2026 (mem.gob.ni, p. 164-165): SPING 'fortalecerá los procesos de planificación estratégica-prospectiva'. That clause attaches to the system, which B itself rejects as not a body. The Council's own task list (analysis, policy proposals, budget estimates, project portfolio, monitoring, territorial planning) names no listed term. Section 1 judges each body on its own mandate. The text also says the Council 'contará con' (will have), and no record shows it was constituted.
- **Sources:**
  - https://www.mem.gob.ni/wp-content/uploads/2022/03/PLAN-NACIONAL-DE-LUCHA-CONTRA-LA-POBREZA-2022-2026-19Jul21.pdf (no snapshot): "el SPING contará con un Consejo Nacional coordinado por el Ministro de Hacienda y Crédito Público"
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** none. Country items: I1 0, I2 0, I3 0, I4 0; score 0.

### +12. SGP: Strategy Group, Prime Minister's Office (electoral autocracy, rejected)

- **Coders:** A rejects it; B meets the unit (record 1, product 0, survived `1`, closedNoSuccessor 0). A split.
- **Adjudicated:** fails the unit. Status operating. Fails condition 3 as a parent: its own page names strategic planning and 'emerging issues over the medium to long-term', not a listed term.
- **Ruling:** Fails condition 3 (A). strategygroup.gov.sg: set up July 2015 'to drive whole-of-government strategic planning by identifying key priorities and emerging issues over the medium to long-term'. No listed term names a function, and housing CSF does not make it a GFF. Section 1 condition 3 lists 'emerging change' among the objects of exploration but not among the terms that name a function, which is an ambiguity.
- **Sources:**
  - https://www.strategygroup.gov.sg/who-we-are (no snapshot): "set up in July 2015 to drive whole-of-government strategic planning by identifying key priorities and emerging issues over the medium to long-term"
- **Verify:**
  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.
- **The country's GFFs:** `SGP.csf`, Centre for Strategic Futures (CSF), Strategy Group, Prime Minister's Office, operating: record 1, product 1, survived `1`, closedNoSuccessor 0; `SGP.spo`, Scenario Planning Office (1995), renamed Strategic Policy Office (2003), Prime Minister's Office, merged: record 1, product 0, survived `1`, closedNoSuccessor 0; `SGP.fut`, Futures team, Strategy Group, operating: record 0, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.

### +13. SGP: Futures team, Strategy Group (electoral autocracy, GFF)

- **Coders:** A did not list it; B meets the unit (record 0, product 0, survived `no_change`, closedNoSuccessor 0). A split.
- **Adjudicated:** meets the unit. record 0, product 0, survived `no_change`, closedNoSuccessor 0. Status operating. Meets 1-4 at low confidence: the CSF page names a Futures team in PMO-SG that identifies longer-term trends and builds futures thinking across the Public Service; no dated record.
- **Ruling:** Meets unit (B), low confidence. csf.gov.sg names a Director of Futures in PMO-SG: 'The Futures team identifies longer-term trends and emerging issues ... and builds capabilities for futures thinking'. 'Futures' is a listed term and the remit is the Public Service. No dated record exists.
- **Sources:**
  - https://www.csf.gov.sg/who-we-are/ (no snapshot): "The Futures team identifies longer-term trends and emerging issues that have strategic impact to Singapore and builds capabilities for futures thinking"
- **Verify:**
  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.
  - [ ] record 0: an official record does not date its creation or foresight mandate.
  - [ ] product 0: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does not exist.
  - [ ] survived `no_change` holds on the body's own dates.
  - [ ] closedNoSuccessor 0 holds.
- **The country's GFFs:** `SGP.csf`, Centre for Strategic Futures (CSF), Strategy Group, Prime Minister's Office, operating: record 1, product 1, survived `1`, closedNoSuccessor 0; `SGP.spo`, Scenario Planning Office (1995), renamed Strategic Policy Office (2003), Prime Minister's Office, merged: record 1, product 0, survived `1`, closedNoSuccessor 0; `SGP.fut`, Futures team, Strategy Group, operating: record 0, product 0, survived `no_change`, closedNoSuccessor 0. Country items: I1 1, I2 1, I3 1, I4 0; score 100.


## Result

Checked 2026-10-16. Under D154 (c) the checker is a fresh context, not a
coder: OpenAI coded (coder B), so no third vendor was available, and the
check ran as four `claude-sonnet-5-5` subagents, each given codebook 1.3
and its share of this sheet and nothing else, with live web search. Sonnet
is a different model from coder A and the adjudicator (`claude-opus-5-5`)
but the same vendor. Raw output:
`data/research/foresight-register-pilot-1.3/spotcheck.json`.

| # | Body | Result | Note |
| ---: | --- | --- | --- |
| 1 | `ARE.moca` Ministry of Cabinet Affairs (Ministry of Cabinet Affairs and the Future, 2016-2020) | Confirmed | Mandate and 2016 date stand; product 0 not contradicted. Open point: ministry's own 2016 restructure announcement not read directly. |
| 2 | `ARE.wgso` World Governments Summit Organization | Confirmed | Fails condition 3 (events and dialogue platform) and condition 1 is not shown. |
| 3 | `HTI.ctpea` Centre de Techniques de Planification et d'Économie Appliquée | Cannot verify | Training role is consistent with the ruling but no primary mandate text could be found, so the failure of condition 3 is not shown. |
| 4 | `VNM.nief` National Institute for Economics and Finance, Ministry of Finance | Confirmed | Official name is Institute for Economic and Financial Strategy and Policy (NIEF). Mirror host is not the gazette itself. |
| 5 | `ARE.clab` Centennial Lab, Ministry of Cabinet Affairs | Confirmed | Ruling stands on best reading. Borderline: the 2020 report explores 25-year change, but it is outside the window and the mandate is vision implementation. |
| 6 | `ARE.moiat` Ministry of Industry and Advanced Technology | Confirmed |  |
| 7 | `VNM.mpi` Ministry of Planning and Investment | Confirmed | Low confidence: I did not read the decree text. Subordinate units (Development Strategy Institute, forecast centre) are separate candidates not coded here; 'forecast' is not a named term. |
| 8 | `SGP.csf` Centre for Strategic Futures (CSF), Strategy Group, Prime Minister's Office | Confirmed | All codes stand. Open point: horizon of Foresight 2024 not seen in the PDF. |
| 9 | `NIC.bcn` Banco Central de Nicaragua | Confirmed |  |
| 10 | `SGP.parl` Parliament of Singapore and Parliament Secretariat | Confirmed |  |
| 11 | `NIC.an` Asamblea Nacional | Cannot verify | Likely correct, but no primary page shown. |
| 12 | `GBR.hss` Cabinet Office Horizon Scanning Secretariat | Confirmed | Unit and codes stand. Open point: the secretariat has no mandate text of its own; the unit rests on the 2013 programme page and the merger page. No country item depends on it. |
| 13 | `NGA.ospre` Office for Strategic Preparedness and Resilience (OSPRE), Office of the Vice President | Confirmed | Confirmed at low confidence. Two open points are flagged: the date of the foresight mandate (I3) and the undated, email-gated PDFs (I2). |
| 14 | `GBR.jdac` Joint Data and Analysis Centre Foresight team, Cabinet Office | Overturned | The GO-Science page names the team before and more than six months after the July 2024 change, so survived is 1. No country item moves. |
| 15 | `NGA.nipss` National Institute for Policy and Strategic Studies | Confirmed | The Act and the NIPSS site name no listed foresight term. A search of nipsskuru.gov.ng found no foresight unit. Fails condition 3. |
| 16 | `BRA.cgee` Centro de Gestão e Estudos Estratégicos (CGEE) | Confirmed | Unit failure stands. Condition 1 is the stated ground and is arguable under the TAB clause, but condition 4 (S&T only, per Decree 4.078 art. 1) independently fails it. |
| 17 | `BRA.csf` Comissão Senado do Futuro, Senate Committee of the Future | Confirmed | Confirmed on the strict reading of the term list. The point is sensitive: it is the only body in the Brazil set that could move I4. |
| 18 | `BRA.congress` National Congress science and technology committees | Confirmed | Confirmed for the Senate committee on a primary text. The Camara committee rests on a secondary description, so that half is lower confidence. |
| 19 | `CHE.pstab` Perspektivstab der Bundesverwaltung, Federal Administration Perspectives Staff | Confirmed | Unit decision and codes stand. The survival basis should cite the 2007 record (Council majority gone Oct 2010), not the 2009 reconstitution; the status 'closed' has no dated source. |
| 20 | `EST.riigikogu` Riigikogu and Chancellery of the Riigikogu | Confirmed | Parent mandate names no foresight function; the Foresight Centre carries it. |
| 21 | `EST.mkm` Ministry of Economic Affairs and Communications | Confirmed | Strategic management and development plans only, no foresight term. |
| + | `NIC.spingc` National Council of the National Planning, Investment and Management System (SPING) | Confirmed | Ruling stands. A reader could take the 'prospectiva' clause as the system's function; the codebook reads mandates body by body, and the plan is not a mandate source for a Council not shown to exist. |
| + | `SGP.sg` Strategy Group, Prime Minister's Office | Confirmed | Codebook open point on 'emerging change' noted; ruling follows the term list. |
| + | `SGP.fut` Futures team, Strategy Group | Confirmed | Low-confidence inclusion stands. If it is the same body as CSF it is a double listing; either way SGP items stay I1 1, I2 1, I3 1, I4 0 because CSF carries them. |
| + | `GBR.ffet` Futures, Foresight and Emerging Technologies team, GO-Science | Confirmed | All codes stand. The cited blog post is weak evidence, but the team's own page captures support survived 1. |
| + | `GBR.hsp` Horizon Scanning Programme team (Cabinet Office and GO-Science) | Confirmed | All codes stand. The end date is taken as the 15 May 2023 page update; the successor test passes on any date to 2025. |
| + | `GBR.hsc` Horizon Scanning Centre (OSI / GO-Science) | Confirmed | Confirmed. Two open points (the 5-to-10-year horizon and the mirrored host) are flagged; neither moves a country item, because HSC is merged and other bodies carry I1 to I3. |
| + | `GBR.post` Parliamentary Office of Science and Technology (POST) | Confirmed | All codes stand. I did not open the full text of POSTnote 773, so its horizon is unchecked; the quantum and cultivated meat notes are further candidates. |
| + | `BRA.ipea` Instituto de Pesquisa Econômica Aplicada (Ipea), Institute for Applied Economic Research | Confirmed | Unit and codes stand. product 0 rests on a keyword search of the repository. |
| + | `BRA.splp` Subsecretaria de Planejamento de Longo Prazo, Long-Term Planning Undersecretariat (Seplan/MPO) | Confirmed | Confirmed. product 0 is the stricter reading and matches 1.3 change 1 and 2; even if it were 1, the country item is already 1. |
| + | `BRA.saedes` Diretoria de Desenvolvimento Econômico e Social da SAE/PR, Directorate of Economic and Social Development | Confirmed | Confirmed. The successor test depends on the MPO unit meeting section 1, which I also confirm. |
| + | `BRA.nae` Núcleo de Assuntos Estratégicos da Presidência, Strategic Affairs Unit of the Presidency | Confirmed | Confirmed. The SAE successor question does not matter for I4 because the 2008 end is outside the window. |
| + | `CHE.stf` Sektion Strategische Führungsunterstützung, Strategic Management Support Section | Confirmed | Stands as ruled. The 1 Jan 2015 resource date is a possible dating lead for the section; codebook 1.3 does not decide whether it counts. |
| + | `EST.edfunit` Estonian Development Fund foresight unit | Overturned | The Act that the adjudicator could not render names the unit in section 40. The unit is a GFF in its own right; the country items do not move. |

Checked by: four `claude-sonnet-5-5` subagents (agent checker, Anthropic)
on 2026-10-16. Error rate over the 21 sampled: 1 of 21 (5 percent). Two
sampled bodies cannot be verified, both rejections with no primary mandate
text online (`HTI.ctpea`, `NIC.an`); neither carries an item. Over the 13
splits checked in addition: 1 overturned.

The two overturns:

- **`GBR.jdac`, survived `no_change` to 1.** The GO-Science futures page
  names the team in Wayback captures from 2023-05-01 and from 2025-05-01
  onward, before and more than six months after the July 2024 change of
  prime minister. GBR's I3 is already 1 through `GBR.gos`, `GBR.ffet` and
  `GBR.post`, so no country item changes.
- **`EST.edfunit`, fails the unit to meets it.** Section 40 of the
  Development Fund Act (passed 2006-11-15), rendered in a browser, has the
  board form a foresight unit as a structural unit, and section 39 defines
  arenguseire as long-term and across domains. The adjudicator could not
  render the act and ruled "not shown", which is the case codebook 1.3
  section 4 asks the adjudicator to render before a code stands. Codes as
  coder B: record 1, product 0, survived 1, closedNoSuccessor 0. It closed
  in 2016, before the I4 window, and `EST.fc` carries every item, so no
  country item changes.

## Verdict: the check passes D148

D148 is overturned by a spot-check that overturns two or more of the sampled
bodies, or by any body decision that changes a country item. Read on the
runbook's terms for a sample larger than 11, the bar is an error rate of 2
in 11 (18 percent) or more. One of 21 is overturned (5 percent), the count
is under two on the literal reading too, and no overturn changes a country
item. The check passes.

It does not decide the recode's verdict. The check reads whether the
adjudicated table is right; the coders' agreement reads whether the
codebook gives the same table twice. Under 1.3 it does not: I1, I3 and the
body measure have alpha under 0.667 (`FORESIGHT-REGISTER-RESULTS.md`,
section 1), and codebook section 8 reads that as a stop. The 53 are not
coded until a decision rules between the two.

The check is same-vendor as coder A and the adjudicator. It measures how
stable the adjudication is when a fresh context reads it. It does not test
errors that Claude models share.
