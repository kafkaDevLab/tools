import type { Metadata } from 'next';
import { PAGE_SEO } from '@/lib/constants/seo';
import { SITE_URL } from '@/lib/constants/site';

const seo = PAGE_SEO['/jwt-decoder'];

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: { canonical: `${SITE_URL}/jwt-decoder` },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: `${SITE_URL}/jwt-decoder`,
  },
  twitter: {
    title: seo.title,
    description: seo.description,
  },
};

export default function JwtDecoderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
