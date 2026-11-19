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
   them, and put any other quoted number in `figures` with a name. Set
   `lead`: the one figure the dek turns on, as printed (`+53.8`, `0.87`,
   `54.5%`), and a caption that says what it counts. The number rule checks
   both (D198).
3. Tags: every country, capability and the two leading driver rows of each
   case. The tags make `/posts?country=VNM` and the other filters work.
4. `pnpm bench validate`, then `pnpm typecheck`.
5. Commit with the post's title in the message. The post goes live on the next
   deploy of `main`.

## Blocks

A post is drawn from a fixed set of blocks, each answering one question a
reader asks. `/posts/blocks` draws every one from a published post and is the
reference: a block that is not on that page is not part of the set (D197).

| Block | Answers | Drawn by |
| --- | --- | --- |
| Lead number | What is the answer, in one figure? | `PostTop` and `LeadFigure`, in the page's one dark band |
| Heading | Which side of the story am I reading? | `PostArticle` |
| Text | What is the question, and what holds it together? | `PostArticle` |
| Field strip | Where does this country sit among countries as rich as it? | `PeerField` (the shared `FlagField`) |
| Waterfall | Why is the gap there? | `GapWaterfall` |
| Post card | Which post do I want to read? | `PostCard` and `GapGlyph`, in the `/posts` list only |
| Case | What is the gap, and what does it come from? | `GapBlock`: why, field strip, waterfall, table behind a toggle |

The writer adds no block by hand: a `gap` block draws its field strip and
waterfall from the stored `peerScores` and `drivers`. A new block is a new
block type in `PostBlock`, a specimen on `/posts/blocks` and a decision entry.

## Kinds

| Kind | Question | Command |
| --- | --- | --- |
| `income-gaps` | Where does capability not follow income? | `bench post income-gaps --count 5` |
| `country` | Is this country more or less capable than its income suggests? | `bench post country <ISO3>` |
| `capability` | What does this capability follow, and who breaks the pattern? | `bench post capability <dimension>` |

A `country` post holds one country's widest gaps against its income peers,
up to three on each side, each at least `GAP_FLOOR` (10) points wide. A
`capability` post holds the widest three on each side for one capability,
one country each, with the capability's correlation with income. Both store
the country or capability in `subject`. The facts also print counts the
prose may want (`scored`, `level`): copy any you quote into `figures`.

A new kind needs a generator in `packages/core/src/pipeline`, an entry in
`POST_KINDS` and a decision entry.

## The daily run

One post a day. The subject is a rule, `nextPost` in
`packages/core/src/pipeline/post-plan.ts`, so the run never chooses:

- Monday is a `capability` post, in registry order.
- Every other day is a `country` post. Countries queue by their widest usable
  gap, widest first.
- Each queue takes the first subject no post of its kind has had, and starts
  again from the oldest when it is spent.

The run, in a fresh checkout of `main`:

1. `pnpm bench post next --date <today> > /tmp/facts.json`. It prints the
   kind, the subject and the facts.
2. Write the post as above, dated today, with `subject` set.
3. `pnpm bench validate` and `pnpm typecheck`. Both must pass. If the
   facts hold no case (a country with no gap of at least 10 points), skip
   the day and say so; never pick another subject.
4. Commit to a branch, open a pull request titled with the post's title,
   squash-merge it, and check the Vercel status on the merge commit. The
   post is live when `/posts/<slug>` answers 200.

