"""Agreement, pattern and spot-check draw for the codebook 1.3 pilot recode.

Inputs in this directory: coder-a.json, coder-b.json (merged batches),
bodies.json (the adjudicator's matching table), adjudicated.json (country
items after adjudication). Writes analysis.json.
"""
import json, math, random, sys, os

W = os.path.dirname(os.path.abspath(__file__))
REPO = "/Users/mz/Dev/Envisioning/ncb"
COUNTRIES = ["HTI", "VNM", "ARE", "NIC", "SGP", "NGA", "BRA", "GBR", "EST", "CHE"]
REGIME = {"HTI": 0, "VNM": 0, "ARE": 0, "NIC": 1, "SGP": 1, "NGA": 2, "BRA": 2, "GBR": 2, "EST": 3, "CHE": 3}
CLASS_NAME = {0: "closed autocracy", 1: "electoral autocracy", 2: "electoral democracy", 3: "liberal democracy"}


def load(name):
    return json.load(open(os.path.join(W, name)))


def alpha(pairs, metric="nominal"):
    vals = [v for p in pairs for v in p]
    n = len(vals)
    if len(set(vals)) < 2:
        return None
    d = (lambda x, y: 0.0 if x == y else 1.0) if metric == "nominal" else (lambda x, y: (x - y) ** 2)
    Do = sum(2 * d(a, b) for a, b in pairs) / n
    De = sum(d(x, y) for i, x in enumerate(vals) for j, y in enumerate(vals) if i != j) / (n * (n - 1))
    return 1 - Do / De if De else None


def boot(groups, metric="nominal", draws=2000, seed=7):
    """groups: list of lists of pairs, one list per country."""
    rng = random.Random(seed)
    out = []
    for _ in range(draws):
        s = [p for g in (rng.choice(groups) for _ in groups) for p in g]
        a = alpha(s, metric)
        if a is not None:
            out.append(a)
    if not out:
        return None
    out.sort()
    return [out[int(0.025 * len(out))], out[min(len(out) - 1, int(0.975 * len(out)))], len(out)]


def pct(pairs):
    return sum(a == b for a, b in pairs) / len(pairs)


def items(c):
    it = c["items"]
    i3 = it["I3"]
    r = "1" if i3["value"] == 1 else ("no_change" if i3.get("reason") == "no_change" else "0")
    return {"I1": it["I1"]["value"], "I2": it["I2"]["value"], "I3": i3["value"], "I3r": r,
            "I4": it["I4"]["value"], "score": c["score"]}


def spearman(x, y):
    def rank(v):
        o = sorted(range(len(v)), key=lambda i: v[i])
        r = [0.0] * len(v)
        i = 0
        while i < len(v):
            j = i
            while j + 1 < len(v) and v[o[j + 1]] == v[o[i]]:
                j += 1
            for k in range(i, j + 1):
                r[o[k]] = (i + j) / 2 + 1
            i = j + 1
        return r
    return pearson(rank(x), rank(y))


def pearson(x, y):
    mx, my = sum(x) / len(x), sum(y) / len(y)
    sxy = sum((a - mx) * (b - my) for a, b in zip(x, y))
    sx = math.sqrt(sum((a - mx) ** 2 for a in x))
    sy = math.sqrt(sum((b - my) ** 2 for b in y))
    return sxy / (sx * sy) if sx and sy else None


def main():
    A = {c["iso3"]: c for c in load("coder-a.json")["countries"]}
    B = {c["iso3"]: c for c in load("coder-b.json")["countries"]}
    assert set(A) == set(B) == set(COUNTRIES), (sorted(A), sorted(B))
    out = {"agreement": {}}
    for k, metric in [("I1", "nominal"), ("I2", "nominal"), ("I3", "nominal"), ("I3r", "nominal"),
                      ("I4", "nominal"), ("score", "interval")]:
        groups = [[(items(A[c])[k], items(B[c])[k])] for c in COUNTRIES]
        pairs = [g[0] for g in groups]
        out["agreement"][k] = {"alpha": alpha(pairs, metric), "pctAgree": pct(pairs),
                               "ci95": boot(groups, metric),
                               "disagree": [c for c, g in zip(COUNTRIES, groups) if g[0][0] != g[0][1]]}

    bodies = load("bodies.json")
    groups = {}
    for b in bodies:
        groups.setdefault(b["iso3"], []).append((b["coderA"] or 0, b["coderB"] or 0))
    pairs = [p for g in groups.values() for p in g]
    unit = {"n": len(pairs), "alpha": alpha(pairs), "pctAgree": pct(pairs),
            "ci95": boot(list(groups.values())),
            "disagree": [b["id"] for b in bodies if (b["coderA"] or 0) != (b["coderB"] or 0)],
            "listedByOneOnly": sum(1 for b in bodies if b["coderA"] is None or b["coderB"] is None)}
    both = [((b["coderA"]), (b["coderB"])) for b in bodies if b["coderA"] is not None and b["coderB"] is not None]
    codes = {}
    bq = [b for b in bodies if b["coderA"] == 1 and b["coderB"] == 1]
    for k in ("record", "product", "survived", "closedNoSuccessor"):
        ps = [(str(b["aBody"][k]), str(b["bBody"][k])) for b in bq]
        codes[k] = {"n": len(ps), "alpha": alpha(ps) if ps else None, "pctAgree": pct(ps) if ps else None,
                    "disagree": [b["id"] for b, p in zip(bq, ps) if p[0] != p[1]]}
    out["bodyAgreement"] = {
        "measure": "codebook 1.3 section 7: alpha nominal on meets-unit over matched bodies, unlisted counted 0",
        "unit": unit,
        "unitOnBodiesJudgedByBoth": {"n": len(both), "alpha": alpha(both) if both else None,
                                     "pctAgree": pct(both) if both else None, "note": "round 1's measure, printed only"},
        "bodyCodesOnBothQualifying": codes}

    adj = load("adjudicated.json")
    scores = {c: adj[c]["score"] for c in COUNTRIES}
    inc = {r["iso3"]: r["gdpPerCapita"] for r in json.load(open(f"{REPO}/data/out/diagnostics.json"))["income"]}
    xs = [REGIME[c] for c in COUNTRIES]
    ys = [scores[c] for c in COUNTRIES]
    lg = [math.log(inc[c]) for c in COUNTRIES]
    mean = {CLASS_NAME[k]: round(sum(scores[c] for c in COUNTRIES if REGIME[c] == k) /
                                 sum(1 for c in COUNTRIES if REGIME[c] == k), 1) for k in CLASS_NAME}
    from collections import Counter
    cnt = Counter(ys)
    out["pattern"] = {"scores": scores, "meanScoreByRegime": mean,
                      "spearmanWithRegimeClass": spearman(ys, xs), "stopThreshold": 0.8,
                      "pearsonWithLogGdpPerCapita": pearson(ys, lg), "spearmanWithGdpPerCapita": spearman(ys, lg),
                      "n": 10, "incomeNote": "printed, decides nothing (D117, D118)",
                      "gdpPerCapita": {c: inc[c] for c in COUNTRIES},
                      "ceilingCheck": ", ".join(f"{v} of 10 at {k}" for k, v in sorted(cnt.items())) +
                                      "; stop rule is 8 of 10 at one value"}

    # spot-check draw, the rule in FORESIGHT-REGISTER-SPOTCHECK-1.3.md
    rng = random.Random("ncb-foresight-spotcheck-1.3-2026-10-03")
    sample = []
    strata = {}
    for k in sorted(CLASS_NAME):
        bs = sorted([b for b in bodies if REGIME[b["iso3"]] == k], key=lambda b: b["id"])
        n = round(0.2 * len(bs))
        gff = [b["id"] for b in bs if b["adjudicatedMeetsUnit"] == 1]
        rej = [b["id"] for b in bs if b["adjudicatedMeetsUnit"] != 1]
        ng = max(1, round(n * len(gff) / len(bs))) if gff else 0
        ng = min(ng, n, len(gff))
        g = rng.sample(gff, ng)
        r = rng.sample(rej, n - ng)
        strata[CLASS_NAME[k]] = {"bodies": len(bs), "n": n, "gffs": len(gff), "drawnGff": g, "drawnRejected": r}
        sample += g + r
    out["spotCheckDraw"] = {"seed": "ncb-foresight-spotcheck-1.3-2026-10-03", "of": len(bodies),
                            "strata": strata, "sample": sample,
                            "alsoChecked": [b["id"] for b in bodies if b["id"] not in sample and (
                                (b["coderA"] or 0) != (b["coderB"] or 0) or b.get("codeSplit"))]}
    json.dump(out, open(os.path.join(W, "analysis.json"), "w"), indent=1, ensure_ascii=False)
    print(json.dumps(out, indent=1, ensure_ascii=False))


if __name__ == "__main__":
    main()
