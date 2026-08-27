import Link from 'next/link'
import { Eyebrow, PageTitle } from '@/components/ui'

export default function NotFound() {
  return (
    <>
      <Eyebrow>404</Eyebrow>
      <PageTitle>This page does not exist</PageTitle>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed">
        The address may be mistyped, or it names a country the benchmark does not hold yet. Every
        country we score is listed on the{' '}
        <Link href="/" className="underline underline-offset-4">
          profiles page
        </Link>
        , and every agenda on the{' '}
        <Link href="/agenda" className="underline underline-offset-4">
          agendas page
        </Link>
        .
      </p>
    </>
  )
}
