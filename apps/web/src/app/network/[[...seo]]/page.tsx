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

/** The only mapped country today. A second one makes this a path segment. */
const ISO3 = INSTITUTION_MAPS[0] ?? 'BRA'

/** The app's locale ids, mapped onto the lexicons the feed is written for. */
const FEED_LANG: Record<string, Lang> = { en: 'en', pt: 'pt-BR' }

type Props = { params: Promise<{ seo?: string[] }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seo = [] } = await params
  const { lang = 'en', page = 'home' } = parsePath(seo.join('/'), BASE_PATH)
  return generateSEO({ pageId: page, currentLang: lang, config })
}

export default async function NetworkPage({ params }: Props) {
  const { seo = [] } = await params
  const { lang = 'en' } = parsePath(seo.join('/'), BASE_PATH)
  const data = await loadInstitutionExplorer(ISO3, FEED_LANG[lang] ?? 'en')

  if (!data) {
    return (
      <p className="p-12 text-lg">
        The institution feed has not been generated. Run <code>pnpm bench institutions</code>.
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
