'use client'

import { useMemo, useState } from 'react'

export type Column<T> = {
  key: string
  label: string
  align?: 'left' | 'right'
  /**
   * Value to sort on. Omit to make the column unsortable, which is right for
   * columns that hold prose. Return null for cells with no data: they always
   * sort last, in both directions, so "no data" never wins a ranking.
   */
  sort?: (row: T) => number | string | null
  /**
   * Cell contents, not the cell. DataTable owns the `<td>`, so returning a
   * `<td>` or a `<Td>` here nests one inside the other. React reports that as a
   * nesting error and hydration fails, which kills sorting on the whole table.
   */
  render: (row: T) => React.ReactNode
  /** Tooltip on the header. */
  title?: string
}

type Dir = 'asc' | 'desc'

function compare(a: number | string | null, b: number | string | null, dir: Dir): number {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  const c = typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b))
  return dir === 'asc' ? c : -c
}

/**
 * Sortable table. Click a header to sort, click again to reverse.
 *
 * Numeric columns open descending, because the first question anyone asks of a
 * score column is which country is highest. Text columns open ascending.
 */
export function DataTable<T>({
  rows,
  columns,
  initialSort,
  caption,
}: {
  rows: T[]
  columns: Array<Column<T>>
  initialSort?: { key: string; dir?: Dir }
  caption?: string
}) {
  const [sort, setSort] = useState<{ key: string; dir: Dir } | null>(
    initialSort ? { key: initialSort.key, dir: initialSort.dir ?? 'asc' } : null,
  )

  const sorted = useMemo(() => {
    if (!sort) return rows
    const col = columns.find((c) => c.key === sort.key)
    if (!col?.sort) return rows
    return [...rows].sort((x, y) => compare(col.sort!(x), col.sort!(y), sort.dir))
  }, [rows, columns, sort])

  function toggle(col: Column<T>) {
    if (!col.sort) return
    setSort((cur) => {
      if (cur?.key !== col.key) {
        const firstDir: Dir = col.align === 'right' ? 'desc' : 'asc'
        return { key: col.key, dir: firstDir }
      }
      return { key: col.key, dir: cur.dir === 'asc' ? 'desc' : 'asc' }
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-xs">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((col) => {
              const active = sort?.key === col.key
              const ariaSort = active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={col.sort ? ariaSort : undefined}
                  title={col.title}
                  className={`border-b border-[var(--rule)] px-3 py-3 text-xs font-medium text-[var(--muted)] ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.sort ? (
                    <button
                      type="button"
                      onClick={() => toggle(col)}
                      className={`inline-flex items-center gap-1 rounded-md transition-all duration-200 hover:text-[var(--foreground)] ${
                        active ? 'text-[var(--foreground)]' : ''
                      }`}
                    >
                      <span>{col.label}</span>
                      <span aria-hidden="true" className="w-2 text-[0.85em] leading-none">
                        {active ? (sort.dir === 'asc' ? '↑' : '↓') : '·'}
                      </span>
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`border-b border-[var(--rule-soft)] px-3 py-2.5 ${
                    col.align === 'right' ? 'text-right tabular-nums' : ''
                  }`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
