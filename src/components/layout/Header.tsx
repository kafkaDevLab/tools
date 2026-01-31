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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    { name: '홈', path: '/' },
    { name: '26주 적금', path: '/savings' },
    { name: '로또 번호', path: '/lotto' },
    { name: '배당금 계산', path: '/dividend' },
    {
      name: '이미지',
      submenu: [
        { name: '확장자 변환', path: '/image-convert' },
        { name: '크기 조절', path: '/image-resize' },
      ],
    },
    { name: 'JSON 포맷터', path: '/json-formatter' },
    {
      name: '유틸',
      submenu: [
        { name: '비밀번호 생성', path: '/password-generator' },
        { name: '색 조합', path: '/color-converter' },
        { name: 'Base64', path: '/base64' },
        { name: 'QR 코드', path: '/qr-generator' },
        { name: '정규식 테스터', path: '/regex-tester' },
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
          <Link href="/" className="text-xl font-black tracking-tight flex items-center gap-2 text-slate-900">
            <Box className="text-blue-600 w-6 h-6" />
            <span>Daily<span className="text-blue-600">Tools</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.submenu ? (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`text-sm font-medium transition-colors hover:text-blue-600 flex items-center gap-1 ${isActiveLink(link) ? 'text-blue-600 font-bold' : 'text-slate-600'
                      }`}
                  >
                    {link.name}
                    <ChevronDown size={14} className={`transition-transform ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden transition-all ${activeDropdown === link.name ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}>
                    {link.submenu.map((sublink) => (
                      <Link
                        key={sublink.path}
                        href={sublink.path}
                        className={`block px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-600 whitespace-nowrap ${pathname === sublink.path ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                          }`}
                      >
                        {sublink.name}
                      </Link>
                    ))}
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
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-900">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-4 flex flex-col gap-2 shadow-lg">
            {navLinks.map((link) => (
              link.submenu ? (
                <div key={link.name}>
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
