# Institutional trust from the Joint EVS/WVS confidence battery

Status: verdict CHECK (D132). E069_17 is published beside Trust as
`__check__institutional_trust`; the `institutional_trust` gap stays open.
Section 1 was written on 2026-10-01 before any country value was read.

Track: source-backed measurement (TRUST, `institutional_trust` gap)

Source: Joint EVS/WVS 2017-2022 results by country, release 5.0.0, weighted by
`gwght`, the same pinned PDF the adapter already parses for A165, A173 and
A080_01 (D57, D64, D127, D128).

## 1. The construct, written before the values

The gap asks for "confidence in national government, courts and civil
service". The dimension asks whether strangers can cooperate on the strength
of the rules. The battery (E069) asks how much confidence the respondent has
in a list of organisations, on four categories: a great deal, quite a lot,
not very much, none at all.

Which items answer the question:

- **E069_17 Justice system/courts.** The closest. A court is where a stranger
  goes when the other party breaks the rule, and confidence in it is the
  respondent's estimate that the rule will be enforced. First choice.
- **E069_08 Civil service.** Second. The civil service is the rule applied by
  someone the respondent does not know, at a counter. It is less partisan than
  government and less visible than the courts.
- **E069_11 Government, E069_12 political parties, E069_07 parliament.**
  Against. These read the incumbent. Confidence in the government rises after
  an election the respondent's side won and falls after one it lost, so a
  cross-section of fieldwork years from 2017 to 2022 mixes the electoral cycle
  of 50 countries into the value. They measure approval, not whether the rules
  hold whoever is in office. The gap's definition names government; the
  definition is narrowed, not widened, and the note says so.
- **E069_06 Police.** Not chosen. The police are the most local of the
  institutions and their rating carries crime exposure, which D44 already
  showed travels with income across this country set.

Statistic: the table prints only the four category percentages plus don't
know, no answer and missing, each over all respondents. It prints no mean and
no "great deal plus quite a lot" column. The adapter rule is that nothing is
computed from category percentages (D64). The one published number that
reads confidence on its own is **"a great deal"**; the conventional statistic
(great deal plus quite a lot) would be a sum of two rounded published
columns. The memo reports both for the regime test and records which one is
wired.

Preferred row: E069_17, a single item, so no combination rule needs authoring.

## 2. The A13 trap, tested before deciding

Written after the values were read and before the verdict.

Regime is V-Dem v15 `v2x_regime` for 2024, read from the pinned
Full+Others archive (`V-Dem-CY-Full+Others-v15.csv`), not from the turnout
check's notes, which carry the regime at each country's latest election year
and so classify Bolivia, Malaysia, Nigeria and Haiti differently. Countries
are the 37 emitted rows (Germany, Great Britain and the Netherlands held).
"Great" is the published share answering a great deal; "sum" adds the
published quite a lot share and is shown for the test only, never stored.

| Item | Statistic | Closed aut. (2) | Electoral aut. (9) | Electoral dem. (15) | Liberal dem. (11) | All aut. | All dem. | r log GDP (36) |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| E069_17 courts | great | 28.1 | 23.5 | 7.9 | 14.0 | 24.3 | 10.5 | -0.18 |
| E069_17 courts | sum | 88.3 | 60.3 | 36.2 | 60.9 | 65.4 | 46.6 | 0.30 |
| E069_08 civil service | great | 19.2 | 16.4 | 5.3 | 6.3 | 16.9 | 5.7 | -0.31 |
| E069_08 civil service | sum | 85.1 | 55.6 | 32.3 | 51.4 | 61.0 | 40.4 | 0.26 |
| E069_06 police | great | 27.5 | 22.8 | 10.2 | 23.7 | 23.6 | 15.9 | 0.22 |
| E069_06 police | sum | 87.4 | 59.1 | 41.8 | 75.5 | 64.2 | 56.1 | 0.56 |
| E069_07 parliament | great | 35.3 | 14.7 | 3.7 | 4.8 | 18.4 | 4.2 | -0.30 |
| E069_07 parliament | sum | 91.8 | 49.5 | 22.0 | 36.3 | 57.2 | 28.0 | 0.08 |
| E069_11 government | great | 41.5 | 22.8 | 6.4 | 6.5 | 26.2 | 6.5 | -0.38 |
| E069_11 government | sum | 93.8 | 59.4 | 29.7 | 40.5 | 65.7 | 34.3 | 0.01 |

Closed autocracies: CHN VNM. Electoral autocracies: ETH IDN IND NIC PHL SGP
THA TUR VEN. Electoral democracies: ARG BOL BRA CAN COL ECU GTM KEN KOR MEX
MYS NGA PER POL PRT. Liberal democracies: AUS CHE CHL ESP EST FIN FRA JPN SWE
URY USA.

Courts, combined share, top to bottom: VNM 90.8, CHN 85.9, SGP 80.1, FIN 78.9,
JPN 77.9, PHL 77.5, SWE 76.1, TUR 73.7, IND 73.1, IDN 72.5 ... BRA 50.3 ...
COL 13.2, PER 9.6. On the published "a great deal" share alone the top is
IND 39.7, PHL 33.0, IDN 30.6, CHN 28.5, VNM 27.7, TUR 25.1.

What it means. Autocracies read clearly higher than democracies on every item
and both statistics, including the two items chosen in section 1 as least
partisan. The gap is largest where the incumbent is the object (government,
parliament), which is what the construct predicted, but it does not vanish for
courts or civil service. Liberal democracies are not at the bottom: electoral
democracies are, mostly Latin American, where low confidence reflects courts
that perform badly. So the item carries real information, but at the top of
the scale it cannot separate an institution that earns confidence from one
that respondents will not criticise to an interviewer.

A cross-check against the institutional fact. Across the 37 countries the
published share correlates -0.13 with V-Dem's government compliance with the
courts (`court_compliance`, D131) and the combined share 0.15. Confidence in
the courts does not track whether the state obeys them. The combined share
does track generalised trust (A165, r 0.54); the published share does not
(0.13).

## 3. Verdict

**Check, not score (D60).** Scored, the row would rank highest the states
whose courts are least able to rule against them. It is wired as an adapter
check under the gap's own id, as polarization is (D121):

- adapter: `E069_17` added to `JOINT_EVS_WVS_ITEMS` in
  `packages/core/src/pipeline/adapters/joint-evs-wvs.ts`, emitted under
  `CHECK_PREFIX`, same release, country mapping and hold rule;
- registry: `institutional_trust` check in `packages/core/src/model/checks.ts`
  with `ingest: 'adapter'` and `pinned` (`ZA7505_cdb_Tables.pdf`, `E069_17`,
  2022); the gap row in `indicators.ts` keeps `ingest: 'gap'` and its note
  points here;
- stored value: published share answering a great deal; the other published
  shares and the fieldwork year are in the observation note.

Coverage: 37 of 53 emitted, 40 in source, DEU GBR NLD held, fieldwork
2017-2023 (India 2023). Brazil: 11.8 a great deal, 38.5 quite a lot (2018).

## 4. Effect

| Measure | Before (7.4.0) | After |
| --- | ---: | ---: |
| Trust r with log GDP | 0.671 (n 51) | 0.671 (n 51) |
| Trust mean confidence | 0.347 | 0.347 |
| Trust countries scored | 52 | 52 |
| Brazil Trust | 55.9 at 0.396 | 55.9 at 0.396 |
| Guardrail (mean confidence vs log GDP) | 0.298 | 0.298 |
| Check r with log GDP (`behaviouralChecks`) | n/a | -0.177 (n 37 published, 36 with income) |
| Check r with Trust score | n/a | -0.056 (n 37) |

A165, A173 and A080_01: values and notes identical to the committed file;
only `retrievedAt` is restamped by the refetch, as on every earlier fetch.

## 5. What would reopen it

A release that prints a valid-answer mean or a two-category share; pooled
microdata with an anonymity or list-experiment adjustment; or a confidence
measure that tracks `court_compliance` instead of running against it. Until
then the gap stays the data-collection agenda: the OECD Trust Survey covers
members only, and the institutional family's scored rows remain observed
performance (contract enforcement, bribery incidence, court compliance).
