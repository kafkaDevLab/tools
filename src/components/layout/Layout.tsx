'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const isPortfolioPage = pathname?.startsWith('/portfolio');

  // 포트폴리오 페이지는 별도의 레이아웃을 사용하므로 메인 Header/Footer를 표시하지 않음
  if (isPortfolioPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}