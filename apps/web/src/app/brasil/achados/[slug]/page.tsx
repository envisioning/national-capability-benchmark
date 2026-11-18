import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PT_BR, storyById } from '@ncb/core'
import { StoryPage, storyMetadata } from '@/components/layer/Stories'
import { storyHref } from '@/lib/links'
import { loadStorySet, storyIdBySlug } from '@/lib/stories'

export const dynamic = 'force-dynamic'

/** One of Brazil's computed stories. See D192. */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const id = storyIdBySlug(PT_BR, slug)
  const set = id ? await loadStorySet('BRA') : null
  return storyMetadata(PT_BR, set && id ? storyById(set, id) : null)
}

export default async function BrazilStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const id = storyIdBySlug(PT_BR, slug)
  const path = storyHref('BRA', slug)
  if (!id || !path) notFound()
  const set = await loadStorySet('BRA')
  const story = set ? storyById(set, id) : null
  if (!set || !story) notFound()
  return <StoryPage lex={PT_BR} set={set} story={story} path={path} />
}
