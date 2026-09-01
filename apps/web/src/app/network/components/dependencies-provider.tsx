'use client'
import { DependenciesProvider as AppDependenciesProvider } from '@envisioning/app'
import { useSearchParams } from 'next/navigation'

export function DependenciesProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppDependenciesProvider dependencies={{ useSearchParams }}>{children}</AppDependenciesProvider>
  )
}
