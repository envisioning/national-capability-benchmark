# Foresight register results: the pilot recode under codebook 1.3

Track: reliability pilot for `government_foresight_capacity`, issue #68.
Nothing is wired: no registry row, observation, score, version or decision
changed.

Date: 2026-10-16. Codebook 1.3,
`docs/research/anticipation/FORESIGHT-REGISTER-CODEBOOK.md` (`15ce3b61`),
committed before this recode. Reference date for every window: 2026-10-02.
A first 1.3 recode was run on 2026-10-03 and its output was never committed;
this run replaces it and shares nothing with it.

Data: `data/research/foresight-register-pilot.json`, `round3`. Raw files,
committed unedited: `data/research/foresight-register-pilot-1.3/`
(`coder-a.json`, `coder-b.json`, `bodies.json`, `adjudications.json`,
`spotcheck.json`, `snapshots.tsv`).

## 1. The recode

**Verdict under the codebook: stop.** I1 alpha is 0.55, I3 alpha is 0.62
and body-by-body alpha is 0.62. All three are under 0.667, and 1.3 is the
third revision. Codebook section 8 reads an alpha under 0.667 after one
revision as a stop, and section 7 says the item is dropped or the register
stops. The spot-check (section 2) passes D148. The two results disagree, and
a decision entry rules between them. The 53 are not coded.

### Coders

The procedure is `FORESIGHT-REGISTER-RUNBOOK.md` with its version
references moved to 1.3 (runbook section 0.2). The two coders are of
different vendors, as the runbook sets for the 53. Round 2's coders were
both Claude models.

| Coder | Model | How it ran | Batches |
| --- | --- | --- | --- |
| A | `claude-opus-5-5` | a fresh Claude Code subagent per batch, given only the brief and the codebook | A1 ARE BRA CHE EST GBR; A2 HTI NGA NIC SGP VNM; A1r ARE |
| B | `gpt-5.6-sol`, reasoning effort high | `codex --search exec --ignore-user-config --ephemeral` from an empty directory holding only the brief and the codebook | B1 ARE BRA CHE EST GBR; B2 HTI NGA NIC SGP VNM |

The brief is runbook section 3 with "1.2" read as "1.3". Batch size is five,
so each coder made two passes of the ten. `gpt-6-luna`, the model in
`~/.codex/config.toml`, is refused for a ChatGPT account, so coder B ran on
`gpt-5.6-sol`; its self-reported model string is "GPT-5".

Two deviations, both recorded here and nowhere silent:

- Batch A1 failed the runbook section 5 check: ARE was scored 67 on items
  that give 33. ARE alone was recoded in a fresh session (A1r) and replaces
  A1's ARE. A1r scores 33, the same as A1's items. The other four A1
  countries pass and stand.
- One A1r quote is 26 words, one over the cap. No code rests on the length,
  so the file stands unedited.

The adjudicator was a fresh `claude-opus-5-5` subagent given the codebook
and both coder files and nothing else. It matched bodies, read the cited
sources and ruled on every split and every low-confidence item.

### Snapshots

Coder A cited 33 sources on items coded 1 and left 2 without a Wayback
snapshot. Coder B cited 25 and left 18, most after the archive answered
HTTP 429. After coding, every source on a 1 and every adjudicated GFF source
without a snapshot (31 URLs) was checked against the CDX API and saved where
none existed, with the result in `snapshots.tsv`. 24 already had a
capture with status 200, 3 were saved now, and 4 still have none: the
Foresight Centre's 2050 local services report (EST I2, save answered 302),
the 2016 uaecabinet.ae decrees item (ARE), the CSF "Honing Our Edge" page
(SGP I3) and the OSPRE services page (NGA's unit decision). The last three
answered 520. The reviewer requests them before promotion (codebook section
4).

### Both codings

| ISO3 | A: I1 I2 I3 I4 | A | B: I1 I2 I3 I4 | B | Adjudicated | Score | Round 2 |
| --- | --- | ---: | --- | ---: | --- | ---: | ---: |
| HTI | 0 0 0 0 | 0 | 0 0 0 0 | 0 | 0 0 0 0 | 0 | 0 |
| VNM | 0 0 0 0 | 0 | 0 0 0 0 | 0 | 0 0 0 0 | 0 | 0 |
| ARE | 1 0 0 (no_change) 0 | 33 | 1 0 0 (no_change) 0 | 33 | 1 0 0 (no_change) 0 | 33 | 67 |
| NIC | 0 0 0 0 | 0 | **1** 0 0 (no_change) 0 | **33** | 0 0 0 0 | 0 | 0 |
| SGP | 1 1 1 0 | 100 | 1 1 1 0 | 100 | 1 1 1 0 | 100 | 100 |
| NGA | **0** 0 **0** 0 | **0** | **1** 0 **1** 0 | **67** | 1 0 1 0 | 67 | 0 |
| BRA | 1 1 **1** 0 | **100** | 1 1 **0 (no_change)** 0 | **67** | 1 1 1 0 | 100 | 100 |
| GBR | 1 1 1 0 | 100 | 1 1 1 0 | 100 | 1 1 1 0 | 100 | 100 |
| EST | 1 1 1 0 | 100 | 1 1 1 0 | 100 | 1 1 1 0 | 100 | 100 |
| CHE | 1 1 1 0 | 100 | 1 1 1 0 | 100 | 1 1 1 0 | 100 | 100 |

Two countries move from round 2 on points codebook 1.3 did not change:

- **ARE, 67 to 33.** Round 2 held the Government Development and the Future
  Office as a GFF with a 2023 product. Neither coder found it qualifying
  here. The adjudicator found no primary page that states its mandate (the
  cabinet minister page now redirects), and the leads describe "future
  readiness", which is not a listed term. The Ministry of Cabinet Affairs
  stays the only GFF, with no product of its own in the window.
- **NGA, 0 to 67.** Coder B found the Office for Strategic Preparedness and
  Resilience (Executive Order 12, 10 June 2022), whose own page lists
  "long-term threat horizon scanning". No round 2 coder listed it.

Both moves come from what the coders found, not from a rule. The same rule
read twice gives a different register for two of ten countries.

### Agreement

Krippendorff's alpha, two coders, ten countries, 2,000-draw bootstrap over
countries with `random.Random(7)`.

| Measure | Alpha | Percent agreement | 95% bootstrap | Threshold |
| --- | ---: | ---: | --- | --- |
| I1 on the official record | **0.548** | 80 | -0.19 to 1.00 | under 0.667 |
| I2 product in three years | 1.000 | 100 | 1.00 to 1.00 | passes |
| I3 survived a change | **0.620** | 80 | 0.04 to 1.00 | under 0.667 |
| I3 with reason (1, no_change, 0) | **0.540** | 70 | -0.01 to 0.85 | under 0.667 |
| I4 closed, no successor | undefined | 100 | undefined | floor: 0 for all ten from both coders, a third time |
| Score (interval) | 0.834 | 70 | 0.48 to 0.98 | passes |
| **Body by body**: meets the unit, 105 matched bodies | **0.616** | 88.6 | 0.49 to 0.72 | under 0.667 |
| Bodies both coders judged (34; round 1's measure) | 0.651 | 82.4 | | printed only |
| Body code record, 13 bodies both found qualifying | 0.436 | 76.9 | | printed only |
| Body code product, same 13 | 0.702 | 84.6 | | printed only |
| Body code survived, same 13 | 0.534 | 76.9 | | printed only |
| Body code closedNoSuccessor, same 13 | undefined | 100 | | all 0 |

Of the 105 matched bodies, 71 were listed by one coder only. Coder B's
entries match 85 bodies and coder A's 54; most of the difference is
rejections. Twelve bodies split on
the unit: `BRA.ipea`, `BRA.saedes`, `BRA.nae`, `CHE.pstab`, `EST.edfunit`,
`GBR.hsp`, `GBR.hss`, `GBR.jdac`, `NGA.ospre`, `NIC.spingc`, `SGP.sg`,
`SGP.fut`.

### Disagreements and adjudication

The three country splits:

| Country item | Split | Adjudicated | Reason | Traces to |
| --- | --- | --- | --- | --- |
| NIC I1 | A 0, B 1 on the SPING National Council | **0** (A) | The national plan names "planificación estratégica-prospectiva" as a process of the planning system. The Council's own tasks name no listed term, and the plan says the Council "will have" them. B credited the system's wording to the Council. | a reading miss |
| NGA I1, I3 | A 0, 0; B 1, 1 on OSPRE | **1, 1** (B) | OSPRE's services page names "long-term threat horizon scanning" across eleven domains; State House dates Executive Order 12 to 10 June 2022; a gov.ng page of February 2026 shows it operating after the 2023 change of president. A read the mandate as security only. | a search miss, and two open points: whether a multi-domain human-security mandate is one sector (condition 4), and whether a news item on a gov.ng domain is an official page for I3 |
| BRA I3 | A 1, B 0 `no_change` | **1** (A) | Ipea's statute (Decreto 7.142/2010, reissued as 11.194/2022) names "estudos prospectivos de médio e longo prazo", and Ipea operated after the 2011 change of president. B did not read the statute and rejected Ipea. | a search miss |

The body splits and code splits, in short (every ruling with its source is
in `adjudications.json`):

| Body | Split | Ruling | Traces to |
| --- | --- | --- | --- |
| `BRA.ipea` | A meets, B rejects | meets | search miss (B) |
| `BRA.saedes` SAE/PR economic and social directorate | A meets, B did not list | meets; survived `did_not_survive` (A had `no_change`) | search miss (B) |
| `BRA.nae` Núcleo de Assuntos Estratégicos, 2007 to 2008 | A rejects, B meets | meets | reading miss (A) |
| `BRA.splp` | product A 1, B 0 | 0: the 2025 megatrends report is issued by the ministry, and the undersecretariat appears only as a post in the credits | product credit (1.3 change 2 applied) |
| `CHE.pstab` Perspektivstab | A rejects, B meets | meets, low confidence | rule: whether an interdepartmental staff is an organisational body |
| `CHE.stf` | survived A `no_change`, B 1 | `no_change` | rule: I3 has no reason code for a body whose date cannot be seen |
| `EST.edfunit` Development Fund foresight unit | A did not list, B meets | fails, not shown: the act did not render | unrendered page (overturned by the spot-check) |
| `GBR.hsp`, `GBR.hss` | A meets, B did not list or rejects | both meet | search miss (B) |
| `GBR.jdac` | A did not list, B meets | meets, low confidence | search miss (A) |
| `GBR.ffet`, `GBR.hsc`, `GBR.post` | record and survived codes | `GBR.post` record 1 on the Commons resolution of 21 November 2000; `GBR.ffet` record 0, product 0; `GBR.hsc` record 1, survived 1 | product credit and search misses |
| `NGA.ospre` | A rejects, B meets | meets, low confidence | as NGA above |
| `NIC.spingc` | A did not list, B meets | fails | reading miss (B) |
| `SGP.sg` Strategy Group | A rejects, B meets | fails | rule: condition 3 lists "emerging change" as an object but not as a term |
| `SGP.fut` Futures team | A did not list, B meets | meets, low confidence | search miss (A) |

Seven rulings trace to a rule the codebook leaves open. Six are named above
(condition 4 on human security, the official-page status of a news item,
"emerging change", interdepartmental staff, the missing I3 reason code, and
whether "Lage- und Umfeldanalyse" is a direct equivalent of horizon
scanning, which carries CHE I1). The seventh is Brazil's Comissão Senado do
Futuro: whether "o futuro do País" is a direct equivalent of "futures".
Read strictly it is not, which keeps Brazil's I4 at 0. The other reading
makes it a GFF closed on 2023-06-07 with no legislative successor, and
Brazil scores 80.

Adjudicated: 105 bodies, 22 GFFs (GBR 7, BRA 5, CHE 3, SGP 3, EST 2,
ARE 1, NGA 1).

### What the splits show

The 1.3 changes held where they apply. Product credit split once
(`BRA.splp`), and the adjudicator settled it by the new rule without
argument. Unrendered pages were the cause of one split (`EST.edfunit`).

The new failure is coverage. The two coders found different bodies. Each
item split is one coder finding a body or a statute the other did not
(OSPRE, Ipea) or crediting one body's mandate to another (SPING). Round 2's
two Claude coders agreed on every item, and two vendors here agree on seven
countries of ten. Either the round 2 agreement was the correlated error D148
named as its cost, or this run's coders searched less deeply. The data
cannot separate the two. Coder B's reasoning effort was high, not the
configured xhigh, which is a reason to suspect the second in part.

### The regime pattern

| Regime class | Countries | Mean score |
| --- | --- | ---: |
| Closed autocracy | HTI 0, VNM 0, ARE 33 | 11 |
| Electoral autocracy | NIC 0, SGP 100 | 50 |
| Electoral democracy | NGA 67, BRA 100, GBR 100 | 89 |
| Liberal democracy | EST 100, CHE 100 | 100 |

Spearman's rho between the score and the regime class is **0.78** (n 10),
up from 0.64 in round 2 and 0.02 under the 0.80 stop threshold. The rise
comes from ARE falling and NGA rising, both on what the coders found.

### Income, printed only

r with log GDP per capita PPP 0.68, Spearman 0.71, n 10 (`diagnostics.json`
`income`, 2025). Round 2 was 0.83. It decides nothing (D117, D118).

### Ceiling and floor

Five of ten at 100, three at 0. The stop rule fires at eight at one value,
so it does not fire. I4 is 0 for every country from both coders and the
adjudicator, for the third round.

### Verdict

Codebook section 8, under 1.3:

- *Go to 53* needs every alpha, item and body by body, at 0.80 or more. I1,
  I3 and the body measure are under it.
- *Revise* applies to an alpha between 0.667 and 0.80. None falls there; the
  three that fail are under 0.667.
- *Stop* applies when an alpha is below 0.667 after one revision. 1.3 is the
  third. **This fires.** No stop rule on ceiling or regime fires.

The codebook's own reading is therefore stop, or drop the failing items.
Dropping I1 and I3 would leave I2 alone, a single binary item, and would
need a new construct argument. That is a decision, not a step this file
takes. Nothing is scored, and the row stays a declared gap.

## 2. The spot-check

`FORESIGHT-REGISTER-SPOTCHECK-1.3.md` draws 21 of the 105 bodies with the
seed `ncb-foresight-spotcheck-1.3-2026-10-03` and checks the 13 split bodies
the draw did not take in addition. Under D154 (c) the checker is a fresh context, not a coder:
four `claude-sonnet-5-5` subagents, each given the codebook and its share
of the sheet only.

| | Bodies | Confirmed | Overturned | Cannot verify |
| --- | ---: | ---: | ---: | ---: |
| Sample | 21 | 18 | 1 (`GBR.jdac`, survived) | 2 (`HTI.ctpea`, `NIC.an`) |
| Splits, checked in addition | 13 | 12 | 1 (`EST.edfunit`, unit) | 0 |

One of 21 sampled bodies is overturned (5 percent) and no body decision
changes a country item. **The check passes D148.** It does not repair
section 1: the check reads whether the adjudicated table is right, and the
coders' agreement reads whether the rule gives the same table twice. The
second is what fails.

## What a person has to do

- Rule, in a decision entry, between the two results: the recode stops
  under codebook section 8, and the spot-check passes D148. The options the
  codebook gives are stop the register, or drop I1 and I3. A third option
  outside the codebook is a 1.4 that settles the seven open points and a
  recode with coders at full search depth, which section 8 does not
  provide for after a third revision.
- Rule on I4, which has not fired in three rounds.
