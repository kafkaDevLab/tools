import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(request: NextRequest) {
  if (!openai) {
    return NextResponse.json(
      { error: 'AI 분석을 사용하려면 OPENAI_API_KEY 환경 변수가 필요합니다.' },
      { status: 503 }
    );
  }

  let body: {
    symbol?: string;
    quote?: { regularMarketPrice?: number; regularMarketChangePercent?: number; currency?: string };
    history?: { close: number }[];
    indicators?: { rsi14?: number[]; macd?: { MACD?: number; histogram?: number }[] };
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { symbol, quote, history, indicators } = body;
  if (!symbol) {
    return NextResponse.json({ error: 'symbol is required' }, { status: 400 });
  }

  const lastClose = history?.length ? history[history.length - 1]?.close : quote?.regularMarketPrice;
  const lastRsi = indicators?.rsi14?.length ? indicators.rsi14[indicators.rsi14.length - 1] : undefined;
  const lastMacd = indicators?.macd?.length ? indicators.macd[indicators.macd.length - 1] : undefined;
  const recentCloses = history?.slice(-30).map((c) => c.close).join(', ') ?? '';

  const systemPrompt = `당신은 투자 참고용으로만 정보를 제공하는 도우미입니다. 
절대 "매수 추천", "매도 추천", "투자 권유" 등의 표현을 하지 마세요. 
항상 "참고용 의견", "과거 패턴 해석" 수준으로만 답하고, 
반드시 문장 끝에 "본 내용은 투자 참고용이며, 투자 권유·추천이 아닙니다."를 한 번 포함하세요.`;

  const userPrompt = `다음 주가·지표를 참고용으로만 해석해주세요. 패턴을 짧게 설명하고, 참고용 의견을 1~2문장으로 제시해주세요. 한국어로 답하세요.

종목: ${symbol}
현재가(또는 최근 종가): ${lastClose ?? '없음'} ${quote?.currency ?? ''}
전일 대비: ${quote?.regularMarketChangePercent != null ? quote.regularMarketChangePercent.toFixed(2) + '%' : '없음'}
최근 30일 종가: ${recentCloses || '없음'}
RSI(14): ${lastRsi != null ? lastRsi.toFixed(2) : '없음'}
MACD: ${lastMacd?.MACD != null ? lastMacd.MACD.toFixed(4) : '없음'}, 히스토그램: ${lastMacd?.histogram != null ? lastMacd.histogram.toFixed(4) : '없음'}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 500,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) {
      return NextResponse.json({ error: 'AI 응답이 비어 있습니다.' }, { status: 502 });
    }
    return NextResponse.json({ analysis: text });
  } catch (e) {
    console.error('stock analyze error', e);
    return NextResponse.json(
      { error: 'AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 502 }
    );
  }
}
