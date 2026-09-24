'use client';

import React, { useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Type } from 'lucide-react';

function countWords(text: string): number {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export default function WordCounterPage() {
  const [text, setText] = React.useState('');

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = countWords(text);
    const lines = text ? text.split(/\n/).length : 0;
    return { chars, charsNoSpaces, words, lines };
  }, [text]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto mb-4 flex justify-center">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600">
              <Type size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold mb-1 text-slate-900">글자 수·단어 수 카운터</h1>
              <p className="text-slate-500 text-sm">입력 시 실시간으로 글자 수, 단어 수, 줄 수를 확인하세요.</p>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="여기에 텍스트를 입력하세요..."
              className="w-full min-h-[200px] px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-y"
              spellCheck="false"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">글자 수</p>
                <p className="text-xl font-bold text-slate-900">{stats.chars.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">글자 수 (공백 제외)</p>
                <p className="text-xl font-bold text-slate-900">{stats.charsNoSpaces.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">단어 수</p>
                <p className="text-xl font-bold text-slate-900">{stats.words.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">줄 수</p>
                <p className="text-xl font-bold text-slate-900">{stats.lines.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
