# Why this exists

`docs/DECISIONS.md` records how the benchmark works and what would overturn each
choice. This file records why it was built at all, and what it is not allowed to
become.

## The claim under test

A country's wealth and capability are different. Most international indices
measure income, comfort, competitiveness or governance, and often capture much
the same thing. This benchmark tests whether a country's ability to anticipate,
act, coordinate, learn, experiment, adapt, build and sustain shared purpose is
separate and observable.

If the claim is right, countries at the same income level have different shapes,
and a dimension can improve without the country first getting richer. If it is
wrong, the nine dimensions collapse into one factor that tracks GDP per head.
The diagnostics are designed to show that: see D1 and the README.

## Where the nine dimensions come from

They come from an Envisioning strategy on national capability. Its argument is
that capacity is dispersed, and countries often lack the means to make it
accumulate. The nine dimensions are the parts of that argument the benchmark
tries to observe.

The strategy names Brazil as the field case. The benchmark serves Brazil first,
with Latin America measured beside it since D51.

That is about where the work starts, not what the model measures. A frame that
works for one country only describes that country. The same dimensions,
indicators, transforms and frame apply to all 52 countries. Adding a country
rebases the frame for everyone as a versioned, announced act (D47). Brazil has
no special treatment in the code.

## Why there is no ranking

A single score answers "who is ahead". This benchmark asks "what can this
country do?" It has nine answers and no ordering. Countries with the same average
can have opposite shapes. See D1.

The same reasoning rules out a target. A high Coordination score is not a model
to copy. Mechanisms depend on local conditions; importing the form without them
usually fails. The useful move is to understand the mechanism and rebuild it for
different conditions.

## The honest limit of a country score

Capability changes below the national level. It changes when a group gains the
agency, knowledge, tools and connections to build something, then repeats it. A
national score cannot see that directly.

A national score can describe the conditions those groups work in. Treat every
number here as a coarse proxy for activity several levels below it. Where the
proxy is bad, `docs/KNOWN-ARTEFACTS.md` says so.

## An instrument, not a report card

The point is to learn whether an attempt to raise capability worked. The loop is:

```
intervention → observation → data → learning → better frame → better intervention
```

Consequences that show up in the design:

- Confidence is published beside the score and never folded into it, so "we do
  not know" stays visible as its own finding. See D4.
- Missing indicators stay in the registry as declared gaps instead of being
  quietly dropped. The gap list is the data-collection agenda.
- Every observation carries its source, year and URL, so anyone can check it.
- Every data run records what changed against the run it replaced.

The instrument is expected to be wrong in specific, findable ways. Publishing
the artefacts is how those ways get found.

## What this is not

- It does not rank countries. The shape matters more than a league table.
- It is not an Envisioning position on any country. Panel estimates in
  `data/delphi/` are model output.
- It does not give policy advice. It measures capability.
- It is not a Brazil-only project. Brazil comes first, but the frame covers every
  country in the set.

## What would tell us this was the wrong idea

- The nine dimensions collapse into one factor across a wide country set, with
  no information beyond income per head.
- The dimensions hold up statistically, but country-level scores are too coarse
  to connect to action.
- The evidence for softer dimensions never becomes inspectable, leaving
  Coordination and Shared Purpose thin and Trust only partly measured. The
  first Joint EVS/WVS Trust release is inspectable but still needs court
  performance and broader coverage. See A12.

Each of these is a live risk today, and the first and third are visible in the
current output.
