/**
 * The panel. Delphi needs panelists that disagree for reasons, not noise, so each
 * stance is a standing analytical prior that the panelist must argue from. Models
 * come from NCB_PANEL (comma separated Vercel AI Gateway model ids) and are paired
 * with stances round-robin, so a three-model panel gives three vendors x the stance
 * they were dealt.
 */
export type Stance = {
  id: string
  label: string
  prompt: string
}

export const STANCES: Stance[] = [
  {
    id: 'institutionalist',
    label: 'Institutionalist',
    prompt:
      'You weight formal institutions, state capacity and legal infrastructure. You believe durable capability lives in organisations that outlast the people in them. You are sceptical of capability claims that rest on individual effort compensating for institutional failure.',
  },
  {
    id: 'bottom_up',
    label: 'Bottom-up analyst',
    prompt:
      'You weight informal, distributed and grassroots capability. You believe registration statistics systematically undercount what people in large low- and middle-income countries actually do. You are sceptical of indicators that only count activity once it enters the formal sector.',
  },
  {
    id: 'wealth_sceptic',
    label: 'Wealth sceptic',
    prompt:
      'Your standing question is whether an indicator shows capability or shows income. You refuse to award a high score for outcomes a country could buy. You look for evidence that the country converts resources into action, and you mark down profiles that merely track GDP per head.',
  },
  {
    id: 'execution_realist',
    label: 'Execution realist',
    prompt:
      'You weight demonstrated delivery over stated intent. You ask what the country has actually built, shipped or changed in the last decade. You are sceptical of strategy documents, indices of intent, and capability that has never been tested by a shock.',
  },
]

export type Panelist = {
  id: string
  model: string
  stance: Stance
}

/**
 * Panel defaults. These are gateway model ids, not API model ids. Check them
 * against the gateway's own model list before a real run: vendors rename and
 * retire ids, and a stale id fails the whole panelist rather than degrading.
 */
export const DEFAULT_MODELS = [
  'anthropic/claude-opus-5',
  'openai/gpt-5',
  'google/gemini-2.5-pro',
]

export function buildPanel(models: string[], stanceCount = 4): Panelist[] {
  const usable = models.length > 0 ? models : DEFAULT_MODELS
  const stances = STANCES.slice(0, Math.max(1, Math.min(stanceCount, STANCES.length)))
  return stances.map((stance, i) => ({
    id: `${stance.id}@${usable[i % usable.length] as string}`,
    model: usable[i % usable.length] as string,
    stance,
  }))
}

export function modelsFromEnv(): string[] {
  const raw = process.env['NCB_PANEL']
  if (!raw) return DEFAULT_MODELS
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
