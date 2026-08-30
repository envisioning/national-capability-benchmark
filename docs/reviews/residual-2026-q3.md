# Wealth residual review, 2026 Q3

This is the first review of the layer, written in the same change that created
the fixture. It records what the 0.1 method does and what the first live review
has to test. See D68 for the method and D65 for the promotion gate.

## What did we learn about the methodology?

Ordinary least squares of dimension score on log10 GDP per capita removes the
income pattern the mean of nine dimensions reproduces. It also introduces the
first modeling choice in the project, and two properties of that choice are
already visible. A country helps fit the line it is measured against, so China,
the largest positive residual, is understating itself by an unknown amount. And
where the fit is weak the residual repeats the score: Coordination and Shared
Purpose sit at r² 0.218 and 0.204, and their rank orders move 6.9 and 5.5 places
against country counts of 44 and 46.

Leave-one-out fitting is the named candidate for 0.2. It is not in 0.1 because
the published fit would then no longer be the fit that produced any single
residual, and the first version has to be inspectable before it is accurate.

## What did we learn about the data sources?

The layer adds no source. It reads the published index and the World Bank
context series `NY.GDP.PCAP.PP.KD`, which is already fetched and already
excluded from every score. Venezuela and Cuba carry no value in that series, so
they carry no residual at all. That is 2 of 52 countries with no reading, and it
is the same pair the GDP sensitivity test in the diagnostics already drops.

Coverage under the D45 floor also flows through: dimension fits run on 35 to 50
countries rather than on 52, and Trust at 35 is the thinnest.

## What did we learn about the reader?

Nothing yet. The layer is offline, there is no sandbox URL, and no reader has
seen a residual. The first reader question to test is whether a negative
residual is read as a fact about a fit or as a judgment about a country. The
layer has no user-facing copy and must not get one before that question has an
answer.

## Is the layer still on track for promotion?

It is not assessable after one quarter. The layer is provisional and offline,
and promotion needs three quarterly reviews plus an external reviewer who can
confirm that a residual is not read as a second capability score.

## What do we need to do next quarter?

Test leave-one-out fitting against the full-set fit and record whether outlier
residuals move by more than the standard error of the estimate. Decide whether a
weak fit should withhold its residuals rather than publish them with a label.
Then write the first post-run review that names findings rather than intentions.
