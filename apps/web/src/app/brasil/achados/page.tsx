import { notFound } from 'next/navigation'
import { PT_BR } from '@ncb/core'
import { StoriesIndex, storiesIndexMetadata } from '@/components/layer/Stories'
import { loadStorySet } from '@/lib/stories'

export const dynamic = 'force-dynamic'

/** Brazil's computed stories, the index. See D192. */
export const metadata = storiesIndexMetadata(PT_BR, 'BRA')

export default async function BrazilStoriesPage() {
  if (!PT_BR.stories) notFound()
  return <StoriesIndex lex={PT_BR} set={await loadStorySet('BRA')} />
}
