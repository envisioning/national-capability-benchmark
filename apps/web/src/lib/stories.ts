import { STORY_IDS, buildStories } from '@ncb/core'
import type { Lexicon, StoryId, StorySet } from '@ncb/core'
import { loadDiagnostics, loadIndex } from '@/lib/data'

/**
 * One country's stories, computed from the published index and the income
 * the diagnostics carry. Nothing is stored: a story is the release read one
 * way, so it changes only when the release does. See D192.
 */
export async function loadStorySet(iso3: string): Promise<StorySet | null> {
  const [index, diagnostics] = await Promise.all([loadIndex(), loadDiagnostics()])
  if (!index || !diagnostics) return null
  return buildStories({
    iso3,
    version: index.version ?? '',
    generatedAt: index.generatedAt,
    countries: index.countries,
    income: diagnostics.income ?? [],
  })
}

/** The story a layer's slug names, or null. */
export function storyIdBySlug(lex: Lexicon, slug: string): StoryId | null {
  const slugs = lex.stories?.slugs
  if (!slugs) return null
  return STORY_IDS.find((id) => slugs[id] === slug) ?? null
}
