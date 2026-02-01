'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PiggyBank, Clover, TrendingUp, ArrowRight, Image as ImageIcon, FileJson, Maximize2, Palette, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const tools = [
    {
      id: 'image-convert',
      title: '이미지 확장자 변환',
      description: 'JPG, PNG, WebP, GIF 간 자유롭게 변환하고 품질을 조절하세요.',
      icon: <ImageIcon className="w-8 h-8 text-orange-500" />,
      color: 'bg-orange-50 hover:border-orange-200',
      link: '/image-convert'
    },
    {
      id: 'image-resize',
      title: '이미지 크기 조절',
      description: '픽셀, 퍼센트, 프리셋 크기로 이미지를 리사이징하세요.',
      icon: <Maximize2 className="w-8 h-8 text-blue-400" />,
      color: 'bg-blue-50 hover:border-blue-200',
      link: '/image-resize'
    },
    {
      id: 'color-converter',
      title: '색 조합',
      description: '팔레트 프리셋을 선택하고 HEX, RGB, HSL로 실시간 변환·편집하세요.',
      icon: <Palette className="w-8 h-8 text-violet-500" />,
      color: 'bg-violet-50 hover:border-violet-200',
      link: '/color-converter'
    },
    {
      id: 'gradient',
      title: '그라데이션',
      description: '시작·끝 색상과 방향을 선택해 CSS linear-gradient 코드를 생성하세요.',
      icon: <Layers className="w-8 h-8 text-violet-400" />,
      color: 'bg-violet-50 hover:border-violet-200',
      link: '/gradient'
    },
    {
      id: 'savings',
      title: '26주 적금 계산기',
      description: '매주 조금씩 늘어나는 금액으로 목돈 모으기에 도전하세요.',
      icon: <PiggyBank className="w-8 h-8 text-blue-500" />,
      color: 'bg-blue-50 hover:border-blue-200',
      link: '/savings'
    },
    {
      id: 'lotto',
      title: '로또 번호 추출기',
      description: '과학적인(?) 난수 생성으로 행운의 번호를 확인해보세요.',
      icon: <Clover className="w-8 h-8 text-green-500" />,
      color: 'bg-green-50 hover:border-green-200',
      link: '/lotto'
    },
    {
      id: 'dividend',
      title: '배당금 계산기',
      description: '보유 주식의 예상 배당 수익을 연간/월간으로 계산합니다.',
      icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
      color: 'bg-purple-50 hover:border-purple-200',
      link: '/dividend'
    },
    {
      id: 'json-formatter',
      title: 'JSON 포맷터',
      description: '복잡한 JSON 데이터를 검증하고 예쁘게 정리(Prettier)합니다.',
      icon: <FileJson className="w-8 h-8 text-yellow-500" />,
      color: 'bg-yellow-50 hover:border-yellow-200',
      link: '/json-formatter'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Simple Hero */}
        <section className="text-center mb-20">
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

        {/* Tools Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link
                href={tool.link}
                className={`group block h-full p-8 rounded-3xl border border-transparent transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white ${tool.color} hover:border-opacity-100`}
              >
                <div className="bg-white rounded-2xl w-16 h-16 flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </h2>

                <p className="text-slate-500 mb-8 leading-relaxed">
                  {tool.description}
                </p>

                <div className="flex items-center text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  사용하러 가기 <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
