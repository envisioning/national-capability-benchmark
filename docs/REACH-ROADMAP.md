# Reach roadmap

How NCB gets read, cited and shared. This file is the plan for the GitHub
milestone "Reach". It changes no score and no method. Every item here
presents numbers the pipeline already publishes.

The model for this plan is HubPolítico (hubpolitico.com.br, read on
2026-11-18). It publishes Brazilian election and Congress data. It sells the
data as answers and stories, and it keeps the method one click away. NCB
copies the presentation and leaves out the paywall: NCB is free, so every call
to action is "cite", "ask" or "share", never "sign up".

## Rules every item keeps

- **Computed, never hand-written.** A story, a card or an answer is a
  template filled from `data/out`. No sentence names a country by hand. This
  is the same rule as the capability map (D130) and the layers (D134).
- **Describe, never prescribe.** A story compares a value with a median, a
  peer or a past value. No story says what a country should do.
- **A score never travels alone.** Every story, card and answer prints the
  solidez (confidence) beside the score, as `docs/FOR-AGENTS.md` requires.
  A card has no room for a footnote, so a thin-evidence score is not a
  headline.
- **Dated and versioned.** Every story names the dataset version and the
  generation date. A story is a closed edition: the numbers are the ones of
  that version and do not change after it publishes.
- **Copy goes through the humanizer.** pt-BR and es first, English after.

## What exists today

- Share cards (1200×630) for a country, a dimension and an agenda, under
  `app/og`.
- "Country of the week" at `/digest/<date>.html`, not indexed.
- An RSS feed at `/feed.xml`, `/llms.txt`, `docs/FOR-AGENTS.md` and JSON
  routes under `/api`.
- Embeds for a country, an agenda and a compare.
- The front page answers first (D190). The Brazil layer has a map, an agenda,
  states, history, institutions and a participation page.

What does not exist: story pages, a citation line, a press page, entry
questions, audience sections, release stories, square cards, video and an MCP
connector.

## Phase 1: share what NCB already knows

1. **Citation line on every page (#127).** A "De onde vem" / "Where it comes
   from" box: source, page address, dataset version, generation date and a
   copy button. One component, one formatter in `links.ts`, read by every
   layer.
2. **Press page (#128).** `/imprensa` in the Brazil layer and `/press` in the
   ground layer. Where each kind of number lives, with one example link each,
   how to cite, and how to contact the project. It links the method and
   `FOR-AGENTS.md`.
3. **Story pages with share cards (#129).** `/brasil/achados` and one page per
   story at `/brasil/achados/<slug>`. Each story has one headline with a
   number, a short body, one chart from the existing set, the citation line
   and its own share card. The first three stories, all computed from Dataset
   10.2.0:
   - **The country with Brazil's shape.** Costa Rica has the nearest profile
     of the nine capabilities. Sri Lanka is second, at less than three
     quarters of Brazil's income.
   - **Same income, different shape.** Of Brazil's 10 income peers, the one
     with the most different profile, side by side.
   - **Where Brazil stands among its income peers.** The dimension most above
     the peer median and the dimension most below it.
   The story list is a registry in `packages/core`, so a new story is one
   entry plus one lexicon template. Needs a decision entry.

## Phase 2: entry points

4. **Questions on the front pages (#130).** Three example questions under the
   search on `/` and `/brasil`, in the reader's words ("Qual país tem o
   formato do Brasil?"). Each one opens the page that answers it: a story, a
   compare or a map. No model answers in phase 2. A free-text answer comes
   with the MCP connector in phase 4.
5. **Audience sections (#131).** "Para quem é" on `/brasil`: governo e
   ministérios, bancos de desenvolvimento e agências, pesquisa, imprensa. Each
   names one job and opens the one view that does it. The ground layer gets
   the same in English.
6. **Feature screens use real data (#132).** HubPolítico draws feature screens
   with fictional names. NCB has public data, so every screen that shows what
   a page does draws a real country from the current release, chosen by rule
   and never by hand.

## Phase 3: a reason to come back

7. **A story per release (#133).** Each dataset release writes a computed
   note: what moved, which country changed place on a dimension, which gap
   closed. It goes to `/feed.xml`, the changelog and a story page. It
   replaces the unindexed "country of the week" or feeds it.
8. **Square cards (#134).** A 1080×1080 card per story, for Instagram and
   LinkedIn feeds, drawn by the same `Og` components.

## Phase 4: answers inside assistants

9. **A read-only MCP connector (#135).** Public tools that read `data/out`:
   one country, one dimension, compare two countries, income peers, the
   stories. Every answer carries the score, the solidez and the version, as
   `FOR-AGENTS.md` requires. No login, because NCB is free.

## Decisions for mz

These items need a choice only mz can make. Nothing in phases 1 to 3 waits
on them.

- **Social accounts (#136).** Whether NCB posts from Envisioning's accounts
  or its own, and who presses publish. Posting is outward-facing, so no agent
  posts.
- **Video (#137).** Short videos per story need a renderer. Every option adds
  a dependency or a paid service.
- **MCP hosting (#135).** On the Vercel app or as a Cloudflare Worker beside
  the other Envisioning MCP servers.
