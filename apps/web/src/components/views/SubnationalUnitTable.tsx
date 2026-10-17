'use client'

import { DataTable, type Column } from '@/components/DataTable'

export type SubnationalUnitRow = {
  iso: string
  name: string
  value: number
  year: number
}

export type SubnationalUnitTableWords = {
  caption: string
  unit: string
  value: string
  gap: string
  year: string
}

/**
 * One row per constituent unit of a subnational file: the publisher's value,
 * its year and its signed distance from the national value. The values are
 * the publisher's own and never a 0 to 100 score, so no cell uses `Score`.
 */
export function SubnationalUnitTable({
  rows,
  national,
  words,
  locale,
}: {
  rows: SubnationalUnitRow[]
  national: number
  words: SubnationalUnitTableWords
  locale: string
}) {
  const fixed = (n: number) =>
    n.toLocaleString(locale, { minimumFractionDigits: 3, maximumFractionDigits: 3 })
  /* Rounded before the sign is read, so a float residue never prints -0,000. */
  const signedFixed = (n: number) => {
    const r = Math.round(n * 1000) / 1000
    return r > 0 ? `+${fixed(r)}` : fixed(r === 0 ? 0 : r)
  }

  const columns: Array<Column<SubnationalUnitRow>> = [
    {
      key: 'name',
      label: words.unit,
      sort: (row) => row.name,
      render: (row) => row.name,
    },
    {
      key: 'value',
      label: words.value,
      align: 'right',
      sort: (row) => row.value,
      render: (row) => <span className="tabular-nums">{fixed(row.value)}</span>,
    },
    {
      key: 'gap',
      label: words.gap,
      align: 'right',
      sort: (row) => row.value - national,
      render: (row) => <span className="tabular-nums">{signedFixed(row.value - national)}</span>,
    },
    {
      key: 'year',
      label: words.year,
      align: 'right',
      sort: (row) => row.year,
      render: (row) => <span className="tabular-nums">{row.year}</span>,
    },
  ]

  return (
    <DataTable
      rows={rows}
      columns={columns}
      caption={words.caption}
      initialSort={{ key: 'name', dir: 'asc' }}
    />
  )
}
