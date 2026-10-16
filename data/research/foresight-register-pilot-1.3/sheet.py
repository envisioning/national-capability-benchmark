"""Write the spot-check entries for the drawn sample and the splits."""
import json, os, sys
W = os.path.dirname(os.path.abspath(__file__))
bodies = {b["id"]: b for b in json.load(open(f"{W}/bodies.json"))}
adj = json.load(open(f"{W}/adjudicated.json"))
rulings = json.load(open(f"{W}/adjudications.json"))
an = json.load(open(f"{W}/analysis.json"))["spotCheckDraw"]
REG = {"HTI": 0, "VNM": 0, "ARE": 0, "NIC": 1, "SGP": 1, "NGA": 2, "BRA": 2, "GBR": 2, "EST": 3, "CHE": 3}
CN = ["closed autocracy", "electoral autocracy", "electoral democracy", "liberal democracy"]


def codes(c):
    return (f"record {c['record']}, product {c['product']}, survived `{c['survived']}`, "
            f"closedNoSuccessor {c['closedNoSuccessor']}")


def coder(v, body):
    if v is None:
        return "did not list it"
    return ("meets the unit" + (f" ({codes(body)})" if body else "")) if v == 1 else "rejects it"


def country_line(iso):
    g = [b for b in bodies.values() if b["iso3"] == iso and b["adjudicatedMeetsUnit"] == 1]
    a = adj[iso]
    parts = [f"`{b['id']}`, {b['name']}, {b['status']}: {codes(b['adjudicatedBody'])}" for b in g]
    r = f" `{a['I3reason']}`" if a.get("I3reason") else ""
    items = f"Country items: I1 {a['I1']}, I2 {a['I2']}, I3 {a['I3']}{r}, I4 {a['I4']}; score {a['score']}."
    return ("; ".join(parts) + ". " if parts else "none. ") + items


def entry(n, bid):
    b = bodies[bid]
    gff = b["adjudicatedMeetsUnit"] == 1
    out = [f"### {n}. {b['iso3']}: {b['name']} ({CN[REG[b['iso3']]]}, {'GFF' if gff else 'rejected'})", ""]
    agreed = (b["coderA"] or 0) == (b["coderB"] or 0) and not b.get("codeSplit")
    out.append(f"- **Coders:** A {coder(b['coderA'], b['aBody'])}; B {coder(b['coderB'], b['bBody'])}."
               + (" No split." if agreed else " A split."))
    out.append(f"- **Adjudicated:** {'meets the unit. ' + codes(b['adjudicatedBody']) if gff else 'fails the unit'}. "
               f"Status {b['status']}. {b['unitReason']}")
    rs = [r for r in rulings if r["body"].split(" ")[0] == bid or r["body"].startswith(bid + " ")]
    for r in rs:
        out.append(f"- **Ruling:** {r['ruling']}. {r['reason']}")
    if b["sources"]:
        out.append("- **Sources:**")
        for s in b["sources"]:
            arch = f" (archived {s['archived']})" if s.get("archived") else " (no snapshot)"
            out.append(f"  - {s['url']}{arch}: \"{s['quote']}\"")
    else:
        out.append("- **Sources:** none cited. Check the body's official site and founding act.")
    out.append("- **Verify:**")
    if gff:
        out.append("  - [ ] The body meets section 1, conditions 1 to 4, on its own mandate.")
        c = b["adjudicatedBody"]
        out.append(f"  - [ ] record {c['record']}: an official record does{'' if c['record'] else ' not'} date its creation or foresight mandate.")
        out.append(f"  - [ ] product {c['product']}: a forward-looking product issued in its own name, dated 2023-10-02 to 2026-10-02, does{'' if c['product'] else ' not'} exist.")
        out.append(f"  - [ ] survived `{c['survived']}` holds on the body's own dates.")
        out.append(f"  - [ ] closedNoSuccessor {c['closedNoSuccessor']} holds.")
    else:
        out.append("  - [ ] The body fails section 1 as stated: no condition the ruling names is met by its own mandate.")
    out.append(f"- **The country's GFFs:** {country_line(b['iso3'])}")
    out.append("")
    return "\n".join(out)


def main(ids, title):
    return "\n".join(entry(i + 1, bid) for i, bid in enumerate(ids))


if __name__ == "__main__":
    which = sys.argv[1]
    ids = an["sample"] if which == "sample" else an["alsoChecked"] if which == "splits" else which.split(",")
    print(main(ids, which))
