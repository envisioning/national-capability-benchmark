import { Markdown } from '@/lib/markdown'
import { Empty } from '@/components/ui'

/**
 * The two-page brief as the bench wrote it. The file carries its own title,
 * dateline and sections, so the page adds nothing around it but the empty
 * state. `brief-print` lets the print stylesheet drop the site chrome, so the
 * page prints as the document alone. See D163.
 */
export function BriefDocument({ source, missing }: { source: string | null; missing: string }) {
  return (
    <article className="brief-print max-w-3xl">
      {source ? <Markdown source={source} /> : <Empty hint={missing} />}
    </article>
  )
}
