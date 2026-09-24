import type { Metadata } from 'next';
import { PAGE_SEO } from '@/lib/constants/seo';
import { SITE_NAME, SITE_OG_IMAGE, SITE_URL } from '@/lib/constants/site';

/** Keep canonical and social URLs consistent across every public tool page. */
export function createToolMetadata(path: string): Metadata {
  const seo = PAGE_SEO[path];
  if (!seo || path === '/') {
    throw new Error(`Missing tool SEO metadata for ${path}`);
  }

  const url = `${SITE_URL}${path}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      siteName: SITE_NAME,
      url,
      title: seo.title,
      description: seo.description,
      images: [{ url: SITE_OG_IMAGE, width: 906, height: 943, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary',
      title: seo.title,
      description: seo.description,
      images: [SITE_OG_IMAGE],
    },
  };
}
