import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants/site'
import { PUBLIC_PATHS } from '@/lib/constants/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL
  const routes: MetadataRoute.Sitemap = PUBLIC_PATHS.map((path) => ({
    url: path === '/' ? baseUrl : `${baseUrl}${path}`,
  }))

  return routes
}
