import { PT_BR, factorIncomeBand, headlineFactor } from '@ncb/core'
import type { Diagnostics } from '@ncb/core'
import { NARROW_MARGIN } from '@/lib/residual'
import { ptCountWord } from '@/lib/words'

/**
 * The claim test in Portuguese, for Brazil's layer.
 *
 * `/thesis` owns the argument and reads the test in English through
 * `readFactorTest` and `readResidualStructure`. A Brazilian reader of the
 * layer needs the verdict before anything else on its front page, and needs
 * it in Portuguese, so this reads the same two published structures,
 * `diagnostics.factorStructure` (D137) and `diagnostics.residualStructure`
 * (D138), and picks each sentence by the same computed reading: the income
 * band of the shared factor, the weaker claim's verdict and the same narrow
 * margin. No number here is typed, and no reading rule is restated: a band
 * or a verdict that moves on the English page moves here in the same
 * release. Nothing reads or prints a country's residual (D65). See D158.
 */

export type VerdictPt = {
  /** The opening of the layer's front page: what holds, in two sentences. */
  opening: string
  /** The claim under test, in its two strengths. */
  claim: string
  /** How much one shared factor carries, against chance. */
  shareSentence: string
  /** The shared factor against income, or null without income. */
  incomeSentence: string | null
  /** The strong claim's verdict, from the factor's income band. */
  strongSentence: string | null
  /** The weaker claim's verdict, from the residual tests. */
  weakSentence: string | null
  /** How much of a profile income accounts for. */
  profileSentence: string | null
}

const locale = PT_BR.numberLocale
const pct = (x: number): string =>
  `${(x * 100).toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
const two = (x: number): string =>
  x.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function readVerdictPtBr(diag: Diagnostics): VerdictPt | null {
  if (!diag.factorStructure) return null
  const head = headlineFactor(diag.factorStructure)
  if (!head) return null
  const s = head.solution
  const n = s.countries
  const scope =
    head.basis === 'complete'
      ? 'com as nove capacidades pontuadas'
      : `com as ${ptCountWord(s.dimensions.length)} capacidades pontuadas em quase todos os países (${s.dimensions
          .map((d) => PT_BR.dimensions[d])
          .join(', ')})`
  const aboveChance = s.firstFactorShare > s.chance.p95
  const rest = pct(1 - s.firstFactorShare)

  const shareSentence = `Entre os ${n} países ${scope}, um único fator comum responde por ${pct(
    s.firstFactorShare,
  )} da variação. O mesmo número de capacidades sem relação entre si, medidas nos mesmos ${n} países, daria ${pct(
    s.chance.mean,
  )} por acaso, e até ${pct(s.chance.p95)} em 19 de cada 20 sorteios. ${
    aboveChance
      ? `As capacidades, portanto, andam juntas, e ${rest} da variação fica fora desse fator.`
      : 'Com estes dados, não é possível distinguir o fator comum de ruído.'
  }`

  const band = factorIncomeBand(s.income?.r ?? null)
  const r = s.income ? two(Math.abs(s.income.r)) : null
  const incomeSentence = s.income
    ? `Nos ${s.income.n} desses países com dado de renda, o fator comum tem correlação de ${r} com o logaritmo do PIB per capita, de modo que a renda responde por ${Math.round(
        s.income.rSquared * 100,
      )}% dele. ${
        band === 'strong'
          ? `O fator comum se parece com a renda. O que o NCB acrescenta além da renda está nos outros ${rest} da variação e na diferença entre as capacidades de um mesmo país.`
          : band === 'moderate'
            ? 'A renda explica parte do fator comum e deixa sem explicação uma parte relevante dele.'
            : 'O fator comum é, em sua maior parte, outra coisa que não a renda.'
      }`
    : null

  const strongSentence =
    band === 'strong'
      ? 'A versão forte não se sustenta para o que as nove capacidades têm em comum: essa parte comum é, sobretudo, renda.'
      : band === 'moderate'
        ? 'A versão forte se sustenta em parte: a renda explica uma parte do que as nove capacidades têm em comum e deixa outra parte relevante sem explicação.'
        : band === 'weak'
          ? 'A versão forte se sustenta para o que as nove capacidades têm em comum: essa parte comum é, em sua maior parte, outra coisa que não a renda.'
          : null

  const rs = diag.residualStructure
  const b = rs?.peers ?? null
  const c = rs?.stability.releases ?? null
  const narrow = b !== null && b.shapeShare - b.shapeNull.p95 < NARROW_MARGIN

  let weakSentence: string | null = null
  if (rs?.weakClaim === 'holds') {
    weakSentence = `A versão fraca se sustenta nestes dados. Países com a mesma renda têm perfis de capacidade diferentes, e esses perfis se organizam além do que o acaso produziria, de modo que o perfil de capacidades traz informação que a renda não traz.${
      c?.reading === 'mixed'
        ? ' A ordem do que sobra depois da renda se mantém, em geral, quando os indicadores mudam, então os perfis não são apenas produto da escolha dos indicadores.'
        : ''
    }${
      narrow && b
        ? ` A margem sobre o acaso é estreita, ${pct(b.shapeShare)} contra ${pct(b.shapeNull.p95)}, e por isso este é o resultado com mais chance de mudar quando países forem acrescentados.`
        : ''
    }`
  } else if (rs?.weakClaim === 'mixed') {
    weakSentence =
      b?.reading === 'differ'
        ? 'A versão fraca não está resolvida. Países com a mesma renda têm perfis diferentes, mas a ordem do que sobra depois da renda muda quando os indicadores mudam, então parte da diferença vem da escolha dos indicadores.'
        : 'A versão fraca não está resolvida. Algo sobra depois da renda, mas se comporta mais como um nível do que como um perfil: o teste não consegue mostrar que países com a mesma renda diferem, além do acaso, nas capacidades em que se saem melhor.'
  } else if (rs?.weakClaim === 'fails') {
    weakSentence =
      b?.reading === 'alike'
        ? 'A versão fraca não se sustenta nestes dados. Países com a mesma renda têm o mesmo perfil, de modo que o perfil de capacidades acrescenta pouco ao que a renda já diz.'
        : 'A versão fraca não se sustenta nestes dados. O que sobra depois da renda se comporta como ruído, de modo que o perfil de capacidades acrescenta pouco ao que a renda já diz.'
  }

  const d = rs?.incomeShare ?? null
  const profileSentence = d
    ? `Para o país típico, a renda responde por ${pct(d.median)} da distância entre o seu perfil e o perfil médio, e por ${pct(d.mean)} na média dos ${d.countries} países${
        d.mean < d.median
          ? ', puxada para baixo por países dos quais a linha de renda se afasta mais do que o perfil médio'
          : ''
      }. ${
        d.reading === 'most'
          ? 'A maior parte de um perfil de capacidades é renda.'
          : d.reading === 'part'
            ? 'A renda é parte de um perfil de capacidades, e a maior parte dele é outra coisa.'
            : 'Pouco de um perfil de capacidades é renda.'
      }`
    : null

  /* The opening states what holds, never more. The strong clause follows the
   * factor's income band and the weak clause the residual verdict, so a
   * release that moves either moves the front page's first words. */
  const openingStrong = r
    ? band === 'strong'
      ? `O que as nove capacidades têm em comum acompanha a renda: o fator comum tem correlação de ${r} com o logaritmo do PIB per capita, em ${s.income!.n} países.`
      : band === 'moderate'
        ? `A renda explica parte do que as nove capacidades têm em comum: o fator comum tem correlação de ${r} com o logaritmo do PIB per capita, em ${s.income!.n} países.`
        : `O que as nove capacidades têm em comum é, em sua maior parte, outra coisa que não a renda: o fator comum tem correlação de ${r} com o logaritmo do PIB per capita, em ${s.income!.n} países.`
    : ''
  const openingWeak =
    rs?.weakClaim === 'holds'
      ? `O teste sustenta uma afirmação mais fraca${narrow ? ', por margem estreita' : ''}: países com renda parecida têm perfis de capacidade diferentes, além do que o acaso produziria.`
      : rs?.weakClaim === 'mixed'
        ? 'Se países com renda parecida têm perfis de capacidade diferentes ainda não está resolvido nesta versão dos dados.'
        : rs?.weakClaim === 'fails'
          ? 'O teste também não sustenta a afirmação mais fraca: países com renda parecida não mostram perfis próprios além do acaso.'
          : ''
  const opening = [openingStrong, openingWeak].filter(Boolean).join(' ')

  const claim =
    'O NCB testa uma afirmação em duas versões. A versão forte diz que capacidade e riqueza são coisas separadas, de modo que as nove capacidades não acompanham simplesmente a renda. A versão fraca diz que países com a mesma renda têm perfis de capacidade diferentes, de modo que o perfil de um país informa algo que a renda não informa. Cada frase abaixo é calculada a partir da versão atual dos dados e muda quando eles mudam.'

  return {
    opening,
    claim,
    shareSentence,
    incomeSentence,
    strongSentence,
    weakSentence,
    profileSentence,
  }
}
