# GEM extension and industrial designs in Experimentation

Task: the Experimentation section of `docs/research/O1-TRIAGE-SWEEP.md`, the
two preflight candidates

Track: source-backed measurement

Status: GEM rows extended (D125), industrial designs wired (D126). Retrieved
2026-10-01, local run on dataset 7.1.0. No version bump in this change.

## What moved

| | Before | After |
| --- | ---: | ---: |
| `early_stage_entrepreneurial_activity` countries | 16 | 35 |
| `failure_tolerance` countries | 16 | 34 |
| `resident_industrial_designs_per_million` countries | (new) | 50 |
| Experimentation observed rows (of counted) | 4 of 8 | 5 of 9 |
| Experimentation mean confidence | 0.225 | 0.338 |
| Experimentation r with log GDP per capita (Pearson, n) | 0.623 (50) | 0.654 (51) |
| Experimentation Spearman with log GDP per capita | 0.750 | 0.719 |
| Countries with an Experimentation score | 52 (Ireland below the floor) | 53 |
| Guardrail: mean confidence across dimensions against log GDP | 0.333 | 0.414 |
| Experimentation confidence against log GDP | 0.199 | 0.449 |
| Brazil Experimentation score (confidence) | 30.0 (0.394) | 27.1 (0.430) |

The 0.40 target for mean confidence (O1) is not reached. The guardrail
worsens, and the GEM extension is why. Decomposed, from runs with one change
at a time:

| Run | Mean confidence | r log GDP | Guardrail |
| --- | ---: | ---: | ---: |
| Dataset 7.1.0 | 0.225 | 0.623 | 0.333 |
| GEM extension only | 0.301 | 0.736 | 0.412 |
| Industrial designs only | 0.271 | 0.572 | 0.346 |
| Both (this change) | 0.338 | 0.654 | 0.414 |

The triage memo expected the guardrail to improve because the additions are
mostly middle-income Latin America. They are, but the 19 benchmark countries
GEM has not surveyed since 2022 are poorer still (SGP PRT IRL AUS VNM PHL MYS
TUR NGA KEN RWA ETH BOL PRY HND NIC DOM CUB HTI, of which only SGP, PRT, IRL
and AUS are high-income), and they stay on two or three rows. Industrial
designs covers 50 countries regardless of income and pulls both numbers back.

Brazil moves from 30.0 to 27.1: its own GEM values did not change; it gains a
design row at 8.0 and the frame moves as 19 countries gain GEM values.

## GEM: sources and reading

| Report | PDF | GEM data year | TEA | Fear of failure |
| --- | --- | --- | --- | --- |
| 2025/2026, "From Uncertainty to Opportunity" | [fileId 51858](https://www.gemconsortium.org/file/open?fileId=51858) | 2025 | Table A1, pp. 223, 225 | Table A2, pp. 226, 228 |
| 2024/2025, "Entrepreneurship Reality Check" | [fileId 51621](https://www.gemconsortium.org/file/open?fileId=51621) | 2024 | Table A3, pp. 222, 224 | Table A2, pp. 219, 221 |
| 2023/2024, "25 Years and Growing" | [fileId 51377](https://www.gemconsortium.org/file/open?fileId=51377) | 2023 | Table A2, pp. 212, 213 | Table A3, pp. 215, 217 |
| 2022/2023, "Adapting to a New Normal" | [fileId 51147](https://www.gemconsortium.org/file/open?fileId=51147) | 2022 | Table A2, pp. 224, 225 | Table A3, pp. 227, 229 |

Page numbers are the printed ones. The 2023/2024 appendix pages carry a stale
"2022/2023" running footer; the cover, the citation line, the "46
participating economies in 2023" and the Rank/46 columns make it the 2023
edition, and its values differ from fileId 51147 throughout.

**Data year.** Report n/n+1 carries the Adult Population Survey run in year n.
The 2025/2026 report says 53 economies took part "in 2025", the 2024/2025
report's income table is "Changes in household income in 2024", the
2023/2024 tables rank 46 economies (the 2023 count), and the 2022/2023 tables
rank 49.

**Fear of failure denominator.** The current item, "There are good
opportunities, but I would not start a business for fear it might fail", was
introduced in the 2019 APS (2025/2026 report, printed p. 37, which counts
economies "since the introduction of this question in the 2019 GEM APS"), and
is reported as a share of adults who see good opportunities. All four
editions print exactly that denominator in the column header ("% of those
seeing good opportunities" or "% adults seeing good opportunities"), so the
four pool without adjustment. Rule (D125): only 2019+ values are entered.
Singapore's 2014 failure-tolerance value predates the question and is
removed. Its 2014 TEA stays.

**Pooling.** Latest survey year in 2022 to 2025 per country; no averaging.
28 countries are at 2025, China at 2024, Colombia, Panama and Uruguay at 2023,
Indonesia and Japan at 2022. Both rows always come from the same year and
report for a country.

**Extraction.** `docs/research/experimentation/gem-extract.py` reads the
words on each page with their coordinates (PyMuPDF), groups them into rows by
height, folds two-line names ("Republic of / Korea") into their row, and
takes the named column. On the 2022 to 2024 attitude tables the names and the
numbers sit on facing pages, and the script joins them by row height. A row
whose value count differs from the column count, or whose cell is not a
number, is reported as skipped rather than read: none was. Every value
entered was then checked by eye against a rendering of the same page. The
15 existing rows that appear in the reports all match to the decimal.

**Skipped.** No country was skipped for an ambiguous table. Not in any of the
four reports: SGP (kept at 2014 for TEA), PRT, IRL, AUS, VNM, PHL, MYS, TUR,
NGA, KEN, RWA, ETH, BOL, PRY, HND, NIC, DOM, CUB, HTI.

**Traps worth knowing.** Japan's 2022 fear of failure rests on the 12.7% of
adults who saw good opportunities, so its denominator is small. Year-to-year
moves are large for some countries: Argentina's fear of failure is 18.8 in
2024 and 62.1 in 2025, Costa Rica's TEA 5.2 in 2024 and 13.9 in 2025. The
rows take the latest value and do not smooth.

### Per country

"Fear of failure (published)" is the GEM rate; the row stores 100 minus it.

| Country | Status | TEA | Fear of failure (published) | Stored failure tolerance | GEM year | TEA source | Fear source | Years in window |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| Argentina | existing, matches | 21.4 | 62.1 | 37.9 | 2025 | 25/26 Table A1, p. 223 | 25/26 Table A2, p. 226 | 2024, 2025 |
| Brazil | existing, matches | 19.4 | 48.2 | 51.8 | 2025 | 25/26 Table A1, p. 223 | 25/26 Table A2, p. 226 | 2022, 2023, 2024, 2025 |
| Canada | added | 27.4 | 50.3 | 49.7 | 2025 | 25/26 Table A1, p. 223 | 25/26 Table A2, p. 226 | 2022, 2023, 2024, 2025 |
| Chile | existing, matches | 29.4 | 47.7 | 52.3 | 2025 | 25/26 Table A1, p. 223 | 25/26 Table A2, p. 226 | 2022, 2023, 2024, 2025 |
| China | added | 5.4 | 62.2 | 37.8 | 2024 | 24/25 Table A3, p. 222 | 24/25 Table A2, p. 219 | 2022, 2023, 2024 |
| Colombia | existing, matches | 23.6 | 34.9 | 65.1 | 2023 | 23/24 Table A2, p. 212 | 23/24 Table A3, p. 215 | 2022, 2023 |
| Costa Rica | existing, matches | 13.9 | 44.1 | 55.9 | 2025 | 25/26 Table A1, p. 223 | 25/26 Table A2, p. 226 | 2024, 2025 |
| Ecuador | added | 29.6 | 57.3 | 42.7 | 2025 | 25/26 Table A1, p. 223 | 25/26 Table A2, p. 226 | 2023, 2024, 2025 |
| El Salvador | added | 23.9 | 46.9 | 53.1 | 2025 | 25/26 Table A1, p. 223 | 25/26 Table A2, p. 226 | 2025 |
| Estonia | existing, matches | 11.6 | 38.8 | 61.2 | 2025 | 25/26 Table A1, p. 223 | 25/26 Table A2, p. 226 | 2023, 2024, 2025 |
| Finland | added | 6.1 | 41.6 | 58.4 | 2025 | 25/26 Table A1, p. 223 | 25/26 Table A2, p. 226 | 2025 |
| France | added | 11.6 | 42.7 | 57.3 | 2025 | 25/26 Table A1, p. 223 | 25/26 Table A2, p. 226 | 2022, 2023, 2024, 2025 |
| Germany | added | 13.0 | 40.6 | 59.4 | 2025 | 25/26 Table A1, p. 223 | 25/26 Table A2, p. 226 | 2022, 2023, 2024, 2025 |
| Guatemala | added | 25.4 | 38.8 | 61.2 | 2025 | 25/26 Table A1, p. 223 | 25/26 Table A2, p. 226 | 2022, 2023, 2024, 2025 |
| India | existing, matches | 12.3 | 56.8 | 43.2 | 2025 | 25/26 Table A1, p. 223 | 25/26 Table A2, p. 226 | 2022, 2023, 2024, 2025 |
| Indonesia | added | 8.1 | 36.8 | 63.2 | 2022 | 22/23 Table A2, p. 224 | 22/23 Table A3, p. 227 | 2022 |
| Israel | added | 8.9 | 50.1 | 49.9 | 2025 | 25/26 Table A1, p. 223 | 25/26 Table A2, p. 226 | 2022, 2023, 2024, 2025 |
| Japan | added | 6.4 | 50.9 | 49.1 | 2022 | 22/23 Table A2, p. 224 | 22/23 Table A3, p. 227 | 2022 |
| Mexico | existing, matches | 19.4 | 40.4 | 59.6 | 2025 | 25/26 Table A1 (continued), p. 225 | 25/26 Table A2, p. 226 | 2022, 2023, 2024, 2025 |
| Netherlands | existing, matches | 12.2 | 47.0 | 53.0 | 2025 | 25/26 Table A1 (continued), p. 225 | 25/26 Table A2 (continued), p. 228 | 2022, 2023, 2025 |
| Panama | added | 31.3 | 41.4 | 58.6 | 2023 | 23/24 Table A2, p. 212 | 23/24 Table A3 (continued), p. 217 | 2022, 2023 |
| Peru | existing, matches | 12.8 | 44.9 | 55.1 | 2025 | 25/26 Table A1 (continued), p. 225 | 25/26 Table A2 (continued), p. 228 | 2025 |
| Poland | added | 2.9 | 49.4 | 50.6 | 2025 | 25/26 Table A1 (continued), p. 225 | 25/26 Table A2 (continued), p. 228 | 2022, 2023, 2024, 2025 |
| Singapore | kept TEA, fear removed | 11.0 | (39.4, 2014, pre-2019 question) | removed | 2014 | key-aps page | removed (D125 rule 3) | none |
| South Africa | existing, matches | 14.7 | 49.6 | 50.4 | 2025 | 25/26 Table A1 (continued), p. 225 | 25/26 Table A2 (continued), p. 228 | 2022, 2023, 2025 |
| South Korea | existing, matches | 9.1 | 27.0 | 73.0 | 2025 | 25/26 Table A1 (continued), p. 225 | 25/26 Table A2 (continued), p. 228 | 2022, 2023, 2024, 2025 |
| Spain | added | 7.8 | 52.0 | 48.0 | 2025 | 25/26 Table A1 (continued), p. 225 | 25/26 Table A2 (continued), p. 228 | 2022, 2023, 2024, 2025 |
| Sweden | added | 9.6 | 42.6 | 57.4 | 2025 | 25/26 Table A1 (continued), p. 225 | 25/26 Table A2 (continued), p. 228 | 2022, 2023, 2024, 2025 |
| Switzerland | existing, matches | 10.2 | 31.4 | 68.6 | 2025 | 25/26 Table A1 (continued), p. 225 | 25/26 Table A2 (continued), p. 228 | 2022, 2023, 2024, 2025 |
| Thailand | added | 19.0 | 46.8 | 53.2 | 2025 | 25/26 Table A1 (continued), p. 225 | 25/26 Table A2 (continued), p. 228 | 2023, 2024, 2025 |
| United Arab Emirates | added | 20.4 | 55.2 | 44.8 | 2025 | 25/26 Table A1 (continued), p. 225 | 25/26 Table A2 (continued), p. 228 | 2022, 2024, 2025 |
| United Kingdom | added | 21.9 | 49.6 | 50.4 | 2025 | 25/26 Table A1 (continued), p. 225 | 25/26 Table A2 (continued), p. 228 | 2022, 2023, 2024, 2025 |
| United States | existing, matches | 17.7 | 42.4 | 57.6 | 2025 | 25/26 Table A1 (continued), p. 225 | 25/26 Table A2 (continued), p. 228 | 2022, 2023, 2024, 2025 |
| Uruguay | existing, matches | 26.2 | 51.7 | 48.3 | 2023 | 23/24 Table A2, p. 213 | 23/24 Table A3 (continued), p. 217 | 2022, 2023 |
| Venezuela | added | 7.7 | 32.0 | 68.0 | 2025 | 25/26 Table A1 (continued), p. 225 | 25/26 Table A2 (continued), p. 228 | 2022, 2023, 2024, 2025 |

## Industrial designs

Probe (`pnpm bench probe --series IP.IDS.RSCT,IP.TMK.RSCT`, 2010 onward):
49 of 53, latest 2021, raw count r with log GDP 0.02, verdict usable. The full
ingest from 1990 finds 50 of 53: missing the Netherlands, Venezuela and Haiti.
45 countries are at 2021; the rest are Uruguay 2017, Nigeria 2020, Honduras
2018, Nicaragua 2013 and Ethiopia 2007.

The row copies `resident_trademarks_per_million` exactly: `transform:
'per_million_population'`, `denominatorSeries: 'SP.POP.TOTL'`, World Bank
route, class `O`, prior 0.3.

Diagnostics on the scored row:

- r with log GDP per capita 0.494 (trademarks 0.578, patents 0.524).
- Wealth-attribution delta 0.001: removing the row moves Experimentation's
  r from 0.654 to 0.653.
- r with `resident_trademarks_per_million` 0.816 over 49 countries, below the
  0.85 redundancy flag, so it does not appear in `redundantIndicatorPairs`.

Seven countries reach the upper fence at 100: Turkey, Korea, the United
Kingdom, France, Germany, China and Switzerland. Brazil reads 8.0.

Traps, all in the registry note:

- **China.** Design filings were subsidised like patents and utility models,
  so the count runs ahead of the attempts behind it.
- **EUIPO.** EU applicants increasingly file a registered Community design at
  the EUIPO, which a national resident count does not see. EU members read
  low, and how low depends on each country's habit of filing nationally:
  France and Germany reach the fence while Sweden, Finland and Ireland read
  14.0, 10.1 and 6.6.
- **Benelux.** The Netherlands files designs at the Benelux office and has no
  national series. Its trademark series is missing too, consistent with the
  same cause (inference, not checked against WIPO).
- **Redundancy.** At 0.816 with trademarks, filing culture is weighed twice.

## Not done here

- GEM business exit and re-entry (Table A2 in 2025/2026, A5 in 2024/2025):
  the check candidate in the triage memo, left for a separate session.
- No version bump or changelog entry: a new scored row is a minor dataset
  bump under D37, left for the release.
