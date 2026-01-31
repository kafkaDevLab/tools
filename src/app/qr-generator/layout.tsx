import type { Metadata } from 'next';
import { PAGE_SEO } from '@/lib/constants/seo';
import { SITE_URL } from '@/lib/constants/site';

const seo = PAGE_SEO['/qr-generator'];

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: { canonical: `${SITE_URL}/qr-generator` },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: `${SITE_URL}/qr-generator`,
  },
  twitter: {
    title: seo.title,
    description: seo.description,
  },
};

export default function QrGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
