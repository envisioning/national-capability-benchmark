import Link from 'next/link'
import type { CountryAgenda } from '@ncb/core'
import {
  DIMENSIONS,
  INDICATORS,
  LATAM_ISO3,
  PT_BR,
  RAISE_BELOW,
  REPO_URL,
  countryName,
  countryTopic,
  fill,
  indicatorName,
  isScored,
  signed,
  splitAgenda,
  unitName,
} from '@ncb/core'
import { DIMENSION_ICON, Icon } from '@/components/Icon'
import { Radar } from '@/components/Radar'
import {
  Confidence,
  ConfidenceLegend,
  CountryLabel,
  DimensionLegend,
  Empty,
  Headline,
  Meta,
  PageTitle,
  Score,
  Section,
} from '@/components/ui'
import { loadAgenda } from '@/lib/agenda'
import { loadDiagnostics, loadEvidence, loadIndex } from '@/lib/data'
import { countryLayer, layerSection } from '@/lib/layers'
import {
  countriesHref,
  countryProfileHref,
  decisionsHref,
  diagnosticsHref,
  glossaryHref,
  layerReviewHref,
  layerSectionHref,
  layerVerdictHref,
  limitsHref,
  methodHref,
  thesisHref,
} from '@/lib/links'
import { toProfile } from '@/lib/profile'
import { readVerdictPtBr } from '@/lib/verdict-pt'
import { conditionValue } from '@/components/views/ConditionList'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'O que o Brasil é capaz de fazer, NCB',
  description:
    'A leitura brasileira do NCB: nove capacidades nacionais medidas com dados públicos, cada uma com a solidez da evidência ao lado, as instituições que executam políticas públicas e a agenda calculada a partir dos dados.',
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
 *
 * It opens on what the claim test supports, computed from the release the way
 * `/thesis` computes it, and the verdict sits on this page in Portuguese. It
 * describes and never prescribes: the agenda's three groups are named for
 * what they hold, not for what to do with them. See D130, D137, D138 and
 * D158.
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
  const diag = await loadDiagnostics()
  const verdict = diag ? readVerdictPtBr(diag) : null

  const agendaSection = layerSection(layer, 'agenda')
  const institutionsSection = layerSection(layer, 'institutions')
  const localSection = layerSection(layer, 'local')
  const supportSection = layerSection(layer, 'support')

  const s = PT_BR.agenda
  const trendLine = (d: CountryAgenda['dimensions'][number]): string =>
    d.trend
      ? fill(d.trend.clamped > 0 ? s.trendCellClamped : s.trendCell, {
          delta: signed(d.trend.delta, PT_BR.numberLocale),
          years: d.trend.spanYears,
          n: d.trend.basket,
          c: d.trend.clamped,
        })
      : s.noTrend

  /* What each group holds, never what to do with it (D130). The threshold is
   * the agenda's own. */
  const kindLabel = {
    raise: `Abaixo de ${RAISE_BELOW}, com evidência utilizável`,
    measure: 'Evidência fraca',
    hold: `${RAISE_BELOW} ou mais, com evidência utilizável`,
  } as const

  return (
    <>
      <PageTitle>O que o Brasil é capaz de fazer?</PageTitle>
      <Headline>
        Nove capacidades medidas com dados públicos. Cada pontuação vem com os indicadores em que
        se apoia e com a solidez da evidência ao lado, e não há classificação geral.
      </Headline>
      {verdict?.opening ? (
        <p className="mb-10 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">
          {verdict.opening}{' '}
          <Link href={layerVerdictHref(layer)} className="underline underline-offset-4">
            Veja o resultado do teste
          </Link>
          .
        </p>
      ) : null}
      <p className="-mt-6 mb-10 max-w-3xl text-lg leading-relaxed">
        Esta é a leitura brasileira do NCB. Ela reúne o que o projeto apurou sobre o Brasil: o
        perfil nacional, a agenda calculada, o mapa das instituições que executam políticas públicas
        e a variação entre os estados. A comparação internacional, com {total} países na mesma
        escala, está em inglês e é a fonte de cada número desta página. O código e os dados são
        abertos e estão{' '}
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          no repositório do GitHub
        </a>
        .
      </p>

      {/* The instrument at a glance. Counts, never scores: a score in a tile
          would be a headline number, and there is none on purpose. */}
      <div className="mb-16 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { n: total, label: 'países na mesma escala' },
          { n: DIMENSIONS.length, label: 'capacidades' },
          { n: scoredCount, label: 'indicadores com pontuação' },
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
        hint={`Os ${total} países usam as mesmas capacidades, os mesmos indicadores e a mesma escala. O Brasil é o único que também tem uma camada própria.`}
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
                  Aresta tracejada e vértice vazado indicam evidência fraca. O tracejado se abre à
                  medida que a solidez da evidência cai; a pontuação não muda.
                </li>
                <li>
                  A escala vai de 0 a 100. Uma pontuação 10 fica perto do piso e não significa 10%
                  da capacidade. Eixos sem pontuação ficam vazios.
                </li>
              </ul>
            </div>
          ) : null}

          {split && agenda ? (
            <div className="max-w-xl space-y-6">
              <p className="text-lg leading-relaxed">
                A agenda do Brasil, recalculada a cada versão dos dados, agrupa as capacidades
                assim:
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
                A agenda detalha cada capacidade, com fontes, lacunas e entregas documentadas.
              </p>
              {agendaSection ? (
                <p>
                  <Link
                    href={layerSectionHref(layer, agendaSection)}
                    className="underline underline-offset-4"
                  >
                    Leia a agenda de capacidades do Brasil
                  </Link>
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

      {/* The claim test, computed from the release the way /thesis computes
          it, in Portuguese. The opening above links here. See D158. */}
      {verdict ? (
        <Section id="teste" title="Quanto disto é renda?">
          <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
            <p>{verdict.claim}</p>
            <p>{verdict.shareSentence}</p>
            {verdict.incomeSentence ? <p>{verdict.incomeSentence}</p> : null}
            {verdict.strongSentence ? <p>{verdict.strongSentence}</p> : null}
            {verdict.weakSentence ? <p>{verdict.weakSentence}</p> : null}
            {verdict.profileSentence ? <p>{verdict.profileSentence}</p> : null}
            <p className="text-[var(--muted)]">
              O argumento completo, com o histórico do teste a cada versão, está na{' '}
              <Link href={thesisHref} className="underline underline-offset-4">
                tese
              </Link>
              , e cada número, regra e hipótese nula está nos{' '}
              <Link href={diagnosticsHref} className="underline underline-offset-4">
                diagnósticos
              </Link>
              , as duas páginas em inglês.
            </p>
          </div>
        </Section>
      ) : null}

      {agenda ? (
        <Section
          title="As nove capacidades"
          hint="Cada cartão mostra a pontuação, a solidez da evidência, a tendência e o estado da medição. Quadrado cheio: indicador observado; vazio: lacuna; riscado: base rejeitada."
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
                  <Score value={d.score} size="sm" nullLabel={s.noScore} locale={PT_BR.numberLocale} />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                  {PT_BR.questions[d.dimension]}
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <Confidence value={d.confidence} locale={PT_BR.numberLocale} />
                  <span className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)]">
                    <Icon
                      name={
                        d.trend
                          ? Math.abs(d.trend.delta) < 0.05
                            ? 'minus'
                            : d.trend.delta > 0
                              ? 'chevron-up'
                              : 'chevron-down'
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
                        className="inline-block h-2.5 w-2.5 rounded-[3px] bg-[var(--foreground)] opacity-70"
                      />
                    ))}
                    {d.gaps.map((id) => (
                      <span
                        key={id}
                        className="inline-block h-2.5 w-2.5 rounded-[3px] border border-[var(--foreground)] opacity-50"
                      />
                    ))}
                    {d.retired.map((id) => (
                      <span
                        key={id}
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
          <ConfidenceLegend lex={PT_BR} className="mt-5" />
        </Section>
      ) : null}

      {/* Conditions beside each capability: what the country has on one side,
          what it does on the other. Read from the agenda JSON the same way the
          cards above are, through the lexicon, and never drawn with Score
          because a raw value on the score ramp reads as a score. See D122. */}
      {agenda && agenda.dimensions.some((d) => d.conditions.length > 0) ? (
        <Section title={fill(s.conditionsHeading, { countryTopic: countryTopic(PT_BR, 'BRA') })}>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed">{s.conditionsIntro}</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {agenda.dimensions
              .filter((d) => d.conditions.length > 0)
              .map((d) => (
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
                    <Score value={d.score} size="sm" nullLabel={s.noScore} locale={PT_BR.numberLocale} />
                  </div>
                  <ul className="mt-4 space-y-3">
                    {d.conditions.map((c) => (
                      <li key={c.id}>
                        <p className="text-xs font-medium tracking-tight">
                          {indicatorName(PT_BR, c.id)}
                          {c.year === null ? '' : (
                            <span className="ml-2 font-normal text-[var(--muted)]">{c.year}</span>
                          )}
                        </p>
                        <p className="mt-1 text-lg leading-relaxed">
                          {c.value === null ? (
                            <span className="text-[var(--muted)]">sem valor</span>
                          ) : (
                            <>
                              <span className="tabular-nums">
                                {conditionValue(c.value, PT_BR.numberLocale)}
                              </span>{' '}
                              {unitName(PT_BR, c.unit)}
                              {c.rank === null ? null : (
                                <span className="text-[var(--muted)]">
                                  , {fill(s.conditionRank, { rank: c.rank, n: c.n })}
                                </span>
                              )}
                            </>
                          )}
                        </p>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
          </div>
        </Section>
      ) : null}

      <Section
        title="A pontuação nacional é só a primeira camada"
        hint="O Brasil tem vários centros de ação. A camada brasileira reúne o que a comparação internacional não alcança."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {institutionsSection ? (
            <Link
              href={layerSectionHref(layer, institutionsSection)}
              className="rounded-xl border border-[var(--rule)] p-5 transition-all duration-200 hover:border-[var(--foreground)]"
            >
              <h3 className="text-xl font-medium tracking-tight">Instituições</h3>
              <p className="mt-2 text-lg leading-relaxed text-[var(--muted)]">
                Quem autoriza, financia, regula, controla, produz conhecimento e executa. O mapa
                explica funções e vínculos, com fonte em cada relação. Ele não mede desempenho e
                não altera nenhuma pontuação.
              </p>
            </Link>
          ) : null}
          {localSection ? (
            <Link
              href={layerSectionHref(layer, localSection)}
              className="rounded-xl border border-[var(--rule)] p-5 transition-all duration-200 hover:border-[var(--foreground)]"
            >
              <h3 className="text-xl font-medium tracking-tight">
                {localSection.label}, em inglês
              </h3>
              <p className="mt-2 text-lg leading-relaxed text-[var(--muted)]">
                Um agregado federal responde à pergunta comparativa e esconde a variação entre as
                unidades que executam a política. A leitura subnacional mostra essa faixa, com a
                fonte e a regra de conciliação à vista. Ela ainda não tem versão em português.
              </p>
            </Link>
          ) : null}
        </div>
      </Section>

      <Section
        title="A América Latina está na mesma escala"
        hint={`Os ${LATAM_ISO3.length} países usam os mesmos indicadores e a mesma escala. Eixos vazios indicam dados ausentes. Cada perfil abre a página do país na comparação internacional, em inglês.`}
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
        title="Pontuação e solidez da evidência ficam separadas"
        hint="A pontuação mostra a posição na escala. A solidez da evidência mostra cobertura, atualidade e qualidade das fontes. Os dois números ficam lado a lado, e dados ausentes não são imputados."
      >
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <p>
            Coordenação e Confiança, centrais na tese, são hoje as capacidades mais difíceis de
            medir com dados internacionais comparáveis, e parte do que existe se correlaciona com a
            renda. O NCB registra essa fraqueza na{' '}
            <Link href={limitsHref} className="underline underline-offset-4">
              página de limites conhecidos
            </Link>
            .
          </p>
          {agenda ? (
            <p>
              {agenda.gapCount} indicadores previstos no modelo ainda não têm base internacional
              comparável. Cada lacuna reduz a solidez da evidência e entra na agenda de coleta.
            </p>
          ) : null}
        </div>
      </Section>

      <Section
        title="A camada brasileira não muda nenhum número"
        hint="O projeto não publica uma segunda cópia do NCB em português. Identificadores, registro de indicadores, arquivos de dados, método e decisões permanecem em inglês, e esta camada lê exatamente esses arquivos."
      >
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <p>
            O{' '}
            <Link href={methodHref} className="underline underline-offset-4">
              método
            </Link>{' '}
            explica como uma estatística vira pontuação. O{' '}
            <Link href={glossaryHref} className="underline underline-offset-4">
              glossário
            </Link>{' '}
            define os termos destas páginas. O{' '}
            <Link href={decisionsHref} className="underline underline-offset-4">
              registro de decisões
            </Link>{' '}
            guarda cada escolha metodológica e o que a derrubaria, e os{' '}
            <Link href={limitsHref} className="underline underline-offset-4">
              limites conhecidos
            </Link>{' '}
            mostram onde o NCB erra. Todas essas páginas estão em inglês, abertas e datadas.
          </p>
          <p>
            Os{' '}
            <Link href={countriesHref} className="underline underline-offset-4">
              {total} países medidos
            </Link>{' '}
            e as agendas de cada um estão na comparação internacional, todos lidos da mesma escala.
          </p>
        </div>
      </Section>

      <Section
        title="O próximo teste é o uso"
        hint="Quem pesquisa, ensina ou decide política pública já pode usar o instrumento e dizer onde ele falha."
      >
        <ul className="max-w-3xl list-disc space-y-4 pl-5 text-lg leading-relaxed">
          <li>
            Ler o diagnóstico. A agenda mostra as capacidades com as pontuações mais baixas, as de
            evidência fraca e as de pontuação mais alta, com as fontes à vista.
          </li>
          <li>
            Testar o método. O registro de decisões guarda cada escolha e o que a derrubaria, e os
            diagnósticos testam a sensibilidade à renda.{' '}
            <Link href={layerReviewHref(layer)} className="underline underline-offset-4">
              A revisão independente está aberta
            </Link>
            .
          </li>
          <li>
            Preencher uma lacuna. Uma série comparável que cubra pelo menos dois países pode virar
            um indicador com pontuação.
          </li>
          <li>
            Registrar evidência. Entregas que os indicadores não alcançam entram como registros
            nomeados. Hoje são {evidence.length}, {brazilEvidence} sobre o Brasil, e eles mantêm à
            vista o que o país já fez.
          </li>
        </ul>
        {supportSection ? (
          <p className="mt-6 max-w-3xl text-lg leading-relaxed">
            A Envisioning mantém o projeto com recursos próprios. As formas de participar, do uso à
            revisão externa e à abertura de dados, estão em{' '}
            <Link
              href={layerSectionHref(layer, supportSection)}
              className="underline underline-offset-4"
            >
              {supportSection.label}
            </Link>
            .
          </p>
        ) : null}
      </Section>

      <Section
        title="O próximo trabalho"
        hint={`O protótipo está publicado${data.version ? `, na versão ${data.version} dos dados,` : ''} com ${total} países. O próximo passo é torná-lo seguro para citação.`}
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            'Fortalecer o método. Revisão independente, melhor medição de Coordenação e Confiança e um painel de modelos com proveniência registrada.',
            'Preencher lacunas. Parcerias com produtores de dados podem transformar a agenda de coleta em séries publicadas e aumentar a solidez da evidência.',
            'Medir intervenções. Repetir o diagnóstico ao longo do tempo para saber o que move uma capacidade.',
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
