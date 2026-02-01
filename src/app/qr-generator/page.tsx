'use client';

import React, { useState, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, Download } from 'lucide-react';

export default function QrGeneratorPage() {
  const [value, setValue] = useState('');
  const [size, setSize] = useState(256);
  const canvasRef = useRef<HTMLDivElement>(null);

  const downloadPng = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas || !value.trim()) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600">
                <QrCode size={24} />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1 text-slate-900">QR 코드 생성기</h1>
            <p className="text-slate-500 text-sm">텍스트나 URL을 입력하면 QR 코드를 만들고 PNG로 저장할 수 있습니다.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">내용 (URL 또는 텍스트)</label>
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm resize-y"
                placeholder="https://example.com 또는 아무 텍스트"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">크기: {size}px</label>
              <input
                type="range"
                min={128}
                max={512}
                step={64}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none bg-slate-200 accent-slate-900"
              />
            </div>

            {value.trim() && (
              <>
                <div className="flex flex-col items-center gap-4">
                  <div ref={canvasRef} className="p-4 bg-white rounded-xl border border-slate-200">
                    <QRCodeCanvas value={value.trim()} size={size} level="M" />
                  </div>
                  <button
                    type="button"
                    onClick={downloadPng}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                  >
                    <Download size={18} /> PNG로 저장
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
