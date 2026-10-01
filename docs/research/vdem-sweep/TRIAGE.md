# V-Dem sweep: triage of codebook variables for Trust and Coordination

Task: Q5 of the research roadmap (O1: Trust, Coordination)

Track: source-backed measurement

Date: 2026-10-01. Dataset 7.3.0, V-Dem Country-Year Full+Others v15
(2025-03-04), the archive the adapter already pins (D121), year 2024.

Outcome: one row scored, `court_compliance` in Trust's institutional family,
from `v2jucomp` (D131). Nothing is wired for Coordination: no V-Dem variable
observes independent actors organising around an objective, and the closest
one is a deliberative-democracy item that fails the autocracy test. No check is
added.

## Method

D118 order. For every variable the construct paragraph below was written from
the codebook (the PDF inside the pinned archive) before any value was read.
Then, on the 2024 country-year rows for the 53 benchmark countries: coverage,
spread, the A13 regime test (mean by V-Dem's own Regimes of the World,
`v2x_regime`: 5 closed autocracies ARE CHN CUB HTI VNM, 11 electoral
autocracies, 21 electoral democracies, 16 liberal democracies), r with the
normalised values of the target dimension's scored rows (redundancy), and last
r with log GDP per capita (PPP, the `diagnostics.json` income series, n 51),
reported and not used to decide. Values are the measurement-model point
estimates (a latent scale centred near 0) unless the name ends `_osp`. r with
the electoral democracy index (`v2x_polyarchy`) is printed beside the regime
test, because a row that reads only regime is not reading the dimension.

### What separates a V-Dem code from the perception D23 retired

V-Dem variables are expert judgements. So were the WGI composites in effect,
and several V-Dem items are themselves WGI inputs: the 2025 WGI methodology
lists V-Dem's liberal component index (`v2x_liberal`) under Rule of Law and its
corruption index (`v2x_corr`) under Control of Corruption. A candidate passes
this triage only if it asks experts about the frequency of one act whose
instances are public, so a coder can be checked against the record. It fails
if it asks for a characterisation of how clean, impartial or capable a
country's institutions are, because that is the reputation D23 retired,
whatever the coding method. Hidden acts (bribes, kickbacks) fail by this rule:
no coder observes them, so the code is a reputation for them.

## Verdicts

| Variable | Target | Verdict | One line |
| --- | --- | --- | --- |
| `v2jucomp` compliance with judiciary | Trust, institutional (new row) | **score** | A public act of the state; autocracies read low, not high; max r 0.36 with a Trust row |
| `v2juhccomp` compliance with high court | Trust, institutional | dead | r 0.95 with `v2jucomp`; the lower courts are the ones strangers use |
| `v2clrspct` rigorous and impartial administration | Trust, institutional | dead | The best construct match, but a characterisation of the whole administration: WGI's kind; closed autocracies read above electoral ones |
| `v2clacjstm` access to justice | Trust, institutional | dead | A civil-liberty judgement about fair trials, not a rule holding; r 0.80 with cspart |
| `v2cltrnslw` transparent laws, predictable enforcement | Trust, institutional | dead | Characterisation of the legal system; WGI rule of law construct |
| `v2exbribe` executive bribery | Trust | dead | Hidden act, so reputation; D23's corruption construct; ARE ranks 12th |
| `v2excrptps` public-sector corrupt exchanges | Trust | dead | Hidden act; `bribery_incidence` already observes the experience; SGP 1st, ARE 19th |
| `v2jucorrdc` judicial corruption | Trust | dead | Hidden act; same reasoning |
| `v2lgotovst` oversight by comptroller, ombudsman, prosecutor | Trust, institutional | dead | A counterfactual likelihood ("how likely would…"), not an observed act; model convergence issues |
| `v2exrescon` executive respects constitution | Trust | dead | Characterisation; ARE and SGP rank 10th and 11th |
| `v2juncind` lower court independence | Trust | dead | Independence is a condition of compliance, not the act; r 0.90 with `v2jucomp` |
| `v2jureform` judicial reform this year | Trust | dead | An annual change event, not a level; most countries sit at "no change" |
| `v2dlconslt` range of consultation | Coordination | dead | Closest Coordination match, but a deliberative-democracy item; closed autocracies (0.47) read above electoral ones (-0.32), Vietnam equals Uruguay |
| `v2dlengage` engaged society | Coordination | dead | Public deliberation; r 0.83 with cspart, 0.90 with `v2dlconslt` |
| `v2dlencmps` particularistic or public goods | Coordination | dead | Allocation of spending, not organising; closed autocracies equal electoral democracies |
| `v2dlcommon` common-good justification | Coordination / Shared purpose | dead | The A13 trap in its purest form: Cuba 2nd of 53 |
| `v2stcritrecadm` merit appointment | Coordination | dead | A property of the bureaucracy, a condition; SGP 1st |
| `v2strenadm` bureaucratic remuneration | Coordination | dead | A condition; little spread (sd 0.52) |
| `v2stfisccap` fiscal source of revenue | Coordination | dead | A condition (how the state is financed); ARE 51st reads rent, not coordination |
| `v2cscnsult` CSO consultation | Coordination | dead | Feeds `v2x_cspart`; r 0.90 with it |
| `v2csprtcpt` CSO participatory environment | Coordination | dead | Feeds `v2x_cspart`; r 0.88 with it |

Nothing in V-Dem answers `institutional_trust` (public confidence),
`court_case_clearance` (throughput), `university_industry_collaboration`,
`public_private_collaboration` or cross-agency delivery. The roadmap's earlier
note stands.

## Construct paragraphs

### Trust

Trust asks how much cooperation is possible beyond immediate personal
networks; its high end is strangers cooperating on the strength of the rules.
Its institutional family (D57) asks whether people can rely on courts,
government and the civil service. The gaps are `institutional_trust`
(confidence, a survey construct V-Dem does not hold) and `court_case_clearance`
(throughput, failed at 13 of 53).

**`v2jucomp`, compliance with judiciary (3.8.1.11).** "How often would you say
the government complies with important decisions by other courts with which it
disagrees?" 0 never to 4 always, high court excluded. What it observes: whether
the rules bind the strongest party. A ruling a stranger obtains is worth
something only if the state obeys the rulings it loses, and that is the
precondition for every contract and claim the Trust high end describes. It is a
behaviour of the state: the act (a ruling against the government, and what the
government then does) is public, so the code is a frequency of observed
events, not a reputation for clean rules. It does not fill either gap: it is
neither confidence nor throughput. New row, institutional family. Two cautions
written before reading values: it can be vacuous where courts never rule
against the state, which is the A13 shape (calm because nothing is contested);
and it is one of five inputs to V-Dem's judicial constraints index, which
reaches WGI rule of law through the liberal component.

**`v2juhccomp`, compliance with high court (3.8.1.10).** The same act at the
apex court. Constitutional politics, rarer and more visible, further from the
cases strangers bring. Kept only as a redundancy test for `v2jucomp`.

**`v2clrspct`, rigorous and impartial public administration (3.9.2.2).** "Are
public officials rigorous and impartial in the performance of their duties?"
The construct is the closest to Trust's institutional question (being treated
by rule rather than by connection is exactly what a stranger needs), but the
item asks the coder to characterise the whole administration, and its
clarification describes a state of affairs ("arbitrariness and biases …
nepotism, cronyism") rather than an act. That is the reputation D23 retired,
coded by experts. Dead on construct before values.

**`v2clacjstm` / `v2clacjstw`, access to justice (3.9.2.3-4).** Whether people
can bring cases safely and get fair trials. A civil-liberty judgement; overlaps
`v2clrspct`. Dead on construct.

**`v2cltrnslw`, transparent laws with predictable enforcement.** A
characterisation of the legal order. Dead on construct.

**`v2exbribe`, `v2excrptps`, `v2jucorrdc`.** Executive, public-sector and
judicial bribery. Bribes are hidden; a coder answers from scandals, prosecutions
and reputation. This is the corruption reputation D23 retired as control of
corruption, and `v2x_corr`, built from these, is a WGI input. The experience
of being asked for a bribe is already scored (`bribery_incidence`, D123). Dead
on construct.

**`v2lgotovst`, executive oversight (3.6.1.5).** How likely a comptroller,
prosecutor or ombudsman would investigate an executive's illegal act. A
counterfactual likelihood, not an observed frequency; the codebook flags
convergence problems. Dead on construct.

**`v2exrescon`, `v2juncind`.** Respect for the constitution and court
independence: characterisations and conditions of the act `v2jucomp` codes.
Dead.

**`v2jureform`.** Whether the judiciary's powers changed this year: an event
flag, not a level. Dead.

### Coordination

Coordination asks how effectively independent actors can organise around
shared objectives. Scored rows: `time_to_export` (2019), `budget_execution_fidelity`
and `civil_society_strength` (`v2x_cspart`). Gaps: university-industry and
public-private collaboration; cross-agency delivery has no source.

**`v2dlconslt`, range of consultation (3.7.1.4).** How wide elite consultation
is when policy changes are considered, from the leader alone to all parties and
sectors of society and business. A behaviour of the state, and public in part
(councils, hearings). But it observes who is heard while policy is made, not
whether independent actors then act together, and it is a component of the
deliberative democracy index, so it is expected to read regime. Hypothesis:
check at best.

**`v2dlengage`, engaged society.** Breadth of public deliberation. Speech, not
organisation, and a cousin of `v2x_cspart`. Dead on construct.

**`v2dlencmps`, particularistic or public goods.** Profile of spending.
Allocation, not organisation. Dead on construct.

**`v2dlcommon`, common-good justification.** Whether elites justify policy by
the common good. Rhetoric, and a regime that speaks only of the common good
reads high. Dead on construct (tested anyway, as the cleanest A13 example).

**`v2stcritrecadm`, `v2strenadm`, `v2stfisccap`.** Merit appointment, salaried
administrators, revenue base. Properties of the state apparatus: what a state
has to work with, which D122 calls a condition. The model has no expert-coded
conditions and this sweep does not start one. Dead for scoring.

**`v2cscnsult`, `v2csprtcpt`.** Inputs to `v2x_cspart`, already scored.
Redundancy test only.

## Values (2024, 53 of 53 for every variable)

Regime means are on the variable's own scale. Trust rows: contract enforcement
(CE), bribery incidence (BI), interpersonal trust (IT, n 37). Coordination
rows: time to export (TE), budget execution (BE), civil society (CS).

| Variable | sd | Closed / el. aut / el. dem / lib. dem | r polyarchy | r Trust rows CE / BI / IT | r Coord rows TE / BE / CS | r log GDP |
| --- | ---: | --- | ---: | --- | --- | ---: |
| `v2jucomp_osp` (0-4) | 1.11 | 0.72 / 1.67 / 2.75 / 3.53 | 0.88 | -0.12 / 0.36 / 0.31 | 0.31 / 0.29 / 0.82 | 0.53 |
| `v2jucomp` | 1.73 | -1.91 / -0.67 / 0.94 / 2.35 | 0.88 | -0.08 / 0.38 / 0.35 | 0.33 / 0.32 / 0.81 | 0.55 |
| `v2juhccomp` | 1.69 | -1.83 / -0.61 / 1.13 / 2.34 | 0.87 | -0.11 / 0.29 / 0.31 | 0.31 / 0.24 / 0.83 | 0.49 |
| `v2clrspct` | 1.64 | -0.84 / -0.93 / 0.68 / 2.40 | 0.81 | 0.14 / 0.45 / 0.60 | 0.45 / 0.33 / 0.68 | 0.74 |
| `v2clacjstm` | 1.50 | -0.92 / -0.48 / 0.74 / 2.55 | 0.83 | 0.15 / 0.40 / 0.59 | 0.35 / 0.31 / 0.80 | 0.69 |
| `v2cltrnslw` | 1.57 | -0.64 / -0.70 / 0.69 / 2.57 | 0.81 | 0.11 / 0.43 / 0.49 | 0.38 / 0.32 / 0.74 | 0.67 |
| `v2exbribe` | 1.57 | 0.17 / -0.88 / 0.26 / 2.10 | 0.66 | 0.17 / 0.48 / 0.63 | 0.58 / 0.32 / 0.55 | 0.77 |
| `v2excrptps` | 1.54 | -0.31 / -0.66 / 0.21 / 1.88 | 0.65 | 0.26 / 0.47 / 0.64 | 0.62 / 0.38 / 0.52 | 0.81 |
| `v2jucorrdc` | 1.59 | -0.16 / -0.57 / 0.32 / 2.19 | 0.66 | 0.21 / 0.42 / 0.57 | 0.49 / 0.42 / 0.50 | 0.75 |
| `v2lgotovst` | 1.41 | -0.28 / -0.57 / 1.15 / 2.23 | 0.81 | 0.00 / 0.21 / 0.43 | 0.30 / 0.31 / 0.78 | 0.50 |
| `v2exrescon` | 1.30 | 0.11 / -0.56 / 0.75 / 1.77 | 0.68 | -0.02 / 0.24 / 0.51 | 0.45 / 0.28 / 0.65 | 0.68 |
| `v2juncind` | 1.53 | -1.20 / -0.68 / 1.18 / 2.31 | 0.88 | -0.07 / 0.30 / 0.34 | 0.26 / 0.25 / 0.79 | 0.51 |
| `v2jureform` | 0.88 | 0.10 / -0.95 / -0.13 / 0.24 | 0.37 | 0.07 / -0.08 / 0.37 | 0.02 / 0.06 / 0.52 | 0.22 |
| `v2dlconslt` | 1.32 | 0.47 / -0.32 / 0.96 / 2.31 | 0.72 | 0.11 / 0.24 / 0.45 | 0.39 / 0.36 / 0.73 | 0.49 |
| `v2dlengage` | 1.28 | -0.09 / -0.34 / 1.20 / 2.38 | 0.85 | 0.03 / 0.28 / 0.37 | 0.36 / 0.31 / 0.83 | 0.48 |
| `v2dlencmps` | 1.09 | 0.58 / -0.02 / 0.57 / 1.78 | 0.58 | 0.14 / 0.25 / 0.52 | 0.44 / 0.53 / 0.55 | 0.51 |
| `v2dlcommon` | 0.95 | 0.52 / 0.34 / 0.79 / 1.39 | 0.49 | 0.09 / 0.24 / 0.32 | 0.46 / 0.33 / 0.45 | 0.37 |
| `v2stcritrecadm` | 1.26 | 0.19 / -0.09 / 0.64 / 1.87 | 0.64 | 0.18 / 0.35 / 0.52 | 0.52 / 0.24 / 0.61 | 0.74 |
| `v2strenadm` | 0.52 | 1.07 / 1.11 / 1.21 / 1.39 | 0.29 | 0.06 / 0.41 / 0.53 | 0.29 / 0.17 / 0.19 | 0.41 |
| `v2stfisccap` | 0.98 | 0.50 / 1.00 / 1.83 / 2.58 | 0.76 | -0.19 / 0.34 / 0.58 | 0.39 / 0.24 / 0.69 | 0.59 |
| `v2cscnsult` | 1.40 | -0.89 / -0.21 / 0.88 / 2.33 | 0.82 | 0.03 / 0.30 / 0.44 | 0.33 / 0.31 / **0.90** | 0.51 |
| `v2csprtcpt` | 1.09 | -0.66 / 0.47 / 1.35 / 1.79 | 0.72 | -0.07 / 0.02 / 0.17 | 0.23 / 0.01 / **0.88** | 0.28 |

Placement of the regimes the A13 test watches (rank of 53, higher is better):

| Variable | ARE | CHN | VNM | SGP | RWA | BRA |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `v2jucomp` | 48 | 51 | 44 | 12 | 43 | 3 |
| `v2clrspct` | 27 | 40 | 42 | 5 | 35 | 21 |
| `v2exbribe` | 12 | 41 | 25 | 14 | 34 | 37 |
| `v2excrptps` | 19 | 35 | 31 | 1 | 22 | 27 |
| `v2jucorrdc` | 16 | 42 | 45 | 8 | 25 | 26 |
| `v2exrescon` | 11 | 27 | 26 | 10 | 47 | 29 |
| `v2dlconslt` | 39 | 44 | 24 | 22 | 40 | 3 |
| `v2dlencmps` | 38 | 18 | 11 | 25 | 20 | 27 |
| `v2dlcommon` | 49 | 39 | 45 | 4 | 12 | 5 |
| `v2stcritrecadm` | 19 | 36 | 37 | 1 | 42 | 22 |

## The A13 test, per candidate

The trap: a closed or electoral autocracy reads well because there is nothing
to measure (no camps, no contested rulings, no visible corruption), not
because the capability is present.

- **`v2jucomp`: passes.** Closed autocracies average 0.72 on the 0-4 scale and
  electoral autocracies 1.67, against 2.75 and 3.53 for the democracies. The
  vacuous reading written down before the values (no contested ruling, so
  nothing to disobey) does not occur: coders score China 0.21, the UAE 0.59,
  Vietnam 1.25. Singapore (3.54, 12th) is the one autocracy that reads high,
  and is the likeliest case of compliance with few contested rulings; it is in
  the registry note. Scored, the row moves Trust against the trap the
  dimension already carries: China falls from 88.7 to 67.5, Rwanda from 78.9
  to 63.9, El Salvador from 69.8 to 51.1, Nicaragua from 51.7 to 38.8. The
  bribery row's reticence (China 0.14% of firms asked, D123) had been lifting
  exactly these countries.
- **`v2clrspct`: fails mildly.** Closed autocracies (-0.84) read above
  electoral autocracies (-0.93); Singapore is 5th, the UAE 27th.
- **Corruption items (`v2exbribe`, `v2excrptps`, `v2jucorrdc`): fail.**
  Closed autocracies read above electoral autocracies on all three. The UAE is 12th of 53 on executive
  bribery and Singapore 1st on public-sector exchanges. Quiet corruption reads
  as no corruption.
- **`v2exrescon`: fails.** The UAE 11th, Singapore 10th: a constitution that
  constrains little is easy to respect.
- **`v2dlconslt`: fails.** Closed autocracies (0.47) above electoral
  autocracies (-0.32). Vietnam's consultation of its mass organisations reads
  1.33, level with Uruguay (1.34), whose tripartite wage councils are a standing
  national consultation of labour and business. A9 again: a small state
  reads low on an expert judgement of scale.
- **`v2dlencmps`: fails.** Closed autocracies equal electoral democracies;
  Vietnam 11th, China 18th.
- **`v2dlcommon`: fails outright.** Cuba 2nd of 53, Singapore 4th.
- **`v2stcritrecadm`: fails mildly**, and was dead on construct: Singapore 1st,
  the UAE 19th.
- **`v2lgotovst`, `v2juncind`, `v2cscnsult`, `v2csprtcpt`, `v2dlengage`:**
  autocracies read low. These pass A13 and fail on construct or redundancy.

## The scored row, measured

`court_compliance`, wired as `v2jucomp_osp` (the same estimate on the codebook's
0 to 4 scale, so a reader can read the value against the response labels).
53 of 53, 2024. Direction higher is better, class O (whether the rule holds),
tier `expert_panel`.

| | Before (7.3.0) | After |
| --- | ---: | ---: |
| Trust mean confidence | 0.311 | 0.347 |
| Trust observed rows (mean) | 2.6 | 3.6 |
| Trust scored countries | 50 | 52 (ARE, HTI added; CUB still below the floor) |
| Trust r with log GDP | 0.571 (n 49) | 0.671 (n 51) |
| Trust institutional family | 2 of 4 observed | 3 of 5 observed |
| Countries scored on one family | 13 | 15 |
| Coordination | unchanged: 0.362, 52 scored, r 0.563 | |
| Guardrail (mean confidence vs log GDP) | 0.298 | 0.298 |
| Brazil Trust | 41.4, confidence 0.370, 3 rows | 55.9, confidence 0.396, 4 rows |
| Brazil Coordination | 86.4, confidence 0.373 | unchanged |

Reported as findings, not tests. The row's own r with log GDP is 0.533, below
its 0.70 flag; its wealth-attribution delta is 0.155 (Trust's r without it is
0.516), the largest in Trust, next to bribery incidence's 0.162 when it was
added. Its largest r with a Trust row is 0.36 (bribery incidence); no
redundant pair is flagged. Trust's pair with Anticipation rises to 0.735 and
with Learning to 0.699, under the duplicate threshold. The guardrail does not
move because the row covers every country: confidence rises everywhere, a
little more where coverage was thinnest. Trust still misses O1 (0.347 < 0.40).

The row reads democracy (r 0.88 with the electoral democracy index). That is
the cost of the construct, not an accident of it: a state that does not obey
its courts is one where rules do not bind the powerful, and in the frame those
are the autocracies. It also means Trust and the existing V-Dem Coordination
row now share a source and some of a factor (r 0.82 between `court_compliance`
and `civil_society_strength`, across dimensions).
