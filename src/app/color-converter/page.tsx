'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Palette, Copy, Check } from 'lucide-react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace(/^#/, '').match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let r: number, g: number, b: number;
  if (m[1].length === 3) {
    r = parseInt(m[1][0]! + m[1][0], 16);
    g = parseInt(m[1][1]! + m[1][1], 16);
    b = parseInt(m[1][2]! + m[1][2], 16);
  } else {
    r = parseInt(m[1].slice(0, 2), 16);
    g = parseInt(m[1].slice(2, 4), 16);
    b = parseInt(m[1].slice(4, 6), 16);
  }
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
}

function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

const DEFAULT_PALETTE = ['#3b82f6', '#ef4444', '#22c55e', '#eab308', '#8b5cf6'];

const COLOR_PRESETS: { name: string; colors: string[] }[] = [
  { name: '오션 블루', colors: ['#0ea5e9', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc'] },
  { name: '선셋 웜', colors: ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'] },
  { name: '포레스트 그린', colors: ['#15803d', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'] },
  { name: '라벤더', colors: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#e9d5ff'] },
  { name: '코랄 핑크', colors: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3'] },
  { name: '뉴트럴 그레이', colors: ['#404040', '#737373', '#a3a3a3', '#d4d4d4', '#f5f5f5'] },
  { name: '민트 프레시', colors: ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'] },
  { name: '골드 앤 다크', colors: ['#1c1917', '#44403c', '#a16207', '#eab308', '#fef08a'] },
  { name: '베리 다크', colors: ['#4c1d95', '#6d28d9', '#7c3aed', '#8b5cf6', '#c4b5fd'] },
  { name: '피치 파스텔', colors: ['#f472b6', '#f9a8d4', '#fbcfe8', '#fce7f3', '#fdf2f8'] },
];

export default function ColorConverterPage() {
  const [colors, setColors] = useState<string[]>(() => [...DEFAULT_PALETTE]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hex, setHex] = useState(DEFAULT_PALETTE[0] ?? '#3b82f6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [source, setSource] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [copiedPresetIndex, setCopiedPresetIndex] = useState<number | null>(null);

  // 슬롯 선택 시 해당 슬롯 색상을 편집 상태로 로드
  useEffect(() => {
    const slotHex = colors[selectedIndex];
    if (slotHex) {
      setHex(slotHex);
      const parsed = hexToRgb(slotHex);
      if (parsed) {
        setRgb(parsed);
        setHsl(rgbToHsl(parsed.r, parsed.g, parsed.b));
      }
    }
  }, [selectedIndex]);

  // 편집 중인 색상을 현재 슬롯에 반영
  useEffect(() => {
    const parsed = hexToRgb(hex);
    if (parsed) {
      setColors((prev) => {
        const next = [...prev];
        next[selectedIndex] = hex.match(/^#[0-9a-f]{6}$/i) ? hex : next[selectedIndex] ?? hex;
        return next;
      });
    }
  }, [hex, selectedIndex]);

  useEffect(() => {
    if (source === 'hex') {
      const parsed = hexToRgb(hex);
      if (parsed) {
        setRgb(parsed);
        setHsl(rgbToHsl(parsed.r, parsed.g, parsed.b));
      }
    }
  }, [hex, source]);

  useEffect(() => {
    if (source === 'rgb') {
      setHex(rgbToHex(rgb.r, rgb.g, rgb.b));
      setHsl(rgbToHsl(rgb.r, rgb.g, rgb.b));
    }
  }, [rgb.r, rgb.g, rgb.b, source]);

  useEffect(() => {
    if (source === 'hsl') {
      const { r, g, b } = hslToRgb(hsl.h, hsl.s, hsl.l);
      setRgb({ r, g, b });
      setHex(rgbToHex(r, g, b));
    }
  }, [hsl.h, hsl.s, hsl.l, source]);

  const previewBg = hex.match(/^#[0-9a-f]{6}$/i) ? hex : '#3b82f6';

  const applyPreset = (preset: { name: string; colors: string[] }) => {
    setColors([...preset.colors]);
    setSelectedIndex(0);
    const first = preset.colors[0];
    if (first) {
      setHex(first);
      const parsed = hexToRgb(first);
      if (parsed) {
        setRgb(parsed);
        setHsl(rgbToHsl(parsed.r, parsed.g, parsed.b));
      }
    }
  };

  const copyPresetHex = async (preset: { colors: string[] }, index: number) => {
    const text = preset.colors.join(' ');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPresetIndex(index);
      setTimeout(() => setCopiedPresetIndex(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center text-violet-600">
                <Palette size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-slate-900">색 조합</h1>
            <p className="text-slate-500">프리셋을 선택하거나 5색을 편집하고 HEX, RGB, HSL로 변환할 수 있습니다.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* 왼쪽: 프리셋 조합 리스트 */}
            <aside className="w-full md:w-64 shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">프리셋 조합</h2>
                <ul className="space-y-3 max-h-[480px] overflow-y-auto">
                  {COLOR_PRESETS.map((preset, index) => (
                    <li key={preset.name}>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => applyPreset(preset)}
                          className="flex-1 min-w-0 text-left rounded-xl border border-slate-200 p-2 hover:border-violet-300 hover:bg-violet-50/50 transition-colors"
                        >
                          <div className="flex gap-0 overflow-hidden rounded-lg mb-1.5">
                            {preset.colors.map((c, i) => (
                              <span
                                key={i}
                                className="flex-1 h-10 shrink-0"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-slate-700 truncate block">{preset.name}</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyPresetHex(preset, index);
                          }}
                          className="shrink-0 p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                          title="색상 HEX 전체 복사"
                        >
                          {copiedPresetIndex === index ? (
                            <Check size={16} className="text-green-600" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* 오른쪽: 5색 슬롯 + 미리보기 + HEX/RGB/HSL */}
            <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            {/* 5가지 색상 슬롯: 가로 나열, 선택 시 해당 색 편집 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">색 조합 (클릭하여 선택·편집)</label>
              <div className="flex gap-0 overflow-hidden rounded-xl border-2 border-slate-200">
                {colors.map((slotHex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedIndex(i)}
                    className={`flex-1 min-w-0 h-20 shrink-0 transition-all ${
                      selectedIndex === i ? 'ring-2 ring-slate-900 ring-inset' : 'hover:opacity-90'
                    }`}
                    style={{ backgroundColor: slotHex.match(/^#[0-9a-f]{6}$/i) ? slotHex : '#e2e8f0' }}
                    title={`색 ${i + 1} 선택`}
                  />
                ))}
              </div>
            </div>

            <div
              className="w-full h-24 rounded-xl border-2 border-slate-200"
              style={{ backgroundColor: previewBg }}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">HEX</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => {
                    setSource('hex');
                    setHex(e.target.value);
                  }}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                />
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => {
                    setSource('hex');
                    setHex(e.target.value);
                  }}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">RGB</label>
              <div className="flex gap-2">
                {(['r', 'g', 'b'] as const).map((key) => (
                  <input
                    key={key}
                    type="number"
                    min={0}
                    max={255}
                    value={rgb[key]}
                    onChange={(e) => {
                      setSource('rgb');
                      setRgb((prev) => ({ ...prev, [key]: Number(e.target.value) || 0 }));
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-center font-mono text-sm"
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">HSL</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  max={360}
                  value={Math.round(hsl.h)}
                  onChange={(e) => {
                    setSource('hsl');
                    setHsl((prev) => ({ ...prev, h: Number(e.target.value) || 0 }));
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-center font-mono text-sm"
                  placeholder="H"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={Math.round(hsl.s)}
                  onChange={(e) => {
                    setSource('hsl');
                    setHsl((prev) => ({ ...prev, s: Number(e.target.value) || 0 }));
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-center font-mono text-sm"
                  placeholder="S"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={Math.round(hsl.l)}
                  onChange={(e) => {
                    setSource('hsl');
                    setHsl((prev) => ({ ...prev, l: Number(e.target.value) || 0 }));
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-center font-mono text-sm"
                  placeholder="L"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                hsl({Math.round(hsl.h)}, {Math.round(hsl.s)}%, {Math.round(hsl.l)}%)
              </p>
            </div>
          </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
