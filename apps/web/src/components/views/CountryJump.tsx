'use client'

import { useRouter } from 'next/navigation'
import { CountryCombobox, type CountryOption } from '@/components/CountryCombobox'
import { fieldClass } from '@/components/ui'
import { countryProfileHref } from '@/lib/links'

/** Type a country's name and land on its profile. */
export function CountryJump({ countries }: { countries: CountryOption[] }) {
  const router = useRouter()
  return (
    <CountryCombobox
      id="country-jump"
      options={countries}
      value=""
      onChange={(code) => {
        if (code) router.push(countryProfileHref(code))
      }}
      placeholder="Find a country"
      emptyText="No country in the benchmark has that name."
      className={fieldClass()}
    />
  )
}
