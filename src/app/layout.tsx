import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import {
  SITE_NAME,
  SITE_URL,
  SITE_OG_IMAGE,
  SITE_AUTHOR,
  SITE_CREATOR,
  SITE_PUBLISHER,
  SITE_FORMAT_DETECTION,
} from '@/lib/constants/site';
import { PAGE_SEO } from '@/lib/constants/seo';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';

const homeSeo = PAGE_SEO['/'];

const notoSansKR = Noto_Sans_KR({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: '/icon.svg',
  },
  title: {
    default: homeSeo.title,
    template: `%s | ${SITE_NAME}`,
  },
  description: homeSeo.description,
  keywords: homeSeo.keywords,
  authors: [{ name: SITE_AUTHOR }],
  creator: SITE_CREATOR,
  publisher: SITE_PUBLISHER,
  formatDetection: SITE_FORMAT_DETECTION,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: homeSeo.title,
    description: homeSeo.description,
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Daily Tools`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: homeSeo.title,
    description: homeSeo.description,
    images: [SITE_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'naver-site-verification': process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || '',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={notoSansKR.className}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
