import type { Metadata } from 'next';
import { PAGE_SEO } from '@/lib/constants/seo';

const seo = PAGE_SEO['/savings'];

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  openGraph: {
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    title: seo.title,
    description: seo.description,
  },
};

export default function SavingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
