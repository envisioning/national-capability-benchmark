# Posts

How an agent writes an NCB post. A post is a dated explainer: one question, a
short answer, the cases that make the answer, and why each case happens, read
from the rows of the score. Posts are the way into the data for a reader who
will not read a table. Every number in a post comes from the data. See D195.

## The rules

1. **One question, in the reader's words.** "Does capability just mirror
   wealth?", not "Income residual analysis".
2. **The facts come from a command.** `pnpm bench post <kind>` prints every
   number the post may use, from the committed output. The agent never reads a
   number off a page or from memory.
3. **Every number in the prose is a number the post stores.** `pnpm bench
   validate` fails a post whose prose prints a number its blocks, its
   `figures` or its tags do not hold. Round only as the stored value rounds.
4. **Why is the rows.** A score is the mean of its rows, so a gap splits into
   each row's distance from the comparison, divided by the rows counted. The
   `why` sentence names the rows that carry the gap and their values. It says
   what the rows show. It never guesses a cause the data does not hold
   ("because of oil", "because of policy").
5. **Describe, never prescribe.** No sentence says what a country should do
   (D130).
6. **A score never travels alone.** The page prints confidence beside every
   score. Cases with thin evidence are not selected (D192).
7. **The selection is a rule.** The command picks the cases. The agent does
   not add, drop or reorder them. A known artefact that names a country on a
   capability removes that case.
8. **A post is a closed edition.** It stores the dataset version and never
   changes when the data does. A correction is a new post that links the old
   one.
9. **Copy rules.** The viewer's copy rules in `AGENTS.md` apply: sentence case,
   no dashes, numbers one to nine spelled out, no reassurance. Run the prose
   through the humanizer.

## Writing one

1. `pnpm bench post income-gaps > /tmp/facts.json` (or another kind).
2. Write `data/posts/<date>-<slug>.json` against `PostFile` in
   `packages/core/src/model/posts.ts`: copy each case into a `gap` block
   unchanged, add one `why` per case, add `text` and `heading` blocks around
   them, and put any other quoted number in `figures` with a name.
3. Tags: every country, capability and the two leading driver rows of each
   case. The tags make `/posts?country=VNM` and the other filters work.
4. `pnpm bench validate`, then `pnpm typecheck`.
5. Commit with the post's title in the message. The post goes live on the next
   deploy of `main`.

## Kinds

| Kind | Question | Command |
| --- | --- | --- |
| `income-gaps` | Where does capability not follow income? | `bench post income-gaps --count 5` |

A new kind needs a generator in `packages/core/src/pipeline`, an entry in
`POST_KINDS` and a decision entry.
