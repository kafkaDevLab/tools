import type { Metadata } from 'next';
import { PAGE_SEO } from '@/lib/constants/seo';
import { SITE_URL } from '@/lib/constants/site';

const seo = PAGE_SEO['/base64'];

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: { canonical: `${SITE_URL}/base64` },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: `${SITE_URL}/base64`,
  },
  twitter: {
    title: seo.title,
    description: seo.description,
  },
};

export default function Base64Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
