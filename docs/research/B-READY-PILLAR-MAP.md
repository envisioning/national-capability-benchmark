# B-READY pillar 3 map

Date: 2026-11-02. Dataset 9.4.0 (committed), 125 countries (D153). Track:
source-backed measurement, desk triage. Nothing is wired: no registry row,
adapter, observation or decision changed.

## 1. What this map tests

The November 2026 sweeps found one open source family that adds evidence
without raising the guardrail: B-READY (World Bank, WDI source 2, CC BY 4.0).
The benchmark scores the third pillar, operational efficiency, of four topics:
business entry (Agency), international trade (Coordination), dispute
resolution (Trust) and, from D171, utility services (Building). D167 sets the
rule: pillar 3 observes the transaction itself, and pillars 1 and 2 read the
statute book and service design, so they are rejected. Business insolvency
pillar 3 is proposed for Experimentation in #111.

This memo maps the five unmapped third pillars (business location, financial
services, labor, market competition, taxation) and takes a second look at
business insolvency. For each it states the published sub-components, a
construct argument written before any value was read (D118), the values, the
simulated effect, and a verdict.

## 2. Method

**Order.** I read the WDI series metadata and the B-READY Methodology Handbook,
Final Second Edition (December 2025), and wrote the six construct arguments to
a dated scratch file before I fetched a value. The verdicts in section 4 keep
those arguments. Nothing in them moved after the values were read.

**Baseline.** Two outputs exist on 2026-11-02:

| Output | State | Guardrail |
| --- | --- | ---: |
| 9.4.0 | committed, generated 2026-10-17 | 0.474 |
| 9.5.0 | working tree, generated 2026-11-02 15:31 UTC, not committed | 0.436 |

9.5.0 applies D171 (`utility_connection_efficiency`, `IC.BRE.US.P3`, replaces
`electricity_connection_speed`) and the OECD tax revenue fill (D172:
`tax_revenue_gdp` reaches 74 B-READY countries, against 70 before). Another session
produced it while this memo was in progress. The 9.4.0 figures are the primary
baseline here. The 9.5.0 guardrail is given in brackets. Compare moves, not
levels.

**Figures.** Income is `diagnostics.income` (123 countries; Cuba and Venezuela
have none). Quartiles are of log GDP per head, Q1 poorest, 31/31/31/30.
"r log GDP" is the Pearson correlation of the pillar value with natural-log
GDP per head.

**Simulation rule.** The rule of the Experimentation sweep
(`docs/research/experimentation/SWEEP-2026-11.md`). Confidence is coverage
times mean recency times mean tier quality, started from each country's
published `confidenceParts`. A new row adds one to the counted denominator, and
a country with a value gains an observation at recency 1.0 (2025, against 2026)
and tier 0.95 (`international_organization`). The guardrail is the correlation
of the mean of the nine published confidences with log GDP per head. On 9.4.0
the method reproduces the Experimentation sweep's insolvency figures (0.409,
guardrail 0.452).

**One fact governs every simulation.** All seven third pillars cover the same
74 countries, at 2025, with the same tier. The simulated confidence effect of a
pillar therefore depends only on the dimension it enters, not on which pillar
it is. The verdict has to come from the construct, because the numbers cannot
tell the pillars apart.

**Coverage.** 74 of 125, quartiles 16 / 19 / 21 / 18. The brief gave
16/18/22/18. My count matches the Experimentation and Coordination sweeps.
Missing: ALB ARE ARG AUS AUT BDI BLR BOL BRA CHE CHL CHN CUB DEU DNK DOM EGY
ETH FIN FRA GIN GNB GTM HND HTI IND IRN IRQ JPN KEN LBN LKA LTU MMR MNG MOZ MWI
NGA NIC NLD NOR PAN RUS SDN THA UGA UKR VEN ZAF ZMB ZWE. **Brazil has no value
in any pillar.** No pillar adds evidence to the Brazil adaptability report until
the 2026 round. The World Bank lists Brazil among the 36 frame countries in
that round (`docs/research/trust/SWEEP-2026-11.md`, section 4.1).

**Why the guardrail falls.** Each addition lowers the guardrail by about 0.02.
Two effects add. The covered poorer countries gain a fresh observation. The
uncovered richer countries (Germany, France, Japan, the Nordics, Switzerland,
Australia) lose coverage when the denominator rises. Q4 mean confidence barely
moves in any simulation. Part of the fall is rich countries losing confidence,
not poorer countries gaining it. That is a finding to print, not a reason to
choose (D118).

## 3. Summary

| Pillar | What pillar 3 observes | Kind | Capability or condition | Target | r log GDP (n 74) | Zeros | Highest r with target rows | Target mean confidence | Guardrail 9.4.0 (9.5.0) | Verdict |
| --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- |
| BL.P3 business location | days and cost of property transfer and of construction, building and environmental permits | outcome, 15% perception | capability | Building | 0.160 | 0 | `utility_connection_efficiency` 0.335 | 0.548 → 0.549 (O1 already met) | 0.474 → 0.448 (0.436 → 0.416) | **score in Building** |
| FS.P3 financial services | loan time and obstacles; credit data and registry speed; e-payment cost, time and use | outcome and adoption, part perception | condition | Agency, as condition | 0.714 | 0 | `internet_users` 0.677, `account_ownership` 0.668 | 0.471 unchanged (scored: 0.486) | unchanged (scored: 0.447) | **publish as a condition beside Agency** |
| LB.P3 labor | social contribution ratio, regulation as obstacle, dismissal time and severance, training, labor disputes, safety inspections | policy levels, perception, outcome | mixed | none | -0.180 | 0 | `firm_training_incidence` 0.039 | Learning 0.523 → 0.531 if scored | 0.440 if scored | **reject** |
| MC.P3 market competition | merger review and market structure; firm innovation; procurement time and bidding | mixed | mixed | none | 0.612 | 0 | Experimentation rows at most 0.111 | Experimentation 0.391 → 0.409 if scored | 0.452 if scored | **reject; file the innovation lead** |
| TX.P3 taxation | 50% effective tax rates; 50% filing time, e-filing, audits, disputes, VAT refunds | 50% policy level | mixed | none | -0.081 | 0 | `tax_revenue_gdp` -0.142 | Shared purpose 0.318 → 0.353 if scored | 0.444 if scored | **reject** |
| BI.P3 insolvency (second look) | time and cost of in-court liquidation and reorganisation | institutional outcome | capability | Experimentation | 0.504 (0.420 without zeros, n 66) | 8 | `resident_trademarks_per_million` 0.182 | 0.391 → 0.409 (crosses O1) | 0.474 → 0.452 (0.436 → 0.414) | **score in Experimentation, zero as a value** |

Recommended package, BL.P3 in Building and BI.P3 in Experimentation together:
Building 0.549, Experimentation 0.409, guardrail 0.474 → 0.426 (9.5.0:
0.436 → 0.395).

## 4. Pillars

### 4.1 Business location, pillar 3 (`IC.BRE.BL.P3`)

**What it measures.** WDI: "the operational efficiency of establishing a
business location in practice". Handbook table 39, eight indicators, firm
flexibility only:

| Category | Sub-component | Points |
| --- | --- | ---: |
| 3.1 Property transfer and land administration | Major constraints on access to land (perception index, Enterprise Surveys) | 15 |
| | Time to transfer a property | 15 |
| | Cost to transfer a property (fees, transfer taxes, stamp duties, notaries) | 15 |
| 3.2 Construction permits | Time to obtain a construction-related permit | 15 |
| | Time to obtain a building permit | 15 |
| | Cost to obtain a building permit | 15 |
| 3.3 Environmental permit | Time to obtain an environmental permit | 5 |
| | Cost to obtain an environmental permit | 5 |

Data come from private-sector experts and Enterprise Surveys.

**Construct (written before the values).** 85 of 100 points are the days and
cost of the permits and registrations a firm needs before it can build or
occupy a site. The state delivers each transaction, and the pillar times it in
practice. That is state delivery of small-scale building, the same family as
the grid connection that `electricity_connection_speed` read and that
`utility_connection_efficiency` now reads. It observes an institutional
outcome. It is not a stock that money buys. Two impurities: 15 points are a
firm perception of land access, and the transfer cost includes transfer taxes,
which are a rate a legislature sets, not an efficiency. Building is the fit: its
`large_project_delivery` gap names the delivery side as what the industrial rows
cannot see. Coordination is not the fit: a permit is one agency's service to one
firm, not agencies acting together (the Coordination sweep reached the same
reading, row 10). Agency is not the fit either: business entry already carries
the founder's own transaction there.

**Values (printed, deciding nothing).** Range 30.0 to 89.0, median 69.1, no
zeros. r log GDP 0.160. Against the Building rows: `manufacturing_value_added`
0.030, `high_tech_exports_share` 0.070, `economic_complexity` 0.091,
`electricity_connection_speed` 0.156, `utility_connection_efficiency` 0.335. The
Building score 0.074 (9.4.0), 0.122 (9.5.0). No pair is near the 0.85
redundancy flag.

**Effect.**

| Run | Building mean confidence | Building confidence r log GDP | Guardrail |
| --- | ---: | ---: | ---: |
| 9.4.0 | 0.548 | 0.230 | 0.474 |
| 9.4.0 + BL.P3 | 0.549 | 0.186 | 0.448 |
| 9.5.0 (D171 applied) | 0.550 | 0.187 | 0.436 |
| 9.5.0 + BL.P3 | 0.551 | 0.152 | 0.416 |
| Not chosen: 9.4.0 + BL.P3 in Coordination | Coordination 0.361 → 0.394 | -0.008 → 0.047 | 0.455 |

Building already meets O1, so the row adds little confidence. It lowers the
guardrail and the income tilt of Building's confidence. Q1 Building confidence
falls slightly (0.540 → 0.532), because 15 Q1 countries lose coverage.

**Risks.** The permit fees and transfer taxes count as inefficiency, so a
country that taxes property transfers scores lower for a fiscal choice. One
round. Expert and survey data, as for the D167 rows.

**Verdict: score in Building**, class `C`, `higher_better`, through the World
Bank adapter. The construct fits better than any row in Building today: it
times the state's delivery of a transaction a builder needs. Its income
correlation (0.160) is the lowest of the seven pillars. That is a finding, not
the reason.

### 4.2 Financial services, pillar 3 (`IC.BRE.FS.P3`)

**What it measures.** WDI: the operational efficiency of obtaining a loan,
registering a security interest, the timeliness of credit information sharing,
and e-payments use and efficiency. Handbook table 29, ten indicators:

| Category | Sub-component | Points |
| --- | --- | ---: |
| 3.1 Loans | Obtaining a loan: time to a loan decision; obstacles (share of firms that did not apply for complex procedures, rates or collateral; perception index of access to finance) | 40 |
| | Security interest and credit data update (experts): time to register, time for new data to reach credit reports | 10 |
| 3.2 e-Payments | Cost of receiving and of making e-payments | 20 |
| | Time to receive an e-payment | 10 |
| | Usage level: share of monthly sales received and payments made electronically | 20 |

Most data come from Enterprise Surveys.

**Construct (written before the values).** The pillar reads how well the
financial sector serves firms. About half is the cost, speed and use of
electronic payments, which is a diffusion level of the kind D122 moved out of
Agency with `account_ownership` and `internet_users`. Most of the rest is the
service a private bank gives, plus a perception of access to finance. It is
what a firm in that country has to work with, not what the country does with
it. It is a condition. Its home is beside Agency, next to
`account_ownership` and `domestic_credit_private`.

**Values (printed, deciding nothing).** Range 25.7 to 92.8, median 72.6, no
zeros. r log GDP 0.714, the highest of the seven and above the probe's 0.70
flag. Against the Agency conditions: `internet_users` 0.677,
`account_ownership` 0.668, `domestic_credit_private` 0.402. Against scored
Agency rows: `business_entry_efficiency` 0.386, `new_business_density` 0.378.
Against `IC.BRE.MC.P3` 0.612. The pattern sits with the conditions, which is
what the construct said.

**Effect.** As a condition, none: a condition leaves confidence, coverage and
the guardrail (D122). For the record, scored in Agency it would give
0.471 → 0.486 and a guardrail of 0.447 (9.5.0: 0.410).

**Risks.** D122 says no condition is put on the 0 to 100 scale, because such a
number reads as a score. This pillar exists only as a 0 to 100 publisher
score. Publishing the value as the publisher wrote it obeys the letter of D122,
but on a page it will still read as a score. Brazil has no value, so the
condition adds nothing to the Brazil "has against does" map until 2026.

**Verdict: publish as a condition beside Agency**, low priority. It is the
access a country gives its firms, not what they do with it. If the owner judges
that a publisher score cannot be a condition, the verdict becomes reject. It
must not be scored.

### 4.3 Labor, pillar 3 (`IC.BRE.LB.P3`)

**What it measures.** WDI: "employment restrictions and cost, as well as public
services". Handbook table 28, nine indicators, all from Enterprise Surveys, six
sub-components at 16.67 points each:

| Category | Sub-component | Points |
| --- | --- | ---: |
| 3.1 Employment restrictions and costs | Social contribution: social security and employment taxes as a share of total labor cost | 16.67 |
| | Labor regulations as an obstacle (perception index) | 16.67 |
| | Dismissal: weeks to dismiss a permanent worker; severance paid in weeks of salary | 16.67 |
| 3.2 Employment services | Formal training: share of firms with formal training programs | 16.67 |
| | Labor disputes: share of firms in a dispute in three years; months to resolve | 16.67 |
| | Safety and health inspection: share of firms inspected (two indicators) | 16.67 |

Two indicators use a normal CDF transformation (handbook annex B).

**Construct (written before the values).** The pillar has no single object.
The social contribution ratio and the severance weeks are policy levels a
legislature sets, and the pillar scores a lower level higher. That is a
normative choice against worker protection, and the benchmark does not take it.
One sixth is a perception of regulation. One sixth is the share of firms with
formal training, which is the same Enterprise Surveys item as
`firm_training_incidence` in Learning, already scored. The dispute and
inspection parts observe practice, but a high inspection rate can mean a strong
inspectorate or a heavy one. No dimension's construct takes this mix.

**Values (printed, deciding nothing).** Range 30.2 to 79.9, median 55.6, no
zeros. r log GDP -0.180. `firm_training_incidence` 0.039 (the shared item is one
sixth, and the other five parts swamp it). `tertiary_enrollment` -0.315,
`human_capital_index` -0.198. `IC.BRE.TX.P3` 0.388, which is the payroll-tax
wedge counted in both.

**Effect (not recommended).** Scored in Learning: 0.523 → 0.531, guardrail
0.440. In Adaptability: 0.580 → 0.577, guardrail 0.445. Neither dimension
misses O1.

**Verdict: reject.** Half the points reward lower social protection, which is a
policy preference, and the training sixth is already scored. A negative income
correlation does not rescue a mixed construct.

### 4.4 Market competition, pillar 3 (`IC.BRE.MC.P3`)

**What it measures.** WDI: "operational efficiency in the implementation of key
services promoting market competition". Handbook table 36, 25 indicators, three
equal thirds:

| Category | Sub-component | Points |
| --- | --- | ---: |
| 3.1 Competition | Simplified merger review: use and time to file | 6.67 |
| | Market dynamism (Enterprise Surveys): number of competitors, largest competitor's share, change in competition, pricing power, ease of switching internet provider, regulated prices | 26.67 |
| 3.2 Innovation | Share of firms with product innovation (manufacturing, services) | 6.67 |
| | Share of firms with process innovation | 6.67 |
| | Share of firms spending on R&D | 6.67 |
| | Share of firms with international quality certificates | 13.33 |
| 3.3 Public procurement | Time to award public contracts (five contract types) | 8.33 |
| | Time to receive payment on a government contract | 8.33 |
| | Firms' perception of the ease of bidding | 8.33 |
| | Gender gap in government suppliers | 8.33 |

**Construct (written before the values).** Three objects in one number: how
contested markets are, as firms report them; whether firms try new products,
processes and research; and how fast the state awards and pays contracts. The
innovation third is the behaviour Experimentation asks for, firms trying new
things. But WDI serves only the pillar, so the innovation third cannot be read
apart, and two thirds of the number is something else. Quality certificates
(13 points) are an adoption level. D167 rejected the cross-topic pillar for
mixing transactions, and the Coordination and Experimentation sweeps rejected
this pillar for the same reason. The second look does not change it.

**Values (printed, deciding nothing).** Range 25.9 to 70.5, median 49.3, no
zeros. r log GDP 0.612. Against Experimentation rows: patents -0.004,
trademarks -0.063, designs 0.111, new repositories -0.092 (GEM rows n 9). Against
`IC.BRE.FS.P3` 0.612, `account_ownership` 0.585. The pillar moves with financial
access, not with the attempts Experimentation counts.

**Effect (not recommended).** In Experimentation: 0.391 → 0.409, guardrail
0.452, identical to insolvency, because coverage is identical.

**Verdict: reject.** The construct is mixed.

**Lead found.** WDI serves the innovation construct apart, from the Enterprise
Surveys: `IC.FRM.NPRD.ZS`, "percentage of medium and large firms that
introduced a new product/service and process over last 3 years, and spent on
R&D over last fiscal year (excluding small firms)", CC BY 4.0. Construct, stated
here before the values below: firms that tried new products and processes and
paid for research, a behaviour count of attempts, so a capability row for
Experimentation of the same family as `firm_training_incidence` (Learning) and
`bribery_incidence` (Trust). Caveats: small firms are excluded, the measure is a
conjunction of three acts, and Enterprise Survey rounds fall in different years
per country. I fetched its coverage and income correlation in the same step as
the construct, so this is a lead, not a preflight: 116 of 125 at any year, 100
at 2018 or later (quartiles 23 / 27 / 25 / 25), r log GDP 0.287 (n 100).
Simulated in Experimentation with its own recency: 0.391 → 0.421, guardrail
0.474 → 0.457; with insolvency as well, 0.433 and 0.438. It needs its own memo.

### 4.5 Taxation, pillar 3 (`IC.BRE.TX.P3`)

**What it measures.** WDI: "the practical effectiveness of the implemented tax
regulations and public services". Handbook table 37, seven indicators:

| Category | Sub-component | Points |
| --- | --- | ---: |
| 3.1 Time and functionality of processes | Time to prepare, file and pay three major taxes (hours) | 10 |
| | Share of firms filing and paying electronically | 10 |
| | Duration of a generic tax audit | 10 |
| | Duration of a tax dispute | 10 |
| | Obtaining a VAT refund in practice | 10 |
| 3.2 Financial burden on firms | Effective tax rate for profit taxes | 40 |
| | Effective tax rate for employment taxes and social contributions | 10 |

An economy with no VAT, no profit tax or no employment tax receives the maximum
score on that sub-component. Most data come from Enterprise Surveys.

**Construct (written before the values).** Half the pillar is the effective tax
rate, and the pillar scores a lower rate higher. That is a policy level, not an
efficiency. It also points the opposite way from `tax_revenue_gdp` in Shared
purpose, where a higher share of GDP collected scores higher. Scoring both would
reward low taxes in one dimension and high taxes in another. A country without a
profit tax gets full marks for the largest sub-component. The other half (filing
time, e-filing, audits, disputes, refunds) is administrative capability, nearest
to Coordination, but WDI does not serve it apart.

**Values (printed, deciding nothing).** Range 21.1 to 87.1, median 68.0, no
zeros. r log GDP -0.081. `tax_revenue_gdp` -0.142 (9.4.0, n 70), -0.104 (9.5.0,
n 74). `income_inequality` -0.317. `IC.BRE.LB.P3` 0.388. The negative sign with
tax revenue is the conflict the construct predicted. It is small, because the
administrative half dilutes it.

**Effect (not recommended).** In Shared purpose: 0.318 → 0.353, guardrail 0.444
(9.5.0: 0.329 → 0.362, 0.408). It does not reach O1 there. In Coordination:
0.361 → 0.394, guardrail 0.455.

**Verdict: reject.** Half the number is the tax rate, a policy choice. That
half contradicts a row already scored. WDI's `IC.FRM.TAXE.ZS` (firms filing
taxes electronically) is one administrative item on its own, but it is an
adoption share. I did not triage it.

### 4.6 Business insolvency, pillar 3 (`IC.BRE.BI.P3`), second look

**What it measures.** WDI: "the time and cost required to resolve in-court
liquidation and reorganization proceedings". Handbook table 28, four indicators,
all from private-sector experts:

| Category | Sub-component | Points |
| --- | --- | ---: |
| 3.1 Liquidation | Time from filing to payment of creditors (months) | 25 |
| | Cost as a share of the estate (court, attorney, insolvency representative and other fees) | 25 |
| 3.2 Reorganization | Time from filing to approval of the plan (months) | 25 |
| | Cost as a share of the estate | 25 |

**The zero rule, from the handbook.** "If an economy had zero completed (closed)
cases of judicial reorganization or judicial liquidation proceedings involving
corporate debtors over the past three years, the economy receives a 'no
practice' mark and zero score on the time and cost indicators for the specific
proceeding." The rule applies to each proceeding apart. A pillar of exactly 0
means that neither proceeding closed a case in three years. A country with
liquidations but no reorganisations scores at most 50. The scoring annex also
removes "no practice" economies before it sets the 5th and 95th percentile
bounds, so a zero does not distort the other scores.

**Construct (written before the values).** Unchanged from the Experimentation
sweep: the cost and time of exit through the courts in practice, which the
`failure_tolerance` note names as the observable substitute for tolerance of
failure. It is an institutional outcome, not a stock. The second look adds two
points. First, a zero is an observation inside the construct: no firm used the
formal exit for three years, so in practice there is no court exit to price.
Treating it as missing would drop the eight countries where the exit route is
least usable. Second, Trust is the other home: these are court proceedings, and
`dispute_resolution_efficiency` (DR.P3) sits there. The insolvency pillar prices
the exit of a debtor, not the enforcement of a contract, so Experimentation
stays the fit.

**Values (printed, deciding nothing).** Range 0 to 98.6, median 42.0. Eight
zeros: AGO AZE COD LAO LSO NPL PHL SLV. r log GDP 0.504 with zeros, 0.420 without
(n 66). Against Experimentation rows: patents 0.175, trademarks 0.182, designs
0.176, new repositories 0.146; GEM TEA -0.629 and fear of failure 0.421 on n 9,
too few to read. Against Trust: DR.P3 0.301, `court_compliance` 0.427,
`bribery_incidence` -0.386. Against `IC.BRE.BE.P3` 0.415, `IT.P3` 0.421.

**Effect.**

| Run | Experimentation mean confidence | Experimentation confidence r log GDP | Guardrail 9.4.0 (9.5.0) | Q1 Experimentation confidence |
| --- | ---: | ---: | --- | ---: |
| 9.4.0 | 0.391 | 0.461 | 0.474 (0.436) | 0.284 |
| BI.P3, zero as a value | 0.409 | 0.456 | 0.452 (0.414) | 0.305 |
| BI.P3, zero as missing | 0.403 | 0.487 | 0.461 (0.423) | 0.296 |
| Not chosen: BI.P3 in Trust | Trust 0.392 → 0.413 | 0.375 → 0.316 | 0.453 (0.415) | 0.334 |

In either home the row crosses O1 and lowers the guardrail by the same amount.
The construct ruling in #111 is therefore free of the numbers.

**Verdict: score in Experimentation, with zero kept as a value**, as #111
proposes. The zero rule should be stated in the decision entry with the
handbook's wording. A partial "no practice" (one proceeding at zero) cannot be
seen in WDI. The row note should say so.

## 5. Ranked list worth an issue

1. **BI.P3 into Experimentation (#111, existing issue).** The only pillar that
   moves an O1 miss: 0.391 → 0.409, guardrail -0.022. It waits only on the
   construct ruling and the zero rule, both argued in 4.6.
2. **BL.P3 into Building (new issue).** Construct fit, the lowest income
   correlation of the seven, no redundancy (highest 0.335 with US.P3). Building
   already meets O1, so the gain is the guardrail (-0.026 on 9.4.0, -0.020 on
   9.5.0) and a closer reading of state delivery. Same adapter, same 74
   countries, a minor dataset version.
3. **`IC.FRM.NPRD.ZS` innovating firms into Experimentation (new issue, not a
   B-READY pillar).** Found through MC.P3. 100 of 125 at 2018 or later, even
   across quartiles, behaviour, CC BY 4.0. It needs a preflight memo first: the
   round-year spread, the small-firm exclusion and the redundancy with patents
   and new business density.
4. **FS.P3 as a condition beside Agency (low).** It changes no score or
   confidence. File it only if the owner accepts a 0 to 100 publisher score as
   a condition under D122.

Not worth an issue: LB.P3 and TX.P3 (normative policy levels, and the training
and tax overlaps), MC.P3 as a row (mixed).

All of these grow with the B-READY 2026 round, which the World Bank lists at 36
more frame countries, Brazil among them (74 → 110). The Trust sweep simulated
that the round raises the guardrail by about 0.008 for DR.P3, because 11 of the
36 are in Q4. The same holds for every pillar here.

## 6. Sources

- WDI series metadata, read 2026-11-02:
  `https://api.worldbank.org/v2/sources/2/series/IC.BRE.<topic>.P3/metadata?format=json`
  for BL, FS, LB, MC, TX, BI and US. Every series gives `License_Type: CC BY-4.0`,
  vintage "Business Ready 2025 report (101 economies; B-READY data file version
  December 10, 2025)", last updated 2026-10-08.
- Values: `https://api.worldbank.org/v2/country/all/indicator/IC.BRE.<topic>.P3?format=json&per_page=20000&mrnev=1`,
  all 2025.
- B-READY Methodology Handbook, Final Second Edition (December 2025):
  https://thedocs.worldbank.org/en/doc/bc6351803cb0cd5ad4aba96b7e4aed8c-0540012024/original/B-Ready-Methodology-Handbook-Edition-2.pdf.
  Pillar 3 tables: business location table 39, labor table 28, financial
  services table 29, taxation table 37, market competition table 36, business
  insolvency table 28 and its "no practice" rule; scoring annex B (linear and
  normal CDF transformations, "no practice" removal before thresholds).
- `IC.FRM.NPRD.ZS`: same API, metadata and `mrnev=1` values.
- Repository, read only: `data/out/index.json`, `data/out/diagnostics.json` and
  `data/out/indicators/*.json` at 9.4.0 (`git show HEAD`) and 9.5.0 (working
  tree, 2026-11-02 15:31 UTC); `packages/core/src/model/indicators.ts`;
  `docs/WHY.md`; D117, D118, D122, D167 in `docs/DECISIONS.md`; the four
  November sweeps.
