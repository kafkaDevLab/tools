import type { Metadata } from 'next';
import { PAGE_SEO } from '@/lib/constants/seo';
import { SITE_URL } from '@/lib/constants/site';

const seo = PAGE_SEO['/uuid-generator'];

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: { canonical: `${SITE_URL}/uuid-generator` },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: `${SITE_URL}/uuid-generator`,
  },
  twitter: {
    title: seo.title,
    description: seo.description,
  },
};

export default function UuidGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
