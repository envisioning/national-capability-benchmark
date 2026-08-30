import type { Metadata } from 'next'
import Link from 'next/link'
import {
  DECISIONS_DOC,
  DIMENSIONS,
  DIMENSION_LABELS,
  WHY_DOC,
  docHref,
} from '@ncb/core'
import { Eyebrow, Headline, PageTitle, Section } from '@/components/ui'
import { capabilityHref, countryLocalHref, methodHref, thesisHref } from '@/lib/links'

export const metadata: Metadata = {
  title: 'Thesis, NCB',
  description:
    'Why national capability becomes more important as intelligence, agents and robotics change the conditions of action.',
}

const LEVERAGE = [
  'AI access and compute',
  'data, connectivity and energy',
  'capital and technical talent',
  'robotics and advanced manufacturing',
  'scientific capacity and institutions that deploy emerging technologies',
]

const VELOCITY = [
  'AI adoption and skill acquisition',
  'time from idea to prototype to deployment',
  'institutional experimentation and regulatory adaptation',
  'diffusion of new practices and business creation',
  'scientific adoption curves',
]

export default function ThesisPage() {
  return (
    <>
      <Eyebrow>Thesis</Eyebrow>
      <PageTitle>Capability becomes the bottleneck when intelligence is abundant</PageTitle>
      <Headline>
        Intelligence is becoming easier to access. The scarce resource is the ability to choose,
        coordinate, trust, deploy, maintain and scale what that intelligence makes possible.
      </Headline>

      <Section
        title="The conditions of action have changed"
        hint="Agents reduce the cost of execution, AI accelerates science and robotics extends both into physical production."
      >
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <p>
            A capability that once took decades to build can now arrive in months through tools,
            systems and knowledge developed elsewhere. That speed changes what a country must be
            able to do. Knowing how a thing works is less decisive when more people can access the
            means to make it.
          </p>
          <p>
            The bottleneck moves to choosing a useful direction, coordinating the people who will
            act, trusting their work, deploying what they build, maintaining it and scaling it.
            These are institutional and social capacities, not a research agenda for another model.
          </p>
          <p>
            The benchmark already measures those capacities. The AI transition makes them more
            consequential because the cost of acting on a decision keeps falling.
          </p>
        </div>
      </Section>

      <Section
        title="The foundation has nine capabilities"
        hint="These dimensions are the societal capacities that determine whether a country can absorb and deploy other resources."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          The foundation is the National Capability Benchmark&apos;s existing layer. Each capability
          has its own question, indicators, confidence value and known limits. There is no
          composite score.
        </p>
        <ol className="mt-6 max-w-3xl list-decimal space-y-2 pl-5 text-lg leading-relaxed">
          {DIMENSIONS.map((dimension) => (
            <li key={dimension}>
              <Link href={capabilityHref(dimension)} className="underline underline-offset-4">
                {DIMENSION_LABELS[dimension]}
              </Link>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          The framework is useful only if these capacities can be read separately from wealth and
          challenged when the evidence says they cannot. The{' '}
          <Link href={methodHref} className="underline underline-offset-4">
            method
          </Link>{' '}
          explains how that test works.
        </p>
      </Section>

      <Section
        title="Leverage multiplies what a country can use"
        hint="The second layer describes the resources through which foundational capability gets amplified."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          Exponential leverage includes the tools and conditions that make action faster or more
          powerful. The layer would measure the following:
        </p>
        <ul className="mt-6 max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          {LEVERAGE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          Singapore and Brazil can reach the same frontier model. The systems around that model
          decide what happens next. Capability without leverage leaves ideas undeployed. Leverage
          without capability absorbs technology without making it compound. A future leverage
          layer would measure the second side while the benchmark measures the first.
        </p>
      </Section>

      <Section
        title="Velocity shows whether the system is moving"
        hint="The third layer follows the rate at which foundational capability is increasing."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          Under exponential change, the derivative matters alongside the level. A country can have
          a strong capability and still lose ground if its institutions cannot learn or adapt at
          the speed of the surrounding technology.
        </p>
        <ul className="mt-6 max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          {VELOCITY.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          Velocity is not a substitute for the foundation or for leverage. It asks whether either
          side is changing on a timescale the country can act on.
        </p>
      </Section>

      <Section
        title="Brazil is the first field case"
        hint="Brasil Capaz tests whether individual access to capability can become collective capability."
      >
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <p>
            Brazil is the pilot for this thesis. Brasil Capaz asks whether 20 million Brazilians
            with on-demand access to a programmer, strategist, designer, researcher, tutor,
            analyst or operations assistant can convert individual capability into collective
            capability.
          </p>
          <p>
            The proposed path is from person to team, team to organization, organization to
            institution, institution to ecosystem and ecosystem to country. Small-scale evidence
            from vibe coding offers a first test of the mechanism in weeks rather than years.
          </p>
          <p>
            The benchmark gives that experiment a destination. Its{' '}
            <Link href={countryLocalHref('BRA')} className="underline underline-offset-4">
              Brazil local page
            </Link>{' '}
            makes room for the institutional and territorial context that a national score cannot
            carry by itself.
          </p>
        </div>
      </Section>

      <Section
        title="The portfolio is one argument"
        hint="The benchmark sits inside Envisioning's broader research work on how societies anticipate and act on change."
      >
        <ul className="max-w-3xl list-disc space-y-3 pl-5 text-lg leading-relaxed">
          <li>Signals detect exponential change.</li>
          <li>The benchmark measures whether a society can absorb and exploit it.</li>
          <li>Vibe coding and AI capability programmes increase individual and team agency.</li>
          <li>Institutional Design Labs work on the collective capability problem.</li>
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          The{' '}
          <a
            href="https://envisioning.com/research"
            className="underline underline-offset-4"
            rel="noopener"
          >
            wider research portfolio
          </a>{' '}
          supplies the surrounding work. This thesis explains why the pieces belong together.
        </p>
      </Section>

      <Section
        title="The benchmark has a narrow job"
        hint="It gives different readers a shared question and keeps the answer tied to evidence."
      >
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <p>
            This is not another AI research agenda. The benchmark exists so a public-sector
            leader, a journalist and a citizen can ask the same question with the same evidence:
            what can this country actually do?
          </p>
          <p>
            The three layers keep that question honest as the conditions change. The foundation
            measures capacity, leverage describes what can amplify it and velocity shows whether
            either side is moving fast enough to matter.
          </p>
          <p>
            Read the{' '}
            <a href={docHref(WHY_DOC)} className="underline underline-offset-4">
              claim under test
            </a>{' '}
            and the{' '}
            <a href={docHref(DECISIONS_DOC)} className="underline underline-offset-4">
              decision record
            </a>{' '}
            before quoting a result. The thesis is a frame for the work, not a replacement for its
            sources or limits.
          </p>
        </div>
      </Section>

      <p className="text-xs text-[var(--muted)]">
        <Link href={thesisHref} className="underline underline-offset-4">
          Thesis
        </Link>{' '}
        is the public framing document for the benchmark.
      </p>
    </>
  )
}
