# Preflight: annual export entries (EXP-SWEEP-2, issue #112)

Date: 2026-11-02. Dataset 10.0.0, 135 countries. Track: source-backed
measurement, value preflight. Nothing is wired: no registry row, adapter,
observation or decision changed. Source: `SWEEP-2026-11.md`, candidate 2.

## File pin

| Field | Value |
| --- | --- |
| Publisher | Harvard Growth Lab, Atlas of Economic Complexity, International Trade Data (HS, 92) |
| Record | `doi:10.7910/DVN/T4CHWJ`, version 18.0, released 2026-04-22 (the record D149 pins) |
| File | `hs92_country_country_product_year_6_2020_2024.csv` |
| Dataverse file id | 13685118 (`https://dataverse.harvard.edu/api/access/datafile/13685118`) |
| Size | 2,855,413,820 bytes |
| MD5 | `5ebf020c25720532232354d81e34a7fe` (Dataverse checksum; the download matches) |
| SHA-256 | `6c07f4847031b065f57a13c5ef8f97f0eb67e740d7ba1b7b9b42c3db618c66f8` |
| Licence | CC0 1.0 (`CC0-1.0`), read from the Dataverse API for version 18.0 on 2026-11-02 |
| Retrieved | 2026-11-02 |

The 3 KB data dictionary of the same record (`hs92_data_dictionary.csv`,
file id 13685113) was also read. No other file was downloaded.

## 1. What the file is

- Columns: `country_id, country_iso3_code, partner_country_id,
  partner_iso3_code, product_id, product_hs92_code, year, export_value,
  import_value`. 68,227,594 rows, 2020 to 2024 (13.2 to 13.9 million rows a
  year). Values are current USD, integers.
- Country codes: ISO 3166-1 alpha-3, "augmented" by the Growth Lab (the
  dictionary's word). 231 economies appear as reporter and as partner. All
  135 benchmark codes match directly, with no mapping.
- Products: six-digit HS92 codes, plus `999999` (unspecified, USD 3.0
  trillion of exports over five years) and `XXXXXX` (3,728 rows). Both are
  excluded from every count below. Two rows carry a negative value.
- Exporter-reported or mirror: neither, strictly. The record states the
  Growth Lab cleans UN Comtrade with the Bustos-Yildirim method, which uses
  both partners' reports to give one estimate per flow. The file stores that
  estimate twice: as `export_value` on the exporter's row and as
  `import_value` on the partner's row. I checked 249,055 flows between five
  exporters and five partners; all 249,055 are identical within USD 1 in both
  directions. A country that does not report (Cuba, Venezuela, Haiti in
  D149) still has every flow its partners report.

## 2. The definition, fixed

The sweep proposed: lines with exports of at least USD 10,000 in year t and
none in t-1 to t-3, as a share of active lines in t-1, averaged over three
years. The file starts in 2020, so only t = 2023 and t = 2024 have a full
three-year look-back.

**Fixed definition.** A line is an exporter, a partner and an HS92
six-digit product. A line is active in year y when its exports are at least
USD 10,000 in y. An entry in year t is a line active in t with zero exports in
each of t-1, t-2 and t-3. The entry share for t is entries in t over lines
active in t-1. The value is the mean of the shares for t = 2023 (look-back
2020 to 2022) and t = 2024 (look-back 2021 to 2023), stamped 2024.

This keeps the sweep's look-back unchanged and averages two years, not three.
The costs:

- Two years, not three: one bad year moves the mean more. The two years
  order the frame at Spearman 0.91, so the cost is moderate.
- Survival is observable for the 2023 entries only, and for one year.
- A future refresh needs the next five-year file, or the 2010 to 2019 file
  (5.6 GB) to backfill. This file alone cannot be rolled back further.

Variants computed to test the choice: "below USD 10,000" instead of "zero"
in the look-back (Spearman 0.984 with the fixed definition); for 2024, a
look-back back to 2020 (four years) instead of three (0.999); HS6 products
new to the country in any destination, not product-destination lines (0.93).
The choice of definition does not drive any result below.

## 3. Results

### Coverage

All 135 countries have a value. The smallest bases are thin: Guinea-Bissau
has 57 active lines in 2022 and 70 in 2023, Chad 149 and 151, Timor-Leste,
the Central African Republic, Burundi and the Gambia under 350. For these,
a share moves by several points on a handful of shipments.

| Quartile (log GDP per head) | Countries | GDP per head (PPP) | With value | Median entry share | Median at USD 100,000 | Median one-year survival | Median exit rate 2023 | Median active lines 2023 |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Q1 | 34 | 1,067 to 6,194 | 34 | 22.9% | 13.5% | 0.18 | 0.42 | 1,190 |
| Q2 | 33 | 6,559 to 17,087 | 33 | 14.7% | 7.7% | 0.25 | 0.25 | 6,873 |
| Q3 | 33 | 17,246 to 40,846 | 33 | 11.6% | 5.3% | 0.28 | 0.19 | 11,591 |
| Q4 | 33 | 41,161 to 139,593 | 33 | 5.2% | 2.4% | 0.26 | 0.11 | 85,460 |

Cuba and Venezuela have values (17.8% and 26.2%) and no income figure.
Coverage is complete in every quartile, as the sweep simulated.

### Rank stability

| Comparison | Spearman (n 135) |
| --- | ---: |
| USD 10,000 against USD 100,000, two-year mean | 0.986 |
| USD 10,000 against USD 100,000, t = 2023 | 0.983 |
| USD 10,000 against USD 100,000, t = 2024 | 0.971 |
| t = 2023 against t = 2024, USD 10,000 | 0.910 |
| t = 2023 against t = 2024, USD 100,000 | 0.919 |

The row is stable. The stability is part of the problem found below: what is
stable is the size of the export basket.

### One-year survival of 2023 entries

Of all 2023 entries in the frame, 26.5% are active again in 2024 (pooled).
Per country the median is 0.248 (10th percentile 0.109, 90th 0.318); 0.345
if any positive export in 2024 counts; 0.256 at USD 100,000.

Survival runs against entry: Spearman -0.54 between the entry share and the
survival of those entries. Survival correlates 0.45 with log GDP per head.
The entry share correlates 0.86 with the exit share (lines active in 2022
with zero exports in 2023). Countries that start many lines are the countries
that drop many lines: the row reads churn.

### Redundancy

Entry share (two-year mean, USD 10,000) against the latest published raw
values:

| Row | Dimension | n | Spearman |
| --- | --- | ---: | ---: |
| `new_export_products_rate` | Adaptability | 135 | -0.54 |
| `export_diversification` (lower = more diversified) | | 135 | 0.74 |
| `resident_patents_per_million` | Experimentation | 119 | -0.74 |
| `resident_trademarks_per_million` | Experimentation | 120 | -0.71 |
| `resident_industrial_designs_per_million` | Experimentation | 115 | -0.67 |
| `new_repositories_per_million` | Experimentation | 132 | -0.73 |
| `early_stage_entrepreneurial_activity` | Experimentation | 16 | 0.55 |
| `failure_tolerance` | Experimentation | 16 | -0.25 |
| `insolvency_efficiency` | Experimentation | 82 | -0.47 |
| `economic_complexity` (not asked; for reference) | Building | 130 | -0.91 |
| Active lines in 2022 (basket size) | | 135 | -0.93 |

No scored row passes the 0.85 line, so the sweep's redundancy rule does not
make it a check. Two facts matter more. First, the sign against
`new_export_products_rate` is negative: the countries that start the most
lines are the ones that least often reach comparative advantage in new
products. Second, the row is close to an inverse of basket size (-0.93) and
of economic complexity (-0.91). Log basket size explains 86% of the variance
of the log entry share (OLS slope -0.35).

### Income (reported, not used: D118)

Spearman with log GDP per head: -0.76 (n 133) at USD 10,000, -0.73 at USD
100,000; -0.75 for 2023 and -0.74 for 2024 alone. The sweep expected a weak
or negative correlation; it is strongly negative. Under D118 this decides
nothing. It explains why the row would raise Q1 confidence, and it is the
same mechanism as the basket-size result.

### Re-export hubs

The file has no domestic-exports series. I used the D149 proxy at line level:
an entry counts as "net exporter" when the country exports more of that HS6
product, to all partners in year t, than it imports.

| Country | Entry share (gross) | Rank | Net exporter variant | Rank | Share of entries kept |
| --- | ---: | ---: | ---: | ---: | ---: |
| Singapore | 6.5% | 108 | 1.7% | 122 | 0.26 |
| United Arab Emirates | 5.3% | 115 | 1.2% | 132 | 0.23 |
| Netherlands | 3.3% | 131 | 1.5% | 130 | 0.43 |
| Panama | 17.3% | 51 | 2.8% | 90 | 0.16 |
| Belgium | 4.4% | 123 | 1.6% | 127 | 0.36 |
| Switzerland | 4.7% | 119 | 1.6% | 128 | 0.33 |
| Malaysia | 7.4% | 102 | 2.8% | 92 | 0.38 |
| Kazakhstan | 26.7% | 19 | 4.9% | 54 | 0.18 |
| Kyrgyzstan | 25.6% | 24 | 4.7% | 57 | 0.18 |
| Georgia | 21.3% | 32 | 4.1% | 63 | 0.19 |
| Armenia | 18.1% | 43 | 5.3% | 50 | 0.29 |
| Senegal | 25.0% | 26 | 4.7% | 58 | 0.19 |
| Cyprus | 17.9% | 48 | 3.4% | 72 | 0.19 |
| Frame | | | | median move 10, 90th percentile 27 | median 0.34 (quartiles 0.28 to 0.42) |

The gross and net variants order the frame at 0.92. The classic hubs rank low
on gross already, because their bases are large, so the hub test as D149 ran
it passes trivially. The problem is wider: across the frame only a third of
entries are in products the country net-exports (D149's four-digit test kept
three quarters). Most entries are goods passing through.

The new hubs are the transit routes to Russia after 2022. Entries by partner
(2023, USD 10,000): Kyrgyzstan's largest partners for entries are Russia
(177), Belarus (102) and Kazakhstan (77); Armenia's are Russia (148) and
Belarus (65); the United Arab Emirates opened 193 new lines to Russia and
none survived into 2024. On the other side, Germany's largest partner for
entries is Kyrgyzstan (183 lines) and Kazakhstan (90). These are sanctions
routing, not experimentation. Panama (rank 51 to 90), Kazakhstan (19 to 54),
Kyrgyzstan (24 to 57), Georgia (32 to 63) and Senegal (26 to 58, the
regional port for the Gambia, Mali and the Guineas) move by more than the
90th percentile.

### Collapse and restart

The top of the ranking is the poorest and smallest exporters. Their one-year
survival is low and their exit rate is about half their base every year. By
HS chapter, entries in every country inspected are led by chapter 84
(machinery), then 85, 87 and 90: machinery, electrical goods, vehicles and
instruments that most of these economies do not make.

| Rank | Country | Entry share | Active lines 2022 | Survival | Exit 2023 | Reading |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | Guinea-Bissau | 59.3% | 57 | 0.23 | 0.44 | Noise: 31 entries on 57 lines; fish and fruit to Portugal, a few to Liberia and the Netherlands |
| 2 | Sierra Leone | 43.5% | 906 | 0.24 | 0.53 | Mixed: 122 of 422 entries to France, 56 of them survive; the rest churn |
| 3 | Central African Republic | 39.8% | 253 | 0.04 | 0.51 | Noise: 120 entries, almost none survive; partners include Palestine |
| 4 | Chad | 37.7% | 149 | 0.10 | 0.55 | Noise and fragility: 59 entries, exports swing (2024 at 0.73 of 2022) |
| 5 | Guinea | 35.9% | 473 | 0.21 | 0.50 | Noise: machinery and vehicles to Mali and the United States |
| 6 | Liberia | 34.1% | 481 | 0.11 | 0.54 | Noise: 2023 share 46%, 2024 share 22% |
| 7 | Mauritania | 33.4% | 843 | 0.17 | 0.46 | Mostly noise; some fish lines to Senegal survive |
| 8 | Angola | 33.0% | 1,979 | 0.18 | 0.41 | Re-export of machinery to Portugal, the DR Congo and Namibia; 2 of 39 to Portugal survive |
| 9 | Gambia | 32.4% | 332 | 0.17 | 0.52 | Noise and transit to Senegal and Mali |
| 10 | Mozambique | 31.2% | 2,207 | 0.20 | 0.45 | Transit to Zimbabwe, Zambia and South Africa |

Also in the top 25: Mali (11th; 2023 share 47.6%, 2024 share 14.7%,
survival 0.04, exports fell by half: a collapse), Burundi (12th; survival
0.06, exports fell to 0.36 of 2022), Kazakhstan (19th), Venezuela (21st;
exports at 0.26 of their five-year peak, a collapse and restart), Côte
d'Ivoire (22nd), Kyrgyzstan (24th). The countries whose high values read
as experimentation are few: Kazakhstan (survival 0.41, the highest in the
frame) and Uzbekistan (21.1%, survival in the top quartile) show entries that
last, but their partners are mainly Russia, Belarus and their neighbours,
which mixes real new trade with transit.

### Face validity

Top ten: Guinea-Bissau, Sierra Leone, Central African Republic, Chad, Guinea,
Liberia, Mauritania, Angola, Gambia, Mozambique.

Bottom ten (from 126th): Spain, Sweden, France, United Kingdom, Japan,
Netherlands, United States, Italy, China, Germany.

Brazil is 104th (7.3%). As a reading of "how much does this economy try",
the order is inverted: the economies that trial most products in most markets
rank last, because a share over a large base is mechanically small, and the
fragile economies rank first, because a share over a small, unstable base is
mechanically large.

### Size-controlled variants (not proposed)

| Variant | Spearman with basket size | Spearman with log GDP | Top of ranking |
| --- | ---: | ---: | --- |
| Entry value over total exports | -0.70 | -0.61 | Central African Republic, Mozambique, Burundi, Liberia, Cyprus |
| Net entry (entries minus exits) | 0.55 | 0.49 | Guinea-Bissau, Kazakhstan, China, Albania, El Salvador |
| Surviving entries over active lines | -0.68 | -0.54 | Kazakhstan, Guinea-Bissau, Sierra Leone, Azerbaijan, Uzbekistan |
| Residual of log share on log basket size | -0.03 | -0.06 | Egypt, Kazakhstan, Côte d'Ivoire, Sierra Leone, Angola |

Only the residual removes size, and it is a model, not a published value; its
top is again transit and resource economies. None of these is a construct
the sweep wrote before the values, and choosing one now would be choosing a
row by its numbers.

## 4. Verdict

**Reject.** The construct was attempts and tolerated failure in the open
economy. The value measures basket size and churn: log basket size explains
86% of it, it moves with the exit rate at 0.86, the attempts it counts
survive less where it is high (-0.54), two thirds of entries are in goods
the country imports more of than it exports, and its top ten are the
smallest and most fragile exporters in the frame while its bottom ten are
the largest trading economies. The re-export test, which the classic hubs
pass only because their bases are large, fails for the transit routes to
Russia and for the West African ports.

Not a scored row: the construct fails, so D118 gives no route in, and the
row would not need a decision entry, an adapter or a version. Not a D60
check: a check is a real reading held out of the score for a stated reason,
and here a high value means fragility or transit, the reverse of what the
name says; publishing it beside Experimentation would invite that misreading.
Redundancy is not the reason: no scored row is above 0.85.

What would reopen it: a definition written as a construct before values that
counts entries that survive at least two years, over a basket-independent
base, from a source with domestic exports separate from re-exports. That
needs the 2010 to 2019 file for the look-back and survival windows, and
still has no answer to transit. The sweep's simulated O1 gain (0.438) does
not hold, because it assumed the row is admitted.

## 5. Reproduction

Scripts under
`/private/tmp/claude-501/-Users-mz-Dev-Envisioning/dd92a19c-aeec-4b12-8fe4-18abfcd37581/scratchpad/exp112/scripts/`,
run with `python3 -I <script> <data path> ...`, standard library only:
`pass1.py` (one pass, per-country counts at both thresholds, about 150 s and
400 MB), `analyse.py` (coverage, stability, survival, redundancy, hubs,
table), `extra.py` (size-controlled variants), `pass2.py` (entries by
partner and HS chapter for 26 countries). Outputs: `exp112/meta/pass1.json`,
`pass1_report.json`, `pass2.json`. Income is `income` in
`data/out/diagnostics.json` (133 countries); indicator values are `raw` in
`data/out/indicators/<id>.json` at dataset 10.0.0.
