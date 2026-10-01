# Joint EVS/WVS: perceived control (A173) and charitable membership (A080_01)

Status: wired in the existing Joint EVS/WVS adapter. D127 (perceived control)
and D128 (civic participation).

Recorded: 2026-10-01

Track: O1 for Agency and Shared purpose. Brief: `docs/research/O1-TRIAGE-SWEEP.md`.

## Construct, written before the values (D118)

The order D118 asks for: what each row observes, and why that is the
dimension's capability, stated before any benchmark value is read into the
registry. The table pages were opened to learn their layout (which columns are
published) before this section was written; no correlation, coverage count or
country value had been computed.

### `perceived_control` (Agency) from A173

Agency asks how able individuals and organisations are to turn an intention
into action. A173 asks each respondent "how much freedom of choice and control
you feel you have over the way your life turns out", on a 1 to 10 scale. It
does not observe action. It observes the felt capacity to act: whether people
believe that what they decide changes what happens to them, which is the
precondition the dimension's question names before any act is taken. It is a
perception, class `P`, and is labelled as one. It is not a stock that money
buys directly. It will move with income through security and options, and that
is a finding to report, not a reason to drop it.

Statistic. The results table publishes the full distribution (1 to 10, don't
know, no answer, missing), a base count for the mean, the **mean** on the 1 to
10 scale and the standard deviation. It publishes no top-box share. A share
answering 7 to 10 or 8 to 10 would have to be summed from category percentages
whose denominator includes don't know and no answer, which is a computed
number the publisher does not print. The row therefore stores the published
mean, which is also the unit the registry already declared (`mean 1-10`). The
mean is printed to one decimal, so the row's resolution is 0.1 on a range that
spans a few points; ties are expected and stay ties.

Traps stated in advance. Response style on 10-point scales differs across
cultures (some samples pile on 10, some avoid the ends). Fieldwork years differ
by country. A respondent in a closed autocracy may still report high control:
the felt control is real to the respondent and may not be the freedom the
dimension means, so Vietnam, China, Nicaragua and Venezuela are read
explicitly below (the A13 check).

### `civic_participation` (Shared purpose) from A080_01

Shared purpose asks to what extent people can imagine themselves as
participants in a common project. Membership of a humanitarian or charitable
organisation is a reported behaviour, class `C`: the respondent has joined an
organisation whose purpose is to act for people outside their own household
and network. Of the ten membership items in the joint table it is the one
closest to acting for strangers. Religious membership (A065) is excluded
because it reads religiosity, and the other items read either interest groups
(unions, professional associations, consumer groups), leisure (sports,
culture) or the democratic channel A5 retired (parties). An "any
non-religious membership" composite would be closer to the registry
definition, but the aggregate table does not publish it and it cannot be built
without microdata, so the row is the single item, and the registry definition
is narrowed to say so.

Statistic and harmonisation. The joint file harmonises two different
questions. EVS 2017 shows a card and asks which organisations the respondent
belongs to; WVS 7 reads each organisation aloud and asks whether the
respondent is an active member, an inactive member or not a member. The joint
codebook (A080_01, p. 125) recodes both WVS answers to 1, so the published
"Mentioned" column means belongs (EVS) or is an active or inactive member
(WVS). The row stores the published "Mentioned" percentage, whose denominator
includes don't know, no answer and missing. Item-by-item reading is known to
draw more yeses than a show card, so WVS countries may read higher for the
question format and not the behaviour. That is a cost stated before the
values, and the EVS and WVS groups are compared below.

Traps stated in advance. State-sponsored mass organisations in China, Vietnam
and Cuba could inflate membership (A13). Membership is not activity: an
inactive member counts in WVS.

## Source and statistic

- Release: Joint EVS/WVS 2017-2022, v5.0.0 (2024-06-24), Variable Report
  results by country weighted by `gwght`, the PDF the adapter already pins
  ([results](https://access.gesis.org/dbk/69549)).
- Codebook: [Variable Report, Documentation](https://access.gesis.org/dbk/69548),
  A173 on p. 104, A080_01 on p. 125, membership harmonisation example p. 28.
- Fieldwork periods and programme by country:
  [Participating Countries and Territories](https://access.gesis.org/dbk/69550)
  (xlsx), and the `year` table on p. 2-3 of the results PDF, which the
  adapter now parses.

## How the adapter reads them

The adapter (`packages/core/src/pipeline/adapters/joint-evs-wvs.ts`) now holds
an item table, `JOINT_EVS_WVS_ITEMS`, in the way `vdem.ts` holds its variables:
each item names its heading, where its country rows end, the row pattern and
which published column is the value. Country mapping and the hold rule are
shared, so every item holds Germany, the United Kingdom and the Netherlands
for the reason D64 gives.

| Item | Row | Value stored | Table ends at |
| --- | --- | --- | --- |
| A165 | `interpersonal_trust` | % most people can be trusted (unchanged) | `TOTAL` |
| A173 | `perceived_control` | published mean, 1 to 10 | `(N)` |
| A080_01 | `civic_participation` | % mentioned | `TOTAL` |

A165's output is unchanged: on the refetch every trust value and note is
identical and only `retrievedAt` moves, and `revisions.json` records 0
changed, 74 added, 0 removed. The A173 and A080_01 notes add the statistic,
the valid-answer base for the mean, and the survey year read from the
release's own `year` table. Every value carries the release year 2022, as
A165 does. `pnpm bench evs fetch` runs it; `pnpm bench trust fetch` still
works as an alias.

## Coverage

Both items: 40 benchmark countries in the table, 37 emitted, 3 held (DEU, GBR,
NLD), the same countries as A165. Missing: CRI, IRL, ISR, ZAF, ARE, RWA, PRY,
PAN, HND, SLV, DOM, CUB, HTI (no survey in the release).

Fieldwork years of the 37 emitted, from the `year` table (six years apart at
the ends):

| Year | Countries |
| --- | --- |
| 2017 | ARG BOL CHE ESP FIN POL SWE USA |
| 2018 | AUS BRA CHL CHN COL ECU EST FRA IDN KOR MEX MYS NGA PER THA TUR |
| 2019 | JPN PHL |
| 2020 | CAN ETH GTM NIC PRT SGP VNM |
| 2021 | KEN VEN |
| 2022 | URY |
| 2023 | IND |

Programme: eight emitted countries are EVS (CHE EST ESP FIN FRA POL PRT SWE),
29 are WVS. Mode varies too: Australia and Japan were mail, Canada web, the
United States web and phone, the rest mostly face to face.

## Values

`perceived_control`, mean 1 to 10 (37):
URY 8.2, MEX 8.2, VNM 8.1, COL 8.1, NIC 8.0, GTM 7.8, FIN 7.8, VEN 7.7,
USA 7.7, PER 7.7, IDN 7.7, ARG 7.7, SWE 7.6, ECU 7.6, ETH 7.5, BRA 7.5,
BOL 7.5, AUS 7.5, ESP 7.4, CHE 7.4, CAN 7.4, CHL 7.3, MYS 7.2, IND 7.2,
PRT 7.1, EST 7.1, POL 7.0, KOR 7.0, KEN 7.0, FRA 7.0, CHN 7.0, SGP 6.8,
NGA 6.8, TUR 6.7, PHL 6.7, THA 6.1, JPN 6.0.

`civic_participation`, % mentioned (37):
KEN 38.4, IDN 37.9, USA 32.6, COL 32.3, THA 31.3, MYS 31.2, IND 29.4,
GTM 29.3, AUS 28.9, URY 25.3, PHL 23.9, NGA 23.2, SWE 22.9, CAN 22.6,
NIC 20.2, ETH 19.5, MEX 18.7, CHE 17.6, ECU 17.5, BOL 16.4, CHL 14.8,
FIN 14.2, SGP 10.9, ARG 9.9, BRA 9.7, VNM 9.4, ESP 8.1, FRA 7.2, TUR 6.1,
PER 6.1, VEN 5.1, POL 4.8, KOR 4.8, JPN 3.3, PRT 2.8, CHN 2.7, EST 1.5.

Brazil: perceived control 7.5 (16th of 37, fieldwork 2018, 1,719 valid
answers), charitable membership 9.7% (25th of 37).

## Checks

**A13, regime.** Perceived control: Vietnam (8.1, third) and Nicaragua (8.0,
fifth, surveyed November 2019 to January 2020, after the 2018 crackdown) read
near the top; Venezuela reads 7.7 in 2021. China is mid-table at 7.0. So the
trap stated in advance is visible in two closed or electoral autocracies, and
it is recorded, not corrected. Membership: China 2.7% and Vietnam 9.4% are
low to middling, so state mass organisations do not inflate this item (they
are unions, youth and women's federations, not charities). Cuba is not in the
release.

**Question format, membership.** The eight EVS countries average 9.9%, the 29
WVS countries 19.4%. Region and income are mixed into that split, so the
cleaner test is the ten countries surveyed by both programmes (only DEU, GBR
and NLD are in the frame, and all three are held): the WVS share is higher in
eight of ten (ARM +1.6, DEU +1.7, GBR +16.0, ROU +2.8, RUS +1.9, SRB +5.6,
SVK +8.8, UKR +1.8; CZE -5.0, NLD -0.4 points), median +1.9 points. Fieldwork
years also differ inside those pairs. The format effect is real and modest
against a frame spread of 1.5% to 38.4%, with the British pair the outlier.
For perceived control the same pairs agree within 0.2 points in seven of ten
(ARM +1.0, UKR -0.6 and SRB -0.3 the exceptions).

**Implausible or fragile values.** Estonia's 1.5% charitable membership is
the frame floor; it is an EVS show-card reading and low associational
membership in post-socialist Europe is a known pattern, but it is the value
most exposed to the format effect. Kenya (38.4%) and Indonesia (37.9%) top the
membership row on WVS item-by-item reading with inactive members counted.
Japan's 6.0 perceived control is the floor of its row: a mail survey and a
known tendency to avoid the ends of a scale. Mexico, Uruguay and Colombia at
8.1 to 8.2 sit where Latin American samples usually sit on 10-point
self-reports.

## Findings (D118: reported, not a gate)

Dataset 7.1.0 registry plus these two rows, local run on 2026-10-01.

| | `perceived_control` | `civic_participation` |
| --- | ---: | ---: |
| r with log GDP per capita (value) | -0.154 (n 36) | -0.331 (n 36) |
| r within EVS / WVS countries | 0.48 (8) / -0.17 (28) | 0.83 (8) / -0.24 (28) |
| `wealthAttribution` delta | -0.059 | -0.172 |
| r with `interpersonal_trust` | -0.14 | -0.18 |
| Redundant pair | none | none |

| Dimension | r log GDP | Mean confidence | Scored countries | Mean observed rows |
| --- | --- | --- | --- | --- |
| Agency | 0.638 → 0.579 | 0.383 → 0.483 | 52 → 52 | 2.9 → 3.6 |
| Shared purpose | 0.457 → 0.202 (n 47 → 50) | 0.260 → 0.343 | 47 → 51 | 1.9 → 2.6 |

Agency crosses the O1 target. Shared purpose rises and still misses it.
Shared purpose now clears the coverage floor in four more countries:
Nigeria (64.9), Vietnam (42.4), Singapore (37.0) and Venezuela (21.7). Only
Cuba and Haiti publish none. The
guardrail, mean confidence across dimensions against log GDP per capita,
falls from 0.333 to 0.286 (n 51): both rows cover more middle-income than
rich countries.

Brazil: Agency 51.6 → 55.8 (confidence 0.412 → 0.555), Shared purpose
34.9 → 30.7 (0.316 → 0.433).

Both rows run against income, and for membership the sign flips inside the
EVS group, which is all European and small. That is the format effect and
regional pattern above showing through, and it is the first thing a reader
should check before reading either row as a finding against the wealth link.
