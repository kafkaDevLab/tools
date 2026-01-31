import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',          // API 엔드포인트 차단
          '/_next/',        // Next.js 내부 파일 차단
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

