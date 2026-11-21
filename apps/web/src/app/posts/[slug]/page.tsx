import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostArticle } from '@/components/posts/PostViews'
import { loadPost, loadPosts } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await loadPost((await params).slug)
  return post ? { title: `${post.title}, NCB`, description: post.dek } : {}
}

/** One post. See D195. */
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await loadPost((await params).slug)
  if (!post) notFound()
  return <PostArticle post={post} posts={await loadPosts()} />
}
