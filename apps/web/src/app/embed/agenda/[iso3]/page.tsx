import { notFound } from 'next/navigation'
import { DIMENSION_LABELS, splitAgenda } from '@ncb/core'
import { EmbedShell, embedTheme } from '@/components/EmbedShell'
import { Markdown } from '@/lib/markdown'
import { loadAgenda } from '@/lib/agenda'
import { absoluteHref, agendaHref } from '@/lib/links'

export const revalidate = 1800

function itemText(items: ReturnType<typeof splitAgenda>['raise']): string {
  if (items.length === 0) return 'This group has no dimensions.'
  return items
    .map((item) => {
      const score = item.score === null ? 'not measured' : item.score.toFixed(1)
      return `${DIMENSION_LABELS[item.dimension]} (${score})`
    })
    .join('; ')
}

export default async function AgendaEmbedPage({
  params,
  searchParams,
}: {
  params: Promise<{ iso3: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ iso3 }, query] = await Promise.all([params, searchParams])
  const agenda = await loadAgenda(iso3)
  if (!agenda) notFound()

  const { raise, measure, hold } = splitAgenda(agenda)
  const markdown = [
    `- **Raise:** ${itemText(raise)}`,
    `- **Measure:** ${itemText(measure)}`,
    `- **Hold:** ${itemText(hold)}`,
  ].join('\n')

  return (
    <EmbedShell theme={embedTheme(query)}>
      <div className="embed-card">
        <p className="embed-kicker">National Capability Benchmark</p>
        <h1 className="font-display text-3xl font-light leading-tight" style={{ fontVariationSettings: '"wght" 300, "wdth" 100' }}>
          Capability agenda: {agenda.country}
        </h1>
        <div className="embed-agenda">
          <Markdown source={markdown} />
        </div>
        <p className="embed-source">
          <a href={absoluteHref(agendaHref(agenda.iso3))}>Open the full capability agenda</a>
        </p>
      </div>
    </EmbedShell>
  )
}
