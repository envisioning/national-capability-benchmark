import type { Metadata } from 'next'
import Link from 'next/link'
import {
  COUNTRIES,
  DIMENSIONS,
  DISSENT_IQR,
  INDICATORS,
  PT_BR,
  isScored,
  SOURCE_TIERS,
} from '@ncb/core'
import type { MeasurementClass } from '@ncb/core'
import { CountryLabel, Eyebrow, Headline, PageTitle, Scroller, Section, Table, Td, Th } from '@/components/ui'
import { capabilityHref, challengeHref, sourcesHref } from '@/lib/links'
import { DIMENSION_ICON, Icon, TIER_ICON } from '@/components/Icon'
import { PT_METHOD } from '@/lib/words'

export const metadata: Metadata = {
  title: 'Método, NCB',
  description: 'Como estatísticas publicadas se tornam pontuações de capacidade, confiança e tendências.',
}

export default function PortugueseMethodPage() {
  const gaps = INDICATORS.filter((i) => i.ingest === 'gap').length
  const retired = INDICATORS.filter((i) => i.ingest === 'retired').length
  const wired = INDICATORS.filter(isScored).length
  const adapters = INDICATORS.filter((i) => i.ingest === 'adapter').length
  const manual = INDICATORS.filter((i) => i.ingest === 'manual').length
  const classes: MeasurementClass[] = ['C', 'I', 'O', 'P']

  return (
    <div lang="pt-BR">
      <Eyebrow>Método</Eyebrow>
      <PageTitle>A capacidade é medida separadamente da riqueza</PageTitle>
      <Headline>
        O benchmark pergunta se a capacidade de agir de um país é distinta de sua renda. Toda escolha pode ser contestada.
      </Headline>

      <Section
        title="Este benchmark existe para testar uma diferença"
        hint="Se a afirmação estiver correta, países com renda semelhante terão perfis de capacidade diferentes. Caso contrário, as dimensões acompanharão sobretudo a renda."
      >
        <ul className="max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
          <li>Todos os {COUNTRIES.length} países definem a escala. Um quadro baseado em um só país descreveria apenas aquele país.</li>
          <li>Uma pontuação alta não é uma receita. Os mecanismos dependem das condições locais. O formato indica onde olhar; o contexto indica o que construir.</li>
          <li>A capacidade muda abaixo do nível nacional, em grupos pequenos o bastante para agir. A pontuação de um país é um proxy aproximado dessas condições.</li>
          <li>Trate o benchmark como um instrumento de medição. Ele testa se uma tentativa de elevar uma capacidade funcionou. Confiança, lacunas e revisões ficam ao lado de cada pontuação.</li>
          <li>
            A página de <Link href="/diagnostics" className="underline underline-offset-4">diagnósticos</Link> testa se as dimensões se reduzem à renda. A página de <Link href="/pt/limits" className="underline underline-offset-4">limites</Link> registra falhas conhecidas.
          </li>
        </ul>
      </Section>

      <Section
        title="Isto mede capacidade, não riqueza"
        hint="O benchmark mede a capacidade de antecipar, coordenar, aprender, adaptar-se e construir sob incerteza. Riqueza, qualidade de vida e popularidade estão fora do escopo."
      >
        <Scroller>
          <Table>
            <thead>
              <tr><Th>Dimensão</Th><Th>Pergunta</Th></tr>
            </thead>
            <tbody>
              {DIMENSIONS.map((d) => (
                <tr key={d}>
                  <Td>
                    <span className="inline-flex items-center gap-2">
                      <Icon name={DIMENSION_ICON[d]} size={14} className="text-[var(--muted)]" />
                      <Link href={capabilityHref(d)} className="hover:underline">{PT_BR.dimensions[d]}</Link>
                    </span>
                  </Td>
                  <Td dim>{PT_BR.questions[d]}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section title="Um indicador passa por seis etapas até virar pontuação">
        <ol className="max-w-3xl list-decimal space-y-3 pl-5 text-lg leading-relaxed">
          <li>Use o valor comparável mais recente de cada país e indicador, com fonte e ano.</li>
          <li>Aplique a transformação declarada: por milhão, logaritmo ou distância de um alvo.</li>
          <li>Limite valores extremos com cercas de Tukey em três intervalos interquartis.</li>
          <li>Normalize de 0 a 100 contra o quadro definido por todos os {COUNTRIES.length} países. Inverta indicadores em que menos é melhor.</li>
          <li>Calcule a média dos indicadores disponíveis dentro de uma dimensão, com pesos iguais.</li>
          <li>Calcule a confiança separadamente como cobertura × atualidade × qualidade da fonte.</li>
        </ol>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">Indicadores ausentes reduzem a cobertura e saem da média. Nada é imputado. Pesos iguais mantêm a v0 fácil de contestar.</p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">O registro tem {INDICATORS.length} indicadores: {wired} com dados, {gaps} lacunas e {retired} linhas aposentadas. Lacunas não têm dataset comparável; linhas aposentadas têm um dataset rejeitado. As duas reduzem a confiança e definem a agenda de coleta. {adapters} valores vêm de adaptadores de fonte reproduzíveis e {manual} de tabelas publicadas, com datas de consulta armazenadas.</p>
      </Section>

      <Section title="Todo indicador declara o que mede" hint="O dataset classifica cada indicador como C, I, O ou P para que a classificação possa ser verificada.">
        <ul className="max-w-3xl space-y-3 text-lg leading-relaxed">
          {classes.map((c) => (
            <li key={c}><strong>{c}</strong>, {PT_METHOD.measurementClasses[c].label}. {PT_METHOD.measurementClasses[c].plain} <span className="text-[var(--muted)]">{PT_METHOD.measurementClasses[c].example}</span></li>
          ))}
        </ul>
      </Section>

      <Section title="A qualidade da fonte afeta apenas a confiança" hint="Cada nível afeta a confiança. Estimativas Delphi têm o menor peso.">
        <Scroller>
          <Table>
            <thead><tr><Th>Nível</Th><Th align="right">Peso</Th></tr></thead>
            <tbody>
              {Object.entries(SOURCE_TIERS).map(([tier, weight]) => (
                <tr key={tier}>
                  <Td><span className="inline-flex items-center gap-2"><Icon name={TIER_ICON[tier as keyof typeof TIER_ICON]} size={14} />{PT_METHOD.sourceTiers[tier] ?? tier.replace(/_/g, ' ')}</span></Td>
                  <Td align="right">{weight.toFixed(2)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--muted)]">Um nível diz quem publicou um número. A página de <Link href={sourcesHref} className="underline underline-offset-4">fontes</Link> lista o publisher, o banco e a requisição.</p>
      </Section>

      <Section title="Evidência fina aparece no gráfico" hint="A confiança nunca entra na pontuação. Evidência fina recebe borda tracejada e ponto vazado. O espaço do tracejado aumenta quando a confiança cai.">
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          <li>Cobertura é a parcela de indicadores de uma dimensão que tem valor.</li>
          <li>A atualidade cai depois de dois anos de tolerância, em uma janela de 12 anos, até o piso de 0,1.</li>
          <li>Qualidade da fonte é o peso médio dos níveis dos valores presentes.</li>
          <li>Na prática, o produto fica abaixo de 1, então as faixas refletem valores reais.</li>
        </ul>
      </Section>

      <Section title="Impulso usa apenas indicadores compatíveis" hint="Impulso mostra a mudança de pontuação ao longo do tempo no quadro atual. Apenas indicadores observados nos dois extremos contam.">
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          <li>Valores históricos usam o quadro de hoje, então a mudança reflete o país.</li>
          <li>Os mesmos indicadores aparecem nos dois extremos. Um indicador novo não pode criar movimento.</li>
          <li>A cesta pode ser menor que a dimensão, então o nível da tendência pode diferir da pontuação. Seu tamanho aparece ao lado da tendência.</li>
          <li>Extensões de 10 e 20 anos são publicadas. Uma extensão ausente mostra até onde os dados chegam.</li>
          <li>Cada indicador tem sua própria linha até 1990 quando há dados. Nada é carregado adiante ou preenchido.</li>
          <li>Cada ponto carrega o valor publicado, o valor normalizado e o nível da fonte.</li>
          <li>Cada rodada compara seus dados com o arquivo anterior e registra valores revisados, adicionados ou removidos.</li>
          <li>Valores com mais de cinco anos não contam para um ano. Valores históricos fora do quadro são limitados a 0 ou 100, e o limite fica registrado.</li>
          <li>Indicadores de adoção costumam subir para todos os países. Compare cada mudança com a mediana antes de chamá-la de progresso.</li>
        </ul>
      </Section>

      <Section title="Entregas documentadas ficam fora da pontuação" hint="Registros de evidência descrevem trabalho que uma lacuna não consegue medir. Eles não mudam pontuações.">
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          <li>Cada registro tem um número publicado, período de referência, fonte e data de consulta.</li>
          <li>Cada registro declara o que o caso não mostra.</li>
          <li>Registros nunca afetam pontuações ou confiança.</li>
          <li>Uma lacuna se torna pontuável quando uma série comparável cobre pelo menos dois países.</li>
        </ul>
      </Section>

      <Section title="Um painel revisa o que os dados não cobrem" hint="Cada panelista tem uma posição fixa. O painel interpreta a evidência baseada em fontes e revisa os indicadores.">
        <ul className="max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
          <li>Rodada 1: cada panelista pontua dimensões com pouca cobertura de fontes usando o resumo de evidências e seu conhecimento.</li>
          <li>Rodada 2: cada panelista vê as pontuações e justificativas anônimas da rodada 1, depois revisa ou defende suas pontuações.</li>
          <li>Mantemos a mediana e o intervalo interquartil. Uma faixa acima de {DISSENT_IQR} pontos é divergência não resolvida.</li>
          <li>Estimativas do painel ficam em seu próprio arquivo e nunca entram no score do indicador ou na confiança. A visão combinada usa uma apenas quando nenhum indicador foi observado.</li>
          <li>O painel também avalia classe, validade, risco de proxy de riqueza e redundância de cada indicador.</li>
          <li>A página <Link href="/delphi" className="underline underline-offset-4">Delphi</Link> mostra a rodada atual e sua proveniência. A rodada ativa é uma sessão de trabalho, não um painel.</li>
        </ul>
      </Section>

      <Section title="O conjunto de países define a escala" hint={`Todos os ${COUNTRIES.length} países definem as cercas e os extremos de cada indicador. O quadro fica fixo dentro de uma versão. Adicionar um país cria um rebase e exige uma versão majoritária.`}>
        <Scroller>
          <Table>
            <thead><tr><Th>País</Th><Th>Por que está incluído</Th></tr></thead>
            <tbody>
              {COUNTRIES.map((c) => (
                <tr key={c.iso3}>
                  <Td><CountryLabel iso3={c.iso3} name={PT_BR.countries[c.iso3] ?? c.name} /></Td>
                  <Td dim>{PT_METHOD.countryReasons[c.iso3] ?? 'País incluído no conjunto de comparação.'}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scroller>
      </Section>

      <Section title="As premissas são públicas" hint="O registro de decisões documenta cada escolha e que evidência poderia derrubá-la.">
        <ul className="max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          <li>0 e 100 são os valores mais fraco e mais forte entre os {COUNTRIES.length} países. Eles não são uma amostra do mundo, e uma pontuação baixa não é uma porcentagem de capacidade.</li>
          <li>As pontuações usam apenas a observação mais recente. Tendências usam uma cesta compatível contra o quadro atual. Nada é preenchido retroativamente ou imputado.</li>
          <li>Com {COUNTRIES.length} países, diagnósticos são pistas, não resultados estabelecidos.</li>
          <li>Séries Doing Business estão congeladas em 2019 e sofrem redução no termo de atualidade.</li>
          <li>Ao aposentar compostos de percepção, Coordenação, Confiança e Propósito compartilhado ficaram com um ou dois indicadores. A página de <Link href="/pt/limits" className="underline underline-offset-4">limites</Link> traz os detalhes.</li>
          <li>Uniformidade política nunca é tratada como capacidade.</li>
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed"><Link href={challengeHref} className="underline underline-offset-4">Como contestar qualquer parte disso</Link> e o que faria cada decisão cair.</p>
      </Section>
    </div>
  )
}
