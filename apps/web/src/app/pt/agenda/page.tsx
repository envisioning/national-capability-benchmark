import { redirect } from 'next/navigation'

/**
 * The Portuguese agenda index is /pt itself, which presents the benchmark and
 * lists every agenda. This route exists so a truncated agenda URL lands there
 * instead of on a 404.
 */
export default function PortugueseAgendaIndex() {
  redirect('/pt')
}
