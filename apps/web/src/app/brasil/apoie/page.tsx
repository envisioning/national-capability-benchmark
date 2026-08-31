import Link from 'next/link'
import { CONTRIBUTING_DOC, EVIDENCE_DOC, ISSUES_URL, REPO_URL, docHref } from '@ncb/core'
import { Headline, Note, PageTitle, Section } from '@/components/ui'
import { countryLayer, layerSection } from '@/lib/layers'
import {
  objectionsHref,
  contactHref,
  countryProfileHref,
  layerSectionHref,
  limitsHref,
  supportHref,
} from '@/lib/links'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Apoie o NCB, camada Brasil',
  description:
    'Como uma instituição brasileira pode sustentar o benchmark: usar, contribuir com dados e financiar uma parte nomeada do trabalho.',
}

/**
 * Brazil's reading of the support page.
 *
 * Same three ways as the ground layer, written for a Brazilian institutional
 * reader and naming the funding venues that exist in Brazil. It is not a
 * translation: the ground page names research grants in general and this one
 * names the windows a Brazilian institution actually holds. Both end at the
 * same contact page, because the project has one inbox. See D71.
 */
export default function BrazilSupportPage() {
  const layer = countryLayer('BRA')
  const agendaSection = layer ? layerSection(layer, 'agenda') : null
  const institutionsSection = layer ? layerSection(layer, 'institutions') : null

  return (
    <>
      <PageTitle>Apoie o benchmark</PageTitle>
      <Headline>
        O benchmark é aberto e gratuito. O que ele ainda precisa é de uso, evidência e tempo. Uma
        instituição brasileira pode dar os três.
      </Headline>

      <Note>
        Nada nesta página é condição para usar o benchmark. Os dados e o código são abertos, e a
        camada brasileira continua publicada tenha ela financiamento ou não.
      </Note>

      <Section
        title="Use e diga onde falhou"
        hint="Uma medida que ninguém aplica continua sendo hipótese. O mais útil é colocar o benchmark contra uma decisão que sua instituição já está tomando."
      >
        <ul className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <li>
            Comece pela{' '}
            {layer && agendaSection ? (
              <Link
                href={layerSectionHref(layer, agendaSection)}
                className="underline underline-offset-4"
              >
                agenda do Brasil
              </Link>
            ) : (
              'agenda do Brasil'
            )}
            : o que elevar, o que medir antes de gerir e o que manter.
          </li>
          <li>
            Leia{' '}
            <Link href={limitsHref} className="underline underline-offset-4">
              os limites conhecidos
            </Link>{' '}
            antes de citar qualquer nota. Algumas notas dizem mais sobre a lacuna de dados do que
            sobre o país, e o projeto avisa quais são.
          </li>
          <li>
            Discorde de uma nota específica na{' '}
            <Link href={objectionsHref} className="underline underline-offset-4">
              página de contestação
            </Link>
            . A objeção fica publicada ao lado do número que ela contesta.
          </li>
        </ul>
      </Section>

      <Section
        title="Contribua com dados e evidência"
        hint="Cada lacuna declarada no registro é um item de coleta. Fechar uma vale mais do que qualquer comentário."
      >
        <ul className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <li>
            Séries nacionais do IBGE, do Ipea, do Ipeadata, do Tesouro, da CGU e dos ministérios
            entram como observações de origem nacional, com o tipo de fonte registrado em cada
            ponto.{' '}
            <a href={docHref(CONTRIBUTING_DOC)} className="underline underline-offset-4">
              O CONTRIBUTING.md
            </a>{' '}
            explica o que uma proposta precisa carregar.
          </li>
          <li>
            Uma entrega documentada de política pública, com publicador identificado, vira registro
            de evidência. Esses registros nunca entram na nota. São o que permite ler uma
            capacidade que ainda não tem conjunto de dados.{' '}
            <a href={docHref(EVIDENCE_DOC)} className="underline underline-offset-4">
              A regra de inclusão
            </a>{' '}
            é curta.
          </li>
          <li>
            O{' '}
            {layer && institutionsSection ? (
              <Link
                href={layerSectionHref(layer, institutionsSection)}
                className="underline underline-offset-4"
              >
                mapa de instituições
              </Link>
            ) : (
              'mapa de instituições'
            )}{' '}
            cresce por contribuição. Se sua organização entrega política pública e não está ali,
            ela deveria estar.
          </li>
          <li>
            Correções e erros vão para{' '}
            <a
              href={ISSUES_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              o rastreador de issues
            </a>
            , e o código está{' '}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              no GitHub
            </a>
            .
          </li>
        </ul>
      </Section>

      <Section
        title="Financie uma parte nomeada"
        hint="O trabalho é modular de propósito. Um financiador banca uma peça com escopo e entrega definidos."
      >
        <ul className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <li>
            <span className="font-medium">Uma capacidade</span>: uma dimensão, seus indicadores, suas
            lacunas fechadas e seu corpo de evidência construído.
          </li>
          <li>
            <span className="font-medium">A camada brasileira</span>: a leitura do país em português,
            com o mapa institucional e a variação entre os estados mantidos atualizados.
          </li>
          <li>
            <span className="font-medium">Um adaptador de fonte</span>: um publicador integrado e
            mantido, o que eleva a confiança de todos os países de uma vez.
          </li>
          <li>
            <span className="font-medium">O painel de especialistas</span>: uma rodada revisada sobre o
            conjunto completo de países, que é o que transforma estimativa de sessão em evidência.
          </li>
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          Peças desse tamanho cabem nas janelas que já existem no Brasil: chamadas da Finep e do
          CNPq, editais das fundações estaduais de amparo à pesquisa, fundos e programas do BNDES,
          cooperação técnica com BID, Banco Mundial e CAF, e editais de fundações privadas que
          financiam capacidade estatal. Escolas de governo e institutos de pesquisa aplicada podem
          entrar como parceiros executores em vez de financiadores.
        </p>
      </Section>

      <Section
        title="Continue a conversa"
        hint="O benchmark melhora por discordância, não por concordância."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          Se nada acima serve ainda, conversar já é útil. Conte o que sua instituição mede, o que
          ela não consegue medir e qual decisão você gostaria que isto informasse.{' '}
          <Link href={`${contactHref}?topic=support`} className="underline underline-offset-4">
            Uma mensagem chega a uma pessoa
          </Link>
          . O formulário está em inglês, mas você pode escrever em português e a resposta vem em
          português.
        </p>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          O{' '}
          <Link href={countryProfileHref('BRA')} className="underline underline-offset-4">
            perfil comparativo do Brasil
          </Link>{' '}
          e{' '}
          <Link href={supportHref} className="underline underline-offset-4">
            a página de apoio do projeto
          </Link>{' '}
          continuam em inglês, que é a camada onde cada número desta página pode ser conferido.
        </p>
      </Section>
    </>
  )
}
