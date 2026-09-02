import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Loading, StoreProvider } from '@envisioning/app'
import { generateSEO, parsePath, processConfig } from '@envisioning/app/server'
import type { Lang } from '@ncb/core'
import { INSTITUTION_MAPS } from '@/lib/layers'
import { loadInstitutionExplorer } from '@/lib/data'
import { CustomMainView } from '../components/custom-main-view'
import { DependenciesProvider } from '../components/dependencies-provider'
import { config } from '../config'

/**
 * The drawn institution network.
 *
 * The feed comes from `bench institutions`, which is the same projection
 * `/api/institutions/{ISO3}` serves. Loading it directly rather than over HTTP
 * keeps one read path on the server; the route exists for readers outside this
 * deployment. See D82.
 */

export const dynamic = 'force-dynamic'

const BASE_PATH = '/network'

/** The default dataset is the first one declared as published. */
const DEFAULT_DATASET = INSTITUTION_MAPS[0] ?? null

/** Keep dataset selection on the published-map registry, never in a filename. */
function readDataset(value: string | string[] | undefined): string | null {
  const requested = Array.isArray(value) ? value[0] : value
  const candidate = requested?.toUpperCase()
  if (candidate && INSTITUTION_MAPS.includes(candidate)) return candidate
  return DEFAULT_DATASET
}

/** The app's locale ids, mapped onto the lexicons the feed is written for. */
const FEED_LANG: Record<string, Lang> = { en: 'en', pt: 'pt-BR' }

type Props = {
  params: Promise<{ seo?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seo = [] } = await params
  const { lang = 'en', page = 'home' } = parsePath(seo.join('/'), BASE_PATH)
  return generateSEO({ pageId: page, currentLang: lang, config })
}

export default async function NetworkPage({ params, searchParams }: Props) {
  const { seo = [] } = await params
  const { lang = 'en' } = parsePath(seo.join('/'), BASE_PATH)
  const query = await searchParams
  const dataset = readDataset(query.dataset)
  const data = dataset
    ? await loadInstitutionExplorer(dataset, FEED_LANG[lang] ?? 'en')
    : null

  if (!data) {
    return (
      <p className="p-12 text-lg">
        The selected institution feed has not been generated. Run{' '}
        <code>pnpm bench institutions</code>.
      </p>
    )
  }

  if (process.env.NODE_ENV === 'development') {
    try {
      const { success, error } = processConfig({ config, data })
      if (!success) console.log('>>> /network config invalid:', error)
    } catch (error) {
      console.warn('/network config processing failed', error)
    }
  }

  return (
    <Suspense fallback={<Loading logMessage="Loading the institution map..." />}>
      <DependenciesProvider>
        <StoreProvider data={data} config={config} basePath={BASE_PATH}>
          <CustomMainView />
        </StoreProvider>
      </DependenciesProvider>
    </Suspense>
  )
}
