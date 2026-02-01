'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Palette, Copy, Check, Trash2, Info, GripVertical, Camera, Eye, ChevronDown, Plus, Sparkles, Download } from 'lucide-react';

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

/** 색맹 시뮬레이션: hex → 시뮬레이션된 hex (sRGB 근사) */
type ColorBlindType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

function simulateColorBlind(hex: string, type: ColorBlindType): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  let { r, g, b } = rgb;
  r /= 255;
  g /= 255;
  b /= 255;
  let r2: number, g2: number, b2: number;
  switch (type) {
    case 'protanopia':
      r2 = 0.567 * r + 0.433 * g;
      g2 = 0.558 * r + 0.442 * g;
      b2 = 0.242 * g + 0.758 * b;
      break;
    case 'deuteranopia':
      r2 = 0.625 * r + 0.375 * g;
      g2 = 0.7 * r + 0.3 * g;
      b2 = 0.3 * g + 0.7 * b;
      break;
    case 'tritanopia':
      r2 = 0.95 * r + 0.05 * b;
      g2 = 0.433 * g + 0.567 * b;
      b2 = 0.475 * g + 0.525 * b;
      break;
    case 'achromatopsia': {
      const L = 0.299 * r + 0.587 * g + 0.114 * b;
      r2 = g2 = b2 = L;
      break;
    }
    default:
      return hex;
  }
  return rgbToHex(
    Math.round(Math.max(0, Math.min(1, r2)) * 255),
    Math.round(Math.max(0, Math.min(1, g2)) * 255),
    Math.round(Math.max(0, Math.min(1, b2)) * 255)
  );
}

const COLOR_BLIND_OPTIONS: { type: ColorBlindType; label: string }[] = [
  { type: 'protanopia', label: 'Protanopia (적색맹)' },
  { type: 'deuteranopia', label: 'Deuteranopia (녹색맹)' },
  { type: 'tritanopia', label: 'Tritanopia (청색맹)' },
  { type: 'achromatopsia', label: 'Achromatopsia (전색맹)' },
];

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
  { name: '미드나잇 네이비', colors: ['#0f172a', '#1e293b', '#334155', '#64748b', '#94a3b8'] },
  { name: '테라코타', colors: ['#c2410c', '#ea580c', '#f97316', '#fb923c', '#fdba74'] },
  { name: '세이지 그린', colors: ['#14532d', '#166534', '#22c55e', '#4ade80', '#86efac'] },
  { name: '로즈 골드', colors: ['#881337', '#9f1239', '#be123c', '#e11d48', '#fda4af'] },
  { name: '일렉트릭 바이올렛', colors: ['#4c1d95', '#5b21b6', '#7c3aed', '#8b5cf6', '#a78bfa'] },
  { name: '아이스 블루', colors: ['#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9'] },
  { name: '허니 앤 버터', colors: ['#78350f', '#92400e', '#b45309', '#d97706', '#fbbf24'] },
  { name: '딥 틸', colors: ['#0f766e', '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4'] },
  { name: '멀버리', colors: ['#581c87', '#6b21a8', '#7e22ce', '#9333ea', '#a855f7'] },
  { name: '스칼렛', colors: ['#7f1d1d', '#991b1b', '#b91c1c', '#dc2626', '#ef4444'] },
  { name: '모닝 스카이', colors: ['#0369a1', '#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc'] },
  { name: '올리브', colors: ['#422006', '#713f12', '#854d0e', '#a16207', '#ca8a04'] },
  { name: '플럼', colors: ['#3b0764', '#4c1d95', '#5b21b6', '#6d28d9', '#7c3aed'] },
  { name: '샌디 비치', colors: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b'] },
  { name: '스틸 그레이', colors: ['#27272a', '#3f3f46', '#52525b', '#71717a', '#a1a1aa'] },
  { name: '피오니', colors: ['#831843', '#9d174d', '#be185d', '#db2777', '#ec4899'] },
  { name: '에메랄드', colors: ['#064e3b', '#065f46', '#047857', '#059669', '#10b981'] },
  { name: '앰버', colors: ['#451a03', '#78350f', '#b45309', '#d97706', '#f59e0b'] },
  { name: '인디고 나이트', colors: ['#1e1b4b', '#312e81', '#3730a3', '#4f46e5', '#6366f1'] },
  { name: '크림슨', colors: ['#450a0a', '#7f1d1d', '#b91c1c', '#dc2626', '#f87171'] },
  { name: '아쿠아 마린', colors: ['#134e4a', '#0f766e', '#0d9488', '#14b8a6', '#2dd4bf'] },
  { name: '머스타드', colors: ['#422006', '#713f12', '#a16207', '#ca8a04', '#eab308'] },
  { name: '그레이스 라벤더', colors: ['#f5f3ff', '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa'] },
  { name: '차콜', colors: ['#171717', '#262626', '#404040', '#525252', '#737373'] },
  { name: '로즈쿼츠', colors: ['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185'] },
  { name: '스프루스', colors: ['#052e16', '#14532d', '#166534', '#15803d', '#22c55e'] },
  { name: '선셋 오렌지', colors: ['#7c2d12', '#c2410c', '#ea580c', '#f97316', '#fb923c'] },
  { name: '퍼플 헤이즈', colors: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc'] },
  { name: '슬레이트', colors: ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'] },
  { name: '살몬', colors: ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c'] },
  { name: '제이드', colors: ['#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399'] },
  { name: '럼', colors: ['#450a0a', '#7f1d1d', '#991b1b', '#b91c1c', '#dc2626'] },
  { name: '블루벨', colors: ['#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6'] },
  { name: '카푸치노', colors: ['#292524', '#44403c', '#78716c', '#a8a29e', '#d6d3d1'] },
  { name: '마젠타', colors: ['#831843', '#9d174d', '#be185d', '#ec4899', '#f9a8d4'] },
  { name: '민트 아이스', colors: ['#ecfeff', '#cffafe', '#a5f3fc', '#67e8f9', '#22d3ee'] },
  { name: '헌터 그린', colors: ['#052e16', '#14532d', '#166534', '#15803d', '#16a34a'] },
  { name: '러스티', colors: ['#431407', '#9a3412', '#c2410c', '#ea580c', '#f97316'] },
  { name: '바이올렛 드림', colors: ['#2e1065', '#4c1d95', '#5b21b6', '#7c3aed', '#8b5cf6'] },
  { name: '스노우 화이트', colors: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8'] },
  { name: '피치', colors: ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24'] },
  { name: '틸 그레이', colors: ['#0f766e', '#115e59', '#0d9488', '#14b8a6', '#5eead4'] },
  { name: '와인', colors: ['#450a0a', '#7f1d1d', '#991b1b', '#b91c1c', '#ef4444'] },
  { name: '스카이 미스트', colors: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8'] },
  { name: '카라멜', colors: ['#431407', '#78350f', '#b45309', '#d97706', '#fbbf24'] },
  { name: '오키드', colors: ['#500724', '#831843', '#9d174d', '#be185d', '#ec4899'] },
  { name: '그래파이트', colors: ['#18181b', '#27272a', '#3f3f46', '#52525b', '#71717a'] },
  { name: '코랄 리프', colors: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171'] },
  { name: '클오버', colors: ['#14532d', '#166534', '#16a34a', '#22c55e', '#4ade80'] },
  { name: '펌킨 스파이스', colors: ['#431407', '#9a3412', '#ea580c', '#f97316', '#fdba74'] },
  { name: '라일락', colors: ['#3b0764', '#5b21b6', '#7c3aed', '#8b5cf6', '#a78bfa'] },
  { name: '펄', colors: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8'] },
  { name: '애프리콧', colors: ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24'] },
  { name: '틸 웨이브', colors: ['#134e4a', '#0f766e', '#0d9488', '#2dd4bf', '#99f6e4'] },
  { name: '버건디', colors: ['#450a0a', '#7f1d1d', '#991b1b', '#dc2626', '#f87171'] },
  { name: '서밋 블루', colors: ['#0c4a6e', '#075985', '#0369a1', '#0284c7', '#0ea5e9'] },
  { name: '카카오', colors: ['#292524', '#57534e', '#78716c', '#a8a29e', '#d6d3d1'] },
  { name: '푸시아', colors: ['#701a75', '#86198f', '#a21caf', '#c026d3', '#d946ef'] },
  { name: '아이언', colors: ['#18181b', '#27272a', '#3f3f46', '#52525b', '#a1a1aa'] },
  { name: '블러쉬', colors: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#fb7185'] },
  { name: '클로버 필드', colors: ['#052e16', '#14532d', '#22c55e', '#4ade80', '#86efac'] },
  { name: '시나몬', colors: ['#431407', '#78350f', '#b45309', '#d97706', '#fbbf24'] },
  { name: '바이올렛 스톰', colors: ['#2e1065', '#5b21b6', '#6d28d9', '#7c3aed', '#a78bfa'] },
  { name: '프로스트', colors: ['#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf'] },
  { name: '망고', colors: ['#422006', '#713f12', '#a16207', '#ca8a04', '#facc15'] },
  { name: '티그리스', colors: ['#134e4a', '#0f766e', '#14b8a6', '#2dd4bf', '#5eead4'] },
  { name: '체리', colors: ['#4c0519', '#881337', '#9f1239', '#e11d48', '#fb7185'] },
  { name: '노던 라이트', colors: ['#082f49', '#0c4a6e', '#0369a1', '#38bdf8', '#7dd3fc'] },
  { name: '에스프레소', colors: ['#1c1917', '#292524', '#44403c', '#78716c', '#a8a29e'] },
  { name: '그레이프', colors: ['#581c87', '#6b21a8', '#7e22ce', '#9333ea', '#a855f7'] },
  { name: '실버', colors: ['#fafafa', '#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa'] },
  { name: '레몬 드롭', colors: ['#422006', '#713f12', '#ca8a04', '#eab308', '#fde047'] },
  { name: '오션 플로어', colors: ['#0f766e', '#0d9488', '#14b8a6', '#2dd4bf', '#99f6e4'] },
  { name: '루비', colors: ['#4c0519', '#881337', '#be123c', '#e11d48', '#f43f5e'] },
  { name: '알래스카', colors: ['#0f172a', '#1e293b', '#334155', '#64748b', '#94a3b8'] },
  { name: '모카', colors: ['#292524', '#44403c', '#57534e', '#78716c', '#a8a29e'] },
  { name: '자스민', colors: ['#701a75', '#86198f', '#a21caf', '#c026d3', '#e879f9'] },
  { name: '티타늄', colors: ['#27272a', '#3f3f46', '#52525b', '#71717a', '#a1a1aa'] },
  { name: '블러쉬 핑크', colors: ['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185'] },
  { name: '그린 밸리', colors: ['#14532d', '#166534', '#16a34a', '#22c55e', '#4ade80'] },
  { name: '진저', colors: ['#431407', '#9a3412', '#c2410c', '#ea580c', '#fb923c'] },
  { name: '아이리스', colors: ['#312e81', '#3730a3', '#4f46e5', '#6366f1', '#818cf8'] },
  { name: '아이스', colors: ['#ecfeff', '#cffafe', '#a5f3fc', '#67e8f9', '#22d3ee'] },
  { name: '골드 러시', colors: ['#713f12', '#a16207', '#ca8a04', '#eab308', '#fde047'] },
  { name: '마린', colors: ['#0c4a6e', '#075985', '#0ea5e9', '#38bdf8', '#7dd3fc'] },
  { name: '에보니', colors: ['#0c0a09', '#1c1917', '#292524', '#44403c', '#78716c'] },
  { name: '아마란스', colors: ['#831843', '#9d174d', '#be185d', '#db2777', '#f472b6'] },
  { name: '플래티넘', colors: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8'] },
  { name: '시트론', colors: ['#422006', '#713f12', '#a16207', '#eab308', '#fef08a'] },
  { name: '씨 그린', colors: ['#064e3b', '#065f46', '#047857', '#10b981', '#34d399'] },
  { name: '칠리', colors: ['#450a0a', '#7f1d1d', '#b91c1c', '#ef4444', '#f87171'] },
  { name: '인디고 블룸', colors: ['#1e1b4b', '#312e81', '#4338ca', '#6366f1', '#818cf8'] },
  { name: '글레이셔', colors: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8'] },
  { name: '사프란', colors: ['#78350f', '#92400e', '#b45309', '#f59e0b', '#fbbf24'] },
  { name: '티얼', colors: ['#134e4a', '#0f766e', '#0d9488', '#14b8a6', '#2dd4bf'] },
  { name: '크림슨 글로우', colors: ['#7f1d1d', '#b91c1c', '#dc2626', '#ef4444', '#f87171'] },
  { name: '블루 아워', colors: ['#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa'] },
  { name: '우드', colors: ['#292524', '#44403c', '#57534e', '#78716c', '#a8a29e'] },
  { name: '헬리오트로프', colors: ['#581c87', '#6b21a8', '#7c3aed', '#8b5cf6', '#a78bfa'] },
  { name: '스모크', colors: ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'] },
  { name: '로즈 드림', colors: ['#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6'] },
  { name: '페인 그린', colors: ['#052e16', '#14532d', '#166534', '#22c55e', '#4ade80'] },
  { name: '파프리카', colors: ['#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#f97316'] },
  { name: '바이올렛 에센스', colors: ['#4c1d95', '#5b21b6', '#6d28d9', '#7c3aed', '#8b5cf6'] },
  { name: '호아프로스트', colors: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80'] },
  { name: '터머릭', colors: ['#422006', '#713f12', '#b45309', '#eab308', '#fef08a'] },
  { name: '피닉스', colors: ['#0f766e', '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4'] },
  { name: '가넷', colors: ['#450a0a', '#991b1b', '#b91c1c', '#dc2626', '#ef4444'] },
  { name: '코발트', colors: ['#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa'] },
  { name: '월넛', colors: ['#1c1917', '#292524', '#44403c', '#57534e', '#78716c'] },
  { name: '멜론', colors: ['#831843', '#9d174d', '#be185d', '#ec4899', '#f9a8d4'] },
  { name: '스톰', colors: ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'] },
  { name: '블러쉬 로즈', colors: ['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185'] },
  { name: '에버그린', colors: ['#052e16', '#14532d', '#166534', '#16a34a', '#22c55e'] },
  { name: '카옌', colors: ['#7f1d1d', '#b91c1c', '#dc2626', '#ef4444', '#f87171'] },
  { name: '울트라 바이올렛', colors: ['#2e1065', '#4c1d95', '#5b21b6', '#7c3aed', '#8b5cf6'] },
  { name: '스노우 드롭', colors: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8'] },
  { name: '머큐리', colors: ['#44403c', '#57534e', '#78716c', '#a8a29e', '#d6d3d1'] },
  { name: '피치 블라썸', colors: ['#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6'] },
  { name: '포레스트 플로어', colors: ['#14532d', '#166534', '#15803d', '#22c55e', '#4ade80'] },
  { name: '타마린드', colors: ['#431407', '#78350f', '#b45309', '#d97706', '#fbbf24'] },
  { name: '바이올렛 페탈', colors: ['#3b0764', '#4c1d95', '#5b21b6', '#7c3aed', '#a78bfa'] },
  { name: '윈터 민트', colors: ['#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399'] },
  { name: '선플라워', colors: ['#422006', '#713f12', '#a16207', '#eab308', '#fef08a'] },
  { name: '아쿠아', colors: ['#0f766e', '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4'] },
  { name: '마룬', colors: ['#4c0519', '#881337', '#9f1239', '#be123c', '#e11d48'] },
  { name: '네이비 블루', colors: ['#172554', '#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6'] },
  { name: '카푸치노 라이트', colors: ['#44403c', '#57534e', '#78716c', '#a8a29e', '#d6d3d1'] },
  { name: '오키드 블룸', colors: ['#701a75', '#86198f', '#a21caf', '#c026d3', '#e879f9'] },
  { name: '니켈', colors: ['#3f3f46', '#52525b', '#71717a', '#a1a1aa', '#d4d4d8'] },
  { name: '코랄 클라우드', colors: ['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#f87171'] },
  { name: '클로버 그린', colors: ['#166534', '#16a34a', '#22c55e', '#4ade80', '#86efac'] },
  { name: '스파이스', colors: ['#431407', '#9a3412', '#c2410c', '#ea580c', '#fb923c'] },
  { name: '바이올렛 터치', colors: ['#312e81', '#3730a3', '#4f46e5', '#6366f1', '#818cf8'] },
  { name: '프레시 민트', colors: ['#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981'] },
  { name: '머스타드 시드', colors: ['#713f12', '#a16207', '#ca8a04', '#eab308', '#fde047'] },
  { name: '오션 미스트', colors: ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'] },
  { name: '루비 글로우', colors: ['#881337', '#9f1239', '#be123c', '#e11d48', '#f43f5e'] },
  { name: '미드나잇', colors: ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'] },
  { name: '카페', colors: ['#1c1917', '#292524', '#44403c', '#78716c', '#a8a29e'] },
  { name: '플럼 블룸', colors: ['#581c87', '#6b21a8', '#7e22ce', '#9333ea', '#a855f7'] },
  { name: '실버 라이닝', colors: ['#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#52525b'] },
  { name: '로즈 페탈', colors: ['#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6'] },
  { name: '그린 하바스트', colors: ['#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80'] },
  { name: '칠리 페퍼', colors: ['#7f1d1d', '#b91c1c', '#dc2626', '#ef4444', '#f87171'] },
  { name: '인디고 나잇', colors: ['#1e1b4b', '#312e81', '#4338ca', '#6366f1', '#818cf8'] },
  { name: '아이스 팩', colors: ['#ecfeff', '#cffafe', '#a5f3fc', '#67e8f9', '#22d3ee'] },
  { name: '골드 코인', colors: ['#78350f', '#92400e', '#b45309', '#eab308', '#fef08a'] },
  { name: '서퍼', colors: ['#0c4a6e', '#075985', '#0284c7', '#0ea5e9', '#38bdf8'] },
  { name: '블랙 커피', colors: ['#0c0a09', '#1c1917', '#292524', '#44403c', '#57534e'] },
  { name: '푸시아 블룸', colors: ['#86198f', '#a21caf', '#c026d3', '#d946ef', '#e879f9'] },
  // 다양한 색 조합 (비그라데이션)
  { name: '보색 블루 오렌지', colors: ['#2563eb', '#3b82f6', '#f97316', '#fb923c', '#1e293b'] },
  { name: '삼원색', colors: ['#ef4444', '#eab308', '#3b82f6', '#22c55e', '#8b5cf6'] },
  { name: '트로피칼', colors: ['#22c55e', '#14b8a6', '#f97316', '#eab308', '#ec4899'] },
  { name: '레트로 믹스', colors: ['#ca8a04', '#0d9488', '#f97316', '#fef3c7', '#7c3aed'] },
  { name: '쥬얼 톤', colors: ['#059669', '#2563eb', '#b91c1c', '#7c3aed', '#b45309'] },
  { name: '파스텔 믹스', colors: ['#c4b5fd', '#99f6e4', '#fbcfe8', '#7dd3fc', '#fef08a'] },
  { name: '선셋 팔레트', colors: ['#f472b6', '#fb923c', '#a78bfa', '#38bdf8', '#1e293b'] },
  { name: '포레스트 앤 베리', colors: ['#166534', '#22c55e', '#4ade80', '#881337', '#be185d'] },
  { name: '오션 앤 샌드', colors: ['#0ea5e9', '#38bdf8', '#fef3c7', '#d6d3d1', '#78716c'] },
  { name: '시트러스', colors: ['#facc15', '#84cc16', '#f97316', '#fb7185', '#fef08a'] },
  { name: '뉴트럴 앤 프라이머리', colors: ['#525252', '#a3a3a3', '#ef4444', '#3b82f6', '#eab308'] },
  { name: '하이 컨트라스트', colors: ['#0f172a', '#f8fafc', '#dc2626', '#eab308', '#2563eb'] },
  { name: '네온 팝', colors: ['#22d3ee', '#a855f7', '#facc15', '#22c55e', '#f472b6'] },
  { name: '어스 톤', colors: ['#78350f', '#a16207', '#14532d', '#fef3c7', '#c2410c'] },
  { name: '베리 믹스', colors: ['#e11d48', '#7c3aed', '#1e3a8a', '#4c0519', '#fda4af'] },
  { name: '스플릿 컴플리멘터리', colors: ['#2563eb', '#f97316', '#84cc16', '#1e293b', '#fef08a'] },
  { name: '모노 앤 팝', colors: ['#404040', '#737373', '#a3a3a3', '#22c55e', '#f472b6'] },
  { name: '티타닉 블루 골드', colors: ['#0c4a6e', '#0369a1', '#fbbf24', '#fef08a', '#1e293b'] },
  { name: '민트 코랄', colors: ['#2dd4bf', '#99f6e4', '#fb7185', '#fecdd3', '#0f766e'] },
  { name: '인디고 앤 앰버', colors: ['#4f46e5', '#818cf8', '#f59e0b', '#fef3c7', '#312e81'] },
];

/** HSL로 조화로운 5색 팔레트 생성 (색채 이론 기반) */
function generateRecommendedPalette(): string[] {
  const h = Math.floor(Math.random() * 360);
  const styles = [
    () => {
      // 보색 + 변형: 메인, 보색, 메인 쪽 2단계, 보색 쪽 2단계
      const s1 = 55 + Math.random() * 35;
      const l1 = 35 + Math.random() * 35;
      const s2 = 50 + Math.random() * 40;
      const l2 = 40 + Math.random() * 30;
      return [
        hslToHex(h, s1, l1),
        hslToHex((h + 180) % 360, s2, l2),
        hslToHex(h, Math.min(100, s1 - 15), Math.min(85, l1 + 25)),
        hslToHex((h + 180) % 360, Math.min(100, s2 - 10), Math.min(90, l2 + 20)),
        hslToHex((h + 20) % 360, 25 + Math.random() * 25, 50 + Math.random() * 25),
      ];
    },
    () => {
      // 삼원색: 120도 간격
      const s = 50 + Math.random() * 40;
      const l = 40 + Math.random() * 35;
      return [
        hslToHex(h, s, l),
        hslToHex((h + 120) % 360, s * 0.9, l + (Math.random() > 0.5 ? 10 : -10)),
        hslToHex((h + 240) % 360, s * 0.85, l + (Math.random() > 0.5 ? 5 : -5)),
        hslToHex((h + 60) % 360, s * 0.7, Math.min(80, l + 15)),
        hslToHex((h + 200) % 360, s * 0.75, Math.max(25, l - 10)),
      ];
    },
    () => {
      // 유사색(아날로거스) + 한 가지 강조
      const s = 45 + Math.random() * 40;
      return [
        hslToHex(h, s, 45 + Math.random() * 25),
        hslToHex((h + 25) % 360, s, 40 + Math.random() * 30),
        hslToHex((h + 50) % 360, s * 0.9, 50 + Math.random() * 25),
        hslToHex((h - 25 + 360) % 360, s * 0.85, 35 + Math.random() * 30),
        hslToHex((h + 180) % 360, 50 + Math.random() * 30, 45 + Math.random() * 25),
      ];
    },
    () => {
      // 스플릿 컴플리멘터리
      const s = 50 + Math.random() * 35;
      const l = 38 + Math.random() * 35;
      return [
        hslToHex(h, s, l),
        hslToHex((h + 150) % 360, s * 0.95, l + 5),
        hslToHex((h + 210) % 360, s * 0.9, l - 5),
        hslToHex((h + 30) % 360, s * 0.6, Math.min(85, l + 25)),
        hslToHex((h + 270) % 360, Math.min(100, s * 0.8), Math.max(20, l - 10)),
      ];
    },
    () => {
      // 파스텔/쥬얼 믹스: 채도·명도 다양
      const hues = [h, (h + 72) % 360, (h + 144) % 360, (h + 216) % 360, (h + 288) % 360];
      return hues.map((hi, i) => {
        const s = i % 2 === 0 ? 35 + Math.random() * 40 : 50 + Math.random() * 35;
        const l = i % 3 === 0 ? 55 + Math.random() * 25 : 40 + Math.random() * 35;
        return hslToHex(hi, s, l);
      });
    },
  ];
  const pick = styles[Math.floor(Math.random() * styles.length)]!;
  return pick();
}

function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

export default function ColorConverterPage() {
  const [colors, setColors] = useState<string[]>(() => [...DEFAULT_PALETTE]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [colorInfoHex, setColorInfoHex] = useState<string | null>(null);
  const [copiedPresetIndex, setCopiedPresetIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [colorBlindRows, setColorBlindRows] = useState<{ id: string; type: ColorBlindType; label: string; colors: string[] }[]>([]);
  const [colorBlindDropdownOpen, setColorBlindDropdownOpen] = useState(false);
  const [hexCopied, setHexCopied] = useState(false);
  const [captureSuccess, setCaptureSuccess] = useState(false);
  const [editingHex, setEditingHex] = useState<{ index: number; value: string } | null>(null);
  const [menuInputFocusedIndex, setMenuInputFocusedIndex] = useState<number | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'css' | 'tailwind' | 'html'>('css');
  const [exportCopied, setExportCopied] = useState<'css' | 'tailwind' | 'html' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  const COLOR_NAMES = ['primary', 'secondary', 'tertiary', 'accent', 'muted', 'neutral', 'surface', 'background'];
  const validExportColors = () => colors.filter((c) => /^#[0-9a-f]{6}$/i.test(c));
  const getExportCss = () => {
    const list = validExportColors();
    return list
      .map((hex, i) => `  --color-${COLOR_NAMES[i] ?? `color-${i + 1}`}: ${hex};`)
      .join('\n');
  };
  const getExportCssBlock = () => `:root {\n${getExportCss()}\n}`;
  const getExportTailwind = () => {
    const list = validExportColors();
    const entries = list.map((hex, i) => `      ${COLOR_NAMES[i] ?? `color${i + 1}`}: '${hex}'`).join(',\n');
    return `// tailwind.config.js - theme.extend.colors\n  theme: {\n    extend: {\n      colors: {\n${entries}\n      }\n    }\n  }`;
  };
  const getExportHtml = () => {
    const list = validExportColors();
    const vars = list.map((hex, i) => `  --color-${COLOR_NAMES[i] ?? `color-${i + 1}`}: ${hex};`).join('\n');
    return `<style>\n:root {\n${vars}\n}\n</style>`;
  };
  const copyExport = async (format: 'css' | 'tailwind' | 'html') => {
    const text =
      format === 'css' ? getExportCssBlock() : format === 'tailwind' ? getExportTailwind() : getExportHtml();
    try {
      await navigator.clipboard.writeText(text);
      setExportCopied(format);
      setTimeout(() => setExportCopied(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

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

  const applyRecommendedPalette = () => {
    setColors(generateRecommendedPalette());
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

  const copyPaletteHex = async () => {
    const text = colors.filter((c) => /^#[0-9a-f]{6}$/i.test(c)).join(' ');
    try {
      await navigator.clipboard.writeText(text);
      setHexCopied(true);
      setTimeout(() => setHexCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const capturePalette = async () => {
    const validColors = colors.filter((c) => /^#[0-9a-f]{6}$/i.test(c));
    if (validColors.length === 0) return;
    const w = 800;
    const h = 200;
    const barW = w / validColors.length;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    validColors.forEach((hex, i) => {
      ctx.fillStyle = hex;
      ctx.fillRect(i * barW, 0, barW + 1, h);
    });
    try {
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCaptureSuccess(true);
        setTimeout(() => setCaptureSuccess(false), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addColorBlindRow = (type: ColorBlindType) => {
    const opt = COLOR_BLIND_OPTIONS.find((o) => o.type === type);
    const simulated = colors.map((hex) => simulateColorBlind(hex, type));
    setColorBlindRows([
      { id: `${type}-${Date.now()}`, type, label: opt?.label ?? type, colors: simulated },
    ]);
    setColorBlindDropdownOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600">
                <Palette size={24} />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1 text-slate-900">색 조합</h1>
            <p className="text-slate-500 text-sm">프리셋을 선택하거나 색상에 마우스를 올려 메뉴에서 제거·이동·대비·상세 정보를 확인할 수 있습니다.</p>
          </div>

          {/* 상단: 수정 영역 (넓게) */}
          <div className="w-full mb-10" ref={menuRef}>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                {/* 상단 아이콘 메뉴바 */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={applyRecommendedPalette}
                    className="p-2 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 transition-colors"
                    title="AI 추천 5색 조합"
                  >
                    <Sparkles size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setColors((prev) => [...prev, '#ffffff'])}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    title="색상 추가 (맨 오른쪽에 흰색 추가)"
                  >
                    <Plus size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={capturePalette}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    title="캡처 (클립보드에 이미지 복사)"
                  >
                    {captureSuccess ? <Check size={18} className="text-green-600" /> : <Camera size={18} />}
                  </button>
                  <button
                    type="button"
                    onClick={copyPaletteHex}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    title="HEX 값들 복사"
                  >
                    {hexCopied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExportModalOpen(true)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    title="CSS / Tailwind / HTML로 추출"
                  >
                    <Download size={18} />
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setColorBlindDropdownOpen((prev) => !prev)}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center gap-0.5"
                      title="색맹 시뮬레이션"
                    >
                      <Eye size={18} />
                      <ChevronDown size={14} />
                    </button>
                    {colorBlindDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setColorBlindDropdownOpen(false)}
                          aria-hidden
                        />
                        <div className="absolute left-0 top-full mt-1 z-20 min-w-[200px] py-1 bg-white rounded-xl shadow-lg border border-slate-200">
                          {COLOR_BLIND_OPTIONS.map((opt) => (
                            <button
                              key={opt.type}
                              type="button"
                              onClick={() => addColorBlindRow(opt.type)}
                              className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div ref={paletteRef} className="flex gap-0 overflow-hidden rounded-xl border-2 border-slate-200">
                  {colors.map((slotHex, i) => {
                    const hex = slotHex.match(/^#[0-9a-f]{6}$/i) ? slotHex : '#e2e8f0';
                    const isLight = getLuminance(hex) > 0.5;
                    const textClass = isLight ? 'text-slate-900' : 'text-white';
                    const menuVisible = showMenu(i);
                    return (
                      <div
                        key={i}
                        className={`relative flex-1 min-w-0 flex flex-col shrink-0 min-h-[360px] transition-shadow ${
                          menuVisible ? 'z-[100]' : ''
                        } ${
                          dragOverIndex === i ? 'ring-2 ring-white ring-inset shadow-inner' : ''
                        } ${dragIndex === i ? 'opacity-60' : ''}`}
                        style={{ backgroundColor: hex }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => {
                          if (menuInputFocusedIndex === i) return;
                          setHoveredIndex(null);
                          if (openMenuIndex === i) setOpenMenuIndex(null);
                          if (editingHex?.index === i) setEditingHex(null);
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
                              <div className="flex items-center gap-1.5 justify-center">
                                <input
                                  type="color"
                                  value={hex}
                                  onFocus={() => setMenuInputFocusedIndex(i)}
                                  onBlur={() => setMenuInputFocusedIndex(null)}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    setColors((prev) => {
                                      const next = [...prev];
                                      next[i] = v;
                                      return next;
                                    });
                                  }}
                                  className="w-8 h-8 rounded cursor-pointer border border-white/50 bg-transparent"
                                />
                                <input
                                  type="text"
                                  value={editingHex?.index === i ? editingHex.value : hex}
                                  onFocus={() => {
                                    setEditingHex({ index: i, value: hex });
                                    setMenuInputFocusedIndex(i);
                                  }}
                                  onChange={(e) => {
                                    let v = e.target.value.trim();
                                    if (v && !v.startsWith('#')) v = '#' + v;
                                    setEditingHex({ index: i, value: v });
                                    const m = v.replace(/^#/, '').match(/^([0-9a-f]{3})$/i);
                                    const expanded = m ? '#' + m[1]!.split('').map((c) => c + c).join('') : v;
                                    if (/^#[0-9a-f]{6}$/i.test(expanded)) {
                                      setColors((prev) => {
                                        const next = [...prev];
                                        next[i] = expanded;
                                        return next;
                                      });
                                    }
                                  }}
                                  onBlur={() => {
                                    setMenuInputFocusedIndex(null);
                                    if (editingHex?.index === i && editingHex.value) {
                                      const v = editingHex.value.replace(/^#/, '');
                                      const m = v.match(/^([0-9a-f]{3})$/i);
                                      const expanded = m ? '#' + m[1]!.split('').map((c) => c + c).join('') : (v.length === 6 ? '#' + v : hex);
                                      if (/^#[0-9a-f]{6}$/i.test(expanded)) {
                                        setColors((prev) => {
                                          const next = [...prev];
                                          next[i] = expanded;
                                          return next;
                                        });
                                      }
                                    }
                                    setEditingHex(null);
                                  }}
                                  className="w-20 px-1.5 py-1 rounded text-xs font-mono bg-white/20 text-white border border-white/50 placeholder-white/60"
                                  placeholder="#ffffff"
                                />
                              </div>
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
                              <button
                                type="button"
                                onClick={() => {
                                  setColorInfoHex(hex);
                                  setOpenMenuIndex(null);
                                  setHoveredIndex(null);
                                  setEditingHex(null);
                                  setMenuInputFocusedIndex(null);
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
                {/* 색맹 시뮬레이션 행들 (현재 조합 아래에 추가됨) */}
                {colorBlindRows.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {colorBlindRows.map((row) => (
                      <div key={row.id} className="space-y-1">
                        <p className="text-xs font-medium text-slate-500">{row.label}</p>
                        <div className="flex gap-0 overflow-hidden rounded-xl border-2 border-slate-200 min-h-[120px]">
                          {row.colors.map((hex, j) => {
                            const isLight = getLuminance(hex) > 0.5;
                            const textClass = isLight ? 'text-slate-900' : 'text-white';
                            return (
                              <div
                                key={j}
                                className="flex-1 min-w-0 flex flex-col justify-end p-2 shrink-0"
                                style={{ backgroundColor: hex }}
                              >
                                <span className={`font-mono text-xs font-medium ${textClass} drop-shadow-sm text-center`}>
                                  {hex}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setColorBlindRows((prev) => prev.filter((r) => r.id !== row.id))
                          }
                          className="text-xs text-slate-400 hover:text-slate-600"
                        >
                          제거
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          {/* 하단: 프리셋 조합 (3열 그리드) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">프리셋 조합</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {COLOR_PRESETS.map((preset, index) => (
                <li key={preset.name}>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="flex-1 min-w-0 text-left rounded-xl border border-slate-200 p-2.5 hover:border-violet-300 hover:bg-violet-50/50 transition-colors"
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
        </div>
      </main>
      <Footer />

      {/* Export layer popup */}
      {exportModalOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setExportModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Export palette"
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">팔레트 추출</h3>
            <div className="flex gap-2 mb-4">
              {(['css', 'tailwind', 'html'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setExportFormat(fmt)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    exportFormat === fmt ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {fmt === 'css' ? 'CSS' : fmt === 'tailwind' ? 'Tailwind' : 'HTML'}
                </button>
              ))}
            </div>
            <div className="rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-sm overflow-x-auto max-h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap break-all">
                {exportFormat === 'css'
                  ? getExportCssBlock()
                  : exportFormat === 'tailwind'
                    ? getExportTailwind()
                    : getExportHtml()}
              </pre>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => copyExport(exportFormat)}
                className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors flex items-center gap-2"
              >
                {exportCopied === exportFormat ? <Check size={16} /> : <Copy size={16} />}
                {exportCopied === exportFormat ? '복사됨' : '복사'}
              </button>
              <button
                type="button"
                onClick={() => setExportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color info layer popup */}
      {colorInfoHex && (() => {
        const rgb = hexToRgb(colorInfoHex);
        const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
        const lum = getLuminance(colorInfoHex);
        const contrastWhite = getContrastRatio(colorInfoHex, '#ffffff');
        const contrastBlack = getContrastRatio(colorInfoHex, '#000000');
        return (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
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
