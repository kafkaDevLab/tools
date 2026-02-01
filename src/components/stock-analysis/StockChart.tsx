'use client';

import React, { useEffect, useRef } from 'react';
import type { UTCTimestamp } from 'lightweight-charts';
import { createChart, CandlestickSeries, LineSeries, HistogramSeries, ColorType } from 'lightweight-charts';

export type HistoryItem = {
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  sma5?: number;
  sma20?: number;
  sma60?: number;
  rsi14?: number;
  macd?: number;
  macdSignal?: number;
  macdHistogram?: number;
};

export type IndicatorVisibility = {
  candlestick: boolean;
  sma5: boolean;
  sma20: boolean;
  sma60: boolean;
  volume: boolean;
  rsi: boolean;
  macd: boolean;
};

interface SeriesApi {
  applyOptions: (options: { visible?: boolean }) => void;
}
type SeriesRefs = {
  candlestick: SeriesApi | null;
  sma5: SeriesApi | null;
  sma20: SeriesApi | null;
  sma60: SeriesApi | null;
  volume: SeriesApi | null;
  rsi: SeriesApi | null;
  macdLine: SeriesApi | null;
  macdHist: SeriesApi | null;
};

const defaultVisibility: IndicatorVisibility = {
  candlestick: true,
  sma5: true,
  sma20: true,
  sma60: true,
  volume: true,
  rsi: true,
  macd: true,
};

type Props = {
  history: HistoryItem[];
  visibility?: Partial<IndicatorVisibility>;
  height?: number;
};

function formatNum(n: number): string {
  return new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 2 }).format(n);
}

export function StockChart({ history, visibility = {}, height = 400 }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRef = useRef<SeriesRefs>({
    candlestick: null,
    sma5: null,
    sma20: null,
    sma60: null,
    volume: null,
    rsi: null,
    macdLine: null,
    macdHist: null,
  });

  const vis = { ...defaultVisibility, ...visibility };

  useEffect(() => {
    if (!containerRef.current || !history.length) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#334155',
        fontFamily: 'inherit',
        panes: {
          separatorColor: '#e2e8f0',
          separatorHoverColor: 'rgba(148, 163, 184, 0.3)',
          enableResize: true,
        },
      },
      grid: { vertLines: { color: '#e2e8f0' }, horzLines: { color: '#e2e8f0' } },
      width: containerRef.current.clientWidth,
      height,
      rightPriceScale: { borderColor: '#e2e8f0', scaleMargins: { top: 0.1, bottom: 0.2 } },
      timeScale: { borderColor: '#e2e8f0', timeVisible: true, secondsVisible: false, barSpacing: 4, minBarSpacing: 2 },
      crosshair: { mode: 1 },
      autoSize: true,
    });

    chartRef.current = chart;

    // 지표용 pane을 먼저 생성해 메인 차트와 겹치지 않고 세로로 쌓이게 함
    chart.addPane();
    chart.addPane();
    chart.addPane();

    const time = (d: number) => d as UTCTimestamp;

    const candleData = history.map((h) => ({
      time: time(h.date),
      open: h.open,
      high: h.high,
      low: h.low,
      close: h.close,
    }));

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#dc2626',
      downColor: '#2563eb',
      borderVisible: false,
      wickUpColor: '#dc2626',
      wickDownColor: '#2563eb',
    });
    candlestickSeries.setData(candleData);
    seriesRef.current.candlestick = candlestickSeries as unknown as SeriesApi;

    // SMA는 왼쪽 스케일에 붙이고 왼쪽 스케일을 숨겨 우측에 수치가 안 보이게 함 (호버 툴팁으로만 표시)
    const sma5Data = history.filter((h) => h.sma5 != null).map((h) => ({ time: time(h.date), value: h.sma5! }));
    const sma5Series = chart.addSeries(LineSeries, { color: '#f59e0b', lineWidth: 2, title: 'SMA5', priceScaleId: 'left' });
    if (sma5Data.length) sma5Series.setData(sma5Data);
    seriesRef.current.sma5 = sma5Series as unknown as SeriesApi;

    const sma20Data = history.filter((h) => h.sma20 != null).map((h) => ({ time: time(h.date), value: h.sma20! }));
    const sma20Series = chart.addSeries(LineSeries, { color: '#8b5cf6', lineWidth: 2, title: 'SMA20', priceScaleId: 'left' });
    if (sma20Data.length) sma20Series.setData(sma20Data);
    seriesRef.current.sma20 = sma20Series as unknown as SeriesApi;

    const sma60Data = history.filter((h) => h.sma60 != null).map((h) => ({ time: time(h.date), value: h.sma60! }));
    const sma60Series = chart.addSeries(LineSeries, { color: '#0ea5e9', lineWidth: 2, title: 'SMA60', priceScaleId: 'left' });
    if (sma60Data.length) sma60Series.setData(sma60Data);
    seriesRef.current.sma60 = sma60Series as unknown as SeriesApi;

    chart.priceScale('left', 0).applyOptions({ visible: false });

    const hasVolume = history.some((h) => h.volume != null && h.volume > 0);
    if (hasVolume) {
      const volumeData = history
        .filter((h) => h.volume != null && h.volume > 0)
        .map((h, i, arr) => {
          const prevClose = i > 0 ? arr[i - 1].close : h.open;
          const isUp = h.close >= prevClose;
          return {
            time: time(h.date),
            value: h.volume!,
            color: isUp ? '#b91c1c' : '#1d4ed8', // 더 진한 색으로 봉 구분 용이
          };
        });
      // visible range 기준 autoscale 사용 → 줌/스크롤 시 보이는 구간 최대값으로 스케일되어 봉이 더 잘 보임
      const volumeSeries = chart.addSeries(HistogramSeries, {
        title: '거래량',
        base: 0,
        autoscaleInfoProvider: (base) => {
          const res = base();
          if (res?.priceRange) {
            res.priceRange.minValue = Math.min(0, res.priceRange.minValue ?? 0);
          }
          return res;
        },
      }, 1);
      if (volumeData.length) volumeSeries.setData(volumeData);
      // 거래량 봉이 세로로 꽉 차 보이도록 상단 여백 최소화
      volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.02, bottom: 0 } });
      seriesRef.current.volume = volumeSeries as unknown as SeriesApi;
    }

    const hasRsi = history.some((h) => h.rsi14 != null);
    if (hasRsi) {
      const rsiData = history.filter((h) => h.rsi14 != null).map((h) => ({ time: time(h.date), value: h.rsi14! }));
      const rsiSeries = chart.addSeries(LineSeries, { color: '#10b981', lineWidth: 2, title: 'RSI(14)' }, 2);
      rsiSeries.setData(rsiData);
      rsiSeries.priceScale().applyOptions({ scaleMargins: { top: 0.1, bottom: 0.1 } });
      seriesRef.current.rsi = rsiSeries as unknown as SeriesApi;
    }

    const hasMacd = history.some((h) => h.macdHistogram != null);
    if (hasMacd) {
      const macdHistData = history
        .filter((h) => h.macdHistogram != null)
        .map((h) => ({
          time: time(h.date),
          value: h.macdHistogram!,
          color: (h.macdHistogram ?? 0) >= 0 ? '#22c55e' : '#ef4444',
        }));
      const macdLineData = history.filter((h) => h.macd != null).map((h) => ({ time: time(h.date), value: h.macd! }));
      const macdHistSeries = chart.addSeries(HistogramSeries, { title: 'MACD Hist' }, 3);
      if (macdHistData.length) macdHistSeries.setData(macdHistData);
      seriesRef.current.macdHist = macdHistSeries as unknown as SeriesApi;
      const macdLineSeries = chart.addSeries(LineSeries, { color: '#6366f1', lineWidth: 1, title: 'MACD' }, 3);
      if (macdLineData.length) macdLineSeries.setData(macdLineData);
      seriesRef.current.macdLine = macdLineSeries as unknown as SeriesApi;
    }

    // pane 높이 재분배: 거래량을 더 크게 (총 height 기준)
    const panes = chart.panes();
    const total = height;
    if (panes.length >= 4) {
      const mainH = Math.round(total * 0.42);
      const volumeH = Math.round(total * 0.30);
      const rsiH = Math.round(total * 0.14);
      const macdH = total - mainH - volumeH - rsiH;
      panes[0].setHeight(mainH);
      panes[1].setHeight(volumeH);
      panes[2].setHeight(rsiH);
      panes[3].setHeight(Math.max(30, macdH));
    } else if (panes.length === 3) {
      panes[0].setHeight(Math.round(total * 0.52));
      panes[1].setHeight(Math.round(total * 0.35));
      panes[2].setHeight(Math.max(30, total - Math.round(total * 0.52) - Math.round(total * 0.35)));
    } else if (panes.length === 2) {
      panes[0].setHeight(Math.round(total * 0.62));
      panes[1].setHeight(Math.max(80, total - Math.round(total * 0.62)));
    }

    chart.timeScale().fitContent();

    const tooltipEl = tooltipRef.current;
    const handler = (param: { time?: UTCTimestamp; point?: { x: number; y: number } }) => {
      if (!tooltipEl || !param.point) {
        if (tooltipEl) tooltipEl.style.display = 'none';
        return;
      }
      const t = param.time;
      const item = t != null ? history.find((h) => h.date === t) : null;
      if (!item) {
        tooltipEl.style.display = 'none';
        return;
      }
      const left = param.point.x + 12;
      const top = param.point.y + 8;
      tooltipEl.style.display = 'block';
      tooltipEl.style.left = `${left}px`;
      tooltipEl.style.top = `${top}px`;
      const dateStr = new Date(item.date * 1000).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
      const ohlcv = [
        `<div class="font-semibold text-slate-700 border-b border-slate-200 pb-1 mb-1">${dateStr}</div>`,
        `<div class="flex justify-between gap-4"><span class="text-slate-500">시초가</span><span>${formatNum(item.open)}</span></div>`,
        `<div class="flex justify-between gap-4"><span class="text-slate-500">종가</span><span class="font-medium">${formatNum(item.close)}</span></div>`,
        `<div class="flex justify-between gap-4"><span class="text-slate-500">최고가</span><span>${formatNum(item.high)}</span></div>`,
        `<div class="flex justify-between gap-4"><span class="text-slate-500">최저가</span><span>${formatNum(item.low)}</span></div>`,
        item.volume != null ? `<div class="flex justify-between gap-4"><span class="text-slate-500">거래량</span><span>${formatNum(item.volume)}</span></div>` : '',
      ].filter(Boolean);
      const smaLines = [
        item.sma5 != null ? `<div class="flex justify-between gap-4"><span class="text-amber-600">SMA5</span><span>${formatNum(item.sma5)}</span></div>` : '',
        item.sma20 != null ? `<div class="flex justify-between gap-4"><span class="text-violet-600">SMA20</span><span>${formatNum(item.sma20)}</span></div>` : '',
        item.sma60 != null ? `<div class="flex justify-between gap-4"><span class="text-sky-600">SMA60</span><span>${formatNum(item.sma60)}</span></div>` : '',
      ].filter(Boolean);
      tooltipEl.innerHTML = [...ohlcv, ...(smaLines.length ? ['<div class="border-t border-slate-200 mt-1 pt-1">', ...smaLines, '</div>'] : [])].join('');
    };
    chart.subscribeCrosshairMove(handler);

    return () => {
      chart.unsubscribeCrosshairMove(handler);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = { candlestick: null, sma5: null, sma20: null, sma60: null, volume: null, rsi: null, macdLine: null, macdHist: null };
    };
  }, [history, height]);

  useEffect(() => {
    const s = seriesRef.current;
    s.candlestick?.applyOptions({ visible: vis.candlestick });
    s.sma5?.applyOptions({ visible: vis.sma5 });
    s.sma20?.applyOptions({ visible: vis.sma20 });
    s.sma60?.applyOptions({ visible: vis.sma60 });
    s.volume?.applyOptions({ visible: vis.volume });
    s.rsi?.applyOptions({ visible: vis.rsi });
    s.macdLine?.applyOptions({ visible: vis.macd });
    s.macdHist?.applyOptions({ visible: vis.macd });
  }, [vis.candlestick, vis.sma5, vis.sma20, vis.sma60, vis.volume, vis.rsi, vis.macd]);

  if (!history.length) return null;
  return (
    <div ref={wrapperRef} className="relative w-full" style={{ height }}>
      <div ref={containerRef} className="w-full h-full" />
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-10 hidden min-w-[180px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg"
        style={{ display: 'none' }}
      />
    </div>
  );
}
