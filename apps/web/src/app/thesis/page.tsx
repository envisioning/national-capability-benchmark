import type { Metadata } from 'next'
import Link from 'next/link'
import { DECISIONS_DOC, WHY_DOC, docHref } from '@ncb/core'
import { Empty, Eyebrow, Headline, Highlight, Note, PageTitle, Section } from '@/components/ui'
import { WealthTracking } from '@/components/WealthTracking'
import { MISSING_DATA_HINT, loadDiagnostics } from '@/lib/data'
import { countryLayer } from '@/lib/layers'
import {
  countryLayerHref,
  countryProfileHref,
  decisionHref,
  diagnosticsHref,
  limitsHref,
  methodHref,
} from '@/lib/links'
import { readWealthTracking } from '@/lib/wealth'
import { capitalize, countWord } from '@/lib/words'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Thesis, NCB',
  description:
    'Why national capability becomes the bottleneck as intelligence, agents and robotics change the conditions of action, and what would show the claim is wrong.',
}

/** What the second layer would measure, if the evidence promotes it. */
const LEVERAGE = [
  'AI access and compute',
  'data, connectivity and energy',
  'capital and technical talent',
  'robotics and advanced manufacturing',
  'scientific capacity and institutions that deploy emerging technologies',
]

/** What the third layer would measure. */
const VELOCITY = [
  'AI adoption and skill acquisition',
  'time from idea to prototype to deployment',
  'institutional experimentation and regulatory adaptation',
  'diffusion of new practices and business creation',
  'scientific adoption curves',
]

/**
 * Why the benchmark exists, and the test it can fail.
 *
 * This page owns the argument. The about page owns the object: what the
 * benchmark is made of, who built it and how to read it. Neither repeats the
 * other, because two statements of one claim drift apart the first time only
 * one of them is edited.
 */
export default async function ThesisPage() {
  const diag = await loadDiagnostics()
  if (!diag) return <Empty hint={MISSING_DATA_HINT} />
  const wealth = readWealthTracking(diag)
  const brazil = countryLayer('BRA')

  return (
    <>
      <Eyebrow>Thesis</Eyebrow>
      <PageTitle>Capability becomes the bottleneck when intelligence is abundant</PageTitle>
      <Headline>
        Intelligence is getting easier to reach. The scarce thing is the ability to choose,
        coordinate, trust, deploy, maintain and scale what it makes possible. That ability is what
        this benchmark tries to <Highlight>measure</Highlight>.
      </Headline>

      <Section
        title="The conditions of action have changed"
        hint="Agents lower the cost of execution, AI speeds up science, and robotics carries both into physical production."
      >
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <p>
            A capability that once took decades to build can now arrive in months, through tools
            and knowledge developed somewhere else. Knowing how a thing works matters less when
            more people can reach the means to make it.
          </p>
          <p>
            The bottleneck moves to choosing a useful direction, coordinating the people who will
            act, trusting their work, deploying what they build, maintaining it and scaling it.
            Those are institutional and social capacities. The benchmark already measures them,
            and falling execution costs make them matter more.
          </p>
        </div>
      </Section>

      <Section
        title="The claim can fail, and part of it does"
        hint="If a country's ability to act is separate from its wealth, the nine capabilities will not simply follow income. Here is how far that holds in the current data."
      >
        <div className="mb-8 max-w-3xl space-y-4 text-lg leading-relaxed">
          <p>
            Countries can be rich without being equally able to anticipate change, coordinate,
            learn, experiment, adapt, build or hold a shared purpose. The benchmark tests whether
            those capacities can be observed on their own. If the claim holds, two countries at
            the same income have different capability shapes, and a country can raise a dimension
            before it gets richer. If it fails, the dimensions track GDP per head and the
            benchmark is an income table with extra steps.
          </p>
          <p>
            The answer today is split. {capitalize(countWord(wealth.separate.length))} of the nine
            sit below the wealth-tracking line and {countWord(wealth.tracking.length)} sit at or
            above it.
          </p>
        </div>

        <WealthTracking reading={wealth} />

        <div className="mt-8 max-w-3xl space-y-4 text-lg leading-relaxed">
          {wealth.weakest && wealth.strongest ? (
            <p>
              {wealth.weakest.label} moves least with income, at{' '}
              {wealth.weakest.strength?.toFixed(2)}. {wealth.strongest.label} moves most, at{' '}
              {wealth.strongest.strength?.toFixed(2)}, which is close enough to income that the
              project treats it as a known failure and says so beside the number.
            </p>
          ) : null}
          <p>
            The{' '}
            <Link href={diagnosticsHref} className="underline underline-offset-4">
              diagnostics
            </Link>{' '}
            run this test on every release and also rescore the model with the wealth-correlated
            indicators removed. The{' '}
            <Link href={limitsHref} className="underline underline-offset-4">
              limits
            </Link>{' '}
            record which dimensions do not survive that removal. The{' '}
            <Link href={methodHref} className="underline underline-offset-4">
              method
            </Link>{' '}
            explains how a statistic becomes a score, and{' '}
            <a href={docHref(WHY_DOC)} className="underline underline-offset-4">
              {WHY_DOC}
            </a>{' '}
            states the full argument with the evidence that would sink it.
          </p>
        </div>
        <Note>
          A correlation with income is not proof that income causes the capability. It marks a
          dimension whose current indicators cannot separate the two, which is a data problem the
          project publishes rather than hides.
        </Note>
      </Section>

      <Section
        title="Leverage would measure what amplifies capability"
        hint="The second layer covers the resources through which a capability gets multiplied."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          Singapore and Brazil can reach the same frontier model. The systems around that model
          decide what happens next. Capability without leverage leaves ideas undeployed, and
          leverage without capability absorbs technology without compounding it. The layer would
          measure the second side:
        </p>
        <ul className="mt-6 max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          {LEVERAGE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section
        title="Velocity would measure whether the system is moving"
        hint="The third layer follows the rate at which a capability changes, because under fast change the level alone is misleading."
      >
        <p className="max-w-3xl text-lg leading-relaxed">
          A country can hold a strong capability and still lose ground if its institutions cannot
          learn at the speed of the technology around them. The layer would measure:
        </p>
        <ul className="mt-6 max-w-3xl list-disc space-y-2 pl-5 text-lg leading-relaxed">
          {VELOCITY.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">
          Both layers are computed already, as offline fixtures the viewer does not publish.
          Neither reaches a score, a confidence or an agenda.{' '}
          <Link href={decisionHref('D65')} className="underline underline-offset-4">
            Decision D65
          </Link>{' '}
          sets what each one has to pass first: a settled method, a six-month review record and a
          review from outside the maintainers. Until then the foundation is the published layer
          and the other two are research.
        </p>
      </Section>

      <Section
        title="Brazil is the first field case"
        hint="One country tests whether the frame says anything a national statistics office does not already say."
      >
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <p>
            Brazil is where the thesis meets a real institutional setting, through Envisioning&apos;s
            Brasil Capaz work on raising individual and collective capability. The benchmark gives
            that work a destination: a shape to move and a set of indicators that says which parts
            are measured and which are guessed.
          </p>
          <p>
            Brazil gets no special treatment in the model. What it has is a reading of its own:
            the{' '}
            {brazil ? (
              <Link href={countryLayerHref(brazil)} className="underline underline-offset-4">
                Brazilian layer
              </Link>
            ) : (
              'Brazilian layer'
            )}{' '}
            carries the institution map, the subnational spread and the agenda in Portuguese,
            beside the{' '}
            <Link href={countryProfileHref('BRA')} className="underline underline-offset-4">
              English profile
            </Link>
            . The programme argument belongs there, where its audience is.
          </p>
        </div>
      </Section>

      <Section
        title="The benchmark has a narrow job"
        hint="It gives a public-sector leader, a journalist and a citizen one question and one body of evidence."
      >
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
          <p>
            This is not a research agenda for another model. The benchmark exists so that
            different readers can ask what a country can actually do and check the answer against
            its sources. It sits inside Envisioning&apos;s wider work: signals detect exponential
            change, the benchmark measures whether a society can absorb it, and the capability
            programmes and institutional design labs work on raising the number.
          </p>
          <p>
            Read the{' '}
            <a href={docHref(DECISIONS_DOC)} className="underline underline-offset-4">
              decision record
            </a>{' '}
            before quoting a result. This page is the frame for the work and no substitute for its
            sources or its limits.
          </p>
        </div>
      </Section>
    </>
  )
}
