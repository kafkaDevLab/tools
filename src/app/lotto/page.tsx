'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Clover, RotateCw, History, BarChart3, Trophy, Snowflake, Gift, PieChart, Image, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TabId = 'draw' | 'stats';

interface LottoDrawItem {
  ltEpsd: number;
  ltRflYmd: string;
  numbers: number[];
  bonus: number;
}

const STATS_LIMIT_OPTIONS = [30, 100, 500, 1000] as const;
const DRAW_STATS_LIMIT_OPTIONS = [30, 100, 500, 1000] as const;
const RECENT_DRAWS_SHOW = 30;

export type StatsMethodId = 'hot' | 'cold' | 'mixed' | 'zone' | 'oddEven';

export type DrawMethodId = 'random' | StatsMethodId;

const DRAW_METHODS: { id: DrawMethodId; name: string; description: string }[] = [
  { id: 'random', name: '무작위로 추출', description: '완전 무작위' },
  { id: 'hot', name: 'Hot 위주', description: '자주 나온 번호 위주' },
  { id: 'cold', name: 'Cold 위주', description: '적게 나온 번호 위주' },
  { id: 'mixed', name: 'Hot+Cold 혼합', description: '자주/적게 나온 번호 섞기' },
  { id: 'zone', name: '구간 균형', description: '번호를 구간에 골고루' },
  { id: 'oddEven', name: '홀짝 균형', description: '홀/짝 개수 맞추기' },
];

function pickNFrom(arr: number[], n: number): number[] {
  if (arr.length <= n) return [...arr].sort((a, b) => a - b);
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n).sort((a, b) => a - b);
}

function generateByStats(
  methodId: StatsMethodId,
  numberCounts: Record<number, number>,
  oddEvenDist: Record<number, number>
): number[] {
  const sortedByCountDesc = Object.entries(numberCounts)
    .map(([num, count]) => ({ num: Number(num), count }))
    .sort((a, b) => b.count - a.count)
    .map((x) => x.num);
  const sortedByCountAsc = [...sortedByCountDesc].reverse();

  switch (methodId) {
    case 'hot': {
      const top22 = sortedByCountDesc.slice(0, 22);
      return pickNFrom(top22.length >= 6 ? top22 : sortedByCountDesc, 6);
    }
    case 'cold': {
      const bottom22 = sortedByCountAsc.slice(0, 22);
      return pickNFrom(bottom22.length >= 6 ? bottom22 : sortedByCountAsc, 6);
    }
    case 'mixed': {
      const top15 = sortedByCountDesc.slice(0, 15);
      const bottom15 = sortedByCountAsc.slice(0, 15);
      const threeFromTop = pickNFrom(top15.length >= 3 ? top15 : sortedByCountDesc, 3);
      const threeFromBottom = pickNFrom(
        bottom15.filter((n) => !threeFromTop.includes(n)),
        3
      );
      if (threeFromTop.length + threeFromBottom.length < 6) {
        const combined = new Set([...threeFromTop, ...threeFromBottom]);
        while (combined.size < 6) {
          combined.add(sortedByCountDesc[Math.floor(Math.random() * sortedByCountDesc.length)] ?? 1);
        }
        return [...combined].sort((a, b) => a - b);
      }
      return [...threeFromTop, ...threeFromBottom].sort((a, b) => a - b);
    }
    case 'zone': {
      const zones = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
        [41, 42, 43, 44, 45],
      ];
      const five: number[] = [];
      zones.forEach((zone) => five.push(zone[Math.floor(Math.random() * zone.length)]!));
      let sixth = Math.floor(Math.random() * 45) + 1;
      while (five.includes(sixth)) sixth = Math.floor(Math.random() * 45) + 1;
      return [...five, sixth].sort((a, b) => a - b);
    }
    case 'oddEven': {
      let bestOdd = 3;
      let maxCount = 0;
      for (let odd = 0; odd <= 6; odd++) {
        if ((oddEvenDist[odd] ?? 0) > maxCount) {
          maxCount = oddEvenDist[odd] ?? 0;
          bestOdd = odd;
        }
      }
      const odds = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45];
      const evens = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44];
      const fromOdd = pickNFrom(odds, bestOdd);
      const fromEven = pickNFrom(evens, 6 - bestOdd);
      return [...fromOdd, ...fromEven].sort((a, b) => a - b);
    }
    default:
      return pickNFrom(Array.from({ length: 45 }, (_, i) => i + 1), 6);
  }
}

function formatDrawDate(ymd: string) {
  if (ymd.length !== 8) return ymd;
  return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
}

const COMBINATIONS_MIN = 1;
const COMBINATIONS_MAX = 10;

export default function LottoPage() {
  const [currentCombinations, setCurrentCombinations] = useState<number[][]>([]);
  const [history, setHistory] = useState<number[][]>([]);
  const [combinationsCount, setCombinationsCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tab, setTab] = useState<TabId>('draw');
  const [drawList, setDrawList] = useState<LottoDrawItem[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [statsLimit, setStatsLimit] = useState<number>(100);
  const [drawMethodId, setDrawMethodId] = useState<DrawMethodId>('random');
  const [drawStatsLimit, setDrawStatsLimit] = useState(100);
  const [isStatsGenerating, setIsStatsGenerating] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (drawList.length > 0) return;
    setStatsLoading(true);
    setStatsError(null);
    fetch('/api/lotto/history')
      .then((res) => {
        if (!res.ok) throw new Error('당첨 이력 조회 실패');
        return res.json();
      })
      .then((data: { list: LottoDrawItem[] }) => {
        setDrawList(data.list || []);
      })
      .catch((e) => setStatsError(e.message || '오류 발생'))
      .finally(() => setStatsLoading(false));
  }, [drawList.length]);

  const handleGenerate = () => {
    const isRandom = drawMethodId === 'random';
    if (!isRandom && drawList.length === 0) return;
    setIsGenerating(true);
    setIsStatsGenerating(true);
    setTimeout(() => {
      const n = Math.max(COMBINATIONS_MIN, Math.min(COMBINATIONS_MAX, combinationsCount));
      const all: number[][] = [];
      for (let i = 0; i < n; i++) {
        if (isRandom) {
          const numbers = new Set<number>();
          while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
          }
          all.push(Array.from(numbers).sort((a, b) => a - b));
        } else {
          all.push(generateByStats(drawMethodId, drawNumberCounts, drawOddEvenDist));
        }
      }
      setCurrentCombinations(all);
      setHistory((prev) => [...all, ...prev].slice(0, 30));
      setIsGenerating(false);
      setIsStatsGenerating(false);
    }, 600);
  };

  const saveResultAsImage = async () => {
    if (!resultRef.current || currentCombinations.length === 0) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `lotto-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Image save failed:', e);
    }
  };

  const copyResultAsText = async () => {
    if (currentCombinations.length === 0) return;
    const text = currentCombinations
      .map((set, i) => `${i + 1}번: ${set.join(' ')}`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage('복사되었습니다');
      setTimeout(() => setCopyMessage(null), 2000);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  const getBallColor = (num: number) => {
    if (num <= 10) return 'bg-yellow-400 text-yellow-900 border-yellow-500';
    if (num <= 20) return 'bg-blue-500 text-white border-blue-600';
    if (num <= 30) return 'bg-red-500 text-white border-red-600';
    if (num <= 40) return 'bg-slate-500 text-white border-slate-600';
    return 'bg-green-500 text-white border-green-600';
  };

  const limitedList = useMemo(() => {
    const n = Math.min(statsLimit, drawList.length);
    return drawList.slice(0, n);
  }, [drawList, statsLimit]);

  const numberCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let i = 1; i <= 45; i++) counts[i] = 0;
    limitedList.forEach((d) => d.numbers.forEach((n) => (counts[n] = (counts[n] || 0) + 1)));
    return counts;
  }, [limitedList]);

  const bonusCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let i = 1; i <= 45; i++) counts[i] = 0;
    limitedList.forEach((d) => (counts[d.bonus] = (counts[d.bonus] || 0) + 1));
    return counts;
  }, [limitedList]);

  const hotNumbers = useMemo(() => {
    return Object.entries(numberCounts)
      .map(([num, count]) => ({ num: Number(num), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [numberCounts]);

  const coldNumbers = useMemo(() => {
    return Object.entries(numberCounts)
      .map(([num, count]) => ({ num: Number(num), count }))
      .sort((a, b) => a.count - b.count)
      .slice(0, 10);
  }, [numberCounts]);

  const bonusHot = useMemo(() => {
    return Object.entries(bonusCounts)
      .map(([num, count]) => ({ num: Number(num), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [bonusCounts]);

  const zoneLabels = ['1–10', '11–20', '21–30', '31–40', '41–45'];
  const zoneCounts = useMemo(() => {
    return zoneLabels.map((_, i) => {
      const low = i * 10 + 1;
      const high = (i + 1) * 10;
      let sum = 0;
      for (let n = low; n <= high; n++) sum += numberCounts[n] || 0;
      return sum;
    });
  }, [numberCounts]);

  const oddEvenDist = useMemo(() => {
    const dist: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    limitedList.forEach((d) => {
      const odd = d.numbers.filter((n) => n % 2 === 1).length;
      dist[odd] = (dist[odd] || 0) + 1;
    });
    return dist;
  }, [limitedList]);

  const drawLimitedList = useMemo(() => {
    const n = Math.min(drawStatsLimit, drawList.length);
    return drawList.slice(0, n);
  }, [drawList, drawStatsLimit]);

  const drawNumberCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let i = 1; i <= 45; i++) counts[i] = 0;
    drawLimitedList.forEach((d) => d.numbers.forEach((n) => (counts[n] = (counts[n] || 0) + 1)));
    return counts;
  }, [drawLimitedList]);

  const drawOddEvenDist = useMemo(() => {
    const dist: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    drawLimitedList.forEach((d) => {
      const odd = d.numbers.filter((n) => n % 2 === 1).length;
      dist[odd] = (dist[odd] || 0) + 1;
    });
    return dist;
  }, [drawLimitedList]);

  const consecutiveRatio = useMemo(() => {
    let withConsecutive = 0;
    limitedList.forEach((d) => {
      const sorted = [...d.numbers].sort((a, b) => a - b);
      for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i + 1] - sorted[i] === 1) {
          withConsecutive += 1;
          break;
        }
      }
    });
    return limitedList.length ? (withConsecutive / limitedList.length) * 100 : 0;
  }, [limitedList]);

  const recentDraws = drawList.slice(0, RECENT_DRAWS_SHOW);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-6">
          <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shadow-sm">
              <Clover size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-1 text-slate-900">로또 번호 추출기</h1>
          <p className="text-slate-500 text-sm mb-4">행운의 번호를 확인해보세요.</p>

          {/* Tabs */}
          <div className="flex rounded-full bg-slate-200 p-1 mb-8 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => setTab('draw')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${tab === 'draw' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              번호 추출
            </button>
            <button
              type="button"
              onClick={() => setTab('stats')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${tab === 'stats' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              당첨번호·통계
            </button>
          </div>

          <AnimatePresence mode="wait">
            {tab === 'draw' && (
              <motion.div
                key="draw"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                {/* 생성할 조합 수 선택 */}
                <div className="mb-6 flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-sm text-slate-500">생성할 조합 수:</span>
                  <div className="flex gap-1">
                    {Array.from({ length: COMBINATIONS_MAX - COMBINATIONS_MIN + 1 }, (_, i) => i + 1).map(
                      (num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setCombinationsCount(num)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${combinationsCount === num ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                        >
                          {num}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* 추출 방식 선택 (무작위 + 통계 5가지) */}
                <div className="mb-6 text-left max-w-lg mx-auto">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <BarChart3 size={16} /> 추출 방식
                  </h3>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                    <fieldset className="space-y-2">
                      {DRAW_METHODS.map((m) => (
                        <label
                          key={m.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="drawMethod"
                            value={m.id}
                            checked={drawMethodId === m.id}
                            onChange={() => setDrawMethodId(m.id)}
                            className="w-4 h-4 text-slate-900"
                          />
                          <span className="font-medium text-slate-800">{m.name}</span>
                          <span className="text-xs text-slate-500">{m.description}</span>
                        </label>
                      ))}
                    </fieldset>
                    {drawMethodId !== 'random' && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <span className="text-sm text-slate-500 block mb-2">회차 기준 (통계 데이터)</span>
                        <div className="flex flex-wrap gap-2">
                          {DRAW_STATS_LIMIT_OPTIONS.map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setDrawStatsLimit(n)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${drawStatsLimit === n ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                              최근 {n}회
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {drawMethodId !== 'random' && drawList.length === 0 && (
                      <p className="text-xs text-amber-600 mt-2">당첨 이력을 불러오면 통계 방식으로 추출할 수 있습니다.</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={
                    (drawMethodId !== 'random' && drawList.length === 0) ||
                    isGenerating ||
                    isStatsGenerating
                  }
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <RotateCw
                    className={`w-5 h-5 mr-2 ${isGenerating || isStatsGenerating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}
                  />
                  {isGenerating || isStatsGenerating
                    ? '번호 추출 중...'
                    : drawMethodId !== 'random' && drawList.length === 0
                      ? '당첨 이력 불러오는 중...'
                      : '번호 추출하기'}
                </button>

                {/* 조합 결과 영역 (이미지/복사 대상) */}
                <div
                  ref={resultRef}
                  className="min-h-[120px] mt-8 mb-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center"
                >
                  <AnimatePresence mode="wait">
                    {currentCombinations.length > 0 ? (
                      <div className="space-y-4">
                        {currentCombinations.map((set, rowIdx) => (
                          <motion.div
                            key={rowIdx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: rowIdx * 0.05 }}
                            className="flex justify-center items-center gap-2 sm:gap-3 flex-wrap"
                          >
                            <span className="text-xs font-mono text-slate-400 w-8">{rowIdx + 1}번</span>
                            {set.map((num, idx) => (
                              <span
                                key={idx}
                                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold shadow border-b-2 ${getBallColor(num)}`}
                              >
                                {num}
                              </span>
                            ))}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-300 font-medium text-lg py-8">
                        위에서 추출 방식을 선택한 뒤 번호 추출하기를 눌러주세요
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 이미지 저장 / 텍스트 복사 */}
                {currentCombinations.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                    <button
                      type="button"
                      onClick={saveResultAsImage}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Image size={18} /> 이미지로 저장
                    </button>
                    <button
                      type="button"
                      onClick={copyResultAsText}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Copy size={18} /> {copyMessage ?? '텍스트로 복사'}
                    </button>
                  </div>
                )}

                {history.length > 0 && (
                  <div className="mt-16 text-left max-w-lg mx-auto">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <History size={16} /> 최근 생성 기록
                    </h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2">
                      {history.map((set, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-3 border-b border-slate-50 last:border-0 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-xs font-mono text-slate-400">#{history.length - idx}</span>
                          <div className="flex gap-2">
                            {set.map((n) => (
                              <span
                                key={n}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getBallColor(n)}`}
                              >
                                {n}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-left"
              >
                {statsLoading && (
                  <div className="py-12 text-slate-500 flex items-center justify-center gap-2">
                    <RotateCw className="w-5 h-5 animate-spin" /> 당첨 이력 불러오는 중...
                  </div>
                )}
                {statsError && (
                  <div className="py-8 rounded-xl bg-red-50 text-red-700 text-center">{statsError}</div>
                )}
                {!statsLoading && !statsError && drawList.length > 0 && (
                  <>
                    {/* 기준 회차 선택 */}
                    <div className="mb-6 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-slate-500">통계 기준:</span>
                      {STATS_LIMIT_OPTIONS.map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setStatsLimit(n)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${statsLimit === n ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                        >
                          최근 {n}회
                        </button>
                      ))}
                    </div>

                    {/* 당첨번호 조회 */}
                    <section className="mb-10">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Trophy size={16} /> 최근 당첨번호 ({recentDraws.length}회)
                      </h3>
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-50 max-h-[420px] overflow-y-auto">
                        {recentDraws.map((d) => (
                          <div
                            key={d.ltEpsd}
                            className="p-3 flex flex-wrap items-center gap-2 sm:gap-3"
                          >
                            <span className="text-xs font-mono text-slate-400 w-12">{d.ltEpsd}회</span>
                            <span className="text-xs text-slate-500 w-24">{formatDrawDate(d.ltRflYmd)}</span>
                            <div className="flex gap-1 flex-wrap">
                              {d.numbers.map((n) => (
                                <span
                                  key={n}
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow border ${getBallColor(n)}`}
                                >
                                  {n}
                                </span>
                              ))}
                              <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 border-dashed border-amber-500 bg-amber-50 text-amber-800`}
                                title="보너스"
                              >
                                +{d.bonus}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Hot / Cold */}
                    <section className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
                          <BarChart3 size={16} className="text-amber-500" /> Hot (상위 10개)
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {hotNumbers.map(({ num, count }) => (
                            <div key={num} className="flex items-center gap-1">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getBallColor(num)}`}>
                                {num}
                              </span>
                              <span className="text-xs text-slate-500">({count})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
                          <Snowflake size={16} className="text-sky-500" /> Cold (하위 10개)
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {coldNumbers.map(({ num, count }) => (
                            <div key={num} className="flex items-center gap-1">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getBallColor(num)}`}>
                                {num}
                              </span>
                              <span className="text-xs text-slate-500">({count})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* 번호별 출현 횟수 전체 표 */}
                    <section className="mb-10">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <BarChart3 size={16} /> 번호별 출현 횟수 (1–45)
                      </h3>
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 overflow-x-auto">
                        <div className="grid grid-cols-9 gap-2">
                          {Array.from({ length: 45 }, (_, i) => i + 1).map((n) => (
                            <div key={n} className="flex flex-col items-center">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getBallColor(n)}`}>
                                {n}
                              </span>
                              <span className="text-xs text-slate-500 mt-1">{numberCounts[n] ?? 0}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* 보너스 번호 통계 */}
                    <section className="mb-10">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Gift size={16} /> 보너스 번호 출현 (상위 10)
                      </h3>
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                        <div className="flex flex-wrap gap-2">
                          {bonusHot.map(({ num, count }) => (
                            <div key={num} className="flex items-center gap-1">
                              <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-amber-500 bg-amber-50 text-amber-800">
                                {num}
                              </span>
                              <span className="text-xs text-slate-500">({count})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* 패턴 통계 */}
                    <section className="mb-6">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <PieChart size={16} /> 패턴 통계
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                          <h5 className="text-xs font-medium text-slate-500 mb-2">구간별 출현</h5>
                          <div className="space-y-1">
                            {zoneLabels.map((label, i) => (
                              <div key={label} className="flex justify-between text-sm">
                                <span>{label}</span>
                                <span className="font-mono text-slate-600">{zoneCounts[i]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                          <h5 className="text-xs font-medium text-slate-500 mb-2">홀수 개수 분포</h5>
                          <div className="space-y-1">
                            {[0, 1, 2, 3, 4, 5, 6].map((odd) => (
                              <div key={odd} className="flex justify-between text-sm">
                                <span>홀수 {odd}개</span>
                                <span className="font-mono text-slate-600">{oddEvenDist[odd] ?? 0}회</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                          <h5 className="text-xs font-medium text-slate-500 mb-2">연번 포함</h5>
                          <p className="text-2xl font-bold text-slate-800">{consecutiveRatio.toFixed(1)}%</p>
                          <p className="text-xs text-slate-500 mt-1">연속 번호가 포함된 회차 비율</p>
                        </div>
                      </div>
                    </section>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
