import type { Metadata } from 'next';
import { PAGE_SEO } from '@/lib/constants/seo';
import { SITE_URL } from '@/lib/constants/site';

const seo = PAGE_SEO['/color-converter'];

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: { canonical: `${SITE_URL}/color-converter` },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: `${SITE_URL}/color-converter`,
  },
  twitter: {
    title: seo.title,
    description: seo.description,
  },
};

export default function ColorConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
