import type { Metadata } from 'next';
import { PAGE_SEO } from '@/lib/constants/seo';
import { SITE_URL } from '@/lib/constants/site';

const seo = PAGE_SEO['/word-counter'];

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: { canonical: `${SITE_URL}/word-counter` },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: `${SITE_URL}/word-counter`,
  },
  twitter: {
    title: seo.title,
    description: seo.description,
  },
};

export default function WordCounterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
