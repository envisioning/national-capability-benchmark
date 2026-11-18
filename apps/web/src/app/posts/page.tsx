import type { Metadata } from 'next'
import { DIMENSIONS } from '@ncb/core'
import type { Dimension } from '@ncb/core'
import { PostList } from '@/components/posts/PostViews'
import { loadPosts } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Posts, NCB',
  description: 'Dated explainers that answer one question with the data and name the numbers behind the answer.',
}

const one = (v: string | string[] | undefined): string | undefined => (Array.isArray(v) ? v[0] : v)

/** Every post, newest first, narrowed by a tag in the query string. See D195. */
export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const dimension = one(params.dimension)
  return (
    <PostList
      posts={await loadPosts()}
      filter={{
        country: one(params.country)?.toUpperCase(),
        dimension: DIMENSIONS.includes(dimension as Dimension) ? (dimension as Dimension) : undefined,
        indicator: one(params.indicator),
      }}
    />
  )
}
