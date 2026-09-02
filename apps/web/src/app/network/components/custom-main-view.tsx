'use client'
import { MainView } from '@envisioning/app'
import { StateLevelToggle } from './state-level-toggle'

type CustomMainViewProps = {
  availableLevelIds: string[]
  stateCount: number
  institutionCount: number
}

export function CustomMainView({
  availableLevelIds,
  stateCount,
  institutionCount,
}: CustomMainViewProps) {
  return (
    <>
      <MainView />
      <StateLevelToggle
        availableLevelIds={availableLevelIds}
        stateCount={stateCount}
        institutionCount={institutionCount}
      />
    </>
  )
}
