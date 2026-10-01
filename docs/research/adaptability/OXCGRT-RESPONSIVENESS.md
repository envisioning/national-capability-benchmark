# OxCGRT: speed of first economic support

Task: Adaptability, desk triage for the declared gap `institutional_responsiveness`
(Q2 in `docs/RESEARCH-ROADMAP.md`)

Track: check candidate under D60, never a score

Status: **failed triage, 2026-10-01.** Recommended outcome below. Nothing is
wired; no registry, adapter, observation or output file changes.

## The question

The gap is "Speed at which rules and public programmes are changed in response
to new conditions" (`packages/core/src/model/indicators.ts`), and the registry
says no dataset exists. The owner's decision was to preflight the Oxford
COVID-19 Government Response Tracker as a check candidate, measuring how fast
each government put its **first economic-support measure** in place in 2020.
Lockdown stringency is excluded on purpose: a fast lockdown rewards a
government's ability to impose control, which is the A13 trap
(`docs/KNOWN-ARTEFACTS.md`). The single 2020 shock is a known limit going in.

## Release pin

| Item | Value |
| --- | --- |
| Repository | https://github.com/OxCGRT/covid-policy-dataset |
| Commit | `e7f66ee39654293b5c068efd2f195bd591dc27f6` (2023-06-26, "Update README.md"); data added in `1e625a3` "OxCGRT v1 June2023". No later commit exists; the dataset is frozen. |
| Primary file | `data/OxCGRT_compact_national_v1.csv`, 43,837,034 bytes, SHA-256 `fa5c95fa8f5e386517698cdc17581f7e3333348907c57ad8459c877580d0fe79` |
| Rows used | `Jurisdiction == NAT_TOTAL`, daily, 2020-01-01 to 2022-12-31 (1,096 rows per country) |
| Columns used | `Date`, `E1_Income support`, `E1_Flag`, `E2_Debt/contract relief`, `EconomicSupportIndex`, `ConfirmedCases`, `ConfirmedDeaths` |
| Cross-check | `data/timeseries_indices/OxCGRT_timeseries_EconomicSupportIndex_v1.csv`, SHA-256 `36fe223898e2ae83a254754a67afcd70b4702fd36a071374ed1e5345560dbb4b`. First non-zero ESI date matches the compact file for BRA, CHN, MEX, NIC, SWE. |
| Coding notes | `data/OxCGRT_fullwithnotes_national_2020_v1.csv`, SHA-256 `623cdfbcc4848732605acec5b2d2cc2d115d2957f846d600e433bddaf6169764`, columns `E1_Notes`, `E2_Notes` |
| Raw URL pattern | `https://raw.githubusercontent.com/OxCGRT/covid-policy-dataset/<commit>/data/<file>` |

Downloaded 2026-10-01 to a scratch directory; nothing is committed.

## Licence

`LICENSE.txt` at the pinned commit opens "Attribution 4.0 International",
followed by the citation to Hale et al. (2021), *Nature Human Behaviour*,
https://doi.org/10.1038/s41562-021-01079-8, and the full CC BY 4.0 legal code.
The README reads: "Our data is made available free to use for any purpose
under a Creative Commons CC BY 4.0 license". GitHub's licence detector reports
`NOASSERTION` only because the file prepends the citation to the legal code.
Short credit as the README gives it: Oxford COVID-19 Government Response
Tracker, Blavatnik School of Government, University of Oxford.

## The measure

From the codebook (`documentation_and_codebook.md` at the pin):

- `E1` income support: 0 none, 1 replaces under 50% of lost salary, 2 replaces
  50% or more. `E1_Flag` 0 formal or informal workers only, 1 all workers.
  Recorded only where the support applies nationwide.
- `E2` debt/contract relief for households: 0 none, 1 narrow relief specific to
  one kind of contract, 2 broad relief.
- The Economic Support Index is built from E1 and E2 only, so
  `EconomicSupportIndex > 0` holds exactly when E1 > 0 or E2 > 0.
- "Implementation not announcement": a policy is coded from the day it was in
  effect, not the day it was announced.
- The E indicators were introduced in April 2020 (codebook changelog). Every
  March 2020 value was coded retrospectively.

**Definition.** `first_support` is the first `Date` with
`EconomicSupportIndex > 0`. The lag is `first_support − anchor`, in days; lower
is faster. An E1-only variant (first date with `E1 > 0`) was also run.

**Anchors.** Four were computed for all 53 countries:

| Anchor | Definition | Why it is there |
| --- | --- | --- |
| WHO | 2020-03-11, the WHO pandemic declaration | Common anchor. Every country gets the same date, so the ranking is the calendar order. It asks: when did you act once the world called it? |
| case1 | first date `ConfirmedCases > 0` | Country-specific exposure |
| case100 | first date `ConfirmedCases >= 100` | Less sensitive to a single imported case |
| death1 | first date `ConfirmedDeaths > 0` | Harder to miss than cases |

The country anchors come from the same file's case and death series. Their
start is limited by the series start: China's anchors all read 2020-01-22, the
first day of the series, so China's country-anchored lags (80 days) are
left-censored and meaningless.

## Coverage and spread

| Test | Result |
| --- | --- |
| Benchmark countries in the file | 53 / 53, full daily series, no blank E1 or E2 in 2020 |
| Ever introduced support (ESI > 0) | 53 / 53. None is right-censored. |
| Never introduced E1 by 2022-12-31 | ARE, ETH, NIC |
| Never introduced E2 | DOM |
| Earliest | EST and IND, 2020-03-01 |
| Latest | MEX 2020-10-09, NIC 2021-03-23 |

Lag in days under each anchor, 53 countries:

| Anchor | Min | 25th | Median | 75th | Max | Negative |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WHO (ESI) | −10 | 5 | 9 | 21 | 377 | 4 |
| case1 (ESI) | 0 | 15 | 30 | 52 | 369 | 0 |
| case100 (ESI) | −45 | −1 | 7 | 17 | 306 | 16 |
| death1 (ESI) | −113 | 1 | 10 | 22 | 360 | 12 |
| WHO (E1 only) | −10 | 7 | 21 | 33 | 1,025 | 1 |

25 of 53 countries put support in place between three days before and ten days
after the WHO declaration. Outside Mexico and Nicaragua the whole frame sits
inside about seven weeks.

**The countries that never acted, or acted late.** No benchmark country is
censored on the ESI measure; two are extreme. Nicaragua's first non-zero value
is E2 = 1 on 2021-03-23, a year in. Mexico's is 2020-10-09, and its `E1_Notes`
say "each state manages their own independent programs", which sits awkwardly
with the codebook rule that E1 is recorded only for nationwide support. Both are
the documented outcome of governments that chose not to run a national
pandemic support programme. That is policy choice, not inability or absence of
need, and the number cannot say which. On E1 alone, the UAE, Ethiopia and
Nicaragua never register: for the UAE the only measure is a bank-led loan
holiday coded as E2 = 2; Nicaragua chose not to act; for Ethiopia, a
low-income state, the likelier cause is fiscal capacity, though that was not
checked. Different causes produce the same "never".

## Construct verdict

Written from the codebook and the coding notes before any correlation was
computed, and not revised after.

**What it observes.** The first day a national household income transfer or
household debt/contract relief was in effect, as coded retrospectively by
OxCGRT's collectors. One event per country, in one shock, in 2020.

**Where it is closer to the gap than anything else.** It is a timestamp of a
rule or programme changing in response to a new condition, which is what the
gap names, across 53 of 53 countries from one coding protocol. Unlike
stringency, the first support measure is not something control alone produces.

**Why it does not hold up as a measure of responsiveness.**

1. *The trigger is the cheapest measure, not the decision.* Any E2 = 1 trips
   the threshold. Brazil's first value is a cut in interest rates on loans to
   retirees; the UAE's is a central directive to banks; Cuba's and Rwanda's are
   deferrals of utility bills and loan restructuring permissions. These cost the
   treasury little and arrive fast in any regime that can issue a decree, so
   the A13 shape reappears in a milder form: speed from command, not from
   adapting institutions. The E1 variant avoids that and walks into the other
   trap: income support at 50% of wages depends on fiscal room and on an
   existing payroll or unemployment-insurance system (Sweden's first E1 is the
   state taking over sick pay, an existing programme). That is a stock money
   buys.
2. *Coded dates are not decision dates.* Implementation dating plus
   retrospective coding means a measure's effective start can precede its
   adoption. India's `E2_Notes` cite an RBI circular dated 27 March 2020 for a
   moratorium on instalments falling due from 1 March, and the row is coded
   from 2020-03-01. India ranks joint first because of that. Estonia's E1 note
   describes a wage subsidy covering March to May, also coded from 2020-03-01;
   its adoption date was not checked here.
3. *The spread is smaller than the error.* Half the frame acts within ten days
   of the WHO declaration. Backdating, weekend effects and coder judgement move
   a country by days, which is the same order as the differences being ranked.
4. *Need and choice are confounded with speed.* A country with few cases had
   less reason to act early, and the country-specific anchors that try to fix
   this inherit testing capacity: first detected case depends on how much a
   country tests, which tracks income. Mexico and Nicaragua show deliberate
   refusal reading as slowness.
5. *One frozen event.* The dataset ends in 2022 and will not update. A row
   built on it is a single observation of one shock, six years old at the next
   release, with no way to read change.

Verdict: it observes a real behaviour adjacent to the construct, but the number
mixes decree speed, fiscal room, backdating and political choice, and its
spread sits inside its own measurement error. It does not observe institutional
responsiveness.

## Anchor sensitivity

Spearman rank correlation between lag rankings, 53 countries:

| | WHO | case1 | case100 | death1 | E1 WHO | E1 case100 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WHO | 1 | 0.415 | 0.518 | 0.509 | 0.756 | 0.499 |
| case1 | | 1 | 0.866 | 0.715 | 0.212 | 0.516 |
| case100 | | | 1 | 0.822 | 0.264 | 0.557 |
| death1 | | | | 1 | 0.259 | 0.425 |
| E1 WHO | | | | | 1 | 0.766 |

The country-specific anchors agree with each other (0.72 to 0.87). They agree
with the common anchor at about 0.5, and with the E1 variant at about 0.25.
Which country looks responsive depends mostly on the anchor and on whether
narrow relief counts, which are analyst choices, not evidence.

## Findings: wealth and the Adaptability score

Reported, deciding nothing (D118). Lag is in days, so a negative coefficient
means richer, or higher-scoring, countries acted sooner. Log GDP per capita is
World Bank `NY.GDP.PCAP.PP.KD`, latest year (2024 or 2025) from
`data/observations/worldbank.json` (`__context__NY.GDP.PCAP.PP.KD`); Venezuela
and Cuba have none, so n = 51. Adaptability is the dimension score in
`data/out/index.json`, dataset 6.2.0, n = 53.

| Lag | r log GDP | Spearman GDP | r Adaptability | Spearman Adaptability |
| --- | ---: | ---: | ---: | ---: |
| WHO (ESI) | −0.224 | −0.415 | −0.144 | −0.387 |
| case1 (ESI) | −0.033 | 0.250 | 0.087 | 0.384 |
| case100 (ESI) | −0.012 | 0.289 | 0.070 | 0.339 |
| death1 (ESI) | −0.036 | 0.172 | −0.006 | 0.150 |
| WHO (E1 only) | −0.251 | −0.559 | −0.213 | −0.522 |
| case100 (E1 only) | −0.205 | −0.047 | −0.169 | −0.067 |

Pearson is dominated by Mexico and Nicaragua. Without them, WHO (ESI) gives
r = −0.276 with log GDP (n 49) and −0.295 with Adaptability (n 51); case100
(ESI) gives +0.417 and +0.414.

**The sign of the wealth association flips with the anchor.** Against the
calendar, richer countries acted sooner. Against their own first case, richer
countries acted later, because they detected cases earlier: they were travel
hubs and tested more. The E1 variant on the common anchor is the most
wealth-linked reading (Spearman −0.559), which is the fiscal-room point in the
verdict showing up in the data. None of this is the reason for the
recommendation; it is consistent with it.

## Brazil

| Item | Value |
| --- | --- |
| First ESI > 0 | **2020-03-17**: `E1_Income support` 0.00, `E2_Debt/contract relief` 1.00, `EconomicSupportIndex` 25.00, `ConfirmedCases` 321, `ConfirmedDeaths` 1 |
| What it was | `E2_Notes`: the government announced lower interest rates on loans taken by retired people and on card purchases (ministry timeline for 17 March 2020, archived) |
| First E1 > 0 | **2020-04-02**: `E1` 1.00, `E1_Flag` 1, `E2` 1.00, ESI 50.00. `E1_Notes`: the R$600 monthly emergency payment for informal workers, the unemployed and micro-entrepreneurs, and provisional measure 936 the same day |
| Lags (ESI) | WHO +6, case1 +20, case100 +4, death1 0 |
| Rank of 53, 1 = fastest | WHO 17.5, case1 18, case100 21.5, death1 13; E1 WHO 30.5, E1 case100 35.5 |

Brazil sits in the upper-middle of the pack on every ESI anchor and in the
lower-middle on E1. Its first income support carried `E1_Flag` 1 (all workers,
informal included), as 29 of the 50 countries with any E1 did at their first
E1 date; 21 started with formal-only or informal-only support. The informal
coverage is a story for the Brazil report's narrative, not a number for the
benchmark.

## Recommendation

**Do not wire as a check. Record as a failed triage.** A D60 check is a series
that is real, current and disqualified from the score, shown because the
reading is still worth having. This series fails before that point. It is not
current and cannot become current; its ranking is set mainly by the choice of
anchor; its spread is inside the error introduced by backdated coding; and its
cheapest trigger rewards decree speed. A published "days to first support"
beside Adaptability would be quoted as responsiveness, and the attached reason
could not undo that.

Triage paragraph for the roadmap:

> **`institutional_responsiveness`, OxCGRT first economic support (failed
> triage, 2026-10-01).** OxCGRT v1 (CC BY 4.0, frozen June 2023) covers 53 of 53
> and every country introduced household support. Days to the first E1 or E2
> measure are compressed (half the frame within ten days of 11 March 2020),
> backdated by implementation coding (India coded from 1 March on a 27 March
> circular), triggered by the cheapest decree, and anchor-dependent: rankings
> under the common and the case-based anchors correlate at about 0.5, and the
> sign of the wealth association flips between them. One frozen 2020 event.
> Not a score and not a check. The gap stays open. Memo:
> `docs/research/adaptability/OXCGRT-RESPONSIVENESS.md`.

**What remains usable.** OxCGRT's notes are good primary evidence for a case
narrative. The Brazil report can cite the dated sequence above, with the
licence credit, as an illustration of how Brazil's state responded in 2020. A
comparable measure of the gap would need repeated events, decision dates rather
than effective dates, and a threshold set on substance rather than on any
non-zero code.

## Not verified

- The adoption dates behind backdated rows other than India's; Estonia's is
  likely backdated and was not checked.
- Whether any country's first E2 = 1 was later revised by OxCGRT; only the
  v1 file at the pin was read.
- The accuracy of the case and death series as anchors beyond China's
  left-censoring; the United Kingdom's first death (2020-01-30) precedes its
  first case (2020-01-31) in the file, which suggests source quirks elsewhere.

## Reproduction

```text
C=e7f66ee39654293b5c068efd2f195bd591dc27f6
curl -sLO https://raw.githubusercontent.com/OxCGRT/covid-policy-dataset/$C/data/OxCGRT_compact_national_v1.csv
shasum -a 256 OxCGRT_compact_national_v1.csv
# filter Jurisdiction == NAT_TOTAL and the 53 ISO3 codes in packages/core/src/model/countries.ts;
# first Date with EconomicSupportIndex > 0, minus each anchor; Spearman with average ranks for ties.
```
