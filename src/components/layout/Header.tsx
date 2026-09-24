'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Box, ChevronDown } from 'lucide-react';

interface NavLink {
  name: string;
  path?: string;
  submenu?: { name: string; path: string }[];
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const handleWidthChange = () => {
      if (desktop.matches) setIsOpen(false);
      else setActiveDropdown(null);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setActiveDropdown(null);
      }
    };
    desktop.addEventListener('change', handleWidthChange);
    window.addEventListener('keydown', handleEscape);
    return () => {
      desktop.removeEventListener('change', handleWidthChange);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const navLinks: NavLink[] = [
    { name: '홈', path: '/' },
    {
      name: '이미지',
      submenu: [
        { name: '확장자 변환', path: '/image-convert' },
        { name: '크기 조절', path: '/image-resize' },
        { name: '용량 줄이기', path: '/image-compress' },
        { name: '자르기·회전', path: '/image-crop' },
        { name: '위치정보 제거', path: '/image-metadata' },
      ],
    },
    {
      name: '문서',
      submenu: [
        { name: 'PDF 합치기·추출', path: '/pdf-tools' },
        { name: 'CSV ↔ JSON', path: '/csv-json' },
      ],
    },
    {
      name: '색상',
      submenu: [
        { name: '색 조합', path: '/color-converter' },
        { name: '그라데이션', path: '/gradient' },
      ],
    },
    {
      name: '유틸',
      submenu: [
        { name: 'JSON 포맷터', path: '/json-formatter' },
        { name: '글자 수·단어 수', path: '/word-counter' },
        { name: 'URL 인코더', path: '/url-encoder' },
        { name: 'JWT 디코더', path: '/jwt-decoder' },
        { name: 'UUID 생성기', path: '/uuid-generator' },
        { name: '비밀번호 생성', path: '/password-generator' },
        { name: 'Base64', path: '/base64' },
        { name: 'QR 코드', path: '/qr-generator' },
        { name: '정규식 테스터', path: '/regex-tester' },
        { name: '날짜·영업일 계산', path: '/date-calculator' },
        { name: 'UTM 링크 생성', path: '/utm-builder' },
      ],
    },
    {
      name: '금융',
      submenu: [
        { name: '26주 적금', path: '/savings' },
        { name: '로또 번호', path: '/lotto' },
        { name: '배당금 계산', path: '/dividend' },
        { name: '부가세 계산', path: '/vat-calculator' },
      ],
    },
  ];

  const isActiveLink = (link: NavLink) => {
    if (link.path) return pathname === link.path;
    if (link.submenu) return link.submenu.some(sub => pathname === sub.path);
    return false;
  };

  return (
    <header>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-xl font-black tracking-tight flex items-center gap-2 text-slate-900">
            <Box className="text-blue-600 w-6 h-6" />
            <span>Daily<span className="text-blue-600">Tools</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.submenu ? (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setActiveDropdown(null);
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={activeDropdown === link.name}
                    aria-haspopup="true"
                    onClick={() => setActiveDropdown(link.name)}
                    className={`text-sm font-medium transition-colors hover:text-blue-600 flex items-center gap-1 ${isActiveLink(link) ? 'text-blue-600 font-bold' : 'text-slate-600'
                      }`}
                  >
                    {link.name}
                    <ChevronDown size={14} className={`transition-transform ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`absolute top-full left-0 pt-2 transition-all ${activeDropdown === link.name ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}>
                    <div className="bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden py-1">{link.submenu.map((sublink) => (
                      <Link
                        key={sublink.path}
                        href={sublink.path}
                        onClick={() => setActiveDropdown(null)}
                        className={`block px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-600 whitespace-nowrap ${pathname === sublink.path ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                          }`}
                      >
                        {sublink.name}
                      </Link>
                    ))}</div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.path}
                  href={link.path!}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname === link.path ? 'text-blue-600 font-bold' : 'text-slate-600'
                    }`}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-controls="mobile-navigation"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex h-11 w-11 items-center justify-center rounded-lg text-slate-900 hover:bg-slate-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div id="mobile-navigation" className="lg:hidden absolute top-full left-0 w-full max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain bg-white border-b border-slate-100 p-4 flex flex-col gap-2 shadow-lg">
            {navLinks.map((link) => (
              link.submenu ? (
                <div key={link.name} className="flex flex-col">
                  <div className="px-4 py-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    {link.name}
                  </div>
                  {link.submenu.map((sublink) => (
                    <Link
                      key={sublink.path}
                      href={sublink.path}
                      onClick={() => setIsOpen(false)}
                      className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === sublink.path ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                      {sublink.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.path}
                  href={link.path!}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === link.path ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
