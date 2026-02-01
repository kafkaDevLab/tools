'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calculator } from 'lucide-react';

const VAT_RATE = 0.1; // 10%

export default function VatCalculatorPage() {
  const [inputMode, setInputMode] = useState<'supply' | 'total'>('supply');
  const [inputValue, setInputValue] = useState('');

  const result = useMemo(() => {
    const num = parseFloat(inputValue.replace(/,/g, '')) || 0;
    if (num <= 0) return null;
    let supply: number;
    let vat: number;
    let total: number;
    if (inputMode === 'supply') {
      supply = num;
      vat = Math.round(supply * VAT_RATE);
      total = supply + vat;
    } else {
      total = num;
      supply = Math.round(total / (1 + VAT_RATE));
      vat = total - supply;
    }
    return { supply, vat, total };
  }, [inputValue, inputMode]);

  const formatNum = (n: number) => new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto mb-4 flex justify-center">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
              <Calculator size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold mb-1 text-slate-900">부가세 계산기</h1>
              <p className="text-slate-500 text-sm">공급가액 또는 세금 포함 금액을 입력하면 부가세·합계를 계산합니다. (기본 10%)</p>
            </div>
          </div>
        </div>
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setInputMode('supply')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${inputMode === 'supply' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                공급가액 기준
              </button>
              <button
                type="button"
                onClick={() => setInputMode('total')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${inputMode === 'total' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                세금 포함 금액 기준
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {inputMode === 'supply' ? '공급가액 (세전)' : '세금 포함 금액 (합계)'}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₩</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.replace(/[^0-9,]/g, ''))}
                  placeholder={inputMode === 'supply' ? '예: 10000' : '예: 11000'}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>

            {result && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>공급가액 (세전)</span>
                  <span className="font-semibold text-slate-900">₩{formatNum(result.supply)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>부가세 (10%)</span>
                  <span className="font-semibold text-slate-900">₩{formatNum(result.vat)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-rose-600 pt-2">
                  <span>합계 (세금 포함)</span>
                  <span>₩{formatNum(result.total)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
