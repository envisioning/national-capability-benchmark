import Link from 'next/link'
import type { CountryAgenda } from '@ncb/core'
import {
  DIMENSIONS,
  INDICATORS,
  LATAM_ISO3,
  PT_BR,
  REPO_URL,
  countryName,
  fill,
  isScored,
  signed,
  splitAgenda,
} from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { Radar } from '@/components/Radar'
import {
  ConfidenceBar,
  CountryLabel,
  DimensionLegend,
  Empty,
  Eyebrow,
  Headline,
  Highlight,
  Meta,
  PageTitle,
  Score,
  Section,
} from '@/components/ui'
import { loadAgenda } from '@/lib/agenda'
import { loadEvidence, loadIndex } from '@/lib/data'
import { countryLayer, layerSection } from '@/lib/layers'
import {
  countriesHref,
  countryProfileHref,
  decisionsHref,
  layerSectionHref,
  limitsHref,
} from '@/lib/links'
import { toProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Brasil, o que o país é capaz de fazer',
  description:
    'A camada brasileira do NCB: nove dimensões de capacidade nacional, as instituições que entregam política pública e a agenda que a evidência sustenta.',
}

/**
 * The front page of Brazil's layer.
 *
 * The benchmark itself stays comparative and English. This is the one country
 * where the project has done country-specific work, so this is the one country
 * with a reading of its own: the shape, the agenda, the institution map and
 * the subnational spread, written for a Brazilian institutional reader. It is
 * not the benchmark in Portuguese. Every number is read from the same JSON the
 * ground layer reads, and the deep method pages stay in English on purpose, so
 * a claim made here can always be checked against its source. See D69.
 */
export default async function BrazilLayerPage() {
  const layer = countryLayer('BRA')
  const data = await loadIndex()
  if (!layer || !data || data.countries.length === 0) {
    return <Empty hint="Ainda não há dados gerados. Rode pnpm bench all na raiz do repositório e recarregue." />
  }

  const total = data.countries.length
  const brazil = data.countries.find((c) => c.iso3 === 'BRA')
  const agenda = await loadAgenda('BRA')
  const split = agenda ? splitAgenda(agenda) : null
  const evidence = await loadEvidence()
  const brazilEvidence = agenda?.ownEvidence.length ?? 0
  const scoredCount = INDICATORS.filter(isScored).length

  const agendaSection = layerSection(layer, 'agenda')
  const institutionsSection = layerSection(layer, 'institutions')
  const localSection = layerSection(layer, 'local')

  const s = PT_BR.agenda
  const indicatorName = (id: string): string =>
    PT_BR.indicators[id] ?? INDICATORS.find((def) => def.id === id)?.name ?? id

  const trendLine = (d: CountryAgenda['dimensions'][number]): string =>
    d.trend
      ? fill(d.trend.clamped > 0 ? s.trendCellClamped : s.trendCell, {
          delta: signed(d.trend.delta, PT_BR.numberLocale),
          years: d.trend.spanYears,
          n: d.trend.basket,
          c: d.trend.clamped,
        })
      : s.noTrend

  const kindLabel = { raise: 'Elevar', measure: 'Medir antes de gerir', hold: 'Manter' } as const

  return (
    <>
      <Eyebrow>Camada Brasil</Eyebrow>
      <PageTitle>O que o Brasil é capaz de fazer?</PageTitle>
      <Headline>
        Nove dimensões de capacidade, medidas com dados públicos. A <Highlight>forma</Highlight>{' '}
        mostra o perfil do país; não há ranking. Cada nota vem com seus indicadores e sua
        confiança.
      </Headline>
      <p className="mb-10 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
        Riqueza e capacidade são propriedades diferentes. Países com a mesma renda podem ter perfis
        opostos. A forma mostra onde uma intervenção pode ajudar.
      </p>
      <p className="-mt-6 mb-10 max-w-3xl text-lg leading-relaxed">
        Esta é a leitura brasileira do benchmark. Ela reúne o que o projeto apurou sobre o Brasil:
        a forma nacional, a agenda calculada, o mapa das instituições que entregam política pública
        e a variação entre os estados. O benchmark comparativo, com {total} países na mesma régua,
        continua em inglês e é a fonte de cada número desta página. O código e os dados são
        abertos.{' '}
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          Abra o repositório no GitHub
        </a>
        .
      </p>

      {/* The instrument at a glance. Counts, never scores: a score in a tile
          would be a headline number, and there is none on purpose. */}
      <div className="mb-16 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { n: total, label: 'países na mesma régua' },
          { n: DIMENSIONS.length, label: 'dimensões de capacidade' },
          { n: scoredCount, label: 'indicadores com nota' },
          ...(agenda ? [{ n: agenda.gapCount, label: 'lacunas declaradas' }] : []),
          { n: evidence.length, label: 'registros de evidência' },
        ].map((t) => (
          <div key={t.label} className="rounded-xl border border-[var(--rule)] p-4">
            <div className="text-3xl font-light tabular-nums">{t.n}</div>
            <div className="mt-1 text-xs text-[var(--muted)]">{t.label}</div>
          </div>
        ))}
      </div>

      <Section
        title="O Brasil é o primeiro caso de campo"
        hint={`Os ${total} países usam as mesmas dimensões, os mesmos indicadores e a mesma régua. O Brasil é o único que também tem uma camada própria.`}
      >
        <div className="grid gap-10 lg:grid-cols-2">
          {brazil ? (
            <div>
              <DimensionLegend names={PT_BR.dimensions} />
              <div className="max-w-md rounded-xl border border-[var(--rule)] p-4">
                <Radar
                  labels="icons"
                  lex={PT_BR}
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
                  Aresta tracejada e vértice vazado marcam evidência fraca. O tracejado abre quando
                  a confiança cai; a nota não muda.
                </li>
                <li>
                  A régua vai de 0 a 100. Uma nota 10 fica perto do piso; não é 10% da capacidade.
                  Eixos sem nota ficam vazios.
                </li>
              </ul>
            </div>
          ) : null}

          {split && agenda ? (
            <div className="max-w-xl space-y-6">
              <p className="text-lg leading-relaxed">
                A agenda do Brasil, recalculada a cada rodada:
              </p>
              {(['raise', 'measure', 'hold'] as const).map((kind) =>
                split[kind].length > 0 ? (
                  <div key={kind}>
                    <div className="mb-2 text-xs uppercase tracking-[0.05em] text-[var(--muted)]">
                      {kindLabel[kind]}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {split[kind].map((d) => (
                        <Meta key={d.dimension} icon={DIMENSION_ICON[d.dimension]}>
                          {PT_BR.dimensions[d.dimension]}
                        </Meta>
                      ))}
                    </div>
                  </div>
                ) : null,
              )}
              <p className="text-lg leading-relaxed">
                A agenda explica cada linha, com fontes, lacunas e entregas documentadas.
              </p>
              {agendaSection ? (
                <p>
                  <Highlight>
                    <Link
                      href={layerSectionHref(layer, agendaSection)}
                      className="underline underline-offset-4"
                    >
                      Leia a agenda de capacidades do Brasil
                    </Link>
                  </Highlight>
                </p>
              ) : null}
              <p className="text-lg">
                <Link href={countryProfileHref('BRA')} className="underline underline-offset-4">
                  {s.profileLink}
                </Link>
              </p>
            </div>
          ) : null}
        </div>
      </Section>

      {agenda ? (
        <Section
          title="As nove dimensões"
          hint="Cada cartão mostra nota, confiança, tendência e estado da medição. Cheio = observado; vazio = lacuna; cortado = base rejeitada. Passe o cursor para ver o indicador."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {agenda.dimensions.map((d) => (
              <article key={d.dimension} className="rounded-xl border border-[var(--rule)] p-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <Icon
                    name={DIMENSION_ICON[d.dimension]}
                    size={16}
                    className="text-[var(--muted)]"
                  />
                  <h3 className="text-xl font-medium tracking-tight">
                    {PT_BR.dimensions[d.dimension]}
                  </h3>
                  <Score value={d.score} size="sm" nullLabel={s.noScore} />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                  {PT_BR.questions[d.dimension]}
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <ConfidenceBar value={d.confidence} />
                  <span className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)]">
                    <Icon
                      name={
                        d.trend
                          ? Math.abs(d.trend.delta) < 0.05
                            ? 'minus'
                            : d.trend.delta > 0
                              ? 'trending-up'
                              : 'trending-down'
                          : 'minus'
                      }
                      size={13}
                    />
                    {trendLine(d)}
                  </span>
                  <div className="mt-1 flex flex-wrap items-center gap-1" aria-hidden="true">
                    {d.scoredOn.map((id) => (
                      <span
                        key={id}
                        title={indicatorName(id)}
                        className="inline-block h-2.5 w-2.5 rounded-[3px] bg-[var(--foreground)] opacity-70"
                      />
                    ))}
                    {d.gaps.map((id) => (
                      <span
                        key={id}
                        title={indicatorName(id)}
                        className="inline-block h-2.5 w-2.5 rounded-[3px] border border-[var(--foreground)] opacity-50"
                      />
                    ))}
                    {d.retired.map((id) => (
                      <span
                        key={id}
                        title={indicatorName(id)}
                        className="relative inline-block h-2.5 w-2.5 rounded-[3px] border border-[var(--foreground)] opacity-30"
                      >
                        <span className="absolute inset-0 m-auto h-px w-3 -rotate-45 bg-[var(--foreground)]" />
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-[var(--muted)]">
                    {d.scoredOn.length}{' '}
                    {d.scoredOn.length === 1 ? 'indicador observado' : 'indicadores observados'}
                    {d.gaps.length > 0
                      ? ` · ${d.gaps.length} ${d.gaps.length === 1 ? 'lacuna' : 'lacunas'}`
                      : ''}
                    {d.retired.length > 0
                      ? ` · ${d.retired.length} ${d.retired.length === 1 ? 'base rejeitada' : 'bases rejeitadas'}`
                      : ''}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      <Section
        title="A nota nacional é a primeira camada, e não a última"
        hint="O Brasil tem vários centros de ação. A camada reúne o que a comparação internacional não alcança."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {institutionsSection ? (
            <Link
              href={layerSectionHref(layer, institutionsSection)}
              className="rounded-xl border border-[var(--rule)] p-5 transition-all duration-200 hover:border-[var(--foreground)]"
            >
              <h3 className="text-xl font-medium tracking-tight">Instituições</h3>
              <p className="mt-2 text-lg leading-relaxed text-[var(--muted)]">
                Quem autoriza, financia, regula, controla, aprende e entrega. O mapa explica
                funções e vínculos, com fonte em cada relação. Ele não mede desempenho e não altera
                nenhuma nota.
              </p>
            </Link>
          ) : null}
          {localSection ? (
            <Link
              href={layerSectionHref(layer, localSection)}
              className="rounded-xl border border-[var(--rule)] p-5 transition-all duration-200 hover:border-[var(--foreground)]"
            >
              <h3 className="text-xl font-medium tracking-tight">{localSection.label}</h3>
              <p className="mt-2 text-lg leading-relaxed text-[var(--muted)]">
                Um agregado federal responde à pergunta comparativa e esconde a variação entre as
                unidades que entregam a política. A leitura subnacional mostra essa faixa, com a
                fonte e a regra de reconciliação à vista. Esta página ainda está em inglês.
              </p>
            </Link>
          ) : null}
        </div>
      </Section>

      <Section
        title="A América Latina usa a mesma régua"
        hint={`Os ${LATAM_ISO3.length} países usam os mesmos indicadores e a mesma régua. Perfis diferentes mostram o que a renda não explica. Eixos vazios mostram dados ausentes. Abra uma forma para ver o perfil, no benchmark comparativo, em inglês.`}
      >
        <DimensionLegend names={PT_BR.dimensions} />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[...LATAM_ISO3]
            .sort((a, b) => countryName(PT_BR, a).localeCompare(countryName(PT_BR, b), 'pt-BR'))
            .map((iso3) => {
              const c = data.countries.find((x) => x.iso3 === iso3)
              if (!c) return null
              const profile = toProfile(c)
              return (
                <Link
                  key={iso3}
                  href={countryProfileHref(iso3)}
                  className="rounded-xl border border-[var(--rule)] p-4 transition-all duration-200 hover:border-[var(--foreground)]"
                >
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-xs font-medium">
                      <CountryLabel iso3={iso3} name={countryName(PT_BR, iso3)} />
                    </span>
                    <span className="text-xs text-[var(--muted)]">{iso3}</span>
                  </div>
                  <Radar
                    labels="icons"
                    interactive={false}
                    hoverLabels
                    lex={PT_BR}
                    series={[
                      {
                        label: countryName(PT_BR, iso3),
                        values: profile.values,
                        confidences: profile.confidences,
                        color: 'var(--primary)',
                      },
                    ]}
                  />
                </Link>
              )
            })}
        </div>
      </Section>

      <Section
        title="Nota e confiança ficam separadas"
        hint="A nota mostra a posição na régua. A confiança mostra a evidência: cobertura, atualidade e qualidade da fonte. Os números ficam lado a lado e dados ausentes não são imputados."
      >
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <p>
            Coordenação e Confiança, centrais à tese, são hoje as dimensões mais difíceis de medir
            com dados internacionais comparáveis. Parte do que existe se correlaciona com renda. O
            benchmark registra essa fraqueza na{' '}
            <Link href={limitsHref} className="underline underline-offset-4">
              página de limites conhecidos
            </Link>
            .
          </p>
          {agenda ? (
            <p>
              {agenda.gapCount} indicadores pedidos ainda não têm base internacional comparável.
              Cada lacuna reduz a confiança e entra na agenda de coleta.
            </p>
          ) : null}
        </div>
      </Section>

      <Section
        title="A camada brasileira não muda nenhum número"
        hint="O projeto não publica uma segunda cópia do benchmark em português. Ids, registro de indicadores, JSON, método e decisões permanecem em inglês, e esta camada lê exatamente esses arquivos."
      >
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <p>
            O{' '}
            <Link href="/method" className="underline underline-offset-4">
              método
            </Link>{' '}
            explica como uma estatística vira nota. O{' '}
            <Link href="/glossary" className="underline underline-offset-4">
              glossário
            </Link>{' '}
            define os termos destas páginas. O{' '}
            <Link href={decisionsHref} className="underline underline-offset-4">
              log de decisões
            </Link>{' '}
            registra as escolhas metodológicas e o que as derrubaria. Os{' '}
            <Link href={limitsHref} className="underline underline-offset-4">
              limites conhecidos
            </Link>{' '}
            mostram onde o benchmark falha. Tudo em inglês, aberto e datado.
          </p>
          <p>
            Os{' '}
            <Link href={countriesHref} className="underline underline-offset-4">
              {total} países medidos
            </Link>{' '}
            e suas agendas ficam no benchmark comparativo. Cada um tem a mesma leitura calculada da
            mesma régua.
          </p>
        </div>
      </Section>

      <Section
        title="O próximo teste é o uso"
        hint="Escolas de governo, institutos de pesquisa, bancos, agências de fomento e órgãos de estatística já podem usar o instrumento."
      >
        <ul className="max-w-3xl list-disc space-y-4 pl-5 text-lg leading-relaxed">
          <li>
            Ler o diagnóstico. A agenda mostra o que elevar, medir primeiro e manter, com as fontes
            à vista.
          </li>
          <li>
            Testar o método. O log registra cada escolha e o que a derrubaria; os diagnósticos
            testam a sensibilidade à renda. A revisão independente está aberta.
          </li>
          <li>
            Preencher uma lacuna. Uma série comparável para pelo menos dois países pode virar um
            indicador com nota.
          </li>
          <li>
            Registrar evidência. Entregas que os indicadores não alcançam entram como registros
            nomeados. Hoje são {evidence.length}, {brazilEvidence} sobre o Brasil. Elas mantêm
            visível o que o país já fez.
          </li>
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          A Envisioning mantém o projeto e procura parceiros institucionais para a próxima etapa. A
          conversa começa em{' '}
          <a href="https://envisioning.com" className="underline underline-offset-4" rel="noopener">
            envisioning.com
          </a>
          .
        </p>
      </Section>

      <Section
        title="O próximo trabalho está definido"
        hint={`O protótipo está publicado${data.version ? ` na versão ${data.version}` : ''}, com ${total} países. Agora precisa ficar seguro para citação.`}
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            'Fortalecer o método. Revisão independente, melhor medição de Coordenação e Confiança e um painel de modelos com proveniência registrada.',
            'Preencher lacunas. Parcerias com produtores de dados podem transformar a agenda em séries publicadas e elevar a confiança.',
            'Medir intervenções. Repetir diagnóstico e medição para descobrir o que move uma capacidade.',
          ].map((text, i) => (
            <div key={i} className="rounded-xl border border-[var(--rule)] p-5">
              <div className="text-3xl font-light text-[var(--muted)]">{i + 1}</div>
              <p className="mt-3 text-lg leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
