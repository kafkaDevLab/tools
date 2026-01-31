import { NextResponse } from 'next/server';
import type { LottoDrawRaw, LottoHistoryApiResponse } from '@/types/lotto';

const DHLOTTERY_URL =
  'https://www.dhlottery.co.kr/lt645/selectPstLt645Info.do?srchLtEpsd=all';

export async function GET() {
  try {
    const res = await fetch(DHLOTTERY_URL, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch lotto history' },
        { status: 502 }
      );
    }

    const json = (await res.json()) as LottoHistoryApiResponse;
    const list = json?.data?.list;

    if (!Array.isArray(list)) {
      return NextResponse.json(
        { error: 'Invalid lotto history response' },
        { status: 502 }
      );
    }

    const draws = list
      .map((row: LottoDrawRaw) => ({
        ltEpsd: row.ltEpsd,
        ltRflYmd: row.ltRflYmd,
        numbers: [
          row.tm1WnNo,
          row.tm2WnNo,
          row.tm3WnNo,
          row.tm4WnNo,
          row.tm5WnNo,
          row.tm6WnNo,
        ].sort((a, b) => a - b) as [number, number, number, number, number, number],
        bonus: row.bnsWnNo,
      }))
      .sort((a, b) => b.ltEpsd - a.ltEpsd); // 최근 추첨(회차 큰 것) 먼저

    return NextResponse.json({ list: draws });
  } catch (e) {
    console.error('Lotto history API error:', e);
    return NextResponse.json(
      { error: 'Lotto history request failed' },
      { status: 500 }
    );
  }
}
