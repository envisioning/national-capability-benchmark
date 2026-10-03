import Link from 'next/link'
import { CONTRIBUTING_DOC, EVIDENCE_DOC, ISSUES_URL, REPO_URL, docHref } from '@ncb/core'
import { Headline, Note, PageTitle, Section } from '@/components/ui'
import { countryLayer, layerSection } from '@/lib/layers'
import {
  contactTopicHref,
  countryProfileHref,
  decisionsHref,
  layerSectionHref,
  layerVerdictHref,
  limitsHref,
  objectionsHref,
} from '@/lib/links'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Como participar, NCB Brasil',
  description:
    'Como uma instituição brasileira pode participar do NCB: usar o instrumento, revisar o método de fora, abrir dados e receber um debate sobre os resultados.',
}

/**
 * Brazil's reading of taking part.
 *
 * The project is self-funded, so this page asks for no money and names no
 * funding window (owner, 2026-10-03). It asks for four things a Brazilian
 * institution can give: use, an outside review of the method, open data and
 * a venue for a seminar. No institution is named in an ask; the data sources
 * named are where Brazilian series come from. Every invitation to write ends
 * at the one contact page, because the project has one inbox. See D71 and
 * D158.
 */
export default function BrazilSupportPage() {
  const layer = countryLayer('BRA')
  const agendaSection = layer ? layerSection(layer, 'agenda') : null
  const institutionsSection = layer ? layerSection(layer, 'institutions') : null

  return (
    <>
      <PageTitle>Como participar</PageTitle>
      <Headline>
        O NCB é aberto e gratuito, e a Envisioning o mantém com recursos próprios. Do que ele
        precisa agora é de uso, de revisão externa, de dados abertos e de espaço para debate.
      </Headline>

      <Note>
        Nada nesta página é condição para usar o NCB. Os dados e o código são abertos.
      </Note>

      <Section
        title="Use o NCB e diga onde ele falha"
        hint="Uma medida que ninguém aplica continua sendo hipótese. O mais útil é confrontar o NCB com uma questão que sua instituição já está examinando."
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
            : as capacidades com as pontuações mais baixas, as de evidência fraca e as de
            pontuação mais alta, cada uma com suas fontes.
          </li>
          <li>
            Leia{' '}
            <Link href={limitsHref} className="underline underline-offset-4">
              os limites conhecidos
            </Link>{' '}
            antes de citar qualquer pontuação. Algumas pontuações dizem mais sobre a falta de dados
            do que sobre o país, e o projeto indica quais são.
          </li>
          <li>
            Discorde de uma pontuação específica na{' '}
            <Link href={objectionsHref} className="underline underline-offset-4">
              página de contestações
            </Link>
            , em inglês. A objeção fica publicada ao lado do número que ela contesta.
          </li>
        </ul>
      </Section>

      <Section
        id="revisao"
        title="Revise o método de fora"
        hint="O método foi escrito e testado dentro do projeto. Ele precisa de quem o leia sem ter participado dele."
      >
        <ul className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <li>
            O teste de renda é o ponto que mais pede um olhar externo: quanto as nove capacidades
            têm em comum, quanto disso acompanha a renda e o que sobra depois dela.{' '}
            {layer ? (
              <Link href={layerVerdictHref(layer)} className="underline underline-offset-4">
                O resultado da versão atual
              </Link>
            ) : (
              'O resultado da versão atual'
            )}{' '}
            está na página inicial da camada.
          </li>
          <li>
            A leitura do que sobra depois da renda, país por país, fica fora do ar até que uma
            decisão a publique, e essa decisão depende de uma revisão externa do método.
          </li>
          <li>
            O{' '}
            <Link href={decisionsHref} className="underline underline-offset-4">
              registro de decisões
            </Link>
            , em inglês, guarda cada escolha, o custo dela e o que a derrubaria. Uma revisão pode
            partir de qualquer entrada.
          </li>
          <li>
            Para propor uma revisão,{' '}
            <Link href={contactTopicHref('research')} className="underline underline-offset-4">
              escreva para o projeto
            </Link>
            . O formulário está em inglês, e você pode escrever em português.
          </li>
        </ul>
      </Section>

      <Section
        title="Abra dados e evidência"
        hint="Cada lacuna declarada no registro é um item de coleta. Fechar uma vale mais do que qualquer comentário."
      >
        <ul className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <li>
            Séries nacionais do IBGE, do Ipea, do Ipeadata, do Tesouro, da CGU e dos ministérios
            entram como observações de origem nacional, com o tipo de fonte registrado em cada
            ponto. O{' '}
            <a href={docHref(CONTRIBUTING_DOC)} className="underline underline-offset-4">
              guia de contribuição
            </a>
            , em inglês, explica o que uma proposta precisa trazer.
          </li>
          <li>
            Uma entrega documentada de política pública, com publicador identificado, vira registro
            de evidência. Esses registros nunca entram na pontuação. São eles que permitem ler uma
            capacidade que ainda não tem base de dados.{' '}
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
            cresce por contribuição. Uma organização que executa política pública e não aparece
            nele pode ser incluída a partir de uma fonte.
          </li>
          <li>
            Correções e erros vão para{' '}
            <a
              href={ISSUES_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              a lista de pendências do repositório
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
            . Para oferecer uma série ou uma base,{' '}
            <Link href={contactTopicHref('data')} className="underline underline-offset-4">
              escreva para o projeto
            </Link>
            .
          </li>
        </ul>
      </Section>

      <Section
        title="Sedie um debate sobre os resultados"
        hint="Uma medida como esta é posta à prova quando é discutida por quem conhece os dados."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          Se sua instituição pode sediar um seminário, uma oficina com equipes técnicas ou uma
          mesa de discussão sobre o método e os resultados do Brasil,{' '}
          <Link href={contactTopicHref('research')} className="underline underline-offset-4">
            escreva para o projeto
          </Link>
          . A apresentação cobre o teste de renda, o mapa de capacidades diante dos pares de renda
          e os limites dos dados.
        </p>
      </Section>

      <Section title="Continue a conversa">
        <p className="max-w-3xl text-lg leading-relaxed">
          Se nada acima serve ainda, conversar já é útil. Conte o que sua instituição mede, o que
          ela não consegue medir e que questão você gostaria que estes dados ajudassem a
          examinar.{' '}
          <Link href={contactTopicHref('general')} className="underline underline-offset-4">
            Escreva para o projeto
          </Link>
          . O formulário está em inglês, e você pode escrever em português.
        </p>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          O{' '}
          <Link href={countryProfileHref('BRA')} className="underline underline-offset-4">
            perfil comparativo do Brasil
          </Link>{' '}
          continua em inglês, e é nele que cada número desta camada pode ser conferido.
        </p>
      </Section>
    </>
  )
}
