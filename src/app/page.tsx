'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PiggyBank, Clover, TrendingUp, ArrowRight, Image as ImageIcon, FileJson, Maximize2, Palette, Layers, Key, FileCode, QrCode, Regex, Type, Link2, Shield, Hash, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const tools = [
    {
      id: 'image-convert',
      title: '이미지 확장자 변환',
      description: 'JPG, PNG, WebP, GIF 간 자유롭게 변환하고 품질을 조절하세요.',
      icon: <ImageIcon className="w-6 h-6 text-orange-500" />,
      color: 'bg-orange-50 hover:border-orange-200',
      link: '/image-convert'
    },
    {
      id: 'image-resize',
      title: '이미지 크기 조절',
      description: '픽셀, 퍼센트, 프리셋 크기로 이미지를 리사이징하세요.',
      icon: <Maximize2 className="w-6 h-6 text-blue-400" />,
      color: 'bg-blue-50 hover:border-blue-200',
      link: '/image-resize'
    },
    {
      id: 'color-converter',
      title: '색 조합',
      description: '팔레트 프리셋을 선택하고 HEX, RGB, HSL로 실시간 변환·편집하세요.',
      icon: <Palette className="w-6 h-6 text-violet-500" />,
      color: 'bg-violet-50 hover:border-violet-200',
      link: '/color-converter'
    },
    {
      id: 'gradient',
      title: '그라데이션',
      description: '시작·끝 색상과 방향을 선택해 CSS linear-gradient 코드를 생성하세요.',
      icon: <Layers className="w-6 h-6 text-violet-400" />,
      color: 'bg-violet-50 hover:border-violet-200',
      link: '/gradient'
    },
    {
      id: 'savings',
      title: '26주 적금 계산기',
      description: '매주 조금씩 늘어나는 금액으로 목돈 모으기에 도전하세요.',
      icon: <PiggyBank className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-50 hover:border-blue-200',
      link: '/savings'
    },
    {
      id: 'lotto',
      title: '로또 번호 추출기',
      description: '과학적인(?) 난수 생성으로 행운의 번호를 확인해보세요.',
      icon: <Clover className="w-6 h-6 text-green-500" />,
      color: 'bg-green-50 hover:border-green-200',
      link: '/lotto'
    },
    {
      id: 'dividend',
      title: '배당금 계산기',
      description: '보유 주식의 예상 배당 수익을 연간/월간으로 계산합니다.',
      icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
      color: 'bg-purple-50 hover:border-purple-200',
      link: '/dividend'
    },
    {
      id: 'json-formatter',
      title: 'JSON 포맷터',
      description: '복잡한 JSON 데이터를 검증하고 예쁘게 정리(Prettier)합니다.',
      icon: <FileJson className="w-6 h-6 text-yellow-500" />,
      color: 'bg-yellow-50 hover:border-yellow-200',
      link: '/json-formatter'
    },
    {
      id: 'password-generator',
      title: '비밀번호 생성기',
      description: '길이와 문자 종류를 선택한 뒤 생성·복사하세요.',
      icon: <Key className="w-6 h-6 text-amber-500" />,
      color: 'bg-amber-50 hover:border-amber-200',
      link: '/password-generator'
    },
    {
      id: 'base64',
      title: 'Base64 인코더·디코더',
      description: '텍스트와 파일을 Base64로 인코딩·디코딩하세요.',
      icon: <FileCode className="w-6 h-6 text-emerald-500" />,
      color: 'bg-emerald-50 hover:border-emerald-200',
      link: '/base64'
    },
    {
      id: 'qr-generator',
      title: 'QR 코드 생성기',
      description: '텍스트나 URL을 입력하면 QR 코드를 만들고 PNG로 저장할 수 있습니다.',
      icon: <QrCode className="w-6 h-6 text-violet-400" />,
      color: 'bg-violet-50 hover:border-violet-200',
      link: '/qr-generator'
    },
    {
      id: 'regex-tester',
      title: '정규식 테스터',
      description: '패턴과 테스트 문자열로 매치 결과를 확인하고 하이라이트할 수 있습니다.',
      icon: <Regex className="w-6 h-6 text-sky-500" />,
      color: 'bg-sky-50 hover:border-sky-200',
      link: '/regex-tester'
    },
    {
      id: 'word-counter',
      title: '글자 수·단어 수 카운터',
      description: '입력 시 실시간으로 글자 수, 단어 수, 줄 수를 확인하세요.',
      icon: <Type className="w-6 h-6 text-sky-500" />,
      color: 'bg-sky-50 hover:border-sky-200',
      link: '/word-counter'
    },
    {
      id: 'url-encoder',
      title: 'URL 인코더·디코더',
      description: '텍스트를 percent-encoding으로 인코딩·디코딩하세요.',
      icon: <Link2 className="w-6 h-6 text-emerald-500" />,
      color: 'bg-emerald-50 hover:border-emerald-200',
      link: '/url-encoder'
    },
    {
      id: 'jwt-decoder',
      title: 'JWT 디코더',
      description: 'JWT 토큰을 붙여넣으면 Header·Payload를 읽기 쉽게 보여줍니다.',
      icon: <Shield className="w-6 h-6 text-indigo-500" />,
      color: 'bg-indigo-50 hover:border-indigo-200',
      link: '/jwt-decoder'
    },
    {
      id: 'uuid-generator',
      title: 'UUID 생성기',
      description: 'UUID v4를 생성하고 클립보드로 복사할 수 있습니다.',
      icon: <Hash className="w-6 h-6 text-teal-500" />,
      color: 'bg-teal-50 hover:border-teal-200',
      link: '/uuid-generator'
    },
    {
      id: 'vat-calculator',
      title: '부가세 계산기',
      description: '공급가액 또는 세금 포함 금액으로 부가세·합계를 계산합니다.',
      icon: <Calculator className="w-6 h-6 text-rose-500" />,
      color: 'bg-rose-50 hover:border-rose-200',
      link: '/vat-calculator'
    },
    {
      id: 'stock-analysis',
      title: '주식 분석',
      description: '한국·미국 주가 조회, 기술적 지표·차트, AI 참고 해석 (투자 권유 아님).',
      icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
      color: 'bg-emerald-50 hover:border-emerald-200',
      link: '/stock-analysis'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Simple Hero */}
        <section className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              생활에 도움이 되는<br className="hidden sm:block" />
              <span className="text-blue-600"> 스마트한 도구들</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              복잡한 계산과 반복적인 작업을 쉽고 빠르게 해결하세요.<br />
              별도의 회원가입 없이 바로 사용할 수 있습니다.
            </p>
          </motion.div>
        </section>

        {/* Tools Grid - 8개 메뉴 모두 표시 (4열까지) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Link
                href={tool.link}
                className={`group block h-full p-5 rounded-2xl border border-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 bg-white ${tool.color} hover:border-opacity-100`}
              >
                <div className="bg-white rounded-xl w-12 h-12 flex items-center justify-center shadow-sm mb-4 group-hover:scale-105 transition-transform duration-300">
                  {tool.icon}
                </div>

                <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </h2>

                <p className="text-slate-500 text-sm mb-4 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>

                <div className="flex items-center text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  사용하러 가기 <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
