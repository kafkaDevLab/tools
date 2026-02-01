'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { TrendingUp, Search, Loader2, AlertCircle, Sparkles, LineChart as LineChartIcon, Activity, BarChart2, Eye, EyeOff, BarChart3 } from 'lucide-react';
import { StockChart } from '@/components/stock-analysis/StockChart';
import type { HistoryItem, IndicatorVisibility } from '@/components/stock-analysis/StockChart';

type Quote = {
  symbol: string;
  shortName?: string;
  regularMarketPrice?: number;
  regularMarketPreviousClose?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  currency?: string;
  marketState?: string;
};

export default function StockAnalysisPage() {
  const [symbol, setSymbol] = useState('AAPL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [history, setHistory] = useState<(HistoryItem & { open?: number; high?: number; low?: number })[]>([]);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [indicators, setIndicators] = useState<IndicatorVisibility>({
    candlestick: true,
    sma5: true,
    sma20: true,
    sma60: true,
    volume: true,
    rsi: true,
    macd: true,
  });

  const toggleIndicator = (key: keyof IndicatorVisibility) => {
    setIndicators((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const fetchData = async () => {
    setError(null);
    setQuote(null);
    setHistory([]);
    setAnalysis(null);
    setAnalyzeError(null);
    setLoading(true);
    try {
      const [quoteRes, historyRes] = await Promise.all([
        fetch(`/api/stock/quote?symbol=${encodeURIComponent(symbol)}`),
        fetch(`/api/stock/history?symbol=${encodeURIComponent(symbol)}&range=max`),
      ]);

      if (!quoteRes.ok) {
        const err = await quoteRes.json().catch(() => ({}));
        throw new Error(err.error || '시세 조회 실패');
      }
      if (!historyRes.ok) {
        const err = await historyRes.json().catch(() => ({}));
        throw new Error(err.error || '차트 데이터 조회 실패');
      }

      const quoteData = await quoteRes.json();
      const historyData = await historyRes.json();
      setQuote(quoteData);
      setHistory(historyData.history ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : '조회 실패');
    } finally {
      setLoading(false);
    }
  };

  const runAnalyze = async () => {
    if (!quote || !history.length) return;
    setAnalyzeError(null);
    setAnalysis(null);
    setAnalyzeLoading(true);
    try {
      const rsiArr = history.map((h) => h.rsi14).filter((v): v is number => v != null);
      const macdArr = history
        .map((h) => (h.macd != null ? { MACD: h.macd, histogram: h.macdHistogram ?? undefined } : null))
        .filter((v): v is { MACD: number; histogram: number | undefined } => v != null);
      const res = await fetch('/api/stock/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: quote.symbol,
          quote: {
            regularMarketPrice: quote.regularMarketPrice,
            regularMarketChangePercent: quote.regularMarketChangePercent,
            currency: quote.currency,
          },
          history: history.map((h) => ({ close: h.close })),
          indicators: { rsi14: rsiArr.length ? rsiArr : undefined, macd: macdArr.length ? macdArr : undefined },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAnalyzeError(data.error || 'AI 분석 실패');
        return;
      }
      setAnalysis(data.analysis ?? null);
    } catch (e) {
      setAnalyzeError('AI 분석 요청 중 오류가 발생했습니다.');
    } finally {
      setAnalyzeLoading(false);
    }
  };

  const lastRsi = history.filter((h) => h.rsi14 != null).pop()?.rsi14;
  const lastMacd = history.filter((h) => h.macd != null).pop();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto mb-4 flex justify-center">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <TrendingUp size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold mb-1 text-slate-900">주식 분석</h1>
              <p className="text-slate-500 text-sm">한국·미국 주가 조회, 기술적 지표·차트, AI 참고 해석 (투자 권유 아님)</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium text-slate-700 mb-1">종목 심볼</label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="AAPL, 005930.KS"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={fetchData}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                조회
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">예: 미국 AAPL, MSFT / 한국 005930.KS(삼성전자), 035720.KQ(카카오)</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {quote && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-100 p-4">
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">현재가</p>
                  <p className="text-xl font-bold text-slate-900">
                    {quote.regularMarketPrice != null
                      ? new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 2 }).format(quote.regularMarketPrice)
                      : '-'}{' '}
                    {quote.currency === 'KRW' ? '₩' : quote.currency ?? ''}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-4">
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">전일 대비</p>
                  <p className={`text-xl font-bold ${(quote.regularMarketChangePercent ?? 0) >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                    {quote.regularMarketChangePercent != null ? `${quote.regularMarketChangePercent >= 0 ? '+' : ''}${quote.regularMarketChangePercent.toFixed(2)}%` : '-'}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-4">
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">RSI(14)</p>
                  <p className="text-xl font-bold text-slate-900">{lastRsi != null ? lastRsi.toFixed(1) : '-'}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-4">
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">MACD</p>
                  <p className="text-lg font-bold text-slate-900">{lastMacd?.macd != null ? lastMacd.macd.toFixed(2) : '-'}</p>
                </div>
              </div>

              {history.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h2 className="font-semibold text-slate-800">가격·지표</h2>
                    <div className="flex flex-wrap items-center gap-1" title="지표 켜기/끄기">
                      <button
                        type="button"
                        onClick={() => toggleIndicator('candlestick')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${indicators.candlestick ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        title="캔들"
                      >
                        {indicators.candlestick ? <Eye size={14} /> : <EyeOff size={14} />}
                        캔들
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleIndicator('sma5')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${indicators.sma5 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        title="SMA 5일"
                      >
                        <LineChartIcon size={14} /> SMA5
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleIndicator('sma20')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${indicators.sma20 ? 'bg-violet-100 text-violet-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        title="SMA 20일"
                      >
                        <LineChartIcon size={14} /> SMA20
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleIndicator('sma60')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${indicators.sma60 ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        title="SMA 60일"
                      >
                        <LineChartIcon size={14} /> SMA60
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleIndicator('volume')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${indicators.volume ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        title="거래량"
                      >
                        <BarChart3 size={14} /> 거래량
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleIndicator('rsi')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${indicators.rsi ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        title="RSI(14)"
                      >
                        <Activity size={14} /> RSI
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleIndicator('macd')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${indicators.macd ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        title="MACD"
                      >
                        <BarChart2 size={14} /> MACD
                      </button>
                    </div>
                  </div>
                  <StockChart
                    history={history.map((h) => ({
                      date: h.date,
                      open: h.open ?? h.close,
                      high: h.high ?? h.close,
                      low: h.low ?? h.close,
                      close: h.close,
                      volume: (h as { volume?: number }).volume,
                      sma5: h.sma5,
                      sma20: h.sma20,
                      sma60: h.sma60,
                      rsi14: h.rsi14,
                      macd: h.macd,
                      macdSignal: (h as { macdSignal?: number }).macdSignal,
                      macdHistogram: h.macdHistogram,
                    }))}
                    visibility={indicators}
                    height={440}
                  />
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" /> AI 참고 해석
                </h2>
                <p className="text-xs text-slate-500 mb-3">본 내용은 투자 참고용이며, 투자 권유·추천이 아닙니다.</p>
                <button
                  type="button"
                  onClick={runAnalyze}
                  disabled={analyzeLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-xl font-medium hover:bg-amber-200 disabled:opacity-50"
                >
                  {analyzeLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  AI 분석 보기
                </button>
                {analyzeError && <p className="mt-2 text-sm text-amber-600">{analyzeError}</p>}
                {analysis && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap">
                    {analysis}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="text-center text-xs text-slate-400 py-2">
            시세는 지연될 수 있습니다. 본 페이지는 참고용이며, 투자 권유·추천이 아닙니다.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
