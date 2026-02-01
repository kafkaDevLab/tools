'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Link2, Copy, AlertCircle } from 'lucide-react';

type Mode = 'encode' | 'decode';

export default function UrlEncoderPage() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const runEncode = () => {
    setError(null);
    try {
      setOutput(encodeURIComponent(input));
    } catch (e) {
      setError('인코딩 실패');
      setOutput('');
    }
  };

  const runDecode = () => {
    setError(null);
    try {
      setOutput(decodeURIComponent(input.replace(/\+/g, ' ')));
    } catch (e) {
      setError('디코딩 실패 (유효한 URL 인코딩이 아닐 수 있음)');
      setOutput('');
    }
  };

  const handleConvert = () => {
    if (mode === 'encode') runEncode();
    else runDecode();
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
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
            <div className="w-12 h-12 shrink-0 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <Link2 size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold mb-1 text-slate-900">URL 인코더·디코더</h1>
              <p className="text-slate-500 text-sm">텍스트를 percent-encoding으로 인코딩·디코딩하세요.</p>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMode('encode')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${mode === 'encode' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                인코딩
              </button>
              <button
                type="button"
                onClick={() => setMode('decode')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${mode === 'decode' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                디코딩
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {mode === 'encode' ? '텍스트' : 'URL 인코딩 문자열'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder={mode === 'encode' ? '인코딩할 텍스트' : 'percent-encoded 문자열'}
              />
            </div>
            <button
              type="button"
              onClick={handleConvert}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              {mode === 'encode' ? '인코딩' : '디코딩'}
            </button>
            {output && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">결과</label>
                <div className="flex gap-2">
                  <textarea
                    readOnly
                    value={output}
                    rows={4}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm bg-slate-50 resize-y"
                  />
                  <button
                    type="button"
                    onClick={copyOutput}
                    className="shrink-0 h-fit inline-flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-xl font-medium hover:bg-slate-200"
                  >
                    {copied ? '복사됨' : '복사'}
                    <Copy size={16} />
                  </button>
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
