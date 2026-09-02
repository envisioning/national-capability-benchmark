'use client'
import { DependenciesProvider as AppDependenciesProvider } from '@envisioning/app'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState, type ComponentProps } from 'react'

type AppDependencies = NonNullable<
  ComponentProps<typeof AppDependenciesProvider>['dependencies']
>
type DataTransform = NonNullable<AppDependencies['dataTransform']>

const LEVEL_QUERY_KEYS = [
  'criteria[level.id][$in][]',
  'criteria[level.id][$in]',
  'criteria[level.id][]',
  'criteria[level.id]',
]

function readLevelFilter(searchParams: URLSearchParams): string[] | null {
  for (const key of LEVEL_QUERY_KEYS) {
    const values = searchParams.getAll(key)
    if (values.length > 0) return values
  }
  return null
}

let historyPatched = false

/** Keep the data adapter in step with the app's URL grammar on live changes. */
function patchHistoryOnce() {
  if (historyPatched || typeof window === 'undefined') return
  historyPatched = true

  const originalPushState = history.pushState.bind(history)
  const originalReplaceState = history.replaceState.bind(history)
  const notify = () => {
    const event = document.createEvent('Event')
    event.initEvent('ncb-network-locationchange', false, false)
    window.dispatchEvent(event)
  }

  history.pushState = (...args: Parameters<History['pushState']>) => {
    originalPushState(...args)
    notify()
  }
  history.replaceState = (...args: Parameters<History['replaceState']>) => {
    originalReplaceState(...args)
    notify()
  }
}

export function DependenciesProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const [locationRevision, setLocationRevision] = useState(0)
  const serializedSearchParams = searchParams.toString()
  useEffect(() => {
    patchHistoryOnce()
    const handleLocationChange = () => setLocationRevision((revision) => revision + 1)

    window.addEventListener('ncb-network-locationchange', handleLocationChange)
    window.addEventListener('popstate', handleLocationChange)
    // A child can set the initial overview scope before this effect subscribes.
    // Read once after mounting so that first-load defaults are applied too.
    handleLocationChange()

    return () => {
      window.removeEventListener('ncb-network-locationchange', handleLocationChange)
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  const levelFilter = useMemo(
    () =>
      readLevelFilter(
        new URLSearchParams(
          typeof window === 'undefined' ? serializedSearchParams : window.location.search,
        ),
      ),
    [locationRevision, serializedSearchParams],
  )
  const dataTransform = useCallback<DataTransform>(
    ({ data }) => {
      if (!levelFilter) return data

      const feed = data as {
        allInstitutions?: Array<{ level?: { id?: string } }>
      }
      if (!Array.isArray(feed.allInstitutions)) return data

      const allowedLevels = new Set(levelFilter)
      return {
        ...data,
        allInstitutions: feed.allInstitutions.filter((institution) =>
          allowedLevels.has(institution.level?.id ?? ''),
        ),
      }
    },
    [levelFilter],
  )

  return (
    <AppDependenciesProvider dependencies={{ useSearchParams, dataTransform }}>
      {children}
    </AppDependenciesProvider>
  )
}
