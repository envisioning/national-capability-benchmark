# Joint EVS/WVS sweep: behavioural items beyond A165

Task: Q6 of the research roadmap (O1: Shared purpose, Trust; notes for
Coordination)

Track: source-backed measurement, desk triage

Date: 2026-10-02. Dataset 7.7.0. Source: the release the adapter already pins,
Joint EVS/WVS 2017-2022 v5.0.0 (2024-06-24), Variable Report results by
country weighted by `gwght` (`ZA7505_cdb_Tables.pdf`,
[results](https://access.gesis.org/dbk/69549)), and the Variable Report
documentation ([codebook](https://access.gesis.org/dbk/69548), 382 pages).

Outcome: one item recommended as an indicator, G007_34_B (trust in people
met for the first time) for the declared Trust gap
`willingness_to_cooperate_strangers`. One item, E025 (signed a petition), is
offered as an optional check beside Shared purpose. Nothing in the release
fills `volunteering_rate`: the joint file carries no volunteering or unpaid
work item. G006 (national pride), the only item aimed at `national_belonging`,
fails the regime test. The remaining membership items mostly duplicate
`civic_participation`. Nothing is wired; the registry and the adapter are
unchanged.

## Access

Both PDFs downloaded without an account on 2026-10-02 (HTTP 200 from
`access.gesis.org`, 3.66 MB and 1.28 MB). The aggregate tables are enough for
every item below. No respondent-level microdata was downloaded or needed,
except for the two things the aggregate tables cannot do, both noted where
they arise: pooling Germany, the United Kingdom and the Netherlands (D64), and
separating active from inactive membership.

## Method

D118 order. The construct column was written from the codebook (question
text, answer scale, which programme asked it) before any country value was
read. Then, from the results tables parsed with the adapter's own country
mapping and hold rule (one source row emitted, two rows held):

1. **Coverage** against all 53 registry countries in the pinned window
   (fieldwork 2017 to 2023, release year 2022).
2. **Harmonisation.** Whether EVS5 and WVS7 asked the same question in the
   same format. Measured two ways: the mean of the eight EVS-surveyed frame
   countries against the 29 WVS ones (confounded by region and income), and
   the cleaner test, the WVS minus EVS difference inside the ten countries
   the release surveyed under both programmes (ARM, CZE, DEU, GBR, NLD, ROU,
   RUS, SRB, SVK, UKR; only DEU, GBR, NLD are in the frame).
3. **A13 regime test.** Mean by V-Dem 2024 Regimes of the World, using the
   grouping of the 37 emitted countries in
   `docs/research/trust/EVS-WVS-INSTITUTIONAL-TRUST.md`: closed autocracies
   CHN VNM; electoral autocracies ETH IDN IND NIC PHL SGP THA TUR VEN;
   electoral democracies ARG BOL BRA CAN COL ECU GTM KEN KOR MEX MYS NGA PER
   POL PRT; liberal democracies AUS CHE CHL ESP EST FIN FRA JPN SWE URY USA.
   An item fails when the autocracies read above the democracies on a
   construct where that cannot be the capability.
4. **Redundancy** with existing rows and checks, Pearson r on raw values:
   `civic_participation` (A080_01), `interpersonal_trust` (A165),
   `civil_society_strength` (Coordination, `v2x_cspart`), and the checks
   `voter_turnout` and `political_polarization`. The model's redundancy flag
   is |r| of 0.85 or more (`REDUNDANCY_THRESHOLD`).
5. **r with log GDP per capita** last, from the `diagnostics.json` income
   series, n 36 (Venezuela has no GDP figure). Printed, deciding nothing.

The statistic is the published share in one answer column unless the table
says otherwise. Where a sum of two published columns is shown it is marked
"sum", because the adapter's contract is to store a number the publisher
prints (see the recommendation).

## Coverage

Every item below shares the A165 frame unless noted: 40 of 53 benchmark
countries in the release, 37 emitted, 3 held (DEU, GBR, NLD), 13 absent (CRI,
IRL, ISR, ZAF, ARE, RWA, PRY, PAN, HND, SLV, DOM, CUB, HTI). That is under 40,
so by the triage rule it needs a reason; the reason is the one already
accepted for A165, A173 and A080_01, and a new item from the same release
adds no new country.

Exceptions:

- E263 and E264 (voting): 36 emitted. WVS7 did not ask China.
- E012 (willingness to fight): 38 emitted, because WVS7 did not ask Great
  Britain and the hold rule then finds a single British row and emits it.
  Any item wired with an EVS-only or WVS-only gap in a dual-programme country
  would silently break the D64 hold this way; the adapter would need an
  explicit hold list.

## Verdicts

Statistic: `M` share mentioned (belongs, EVS; active or inactive member, WVS),
`D` have done, `A` always, `VP` very proud, `S` sum of trust completely and
somewhat. Regime means are closed autocracy / electoral autocracy / electoral
democracy / liberal democracy. Format: frame mean EVS vs WVS, then median WVS
minus EVS inside the ten dual-programme countries.

| Item | Target | Construct | n | Range | Regime means | Format | Max r with a row | r log GDP | Verdict |
| --- | --- | --- | ---: | --- | --- | --- | --- | ---: | --- |
| **G007_34_B** trust people met for the first time (S) | Trust, gap `willingness_to_cooperate_strangers` | P, the gap's own definition | 37 | 7.8 to 73.9 | 22 / 24 / 22 / 40 | 45.0 vs 22.9; pairs +2.2 | 0.66 A165 | 0.34 | **indicator** |
| G007_36_B trust people of another nationality (S) | Trust, same gap | P, out-group attitude as much as strangers | 37 | 14.2 to 90.2 | 26 / 29 / 34 / 62 | 66.9 vs 33.5; pairs +1.4 | 0.67 A165 | 0.61 | hold: second half of the gap, wire only with 34 |
| G007_35_B trust people of another religion | Trust | P, religious out-group | 37 | not read | | | | | dead: a tolerance item, not strangers |
| G007_18_B trust your neighbourhood (S) | Trust | P, in-group | 37 | 32.5 to 91.4 | 88 / 71 / 59 / 75 | pairs +0.5 | 0.67 A165 | 0.39 | dead: the near pole the dimension contrasts with; closed autocracies top |
| **E025** signed a petition (D) | Shared purpose (Coordination note) | C, collective political act | 37 | 3.9 to 75.5 | 5 / 12 / 24 / 50 | 45.6 vs 22.6; pairs -0.7 | 0.60 A165, 0.57 cspart | 0.62 | **optional check** |
| E026 joined a boycott (D) | Shared purpose | C, consumer-political act | 37 | 0.7 to 26.4 | 2 / 5 / 7 / 12 | pairs +1.0 | 0.50 A165 | 0.38 | dead: little spread below the top decile, half the countries under 7% |
| E027 attended a lawful demonstration (D) | Shared purpose, Coordination | C, acting together in public | 37 | 0.4 to 40.8 | 1 / 11 / 15 / 21 | pairs +2.6 | 0.55 cspart | 0.08 | dead: direction undecidable (FRA, ESP top on grievance); reads civic space |
| E028 joined an unofficial strike (D) | | C, extra-legal act | 37 | 0.3 to 20.7 | | pairs +3.6 | | -0.18 | dead on construct: direction undecidable |
| E264 vote in national elections (A) | Shared purpose | C self-reported | 36 | 22.2 to 90.7 | 22 / 63 / 67 / 65 | pairs +3.5, ARM +24.9 | 0.30 turnout check | 0.15 | reject: the turnout check's construct (D129), self-reported, compulsory voting tops it |
| E263 vote in local elections (A) | Shared purpose | C self-reported | 36 | 8.4 to 87.0 | 21 / 61 / 65 / 60 | pairs +3.7 | 0.31 turnout check | -0.02 | reject: same reasons, plus local elections differ by country |
| G006 how proud of nationality (VP) | Shared purpose, gap `national_belonging` | P | 37 | 10.0 to 89.1 | 51 / 75 / 59 / 47 | pairs -3.4, ARM +36.2 | -0.48 A165 | -0.61 | reject: fails A13; registry note already warns pride is not the capacity |
| E012 willing to fight for country | Shared purpose | P, hypothetical | 38 | 13.2 to 96.4 | 93 / 72 / 65 / 55 | pairs -0.7 | 0.39 turnout check | -0.31 | dead: hypothetical and fails A13 |
| A065 member religious (M) | Shared purpose | C | 37 | 3.6 to 90.9 | 9 / 48 / 50 / 26 | 15.6 vs 47.1; pairs +8.7 | 0.72 civic | -0.65 | dead: reads religiosity (D128 already excluded it) |
| A066 member education, arts, culture (M) | Shared purpose | C, leisure | 37 | 2.1 to 52.3 | 7 / 24 / 24 / 19 | pairs +2.4 | 0.88 civic | -0.43 | dead: redundant with `civic_participation` |
| A067 member labour union (M) | Shared purpose | C, interest group | 37 | 1.3 to 41.3 | 7 / 18 / 17 / 18 | pairs +3.5 | 0.74 civic | -0.21 | dead: acts for members, not strangers; legal regime of unions decides it |
| A068 member political party (M) | Shared purpose | C, democratic channel | 37 | 0.5 to 48.6 | 7 / 16 / 15 / 12 | 3.9 vs 16.8; pairs +3.8 | 0.75 civic | -0.33 | dead: the channel A5 retired; dominant-party membership |
| A071 member environment, conservation (M) | Shared purpose | C, public good | 37 | 1.1 to 37.4 | 4 / 20 / 15 / 11 | pairs +2.7 | 0.92 civic | -0.51 | dead: redundant with `civic_participation` |
| A072 member professional association (M) | Shared purpose, Coordination | C, interest group | 37 | 0.2 to 34.0 | 4 / 18 / 17 / 14 | pairs +2.7 | 0.93 civic | -0.26 | dead: redundant; occupational stock |
| A074 member sports, recreation (M) | Shared purpose | C, leisure | 37 | 2.6 to 56.2 | 7 / 26 / 29 / 26 | pairs +6.1 | 0.83 civic | -0.33 | dead: leisure, and near-redundant |
| A078 member consumer group (M) | Shared purpose | C, interest group | 37 | 0.1 to 32.8 | 7 / 16 / 13 / 6 | 2.9 vs 13.8; pairs +3.5 | 0.84 civic | -0.55 | dead: interest group, near-redundant |
| A079 member other groups (M) | | C, residual | 37 | 0.2 to 37.8 | | pairs +2.2 | 0.67 civic | -0.32 | dead: no construct |
| A080_02 member self-help, mutual aid (M) | Shared purpose | C, mutual aid | 37 | 0.3 to 58.7 | 7 / 19 / 19 / 7 | 2.4 vs 18.4; pairs +1.3 | 0.74 civic | -0.59 | dead: acts for one's own network; largest EVS/WVS gap in the battery |
| E023 interest in politics | | P, attitude | 37 | | | | 0.51 A165 | 0.23 | dead on construct |
| F114A to F117 justifiable: benefits fraud, fare dodging, tax cheating, bribe | Trust | P, stated norm | | not read | | | | | dead on construct: a stated attitude, social desirability; not read |

Not in the release at all, checked against the codebook index: any
volunteering or unpaid work item, any "active member" category, any count of
memberships, any donation item, any "worked with others in the community"
item. EVS 2017 and WVS7 do not share one, so the joint file has none.

## Construct paragraphs

### Trust

Trust asks how much cooperation is possible beyond immediate personal
networks. Its social family holds `interpersonal_trust` (A165) and the gap
`willingness_to_cooperate_strangers`, declared as "reported trust in people
met for the first time and in people of another nationality". The roadmap's
TRUST-1 package names it as the second target, "only if the same source and
harmonisation process support it".

**G007_34_B, trust in people you meet for the first time.** EVS5 Q8D, WVS7
Q61, one question text in the codebook for both programmes: "Could you tell me
for each whether you trust people from this group completely, somewhat, not
very much or not at all?" Four points, no programme-specific wording, no
recode note. What it observes: whether a respondent extends trust to someone
with no network tie, which is the radius the dimension's high end describes.
A165 asks about "most people", an abstraction respondents fill with their own
reference group; this item names the stranger. It is a perception, class `P`,
the same class and source as A165, so it adds a second reading of the social
family rather than a behaviour. Written before values: it will correlate with
A165, and the question is whether it is redundant with it.

**G007_36_B, people of another nationality.** Same battery and format. It
reads the stranger who is also an out-group, so it carries attitudes to
immigrants and foreigners as well as trust. The gap's definition names both
items; one is enough to fill it, and the first-time item is the cleaner
construct.

**G007_18_B, G007_33_B (neighbourhood, people known personally).** The
in-group pole. Useful only as the denominator of a radius ("trust in
strangers relative to trust in neighbours"), which is a computed construct
the release does not publish. Dead.

**F114A to F117, justifiability of benefits fraud, fare dodging, tax
cheating, accepting a bribe.** 1 to 10 scales of stated norms. A respondent
saying cheating is never justifiable is not observed not cheating, and the
answer carries the strongest social-desirability pressure in the battery.
Dead on construct; values not read.

### Shared purpose

Shared purpose asks to what extent people can imagine themselves as
participants in a common project. The gaps are `volunteering_rate` and
`national_belonging`; `civic_participation` is filled from A080_01 (D128);
`voter_turnout` and `political_polarization` are checks (D129, D121).

**Membership battery, A065 to A080_02.** EVS5 shows a card and asks which
organisations the respondent belongs to. WVS7 reads each type aloud and asks
active member, inactive member or not a member; the joint codebook recodes
both WVS answers to 1 (p. 28, and per item from p. 115). So active and
passive membership is **not harmonised and cannot be**: EVS5 never asked for
activity. An active-membership series is possible only from WVS7 microdata
for the 29 WVS countries in the frame, with the eight EVS countries missing,
which fails the ceiling. Each type was read for whether its purpose is acting
for people beyond the member's own network before values: humanitarian and
charitable (already wired) and environmental or conservation pass; religious
reads religiosity; unions, professional and consumer groups are interest
groups acting for members; parties are the democratic channel A5 retired;
sports, culture and self-help are leisure or mutual aid; "other" has no
construct. Environmental membership is the one survivor on construct and
correlates 0.92 with `civic_participation` across the 37: the battery shares
a common joiner factor (every type correlates 0.67 to 0.93 with A080_01),
which is partly the WVS item-by-item format (every type reads higher in WVS
countries in the frame, and higher in WVS than in EVS inside seven to nine
of the ten dual-programme pairs). A second membership row would double-count it.

**Political action, E025 to E028.** Identical card in both programmes (EVS5
Q30A-D, WVS7 Q209-212): "whether you have actually done any of these things,
whether you might do it or would never". "Have done" is a reported behaviour,
lifetime and not recent. Signing a petition is the most common collective act
a citizen takes with strangers toward a shared claim; a boycott is a consumer
act; a lawful demonstration is physically acting together in public; an
unofficial strike is extra-legal. Written before values: all four read the
democratic channel and civic space (the A5 objection that retired
`voice_and_accountability`), and the direction of protest is undecidable for
Shared purpose (participation in a common project, or a sign that the project
has failed people). The harmonisation is the best in the release: the paired
median difference is under 1 point for petitions.

**Voting, E263 and E264.** "When elections take place, do you vote always,
usually or never?" Self-reported, so over-reported, and the construct is the
same democratic channel the `voter_turnout` check already publishes from
official counts and declines to score (D129). Compulsory-voting countries
(URY, ECU, BOL, PER, AUS, ARG) are six of the top eight. China not asked.

**G006, national pride.** "How proud are you to be a [COUNTRY] citizen?" The
only item aimed at `national_belonging`. The registry note already says high
pride is not the capacity for collective action. Written before values: the
A13 trap (pride is what an autocracy cultivates and what a respondent finds
safe to say).

**E012, willingness to fight for the country.** Hypothetical, so not a
behaviour; the same A13 trap as pride.

### Coordination

Coordination asks whether independent actors organise around an objective.
Nothing in the release observes organisations coordinating; every item is an
individual respondent. E025 and E027 are the closest, as individuals acting
together, and they correlate 0.57 and 0.55 with `civil_society_strength`
(`v2x_cspart`), which already reads the participatory environment. No
Coordination candidate. The V-Dem sweep reached the same conclusion from the
other side (D131).

## What the values showed

**G007_34_B passes.** Sum of trust completely and somewhat, top to bottom:
SWE 73.9, FIN 60.1, CHE 52.5, CAN 49.5, ETH 47.8, AUS 47.5, ESP 43.8, USA
39.4 ... BRA 22.7 (22nd of 37) ... BOL 10.5, JPN 10.4, IDN 9.3, PER 9.0, ECU
7.8. Autocracies do not inflate it: closed 22.2, electoral autocracies 23.7,
against 21.5 and 40.4 for the democracies; China 13.4 and Vietnam 30.9 sit
inside the range of the electoral democracies. The format effect inside the
dual-programme pairs is small (median +2.2 points; the Netherlands -11.1 is
the outlier) against a spread of 66 points, though the EVS-surveyed frame
countries (all European) average twice the WVS ones, which is region. r with
A165 0.66, below the 0.85 redundancy flag, so it carries information A165 does
not. The rank movers are the radius the dimension asks about: China falls 28
places (63.5% say most people can be trusted, 13.4% trust a person met for
the first time), Japan 23, Singapore 16, South Korea 14 and Malaysia 11, while
Ethiopia rises 22 places, the Philippines 17, Portugal 12 and Brazil 9. China
is the known case where "most people" is answered about one's own circle; the
first-time item does not let the respondent choose the reference group. Ethiopia's 47.8 (fifth, fieldwork
2020) is the value to check first. The single published column "trust
completely" has no usable spread (0.1 to 9.5) and the single column "do not
trust at all" correlates -0.79 with A165, so the statistic choice matters
(see the recommendation). r with log GDP 0.34 (n 36); for the not-at-all
share -0.58.

**G007_36_B** reads like G007_34_B with a stronger democracy gradient (liberal
democracies 61.6, the rest 25 to 34) and r with log GDP 0.61. It passes A13
in the safe direction but adds little to the first-time item and more income.

**E025 passes the regime test in the safe direction and fails nothing
outright.** AUS 75.5, CAN 70.2, CHE 68.4, SWE 67.8, FRA 63.7, USA 59.7, JPN
50.8, FIN 49.4, BRA 46.4 (9th) ... NGA 7.4, CHN 6.9, VNM 3.9. Closed
autocracies 5.4, electoral autocracies 12.2, electoral democracies 23.8,
liberal democracies 49.5: it reads regime in the direction the capability
would, but so steeply that much of what it reads is whether petitioning is
open. Singapore reads 15.1 (22nd), which is the A5 shape. The top three are
the three self-administered modes in the frame (Australia mail, Canada web,
the United States web and phone, Japan mail at 7th), and online petitions
count, so mode and internet access may lift them; the release cannot separate
that. r with A165 0.60 and with `civil_society_strength` 0.57: not redundant
with either, but reading the same open-society gradient. r with log GDP 0.62.

**Membership, voting, pride: confirmed dead.** The joiner factor above; the
self-reported vote does not even track official turnout (r 0.30 with the
check, n 36) and Switzerland reads 39.3 "always" where referendum frequency
makes "always" a different question; pride reads electoral autocracies 75.3
against 46.6 for liberal democracies, with the Philippines, Nicaragua and
Ethiopia at the top and South Korea (10.0) and Brazil (24.3) at the bottom.

## Recommendation

**1. Wire G007_34_B as `willingness_to_cooperate_strangers`, indicator,
Trust social family.** It fills a declared gap with the gap's own question,
in the pinned release, with one question text for both programmes, the
smallest paired format effect among the candidates, no regime inflation, and
r 0.66 with A165 (not redundant), and it corrects the one place A165 is
known to mislead: China, second of 37 on "most people", is 30th on a
stranger. It adds no country (same 37 emitted, same
three held, same 13 absent), so it raises Trust's observed rows and
confidence in the 37 and leaves the other 16 where they are; read the
guardrail (confidence against log GDP) after scoring, because the 13 absent
countries mix rich (IRL, ISR, ARE) and poor (HTI, RWA, HND).

The statistic needs a decision before the adapter line is written. The
registry declares "% expressing trust", which is the sum of two published
columns (completely plus somewhat). The adapter's contract (its docstring and
the A173 memo) is to store a number the publisher prints and never a sum of
category shares. Two options:

- **Sum, recommended.** On a four-point scale the trust/distrust split is
  the natural midpoint, not a chosen cut like 7-10 on a ten-point scale; both
  columns share the same denominator (don't know and no answer included, as
  for A080_01 and E069_17), so the sum is exact to the rounding of the
  printed figures (plus or minus 0.1). It matches the registry unit and is the
  less redundant reading (r 0.66 with A165). Needs a decision entry that
  states the sum rule and why it does not reopen the A173 refusal.
- **"Do not trust at all", published column, `lower_better`.** Keeps the
  contract, but changes the registry unit and direction, and is closer to A165
  (r -0.79).

The second half of the gap's definition, people of another nationality
(G007_36_B), should not be averaged in: one item per row, as D128 did for
membership. Narrow the registry definition to the first-time item, as D128
narrowed `civic_participation`.

**2. Optional: E025 (signed a petition) as a check beside Shared purpose.**
It is the one behavioural item in the release that observes a collective act
with strangers and is harmonised across programmes. It should not be scored:
it reads how open the channel is (closed autocracies 5.4 to liberal
democracies 49.5, Singapore 22nd), which is the A5 objection that retired
`voice_and_accountability`, and the self-administered modes sit at the top.
As a check it would say what the model looked at and declined. A check needs
a decision entry naming the failed test (A5, the democratic channel, plus the
mode effect). If the project prefers fewer checks, reject it with this
paragraph; nothing is lost from the score either way.

**Rejected, with the reason:** the other membership items (redundant with
`civic_participation` through the joiner factor; active membership cannot be
harmonised because EVS5 never asked it); E026 to E028 (spread or undecidable
direction); E263 and E264 (the construct the turnout check already declines,
self-reported, China not asked); G006 for `national_belonging` (fails A13);
E012 (hypothetical, fails A13); the F11x norms items (stated attitudes).

**Gaps this sweep closes as unfillable from this source:**
`volunteering_rate` (no item in the joint release) and `national_belonging`
(the only item fails A13). `volunteering_rate` still points at Gallup/CAF,
which fails inspectability; no other full-frame source is known.

## Reproduction

The tables come from the pinned PDF the adapter fetches. To regenerate the
figures: `pdftotext -layout` the results PDF, find each `<variable>- <heading>`
section up to `\nTOTAL`, read rows of `label  N  cells...` (`-` is 0.0), map
labels with the registry country names plus `Great Britain`, emit single rows
and hold pairs, as `parseJointEvsWvs` does. Correlations use the current
`data/observations/joint-evs-wvs.json` and `vdem-cy-core.json` values and the
`income` series in `data/out/diagnostics.json`. The parsing script was a
scratch file and is not committed.
