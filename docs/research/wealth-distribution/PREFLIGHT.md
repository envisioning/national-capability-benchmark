# Wealth distribution against capability: preflight

Date: 2026-11-05. Dataset 10.1.1, 135 countries. WID bulk file last modified
2026-10-30. Track: value preflight on a source that fails the open data test.
Nothing is wired: no registry row, check, adapter, observation or score changed.

"Wealth" elsewhere in this project means income per head, as in the wealth-proxy
test of D42. This memo asks a different question: how wealth is divided inside a
country.

## 1. Verdict

**Inequality reads adverse to capability, weakly. Wealth shares add little to the
income Gini.** More unequal countries score lower, and most of the gap goes when
income per head and region are held constant.

**Do not wire WID, as a row or as a check.** Two independent reasons:

1. WID fails D154 (a) on the published terms (section 2).
2. For most of the frame the wealth share is built from income inequality, so it
   does not measure a separate thing (section 3).

The benchmark keeps `income_inequality` as its only reading of distribution. It
has no reading of wealth distribution, and this memo does not add one.

## 2. Licence: fails D154 (a)

The data download needs no account. No published term allows republishing.
Read on 2026-11-05:

| Place | What it says on reuse |
| --- | --- |
| Bulk file `README.md` | Nothing |
| `wid.world/data/` | Nothing |
| `wid.world/mentions-legales/` | Privacy and hosting only |
| `wid.world/methodology/` | Nothing, whole page searched |
| `wid.world/data-quality/` | Nothing, whole page searched |
| `world-inequality-database/wid-world` on GitHub | No licence file detected, README states no term |
| `wid` R package | MIT, on the code only |

D154 (a) says a term that is silent on redistribution fails, and the project does
not write to ask. D187 applied the same test to the Joint EVS/WVS table. Our World
in Data republishes WID series and says third-party data stays under the original
authors' terms, so its copy does not open a route.

For this reason the repository holds aggregates only. No WID value by country is
in this memo, in `data/` or in the scripts. Whether an aggregate correlation may
stay in a public memo is a reading of D154 by the agent, for the owner to overrule.

**Overturned by.** A term published by the World Inequality Lab that allows
republishing derived values under CC BY 4.0. The measurement problem of section 3
would still stand.

## 3. Measurement: most values derive from income inequality

Technical Note 2021/16 (Bajard, Chancel, Moshrif, Piketty) states the method. A
country without its own wealth estimates gets a weighted average of observed
countries' wealth distributions. The weight is a Gaussian kernel on rank in the top
10% income share. A correction against the Forbes rich list then rescales the top.

Across the 135 countries, the source field of `shweal992j` gives:

| Source field | Countries | Top 10% share against Gini |
| --- | ---: | ---: |
| Leads with Note 2021/16 | 101 | r 0.71 (n 93) |
| Leads with a country or European study | 34 | r 0.63 (n 34) |

The split is a reading of the source text and not a published flag, and a study in
the source field does not prove that every year is observed. The `data_quality`
column reads 0 on every 2024 row, so it cannot separate them. Of the 34, most are
European, so the test on them is thin in the group that has the best data.

Spread is narrow where values are modelled: the standard deviation of the top 10%
share is 4.7 points in the first group and 7.6 in the second. Across all 135 the
share runs from 45.5 to 85.7, median 60.6. The bottom 50% share is below zero in 5
countries, because net debts exceed assets, so a ratio on it is not usable.

## 4. Results

Series: `shweal992j`, net personal wealth, adults, equal-split, latest year (2024
in all 135). Income Gini: the `income_inequality` row. GDP: `NY.GDP.PCAP.PP.KD`, in
logs. Region: `COUNTRY_GROUPS` (D190). Each cell is Pearson r. A negative r means
more unequal countries score lower. Brackets are 95% intervals by Fisher z.

| Dimension | Gini, GDP held | Gini, GDP and region held | Top 10%, GDP held | Top 10%, GDP and region held | Top 10%, GDP and Gini held |
| --- | ---: | ---: | ---: | ---: | ---: |
| Anticipation | -0.27 [-0.43, -0.10] | -0.17 [-0.34, +0.01] | -0.27 [-0.42, -0.11] | -0.19 [-0.35, -0.02] | -0.15 [-0.32, +0.02] |
| Agency | -0.06 | +0.04 | -0.04 | +0.04 | +0.03 |
| Coordination | -0.07 | -0.03 | -0.03 | -0.01 | -0.00 |
| Trust | +0.11 | +0.07 | -0.03 | -0.05 | -0.13 |
| Learning | -0.02 | -0.10 | -0.14 | -0.16 | -0.15 |
| Experimentation | -0.05 | +0.02 | -0.03 | +0.03 | +0.00 |
| Adaptability | -0.30 [-0.45, -0.14] | -0.17 [-0.34, +0.01] | -0.29 [-0.44, -0.12] | -0.20 [-0.36, -0.03] | -0.15 [-0.31, +0.03] |
| Building | -0.02 | +0.17 | -0.01 | +0.10 | -0.01 |
| Mean of these 8 | -0.15 [-0.32, +0.03] | -0.02 [-0.20, +0.16] | -0.18 [-0.34, -0.00] | -0.09 [-0.26, +0.09] | -0.11 [-0.28, +0.07] |

Raw r for the top 10% share runs from -0.06 (Coordination) to -0.29 (Adaptability),
and for the Gini from -0.12 (Trust) to -0.42 (Adaptability). The mean of the 8 is
the agent's calculation for this memo. The benchmark publishes no composite (D1).

What the table supports:

- **Direction.** Adverse in raw form on all 8 for both measures.
- **Income explains most of it.** With GDP held, only Anticipation and Adaptability
  clear a Bonferroni bar for 8 tests, which is |r| 0.24 at these sample sizes.
- **Region explains more.** With region also held, no dimension clears that bar on
  either measure. Unequal countries cluster in southern Africa and Latin America,
  and this test cannot separate inequality from what else those regions share.
- **Wealth adds little to income.** With GDP and the Gini held, the top 10% share
  clears no interval on any of the 8. Top 10% against the Gini is r 0.64, top 1%
  r 0.61, and the bottom 50% r -0.27.
- **The top 1% share reads the same.** Bottom 50%: no link, apart from Adaptability
  at +0.21 [+0.04, +0.37] with GDP held, which does not clear the Bonferroni bar.
- **No link inside income bands on the top 10% share.** Against the mean of 8 by
  income quartile: +0.05, -0.16, +0.09, -0.31 (n 32 to 33). The top quartile reads
  highest, and one of four at this size does not carry a claim.

## 5. Shared purpose is not evidence

Shared purpose reads -0.74 against the Gini and -0.52 against the top 10% share.
Both are mechanical. The Gini is a scored row there, and D187 left 125 of the 135
scored on tax revenue and Gini alone. Take the Gini out, and the remaining score
reads -0.02 against the Gini and -0.09 against the top 10% share. Do not quote this
dimension as a finding on inequality.

With GDP and region held, the remaining tax row reads +0.23 [+0.06, +0.40] against
the Gini, so within a region more tax goes with more inequality, not less. The two
rows of this dimension do not point the same way, a fact for the next owner of
Shared purpose. This memo proposes no change.

## 6. Limits

- A cross-section in one year. It says nothing on cause, in either direction.
- Scores carry their own artefacts (`docs/KNOWN-ARTEFACTS.md`). Trust has no social
  row since D187, and thin dimensions move on one row.
- The World Bank Gini mixes income and consumption surveys, as far as the agent
  knows; the row's definition says disposable income. This was not checked in the
  source metadata, and it may explain the lowest Gini in the frame (India, 23.0).
- Fisher intervals assume near-normal errors, and countries are not independent
  draws.

## 7. Reproduce

Both scripts use the standard library. `fetch.py` reads 270 country files from the
887 MB WID zip with range requests, about 455 MB, and keeps only wealth rows.
Point its output outside the repository.

```
python3 -I docs/research/wealth-distribution/fetch.py . <empty dir>
python3 -I docs/research/wealth-distribution/test.py . <that dir>
```

WID updates in place, so a later file can restate these figures.
