# Survey coverage for the set C expansion

Status: desk study, 2026-10-02. Dataset 8.2.0 on `main`, 53 countries.
Nothing in the registry, the adapters or the data has moved.

Read first: `docs/research/FRAME-EXPANSION.md` (set C, 125 countries, and the
guardrail rise from 0.27 to 0.53), D64 (the Joint EVS/WVS adapter and its hold
rule), D127, D128 and D140 (the three items added to it), D10
(inspectability), D117 and D118 (a row is chosen for what it measures; its
income correlation is reported, never used to choose it), A13 (the regime
test), and `docs/research/shared-purpose/EVS-WVS-BEHAVIOURAL-ITEMS.md` and
`docs/research/agency/EVS-WVS-ITEMS.md` for the item constructs.

## Question

Set C adds 72 countries. The four scored Joint EVS/WVS items, A165
(`interpersonal_trust`), G007_34_B (`willingness_to_cooperate_strangers`),
A173 (`perceived_control`) and A080_01 (`civic_participation`), reach 35 of
them, and almost none of the poorest. Which other social surveys carry the
same constructs for the missing countries, can they be harmonised with the
pinned release, may their country values be republished, and what would they
do to the guardrail?

## Summary

- **One source is worth wiring: Afrobarometer Round 8 (2019 to 2021), item
  Q83.** It asks A165 word for word, on the same two-option card, face to
  face. It fills `interpersonal_trust` for 17 of the 37 set C candidates that
  have no EVS/WVS row, plus South Africa in the 53. Paired against WVS 7 in
  the six countries both surveyed, it differs by a mean absolute 6.0 points
  with no consistent sign (median -2.3), which is the size of the difference
  the joint release already carries between its own EVS and WVS rows for
  A165 (5.0 points, median +0.3, ten pairs).
- **Nothing reaches the other three items for the poorest countries.**
  Afrobarometer Rounds 9 and 10 dropped Q83 and never asked a first-time
  stranger, a felt-control scale or a charitable membership. Its Round 7
  membership item is broader than A080_01 and reads 16 to 23 points higher in
  the pairs. No barometer asks A173. The four items stay one in Africa and
  zero in South and Southeast Asia outside the WVS countries.
- **Guardrail.** With Afrobarometer R8 added, set C's guardrail (mean
  confidence against log GDP per capita) moves from 0.529 to 0.509, and
  Trust's mean confidence from 0.398 to 0.410, back above O1. Adding
  Latinobarómetro for six of the 53 as well gives 0.512 and 0.415. The floor
  is about 0.46: even if all four items were observed for every set C
  country, the guardrail would be 0.459, and with no survey items anywhere it
  is 0.460. The survey gap explains about 0.07 of the 0.53; the rest comes
  from the IP office rows, the ILOSTAT row and the other thin columns. No
  survey work brings set C back to 0.27.
- **Lifting the D64 hold raises the guardrail.** Pooling the ten countries
  with separate EVS and WVS rows (seven in set C, three in the 53) adds four
  items to mostly rich European countries and moves set C to 0.599 alone, or
  0.588 with Afrobarometer. That is a finding for whoever decides D64's
  pooling question, not an argument for or against it: D118 settles a pooling
  rule on comparability.
- **Licence.** Afrobarometer data are free, under copyright, with a citation
  requirement and no stated redistribution clause; publishing derived country
  shares inside a CC BY 4.0 dataset needs a written confirmation from
  Afrobarometer. Latinobarómetro forbids redistribution and limits use to
  non-commercial research, which conflicts with `data/out` being CC BY 4.0;
  it needs permission before it can be wired.

## Method

Construct first, as D118 asks. For each candidate the questionnaire item was
read before any value: the stem, the answer card and the mode, against the
scored item's wording in the joint codebook. Then:

1. **Coverage** of the 37 set C countries with no EVS/WVS row (35 of the 72
   candidates have one, and the 53 contribute 16 more with none), from the
   survey's own country lists.
2. **Harmonisation.** Where a source shares countries with the pinned
   release, the paired-country test the trust and shared-purpose memos use:
   the difference between the two published shares inside each country both
   programmes surveyed, against the same difference between EVS and WVS rows
   inside the joint release.
3. **A13.** Means by V-Dem Regimes of the World, latest year, the grouping
   `FRAME-EXPANSION.md` uses.
4. **Licence and access**, from the publisher's own page, quoted where it
   states terms.
5. **Guardrail**, reusing `FRAME-EXPANSION.md`'s confidence calculation
   unchanged (coverage times recency times source quality per dimension, the
   mean over nine, Pearson r with log10 GDP per capita), with the new
   observations added as `academic_survey` (0.85) at their fieldwork year.

Afrobarometer values were read from the World Bank Microdata Library's
metadata for each Round 8 country file (`/api/catalog/<idno>/variable/<vid>`),
which prints **unweighted** answer counts. They are used here for the paired
test and the regime means only. A wired row would read the weighted share
from Afrobarometer's per-country summary-of-results PDFs or the merged file's
`withinwt`. Latinobarómetro values are the 2024 report's printed country
chart (whole percentages). Joint EVS/WVS values are the pinned results PDF the
adapter reads.

## Ranked table

Coverage counts set C countries that have no EVS/WVS row today (37). "Pairs"
is the paired test against the joint release.

| Rank | Source, latest wave | Item vs the scored item | Scale | Harmonisation | Set C gain (of 37) | Latest fieldwork | Licence, aggregates | A13 | Verdict |
| ---: | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| 1 | **Afrobarometer Round 8**, 34 countries | Q83 "Generally speaking, would you say that most people can be trusted or that you must be very careful in dealing with people?" = A165, same stem and card | 2 options, plus don't know | 6 pairs with WVS 7 (ETH KEN NGA ZWE TUN MAR): mean absolute 6.0, median -2.3, r 0.66, rho 0.83; EVS vs WVS inside the release: 5.0, +0.3 | 17: AGO BFA BWA CIV GHA GIN GMB LSO MLI MOZ MUS MWI NAM SDN TZA UGA ZMB; plus ZAF in the 53 and ten eight-dimension countries | 2019 to 2021; R9 and R10 dropped the item, so no successor | Free; "Afrobarometer data are protected by copyright"; citation required; redistribution not addressed | Closed autocracies 20.1, electoral autocracies 12.9, electoral democracies 10.4 (n 7, 12, 12; regime coded on the latest year, after several fieldwork-era coups) | **Recommend, fill-only, for A165** |
| 2 | **Latinobarómetro 2024**, 17 countries | "¿Diría Ud. que se puede confiar en la mayoría de las personas o que uno nunca es lo suficientemente cuidadoso en el trato con los demás?" = A165 | 2 options | 11 pairs with WVS 7: mean absolute 5.6, median +4.8, r 0.62, with fieldwork 2 to 7 years apart | 0 of 37; fills six of the 53 (CRI PRY PAN HND SLV DOM) | 2024 | Non-commercial research use; republishing the data elsewhere is prohibited | No inversion: electoral autocracies 19 (n 3, MEX SLV VEN), democracies 14 to 17 | Hold: licence, and an offset confounded with the year gap |
| 3 | Arab Barometer Wave VIII (2023-24), IX (2025-26) | Q103 = A165, same card | 2 options | Pairs available (IRQ JOR LBN MAR TUN), not computed | 0 beyond Afrobarometer: SDN is the only set C country without a WVS row it reaches (Wave VII); the rest are KWT MRT PSE, outside set C | 2024 | Free with registration; terms not printed on the download page | Not read | Hold: no set C gain. Its Q501D, volunteered unpaid time in a typical month, is a candidate for the `volunteering_rate` gap and belongs to that row's memo |
| 4 | Asian Barometer Wave 5 (2018-21), Wave 6 (2021-23) | q23 = A165 | 2 options | Pairs with WVS in most countries, not computed | 0: covers MNG and MMR, which have WVS rows; not NPL, LKA, LAO or PNG | 2022 to 2023 | Application per dataset; redistribution terms not verified | Not read | Dead for set C |
| 5 | LiTS IV (2022-23) and LiTS IV SSA and Iraq (2024), EBRD | Q4.02 A165 stem, "complete distrust" to "complete trust" | 5 points | Needs a cut on a five-point card, the choice D127 refused for A173; no published crosswalk | 1 (MDA) with the D64 hold kept; up to 7 more (ARM CZE ROU RUS SRB SVK, and GHA CIV already in rank 1) | 2024 | Free download; no terms stated on the data page | Not read | Reject on format |
| 6 | European Social Survey Round 11 | `ppltrst`, A165 stem | 0 to 10 | Mean or a chosen cut; no crosswalk to a share | 1 (BEL); CZE SVK are held duals | 2023-24 | Not verified today | Not read | Reject on format |
| 7 | Afrobarometer R9 and R10 | "How much do you trust ... other [Kenyans/Ghanaians]?" | 4 points (not at all, just a little, somewhat, a lot) | Compatriots, not a person met for the first time; no G007_34_B pair exists | 19 if read as G007_34_B | 2024-25 | As rank 1 | Not read | Reject on construct |
| 8 | Afrobarometer R7 (2016-18) | Q20B member of a "voluntary association or community group" (leader, active, inactive, not a member) | 4 categories | Any association, not humanitarian or charitable; pairs with A080_01: KEN 54.4 vs 38.4, NGA 45.9 vs 23.2, TUN 9.6 vs 9.4 | 17 if read as A080_01 | 2018 | As rank 1 | Not read | Reject on construct |
| 9 | Gallup World Poll via the World Happiness Report | "Are you satisfied or dissatisfied with your freedom to choose what you do with your life?", next to A173 | Binary | Satisfaction with freedom, not felt control; WHR now publishes only each factor's contribution, the values are Gallup's | Most | 2024 | Proprietary; D10 | Not read | Blocked by D10 |
| 10 | Global Flourishing Study waves 1 and 2 | "How many people in this country trust one another?" | 5 points | A belief about others' trust, not the respondent's | 2 (EGY, TZA) | 2023-24 | Open microdata | Not read | Dead on construct and coverage |
| 11 | WVS wave 8 (2024-26) | A165, G007, A173, A080 as in wave 7 | as WVS 7 | Same programme | 0 so far: no public release found on 2026-10-02; the first countries to field are mostly in the 53 | Fieldwork to 2026 | As the pinned release | | Watch: the release that replaces the pin |
| 12 | LAPOP AmericasBarometer | "people around here are very trustworthy ..." | 4 points | Community trust, the in-group pole | 1 (JAM) | 2023 | Not checked | | Reject on construct |
| 13 | Lloyd's Register World Risk Poll (Gallup fieldwork) | No generalised trust item; "neighbours care about you" only | | | 0 | 2025 | CC BY-SA 4.0 | | Dead: no item |
| 14 | AsiaBarometer (2003-08), Eurasia Barometer (2000s) | | | | | Too old for a 2022 frame | | | Dead on recency |

## Afrobarometer Round 8

### Construct

Q83 is the Rosenberg item A165 descends from, with the same two answers and
"don't know" left unread. The French and Portuguese versions ("On peut faire
confiance à la plupart des gens" / "Il faudrait être très méfiant") carry the
same contrast. The mode is face to face in the respondent's language, as in
WVS 7 Africa. What it observes is what A165 observes: whether a respondent
extends trust to "most people", a category the respondent fills with their own
reference group. It does not fill G007_34_B, A173 or A080_01.

### Coverage

The merged Round 8 file lists 34 countries: AGO BEN BWA BFA CPV CMR CIV SWZ
ETH GAB GMB GHA GIN KEN LSO LBR MWI MLI MUS MAR MOZ NAM NER NGA SEN SLE ZAF
SDN TZA TGO TUN UGA ZMB ZWE. Q83 is present in each of the 31 country files
the World Bank library holds separately; for Angola, Côte d'Ivoire and the
Gambia only the merged file is there, and their Q83 was not read row by row.
Fieldwork: 2019 (AGO BWA BFA CPV ETH GHA GIN KEN MWI NAM UGA), 2020 (BEN GAB
LSO LBR MLI MUS NER NGA SEN SLE TGO TUN ZMB) and 2021 (CMR CIV SWZ GMB MAR MOZ
ZAF SDN TZA ZWE).

Set C gain: 17 of the 37 countries without a row. The other twenty stay
empty: BDI COD COG GNB MDG (Africa: not in Round 8; Madagascar and
Congo-Brazzaville are in Round 9, which has no Q83), LAO LKA NPL PNG (no
current survey with the item), BEL MDA JAM TTO (scale or construct problems,
ranks 5, 6 and 12), and the seven held dual-programme countries.

### Values and the paired test

Unweighted share answering "most people can be trusted", over all answers
including don't know: 3.2 (Zimbabwe) to 28.4 (Niger), median about 13. The
whole African spread is 25 points; the frame's A165 spread is 2.1 to 73.9.

| Country | Afrobarometer R8 | Year | WVS 7 (pinned) | Year | Difference |
| --- | ---: | --- | ---: | --- | ---: |
| Ethiopia | 19.1 | 2019-20 | 11.9 | 2020 | +7.2 |
| Kenya | 3.8 | 2019 | 9.5 | 2021 | -5.8 |
| Nigeria | 7.1 | 2020 | 13.0 | 2018 | -5.9 |
| Zimbabwe | 3.2 | 2021 | 2.1 | 2020 | +1.1 |
| Tunisia | 7.5 | 2020 | 13.8 | 2019 | -6.3 |
| Morocco | 26.0 | 2021 | 16.5 | 2021 | +9.5 |

WVS years for Zimbabwe, Tunisia and Morocco are the programme's fieldwork
years and were not read from the release's year table, because none of the
three is in the 53.

The difference has no sign: three up, three down. Its size, a mean absolute
6.0 points, matches what the pinned release itself shows when one country was
surveyed by both programmes: Armenia -16.4, Czechia +15.7, Germany +5.1, Great
Britain +5.2, Netherlands -3.1, and five more within 3.1, a mean absolute 5.0.
So pooling Afrobarometer into the row adds noise of the size the row already
tolerates, without the systematic format offset D128 found for membership.
Six pairs is a small test, and the difference is large against the African
spread: a 6 point error moves a country across a quarter of the continent's
range, though only 8% of the frame's.

### A13

By V-Dem 2024-25 regime: closed autocracies read highest (20.1, n 7: Niger,
Morocco, Mali, Guinea, Sudan, Burkina Faso, Eswatini), then electoral
autocracies (12.9, n 12) and electoral democracies (10.4, n 12). The row
correlates -0.32 with log GDP per capita across the 31. This is the A13 shape,
and it is the shape A165 already has in the 53, where the two closed
autocracies (China 63.5, Vietnam 27.7) average 45.6 against 39.4 for liberal
democracies and 14.5 to 16.7 for the two middle groups. Two qualifications:
the regime code is the latest year, while Mali, Guinea, Burkina Faso and
Niger were fielded before or just after their coups; and the high Sahel
values may be a reading of the item's ambiguity ("most people" as one's own
community). The row would publish with the existing A165 caveat and the
artefact entry extended; nothing here argues for a correction.

### Treatment it would need

A decision entry of D64's kind, with four clauses:

1. **Fill rule, not an average.** The Joint EVS/WVS value is used wherever the
   release has one, held countries included. Afrobarometer fills only a
   country with no row in the pinned release. Two sources are never averaged
   for one country, so D64's hold logic is untouched.
2. **Harmonisation rule.** Accepted only for an item with A165's stem and the
   two-option card, stored as the publisher-weighted share answering "most
   people can be trusted" over all respondents including don't know and no
   answer, the denominator the EVS/WVS table prints. The paired test above is
   the evidence; the entry's overturn clause names a larger paired sample
   (WVS 8 against Afrobarometer, if a later round re-asks Q83) that shows a
   signed offset.
3. **Year.** Each value carries its own fieldwork year, not the 2022 release
   stamp, so recency ages it honestly (2019 to 2021 gives 0.75 to 0.67 today
   against 0.83 for the release). The round has no successor; the row ages
   until one appears, as the Doing Business rows do.
4. **Source label.** `academic_survey`, publisher Afrobarometer, a second
   adapter beside `joint-evs-wvs.ts` reading either the 34 summary-of-results
   PDFs or the merged R8 file with `withinwt`, never the World Bank metadata
   counts used here.

## The other three items

- **G007_34_B, trust in a person met for the first time.** No barometer asks
  it. Afrobarometer R9 and R10 ask trust in "other [nationals]" on a
  four-point card (rank 7): a compatriot is not a stranger, the card differs
  (no "completely"), and there are no pairs. Even read as a fill it moves set
  C's guardrail only to 0.555 and Trust to 0.451, so it is not worth bending
  the construct for.
- **A173, felt control over how one's life turns out.** No barometer asks it.
  The nearest is Gallup's "satisfied with your freedom to choose what you do
  with your life", which reads satisfaction with freedom rather than felt
  control and is proprietary (D10).
- **A080_01, humanitarian or charitable membership.** Afrobarometer R8 to R10
  carry no membership battery; R7 asked about "some other voluntary
  association or community group", which reads 16 and 23 points above A080_01
  in Kenya and Nigeria. Arab Barometer asks about volunteering, not
  membership. Shared purpose has no other survey row, and `volunteering_rate`
  is a gap whose candidates live in its own memo.

So in set C, Agency and Shared purpose gain nothing from any survey, and
Trust gains one social row for 17 countries.

## Guardrail under set C

Same code path as `FRAME-EXPANSION.md`, which it reproduces (0.529 for set C,
0.273 for the 53, 0.410 for the 160-country universe).

| Scenario | Guardrail r | Slope per tenfold income | Mean confidence | Trust | Agency | Shared purpose | Countries with any survey item | Item presence r with log GDP |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Set C as in the memo | 0.529 | 0.048 | 0.449 | 0.398 | 0.470 | 0.383 | 72 | 0.37 |
| + Afrobarometer R8 for A165 | 0.509 | 0.045 | 0.451 | 0.410 | 0.470 | 0.383 | 90 | 0.03 |
| + Latinobarómetro for A165 (six of the 53) | 0.532 | 0.048 | 0.450 | 0.404 | 0.470 | 0.383 | 78 | 0.38 |
| + both | 0.512 | 0.045 | 0.451 | 0.415 | 0.470 | 0.383 | 96 | 0.04 |
| + D64 pooling of the ten dual rows, four items | 0.599 | 0.055 | 0.454 | 0.414 | 0.481 | 0.394 | 82 | 0.51 |
| + both + pooling | 0.588 | 0.052 | 0.456 | 0.431 | 0.481 | 0.394 | 106 | 0.22 |
| + both + pooling + LiTS IV (rejected) | 0.588 | 0.052 | 0.456 | 0.432 | 0.481 | 0.394 | 107 | 0.23 |
| Ceiling: all four items for every country | 0.459 | 0.027 | 0.472 | 0.484 | 0.531 | 0.443 | 125 | |
| Counterfactual: no survey items anywhere | 0.460 | 0.028 | 0.418 | 0.281 | 0.387 | 0.301 | 0 | |

On the 53 alone, Afrobarometer (South Africa) and Latinobarómetro (six
countries) together move the guardrail from 0.273 to 0.264 and Trust from
0.418 to 0.434.

Reading:

1. Afrobarometer takes survey presence off the income gradient (0.37 to 0.03)
   but lowers the guardrail only 0.02, because it fills one item of four. The
   African countries end with one survey row where the rich have four.
2. The survey contribution to set C's guardrail is about 0.07 (0.53 against
   0.46 in both the ceiling and the counterfactual). The remaining 0.46 is
   the IP office rows, long-term unemployment and the other thin columns in `FRAME-EXPANSION.md`'s
   row table. A source search on social surveys cannot bring set C under
   about 0.46.
3. Pooling the dual rows raises it because the countries it fills are rich.
   That is not a reason against pooling (D118); it is a figure the pooling
   decision should print.
4. Trust clears O1 again at set C with Afrobarometer (0.410), and Shared
   purpose stays under it (0.383) on every realistic scenario.

## Pooling across sources: what a decision must say

Any second source for a Joint EVS/WVS row needs its own entry, because D64
pins one release and holds rather than pools. The entry has to cover what D64
covered for one source, plus three things D64 never needed:

- **Precedence:** one source per country, the pinned release first, the
  second source only where the release has no row. Never an average of two
  programmes, which would be the pooling D64 refuses inside one release.
- **Harmonisation:** the identical-stem, identical-card rule, the stored
  statistic and denominator, and the paired test as its evidence, with the
  threshold that would withdraw it (a signed offset larger than the
  release's own EVS-WVS spread).
- **Vintage:** a per-country fieldwork year, because a second source breaks
  the single release stamp; the observation note names the source round.

If the D64 hold is lifted in the same rebase, that is a separate clause with
its own evidence (the ten pairs above are the start of it).

## Recommendations

1. **Wire Afrobarometer Round 8 Q83 as a fill-only second source for
   `interpersonal_trust`, at the set C rebase.** One decision entry under the
   three clauses above, a second adapter reading the weighted per-country
   shares, fieldwork years per country, and A165's caveats extended to the
   Afrobarometer rows (the A13 shape, the 25 point African spread against a 6
   point pair difference). It fills 17 set C countries and South Africa,
   lowers the guardrail from 0.529 to about 0.509 and returns Trust to 0.410.
   Before wiring: a written confirmation from Afrobarometer that derived
   country shares may be republished under CC BY 4.0 with their citation.
2. **Write the guardrail clause of the rebase decision as a re-baseline at
   about 0.51, and say that survey sources cannot take it lower than about
   0.46.** G007_34_B, A173 and A080_01 have no harmonisable source for the
   poorest countries on any current survey; their gap in set C is the world's
   measurement gradient, which `FRAME-EXPANSION.md` already named. Hold
   Latinobarómetro (six of the 53) until its owner grants republication, and
   take WVS 8, when released, through the existing adapter as the next pinned
   release rather than as a second source.

## Licence blockers

| Source | What blocks it | Who acts |
| --- | --- | --- |
| Afrobarometer | Copyright, citation required, no redistribution clause: confirm that derived country shares may sit in a CC BY 4.0 dataset | MZ, by writing to Afrobarometer |
| Latinobarómetro | Non-commercial use only; republishing the data elsewhere is prohibited | MZ, permission from Corporación Latinobarómetro, or leave unwired |
| Gallup / WHR | Proprietary values; D10 | Not pursued |
| Arab Barometer, Asian Barometer, LiTS, ESS | Terms not verified; none is recommended | None |

## Sources

- Afrobarometer data and policy: [data usage and access policy](https://www.afrobarometer.org/data/data-usage-and-access-policy/),
  [merged data](https://www.afrobarometer.org/data/merged-data/); Round 8
  country files and variable metadata in the [World Bank Microdata
  Library](https://microdata.worldbank.org/index.php/catalog/6663) (merged R8,
  `AFR_2019-2021_AFB-MR8_v01_M`) and the per-country `*_AFB-R8_v01_M`
  catalogues; R9 and R10 item lists from the [Ghana R9 summary of
  results](https://www.afrobarometer.org/wp-content/uploads/2022/10/Summary-of-results-Ghana-Afrobarometer-R9-21oct2022-1.pdf),
  the [Ghana R10 summary of results](https://www.afrobarometer.org/wp-content/uploads/2025/04/Ghana-summary-of-results-Afrobarometer-R10-22april25.pdf)
  and the [Kenya R10 questionnaire](https://www.afrobarometer.org/wp-content/uploads/2025/12/KEN_R10.Questionnaire_8Apr24_final.pdf).
- Arab Barometer: [Wave VIII questionnaire](https://www.arabbarometer.org/wp-content/uploads/ENG-Arab-Barometer-Wave-VIII-Questionnaire-RELEASE-FIN-NOV-2024-1.pdf),
  [data downloads and wave list](https://www.arabbarometer.org/survey-data/data-downloads/).
- Asian Barometer: wave 3 to 5 schedule in the [WAPOR-GBS webinar slides](https://wapor.org/wp-content/uploads/Asian-Barometer.pdf);
  q23 wording in [Working Paper 136](https://asianbarometer.org/FileServlet?method=DOWNLOAD&fileId=1668754649529.pdf).
- Latinobarómetro: [Informe 2024](https://www.inep.org/images/2024/TXT/Latinobarometro-Informe_2024.pdf),
  section 4.9.1, and the terms on [latinobarometro.org](https://www.latinobarometro.org/latinobarometro-2024).
- EBRD LiTS IV: [data page](https://www.ebrd.com/home/what-we-do/office-of-the-chief-economist/lits/life-in-transition-survey-data.html),
  [questionnaire](https://www.ebrd.com/content/dam/ebrd_dxp/assets/pdfs/office-of-the-chief-economist/publications/life-in-transition-survey-iv/LITS-IV-Questionnaire.pdf),
  [report](https://www.ebrd.com/life-in-transition-iv.pdf).
- Global Flourishing Study trust item: [Scientific Reports 2024](https://www.nature.com/articles/s41598-024-78201-z).
- World Happiness Report: [data sharing](https://www.worldhappiness.report/data-sharing/).
- WVS 8: [call for participation](https://www.worldvaluessurvey.org/WVSNewsShow.jsp?ID=481);
  no public release found on 2026-10-02.
- Pinned release: Joint EVS/WVS 2017-2022 v5.0.0 [results](https://access.gesis.org/dbk/69549).

## Reproducing this

Scratch scripts, not committed: the World Bank Microdata Library API
(`/index.php/api/catalog/search?sk=afrobarometer`, then
`/api/catalog/<idno>/variables` and `/variable/<vid>`) for every Round 7 and
Round 8 file; `pdftotext`-equivalent extraction of the questionnaires and
summaries above; and `FRAME-EXPANSION.md`'s confidence code with an extra
observation map for each scenario. Data read 2026-10-02.
