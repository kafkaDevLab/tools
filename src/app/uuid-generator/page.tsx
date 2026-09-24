'use client';

import React, { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Hash, Copy, RefreshCw } from 'lucide-react';

function uuidv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateOne = useCallback(() => {
    setUuids([uuidv4()]);
  }, []);

  const generateMultiple = useCallback((count: number) => {
    setUuids(Array.from({ length: count }, () => uuidv4()));
  }, []);

  const copyAll = async () => {
    if (uuids.length === 0) return;
    const text = uuids.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const copyOne = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto mb-4 flex justify-center">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
              <Hash size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold mb-1 text-slate-900">UUID 생성기</h1>
              <p className="text-slate-500 text-sm">UUID v4를 생성하고 클립보드로 복사하세요.</p>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={generateOne}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
              >
                <RefreshCw size={16} /> 1개 생성
              </button>
              <button
                type="button"
                onClick={() => generateMultiple(5)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                5개 생성
              </button>
              <button
                type="button"
                onClick={() => generateMultiple(10)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                10개 생성
              </button>
              {uuids.length > 0 && (
                <button
                  type="button"
                  onClick={copyAll}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-xl font-medium hover:bg-teal-200 transition-colors"
                >
                  <Copy size={16} /> {copied ? '복사됨' : '전체 복사'}
                </button>
              )}
            </div>

            {uuids.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">생성된 UUID</p>
                <ul className="space-y-2">
                  {uuids.map((uuid, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-mono text-sm"
                    >
                      <span className="flex-1 break-all">{uuid}</span>
                      <button
                        type="button"
                        onClick={() => copyOne(uuid)}
                        className="shrink-0 p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="복사"
                      >
                        <Copy size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
