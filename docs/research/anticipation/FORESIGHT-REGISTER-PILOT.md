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

**Round 2 verdict (codebook 1.1): go to 53 after the human spot-check.** See
"Round 2 (codebook 1.1)" at the foot of this file. Round 1 follows unchanged.

**Round 1 verdict: revise the codebook.** I1 agreement is 0.79, under the 0.80
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

## Round 2 (codebook 1.1)

Date: 2026-10-02. Codebook 1.1 was committed alone in `92ff79e` before
recoding. It settles the eight ambiguities above and applies the owner's
ruling that I1 accepts any official record dating the body's creation. It
names no pilot country as an example, so the recode tests the rules rather
than the round 1 adjudications.

**Coders.** Two fresh subagents, one Claude Sonnet and one Claude Opus. Each
got only codebook 1.1 and the country list, with no access to the
repository, the round 1 files or the other coder. Both worked from the open
web. Raw files are in the scratchpad as `foresight-v11-coder-a.json` (Sonnet)
and `foresight-v11-coder-b.json` (Opus). They are different models from one
vendor, so their errors are less correlated than round 1's, but not
independent: same training lineage, same search tools, same open web.

**Snapshots.** Coder A cited 31 sources and coder B 35. Each coder left one
without a Wayback snapshot, both after the archive answered HTTP 520 to the
save request. A: the 2016 uaecabinet.ae oath news item (ARE I1). B: the CSF
Futures Conversation page (SGP I3, which a second, archived source
also supports).

### Both codings

| ISO3 | A: I1 I2 I3 I4 | A score | B: I1 I2 I3 I4 | B score | Round 1 adjudicated |
| --- | --- | ---: | --- | ---: | ---: |
| HTI | 0 0 0 0 | 0 | 0 0 0 0 | 0 | 0 |
| VNM | 0 0 0 0 | 0 | 0 0 0 0 | 0 | 0 |
| ARE | 1 1 0 (no_change) 0 | 67 | 1 1 0 (no_change) 0 | 67 | 33 |
| NIC | 0 0 0 0 | 0 | 0 0 0 0 | 0 | 0 |
| SGP | 1 1 1 0 | 100 | 1 1 1 0 | 100 | 67 |
| NGA | 0 0 0 0 | 0 | 0 0 0 0 | 0 | 0 |
| BRA | 1 1 1 0 | 100 | 1 1 1 0 | 100 | 100 |
| GBR | 1 1 1 0 | 100 | 1 1 1 0 | 100 | 100 |
| EST | 1 1 1 0 | 100 | 1 1 1 0 | 100 | 100 |
| CHE | 1 1 1 0 | 100 | 1 1 1 0 | 100 | 100 |

The two coders agree on every item in every country. The UAE and Singapore
rise because of the I1 ruling. Both have official pages that date their
bodies: the 2016 future portfolio, the 2020 Government Development and the
Future Office, and CSF in 2009. Both rulings of round 1's Brazil split now
come out the same from both coders: CEDES fails condition 3 and Ipea meets
the unit.

### Agreement

Krippendorff's alpha, two coders, ten countries, 2,000-draw bootstrap over
countries.

| Measure | Alpha | Percent agreement | 95% bootstrap | Threshold 0.80 |
| --- | ---: | ---: | --- | --- |
| I1 on the official record | 1.000 | 100 | 1.00 to 1.00 | passes |
| I2 product in three years | 1.000 | 100 | 1.00 to 1.00 | passes |
| I3 survived a change | 1.000 | 100 | 1.00 to 1.00 | passes |
| I3 with reason (1, no_change, 0) | 1.000 | 100 | 1.00 to 1.00 | passes |
| I4 closed, no successor | undefined | 100 | undefined | **floor**: 0 for all ten from both coders, as in round 1 |
| Score (interval) | 1.000 | 100 | 1.00 to 1.00 | passes |
| **Body by body**: meets the unit, 56 matched bodies | 0.826 | 94.6 | 0.67 to 0.95 | passes |
| Bodies both coders judged (31; round 1's measure) | 0.787 | 90.3 | | under, printed only |
| Body codes on the 9 bodies both found qualifying | 1.000 (product, survived); record and closedNoSuccessor undefined, all 1 and all 0 | 100 | | passes |

The body measure is the one codebook 1.1 fixed before coding (section 7).
The two coders' candidate bodies are matched by identity into 56 bodies. A
body a coder did not list counts as not qualifying for that coder. The
matching table is `round2.bodies` in the JSON. Two readings bear on how much
the pass means:

- **The margin is narrow and depends on the measure.** Of the 56 bodies, 25
  were listed by only one coder, and every one of them was a rejection, so
  they add agreement at 0. On the 31 bodies both coders judged, round 1's
  measure, alpha is 0.79. The lower end of the bootstrap is 0.67.
- **The three splits change no item.** All three are bodies that had
  already closed: two before the I4 window, and one inside it with a
  successor named the same day.

### Disagreements and adjudication

| Body | What split | Adjudicated | Reason |
| --- | --- | --- | --- |
| SGP Scenario Planning Office / Strategic Policy Office, 1995 to 2015 | A: not coded separately, as CSF's lineage. B: meets the unit, merged 2015 | **Meets the unit.** Closed 2015 with a same-branch successor (CSF). No item changes | The CSF page, read by the adjudicator, dates the office to 1995, "to develop scenarios from a whole-of-government perspective". CSF was set up inside it in 2009, so it is a separate body that preceded CSF. The split traces partly to a point 1.1 leaves open: whether a parent body is coded separately when its foresight unit outlives it. |
| BRA SAE/PR, 2019 to 2022 form | A: fails condition 3, with scenarios only in an intelligence unit. B: meets the unit, low confidence | **Meets the unit.** survived `did_not_survive`. Closed 2023-01-01 with a same-day executive successor, so I4 is 0. No item changes | The adjudicator read Decreto 10.374/2020 as amended by Decreto 10.817/2021. The directorates in force at closure "realizar estudos e análises de cenários que contribuam para ... o planejamento nacional de longo prazo", across the economy, science and technology, defence and international affairs. A read only the revoked text and the advisory unit, which is a reading error, not a rule split. |
| EST Eesti Arengufond, 2006 to 2016 | A: condition 3 unverified because the act was not read. B: meets the unit | **Meets the unit, low confidence.** Closed 2016-06-29, before the I4 window. No item changes | The Foresight Centre's page (arenguseire.ee) calls the Fund a public-law organisation founded by the Riigikogu that worked through investment, foresight and growth programmes. The act renders only in a browser and was not read, so condition 4 (across domains, or the economy only) is on the spot-check list. |

The adjudicator also checked one agreed code. Coder B cites a 2025 Brazil
2050 scenarios document on gov.br as Ipea's work. Its front matter credits
the Planning Ministry's national planning secretariat, which cites an Ipea
macroeconomic study, so the agreed Ipea body code `product 0` stands, and
the document belongs to the secretariat's I2.

Adjudicated scores equal the coders' scores: HTI 0, VNM 0, ARE 67, NIC 0,
SGP 100, NGA 0, BRA 100, GBR 100, EST 100, CHE 100. The bodies adjudicated
as meeting the unit number 12: ARE 2, SGP 2, BRA 3, GBR 2, EST 2, CHE 1.

### The regime pattern

| Regime class | Countries | Mean score |
| --- | --- | ---: |
| Closed autocracy | HTI 0, VNM 0, ARE 67 | 22 |
| Electoral autocracy | NIC 0, SGP 100 | 50 |
| Electoral democracy | NGA 0, BRA 100, GBR 100 | 67 |
| Liberal democracy | EST 100, CHE 100 | 100 |

Spearman's rho between the score and the regime class is **0.64** (n 10),
down from 0.72 in round 1 and under the 0.80 stop threshold. The fall comes
from the I1 ruling, which was made on the construct before recoding (owner,
2026-10-02, recorded in the 1.1 changelog). No rule was chosen for its effect
on rho. The UAE still loses I3 on `no_change`, as the codebook intends, so
the closed class does not reach 100.

### Income, printed only

r with log GDP per capita PPP 0.83, Spearman 0.78, n 10. Round 1 was 0.69.
It decides nothing (D117, D118). The rise comes from the two richest
countries in the sample, the UAE and Singapore, gaining I1.

### Ceiling and floor

Five of ten score 100 and four score 0. The stop rule fires at eight at one
value, so it does not fire. Nine of ten sit at an end, though, and on these
ten the items move together. Every country with a qualifying body has I1
and I2. I3 is the only item that separates them (the UAE), and I4 never
fires. On this sample the score mostly reads whether a qualifying body
exists, plus whether it has outlived a leader. The 53 will show whether I1
and I2 separate anywhere; ten countries cannot.

### Verdict

**Go to 53 after the human spot-check.** Section 8, under codebook 1.1:

- *Go to 53* needs every alpha, item and body by body, at 0.80 or more, and
  no stop rule. I1 to I3 and the score are 1.00, and the body measure is
  0.83. I4 is degenerate, at 100 percent agreement and 0 for all ten, and
  section 7 treats such an item as a floor, not as a failed alpha. No stop
  rule fires: no ceiling, and regime rho 0.64.
- *Revise* needs an alpha between 0.667 and 0.80, or a disagreement that
  traces to an ambiguous rule. No alpha the codebook fixed falls in that
  band. One split, Singapore's Scenario Planning Office, traces partly to an
  open lineage question, and it changes no item.
- *Stop* needs a stop rule or an alpha under 0.667. Neither applies.

Before the 53 are coded:

1. **The human spot-check.** About 20 percent of the bodies (11 of 56),
   stratified by regime class with a fixed seed, plus the three adjudicated
   splits, listed as a checklist in `FORESIGHT-REGISTER-SPOTCHECK.md`. The
   coding of the 53 starts only when it passes. An overturn is reported
   with the error rate, and the verdict waits on it.
2. **Settle lineage in 1.2.** Say whether a parent body is coded as a GFF
   of its own when its foresight unit outlives it, and make I4's "record
   every GFF since 1990" explicit for closed predecessors. Coder A skipped
   them. No item in the ten depends on this, and the 53 include the ten, so
   coding the 53 under 1.2 recodes them at no extra cost.
3. **Carry I4 as unvalidated.** In both rounds it was 0 for all ten, so its
   reliability is unmeasured. The 20 percent second coding of the 53
   (codebook section 7) must report I4 agreement on its own. If I4 never
   fires on the 53, it adds nothing to the score, and dropping it is a
   decision.
4. **Read the body alpha as narrow.** It passes at 0.83 on the measure fixed
   in advance and sits at 0.79 on the bodies both coders judged. The second
   coding of the 53 reports both.

Nothing is scored, and the row stays a declared gap until a decision
promotes it.
