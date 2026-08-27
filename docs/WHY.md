# Why this exists

`docs/DECISIONS.md` records how the benchmark works and what would overturn each
choice. This file records why it was built at all, and what it is not allowed to
become.

## The claim under test

A country's wealth and a country's capability are not the same thing. Most
international indices measure income, comfort, competitiveness or governance
quality, and they correlate with each other because they are largely measuring
the same thing. This benchmark tests a different claim: that a country's ability
to anticipate change, act on it, coordinate, learn, experiment, adapt, build and
hold a shared purpose is a separate and observable property.

If the claim is right, two countries at the same income level have different
capability shapes, and a country can raise a dimension without first getting
rich. If the claim is wrong, the nine dimensions collapse into one factor that
tracks GDP per head, and the model has told us so. The diagnostics are built to
expose that failure rather than hide it: see D1, and the wealth-correlation
findings in the README.

## Where the nine dimensions come from

They come from an Envisioning strategy on national capability. The strategy
starts from a single argument: capacity is not scarce, but it is dispersed, and
what a country lacks is usually not talent, ideas or resources but the means to
make dispersed capacity accumulate. Anticipation, Agency, Coordination, Trust,
Learning, Experimentation, Adaptability, Building and Shared Purpose are the
dimensions that argument asks you to observe.

The strategy names Brazil as the field case. The benchmark inherits that: Brazil
is one of the ten reference countries that fix the normalization frame, and it
is the country the work is meant to be useful to first.

That is a statement about where the attention goes, not about what the model
measures. A capability frame that only works for one country is not a capability
frame, it is a description of that country. The same nine dimensions, the same
indicators, the same transforms and the same frame apply to all forty countries
in the set, and any country added later is measured against the frame that is
already there. Nothing about Brazil is special-cased anywhere in the code, and
nothing should be.

## Why there is no ranking

A single score answers the question "who is ahead". This benchmark asks "what is
this country able to do", which has nine answers and no ordering. Two countries
with the same average can have opposite shapes, and the shape is the finding.
See D1.

The same reasoning rules out a target. A high score on Coordination is not a
model to copy. Mechanisms that work in Switzerland, Singapore or Estonia work
because of conditions that do not travel, and importing the form without the
mechanism reliably fails. The useful move is to read why a mechanism works and
rebuild it for different conditions. The benchmark can support that reading, and
it cannot do it for you.

## The honest limit of a country score

Capability changes at a much smaller scale than a country. It changes when a
group of people acquire the agency, the knowledge, the tools and the connections
to build something, and when that becomes repeatable rather than exceptional.
A national score cannot see any of that directly.

What a national score can do is describe the conditions those groups work in,
and change slowly when the conditions change. Treat every number here as a
coarse proxy for something happening several levels below it. Where the proxy is
known to be bad, `docs/KNOWN-ARTEFACTS.md` says so by name.

## An instrument, not a report card

The point of measuring capability is to learn whether an attempt to raise it
worked. That makes this a measuring instrument in a loop:

```
intervention → observation → data → learning → better frame → better intervention
```

Consequences that show up in the design:

- Confidence is published beside the score and never folded into it, so "we do
  not know" stays visible as its own finding. See D4.
- Missing indicators stay in the registry as declared gaps instead of being
  quietly dropped. The gap list is the data-collection agenda.
- Every observation carries its source, its year and the URL it came from, so a
  number can be checked by someone who does not trust us.
- Every data run records what changed against the run it replaced, so a number
  that moves under us is a record rather than a surprise.

The instrument is expected to be wrong in specific, findable ways. Publishing
the artefacts is how those ways get found.

## What this is not

- Not a ranking of countries, and not a league table with the ranking hidden.
- Not an Envisioning position on any country. The panel estimates in
  `data/delphi/` are model output and say so.
- Not policy advice. It measures capability, it does not prescribe.
- Not a Brazil project with other countries as background. Brazil is where the
  results are meant to be used first. The frame is for everyone or it is broken.

## What would tell us this was the wrong idea

- The nine dimensions correlate into one factor across a wide country set, and
  the shape carries no information beyond income per head.
- The dimensions hold up statistically but no one can act on a dimension score,
  because the country level is too coarse to connect to anything a person or an
  organization does.
- The evidence needed to score the softer dimensions never becomes inspectable,
  and Coordination, Trust and Shared Purpose stay unmeasurable in principle
  rather than for now. See A12.

Each of these is a live risk today, and the first and third are visible in the
current output.
