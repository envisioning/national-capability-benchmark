import Link from 'next/link'
import { PT_BR, countryName, splitAgenda } from '@ncb/core'
import { Radar } from '@/components/Radar'
import {
  CountryLabel,
  DimensionLegend,
  Empty,
  Eyebrow,
  Headline,
  Highlight,
  PageTitle,
  Section,
} from '@/components/ui'
import { loadAgenda } from '@/lib/agenda'
import { loadEvidence, loadIndex } from '@/lib/data'
import { agendaHref, countryProfileHref, decisionsHref, limitsHref } from '@/lib/links'
import { toProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'NCB, o que o Brasil é capaz de fazer',
  description:
    'Nove dimensões de capacidade nacional, medidas a partir de dados públicos e lidas em português. O Brasil é o primeiro caso de campo.',
  alternates: { languages: { en: '/' } },
}

/**
 * The Portuguese entry point: an interpretation layer over the English ground
 * layer, and the page the project shows a Brazilian institution first. It
 * presents the claim, reads Brazil's agenda, states the measurement gap and
 * the road ahead, and routes into the agendas. The deep data pages stay in the
 * ground layer on purpose, so a translated claim can always be checked against
 * its source. See D35.
 */
export default async function PortugueseHomePage() {
  const data = await loadIndex()
  if (!data || data.countries.length === 0) {
    return (
      <div lang="pt-BR">
        <Empty hint="Ainda não há dados gerados. Rode pnpm bench all na raiz do repositório e recarregue." />
      </div>
    )
  }

  const countries = [...data.countries].sort((a, b) =>
    countryName(PT_BR, a.iso3).localeCompare(countryName(PT_BR, b.iso3), 'pt-BR'),
  )
  const total = data.countries.length

  const brazil = data.countries.find((c) => c.iso3 === 'BRA')
  const agenda = await loadAgenda('BRA')
  const split = agenda ? splitAgenda(agenda) : null
  const evidence = await loadEvidence()
  const brazilEvidence = agenda?.ownEvidence.length ?? 0

  const listNames = (items: Array<{ dimension: keyof typeof PT_BR.dimensions }>) =>
    new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' }).format(
      items.map((d) => PT_BR.dimensions[d.dimension]),
    )

  return (
    <div lang="pt-BR">
      <Eyebrow>Edição em português</Eyebrow>
      <PageTitle>O que o Brasil é capaz de fazer?</PageTitle>
      <Headline>
        Nove dimensões de capacidade, medidas a partir de dados públicos e lidas como uma{' '}
        <Highlight>forma</Highlight>, e não como uma posição em um ranking. Cada nota carrega os
        indicadores que a produziram e um segundo número que diz quanto sabemos sobre ela.
      </Headline>
      <p className="mb-10 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        A aposta em teste é simples: riqueza e capacidade são propriedades diferentes de um país, e
        a segunda pode ser observada por conta própria. Dois países com a mesma renda podem ter
        formas de capacidade opostas, e é a forma que diz onde uma intervenção teria efeito.
      </p>

      <Section
        title="O Brasil é o primeiro caso de campo"
        hint={`O projeto nasceu de uma estratégia sobre capacidade nacional que aponta o Brasil como o lugar onde os resultados devem ser úteis primeiro. O modelo não trata o Brasil como caso especial: as mesmas nove dimensões, os mesmos indicadores e a mesma régua valem para os ${total} países medidos.`}
      >
        <div className="grid gap-8 lg:grid-cols-2">
          {brazil ? (
            <div>
              <DimensionLegend names={PT_BR.dimensions} />
              <div className="max-w-md rounded-xl border border-[var(--rule)] p-4">
                <Radar
                  labels="icons"
                  names={PT_BR.dimensions}
                  noDataLabel={PT_BR.agenda.noScore}
                  series={[
                    {
                      label: countryName(PT_BR, 'BRA'),
                      values: toProfile(brazil).values,
                      confidences: toProfile(brazil).confidences,
                      color: 'var(--primary)',
                    },
                  ]}
                />
              </div>
              <ul className="mt-3 max-w-md space-y-1 text-xs leading-relaxed text-[var(--muted)]">
                <li>
                  Aresta tracejada e vértice vazado marcam evidência fraca, e o tracejado abre
                  conforme a confiança cai. O vértice continua na nota, porque a confiança nunca a
                  move.
                </li>
                <li>
                  0 a 100 é uma posição dentro da régua que os {total} países constroem juntos. Uma
                  nota 10 põe o país perto do piso da régua, sem significar 10 por cento de uma
                  capacidade.
                </li>
              </ul>
            </div>
          ) : null}

          {split && agenda ? (
            <div className="max-w-xl space-y-4 text-lg leading-relaxed">
              <p>A agenda do Brasil, calculada dos dados e recalculada a cada rodada:</p>
              <ul className="list-disc space-y-2 pl-5">
                {split.raise.length > 0 ? (
                  <li>
                    Elevar, da nota mais baixa para a mais alta: {listNames(split.raise)}.
                  </li>
                ) : null}
                {split.measure.length > 0 ? (
                  <li>
                    Medir antes de gerir, porque a evidência ainda não sustenta uma decisão:{' '}
                    {listNames(split.measure)}.
                  </li>
                ) : null}
                {split.hold.length > 0 ? (
                  <li>Manter: {listNames(split.hold)}.</li>
                ) : null}
              </ul>
              <p>
                A agenda completa explica cada linha, com as fontes de cada número, as lacunas de
                medição e entregas documentadas em outros países.
              </p>
              <p>
                <Highlight>
                  <Link href={agendaHref('BRA', 'pt-BR')} className="underline underline-offset-4">
                    Leia a agenda de capacidades do Brasil
                  </Link>
                </Highlight>
              </p>
              <p className="text-lg">
                <Link
                  href={countryProfileHref('BRA')}
                  className="underline underline-offset-4"
                >
                  {PT_BR.agenda.profileLink}
                </Link>
              </p>
            </div>
          ) : null}
        </div>
      </Section>

      <Section
        title="A nota e a confiança são afirmações separadas"
        hint="A nota diz onde o país está dentro da régua. A confiança diz quanta evidência sustenta essa posição: cobertura, atualidade e qualidade da fonte. Os dois números aparecem sempre lado a lado e nunca se misturam, e nada é imputado para cobrir um dado ausente."
      >
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <p>
            Essa separação pesa mais no Brasil do que em quase qualquer outra página deste site. As
            duas dimensões mais centrais da tese, Coordenação e Confiança, são hoje as mais
            difíceis de medir com dados internacionais comparáveis, e parte do que existe se
            correlaciona com renda. O benchmark registra essa fraqueza por escrito, na{' '}
            <Link href={limitsHref} className="underline underline-offset-4">
              página de limites conhecidos
            </Link>
            .
          </p>
          {agenda ? (
            <p>
              Dos indicadores que a especificação pede, {agenda.gapCount} ainda não têm base de
              dados internacional comparável. Cada lacuna reduz a confiança enquanto não for
              preenchida. Essa lista é a agenda de coleta de dados do projeto, e preencher uma
              linha dela está ao alcance de um órgão de estatística, um grupo de pesquisa ou um
              ministério.
            </p>
          ) : null}
        </div>
      </Section>

      <Section
        title="Nenhum número muda na tradução"
        hint="A base do benchmark permanece em inglês de ponta a ponta: identificadores, registro de indicadores, JSON publicado, método e log de decisões. Esta edição em português é uma camada de interpretação sobre essa base, e cada afirmação daqui pode ser conferida contra o arquivo que a gera."
      >
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <p>
            O{' '}
            <Link href="/method" className="underline underline-offset-4">
              método
            </Link>{' '}
            explica como uma estatística publicada vira nota. O{' '}
            <Link href="/glossary" className="underline underline-offset-4">
              glossário
            </Link>{' '}
            define cada termo destas páginas. O{' '}
            <Link href={decisionsHref} className="underline underline-offset-4">
              log de decisões
            </Link>{' '}
            registra cada escolha metodológica e a evidência que a derrubaria. Os{' '}
            <Link href={limitsHref} className="underline underline-offset-4">
              limites conhecidos
            </Link>{' '}
            dizem onde um número está errado sobre o mundo. Tudo em inglês, aberto e datado.
          </p>
        </div>
      </Section>

      <Section
        title="O benchmark se prova em uso"
        hint="Um instrumento de medição só vale alguma coisa quando alguém decide com ele. Para escolas de governo, institutos de pesquisa, bancos e agências de fomento e órgãos de estatística, existem usos imediatos, sem depender de nenhuma etapa futura."
      >
        <ul className="max-w-3xl list-disc space-y-4 pl-5 text-lg leading-relaxed">
          <li>
            Ler o diagnóstico. A agenda de cada país diz o que a evidência manda elevar, o que
            precisa ser medido antes de ser gerido e o que manter, com as fontes de cada número à
            vista.
          </li>
          <li>
            Tentar derrubar o método. Cada escolha está registrada no log de decisões junto com a
            evidência que a derrubaria, e os diagnósticos testam a sensibilidade das dimensões à
            renda. A revisão independente, por pesquisadores de administração pública, economia e
            estatística, é o convite em aberto.
          </li>
          <li>
            Preencher uma lacuna. Uma série comparável que cubra pelo menos dois países já
            transforma uma lacuna em indicador com nota, e as lacunas declaradas estão listadas
            dimensão por dimensão em cada agenda.
          </li>
          <li>
            Registrar evidência. Entregas documentadas que os indicadores não alcançam entram como
            registros de evidência com editor nomeado: hoje são {evidence.length} registros,{' '}
            {brazilEvidence} deles sobre o Brasil. Eles nunca entram em uma nota; existem para
            manter visível o que o país já fez.
          </li>
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          A Envisioning mantém o projeto e procura parceiros institucionais para a próxima etapa. A
          conversa começa em{' '}
          <a
            href="https://envisioning.com"
            className="underline underline-offset-4"
            rel="noopener"
          >
            envisioning.com
          </a>
          .
        </p>
      </Section>

      <Section
        title="O que vem a seguir tem três etapas"
        hint={`O protótipo está publicado${data.version ? `, versão ${data.version}` : ''}, com ${total} países. O caminho até um instrumento que uma instituição possa citar com segurança tem ordem.`}
      >
        <ol className="max-w-3xl list-decimal space-y-4 pl-5 text-lg leading-relaxed">
          <li>
            Endurecer o método. Submeter o modelo a revisores independentes, fortalecer a medição
            de Coordenação e Confiança e substituir a estimativa de sessão atual por um painel de
            modelos com proveniência registrada.
          </li>
          <li>
            Preencher as lacunas com dados nacionais comparáveis. Parcerias com produtores de
            dados transformam a agenda de medição em séries publicadas, e cada série nova sobe a
            confiança de uma dimensão inteira.
          </li>
          <li>
            Medir intervenções. O instrumento fecha um ciclo: diagnóstico, intervenção, nova
            medição, evidência sobre o que de fato move uma capacidade. Uma publicação anual sobre
            o estado da capacidade brasileira é o horizonte desta etapa.
          </li>
        </ol>
      </Section>

      <Section
        title="Cada país tem uma agenda"
        hint="A mesma leitura existe para cada país medido, calculada da mesma régua."
      >
        <ul className="grid gap-x-8 gap-y-2 text-lg sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c) => (
            <li key={c.iso3}>
              <Link href={agendaHref(c.iso3, 'pt-BR')} className="underline underline-offset-4">
                <CountryLabel iso3={c.iso3} name={countryName(PT_BR, c.iso3)} />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
