import { NextRequest, NextResponse } from 'next/server';

const CACHE = new Map<string, { data: unknown; ts: number }>();
const CACHE_MS = 60 * 1000; // 1분

interface YahooChartMeta {
  symbol?: string;
  currency?: string;
  regularMarketPrice?: number;
  chartPreviousClose?: number;
  previousClose?: number;
}

interface YahooChartResult {
  chart?: {
    result?: Array<{
      meta?: YahooChartMeta;
      timestamp?: number[];
      indicators?: { quote?: Array<{ close?: number[] }> };
    }>;
  };
}

async function fetchYahooChart(symbol: string, range: string): Promise<YahooChartResult> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=${range}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DailyTools/1.0)' },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Chart fetch failed');
  return res.json();
}

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol')?.trim().toUpperCase();
  if (!symbol) {
    return NextResponse.json({ error: 'symbol is required' }, { status: 400 });
  }

  const cacheKey = `quote:${symbol}`;
  const cached = CACHE.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_MS) {
    return NextResponse.json(cached.data);
  }

  try {
    const data = await fetchYahooChart(symbol, '5d');
    const result = data.chart?.result?.[0];
    if (!result?.meta) {
      return NextResponse.json(
        { error: 'Failed to fetch quote. Check symbol (e.g. AAPL, 005930.KS).' },
        { status: 502 }
      );
    }

    const meta = result.meta as YahooChartMeta;
    const closes = result.indicators?.quote?.[0]?.close ?? [];
    const currentPrice = meta.regularMarketPrice ?? (closes.length ? closes[closes.length - 1] : undefined);
    const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? (closes.length >= 2 ? closes[closes.length - 2] : undefined);

    const change = currentPrice != null && previousClose != null ? currentPrice - previousClose : undefined;
    const changePercent = change != null && previousClose ? (change / previousClose) * 100 : undefined;

    const quoteResult = {
      symbol: meta.symbol ?? symbol,
      shortName: meta.symbol ?? symbol,
      regularMarketPrice: currentPrice,
      regularMarketPreviousClose: previousClose,
      regularMarketChange: change,
      regularMarketChangePercent: changePercent,
      regularMarketVolume: undefined,
      currency: meta.currency,
      marketState: 'REGULAR',
    };

    CACHE.set(cacheKey, { data: quoteResult, ts: Date.now() });
    return NextResponse.json(quoteResult);
  } catch (e) {
    console.error('stock quote error', e);
    return NextResponse.json(
      { error: 'Failed to fetch quote. Check symbol (e.g. AAPL, 005930.KS).' },
      { status: 502 }
    );
  }
}
