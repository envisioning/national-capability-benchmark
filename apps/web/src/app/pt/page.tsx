import Link from 'next/link'
import { PT_BR, REFERENCE_ISO3, countryName } from '@ncb/core'
import { CountryLabel, Empty, Eyebrow, Highlight, PageTitle } from '@/components/ui'
import { MISSING_DATA_HINT, loadIndex } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'NCB, agenda de capacidades',
  description:
    'Um protótipo que mede o que um país é capaz de fazer, separado de quanta riqueza ele tem.',
}

/**
 * The Portuguese entry point: an interpretation layer over the English ground
 * layer. It presents the benchmark and routes into the agendas; the deep data
 * pages stay in the ground layer on purpose, so a translated claim can always
 * be checked against its source. See D35.
 */
export default async function PortugueseHomePage() {
  const data = await loadIndex()
  if (!data) return <Empty hint={MISSING_DATA_HINT} />

  const countries = [...data.countries].sort((a, b) =>
    countryName(PT_BR, a.iso3).localeCompare(countryName(PT_BR, b.iso3), 'pt-BR'),
  )

  return (
    <div lang="pt-BR">
      <Eyebrow>Camada de interpretação em português</Eyebrow>
      <PageTitle>Agenda de capacidades</PageTitle>

      <div className="mt-4 max-w-3xl space-y-4 text-lg leading-relaxed">
        <p>
          O NCB é um protótipo que mede o que um país é capaz de fazer: antecipar mudanças,
          coordenar ação, aprender, experimentar, adaptar-se e construir sob incerteza. Ele não
          mede riqueza, conforto nem competitividade, e não produz ranking.
        </p>
        <p>
          Cada país recebe nove notas de 0 a 100, medidas contra uma régua fixada por{' '}
          {REFERENCE_ISO3.length} países de referência. A confiança na evidência é publicada ao
          lado de cada nota e nunca entra no seu cálculo. Onde a evidência é fraca, a página diz
          isso antes de dizer qualquer outra coisa.
        </p>
        <p>
          Esta camada em português interpreta uma base que permanece em inglês: os identificadores,
          os dados e o método. Nenhum número muda na tradução, e cada página aqui pode ser
          conferida contra o JSON que a gera. As páginas de dados completas, o{' '}
          <Link href="/method" className="underline underline-offset-4">
            método
          </Link>{' '}
          e o{' '}
          <Link href="/glossary" className="underline underline-offset-4">
            glossário
          </Link>{' '}
          seguem em inglês por enquanto.
        </p>
      </div>

      <div className="mt-10">
        <Highlight>
          <Link href="/pt/agenda/BRA" className="underline underline-offset-4">
            Comece pela agenda do Brasil
          </Link>
        </Highlight>
      </div>

      <h2 className="mt-12 text-2xl font-light sm:text-3xl">Cada país tem uma agenda</h2>
      <ul className="mt-6 grid gap-x-8 gap-y-2 text-lg sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((c) => (
          <li key={c.iso3}>
            <Link href={`/pt/agenda/${c.iso3}`} className="underline underline-offset-4">
              <CountryLabel iso3={c.iso3} name={countryName(PT_BR, c.iso3)} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
