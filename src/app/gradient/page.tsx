'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Copy, Check, ArrowRight, ArrowDown, ArrowDownRight, ArrowDownLeft, ArrowLeft, ArrowUpLeft, ArrowUp, ArrowUpRight, Sparkles, Plus, Minus } from 'lucide-react';

function randomHex(): string {
  return '#' + [0, 1, 2, 3, 4, 5].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

// 시계방향 8방향: 3시(→) → 4:30(↘) → 6시(↓) → 7:30(↙) → 9시(←) → 10:30(↖) → 12시(↑) → 1:30(↗)
const DIRECTIONS = [
  { value: 'to right', icon: ArrowRight, title: '오른쪽' },
  { value: 'to bottom right', icon: ArrowDownRight, title: '오른쪽 아래' },
  { value: 'to bottom', icon: ArrowDown, title: '아래' },
  { value: 'to bottom left', icon: ArrowDownLeft, title: '왼쪽 아래' },
  { value: 'to left', icon: ArrowLeft, title: '왼쪽' },
  { value: 'to top left', icon: ArrowUpLeft, title: '왼쪽 위' },
  { value: 'to top', icon: ArrowUp, title: '위' },
  { value: 'to top right', icon: ArrowUpRight, title: '오른쪽 위' },
];

const defaultStops = (n: number): number[] =>
  n >= 2 ? Array.from({ length: n }, (_, i) => (i === n - 1 ? 100 : Math.round((100 * i) / (n - 1)))) : [0, 100];

export default function GradientPage() {
  const [colors, setColors] = useState<string[]>(['#3b82f6', '#8b5cf6']);
  const [stops, setStops] = useState<number[]>([0, 100]);
  const [direction, setDirection] = useState('to right');
  const [copied, setCopied] = useState(false);

  const gradientStops = colors.map((c, i) => `${c} ${stops[i] ?? 0}%`);
  const cssValue = `linear-gradient(${direction}, ${gradientStops.join(', ')})`;
  const cssRule = `background: ${cssValue};`;

  const setColor = (index: number, value: string) => {
    setColors((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const setStop = (index: number, value: number) => {
    const v = Math.max(0, Math.min(100, value));
    setStops((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
  };

  const addColor = () => {
    if (colors.length >= 5) return;
    setColors((prev) => [...prev, randomHex()]);
    setStops(defaultStops(colors.length + 1));
  };

  const removeColor = () => {
    if (colors.length <= 2) return;
    setColors((prev) => prev.slice(0, -1));
    setStops(defaultStops(colors.length - 1));
  };

  const randomize = () => {
    const count = colors.length;
    setColors(Array.from({ length: count }, () => randomHex()));
    setStops(defaultStops(count));
    setDirection(DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]!.value);
  };

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(cssRule);
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
            <div
              className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-violet-600"
              style={{ background: cssValue }}
            />
            <div className="min-w-0">
              <h1 className="text-2xl font-bold mb-1 text-slate-900">그라데이션</h1>
              <p className="text-slate-500 text-sm">2~5개 색상과 방향을 선택해 CSS linear-gradient 코드를 생성하세요.</p>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={randomize}
                className="p-2 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 transition-colors"
                title="랜덤 생성"
              >
                <Sparkles size={18} />
              </button>
              <button
                type="button"
                onClick={removeColor}
                disabled={colors.length <= 2}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="색상 개수 줄이기"
              >
                <Minus size={18} />
              </button>
              <button
                type="button"
                onClick={addColor}
                disabled={colors.length >= 5}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="색상 개수 늘리기"
              >
                <Plus size={18} />
              </button>
            </div>

            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${colors.length}, minmax(0, 1fr))` }}
            >
              {colors.map((color, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {i === 0 ? '시작' : i === colors.length - 1 ? '끝' : `${i + 1}`}
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(i, e.target.value)}
                    className="w-full h-12 rounded-xl border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(i, e.target.value)}
                    className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-sm"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">방향</label>
              <div className="flex flex-wrap gap-2">
                {DIRECTIONS.map((d) => {
                  const Icon = d.icon;
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDirection(d.value)}
                      title={d.title}
                      className={`p-3 rounded-xl transition-colors ${
                        direction === d.value ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Icon size={20} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">구간 (%)</label>
              <p className="text-xs text-slate-500 mb-2">각 색상이 시작되는 위치를 0~100%로 설정합니다.</p>
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}
              >
                {colors.map((_, i) => (
                  <div key={i} className="min-w-0">
                    <label className="block text-xs text-slate-500 mb-1">
                      {i === 0 ? '시작' : i === colors.length - 1 ? '끝' : `${i + 1}`}
                    </label>
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={stops[i] ?? 0}
                        onChange={(e) => setStop(i, Number(e.target.value))}
                        className="flex-1 min-w-0 h-2 rounded-lg appearance-none bg-slate-200 accent-violet-600"
                      />
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={stops[i] ?? 0}
                        onChange={(e) => setStop(i, Number(e.target.value) || 0)}
                        className="w-16 shrink-0 px-2 py-1.5 rounded-lg border border-slate-200 font-mono text-sm text-right"
                      />
                      <span className="text-slate-400 text-sm shrink-0">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">미리보기</label>
              <div
                className="h-24 rounded-xl border border-slate-200"
                style={{ background: cssValue }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">CSS</label>
                <button
                  type="button"
                  onClick={copyCss}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-sm font-medium transition-colors"
                >
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  {copied ? '복사됨' : '복사'}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-sm overflow-x-auto">
                {cssRule}
              </pre>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
