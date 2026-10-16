# The National Capability Benchmark in two pages

*Dataset 9.3.0, generated 2026-10-03*

## 1. The claim under test

A country's wealth and capability are different. Most international indices measure income, comfort, competitiveness or governance, and often capture much the same thing. The National Capability Benchmark (NCB) tests whether a country's ability to anticipate, act, coordinate, learn, experiment, adapt, build and sustain shared purpose is separate from its income and observable. No indicator is chosen for its correlation with income, so the test can fail.

The claim comes in two strengths. The strong claim is that capability is separate from wealth, so the nine capabilities do not simply follow income. The weaker claim is that countries at the same income have different capability shapes, so a profile says something income does not. If both fail, the nine collapse into one factor that tracks GDP per head.

## 2. The test and what it reads today

Over the 115 countries with all nine capabilities scored, one shared factor carries 49.4% of the variation. The same number of unrelated capabilities measured on 115 countries would give 16.1% by chance, and 17.7% in 19 draws out of 20. So the capabilities do move together, and 50.6% of the variation sits outside that one factor. Across the 115 of those countries with an income figure, the shared factor correlates 0.81 with log GDP per head, so income accounts for 66% of it. The shared factor looks like income. What the benchmark can add beyond income sits in the other 50.6% of the variation and in how a country's capabilities differ from each other.

Across 33 dataset releases the share has run from 48.5% to 70.4%. The largest move between two releases came at dataset 7.0.0, from 60.4% on 33 countries to 49.8% on 33.

Take out of each capability the part its income predicts, and the leftovers still move together. Across the 115 countries with all nine, one factor carries 30.9% of what is left, where unrelated leftovers would give 16.2% by chance and 17.7% in 19 draws out of 20. It runs mostly through Anticipation, Learning, Trust, Coordination and Experimentation.

The strong claim, that capability is separate from wealth, does not hold for what the nine capabilities share: that shared part is mostly income. The weaker claim holds on this data. Countries at the same income have different capability shapes, and the shapes are organized beyond chance, so a capability profile carries information that income does not. The order of the leftovers mostly survives indicator changes, so the shapes are not only a product of which indicators were chosen. The margin over chance is narrow, 22.8% against 19.4%, so this is the reading most likely to change as countries are added.

For the typical country, income accounts for 32.8% of how far its profile sits from the average profile, and 24.5% on average across 115 countries, pulled down by countries the income line misses by more than the average profile does. Little of a capability profile is income.

All of it rests on 115 countries with all nine capabilities scored. At that size a handful of countries can move any of these numbers, so each one is a hint a wider country set could overturn. No country's own residual is published while the layer is under review.

## 3. What the instrument is

The benchmark scores 125 countries on nine capabilities: Anticipation, Agency, Coordination, Trust, Learning, Experimentation, Adaptability, Building and Shared Purpose. Each score runs from 0 to 100 on a scale all 125 countries set together. Beside it sits a confidence from 0 to 1, which says how much evidence the score rests on, and the two are never combined. The nine are never summed: there is no overall score and no ranking.

The scores rest on 34 indicators from public sources, and 18 more are declared gaps, things the benchmark sets out to measure that no open dataset covers yet. Every observation carries its source, year and address. The published data is under CC BY 4.0 and the code under the MIT license, and every methodological choice is recorded with what would overturn it.

## 4. What it is good for, and what it is not

It is built for description: one country's nine scores read beside the countries nearest it in income, each with the evidence behind it. It does not rank countries, set targets or give policy advice. A high score is not a model to copy, because mechanisms depend on local conditions.

Three of the nine track income at or above r 0.70: Anticipation (0.86), Experimentation (0.72) and Learning (0.71). On those, a score says much of what GDP per head already says, and the benchmark publishes that beside the number.

Four of the nine rest on thin evidence, on average across countries: Coordination (0.37), Trust (0.40), Experimentation (0.32) and Shared Purpose (0.32). That is a finding about what public data can see, not a gap to hide, and those scores are read with care.

## 5. Where it stands and what it needs

The benchmark is a prototype. Envisioning builds it with its own resources, and it asks for no money. Everything is open: the data, the code, the decision record and the known limits.

It needs an outside review of the residual method. The country-by-country reading of what is left after income stays offline until someone outside the project has reviewed it. The questions are set: whether a residual can be read as a second capability score or only as a different shape at the same income, whether fitting the income line without the country being read should replace the fit on all of them, and whether a weak fit should withhold its residuals.

It needs open data partners. The 18 declared gaps, and the evidence grid that documents what countries delivered where no dataset exists, close only when a comparable series or a sourced record is published openly. One series closes a gap for every country at once.

## 6. Read further

- [Thesis](https://ncb.envisioning.com/thesis): the argument and the computed verdict
- [Diagnostics](https://ncb.envisioning.com/diagnostics): every figure with its null and the rule that reads it
- [Brazil's capability map](https://ncb.envisioning.com/brasil/mapa): in Portuguese, Brazil against its income peers
- [The data](https://github.com/envisioning/national-capability-benchmark/tree/main/data/out): every published file, CC BY 4.0

---

*Computed from dataset 9.3.0: data/out/diagnostics.json (diagnostics.factorStructure, diagnostics.residualStructure) and data/out/factor-history.json. The readings are D137 and D138; the brief is D163.*
