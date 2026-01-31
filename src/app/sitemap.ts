import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants/site'
import { PUBLIC_PATHS } from '@/lib/constants/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL
  const now = new Date()

  const routes: MetadataRoute.Sitemap = PUBLIC_PATHS.map((path) => {
    const isHome = path === '/'
    return {
      url: path === '/' ? baseUrl : `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: isHome ? 1.0 : 0.8,
    }
  })

  return routes
}
