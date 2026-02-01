import { NextRequest, NextResponse } from 'next/server';
import { sma, rsi, macd } from 'technicalindicators';

const CACHE = new Map<string, { data: unknown; ts: number }>();
const CACHE_MS = 5 * 60 * 1000; // 5분

interface YahooChartQuote {
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
}

interface YahooChartResult {
  chart?: {
    result?: Array<{
      meta?: { symbol: string; currency?: string };
      timestamp?: number[];
      indicators?: {
        quote?: YahooChartQuote[];
      };
    }>;
  };
}

const TEN_YEARS_SEC = 10 * 365.25 * 24 * 60 * 60;
const CUTOFF_OLD = 315532800; // 1980-01-01

async function fetchYahooChart(symbol: string, range: string): Promise<YahooChartResult> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=${range}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DailyTools/1.0)' },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error('Chart fetch failed');
  return res.json();
}

/** Chart API로 특정 구간(period1~period2) 일봉 조회 */
async function fetchYahooChartPeriod(
  symbol: string,
  period1: number,
  period2: number
): Promise<YahooChartResult> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&period1=${period1}&period2=${period2}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DailyTools/1.0)' },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error('Chart fetch failed');
  return res.json();
}

/** 상장 이후 일봉 전체: 10년 단위로 나눠 Chart API 호출 후 병합 (range=max는 월봉이라 사용 안 함) */
async function fetchYahooChartMaxChunked(symbol: string): Promise<{
  timestamps: number[];
  opens: number[];
  highs: number[];
  lows: number[];
  closes: number[];
  volumes: number[];
  metaSymbol: string;
  metaCurrency: string | undefined;
}> {
  let metaSymbol = symbol;
  let metaCurrency: string | undefined;
  const allTs: number[] = [];
  const allOpen: number[] = [];
  const allHigh: number[] = [];
  const allLow: number[] = [];
  const allClose: number[] = [];
  const allVol: number[] = [];

  let period2 = Math.floor(Date.now() / 1000);
  let period1 = Math.floor(period2 - TEN_YEARS_SEC);

  while (period1 >= CUTOFF_OLD) {
    const data = await fetchYahooChartPeriod(symbol, period1, period2);
    const result = data.chart?.result?.[0];
    const quote = result?.indicators?.quote?.[0];
    if (!quote) break;
    if (result?.meta) {
      metaSymbol = result.meta.symbol ?? symbol;
      metaCurrency = result.meta.currency;
    }
    const timestamps = result?.timestamp ?? [];
    const closes = (quote.close ?? []).filter((v): v is number => v != null && v > 0);
    const len = Math.min(timestamps.length, closes.length);
    if (len === 0) break;
    const opens = quote.open ?? [];
    const highs = quote.high ?? [];
    const lows = quote.low ?? [];
    const volumes = quote.volume ?? [];
    for (let i = 0; i < len; i++) {
      allTs.push(timestamps[i]);
      allOpen.push(opens[i] ?? closes[i]);
      allHigh.push(highs[i] ?? closes[i]);
      allLow.push(lows[i] ?? closes[i]);
      allClose.push(closes[i]);
      allVol.push(volumes[i] ?? 0);
    }
    period2 = period1;
    period1 = Math.floor(period2 - TEN_YEARS_SEC);
  }

  // 날짜 오름차순 정렬 및 중복 제거 (같은 date는 먼저 나온 것 = 최신 구간 값 유지)
  const byDate = new Map<number, { open: number; high: number; low: number; close: number; volume: number }>();
  for (let i = 0; i < allTs.length; i++) {
    if (!byDate.has(allTs[i])) {
      byDate.set(allTs[i], {
        open: allOpen[i],
        high: allHigh[i],
        low: allLow[i],
        close: allClose[i],
        volume: allVol[i],
      });
    }
  }
  const sortedDates = Array.from(byDate.keys()).sort((a, b) => a - b);
  const timestamps = sortedDates;
  const opens = sortedDates.map((d) => byDate.get(d)!.open);
  const highs = sortedDates.map((d) => byDate.get(d)!.high);
  const lows = sortedDates.map((d) => byDate.get(d)!.low);
  const closes = sortedDates.map((d) => byDate.get(d)!.close);
  const volumes = sortedDates.map((d) => byDate.get(d)!.volume);

  return { timestamps, opens, highs, lows, closes, volumes, metaSymbol, metaCurrency };
}

function computeIndicators(closes: number[]) {
  const sma5 = sma({ period: 5, values: closes });
  const sma20 = sma({ period: 20, values: closes });
  const sma60 = sma({ period: 60, values: closes });
  const rsi14 = rsi({ period: 14, values: closes });
  const macdResult = macd({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });

  return {
    sma5: sma5?.filter((v): v is number => v != null) ?? [],
    sma20: sma20?.filter((v): v is number => v != null) ?? [],
    sma60: sma60?.filter((v): v is number => v != null) ?? [],
    rsi14: rsi14?.filter((v): v is number => v != null) ?? [],
    macd: macdResult?.filter((v): v is { MACD?: number; signal?: number; histogram?: number } => v != null) ?? [],
  };
}

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol')?.trim();
  const range = request.nextUrl.searchParams.get('range') || 'max';

  if (!symbol) {
    return NextResponse.json({ error: 'symbol is required' }, { status: 400 });
  }

  const cacheKey = `history:${symbol}:${range}`;
  const cached = CACHE.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_MS) {
    return NextResponse.json(cached.data);
  }

  try {
    let timestamps: number[];
    let opens: number[];
    let highs: number[];
    let lows: number[];
    let closes: number[];
    let volumes: number[];
    let metaSymbol: string = symbol;
    let metaCurrency: string | undefined;

    if (range === 'max') {
      // 상장 이후 일봉 전체: 10년 단위로 Chart API 호출 후 병합 (range=max는 월봉이라 사용 안 함)
      const chunked = await fetchYahooChartMaxChunked(symbol);
      timestamps = chunked.timestamps;
      opens = chunked.opens;
      highs = chunked.highs;
      lows = chunked.lows;
      closes = chunked.closes;
      volumes = chunked.volumes;
      metaSymbol = chunked.metaSymbol;
      metaCurrency = chunked.metaCurrency;
      if (timestamps.length === 0) {
        return NextResponse.json(
          { error: 'No chart data. Check symbol (e.g. AAPL, 005930.KS).' },
          { status: 502 }
        );
      }
    } else {
      const data = await fetchYahooChart(symbol, range);
      const result = data.chart?.result?.[0];
      if (!result?.indicators?.quote?.[0]) {
        return NextResponse.json(
          { error: 'No chart data. Check symbol (e.g. AAPL, 005930.KS).' },
          { status: 502 }
        );
      }
      const quote = result.indicators.quote[0] as YahooChartQuote;
      metaSymbol = result.meta?.symbol ?? symbol;
      metaCurrency = result.meta?.currency;
      timestamps = result.timestamp ?? [];
      closes = (quote.close ?? []).filter((v): v is number => v != null && v > 0);
      opens = quote.open ?? [];
      highs = quote.high ?? [];
      lows = quote.low ?? [];
      volumes = quote.volume ?? [];
    }

    const len = Math.min(timestamps.length, closes.length);
    const indicators = computeIndicators(closes);

    const history = Array.from({ length: len }, (_, i) => ({
      date: timestamps[i],
      open: opens[i] ?? closes[i],
      high: highs[i] ?? closes[i],
      low: lows[i] ?? closes[i],
      close: closes[i],
      volume: volumes[i] ?? 0,
      sma5: indicators.sma5[i] ?? undefined,
      sma20: indicators.sma20[i] ?? undefined,
      sma60: indicators.sma60[i] ?? undefined,
      rsi14: indicators.rsi14[i] ?? undefined,
      macd: indicators.macd[i]?.MACD ?? undefined,
      macdSignal: indicators.macd[i]?.signal ?? undefined,
      macdHistogram: indicators.macd[i]?.histogram ?? undefined,
    }));

    const out = {
      symbol: metaSymbol,
      currency: metaCurrency,
      history,
      indicators: {
        sma5: indicators.sma5,
        sma20: indicators.sma20,
        sma60: indicators.sma60,
        rsi14: indicators.rsi14,
        macd: indicators.macd,
      },
    };

    CACHE.set(cacheKey, { data: out, ts: Date.now() });
    return NextResponse.json(out);
  } catch (e) {
    console.error('stock history error', e);
    return NextResponse.json(
      { error: 'Failed to fetch history. Check symbol and try again.' },
      { status: 502 }
    );
  }
}
