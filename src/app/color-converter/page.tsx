'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Palette, Copy, Check, Trash2, Info, GripVertical } from 'lucide-react';

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

function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const L1 = getLuminance(hex1);
  const L2 = getLuminance(hex2);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** WCAG AA: normal text 4.5:1, large text 3:1. Use 4.5:1 as pass. */
const WCAG_AA_CONTRAST = 4.5;

function isContrastAccessible(ratio: number): boolean {
  return ratio >= WCAG_AA_CONTRAST;
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [colorInfoHex, setColorInfoHex] = useState<string | null>(null);
  const [copiedPresetIndex, setCopiedPresetIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showMenu = (i: number) => hoveredIndex === i || openMenuIndex === i;

  const removeColor = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
    setOpenMenuIndex(null);
  };

  const reorderByDrag = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setColors((prev) => {
      const arr = [...prev];
      const [removed] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, removed!);
      return arr;
    });
    setOpenMenuIndex(toIndex);
  };

  const applyPreset = (preset: { name: string; colors: string[] }) => {
    setColors([...preset.colors]);
    setOpenMenuIndex(null);
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
            <p className="text-slate-500">프리셋을 선택하거나 색상에 마우스를 올려 메뉴에서 제거·이동·대비·상세 정보를 확인할 수 있습니다.</p>
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

            {/* 오른쪽: 색상 슬롯 (호버/클릭 시 메뉴) */}
            <div className="flex-1 min-w-0" ref={menuRef}>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex gap-0 overflow-hidden rounded-xl border-2 border-slate-200">
                  {colors.map((slotHex, i) => {
                    const hex = slotHex.match(/^#[0-9a-f]{6}$/i) ? slotHex : '#e2e8f0';
                    const isLight = getLuminance(hex) > 0.5;
                    const textClass = isLight ? 'text-slate-900' : 'text-white';
                    const menuVisible = showMenu(i);
                    return (
                      <div
                        key={i}
                        className={`relative flex-1 min-w-0 flex flex-col shrink-0 min-h-[280px] transition-shadow ${
                          menuVisible ? 'z-[100]' : ''
                        } ${
                          dragOverIndex === i ? 'ring-2 ring-white ring-inset shadow-inner' : ''
                        } ${dragIndex === i ? 'opacity-60' : ''}`}
                        style={{ backgroundColor: hex }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => {
                          setHoveredIndex(null);
                          if (openMenuIndex === i) setOpenMenuIndex(null);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                          setDragOverIndex(i);
                        }}
                        onDragLeave={() => setDragOverIndex((prev) => (prev === i ? null : prev))}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (dragIndex !== null) {
                            reorderByDrag(dragIndex, i);
                          }
                          setDragIndex(null);
                          setDragOverIndex(null);
                        }}
                      >
                        {/* 평상시: hex만 하단에 표시 */}
                        {!menuVisible && (
                          <span
                            className={`absolute bottom-2 left-0 right-0 text-center font-mono text-xs font-medium ${textClass} drop-shadow-sm`}
                          >
                            {hex}
                          </span>
                        )}
                        {/* 호버/클릭 시: 색상 안에 메뉴 오버레이 (z-30으로 드래그 핸들 위에 항상 표시) */}
                        {menuVisible && (
                          <div
                            className="absolute inset-0 z-20 flex flex-col justify-center p-2 bg-black/40 backdrop-blur-sm"
                            onClick={() => setOpenMenuIndex(null)}
                          >
                            <div
                              className="space-y-0.5 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => removeColor(i)}
                                className="w-full py-1.5 text-sm text-white hover:bg-white/20 rounded flex items-center justify-center gap-1.5"
                              >
                                <Trash2 size={14} /> Remove
                              </button>
                              <div
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('text/plain', String(i));
                                  e.dataTransfer.effectAllowed = 'move';
                                  setDragIndex(i);
                                  setOpenMenuIndex(null);
                                }}
                                onDragEnd={() => {
                                  setDragIndex(null);
                                  setDragOverIndex(null);
                                }}
                                className="w-full py-1.5 text-sm text-white hover:bg-white/20 rounded flex items-center justify-center gap-1.5 cursor-grab active:cursor-grabbing touch-none"
                              >
                                <GripVertical size={14} /> Move
                              </div>
                              <div className="py-1 text-xs text-white/90">
                                {(() => {
                                  const w = getContrastRatio(hex, '#ffffff');
                                  const b = getContrastRatio(hex, '#000000');
                                  const wOk = isContrastAccessible(w);
                                  const bOk = isContrastAccessible(b);
                                  return (
                                    <>
                                      White text: {w.toFixed(1)}:1{' '}
                                      <span className={wOk ? 'text-emerald-300' : 'text-red-300'}>
                                        {wOk ? 'Good' : 'Bad'}
                                      </span>
                                      <br />
                                      Black text: {b.toFixed(1)}:1{' '}
                                      <span className={bOk ? 'text-emerald-300' : 'text-red-300'}>
                                        {bOk ? 'Good' : 'Bad'}
                                      </span>
                                    </>
                                  );
                                })()}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setColorInfoHex(hex);
                                  setOpenMenuIndex(null);
                                }}
                                className="w-full py-1.5 text-sm text-white hover:bg-white/20 rounded flex items-center justify-center gap-1.5"
                              >
                                <Info size={14} /> View color info
                              </button>
                            </div>
                          </div>
                        )}
                        <button
                          type="button"
                          className="absolute inset-0 z-0"
                          onClick={() => setOpenMenuIndex((prev) => (prev === i ? null : i))}
                          aria-haspopup="true"
                          aria-expanded={menuVisible}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Color info layer popup */}
      {colorInfoHex && (() => {
        const rgb = hexToRgb(colorInfoHex);
        const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
        const lum = getLuminance(colorInfoHex);
        const contrastWhite = getContrastRatio(colorInfoHex, '#ffffff');
        const contrastBlack = getContrastRatio(colorInfoHex, '#000000');
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setColorInfoHex(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Color info"
          >
            <div
              className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-full h-24 rounded-xl mb-4 border border-slate-200"
                style={{ backgroundColor: colorInfoHex }}
              />
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Color info</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">HEX</dt>
                  <dd className="font-mono text-slate-900">{colorInfoHex}</dd>
                </div>
                {rgb && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">RGB</dt>
                    <dd className="font-mono text-slate-900">
                      {rgb.r}, {rgb.g}, {rgb.b}
                    </dd>
                  </div>
                )}
                {hsl && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">HSL</dt>
                    <dd className="font-mono text-slate-900">
                      {Math.round(hsl.h)}, {Math.round(hsl.s)}%, {Math.round(hsl.l)}%
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-slate-500">Luminance</dt>
                  <dd className="font-mono text-slate-900">{lum.toFixed(4)}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-slate-500">Contrast (white)</dt>
                  <dd className="font-mono text-slate-900">
                    {contrastWhite.toFixed(2)}:1{' '}
                    <span className={isContrastAccessible(contrastWhite) ? 'text-emerald-600' : 'text-red-600'}>
                      {isContrastAccessible(contrastWhite) ? 'Good' : 'Bad'}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-slate-500">Contrast (black)</dt>
                  <dd className="font-mono text-slate-900">
                    {contrastBlack.toFixed(2)}:1{' '}
                    <span className={isContrastAccessible(contrastBlack) ? 'text-emerald-600' : 'text-red-600'}>
                      {isContrastAccessible(contrastBlack) ? 'Good' : 'Bad'}
                    </span>
                  </dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => setColorInfoHex(null)}
                className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
