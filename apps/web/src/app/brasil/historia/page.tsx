import type { Metadata } from 'next'
import Link from 'next/link'
import { DIMENSIONS, PT_BR, countryName } from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { CountryHistoryChart } from '@/components/views/CountryHistoryChart'
import { Empty, Headline, PageTitle, Section } from '@/components/ui'
import { loadHistory, loadHistoryIndex } from '@/lib/data'
import { countriesHistoryHref, decisionHref } from '@/lib/links'
import { PT_HISTORY_WORDS } from '@/lib/words'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Como o Brasil mudou desde 2000, NCB Brasil',
  description:
    'As nove capacidades do Brasil ano a ano desde 2000, com os indicadores de hoje, a faixa de erro do preenchimento e a parte de cada ano que foi modelada.',
}

/**
 * Brazil's reconstructed history in Portuguese: the same chart as the country
 * page, nine times, in the layer's words. Every number comes from the same
 * file the English page reads. See D174, D178 and D181.
 */
export default async function BrazilHistoryPage() {
  const [history, index] = await Promise.all([loadHistory('BRA'), loadHistoryIndex()])
  if (!history || !index) {
    return <Empty hint="A história reconstruída não está disponível nesta publicação. Rode pnpm bench history na raiz do repositório." />
  }
  const cohorts = index.cohorts.filter((c) => c.id === 'all' || c.members.includes('BRA'))
  const name = countryName(PT_BR, 'BRA')

  return (
    <>
      <PageTitle>Como o Brasil mudou desde {index.params.fromYear}?</PageTitle>
      <Headline>
        Cada capacidade ano a ano, medida com os indicadores de hoje e na régua de hoje, ao lado da
        mudança mediana dos países da América Latina e do mesmo grupo de renda.
      </Headline>
      <p className="mb-10 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        Esta história é provisória. A maioria dos indicadores começa tarde ou tem anos sem valor, e
        esses anos são preenchidos: entre dois valores publicados, repetindo o último ou por um
        modelo. A faixa sombreada mostra o tamanho do erro desse preenchimento, medido escondendo
        valores publicados e preenchendo de novo. A linha tracejada usa só o que existia em cada
        ano. Nada disto muda uma pontuação. O método está na{' '}
        <Link href={decisionHref('D174')} className="underline underline-offset-4">
          decisão D174
        </Link>{' '}
        e a comparação com todos os países está na{' '}
        <Link href={countriesHistoryHref} className="underline underline-offset-4">
          página de grupos
        </Link>
        , as duas em inglês.
      </p>

      {DIMENSIONS.map((d) => {
        const dim = history.dimensions[d]
        if (!dim) return null
        return (
          <Section
            key={d}
            title={PT_BR.dimensions[d]}
            hint={PT_BR.questions[d]}
            icon={<Icon name={DIMENSION_ICON[d]} size={22} />}
          >
            <CountryHistoryChart
              history={dim}
              dimension={d}
              label={PT_BR.dimensions[d]}
              country={name}
              cohorts={cohorts}
              words={PT_HISTORY_WORDS}
              locale={PT_BR.numberLocale}
            />
          </Section>
        )
      })}
    </>
  )
}
