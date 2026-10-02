# Foresight register runbook: coding the 53

The procedure for coding `government_foresight_capacity` on all 53 countries
under codebook 1.2 (`FORESIGHT-REGISTER-CODEBOOK.md`, committed in
`483753b`). Written 2026-10-02, before any of the 53 is coded. It implements
D148 and does not change it. Nothing here scores the row, edits the registry
or writes a decision: the row stays a declared gap until a later decision
promotes it at tier `expert_panel`.

Every parameter below (coders, batches, seeds, draws, statistics, stop rules)
is fixed now, so that none of them can be chosen after the codes are seen
(D118). A change to this file after step 2 starts is recorded at its foot
with the reason.

---

## 0. Gate: do not start until all of these hold

1. `FORESIGHT-REGISTER-SPOTCHECK.md` has its result table filled, a name and
   date on the "Checked by" line, and it passes D148: fewer than two of the 11
   sampled bodies overturned, and no body decision that changes a country
   item. If it fails, stop here: D148 is overturned and the next step is a
   decision entry, not this runbook.
2. The codebook in the working tree is 1.2 (`git log -1 --format=%h --
   docs/research/anticipation/FORESIGHT-REGISTER-CODEBOOK.md` names
   `483753b` or a later commit whose changelog entry says why). If a later
   version exists, every coder uses it and this file's version references
   move with it.
3. No coder output for the 53 exists yet in `data/research/`. If one does,
   find out why before overwriting anything.

## 1. Fixed parameters

- **Codebook.** 1.2. The coding date the codebook fixes, 2026-10-02, stays
  the reference date for every window (I2's three years, I4's ten years),
  whatever day the coders actually run. Coders record their own retrieval
  date on each source. One reference date for all 53 keeps every country on
  the same windows.
- **Countries.** The 53 in `packages/core/src/model/countries.ts`, the pilot
  ten included. The pilot codes are not carried over: the ten are recoded
  under 1.2 like the rest.
- **Regime class.** V-Dem Regimes of the World, `v2x_regime`, year 2025, as
  the pilot read it (Our World in Data `political-regime`). Pinned here so
  that the draws and the regime correlation read one table:

| Class | Code | n | Countries |
| --- | ---: | ---: | --- |
| Closed autocracy | 0 | 5 | ARE CHN CUB HTI VNM |
| Electoral autocracy | 1 | 12 | ETH IDN IND MEX NIC PHL RWA SGP SLV THA TUR VEN |
| Electoral democracy | 2 | 21 | ARG BOL BRA CAN COL DOM ECU GBR GTM HND ISR KEN MYS NGA PAN PER POL PRT PRY USA ZAF |
| Liberal democracy | 3 | 15 | AUS CHE CHL CRI DEU ESP EST FIN FRA IRL JPN KOR NLD SWE URY |

- **Income.** Log GDP per capita PPP from `data/out/diagnostics.json`,
  `income` (51 countries; Cuba and Venezuela have none). Printed, decides
  nothing (D117, D118).

## 2. Coders

D148 requires two agent coders of different model families, and codebook
section 7 requires the frame to be recoded by a second coder on a random 20
percent. The pilot's two coders were both Claude models, which D148 names as
a cost. For the 53 the families are different vendors:

| Coder | Family | How it runs | Codes |
| --- | --- | --- | --- |
| A | Anthropic Claude, Opus | A fresh Claude Code subagent per batch (`Agent`, model `opus`), no repository access | all 53, in nine batches |
| B | OpenAI GPT, through the Codex CLI with live web search | `codex --search exec` per batch, from an empty directory outside any repository | the 11-country second-coding draw (section 6), in two batches, plus any I4 add-on (section 6) |

Each coder records the exact model string it ran as (`model` in its output).
For coder B that is the model passed with `-m`, taken from
`~/.codex/config.toml` on the day of the run.

**Isolation.** A coder receives the codebook text and its batch's country
list, and nothing else: no repository, no pilot report or pilot JSON, no
spot-check, no evidence corpus, no other coder's output, no other batch's
output. Each batch is a fresh session, so nothing carries from one batch to
the next except the codebook. Batches may run in parallel.

**Working directory.** `$WORK = <scratchpad>/foresight-53/`, with
`coder-a/` and `coder-b/` beneath it. Nothing is written into the repository
until section 8.

### Coder A, per batch

Launch a subagent with model `opus` and the brief in section 3, with
`<BATCH>` and `<COUNTRIES>` filled and the full codebook pasted where the
brief says. Output: `$WORK/coder-a/batch-<N>.json`.

### Coder B, per batch

```sh
mkdir -p "$WORK/coder-b/run-<N>" && cd "$WORK/coder-b/run-<N>"
cp <repo>/docs/research/anticipation/FORESIGHT-REGISTER-CODEBOOK.md ./codebook.md
# brief-<N>.md is section 3's brief with <BATCH> and <COUNTRIES> filled
codex --search exec \
  --ignore-user-config --ephemeral --skip-git-repo-check \
  -m "$CODER_B_MODEL" -s workspace-write -C "$PWD" \
  -o "$WORK/coder-b/batch-<N>.last.txt" - < brief-<N>.md
```

`--ignore-user-config` and `--ephemeral` keep Codex's saved memories and
settings out of the run; the directory holds only the codebook and the
brief. The coder writes `batch-<N>.json` in that directory, which is then
copied to `$WORK/coder-b/batch-<N>.json`.

## 3. The coder brief

The same text for both coders. Fill the angle-bracket fields; change nothing
else.

```text
You are coder <A|B>, batch <BATCH>, of a register of national government
foresight functions. You code independently. You will not see any other
coder's work, and you must not look for it.

Your only rule is the codebook below (version 1.2). Read it in full before
coding. Code these countries, in this order: <COUNTRIES>.

Work from primary official sources on the open web, under the codebook's
section 4 evidence rules and search protocol. Read dates from the source,
never from memory. Where you are unsure, say so with confidence "low" and
follow the rule anyway. List every candidate body you examine in
`functions`, including those that fail the unit, closed predecessors and
parents, as section 1 and section 5 say.

For every source that carries a 1, request a Wayback snapshot through
https://web.archive.org/save/<url> where none exists. If the archive refuses,
record archived: null and the reason (rate_limited, blocked, save_failed).

Do not read any file other than the codebook. Do not open any repository.
Do not consult other registers of foresight units as a source: they are
leads only (section 4).

Write one JSON file, batch-<BATCH>.json, in the shape of codebook section 5,
with these top-level fields added: "model" (the exact model you run as),
"batch" (<BATCH>), "referenceDate": "2026-10-02". "codebookVersion" is "1.2".
"codedAt" is today's date. Finish with a one-paragraph summary: countries
coded, bodies examined, items coded low confidence, sources left without a
snapshot.

=== CODEBOOK 1.2 ===
<full text of FORESIGHT-REGISTER-CODEBOOK.md>
```

## 4. Batches

Coder A codes the 53 in nine batches of six (the last has five), countries
in ISO3 order. Batch size is fixed so that every batch gets the same search
depth.

| Batch | Countries |
| ---: | --- |
| A1 | ARE ARG AUS BOL BRA CAN |
| A2 | CHE CHL CHN COL CRI CUB |
| A3 | DEU DOM ECU ESP EST ETH |
| A4 | FIN FRA GBR GTM HND HTI |
| A5 | IDN IND IRL ISR JPN KEN |
| A6 | KOR MEX MYS NGA NIC NLD |
| A7 | PAN PER PHL POL PRT PRY |
| A8 | RWA SGP SLV SWE THA TUR |
| A9 | URY USA VEN VNM ZAF |

Coder B codes the second-coding draw of section 6 in two batches:

| Batch | Countries |
| ---: | --- |
| B1 | BRA CHN COL DOM FRA KOR |
| B2 | NIC PER SLV URY VEN |

## 5. Checking each batch file

Before a batch counts as done, it passes these mechanical checks. A batch
that fails is rerun from a fresh session, never patched by hand.

```python
import json, re, sys
d = json.load(open(sys.argv[1]))
assert d["codebookVersion"] == "1.2" and d["referenceDate"] == "2026-10-02"
assert d.get("model"), "model string missing"
for c in d["countries"]:
    it = c["items"]
    i1, i2, i3, i4 = (it[k]["value"] for k in ("I1", "I2", "I3", "I4"))
    expect = max(0, round(100 * (i1 + i2 + i3) / 3) - 20 * i4)
    assert c["score"] == expect, (c["iso3"], c["score"], expect)
    for k in ("I1", "I2", "I3", "I4"):
        if it[k]["value"] == 1:
            assert it[k]["sources"], (c["iso3"], k, "a 1 with no source")
            for s in it[k]["sources"]:
                assert len(s["quote"].split()) <= 25, (c["iso3"], k, "quote over 25 words")
                assert s.get("archived") or s.get("archivedNote"), (c["iso3"], k, "no snapshot and no reason")
    if 0 in (i1, i2, i3):
        assert c["searched"], (c["iso3"], "a 0 with no search record")
    for f in c["functions"]:
        assert "meetsUnit" in f and f.get("unitNote"), (c["iso3"], f["name"])
print("ok", len(d["countries"]))
```

The countries in the file must equal the batch list exactly. Merge the
batches into `$WORK/coder-a.json` and `$WORK/coder-b.json` (one `countries`
array each, the batch and model kept on each country).

## 6. The second-coding draw (fixed now)

Codebook section 7 and D148: a second coder recodes a random 20 percent of
the frame, and the 53's agreement is read on it.

**Rule.** n = round(0.2 x 53) = 11. Stratified by the regime class table in
section 1, allocated in proportion with at least one per class, the
remainder to the largest fractional parts (ties to the lower class code).
Classes in code order, each class's candidates sorted by ISO3, one
`rng.sample` per class, with
`rng = random.Random("ncb-foresight-53-second-coding-2026-10-02")`.

```python
import math, random
classes = {
    0: "ARE CHN CUB HTI VNM",
    1: "ETH IDN IND MEX NIC PHL RWA SGP SLV THA TUR VEN",
    2: "ARG BOL BRA CAN COL DOM ECU GBR GTM HND ISR KEN MYS NGA PAN PER POL PRT PRY USA ZAF",
    3: "AUS CHE CHL CRI DEU ESP EST FIN FRA IRL JPN KOR NLD SWE URY",
}
classes = {k: sorted(v.split()) for k, v in classes.items()}
N = round(0.2 * sum(len(v) for v in classes.values()))
q = {k: 0.2 * len(v) for k, v in classes.items()}
alloc = {k: max(1, math.floor(x)) for k, x in q.items()}
for k in sorted(q, key=lambda k: (-(q[k] - math.floor(q[k])), k)):
    if sum(alloc.values()) >= N:
        break
    alloc[k] += 1
rng = random.Random("ncb-foresight-53-second-coding-2026-10-02")
draw = [c for k in sorted(classes) for c in rng.sample(classes[k], alloc[k])]
```

**Result**, run 2026-10-02 before any coding: allocation 1, 3, 4, 3, and the
draw is

| Class | Drawn |
| --- | --- |
| Closed autocracy (1 of 5) | CHN |
| Electoral autocracy (3 of 12) | NIC SLV VEN |
| Electoral democracy (4 of 21) | PER COL BRA DOM |
| Liberal democracy (3 of 15) | URY FRA KOR |

Two of the 11, BRA and NIC, were in the pilot. That is the draw, and it is
not redrawn.

**I4 add-on.** I4 has never fired, so its agreement cannot be read on a
draw where it is 0 everywhere. Every country outside the draw where coder A
codes I4 = 1 is also coded by coder B, in a batch B3 run after A9. These
countries are reported separately and never enter the 11-country alpha, so
the draw stays random.

## 7. Agreement, adjudication and the human check

### Agreement on the 11

Computed exactly as in the pilot, two coders, no missing values:

```python
def alpha(pairs, metric="nominal"):
    vals = [v for p in pairs for v in p]
    n = len(vals)
    if len(set(vals)) < 2:
        return None  # degenerate: report percent agreement, floor or ceiling
    d = (lambda x, y: 0.0 if x == y else 1.0) if metric == "nominal" else (lambda x, y: (x - y) ** 2)
    Do = sum(2 * d(a, b) for a, b in pairs) / n
    De = sum(d(x, y) for i, x in enumerate(vals) for j, y in enumerate(vals) if i != j) / (n * (n - 1))
    return 1 - Do / De if De else None
```

- Items: I1, I2, I3, I4 nominal; I3 with its reason as a three-way nominal
  (`1`, `no_change`, other `0`); the score interval. Percent agreement beside
  each. Bootstrap over countries, 2,000 draws, `random.Random(7)`, 95
  percent interval from the sorted draws.
- **Body by body**, codebook section 7: the adjudicator matches the two
  coders' candidate bodies by identity (name, branch, founding record) into
  one table, ids `<ISO3>.<short>`, and publishes it. A body either coder
  lists is a unit; a body a coder missed counts 0 for that coder. Alpha
  nominal over all matched bodies, with percent agreement and the country
  bootstrap. Printed beside it, as in the pilot: alpha on the bodies both
  coders judged, and alpha for each body code on the bodies both found
  qualifying.
- **I4 on its own**: alpha or, if degenerate, percent agreement, and the
  number of countries among the 53 where either coder coded it 1. The I4
  add-on countries are reported in a separate line with their agreement.

### Adjudication

On the 11, every disagreement (item, reason code or body) is adjudicated by
reading the cited sources, and the adjudication table names the body, what
split, the ruling and the reason, as in the pilot. On the other 42, coder
A's codes stand, and the adjudicator reads every item coder A marked
`confidence: "low"` and every source left without a snapshot. Adjudication
never changes a rule: a split that traces to an ambiguity in the codebook is
recorded as such and goes to the verdict (section 9).

### Snapshots

After coding, retry `https://web.archive.org/save/<url>` for every source
with `archived: null`, then confirm with the CDX API
(`https://web.archive.org/cdx/search/cdx?url=<url>&output=txt`) that a
capture with status 200 exists. A capture with any other status (a 204, a
redirect to an error page) is not a snapshot. Sources still without one are
listed for the reviewer before promotion (codebook section 4).

### The human spot-check of the 53

D148: a person checks a seeded, regime-stratified 20 percent of bodies
before anything is scored. Drawn after adjudication, from the adjudicated
body list of all 53, with the pilot spot-check's rule:

- Strata are the four regime classes; each gets round(0.2 x its bodies).
- Within a class, max(1, round(n x GFFs / bodies)) are drawn from the bodies
  adjudicated as meeting the unit and the rest from those failing it.
- Candidates sorted by id, `rng.sample`, classes in code order, GFFs before
  rejections, `rng = random.Random("ncb-foresight-53-spotcheck-2026-10-02")`.
- Every body on which the two coders split is checked in addition.

It is written to `FORESIGHT-REGISTER-SPOTCHECK-53.md` in the format of
`FORESIGHT-REGISTER-SPOTCHECK.md`: per body, the adjudicated codes, the
sources with snapshots, and a checklist. The result is reported with the
sample's error rate, and the verdict waits on it (codebook section 7).
D148 sets a numeric threshold only for the pilot spot-check (two overturns
in 11). This runbook reads the 53's check on the same terms, an error rate
of 2 in 11 (18 percent) or more, or any overturn that changes a country
item, as a failed check; that reading is put to the decision that follows,
and is not a rule D148 fixed.

## 8. What is written, and where

Nothing goes into the repository until the agreement and adjudication are
complete. Then, in this order, each as its own commit:

1. `data/research/foresight-register-53/coder-a.json` and `coder-b.json`:
   the merged raw coder files, unedited.
2. `data/research/foresight-register-53.json`: the adjudicated register, in
   the shape of `foresight-register-pilot.json`'s round 2 (per country:
   regime class, income, both coders' items where they exist, adjudicated
   items and score, functions and sources; plus `draw`, `agreement`,
   `bodyAgreement`, `bodies`, `adjudications`, `pattern`, `i4`, `spotCheck`
   with `status: "pending"`, `verdict`).
3. `docs/research/anticipation/FORESIGHT-REGISTER-53.md`: the report, in the
   pilot report's order: coders and models, snapshots, the 11 both codings,
   agreement, disagreements and adjudication, the regime pattern on 53,
   income printed only, ceiling and floor, I4, verdict.
4. `FORESIGHT-REGISTER-SPOTCHECK-53.md`, for the person.

No change to `indicators.ts`, `DECISIONS.md`, the dataset or app version or
the changelog. Those follow the spot-check, in a decision.

## 9. Stop rules and verdict (D148)

After adjudication, on the 53 and the 11-country second coding. Any one
of these overturns D148's go, and the next step is a decision entry; nothing
is scored:

| Rule | Reads | Fires when |
| --- | --- | --- |
| Item reliability | alpha per item (I1, I2, I3, and I4 where defined) and on the score, on the 11 | under 0.80 |
| Body reliability | body-by-body alpha over matched bodies, on the 11 | under 0.80 |
| Regime sort | Spearman's rho, adjudicated score against regime class code, n 53 | 0.80 or more in absolute value |
| Ceiling or floor | adjudicated scores of the 53 | 43 or more at one score |
| Spot-check | the human check of section 7 | fails, as section 7 reads it |

The codebook's own band applies alongside: an alpha between 0.667 and 0.80
traced to an ambiguous rule is a reason to revise the codebook and recode,
which is itself a decision, because D148 is overturned either way. An alpha
under 0.667 after that revision stops the register.

Printed and deciding nothing: income r and Spearman with log GDP per capita
(n 51); the mean score by regime class; the body alpha on bodies both
coders judged.

**I4.** If I4 is 1 in no country of the 53 after adjudication, the report
says so and the decision that follows must rule on dropping it (codebook
1.2, I4). One or more firings: it stays, and the report names how many
countries its agreement rests on.

**Go.** Every alpha at 0.80 or more, no stop rule, and the spot-check
passed: the register is ready for a decision to promote it at tier
`expert_panel`. That decision, the registry change and the version bump are
not part of this runbook.

## What a person has to do

- Before step 1: complete `FORESIGHT-REGISTER-SPOTCHECK.md` (the gate).
- After step 7: complete `FORESIGHT-REGISTER-SPOTCHECK-53.md`.
- Rule on the verdict, and on I4 if it never fired, in a decision entry.
