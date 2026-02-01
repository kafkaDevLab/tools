'use client';

import React, { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Key, Copy, RefreshCw, Check } from 'lucide-react';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SPECIAL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function getRandomBytes(n: number): number[] {
  const arr = new Uint8Array(n);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
    return Array.from(arr);
  }
  return Array.from({ length: n }, () => Math.floor(Math.random() * 256));
}

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSpecial, setUseSpecial] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let pool = '';
    if (useUpper) pool += UPPER;
    if (useLower) pool += LOWER;
    if (useDigits) pool += DIGITS;
    if (useSpecial) pool += SPECIAL;
    if (!pool) {
      setPassword('');
      return;
    }
    const bytes = getRandomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += pool[bytes[i] % pool.length];
    }
    setPassword(result);
  }, [length, useUpper, useLower, useDigits, useSpecial]);

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                <Key size={24} />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1 text-slate-900">비밀번호 생성기</h1>
            <p className="text-slate-500 text-sm">길이와 문자 종류를 선택한 뒤 생성·복사하세요.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">길이: {length}</label>
              <input
                type="range"
                min={8}
                max={32}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none bg-slate-200 accent-slate-900"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>8</span>
                <span>32</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="block text-sm font-medium text-slate-700">포함할 문자</span>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useUpper}
                  onChange={(e) => setUseUpper(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900"
                />
                <span className="text-slate-700">대문자 (A-Z)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useLower}
                  onChange={(e) => setUseLower(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900"
                />
                <span className="text-slate-700">소문자 (a-z)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useDigits}
                  onChange={(e) => setUseDigits(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900"
                />
                <span className="text-slate-700">숫자 (0-9)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSpecial}
                  onChange={(e) => setUseSpecial(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900"
                />
                <span className="text-slate-700">특수문자 (!@#$...)</span>
              </label>
            </div>

            <button
              type="button"
              onClick={generate}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              <RefreshCw size={18} /> 비밀번호 생성
            </button>

            {password && (
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">생성된 비밀번호</label>
                <div className="flex gap-2">
                  <code className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-sm font-mono break-all">
                    {password}
                  </code>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? '복사됨' : '복사'}
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
