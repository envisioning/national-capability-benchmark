# Provisional layer reviews

Velocity, Exponential Leverage and the wealth residual are provisional, offline
layers. Review each one once per quarter after its fixture is refreshed. The
review should be written during the following week and saved as
`{layer}-YYYY-q{quarter}.md`, using `velocity`, `leverage` or `residual` as the
layer name.

Run `pnpm reviews:check` to confirm that every layer has a review for the
current quarter. The scheduled GitHub check runs the same command. A missing
review is a maintenance failure, not evidence that the layer is ready for
public use.

Every review answers these five questions:

1. **What did we learn about the methodology?** Record what was wrong with the
   placeholder formula and what was changed, if anything.
2. **What did we learn about the data sources?** Record which sources held up,
   which needed replacement, and which were unavailable.
3. **What did we learn about the reader?** Record visits, disputes, citations,
   and other signals from outside the maintainer's own work.
4. **Is the layer still on track for promotion?** Say whether the criteria are
   moving forward, stalled, or no longer credible.
5. **What do we need to do next quarter?** Save a single-paragraph answer that
   can become the next maintenance issue.

Three consecutive reviews with no new finding are a stop signal. The next
decision is promotion or retirement. Promotion requires the criteria recorded
for each layer in the decision log. Retirement removes the fixture and sandbox
and leaves the reason in the decision log.
