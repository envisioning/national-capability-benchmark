# Sovereign technological capability: BRA catalogue

*Generated from `data/sovereignty/BRA.json` by `pnpm bench sovereignty catalog`. Do not edit by hand. Framework: [FRAMEWORK.md](FRAMEWORK.md), decision D171. Research only: nothing here is scored, ranked or published in the viewer.*

15 records in 10 domains, updated 2026-10-31. A record classifies one capability stage by stage; no row, column or count below is a sovereignty score.

## Overview

| Record | Status | Research | Design and IP | Components | Production | Deployment | Operation | Maintenance | Governance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pix instant payments | deployed | unknown | verified | foreign-dependent | partial | verified | verified | partial | verified |
| gov.br digital identity and login | deployed | unknown | verified | unknown | verified | verified | verified | verified | verified |
| Federal government cloud (Nuvem de Governo) | deployed | unknown | foreign provision | foreign provision | foreign provision | foreign-dependent | foreign-dependent | foreign-dependent | partial |
| Embraer E-Jets E2 commercial aircraft | deployed | unknown | partial | foreign provision | unknown | unknown | unknown | foreign-dependent | unknown |
| SGDC-1 defence and strategic communications satellite | deployed | unknown | foreign provision | foreign provision | foreign provision | foreign provision | partial | unknown | verified |
| Amazonia-1 Earth observation satellite on the Multi-Mission Platform | deployed | verified | verified | partial | verified | foreign provision | verified | verified | unknown |
| Domestic orbital launch (VLM-1, MLBR microlauncher, Alcântara) | proposed | verified | unknown | unknown | unknown | unknown | unknown | unknown | partial |
| Biological nitrogen fixation in soybean (Embrapa Bradyrhizobium strains) | deployed | verified | verified | unknown | unknown | verified | verified | unknown | unknown |
| Mineral fertiliser supply (nitrogen, phosphate, potash) | deployed | unknown | unknown | foreign provision | foreign provision | unknown | partial | unknown | verified |
| Uranium enrichment at Resende | deployed | verified | verified | foreign provision | partial | verified | verified | verified | unknown |
| Deepwater pre-salt oil and gas production | deployed | verified | partial | foreign provision | foreign provision | verified | partial | unknown | verified |
| COVID-19 vaccine production at Fiocruz and Butantan | demonstrated | foreign provision | partial | partial | verified | verified | unknown | unknown | verified |
| CEITEC integrated circuit design and fabrication | demonstrated | unknown | verified | foreign provision | foreign-dependent | verified | unknown | unknown | verified |
| Public AI and scientific supercomputing (Santos Dumont, PBIA) | deployed | verified | foreign provision | foreign provision | foreign provision | verified | verified | foreign-dependent | verified |
| MSG GOV secure messaging for the intelligence system | deployed | unknown | partial | foreign-dependent | verified | foreign-dependent | unknown | unknown | verified |

## Coverage and gaps

Researched on 2026-10-31 by four parallel searches, one per group of domains, each told to report only what a fetched page carried and to list pages that would not load. Quotes were captured through a fetch tool that summarises pages; a sample of five (Viasat contract, Resende 70 percent, Santos Dumont integrator and operator, P-78 integration, Mero 3 subsea scope) was re-fetched and matched verbatim, and the rest still need a verbatim audit. Official sources that would not load are listed as blocked in each record: butantan.gov.br (403), planalto.gov.br decrees (blocked), gov.br/mcti (bot check), the LNCC expansion page (401), ceitec-sa.com (503), the Navy CTMSP page (403), Embraer's E2 page (404). Where a TCU ruling or a Diário Oficial page was read, it was read from a copy hosted by Poder360 that carries the official authenticity code. Searched and not recorded: Bipe, the messaging project SOV-2 names. No fetched page mentions it, so it has no record and nothing here says whether it exists or works. Advanced semiconductors have no record of their own: Brazil has no domestic function to classify, so the dependence is recorded where it bites, in bra.sov.ceitec (imports of advanced chips) and bra.sov.public-ai-compute (Nvidia and AMD silicon). Open gaps, in order of how much they would change a classification: the software and hardware stack under gov.br and Pix; the current foreign enricher for Angra 2 and Resende's capacity in SWU; who makes the soybean inoculants; owned against chartered FPSOs; the E2's final assembly and Brazilian value share; CEITEC's process node and equipment vendors; MSG GOV's hosting. Update rule: every record is re-checked by 31 October each year or when its status changes; a re-check re-opens every fetched source and moves one that no longer carries its claim to blocked, which turns the stage it held back to unknown.

## Records

### Pix instant payments

`bra.sov.pix` · digital public infrastructure · status **deployed** ([s1](#bra-sov-pix-s1) [s2](#bra-sov-pix-s2))

Settles retail payments between accounts at different institutions in real time, every day of the year, in central bank money, with a directory that resolves Pix keys to accounts.

| Stage | Control | Basis | Sources |
| --- | --- | --- | --- |
| Research | unknown | No fetched source settles who controls this stage. | none |
| Design and IP | verified | The central bank designed the scheme with participants through consultations and the Fórum Pix; messages follow ISO 20022, an open international standard. | [s1](#bra-sov-pix-s1) |
| Components | foreign-dependent | The core runs on Red Hat OpenShift and AMQ Streams under commercial subscription. Both are built on open source (Kubernetes, Apache Kafka), but no source shows the central bank running them without the vendor. | [s2](#bra-sov-pix-s2) |
| Production | partial | The central bank built the system with Red Hat Consulting, which a central bank official called an active and essential partner. | [s2](#bra-sov-pix-s2) |
| Deployment | verified | The central bank launched Pix in November 2020. | [s2](#bra-sov-pix-s2) |
| Operation | verified | The central bank operates the system from two data centres at separate sites, active-active with synchronous replication, a 15 minute recovery time objective and two independent networks from different providers. | [s1](#bra-sov-pix-s1) |
| Maintenance | partial | Development, maintenance and operation are paid from the central bank's own budget; Red Hat provides technical account management and training. | [s1](#bra-sov-pix-s1) [s2](#bra-sov-pix-s2) |
| Governance | verified | The scheme rests on Lei 12.865/2013 and central bank resolutions, and the central bank writes its rules. | [s1](#bra-sov-pix-s1) |

**Dependencies**

- *single vendor, components*: Container platform and messaging middleware (OpenShift, AMQ Streams). Supplier Red Hat (USA). Substitutes: Upstream Kubernetes and Apache Kafka are open source and could in principle be self-supported. Switching: unknown: no source shows a self-supported build or a migration plan. [s2](#bra-sov-pix-s2)
- *open source, components*: Kubernetes and Apache Kafka. Supplier open-source communities (multiple). Substitutes: Forkable by licence. Switching: unknown [s2](#bra-sov-pix-s2)
- *foreign jurisdiction, governance*: US trade pressure on the scheme's design (Section 301 investigation, July 2025). Supplier Office of the US Trade Representative (USA). Substitutes: Not applicable: the scheme is governed by Brazilian law. Switching: Not a technical dependency; recorded because it targets the scheme's operating model. [s3](#bra-sov-pix-s3)

**Organisations.** Banco Central do Brasil (BRA, `bra.federal.bcb`): scheme owner, regulator and operator of the SPI settlement system and the DICT key directory; Red Hat (USA): supplier of the platform software and consulting; C&M Software (BRA): licensed technology provider connecting institutions to the system.

**Constraints.** The design and the operation sit in the central bank by construction; the software platform under them is a US vendor's commercial distribution of open-source projects. Hardware origin is not on any fetched source.

**Counterevidence**

- In July 2025 criminals used compromised credentials at a licensed technology provider, C&M Software, to move funds from banks' reserve accounts through Pix; the central bank let the provider resume under controlled production. [s4](#bra-sov-pix-s4)
- The United States opened a Section 301 investigation in 2025 that cites Pix being both operated and regulated by the central bank. [s3](#bra-sov-pix-s3)

**Uncertainty.** Research is unknown: no source covers the work before design. Whether any Pix workload sits in Serpro's government cloud is unknown; the TCU cites a Serpro contract with the central bank but no link to Pix. The Red Hat source is vendor marketing.

**Sources**

- <a id="bra-sov-pix-s1"></a>s1. Banco Central do Brasil, [SPI – Princípios para Infraestruturas do Mercado Financeiro: Divulgação de informações sobre o Sistema de Pagamentos Instantâneos (SPI)](https://www.bcb.gov.br/content/estabilidadefinanceira/sistemapagamentosinstantaneos_docs/principios_infraestruturas_mercado_financeiro.pdf), 2026. Accessed 2026-10-31. "O sistema possui dois Centros de Serviços de Informática (CSIs) instalados em locais distintos, com replicação síncrona de dados e operação em regime ativo-ativo."
- <a id="bra-sov-pix-s2"></a>s2. Red Hat, [Banco Central do Brasil constrói rede de pagamentos instantâneos, Pix, com tecnologia da Red Hat](https://www.redhat.com/rhdc/managed-files/rh-central-bank-of-brazil-case-study-f26354pr-202012-a4-ptbr.pdf), 2020. Accessed 2026-10-31. "O BCB realizou uma licitação para contratação de uma arquitetura distribuída, altamente escalável, baseada no Apache Kafka. A solução vencedora foi Red Hat AMQ." Vendor case study.
- <a id="bra-sov-pix-s3"></a>s3. Congressional Research Service (via EveryCRSReport), [Section 301 Investigation into Brazil's Acts, Policies, and Practices (IN12613)](https://www.everycrsreport.com/reports/IN12613.html), 2025. Accessed 2026-10-31. "both operated and regulated by the Central Bank of Brazil."
- <a id="bra-sov-pix-s4"></a>s4. Agência Brasil (republished by Diario de Pernambuco), [Ataque hacker não envolveu extração de dados de clientes, diz C&M Software](https://www.diariodepernambuco.com.br/economia/2025/07/7793465-ataque-hacker-nao-envolveu-extracao-de-dados-de-clientes-diz-c-m-software.html), 2025. Accessed 2026-10-31. "atua como provedora de tecnologia homologada pelo Banco Central"
- <a id="bra-sov-pix-s5"></a>s5. Banco Central do Brasil, [Pix](https://www.bcb.gov.br/estabilidadefinanceira/pix), n.d.. Accessed 2026-10-31. **Blocked**: Rendered only a heading on 2026-10-31; the page needs JavaScript.

### gov.br digital identity and login

`bra.sov.govbr-identity` · digital public infrastructure · status **deployed** ([s3](#bra-sov-govbr-identity-s3) [s4](#bra-sov-govbr-identity-s4))

Gives every citizen one federal login with three assurance levels (bronze, silver, gold), validated against federal databases, banks, the electoral biometric base, the national identity card or an ICP-Brasil certificate.

| Stage | Control | Basis | Sources |
| --- | --- | --- | --- |
| Research | unknown | No fetched source settles who controls this stage. | none |
| Design and IP | verified | Serpro develops the login for the ministry, and its centre of excellence develops the facial recognition and liveness services. | [s2](#bra-sov-govbr-identity-s2) [s5](#bra-sov-govbr-identity-s5) |
| Components | unknown | No fetched source settles who controls this stage. | none |
| Production | verified | Serpro and Dataprev unified the access platform in 2019: Serpro runs authentication and Dataprev qualifies accounts. | [s6](#bra-sov-govbr-identity-s6) |
| Deployment | verified | The levels are validated against Brazilian bases: Receita Federal, the driving licence register, the electoral biometric base, the national identity card and ICP-Brasil certificates. | [s1](#bra-sov-govbr-identity-s1) |
| Operation | verified | Serpro develops, hosts, manages and processes all operations of the platform; no fetched source documents a foreign input at this stage. | [s3](#bra-sov-govbr-identity-s3) |
| Maintenance | verified | Serpro maintains the platform. | [s3](#bra-sov-govbr-identity-s3) |
| Governance | verified | The ministry owns the platform and its rules. | [s2](#bra-sov-govbr-identity-s2) [s4](#bra-sov-govbr-identity-s4) |

**Organisations.** Ministério da Gestão e da Inovação em Serviços Públicos (BRA, `bra.federal.mgi`): owning ministry; Serpro (BRA, `bra.federal.serpro`): develops, hosts and operates the platform, including facial recognition and liveness; Dataprev (BRA, `bra.federal.dataprev`): qualifies accounts against social security data.

**Constraints.** One state company develops, hosts and runs the platform for 175 million users, so the capability is domestic and concentrated in a single operator.

**Counterevidence**

- The TCU found that the gov.br authentication systems hold mostly public data and are therefore not the main object of the government cloud, so the sovereignty rules keyed to confidentiality do not clearly cover them. [s7](#bra-sov-govbr-identity-s7)

**Uncertainty.** Research and components are unknown: no fetched source names the software stack, the biometric engine's origin or the hardware, so "verified" at operation rests on Serpro's statement and the absence of a documented foreign input, not on an inventory. The governing decrees were not fetched (planalto.gov.br blocked).

**Sources**

- <a id="bra-sov-govbr-identity-s1"></a>s1. Governo Digital, [Níveis da conta gov.br](https://www.gov.br/governodigital/pt-br/identidade/conta-gov-br/niveis-da-conta-govbr), n.d.. Accessed 2026-10-31. "Validação dos seus dados com Certificado Digital de pessoa física compatível com ICP-Brasil."
- <a id="bra-sov-govbr-identity-s2"></a>s2. Serpro, [Serpro no Future of Government](https://serpro.gov.br/menu/noticias/noticias-2024/serpro-future-of-government), 2024. Accessed 2026-10-31. "A tecnologia envolvida em ambas as soluções é desenvolvida pelo Serpro para o MGI."
- <a id="bra-sov-govbr-identity-s3"></a>s3. Serpro, [Recorde de usuários ouro no gov.br](https://www.serpro.gov.br/menu/noticias/noticias-2025/recorde-usuarios-ouro-gov.br), 2025. Accessed 2026-10-31. "desenvolvimento, hospedagem, gestão e processamento de todas as operações da plataforma"
- <a id="bra-sov-govbr-identity-s4"></a>s4. Mobile Time, [gov.br chega a 175 milhões de usuários](https://www.mobiletime.com.br/noticias/24/03/2026/govbr-175-milhoes/), 2026. Accessed 2026-10-31. "alcançar a marca de 175 milhões de usuários cadastrados"
- <a id="bra-sov-govbr-identity-s5"></a>s5. Serpro, [Prova de vida e reconhecimento facial](https://serpro.gov.br/menu/noticias/noticias-2023/prova-de-vida-e-reconhecimento-facial), 2023. Accessed 2026-10-31. "O Gov.br utiliza a biometria facial em diversas etapas, como cadastro, login e atualização dos selos."
- <a id="bra-sov-govbr-identity-s6"></a>s6. Brasil País Digital, [Serpro e Dataprev unificam acesso ao gov.br](https://brasilpaisdigital.com.br/?p=6676), 2019. Accessed 2026-10-31. "o Serpro passa a sustentar a plataforma de autenticação"
- <a id="bra-sov-govbr-identity-s7"></a>s7. Tribunal de Contas da União (copy hosted by Poder360), [Acórdão nº 1380/2026 – TCU – Plenário (TC 008.857/2025-3)](https://static.poder360.com.br/uploads/2026/06/Acordao-1380-de-2026-Plenario.pdf), 2026. Accessed 2026-10-31. "não sendo, portanto, objeto principal da nuvem de governo"
- <a id="bra-sov-govbr-identity-s8"></a>s8. Presidência da República, [Decreto nº 10.900/2021](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/decreto/D10900.htm), 2021. Accessed 2026-10-31. **Blocked**: Request blocked on 2026-10-31.

### Federal government cloud (Nuvem de Governo)

`bra.sov.government-cloud` · ai cloud · status **deployed** ([s1](#bra-sov-government-cloud-s1) [s4](#bra-sov-government-cloud-s4) [s8](#bra-sov-government-cloud-s8)) · challenges the narrative

Hosts federal agencies' workloads, including restricted-access data, on hyperscaler cloud equipment installed in Serpro and Dataprev data centres in Brazil and operated by those state companies.

| Stage | Control | Basis | Sources |
| --- | --- | --- | --- |
| Research | unknown | No fetched source settles who controls this stage. | none |
| Design and IP | foreign provision | Every platform is a foreign vendor's product: AWS Outposts, Google Distributed Cloud Hosted, Huawei Cloud Stack and Oracle Dedicated Region Cloud@Customer. | [s1](#bra-sov-government-cloud-s1) |
| Components | foreign provision | The equipment in the state companies' data centres belongs to the vendors. | [s1](#bra-sov-government-cloud-s1) |
| Production | foreign provision | The platforms are built and supplied by the vendors and installed in the state companies' facilities. | [s1](#bra-sov-government-cloud-s1) [s2](#bra-sov-government-cloud-s2) |
| Deployment | foreign-dependent | Installed in Serpro and Dataprev data centres in Brazil, but most vendors sit at one site each: AWS, Huawei and Google only in Brasília at Serpro, Huawei and AWS only in São Paulo at Dataprev. | [s1](#bra-sov-government-cloud-s1) [s3](#bra-sov-government-cloud-s3) |
| Operation | foreign-dependent | The state companies custody and manage the equipment, but the TCU found AWS Outposts and Google Distributed Cloud depend on continuous connectivity and send metadata to public regions. | [s1](#bra-sov-government-cloud-s1) [s5](#bra-sov-government-cloud-s5) |
| Maintenance | foreign-dependent | The state companies call on the vendors for technical support and component updates. | [s1](#bra-sov-government-cloud-s1) |
| Governance | partial | Portaria SGD/MGI 5.950/2023 requires storage in Brazil and keeps classified data off public cloud, but the AWS contracts' confidentiality exceptions admit disclosure under foreign orders such as the US CLOUD Act, and the TCU ordered them amended. | [s1](#bra-sov-government-cloud-s1) [s3](#bra-sov-government-cloud-s3) [s4](#bra-sov-government-cloud-s4) |

**Dependencies**

- *foreign jurisdiction, governance*: Disclosure under foreign government orders (US CLOUD Act) through the AWS contract clause. Supplier Amazon Web Services (USA). Substitutes: Contract amendment ordered by the TCU. Switching: unknown: no fetched source shows the clause amended. [s1](#bra-sov-government-cloud-s1) [s3](#bra-sov-government-cloud-s3)
- *foreign service, operation*: Control planes and telemetry for AWS Outposts and Google Distributed Cloud. Supplier Amazon Web Services, Google (USA). Substitutes: Huawei Cloud Stack, which the TCU found can operate locally. Switching: unknown [s1](#bra-sov-government-cloud-s1)
- *single vendor, deployment*: One physical site per vendor at each state company. Supplier Serpro and Dataprev, per vendor (BRA). Substitutes: A second site per vendor. Switching: The TCU gave 180 days for a plan for at least two geographically distinct data centres per vendor. [s1](#bra-sov-government-cloud-s1)
- *imported input, components*: Cloud hardware and software stacks. Supplier AWS, Google, Oracle, Huawei (multiple). Substitutes: No domestic stack documented. Switching: unknown [s1](#bra-sov-government-cloud-s1) [s6](#bra-sov-government-cloud-s6)

**Organisations.** Secretaria de Governo Digital (MGI) (BRA, `bra.federal.mgi`): normative coordinator; sets prices and requires agencies to prioritise the government cloud; Serpro (BRA, `bra.federal.serpro`): provider and operator (AWS Outposts, Google Distributed Cloud, Huawei Cloud Stack, Oracle); Dataprev (BRA, `bra.federal.dataprev`): provider and operator (AWS Outposts, Huawei Cloud Stack, Oracle Dedicated Region); Tribunal de Contas da União (BRA): audit; Amazon Web Services, Google, Oracle (USA): platform vendors; Huawei (CHN): platform vendor.

**Constraints.** Residency is domestic and operation is by state staff; the technology, the updates and for two vendors the control plane are foreign. The only alternative the TCU rated as most sovereign is a Chinese vendor's stack.

**Counterevidence**

- Serpro describes the knowledge to manage and operate the infrastructure as 100 percent national and the administration of resources as exclusively Serpro's. [s5](#bra-sov-government-cloud-s5)
- Dataprev's then president said the cloud uses Chinese and American technology, so its sovereignty is relative. [s6](#bra-sov-government-cloud-s6)
- Serpro's 2026 strategy report shows zero of a target of three AI services delivered on the government cloud in the first quarter. [s8](#bra-sov-government-cloud-s8)
- The TCU found the government cloud does not clearly cover critical services such as gov.br that hold mostly public data. [s1](#bra-sov-government-cloud-s1)
- The government states the cloud runs in two Serpro-owned data centres in Brasília and São Paulo and keeps classified data under Brazilian jurisdiction. [s7](#bra-sov-government-cloud-s7)

**Uncertainty.** The TCU text gives the session as 27 May 2026 and the press reports approval on 10 June 2026. Microsoft's participation and any amendment of the AWS clause since the ruling are unknown. The full text of Portaria 5.950 did not load and is cited through the TCU and Serpro. Research is unknown.

**Sources**

- <a id="bra-sov-government-cloud-s1"></a>s1. Tribunal de Contas da União (copy hosted by Poder360), [Acórdão nº 1380/2026 – TCU – Plenário (TC 008.857/2025-3)](https://static.poder360.com.br/uploads/2026/06/Acordao-1380-de-2026-Plenario.pdf), 2026. Accessed 2026-10-31. "Tal redação permite interpretações que admitam a submissão a ordens de autoridades estrangeiras sob legislações como o CLOUD Act dos Estados Unidos" TCU authenticity code on the PDF.
- <a id="bra-sov-government-cloud-s2"></a>s2. Convergência Digital, [Governo lança nuvem soberana com Serpro e Dataprev sem abrir mão das big techs](https://convergenciadigital.com.br/governo/governo-lanca-nuvem-soberana-com-serpro-e-dataprev-sem-abrir-mao-das-big-techs/), 2025. Accessed 2026-10-31. "os órgãos públicos devem priorizar essa solução"
- <a id="bra-sov-government-cloud-s3"></a>s3. Poder360, [TCU manda rever contrato de estatais com a Amazon por risco a dados](https://www.poder360.com.br/poder-tech/tcu-manda-rever-contrato-de-estatais-com-a-amazon-por-risco-a-dados/), 2026. Accessed 2026-10-31. "deve ser aditada para excluir a possibilidade de acesso decorrente do cumprimento de ordens estrangeiras"
- <a id="bra-sov-government-cloud-s4"></a>s4. Serpro, [Serpro lança Nuvem de Governo](https://serpro.gov.br/menu/noticias/noticias-2023/serpro-lanca-nuvem-de-governo), 2023. Accessed 2026-10-31. "os dados tratados em ambiente de nuvem devem ser armazenados em data centers localizados em território brasileiro"
- <a id="bra-sov-government-cloud-s5"></a>s5. Serpro (Revista Tema 239), [Soberania já](https://serpro.gov.br/menu/noticias/Tema-edicao-239/soberania-ja), 2025. Accessed 2026-10-31. "o conhecimento para gerenciar e operar essa infraestrutura é 100% nacional"
- <a id="bra-sov-government-cloud-s6"></a>s6. Baguete, [Nuvem soberana é soberana mesmo?](https://www.baguete.com.br/noticias/nuvem-soberana-e-soberana-mesmo), 2024. Accessed 2026-10-31. "Mas estamos usando tecnologia chinesa, estamos usando tecnologia americana"
- <a id="bra-sov-government-cloud-s7"></a>s7. Agência Gov (EBC), [Nuvem de Governo do Serpro mantém dados sigilosos sob jurisdição brasileira](https://agenciagov.ebc.com.br/noticias/202608/nuvem-de-governo-do-serpro-mantem-dados-sigilosos-sob-jurisdicao-brasileira), 2026. Accessed 2026-10-31. "A infraestrutura está em operação em dois datacenters próprios do Serpro em Brasília e São Paulo."
- <a id="bra-sov-government-cloud-s8"></a>s8. Serpro, [Estratégia Institucional, Boletim de Desempenho, 1º trimestre/2026](https://www.transparencia.serpro.gov.br/governanca/estrategia-institucional/desempenho-estrategia-1tri-2026.pdf), 2026. Accessed 2026-10-31. "KRTI2.3. Entregar 3 serviços de IA na Nuvem de Governo"
- <a id="bra-sov-government-cloud-s9"></a>s9. MGI (copy hosted by Fiocruz), [Portaria SGD/MGI nº 5.950/2023](https://cogead.fiocruz.br/files/2023_10_31_PORTARIA_SGD_MGI_5950.pdf), 2023. Accessed 2026-10-31. **Blocked**: HTTP 503 on 2026-10-31.

### Embraer E-Jets E2 commercial aircraft

`bra.sov.e2-jets` · aerospace · status **deployed** ([s4](#bra-sov-e2-jets-s4)) · challenges the narrative

Designs, integrates and sells a family of 80 to 146 seat commercial jets (E175-E2, E190-E2, E195-E2) flown by airlines.

| Stage | Control | Basis | Sources |
| --- | --- | --- | --- |
| Research | unknown | No fetched source settles who controls this stage. | none |
| Design and IP | partial | Embraer specifies the aircraft and chose its suppliers; the engine and avionics designs, which the aircraft cannot change on its own, are Pratt & Whitney and Honeywell IP. | [s1](#bra-sov-e2-jets-s1) [s2](#bra-sov-e2-jets-s2) [s3](#bra-sov-e2-jets-s3) |
| Components | foreign provision | The PW1900G engines are supplied exclusively by Pratt & Whitney and assembled in Connecticut; the APU is also Pratt & Whitney and the avionics Honeywell. | [s1](#bra-sov-e2-jets-s1) [s2](#bra-sov-e2-jets-s2) [s3](#bra-sov-e2-jets-s3) |
| Production | unknown | No fetched source settles who controls this stage. | none |
| Deployment | unknown | No fetched source settles who controls this stage. | none |
| Operation | unknown | No fetched source settles who controls this stage. | none |
| Maintenance | foreign-dependent | The GTF powder-metal defect grounded up to 22 percent of the E2 fleet in March 2025; recovery depended on the engine maker's inspection and repair capacity. | [s4](#bra-sov-e2-jets-s4) |
| Governance | unknown | No fetched source shows whether US export control applies to E2 sales; the documented case (2006) concerns a military aircraft. Recorded as a dependency, not a classification. | none |

**Dependencies**

- *single vendor, components*: PW1900G turbofan engines. Supplier Pratt & Whitney (USA). Substitutes: None documented: the engine is exclusive on the E2. Switching: Re-engining a type is a new certification programme; no time estimate found. [s1](#bra-sov-e2-jets-s1) [s2](#bra-sov-e2-jets-s2)
- *imported input, components*: Primus Epic 2 avionics. Supplier Honeywell (USA). Substitutes: None documented. Switching: unknown [s3](#bra-sov-e2-jets-s3)
- *foreign jurisdiction, governance*: US authorisation to re-export aircraft with US-origin components. Supplier US Department of Commerce or State (USA). Substitutes: None documented. Switching: In 2006 Embraer said replacing US components on the Super Tucano would mean redesigning the system, with large cost and delay. Not shown for the E2. [s5](#bra-sov-e2-jets-s5)

**Organisations.** Embraer (BRA): airframe designer, integrator and programme owner; Pratt & Whitney (USA): exclusive engine and APU supplier; Honeywell (USA): avionics supplier (Primus Epic 2).

**Constraints.** Brazilian design and integration rest on a foreign propulsion and avionics supply chain. Final assembly location and the Brazilian share of the aircraft value are not on any fetched source.

**Counterevidence**

- The 2006 export block concerned a military aircraft sold to Venezuela, not the E2, so it shows the mechanism and not that it binds the E2. [s5](#bra-sov-e2-jets-s5)
- Embraer reports the GTF availability problem as largely resolved by mid-2026, with engine-related groundings near 1 percent. [s4](#bra-sov-e2-jets-s4)

**Uncertainty.** Research, production, deployment and operation are unknown for want of a fetched source: no Embraer page on final assembly loaded (404). The fly-by-wire supplier and the Brazilian value share are unverified.

**Sources**

- <a id="bra-sov-e2-jets-s1"></a>s1. Pratt & Whitney (PR Newswire), [Pratt & Whitney PurePower Engine for Embraer E-Jets E2 Begins Flight Test Program](https://prnewswire.com/news-releases/pratt--whitney-purepower-engine-for-embraer-e-jets-e2-begins-flight-test-program-300171326.html), 2015. Accessed 2026-10-31. "which was assembled at Pratt & Whitney's Middletown Engine Center in Connecticut"
- <a id="bra-sov-e2-jets-s2"></a>s2. Pratt & Whitney (PR Newswire), [Pratt & Whitney to Provide Fuel-Efficient PurePower Engines on ILFC Order for up to 100 Embraer E-Jets E2](https://prnewswire.com/news-releases/pratt--whitney-to-provide-fuel-efficient-purepower-engines-on-international-lease-finance-corporation-order-for-up-to-100-embraer-e-jets-e2-aircraft-212118381.html), 2013. Accessed 2026-10-31. "Pratt & Whitney will provide exclusive power for up to 100 Embraer E-Jets E2 aircraft"
- <a id="bra-sov-e2-jets-s3"></a>s3. AIN Online, [Embraer Chooses Avionics for New E-Jets](https://ainonline.com/aviation-news/air-transport/2013-02-04/embraer-chooses-avionics-new-e-jets), 2013. Accessed 2026-10-31. "Embraer has opted to retain Honeywell as the avionics supplier for its second-generation E-Jets"
- <a id="bra-sov-e2-jets-s4"></a>s4. AirData News, [Embraer says E2 engine issues have largely been resolved](https://www.airdatanews.com/embraer-says-e2-engine-issues-have-largely-been-resolved/), 2026. Accessed 2026-10-31. "the aircraft-on-ground (AOG) rate for the E2 family has fallen sharply from a peak of 22% recorded in March 2025."
- <a id="bra-sov-e2-jets-s5"></a>s5. Agência Brasil (EBC), [Embraer comments on impasse blocking sale of airplanes to Venezuela](https://memoria.ebc.com.br/agenciabrasil//noticia/2006-01-20/embraer-comments-impasse-blocking-sale-airplanes-venezuela), 2006. Accessed 2026-10-31. "their sale must be authorized by the US Commerce or State Department."
- <a id="bra-sov-e2-jets-s6"></a>s6. Embraer, [E195-E2 product page](https://www.embraer.com/commercial-aviation/en/commercial-jets/e195-e2-commercial-jet/), n.d.. Accessed 2026-10-31. **Blocked**: HTTP 404 on 2026-10-31.

### SGDC-1 defence and strategic communications satellite

`bra.sov.sgdc-1` · space · status **deployed** ([s3](#bra-sov-sgdc-1-s3) [s4](#bra-sov-sgdc-1-s4)) · challenges the narrative

Carries government networks and broadband in Ka band (operated by Telebras) and military communications in X band (Ministry of Defence) from geostationary orbit.

| Stage | Control | Basis | Sources |
| --- | --- | --- | --- |
| Research | unknown | No fetched source settles who controls this stage. | none |
| Design and IP | foreign provision | Thales Alenia Space designed and built the satellite under an acquisition contract. | [s1](#bra-sov-sgdc-1-s1) [s3](#bra-sov-sgdc-1-s3) |
| Components | foreign provision | The spacecraft was bought from the French manufacturer; no fetched source names a Brazilian component. | [s3](#bra-sov-sgdc-1-s3) |
| Production | foreign provision | Built and shipped from Cannes; more than 30 Brazilians were trained there under the contract. | [s1](#bra-sov-sgdc-1-s1) |
| Deployment | foreign provision | Launched from the Guiana Space Centre at Kourou on 4 May 2017. | [s3](#bra-sov-sgdc-1-s3) |
| Operation | partial | Telebras operates the Ka band and the Ministry of Defence the X band, but the commercial Ka capacity is exploited by Viasat, a US company, under a revenue-sharing contract the TCU cleared in 2019. | [s2](#bra-sov-sgdc-1-s2) [s3](#bra-sov-sgdc-1-s3) [s4](#bra-sov-sgdc-1-s4) |
| Maintenance | unknown | No fetched source settles who controls this stage. | none |
| Governance | verified | Use of the bands is set by a Defence and Telebras contract under Brazilian law, and the commercial contract was audited by the TCU. | [s2](#bra-sov-sgdc-1-s2) [s4](#bra-sov-sgdc-1-s4) |

**Dependencies**

- *single vendor, production*: Geostationary communications satellite. Supplier Thales Alenia Space (FRA). Substitutes: No domestic geostationary satellite builder is documented. Switching: unknown [s1](#bra-sov-sgdc-1-s1) [s3](#bra-sov-sgdc-1-s3)
- *foreign service, deployment*: Launch to geostationary transfer orbit. Supplier Arianespace from Kourou (FRA). Substitutes: No domestic launcher to geostationary orbit exists (see bra.sov.orbital-launch). Switching: A replacement satellite would need a foreign launch. [s3](#bra-sov-sgdc-1-s3)
- *foreign service, operation*: Commercial exploitation of Ka capacity. Supplier Viasat (USA). Substitutes: Telebras operating the capacity itself, which it did before the contract. Switching: unknown [s4](#bra-sov-sgdc-1-s4)

**Organisations.** Telebras (BRA): operates the Ka band and contracts its commercial use; Ministério da Defesa (BRA, `bra.federal.defesa`): exclusive user of the X band; Visiona Tecnologia Espacial (BRA): space systems integrator, joint venture of Embraer Defesa & Segurança and Telebras; Thales Alenia Space (FRA): designer and manufacturer; Viasat (USA): commercial operator of Ka capacity under revenue sharing.

**Constraints.** Brazil holds the spectrum, the contract and the operation, not the ability to build or launch a replacement. Technology transfer to Brazilian industry was a stated aim and is not measured by any fetched source.

**Counterevidence**

- The contract foresaw technology transfer to Brazilian companies and trained over 30 Brazilian engineers, which is the case for reading design as partial over time. [s1](#bra-sov-sgdc-1-s1) [s3](#bra-sov-sgdc-1-s3)
- A domestic integrator exists: Visiona was set up by Embraer and Telebras for space systems, though no fetched source shows it building a geostationary satellite. [s5](#bra-sov-sgdc-1-s5)

**Uncertainty.** Status in 2026, ground-control location and maintenance arrangements are not on any fetched source. The launch vehicle (Ariane 5) appears only in pages that would not load. The rubric cannot separate a revenue-sharing commercial partner from a foreign operator from the contract summary alone.

**Sources**

- <a id="bra-sov-sgdc-1-s1"></a>s1. Thales Alenia Space, [Brazilian defense minister visits Thales Alenia Space](https://www.thalesaleniaspace.com/en/news/brazilian-defense-minister-visits-thales-alenia-space), 2016. Accessed 2026-10-31. "Brazil's SGDC dual (civil & military) telecom satellite will be shipped from Cannes"
- <a id="bra-sov-sgdc-1-s2"></a>s2. Teletime, [Contrato com Telebras garante à Defesa uso da banda X do SGDC](https://teletime.com.br/11/09/2014/contrato-com-telebras-garante-a-defesa-uso-da-banda-x-do-sgdc/), 2014. Accessed 2026-10-31. "a banda Ka, que será operada pela Telebras para garantir a segurança das redes de governo"
- <a id="bra-sov-sgdc-1-s3"></a>s3. Revista Pesquisa FAPESP, [Novo satélite para o sistema de comunicação do Brasil é lançado ao espaço](https://revistapesquisa.fapesp.br/novo-satelite-para-o-sistema-de-comunicacao-do-brasil-e-lancado-ao-espaco/), 2017. Accessed 2026-10-31. "o contrato de aquisição do equipamento com a fabricante, a multinacional francesa Thales Alenia Space"
- <a id="bra-sov-sgdc-1-s4"></a>s4. Teletime, [TCU libera acordo entre Viasat e Telebras](https://teletime.com.br/22/05/2019/tcu-libera-acordo-entre-viasat-e-telebras/), 2019. Accessed 2026-10-31. "O acordo, fundamentado no modelo de compartilhamento de receitas entre as duas companhias"
- <a id="bra-sov-sgdc-1-s5"></a>s5. Visiona, [Visiona home page](https://visionaespacial.com/), n.d.. Accessed 2026-10-31. "A Visiona é uma joint-venture entre a Embraer Defesa & Segurança e a Telebras voltada integralmente a área espacial."
- <a id="bra-sov-sgdc-1-s6"></a>s6. Arianespace, [Launch release](https://newsroom.arianespace.com/?p=9902), n.d.. Accessed 2026-10-31. **Blocked**: HTTP 404 on 2026-10-31.
- <a id="bra-sov-sgdc-1-s7"></a>s7. NASASpaceflight, [Ariane 5 SGDC and Koreasat 7 launch](https://www.nasaspaceflight.com/2017/05/ariane-5-sgdc-and-koreasat-7-launch/), 2017. Accessed 2026-10-31. **Blocked**: HTTP 403 on 2026-10-31.

### Amazonia-1 Earth observation satellite on the Multi-Mission Platform

`bra.sov.amazonia-1` · space · status **deployed** ([s1](#bra-sov-amazonia-1-s1) [s3](#bra-sov-amazonia-1-s3))

Images the Brazilian territory with a wide-field optical camera for deforestation and environmental monitoring, on a satellite bus designed by INPE.

| Stage | Control | Basis | Sources |
| --- | --- | --- | --- |
| Research | verified | INPE created the Multi-Mission Platform the satellite flies on. | [s2](#bra-sov-amazonia-1-s2) |
| Design and IP | verified | The satellite was designed in Brazil by INPE. | [s2](#bra-sov-amazonia-1-s2) |
| Components | partial | About 70 percent of the spend went to 10 Brazilian firms and the camera was built domestically; the share of imported electronic parts is not published. | [s2](#bra-sov-amazonia-1-s2) |
| Production | verified | Integrated and tested at INPE. | [s2](#bra-sov-amazonia-1-s2) |
| Deployment | foreign provision | Launched on India's PSLV-C51 in February 2021; the successor Amazonia-1B is contracted on Europe's Vega-C. | [s1](#bra-sov-amazonia-1-s1) [s3](#bra-sov-amazonia-1-s3) |
| Operation | verified | INPE operates the satellite, which passed its design life in 2025 and is still working. | [s2](#bra-sov-amazonia-1-s2) [s3](#bra-sov-amazonia-1-s3) |
| Maintenance | verified | Amazonia-1B, the successor, is being integrated at INPE from Amazonia-1 spare equipment. | [s3](#bra-sov-amazonia-1-s3) |
| Governance | unknown | No fetched source settles who controls this stage. | none |

**Dependencies**

- *foreign service, deployment*: Launch to low Earth orbit. Supplier ISRO/NSIL (2021); Arianespace Vega-C (2027, contracted) (multiple). Substitutes: Two foreign launch providers in two jurisdictions have been used or contracted. Switching: Switching between foreign launchers is shown; no domestic option exists. [s1](#bra-sov-amazonia-1-s1) [s3](#bra-sov-amazonia-1-s3)
- *imported input, components*: Electronic parts not made in Brazil. Supplier unknown (unknown). Substitutes: unknown Switching: unknown [s2](#bra-sov-amazonia-1-s2)

**Organisations.** Instituto Nacional de Pesquisas Espaciais (INPE) (BRA): designer, integrator, tester and operator; Equatorial Sistemas and Opto Eletrônica (BRA): builders of the WFI camera; ISRO / NewSpace India Limited (IND): launch provider (PSLV-C51).

**Constraints.** The satellite can be designed, built and run at home; it cannot reach orbit from home. The solar panel structure and propulsion subsystem were made in Brazil for the first time on this satellite, so the supply base is young.

**Counterevidence**

- On the earlier CBERS satellites the solar panel was supplied by China, which shows how recent the domestic components are. [s2](#bra-sov-amazonia-1-s2)

**Uncertainty.** Governance is unknown: no fetched source covers the mission's data policy or legal basis. Foreign electronic parts and any export-control status are unknown. The Portal Amazônia page gives the platform class as 7500 kg, likely a typo for 750 kg; it is not used for any claim.

**Sources**

- <a id="bra-sov-amazonia-1-s1"></a>s1. ISRO, [PSLV-C51/Amazonia-1](https://www.isro.gov.in/mission_PSLV_C51.html), 2021. Accessed 2026-10-31. "Amazonia-1 is the optical earth observation satellite of National Institute for Space Research (INPE)."
- <a id="bra-sov-amazonia-1-s2"></a>s2. Revista Pesquisa FAPESP, [Amazônia no espaço](https://revistapesquisa.fapesp.br/amazonia-no-espaco/), 2021. Accessed 2026-10-31. "completamente projetado, integrado, testado e operado pelo Brasil."
- <a id="bra-sov-amazonia-1-s3"></a>s3. Portal Amazônia, [Amazonia-1 completa 5 anos em órbita e consolida o desenvolvimento da Plataforma Multimissão](https://portalamazonia.com/amazonia/amazonia-1-completa-5-anos/), 2026. Accessed 2026-10-31. "faz uso de equipamentos reserva do satélite Amazonia-1"
- <a id="bra-sov-amazonia-1-s4"></a>s4. NASASpaceflight, [Amazonia-1 launch](https://www.nasaspaceflight.com/2021/02/amazonia-1-launch/), 2021. Accessed 2026-10-31. **Blocked**: HTTP 403 on 2026-10-31.

### Domestic orbital launch (VLM-1, MLBR microlauncher, Alcântara)

`bra.sov.orbital-launch` · space · status **proposed** ([s1](#bra-sov-orbital-launch-s1)) · challenges the narrative

Puts Brazilian satellites into orbit on a Brazilian launcher from Brazilian territory.

| Stage | Control | Basis | Sources |
| --- | --- | --- | --- |
| Research | verified | A microlauncher is being developed by Brazilian companies with Finep funding, and the VLM-1 under the FAB. | [s1](#bra-sov-orbital-launch-s1) |
| Design and IP | unknown | Design is under way at Brazilian firms but no vehicle has flown; under the framework a plan earns no classification past research. | [s1](#bra-sov-orbital-launch-s1) |
| Components | unknown | No fetched source settles who controls this stage. | none |
| Production | unknown | No fetched source settles who controls this stage. | none |
| Deployment | unknown | No fetched source settles who controls this stage. | none |
| Operation | unknown | No fetched source settles who controls this stage. | none |
| Maintenance | unknown | No fetched source settles who controls this stage. | none |
| Governance | partial | Alcântara is governed by Brazil under the 2019 Technology Safeguards Agreement with the United States, which limits access to US-authorised persons, bars launch revenue from funding MTCR Category I systems and restricts inflows from non-MTCR countries. | [s2](#bra-sov-orbital-launch-s2) |

**Dependencies**

- *foreign jurisdiction, governance*: Technology Safeguards Agreement terms at Alcântara. Supplier United States government (USA). Substitutes: None while the agreement is in force. Switching: Withdrawal from a treaty promulgated by decree; no estimate found. [s2](#bra-sov-orbital-launch-s2)
- *skills, production*: Industrial base for solid rocket motors. Supplier Avibras (BRA). Substitutes: None named in the source. Switching: The VLM-1 schedule depends on Avibras resuming activity. [s1](#bra-sov-orbital-launch-s1)

**Organisations.** Força Aérea Brasileira (BRA): runs the VLM-1 schedule and coordinates Alcântara launches; part of the Ministry of Defence, which has no separate node; Agência Espacial Brasileira (BRA): coordinates the microlauncher programme; Finep (BRA, `bra.federal.finep`): funds the MLBR microlauncher (R$ 189 million); Avibras (BRA): industrial partner whose recovery the VLM-1 schedule depends on; Innospace (KOR): South Korean company whose HANBIT-Nano made the first commercial orbital attempt from Alcântara.

**Constraints.** Every Brazilian satellite in this catalogue reached orbit on a foreign launcher. The VLS programme was abandoned after the 2003 explosion at Alcântara.

**Counterevidence**

- The first commercial orbital attempt from Brazilian soil, in December 2025, used a South Korean rocket and failed 46 seconds after launch. [s3](#bra-sov-orbital-launch-s3)
- Engineers quoted by FAPESP call the 2027 prototype target optimistic. [s1](#bra-sov-orbital-launch-s1)

**Uncertainty.** The status enum has no value for a funded development with no flight: `proposed` understates it and `pilot` overstates it. Recorded as a rubric failure in FRAMEWORK.md. The cause of the HANBIT-Nano failure is not published.

**Sources**

- <a id="bra-sov-orbital-launch-s1"></a>s1. Revista Pesquisa FAPESP, [Brasil desenvolve foguete para colocar pequenos satélites na órbita terrestre](https://revistapesquisa.fapesp.br/brasil-desenvolve-foguete-para-colocar-pequenos-satelites-na-orbita-terrestre/), 2026. Accessed 2026-10-31. "O cronograma definitivo depende diretamente da velocidade de retomada das atividades da Avibras"
- <a id="bra-sov-orbital-launch-s2"></a>s2. Câmara dos Deputados, [Decreto nº 10.220, de 5 de fevereiro de 2020](https://www2.camara.leg.br/legin/fed/decret/2020/decreto-10220-5-fevereiro-2020-789729-publicacaooriginal-159928-pe.html), 2020. Accessed 2026-10-31. "somente permitirá acesso a pessoas autorizadas pelo Governo dos Estados Unidos da América"
- <a id="bra-sov-orbital-launch-s3"></a>s3. Movimento Econômico, [Foguete HANBIT-Nano explode em lançamento orbital no Maranhão](https://movimentoeconomico.com.br/tecnologia/2025/12/22/foguete-hanbit-nano-explode-em-lancamento-orbital-no-maranhao/), 2025. Accessed 2026-10-31. "seria o primeiro lançamento orbital comercial realizado em solo brasileiro."

### Biological nitrogen fixation in soybean (Embrapa Bradyrhizobium strains)

`bra.sov.soy-nitrogen-fixation` · agriculture · status **deployed** ([s1](#bra-sov-soy-nitrogen-fixation-s1))

Supplies soybean's nitrogen through selected Bradyrhizobium strains in seed inoculants, so the crop needs no nitrogen fertiliser.

| Stage | Control | Basis | Sources |
| --- | --- | --- | --- |
| Research | verified | Embrapa selected the strains; the four from Embrapa Cerrados remain the only ones recommended for soybean in Brazil. | [s3](#bra-sov-soy-nitrogen-fixation-s3) |
| Design and IP | verified | The strains are Embrapa selections and make up the commercial inoculants. | [s1](#bra-sov-soy-nitrogen-fixation-s1) [s3](#bra-sov-soy-nitrogen-fixation-s3) |
| Components | unknown | No fetched source settles who controls this stage. | none |
| Production | unknown | No fetched source settles who controls this stage. | none |
| Deployment | verified | The practice, dating from 1964, covers about 33 million hectares, all the soybean area in the country. | [s1](#bra-sov-soy-nitrogen-fixation-s1) |
| Operation | verified | Four Bradyrhizobium strains are on the market and are used across the national soybean crop. | [s1](#bra-sov-soy-nitrogen-fixation-s1) |
| Maintenance | unknown | No fetched source settles who controls this stage. | none |
| Governance | unknown | No fetched source settles who controls this stage. | none |

**Organisations.** Embrapa (Soja, Cerrados) (BRA, `bra.federal.embrapa`): strain selection and cultivar breeding.

**Constraints.** The science and the strains are domestic; who manufactures the inoculants and how quality is controlled are not on any fetched source. The technology covers soybean, so nitrogen imports remain for other crops.

**Counterevidence**

- Embrapa's share of the soybean seed market fell from 80 percent to 6 percent by 2012, and the cultivar market is held by chemical and seed multinationals; the sovereign part is the strain science, not the seed supply. [s5](#bra-sov-soy-nitrogen-fixation-s5) [s6](#bra-sov-soy-nitrogen-fixation-s6)
- Embrapa itself publishes savings figures that differ by a factor of five (US$ 8 billion, US$ 15 billion, US$ 43 billion a year, R$ 38 billion in 2021), on different prices and areas. [s1](#bra-sov-soy-nitrogen-fixation-s1) [s2](#bra-sov-soy-nitrogen-fixation-s2) [s3](#bra-sov-soy-nitrogen-fixation-s3) [s4](#bra-sov-soy-nitrogen-fixation-s4)
- Brazil imported a record 2.77 million tonnes of fertiliser in 2024, Embrapa notes, with significant import dependence. [s4](#bra-sov-soy-nitrogen-fixation-s4)

**Uncertainty.** Components, production, maintenance and governance are unknown: inoculant makers, carrier materials, MAPA registration and strain re-selection are not on any fetched source (the Canal Rural page was blocked). The seed market shares are from 2012 and 2013.

**Sources**

- <a id="bra-sov-soy-nitrogen-fixation-s1"></a>s1. Embrapa, [Fixação Biológica de Nitrogênio em Soja](https://www.embrapa.br/en/busca-de-solucoes-tecnologicas/-/produto-servico/3780/fixacao-biologica-de-nitrogenio-em-soja), n.d.. Accessed 2026-10-31. "Quatro estirpes de Bradyrhizobium estão disponíveis no mercado para soja."
- <a id="bra-sov-soy-nitrogen-fixation-s2"></a>s2. Embrapa, [Linha do Tempo (Embrapa 50 anos)](https://www.embrapa.br/en/50-anos/linha-do-tempo), n.d.. Accessed 2026-10-31. "A adoção da tecnologia nessa cultura gera uma economia anual de 15 bilhões de dólares"
- <a id="bra-sov-soy-nitrogen-fixation-s3"></a>s3. Embrapa, [Embrapa 50 anos: a ciência que proporciona economia bilionária ao agro brasileiro](https://www.embrapa.br/en/busca-de-noticias/-/noticia/80107209/embrapa-50-anos-a-ciencia-que-proporciona-economia-bilionaria-ao-agro-brasileiro), 2023. Accessed 2026-10-31. "permaneçam como as únicas recomendadas para a cultura da soja no Brasil"
- <a id="bra-sov-soy-nitrogen-fixation-s4"></a>s4. Embrapa, [Ciência amplia escopo da fixação biológica de nitrogênio no Brasil](https://www.embrapa.br/en/busca-de-noticias/-/noticia/98368676/ciencia-amplia-escopo-da-fixacao-biologica-de-nitrogenio-no-brasil), 2025. Accessed 2026-10-31. "volume recorde na importação de fertilizantes em 2024, com um total de 2,77 milhões de toneladas"
- <a id="bra-sov-soy-nitrogen-fixation-s5"></a>s5. Exame, [Embrapa busca inspiração capitalista para crescer](https://exame.com/revista-exame/embrapa-busca-inspiracao-capitalista-para-crescer), 2012. Accessed 2026-10-31. "que chegou a ser de 80%"
- <a id="bra-sov-soy-nitrogen-fixation-s6"></a>s6. Olhar Direto, [Embrapa reage às multinacionais](https://olhardireto.com.br/agro-e-negocios/noticias/embrapa-reage-as-multinacionais), 2013. Accessed 2026-10-31. "as empresas de químicos também dominam o mercado de sementes"
- <a id="bra-sov-soy-nitrogen-fixation-s7"></a>s7. Canal Rural, [Soja: 90% dos inoculantes biológicos do país](https://www.canalrural.com.br/agricultura/soja/soja-90-por-cento-inoculantes-biologicos-pais/), n.d.. Accessed 2026-10-31. **Blocked**: HTTP 403 on 2026-10-31.

### Mineral fertiliser supply (nitrogen, phosphate, potash)

`bra.sov.fertilisers` · agriculture · status **deployed** ([s4](#bra-sov-fertilisers-s4) [s5](#bra-sov-fertilisers-s5)) · challenges the narrative

Supplies nitrogen, phosphate and potash nutrients to Brazilian agriculture, from domestic plants and imports.

| Stage | Control | Basis | Sources |
| --- | --- | --- | --- |
| Research | unknown | No fetched source settles who controls this stage. | none |
| Design and IP | unknown | No fetched source settles who controls this stage. | none |
| Components | foreign provision | More than 80 percent of the fertiliser used in Brazil is imported (85 percent in the plan's launch text), as is the sulphur for phosphate processing. | [s1](#bra-sov-fertilisers-s1) [s3](#bra-sov-fertilisers-s3) |
| Production | foreign provision | In 2020 domestic nitrogen output met 4.3 percent of demand, phosphate import dependence was 72 percent and potash 96.4 percent; the restarted nitrogen plants bring domestic urea to about 20 percent of demand. | [s3](#bra-sov-fertilisers-s3) [s4](#bra-sov-fertilisers-s4) [s5](#bra-sov-fertilisers-s5) |
| Deployment | unknown | No fetched source settles who controls this stage. | none |
| Operation | partial | Petrobras restarted three idled nitrogen plants in 2026: FAFEN-SE from January, FAFEN-BA in commissioning, and ANSA in Paraná, idle since 2020, from April. | [s4](#bra-sov-fertilisers-s4) [s5](#bra-sov-fertilisers-s5) |
| Maintenance | unknown | No fetched source settles who controls this stage. | none |
| Governance | verified | The Plano Nacional de Fertilizantes, set by decree in 2022 and governed by CONFERT, targets cutting import dependence from 85 to 45 percent by 2050. | [s1](#bra-sov-fertilisers-s1) [s2](#bra-sov-fertilisers-s2) [s3](#bra-sov-fertilisers-s3) |

**Dependencies**

- *imported input, components*: Potash (KCl). Supplier Belaruskali, Nutrien, Uralkali, Mosaic (multiple). Substitutes: None at scale: domestic potash met under 4 percent of demand in 2020. Switching: The plan projects dependence of 62 percent by 2030 and 40 percent by 2052 in its scenario B. [s3](#bra-sov-fertilisers-s3)
- *foreign jurisdiction, components*: Fertiliser from sanctions-exposed origins (Russia, Belarus). Supplier Russian and Belarusian exporters (multiple). Substitutes: Other origins named in the plan: Canada, Morocco, China, Qatar, the United States. Switching: The plan cites sanctions on Belarus and Chinese and Russian export limits in 2021 and 2022 as disruptions already felt. [s3](#bra-sov-fertilisers-s3)
- *imported input, components*: Nitrogen fertiliser. Supplier multiple (multiple). Substitutes: Restarted Petrobras plants (about 20 percent of urea demand) and biological fixation in soybean (bra.sov.soy-nitrogen-fixation). Switching: unknown [s3](#bra-sov-fertilisers-s3) [s4](#bra-sov-fertilisers-s4) [s5](#bra-sov-fertilisers-s5)

**Organisations.** Conselho Nacional de Fertilizantes e Nutrição de Plantas (CONFERT) (BRA): governs the Plano Nacional de Fertilizantes; Ministério do Desenvolvimento, Indústria, Comércio e Serviços (BRA, `bra.federal.mdic`): hosts CONFERT and the plan; Petrobras (BRA): owner of the FAFEN and ANSA nitrogen plants.

**Constraints.** The country that feeds much of the world imports most of the nutrients its crops need. Domestic nitrogen depends on natural gas and on Petrobras keeping plants it idled once.

**Counterevidence**

- All three Petrobras nitrogen plants were idle or leased in 2023, and two later nitrogen projects were dropped in 2013 and 2016. [s3](#bra-sov-fertilisers-s3)
- Even with every restarted plant running, Petrobras puts domestic urea at about a fifth of national demand. [s5](#bra-sov-fertilisers-s5)

**Uncertainty.** No official progress figure against the 2050 target after 2023 was found, nor per-supplier import shares for 2024 and 2025. Research, design and maintenance are unknown. The label at production hides a split by nutrient that runs from about 20 percent domestic urea to under 4 percent domestic potash.

**Sources**

- <a id="bra-sov-fertilisers-s1"></a>s1. Casa Civil, [Lançado o Plano Nacional de Fertilizantes](https://www.gov.br/casacivil/pt-br/assuntos/noticias/2022/marco/lancado-o-plano-nacional-de-fertilizantes-governo-federal-lanca-medida-para-reduzir-importacao-de-insumos), 2022. Accessed 2026-10-31. "Pretende-se diminuir a dependência de importações, em 2050, de 85% para 45%, mesmo que dobre a demanda por fertilizantes."
- <a id="bra-sov-fertilisers-s2"></a>s2. MDIC, [Plano Nacional de Fertilizantes](https://www.gov.br/mdic/pt-br/assuntos/sdic/confert/pnf), 2023. Accessed 2026-10-31. "diminuir a dependência externa quanto ao fornecimento de fertilizantes nitrogenados, fosfáticos e potássicos"
- <a id="bra-sov-fertilisers-s3"></a>s3. Governo Federal / CONFERT, [Plano Nacional de Fertilizantes 2050](https://www.gov.br/mdic/pt-br/assuntos/sdic/confert/pnf/pnf-v-08-06-12-23.pdf), 2023. Accessed 2026-10-31. "O mercado é extremamente concentrado em quatro empresas: Belaruskali, Nutrien, Uralkali e Mosaic."
- <a id="bra-sov-fertilisers-s4"></a>s4. Agência Petrobras, [Petrobras inicia produção de ureia na Ansa, em Araucária (PR)](https://agencia.petrobras.com.br/w/negocio/petrobras-inicia-produ%C3%A7%C3%A3o-de-ureia-na-ansa-em-arauc%C3%A1ria-pr-), 2026. Accessed 2026-10-31. "esteve hibernada desde 2020"
- <a id="bra-sov-fertilisers-s5"></a>s5. Agência Petrobras, [FAFENs Bahia e Sergipe entram em operação e reforçam produção nacional de fertilizantes](https://agencia.petrobras.com.br/w/fafens-bahia-e-sergipe-entram-em-opera%C3%A7%C3%A3o-e-refor%C3%A7am-produ%C3%A7%C3%A3o-nacional-de-fertilizantes), 2026. Accessed 2026-10-31. "iniciou a produção de ureia em 3 de janeiro"
- <a id="bra-sov-fertilisers-s6"></a>s6. Presidência da República, [Plano Nacional de Fertilizantes (Planalto copy)](https://www.gov.br/planalto/pt-br/assuntos/assuntos-estrategicos/documentos/planos/plano-nacional-fertilizantes/@@download/file/Plano-Nacional-Fertilizantes.pdf), 2022. Accessed 2026-10-31. **Blocked**: CAPTCHA on 2026-10-31; not attempted. The MDIC copy (s3) was used.

### Uranium enrichment at Resende

`bra.sov.uranium-enrichment` · nuclear · status **deployed** ([s2](#bra-sov-uranium-enrichment-s2) [s5](#bra-sov-uranium-enrichment-s5)) · challenges the narrative

Enriches uranium hexafluoride to up to 5 percent U-235 for the fuel of the Angra 1 power reactor, in centrifuge cascades developed by the Brazilian Navy.

| Stage | Control | Basis | Sources |
| --- | --- | --- | --- |
| Research | verified | The centrifuge technology was developed by the Navy's technology centre in São Paulo with IPEN. | [s3](#bra-sov-uranium-enrichment-s3) [s5](#bra-sov-uranium-enrichment-s5) |
| Design and IP | verified | The centrifuges are domestically developed. | [s1](#bra-sov-uranium-enrichment-s1) |
| Components | foreign provision | The feed is foreign: conversion of uranium concentrate to hexafluoride is the only fuel cycle stage INB does not perform, and in 2022 Brazil mined 43 tU against about 339 tU a year of need. | [s4](#bra-sov-uranium-enrichment-s4) |
| Production | partial | Ten cascades cover about 70 percent of Angra 1's annual reload; the remainder, and all of Angra 2, are enriched abroad. | [s2](#bra-sov-uranium-enrichment-s2) [s5](#bra-sov-uranium-enrichment-s5) [s6](#bra-sov-uranium-enrichment-s6) |
| Deployment | verified | The first phase, ten cascades, was completed at Resende at the end of 2022. | [s2](#bra-sov-uranium-enrichment-s2) |
| Operation | verified | INB operates the cascades, licensed to enrich to 5 percent. | [s5](#bra-sov-uranium-enrichment-s5) |
| Maintenance | verified | INB contracted Amazul, a Brazilian state company, for the engineering of the second phase, which targets fully national supply for Angra 1 and 2 by 2033. | [s2](#bra-sov-uranium-enrichment-s2) |
| Governance | unknown | No fetched source settles who controls this stage. | none |

**Dependencies**

- *foreign service, components*: Conversion of U3O8 to UF6. Supplier Internexco GmbH (Rosatom group); earlier, European suppliers (multiple). Substitutes: None domestic. Switching: The 2025 contract returns converted and enriched product by December 2027. [s4](#bra-sov-uranium-enrichment-s4) [s6](#bra-sov-uranium-enrichment-s6)
- *foreign service, production*: Enrichment of the share Resende does not cover. Supplier Internexco GmbH (Rosatom group); historically Urenco in Europe (multiple). Substitutes: Resende phase 2 (no date in 2026). Switching: Phase 2 is at the engineering stage. [s1](#bra-sov-uranium-enrichment-s1) [s2](#bra-sov-uranium-enrichment-s2) [s4](#bra-sov-uranium-enrichment-s4) [s6](#bra-sov-uranium-enrichment-s6)
- *imported input, components*: Uranium beyond domestic mining. Supplier unknown (unknown). Substitutes: Expansion of domestic mining at Caetité. Switching: unknown [s4](#bra-sov-uranium-enrichment-s4)

**Organisations.** Indústrias Nucleares do Brasil (INB) (BRA): fuel cycle company, operator of the Resende plant; Centro Tecnológico da Marinha em São Paulo (CTMSP), with IPEN (BRA): developer of the centrifuge technology; Amazul (BRA): engineering of the second phase; Internexco GmbH (Rosatom group) (RUS): contracted in 2025 for conversion and enrichment abroad.

**Constraints.** A domestic enrichment technology covers most of one small reactor's reload; conversion and the rest of enrichment are bought abroad, most recently from a Russian state group.

**Counterevidence**

- The 2016 target was 100 percent of Angra 1 at the end of phase 1; the outcome was 70 percent, and phase 2 has no date in 2026. [s2](#bra-sov-uranium-enrichment-s2) [s3](#bra-sov-uranium-enrichment-s3) [s5](#bra-sov-uranium-enrichment-s5)
- World Nuclear News described the domestically developed centrifuges as very similar to Urenco technology. [s1](#bra-sov-uranium-enrichment-s1)
- In 2025 INB contracted a Rosatom group company for conversion and enrichment of 275 t of Brazilian concentrate. [s4](#bra-sov-uranium-enrichment-s4) [s6](#bra-sov-uranium-enrichment-s6)

**Uncertainty.** Centrifuge component manufacture and imported materials are unknown: the Navy page that covers it returned 403. Current enrichment capacity in SWU, safeguards arrangements and the current foreign enricher for Angra 2 are not on any fetched source. Governance is unknown. One source (s5) is trade press.

**Sources**

- <a id="bra-sov-uranium-enrichment-s1"></a>s1. World Nuclear News, [Brazil increases uranium enrichment capacity](https://www.world-nuclear-news.org/Articles/Brazil-increases-uranium-enrichment-capacity), 2018. Accessed 2026-10-31. "domestically developed and very similar to Urenco technology"
- <a id="bra-sov-uranium-enrichment-s2"></a>s2. World Nuclear News, [INB and Amazul sign contract for next Resende phase](https://world-nuclear-news.org/articles/inb-contracts-amazul-for-design-of-next-resende-ph), 2023. Accessed 2026-10-31. "meet 70% of the demand of Angra 1"
- <a id="bra-sov-uranium-enrichment-s3"></a>s3. World Nuclear News, [Brazil to export enriched uranium](https://world-nuclear-news.org/articles/brazil-to-export-enriched-uranium), 2016. Accessed 2026-10-31. "provide about 40% of the enriched uranium needs of Angra 1"
- <a id="bra-sov-uranium-enrichment-s4"></a>s4. World Nuclear News, [INB signs contract with Internexco GmbH for conversion and enrichment of uranium](https://world-nuclear-news.org/articles/brazils-inb-signs-contract-with-russia-for-conversion-and-enrichment-of-uranium), 2025. Accessed 2026-10-31. "Conversion is the only stage of the nuclear fuel cycle that INB does not perform"
- <a id="bra-sov-uranium-enrichment-s5"></a>s5. Sociedade Militar, [A tecnologia que enriquece o urânio queimado em Angra 1 foi desenvolvida pela Marinha](https://www.sociedademilitar.com.br/2026/08/uranio-enriquecido-marinha-inb-resende-labgene-ipero-2022j.html), 2026. Accessed 2026-10-31. "já cobre cerca de 70% da recarga anual de Angra 1"
- <a id="bra-sov-uranium-enrichment-s6"></a>s6. eixos, [INB contrata empresa da Rosatom para converter e enriquecer urânio extraído na Bahia](https://eixos.com.br/energia-eletrica/inb-contrata-empresa-da-rosatom-para-converter-e-enriquecer-uranio-extraido-na-bahia/), 2025. Accessed 2026-10-31. "O volume passará por duas etapas de beneficiamento no exterior: conversão e enriquecimento."
- <a id="bra-sov-uranium-enrichment-s7"></a>s7. Marinha do Brasil, [DGDNTM page on the CTMSP](https://www.marinha.mil.br/dgdntm/node/136), n.d.. Accessed 2026-10-31. **Blocked**: HTTP 403 on 2026-10-31.

### Deepwater pre-salt oil and gas production

`bra.sov.presalt-deepwater` · energy · status **deployed** ([s1](#bra-sov-presalt-deepwater-s1) [s2](#bra-sov-presalt-deepwater-s2)) · challenges the narrative

Produces oil and gas from ultra-deep pre-salt reservoirs off Brazil's coast through floating production units (FPSOs), subsea systems and reservoir technology; about 80 percent of national output.

| Stage | Control | Basis | Sources |
| --- | --- | --- | --- |
| Research | verified | Many pre-salt technologies were developed at Petrobras's CENPES research centre, and a semi-industrial test centre for pre-salt processes opened in Itajubá in 2026. | [s2](#bra-sov-presalt-deepwater-s2) [s6](#bra-sov-presalt-deepwater-s6) |
| Design and IP | partial | Petrobras holds reservoir and process technology, including a patented subsea separation technology, while FPSOs are designed under EPC contracts with foreign builders. | [s2](#bra-sov-presalt-deepwater-s2) [s3](#bra-sov-presalt-deepwater-s3) |
| Components | foreign provision | Subsea equipment for the Mero 3 separation project is designed, built and installed by TechnipFMC. | [s5](#bra-sov-presalt-deepwater-s5) |
| Production | foreign provision | The P-78 hull was built in China and South Korea, and its topside modules, from Seatrium yards in Singapore, China and Brazil, were integrated in Singapore; P-80 and P-82 follow the same pattern. | [s3](#bra-sov-presalt-deepwater-s3) [s4](#bra-sov-presalt-deepwater-s4) [s7](#bra-sov-presalt-deepwater-s7) |
| Deployment | verified | Petrobras places the units on its fields; P-78 reached Búzios in September 2025. | [s4](#bra-sov-presalt-deepwater-s4) |
| Operation | partial | Petrobras operates its own units, while chartered units are operated by foreign firms: SBM holds a 26 year charter for FPSO Almirante Tamandaré, awarded directly as the only company able to meet the requirements. | [s4](#bra-sov-presalt-deepwater-s4) [s8](#bra-sov-presalt-deepwater-s8) |
| Maintenance | unknown | No fetched source settles who controls this stage. | none |
| Governance | verified | The ANP regulates the fields, and its R&D obligation on operators funds national test centres. | [s6](#bra-sov-presalt-deepwater-s6) |

**Dependencies**

- *single vendor, operation*: FPSO charter and operation. Supplier SBM Offshore (unknown). Substitutes: Owned units built under EPC. Switching: A direct award was justified because SBM was the only company able to meet the requirements. [s8](#bra-sov-presalt-deepwater-s8)
- *foreign service, production*: FPSO hull construction and integration. Supplier Seatrium, with Chinese and Korean yards (multiple). Substitutes: No fetched source shows a Brazilian yard building a whole FPSO recently. Switching: unknown [s3](#bra-sov-presalt-deepwater-s3) [s4](#bra-sov-presalt-deepwater-s4) [s7](#bra-sov-presalt-deepwater-s7)
- *foreign service, components*: Subsea production systems. Supplier TechnipFMC (unknown). Substitutes: unknown Switching: unknown [s5](#bra-sov-presalt-deepwater-s5)

**Organisations.** Petrobras (BRA): operator, owner of part of the fleet, research through CENPES; Agência Nacional do Petróleo (ANP) (BRA): regulator; its R&D obligation funds test centres; Seatrium (SGP): EPC contractor for owned FPSOs; owner of Brazilian module yards; SBM Offshore (NLD): charterer and operator of leased FPSOs; TechnipFMC (GBR): subsea EPCI contractor.

**Constraints.** Reservoir knowledge, field development and regulation are domestic; the steel, the integration yards and much of the subsea hardware are abroad, and the Brazilian module yards belong to a Singaporean group.

**Counterevidence**

- The Itajubá test centre was co-funded by Petrobras's Libra partners, which include the Chinese state companies CNPC and CNOOC. [s6](#bra-sov-presalt-deepwater-s6)
- Pre-salt was 79.63 percent of national oil and gas output in 2025. [s1](#bra-sov-presalt-deepwater-s1)

**Uncertainty.** The shares of owned and chartered units in the operating fleet, verified local content per unit and MODEC's role are not on any fetched source. The attribution of the patent claim to the subsea separation technology rests on the fetch summary. Maintenance is unknown. Jurisdictions are given from the organisations' public domiciles, not from the fetched sources, and the dependency jurisdictions are left unknown for that reason.

**Sources**

- <a id="bra-sov-presalt-deepwater-s1"></a>s1. Poder360, [Produção de petróleo e gás cresce 13% no Brasil em 2025](https://www.poder360.com.br/poder-energia/producao-de-petroleo-e-gas-cresce-13-no-brasil-em-2025/), 2026. Accessed 2026-10-31. "representam, em média, 79,63% da produção nacional, em óleo equivalente."
- <a id="bra-sov-presalt-deepwater-s2"></a>s2. Petrobras, [Pré-sal: mergulhe nessa jornada ultraprofunda](https://petrobras.com.br/pre-sal), n.d.. Accessed 2026-10-31. "Muitas delas foram desenvolvidas dentro do nosso próprio centro de pesquisa, o CENPES."
- <a id="bra-sov-presalt-deepwater-s3"></a>s3. World Oil, [Seatrium delivers first turnkey FPSO to Petrobras for offshore Brazil](https://www.worldoil.com/news/2025/7/16/seatrium-delivers-first-turnkey-fpso-to-petrobras-for-offshore-brazil), 2025. Accessed 2026-10-31. "the integration and commissioning works of the P-78 FPSO in Singapore"
- <a id="bra-sov-presalt-deepwater-s4"></a>s4. Agência Petrobras, [FPSO P-78 arrives at Búzios field](https://agencia.petrobras.com.br/en/w/fpso-p-78-chega-ao-campo-de-b%C3%BAzios), 2025. Accessed 2026-10-31. "The hull was constructed at shipyards in Yantai and Hayang, China, and Ulsan, South Korea"
- <a id="bra-sov-presalt-deepwater-s5"></a>s5. Oilfield Technology, [TechnipFMC awarded major subsea contract by Petrobras](https://www.oilfieldtechnology.com/offshore-and-subsea/04012024/technipfmc-awarded-major-subsea-contract-by-petrobras/), 2024. Accessed 2026-10-31. "The contract covers the design, engineering, manufacture, and installation of subsea equipment,"
- <a id="bra-sov-presalt-deepwater-s6"></a>s6. Agência Petrobras, [Petrobras celebra início das operações do Centro Tecnológico para o Pré-Sal Brasileiro em Itajubá (MG)](https://agencia.petrobras.com.br/w/regionais/petrobras-celebra-in%C3%ADcio-das-opera%C3%A7%C3%B5es-do-centro-tecnol%C3%B3gico-para-o-pr%C3%A9-sal-brasileiro-em-itajub%C3%A1-mg-), 2026. Accessed 2026-10-31. "O CTPB é uma planta de processo em escala semi-industrial considerada uma das mais modernas do mundo em sua categoria"
- <a id="bra-sov-presalt-deepwater-s7"></a>s7. eixos, [Petrobras e Seatrium batizam plataformas P-80 e P-82 que vão atuar no campo de Búzios](https://eixos.com.br/petroleo-e-gas/petrobras-e-seatrium-batizam-plataformas-p-80-e-p-82-que-vao-atuar-no-campo-de-buzios/), 2026. Accessed 2026-10-31. "um novo ciclo de seis unidades de elevada capacidade de produção"
- <a id="bra-sov-presalt-deepwater-s8"></a>s8. eixos, [SBM contratada pela Petrobras para fornecer maior FPSO do país](https://eixos.com.br/sbm-contratada-pela-petrobras-para-fornecer-maior-fpso-do-pais/), 2021. Accessed 2026-10-31. "a empresa é a única com capacidade atender aos requisitos técnicos, operacionais e de disponibilidade da companhia"

### COVID-19 vaccine production at Fiocruz and Butantan

`bra.sov.covid-vaccines` · health biotech · status **demonstrated** ([s1](#bra-sov-covid-vaccines-s1) [s4](#bra-sov-covid-vaccines-s4)) · challenges the narrative

Produces COVID-19 vaccine doses for the national immunisation programme, from imported or domestic active ingredient (IFA).

| Stage | Control | Basis | Sources |
| --- | --- | --- | --- |
| Research | foreign provision | Both vaccines were developed abroad and licensed: CoronaVac by Sinovac, the Fiocruz vaccine by AstraZeneca and Oxford. | [s2](#bra-sov-covid-vaccines-s2) [s5](#bra-sov-covid-vaccines-s5) |
| Design and IP | partial | Fiocruz took the AstraZeneca vaccine under a technological order agreement and Anvisa recorded the technology transfer as concluded in January 2022; the Sinovac agreement left transfer optional. | [s1](#bra-sov-covid-vaccines-s1) [s2](#bra-sov-covid-vaccines-s2) [s5](#bra-sov-covid-vaccines-s5) |
| Components | partial | The IFA came from China (WuXi Biologics for Fiocruz, Sinovac for Butantan) until Anvisa approved Fiocruz's national IFA in January 2022; no source shows Butantan producing CoronaVac IFA. | [s1](#bra-sov-covid-vaccines-s1) [s2](#bra-sov-covid-vaccines-s2) [s3](#bra-sov-covid-vaccines-s3) [s5](#bra-sov-covid-vaccines-s5) |
| Production | verified | Bio-Manguinhos had produced 65.9 million doses by July 2021 and Butantan formulated and filled CoronaVac at home. | [s2](#bra-sov-covid-vaccines-s2) [s5](#bra-sov-covid-vaccines-s5) |
| Deployment | verified | Butantan delivered more than 110 million CoronaVac doses to the Ministry of Health. | [s4](#bra-sov-covid-vaccines-s4) |
| Operation | unknown | No fetched source settles who controls this stage. | none |
| Maintenance | unknown | No fetched source settles who controls this stage. | none |
| Governance | verified | Anvisa certified the national IFA's manufacturing practice in May 2021 and registered it in January 2022. | [s1](#bra-sov-covid-vaccines-s1) |

**Dependencies**

- *single vendor, components*: AstraZeneca vaccine IFA. Supplier WuXi Biologics (CHN). Substitutes: Fiocruz national IFA, approved January 2022. Switching: Took from 2021 to January 2022; deliveries slipped to August 2021 for want of IFA shipments. [s1](#bra-sov-covid-vaccines-s1) [s5](#bra-sov-covid-vaccines-s5)
- *single vendor, components*: CoronaVac raw material. Supplier Sinovac (CHN). Substitutes: None documented: Butantan's IFA line had no start date in 2022. Switching: unknown [s2](#bra-sov-covid-vaccines-s2) [s3](#bra-sov-covid-vaccines-s3)
- *imported input, components*: Active pharmaceutical ingredients for medicines in general. Supplier multiple (multiple). Substitutes: None at scale in the source. Switching: unknown [s6](#bra-sov-covid-vaccines-s6)

**Organisations.** Fundação Oswaldo Cruz (Bio-Manguinhos) (BRA, `bra.federal.fiocruz`): AstraZeneca/Oxford vaccine producer; national IFA from 2021; Instituto Butantan (BRA): CoronaVac fill and finish with Sinovac (São Paulo state); Anvisa (BRA, `bra.federal.anvisa`): GMP certification and registration; Ministério da Saúde (BRA, `bra.federal.ms`): buyer for the national immunisation programme; Sinovac (CHN): CoronaVac developer and raw material supplier; AstraZeneca (GBR): vaccine developer, technology transfer partner; WuXi Biologics (CHN): supplier of the AstraZeneca IFA before national IFA.

**Constraints.** Domestic fill, finish and regulation held throughout; the active ingredient was the bottleneck. One product reached a fully domestic chain, as demand was falling.

**Counterevidence**

- CoronaVac production stopped in Brazil in 2021, with no new contracts, for lack of demand and definitive registration. [s4](#bra-sov-covid-vaccines-s4)
- In 2022 Butantan's new plant still had no date for producing IFA. [s3](#bra-sov-covid-vaccines-s3)
- The health minister said in 2024 that over 90 percent of active pharmaceutical ingredients used in Brazil are imported; this is a press account of a speech, not an official dataset. [s6](#bra-sov-covid-vaccines-s6)

**Uncertainty.** Whether Fiocruz still produces COVID-19 IFA in 2026, and the operation and maintenance of either line now, are unknown. butantan.gov.br returned 403, so the Butantan side rests on an interview and the press. The Anvisa page text was read from a printout of the same page hosted by Poder360.

**Sources**

- <a id="bra-sov-covid-vaccines-s1"></a>s1. Anvisa, [Anvisa aprova o registro do insumo da Fiocruz e o Brasil terá vacina 100% nacional](https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2022/anvisa-aprova-o-registro-do-insumo-da-fiocruz-e-o-brasil-tera-vacina-100-nacional), 2022. Accessed 2026-10-31. "A decisão desta sexta-feira (7/1) conclui a transferência de tecnologia feita pela Fiocruz e que teve início ainda no ano passado." Full text read from the printout at https://static.poder360.com.br/2022/01/Anvisa-Fiocruz-Astrazeneca-7jan2022.pdf.
- <a id="bra-sov-covid-vaccines-s2"></a>s2. Revista Pesquisa FAPESP, [Dimas Covas: Os rumos do Butantan](https://revistapesquisa.fapesp.br/dimas-covas-os-rumos-do-butantan/), 2021. Accessed 2026-10-31. "Hoje, cuidamos apenas do envase e de uma mudança de formulação."
- <a id="bra-sov-covid-vaccines-s3"></a>s3. Exame, [Butantan conclui parte de nova fábrica de vacinas. Produção começa em 2023](https://exame.com/brasil/butantan-conclui-parte-de-nova-fabrica-de-vacinas-producao-comeca-em-2023/), 2022. Accessed 2026-10-31. "Na nova fábrica há essa possibilidade, mas ainda sem previsão de quando isso deve ocorrer."
- <a id="bra-sov-covid-vaccines-s4"></a>s4. Associação Médica Brasileira, [Sem demanda e registro definitivo, Butantan suspende produção de CoronaVac](https://amb.org.br/brasilia-urgente/sem-demanda-e-registro-definitivo-butantan-suspende-producao-de-coronavac/), n.d.. Accessed 2026-10-31. "não foi procurado para assinar novos contratos"
- <a id="bra-sov-covid-vaccines-s5"></a>s5. Agência Brasil (EBC), [Fiocruz adia para agosto meta de entrega de vacinas contra covid-19](https://agenciabrasil.ebc.com.br/saude/noticia/2021-07/fiocruz-adia-para-agosto-meta-de-entrega-de-vacina), 2021. Accessed 2026-10-31. "é produzido pelo laboratório chinês WuXi Biologics"
- <a id="bra-sov-covid-vaccines-s6"></a>s6. Medicina S/A, [Dependência de insumos importados torna o SUS vulnerável](https://medicinasa.com.br/insumos-sus-vulneravel), 2024. Accessed 2026-10-31. "mais de 90% dos insumos farmacêuticos ativos (IFAs) usados no Brasil para produção de medicamentos são importados"
- <a id="bra-sov-covid-vaccines-s7"></a>s7. Fiocruz, [Anvisa aprova registro da vacina covid-19 100% nacional](https://fiocruz.br/noticia/anvisa-aprova-registro-da-vacina-covid-19-100-nacional), n.d.. Accessed 2026-10-31. **Blocked**: HTTP 404 after redirect on 2026-10-31.

### CEITEC integrated circuit design and fabrication

`bra.sov.ceitec` · electronics · status **demonstrated** ([s3](#bra-sov-ceitec-s3) [s4](#bra-sov-ceitec-s4)) · challenges the narrative

Designs and fabricates mature-node integrated circuits and RFID tags in Porto Alegre, the only semiconductor fab the sources name in Brazil; a silicon carbide power line is being installed.

| Stage | Control | Basis | Sources |
| --- | --- | --- | --- |
| Research | unknown | No fetched source settles who controls this stage. | none |
| Design and IP | verified | CEITEC designs and produces integrated circuits and RFID tags; the new silicon carbide route includes technology transfer from an unnamed partner. | [s1](#bra-sov-ceitec-s1) [s4](#bra-sov-ceitec-s4) |
| Components | foreign provision | Production equipment is imported: new machines arrived in mid-2026 and importing one key machine takes six months to two years. | [s3](#bra-sov-ceitec-s3) [s5](#bra-sov-ceitec-s5) |
| Production | foreign-dependent | The fab resumed producing and selling its earlier chips in 2024 on imported equipment, after standing idle during the 2020 to 2023 liquidation; the silicon carbide line is not yet producing. | [s2](#bra-sov-ceitec-s2) [s3](#bra-sov-ceitec-s3) [s4](#bra-sov-ceitec-s4) [s5](#bra-sov-ceitec-s5) |
| Deployment | verified | Chips are sold to domestic buyers, including a public hospital group, though clients were lost during the shutdown. | [s3](#bra-sov-ceitec-s3) |
| Operation | unknown | No fetched source settles who controls this stage. | none |
| Maintenance | unknown | No fetched source settles who controls this stage. | none |
| Governance | verified | The company's existence is set by Brazilian decree: liquidation was authorised in 2020, halted by the TCU, and reversed by Decree 11.768 in November 2023. | [s1](#bra-sov-ceitec-s1) |

**Dependencies**

- *imported input, components*: Semiconductor fabrication equipment. Supplier unknown (not named in fetched sources) (unknown). Substitutes: None documented. Switching: Six months to two years to import one key machine, per CEITEC's president. [s3](#bra-sov-ceitec-s3) [s5](#bra-sov-ceitec-s5)
- *imported input, components*: Advanced logic and memory chips for the Brazilian electronics industry. Supplier multiple (multiple). Substitutes: None: CEITEC makes mature-node and RFID chips only. Switching: No domestic route documented. [s6](#bra-sov-ceitec-s6)
- *foreign licence, design and ip*: Technology transfer for the silicon carbide process. Supplier unknown (unknown). Substitutes: unknown Switching: unknown [s4](#bra-sov-ceitec-s4)

**Organisations.** CEITEC (BRA): state semiconductor company; Ministério da Ciência, Tecnologia e Inovação (BRA, `bra.federal.mcti`): sponsor ministry; Finep (FNDCT) (BRA, `bra.federal.finep`): R$ 220 million for the silicon carbide route; Tribunal de Contas da União (BRA): halted the liquidation.

**Constraints.** A fab that stops loses its people and its clients: career staff fell from 180 to 67 during the liquidation, and funding since 2024 has covered equipment rather than running costs.

**Counterevidence**

- In January 2023 CEITEC had 67 career staff, down from 180, and was not producing. [s2](#bra-sov-ceitec-s2)
- Its president estimated in 2024 that the silicon carbide restart would take three to four years, against an official target of 2026. [s3](#bra-sov-ceitec-s3) [s4](#bra-sov-ceitec-s4)
- Brazil imported US$ 6.31 billion of semiconductors in 2024, according to Abinee as reported in the press. [s6](#bra-sov-ceitec-s6)

**Uncertainty.** Process node, wafer size, equipment vendors and the technology partner are not on any fetched source; ceitec-sa.com returned 503 and the 2026 article is paywalled after the lede. Research and operation are unknown.

**Sources**

- <a id="bra-sov-ceitec-s1"></a>s1. Brasil de Fato, [Decreto autoriza reversão do processo de liquidação e estabelece retomada operacional da Ceitec](https://www.brasildefato.com.br/2023/11/07/decreto-autoriza-reversao-do-processo-de-liquidacao-e-estabelece-retomada-operacional-da-ceitec/), 2023. Accessed 2026-10-31. "O Decreto publicado hoje autoriza a reversão do processo de dissolução societária da empresa"
- <a id="bra-sov-ceitec-s2"></a>s2. Jornal do Comércio, [Ceitec está hibernando, mas funcional](https://www.jornaldocomercio.com/colunas/mercado-digital/2023/01/879839-ceitec-esta-hibernando-mas-funcional.html), 2023. Accessed 2026-10-31. "Hoje somos 67 funcionários de carreira, e a empresa não está em produção."
- <a id="bra-sov-ceitec-s3"></a>s3. DPL News, [Cético ou realista? Presidente da Ceitec fala sobre retomada da estatal de chips](https://dplnews.com/?p=253809), 2024. Accessed 2026-10-31. "estamos começando a produzir e vender novamente nossos produtos anteriores"
- <a id="bra-sov-ceitec-s4"></a>s4. Teletime, [Ceitec receberá R$ 220 milhões para produção de semicondutores](https://teletime.com.br/06/12/2024/ceitec-recebera-r-220-milhoes-para-producao-de-semicondutores/), 2024. Accessed 2026-10-31. "um investimento de R$ 220 milhões na Ceitec"
- <a id="bra-sov-ceitec-s5"></a>s5. Jornal do Comércio, [Reativação de fábrica de chips da Ceitec avança com novos equipamentos](https://www.jornaldocomercio.com/economia/2026/07/1258045-reativacao-do-ceitec-avanca-com-a-chegada-de-novos-equipamentos.html), 2026. Accessed 2026-10-31. "passa por um processo de reestruturação, iniciado em 2023." Paywalled after the lede; only the lede was read.
- <a id="bra-sov-ceitec-s6"></a>s6. Mobile Time, [Mercado brasileiro de celulares deve ser impactado por falta de memória ainda este ano, alerta Abinee](https://www.mobiletime.com.br/noticias/04/12/2025/mercado-brasil-memoria/), 2025. Accessed 2026-10-31. "US$ 6 bilhões em importação"
- <a id="bra-sov-ceitec-s7"></a>s7. CEITEC, [CEITEC home page](https://www.ceitec-sa.com/), n.d.. Accessed 2026-10-31. **Blocked**: HTTP 503 on 2026-10-31.

### Public AI and scientific supercomputing (Santos Dumont, PBIA)

`bra.sov.public-ai-compute` · ai cloud · status **deployed** ([s1](#bra-sov-public-ai-compute-s1)) · challenges the narrative

Provides publicly owned high-performance computing for science and for training AI models, including Portuguese-language models, at LNCC under the Plano Brasileiro de Inteligência Artificial.

| Stage | Control | Basis | Sources |
| --- | --- | --- | --- |
| Research | verified | LNCC runs research on the machine, including training Portuguese-language models. | [s8](#bra-sov-public-ai-compute-s8) |
| Design and IP | foreign provision | Eviden, of the French Atos group, designed and integrated the upgrade on its BullSequana XH3000 platform. | [s1](#bra-sov-public-ai-compute-s1) |
| Components | foreign provision | All compute silicon is foreign: Nvidia H100 and Grace Hopper, AMD EPYC and MI300A. | [s1](#bra-sov-public-ai-compute-s1) |
| Production | foreign provision | The system was integrated by Eviden. | [s1](#bra-sov-public-ai-compute-s1) |
| Deployment | verified | Installed at LNCC, funded by Petrobras, and running at 18.85 petaflops. | [s1](#bra-sov-public-ai-compute-s1) [s2](#bra-sov-public-ai-compute-s2) |
| Operation | verified | LNCC operates the machine. | [s1](#bra-sov-public-ai-compute-s1) [s4](#bra-sov-public-ai-compute-s4) |
| Maintenance | foreign-dependent | Upgrades come from the foreign integrator, and the next national machine was delayed: its tender slipped from October 2025 and LNCC's own site was ruled out for energy and grid limits. | [s1](#bra-sov-public-ai-compute-s1) [s3](#bra-sov-public-ai-compute-s3) |
| Governance | verified | The programme is set by a Brazilian plan with a public budget, and the new machine's tender is to require technology transfer and Brazilian suppliers. | [s4](#bra-sov-public-ai-compute-s4) [s8](#bra-sov-public-ai-compute-s8) |

**Dependencies**

- *single vendor, production*: Supercomputer design and integration. Supplier Eviden (Atos) (FRA). Substitutes: Petrobras bought from Atos too; other machines in Brazil use Nvidia and Dell. Switching: A new tender, as the PBIA machine shows: more than a year. [s1](#bra-sov-public-ai-compute-s1) [s2](#bra-sov-public-ai-compute-s2) [s3](#bra-sov-public-ai-compute-s3)
- *imported input, components*: GPUs and CPUs. Supplier Nvidia, AMD (USA). Substitutes: None domestic. Switching: No domestic route. [s1](#bra-sov-public-ai-compute-s1)
- *foreign service, research*: Partners in the Rio de Janeiro PBIA project. Supplier Huawei, iFlytek (CHN). Substitutes: unknown Switching: unknown [s4](#bra-sov-public-ai-compute-s4)

**Organisations.** Laboratório Nacional de Computação Científica (LNCC) (BRA): operator of Santos Dumont; executor of the planned Rio Grande do Norte machine; Ministério da Ciência, Tecnologia e Inovação (BRA, `bra.federal.mcti`): owner of the PBIA; Petrobras (BRA): funded the Santos Dumont upgrade (about R$ 100 million); Eviden (Atos group) (FRA): designer and integrator of the upgrade; Nvidia and AMD (USA): GPU and CPU suppliers.

**Constraints.** "Sovereign" compute here means Brazilian-owned and Brazilian-operated machines built from foreign silicon by a foreign integrator. Site power is itself a constraint.

**Counterevidence**

- The headline PBIA supercomputer was still at tender stage in 2026, with operation expected at the end of 2027. [s3](#bra-sov-public-ai-compute-s3) [s4](#bra-sov-public-ai-compute-s4)
- A year into the plan the press found no public indicators of its deliveries. [s8](#bra-sov-public-ai-compute-s8)

**Uncertainty.** Sources give R$ 1.8 billion both as the Santos Dumont expansion and as the new machine's cost; neither figure is used. No official PBIA document loaded (bot check on gov.br/mcti; 401 on the LNCC page).

**Sources**

- <a id="bra-sov-public-ai-compute-s1"></a>s1. Tecnoblog, [Supercomputador brasileiro Santos Dumont recebe atualização e suporte à IA](https://tecnoblog.net/noticias/supercomputador-brasileiro-santos-dumont-recebe-atualizacao-e-suporte-a-ia/), 2025. Accessed 2026-10-31. "O projeto de atualização foi desenvolvido e integrado pela Eviden (empresa do Grupo Atos)"
- <a id="bra-sov-public-ai-compute-s2"></a>s2. Revista Pesquisa FAPESP, [Brasil aprimora infraestrutura de supercomputadores](https://revistapesquisa.fapesp.br/brasil-aprimora-infraestrutura-de-supercomputadores/), 2024. Accessed 2026-10-31. "A Petrobras será a responsável pelo investimento orçado em cerca de R$ 100 milhões para o upgrade do SDumont."
- <a id="bra-sov-public-ai-compute-s3"></a>s3. Poder360, [Governo atrasa edital para compra do supercomputador do plano de IA](https://www.poder360.com.br/poder-tech/governo-atrasa-edital-para-compra-do-supercomputador-do-plano-de-ia/), 2026. Accessed 2026-10-31. "adiou o lançamento do edital para a compra do novo supercomputador nacional"
- <a id="bra-sov-public-ai-compute-s4"></a>s4. Movimento Econômico, [Supercomputador de R$ 1 bi no RN segue plano de soberania digital e IA no Brasil](https://movimentoeconomico.com.br/tecnologia/2026/08/20/supercomputador-de-r-1-bi-no-rn-segue-plano-de-soberania-digital-e-ia-no-brasil/), 2026. Accessed 2026-10-31. "O edital deverá incluir exigências de transferência tecnológica,"
- <a id="bra-sov-public-ai-compute-s8"></a>s8. DPL News, [Um ano de Plano Brasileiro de Inteligência Artificial: o que está sendo feito?](https://dplnews.com/um-ano-de-plano-brasileiro-de-inteligencia-artificial-o-que-esta-sendo-feito/), 2025. Accessed 2026-10-31. "R$ 23 bilhões em até 2028"
- <a id="bra-sov-public-ai-compute-s9"></a>s9. LNCC, [Expansão do supercomputador Santos Dumont](https://www.gov.br/lncc/pt-br/assuntos/noticias/ultimas-noticias-1/expansao-do-supercomputador-santos-dumont), n.d.. Accessed 2026-10-31. **Blocked**: HTTP 401 on 2026-10-31.
- <a id="bra-sov-public-ai-compute-s10"></a>s10. MCTI, [PBIA document](https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/cct/documentacao/23072024.pdf), 2024. Accessed 2026-10-31. **Blocked**: Bot-verification page on 2026-10-31; not attempted.

### MSG GOV secure messaging for the intelligence system

`bra.sov.msg-gov` · secure communications · status **deployed** ([s1](#bra-sov-msg-gov-s1) [s2](#bra-sov-msg-gov-s2)) · challenges the narrative

Carries encrypted messages between staff of the bodies in the Brazilian Intelligence System (Sisbin) on an institutional app using a state-owned cryptographic algorithm.

| Stage | Control | Basis | Sources |
| --- | --- | --- | --- |
| Research | unknown | No fetched source settles who controls this stage. | none |
| Design and IP | partial | The app rests on an algorithm the regulation defines as developed by the State for its exclusive use, alongside commercial technology whose owner is not named. | [s1](#bra-sov-msg-gov-s1) [s2](#bra-sov-msg-gov-s2) |
| Components | foreign-dependent | The app runs on commercial mobile operating systems and is installed from the ordinary app stores. | [s2](#bra-sov-msg-gov-s2) |
| Production | verified | Built by Serpro with the Universidade Federal do Ceará, according to the press; the regulation does not name the developer. | [s2](#bra-sov-msg-gov-s2) |
| Deployment | foreign-dependent | Distributed through the Apple and Google stores to Sisbin bodies, on corporate devices unless otherwise authorised. | [s1](#bra-sov-msg-gov-s1) [s2](#bra-sov-msg-gov-s2) |
| Operation | unknown | No fetched source settles who controls this stage. | none |
| Maintenance | unknown | No fetched source settles who controls this stage. | none |
| Governance | verified | ABIN Portaria 4.628 of 28 July 2026, published in the Diário Oficial on 8 September 2026, regulates its use. | [s1](#bra-sov-msg-gov-s1) |

**Dependencies**

- *foreign service, deployment*: App distribution and mobile operating systems. Supplier Apple, Google (USA). Substitutes: None documented. Switching: unknown [s2](#bra-sov-msg-gov-s2)
- *imported input, design and ip*: Commercial cryptographic or messaging technology used beside the state algorithm. Supplier unknown (unknown). Substitutes: unknown Switching: unknown [s2](#bra-sov-msg-gov-s2)

**Organisations.** Agência Brasileira de Inteligência (ABIN) (BRA, `bra.federal.abin`): regulator of the app; its CEPESC is reported to supply the cryptography; Serpro (BRA, `bra.federal.serpro`): developer, with Universidade Federal do Ceará, per the press; Universidade Federal do Ceará (BRA): co-developer, per the press; Apple and Google app stores (USA): distribution and mobile operating systems.

**Constraints.** The cryptography is the state's; the phone, its operating system and the store it is installed from are not. Use is limited to Sisbin staff with clearance.

**Counterevidence**

- Scope is the intelligence system, not the federal government: the regulation covers Sisbin bodies only. [s1](#bra-sov-msg-gov-s1)
- A 2013 order made Serpro's Expresso V3 secure email compulsory across the federal government; no fetched 2026 source shows whether it is still used, a reminder that a mandate is not an operating record. [s4](#bra-sov-msg-gov-s4)
- One press source reports that it runs on its own fully encrypted network, which would make operation domestic; not confirmed by the regulation. [s3](#bra-sov-msg-gov-s3)

**Uncertainty.** Server hosting, operation and maintenance are unknown. The claim that it runs on its own encrypted network comes from one minor press source (s3) and is not used for a classification. No adoption figures were found. A project called Bipe was searched for and no fetched page mentions it, so it has no record.

**Sources**

- <a id="bra-sov-msg-gov-s1"></a>s1. Imprensa Nacional, Diário Oficial da União (copy hosted by Poder360), [Portaria GAB/DG/ABIN/CC/PR nº 4.628, de 28 de julho de 2026](https://static.poder360.com.br/uploads/2026/09/dou-aeroportos-8set2026.pdf), 2026. Accessed 2026-10-31. "O MSG GOV é recurso criptográfico baseado em algoritmo de Estado" Signed DOU page, verification code 05152026090800004 at in.gov.br/autenticidade.
- <a id="bra-sov-msg-gov-s2"></a>s2. Tecnoblog, [Abin regulamenta app de mensagens que substitui WhatsApp em órgãos públicos](https://tecnoblog.net/noticias/abin-regulamenta-app-de-mensagens-para-substituir-whatsapp-em-orgaos-publicos/), 2026. Accessed 2026-10-31. "desenvolvido pela Serpro em parceria com a Universidade Federal do Ceará (UFC)"
- <a id="bra-sov-msg-gov-s3"></a>s3. Minha Operadora, [MSG Gov: saiba como vai funcionar o WhatsApp do governo](https://www.minhaoperadora.com.br/2026/09/msg-gov-saiba-como-vai-funcionar-o-whatsapp-do-governo.html), 2026. Accessed 2026-10-31. "funcionará em rede própria, totalmente criptografada."
- <a id="bra-sov-msg-gov-s4"></a>s4. Serpro, [Uso de e-mail seguro torna-se obrigatório em todo o Governo Federal](https://serpro.gov.br/menu/noticias/noticias-antigas/uso-de-e-mail-seguro-torna-se-obrigatorio-em-todo-o-governo-federal), 2013. Accessed 2026-10-31. "A presidenta Dilma Rousseff determinou a todos os órgãos do Governo Federal a adoção do e-mail Expresso V3"
