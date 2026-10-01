# OpenAlex research citation impact

Task: Learning gap `research_citation_impact`, source memo in issue #23

Track: source-backed measurement

Status: wired (D124). 53 of 53 countries emitted. Retrieved 2026-10-01.

## Construct

Learning asks whether a country's systems absorb and produce knowledge. This
row observes one result of that: whether the research a country produces is
used by others, relative to what is normal in its field. It is an outcome
(class `O`), not a stock of spending, enrolment or researchers, and it is size
independent, so China and Haiti sit on one scale.

The value is the share of a country's articles and reviews, published 2019 to
2021, that OpenAlex places in the top 10% most cited for their subfield and
publication year (`citation_normalized_percentile.is_in_top_10_percent`),
divided by the same share across every work that has an institution country.
A work counts for every country any of its authors' institutions sits in
(whole counting). The window is pooled and stamped 2021, which gives citations
about four years to mature and lifts the smallest producer, Haiti, to 389
works.

Why a share of top-10% works and not mean FWCI: the API cannot average, only
count, so a mean needs every work paged; and a mean is set by single papers in
small producers. Why the ratio to the affiliated world: OpenAlex ranks each
work against a pool dominated by works with no affiliation and no citations,
so affiliated works sit near 17%, not 10%. Within one window the ratio is a
constant rescale and changes no score; it matters for any trend.

## Requests

Four calls cover the frame. All carry `corpus=core` explicitly, which is the
API default today. The adapter adds `mailto` from `OPENALEX_MAILTO` and sends
`OPENALEX_API_KEY` as a bearer token when set; neither is stored.

```text
# denominator: works with a percentile, grouped by institution country
https://api.openalex.org/works?filter=publication_year:2019-2021,type:article|review,citation_normalized_percentile.is_in_top_10_percent:true|false&group_by=authorships.institutions.country_code&per_page=200&corpus=core
# numerator: the top 10% of those
https://api.openalex.org/works?filter=publication_year:2019-2021,type:article|review,citation_normalized_percentile.is_in_top_10_percent:true&group_by=authorships.institutions.country_code&per_page=200&corpus=core
# affiliated-world baseline
https://api.openalex.org/works?filter=publication_year:2019-2021,type:article|review,citation_normalized_percentile.is_in_top_10_percent:true|false,authorships.institutions.country_code:!null&per_page=1&select=id&corpus=core
https://api.openalex.org/works?filter=publication_year:2019-2021,type:article|review,citation_normalized_percentile.is_in_top_10_percent:true,authorships.institutions.country_code:!null&per_page=1&select=id&corpus=core
```

A grouped page holds at most 200 countries. The adapter asserts that every
benchmark country is in both grouped results and counts any that is missing
with two per-country calls (`authorships.institutions.country_code:XX`). On
2026-10-01 none was missing; the smallest group returned in the denominator
was Palau, 68 works.

Totals on 2026-10-01: the denominator matched 18,982,148 works before
grouping, the numerator 2,232,615. The baseline is 2,050,741 top-10% works out
of 11,923,667 affiliated works with a percentile, a share of 17.20%.

Budget: the keyless allowance is $0.10 a day, and a list or grouped call costs
$0.0001 (one credit of 1,000), so a full fetch costs four credits. The help
centre (pricing and authentication pages, read 2026-10-01) recommends a free
API key for real use, which raises the daily budget tenfold, and no longer
documents a polite pool; the `mailto` is sent as a courtesy. Requests over
100 a second, or past the daily budget, answer 429.

## Pinning and drift

OpenAlex is a live database with no version parameter. Citations, percentiles
and affiliation parsing are recomputed continuously, so a value fetched today
cannot be fetched again later. The observation file pins what was read: under
`openalex` it holds every request, the retrieval date, the four totals and
each country's two counts, and the observations derive from those counts. A
rescore never touches the network. A refetch is an explicit
`pnpm bench openalex fetch` and logs what moved in `revisions.json`.

Drift is real and fast. Between a probe at about 09:43 UTC and the fetch at
09:45 UTC on the same day, the baseline top-10% count moved from 2,050,745 to
2,050,741, El Salvador's works from 1,833 to 1,829 and Nicaragua's from 1,962
to 1,961. No ratio moved at three decimals. Over months, as citations to 2021
works keep accruing, expect larger moves; that is why the window is old.

Licence: the OpenAlex pricing page says the data is released under a CC0
public-domain licence. Attribution is not required and is given.

## Coverage and values

53 of 53. Brazil is 0.602: 62,795 of 606,599 works in the top 10% (10.35%),
against 17.20% for the affiliated world. Brazil sits sixth from the bottom of
the income-adjusted residual (below).

Top five: Singapore 2.023, Netherlands 1.937, Estonia 1.913, Sweden 1.894,
Switzerland 1.842. Bottom five: Cuba 0.212, El Salvador 0.289, Paraguay 0.417,
Nicaragua 0.427, Venezuela 0.516.

Small producers, under 2,000 works in the window: Haiti 389, Honduras 1,493,
Dominican Republic 1,598, El Salvador 1,829, Nicaragua 1,961. No floor is
applied; every value is emitted.

## Findings, reported and not tests (local run on dataset 6.2.0)

- The row's normalised score correlates with log GDP per capita PPP at
  r = 0.588 (n 51; Cuba and Venezuela have no GDP context).
- Wealth-attribution delta: 0.063. Learning moves from r = 0.731 to 0.794
  against log income (Spearman 0.733 to 0.813, n 51).
- Learning's mean confidence rises from 0.495 to 0.586, and its observed rows
  from five to six of seven.
- No redundant pair. The strongest correlations with other rows are
  `interpersonal_trust` 0.799 (n 37), `sci_articles_per_million` 0.796,
  `secure_internet_servers` 0.697 and `researchers_per_million` 0.691, all
  under the 0.85 threshold.
- Highest above what income predicts: Rwanda, Ethiopia, Estonia, Haiti, South
  Africa, the Netherlands. Lowest: El Salvador, Paraguay, Japan, Turkey, Costa
  Rica, Brazil.

## Caveats

- **Whole counting** credits a co-authored paper fully to every country on it,
  which lifts small, well-networked systems. Counting only works with a single
  country (`countries_distinct_count:1`), 2019 to 2021, on 2026-10-01: Panama
  falls from 21.25% to 3.14% (39 of 1,243), Kenya from 19.83% to 5.94% (744 of
  12,518) and Estonia from 32.89% to 18.26% (649 of 3,555). Brazil falls less,
  from 10.35% to 7.36% (36,828 of 500,580). Several of the high residuals above
  are this effect.
- **Affiliation gaps.** Of the 18,982,148 articles and reviews with a
  percentile in the window, 11,923,667 carry an institution country, so 37%
  carry none. Missing affiliations thin small
  producers most; the issue memo flagged the Dominican Republic's count as low
  for its size, and this run did not check its affiliation parsing.
- **Percentile pool.** OpenAlex ranks against all works, affiliated or not, so
  the raw share is not 10% for the world. The ratio corrects the level, not
  any bias in which works lack affiliations.
- **Document types.** Articles and reviews only. Conference papers, which
  matter for computing-heavy systems such as Korea and Singapore, are out.
- **Drift**, above.

## Follow-up, not in scope

- Domestic-only share as a behavioural check under D60, beside this row. The
  numbers above show it is cheap to fetch.
- Fractional counting needs the OpenAlex snapshot rather than the API.
- Record the matching monthly snapshot date beside the API retrieval date.
- A trend on same-window ratios, never on a window younger than three years.

## Table

Ratio to the affiliated-world share of 17.20%, 2019 to 2021, retrieved
2026-10-01.

| iso3 | works | top 10% | share | ratio |
|---|---:|---:|---:|---:|
| SGP | 66,997 | 23,315 | 34.80% | 2.023 |
| NLD | 201,347 | 67,081 | 33.32% | 1.937 |
| EST | 10,798 | 3,552 | 32.89% | 1.913 |
| SWE | 134,307 | 43,739 | 32.57% | 1.894 |
| CHE | 158,183 | 50,111 | 31.68% | 1.842 |
| AUS | 338,492 | 106,651 | 31.51% | 1.832 |
| FIN | 68,649 | 21,503 | 31.32% | 1.821 |
| ARE | 28,293 | 8,696 | 30.74% | 1.787 |
| GBR | 667,807 | 204,270 | 30.59% | 1.778 |
| IRL | 52,932 | 15,698 | 29.66% | 1.724 |
| CAN | 364,522 | 97,709 | 26.80% | 1.559 |
| DEU | 530,251 | 139,738 | 26.35% | 1.532 |
| ISR | 69,429 | 18,131 | 26.11% | 1.518 |
| ZAF | 91,042 | 23,495 | 25.81% | 1.500 |
| CHN | 1,823,764 | 453,406 | 24.86% | 1.445 |
| USA | 2,149,459 | 524,402 | 24.40% | 1.419 |
| ESP | 379,540 | 89,710 | 23.64% | 1.374 |
| RWA | 2,886 | 661 | 22.90% | 1.332 |
| PRT | 106,052 | 23,385 | 22.05% | 1.282 |
| VNM | 53,607 | 11,427 | 21.32% | 1.239 |
| PAN | 3,633 | 772 | 21.25% | 1.236 |
| MYS | 117,762 | 24,765 | 21.03% | 1.223 |
| ETH | 29,527 | 6,206 | 21.02% | 1.222 |
| CHL | 65,860 | 13,751 | 20.88% | 1.214 |
| KOR | 276,393 | 55,717 | 20.16% | 1.172 |
| FRA | 447,728 | 90,204 | 20.15% | 1.171 |
| KEN | 25,165 | 4,990 | 19.83% | 1.153 |
| THA | 59,205 | 11,194 | 18.91% | 1.099 |
| HTI | 389 | 71 | 18.25% | 1.061 |
| PHL | 24,096 | 4,116 | 17.08% | 0.993 |
| POL | 220,217 | 34,242 | 15.55% | 0.904 |
| URY | 8,522 | 1,209 | 14.19% | 0.825 |
| IND | 605,690 | 85,204 | 14.07% | 0.818 |
| TUR | 292,415 | 38,415 | 13.14% | 0.764 |
| COL | 78,899 | 10,319 | 13.08% | 0.760 |
| JPN | 473,096 | 61,500 | 13.00% | 0.756 |
| ARG | 79,575 | 10,080 | 12.67% | 0.737 |
| MEX | 130,008 | 16,442 | 12.65% | 0.735 |
| IDN | 715,952 | 85,530 | 11.95% | 0.695 |
| CRI | 9,767 | 1,162 | 11.90% | 0.692 |
| GTM | 2,248 | 266 | 11.83% | 0.688 |
| DOM | 1,598 | 189 | 11.83% | 0.688 |
| PER | 36,229 | 3,981 | 10.99% | 0.639 |
| ECU | 35,794 | 3,802 | 10.62% | 0.618 |
| BOL | 4,270 | 451 | 10.56% | 0.614 |
| NGA | 93,597 | 9,783 | 10.45% | 0.608 |
| BRA | 606,599 | 62,795 | 10.35% | 0.602 |
| HND | 1,493 | 136 | 9.11% | 0.530 |
| VEN | 10,804 | 959 | 8.88% | 0.516 |
| NIC | 1,961 | 144 | 7.34% | 0.427 |
| PRY | 5,030 | 361 | 7.18% | 0.417 |
| SLV | 1,829 | 91 | 4.98% | 0.289 |
| CUB | 20,173 | 737 | 3.65% | 0.212 |
