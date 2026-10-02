# Foresight register pilot: ten countries, two coders

Task: pilot the project-coded register for `government_foresight_capacity`
decided on issue #68 (recommendation 1 of `O1-CANDIDATES.md`). Ten countries,
the coding rule fixed before coding, two independent coders, nothing scored
until reviewed.

Track: reliability pilot. Nothing is wired: no registry row, observation,
score, version or decision changed.

Date: 2026-10-02. Codebook 1.0,
`docs/research/anticipation/FORESIGHT-REGISTER-CODEBOOK.md`, committed alone
in `2cc0577` before any country was coded. Adjudicated data:
`data/research/foresight-register-pilot.json`. Coder files (raw, with every
source): scratchpad `foresight-coder-a.json`, `foresight-coder-b.json`.

**Verdict: revise the codebook.** I1 agreement is 0.79, under the 0.80
threshold the codebook fixed, the one item-level disagreement and a masked
disagreement on Brazil both trace to rules the codebook leaves open, and I4
never fired. No stop rule fired. Recode the ten under 1.1 before any decision
to code the 53.

## The countries

Drawn under codebook section 6: ten fixed regime by income cells, the closed
class oversampled, the country in each cell drawn with
`random.Random("ncb-foresight-pilot-2026-10-02")`, Brazil fixed. Regime is
V-Dem Regimes of the World 2025 via Our World in Data; income quartile is by
rank of GDP per capita PPP among the 51 countries in `diagnostics.json`.

| ISO3 | Regime 2025 | Income quartile | How chosen |
| --- | --- | ---: | --- |
| HTI | closed autocracy | 1 | single-country cell |
| VNM | closed autocracy | 2 | drawn from CHN, VNM |
| ARE | closed autocracy | 4 | single-country cell |
| NIC | electoral autocracy | 1 | drawn from ETH, IND, NIC, PHL, RWA, SLV |
| SGP | electoral autocracy | 4 | single-country cell |
| NGA | electoral democracy | 1 | drawn from BOL, GTM, HND, KEN, NGA, ZAF |
| BRA | electoral democracy | 2 | fixed by the owner |
| GBR | electoral democracy | 3 | drawn from GBR, ISR, MYS, PAN, POL, PRT |
| EST | liberal democracy | 3 | drawn from CHL, ESP, EST, FRA, JPN, URY |
| CHE | liberal democracy | 4 | drawn from AUS, CHE, DEU, FIN, IRL, KOR, NLD, SWE |

Three of the ten cells hold one country, so HTI, ARE and SGP were chosen by
the cell design, not drawn. The draw put Vietnam, not China, in the closed Q2
cell, so the plan-making autocracy the triage memo worried about most is
represented by its smaller neighbour.

## Both codings

Each coder was a separate subagent given only the codebook and the country
list, told not to read the repository, the evidence corpus or the other
output, and to work from the open web.

| ISO3 | A: I1 I2 I3 I4 | A score | B: I1 I2 I3 I4 | B score |
| --- | --- | ---: | --- | ---: |
| HTI | 0 0 0 0 | 0 | 0 0 0 0 | 0 |
| VNM | 0 0 0 0 | 0 | 0 0 0 0 | 0 |
| ARE | 0 1 0 (no_change) 0 | 33 | 0 1 0 (no_change) 0 | 33 |
| NIC | 0 0 0 0 | 0 | 0 0 0 0 | 0 |
| SGP | 0 1 1 0 | 67 | 0 1 1 0 | 67 |
| NGA | 0 0 0 0 | 0 | 0 0 0 0 | 0 |
| BRA | 1 1 1 0 | 100 | 1 1 1 0 | 100 |
| GBR | **0** 1 1 0 | **67** | **1** 1 1 0 | **100** |
| EST | 1 1 1 0 | 100 | 1 1 1 0 | 100 |
| CHE | 1 1 1 0 | 100 | 1 1 1 0 | 100 |

## Agreement

Krippendorff's alpha over the ten countries, two coders, with a 2,000-draw
bootstrap over countries.

| Item | Alpha | Percent agreement | 95% bootstrap | Threshold 0.80 |
| --- | ---: | ---: | --- | --- |
| I1 established by act | 0.791 | 90 | 0.00 to 1.00 | **fails** |
| I2 product in three years | 1.000 | 100 | 1.00 to 1.00 | passes |
| I3 survived a change | 1.000 | 100 | 1.00 to 1.00 | passes |
| I3 with reason (1, no_change, 0) | 1.000 | 100 | 1.00 to 1.00 | passes |
| I4 closed, no successor | undefined | 100 | undefined | **floor**: 0 for all ten from both coders |
| Score (interval) | 0.973 | 90 | 0.89 to 1.00 | passes |

The figures overstate reliability, for three reasons:

- **One model, twice.** Both coders are instances of the same language model
  with the same search tool. Their errors are correlated, so agreement between
  them overstates what two human coders would reach.
- **Four countries carry no information.** HTI, VNM, NIC and NGA are 0 on
  every item from both coders, which is easy agreement. On the six countries
  with any function, I1 alpha is 0.69.
- **Item agreement hid a unit disagreement.** On Brazil both coders gave 100,
  on different bodies. Coder A counted the Chamber of Deputies' CEDES and
  rejected Ipea; coder B did the reverse. Across the 26 bodies both coders
  judged, they disagreed on two, both in Brazil (alpha 0.84 on whether a body
  meets the unit). A country with several candidate bodies can agree on its
  score and disagree on its evidence.

## Disagreements and adjudication

| ISO3 | What split | Adjudicated | Reason |
| --- | --- | --- | --- |
| GBR | I1: A 0, B 1 | **1**, score 100 | B found the act: the House of Commons resolution of 21 November 2000 approving the Information Committee's report on the future of POST (HC 659). The adjudicator read it on Hansard on 2026-10-02. A resolution of the House is a named act under I1. A found only secondary sources: a search miss, not a rule split. |
| BRA | unit: CEDES (A yes, B no), Ipea (A no, B yes) | CEDES no, Ipea yes; score 100 | CEDES's Resolution 26/2013, art. 2 II, mandates feasibility and impact studies of technologies, plans and policies. It has no long-term or emerging-change wording, so condition 3 fails. Ipea is a federal public foundation, so condition 1 holds. Its statute (Decreto 11.194 of 8 September 2022, art. 3 III) names "estudos prospectivos de médio e longo prazo", and Ipea kept operating after the 1 January 2023 change, which carries I3. The Planning Ministry's long-term planning undersecretariat (Decreto 11.353, art. 16) carries I1 and I2. |
| ARE | status of the Ministry of Cabinet Affairs' future portfolio (A merged 2020, B operating) | operating; no item changes | B cites the ministry's current page holding the portfolio. |

The adjudicated scores are the agreed ones except GBR: HTI 0, VNM 0, ARE 33,
NIC 0, SGP 67, NGA 0, BRA 100, GBR 100, EST 100, CHE 100.

## Where the codebook is ambiguous

These are the points the coders flagged independently, or that the
disagreements trace to. Codebook 1.1 should settle each before recoding.

1. **A collegial executive.** Switzerland's Federal Council has no single
   chief executive (both coders). I3 needs a rule: for example, any change in
   the council's membership, or the rotating presidency.
2. **Technology assessment for a legislature.** Section 1 accepts it, but
   does not say whether a general impact-assessment mandate with no futures
   wording qualifies. That is CEDES, the Brazil split.
3. **State research foundations.** Section 1 excludes think tanks "even when
   government funds or hosts them" and admits statutory bodies. It does not
   place a public-law research foundation such as Ipea. That is the other
   half of the Brazil split.
4. **What counts as a named act.** A House resolution (POST) and a cabinet
   restructure announced without a published decree (the UAE, 2016 and 2020)
   both need an explicit ruling. The GBR split came from a search, but a
   coder who finds the resolution still has to decide that it counts.
5. **Co-authored products.** The UAE's 2023 whitepaper was written with a
   consultancy (both coders).
6. **Product horizon.** The ten-year horizon in condition 3 applies to
   mandates; I2 does not say whether a five-year horizon scan (POST) counts.
7. **The successor test.** When a body closes and another receives the
   mandate the same day without an act naming the transfer (Brazil's SAE in
   2023), section 2 does not say whether that is a successor.
8. **Planning-body wording.** Whether "prospects" or "outlook" in a planning
   institute's mandate is a named foresight function (Vietnam's Development
   Strategy Institute).

## The regime pattern

| Regime class | Countries | Mean score |
| --- | --- | ---: |
| Closed autocracy | HTI 0, VNM 0, ARE 33 | 11 |
| Electoral autocracy | NIC 0, SGP 67 | 34 |
| Electoral democracy | NGA 0, BRA 100, GBR 100 | 67 |
| Liberal democracy | EST 100, CHE 100 | 100 |

Spearman's rho between the score and the regime class is 0.72 (n 10). That is
under the 0.80 stop threshold, but not far under it. The A13 inversion the triage memo
feared, plan-making autocracies coding high, did not appear. The pattern runs
the other way. Two rules drive it:

- **I1 requires a named act.** Singapore's Centre for Strategic Futures and
  the UAE's future offices exist by administrative decision with no act on any
  official page either coder could read, so both lose a third. A legislature's
  foresight body is created by a published act almost by definition.
- **I3 counts changes of the person.** It read as intended. The UAE codes
  `no_change` because its prime minister has held office since 2006.
  Singapore passes on the 2024 handover from Lee to Wong. Vietnam has no
  qualifying body, so the rule never reached it.

The ordering is plausible on the construct for Estonia, Switzerland and the
United Kingdom, all with statutory or parliamentary foresight bodies. It is
doubtful for Singapore, whose foresight function is among the oldest and
best documented in any government. A 67 there comes from a documentation
rule, not from the function. That is the A13 risk turned around: a
publication habit that leans to democracies, the same objection the triage
memo raised against reading the evidence grid as a register.

## Income, printed only

r with log GDP per capita PPP 0.69, Spearman 0.67, n 10 (`diagnostics.json`
`income`). It decides nothing (D117, D118). Ten countries cannot separate it
from the regime pattern above.

## Ceiling and floor

Four of ten score 0 and four score 100. The stop rule fires at eight at one
value, so it does not fire, but the scale is close to binary at both ends,
and I4 is 0 everywhere. On ten countries the closure item adds nothing; it
may on 53, where the triage memo knows of closures, but none fall inside its
ten-year window.

## Verdict

**Revise the codebook.** Section 8 fixed three outcomes before coding:

- *Go to 53* needs every alpha at 0.80 or more. I1 is 0.79, and I4 has none.
- *Revise* applies when an alpha falls between 0.667 and 0.80, or when a
  disagreement traces to an ambiguous rule. Both are true.
- *Stop* needs a stop rule to fire. None did: no ceiling, regime rho 0.72.

Before recoding under 1.1:

1. Settle the eight points above in the codebook text, as version 1.1 with
   the reason recorded.
2. Decide whether I1 should accept an official page that dates the body's
   creation by a named authority ("established in the Prime Minister's
   Office in 2009"), or keep requiring a nameable act. This is the rule
   behind Singapore's 67 and most of the regime slope. Either choice is
   defensible. It has to be made on the construct, before recoding, not to
   move rho.
3. Recode the same ten with two fresh coders. Add at least one human coder
   if the owner can find one, because model-on-model agreement is the
   weakest part of this pilot.
4. Have unit decisions coded and compared body by body, not only items, so
   a Brazil-type split cannot hide inside an agreed score.

Archived snapshots are missing for several sources, because archive.org
rate-limited coder A, and three for coder B, including the Hansard
resolution. Section 4 requires them before promotion, not before a recode.
