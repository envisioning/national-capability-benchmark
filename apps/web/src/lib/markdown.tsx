import type { ReactNode } from 'react'
import { Scroller, Table, Td, Th } from '@/components/ui'
import { artefactHref, decisionHref } from '@/lib/links'

/**
 * A renderer for the small markdown subset the internal docs use: h1 to h3,
 * paragraphs, bold, italic, inline code, links, unordered lists, blockquotes,
 * tables and rules.
 *
 * Deliberately not a dependency. The docs are written in this repository, so
 * the subset is known, and a parser for the open web would be surface area for
 * content this project never produces.
 */

/**
 * Bold, italic, code, links, and bare references to a decision or an artefact.
 *
 * The docs cite each other by id: "See D21", "the same problem as A9". A reader
 * outside the repository cannot follow a code, so every one becomes a link to
 * the entry it names. The author writes the id and nothing else, so the two
 * documents stay readable as text and nobody maintains a URL by hand. See D40.
 *
 * `refs` is off inside a heading, where the id is already the anchor and a link
 * would point at itself.
 */
function inline(text: string, key = 0, refs = true): ReactNode[] {
  const out: ReactNode[] = []
  /* One pass, so a construct cannot nest wrongly inside another. */
  const re =
    /\*\*(.+?)\*\*|\*([^*\n]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\b(D\d{1,3}|A\d{1,3})\b/g
  let last = 0
  let m: RegExpExecArray | null
  let i = key
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1] !== undefined) {
      out.push(
        <strong key={`b${i}`} className="font-medium">
          {inline(m[1], i * 100, refs)}
        </strong>,
      )
    } else if (m[2] !== undefined) {
      out.push(
        <em key={`i${i}`} className="italic text-[var(--muted)]">
          {inline(m[2], i * 100 + 50, refs)}
        </em>,
      )
    } else if (m[3] !== undefined) {
      out.push(
        <code key={`c${i}`} className="rounded bg-[var(--surface-sunken)] px-1 py-0.5 text-[0.85em]">
          {m[3]}
        </code>,
      )
    } else if (m[4] !== undefined) {
      out.push(
        <a key={`l${i}`} href={m[5]} className="underline underline-offset-4">
          {m[4]}
        </a>,
      )
    } else {
      const id = m[6] as string
      if (!refs) {
        out.push(id)
      } else {
        out.push(
          <a
            key={`r${i}`}
            href={id.startsWith('D') ? decisionHref(id) : artefactHref(id)}
            className="underline underline-offset-4 decoration-dotted"
          >
            {id}
          </a>,
        )
      }
    }
    last = m.index + m[0].length
    i += 1
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

/** An anchor id for a heading: its leading token where one exists (A1, D16), else a slug. */
function headingId(text: string): string {
  const token = text.match(/^([A-Z]\d+)\b/)
  if (token) return token[1] as string
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function Markdown({ source }: { source: string }) {
  const lines = source.split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let k = 0

  const paragraph: string[] = []
  const flush = () => {
    if (paragraph.length === 0) return
    blocks.push(
      <p key={`p${k++}`} className="max-w-3xl text-lg leading-relaxed">
        {inline(paragraph.join(' '))}
      </p>,
    )
    paragraph.length = 0
  }

  while (i < lines.length) {
    const line = lines[i] as string

    if (/^---\s*$/.test(line)) {
      flush()
      i += 1
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/)
    if (heading) {
      flush()
      const level = (heading[1] as string).length
      /* The docs join an id and a title with an em dash. The viewer carries no
       * dashes, so the join renders as a colon. */
      const text = (heading[2] as string).replace(/\s+[—–]\s+/g, ': ')
      if (level === 1) {
        /* The page supplies its own title; the document's h1 would repeat it. */
        i += 1
        continue
      }
      const id = headingId(text)
      blocks.push(
        level === 2 ? (
          <h2
            key={`h${k++}`}
            id={id}
            className="mt-12 scroll-mt-20 text-2xl font-light leading-tight sm:text-3xl"
          >
            {inline(text, 0, false)}
          </h2>
        ) : (
          <h3 key={`h${k++}`} id={id} className="mt-8 scroll-mt-20 text-xl font-medium tracking-tight">
            {inline(text, 0, false)}
          </h3>
        ),
      )
      i += 1
      continue
    }

    if (/^>\s?/.test(line)) {
      flush()
      const quoted: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i] as string)) {
        quoted.push((lines[i] as string).replace(/^>\s?/, ''))
        i += 1
      }
      blocks.push(
        <blockquote
          key={`q${k++}`}
          className="my-6 max-w-3xl border-l-2 border-[var(--rule)] pl-4 text-lg leading-relaxed text-[var(--muted)]"
        >
          {inline(quoted.join(' '))}
        </blockquote>,
      )
      continue
    }

    if (/^\|/.test(line)) {
      flush()
      const rows: string[][] = []
      /* The separator row carries the author's alignment and used to be thrown
       * away. Keeping it is what lets a header sit over its own column. */
      let declared: Array<'left' | 'right' | null> = []
      while (i < lines.length && /^\|/.test(lines[i] as string)) {
        const cells = (lines[i] as string)
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => c.trim())
        if (cells.every((c) => /^:?-{3,}:?$/.test(c))) {
          /* `---:` is right. `:---` and `:---:` both fall to left, because the
           * table has no centred variant to render them into. */
          declared = cells.map((c) =>
            c.endsWith(':') && !c.startsWith(':') ? 'right' : c.startsWith(':') ? 'left' : null,
          )
        } else {
          rows.push(cells)
        }
        i += 1
      }
      const [head, ...body] = rows

      /**
       * One alignment per column, applied to the header and to every cell in it.
       *
       * Each cell used to decide for itself, so a numeric column sat right while
       * its header sat left and the two did not line up. The author's `---:`
       * wins; without one, a column whose every value reads as a number is
       * right-aligned and everything else is left.
       */
      const isNumeric = (c: string) => /^[\d+−.,%–-]+$/.test(c)
      const alignOf = (j: number): 'left' | 'right' => {
        const d = declared[j]
        if (d) return d
        const col = body.map((r) => r[j] ?? '').filter((c) => c !== '')
        return col.length > 0 && col.every(isNumeric) ? 'right' : 'left'
      }
      blocks.push(
        <div key={`t${k++}`} className="my-6">
          <Scroller>
            <Table>
              <thead>
                <tr>
                  {(head ?? []).map((c, j) => (
                    <Th key={j} align={alignOf(j)}>
                      {inline(c)}
                    </Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((r, ri) => (
                  <tr key={ri}>
                    {r.map((c, j) => (
                      <Td key={j} align={alignOf(j)}>
                        {inline(c)}
                      </Td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Scroller>
        </div>,
      )
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      flush()
      const items: string[] = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i] as string)) {
        let item = (lines[i] as string).replace(/^[-*]\s+/, '')
        i += 1
        /* Continuation lines are indented under their bullet. */
        while (i < lines.length && /^\s{2,}\S/.test(lines[i] as string)) {
          item += ` ${(lines[i] as string).trim()}`
          i += 1
        }
        items.push(item)
      }
      blocks.push(
        <ul key={`u${k++}`} className="max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          {items.map((item, j) => (
            <li key={j}>{inline(item)}</li>
          ))}
        </ul>,
      )
      continue
    }

    if (line.trim() === '') {
      flush()
      i += 1
      continue
    }

    paragraph.push(line.trim())
    i += 1
  }
  flush()

  return <div className="space-y-4">{blocks}</div>
}
