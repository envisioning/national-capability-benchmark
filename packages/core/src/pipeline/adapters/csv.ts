/** One CSV row keyed by its header. */
export type CsvRow = Record<string, string>

/** Parse one RFC 4180 row without adding a runtime dependency for one source. */
export function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let field = ''
  let quoted = false
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (quoted) {
      if (char === '"' && line[i + 1] === '"') {
        field += '"'
        i += 1
      } else if (char === '"') {
        quoted = false
      } else {
        field += char
      }
    } else if (char === '"' && field.length === 0) {
      quoted = true
    } else if (char === ',') {
      fields.push(field)
      field = ''
    } else {
      field += char
    }
  }
  fields.push(field)
  return fields
}

/** Parse a whole CSV with a header row, failing loudly on a missing column. */
export function parseCsv(text: string, required: string[], label: string): CsvRow[] {
  const lines = text.split(/\r?\n/).filter((line) => line.length > 0)
  if (lines.length < 2) throw new Error(`${label} CSV has no data rows`)
  const headers = parseCsvLine(lines[0]!)
  for (const name of required) {
    if (!headers.includes(name)) throw new Error(`${label} CSV is missing ${name}`)
  }
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))
  })
}
