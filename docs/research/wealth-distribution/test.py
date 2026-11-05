#!/usr/bin/env python3
"""Correlate within-country inequality with the nine capability scores.

Usage: test.py <ncb repo> <fetch.py output dir>

Standard library only. Prints aggregates and no country value. Positive r on a
top share or the Gini means more unequal countries score higher.
"""
import collections, csv, glob, json, math, re, statistics as st, sys

REPO, WID = sys.argv[1], sys.argv[2]
DIMS = 'anticipation agency coordination trust learning experimentation adaptability building shared_purpose'.split()
countries = {}
for f in glob.glob(f'{REPO}/data/out/countries/*.json'):
    c = json.load(open(f))
    countries[c['country']['iso3']] = c['country']
print('dataset', c['version'], 'countries', len(countries))
iso_map = json.load(open(f'{WID}/iso_map.json'))

gdp = {}
for r in json.load(open(f'{REPO}/data/observations/worldbank.json'))['observations']:
    if r.get('indicatorId') == '__context__NY.GDP.PCAP.PP.KD' and r.get('value') is not None:
        if r['iso3'] not in gdp or r['year'] > gdp[r['iso3']][0]:
            gdp[r['iso3']] = (r['year'], r['value'])
gini = {v['iso3']: v['raw'] for v in json.load(open(f'{REPO}/data/out/indicators/income_inequality.json'))['values'] if not v['outOfFrame']}
ts = open(f'{REPO}/packages/core/src/model/country-groups.ts').read()
region = dict(re.findall(r"([A-Z]{3}): \['(\w+)', '\w+'\]", ts))

wealth, sources = {}, {}
for iso, a2 in iso_map.items():
    latest = {}
    for r in csv.DictReader(open(f'{WID}/WID_data_{a2}.csv'), delimiter=';'):
        if r['variable'] == 'shweal992j' and r['country'] == a2 and r['percentile'] in ('p99p100', 'p90p100', 'p0p50'):
            y = int(r['year'])
            if r['percentile'] not in latest or y > latest[r['percentile']][0]:
                latest[r['percentile']] = (y, float(r['value']) * 100)
    if len(latest) == 3:
        wealth[iso] = latest
    for r in csv.DictReader(open(f'{WID}/WID_metadata_{a2}.csv'), delimiter=';'):
        if r['variable'] == 'shweal992j' or (r['variable'] == 'shweal' and r['age'] == '992' and r['pop'] == 'j'):
            text = re.sub(r'\[/?URL[^\]]*\]|https?://\S+', ' ', r['source'])
            sources[iso] = re.sub(r'\s+', ' ', text)[:170]
            break
print('wealth countries', len(wealth), 'years', dict(collections.Counter(v['p90p100'][0] for v in wealth.values())))
by_source = collections.defaultdict(set)
for iso, s in sources.items():
    by_source[s].add(iso)
note_only = max(by_source.values(), key=len)
own_source = set(wealth) - note_only
print('source: imputation note leads', len(note_only), 'country-specific', len(own_source))


def pearson(a, b):
    ma, mb = sum(a) / len(a), sum(b) / len(b)
    sa = math.sqrt(sum((x - ma) ** 2 for x in a))
    sb = math.sqrt(sum((x - mb) ** 2 for x in b))
    return sum((x - ma) * (y - mb) for x, y in zip(a, b)) / (sa * sb)


def solve(X, y):
    k = len(X[0])
    A = [[sum(r[i] * r[j] for r in X) for j in range(k)] + [sum(r[i] * v for r, v in zip(X, y))] for i in range(k)]
    for i in range(k):
        p = max(range(i, k), key=lambda q: abs(A[q][i]))
        A[i], A[p] = A[p], A[i]
        for q in range(k):
            if q != i:
                f = A[q][i] / A[i][i]
                A[q] = [u - f * v for u, v in zip(A[q], A[i])]
    return [A[i][k] / A[i][i] for i in range(k)]


def residual(y, X):
    b = solve(X, y)
    return [v - sum(p * q for p, q in zip(r, b)) for r, v in zip(X, y)]


def partial(a, b, X):
    return pearson(residual(a, X), residual(b, X))


def ci(r, n, controls):
    z, se = math.atanh(r), 1 / math.sqrt(n - controls - 3)
    return math.tanh(z - 1.96 * se), math.tanh(z + 1.96 * se)


def bonferroni(n, controls, tests=8):
    return math.tanh(2.734 / math.sqrt(n - controls - 3))


def score(i, d):
    D = countries[i]['dimensions'][d]
    return None if D.get('belowCoverageFloor') else D.get('score')


def shared_purpose_without_gini(i):
    rows = countries[i]['dimensions']['shared_purpose']['indicators']
    v = [x['normalized'] for x in rows if x.get('normalized') is not None and x['indicatorId'] != 'income_inequality']
    return sum(v) / len(v) if v else None


def mean_of_eight(i):
    v = [x for x in (score(i, k) for k in DIMS[:-1]) if x is not None]
    return sum(v) / len(v) if len(v) >= 7 else None


def outcome(i, d):
    return shared_purpose_without_gini(i) if d == 'sp_no_gini' else mean_of_eight(i) if d == 'mean8' else score(i, d)


def table(label, x_of, subset=None, with_gini=True):
    print('==', label)
    for d in DIMS + ['sp_no_gini', 'mean8']:
        rows = []
        for i in countries:
            if subset is not None and i not in subset:
                continue
            x, y = x_of(i), outcome(i, d)
            if x is not None and y is not None and i in gdp:
                rows.append((i, x, y, math.log(gdp[i][1])))
        n = len(rows)
        a, b, logs = [r[1] for r in rows], [r[2] for r in rows], [r[3] for r in rows]
        regs = sorted({region[r[0]] for r in rows})[1:]
        Xg = [[1, l] for l in logs]
        Xr = [[1, r[3]] + [1.0 if region[r[0]] == q else 0.0 for q in regs] for r in rows]
        raw, pg, pr = pearson(a, b), partial(a, b, Xg), partial(a, b, Xr)
        lg, hg = ci(pg, n, 1)
        lr, hr = ci(pr, n, len(regs) + 1)
        line = f'{d:16s} n={n:3d} raw={raw:+.2f} gdp={pg:+.2f} [{lg:+.2f},{hg:+.2f}] gdp+region={pr:+.2f} [{lr:+.2f},{hr:+.2f}]'
        if with_gini:
            keep = [r for r in rows if r[0] in gini]
            aa, bb = [r[1] for r in keep], [r[2] for r in keep]
            pz = partial(aa, bb, [[1, r[3], gini[r[0]]] for r in keep])
            lz, hz = ci(pz, len(keep), 2)
            line += f' gdp+gini={pz:+.2f} [{lz:+.2f},{hz:+.2f}]'
        print(line)


top10 = lambda i: wealth[i]['p90p100'][1] if i in wealth else None
top1 = lambda i: wealth[i]['p99p100'][1] if i in wealth else None
bottom50 = lambda i: wealth[i]['p0p50'][1] if i in wealth else None
gini_of = lambda i: gini.get(i)

table('income Gini', gini_of, with_gini=False)
table('top 10% wealth share', top10)
table('top 1% wealth share', top1)
table('bottom 50% wealth share', bottom50)
table('top 10%, country-specific source', top10, own_source)
table('top 10%, imputation note leads', top10, note_only)

ids = [i for i in wealth if i in gini and i in gdp]
print('n', len(ids), 'top10~gini', round(pearson([top10(i) for i in ids], [gini[i] for i in ids]), 2),
      'top1~gini', round(pearson([top1(i) for i in ids], [gini[i] for i in ids]), 2),
      'bottom50~gini', round(pearson([bottom50(i) for i in ids], [gini[i] for i in ids]), 2),
      'top10~loggdp', round(pearson([top10(i) for i in ids], [math.log(gdp[i][1]) for i in ids]), 2))
for name, group in (('own', own_source), ('note', note_only)):
    ii = [i for i in group if i in gini]
    print(name, 'top10~gini', round(pearson([top10(i) for i in ii], [gini[i] for i in ii]), 2), 'n', len(ii),
          'sd top10', round(st.pstdev([top10(i) for i in group]), 1))
v = sorted(top10(i) for i in wealth)
print('top10 min/median/max', round(v[0], 1), round(st.median(v), 1), round(v[-1], 1), 'bottom50 below zero', sum(bottom50(i) < 0 for i in wealth))
print('bonferroni |r| for 8 tests: n=133 gdp', round(bonferroni(133, 1), 3), 'n=133 gdp+region', round(bonferroni(133, 7), 3), 'n=127 gdp', round(bonferroni(127, 1), 3), 'n=127 gdp+region', round(bonferroni(127, 7), 3))
pairs = sorted((gdp[i][1], i) for i in wealth if i in gdp)
for q in range(4):
    group = [i for _, i in pairs[q * len(pairs) // 4:(q + 1) * len(pairs) // 4]]
    rows = [(top10(i), mean_of_eight(i)) for i in group if mean_of_eight(i) is not None]
    print(f'income quartile {q + 1}: top10~mean8 r={pearson(*zip(*rows)):+.2f} n={len(rows)}')
